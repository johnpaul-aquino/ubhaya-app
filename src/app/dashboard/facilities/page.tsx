import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Building2, Package } from 'lucide-react';

/**
 * Facilities Page
 * Search and manage facilities database
 */
export default function FacilitiesPage() {
  const facilities = [
    {
      id: '1',
      name: 'Mumbai Warehouse',
      location: 'Mumbai, India',
      type: 'Warehouse',
      capacity: '10,000 units',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Delhi Distribution Center',
      location: 'Delhi, India',
      type: 'Distribution',
      capacity: '5,000 units',
      status: 'Active',
    },
    {
      id: '3',
      name: 'Bangalore Manufacturing',
      location: 'Bangalore, India',
      type: 'Manufacturing',
      capacity: '3,000 units',
      status: 'Active',
    },
    {
      id: '4',
      name: 'Chennai Port Facility',
      location: 'Chennai, India',
      type: 'Port',
      capacity: '15,000 units',
      status: 'Active',
    },
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl font-bold mb-2">🔍 Facilities</h1>
        <p className="text-muted-foreground">
          Search and manage facilities in our global database
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search facilities by name, location, or type..."
                className="pl-9"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option>Location near me</option>
                <option>Mumbai</option>
                <option>Delhi</option>
                <option>Bangalore</option>
                <option>Chennai</option>
              </select>

              <select className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option>All Countries</option>
                <option>India</option>
                <option>Philippines</option>
                <option>Singapore</option>
                <option>Thailand</option>
              </select>

              <select className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option>All Categories</option>
                <option>Warehouse</option>
                <option>Manufacturing</option>
                <option>Distribution</option>
                <option>Port</option>
              </select>
            </div>

            <Button className="w-full">Search Facilities</Button>
          </div>
        </CardContent>
      </Card>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facilities.map((facility) => (
          <Card key={facility.id} className="hover:border-primary/30 transition-all">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{facility.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {facility.location}
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-900 border border-green-200">
                    {facility.status}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Type</p>
                    <p className="font-medium flex items-center gap-1 mt-0.5">
                      <Building2 className="h-4 w-4" />
                      {facility.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Capacity</p>
                    <p className="font-medium flex items-center gap-1 mt-0.5">
                      <Package className="h-4 w-4" />
                      {facility.capacity}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Contact
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Facilities', value: '50K+' },
          { label: 'In Network', value: '234' },
          { label: 'Countries', value: '45' },
          { label: 'Global Coverage', value: '99%' },
        ].map((stat) => (
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
    </DashboardLayout>
  );
}
