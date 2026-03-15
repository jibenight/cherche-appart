import type { Favorite } from "@/types/favorites";
import type { PropertyCard } from "@/types/property";

const FAVORITES_KEY = "cherche-appart:favorites";
const MAX_FAVORITES = 100;

/** Load all favorites from localStorage */
export function loadFavorites(): Favorite[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Favorite[];
  } catch {
    return [];
  }
}

/** Save favorites to localStorage */
function saveFavorites(favorites: Favorite[]): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.warn("Failed to save favorites:", error);
  }
}

/** Add a property to favorites */
export function addFavorite(property: PropertyCard): Favorite[] {
  const favorites = loadFavorites();
  if (favorites.some((f) => f.propertyId === property.id)) return favorites;
  if (favorites.length >= MAX_FAVORITES) {
    console.warn(`Maximum favorites (${MAX_FAVORITES}) reached`);
    return favorites;
  }

  const updated = [
    {
      propertyId: property.id,
      savedAt: new Date().toISOString(),
      notes: null,
      property,
    },
    ...favorites,
  ];
  saveFavorites(updated);
  return updated;
}

/** Remove a property from favorites */
export function removeFavorite(propertyId: string): Favorite[] {
  const favorites = loadFavorites();
  const updated = favorites.filter((f) => f.propertyId !== propertyId);
  saveFavorites(updated);
  return updated;
}

/** Check if a property is favorited */
export function isFavorited(propertyId: string): boolean {
  return loadFavorites().some((f) => f.propertyId === propertyId);
}

/** Toggle a property's favorite status */
export function toggleFavorite(property: PropertyCard): {
  favorites: Favorite[];
  isFavorited: boolean;
} {
  if (isFavorited(property.id)) {
    return { favorites: removeFavorite(property.id), isFavorited: false };
  }
  return { favorites: addFavorite(property), isFavorited: true };
}
