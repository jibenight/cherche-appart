import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';
import { BaseProvider } from './base-provider';
import type { ProviderConfig, SearchParams, RawListing } from './types';

export class PapProvider extends BaseProvider {
  readonly config: ProviderConfig = {
    name: 'pap',
    enabled: true,
    maxPages: 5,
    delayBetweenRequests: [1500, 3000],
  };

  async search(params: SearchParams): Promise<RawListing[]> {
    const allListings: RawListing[] = [];
    const baseUrl = this.buildSearchUrl(params);

    for (let page = 1; page <= this.config.maxPages; page++) {
      console.log(`[PAP] Fetching page ${page}...`);

      const url = page === 1 ? baseUrl : `${baseUrl}?page=${page}`;

      try {
        const html = await this.fetchHtml(url);
        const listings = this.parseListings(html, params);

        console.log(`[PAP] Found ${listings.length} listings on page ${page}`);

        if (listings.length === 0) break;

        allListings.push(...listings);
        if (page < this.config.maxPages) await this.delay();
      } catch (error) {
        console.error(`[PAP] Error fetching page ${page}:`, error);
        break;
      }
    }

    return allListings;
  }

  private buildSearchUrl(params: SearchParams): string {
    const transaction = params.transactionType === 'buy' ? 'vente' : 'location';
    const propertyType = this.mapPropertyType(params.propertyTypes?.[0]);
    // PAP uses city name in URL - we use coordinates to derive a generic search
    // In practice, city name would come from a geocoding step
    const citySlug = 'paris'; // Placeholder - would be resolved from lat/lng
    const postcode = '75000';

    return `https://www.pap.fr/annonce/${transaction}-${propertyType}-${citySlug}-${postcode}`;
  }

  private mapPropertyType(type?: string): string {
    switch (type) {
      case 'house': return 'maison';
      case 'apartment':
      default: return 'appartement';
    }
  }

  private parseListings(html: string, params: SearchParams): RawListing[] {
    const $ = cheerio.load(html);
    const listings: RawListing[] = [];

    $('[data-search-observed]').each((_index, element) => {
      try {
        const $el = $(element);
        const listing = this.extractListing($, $el, params);
        if (listing) listings.push(listing);
      } catch (error) {
        console.warn('[PAP] Error parsing listing:', error);
      }
    });

    return listings;
  }

  private extractListing(
    $: cheerio.CheerioAPI,
    $el: cheerio.Cheerio<Element>,
    params: SearchParams
  ): RawListing | null {
    const sourceId = $el.attr('data-id') || $el.attr('id') || '';
    if (!sourceId) return null;

    const linkEl = $el.find('a.item-title, a[class*="link"]').first();
    const relativeUrl = linkEl.attr('href') || '';
    const externalUrl = relativeUrl.startsWith('http')
      ? relativeUrl
      : `https://www.pap.fr${relativeUrl}`;

    const title = linkEl.text().trim() || $el.find('h2, .item-title').first().text().trim();
    if (!title) return null;

    const priceText = $el.find('.item-price, [class*="price"]').first().text().trim();
    const price = this.parsePrice(priceText);
    if (!price) return null;

    const city = $el.find('.item-description .item-loc, [class*="city"]').first().text().trim()
      || this.extractCityFromTitle(title);

    const tags = $el.find('.item-tags li, .item-tag');
    let surface: number | undefined;
    let rooms: number | undefined;
    let bedrooms: number | undefined;

    tags.each((_i, tag) => {
      const text = $(tag).text().trim().toLowerCase();
      const surfaceMatch = text.match(/(\d+)\s*m²/);
      if (surfaceMatch) surface = parseInt(surfaceMatch[1], 10);

      const roomsMatch = text.match(/(\d+)\s*p(?:ièce)?/);
      if (roomsMatch) rooms = parseInt(roomsMatch[1], 10);

      const bedroomsMatch = text.match(/(\d+)\s*ch(?:ambre)?/);
      if (bedroomsMatch) bedrooms = parseInt(bedroomsMatch[1], 10);
    });

    // Also try to extract from summary text
    const summaryText = $el.find('.item-description').text().trim();
    if (!surface) {
      const surfaceMatch = summaryText.match(/(\d+)\s*m²/);
      if (surfaceMatch) surface = parseInt(surfaceMatch[1], 10);
    }
    if (!rooms) {
      const roomsMatch = summaryText.match(/(\d+)\s*pièce/);
      if (roomsMatch) rooms = parseInt(roomsMatch[1], 10);
    }

    const images: string[] = [];
    $el.find('img[src*="photo"], img[data-src]').each((_i, img) => {
      const src = $(img).attr('data-src') || $(img).attr('src');
      if (src && !src.includes('placeholder')) images.push(src);
    });

    const dpe = $el.find('[class*="dpe"] .value, [class*="energy"]').first().text().trim() || undefined;

    const description = $el.find('.item-description p, .item-excerpt').first().text().trim() || undefined;

    return {
      sourceId,
      source: 'pap',
      externalUrl,
      transactionType: params.transactionType === 'buy' ? 'vente' : 'location',
      title,
      price,
      surface,
      rooms,
      bedrooms,
      city: city || 'Paris',
      images: images.length > 0 ? images : undefined,
      dpe,
      description,
    };
  }

  private parsePrice(text: string): number | null {
    const cleaned = text.replace(/[^\d]/g, '');
    const value = parseInt(cleaned, 10);
    return isNaN(value) || value === 0 ? null : value;
  }

  private extractCityFromTitle(title: string): string {
    // PAP titles often contain the city name, e.g. "Appartement 3 pièces Paris 11e"
    const match = title.match(/(?:Paris|Lyon|Marseille|Toulouse|Bordeaux|Nantes|Lille|Strasbourg|Montpellier|Rennes)[\s\w]*/i);
    return match ? match[0].trim() : '';
  }
}
