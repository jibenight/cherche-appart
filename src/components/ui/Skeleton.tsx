interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
      aria-hidden="true"
    />
  );
}

export function SearchBarSkeleton() {
  return (
    <div className="flex w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-md sm:p-6">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-11 w-full" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="flex h-full min-h-[300px] w-full items-center justify-center rounded-lg bg-gray-100">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
        <span className="text-sm text-gray-500">Chargement de la carte...</span>
      </div>
    </div>
  );
}
