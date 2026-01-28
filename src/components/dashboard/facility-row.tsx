'use client';

import type { Facility } from '@/types/dashboard';
import { Badge } from '@/components/ui/badge';

interface FacilityRowProps {
  facility: Facility;
  onClick?: (facility: Facility) => void;
}

/**
 * Facility Row Component (List/Table View)
 * Displays facility information in a compact row format
 */
export function FacilityRow({ facility, onClick }: FacilityRowProps) {
  return (
    <div
      className="flex items-center gap-4 p-3 rounded-lg border border-border bg-card hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
      onClick={() => onClick?.(facility)}
    >
      {/* Country Flag */}
      <span className="text-xl flex-shrink-0">
        {getCountryFlag(facility.countryCode)}
      </span>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{facility.name}</p>
      </div>

      {/* Address */}
      <div className="hidden md:block flex-1 min-w-0">
        <p className="text-sm text-muted-foreground truncate">
          {facility.address}
        </p>
      </div>

      {/* Country */}
      <div className="hidden lg:block w-24 flex-shrink-0">
        <p className="text-sm text-muted-foreground truncate">
          {facility.countryName}
        </p>
      </div>

      {/* Sector */}
      <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
        {facility.sector.slice(0, 2).map((s, i) => (
          <Badge key={i} variant="secondary" className="text-xs">
            {s.length > 12 ? s.slice(0, 12) + '...' : s}
          </Badge>
        ))}
        {facility.sector.length > 2 && (
          <Badge variant="outline" className="text-xs">
            +{facility.sector.length - 2}
          </Badge>
        )}
      </div>

      {/* Status */}
      {facility.isClosed && (
        <Badge variant="destructive" className="text-xs flex-shrink-0">
          Closed
        </Badge>
      )}
    </div>
  );
}

// Helper function to get country flag emoji
function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍';

  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
}
