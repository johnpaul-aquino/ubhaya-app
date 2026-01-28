/**
 * Admin Stats API Route
 * GET /api/admin/stats - Get system-wide statistics
 */

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-guard';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const { authorized, response } = await requireAdmin();

  if (!authorized) {
    return response;
  }

  try {
    // Get all stats in parallel
    const [
      totalUsers,
      activeUsers,
      totalOrganizations,
      totalTeams,
      totalDocuments,
      totalContacts,
      totalFacilities,
      recentUsers,
      recentOrganizations,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.organization.count(),
      prisma.team.count(),
      prisma.document.count(),
      prisma.contact.count(),
      prisma.facility.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.organization.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          createdAt: true,
          _count: {
            select: { members: true, teams: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalOrganizations,
        totalTeams,
        totalDocuments,
        totalContacts,
        totalFacilities,
      },
      recentUsers,
      recentOrganizations,
    });
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
