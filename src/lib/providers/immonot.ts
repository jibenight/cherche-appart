import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';
import { BaseProvider } from './base-provider';
import type { ProviderConfig, SearchParams, RawListing } from './types';

export class ImmonotProvider extends BaseProvider {
  readonly config: ProviderConfig = {
    name: 'immonot',
    enabled: true,
    maxPages: 5,
    delayBetweenRequests: [1500, 3000],
  };

  async search(params: SearchParams): Promise<RawListing[]> {
    const allListings: RawListing[] = [];

    for (let page = 1; page <= this.config.maxPages; page++) {
      console.log(`[Immonot] Fetching page ${page}...`);

      const url = this.buildSearchUrl(params, page);

      try {
        const html = await this.fetchHtml(url);
        const listings = this.parseListings(html, params);

        console.log(`[Immonot] Found ${listings.length} listings on page ${page}`);

        if (listings.length === 0) break;

        allListings.push(...listings);
        if (page < this.config.maxPages) await this.delay();
      } catch (error) {
        console.error(`[Immonot] Error fetching page ${page}:`, error);
        break;
      }
    }

    return allListings;
  }

  private buildSearchUrl(params: SearchParams, page: number): string {
    const transaction = params.transactionType === 'buy' ? 'vente' : 'location';
    const propertyType = this.mapPropertyType(params.propertyTypes?.[0]);
    // Immonot uses department-based URLs
    const departement = 'ile-de-france'; // Placeholder - would be resolved from lat/lng

    let url = `https://www.immonot.com/${transaction}/${propertyType}/${departement}.html`;

    const queryParams = new URLSearchParams();

    if (params.priceMin) queryParams.set('budgetMin', params.priceMin.toString());
    if (params.priceMax) queryParams.set('budgetMax', params.priceMax.toString());
    if (params.surfaceMin) queryParams.set('surfaceMin', params.surfaceMin.toString());
    if (params.surfaceMax) queryParams.set('surfaceMax', params.surfaceMax.toString());
    if (params.minRooms) queryParams.set('nbPiecesMin', params.minRooms.toString());
    if (page > 1) queryParams.set('page', page.toString());

    const qs = queryParams.toString();
    if (qs) url += `?${qs}`;

    return url;
  }

  private mapPropertyType(type?: string): string {
    switch (type) {
      case 'house': return 'maison';
      case 'land': return 'terrain';
      case 'commercial': return 'local-commercial';
      case 'apartment':
      default: return 'appartement';
    }
  }

  private parseListings(html: string, params: SearchParams): RawListing[] {
    const $ = cheerio.load(html);
    const listings: RawListing[] = [];

    // Immonot uses .annonce-bloc or .bien-immobilier for listing cards
    $('.annonce-bloc, .bien-immobilier, .liste-annonces .annonce, [class*="annonce-item"]').each((_index, element) => {
      try {
        const $el = $(element);
        const listing = this.extractListing($, $el, params);
        if (listing) listings.push(listing);
      } catch (error) {
        console.warn('[Immonot] Error parsing listing:', error);
      }
    });

    return listings;
  }

