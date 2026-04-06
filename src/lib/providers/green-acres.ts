import * as cheerio from 'cheerio';
import { BaseProvider } from './base-provider';
import type { ProviderConfig, SearchParams, RawListing } from './types';

export class GreenAcresProvider extends BaseProvider {
  readonly config: ProviderConfig = {
    name: 'green-acres',
    enabled: true,
    maxPages: 5,
    delayBetweenRequests: [1500, 3000],
  };

  private buildSearchUrl(params: SearchParams, page: number): string {
    const transactionType = params.transactionType === 'buy' ? 'sale' : 'rent';
    const base = `https://www.green-acres.fr/properties/${transactionType}`;

    const query = new URLSearchParams();

    if (params.priceMin) query.set('price_min', String(params.priceMin));
    if (params.priceMax) query.set('price_max', String(params.priceMax));
    if (params.surfaceMin) query.set('surface_min', String(params.surfaceMin));
    if (params.surfaceMax) query.set('surface_max', String(params.surfaceMax));
    if (params.minRooms) query.set('rooms_min', String(params.minRooms));

    if (params.propertyTypes?.length) {
      const typeMap: Record<string, string> = {
        apartment: 'apartment',
        house: 'house',
        land: 'land',
        commercial: 'commercial',
      };
      const mapped = params.propertyTypes
        .map((t) => typeMap[t])
        .filter(Boolean);
      if (mapped.length) query.set('type', mapped.join(','));
    }

    // Location: lat/lng with radius
    query.set('lat', String(params.lat));
    query.set('lng', String(params.lng));
    query.set('radius', String(params.radiusKm));

    if (page > 1) query.set('page', String(page));

    const qs = query.toString();
    return qs ? `${base}?${qs}` : base;
  }

  async search(params: SearchParams): Promise<RawListing[]> {
    const allListings: RawListing[] = [];

    for (let page = 1; page <= this.config.maxPages; page++) {
      const url = this.buildSearchUrl(params, page);
      console.log(`[GreenAcres] Fetching page ${page}...`);

      try {
        const html = await this.fetchHtml(url);
        const listings = this.parseListings(html, params.transactionType);

        if (listings.length === 0) {
          console.log(`[GreenAcres] No listings on page ${page}, stopping.`);
          break;
        }

        allListings.push(...listings);
        console.log(`[GreenAcres] Found ${listings.length} listings on page ${page}`);

        if (page < this.config.maxPages) {
          await this.delay();
        }
      } catch (error) {
        console.error(`[GreenAcres] Error fetching page ${page}:`, error);
        break;
      }
    }

    console.log(`[GreenAcres] Found ${allListings.length} listings total`);
    return allListings;
  }

  private parseListings(html: string, transactionType: string): RawListing[] {
    const $ = cheerio.load(html);
    const listings: RawListing[] = [];

    $('.property-card, .listing-item, [data-property-id]').each((_, el) => {
      try {
        const card = $(el);

        const sourceId =
          card.attr('data-property-id') ||
          card.attr('data-id') ||
          card.find('a[href]').attr('href')?.match(/\/(\d+)/)?.[1] ||
          '';
        if (!sourceId) return;

        const linkEl = card.find('a.property-link, a[href*="/properties/"]').first();
        const href = linkEl.attr('href') || '';
        const externalUrl = href.startsWith('http')
          ? href
          : `https://www.green-acres.fr${href}`;

        const title =
          card.find('.property-title, .listing-title, h2, h3').first().text().trim() || '';

        const priceText = card.find('.property-price, .price').first().text().trim();
        const price = parseInt(priceText.replace(/[^\d]/g, ''), 10) || 0;
        if (!price) return;

        const surfaceText = card.find('.property-surface, .surface, [data-surface]').first().text().trim();
        const surface = parseFloat(surfaceText.replace(/[^\d.,]/g, '').replace(',', '.')) || undefined;

        const roomsText = card.find('.property-rooms, .rooms, [data-rooms]').first().text().trim();
        const rooms = parseInt(roomsText.replace(/[^\d]/g, ''), 10) || undefined;

        const bedroomsText = card.find('.property-bedrooms, .bedrooms, [data-bedrooms]').first().text().trim();
        const bedrooms = parseInt(bedroomsText.replace(/[^\d]/g, ''), 10) || undefined;

        const locationText = card.find('.property-location, .location, .city').first().text().trim();
        const locationParts = locationText.split(/[\s,]+/);
        const postcodeMatch = locationText.match(/\b(\d{5})\b/);
        const postcode = postcodeMatch?.[1];
        const city = postcode
          ? locationText.replace(postcode, '').replace(/[,\s]+$/, '').trim()
          : locationParts[0] || '';

        if (!city) return;

        const images: string[] = [];
        card.find('img[src], img[data-src]').each((_, img) => {
          const src = $(img).attr('data-src') || $(img).attr('src') || '';
          if (src && !src.includes('placeholder') && !src.includes('data:image')) {
            images.push(src.startsWith('http') ? src : `https://www.green-acres.fr${src}`);
          }
        });

        const dpeEl = card.find('.dpe, .energy-class, [data-dpe]');
        const dpe = dpeEl.attr('data-dpe') || dpeEl.text().trim().match(/^[A-G]$/)?.[0] || undefined;

        const propertyType = card.find('.property-type, .type').first().text().trim().toLowerCase();
        const typeMap: Record<string, string> = {
          appartement: 'apartment',
          maison: 'house',
          terrain: 'land',
          villa: 'house',
        };

        listings.push({
          sourceId: `green-acres-${sourceId}`,
          source: 'green-acres',
          externalUrl,
          transactionType,
          type: typeMap[propertyType] || propertyType || undefined,
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
