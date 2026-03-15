import {
  loadFavorites,
  addFavorite,
  removeFavorite,
  isFavorited,
  toggleFavorite,
} from "@/services/favoritesService";
import type { PropertyCard } from "@/types/property";

const FAVORITES_KEY = "cherche-appart:favorites";

/** Create a mock PropertyCard with all required fields */
function createMockProperty(overrides: Partial<PropertyCard> = {}): PropertyCard {
  return {
    id: overrides.id ?? `prop-${Math.random().toString(36).slice(2, 9)}`,
    transactionType: "buy",
    type: "apartment",
    title: "Bel appartement lumineux",
    price: 250000,
    surface: 65,
    rooms: 3,
    bedrooms: 2,
    dpe: "C",
    city: "Lyon",
    postcode: "69003",
    lat: 45.758,
    lng: 4.849,
    images: ["https://example.com/photo1.jpg"],
    pricePerM2: 3846,
    publishedAt: "2025-12-01T10:00:00Z",
    ...overrides,
  };
}

describe("favoritesService", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("loadFavorites", () => {
    it("should return an empty array when no favorites exist", () => {
      const result = loadFavorites();
      expect(result).toEqual([]);
    });

    it("should return an empty array when localStorage contains invalid JSON", () => {
      localStorage.setItem(FAVORITES_KEY, "not-valid-json{{{");
      const result = loadFavorites();
      expect(result).toEqual([]);
    });

    it("should load saved favorites from localStorage", () => {
      const property = createMockProperty({ id: "prop-1" });
      addFavorite(property);
      const result = loadFavorites();
      expect(result).toHaveLength(1);
      expect(result[0].propertyId).toBe("prop-1");
      expect(result[0].property).toEqual(property);
    });
  });

  describe("addFavorite", () => {
    it("should add a property to favorites", () => {
      const property = createMockProperty({ id: "prop-100" });
      const result = addFavorite(property);

      expect(result).toHaveLength(1);
      expect(result[0].propertyId).toBe("prop-100");
      expect(result[0].property).toEqual(property);
      expect(result[0].savedAt).toBeDefined();
      expect(result[0].notes).toBeNull();
    });

    it("should prepend new favorites to the list", () => {
      const prop1 = createMockProperty({ id: "prop-1" });
      const prop2 = createMockProperty({ id: "prop-2" });

      addFavorite(prop1);
      const result = addFavorite(prop2);

      expect(result).toHaveLength(2);
      expect(result[0].propertyId).toBe("prop-2");
      expect(result[1].propertyId).toBe("prop-1");
    });

    it("should not add a duplicate property", () => {
      const property = createMockProperty({ id: "prop-dup" });

      addFavorite(property);
      const result = addFavorite(property);

      expect(result).toHaveLength(1);
    });

    it("should persist favorites to localStorage", () => {
      const property = createMockProperty({ id: "prop-persist" });
      addFavorite(property);

      const raw = localStorage.getItem(FAVORITES_KEY);
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].propertyId).toBe("prop-persist");
    });

    it("should not exceed MAX_FAVORITES (100)", () => {
      // Add 100 properties
      for (let i = 0; i < 100; i++) {
        addFavorite(createMockProperty({ id: `prop-${i}` }));
      }

      const beforeAdd = loadFavorites();
      expect(beforeAdd).toHaveLength(100);

      // Attempt to add one more
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const result = addFavorite(createMockProperty({ id: "prop-overflow" }));

      expect(result).toHaveLength(100);
      expect(result.some((f) => f.propertyId === "prop-overflow")).toBe(false);
      expect(warnSpy).toHaveBeenCalledWith("Maximum favorites (100) reached");

      warnSpy.mockRestore();
    });
  });

  describe("removeFavorite", () => {
    it("should remove a favorite by property id", () => {
      const prop1 = createMockProperty({ id: "prop-1" });
      const prop2 = createMockProperty({ id: "prop-2" });

      addFavorite(prop1);
      addFavorite(prop2);

      const result = removeFavorite("prop-1");
      expect(result).toHaveLength(1);
      expect(result[0].propertyId).toBe("prop-2");
    });

    it("should return the same list if the property id is not found", () => {
      const prop = createMockProperty({ id: "prop-1" });
      addFavorite(prop);

      const result = removeFavorite("nonexistent-id");
      expect(result).toHaveLength(1);
      expect(result[0].propertyId).toBe("prop-1");
    });

    it("should update localStorage after removal", () => {
      const prop = createMockProperty({ id: "prop-remove" });
      addFavorite(prop);
      removeFavorite("prop-remove");

      const raw = localStorage.getItem(FAVORITES_KEY);
      const parsed = JSON.parse(raw!);
      expect(parsed).toHaveLength(0);
    });
  });

  describe("isFavorited", () => {
    it("should return true for a favorited property", () => {
      const prop = createMockProperty({ id: "prop-fav" });
      addFavorite(prop);

      expect(isFavorited("prop-fav")).toBe(true);
    });

    it("should return false for a non-favorited property", () => {
      expect(isFavorited("prop-unknown")).toBe(false);
    });

    it("should return false after a property is removed", () => {
      const prop = createMockProperty({ id: "prop-removed" });
      addFavorite(prop);
      removeFavorite("prop-removed");

      expect(isFavorited("prop-removed")).toBe(false);
    });
  });

  describe("toggleFavorite", () => {
    it("should add a property when it is not favorited", () => {
      const prop = createMockProperty({ id: "prop-toggle" });

      const result = toggleFavorite(prop);

      expect(result.isFavorited).toBe(true);
      expect(result.favorites).toHaveLength(1);
      expect(result.favorites[0].propertyId).toBe("prop-toggle");
    });

    it("should remove a property when it is already favorited", () => {
      const prop = createMockProperty({ id: "prop-toggle" });
      addFavorite(prop);

      const result = toggleFavorite(prop);

      expect(result.isFavorited).toBe(false);
      expect(result.favorites).toHaveLength(0);
    });

    it("should toggle back and forth correctly", () => {
      const prop = createMockProperty({ id: "prop-toggle-multi" });

      // First toggle: add
      const result1 = toggleFavorite(prop);
      expect(result1.isFavorited).toBe(true);
      expect(result1.favorites).toHaveLength(1);

      // Second toggle: remove
      const result2 = toggleFavorite(prop);
      expect(result2.isFavorited).toBe(false);
      expect(result2.favorites).toHaveLength(0);

      // Third toggle: add again
      const result3 = toggleFavorite(prop);
      expect(result3.isFavorited).toBe(true);
      expect(result3.favorites).toHaveLength(1);
    });
  });
});
