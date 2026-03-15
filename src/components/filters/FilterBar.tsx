"use client";

import { useFilterStore } from "@/store/filterStore";
import { PropertyTypeFilter } from "./PropertyTypeFilter";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { SurfaceRangeFilter } from "./SurfaceRangeFilter";
import { RoomsFilter } from "./RoomsFilter";

export function FilterBar() {
  const { activeCount, resetFilters, filters, setTransactionType } = useFilterStore();

  return (
    <div className="flex w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-md">
      {/* Transaction type toggle */}
      <div className="flex items-center gap-4">
        <div className="flex rounded-lg bg-gray-100 p-0.5">
          <button
            type="button"
            onClick={() => setTransactionType("buy")}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              filters.transactionType === "buy"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Acheter
          </button>
          <button
            type="button"
            onClick={() => setTransactionType("rent")}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              filters.transactionType === "rent"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Louer
          </button>
        </div>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-sm text-red-500 hover:text-red-600"
          >
            Réinitialiser ({activeCount})
          </button>
        )}
      </div>

      {/* Filter sections */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Property Type */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500 uppercase tracking-wide">
            Type de bien
          </label>
          <PropertyTypeFilter />
        </div>

        {/* Price Range */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500 uppercase tracking-wide">
            Budget
          </label>
          <PriceRangeFilter />
        </div>

        {/* Surface Range */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500 uppercase tracking-wide">
            Surface
          </label>
          <SurfaceRangeFilter />
        </div>

        {/* Rooms */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500 uppercase tracking-wide">
            Pièces (min.)
          </label>
          <RoomsFilter />
        </div>
      </div>
    </div>
  );
}
