import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';
import { BaseProvider } from './base-provider';
import type { ProviderConfig, SearchParams, RawListing } from './types';

export class ParuVenduProvider extends BaseProvider {
  readonly config: ProviderConfig = {
    name: 'paruvendu',
    enabled: true,
    maxPages: 5,
    delayBetweenRequests: [1500, 3000],
  };

  async search(params: SearchParams): Promise<RawListing[]> {
    const allListings: RawListing[] = [];

    for (let page = 1; page <= this.config.maxPages; page++) {
      console.log(`[ParuVendu] Fetching page ${page}...`);

      const url = this.buildSearchUrl(params, page);

      try {
        const html = await this.fetchHtml(url);
        const listings = this.parseListings(html, params);

        console.log(`[ParuVendu] Found ${listings.length} listings on page ${page}`);

        if (listings.length === 0) break;

        allListings.push(...listings);
        if (page < this.config.maxPages) await this.delay();
      } catch (error) {
        console.error(`[ParuVendu] Error fetching page ${page}:`, error);
        break;
      }
    }

    return allListings;
  }

  private buildSearchUrl(params: SearchParams, page: number): string {
    const base = 'https://www.paruvendu.fr/immobilier/annonceimmo/liste/';
    const queryParams = new URLSearchParams();

    // Transaction type
    queryParams.set('tt', params.transactionType === 'buy' ? '1' : '2');

    // Property type
    const propertyType = params.propertyTypes?.[0];
    if (propertyType === 'apartment') {
      queryParams.set('tb', 'A');
    } else if (propertyType === 'house') {
      queryParams.set('tb', 'M');
    }

    // Location - ParuVendu uses lat/lng for search area
    queryParams.set('lat', params.lat.toString());
    queryParams.set('lng', params.lng.toString());
    queryParams.set('ray', params.radiusKm.toString());

    // Price filters
    if (params.priceMin) queryParams.set('px0', params.priceMin.toString());
    if (params.priceMax) queryParams.set('px1', params.priceMax.toString());

    // Surface filters
    if (params.surfaceMin) queryParams.set('su0', params.surfaceMin.toString());
    if (params.surfaceMax) queryParams.set('su1', params.surfaceMax.toString());

    // Rooms
    if (params.minRooms) queryParams.set('nb0', params.minRooms.toString());

    // Pagination
    if (page > 1) queryParams.set('p', page.toString());

    return `${base}?${queryParams.toString()}`;
  }

  private parseListings(html: string, params: SearchParams): RawListing[] {
    const $ = cheerio.load(html);
    const listings: RawListing[] = [];

    $('.ergov3-annonce, .annonce-row, [class*="annonce"]').each((_index, element) => {
      try {
        const $el = $(element);
        // Skip non-listing elements (ads, headers, etc.)
        if ($el.hasClass('pub') || $el.hasClass('header')) return;

        const listing = this.extractListing($, $el, params);
        if (listing) listings.push(listing);
      } catch (error) {
        console.warn('[ParuVendu] Error parsing listing:', error);
      }
    });

    return listings;
  }

  private extractListing(
    $: cheerio.CheerioAPI,
    $el: cheerio.Cheerio<Element>,
    params: SearchParams
  ): RawListing | null {
    // Extract source ID from data attribute or link
    const linkEl = $el.find('a[href*="/immobilier/"]').first();
    const href = linkEl.attr('href') || '';
    const sourceId = this.extractIdFromUrl(href) || $el.attr('data-annid') || '';
    if (!sourceId) return null;

    const externalUrl = href.startsWith('http')
      ? href
      : `https://www.paruvendu.fr${href}`;

    const title = $el.find('.ergov3-title a, .annonce-titre, h3 a').first().text().trim();
    if (!title) return null;

    // Price
    const priceText = $el.find('.ergov3-prix, .annonce-prix, [class*="price"]').first().text().trim();
    const price = this.parsePrice(priceText);
    if (!price) return null;

    // Location
    const locationText = $el.find('.ergov3-localisation, .annonce-ville, [class*="localisation"]')
      .first().text().trim();
    const { city, postcode } = this.parseLocation(locationText);

    // Surface and rooms from features
    const featuresText = $el.find('.ergov3-criteres, .annonce-criteres, [class*="critere"]')
      .text().trim();

    let surface: number | undefined;
    let rooms: number | undefined;
    let bedrooms: number | undefined;

    const surfaceMatch = featuresText.match(/(\d+)\s*m²/);
    if (surfaceMatch) surface = parseInt(surfaceMatch[1], 10);

    const roomsMatch = featuresText.match(/(\d+)\s*p(?:ièce)?s?/);
    if (roomsMatch) rooms = parseInt(roomsMatch[1], 10);

    const bedroomsMatch = featuresText.match(/(\d+)\s*ch(?:ambre)?s?/);
    if (bedroomsMatch) bedrooms = parseInt(bedroomsMatch[1], 10);

    // Description
    const description = $el.find('.ergov3-texte, .annonce-texte, [class*="description"]')
      .first().text().trim() || undefined;

    // Images
    const images: string[] = [];
    $el.find('img[src*="photo"], img[data-src]').each((_i, img) => {
      const src = $(img).attr('data-src') || $(img).attr('src');
      if (src && !src.includes('spacer') && !src.includes('placeholder')) {
        images.push(src.startsWith('http') ? src : `https://www.paruvendu.fr${src}`);
      }
    });

    // DPE
    const dpe = $el.find('[class*="dpe"] .lettre, [class*="energy-class"]').first().text().trim() || undefined;

    return {
      sourceId,
      source: 'paruvendu',
      externalUrl,
      transactionType: params.transactionType === 'buy' ? 'vente' : 'location',
      title,
      price,
      surface,
      rooms,
      bedrooms,
      city: city || 'Inconnu',
      postcode,
      images: images.length > 0 ? images : undefined,
      dpe,
      description,
    };
  }

  private extractIdFromUrl(url: string): string {
    const match = url.match(/\/(\d+)(?:\.htm)?$/);
    return match ? match[1] : '';
  }

  private parsePrice(text: string): number | null {
    const cleaned = text.replace(/[^\d]/g, '');
    const value = parseInt(cleaned, 10);
    return isNaN(value) || value === 0 ? null : value;
  }

  private parseLocation(text: string): { city: string; postcode?: string } {
    // Format: "Paris (75011)" or "Lyon 3ème (69003)" or just "Marseille"
    const match = text.match(/^(.+?)\s*(?:\((\d{5})\))?$/);
    if (match) {
      return {
        city: match[1].trim(),
        postcode: match[2] || undefined,
      };
    }
    return { city: text.trim() };
  }
}
