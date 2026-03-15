interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-100 ${className}`}
      aria-hidden="true"
    />
  );
}

export function SearchBarSkeleton() {
  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-card sm:p-6">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="flex h-full min-h-[300px] w-full items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-slate-200 border-t-brand-500" />
        <span className="text-sm text-slate-400">Chargement de la carte...</span>
      </div>
    </div>
  );
}
