"use client";

interface FavoritesCounterProps {
  count: number;
}

/** Badge in nav showing favorites count */
export function FavoritesCounter({ count }: FavoritesCounterProps) {
  if (count === 0) return null;

  return (
    <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}
