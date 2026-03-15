import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useComparison } from "@/hooks/useComparison";
import type { PropertyCard } from "@/types/property";

const mockProperties: PropertyCard[] = [
  {
    id: "prop-1",
    transactionType: "buy",
    type: "apartment",
    title: "Studio Lyon",
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
    title: "Appartement Paris",
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
    dpe: "A",
    city: "Marseille",
    postcode: "13001",
    lat: 43.3,
    lng: 5.37,
    images: [],
    pricePerM2: 2500,
    publishedAt: "2026-02-10T08:00:00Z",
  },
  {
    id: "prop-4",
    transactionType: "buy",
    type: "apartment",
    title: "Loft Bordeaux",
    price: 380000,
    surface: 100,
    rooms: 3,
    bedrooms: 2,
    dpe: "C",
    city: "Bordeaux",
    postcode: "33000",
    lat: 44.84,
    lng: -0.57,
    images: [],
    pricePerM2: 3800,
    publishedAt: "2026-02-20T12:00:00Z",
  },
  {
    id: "prop-5",
    transactionType: "buy",
    type: "apartment",
    title: "T2 Toulouse",
    price: 200000,
    surface: 45,
    rooms: 2,
    bedrooms: 1,
    dpe: "E",
    city: "Toulouse",
    postcode: "31000",
    lat: 43.6,
    lng: 1.44,
    images: [],
    pricePerM2: 4444,
    publishedAt: "2026-03-05T09:00:00Z",
  },
];

