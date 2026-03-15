import { describe, it, expect, beforeEach } from "vitest";
import { useFilterStore } from "@/store/filterStore";

beforeEach(() => {
  useFilterStore.getState().resetFilters();
});

describe("filterStore", () => {
  it("starts with default filters and 0 active count", () => {
    const { filters, activeCount } = useFilterStore.getState();
    expect(activeCount).toBe(0);
    expect(filters.transactionType).toBe("buy");
    expect(filters.propertyTypes).toEqual([]);
    expect(filters.priceRange).toEqual({ min: null, max: null });
  });

  it("toggles property type on/off", () => {
    useFilterStore.getState().togglePropertyType("apartment");
    expect(useFilterStore.getState().filters.propertyTypes).toEqual(["apartment"]);
    expect(useFilterStore.getState().activeCount).toBe(1);

    useFilterStore.getState().togglePropertyType("apartment");
    expect(useFilterStore.getState().filters.propertyTypes).toEqual([]);
    expect(useFilterStore.getState().activeCount).toBe(0);
  });

  it("sets price range", () => {
    useFilterStore.getState().setPriceRange({ min: 100000, max: 300000 });
    expect(useFilterStore.getState().filters.priceRange).toEqual({ min: 100000, max: 300000 });
    expect(useFilterStore.getState().activeCount).toBe(1);
  });

  it("sets min rooms", () => {
    useFilterStore.getState().setMinRooms(3);
    expect(useFilterStore.getState().filters.minRooms).toBe(3);
    expect(useFilterStore.getState().activeCount).toBe(1);
  });

  it("resets all filters to defaults", () => {
    useFilterStore.getState().togglePropertyType("house");
    useFilterStore.getState().setPriceRange({ min: 50000, max: null });
    useFilterStore.getState().setMinRooms(2);
    expect(useFilterStore.getState().activeCount).toBe(3);

    useFilterStore.getState().resetFilters();
    expect(useFilterStore.getState().activeCount).toBe(0);
    expect(useFilterStore.getState().filters.propertyTypes).toEqual([]);
  });

  it("counts multiple active filters correctly", () => {
    useFilterStore.getState().togglePropertyType("apartment");
    useFilterStore.getState().setPriceRange({ min: 100000, max: 500000 });
    useFilterStore.getState().setSurfaceRange({ min: 50, max: null });
    useFilterStore.getState().setMinRooms(3);
    useFilterStore.getState().setHasParking(true);
    expect(useFilterStore.getState().activeCount).toBe(5);
  });

  it("changes transaction type", () => {
    useFilterStore.getState().setTransactionType("rent");
    expect(useFilterStore.getState().filters.transactionType).toBe("rent");
    expect(useFilterStore.getState().activeCount).toBe(1);
  });
});
