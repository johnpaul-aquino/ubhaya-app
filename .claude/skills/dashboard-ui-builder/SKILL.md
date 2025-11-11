---
name: Dashboard UI Builder
description: Build admin dashboard components with reusable patterns using Magic UI + shadcn/ui
---

# Dashboard UI Builder

Expert guidance for creating professional admin/management dashboards with Magic UI v4, shadcn/ui, and Tailwind CSS.

## Context

This skill focuses on building **reusable dashboard component library** for the HireXp project:
- **Target**: Admin/management dashboards
- **Tech Stack**: Magic UI v4, shadcn/ui, Tailwind v4, Next.js, TypeScript
- **Focus Areas**: Layout & structure, Interactive components, UX patterns
- **Approach**: Component library creation with proven patterns

---

## Available Components Reference

### Core UI Components (shadcn/ui)

**Data Display:**
- **Card** - Container with Header, Title, Description, Content, Footer
- **Badge** - Status indicators (default, secondary, destructive, outline, success, warning, info)
- **Alert** - Contextual alerts (Success, Error, Warning, Info)
- **Button** - Multiple variants (default, secondary, destructive, outline, ghost)

**Form Components:**
- **Input** - With icons, validation states, password toggle, character counter
- **Select** - Dropdown with error/success states and variants
- **Checkbox** - With validation support
- **RadioGroup** - Single-select with validation
- **Textarea** - Multi-line with validation

**Modal & Panels:**
- **Dialog/Modal** - Modal system for forms and confirmations
- **Sheet** - Slide-out panels (perfect for side drawers, filters)

**Other:**
- **Loading Spinner** - For loading states
- **Pagination** - Full pagination with search params support
- **Dropdown Menu** - For action menus and quick access

### Navigation Components

- **Navbar** - Hierarchical nav with dropdowns and active state
- **Breadcrumbs** - With `useBreadcrumbs` hook for auto-generation
- **Mobile Menu** - Sheet-based mobile navigation

### Layout Components

- **Container** - Responsive container with max-widths
- **Section** - Consistent spacing wrapper
- **Header** - Sticky header with theme toggle

---

## Quick Start: Common Dashboard Patterns

### Pattern 1: Dashboard Layout Structure

```typescript
// components/dashboard/dashboard-layout.tsx
'use client';
import { useState } from 'react';
import { ChevronLeft, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarContent: React.ReactNode;
  title?: string;
  breadcrumbs?: Array<{ label: string; href: string }>;
}

export function DashboardLayout({
  children,
  sidebarContent,
  title,
  breadcrumbs,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          'hidden md:flex flex-col w-64 border-r border-border bg-card transition-all duration-300',
          !sidebarOpen && 'w-20'
        )}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && <h2 className="font-bold text-lg">HireXp</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <ChevronLeft className={cn('h-4 w-4', !sidebarOpen && 'rotate-180')} />
          </Button>
        </div>

        <nav className={cn('flex-1 overflow-y-auto p-4', !sidebarOpen && 'p-2')}>
          {sidebarContent}
        </nav>
      </aside>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <aside className="md:hidden fixed inset-0 z-40 w-64 border-r border-border bg-card">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-lg">HireXp</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="p-4">
            {sidebarContent}
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="border-b border-border bg-card sticky top-0 z-30">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              {title && <h1 className="text-xl font-semibold">{title}</h1>}
            </div>

            {/* Action items go here */}
            <div className="flex items-center gap-2">
              {/* Theme toggle, profile, etc */}
            </div>
          </div>

          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="px-4 py-2 border-t border-border/50 text-sm">
              <nav className="flex items-center gap-2">
                {breadcrumbs.map((crumb, i) => (
                  <div key={crumb.href} className="flex items-center gap-2">
                    {i > 0 && <span className="text-muted-foreground">/</span>}
                    <a href={crumb.href} className="text-primary hover:underline">
                      {crumb.label}
                    </a>
                  </div>
                ))}
              </nav>
            </div>
          )}
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
```

### Pattern 2: Data Table Component

