import type { PropertyType, DPERating, TransactionType } from "./location";

/** Range filter with optional min/max */
export interface RangeFilter {
  min: number | null;
  max: number | null;
}

/** Property condition */
export type PropertyCondition = "new" | "good" | "to_renovate" | "any";

/** Complete set of search filters */
export interface FilterSet {
  /** Transaction type (buy/rent) */
  transactionType: TransactionType;
  /** Property types to include (multi-select) */
  propertyTypes: PropertyType[];
  /** Price range in euros */
  priceRange: RangeFilter;
  /** Living surface range in m² */
  surfaceRange: RangeFilter;
  /** Minimum number of rooms (null = any) */
  minRooms: number | null;
  /** Minimum number of bedrooms (null = any) */
  minBedrooms: number | null;
  /** Floor range (null = any) */
  floorRange: RangeFilter;
  /** Has parking */
  hasParking: boolean | null;
  /** Has elevator */
  hasElevator: boolean | null;
  /** Has balcony/terrace */
  hasBalcony: boolean | null;
  /** Minimum DPE rating (null = any) */
  minDPE: DPERating | null;
  /** Property condition */
  condition: PropertyCondition;
}

/** Default filter values */
export const DEFAULT_FILTERS: FilterSet = {
  transactionType: "buy",
  propertyTypes: [],
  priceRange: { min: null, max: null },
  surfaceRange: { min: null, max: null },
  minRooms: null,
  minBedrooms: null,
  floorRange: { min: null, max: null },
  hasParking: null,
  hasElevator: null,
  hasBalcony: null,
  minDPE: null,
  condition: "any",
};

/** Count the number of active (non-default) filters */
export function countActiveFilters(filters: FilterSet): number {
  let count = 0;
  if (filters.transactionType !== "buy") count++;
  if (filters.propertyTypes.length > 0) count++;
  if (filters.priceRange.min !== null || filters.priceRange.max !== null) count++;
  if (filters.surfaceRange.min !== null || filters.surfaceRange.max !== null) count++;
  if (filters.minRooms !== null) count++;
  if (filters.minBedrooms !== null) count++;
  if (filters.floorRange.min !== null || filters.floorRange.max !== null) count++;
  if (filters.hasParking !== null) count++;
  if (filters.hasElevator !== null) count++;
  if (filters.hasBalcony !== null) count++;
  if (filters.minDPE !== null) count++;
  if (filters.condition !== "any") count++;
  return count;
}
