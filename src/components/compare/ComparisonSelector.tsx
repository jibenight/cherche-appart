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
    <div className="sticky bottom-0 border-t bg-white px-4 py-3 shadow-lg">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {selectedCount} bien{selectedCount > 1 ? "s" : ""} sélectionné
          {selectedCount > 1 ? "s" : ""}
        </p>
        <div className="flex gap-2">
          <button
            onClick={onClear}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={onCompare}
            disabled={!canCompare}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Comparer
          </button>
        </div>
      </div>
    </div>
  );
}
