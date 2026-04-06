import { RawListingSchema } from '@/schemas/property.schema';
import type { RawListing } from '@/lib/providers/types';
import { computeDedupHash } from './dedup';

const TYPE_MAP: Record<string, string> = {
  'appartement': 'apartment',
  'apartment': 'apartment',
  'maison': 'house',
  'house': 'house',
  'studio': 'studio',
  'loft': 'loft',
  'terrain': 'land',
  'land': 'land',
  'commerce': 'commercial',
  'commercial': 'commercial',
  'local': 'commercial',
  'bureau': 'commercial',
};

const TRANSACTION_MAP: Record<string, string> = {
  'vente': 'buy',
  'achat': 'buy',
  'buy': 'buy',
  'location': 'rent',
  'rent': 'rent',
  'louer': 'rent',
};

const VALID_DPE = new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G']);

const CONDITION_MAP: Record<string, string> = {
  'neuf': 'new',
  'new': 'new',
  'bon': 'good',
  'good': 'good',
  'bon état': 'good',
  'à rénover': 'to_renovate',
  'to_renovate': 'to_renovate',
  'travaux': 'to_renovate',
};

export interface NormalizedProperty {
  sourceId: string;
  source: string;
  externalUrl: string;
  transactionType: string;
  type: string;
  title: string;
  description: string;
  price: number;
  surface: number;
  rooms: number;
  bedrooms: number;
  floor: number | null;
  totalFloors: number | null;
  hasParking: boolean;
  hasElevator: boolean;
  hasBalcony: boolean;
  dpe: string;
  condition: string;
  address: string;
  city: string;
  postcode: string;
  lat: number;
  lng: number;
  images: string;
  pricePerM2: number;
  publishedAt: Date;
  dedupHash: string;
}

function normalizeType(raw?: string): string {
  if (!raw) return 'other';
  const lower = raw.toLowerCase().trim();
  return TYPE_MAP[lower] || 'other';
}

function normalizeTransaction(raw?: string): string {
  if (!raw) return 'buy';
  const lower = raw.toLowerCase().trim();
  return TRANSACTION_MAP[lower] || 'buy';
}

function normalizeDpe(raw?: string): string {
  if (!raw) return 'unknown';
  const upper = raw.toUpperCase().trim();
  return VALID_DPE.has(upper) ? upper : 'unknown';
}

function normalizeCondition(raw?: string): string {
  if (!raw) return 'good';
  const lower = raw.toLowerCase().trim();
  return CONDITION_MAP[lower] || 'good';
}

export function normalizeRawListing(raw: RawListing): NormalizedProperty | null {
  const parsed = RawListingSchema.safeParse(raw);
  if (!parsed.success) {
    console.warn(`[normalizer] Invalid listing from ${raw.source}: ${parsed.error.message}`);
    return null;
  }

  const data = parsed.data;

  const surface = data.surface || 0;
  if (surface <= 0) {
    console.warn(`[normalizer] Skipping listing with no surface: ${data.title}`);
    return null;
  }

  const city = data.city.trim();
  if (!city) return null;

  const transactionType = normalizeTransaction(data.transactionType);
  const type = normalizeType(data.type);
  const dpe = normalizeDpe(data.dpe);
  const condition = normalizeCondition(data.condition);
  const pricePerM2 = Math.round((data.price / surface) * 100) / 100;

  const publishedAt = data.publishedAt
    ? new Date(data.publishedAt)
    : new Date();

  if (isNaN(publishedAt.getTime())) {
    return null;
  }

  const title = data.title.trim();
  const dedupHash = computeDedupHash(title, data.price, city, surface);

  return {
    sourceId: data.sourceId,
    source: data.source,
    externalUrl: data.externalUrl,
    transactionType,
    type,
    title,
    description: data.description || '',
    price: data.price,
    surface,
    rooms: data.rooms || 0,
    bedrooms: data.bedrooms || 0,
    floor: data.floor ?? null,
    totalFloors: data.totalFloors ?? null,
    hasParking: data.hasParking,
    hasElevator: data.hasElevator,
    hasBalcony: data.hasBalcony,
    dpe,
    condition,
    address: data.address || '',
    city,
    postcode: data.postcode || '',
    lat: data.lat || 0,
    lng: data.lng || 0,
    images: JSON.stringify(data.images || []),
    pricePerM2,
    publishedAt,
    dedupHash,
  };
}
