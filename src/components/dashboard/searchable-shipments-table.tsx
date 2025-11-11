'use client';

import { useMemo } from 'react';
import { ShipmentsTable } from './shipments-table';
import { useSearchContext } from './dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import type { Shipment } from '@/types/dashboard';

interface SearchableShipmentsTableProps {
  shipments: Shipment[];
  className?: string;
}

/**
 * Searchable Shipments Table Component
 * Filters shipments based on search query from navbar
 */
export function SearchableShipmentsTable({
  shipments,
  className
}: SearchableShipmentsTableProps) {
  const { searchQuery } = useSearchContext();

  // Filter shipments based on search query
  const filteredShipments = useMemo(() => {
    if (!searchQuery.trim()) return shipments;

    const query = searchQuery.toLowerCase();

    return shipments.filter(shipment => {
      // Search across multiple fields
      return (
        shipment.id.toLowerCase().includes(query) ||
        shipment.origin.toLowerCase().includes(query) ||
        shipment.destination.toLowerCase().includes(query) ||
        shipment.status.toLowerCase().includes(query) ||
        (shipment.priority && shipment.priority.toLowerCase().includes(query)) ||
        shipment.eta.toLowerCase().includes(query)
      );
    });
  }, [shipments, searchQuery]);

  // Show search status
  const isSearching = searchQuery.trim().length > 0;
  const hasResults = filteredShipments.length > 0;

  if (isSearching && !hasResults) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              No shipments match your search for "{searchQuery}". Try adjusting your search terms.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {isSearching && (
        <div className="mb-4 flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Search className="h-3 w-3" />
            Searching: "{searchQuery}"
          </Badge>
          <Badge variant="outline">
            {filteredShipments.length} result{filteredShipments.length !== 1 ? 's' : ''} found
          </Badge>
        </div>
      )}
      <ShipmentsTable
        shipments={filteredShipments}
        className="animate-in fade-in-50 duration-300"
      />
    </div>
  );
}