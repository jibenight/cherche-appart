"use client";

import type { Favorite } from "@/types/favorites";
import { PropertyCardComponent } from "@/components/results/PropertyCardComponent";
import { FavoriteButton } from "./FavoriteButton";

interface FavoritesListProps {
  favorites: Favorite[];
  onRemove: (propertyId: string) => void;
  onPropertyClick?: (id: string) => void;
  selectable?: boolean;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
}

/** Grid of favorited property cards */
export function FavoritesList({
  favorites,
  onRemove,
  onPropertyClick,
  selectable,
  selectedIds = [],
  onToggleSelect,
}: FavoritesListProps) {
  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <svg className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <p className="mt-4 text-sm font-medium text-gray-700">
          Aucun favori enregistré
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Ajoutez des biens en favoris pour les retrouver ici.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {favorites.map((fav) => (
        <div key={fav.propertyId} className="relative">
          {selectable && onToggleSelect && (
            <div className="absolute left-2 top-2 z-10">
              <input
                type="checkbox"
                checked={selectedIds.includes(fav.propertyId)}
                onChange={() => onToggleSelect(fav.propertyId)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                aria-label={`Sélectionner ${fav.property.title} pour comparer`}
              />
            </div>
          )}
          <div className="absolute right-2 top-2 z-10">
            <FavoriteButton
              isFavorited={true}
              onClick={() => onRemove(fav.propertyId)}
              size="sm"
            />
          </div>
          <PropertyCardComponent
            property={fav.property}
            onClick={onPropertyClick ? () => onPropertyClick(fav.propertyId) : undefined}
          />
        </div>
      ))}
    </div>
  );
}
