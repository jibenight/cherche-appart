"use client";

import { useState, useEffect, useCallback } from "react";
import type { Favorite } from "@/types/favorites";
import type { PropertyCard } from "@/types/property";
import {
  loadFavorites,
  addFavorite,
  removeFavorite,
  isFavorited as checkIsFavorited,
} from "@/services/favoritesService";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  const add = useCallback((property: PropertyCard) => {
    const updated = addFavorite(property);
    setFavorites(updated);
  }, []);

  const remove = useCallback((propertyId: string) => {
    const updated = removeFavorite(propertyId);
    setFavorites(updated);
  }, []);

  const toggle = useCallback(
    (property: PropertyCard) => {
      if (checkIsFavorited(property.id)) {
        remove(property.id);
      } else {
        add(property);
      }
    },
    [add, remove],
  );

  const isFavorited = useCallback(
    (propertyId: string) => favorites.some((f) => f.propertyId === propertyId),
    [favorites],
  );

  return {
    favorites,
    count: favorites.length,
    add,
    remove,
    toggle,
    isFavorited,
  };
}
