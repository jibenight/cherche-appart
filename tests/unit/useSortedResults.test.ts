import { describe, it, expect } from "vitest";
import { sortProperties } from "@/hooks/useSortedResults";
import type { PropertyCard } from "@/types/property";

const mockProperties: PropertyCard[] = [
  {
    id: "prop-1",
    transactionType: "buy",
    type: "apartment",
    title: "Petit studio Lyon",
    price: 150000,
    surface: 30,
    rooms: 1,
    bedrooms: 0,
    dpe: "D",
    city: "Lyon",
    postcode: "69001",
    lat: 45.76,
    lng: 4.83,
    images: [],
    pricePerM2: 5000,
    publishedAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "prop-2",
    transactionType: "buy",
    type: "apartment",
    title: "Grand appartement Paris",
    price: 450000,
    surface: 90,
    rooms: 4,
    bedrooms: 3,
    dpe: "B",
    city: "Paris",
    postcode: "75010",
    lat: 48.87,
    lng: 2.36,
    images: [],
    pricePerM2: 5000,
    publishedAt: "2026-03-01T14:00:00Z",
  },
  {
    id: "prop-3",
    transactionType: "buy",
    type: "house",
    title: "Maison Marseille",
    price: 300000,
    surface: 120,
    rooms: 5,
    bedrooms: 4,
    dpe: "C",
    city: "Marseille",
    postcode: "13001",
    lat: 43.3,
    lng: 5.37,
    images: [],
    pricePerM2: 2500,
    publishedAt: "2026-02-10T08:00:00Z",
  },
];

describe("sortProperties", () => {
  it("sorts by price ascending", () => {
    const result = sortProperties(mockProperties, "price_asc");
    expect(result.map((p) => p.id)).toEqual(["prop-1", "prop-3", "prop-2"]);
  });

  it("sorts by price descending", () => {
    const result = sortProperties(mockProperties, "price_desc");
    expect(result.map((p) => p.id)).toEqual(["prop-2", "prop-3", "prop-1"]);
  });

  it("sorts by surface ascending", () => {
    const result = sortProperties(mockProperties, "surface_asc");
    expect(result.map((p) => p.id)).toEqual(["prop-1", "prop-2", "prop-3"]);
  });

  it("sorts by surface descending", () => {
    const result = sortProperties(mockProperties, "surface_desc");
    expect(result.map((p) => p.id)).toEqual(["prop-3", "prop-2", "prop-1"]);
  });

  it("sorts by price per m2 ascending", () => {
    const result = sortProperties(mockProperties, "price_per_m2_asc");
    expect(result.map((p) => p.id)).toEqual(["prop-3", "prop-1", "prop-2"]);
  });

  it("sorts by date descending (newest first)", () => {
    const result = sortProperties(mockProperties, "date_desc");
    expect(result.map((p) => p.id)).toEqual(["prop-2", "prop-3", "prop-1"]);
  });

  it("does not mutate the original array", () => {
    const original = [...mockProperties];
    sortProperties(mockProperties, "price_desc");
    expect(mockProperties.map((p) => p.id)).toEqual(original.map((p) => p.id));
  });

  it("handles empty array", () => {
    const result = sortProperties([], "price_asc");
    expect(result).toEqual([]);
  });

  it("handles single element array", () => {
    const result = sortProperties([mockProperties[0]], "price_desc");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("prop-1");
  });
});
