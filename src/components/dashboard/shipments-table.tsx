'use client';

import type { Shipment } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ShipmentsTableProps {
  shipments: Shipment[];
  title?: string;
  maxRows?: number;
  showViewAll?: boolean;
}

/**
 * Shipments Table Component
 * Displays a list of shipments with status and priority badges
 */
export function ShipmentsTable({
  shipments,
  title = '📦 Shipments',
  maxRows = 5,
  showViewAll = true,
}: ShipmentsTableProps) {
  const displayedShipments = shipments.slice(0, maxRows);

  const getStatusColor = (status: Shipment['status']) => {
    switch (status) {
      case 'on-time':
        return 'bg-success/10 text-success border-success/20';
      case 'delayed':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'in-transit':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-900 border-green-200';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityColor = (priority: Shipment['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'normal':
        return 'bg-yellow-100 text-yellow-900 border-yellow-200';
      case 'low':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle>{title}</CardTitle>
        {showViewAll && (
          <Link href="/dashboard/shipments">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr className="text-muted-foreground">
                <th className="text-left py-2 px-3 font-medium">Number</th>
                <th className="text-left py-2 px-3 font-medium">Route</th>
                <th className="text-left py-2 px-3 font-medium">Status</th>
                <th className="text-left py-2 px-3 font-medium">Priority</th>
                <th className="text-left py-2 px-3 font-medium">ETA</th>
              </tr>
            </thead>
            <tbody>
              {displayedShipments.map((shipment) => (
                <tr
                  key={shipment.id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-3">
                    <span className="font-semibold">{shipment.number}</span>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">
                    {shipment.route}
                  </td>
                  <td className="py-3 px-3">
                    <Badge
                      variant="secondary"
                      className={cn('capitalize', getStatusColor(shipment.status))}
                    >
                      {shipment.status === 'on-time' ? 'On Time' : shipment.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3">
                    <Badge
                      variant="secondary"
                      className={cn('capitalize', getPriorityColor(shipment.priority))}
                    >
                      {shipment.priority}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">
                    {shipment.eta}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
