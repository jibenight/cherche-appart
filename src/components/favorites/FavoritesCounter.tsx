"use client";

interface FavoritesCounterProps {
  count: number;
}

/** Badge in nav showing favorites count */
export function FavoritesCounter({ count }: FavoritesCounterProps) {
  if (count === 0) return null;

  return (
    <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent-500 px-1.5 text-[11px] font-bold text-white shadow-sm">
      {count > 99 ? "99+" : count}
    </span>
  );
}
