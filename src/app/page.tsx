"use client";

import { useEffect } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { DynamicMap } from "@/components/map/DynamicMap";
import { useSearchStore } from "@/store/searchStore";

export default function Home() {
  const hydrate = useSearchStore((s) => s.hydrate);

  // Hydrate store from localStorage on mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <main className="flex min-h-screen flex-col">
      {/* Search Panel */}
      <div className="z-10 w-full bg-gray-50 p-4 shadow-sm">
        <div className="mx-auto max-w-7xl">
          <SearchBar />
        </div>
      </div>

      {/* Map + Results Area */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Map */}
        <div className="h-[50vh] w-full lg:h-auto lg:flex-1">
          <DynamicMap />
        </div>

        {/* Results placeholder */}
        <div className="w-full border-t bg-white p-4 lg:w-96 lg:border-l lg:border-t-0 lg:overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-800">Résultats</h2>
          <p className="mt-2 text-sm text-gray-500">
            Sélectionnez une ville et un rayon de recherche pour voir les résultats.
          </p>
        </div>
      </div>
    </main>
  );
}
