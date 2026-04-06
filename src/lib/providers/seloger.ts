/**
 * SeLoger.com Provider
 *
 * Major French real estate portal owned by Axel Springer. SeLoger uses
 * token-based authentication for its API, along with aggressive bot detection.
 *
 * Anti-bot challenges:
 * - API requires a Bearer token obtained from their authentication endpoint
 * - Token expires frequently and needs periodic refresh
 * - Cloudflare protection on the website
 * - Rate limiting with IP-based throttling
 *
 * Workaround strategy:
 * - Extract the initial auth token from the SeLoger website's JavaScript bundle
 *   or by intercepting network requests using Playwright
 * - Implement token refresh logic to keep the session alive
 * - Use residential proxies to avoid IP-based blocking
 * - In development, a manually obtained token can be used (valid for ~1 hour)
 */

import { BaseProvider } from './base-provider';
import type { ProviderConfig, SearchParams, RawListing } from './types';

// TODO: Implement automatic token extraction from SeLoger frontend
const SELOGER_TOKEN = '';
const SELOGER_TOKEN_URL = 'https://www.seloger.com/auth/token';

interface SeLogerListing {
  id: number;
  idAnnonce?: number;
  titre?: string;
  descriptif?: string;
  prix: number;
  prixUnite?: string;
  surface: number;
  nbPieces?: number;
  nbChambres?: number;
  etage?: number;
  nbEtages?: number;
  ville: string;
  cp: string;
  codeInsee?: string;
  latitude: number;
  longitude: number;
  photos: string[];
  photoPrincipale?: string;
  etiquetteDpe?: string;
  classeEnergie?: string;
  ges?: string;
  typeBien?: string;
  typeTransaction?: string;
  datePublication?: string;
  dateFraicheur?: string;
  urlDetailAnnonce?: string;
  permaLien?: string;
  ascenseur?: boolean;
  parking?: boolean;
  balcon?: boolean;
  idAgence?: number;
  nomAgence?: string;
}

interface SeLogerSearchResponse {
  items: SeLogerListing[];
  nbTotalResults: number;
  nbPages: number;
  currentPage: number;
}

export class SeLogerProvider extends BaseProvider {
  readonly config: ProviderConfig = {
    name: 'seloger',
    enabled: true,
    maxPages: 3,
    delayBetweenRequests: [3000, 6000],
  };

  private readonly apiBaseUrl = 'https://www.seloger.com/api/v1/listings';
  private currentToken: string = SELOGER_TOKEN;
  private tokenExpiresAt: number = 0;

  async search(params: SearchParams): Promise<RawListing[]> {
    const allListings: RawListing[] = [];

    // Ensure we have a valid token before starting
    await this.ensureValidToken();

    for (let page = 1; page <= this.config.maxPages; page++) {
      console.log(`[SeLoger] Fetching page ${page}...`);

      try {
        const url = this.buildSearchUrl(params, page);
        const response = await this.fetchJson<SeLogerSearchResponse>(url, {
          headers: {
            'Authorization': `Bearer ${this.currentToken}`,
            'Origin': 'https://www.seloger.com',
            'Referer': 'https://www.seloger.com/',
          },
        });

        const listings = this.mapListings(response.items || [], params);
        console.log(`[SeLoger] Found ${listings.length} listings on page ${page} (total: ${response.nbTotalResults})`);

        if (listings.length === 0) break;

        allListings.push(...listings);

        if (page >= response.nbPages) break;
        if (page < this.config.maxPages) await this.delay();
      } catch (error) {
        // If unauthorized, try refreshing the token once
        if (this.isAuthError(error) && page === 1) {
          console.warn('[SeLoger] Token expired, attempting refresh...');
          try {
            await this.refreshToken();
            // Retry this page
            continue;
          } catch (refreshError) {
            console.error('[SeLoger] Token refresh failed:', refreshError);
            break;
          }
        }

        console.error(`[SeLoger] Error fetching page ${page}:`, error);
        break;
      }
    }

    console.log(`[SeLoger] Total listings collected: ${allListings.length}`);
    return allListings;
  }