```typescript
// components/dashboard/data-table.tsx
'use client';
import { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
  Search,
  X,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: string;
}

interface Action<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  variant?: 'default' | 'destructive';
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  actions?: Action<T>[];
  onSearch?: (query: string) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  actions,
  onSearch,
  selectable = true,
  onSelectionChange,
  isLoading,
  emptyMessage = 'No data found',
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSort = (key: keyof T) => {
    if (sortBy === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
      onSelectionChange?.([]);
    } else {
      const newSelected = new Set(paginatedData.map((row) => row.id));
      setSelectedIds(newSelected);
      onSelectionChange?.(Array.from(newSelected));
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
    onSelectionChange?.(Array.from(newSelected));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="h-12 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      {onSearch && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch(e.target.value);
              }}
              className="pl-9"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  onSearch('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <span className="text-sm font-medium">
            {selectedIds.size} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedIds(new Set());
                onSelectionChange?.([]);
              }}
            >
              Clear
            </Button>
            {actions?.map((action) => (
              <Button
                key={action.label}
                variant={action.variant === 'destructive' ? 'destructive' : 'default'}
                size="sm"
                onClick={() => {
                  selectedIds.forEach((id) => {
                    const row = data.find((r) => r.id === id);
                    if (row) action.onClick(row);
                  });
                  setSelectedIds(new Set());
                  onSelectionChange?.([]);
                }}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIds.size === paginatedData.length && data.length > 0}
                    indeterminate={selectedIds.size > 0 && selectedIds.size < paginatedData.length}
                    onCheckedChange={() => handleSelectAll()}
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={column.width || 'w-auto'}
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center gap-2 hover:text-foreground transition-colors"
                    >
                      {column.label}
                      {sortBy === column.key && (
                        sortDir === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      )}
                    </button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
              {actions && <TableHead className="w-12">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/50">
                {selectable && (
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(row.id)}
                      onCheckedChange={() => handleSelectRow(row.id)}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={String(column.key)}>
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key])}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {actions.map((action) => (
                          <DropdownMenuItem
                            key={action.label}
                            onClick={() => action.onClick(row)}
                            className={action.variant === 'destructive' ? 'text-destructive' : ''}
                          >
                            {action.icon}
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
```

### Pattern 3: Stat Card Component

```typescript
// components/dashboard/stat-card.tsx
'use client';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number; // percentage
    direction: 'up' | 'down' | 'neutral';
    period: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info';
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  const trendIcons = {
    up: <TrendingUp className="h-4 w-4" />,
    down: <TrendingDown className="h-4 w-4" />,
    neutral: <Minus className="h-4 w-4" />,
  };

  const trendColors = {
    up: 'text-success bg-success/10',
    down: 'text-destructive bg-destructive/10',
    neutral: 'text-muted-foreground bg-muted',
  };

  const variantColors = {
    default: 'border-primary/20',
    success: 'border-success/20',
    warning: 'border-warning/20',
    destructive: 'border-destructive/20',
    info: 'border-info/20',
  };

  return (
    <Card className={cn('overflow-hidden', variantColors[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-bold">{value}</div>
          {trend && (
            <div className={cn('flex items-center gap-1 text-xs font-medium', trendColors[trend.direction])}>
              {trendIcons[trend.direction]}
              <span>{Math.abs(trend.value)}% {trend.period}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Usage Example
export function StatCardsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Users"
        value="1,234"
        icon={<Users className="h-5 w-5" />}
        trend={{ value: 12, direction: 'up', period: 'vs last month' }}
      />
      <StatCard
        title="Active Sessions"
        value="567"
        icon={<Activity className="h-5 w-5" />}
        trend={{ value: 5, direction: 'down', period: 'vs last month' }}
        variant="warning"
      />
      {/* More cards... */}
    </div>
  );
}
```

### Pattern 4: Filter Bar Component

```typescript
// components/dashboard/filter-bar.tsx
'use client';
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface FilterChip {
  id: string;
  label: string;
  value: string;
}

interface FilterBarProps {
  onSearch?: (query: string) => void;
  filters?: Array<{
    id: string;
    label: string;
    options: Array<{ value: string; label: string }>;
    value?: string;
    onChange?: (value: string) => void;
  }>;
  activeFilters?: FilterChip[];
  onRemoveFilter?: (id: string) => void;
  onClearAll?: () => void;
}

export function FilterBar({
  onSearch,
  filters = [],
  activeFilters = [],
  onRemoveFilter,
  onClearAll,
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row gap-2">
        {/* Search */}
        {onSearch && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch(e.target.value);
              }}
              className="pl-9"
            />
          </div>
        )}

        {/* Filters */}
        {filters.map((filter) => (
          <Select key={filter.id} value={filter.value} onValueChange={filter.onChange}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active:</span>
          {activeFilters.map((filter) => (
            <Badge
              key={filter.id}
              variant="secondary"
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => onRemoveFilter?.(filter.id)}
            >
              {filter.label}: {filter.value}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-xs text-destructive hover:text-destructive"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
```

### Pattern 5: Empty State Component

```typescript
// components/dashboard/empty-state.tsx
import { AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'empty' | 'no-results' | 'error';
}

export function EmptyState({
  icon = <AlertCircle className="h-12 w-12 text-muted-foreground" />,
  title,
  description,
  action,
  variant = 'empty',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-sm">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick}>
          <Plus className="h-4 w-4 mr-2" />
          {action.label}
        </Button>
      )}
    </div>
  );
}
```

