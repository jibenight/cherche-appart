import type { PropertyCard } from "@/types/property";
import type { FilterSet } from "@/types/filters";
import { DEFAULT_FILTERS } from "@/types/filters";

const STORAGE_KEY = "cherche-appart-filters";

/** Apply filters to a list of properties (AND conditions) */
export function applyFilters(
  properties: PropertyCard[],
  filters: FilterSet,
): PropertyCard[] {
  return properties.filter((p) => {
    // Transaction type
    if (p.transactionType !== filters.transactionType) return false;

    // Property type
    if (
      filters.propertyTypes.length > 0 &&
      !filters.propertyTypes.includes(p.type)
    )
      return false;

    // Price range
    if (filters.priceRange.min !== null && p.price < filters.priceRange.min)
      return false;
    if (filters.priceRange.max !== null && p.price > filters.priceRange.max)
      return false;

    // Surface range
    if (
      filters.surfaceRange.min !== null &&
      p.surface < filters.surfaceRange.min
    )
      return false;
    if (
      filters.surfaceRange.max !== null &&
      p.surface > filters.surfaceRange.max
    )
      return false;

    // Rooms
    if (filters.minRooms !== null && p.rooms < filters.minRooms) return false;

    // Bedrooms
    if (filters.minBedrooms !== null && p.bedrooms < filters.minBedrooms)
      return false;

    // DPE
    if (filters.minDPE !== null && filters.minDPE !== "unknown") {
      const dpeOrder = ["A", "B", "C", "D", "E", "F", "G"];
      const minIdx = dpeOrder.indexOf(filters.minDPE);
      const propIdx = dpeOrder.indexOf(p.dpe);
      if (propIdx === -1 || propIdx > minIdx) return false;
    }

    return true;
  });
}

/** Save filters to localStorage */
export function saveFilters(filters: FilterSet): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch {
    // Storage full or unavailable
  }
}

/** Load filters from localStorage */
export function loadFilters(): FilterSet | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as FilterSet;
  } catch {
    return null;
  }
}

/** Serialize filters to URL search params */
export function filtersToSearchParams(filters: FilterSet): URLSearchParams {
  const params = new URLSearchParams();
  const defaults = DEFAULT_FILTERS;

  if (filters.transactionType !== defaults.transactionType)
    params.set("type", filters.transactionType);
  if (filters.propertyTypes.length > 0)
    params.set("ptype", filters.propertyTypes.join(","));
  if (filters.priceRange.min !== null)
    params.set("pmin", String(filters.priceRange.min));
  if (filters.priceRange.max !== null)
    params.set("pmax", String(filters.priceRange.max));
  if (filters.surfaceRange.min !== null)
    params.set("smin", String(filters.surfaceRange.min));
  if (filters.surfaceRange.max !== null)
    params.set("smax", String(filters.surfaceRange.max));
  if (filters.minRooms !== null)
    params.set("rooms", String(filters.minRooms));
  if (filters.minBedrooms !== null)
    params.set("beds", String(filters.minBedrooms));
  if (filters.condition !== defaults.condition)
    params.set("cond", filters.condition);

  return params;
}

/** Deserialize filters from URL search params */
export function searchParamsToFilters(
  params: URLSearchParams,
): Partial<FilterSet> {
  const filters: Partial<FilterSet> = {};

  const type = params.get("type");
  if (type === "buy" || type === "rent") filters.transactionType = type;

  const ptype = params.get("ptype");
  if (ptype) filters.propertyTypes = ptype.split(",") as FilterSet["propertyTypes"];

  const pmin = params.get("pmin");
  const pmax = params.get("pmax");
  if (pmin || pmax) {
    filters.priceRange = {
      min: pmin ? Number(pmin) : null,
      max: pmax ? Number(pmax) : null,
    };
  }

  const smin = params.get("smin");
  const smax = params.get("smax");
  if (smin || smax) {
    filters.surfaceRange = {
      min: smin ? Number(smin) : null,
      max: smax ? Number(smax) : null,
    };
  }

  const rooms = params.get("rooms");
  if (rooms) filters.minRooms = Number(rooms);

  const beds = params.get("beds");
  if (beds) filters.minBedrooms = Number(beds);

  const cond = params.get("cond");
  if (cond) filters.condition = cond as FilterSet["condition"];

  return filters;
}
