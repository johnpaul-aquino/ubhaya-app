'use client';

import { useState, useCallback, useEffect } from 'react';
import { Bell, Menu, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserMenu } from '@/components/dashboard/user-menu';
import Link from 'next/link';
import { toast } from 'sonner';

interface NavbarProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  isSidebarOpen?: boolean;
  onSidebarToggle?: () => void;
  onSearch?: (query: string) => void;
}

/**
 * Dashboard Navbar Component
 * Top navigation bar with search, notifications, and user menu
 */
export function Navbar({
  user,
  isSidebarOpen = false,
  onSidebarToggle,
  onSearch
}: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        onSearch?.(searchQuery);
        setTimeout(() => setIsSearching(false), 500);

        // Show toast for demo purposes
        toast.info(`Searching for: "${searchQuery}"`, {
          description: 'Filtering dashboard content...',
          duration: 2000,
        });
      } else {
        onSearch?.('');
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.success(`Found results for: "${searchQuery}"`, {
        description: 'Dashboard filtered successfully',
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 gap-4">
        {/* Mobile Menu Toggle & Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onSidebarToggle}
            aria-label="Toggle navigation menu"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="text-xl font-bold text-primary">Ubhaya</div>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
              isSearching ? 'text-primary animate-pulse' : 'text-muted-foreground'
            }`} />
            <Input
              type="search"
              placeholder="Search shipments, contacts, facilities..."
              className="pl-9 h-9 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center justify-end gap-2 md:gap-4">
          {/* Notification Bell */}
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
