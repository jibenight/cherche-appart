"use client";

interface ComparisonSelectorProps {
  selectedCount: number;
  canCompare: boolean;
  onCompare: () => void;
  onClear: () => void;
}

/** Selection controls for property comparison */
export function ComparisonSelector({
  selectedCount,
  canCompare,
  onCompare,
  onClear,
}: ComparisonSelectorProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky bottom-0 border-t border-slate-200/60 glass px-5 py-4 shadow-elevated animate-slide-up">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">
          <span className="text-brand-600 font-semibold">{selectedCount}</span> bien{selectedCount > 1 ? "s" : ""} sélectionné
          {selectedCount > 1 ? "s" : ""}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClear}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Annuler
          </button>
          <button
            onClick={onCompare}
            disabled={!canCompare}
            className="rounded-xl gradient-brand px-5 py-2 text-sm font-semibold text-white shadow-md hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Comparer
          </button>
        </div>
      </div>
    </div>
  );
}