---

## Magic UI Integration Guide

### Recommended Components for Dashboards

**1. Bento Grid** - Dashboard card layouts
```typescript
// Perfect for stat cards or feature grid
import BentoGrid from '@/components/magic-ui/bento-grid';

// Use for 2x2, 3x3 grid layouts of cards
```

**2. Animated List** - Activity feeds and notifications
```typescript
// Great for recent activities, notifications, audit logs
import AnimatedList from '@/components/magic-ui/animated-list';

// Shows list items with smooth animations
```

**3. Number Ticker** - Animated metric values
```typescript
// Perfect for stat card values
import NumberTicker from '@/components/magic-ui/number-ticker';

// Animates from 0 to target value on load
export function AnimatedMetric({ value }: { value: number }) {
  return (
    <div className="text-3xl font-bold">
      <NumberTicker value={value} />
    </div>
  );
}
```

**4. Blur Fade** - Smooth content transitions
```typescript
// Use for content appearing, loading states
import BlurFade from '@/components/magic-ui/blur-fade';

// Elegant fade-in with blur effect
```

**5. Border Beam** - Highlight featured cards
```typescript
// Subtle animation for important metrics
import BorderBeam from '@/components/magic-ui/border-beam';

// Use sparingly on 1-2 important stats
```

### Components to Use Sparingly

- **Shine Border** - Subtle highlight (only on featured items)
- **Magic Card** - Hover spotlight effect (one per dashboard)
- **Sparkles Text** - Highlight new features or achievements

### Components to Avoid

- **Meteors, Particles, Confetti** - Too distracting for admin interfaces
- **Globe, Orbiting Circles** - Not professional for dashboards
- **Terminal, Code Comparison** - Limited use cases
- **Heavy animations** - Slows down dashboard performance

---

## Design System Integration

### Color Tokens

Use CSS custom properties from `globals.css`:

```typescript
// Primary (Deep Professional Blue)
bg-primary, text-primary, border-primary

// Secondary (Sophisticated Purple)
bg-secondary, text-secondary, border-secondary

// Accent (Vibrant Teal)
bg-accent, text-accent, border-accent

// Semantic Colors
bg-success, text-success // Green
bg-warning, text-warning // Amber
bg-destructive, text-destructive // Red
bg-info, text-info // Blue
```

### DO NOT Hardcode Colors

```typescript
// ❌ BAD
<div className="bg-[#1e40af]">...</div>

// ✅ GOOD
<div className="bg-primary">...</div>
```

### Typography

Use Tailwind classes with semantic meaning:

```typescript
// Heading 1
<h1 className="text-3xl font-bold tracking-tight">

// Heading 2
<h2 className="text-2xl font-semibold">

// Body
<p className="text-base text-muted-foreground">

// Small/Caption
<span className="text-xs text-muted-foreground">
```

### Dark Mode

Components automatically support dark mode via `next-themes`:

```typescript
// No special coding needed - Tailwind handles it
// Use semantic colors that automatically adapt
<div className="bg-background text-foreground border-border">
```

---

## Component Templates

### Dashboard Sidebar Menu

```typescript
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Users, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  { href: '/dashboard/users', icon: Users, label: 'Users' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {menuItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button
            variant={pathname === item.href ? 'default' : 'ghost'}
            className="w-full justify-start"
          >
            <item.icon className="h-4 w-4 mr-2" />
            {item.label}
          </Button>
        </Link>
      ))}

      <Button variant="ghost" className="w-full justify-start mt-auto">
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </nav>
  );
}
```

### Skeleton Loader

```typescript
// components/ui/skeleton.tsx
import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('bg-muted animate-pulse rounded-md', className)}
    />
  );
}

// Usage
export function TableSkeleton() {
  return (
    <div className="space-y-4">
      {Array(5).fill(0).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-12 w-12 rounded" />
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 w-24" />
        </div>
      ))}
    </div>
  );
}
```

---

## Accessibility Requirements

All dashboard components MUST follow WCAG AA+ standards:

### ARIA Labels

```typescript
// ✅ Good: Descriptive aria-label
<button aria-label="Delete user">
  <Trash2 className="h-4 w-4" />
</button>

// For table headers
<TableHead scope="col">Username</TableHead>

// For alert messages
<div role="alert" aria-live="polite">
  Error loading data
</div>
```

### Keyboard Navigation

```typescript
// ✅ All interactive elements must be keyboard accessible
// ✅ Tab order should be logical
// ✅ Focus states must be visible
// ✅ Use native HTML elements (button, a, input) when possible
```

### Focus Management

```typescript
// For modals, focus trap in modal
// Use ref to focus first field in form
const firstInputRef = useRef<HTMLInputElement>(null);
useEffect(() => {
  firstInputRef.current?.focus();
}, []);
```

