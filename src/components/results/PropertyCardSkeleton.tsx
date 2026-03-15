"use client";

/** Loading skeleton for a property card */
export function PropertyCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg border border-gray-200">
      {/* Image placeholder */}
      <div className="aspect-[4/3] bg-gray-200" />

      {/* Content */}
      <div className="p-3">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="mt-2 h-5 w-1/2 rounded bg-gray-200" />
        <div className="mt-2 flex gap-2">
          <div className="h-3 w-12 rounded bg-gray-200" />
          <div className="h-3 w-12 rounded bg-gray-200" />
          <div className="h-3 w-12 rounded bg-gray-200" />
        </div>
        <div className="mt-2 h-3 w-1/3 rounded bg-gray-200" />
      </div>
    </div>
  );
}
