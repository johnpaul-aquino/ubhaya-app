'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ContactCard } from '@/components/dashboard/contact-card';
import { AddContactDialog } from '@/components/dashboard/add-contact-dialog';
import { ContactDetailDrawer } from '@/components/dashboard/contact-detail-drawer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlurFade } from '@/components/ui/blur-fade';
import {
  Search,
  Plus,
  Users,
  User,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Contact, ContactsResponse } from '@/types/dashboard';

/**
 * Contacts Page
 * Manage personal and team contacts with WhatsApp integration
 */
export default function ContactsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });

  // Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filter, setFilter] = useState<'all' | 'my' | 'team'>(
    (searchParams.get('filter') as 'all' | 'my' | 'team') || 'all'
  );
  const [page, setPage] = useState(
    parseInt(searchParams.get('page') || '1', 10)
  );

  // Detail drawer state
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch contacts
  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (filter === 'team') params.set('isTeamContact', 'true');
      if (filter === 'my') params.set('isTeamContact', 'false');
      params.set('page', page.toString());
      params.set('pageSize', '20');

      const response = await fetch(`/api/contacts?${params.toString()}`);
      const data: ContactsResponse = await response.json();

      if (data.success) {
        setContacts(data.contacts);
        setPagination(data.pagination);
      } else {
        toast.error('Failed to load contacts');
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filter, page]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (filter !== 'all') params.set('filter', filter);
    if (page > 1) params.set('page', page.toString());

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : '/dashboard/contacts';
    router.replace(newUrl, { scroll: false });
  }, [debouncedSearch, filter, page, router]);

  // Handle contact click
  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setDrawerOpen(true);
  };

  // Handle new contact added
  const handleAddContact = (newContact: Contact) => {
    setContacts(prev => [newContact, ...prev]);
    setPagination(prev => ({ ...prev, total: prev.total + 1 }));
  };

  // Handle contact update
  const handleUpdateContact = (updatedContact: Contact) => {
    setContacts(prev =>
      prev.map(c => (c.id === updatedContact.id ? updatedContact : c))
    );
    setSelectedContact(updatedContact);
  };

  // Handle contact delete
  const handleDeleteContact = (contactId: string) => {
    setContacts(prev => prev.filter(c => c.id !== contactId));
    setPagination(prev => ({ ...prev, total: prev.total - 1 }));
  };

  // Calculate stats
  const stats = [
    { label: 'Total Contacts', value: pagination.total, icon: Users },
    {
      label: 'My Contacts',
      value: contacts.filter(c => !c.isTeamContact).length,
      icon: User,
    },
    {
      label: 'Team Contacts',
      value: contacts.filter(c => c.isTeamContact).length,
      icon: Users,
    },
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Contact Management</h1>
        </div>
        <p className="text-muted-foreground">
          Manage your personal and team contacts with WhatsApp integration
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => (
          <BlurFade key={stat.label} delay={0.1}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </div>


      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, email, phone, or company..."
                className="pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Filter Tabs */}
            <Tabs
              value={filter}
              onValueChange={(v) => {
                setFilter(v as 'all' | 'my' | 'team');
                setPage(1);
              }}
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="my">My Contacts</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Refresh */}
            <Button
              variant="outline"
              size="icon"
              onClick={fetchContacts}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-muted-foreground">
            {loading ? (
              'Loading...'
            ) : (
              <>
                Showing {contacts.length} of {pagination.total} contacts
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Contacts</CardTitle>
          <AddContactDialog
            onAddContact={handleAddContact}
            trigger={
              <Button size="sm" variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Contact
              </Button>
            }
          />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No contacts found</h3>
              <p className="text-muted-foreground mb-4">
                {search
                  ? 'Try adjusting your search terms'
                  : 'Get started by adding your first contact'}
              </p>
              {!search && (
                <AddContactDialog
                  onAddContact={handleAddContact}
                  trigger={
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Contact
                    </Button>
                  }
                />
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {contacts.map((contact, index) => (
                <BlurFade key={contact.id} delay={0.05 * index}>
                  <div
                    onClick={() => handleContactClick(contact)}
                    className="cursor-pointer"
                  >
                    <ContactCard
                      contact={contact}
                      showToggle={false}
                    />
                  </div>
                </BlurFade>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground px-4">
            Page {page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === pagination.totalPages}
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Detail Drawer */}
      <ContactDetailDrawer
        contact={selectedContact}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onUpdate={handleUpdateContact}
        onDelete={handleDeleteContact}
      />
    </DashboardLayout>
  );
}
