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
    <div className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3.5">
      <h2 className="text-sm font-semibold text-slate-800">
        <span className="text-brand-600">{total.toLocaleString("fr-FR")}</span>{" "}
        bien{total !== 1 ? "s" : ""} trouvé{total !== 1 ? "s" : ""}
      </h2>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-xs font-medium text-slate-600 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
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
