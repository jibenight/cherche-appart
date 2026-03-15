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
    <div className="border-t border-slate-100 pt-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between rounded-lg px-1 py-1 text-sm font-medium text-slate-600 hover:text-slate-900"
        aria-expanded={isExpanded}
      >
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filtres avancés
        </span>
        <svg
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 animate-slide-up">
          {/* Bedrooms */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
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
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-800 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              placeholder="Min"
              aria-label="Nombre minimum de chambres"
            />
          </div>

          {/* Floor range */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
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
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-800 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              placeholder="Min"
              aria-label="Étage minimum"
            />
          </div>

          {/* Condition */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              État
            </label>
            <select
              value={filters.condition}
              onChange={(e) =>
                setCondition(e.target.value as typeof filters.condition)
              }
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-800 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
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
              icon={
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
              isActive={filters.hasParking === true}
              onClick={() =>
                setHasParking(filters.hasParking === true ? null : true)
              }
            />
            <ToggleChip
              label="Ascenseur"
              icon={
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7l4-4m0 0l4 4m-4-4v18" />
                </svg>
              }
              isActive={filters.hasElevator === true}
              onClick={() =>
                setHasElevator(filters.hasElevator === true ? null : true)
              }
            />
            <ToggleChip
              label="Balcon / Terrasse"
              icon={
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              }
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
  icon,
  isActive,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
        isActive
          ? "border-brand-300 bg-brand-50 text-brand-700 shadow-sm"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
