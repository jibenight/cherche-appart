"use client";

import type { PropertyCard } from "@/types/property";
import type { SortOption } from "@/types/property";
import { PropertyCardComponent } from "./PropertyCardComponent";

interface ResultsListProps {
  properties: PropertyCard[];
  total: number;
  highlightedId: string | null;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onPropertyHover: (id: string | null) => void;
  onPropertyClick: (id: string) => void;
  isLoading?: boolean;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "surface_desc", label: "Surface décroissante" },
  { value: "price_per_m2_asc", label: "Prix/m² croissant" },
  { value: "date_desc", label: "Plus récent" },
];

export function ResultsList({
  properties,
  total,
  highlightedId,
  sortBy,
  onSortChange,
  onPropertyHover,
  onPropertyClick,
  isLoading,
}: ResultsListProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header: count + sort */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-800">
          {total} résultat{total !== 1 ? "s" : ""}
        </h2>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="rounded-lg border border-gray-300 px-2 py-1 text-xs text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
          aria-label="Trier les résultats"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Results grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
          </div>
        ) : properties.length === 0 ? (
          <div className="py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">Aucun bien trouvé</p>
            <p className="text-xs text-gray-400">
              Essayez d&apos;élargir vos critères de recherche
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1">
            {properties.map((property) => (
              <PropertyCardComponent
                key={property.id}
                property={property}
                isHighlighted={property.id === highlightedId}
                onHover={onPropertyHover}
                onClick={onPropertyClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
