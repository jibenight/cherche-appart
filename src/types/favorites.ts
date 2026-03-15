import type { PropertyCard } from "./property";

/** A saved favorite property */
export interface Favorite {
  propertyId: string;
  savedAt: string;
  notes: string | null;
  property: PropertyCard;
}

/** A saved search alert */
export interface SearchAlert {
  id: string;
  name: string;
  frequency: "instant" | "daily" | "weekly";
  isActive: boolean;
  createdAt: string;
  lastTriggered: string | null;
  /** Serialized filters and location */
  searchParams: string;
}

/** A search history entry */
export interface SearchHistoryEntry {
  id: string;
  locationName: string;
  radiusKm: number;
  filtersSummary: string;
  resultCount: number;
  searchedAt: string;
  /** Serialized search state for restoration */
  searchParams: string;
}
