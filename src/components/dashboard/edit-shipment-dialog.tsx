'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Package, MapPin, Calendar, AlertCircle } from 'lucide-react';
import type { Shipment } from '@/types/dashboard';

interface EditShipmentDialogProps {
  shipment: Shipment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (shipment: Shipment) => void;
}

/**
 * Edit Shipment Dialog Component
 * Modal dialog for editing shipment details
 */
export function EditShipmentDialog({
  shipment,
  open,
  onOpenChange,
  onSave
}: EditShipmentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Shipment>>({});

  // Update form data when shipment changes
  useEffect(() => {
    if (shipment) {
      setFormData({
        id: shipment.id,
        origin: shipment.origin,
        destination: shipment.destination,
        status: shipment.status,
        priority: shipment.priority,
        eta: shipment.eta,
      });
    }
  }, [shipment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Call parent callback if provided
    if (onSave && shipment) {
      onSave({
        ...shipment,
        ...formData,
      } as Shipment);
    }

    // Show success message
    toast.success('Shipment updated successfully!', {
      description: `Shipment ${formData.id} has been updated.`,
    });

    setIsSubmitting(false);
    onOpenChange(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!shipment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Edit Shipment
            </DialogTitle>
            <DialogDescription>
              Update the details for shipment {formData.id}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Shipment ID (Read-only) */}
            <div className="grid gap-2">
              <Label htmlFor="id">Shipment ID</Label>
              <Input
                id="id"
                value={formData.id || ''}
                disabled
                className="bg-muted"
              />
            </div>

            {/* Origin */}
            <div className="grid gap-2">
              <Label htmlFor="origin" className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                Origin
              </Label>
              <Input
                id="origin"
                name="origin"
                placeholder="Mumbai, India"
                value={formData.origin || ''}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Destination */}
            <div className="grid gap-2">
              <Label htmlFor="destination" className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                Destination
              </Label>
              <Input
                id="destination"
                name="destination"
                placeholder="Singapore"
                value={formData.destination || ''}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Status */}
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on-time">On Time</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="grid gap-2">
              <Label htmlFor="priority" className="flex items-center gap-2">
                <AlertCircle className="h-3 w-3" />
                Priority
              </Label>
              <Select
                value={formData.priority || 'normal'}
                onValueChange={(value) => handleSelectChange('priority', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ETA */}
            <div className="grid gap-2">
              <Label htmlFor="eta" className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                Estimated Arrival
              </Label>
              <Input
                id="eta"
                name="eta"
                placeholder="Dec 5, 2024"
                value={formData.eta || ''}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}