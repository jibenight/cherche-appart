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
      <div className="flex items-center justify-center py-20 animate-fade-in">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl gradient-subtle">
            <svg className="h-8 w-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-600">
            Sélectionnez au moins 2 biens à comparer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Comparaison
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          {properties.length} biens sélectionnés
        </p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-card">
        <ComparisonTable properties={properties} />
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navigation />
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-slate-200 border-t-brand-500" />
          </div>
        }
      >
        <CompareContent />
      </Suspense>
    </main>
  );
}
