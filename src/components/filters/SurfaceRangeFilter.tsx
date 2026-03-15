"use client";

import { useCallback } from "react";
import { useFilterStore } from "@/store/filterStore";

function parseSurface(value: string): number | null {
  const num = parseInt(value.replace(/[^\d]/g, ""), 10);
  return isNaN(num) ? null : num;
}

export function SurfaceRangeFilter() {
  const { filters, setSurfaceRange } = useFilterStore();

  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSurfaceRange({ ...filters.surfaceRange, min: parseSurface(e.target.value) });
    },
    [filters.surfaceRange, setSurfaceRange],
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSurfaceRange({ ...filters.surfaceRange, max: parseSurface(e.target.value) });
    },
    [filters.surfaceRange, setSurfaceRange],
  );

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          inputMode="numeric"
          value={filters.surfaceRange.min ?? ""}
          onChange={handleMinChange}
          placeholder="Min"
          className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 pr-8 text-sm text-slate-800 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          aria-label="Surface minimum en mètres carrés"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
          m²
        </span>
      </div>
      <span className="text-slate-300">—</span>
      <div className="relative flex-1">
        <input
          type="text"
          inputMode="numeric"
          value={filters.surfaceRange.max ?? ""}
          onChange={handleMaxChange}
          placeholder="Max"
          className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 pr-8 text-sm text-slate-800 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          aria-label="Surface maximum en mètres carrés"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
          m²
        </span>
      </div>
    </div>
  );
}
