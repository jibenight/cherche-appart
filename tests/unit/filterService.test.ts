import { describe, it, expect, beforeEach } from "vitest";
import {
  applyFilters,
  saveFilters,
  loadFilters,
  filtersToSearchParams,
  searchParamsToFilters,
} from "@/services/filterService";
import { DEFAULT_FILTERS } from "@/types/filters";
import type { FilterSet } from "@/types/filters";
import type { PropertyCard } from "@/types/property";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const baseProperty: PropertyCard = {
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

const mockProperties: PropertyCard[] = [
  { ...baseProperty },
  {
    ...baseProperty,
    id: "prop-2",
    type: "house",
    title: "Maison 5 pièces Villeurbanne",
    price: 450000,
    surface: 120,
    rooms: 5,
    bedrooms: 4,
    dpe: "B",
  },
  {
    ...baseProperty,
    id: "prop-3",
    type: "studio",
    title: "Studio meublé Lyon 7e",
    price: 120000,
    surface: 25,
    rooms: 1,
    bedrooms: 0,
    dpe: "E",
  },
  {
    ...baseProperty,
    id: "prop-4",
    transactionType: "rent",
    type: "apartment",
    title: "Location appartement Lyon 6e",
    price: 900,
    surface: 55,
    rooms: 2,
    bedrooms: 1,
    dpe: "D",
  },
  {
    ...baseProperty,
    id: "prop-5",
    type: "loft",
    title: "Loft industriel Lyon 1er",
    price: 380000,
    surface: 95,
    rooms: 4,
    bedrooms: 2,
    dpe: "F",
  },
  {
    ...baseProperty,
    id: "prop-6",
    type: "apartment",
    title: "Grand appartement Caluire",
    price: 520000,
    surface: 110,
    rooms: 5,
    bedrooms: 3,
    dpe: "A",
  },
];

// Helper: create a FilterSet from defaults with overrides
function makeFilters(overrides: Partial<FilterSet> = {}): FilterSet {
  return { ...DEFAULT_FILTERS, ...overrides };
}

// ---------------------------------------------------------------------------
// applyFilters
// ---------------------------------------------------------------------------

describe("applyFilters", () => {
  it("returns all buy properties when using default (empty) filters", () => {
    const result = applyFilters(mockProperties, DEFAULT_FILTERS);
    // Default transactionType is "buy", so the rent property (prop-4) is excluded
    const buyProperties = mockProperties.filter(
      (p) => p.transactionType === "buy",
    );
    expect(result).toHaveLength(buyProperties.length);
    expect(result.map((p) => p.id).sort()).toEqual(
      buyProperties.map((p) => p.id).sort(),
    );
  });

  it("filters by transactionType rent", () => {
    const filters = makeFilters({ transactionType: "rent" });
    const result = applyFilters(mockProperties, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("prop-4");
  });

  describe("price range", () => {
    it("filters by min price only", () => {
      const filters = makeFilters({
        priceRange: { min: 300000, max: null },
      });
      const result = applyFilters(mockProperties, filters);
      // buy properties with price >= 300000: prop-2 (450000), prop-5 (380000), prop-6 (520000)
      expect(result).toHaveLength(3);
      expect(result.every((p) => p.price >= 300000)).toBe(true);
    });

    it("filters by max price only", () => {
      const filters = makeFilters({
        priceRange: { min: null, max: 200000 },
      });
      const result = applyFilters(mockProperties, filters);
      // buy properties with price <= 200000: prop-3 (120000)
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("prop-3");
    });

    it("filters by min and max price", () => {
      const filters = makeFilters({
        priceRange: { min: 200000, max: 400000 },
      });
      const result = applyFilters(mockProperties, filters);
      // buy properties in [200000, 400000]: prop-1 (250000), prop-5 (380000)
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id).sort()).toEqual(["prop-1", "prop-5"]);
    });
  });

  describe("surface range", () => {
    it("filters by min surface", () => {
      const filters = makeFilters({
        surfaceRange: { min: 90, max: null },
      });
      const result = applyFilters(mockProperties, filters);
      // buy properties with surface >= 90: prop-2 (120), prop-5 (95), prop-6 (110)
      expect(result).toHaveLength(3);
      expect(result.every((p) => p.surface >= 90)).toBe(true);
    });

    it("filters by max surface", () => {
      const filters = makeFilters({
        surfaceRange: { min: null, max: 50 },
      });
      const result = applyFilters(mockProperties, filters);
      // buy properties with surface <= 50: prop-3 (25)
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("prop-3");
    });

    it("filters by min and max surface", () => {
      const filters = makeFilters({
        surfaceRange: { min: 50, max: 100 },
      });
      const result = applyFilters(mockProperties, filters);
      // buy properties with surface in [50, 100]: prop-1 (65), prop-5 (95)
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id).sort()).toEqual(["prop-1", "prop-5"]);
    });
  });

  describe("rooms", () => {
    it("filters by minimum rooms", () => {
      const filters = makeFilters({ minRooms: 4 });
      const result = applyFilters(mockProperties, filters);
      // buy properties with rooms >= 4: prop-2 (5), prop-5 (4), prop-6 (5)
      expect(result).toHaveLength(3);
      expect(result.every((p) => p.rooms >= 4)).toBe(true);
    });

    it("returns nothing when minRooms exceeds all properties", () => {
      const filters = makeFilters({ minRooms: 10 });
      const result = applyFilters(mockProperties, filters);
      expect(result).toHaveLength(0);
    });
  });

  describe("bedrooms", () => {
    it("filters by minimum bedrooms", () => {
      const filters = makeFilters({ minBedrooms: 3 });
      const result = applyFilters(mockProperties, filters);
      // buy properties with bedrooms >= 3: prop-2 (4), prop-6 (3)
      expect(result).toHaveLength(2);
      expect(result.every((p) => p.bedrooms >= 3)).toBe(true);
    });
  });

  describe("property type", () => {
    it("filters by single property type", () => {
      const filters = makeFilters({ propertyTypes: ["apartment"] });
      const result = applyFilters(mockProperties, filters);
      // buy apartments: prop-1, prop-6
      expect(result).toHaveLength(2);
      expect(result.every((p) => p.type === "apartment")).toBe(true);
    });

    it("filters by multiple property types", () => {
      const filters = makeFilters({
        propertyTypes: ["apartment", "house"],
      });
      const result = applyFilters(mockProperties, filters);
      // buy apartments + houses: prop-1, prop-2, prop-6
      expect(result).toHaveLength(3);
      expect(
        result.every((p) => p.type === "apartment" || p.type === "house"),
      ).toBe(true);
    });

    it("returns all buy properties when propertyTypes is empty", () => {
      const filters = makeFilters({ propertyTypes: [] });
      const result = applyFilters(mockProperties, filters);
      const buyCount = mockProperties.filter(
        (p) => p.transactionType === "buy",
      ).length;
      expect(result).toHaveLength(buyCount);
    });
  });

  describe("DPE filter", () => {
    it("filters by minDPE A (only A passes)", () => {
      const filters = makeFilters({ minDPE: "A" });
      const result = applyFilters(mockProperties, filters);
      // buy properties with dpe A: prop-6
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("prop-6");
    });

    it("filters by minDPE C (A, B, C pass)", () => {
      const filters = makeFilters({ minDPE: "C" });
      const result = applyFilters(mockProperties, filters);
      // buy properties with dpe A/B/C: prop-1 (C), prop-2 (B), prop-6 (A)
      expect(result).toHaveLength(3);
      expect(result.map((p) => p.id).sort()).toEqual([
        "prop-1",
        "prop-2",
        "prop-6",
      ]);
    });

    it("excludes properties with unknown dpe when minDPE is set", () => {
      const propertiesWithUnknown: PropertyCard[] = [
        ...mockProperties,
        {
          ...baseProperty,
          id: "prop-unknown",
          dpe: "unknown",
        },
      ];
      const filters = makeFilters({ minDPE: "G" });
      const result = applyFilters(propertiesWithUnknown, filters);
      // unknown dpe has propIdx === -1, so it fails (propIdx > minIdx check doesn't apply, but propIdx === -1 check does)
      expect(result.find((p) => p.dpe === "unknown")).toBeUndefined();
    });

    it("does not filter on DPE when minDPE is null", () => {
      const filters = makeFilters({ minDPE: null });
      const result = applyFilters(mockProperties, filters);
      // All buy properties pass (5)
      const buyCount = mockProperties.filter(
        (p) => p.transactionType === "buy",
      ).length;
      expect(result).toHaveLength(buyCount);
    });

    it("does not filter on DPE when minDPE is unknown", () => {
      const filters = makeFilters({ minDPE: "unknown" });
      const result = applyFilters(mockProperties, filters);
      const buyCount = mockProperties.filter(
        (p) => p.transactionType === "buy",
      ).length;
      expect(result).toHaveLength(buyCount);
    });
  });

  describe("combined filters (AND conditions)", () => {
    it("applies price + surface + rooms together", () => {
      const filters = makeFilters({
        priceRange: { min: 200000, max: 500000 },
        surfaceRange: { min: 60, max: null },
        minRooms: 3,
      });
      const result = applyFilters(mockProperties, filters);
      // buy, price [200k-500k], surface >= 60, rooms >= 3
      // prop-1: 250000, 65m2, 3 rooms -> YES
      // prop-2: 450000, 120m2, 5 rooms -> YES
      // prop-5: 380000, 95m2, 4 rooms -> YES
      expect(result).toHaveLength(3);
      expect(result.map((p) => p.id).sort()).toEqual([
        "prop-1",
        "prop-2",
        "prop-5",
      ]);
    });

    it("applies property type + DPE + bedrooms together", () => {
      const filters = makeFilters({
        propertyTypes: ["apartment"],
        minDPE: "C",
        minBedrooms: 2,
      });
      const result = applyFilters(mockProperties, filters);
      // buy apartments with dpe <= C and bedrooms >= 2
      // prop-1: apartment, C, 2 bedrooms -> YES
      // prop-6: apartment, A, 3 bedrooms -> YES
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id).sort()).toEqual(["prop-1", "prop-6"]);
    });

    it("narrows to empty when filters conflict", () => {
      const filters = makeFilters({
        propertyTypes: ["apartment"],
        priceRange: { min: 600000, max: null },
      });
      const result = applyFilters(mockProperties, filters);
      // buy apartments priced >= 600000: none
      expect(result).toHaveLength(0);
    });
  });

  describe("edge cases", () => {
    it("returns empty array when properties list is empty", () => {
      const result = applyFilters([], DEFAULT_FILTERS);
      expect(result).toEqual([]);
    });

    it("returns empty when min > max in price range (no property can satisfy)", () => {
      const filters = makeFilters({
        priceRange: { min: 500000, max: 100000 },
      });
      const result = applyFilters(mockProperties, filters);
      // No property can have price >= 500000 AND price <= 100000
      expect(result).toHaveLength(0);
    });

    it("returns empty when min > max in surface range", () => {
      const filters = makeFilters({
        surfaceRange: { min: 200, max: 10 },
      });
      const result = applyFilters(mockProperties, filters);
      expect(result).toHaveLength(0);
    });
  });
});

