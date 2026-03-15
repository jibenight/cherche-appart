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
    <div className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white p-4 shadow-card transition-all hover:shadow-sm">
      <button
        onClick={() => onRerun(entry)}
        className="flex flex-1 items-start gap-3 text-left"
      >
        <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50">
          <svg className="h-4 w-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800 hover:text-brand-700">
            {entry.location.name} ({entry.location.postcode})
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-medium">{entry.radiusKm} km</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>{entry.resultCount} résultat{entry.resultCount > 1 ? "s" : ""}</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {new Date(entry.searchedAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </button>

      <button
        onClick={() => onRemove(entry.id)}
        className="ml-3 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        aria-label="Supprimer de l'historique"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
