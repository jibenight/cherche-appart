import { NextRequest, NextResponse } from 'next/server';
import { getPropertyById } from '@/lib/db/queries';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await getPropertyById(params.id);

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...property,
      images: JSON.parse(property.images),
      publishedAt: property.publishedAt.toISOString(),
      createdAt: property.createdAt.toISOString(),
      updatedAt: property.updatedAt.toISOString(),
      lastSeenAt: property.lastSeenAt.toISOString(),
    });
  } catch (error) {
    console.error('[API] Property detail error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
