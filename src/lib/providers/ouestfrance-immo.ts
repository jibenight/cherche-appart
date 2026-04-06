import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';
import { BaseProvider } from './base-provider';
import type { ProviderConfig, SearchParams, RawListing } from './types';

export class OuestFranceImmoProvider extends BaseProvider {
  readonly config: ProviderConfig = {
    name: 'ouestfrance-immo',
    enabled: true,
    maxPages: 5,
    delayBetweenRequests: [1500, 3000],
  };

  async search(params: SearchParams): Promise<RawListing[]> {
    const allListings: RawListing[] = [];

    for (let page = 1; page <= this.config.maxPages; page++) {
      console.log(`[OuestFrance-Immo] Fetching page ${page}...`);

      const url = this.buildSearchUrl(params, page);

      try {
        const html = await this.fetchHtml(url);
        const listings = this.parseListings(html, params);

        console.log(`[OuestFrance-Immo] Found ${listings.length} listings on page ${page}`);

        if (listings.length === 0) break;

        allListings.push(...listings);
        if (page < this.config.maxPages) await this.delay();
      } catch (error) {
        console.error(`[OuestFrance-Immo] Error fetching page ${page}:`, error);
        break;
      }
    }

    return allListings;
  }

  private buildSearchUrl(params: SearchParams, page: number): string {
    const transaction = params.transactionType === 'buy' ? 'vente' : 'location';
    const propertyType = this.mapPropertyType(params.propertyTypes?.[0]);

    // OuestFrance-Immo uses slug-based URLs: /vente/appartement/rennes-35000
    const citySlug = 'rennes'; // Placeholder - would be resolved from lat/lng
    const postcode = '35000';

    let url = `https://www.ouestfrance-immo.com/${transaction}/${propertyType}/${citySlug}-${postcode}`;

    // Build query params for filters
    const queryParams = new URLSearchParams();

    if (params.priceMin) queryParams.set('prix_min', params.priceMin.toString());
    if (params.priceMax) queryParams.set('prix_max', params.priceMax.toString());
    if (params.surfaceMin) queryParams.set('surface_min', params.surfaceMin.toString());
    if (params.surfaceMax) queryParams.set('surface_max', params.surfaceMax.toString());
    if (params.minRooms) queryParams.set('nb_pieces_min', params.minRooms.toString());
    if (params.radiusKm) queryParams.set('rayon', params.radiusKm.toString());
    if (page > 1) queryParams.set('page', page.toString());

    const qs = queryParams.toString();
    if (qs) url += `?${qs}`;

    return url;
  }

  private mapPropertyType(type?: string): string {
    switch (type) {
      case 'house': return 'maison';
      case 'land': return 'terrain';
      case 'apartment':
      default: return 'appartement';
    }
  }

  private parseListings(html: string, params: SearchParams): RawListing[] {
    const $ = cheerio.load(html);
    const listings: RawListing[] = [];

    // OuestFrance-Immo uses .annonce class for listing cards
    $('.annonce, [class*="annonce-list"] > li, .card-annonce').each((_index, element) => {
      try {
        const $el = $(element);
        const listing = this.extractListing($, $el, params);
        if (listing) listings.push(listing);
      } catch (error) {
        console.warn('[OuestFrance-Immo] Error parsing listing:', error);
      }
    });

    return listings;
  }

