"use client";

import type { SearchHistoryEntry } from "@/types/alerts";

interface HistoryEntryProps {
  entry: SearchHistoryEntry;
  onRerun: (entry: SearchHistoryEntry) => void;
  onRemove: (id: string) => void;
}

/** Single search history item */
export function HistoryEntry({ entry, onRerun, onRemove }: HistoryEntryProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
      <button
        onClick={() => onRerun(entry)}
        className="flex-1 text-left"
      >
        <h3 className="text-sm font-semibold text-gray-900">
          {entry.location.name} ({entry.location.postcode})
        </h3>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
          <span>Rayon : {entry.radiusKm} km</span>
          <span>•</span>
          <span>{entry.resultCount} résultat{entry.resultCount > 1 ? "s" : ""}</span>
        </div>
        <p className="mt-0.5 text-xs text-gray-400">
          {new Date(entry.searchedAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </button>

      <button
        onClick={() => onRemove(entry.id)}
        className="ml-3 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        aria-label="Supprimer de l'historique"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
