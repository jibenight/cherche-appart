"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FavoritesList } from "@/components/favorites/FavoritesList";
import { ComparisonSelector } from "@/components/compare/ComparisonSelector";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useComparison } from "@/hooks/useComparison";
import { Navigation } from "@/components/layout/Navigation";

export default function FavoritesPage() {
  const router = useRouter();
  const favoritesStore = useFavoritesStore();
  const comparison = useComparison();
  const [isCompareMode, setIsCompareMode] = useState(false);

  useEffect(() => {
    favoritesStore.hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Mes favoris</h1>
            <p className="mt-1 text-sm text-gray-500">
              {favoritesStore.count} bien{favoritesStore.count > 1 ? "s" : ""}{" "}
              sauvegardé{favoritesStore.count > 1 ? "s" : ""}
            </p>
          </div>
          {favoritesStore.count >= 2 && (
            <button
              onClick={() => {
                setIsCompareMode(!isCompareMode);
                comparison.clear();
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                isCompareMode
                  ? "bg-gray-200 text-gray-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isCompareMode ? "Annuler" : "Comparer"}
            </button>
          )}
        </div>

        <FavoritesList
          favorites={favoritesStore.favorites}
          onRemove={(id) => favoritesStore.remove(id)}
          onPropertyClick={(id) => router.push(`/property/${id}`)}
          selectable={isCompareMode}
          selectedIds={comparison.selectedIds}
          onToggleSelect={comparison.toggle}
        />

        {isCompareMode && (
          <ComparisonSelector
            selectedCount={comparison.selectedIds.length}
            canCompare={comparison.canCompare}
            onCompare={() => {
              const ids = comparison.selectedIds.join(",");
              router.push(`/compare?ids=${ids}`);
            }}
            onClear={comparison.clear}
          />
        )}
      </div>
    </main>
  );
}
