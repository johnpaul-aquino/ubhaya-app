'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ShipmentsTable } from '@/components/dashboard/shipments-table';
import { EditShipmentDialog } from '@/components/dashboard/edit-shipment-dialog';
import { mockShipments } from '@/lib/dashboard-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Edit } from 'lucide-react';
import type { Shipment } from '@/types/dashboard';

/**
 * Shipments Page
 * Comprehensive shipment tracking and management
 */
export default function ShipmentsPage() {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [shipments, setShipments] = useState(mockShipments);

  const handleEditShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsEditDialogOpen(true);
  };

  const handleSaveShipment = (updatedShipment: Shipment) => {
    setShipments(prev =>
      prev.map(s => s.id === updatedShipment.id ? updatedShipment : s)
    );
  };
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl font-bold mb-2">📦 Shipments</h1>
        <p className="text-muted-foreground">
          Track and manage all your shipments in one place
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by shipment number..."
                className="pl-9"
              />
            </div>
            <select className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option>All Status</option>
              <option>On Time</option>
              <option>Delayed</option>
              <option>In Transit</option>
              <option>Delivered</option>
            </select>
            <select className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option>All Priority</option>
              <option>High</option>
              <option>Normal</option>
              <option>Low</option>
            </select>
            <Button className="whitespace-nowrap">Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Shipments Table with Edit capability */}
      <Card>
        <CardHeader>
          <CardTitle>📦 All Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Click on any shipment to edit its details
          </p>
          <div className="space-y-2">
            {shipments.map((shipment) => (
              <div
                key={shipment.id}
                className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleEditShipment(shipment)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{shipment.id}</span>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <span className="text-sm">{shipment.origin} → {shipment.destination}</span>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Shipment Dialog */}
      <EditShipmentDialog
        shipment={selectedShipment}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveShipment}
      />
    </DashboardLayout>
  );
}
