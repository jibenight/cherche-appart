import { useMemo } from "react";
import type { PropertyCard } from "@/types/property";
import type { FilterSet } from "@/types/filters";
import { applyFilters } from "@/services/filterService";

/** Hook that applies filters to a list of properties */
export function useFilteredResults(
  properties: PropertyCard[],
  filters: FilterSet,
): PropertyCard[] {
  return useMemo(
    () => applyFilters(properties, filters),
    [properties, filters],
  );
}
