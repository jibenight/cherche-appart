import type { PropertyCard, PropertyResults, Property } from '@/types/property';
import type { FilterSet } from '@/types/filters';

interface SearchParams {
  lat: number;
  lng: number;
  radiusKm: number;
  filters: FilterSet;
  sortBy: string;
  page: number;
  pageSize?: number;
}

export async function searchProperties(params: SearchParams): Promise<PropertyResults> {
  const { lat, lng, radiusKm, filters, sortBy, page, pageSize = 20 } = params;

  const searchParams = new URLSearchParams({
    lat: lat.toString(),
    lng: lng.toString(),
    radius: radiusKm.toString(),
    sortBy,
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (filters.transactionType) {
    searchParams.set('transactionType', filters.transactionType);
  }
  if (filters.propertyTypes.length > 0) {
    searchParams.set('propertyTypes', filters.propertyTypes.join(','));
  }
  if (filters.priceRange.min != null) {
    searchParams.set('priceMin', filters.priceRange.min.toString());
  }
  if (filters.priceRange.max != null) {
    searchParams.set('priceMax', filters.priceRange.max.toString());
  }
  if (filters.surfaceRange.min != null) {
    searchParams.set('surfaceMin', filters.surfaceRange.min.toString());
  }
  if (filters.surfaceRange.max != null) {
    searchParams.set('surfaceMax', filters.surfaceRange.max.toString());
  }
  if (filters.minRooms != null) {
    searchParams.set('minRooms', filters.minRooms.toString());
  }
  if (filters.minBedrooms != null) {
    searchParams.set('minBedrooms', filters.minBedrooms.toString());
  }
  if (filters.hasParking != null) {
    searchParams.set('hasParking', filters.hasParking.toString());
  }
  if (filters.hasElevator != null) {
    searchParams.set('hasElevator', filters.hasElevator.toString());
  }
  if (filters.hasBalcony != null) {
    searchParams.set('hasBalcony', filters.hasBalcony.toString());
  }
  if (filters.minDPE != null) {
    searchParams.set('minDPE', filters.minDPE);
  }
  if (filters.condition !== 'any') {
    searchParams.set('condition', filters.condition);
  }

  const response = await fetch(`/api/properties?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status}`);
  }

  const data = await response.json();

  return {
    properties: data.properties as PropertyCard[],
    total: data.total,
    page: data.page,
    pageSize: data.pageSize,
    totalPages: data.totalPages,
  };
}

export async function getProperty(id: string): Promise<Property> {
  const response = await fetch(`/api/properties/${id}`);

  if (!response.ok) {
    throw new Error(`Property not found: ${response.status}`);
  }

  return response.json();
}
