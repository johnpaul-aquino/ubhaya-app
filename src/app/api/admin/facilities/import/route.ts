/**
 * Admin Facilities Import API Route
 * POST /api/admin/facilities/import - Import facilities from CSV
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-guard';
import { prisma } from '@/lib/prisma';

interface CSVRow {
  os_id?: string;
  name?: string;
  address?: string;
  country_code?: string;
  country_name?: string;
  lat?: string;
  lng?: string;
  sector?: string;
  number_of_workers?: string;
  parent_company?: string;
  facility_type?: string;
  product_type?: string;
  is_closed?: string;
}

function parseCSV(csvText: string): CSVRow[] {
  const lines = csvText.split('\n');
  if (lines.length < 2) return [];

  // Parse header
  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine).map((h) => h.toLowerCase().trim());

  const rows: CSVRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    const row: Record<string, string> = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    rows.push(row as CSVRow);
  }

  return rows;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function parseSector(sectorString: string): string[] {
  if (!sectorString) return [];
  // Split by pipe character and clean up
  return sectorString
    .split('|')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export async function POST(request: NextRequest) {
  const { authorized, response } = await requireAdmin();

  if (!authorized) {
    return response;
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { success: false, error: 'File must be a CSV' },
        { status: 400 }
      );
    }

    // Read file content
    const csvText = await file.text();
    const rows = parseCSV(csvText);

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'CSV file is empty or invalid' },
        { status: 400 }
      );
    }

    // Process rows and prepare for database
    const errors: string[] = [];
    const facilitiesToCreate: Array<{
      name: string;
      address: string;
      countryCode: string;
      countryName: string;
      lat: number;
      lng: number;
      sector: string[];
      numberOfWorkers: string | null;
      parentCompany: string | null;
      facilityType: string | null;
      productType: string | null;
      isClosed: boolean;
    }> = [];

    let skipped = 0;

    // Get existing facility names to check for duplicates
    const existingFacilities = await prisma.facility.findMany({
      select: { name: true, address: true },
    });
    const existingSet = new Set(
      existingFacilities.map((f) => `${f.name}|${f.address}`)
    );

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // +2 because of header and 0-indexing

      // Validate required fields
      if (!row.name || !row.name.trim()) {
        errors.push(`Row ${rowNum}: Missing name`);
        continue;
      }

      if (!row.address || !row.address.trim()) {
        errors.push(`Row ${rowNum}: Missing address`);
        continue;
      }

      if (!row.country_code || !row.country_code.trim()) {
        errors.push(`Row ${rowNum}: Missing country_code`);
        continue;
      }

      if (!row.country_name || !row.country_name.trim()) {
        errors.push(`Row ${rowNum}: Missing country_name`);
        continue;
      }

      // Parse lat/lng
      const lat = parseFloat(row.lat || '0');
      const lng = parseFloat(row.lng || '0');

      if (isNaN(lat) || isNaN(lng)) {
        errors.push(`Row ${rowNum}: Invalid lat/lng`);
        continue;
      }

      // Check for duplicates
      const key = `${row.name.trim()}|${row.address.trim()}`;
      if (existingSet.has(key)) {
        skipped++;
        continue;
      }

      // Add to set to prevent duplicates within the same import
      existingSet.add(key);

      facilitiesToCreate.push({
        name: row.name.trim(),
        address: row.address.trim(),
        countryCode: row.country_code.trim().toUpperCase(),
        countryName: row.country_name.trim(),
        lat,
        lng,
        sector: parseSector(row.sector || ''),
        numberOfWorkers: row.number_of_workers?.trim() || null,
        parentCompany: row.parent_company?.trim() || null,
        facilityType: row.facility_type?.trim() || null,
        productType: row.product_type?.trim() || null,
        isClosed: row.is_closed?.toLowerCase() === 'true',
      });
    }

    // Batch insert facilities
    let imported = 0;
    const batchSize = 500;

    for (let i = 0; i < facilitiesToCreate.length; i += batchSize) {
      const batch = facilitiesToCreate.slice(i, i + batchSize);

      try {
        const result = await prisma.facility.createMany({
          data: batch,
          skipDuplicates: true,
        });
        imported += result.count;
      } catch (batchError) {
        console.error(`Batch ${i / batchSize + 1} error:`, batchError);
        errors.push(`Batch ${i / batchSize + 1}: Database error`);
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      skipped,
      errors: errors.slice(0, 20), // Limit errors returned
      total: rows.length,
    });
  } catch (error) {
    console.error('Failed to import facilities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to import facilities' },
      { status: 500 }
    );
  }
}
