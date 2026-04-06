export interface RawListing {
  sourceId: string;
  source: string;
  externalUrl: string;
  transactionType?: string;
  type?: string;
  title: string;
  description?: string;
  price: number;
  surface?: number;
  rooms?: number;
  bedrooms?: number;
  floor?: number | null;
  totalFloors?: number | null;
  hasParking?: boolean;
  hasElevator?: boolean;
  hasBalcony?: boolean;
  dpe?: string;
  condition?: string;
  address?: string;
  city: string;
  postcode?: string;
  lat?: number;
  lng?: number;
  images?: string[];
  publishedAt?: string;
}

export interface ProviderConfig {
  name: string;
  enabled: boolean;
  maxPages: number;
  delayBetweenRequests: [number, number]; // [min, max] ms
  userAgent?: string;
}

export interface SearchParams {
  transactionType: 'buy' | 'rent';
  lat: number;
  lng: number;
  radiusKm: number;
  propertyTypes?: string[];
  priceMin?: number;
  priceMax?: number;
  surfaceMin?: number;
  surfaceMax?: number;
  minRooms?: number;
}

export interface PropertyProvider {
  readonly config: ProviderConfig;
  search(params: SearchParams): Promise<RawListing[]>;
}
