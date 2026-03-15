import { create } from "zustand";
import type { FilterSet, RangeFilter, PropertyCondition } from "@/types/filters";
import type { PropertyType, DPERating, TransactionType } from "@/types/location";
import { DEFAULT_FILTERS, countActiveFilters } from "@/types/filters";

interface FilterState {
  filters: FilterSet;
  activeCount: number;
}

interface FilterActions {
  setTransactionType: (type: TransactionType) => void;
  togglePropertyType: (type: PropertyType) => void;
  setPriceRange: (range: RangeFilter) => void;
  setSurfaceRange: (range: RangeFilter) => void;
  setMinRooms: (rooms: number | null) => void;
  setMinBedrooms: (bedrooms: number | null) => void;
  setFloorRange: (range: RangeFilter) => void;
  setHasParking: (value: boolean | null) => void;
  setHasElevator: (value: boolean | null) => void;
  setHasBalcony: (value: boolean | null) => void;
  setMinDPE: (dpe: DPERating | null) => void;
  setCondition: (condition: PropertyCondition) => void;
  resetFilters: () => void;
  setFilters: (filters: Partial<FilterSet>) => void;
}

export type FilterStore = FilterState & FilterActions;

function updateFilters(
  current: FilterSet,
  partial: Partial<FilterSet>,
): { filters: FilterSet; activeCount: number } {
  const filters = { ...current, ...partial };
  return { filters, activeCount: countActiveFilters(filters) };
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  filters: { ...DEFAULT_FILTERS },
  activeCount: 0,

  setTransactionType: (transactionType) =>
    set(updateFilters(get().filters, { transactionType })),

  togglePropertyType: (type) => {
    const current = get().filters.propertyTypes;
    const propertyTypes = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    set(updateFilters(get().filters, { propertyTypes }));
  },

  setPriceRange: (priceRange) =>
    set(updateFilters(get().filters, { priceRange })),

  setSurfaceRange: (surfaceRange) =>
    set(updateFilters(get().filters, { surfaceRange })),

  setMinRooms: (minRooms) =>
    set(updateFilters(get().filters, { minRooms })),

  setMinBedrooms: (minBedrooms) =>
    set(updateFilters(get().filters, { minBedrooms })),

  setFloorRange: (floorRange) =>
    set(updateFilters(get().filters, { floorRange })),

  setHasParking: (hasParking) =>
    set(updateFilters(get().filters, { hasParking })),

  setHasElevator: (hasElevator) =>
    set(updateFilters(get().filters, { hasElevator })),

  setHasBalcony: (hasBalcony) =>
    set(updateFilters(get().filters, { hasBalcony })),

  setMinDPE: (minDPE) =>
    set(updateFilters(get().filters, { minDPE })),

  setCondition: (condition) =>
    set(updateFilters(get().filters, { condition })),

  resetFilters: () =>
    set({ filters: { ...DEFAULT_FILTERS }, activeCount: 0 }),

  setFilters: (partial) =>
    set(updateFilters(get().filters, partial)),
}));
