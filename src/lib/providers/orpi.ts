import { BaseProvider } from './base-provider';
import type { ProviderConfig, SearchParams, RawListing } from './types';

interface OrpiListing {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  surface: number;
  rooms: number;
  bedrooms: number;
  floor: number | null;
  floorsQuantity: number | null;
  hasParking: boolean;
  hasElevator: boolean;
  hasBalcony: boolean;
  dpe: string;
  city: string;
  zipcode: string;
  photos: { url: string; alt?: string }[];
  latitude: number;
  longitude: number;
  agency: { name: string } | null;
  createdAt: string;
  propertyType: string;
  transactionType: string;
}

interface OrpiResponse {
  items: OrpiListing[];
  total: number;
  page: number;
  nbPages: number;
}

function computeBounds(lat: number, lng: number, radiusKm: number) {
  const latDelta = radiusKm / 111.32;
  const lngDelta = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));

  return {
    southWestLat: lat - latDelta,
    southWestLng: lng - lngDelta,
    northEastLat: lat + latDelta,
    northEastLng: lng + lngDelta,
  };
}

function mapTransactionType(type: 'buy' | 'rent'): string {
  return type === 'buy' ? 'acheter' : 'louer';
}

function mapPropertyTypes(types?: string[]): string[] | undefined {
  if (!types || types.length === 0) return undefined;

  const mapping: Record<string, string> = {
    apartment: 'appartement',
    house: 'maison',
    studio: 'appartement',
    land: 'terrain',
    parking: 'parking',
    commercial: 'local-commercial',
  };

  return types.map((t) => mapping[t] || t);
}

export class OrpiProvider extends BaseProvider {
  readonly config: ProviderConfig = {
    name: 'orpi',
    enabled: true,
    maxPages: 5,
    delayBetweenRequests: [2000, 4000],
  };

  async search(params: SearchParams): Promise<RawListing[]> {
    const allListings: RawListing[] = [];
    const bounds = computeBounds(params.lat, params.lng, params.radiusKm);

    for (let page = 1; page <= this.config.maxPages; page++) {
      console.log(`[Orpi] Fetching page ${page}...`);

      const queryParams = new URLSearchParams();
      queryParams.set('transaction', mapTransactionType(params.transactionType));
      queryParams.set('page', String(page));

      // Spatial bounds
      queryParams.set('southWestLat', String(bounds.southWestLat));
      queryParams.set('southWestLng', String(bounds.southWestLng));
      queryParams.set('northEastLat', String(bounds.northEastLat));
      queryParams.set('northEastLng', String(bounds.northEastLng));

      // Property types
      const propertyTypes = mapPropertyTypes(params.propertyTypes);
      if (propertyTypes && propertyTypes.length > 0) {
        propertyTypes.forEach((pt) => queryParams.append('propertyTypes[]', pt));
      }

      // Price filters
      if (params.priceMin !== undefined) {
        queryParams.set('priceMin', String(params.priceMin));
      }
      if (params.priceMax !== undefined) {
        queryParams.set('priceMax', String(params.priceMax));
      }

      // Surface filters
      if (params.surfaceMin !== undefined) {
        queryParams.set('surfaceMin', String(params.surfaceMin));
      }
      if (params.surfaceMax !== undefined) {
        queryParams.set('surfaceMax', String(params.surfaceMax));
      }

      // Rooms
      if (params.minRooms !== undefined) {
        queryParams.set('nbRoomsMin', String(params.minRooms));
      }

      const url = `https://www.orpi.com/recherche/api/?${queryParams.toString()}`;

      try {
        const data = await this.fetchJson<OrpiResponse>(url);

        const items = data.items ?? [];

        if (items.length === 0) {
          console.log(`[Orpi] No more results at page ${page}, stopping.`);
          break;
        }

        const listings = items.map((item) => this.mapToRawListing(item));
        allListings.push(...listings);

        console.log(`[Orpi] Found ${items.length} listings on page ${page} (total: ${allListings.length})`);

        // Stop if we've reached the last page
        if (page >= data.nbPages) {
          break;
        }

        if (page < this.config.maxPages) {
          await this.delay();
        }
      } catch (error) {
        console.error(`[Orpi] Error fetching page ${page}:`, error);
        break;
      }
    }

    console.log(`[Orpi] Found ${allListings.length} listings total`);
    return allListings;
  }

  private mapToRawListing(item: OrpiListing): RawListing {
    const photos = (item.photos ?? [])
      .map((p) => p.url)
      .filter(Boolean);

    return {
      sourceId: item.id,
      source: 'orpi',
      externalUrl: `https://www.orpi.com/annonce-${item.slug}-${item.id}/`,
      transactionType: item.transactionType === 'louer' ? 'rent' : 'buy',
      type: this.mapPropertyType(item.propertyType),
      title: item.title,
      description: item.description ?? undefined,
      price: item.price,
      surface: item.surface ?? undefined,
      rooms: item.rooms ?? undefined,
      bedrooms: item.bedrooms ?? undefined,
      floor: item.floor ?? null,
      totalFloors: item.floorsQuantity ?? null,
      hasParking: item.hasParking ?? undefined,
      hasElevator: item.hasElevator ?? undefined,
      hasBalcony: item.hasBalcony ?? undefined,
      dpe: item.dpe ?? undefined,
      city: item.city,
      postcode: item.zipcode ?? undefined,
      lat: item.latitude ?? undefined,
      lng: item.longitude ?? undefined,
      images: photos.length > 0 ? photos : undefined,
      publishedAt: item.createdAt ?? undefined,
    };
  }

  private mapPropertyType(type: string): string {
    const mapping: Record<string, string> = {
      appartement: 'apartment',
      maison: 'house',
      terrain: 'land',
      parking: 'parking',
      'local-commercial': 'commercial',
    };
    return mapping[type] || type;
  }
}
