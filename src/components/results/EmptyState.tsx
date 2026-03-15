"use client";

interface EmptyStateProps {
  hasFilters?: boolean;
  onResetFilters?: () => void;
}

/** No results message with filter suggestions */
export function EmptyState({ hasFilters, onResetFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <svg
        className="h-16 w-16 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
      <p className="mt-4 text-sm font-medium text-gray-700">
        Aucun bien trouvé
      </p>
      <p className="mt-1 max-w-xs text-xs text-gray-500">
        {hasFilters
          ? "Essayez d'élargir vos critères de recherche ou de réduire le nombre de filtres."
          : "Sélectionnez une ville et un rayon de recherche pour voir les résultats."}
      </p>
      {hasFilters && onResetFilters && (
        <button
          onClick={onResetFilters}
          className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}
