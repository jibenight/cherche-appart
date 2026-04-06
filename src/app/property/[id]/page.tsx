"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navigation } from "@/components/layout/Navigation";
import { PropertyDetail } from "@/components/property/PropertyDetail";
import { getProperty } from "@/services/propertyApi";
import { useFavoritesStore } from "@/store/favoritesStore";
import type { Property } from "@/types/property";

export default function PropertyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isFavorited = useFavoritesStore((s) => s.isFavorited)(id);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProperty(id);
        setProperty(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="flex items-center justify-center py-24 animate-fade-in">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        </div>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="flex items-center justify-center py-24 animate-fade-in">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl gradient-subtle">
              <svg
                className="h-10 w-10 text-brand-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h1 className="mt-5 text-lg font-bold text-slate-900">
              Bien non trouvé
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Ce bien n&apos;est plus disponible ou l&apos;identifiant est
              invalide.
            </p>
            <button
              onClick={() => router.back()}
              className="mt-5 rounded-xl gradient-brand px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-95"
            >
              Retour à la recherche
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navigation />
      <PropertyDetail
        property={property}
        onBack={() => router.back()}
        isFavorited={isFavorited}
        onToggleFavorite={() =>
          toggleFavorite({
            id: property.id,
            transactionType: property.transactionType,
            type: property.type,
            title: property.title,
            price: property.price,
            surface: property.surface,
            rooms: property.rooms,
            bedrooms: property.bedrooms,
            dpe: property.dpe,
            city: property.city,
            postcode: property.postcode,
            lat: property.lat,
            lng: property.lng,
            images: property.images,
            pricePerM2: property.pricePerM2,
            publishedAt: property.publishedAt,
          })
        }
      />
    </main>
  );
}
