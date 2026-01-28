'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { UserPlus, Phone, Mail, Building, Globe, Briefcase, MapPin } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import type { Contact } from '@/types/dashboard';

interface AddContactDialogProps {
  onAddContact?: (contact: Contact) => void;
  trigger?: React.ReactNode;
}

/**
 * Add Contact Dialog Component
 * Modal dialog for adding new contacts to the dashboard
 */
export function AddContactDialog({ onAddContact, trigger }: AddContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    position: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    website: '',
    address: '',
    isTeamContact: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.name) {
      toast.error('Please fill in required fields', {
        description: 'Name is required.',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create contact');
      }

      // Call parent callback with the new contact
      onAddContact?.(data.contact);

      // Show success message
      toast.success('Contact added successfully!', {
        description: `${formData.name} has been added to your contacts.`,
      });

      // Reset form and close dialog
      setFormData({
        name: '',
        company: '',
        position: '',
        email: '',
        phone: '',
        whatsappNumber: '',
        website: '',
        address: '',
        isTeamContact: false,
      });
      setOpen(false);
    } catch (error) {
      console.error('Create contact error:', error);
      toast.error('Failed to create contact', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <ShimmerButton
            className="gap-2"
            background="linear-gradient(135deg, from-green-500 to-green-600)"
          >
            <UserPlus className="h-4 w-4" />
            Add Contact
          </ShimmerButton>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Add New Contact
            </DialogTitle>
            <DialogDescription>
              Create a new contact in your network. Fill in the details below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Name Field */}
            <div className="grid gap-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Company Field */}
            <div className="grid gap-2">
              <Label htmlFor="company" className="flex items-center gap-2">
                <Building className="h-3 w-3" />
                Company
              </Label>
              <Input
                id="company"
                name="company"
                placeholder="Acme Corp"
                value={formData.company}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Position Field */}
            <div className="grid gap-2">
              <Label htmlFor="position" className="flex items-center gap-2">
                <Briefcase className="h-3 w-3" />
                Position
              </Label>
              <Input
                id="position"
                name="position"
                placeholder="Sales Manager"
                value={formData.position}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Email Field */}
            <div className="grid gap-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Phone Field */}
            <div className="grid gap-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>

            {/* WhatsApp Field */}
            <div className="grid gap-2">
              <Label htmlFor="whatsappNumber">
                WhatsApp Number
              </Label>
              <Input
                id="whatsappNumber"
                name="whatsappNumber"
                type="tel"
                placeholder="+1 234 567 8900"
                value={formData.whatsappNumber}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Website Field */}
            <div className="grid gap-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe className="h-3 w-3" />
                Website
              </Label>
              <Input
                id="website"
                name="website"
                type="url"
                placeholder="https://example.com"
                value={formData.website}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Address Field */}
            <div className="grid gap-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                Address
              </Label>
              <Input
                id="address"
                name="address"
                placeholder="123 Business St, City"
                value={formData.address}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Team Contact Toggle */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="isTeamContact">Share with Team</Label>
                <p className="text-xs text-muted-foreground">
                  Make this contact visible to your team members
                </p>
              </div>
              <Switch
                id="isTeamContact"
                checked={formData.isTeamContact}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, isTeamContact: checked }))
                }
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Contact'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
