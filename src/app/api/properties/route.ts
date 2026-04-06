import { NextRequest, NextResponse } from 'next/server';
import { searchProperties } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const lat = parseFloat(params.get('lat') || '');
  const lng = parseFloat(params.get('lng') || '');
  const radiusKm = parseFloat(params.get('radius') || '10');

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: 'lat and lng are required' },
      { status: 400 }
    );
  }

  const filters: Record<string, unknown> = {};
  const transactionType = params.get('transactionType');
  if (transactionType) filters.transactionType = transactionType;

  const propertyTypes = params.get('propertyTypes');
  if (propertyTypes) filters.propertyTypes = propertyTypes.split(',');

  const priceMin = params.get('priceMin');
  if (priceMin) filters.priceMin = parseFloat(priceMin);

  const priceMax = params.get('priceMax');
  if (priceMax) filters.priceMax = parseFloat(priceMax);

  const surfaceMin = params.get('surfaceMin');
  if (surfaceMin) filters.surfaceMin = parseFloat(surfaceMin);

  const surfaceMax = params.get('surfaceMax');
  if (surfaceMax) filters.surfaceMax = parseFloat(surfaceMax);

  const minRooms = params.get('minRooms');
  if (minRooms) filters.minRooms = parseInt(minRooms);

  const minBedrooms = params.get('minBedrooms');
  if (minBedrooms) filters.minBedrooms = parseInt(minBedrooms);

  const hasParking = params.get('hasParking');
  if (hasParking) filters.hasParking = hasParking === 'true';

  const hasElevator = params.get('hasElevator');
  if (hasElevator) filters.hasElevator = hasElevator === 'true';

  const hasBalcony = params.get('hasBalcony');
  if (hasBalcony) filters.hasBalcony = hasBalcony === 'true';

  const minDPE = params.get('minDPE');
  if (minDPE) filters.minDPE = minDPE;

  const condition = params.get('condition');
  if (condition) filters.condition = condition;

  const sortBy = params.get('sortBy') || 'date_desc';
  const page = parseInt(params.get('page') || '1');
  const pageSize = Math.min(parseInt(params.get('pageSize') || '20'), 100);

  try {
    const result = await searchProperties({
      lat,
      lng,
      radiusKm,
      filters,
      sortBy,
      page,
      pageSize,
    });

    // Transform images from JSON string to array
    const properties = result.properties.map((p) => ({
      ...p,
      images: JSON.parse(p.images),
      publishedAt: p.publishedAt.toISOString(),
    }));

    return NextResponse.json({
      properties,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    });
  } catch (error) {
    console.error('[API] Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
