import { prisma } from './prisma';
import { Prisma } from '@/generated/prisma/client';
import { LRUCache } from 'lru-cache';

const EARTH_RADIUS_KM = 6371;

interface SearchFilters {
  transactionType?: string;
  propertyTypes?: string[];
  priceMin?: number;
  priceMax?: number;
  surfaceMin?: number;
  surfaceMax?: number;
  minRooms?: number;
  minBedrooms?: number;
  hasParking?: boolean;
  hasElevator?: boolean;
  hasBalcony?: boolean;
  minDPE?: string;
  condition?: string;
}

interface SearchOptions {
  lat: number;
  lng: number;
  radiusKm: number;
  filters?: SearchFilters;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

interface SearchResult {
  properties: Array<{
    id: string;
    transactionType: string;
    type: string;
    title: string;
    price: number;
    surface: number;
    rooms: number;
    bedrooms: number;
    dpe: string;
    city: string;
    postcode: string;
    lat: number;
    lng: number;
    images: string;
    pricePerM2: number;
    publishedAt: Date;
    source: string;
    externalUrl: string;
  }>;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const DPE_ORDER = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const searchCache = new LRUCache<string, SearchResult>({
  max: 100,
  ttl: 1000 * 60 * 5, // 5 minutes
});

function buildCacheKey(options: SearchOptions): string {
  return JSON.stringify(options);
}

export async function searchProperties(options: SearchOptions): Promise<SearchResult> {
  const cacheKey = buildCacheKey(options);
  const cached = searchCache.get(cacheKey);
  if (cached) return cached;

  const { lat, lng, radiusKm, filters = {}, sortBy = 'date_desc', page = 1, pageSize = 20 } = options;

  // Haversine bounding box for pre-filtering
  const latDelta = radiusKm / EARTH_RADIUS_KM * (180 / Math.PI);
  const lngDelta = latDelta / Math.cos(lat * Math.PI / 180);

  const where: Prisma.PropertyWhereInput = {
    isActive: true,
    lat: { gte: lat - latDelta, lte: lat + latDelta },
    lng: { gte: lng - lngDelta, lte: lng + lngDelta },
  };

  if (filters.transactionType) {
    where.transactionType = filters.transactionType;
  }
  if (filters.propertyTypes?.length) {
    where.type = { in: filters.propertyTypes };
  }
  if (filters.priceMin != null || filters.priceMax != null) {
    where.price = {};
    if (filters.priceMin != null) where.price.gte = filters.priceMin;
    if (filters.priceMax != null) where.price.lte = filters.priceMax;
  }
  if (filters.surfaceMin != null || filters.surfaceMax != null) {
    where.surface = {};
    if (filters.surfaceMin != null) where.surface.gte = filters.surfaceMin;
    if (filters.surfaceMax != null) where.surface.lte = filters.surfaceMax;
  }
  if (filters.minRooms != null) {
    where.rooms = { gte: filters.minRooms };
  }
  if (filters.minBedrooms != null) {
    where.bedrooms = { gte: filters.minBedrooms };
  }
  if (filters.hasParking != null) {
    where.hasParking = filters.hasParking;
  }
  if (filters.hasElevator != null) {
    where.hasElevator = filters.hasElevator;
  }
  if (filters.hasBalcony != null) {
    where.hasBalcony = filters.hasBalcony;
  }
  if (filters.minDPE && DPE_ORDER.includes(filters.minDPE)) {
    const idx = DPE_ORDER.indexOf(filters.minDPE);
    where.dpe = { in: DPE_ORDER.slice(0, idx + 1) };
  }
  if (filters.condition && filters.condition !== 'any') {
    where.condition = filters.condition;
  }

  // Sort mapping
  const orderBy: Prisma.PropertyOrderByWithRelationInput = (() => {
    switch (sortBy) {
      case 'price_asc': return { price: 'asc' };
      case 'price_desc': return { price: 'desc' };
      case 'surface_asc': return { surface: 'asc' };
      case 'surface_desc': return { surface: 'desc' };
      case 'price_per_m2_asc': return { pricePerM2: 'asc' };
      case 'price_per_m2_desc': return { pricePerM2: 'desc' };
      case 'date_asc': return { publishedAt: 'asc' };
      default: return { publishedAt: 'desc' };
    }
  })();

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.property.count({ where }),
  ]);

  // Post-filter with exact Haversine distance
  const filtered = properties.filter((p) => {
    const dLat = (p.lat - lat) * Math.PI / 180;
    const dLng = (p.lng - lng) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat * Math.PI / 180) * Math.cos(p.lat * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c <= radiusKm;
  });

  const result: SearchResult = {
    properties: filtered,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };

  searchCache.set(cacheKey, result);
  return result;
}

export async function getPropertyById(id: string) {
  return prisma.property.findUnique({ where: { id } });
}

export async function deactivateStaleProperties(maxAgeHours = 48) {
  const cutoff = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
  return prisma.property.updateMany({
    where: { lastSeenAt: { lt: cutoff }, isActive: true },
    data: { isActive: false },
  });
}
