"use client";

import { useMapStore } from "@/store/mapStore";

/** Toggle for "search as I move the map" */
export function SearchAsIMove() {
  const searchAsIMove = useMapStore((s) => s.searchAsIMove);
  const toggleSearchAsIMove = useMapStore((s) => s.toggleSearchAsIMove);

  return (
    <div className="leaflet-bottom leaflet-left">
      <div className="leaflet-control rounded-xl bg-white/95 px-3.5 py-2.5 shadow-md backdrop-blur-sm">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={searchAsIMove}
            onChange={toggleSearchAsIMove}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          Rechercher en déplaçant la carte
        </label>
      </div>
    </div>
  );
}
