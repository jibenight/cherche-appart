import * as cheerio from 'cheerio';
import { BaseProvider } from './base-provider';
import type { ProviderConfig, SearchParams, RawListing } from './types';

export class EtreProprioProvider extends BaseProvider {
  readonly config: ProviderConfig = {
    name: 'etreproprio',
    enabled: true,
    maxPages: 5,
    delayBetweenRequests: [1500, 3000],
  };

  private buildSearchUrl(params: SearchParams, page: number): string {
    const base = 'https://www.etreproprio.com/recherche/';

    const query = new URLSearchParams();

    // Transaction type
    const transactionMap: Record<string, string> = {
      buy: 'vente',
      rent: 'location',
    };
    query.set('type_transaction', transactionMap[params.transactionType] || 'vente');

    // Location with radius
    query.set('lat', String(params.lat));
    query.set('lng', String(params.lng));
    query.set('rayon', String(params.radiusKm));

    // Property types
    if (params.propertyTypes?.length) {
      const typeMap: Record<string, string> = {
        apartment: 'appartement',
        house: 'maison',
        land: 'terrain',
        commercial: 'commerce',
      };
      const mapped = params.propertyTypes
        .map((t) => typeMap[t])
        .filter(Boolean);
      if (mapped.length) query.set('type_bien', mapped.join(','));
    }

    // Price range
    if (params.priceMin) query.set('prix_min', String(params.priceMin));
    if (params.priceMax) query.set('prix_max', String(params.priceMax));

    // Surface range
    if (params.surfaceMin) query.set('surface_min', String(params.surfaceMin));
    if (params.surfaceMax) query.set('surface_max', String(params.surfaceMax));

    // Minimum rooms
    if (params.minRooms) query.set('pieces_min', String(params.minRooms));

    if (page > 1) query.set('page', String(page));

    return `${base}?${query.toString()}`;
  }

  async search(params: SearchParams): Promise<RawListing[]> {
    const allListings: RawListing[] = [];

    for (let page = 1; page <= this.config.maxPages; page++) {
      const url = this.buildSearchUrl(params, page);
      console.log(`[EtreProprio] Fetching page ${page}...`);

      try {
        const html = await this.fetchHtml(url);
        const listings = this.parseListings(html, params.transactionType);

        if (listings.length === 0) {
          console.log(`[EtreProprio] No listings on page ${page}, stopping.`);
          break;
        }

        allListings.push(...listings);
        console.log(`[EtreProprio] Found ${listings.length} listings on page ${page}`);

        if (page < this.config.maxPages) {
          await this.delay();
        }
      } catch (error) {
        console.error(`[EtreProprio] Error fetching page ${page}:`, error);
        break;
      }
    }

    console.log(`[EtreProprio] Found ${allListings.length} listings total`);
    return allListings;
  }

  private parseListings(html: string, transactionType: string): RawListing[] {
    const $ = cheerio.load(html);
    const listings: RawListing[] = [];

    $('.property-item, .annonce-card, .listing-card, [data-listing-id]').each((_, el) => {
      try {
        const card = $(el);

        const sourceId =
          card.attr('data-listing-id') ||
          card.attr('data-id') ||
          card.find('a[href]').attr('href')?.match(/\/(\d+)/)?.[1] ||
          '';
        if (!sourceId) return;

        const linkEl = card.find('a.property-link, a[href*="/annonce/"], a[href*="/bien/"]').first();
        const href = linkEl.attr('href') || card.find('a').first().attr('href') || '';
        const externalUrl = href.startsWith('http')
          ? href
          : `https://www.etreproprio.com${href}`;

        const title =
          card.find('.property-title, .annonce-title, h2, h3').first().text().trim() || '';

        const priceText = card.find('.property-price, .price, .prix').first().text().trim();
        const price = parseInt(priceText.replace(/[^\d]/g, ''), 10) || 0;
        if (!price) return;

        const surfaceText = card.find('.property-surface, .surface, [data-surface]').first().text().trim();
        const surface = parseFloat(surfaceText.replace(/[^\d.,]/g, '').replace(',', '.')) || undefined;

        const roomsText = card.find('.property-rooms, .rooms, .pieces').first().text().trim();
        const rooms = parseInt(roomsText.replace(/[^\d]/g, ''), 10) || undefined;

        const bedroomsText = card.find('.property-bedrooms, .bedrooms, .chambres').first().text().trim();
        const bedrooms = parseInt(bedroomsText.replace(/[^\d]/g, ''), 10) || undefined;

        const locationText = card.find('.property-location, .location, .ville, .city').first().text().trim();
        const postcodeMatch = locationText.match(/\b(\d{5})\b/);
        const postcode = postcodeMatch?.[1];
        const city = postcode
          ? locationText.replace(postcode, '').replace(/[(),\s]+$/, '').replace(/^[(),\s]+/, '').trim()
          : locationText.split(/[,\-]/)[0]?.trim() || '';

        if (!city) return;

        const images: string[] = [];
        card.find('img[src], img[data-src], img[data-lazy]').each((_, img) => {
          const src = $(img).attr('data-lazy') || $(img).attr('data-src') || $(img).attr('src') || '';
          if (src && !src.includes('placeholder') && !src.includes('data:image')) {
            images.push(src.startsWith('http') ? src : `https://www.etreproprio.com${src}`);
          }
        });

        const dpeEl = card.find('.dpe, .energy-rating, [data-dpe]');
        const dpe = dpeEl.attr('data-dpe') || dpeEl.text().trim().match(/^[A-G]$/)?.[0] || undefined;

        const propertyTypeText = card.find('.property-type, .type-bien').first().text().trim().toLowerCase();
        const typeMap: Record<string, string> = {
          appartement: 'apartment',
          maison: 'house',
          terrain: 'land',
          villa: 'house',
          commerce: 'commercial',
        };

        listings.push({
          sourceId: `etreproprio-${sourceId}`,
          source: 'etreproprio',
          externalUrl,
          transactionType,
          type: typeMap[propertyTypeText] || propertyTypeText || undefined,
          title: title || `Bien immobilier ${city}`,
          price,
          surface,
          rooms,
          bedrooms,
          city,
          postcode,
          images: images.length ? images : undefined,
          dpe,
        });
      } catch {
        // Skip malformed listing cards
      }
    });

    return listings;
  }
}
