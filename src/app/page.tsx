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
import { usePropertySearch } from "@/hooks/usePropertySearch";

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

  usePropertySearch();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <Navigation />

      {/* Search + Filters Panel */}
      <div className="z-10 w-full gradient-subtle">
        <div className="mx-auto max-w-7xl p-4 sm:p-6">
          <SearchBar />
          {/* Desktop filters */}
          <div className="mt-4 hidden lg:block">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <FilterBar />
              </div>
              {location && <ShareSearchButton />}
            </div>
            <div className="mt-3">
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
            <div className="flex flex-col items-center justify-center p-10 text-center animate-fade-in">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl gradient-subtle">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h2 className="mt-5 text-base font-semibold text-slate-800">
                Recherchez un bien
              </h2>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-400">
                Sélectionnez une ville et un rayon de recherche pour voir les
                résultats sur la carte.
              </p>
            </div>
          )
        }
      />
    </main>
  );
}