  private extractListing(
    $: cheerio.CheerioAPI,
    $el: cheerio.Cheerio<Element>,
    params: SearchParams
  ): RawListing | null {
    // Source ID
    const sourceId = $el.attr('data-id')
      || $el.attr('data-ref')
      || $el.find('[class*="reference"]').first().text().trim().replace(/[^\d]/g, '')
      || '';

    // Link
    const linkEl = $el.find('a[href*="/annonce/"], a[href*="/bien/"], a.lien-annonce').first();
    const href = linkEl.attr('href') || '';

    const finalSourceId = sourceId || this.extractIdFromUrl(href);
    if (!finalSourceId) return null;

    const externalUrl = href.startsWith('http')
      ? href
      : `https://www.immonot.com${href}`;

    // Title
    const title = $el.find('.titre-annonce, h2, h3, .annonce-titre').first().text().trim();
    if (!title) return null;

    // Price
    const priceText = $el.find('.prix, .annonce-prix, [class*="price"]').first().text().trim();
    const price = this.parsePrice(priceText);
    if (!price) return null;

    // Location - Immonot shows city and department
    const locationText = $el.find('.localisation, .ville, [class*="location"], .annonce-localisation')
      .first().text().trim();
    const { city, postcode } = this.parseLocation(locationText);

    // Features
    let surface: number | undefined;
    let rooms: number | undefined;
    let bedrooms: number | undefined;
    let floor: number | undefined;

    $el.find('.criteres li, .caracteristiques li, [class*="critere"], .detail-bien span').each((_i, feat) => {
      const text = $(feat).text().trim().toLowerCase();

      const surfaceMatch = text.match(/(\d+(?:[.,]\d+)?)\s*m²/);
      if (surfaceMatch) surface = parseFloat(surfaceMatch[1].replace(',', '.'));

      const roomsMatch = text.match(/(\d+)\s*p(?:ièce)?s?/);
      if (roomsMatch) rooms = parseInt(roomsMatch[1], 10);

      const bedroomsMatch = text.match(/(\d+)\s*ch(?:ambre)?s?/);
      if (bedroomsMatch) bedrooms = parseInt(bedroomsMatch[1], 10);

      const floorMatch = text.match(/(?:étage|etage)\s*:\s*(\d+)/i);
      if (floorMatch) floor = parseInt(floorMatch[1], 10);
    });

    // Fallback: parse features from concatenated text
    if (!surface || !rooms) {
      const allText = $el.find('.criteres, .caracteristiques').text().trim();
      if (!surface) {
        const m = allText.match(/(\d+(?:[.,]\d+)?)\s*m²/);
        if (m) surface = parseFloat(m[1].replace(',', '.'));
      }
      if (!rooms) {
        const m = allText.match(/(\d+)\s*pièce/);
        if (m) rooms = parseInt(m[1], 10);
      }
    }

    // Images
    const images: string[] = [];
    $el.find('img[data-src], img[src]').each((_i, img) => {
      const src = $(img).attr('data-src') || $(img).attr('src');
      if (src && !src.includes('logo') && !src.includes('pixel') && !src.includes('spacer')) {
        images.push(src.startsWith('http') ? src : `https://www.immonot.com${src}`);
      }
    });

    // DPE - Immonot often shows DPE as a letter with a class
    const dpeEl = $el.find('[class*="dpe"] .lettre, [class*="dpe-class"], .diagnostic .value').first();
    const dpe = dpeEl.text().trim().toUpperCase() || undefined;

    // Description
    const description = $el.find('.texte-annonce, .description, [class*="excerpt"]')
      .first().text().trim() || undefined;

    // Notarial-specific: detect if exclusive mandate
    const condition = $el.find('[class*="mandat"], .exclusivite').length > 0
      ? 'exclusive'
      : undefined;

    // Property type detection
    const type = this.detectPropertyType(title);

    return {
      sourceId: finalSourceId,
      source: 'immonot',
      externalUrl,
      transactionType: params.transactionType === 'buy' ? 'vente' : 'location',
      type,
      title,
      price,
      surface,
      rooms,
      bedrooms,
      floor: floor ?? null,
      city: city || 'Paris',
      postcode,
      images: images.length > 0 ? images : undefined,
      dpe: dpe && /^[A-G]$/i.test(dpe) ? dpe : undefined,
      description,
      condition,
    };
  }

  private extractIdFromUrl(url: string): string {
    // Immonot URLs: /annonce/12345.html or /bien/12345
    const match = url.match(/[-/](\d{4,})(?:\.html?)?/);
    return match ? match[1] : '';
  }

  private parsePrice(text: string): number | null {
    const cleaned = text.replace(/[^\d]/g, '');
    const value = parseInt(cleaned, 10);
    return isNaN(value) || value === 0 ? null : value;
  }

  private parseLocation(text: string): { city: string; postcode?: string } {
    // Formats: "Paris (75)", "Nantes (44000)", "Rennes 35"
    const matchParen = text.match(/^(.+?)\s*\((\d{2,5})\)/);
    if (matchParen) {
      return {
        city: matchParen[1].trim(),
        postcode: matchParen[2].length === 5 ? matchParen[2] : undefined,
      };
    }
    const matchSpace = text.match(/^(.+?)\s+(\d{5})$/);
    if (matchSpace) {
      return { city: matchSpace[1].trim(), postcode: matchSpace[2] };
    }
    return { city: text.trim() };
  }

  private detectPropertyType(title: string): string | undefined {
    const lower = title.toLowerCase();
    if (lower.includes('maison')) return 'house';
    if (lower.includes('appartement')) return 'apartment';
    if (lower.includes('terrain')) return 'land';
    if (lower.includes('local commercial') || lower.includes('commerce')) return 'commercial';
    return undefined;
  }
}
