/**
 * Migrate Facilities from JSON to PostgreSQL
 *
 * This script imports facility data from the JSON file into the database.
 * Run with: node scripts/migrate-facilities.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const BATCH_SIZE = 100; // Insert in batches of 100

async function main() {
  console.log('🚀 Starting facilities migration...\n');

  // Read the JSON file
  const jsonPath = path.join(__dirname, '../src/lib/data/facilities.json');

  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Facilities JSON file not found at: ${jsonPath}`);
  }

  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const facilities = JSON.parse(rawData);

  console.log(`📦 Found ${facilities.length} facilities to import\n`);

  // Check current count in database
  const existingCount = await prisma.facility.count();
  console.log(`📊 Current facilities in database: ${existingCount}\n`);

  if (existingCount > 0) {
    console.log('⚠️  Database already has facilities. Skipping duplicates by ID...\n');
  }

  // Get existing IDs to avoid duplicates
  const existingFacilities = await prisma.facility.findMany({
    select: { id: true },
  });
  const existingIds = new Set(existingFacilities.map(f => f.id));

  // Filter out existing facilities
  const newFacilities = facilities.filter(f => !existingIds.has(f.id));
  console.log(`📝 New facilities to import: ${newFacilities.length}\n`);

  if (newFacilities.length === 0) {
    console.log('✅ No new facilities to import. Database is up to date!\n');
    return;
  }

  // Process in batches
  let imported = 0;
  let failed = 0;
  const totalBatches = Math.ceil(newFacilities.length / BATCH_SIZE);

  for (let i = 0; i < newFacilities.length; i += BATCH_SIZE) {
    const batch = newFacilities.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;

    try {
      // Transform data to match Prisma schema
      const facilityData = batch.map(f => ({
        id: f.id,
        name: f.name || 'Unknown',
        address: f.address || '',
        countryCode: f.countryCode || '',
        countryName: f.countryName || '',
        lat: typeof f.lat === 'number' ? f.lat : 0,
        lng: typeof f.lng === 'number' ? f.lng : 0,
        sector: Array.isArray(f.sector) ? f.sector : [],
        numberOfWorkers: f.numberOfWorkers || null,
        parentCompany: f.parentCompany || null,
        facilityType: f.facilityType || null,
        productType: f.productType || null,
        isClosed: Boolean(f.isClosed),
      }));

      await prisma.facility.createMany({
        data: facilityData,
        skipDuplicates: true,
      });

      imported += batch.length;
      process.stdout.write(`\r📦 Progress: Batch ${batchNumber}/${totalBatches} | Imported: ${imported} | Failed: ${failed}`);
    } catch (error) {
      console.error(`\n❌ Error in batch ${batchNumber}:`, error.message);
      failed += batch.length;
    }
  }

  console.log('\n\n✅ Migration completed!\n');

  // Final count
  const finalCount = await prisma.facility.count();
  console.log(`📊 Final facilities count in database: ${finalCount}`);
  console.log(`   - Successfully imported: ${imported}`);
  console.log(`   - Failed: ${failed}\n`);
}

main()
  .catch((e) => {
    console.error('❌ Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
