/**
 * Logic-Immo.com Provider
 *
 * Part of the SeLoger/Aviv group (formerly Groupe SeLoger). Logic-Immo
 * shares similar infrastructure and anti-bot measures with SeLoger.
 *
 * Anti-bot challenges:
 * - Token-based API authentication similar to SeLoger
 * - Cloudflare protection with JavaScript challenge
 * - Fingerprinting via the Akamai Bot Manager
 * - Aggressive rate limiting on search endpoints
 *
 * Workaround strategy:
 * - Use Playwright to obtain a valid session token from the Logic-Immo website
 * - Share token management patterns with SeLoger provider
 * - Use residential proxies to rotate IPs
 * - Implement exponential backoff on 429 responses
 */

import { BaseProvider } from './base-provider';
import type { ProviderConfig, SearchParams, RawListing } from './types';

// TODO: Implement automatic token extraction from Logic-Immo frontend
const LOGIC_IMMO_TOKEN = '';
const LOGIC_IMMO_TOKEN_URL = 'https://www.logic-immo.com/api/auth/token';

interface LogicImmoListing {
  id: string;
  reference?: string;
  titre: string;
  description?: string;
  prix: number;
  prixMensuel?: number;
  surface: number;
  nbPieces: number;
  nbChambres?: number;
  etage?: number;
  nbEtages?: number;
  ville: string;
  codePostal: string;
  departement?: string;
  latitude: number;
  longitude: number;
  photos: LogicImmoPhoto[];
  typeBien: string;
  typeTransaction: string;
  dpe?: string;
  ges?: string;
  datePublication: string;
  dateMiseAJour?: string;
  url?: string;
  ascenseur?: boolean;
  parking?: boolean;
  balcon?: boolean;
  terrasse?: boolean;
  cave?: boolean;
  agenceNom?: string;
  agenceId?: string;
}

interface LogicImmoPhoto {
  url: string;
  urlLarge?: string;
  urlThumb?: string;
  ordre: number;
}

