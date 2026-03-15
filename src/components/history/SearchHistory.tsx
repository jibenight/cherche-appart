"use client";

import type { SearchHistoryEntry } from "@/types/alerts";
import { HistoryEntry } from "./HistoryEntry";

interface SearchHistoryProps {
  entries: SearchHistoryEntry[];
  onRerun: (entry: SearchHistoryEntry) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

/** List of recent searches */
export function SearchHistoryComponent({
  entries,
  onRerun,
  onRemove,
  onClear,
}: SearchHistoryProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <svg className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="mt-4 text-sm font-medium text-gray-700">
          Aucun historique
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Vos recherches récentes apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800">
          Recherches récentes
        </h2>
        <button
          onClick={onClear}
          className="text-xs text-red-500 hover:text-red-600"
        >
          Tout effacer
        </button>
      </div>
      <div className="space-y-2">
        {entries.map((entry) => (
          <HistoryEntry
            key={entry.id}
            entry={entry}
            onRerun={onRerun}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}
