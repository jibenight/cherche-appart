import type { FilterSet } from "./filters";
import type { Location } from "./location";

/** A saved search alert */
export interface SearchAlert {
  id: string;
  name: string;
  filters: FilterSet;
  location: Location;
  radiusKm: number;
  frequency: "instant" | "daily" | "weekly";
  isActive: boolean;
  createdAt: string;
  lastTriggered: string | null;
}

/** A search history entry */
export interface SearchHistoryEntry {
  id: string;
  location: Location;
  radiusKm: number;
  filters: FilterSet;
  resultCount: number;
  searchedAt: string;
}
