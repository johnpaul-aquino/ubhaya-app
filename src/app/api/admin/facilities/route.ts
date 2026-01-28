/**
 * Admin Facilities API Route
 * GET /api/admin/facilities - List all facilities with filters (admin view)
 *
 * Data is now stored in PostgreSQL database.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-guard';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  const { authorized, response } = await requireAdmin();

  if (!authorized) {
    return response;
  }

  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search') || '';
    const country = searchParams.get('country') || '';
    const sector = searchParams.get('sector') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '50', 10), 100);

    // Build where clause
    const where: Prisma.FacilityWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { parentCompany: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (country) {
      where.countryCode = country;
    }

    if (sector) {
      where.sector = { has: sector };
    }

    // Fetch facilities with pagination
    const [facilities, total] = await Promise.all([
      prisma.facility.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { name: 'asc' },
      }),
      prisma.facility.count({ where }),
    ]);

    // Get metadata for filters (cached or computed)
    const [totalFacilities, countryStats, allFacilitiesForSectors] = await Promise.all([
      prisma.facility.count(),
      prisma.facility.groupBy({
        by: ['countryCode', 'countryName'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),
      prisma.facility.findMany({
        select: { sector: true },
      }),
    ]);

    // Process country stats
    const countries = countryStats.map((c) => ({
      code: c.countryCode,
      name: c.countryName,
      count: c._count.id,
    }));

    // Process sector stats (sectors is an array field)
    const sectorCounts = new Map<string, number>();
    for (const f of allFacilitiesForSectors) {
      for (const s of f.sector) {
        sectorCounts.set(s, (sectorCounts.get(s) || 0) + 1);
      }
    }
    const sectors = Array.from(sectorCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      success: true,
      facilities,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
      meta: {
        totalFacilities,
        countries,
        sectors,
        dataSource: 'DATABASE',
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
