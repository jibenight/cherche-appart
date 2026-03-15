"use client";

import { useCallback } from "react";
import { useFilterStore } from "@/store/filterStore";

/** Format number with thousand separators */
function formatPrice(value: number | null): string {
  if (value === null) return "";
  return value.toLocaleString("fr-FR");
}

/** Parse a price string to number */
function parsePrice(value: string): number | null {
  const cleaned = value.replace(/\s/g, "").replace(/[^\d]/g, "");
  if (!cleaned) return null;
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? null : num;
}

export function PriceRangeFilter() {
  const { filters, setPriceRange } = useFilterStore();

  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPriceRange({ ...filters.priceRange, min: parsePrice(e.target.value) });
    },
    [filters.priceRange, setPriceRange],
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPriceRange({ ...filters.priceRange, max: parsePrice(e.target.value) });
    },
    [filters.priceRange, setPriceRange],
  );

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          inputMode="numeric"
          value={formatPrice(filters.priceRange.min)}
          onChange={handleMinChange}
          placeholder="Prix min"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          aria-label="Prix minimum en euros"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
          €
        </span>
      </div>
      <span className="text-gray-400">—</span>
      <div className="relative flex-1">
        <input
          type="text"
          inputMode="numeric"
          value={formatPrice(filters.priceRange.max)}
          onChange={handleMaxChange}
          placeholder="Prix max"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          aria-label="Prix maximum en euros"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
          €
        </span>
      </div>
    </div>
  );
}
