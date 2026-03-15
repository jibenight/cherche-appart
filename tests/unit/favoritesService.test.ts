import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  loadFavorites,
  addFavorite,
  removeFavorite,
  isFavorited,
  toggleFavorite,
} from "@/services/favoritesService";
import type { PropertyCard } from "@/types/property";

const mockProperty: PropertyCard = {
  id: "prop-1",
  transactionType: "buy",
  type: "apartment",
  title: "Appartement 3 pièces Lyon 3e",
  price: 250000,
  surface: 65,
  rooms: 3,
  bedrooms: 2,
  dpe: "C",
  city: "Lyon",
  postcode: "69003",
  lat: 45.76,
  lng: 4.85,
  images: [],
  pricePerM2: 3846,
  publishedAt: "2026-03-15T10:00:00Z",
};

const mockProperty2: PropertyCard = {
  ...mockProperty,
  id: "prop-2",
  title: "Maison 5 pièces Villeurbanne",
  price: 450000,
};

beforeEach(() => {
  window.localStorage.clear();
});

describe("favoritesService", () => {
  it("returns empty array when no favorites saved", () => {
    expect(loadFavorites()).toEqual([]);
  });

  it("adds a favorite", () => {
    const result = addFavorite(mockProperty);
    expect(result).toHaveLength(1);
    expect(result[0].propertyId).toBe("prop-1");
    expect(result[0].property.title).toBe("Appartement 3 pièces Lyon 3e");
  });

  it("does not add duplicate favorites", () => {
    addFavorite(mockProperty);
    const result = addFavorite(mockProperty);
    expect(result).toHaveLength(1);
  });

  it("removes a favorite", () => {
    addFavorite(mockProperty);
    addFavorite(mockProperty2);
    const result = removeFavorite("prop-1");
    expect(result).toHaveLength(1);
    expect(result[0].propertyId).toBe("prop-2");
  });

  it("checks if property is favorited", () => {
    addFavorite(mockProperty);
    expect(isFavorited("prop-1")).toBe(true);
    expect(isFavorited("prop-999")).toBe(false);
  });

  it("toggles favorite on/off", () => {
    const { favorites: added, isFavorited: isNowFav } = toggleFavorite(mockProperty);
    expect(added).toHaveLength(1);
    expect(isNowFav).toBe(true);

    const { favorites: removed, isFavorited: isStillFav } = toggleFavorite(mockProperty);
    expect(removed).toHaveLength(0);
    expect(isStillFav).toBe(false);
  });

  it("persists favorites to localStorage", () => {
    addFavorite(mockProperty);
    // Simulate reload by reading directly from localStorage
    const raw = window.localStorage.getItem("cherche-appart:favorites");
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].propertyId).toBe("prop-1");
  });
});
