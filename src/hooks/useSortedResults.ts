import { useMemo } from "react";
import type { PropertyCard, SortOption } from "@/types/property";

/** Sort properties by the given sort option */
export function sortProperties(
  properties: PropertyCard[],
  sortBy: SortOption,
): PropertyCard[] {
  const sorted = [...properties];
  switch (sortBy) {
    case "price_asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price_desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "surface_asc":
      return sorted.sort((a, b) => a.surface - b.surface);
    case "surface_desc":
      return sorted.sort((a, b) => b.surface - a.surface);
    case "price_per_m2_asc":
      return sorted.sort((a, b) => a.pricePerM2 - b.pricePerM2);
    case "price_per_m2_desc":
      return sorted.sort((a, b) => b.pricePerM2 - a.pricePerM2);
    case "date_desc":
      return sorted.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime(),
      );
    case "date_asc":
      return sorted.sort(
        (a, b) =>
          new Date(a.publishedAt).getTime() -
          new Date(b.publishedAt).getTime(),
      );
    default:
      return sorted;
  }
}

/** Hook that returns sorted properties */
export function useSortedResults(
  properties: PropertyCard[],
  sortBy: SortOption,
): PropertyCard[] {
  return useMemo(() => sortProperties(properties, sortBy), [properties, sortBy]);
}
