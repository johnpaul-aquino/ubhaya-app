/**
 * Migration script to add existing team owners to TeamMember junction table
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateTeamMembers() {
  // Get all teams
  const teams = await prisma.team.findMany();
  console.log('Found teams:', teams.length);

  for (const team of teams) {
    console.log('Processing team:', team.name, 'Owner:', team.ownerId);

    // Add owner as OWNER team member
    try {
      await prisma.teamMember.upsert({
        where: {
          userId_teamId: {
            userId: team.ownerId,
            teamId: team.id,
          },
        },
        update: { teamRole: 'OWNER' },
        create: {
          userId: team.ownerId,
          teamId: team.id,
          teamRole: 'OWNER',
        },
      });
      console.log('  Added owner to team as OWNER');
    } catch (e) {
      console.log('  Error adding owner:', e.message);
    }
  }

  console.log('Migration complete!');
}

migrateTeamMembers()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
