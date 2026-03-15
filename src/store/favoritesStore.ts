import { create } from "zustand";
import type { Favorite } from "@/types/favorites";
import type { PropertyCard } from "@/types/property";
import {
  loadFavorites,
  addFavorite,
  removeFavorite,
  isFavorited as checkFavorited,
} from "@/services/favoritesService";

interface FavoritesState {
  favorites: Favorite[];
  count: number;
  isHydrated: boolean;
}

interface FavoritesActions {
  hydrate: () => void;
  add: (property: PropertyCard) => void;
  remove: (propertyId: string) => void;
  toggle: (property: PropertyCard) => void;
  isFavorited: (propertyId: string) => boolean;
}

export type FavoritesStore = FavoritesState & FavoritesActions;

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: [],
  count: 0,
  isHydrated: false,

  hydrate: () => {
    const favorites = loadFavorites();
    set({ favorites, count: favorites.length, isHydrated: true });
  },

  add: (property) => {
    addFavorite(property);
    const favorites = loadFavorites();
    set({ favorites, count: favorites.length });
  },

  remove: (propertyId) => {
    removeFavorite(propertyId);
    const favorites = loadFavorites();
    set({ favorites, count: favorites.length });
  },

  toggle: (property) => {
    if (checkFavorited(property.id)) {
      get().remove(property.id);
    } else {
      get().add(property);
    }
  },

  isFavorited: (propertyId) => checkFavorited(propertyId),
}));
