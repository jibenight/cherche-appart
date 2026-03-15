"use client";

import { useState } from "react";
import { useFilterStore } from "@/store/filterStore";

export function AdvancedFilters() {
  const [isExpanded, setIsExpanded] = useState(false);
  const filters = useFilterStore((s) => s.filters);
  const setMinBedrooms = useFilterStore((s) => s.setMinBedrooms);
  const setFloorRange = useFilterStore((s) => s.setFloorRange);
  const setHasParking = useFilterStore((s) => s.setHasParking);
  const setHasElevator = useFilterStore((s) => s.setHasElevator);
  const setHasBalcony = useFilterStore((s) => s.setHasBalcony);
  const setCondition = useFilterStore((s) => s.setCondition);

  return (
    <div className="border-t border-gray-200 pt-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900"
        aria-expanded={isExpanded}
      >
        <span>Filtres avancés</span>
        <svg
          className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {/* Bedrooms */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Chambres min.
            </label>
            <input
              type="number"
              min={0}
              max={10}
              value={filters.minBedrooms ?? ""}
              onChange={(e) =>
                setMinBedrooms(e.target.value ? Number(e.target.value) : null)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
              placeholder="Min"
              aria-label="Nombre minimum de chambres"
            />
          </div>

          {/* Floor range */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Étage min.
            </label>
            <input
              type="number"
              min={0}
              value={filters.floorRange.min ?? ""}
              onChange={(e) =>
                setFloorRange({
                  ...filters.floorRange,
                  min: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
              placeholder="Min"
              aria-label="Étage minimum"
            />
          </div>

          {/* Condition */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              État
            </label>
            <select
              value={filters.condition}
              onChange={(e) =>
                setCondition(e.target.value as typeof filters.condition)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
              aria-label="État du bien"
            >
              <option value="any">Tous</option>
              <option value="new">Neuf</option>
              <option value="good">Bon état</option>
              <option value="to_renovate">À rénover</option>
            </select>
          </div>

          {/* Toggle filters */}
          <div className="col-span-full flex flex-wrap gap-2">
            <ToggleChip
              label="Parking"
              isActive={filters.hasParking === true}
              onClick={() =>
                setHasParking(filters.hasParking === true ? null : true)
              }
            />
            <ToggleChip
              label="Ascenseur"
              isActive={filters.hasElevator === true}
              onClick={() =>
                setHasElevator(filters.hasElevator === true ? null : true)
              }
            />
            <ToggleChip
              label="Balcon/Terrasse"
              isActive={filters.hasBalcony === true}
              onClick={() =>
                setHasBalcony(filters.hasBalcony === true ? null : true)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleChip({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        isActive
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}
