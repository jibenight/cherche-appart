import * as cheerio from 'cheerio';
import { BaseProvider } from './base-provider';
import type { ProviderConfig, SearchParams, RawListing } from './types';

export class FnaimPacaProvider extends BaseProvider {
  readonly config: ProviderConfig = {
    name: 'fnaim-paca',
    enabled: true,
    maxPages: 5,
    delayBetweenRequests: [1500, 3000],
  };

  private buildSearchUrl(params: SearchParams, page: number): string {
    const base = 'https://www.fnaim.fr/annonces-immobilieres/';

    const query = new URLSearchParams();

    // Transaction type
    const transactionMap: Record<string, string> = {
      buy: 'achat',
      rent: 'location',
    };
    query.set('transaction', transactionMap[params.transactionType] || 'achat');

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
        commercial: 'local-commercial',
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
    if (params.minRooms) query.set('nb_pieces_min', String(params.minRooms));

    if (page > 1) query.set('page', String(page));

    return `${base}?${query.toString()}`;
  }

  async search(params: SearchParams): Promise<RawListing[]> {
    const allListings: RawListing[] = [];

    for (let page = 1; page <= this.config.maxPages; page++) {
      const url = this.buildSearchUrl(params, page);
      console.log(`[FnaimPaca] Fetching page ${page}...`);

      try {
        const html = await this.fetchHtml(url);
        const listings = this.parseListings(html, params.transactionType);

        if (listings.length === 0) {
          console.log(`[FnaimPaca] No listings on page ${page}, stopping.`);
          break;
        }

        allListings.push(...listings);
        console.log(`[FnaimPaca] Found ${listings.length} listings on page ${page}`);

        if (page < this.config.maxPages) {
          await this.delay();
        }
      } catch (error) {
        console.error(`[FnaimPaca] Error fetching page ${page}:`, error);
        break;
      }
    }

    console.log(`[FnaimPaca] Found ${allListings.length} listings total`);
    return allListings;
  }

  private parseListings(html: string, transactionType: string): RawListing[] {
    const $ = cheerio.load(html);
    const listings: RawListing[] = [];

    $('.annonce-card, .listing-card, .annonce-item, [data-annonce-id]').each((_, el) => {
      try {
        const card = $(el);

        const sourceId =
          card.attr('data-annonce-id') ||
          card.attr('data-id') ||
          card.find('a[href]').attr('href')?.match(/\/(\d+)/)?.[1] ||
          '';
        if (!sourceId) return;

        const linkEl = card.find('a.annonce-link, a[href*="/annonce"]').first();
        const href = linkEl.attr('href') || card.find('a').first().attr('href') || '';
        const externalUrl = href.startsWith('http')
          ? href
          : `https://www.fnaim.fr${href}`;

        const title =
          card.find('.annonce-title, .listing-title, h2, h3').first().text().trim() || '';

        const priceText = card.find('.annonce-price, .price, .prix').first().text().trim();
        const price = parseInt(priceText.replace(/[^\d]/g, ''), 10) || 0;
        if (!price) return;

        const surfaceText = card.find('.annonce-surface, .surface, [data-surface]').first().text().trim();
        const surface = parseFloat(surfaceText.replace(/[^\d.,]/g, '').replace(',', '.')) || undefined;

        const roomsText = card.find('.annonce-rooms, .nb-pieces, .rooms').first().text().trim();
        const rooms = parseInt(roomsText.replace(/[^\d]/g, ''), 10) || undefined;

        const bedroomsText = card.find('.annonce-bedrooms, .nb-chambres, .bedrooms').first().text().trim();
        const bedrooms = parseInt(bedroomsText.replace(/[^\d]/g, ''), 10) || undefined;

        const locationText = card.find('.annonce-location, .location, .ville').first().text().trim();
        const postcodeMatch = locationText.match(/\b(\d{5})\b/);
        const postcode = postcodeMatch?.[1];
        const city = postcode
          ? locationText.replace(postcode, '').replace(/[(),\s]+$/, '').replace(/^[(),\s]+/, '').trim()
          : locationText.split(/[,\-]/)[0]?.trim() || '';

        if (!city) return;

        const images: string[] = [];
        card.find('img[src], img[data-src], img[data-lazy-src]').each((_, img) => {
          const src = $(img).attr('data-lazy-src') || $(img).attr('data-src') || $(img).attr('src') || '';
          if (src && !src.includes('placeholder') && !src.includes('data:image')) {
            images.push(src.startsWith('http') ? src : `https://www.fnaim.fr${src}`);
          }
        });

        const dpeEl = card.find('.dpe, .diagnostic-dpe, [data-dpe]');
        const dpe = dpeEl.attr('data-dpe') || dpeEl.text().trim().match(/^[A-G]$/)?.[0] || undefined;

        const propertyTypeText = card.find('.annonce-type, .type-bien').first().text().trim().toLowerCase();
        const typeMap: Record<string, string> = {
          appartement: 'apartment',
          maison: 'house',
          terrain: 'land',
          villa: 'house',
          'local commercial': 'commercial',
        };

        listings.push({
          sourceId: `fnaim-${sourceId}`,
          source: 'fnaim-paca',
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