interface LogicImmoSearchResponse {
  items: LogicImmoListing[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export class LogicImmoProvider extends BaseProvider {
  readonly config: ProviderConfig = {
    name: 'logic-immo',
    enabled: true,
    maxPages: 3,
    delayBetweenRequests: [3000, 6000],
  };

  private readonly apiBaseUrl = 'https://www.logic-immo.com/api/search';
  private currentToken: string = LOGIC_IMMO_TOKEN;
  private tokenExpiresAt: number = 0;

  async search(params: SearchParams): Promise<RawListing[]> {
    const allListings: RawListing[] = [];

    await this.ensureValidToken();

    for (let page = 1; page <= this.config.maxPages; page++) {
      console.log(`[Logic-Immo] Fetching page ${page}...`);

      try {
        const url = this.buildSearchUrl(params, page);
        const response = await this.fetchJson<LogicImmoSearchResponse>(url, {
          headers: {
            'Authorization': `Bearer ${this.currentToken}`,
            'Origin': 'https://www.logic-immo.com',
            'Referer': 'https://www.logic-immo.com/',
          },
        });

        const listings = this.mapListings(response.items || [], params);
        console.log(`[Logic-Immo] Found ${listings.length} listings on page ${page} (total: ${response.total})`);

        if (listings.length === 0) break;

        allListings.push(...listings);

        if (page >= response.totalPages) break;
        if (page < this.config.maxPages) await this.delay();
      } catch (error) {
        if (this.isAuthError(error) && page === 1) {
          console.warn('[Logic-Immo] Token expired, attempting refresh...');
          try {
            await this.refreshToken();
            continue;
          } catch (refreshError) {
            console.error('[Logic-Immo] Token refresh failed:', refreshError);
            break;
          }
        }

        console.error(`[Logic-Immo] Error fetching page ${page}:`, error);
        break;
      }
    }

    console.log(`[Logic-Immo] Total listings collected: ${allListings.length}`);
    return allListings;
  }

  private buildSearchUrl(params: SearchParams, page: number): string {
    const queryParams = new URLSearchParams();

    // Transaction type: achat / location
    queryParams.set('type_transaction', params.transactionType === 'buy' ? 'achat' : 'location');

    // Location by coordinates
    queryParams.set('lat', String(params.lat));
    queryParams.set('lng', String(params.lng));
    queryParams.set('rayon', String(params.radiusKm));

    // Property types
    if (params.propertyTypes && params.propertyTypes.length > 0) {
      const typeMap: Record<string, string> = {
        apartment: 'appartement',
        house: 'maison',
        land: 'terrain',
        parking: 'parking',
        commercial: 'commerce',
      };
      const mapped = params.propertyTypes
        .map((t) => typeMap[t])
        .filter(Boolean);
      if (mapped.length > 0) {
        queryParams.set('type_bien', mapped.join(','));
      }
    }

    // Price range
    if (params.priceMin) queryParams.set('prix_min', String(params.priceMin));
    if (params.priceMax) queryParams.set('prix_max', String(params.priceMax));

    // Surface range
    if (params.surfaceMin) queryParams.set('surface_min', String(params.surfaceMin));
    if (params.surfaceMax) queryParams.set('surface_max', String(params.surfaceMax));

    // Rooms
    if (params.minRooms) queryParams.set('nb_pieces_min', String(params.minRooms));

    // Pagination
    queryParams.set('page', String(page));
    queryParams.set('limit', '25');

    // Sort
    queryParams.set('tri', 'date_desc');

    return `${this.apiBaseUrl}?${queryParams.toString()}`;
  }

  private mapListings(items: LogicImmoListing[], params: SearchParams): RawListing[] {
    return items
      .map((item) => this.mapItemToListing(item, params))
      .filter((listing): listing is RawListing => listing !== null);
  }

  private mapItemToListing(item: LogicImmoListing, params: SearchParams): RawListing | null {
    try {
      const price = params.transactionType === 'rent'
        ? (item.prixMensuel || item.prix)
        : item.prix;

      if (!price || price <= 0) return null;

      const externalUrl = item.url
        || `https://www.logic-immo.com/detail-${params.transactionType === 'buy' ? 'vente' : 'location'}-${item.id}.htm`;

      return {
        sourceId: item.id,
        source: 'logic-immo',
        externalUrl,
        transactionType: params.transactionType === 'buy' ? 'vente' : 'location',
        type: item.typeBien,
        title: item.titre,
        description: item.description,
        price,
        surface: item.surface,
        rooms: item.nbPieces,
        bedrooms: item.nbChambres,
        floor: item.etage ?? null,
        totalFloors: item.nbEtages ?? null,
        hasParking: item.parking,
        hasElevator: item.ascenseur,
        hasBalcony: item.balcon || item.terrasse,
        dpe: item.dpe,
        city: item.ville,
        postcode: item.codePostal,
        lat: item.latitude,
        lng: item.longitude,
        images: this.buildImageUrls(item.photos),
        publishedAt: item.datePublication,
      };
    } catch (error) {
      console.warn('[Logic-Immo] Error mapping listing:', item.id, error);
      return null;
    }
  }

  private buildImageUrls(photos: LogicImmoPhoto[]): string[] | undefined {
    if (!photos || photos.length === 0) return undefined;

    return photos
      .sort((a, b) => a.ordre - b.ordre)
      .map((photo) => photo.urlLarge || photo.url)
      .filter(Boolean);
  }

  /**
   * Ensures we have a valid auth token.
   * TODO: In production, implement proper token extraction from Logic-Immo
   * using Playwright to intercept the auth flow.
   */
  private async ensureValidToken(): Promise<void> {
    if (this.currentToken && Date.now() < this.tokenExpiresAt) {
      return;
    }
    await this.refreshToken();
  }

  /**
   * Refreshes the auth token.
   * TODO: Implement actual token refresh by:
   * 1. Loading logic-immo.com in a headless browser
   * 2. Passing the Akamai Bot Manager challenge
   * 3. Extracting the session token from cookies or response headers
   * 4. Caching it for reuse across requests
   */
  private async refreshToken(): Promise<void> {
    console.log('[Logic-Immo] Refreshing auth token...');

    try {
      // TODO: Replace with real token extraction logic
      // The Logic-Immo API uses a similar token mechanism as SeLoger.
      // Expected flow:
      //
      // const browser = await playwright.chromium.launch({ headless: true });
      // const page = await browser.newPage();
      // await page.goto('https://www.logic-immo.com');
      // // Wait for Akamai challenge to resolve
      // await page.waitForSelector('[data-search]', { timeout: 15000 });
      // const cookies = await page.context().cookies();
      // const sessionCookie = cookies.find(c => c.name === '_abck' || c.name === 'session_id');
      // this.currentToken = sessionCookie?.value || '';
      // await browser.close();

      const response = await this.fetchJson<{ token: string; expiresIn: number }>(
        LOGIC_IMMO_TOKEN_URL,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://www.logic-immo.com',
          },
          body: JSON.stringify({
            // TODO: Add required credentials
            grant_type: 'client_credentials',
          }),
        }
      );

      this.currentToken = response.token;
      this.tokenExpiresAt = Date.now() + (response.expiresIn - 300) * 1000;

      console.log('[Logic-Immo] Token refreshed successfully');
    } catch (error) {
      console.error('[Logic-Immo] Failed to refresh token:', error);
      if (LOGIC_IMMO_TOKEN) {
        this.currentToken = LOGIC_IMMO_TOKEN;
        this.tokenExpiresAt = Date.now() + 30 * 60 * 1000;
        console.warn('[Logic-Immo] Using fallback hardcoded token');
      } else {
        throw new Error('Logic-Immo: No valid auth token available');
      }
    }
  }

  private isAuthError(error: unknown): boolean {
    if (error instanceof Error) {
      return error.message.includes('401') || error.message.includes('403');
    }
    return false;
  }
}
