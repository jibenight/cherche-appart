"use client";

import { useFilterStore } from "@/store/filterStore";

const ROOM_OPTIONS = [1, 2, 3, 4, 5] as const;

export function RoomsFilter() {
  const { filters, setMinRooms } = useFilterStore();

  return (
    <div className="flex gap-1">
      {ROOM_OPTIONS.map((num) => {
        const isActive = filters.minRooms === num;
        return (
          <button
            key={num}
            type="button"
            onClick={() => setMinRooms(isActive ? null : num)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            aria-pressed={isActive}
            aria-label={`${num}${num === 5 ? " ou plus" : ""} pièce${num > 1 ? "s" : ""} minimum`}
          >
            {num}{num === 5 ? "+" : ""}
          </button>
        );
      })}
    </div>
  );
}
