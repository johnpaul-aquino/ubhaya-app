/**
 * Facilities Data
 * Loads and exports facility data from JSON files
 */

import type { Facility } from '@/types/dashboard';
import facilitiesJson from './data/facilities.json';
import facilitiesMetaJson from './data/facilities-meta.json';

// Export facilities array with proper typing
export const facilities: Facility[] = facilitiesJson as Facility[];

// Export metadata
export const facilitiesMeta = facilitiesMetaJson as {
  countries: { code: string; name: string; count: number }[];
  sectors: { name: string; count: number }[];
  totalCount: number;
};

// Helper functions for filtering
export function searchFacilities(
  query: string,
  countryFilter?: string,
  sectorFilter?: string
): Facility[] {
  let results = facilities;

  // Filter by country
  if (countryFilter) {
    results = results.filter(f => f.countryCode === countryFilter);
  }

  // Filter by sector
  if (sectorFilter) {
    results = results.filter(f => f.sector.includes(sectorFilter));
  }

  // Search by name or address
  if (query) {
    const searchLower = query.toLowerCase();
    results = results.filter(
      f =>
        f.name.toLowerCase().includes(searchLower) ||
        f.address.toLowerCase().includes(searchLower)
    );
  }

  return results;
}

export function paginateFacilities(
  facilities: Facility[],
  page: number,
  pageSize: number
): { data: Facility[]; total: number; totalPages: number } {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: facilities.slice(start, end),
    total: facilities.length,
    totalPages: Math.ceil(facilities.length / pageSize),
  };
}
