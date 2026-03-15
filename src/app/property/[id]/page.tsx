"use client";

import { useRouter } from "next/navigation";
import { Navigation } from "@/components/layout/Navigation";

// TODO: Replace with real data fetching when API is ready
// PropertyDetail component is ready to use once data source exists

export default function PropertyPage() {
  const router = useRouter();

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
