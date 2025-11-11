'use client';

import { useState, useCallback, useEffect } from 'react';
import { Bell, LogOut, Menu, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { toast } from 'sonner';

interface NavbarProps {
  username?: string;
  userInitials?: string;
  isSidebarOpen?: boolean;
  onSidebarToggle?: () => void;
  onSearch?: (query: string) => void;
}

/**
 * Dashboard Navbar Component
 * Top navigation bar with search, notifications, and user menu
 */
export function Navbar({
  username = 'John Doe',
  userInitials = 'JD',
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
          <div className="hidden sm:flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
            <div
              className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center text-white text-xs md:text-sm font-semibold flex-shrink-0"
              title={username}
            >
              {userInitials}
            </div>
            <span className="hidden md:inline text-sm font-medium text-foreground">
              {username}
            </span>
          </div>

          {/* Logout */}
          <Link href="/login">
            <Button variant="outline" size="sm" className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
