"use client";

interface EmptyStateProps {
  hasFilters?: boolean;
  onResetFilters?: () => void;
}

/** No results message with filter suggestions */
export function EmptyState({ hasFilters, onResetFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center py-16 text-center animate-fade-in">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl gradient-subtle">
        <svg
          className="h-10 w-10 text-brand-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <p className="mt-5 text-sm font-semibold text-slate-700">
        Aucun bien trouvé
      </p>
      <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-slate-400">
        {hasFilters
          ? "Essayez d'élargir vos critères de recherche ou de réduire le nombre de filtres."
          : "Sélectionnez une ville et un rayon de recherche pour voir les résultats."}
      </p>
      {hasFilters && onResetFilters && (
        <button
          onClick={onResetFilters}
          className="mt-5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-card hover:border-slate-300 hover:shadow-sm"
        >
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}
