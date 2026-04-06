/**
 * Leboncoin.fr Provider
 *
 * France's largest classifieds platform. Leboncoin uses Datadome anti-bot
 * protection which requires a valid datadome cookie to access the API.
 *
 * Anti-bot challenges:
 * - Datadome bot detection (JavaScript challenge + cookie validation)
 * - API requires a valid `datadome` cookie obtained after solving the JS challenge
 * - The public `api_key` header is required but rotates periodically
 *
 * Workaround strategy:
 * - In production, use Playwright/Puppeteer to load leboncoin.fr in a headless
 *   browser, solve the Datadome challenge, then extract the `datadome` cookie
 *   and reuse it for subsequent API requests until it expires.
 * - Alternatively, use a residential proxy service that handles Datadome bypass.
 * - The cookie typically lasts 20-30 minutes before needing refresh.
 */

import { BaseProvider } from './base-provider';
import type { ProviderConfig, SearchParams, RawListing } from './types';

// TODO: Replace with dynamically extracted API key from leboncoin.fr frontend bundle
const LEBONCOIN_API_KEY = 'ba0c2dad52b3ec';

// TODO: Replace with Playwright-based cookie extraction
const DATADOME_COOKIE = '';

interface LeboncoinAd {
  list_id: number;
  subject: string;
  body?: string;
  price: number[];
  url: string;
  category_id: string;
  first_publication_date: string;
  attributes: LeboncoinAttribute[];
  location: {
    city: string;
    zipcode: string;
    lat: number;
    lng: number;
    department_name?: string;
    region_name?: string;
  };
  images: {
    thumb_url: string;
    small_url: string;
    nb_images: number;
    urls: string[];
    urls_thumb: string[];
    urls_large: string[];
  };
  owner: {
    store_id?: string;
    user_id: string;
    type: string;
    name: string;
  };
}

interface LeboncoinAttribute {
  key: string;
  value: string;
  value_label: string;
  generic: boolean;
}

interface LeboncoinSearchResponse {
  ads: LeboncoinAd[];
  total: number;
  total_all: number;
}

interface LeboncoinSearchBody {
  filters: {
    category: { id: string };
    enums?: Record<string, string[]>;
    location: {
      locations: Array<{
        locationType: string;
        lat: number;
        lng: number;
        radius: number;
      }>;
    };
    keywords?: { text?: string };
    ranges: Record<string, { min?: number; max?: number }>;
  };
  limit: number;
  offset: number;
  sort_by: string;
  sort_order: string;
}

export class LeboncoinProvider extends BaseProvider {
  readonly config: ProviderConfig = {
    name: 'leboncoin',
    enabled: true,
    maxPages: 3,
    delayBetweenRequests: [3000, 6000],
  };

  private readonly apiUrl = 'https://api.leboncoin.fr/finder/search';
  private readonly pageSize = 35;

