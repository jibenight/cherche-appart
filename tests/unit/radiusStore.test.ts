import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSearchStore } from "@/store/searchStore";

vi.mock("@/services/storage", () => ({
  saveSearchState: vi.fn(),
  loadSearchState: vi.fn(() => null),
  clearSearchState: vi.fn(),
}));

const mockLocation = {
  name: "Bordeaux",
  postcode: "33000",
  department: "Gironde",
  lat: 44.8378,
  lng: -0.5792,
};

beforeEach(() => {
  useSearchStore.setState({
    location: null,
    radiusKm: 10,
    isHydrated: false,
  });
});

describe("searchStore - radius operations", () => {
  it("defaults to 10km radius", () => {
    expect(useSearchStore.getState().radiusKm).toBe(10);
  });

  it("sets radius to valid value", () => {
    useSearchStore.getState().setRadiusKm(15);
    expect(useSearchStore.getState().radiusKm).toBe(15);
  });

  it("clamps radius below minimum to 1", () => {
    useSearchStore.getState().setRadiusKm(0);
    expect(useSearchStore.getState().radiusKm).toBe(1);
  });

  it("clamps radius above maximum to 100", () => {
    useSearchStore.getState().setRadiusKm(150);
    expect(useSearchStore.getState().radiusKm).toBe(100);
  });

  it("preserves location when changing radius", () => {
    useSearchStore.getState().setLocation(mockLocation);
    useSearchStore.getState().setRadiusKm(30);

    expect(useSearchStore.getState().location).toEqual(mockLocation);
    expect(useSearchStore.getState().radiusKm).toBe(30);
  });

  it("resets radius to default on reset()", () => {
    useSearchStore.getState().setRadiusKm(50);
    useSearchStore.getState().reset();

    expect(useSearchStore.getState().radiusKm).toBe(10);
  });
});
