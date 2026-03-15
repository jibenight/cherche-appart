"use client";

import type { SortOption } from "@/types/property";

interface SortBarProps {
  total: number;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "date_desc", label: "Plus récent" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "surface_desc", label: "Surface décroissante" },
  { value: "price_per_m2_asc", label: "Prix/m² croissant" },
];

/** Sort dropdown with result count */
export function SortBar({ total, sortBy, onSortChange }: SortBarProps) {
  return (
    <div className="flex items-center justify-between border-b bg-white px-4 py-3">
      <h2 className="text-sm font-semibold text-gray-800">
        {total.toLocaleString("fr-FR")} bien{total !== 1 ? "s" : ""} trouvé
        {total !== 1 ? "s" : ""}
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
  );
}