describe("useComparison", () => {
  describe("toggle", () => {
    it("adds a property id when toggling on", () => {
      const { result } = renderHook(() => useComparison());

      act(() => {
        result.current.toggle("prop-1");
      });

      expect(result.current.selectedIds).toEqual(["prop-1"]);
    });

    it("removes a property id when toggling off", () => {
      const { result } = renderHook(() => useComparison());

      act(() => {
        result.current.toggle("prop-1");
      });
      act(() => {
        result.current.toggle("prop-1");
      });

      expect(result.current.selectedIds).toEqual([]);
    });

    it("can select multiple properties", () => {
      const { result } = renderHook(() => useComparison());

      act(() => {
        result.current.toggle("prop-1");
      });
      act(() => {
        result.current.toggle("prop-2");
      });
      act(() => {
        result.current.toggle("prop-3");
      });

      expect(result.current.selectedIds).toEqual(["prop-1", "prop-2", "prop-3"]);
    });
  });

  describe("clear", () => {
    it("removes all selected properties", () => {
      const { result } = renderHook(() => useComparison());

      act(() => {
        result.current.toggle("prop-1");
      });
      act(() => {
        result.current.toggle("prop-2");
      });
      act(() => {
        result.current.clear();
      });

      expect(result.current.selectedIds).toEqual([]);
    });
  });

  describe("isSelected", () => {
    it("returns true for a selected property", () => {
      const { result } = renderHook(() => useComparison());

      act(() => {
        result.current.toggle("prop-1");
      });

      expect(result.current.isSelected("prop-1")).toBe(true);
    });

    it("returns false for an unselected property", () => {
      const { result } = renderHook(() => useComparison());

      expect(result.current.isSelected("prop-1")).toBe(false);
    });
  });

  describe("canCompare", () => {
    it("is false with 0 selections", () => {
      const { result } = renderHook(() => useComparison());
      expect(result.current.canCompare).toBe(false);
    });

    it("is false with 1 selection", () => {
      const { result } = renderHook(() => useComparison());

      act(() => {
        result.current.toggle("prop-1");
      });

      expect(result.current.canCompare).toBe(false);
    });

    it("is true with 2 or more selections", () => {
      const { result } = renderHook(() => useComparison());

      act(() => {
        result.current.toggle("prop-1");
      });
      act(() => {
        result.current.toggle("prop-2");
      });

      expect(result.current.canCompare).toBe(true);
    });
  });

  describe("isFull", () => {
    it("is false with fewer than 4 selections", () => {
      const { result } = renderHook(() => useComparison());

      act(() => {
        result.current.toggle("prop-1");
      });
      act(() => {
        result.current.toggle("prop-2");
      });
      act(() => {
        result.current.toggle("prop-3");
      });

      expect(result.current.isFull).toBe(false);
    });

    it("is true with exactly 4 selections", () => {
      const { result } = renderHook(() => useComparison());

      act(() => {
        result.current.toggle("prop-1");
      });
      act(() => {
        result.current.toggle("prop-2");
      });
      act(() => {
        result.current.toggle("prop-3");
      });
      act(() => {
        result.current.toggle("prop-4");
      });

      expect(result.current.isFull).toBe(true);
    });

    it("prevents adding a 5th selection when full", () => {
      const { result } = renderHook(() => useComparison());

      act(() => {
        result.current.toggle("prop-1");
      });
      act(() => {
        result.current.toggle("prop-2");
      });
      act(() => {
        result.current.toggle("prop-3");
      });
      act(() => {
        result.current.toggle("prop-4");
      });
      act(() => {
        result.current.toggle("prop-5");
      });

      expect(result.current.selectedIds).toHaveLength(4);
      expect(result.current.selectedIds).not.toContain("prop-5");
    });
  });

  describe("getMetrics", () => {
    it("returns null when fewer than 2 properties are selected", () => {
      const { result } = renderHook(() => useComparison());

      act(() => {
        result.current.toggle("prop-1");
      });

      const metrics = result.current.getMetrics(mockProperties);
      expect(metrics).toBeNull();
    });

    it("returns metrics with correct structure for 2 selected properties", () => {
      const { result } = renderHook(() => useComparison());

      act(() => {
        result.current.toggle("prop-1");
      });
      act(() => {
        result.current.toggle("prop-3");
      });

      const metricsResult = result.current.getMetrics(mockProperties);
      expect(metricsResult).not.toBeNull();
      expect(metricsResult!.properties).toHaveLength(2);
      expect(metricsResult!.metrics).toHaveLength(6);
    });

    it("returns correct metric labels", () => {
      const { result } = renderHook(() => useComparison());

      act(() => {
        result.current.toggle("prop-1");
      });
      act(() => {
        result.current.toggle("prop-2");
      });

      const metricsResult = result.current.getMetrics(mockProperties);
      const labels = metricsResult!.metrics.map((m) => m.label);
      expect(labels).toEqual(["Prix", "Surface", "Prix/m\u00B2", "Pi\u00E8ces", "Chambres", "DPE"]);
    });

    it("returns correct values for price metric", () => {
      const { result } = renderHook(() => useComparison());

      // prop-1: price 150000, prop-3: price 300000
      act(() => {
        result.current.toggle("prop-1");
      });
      act(() => {
        result.current.toggle("prop-3");
      });

      const metricsResult = result.current.getMetrics(mockProperties);
      const prixMetric = metricsResult!.metrics.find((m) => m.label === "Prix")!;
      expect(prixMetric.values).toEqual([150000, 300000]);
      expect(prixMetric.bestFn).toBe("min");
    });

    it("returns correct values for surface metric", () => {
      const { result } = renderHook(() => useComparison());

      // prop-1: surface 30, prop-3: surface 120
      act(() => {
        result.current.toggle("prop-1");
      });
      act(() => {
        result.current.toggle("prop-3");
      });

      const metricsResult = result.current.getMetrics(mockProperties);
      const surfaceMetric = metricsResult!.metrics.find((m) => m.label === "Surface")!;
      expect(surfaceMetric.values).toEqual([30, 120]);
      expect(surfaceMetric.bestFn).toBe("max");
    });

    it("detects best value correctly using bestFn", () => {
      const { result } = renderHook(() => useComparison());

      // prop-1: price 150000, prop-2: price 450000, prop-3: price 300000
      act(() => {
        result.current.toggle("prop-1");
      });
      act(() => {
        result.current.toggle("prop-2");
      });
      act(() => {
        result.current.toggle("prop-3");
      });

      const metricsResult = result.current.getMetrics(mockProperties);

      // Prix: bestFn is "min", so best value is 150000 (prop-1)
      const prixMetric = metricsResult!.metrics.find((m) => m.label === "Prix")!;
      expect(prixMetric.values).toEqual([150000, 450000, 300000]);
      const bestPriceIndex = prixMetric.values.indexOf(Math.min(...prixMetric.values));
      expect(bestPriceIndex).toBe(0); // prop-1 has lowest price

      // Surface: bestFn is "max", so best value is 120 (prop-3)
      const surfaceMetric = metricsResult!.metrics.find((m) => m.label === "Surface")!;
      expect(surfaceMetric.values).toEqual([30, 90, 120]);
      const bestSurfaceIndex = surfaceMetric.values.indexOf(Math.max(...surfaceMetric.values));
      expect(bestSurfaceIndex).toBe(2); // prop-3 has largest surface

      // DPE: bestFn is "min", lower index = better rating
      // prop-1: D (index 3), prop-2: B (index 1), prop-3: A (index 0)
      const dpeMetric = metricsResult!.metrics.find((m) => m.label === "DPE")!;
      expect(dpeMetric.values).toEqual([3, 1, 0]);
      const bestDpeIndex = dpeMetric.values.indexOf(Math.min(...dpeMetric.values));
      expect(bestDpeIndex).toBe(2); // prop-3 has best DPE (A = index 0)
    });

    it("returns only selected properties in the result", () => {
      const { result } = renderHook(() => useComparison());

      act(() => {
        result.current.toggle("prop-2");
      });
      act(() => {
        result.current.toggle("prop-4");
      });

      const metricsResult = result.current.getMetrics(mockProperties);
      expect(metricsResult!.properties.map((p) => p.id)).toEqual(["prop-2", "prop-4"]);
    });
  });
});
