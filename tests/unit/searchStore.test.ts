import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSearchStore } from "@/store/searchStore";

// Mock storage service
vi.mock("@/services/storage", () => ({
  saveSearchState: vi.fn(),
  loadSearchState: vi.fn(() => null),
  clearSearchState: vi.fn(),
}));

const mockLocation = {
  name: "Lyon",
  postcode: "69000",
  department: "Rhône",
  lat: 45.764,
  lng: 4.8357,
};

beforeEach(() => {
  // Reset store between tests
  useSearchStore.setState({
    location: null,
    radiusKm: 10,
    isHydrated: false,
  });
});

describe("searchStore", () => {
  describe("setLocation", () => {
    it("sets location correctly", () => {
      useSearchStore.getState().setLocation(mockLocation);
      expect(useSearchStore.getState().location).toEqual(mockLocation);
    });

    it("allows setting location to null", () => {
      useSearchStore.getState().setLocation(mockLocation);
      useSearchStore.getState().setLocation(null);
      expect(useSearchStore.getState().location).toBeNull();
    });
  });

  describe("setRadiusKm", () => {
    it("sets radius within valid range", () => {
      useSearchStore.getState().setRadiusKm(25);
      expect(useSearchStore.getState().radiusKm).toBe(25);
    });

    it("clamps radius to minimum of 1", () => {
      useSearchStore.getState().setRadiusKm(-5);
      expect(useSearchStore.getState().radiusKm).toBe(1);
    });

    it("clamps radius to maximum of 100", () => {
      useSearchStore.getState().setRadiusKm(200);
      expect(useSearchStore.getState().radiusKm).toBe(100);
    });
  });

  describe("reset", () => {
    it("resets location and radius to defaults", () => {
      useSearchStore.getState().setLocation(mockLocation);
      useSearchStore.getState().setRadiusKm(50);

      useSearchStore.getState().reset();

      expect(useSearchStore.getState().location).toBeNull();
      expect(useSearchStore.getState().radiusKm).toBe(10);
    });
  });

  describe("hydrate", () => {
    it("sets isHydrated to true", () => {
      useSearchStore.getState().hydrate();
      expect(useSearchStore.getState().isHydrated).toBe(true);
    });
  });
});
