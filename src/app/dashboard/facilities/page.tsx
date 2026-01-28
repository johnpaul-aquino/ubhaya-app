'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { FacilityCard } from '@/components/dashboard/facility-card';
import { FacilityRow } from '@/components/dashboard/facility-row';
import { FacilityDetailDrawer } from '@/components/dashboard/facility-detail-drawer';
import type { Facility, FacilitiesResponse } from '@/types/dashboard';
import {
  Search,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  X,
  Database,
} from 'lucide-react';

/**
 * Facilities Page
 * Search and browse 4,850+ facilities
 */
export default function FacilitiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [countries, setCountries] = useState<
    { code: string; name: string; count: number }[]
  >([]);
  const [sectors, setSectors] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });

  // Filter state from URL
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [country, setCountry] = useState(searchParams.get('country') || '');
  const [sector, setSector] = useState(searchParams.get('sector') || '');
  const [page, setPage] = useState(
    parseInt(searchParams.get('page') || '1', 10)
  );

  // View state (grid or list)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('facilitiesViewMode') as 'grid' | 'list') || 'grid';
    }
    return 'grid';
  });

  // Detail drawer state
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch facilities
  const fetchFacilities = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (country) params.set('country', country);
      if (sector) params.set('sector', sector);
      params.set('page', page.toString());
      params.set('pageSize', '20');

      const response = await fetch(`/api/facilities?${params.toString()}`);
      const data: FacilitiesResponse = await response.json();

      if (data.success) {
        setFacilities(data.facilities);
        setPagination(data.pagination);
        setCountries(data.filters.countries);
        setSectors(data.filters.sectors);
      }
    } catch (error) {
      console.error('Failed to fetch facilities:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, country, sector, page]);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (country) params.set('country', country);
    if (sector) params.set('sector', sector);
    if (page > 1) params.set('page', page.toString());

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : '/dashboard/facilities';
    router.replace(newUrl, { scroll: false });
  }, [debouncedSearch, country, sector, page, router]);

  // Save view mode to localStorage
  useEffect(() => {
    localStorage.setItem('facilitiesViewMode', viewMode);
  }, [viewMode]);

  // Handle facility click
  const handleFacilityClick = (facility: Facility) => {
    setSelectedFacility(facility);
    setDrawerOpen(true);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setCountry('');
    setSector('');
    setPage(1);
  };

  const hasFilters = search || country || sector;

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Database className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Facilities Database</h1>
        </div>
        <p className="text-muted-foreground">
          Search from {pagination.total.toLocaleString()} global facilities
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search facilities by name or address..."
                className="pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Country Filter */}
              <Select
                value={country}
                onValueChange={(value) => {
                  setCountry(value === 'all' ? '' : value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name} ({c.count.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sector Filter */}
              <Select
                value={sector}
                onValueChange={(value) => {
                  setSector(value === 'all' ? '' : value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Sectors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  {sectors.map((s) => (
                    <SelectItem key={s.name} value={s.name}>
                      {s.name} ({s.count.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex items-center gap-1 ml-auto">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Results Info & Clear */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Showing{' '}
                {Math.min((page - 1) * 20 + 1, pagination.total).toLocaleString()}
                -{Math.min(page * 20, pagination.total).toLocaleString()} of{' '}
                {pagination.total.toLocaleString()} results
              </span>
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-2'
          }
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className={viewMode === 'grid' ? 'h-52' : 'h-16'}
            />
          ))}
        </div>
      ) : facilities.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No facilities found. Try adjusting your search or filters.
            </p>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facilities.map((facility) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              onClick={handleFacilityClick}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {facilities.map((facility) => (
            <FacilityRow
              key={facility.id}
              facility={facility}
              onClick={handleFacilityClick}
            />
          ))}
        </div>
      )}

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
            Page {page} of {pagination.totalPages.toLocaleString()}
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
      <FacilityDetailDrawer
        facility={selectedFacility}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </DashboardLayout>
  );
}
