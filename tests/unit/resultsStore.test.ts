import { describe, it, expect, beforeEach } from "vitest";
import { useResultsStore } from "@/store/resultsStore";
import type { PropertyCard } from "@/types/property";

const { getState } = useResultsStore;

const mockProperties: PropertyCard[] = [
  {
    id: "1",
    transactionType: "buy",
    type: "apartment",
    title: "Studio centre-ville",
    price: 150000,
    surface: 30,
    rooms: 1,
    bedrooms: 0,
    dpe: "C",
    city: "Lyon",
    postcode: "69001",
    lat: 45.767,
    lng: 4.834,
    images: ["/img/1.jpg"],
    pricePerM2: 5000,
    publishedAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "2",
    transactionType: "buy",
    type: "apartment",
    title: "T3 avec balcon",
    price: 280000,
    surface: 65,
    rooms: 3,
    bedrooms: 2,
    dpe: "B",
    city: "Lyon",
    postcode: "69003",
    lat: 45.76,
    lng: 4.85,
    images: ["/img/2.jpg"],
    pricePerM2: 4308,
    publishedAt: "2026-02-20T14:00:00Z",
  },
  {
    id: "3",
    transactionType: "rent",
    type: "house",
    title: "Maison familiale",
    price: 1200,
    surface: 120,
    rooms: 5,
    bedrooms: 3,
    dpe: "D",
    city: "Villeurbanne",
    postcode: "69100",
    lat: 45.772,
    lng: 4.88,
    images: ["/img/3a.jpg", "/img/3b.jpg"],
    pricePerM2: 10,
    publishedAt: "2026-03-01T08:00:00Z",
  },
  {
    id: "4",
    transactionType: "buy",
    type: "apartment",
    title: "Grand T2 lumineux",
    price: 210000,
    surface: 48,
    rooms: 2,
    bedrooms: 1,
    dpe: "A",
    city: "Lyon",
    postcode: "69006",
    lat: 45.77,
    lng: 4.86,
    images: ["/img/4.jpg"],
    pricePerM2: 4375,
    publishedAt: "2026-01-30T12:00:00Z",
  },
];

beforeEach(() => {
  getState().resetResults();
});

