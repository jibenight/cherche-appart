"use client";

import { useFilterStore } from "@/store/filterStore";
import type { PropertyType } from "@/types/location";

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "apartment", label: "Appartement" },
  { value: "house", label: "Maison" },
  { value: "studio", label: "Studio" },
  { value: "loft", label: "Loft" },
  { value: "land", label: "Terrain" },
  { value: "commercial", label: "Commercial" },
];

export function PropertyTypeFilter() {
  const { filters, togglePropertyType } = useFilterStore();

  return (
    <div className="flex flex-wrap gap-1.5">
      {PROPERTY_TYPES.map(({ value, label }) => {
        const isActive = filters.propertyTypes.includes(value);
        return (
          <button
            key={value}
            type="button"
            onClick={() => togglePropertyType(value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              isActive
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
            aria-pressed={isActive}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
