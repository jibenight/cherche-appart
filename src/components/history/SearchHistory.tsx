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
      <div className="flex flex-col items-center py-20 text-center animate-fade-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl gradient-subtle">
          <svg className="h-10 w-10 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="mt-5 text-sm font-semibold text-slate-700">
          Aucun historique
        </p>
        <p className="mt-1.5 text-xs text-slate-400">
          Vos recherches récentes apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">
          Recherches récentes
        </h2>
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-rose-500 hover:bg-rose-50"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Tout effacer
        </button>
      </div>
      <div className="space-y-3">
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
