/**
 * Admin Facilities Page
 * View and manage all facilities in the system
 * Note: Currently read-only as data is stored in JSON files
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, Search, MapPin, Filter, Database, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ImportFacilitiesDialog } from '@/components/admin';
import type { Facility } from '@/types/dashboard';

interface CountryOption {
  code: string;
  name: string;
  count: number;
}

interface SectorOption {
  name: string;
  count: number;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface Meta {
  totalFacilities: number;
  countries: CountryOption[];
  sectors: SectorOption[];
  dataSource: string;
}

export default function AdminFacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('pageSize', '50');

      if (search) params.set('search', search);
      if (countryFilter !== 'all') params.set('country', countryFilter);
      if (sectorFilter !== 'all') params.set('sector', sectorFilter);

      const response = await fetch(`/api/admin/facilities?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setFacilities(data.facilities);
        setPagination(data.pagination);
        setMeta(data.meta);
      } else {
        toast.error(data.error || 'Failed to load facilities');
      }
    } catch (error) {
      console.error('Failed to fetch facilities:', error);
      toast.error('Failed to load facilities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [page, countryFilter, sectorFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchFacilities();
  };

  const handleClearFilters = () => {
    setSearch('');
    setCountryFilter('all');
    setSectorFilter('all');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MapPin className="h-8 w-8" />
            Facility Management
          </h1>
          <p className="text-muted-foreground">
            View all facilities in the system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ImportFacilitiesDialog onSuccess={fetchFacilities} />
          <Button
            variant="outline"
            size="icon"
            onClick={fetchFacilities}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Data Source Notice */}
      {meta?.dataSource === 'JSON' && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <Database className="h-5 w-5" />
              <p className="text-sm">
                <strong>Data Source:</strong> Facilities are currently loaded from JSON files ({meta.totalFacilities.toLocaleString()} total).
                Database migration is pending.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      {meta && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Facilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{meta.totalFacilities.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Countries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{meta.countries.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sectors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{meta.sectors.length}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or address..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {meta?.countries.slice(0, 50).map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name} ({country.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {meta?.sectors.slice(0, 30).map((sector) => (
                  <SelectItem key={sector.name} value={sector.name}>
                    {sector.name} ({sector.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">Search</Button>
            <Button type="button" variant="outline" onClick={handleClearFilters}>
              Clear
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Facilities Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Facilities {pagination && `(${pagination.total.toLocaleString()})`}
          </CardTitle>
          <CardDescription>
            {pagination
              ? `Showing ${((pagination.page - 1) * pagination.pageSize + 1).toLocaleString()}-${Math.min(pagination.page * pagination.pageSize, pagination.total).toLocaleString()} of ${pagination.total.toLocaleString()}`
              : 'Loading...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-64 mb-2" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          ) : facilities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No facilities found matching your criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Facility</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Sectors</TableHead>
                    <TableHead>Workers</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facilities.map((facility) => (
                    <TableRow key={facility.id}>
                      <TableCell>
                        <div className="max-w-md">
                          <div className="font-medium truncate">{facility.name}</div>
                          <p className="text-sm text-muted-foreground truncate">
                            {facility.address}
                          </p>
                          {facility.parentCompany && (
                            <p className="text-xs text-muted-foreground">
                              Parent: {facility.parentCompany}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getCountryFlag(facility.countryCode)}</span>
                          <span className="text-sm">{facility.countryName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {facility.sector.slice(0, 2).map((s, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {s}
                            </Badge>
                          ))}
                          {facility.sector.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{facility.sector.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {facility.numberOfWorkers || '—'}
                      </TableCell>
                      <TableCell>
                        {facility.isClosed ? (
                          <Badge variant="destructive">Closed</Badge>
                        ) : (
                          <Badge variant="default" className="bg-green-600">Active</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages.toLocaleString()}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
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
