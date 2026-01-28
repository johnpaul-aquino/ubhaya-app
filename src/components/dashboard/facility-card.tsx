'use client';

import type { Facility } from '@/types/dashboard';
import { MapPin, Building2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface FacilityCardProps {
  facility: Facility;
  onClick?: (facility: Facility) => void;
}

/**
 * Facility Card Component (Grid View)
 * Displays facility information in a card format
 */
export function FacilityCard({ facility, onClick }: FacilityCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all"
      onClick={() => onClick?.(facility)}
    >
      <CardContent className="p-4">
        {/* Header with Icon and Status */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          {facility.isClosed && (
            <Badge variant="destructive" className="text-xs">
              Closed
            </Badge>
          )}
        </div>

        {/* Facility Name */}
        <h3 className="font-semibold text-sm line-clamp-2 mb-2">
          {facility.name}
        </h3>

        {/* Address */}
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground mb-3">
          <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{facility.address}</span>
        </div>

        {/* Country */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{getCountryFlag(facility.countryCode)}</span>
          <span className="text-xs font-medium">{facility.countryName}</span>
        </div>

        {/* Sectors */}
        <div className="flex flex-wrap gap-1">
          {facility.sector.slice(0, 3).map((s, i) => (
            <Badge key={i} variant="secondary" className="text-xs px-2 py-0">
              {s}
            </Badge>
          ))}
          {facility.sector.length > 3 && (
            <Badge variant="outline" className="text-xs px-2 py-0">
              +{facility.sector.length - 3}
            </Badge>
          )}
        </div>

        {/* Workers count if available */}
        {facility.numberOfWorkers && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3 pt-3 border-t">
            <Users className="h-3.5 w-3.5" />
            <span>{facility.numberOfWorkers} workers</span>
          </div>
        )}
      </CardContent>
    </Card>
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