// ---------------------------------------------------------------------------
// filtersToSearchParams / searchParamsToFilters
// ---------------------------------------------------------------------------

describe("filtersToSearchParams", () => {
  it("produces empty params for default filters", () => {
    const params = filtersToSearchParams(DEFAULT_FILTERS);
    expect(params.toString()).toBe("");
  });

  it("only serialises non-default values", () => {
    const filters = makeFilters({
      priceRange: { min: 100000, max: null },
      minRooms: 3,
    });
    const params = filtersToSearchParams(filters);
    expect(params.get("pmin")).toBe("100000");
    expect(params.get("rooms")).toBe("3");
    // Default values should not appear
    expect(params.has("type")).toBe(false);
    expect(params.has("ptype")).toBe(false);
    expect(params.has("pmax")).toBe(false);
    expect(params.has("smin")).toBe(false);
    expect(params.has("smax")).toBe(false);
    expect(params.has("beds")).toBe(false);
    expect(params.has("cond")).toBe(false);
  });

  it("serialises transactionType when not default", () => {
    const filters = makeFilters({ transactionType: "rent" });
    const params = filtersToSearchParams(filters);
    expect(params.get("type")).toBe("rent");
  });

  it("serialises propertyTypes as comma-separated list", () => {
    const filters = makeFilters({
      propertyTypes: ["apartment", "house"],
    });
    const params = filtersToSearchParams(filters);
    expect(params.get("ptype")).toBe("apartment,house");
  });

  it("serialises condition when not default", () => {
    const filters = makeFilters({ condition: "new" });
    const params = filtersToSearchParams(filters);
    expect(params.get("cond")).toBe("new");
  });

  it("serialises full price and surface ranges", () => {
    const filters = makeFilters({
      priceRange: { min: 100000, max: 500000 },
      surfaceRange: { min: 30, max: 120 },
    });
    const params = filtersToSearchParams(filters);
    expect(params.get("pmin")).toBe("100000");
    expect(params.get("pmax")).toBe("500000");
    expect(params.get("smin")).toBe("30");
    expect(params.get("smax")).toBe("120");
  });

  it("serialises minBedrooms", () => {
    const filters = makeFilters({ minBedrooms: 2 });
    const params = filtersToSearchParams(filters);
    expect(params.get("beds")).toBe("2");
  });
});

