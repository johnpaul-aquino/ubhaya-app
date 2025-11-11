'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ContactCard } from '@/components/dashboard/contact-card';
import { AddContactDialog } from '@/components/dashboard/add-contact-dialog';
import { mockContacts } from '@/lib/dashboard-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BlurFade } from '@/components/ui/blur-fade';
import { Search, Plus, Users } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Contacts Page
 * Manage personal and team contacts with WhatsApp integration
 */
export default function ContactsPage() {
  const [contacts, setContacts] = useState(mockContacts);
  const stats = [
    { label: 'Total Contacts', value: 156 },
    { label: 'My Contacts', value: 89 },
    { label: 'Team Contacts', value: 67 },
    { label: 'With Tasks', value: 12 },
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl font-bold mb-2">👥 Contact Management</h1>
        <p className="text-muted-foreground">
          Manage your personal and team contacts with WhatsApp integration
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* WhatsApp Import Section */}
      <Card className="mb-6 bg-gradient-to-r from-green-500 to-green-600">
        <CardContent className="pt-6">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-2">📱 Import WhatsApp Contacts</h2>
            <p className="mb-4 opacity-90">
              Quickly import your WhatsApp chats and contacts to Ubhaya
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-white text-green-600 hover:bg-gray-100">
                📁 Upload WhatsApp Export
              </Button>
              <AddContactDialog
                onAddContact={(newContact) => {
                  setContacts(prev => [newContact, ...prev]);
                  toast.success('Contact added successfully!');
                }}
                trigger={
                  <Button className="bg-white text-green-600 hover:bg-gray-100">
                    ➕ Add Single Contact
                  </Button>
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, phone or company..."
                className="pl-9"
              />
            </div>
            <Button variant="outline">💬 WhatsApp</Button>
            <Button variant="outline">📧 Gmail</Button>
            <Button>🏢 Company Contacts</Button>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Grid */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>My Contacts</CardTitle>
          <AddContactDialog
            onAddContact={(newContact) => {
              setContacts(prev => [newContact, ...prev]);
            }}
            trigger={
              <Button size="sm" variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Contact
              </Button>
            }
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                showToggle
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
