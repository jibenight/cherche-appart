"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ComparisonTable } from "@/components/compare/ComparisonTable";
import { useFavoritesStore } from "@/store/favoritesStore";
import { Navigation } from "@/components/layout/Navigation";

function CompareContent() {
  const searchParams = useSearchParams();
  const favoritesStore = useFavoritesStore();
  const ids = searchParams.get("ids")?.split(",") ?? [];

  useEffect(() => {
    favoritesStore.hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const properties = favoritesStore.favorites
    .filter((f) => ids.includes(f.propertyId))
    .map((f) => f.property);

  if (properties.length < 2) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Sélectionnez au moins 2 biens à comparer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-6 text-xl font-bold text-gray-900">
        Comparaison ({properties.length} biens)
      </h1>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <ComparisonTable properties={properties} />
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
          </div>
        }
      >
        <CompareContent />
      </Suspense>
    </main>
  );
}
