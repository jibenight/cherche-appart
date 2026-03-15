"use client";

interface FavoriteButtonProps {
  isFavorited: boolean;
  onClick: () => void;
  size?: "sm" | "md";
}

/** Heart toggle button for favoriting properties */
export function FavoriteButton({
  isFavorited,
  onClick,
  size = "md",
}: FavoriteButtonProps) {
  const sizeClasses = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const padding = size === "sm" ? "p-1.5" : "p-2";

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`rounded-full transition-colors ${padding} ${
        isFavorited
          ? "bg-red-50 text-red-500 hover:bg-red-100"
          : "bg-white/80 text-gray-400 hover:bg-gray-100 hover:text-red-400"
      }`}
      aria-label={isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <svg
        className={sizeClasses}
        fill={isFavorited ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
