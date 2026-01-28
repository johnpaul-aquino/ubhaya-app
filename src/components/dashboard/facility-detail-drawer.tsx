'use client';

import type { Facility } from '@/types/dashboard';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  Building2,
  Users,
  Globe,
  Factory,
  Package,
  MapPinned,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface FacilityDetailDrawerProps {
  facility: Facility | null;
  open: boolean;
  onClose: () => void;
}

/**
 * Facility Detail Drawer Component
 * Slide-out panel showing full facility details
 */
export function FacilityDetailDrawer({
  facility,
  open,
  onClose,
}: FacilityDetailDrawerProps) {
  if (!facility) return null;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="text-left">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-lg leading-tight">
                {facility.name}
              </SheetTitle>
              <SheetDescription className="mt-1">
                {facility.isClosed ? (
                  <Badge variant="destructive" className="text-xs">
                    <XCircle className="h-3 w-3 mr-1" />
                    Closed
                  </Badge>
                ) : (
                  <Badge variant="default" className="text-xs bg-green-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Address Section */}
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              <MapPin className="h-4 w-4" />
              Address
            </div>
            <p className="text-sm pl-6">{facility.address}</p>
          </div>

          <Separator />

          {/* Country Section */}
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              <Globe className="h-4 w-4" />
              Country
            </div>
            <div className="flex items-center gap-2 pl-6">
              <span className="text-2xl">
                {getCountryFlag(facility.countryCode)}
              </span>
              <span className="text-sm">
                {facility.countryName} ({facility.countryCode})
              </span>
            </div>
          </div>

          <Separator />

          {/* Sectors Section */}
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              <Factory className="h-4 w-4" />
              Sectors
            </div>
            <div className="flex flex-wrap gap-1.5 pl-6">
              {facility.sector.map((s, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {s}
                </Badge>
              ))}
              {facility.sector.length === 0 && (
                <span className="text-sm text-muted-foreground">
                  No sector information
                </span>
              )}
            </div>
          </div>

          {/* Workers Section */}
          {facility.numberOfWorkers && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <Users className="h-4 w-4" />
                  Number of Workers
                </div>
                <p className="text-sm pl-6">{facility.numberOfWorkers}</p>
              </div>
            </>
          )}

          {/* Parent Company */}
          {facility.parentCompany && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <Building2 className="h-4 w-4" />
                  Parent Company
                </div>
                <p className="text-sm pl-6">{facility.parentCompany}</p>
              </div>
            </>
          )}

          {/* Facility Type */}
          {facility.facilityType && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <Factory className="h-4 w-4" />
                  Facility Type
                </div>
                <p className="text-sm pl-6">{facility.facilityType}</p>
              </div>
            </>
          )}

          {/* Product Type */}
          {facility.productType && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <Package className="h-4 w-4" />
                  Product Type
                </div>
                <p className="text-sm pl-6">{facility.productType}</p>
              </div>
            </>
          )}

          {/* Coordinates Section */}
          {(facility.lat !== 0 || facility.lng !== 0) && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <MapPinned className="h-4 w-4" />
                  Coordinates
                </div>
                <p className="text-sm pl-6 font-mono">
                  {facility.lat.toFixed(6)}, {facility.lng.toFixed(6)}
                </p>
              </div>
            </>
          )}

          {/* Facility ID */}
          <Separator />
          <div>
            <div className="text-xs text-muted-foreground">
              Facility ID: <span className="font-mono">{facility.id}</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
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