  async search(params: SearchParams): Promise<RawListing[]> {
    const allListings: RawListing[] = [];

    for (let page = 1; page <= this.config.maxPages; page++) {
      console.log(`[Leboncoin] Fetching page ${page}...`);

      try {
        const body = this.buildRequestBody(params, page);
        const response = await this.fetchJson<LeboncoinSearchResponse>(
          this.apiUrl,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'api_key': LEBONCOIN_API_KEY,
              'Origin': 'https://www.leboncoin.fr',
              'Referer': 'https://www.leboncoin.fr/',
              // TODO: Add datadome cookie once Playwright extraction is implemented
              ...(DATADOME_COOKIE ? { 'Cookie': `datadome=${DATADOME_COOKIE}` } : {} as Record<string, string>),
            },
            body: JSON.stringify(body),
          }
        );

        const listings = this.mapListings(response.ads || [], params);
        console.log(`[Leboncoin] Found ${listings.length} listings on page ${page} (total available: ${response.total})`);

        if (listings.length === 0) break;

        allListings.push(...listings);

        if (page < this.config.maxPages && allListings.length < response.total) {
          await this.delay();
        } else {
          break;
        }
      } catch (error) {
        console.error(`[Leboncoin] Error fetching page ${page}:`, error);
        break;
      }
    }

    console.log(`[Leboncoin] Total listings collected: ${allListings.length}`);
    return allListings;
  }

  private buildRequestBody(params: SearchParams, page: number): LeboncoinSearchBody {
    // Category 9 = vente immobiliere, 10 = location immobiliere
    const categoryId = params.transactionType === 'buy' ? '9' : '10';

    const ranges: Record<string, { min?: number; max?: number }> = {};

    if (params.priceMin || params.priceMax) {
      ranges.price = {};
      if (params.priceMin) ranges.price.min = params.priceMin;
      if (params.priceMax) ranges.price.max = params.priceMax;
    }

    if (params.surfaceMin || params.surfaceMax) {
      ranges.square = {};
      if (params.surfaceMin) ranges.square.min = params.surfaceMin;
      if (params.surfaceMax) ranges.square.max = params.surfaceMax;
    }

    if (params.minRooms) {
      ranges.rooms = { min: params.minRooms };
    }

    const enums: Record<string, string[]> = {};
    if (params.propertyTypes && params.propertyTypes.length > 0) {
      // Leboncoin real_estate_type: 1=Maison, 2=Appartement, 3=Terrain, 4=Parking, 5=Autre
      const typeMap: Record<string, string> = {
        house: '1',
        apartment: '2',
        land: '3',
        parking: '4',
      };
      const mapped = params.propertyTypes
        .map((t) => typeMap[t])
        .filter(Boolean);
      if (mapped.length > 0) {
        enums.real_estate_type = mapped;
      }
    }

    return {
      filters: {
        category: { id: categoryId },
        ...(Object.keys(enums).length > 0 && { enums }),
        location: {
          locations: [
            {
              locationType: 'coordinates',
              lat: params.lat,
              lng: params.lng,
              radius: params.radiusKm * 1000, // Leboncoin uses meters
            },
          ],
        },
        keywords: {},
        ranges,
      },
      limit: this.pageSize,
      offset: (page - 1) * this.pageSize,
      sort_by: 'time',
      sort_order: 'desc',
    };
  }

  private mapListings(ads: LeboncoinAd[], params: SearchParams): RawListing[] {
    return ads
      .map((ad) => this.mapAdToListing(ad, params))
      .filter((listing): listing is RawListing => listing !== null);
  }

  private mapAdToListing(ad: LeboncoinAd, params: SearchParams): RawListing | null {
    try {
      const price = ad.price?.[0];
      if (!price) return null;

      const attrs = this.parseAttributes(ad.attributes || []);

      return {
        sourceId: String(ad.list_id),
        source: 'leboncoin',
        externalUrl: ad.url
          ? (ad.url.startsWith('http') ? ad.url : `https://www.leboncoin.fr${ad.url}`)
          : `https://www.leboncoin.fr/ad/ventes_immobilieres/${ad.list_id}`,
        transactionType: params.transactionType === 'buy' ? 'vente' : 'location',
        type: attrs.real_estate_type,
        title: ad.subject,
        description: ad.body,
        price,
        surface: attrs.square ? parseFloat(attrs.square) : undefined,
        rooms: attrs.rooms ? parseInt(attrs.rooms, 10) : undefined,
        bedrooms: attrs.bedrooms ? parseInt(attrs.bedrooms, 10) : undefined,
        floor: attrs.floor ? parseInt(attrs.floor, 10) : undefined,
        hasParking: attrs.parking === '1',
        hasElevator: attrs.elevator === '1',
        dpe: attrs.energy_rate || undefined,
        city: ad.location?.city || '',
        postcode: ad.location?.zipcode,
        lat: ad.location?.lat,
        lng: ad.location?.lng,
        images: ad.images?.urls_large?.length
          ? ad.images.urls_large
          : ad.images?.urls,
        publishedAt: ad.first_publication_date,
      };
    } catch (error) {
      console.warn('[Leboncoin] Error mapping ad:', ad.list_id, error);
      return null;
    }
  }

  private parseAttributes(
    attributes: LeboncoinAttribute[]
  ): Record<string, string> {
    const map: Record<string, string> = {};
    for (const attr of attributes) {
      map[attr.key] = attr.value;
    }
    return map;
  }
}
