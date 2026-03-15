"use client";

/** Loading skeleton for a property card */
export function PropertyCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200/60 shadow-card">
      {/* Image placeholder */}
      <div className="aspect-[16/10] bg-slate-100" />

      {/* Content */}
      <div className="p-4">
        <div className="h-4 w-3/4 rounded-md bg-slate-100" />
        <div className="mt-2.5 h-5 w-1/2 rounded-md bg-slate-100" />
        <div className="mt-3 flex gap-3">
          <div className="h-3 w-14 rounded-md bg-slate-100" />
          <div className="h-3 w-14 rounded-md bg-slate-100" />
          <div className="h-3 w-10 rounded-md bg-slate-100" />
        </div>
        <div className="mt-3 h-3 w-2/5 rounded-md bg-slate-100" />
      </div>
    </div>
  );
}