  private buildSearchUrl(params: SearchParams, page: number): string {
    const queryParams = new URLSearchParams();

    // Transaction type: 1 = buy, 2 = rent
    queryParams.set('transactionType', params.transactionType === 'buy' ? '1' : '2');

    // Location: lat/lng with radius
    queryParams.set('latitude', String(params.lat));
    queryParams.set('longitude', String(params.lng));
    queryParams.set('radius', String(params.radiusKm));

    // Property types mapping
    if (params.propertyTypes && params.propertyTypes.length > 0) {
      const typeMap: Record<string, string> = {
        apartment: '1',
        house: '2',
        land: '4',
        parking: '3',
        commercial: '6',
      };
      const mapped = params.propertyTypes
        .map((t) => typeMap[t])
        .filter(Boolean);
      if (mapped.length > 0) {
        queryParams.set('propertyTypes', mapped.join(','));
      }
    }

    // Price range
    if (params.priceMin) queryParams.set('priceMin', String(params.priceMin));
    if (params.priceMax) queryParams.set('priceMax', String(params.priceMax));

    // Surface range
    if (params.surfaceMin) queryParams.set('surfaceMin', String(params.surfaceMin));
    if (params.surfaceMax) queryParams.set('surfaceMax', String(params.surfaceMax));

    // Rooms
    if (params.minRooms) queryParams.set('nbPiecesMin', String(params.minRooms));

    // Pagination
    queryParams.set('page', String(page));
    queryParams.set('pageSize', '25');

    // Sort by newest first
    queryParams.set('sortBy', 'date');
    queryParams.set('sortOrder', 'desc');

    return `${this.apiBaseUrl}?${queryParams.toString()}`;
  }

  private mapListings(items: SeLogerListing[], params: SearchParams): RawListing[] {
    return items
      .map((item) => this.mapItemToListing(item, params))
      .filter((listing): listing is RawListing => listing !== null);
  }

  private mapItemToListing(item: SeLogerListing, params: SearchParams): RawListing | null {
    try {
      if (!item.prix || item.prix <= 0) return null;

      const id = item.idAnnonce || item.id;
      const externalUrl = item.permaLien
        || item.urlDetailAnnonce
        || `https://www.seloger.com/annonces/achat/appartement/${item.cp}/${id}.htm`;

      return {
        sourceId: String(id),
        source: 'seloger',
        externalUrl,
        transactionType: params.transactionType === 'buy' ? 'vente' : 'location',
        type: item.typeBien,
        title: item.titre || `${item.typeBien || 'Bien'} ${item.nbPieces || ''}p - ${item.ville}`,
        description: item.descriptif,
        price: item.prix,
        surface: item.surface,
        rooms: item.nbPieces,
        bedrooms: item.nbChambres,
        floor: item.etage ?? null,
        totalFloors: item.nbEtages ?? null,
        hasParking: item.parking,
        hasElevator: item.ascenseur,
        hasBalcony: item.balcon,
        dpe: item.etiquetteDpe || item.classeEnergie,
        city: item.ville,
        postcode: item.cp,
        lat: item.latitude,
        lng: item.longitude,
        images: this.buildImageUrls(item),
        publishedAt: item.datePublication || item.dateFraicheur,
      };
    } catch (error) {
      console.warn('[SeLoger] Error mapping listing:', item.id, error);
      return null;
    }
  }

  private buildImageUrls(item: SeLogerListing): string[] | undefined {
    const photos = item.photos || [];
    if (item.photoPrincipale && !photos.includes(item.photoPrincipale)) {
      photos.unshift(item.photoPrincipale);
    }
    return photos.length > 0 ? photos : undefined;
  }

  /**
   * Ensures we have a valid auth token.
   * TODO: In production, implement proper token extraction from SeLoger frontend
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
   * 1. Loading SeLoger.com in a headless browser
   * 2. Intercepting the token from the JavaScript bundle or auth API call
   * 3. Extracting the Bearer token from response headers or localStorage
   */
  private async refreshToken(): Promise<void> {
    console.log('[SeLoger] Refreshing auth token...');

    try {
      // TODO: Replace with real token extraction logic
      // This is a placeholder that shows the expected flow:
      //
      // const browser = await playwright.chromium.launch({ headless: true });
      // const page = await browser.newPage();
      // await page.goto('https://www.seloger.com');
      // const token = await page.evaluate(() => {
      //   return localStorage.getItem('auth_token') || window.__SELOGER_TOKEN__;
      // });
      // await browser.close();

      const response = await this.fetchJson<{ token: string; expiresIn: number }>(
        SELOGER_TOKEN_URL,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://www.seloger.com',
          },
          body: JSON.stringify({
            // TODO: Add required credentials/client_id
            grant_type: 'client_credentials',
          }),
        }
      );

      this.currentToken = response.token;
      // Set expiry with a 5-minute safety margin
      this.tokenExpiresAt = Date.now() + (response.expiresIn - 300) * 1000;

      console.log('[SeLoger] Token refreshed successfully');
    } catch (error) {
      console.error('[SeLoger] Failed to refresh token:', error);
      // Fall back to the hardcoded token if available
      if (SELOGER_TOKEN) {
        this.currentToken = SELOGER_TOKEN;
        this.tokenExpiresAt = Date.now() + 30 * 60 * 1000; // assume 30 min
        console.warn('[SeLoger] Using fallback hardcoded token');
      } else {
        throw new Error('SeLoger: No valid auth token available');
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
