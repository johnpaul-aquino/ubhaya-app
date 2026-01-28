/**
 * Migration Script: Migrate existing teams to organizations
 *
 * This script:
 * 1. Finds all unique team owners
 * 2. Creates a default organization for each owner
 * 3. Assigns teams to their owner's organization
 * 4. Adds all team members to the organization as MEMBER role
 *
 * Run with: npx ts-node scripts/migrate-to-organizations.ts
 * Or: npx tsx scripts/migrate-to-organizations.ts
 */

import { PrismaClient, OrgRole } from '@prisma/client';

const prisma = new PrismaClient();

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);
}

async function migrateToOrganizations() {
  console.log('🚀 Starting migration to organizations...\n');

  try {
    // 1. Find all teams without an organization
    const teamsWithoutOrg = await prisma.team.findMany({
      where: { organizationId: null },
      include: {
        members: {
          include: { user: true },
        },
      },
    });

    console.log(`📋 Found ${teamsWithoutOrg.length} teams without organization\n`);

    if (teamsWithoutOrg.length === 0) {
      console.log('✅ All teams already have organizations. Nothing to migrate.');
      return;
    }

    // 2. Get unique team owners
    const ownerIds = [...new Set(teamsWithoutOrg.map((t) => t.ownerId))];
    console.log(`👥 Found ${ownerIds.length} unique team owner(s)\n`);

    // 3. For each owner, create an organization and migrate their teams
    for (const ownerId of ownerIds) {
      const owner = await prisma.user.findUnique({
        where: { id: ownerId },
      });

      if (!owner) {
        console.log(`⚠️  Owner ${ownerId} not found, skipping...`);
        continue;
      }

      console.log(`\n📁 Processing owner: ${owner.firstName} ${owner.lastName} (${owner.email})`);

      // Check if this owner already has an organization
      const existingOrg = await prisma.organization.findFirst({
        where: { ownerId: owner.id },
      });

      let organization;

      if (existingOrg) {
        console.log(`   ℹ️  Using existing organization: ${existingOrg.name}`);
        organization = existingOrg;
      } else {
        // Create a new organization for this owner
        const orgName = `${owner.firstName}'s Organization`;
        const baseSlug = generateSlug(orgName);

        // Ensure slug is unique
        let slug = baseSlug;
        let counter = 1;
        while (await prisma.organization.findUnique({ where: { slug } })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        organization = await prisma.organization.create({
          data: {
            name: orgName,
            slug,
            description: `Default organization for ${owner.firstName} ${owner.lastName}`,
            ownerId: owner.id,
            members: {
              create: {
                userId: owner.id,
                orgRole: OrgRole.OWNER,
              },
            },
          },
        });

        console.log(`   ✅ Created organization: ${organization.name} (${organization.slug})`);
      }

      // 4. Get teams owned by this user without organization
      const ownerTeams = teamsWithoutOrg.filter((t) => t.ownerId === ownerId);
      console.log(`   📋 Found ${ownerTeams.length} team(s) to migrate`);

      for (const team of ownerTeams) {
        // Assign team to organization
        await prisma.team.update({
          where: { id: team.id },
          data: { organizationId: organization.id },
        });

        console.log(`   ✅ Assigned team "${team.name}" to organization`);

        // 5. Add all team members to the organization (if not already members)
        for (const member of team.members) {
          if (member.userId === ownerId) {
            // Owner is already added
            continue;
          }

          // Check if already a member of the organization
          const existingMembership = await prisma.organizationMember.findUnique({
            where: {
              userId_organizationId: {
                userId: member.userId,
                organizationId: organization.id,
              },
            },
          });

          if (!existingMembership) {
            await prisma.organizationMember.create({
              data: {
                userId: member.userId,
                organizationId: organization.id,
                orgRole: OrgRole.MEMBER,
              },
            });
            console.log(
              `      ➕ Added ${member.user.firstName} ${member.user.lastName} to organization`
            );
          }
        }
      }
    }

    // 6. Update contacts and documents to have organizationId where applicable
    console.log('\n📝 Updating contacts with organization IDs...');

    const teamsWithOrg = await prisma.team.findMany({
      where: { organizationId: { not: null } },
      select: { id: true, organizationId: true },
    });

    for (const team of teamsWithOrg) {
      // Update team contacts
      const updatedContacts = await prisma.contact.updateMany({
        where: {
          teamId: team.id,
          isTeamContact: true,
          organizationId: null,
        },
        data: {
          organizationId: team.organizationId,
        },
      });

      if (updatedContacts.count > 0) {
        console.log(`   ✅ Updated ${updatedContacts.count} contacts for team ${team.id}`);
      }

      // Update team documents
      const updatedDocuments = await prisma.document.updateMany({
        where: {
          teamId: team.id,
          organizationId: null,
        },
        data: {
          organizationId: team.organizationId,
        },
      });

      if (updatedDocuments.count > 0) {
        console.log(`   ✅ Updated ${updatedDocuments.count} documents for team ${team.id}`);
      }

      // Update team activities
      const updatedActivities = await prisma.activity.updateMany({
        where: {
          teamId: team.id,
          organizationId: null,
        },
        data: {
          organizationId: team.organizationId,
        },
      });

      if (updatedActivities.count > 0) {
        console.log(`   ✅ Updated ${updatedActivities.count} activities for team ${team.id}`);
      }
    }

    console.log('\n✅ Migration completed successfully!');

    // Print summary
    const orgCount = await prisma.organization.count();
    const orgMemberCount = await prisma.organizationMember.count();
    const teamsWithOrgCount = await prisma.team.count({
      where: { organizationId: { not: null } },
    });

    console.log('\n📊 Summary:');
    console.log(`   Organizations: ${orgCount}`);
    console.log(`   Organization Members: ${orgMemberCount}`);
    console.log(`   Teams with Organization: ${teamsWithOrgCount}`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateToOrganizations();