describe("searchParamsToFilters", () => {
  it("returns empty partial for empty params", () => {
    const params = new URLSearchParams();
    const result = searchParamsToFilters(params);
    expect(result).toEqual({});
  });

  it("parses transactionType", () => {
    const params = new URLSearchParams("type=rent");
    const result = searchParamsToFilters(params);
    expect(result.transactionType).toBe("rent");
  });

  it("ignores invalid transactionType", () => {
    const params = new URLSearchParams("type=invalid");
    const result = searchParamsToFilters(params);
    expect(result.transactionType).toBeUndefined();
  });

  it("parses propertyTypes", () => {
    const params = new URLSearchParams("ptype=apartment,house");
    const result = searchParamsToFilters(params);
    expect(result.propertyTypes).toEqual(["apartment", "house"]);
  });

  it("parses price range", () => {
    const params = new URLSearchParams("pmin=100000&pmax=500000");
    const result = searchParamsToFilters(params);
    expect(result.priceRange).toEqual({ min: 100000, max: 500000 });
  });

  it("parses partial price range (min only)", () => {
    const params = new URLSearchParams("pmin=200000");
    const result = searchParamsToFilters(params);
    expect(result.priceRange).toEqual({ min: 200000, max: null });
  });

  it("parses surface range", () => {
    const params = new URLSearchParams("smin=30&smax=120");
    const result = searchParamsToFilters(params);
    expect(result.surfaceRange).toEqual({ min: 30, max: 120 });
  });

  it("parses rooms and bedrooms", () => {
    const params = new URLSearchParams("rooms=3&beds=2");
    const result = searchParamsToFilters(params);
    expect(result.minRooms).toBe(3);
    expect(result.minBedrooms).toBe(2);
  });

  it("parses condition", () => {
    const params = new URLSearchParams("cond=to_renovate");
    const result = searchParamsToFilters(params);
    expect(result.condition).toBe("to_renovate");
  });
});