  private extractListing(
    $: cheerio.CheerioAPI,
    $el: cheerio.Cheerio<Element>,
    params: SearchParams
  ): RawListing | null {
    // Source ID from data attribute or URL
    const sourceId = $el.attr('data-id') || $el.attr('data-annonce-id') || '';
    const linkEl = $el.find('a[href*="/immobilier/"], a.annonce-link').first();
    const href = linkEl.attr('href') || '';

    const finalSourceId = sourceId || this.extractIdFromUrl(href);
    if (!finalSourceId) return null;

    const externalUrl = href.startsWith('http')
      ? href
      : `https://www.ouestfrance-immo.com${href}`;

    // Title
    const title = $el.find('.annonce-titre, h2, h3, .title').first().text().trim();
    if (!title) return null;

    // Price
    const priceText = $el.find('.annonce-prix, .prix, [class*="price"]').first().text().trim();
    const price = this.parsePrice(priceText);
    if (!price) return null;

    // Location
    const locationText = $el.find('.annonce-ville, .localisation, [class*="location"]')
      .first().text().trim();
    const { city, postcode } = this.parseLocation(locationText);

    // Features - surface, rooms, bedrooms
    let surface: number | undefined;
    let rooms: number | undefined;
    let bedrooms: number | undefined;

    $el.find('.annonce-criteres li, .critere, [class*="feature"]').each((_i, feat) => {
      const text = $(feat).text().trim().toLowerCase();

      const surfaceMatch = text.match(/(\d+)\s*m²/);
      if (surfaceMatch) surface = parseInt(surfaceMatch[1], 10);

      const roomsMatch = text.match(/(\d+)\s*p(?:ièce)?s?/);
      if (roomsMatch) rooms = parseInt(roomsMatch[1], 10);

      const bedroomsMatch = text.match(/(\d+)\s*ch(?:ambre)?s?/);
      if (bedroomsMatch) bedrooms = parseInt(bedroomsMatch[1], 10);
    });

    // Fallback: parse from general text
    if (!surface || !rooms) {
      const featureText = $el.find('.annonce-criteres, [class*="features"]').text().trim();
      if (!surface) {
        const m = featureText.match(/(\d+)\s*m²/);
        if (m) surface = parseInt(m[1], 10);
      }
      if (!rooms) {
        const m = featureText.match(/(\d+)\s*pièce/);
        if (m) rooms = parseInt(m[1], 10);
      }
    }

    // Images
    const images: string[] = [];
    $el.find('img[data-src], img[src]').each((_i, img) => {
      const src = $(img).attr('data-src') || $(img).attr('src');
      if (src && !src.includes('pixel') && !src.includes('placeholder') && !src.includes('logo')) {
        images.push(src.startsWith('http') ? src : `https://www.ouestfrance-immo.com${src}`);
      }
    });

    // DPE
    const dpe = $el.find('[class*="dpe"] .letter, .dpe-value').first().text().trim() || undefined;

    // Description
    const description = $el.find('.annonce-texte, .description, [class*="excerpt"]')
      .first().text().trim() || undefined;

    // Type (apartment/house from title or class)
    const type = this.detectPropertyType(title, $el);

    return {
      sourceId: finalSourceId,
      source: 'ouestfrance-immo',
      externalUrl,
      transactionType: params.transactionType === 'buy' ? 'vente' : 'location',
      type,
      title,
      price,
      surface,
      rooms,
      bedrooms,
      city: city || 'Rennes',
      postcode,
      images: images.length > 0 ? images : undefined,
      dpe,
      description,
    };
  }

  private extractIdFromUrl(url: string): string {
    const match = url.match(/[-/](\d{5,})(?:\.html?)?/);
    return match ? match[1] : '';
  }

  private parsePrice(text: string): number | null {
    const cleaned = text.replace(/[^\d]/g, '');
    const value = parseInt(cleaned, 10);
    return isNaN(value) || value === 0 ? null : value;
  }

  private parseLocation(text: string): { city: string; postcode?: string } {
    // Format: "Rennes (35000)" or "Brest 29200" or "Nantes"
    const matchParen = text.match(/^(.+?)\s*\((\d{5})\)/);
    if (matchParen) {
      return { city: matchParen[1].trim(), postcode: matchParen[2] };
    }
    const matchSpace = text.match(/^(.+?)\s+(\d{5})$/);
    if (matchSpace) {
      return { city: matchSpace[1].trim(), postcode: matchSpace[2] };
    }
    return { city: text.trim() };
  }

  private detectPropertyType(title: string, $el: cheerio.Cheerio<Element>): string | undefined {
    const text = (title + ' ' + ($el.attr('class') || '')).toLowerCase();
    if (text.includes('maison')) return 'house';
    if (text.includes('appartement')) return 'apartment';
    if (text.includes('terrain')) return 'land';
    return undefined;
  }
}
