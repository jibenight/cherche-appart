"use client";

import { useMapStore } from "@/store/mapStore";

/** Toggle for "search as I move the map" */
export function SearchAsIMove() {
  const searchAsIMove = useMapStore((s) => s.searchAsIMove);
  const toggleSearchAsIMove = useMapStore((s) => s.toggleSearchAsIMove);

  return (
    <div className="leaflet-bottom leaflet-left">
      <div className="leaflet-control rounded-lg bg-white px-3 py-2 shadow-md">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={searchAsIMove}
            onChange={toggleSearchAsIMove}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Rechercher en déplaçant la carte
        </label>
      </div>
    </div>
  );
}