describe("filtersToSearchParams / searchParamsToFilters roundtrip", () => {
  it("roundtrips a complex filter set", () => {
    const filters = makeFilters({
      transactionType: "rent",
      propertyTypes: ["apartment", "loft"],
      priceRange: { min: 500, max: 2000 },
      surfaceRange: { min: 20, max: 80 },
      minRooms: 2,
      minBedrooms: 1,
      condition: "good",
    });

    const params = filtersToSearchParams(filters);
    const restored = searchParamsToFilters(params);

    expect(restored.transactionType).toBe("rent");
    expect(restored.propertyTypes).toEqual(["apartment", "loft"]);
    expect(restored.priceRange).toEqual({ min: 500, max: 2000 });
    expect(restored.surfaceRange).toEqual({ min: 20, max: 80 });
    expect(restored.minRooms).toBe(2);
    expect(restored.minBedrooms).toBe(1);
    expect(restored.condition).toBe("good");
  });

  it("roundtrips default filters to empty partial", () => {
    const params = filtersToSearchParams(DEFAULT_FILTERS);
    const restored = searchParamsToFilters(params);
    // Default filters produce no params, so restored should be empty
    expect(restored).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// saveFilters / loadFilters
// ---------------------------------------------------------------------------

describe("saveFilters / loadFilters", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns null when nothing is saved", () => {
    expect(loadFilters()).toBeNull();
  });

  it("saves and loads filters roundtrip", () => {
    const filters = makeFilters({
      transactionType: "rent",
      propertyTypes: ["house", "apartment"],
      priceRange: { min: 800, max: 1500 },
      surfaceRange: { min: 40, max: 100 },
      minRooms: 3,
      minBedrooms: 2,
      condition: "good",
      minDPE: "D",
      hasParking: true,
      hasElevator: false,
      hasBalcony: null,
    });

    saveFilters(filters);
    const loaded = loadFilters();

    expect(loaded).not.toBeNull();
    expect(loaded).toEqual(filters);
  });

  it("persists data to localStorage", () => {
    saveFilters(DEFAULT_FILTERS);
    const raw = window.localStorage.getItem("cherche-appart-filters");
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.transactionType).toBe("buy");
    expect(parsed.propertyTypes).toEqual([]);
  });

  it("overwrites previous save", () => {
    saveFilters(DEFAULT_FILTERS);
    const updated = makeFilters({ minRooms: 5 });
    saveFilters(updated);
    const loaded = loadFilters();
    expect(loaded?.minRooms).toBe(5);
  });
});
