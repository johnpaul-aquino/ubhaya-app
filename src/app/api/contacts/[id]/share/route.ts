/**
 * Contact Share API Route
 * POST /api/contacts/[id]/share - Share a contact with team or organization
 * DELETE /api/contacts/[id]/share - Unshare a contact (make it private)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { shareContactSchema } from '@/lib/validations/contact';

type RouteParams = { params: Promise<{ id: string }> };

/**
 * Share a contact with team or organization
 * POST /api/contacts/[id]/share
 * Body: { shareType: 'TEAM' | 'ORGANIZATION', teamId?: string }
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = shareContactSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { shareType, teamId } = validationResult.data;

    // Validate sharing prerequisites based on shareType
    if (shareType === 'TEAM') {
      const targetTeamId = teamId || session.user.teamId;
      if (!targetTeamId) {
        return NextResponse.json(
          { success: false, error: 'You must be part of a team to share contacts with team' },
          { status: 400 }
        );
      }
    } else if (shareType === 'ORGANIZATION') {
      if (!session.user.organizationId) {
        return NextResponse.json(
          { success: false, error: 'You must be part of an organization to share contacts organization-wide' },
          { status: 400 }
        );
      }
    }

    // Check if contact exists and user owns it
    const existingContact = await prisma.contact.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingContact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found or you do not own this contact' },
        { status: 404 }
      );
    }

    // Check if already shared at the requested level
    if (shareType === 'TEAM') {
      const targetTeamId = teamId || session.user.teamId;
      if (existingContact.isTeamContact && existingContact.teamId === targetTeamId) {
        return NextResponse.json(
          { success: false, error: 'Contact is already shared with the team' },
          { status: 400 }
        );
      }
    } else if (shareType === 'ORGANIZATION') {
      if (existingContact.isOrgContact && existingContact.organizationId === session.user.organizationId) {
        return NextResponse.json(
          { success: false, error: 'Contact is already shared with the organization' },
          { status: 400 }
        );
      }
    }

    // Prepare update data based on shareType
    let updateData: {
      isTeamContact: boolean;
      teamId: string | null;
      isOrgContact: boolean;
      organizationId: string | null;
    };

    if (shareType === 'TEAM') {
      const targetTeamId = teamId || session.user.teamId!;
      updateData = {
        isTeamContact: true,
        teamId: targetTeamId,
        isOrgContact: false,
        organizationId: null,
      };
    } else {
      // ORGANIZATION - clears team sharing, sets org sharing
      updateData = {
        isTeamContact: false,
        teamId: null,
        isOrgContact: true,
        organizationId: session.user.organizationId!,
      };
    }

    // Share contact
    const contact = await prisma.contact.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        action: 'CONTACT_SHARED',
        entityType: 'CONTACT',
        entityId: contact.id,
        userId: session.user.id,
        teamId: shareType === 'TEAM' ? updateData.teamId : null,
        organizationId: shareType === 'ORGANIZATION' ? updateData.organizationId : null,
        metadata: {
          contactName: contact.name,
          shareType,
        },
      },
    });

    // Create notifications
    if (shareType === 'TEAM' && updateData.teamId) {
      // Notify team members
      const teamMembers = await prisma.user.findMany({
        where: {
          teamId: updateData.teamId,
          id: { not: session.user.id },
        },
        select: { id: true },
      });

      if (teamMembers.length > 0) {
        await prisma.notification.createMany({
          data: teamMembers.map((member) => ({
            type: 'SYSTEM' as const,
            title: 'New Team Contact',
            message: `${session.user.name} shared contact "${contact.name}" with the team`,
            userId: member.id,
            entityType: 'CONTACT' as const,
            entityId: contact.id,
          })),
        });
      }
    } else if (shareType === 'ORGANIZATION' && updateData.organizationId) {
      // Notify organization admins/owners
      const orgAdmins = await prisma.organizationMember.findMany({
        where: {
          organizationId: updateData.organizationId,
          orgRole: { in: ['OWNER', 'ADMIN'] },
          userId: { not: session.user.id },
        },
        select: { userId: true },
      });

      if (orgAdmins.length > 0) {
        await prisma.notification.createMany({
          data: orgAdmins.map((admin) => ({
            type: 'SYSTEM' as const,
            title: 'New Organization Contact',
            message: `${session.user.name} shared contact "${contact.name}" with the organization`,
            userId: admin.userId,
            entityType: 'CONTACT' as const,
            entityId: contact.id,
          })),
        });
      }
    }

    const shareMessage = shareType === 'TEAM'
      ? 'Contact shared with team successfully'
      : 'Contact shared with organization successfully';

    return NextResponse.json({
      success: true,
      contact,
      message: shareMessage,
    });
  } catch (error) {
    console.error('Share contact error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to share contact' },
      { status: 500 }
    );
  }
}

/**
 * Unshare a contact (make it private)
 * DELETE /api/contacts/[id]/share
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if contact exists and user owns it (only owner can unshare)
    const existingContact = await prisma.contact.findFirst({
      where: {
        id,
        userId: session.user.id,
        OR: [
          { isTeamContact: true },
          { isOrgContact: true },
        ],
      },
    });

    if (!existingContact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found or is not shared' },
        { status: 404 }
      );
    }

    // Make contact private (clear both team and org sharing)
    const contact = await prisma.contact.update({
      where: { id },
      data: {
        isTeamContact: false,
        teamId: null,
        isOrgContact: false,
        organizationId: null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      contact,
      message: 'Contact is now private',
    });
  } catch (error) {
    console.error('Unshare contact error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unshare contact' },
      { status: 500 }
    );
  }
}
