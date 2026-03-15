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
    <div className="flex flex-wrap gap-2">
      {PROPERTY_TYPES.map(({ value, label }) => {
        const isActive = filters.propertyTypes.includes(value);
        return (
          <button
            key={value}
            type="button"
            onClick={() => togglePropertyType(value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