describe("resultsStore", () => {
  describe("initial state", () => {
    it("has empty properties, page 1, default sort date_desc, and not loading", () => {
      const state = getState();
      expect(state.properties).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.page).toBe(1);
      expect(state.pageSize).toBe(20);
      expect(state.sortBy).toBe("date_desc");
      expect(state.isLoading).toBe(false);
      expect(state.hasMore).toBe(false);
    });
  });

  describe("setProperties", () => {
    it("sets properties and total", () => {
      getState().setProperties(mockProperties, 50);
      const state = getState();
      expect(state.properties).toHaveLength(4);
      expect(state.total).toBe(50);
    });

    it("resets page to 1", () => {
      getState().nextPage();
      getState().nextPage();
      expect(getState().page).toBe(3);

      getState().setProperties(mockProperties, 4);
      expect(getState().page).toBe(1);
    });

    it("sorts properties by current sortBy (default date_desc)", () => {
      getState().setProperties(mockProperties, 4);
      const ids = getState().properties.map((p) => p.id);
      // date_desc: Mar 1 (3), Feb 20 (2), Jan 30 (4), Jan 15 (1)
      expect(ids).toEqual(["3", "2", "4", "1"]);
    });

    it("sets hasMore to true when properties.length < total", () => {
      getState().setProperties(mockProperties, 50);
      expect(getState().hasMore).toBe(true);
    });

    it("sets hasMore to false when properties.length >= total", () => {
      getState().setProperties(mockProperties, 4);
      expect(getState().hasMore).toBe(false);
    });

    it("sets hasMore to false when properties.length equals total exactly", () => {
      getState().setProperties(mockProperties, 4);
      expect(getState().hasMore).toBe(false);
    });
  });

  describe("appendProperties", () => {
    it("appends new properties to existing ones", () => {
      const first = mockProperties.slice(0, 2);
      const second = mockProperties.slice(2);

      getState().setProperties(first, 10);
      expect(getState().properties).toHaveLength(2);

      getState().appendProperties(second);
      expect(getState().properties).toHaveLength(4);
    });

    it("sorts the combined list", () => {
      getState().setProperties([mockProperties[0]], 10); // id 1, Jan 15
      getState().appendProperties([mockProperties[2]]); // id 3, Mar 1

      const ids = getState().properties.map((p) => p.id);
      // date_desc: Mar 1 (3) before Jan 15 (1)
      expect(ids).toEqual(["3", "1"]);
    });

    it("updates hasMore based on combined length vs total", () => {
      getState().setProperties(mockProperties.slice(0, 2), 4);
      expect(getState().hasMore).toBe(true);

      getState().appendProperties(mockProperties.slice(2));
      expect(getState().hasMore).toBe(false);
    });
  });

  describe("setSortBy", () => {
    it("updates sortBy value", () => {
      getState().setSortBy("price_asc");
      expect(getState().sortBy).toBe("price_asc");
    });

    it("re-sorts existing properties by the new sort option", () => {
      getState().setProperties(mockProperties, 4);
      getState().setSortBy("price_asc");

      const prices = getState().properties.map((p) => p.price);
      // price_asc: 1200, 150000, 210000, 280000
      expect(prices).toEqual([1200, 150000, 210000, 280000]);
    });
  });

  describe("setLoading", () => {
    it("sets isLoading to true", () => {
      getState().setLoading(true);
      expect(getState().isLoading).toBe(true);
    });

    it("sets isLoading to false", () => {
      getState().setLoading(true);
      getState().setLoading(false);
      expect(getState().isLoading).toBe(false);
    });
  });

  describe("nextPage", () => {
    it("increments page by 1", () => {
      expect(getState().page).toBe(1);
      getState().nextPage();
      expect(getState().page).toBe(2);
    });

    it("increments page multiple times", () => {
      getState().nextPage();
      getState().nextPage();
      getState().nextPage();
      expect(getState().page).toBe(4);
    });
  });

  describe("resetResults", () => {
    it("clears properties and resets all state", () => {
      getState().setProperties(mockProperties, 50);
      getState().setSortBy("price_asc");
      getState().setLoading(true);
      getState().nextPage();

      getState().resetResults();
      const state = getState();
      expect(state.properties).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.page).toBe(1);
      expect(state.hasMore).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it("preserves sortBy after reset", () => {
      getState().setSortBy("price_desc");
      getState().resetResults();
      // resetResults does not reset sortBy per implementation
      expect(getState().sortBy).toBe("price_desc");
    });
  });

  describe("sort correctness", () => {
    beforeEach(() => {
      getState().setProperties(mockProperties, 4);
    });

    it("price_asc sorts from cheapest to most expensive", () => {
      getState().setSortBy("price_asc");
      const prices = getState().properties.map((p) => p.price);
      expect(prices).toEqual([1200, 150000, 210000, 280000]);
    });

    it("price_desc sorts from most expensive to cheapest", () => {
      getState().setSortBy("price_desc");
      const prices = getState().properties.map((p) => p.price);
      expect(prices).toEqual([280000, 210000, 150000, 1200]);
    });

    it("surface_desc sorts from largest to smallest surface", () => {
      getState().setSortBy("surface_desc");
      const surfaces = getState().properties.map((p) => p.surface);
      expect(surfaces).toEqual([120, 65, 48, 30]);
    });

    it("surface_asc sorts from smallest to largest surface", () => {
      getState().setSortBy("surface_asc");
      const surfaces = getState().properties.map((p) => p.surface);
      expect(surfaces).toEqual([30, 48, 65, 120]);
    });

    it("date_desc sorts from newest to oldest", () => {
      getState().setSortBy("date_desc");
      const ids = getState().properties.map((p) => p.id);
      expect(ids).toEqual(["3", "2", "4", "1"]);
    });

    it("date_asc sorts from oldest to newest", () => {
      getState().setSortBy("date_asc");
      const ids = getState().properties.map((p) => p.id);
      expect(ids).toEqual(["1", "4", "2", "3"]);
    });
  });
});