### Color Contrast

```typescript
// ✅ All text must meet WCAG AA+ contrast ratios
// Use provided semantic colors - they're already tested
// For custom combos, test with WebAIM contrast checker
```

---

## Testing Guidance

### Accessibility Testing

```markdown
## Checklist
- [ ] All buttons/links are keyboard accessible (Tab key)
- [ ] All inputs have associated labels
- [ ] Focus order is logical
- [ ] Focus indicators are visible
- [ ] No color-only information conveys meaning
- [ ] All images/icons have alt text or aria-label
- [ ] Form errors have role="alert"
- [ ] Modal uses role="dialog" and traps focus
```

### Responsive Testing

Test at these breakpoints:
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1920px (Large monitor)

```typescript
// Use Playwright MCP to test
// 1. mcp__playwright__browser_resize({ width: 375, height: 667 })
// 2. Verify mobile layout works
// 3. Check no horizontal scroll
// 4. Test all interactions work
```

### Component Testing

Use Vitest + React Testing Library:

```typescript
// Test user interactions, not implementation
// Test accessibility
// Test loading states
// Test error states
// Test empty states
```

---

## Best Practices

### 1. Keep Components Composable

```typescript
// ✅ Good: Small, composable
<StatCard title="Users" value={100} />

// ❌ Bad: Too much logic in one component
export function ComplexDashboard() { /* 500 lines */ }
```

### 2. Use TypeScript Strictly

```typescript
// ✅ Good: Explicit types
interface StatCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
}

// ❌ Bad: Any types
interface StatCardProps {
  [key: string]: any;
}
```

### 3. Document with JSDoc

```typescript
/**
 * Displays a metric stat with optional trend indicator
 * @param title - The stat label
 * @param value - The metric value to display
 * @param trend - Optional trend data { value, direction, period }
 * @example
 * <StatCard
 *   title="Users"
 *   value={1234}
 *   trend={{ value: 12, direction: 'up', period: 'vs last month' }}
 * />
 */
export function StatCard(props: StatCardProps) { ... }
```

### 4. Export from Index

```typescript
// components/dashboard/index.ts
export { DashboardLayout } from './dashboard-layout';
export { DataTable } from './data-table';
export { StatCard } from './stat-card';
export { FilterBar } from './filter-bar';
export { EmptyState } from './empty-state';
export { DashboardSidebar } from './sidebar';
export { Skeleton } from '../ui/skeleton';

export type { Column, Action } from './data-table';
export type { StatCardProps } from './stat-card';
export type { FilterBarProps } from './filter-bar';
```

### 5. Use Design Tokens

```typescript
// ✅ Use provided tokens
className="text-primary bg-primary/10 border-primary/20"

// ❌ Don't create custom values
className="text-[#3b82f6] bg-[#eff6ff]"
```

---

## Your Task

When user requests a dashboard component:

### 1. Clarify Requirements

Ask:
- What type of component? (Layout, Table, Cards, Filters, etc.)
- What data needs to be displayed?
- What interactions are needed?
- Should I enhance with Magic UI?
- Any specific design requirements?

### 2. Select Pattern

Choose appropriate template from this skill:
- Dashboard Layout
- Data Table
- Stat Cards
- Filter Bar
- Empty State
- Skeleton Loader
- Or custom combination

### 3. Build Component

- Use shadcn/ui as base
- Add TypeScript types
- Implement accessibility (WCAG AA+)
- Add Magic UI enhancements strategically
- Ensure responsive design
- Follow design system

### 4. Test & Document

- Test keyboard navigation
- Test at mobile/tablet/desktop
- Check console for errors
- Add JSDoc comments
- Create usage examples
- Export from index

---

## Checklist

Before creating a dashboard component:

- [ ] Identified component type and purpose
- [ ] Reviewed existing components to reuse
- [ ] Planned TypeScript types
- [ ] Planned accessibility requirements
- [ ] Identified Magic UI enhancements
- [ ] Planned responsive breakpoints
- [ ] Reviewed design system tokens
- [ ] Planned testing approach

---

## Quick Reference: Component Usage

```typescript
// Import from unified export
import {
  DashboardLayout,
  DataTable,
  StatCard,
  FilterBar,
  EmptyState,
  Skeleton,
} from '@/components/dashboard';

// Build your dashboard
export function Page() {
  return (
    <DashboardLayout
      title="Users"
      breadcrumbs={[...]}
      sidebarContent={<DashboardSidebar />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total" value={1234} />
        <StatCard title="Active" value={567} />
        {/* More stats */}
      </div>

      <DataTable
        columns={[...]}
        data={users}
        actions={[...]}
      />
    </DashboardLayout>
  );
}
```
