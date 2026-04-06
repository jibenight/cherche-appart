import { BaseProvider } from './base-provider';
import type { ProviderConfig, SearchParams, RawListing } from './types';

interface BieniciAd {
  id: string;
  adType: string;
  propertyType: string;
  title: string;
  description: string;
  price: number;
  surfaceArea: number;
  roomsQuantity: number;
  bedroomsQuantity: number;
  floor: number | null;
  floorsQuantity: number | null;
  hasParking: boolean;
  hasElevator: boolean;
  hasBalcony: boolean;
  energyClassification: string;
  city: string;
  postalCode: string;
  photos: { url: string }[];
  blurredPhotos?: { url: string }[];
  newPhotos?: { url: string }[];
  position: { lat: number; lng: number } | null;
  publicationDate: string;
}

interface BieniciResponse {
  realEstateAds: BieniciAd[];
  total: number;
}

function computeBounds(lat: number, lng: number, radiusKm: number) {
  // 1 degree latitude ~ 111.32 km
  const latDelta = radiusKm / 111.32;
  // 1 degree longitude varies with latitude
  const lngDelta = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));

  return {
    southWest: { lat: lat - latDelta, lng: lng - lngDelta },
    northEast: { lat: lat + latDelta, lng: lng + lngDelta },
  };
}

function mapTransactionType(type: 'buy' | 'rent'): string {
  return type === 'buy' ? 'buy' : 'rent';
}

function mapPropertyTypes(types?: string[]): string[] | undefined {
  if (!types || types.length === 0) return undefined;

  const mapping: Record<string, string> = {
    apartment: 'flat',
    house: 'house',
    studio: 'flat',
    loft: 'loft',
    land: 'terrain',
    parking: 'parking',
    commercial: 'commercial',
  };

  return types.map((t) => mapping[t] || t);
}

export class BieniciProvider extends BaseProvider {
  readonly config: ProviderConfig = {
    name: 'bienici',
    enabled: true,
    maxPages: 5,
    delayBetweenRequests: [2000, 4000],
  };

  async search(params: SearchParams): Promise<RawListing[]> {
    const allListings: RawListing[] = [];
    const pageSize = 24;
    const bounds = computeBounds(params.lat, params.lng, params.radiusKm);

    for (let page = 1; page <= this.config.maxPages; page++) {
      console.log(`[BienIci] Fetching page ${page}...`);

      const body: Record<string, unknown> = {
        filters: {
          filterType: mapTransactionType(params.transactionType),
          propertyType: mapPropertyTypes(params.propertyTypes) ?? ['flat', 'house'],
          minPrice: params.priceMin ?? undefined,
          maxPrice: params.priceMax ?? undefined,
          minArea: params.surfaceMin ?? undefined,
          maxArea: params.surfaceMax ?? undefined,
          minRooms: params.minRooms ?? undefined,
        },
        from: (page - 1) * pageSize,
        size: pageSize,
        sortBy: 'relevance',
        sortOrder: 'desc',
        zoneIdsByTypes: {
          zoneIds: [],
        },
        bounds: {
          southWest: bounds.southWest,
          northEast: bounds.northEast,
        },
      };

      try {
        const data = await this.fetchJson<BieniciResponse>(
          'https://www.bienici.com/realEstateAds.json',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          }
        );

        const ads = data.realEstateAds ?? [];

        if (ads.length === 0) {
          console.log(`[BienIci] No more results at page ${page}, stopping.`);
          break;
        }

        const listings = ads.map((ad) => this.mapToRawListing(ad));
        allListings.push(...listings);

        console.log(`[BienIci] Found ${ads.length} listings on page ${page} (total: ${allListings.length})`);

        // Stop if we've fetched all available results
        if (allListings.length >= data.total) {
          break;
        }

        if (page < this.config.maxPages) {
          await this.delay();
        }
      } catch (error) {
        console.error(`[BienIci] Error fetching page ${page}:`, error);
        break;
      }
    }

    console.log(`[BienIci] Found ${allListings.length} listings total`);
    return allListings;
  }

  private mapToRawListing(ad: BieniciAd): RawListing {
    const photos = (ad.photos ?? ad.newPhotos ?? ad.blurredPhotos ?? [])
      .map((p) => p.url)
      .filter(Boolean);

    return {
      sourceId: ad.id,
      source: 'bienici',
      externalUrl: `https://www.bienici.com/annonce/${ad.adType === 'rent' ? 'location' : 'achat'}/${ad.id}`,
      transactionType: ad.adType === 'rent' ? 'rent' : 'buy',
      type: this.mapPropertyType(ad.propertyType),
      title: ad.title,
      description: ad.description ?? undefined,
      price: ad.price,
      surface: ad.surfaceArea ?? undefined,
      rooms: ad.roomsQuantity ?? undefined,
      bedrooms: ad.bedroomsQuantity ?? undefined,
      floor: ad.floor ?? null,
      totalFloors: ad.floorsQuantity ?? null,
      hasParking: ad.hasParking ?? undefined,
      hasElevator: ad.hasElevator ?? undefined,
      hasBalcony: ad.hasBalcony ?? undefined,
      dpe: ad.energyClassification ?? undefined,
      city: ad.city,
      postcode: ad.postalCode ?? undefined,
      lat: ad.position?.lat ?? undefined,
      lng: ad.position?.lng ?? undefined,
      images: photos.length > 0 ? photos : undefined,
      publishedAt: ad.publicationDate ?? undefined,
    };
  }

  private mapPropertyType(type: string): string {
    const mapping: Record<string, string> = {
      flat: 'apartment',
      house: 'house',
      loft: 'loft',
      terrain: 'land',
      parking: 'parking',
      commercial: 'commercial',
    };
    return mapping[type] || type;
  }
}
