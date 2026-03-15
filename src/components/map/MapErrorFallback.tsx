"use client";

interface MapErrorFallbackProps {
  onRetry?: () => void;
}

/** Fallback displayed when map tiles fail to load */
export function MapErrorFallback({ onRetry }: MapErrorFallbackProps) {
  return (
    <div className="flex h-full min-h-[300px] w-full items-center justify-center rounded-lg bg-gray-50 border border-gray-200">
      <div className="flex flex-col items-center gap-3 text-center px-4">
        <svg
          className="h-12 w-12 text-gray-400"
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
        <p className="text-sm font-medium text-gray-700">
          Impossible de charger la carte
        </p>
        <p className="text-xs text-gray-500">
          Le serveur de tuiles est indisponible. Les résultats sont disponibles en mode liste.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            Réessayer
          </button>
        )}
      </div>
    </div>
  );
}
