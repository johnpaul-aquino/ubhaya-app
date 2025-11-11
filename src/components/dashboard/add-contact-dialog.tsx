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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { UserPlus, Phone, Mail, Building, Globe, FileText } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/shimmer-button';

interface AddContactDialogProps {
  onAddContact?: (contact: any) => void;
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
    email: '',
    phone: '',
    whatsapp: '',
    website: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.name || !formData.email) {
      toast.error('Please fill in required fields', {
        description: 'Name and email are required.',
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Call parent callback if provided
    onAddContact?.({
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    });

    // Show success message
    toast.success('Contact added successfully!', {
      description: `${formData.name} has been added to your contacts.`,
      action: {
        label: 'View',
        onClick: () => console.log('View contact'),
      },
    });

    // Reset form and close dialog
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      whatsapp: '',
      website: '',
      notes: '',
    });
    setIsSubmitting(false);
    setOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      <DialogContent className="sm:max-w-[500px]">
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

            {/* Email Field */}
            <div className="grid gap-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
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
              <Label htmlFor="whatsapp">
                WhatsApp Number
              </Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                placeholder="+1 234 567 8900"
                value={formData.whatsapp}
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

            {/* Notes Field */}
            <div className="grid gap-2">
              <Label htmlFor="notes" className="flex items-center gap-2">
                <FileText className="h-3 w-3" />
                Notes
              </Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Additional notes about this contact..."
                value={formData.notes}
                onChange={handleInputChange}
                disabled={isSubmitting}
                rows={3}
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