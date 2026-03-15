"use client";

import { useFilterStore } from "@/store/filterStore";
import { PropertyTypeFilter } from "./PropertyTypeFilter";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { SurfaceRangeFilter } from "./SurfaceRangeFilter";
import { RoomsFilter } from "./RoomsFilter";

export function FilterBar() {
  const { activeCount, resetFilters, filters, setTransactionType } = useFilterStore();

  return (
    <div className="w-full rounded-2xl border border-slate-200/60 bg-white p-5 shadow-card">
      {/* Transaction type toggle */}
      <div className="flex items-center gap-4">
        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setTransactionType("buy")}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
              filters.transactionType === "buy"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Acheter
          </button>
          <button
            type="button"
            onClick={() => setTransactionType("rent")}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
              filters.transactionType === "rent"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Louer
          </button>
        </div>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-rose-500 hover:bg-rose-50"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Réinitialiser ({activeCount})
          </button>
        )}
      </div>

      {/* Filter sections */}
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Property Type */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Type de bien
          </label>
          <PropertyTypeFilter />
        </div>

        {/* Price Range */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Budget
          </label>
          <PriceRangeFilter />
        </div>

        {/* Surface Range */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Surface
          </label>
          <SurfaceRangeFilter />
        </div>

        {/* Rooms */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Pièces (min.)
          </label>
          <RoomsFilter />
        </div>
      </div>
    </div>
  );
}
