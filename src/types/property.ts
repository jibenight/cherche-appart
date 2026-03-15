import type { PropertyType, DPERating, TransactionType } from "./location";

/** A single property listing */
export interface Property {
  id: string;
  /** Transaction type */
  transactionType: TransactionType;
  /** Property type */
  type: PropertyType;
  /** Listing title */
  title: string;
  /** Description text */
  description: string;
  /** Price in euros (for buy) or euros/month (for rent) */
  price: number;
  /** Living surface in m² */
  surface: number;
  /** Number of rooms */
  rooms: number;
  /** Number of bedrooms */
  bedrooms: number;
  /** Floor number (0 = ground floor, null = house/unknown) */
  floor: number | null;
  /** Total floors in building */
  totalFloors: number | null;
  /** Has parking/garage */
  hasParking: boolean;
  /** Has elevator */
  hasElevator: boolean;
  /** Has balcony or terrace */
  hasBalcony: boolean;
  /** DPE energy rating */
  dpe: DPERating;
  /** Property condition */
  condition: "new" | "good" | "to_renovate";
  /** Full address */
  address: string;
  /** City name */
  city: string;
  /** Postal code */
  postcode: string;
  /** Latitude */
  lat: number;
  /** Longitude */
  lng: number;
  /** Image URLs */
  images: string[];
  /** Price per m² */
  pricePerM2: number;
  /** Publication date (ISO) */
  publishedAt: string;
  /** Source (agency name or platform) */
  source: string;
  /** External URL to original listing */
  externalUrl: string | null;
}

/** Property card data (subset for list/map display) */
export interface PropertyCard {
  id: string;
  transactionType: TransactionType;
  type: PropertyType;
  title: string;
  price: number;
  surface: number;
  rooms: number;
  bedrooms: number;
  dpe: DPERating;
  city: string;
  postcode: string;
  lat: number;
  lng: number;
  images: string[];
  pricePerM2: number;
  publishedAt: string;
}

/** Sort options for property results */
export type SortOption =
  | "price_asc"
  | "price_desc"
  | "surface_asc"
  | "surface_desc"
  | "price_per_m2_asc"
  | "price_per_m2_desc"
  | "date_desc"
  | "date_asc";

/** Paginated results response */
export interface PropertyResults {
  properties: PropertyCard[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
