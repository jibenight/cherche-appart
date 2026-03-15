"use client";

/** Loading skeleton displayed while map tiles load */
export function MapSkeleton() {
  return (
    <div className="flex h-full min-h-[300px] w-full items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 animate-ping rounded-full bg-brand-200 opacity-50" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
            <svg
              className="h-7 w-7 text-brand-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </div>
        </div>
        <span className="text-sm text-slate-400">
          Chargement de la carte...
        </span>
      </div>
    </div>
  );
}
