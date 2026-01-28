import { NextRequest, NextResponse } from 'next/server';
import {
  facilities,
  facilitiesMeta,
  searchFacilities,
  paginateFacilities,
} from '@/lib/facilities-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search') || '';
    const country = searchParams.get('country') || '';
    const sector = searchParams.get('sector') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);

    // Filter facilities
    const filteredFacilities = searchFacilities(search, country, sector);

    // Paginate results
    const { data, total, totalPages } = paginateFacilities(
      filteredFacilities,
      page,
      pageSize
    );

    return NextResponse.json({
      success: true,
      facilities: data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
      filters: {
        countries: facilitiesMeta.countries,
        sectors: facilitiesMeta.sectors.slice(0, 30), // Top 30 sectors
      },
    });
  } catch (error) {
    console.error('Error fetching facilities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch facilities' },
      { status: 500 }
    );
  }
}
