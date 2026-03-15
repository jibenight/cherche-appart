/** Represents a geographic location (French commune) */
export interface Location {
  /** City name, e.g. "Lyon" */
  name: string;
  /** Postal code, e.g. "69000" */
  postcode: string;
  /** Department name, e.g. "Rhône" */
  department: string;
  /** Latitude in decimal degrees */
  lat: number;
  /** Longitude in decimal degrees */
  lng: number;
}

/** Defines a circular search area */
export interface SearchArea {
  /** Center point of the search */
  center: Location;
  /** Radius in kilometers (1–100) */
  radiusKm: number;
}

/** An autocomplete suggestion from the geocoding API */
export interface GeoSuggestion {
  /** Full display label, e.g. "Lyon (69000), Rhône" */
  label: string;
  /** City name */
  name: string;
  /** Postal code */
  postcode: string;
  /** Department name */
  department: string;
  /** Coordinates [longitude, latitude] in GeoJSON order */
  coordinates: [number, number];
}

/** Property type enum for search filters */
export type PropertyType =
  | "apartment"
  | "house"
  | "studio"
  | "loft"
  | "land"
  | "commercial"
  | "other";

/** DPE (Diagnostic de Performance Énergétique) rating */
export type DPERating = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "unknown";

/** Transaction type */
export type TransactionType = "buy" | "rent";
