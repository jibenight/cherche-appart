"use client";

import { useEffect } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { DynamicMap } from "@/components/map/DynamicMap";
import { FilterBar } from "@/components/filters/FilterBar";
import { AdvancedFilters } from "@/components/filters/AdvancedFilters";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { ShareSearchButton } from "@/components/filters/ShareSearchButton";
import { ResultsList } from "@/components/results/ResultsList";
import { SplitView } from "@/components/layout/SplitView";
import { Navigation } from "@/components/layout/Navigation";
import { useSearchStore } from "@/store/searchStore";
import { useResultsStore } from "@/store/resultsStore";
import { useMapSync } from "@/hooks/useMapSync";

export default function Home() {
  const hydrate = useSearchStore((s) => s.hydrate);
  const location = useSearchStore((s) => s.location);
  const properties = useResultsStore((s) => s.properties);
  const total = useResultsStore((s) => s.total);
  const sortBy = useResultsStore((s) => s.sortBy);
  const setSortBy = useResultsStore((s) => s.setSortBy);
  const isLoading = useResultsStore((s) => s.isLoading);
  const { hoveredPropertyId, handlePropertyHover, handlePropertyClick } =
    useMapSync();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <main className="flex min-h-screen flex-col">
      <Navigation />

      {/* Search + Filters Panel */}
      <div className="z-10 w-full bg-gray-50 shadow-sm">
        <div className="mx-auto max-w-7xl p-4">
          <SearchBar />
          {/* Desktop filters */}
          <div className="mt-3 hidden lg:block">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <FilterBar />
              </div>
              {location && <ShareSearchButton />}
            </div>
            <div className="mt-2">
              <AdvancedFilters />
            </div>
          </div>
          {/* Mobile filter button */}
          <div className="mt-3 lg:hidden">
            <FilterPanel />
          </div>
        </div>
      </div>

      {/* Map + Results */}
      <SplitView
        mapView={<DynamicMap />}
        listView={
          location ? (
            <ResultsList
              properties={properties}
              total={total}
              highlightedId={hoveredPropertyId}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onPropertyHover={handlePropertyHover}
              onPropertyClick={handlePropertyClick}
              isLoading={isLoading}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <svg
                className="h-16 w-16 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h2 className="mt-4 text-lg font-semibold text-gray-800">
                Recherchez un bien
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Sélectionnez une ville et un rayon de recherche pour voir les
                résultats.
              </p>
            </div>
          )
        }
      />
    </main>
  );
}
