"use client";

interface MapErrorFallbackProps {
  onRetry?: () => void;
}

/** Fallback displayed when map tiles fail to load */
export function MapErrorFallback({ onRetry }: MapErrorFallbackProps) {
  return (
    <div className="flex h-full min-h-[300px] w-full items-center justify-center bg-slate-50 border border-slate-200/60">
      <div className="flex flex-col items-center gap-3 text-center px-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
          <svg
            className="h-7 w-7 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-700">
          Impossible de charger la carte
        </p>
        <p className="text-xs text-slate-400">
          Le serveur de tuiles est indisponible. Les résultats sont disponibles en mode liste.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 rounded-xl border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Réessayer
          </button>
        )}
      </div>
    </div>
  );
}
