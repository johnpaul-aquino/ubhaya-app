'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';
import { Toaster } from '@/components/ui/sonner';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Create a context for search state
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchContext = createContext<SearchContextType>({
  searchQuery: '',
  setSearchQuery: () => {},
});

export const useSearchContext = () => useContext(SearchContext);

/**
 * Dashboard Layout Component
 * Main layout wrapper for dashboard pages
 * Includes navbar, sidebar, and main content area
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session?.user) {
    return null;
  }

  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSidebarOpen) {
        const sidebar = document.getElementById('dashboard-sidebar');
        const menuButton = document.querySelector('[aria-label="Toggle navigation menu"]');

        if (
          sidebar &&
          !sidebar.contains(event.target as Node) &&
          !menuButton?.contains(event.target as Node)
        ) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      <div className="flex flex-col h-screen bg-background">
        {/* Top Navigation */}
        <Navbar
          user={{
            firstName: session.user.firstName,
            lastName: session.user.lastName,
            email: session.user.email || '',
            role: session.user.role,
          }}
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onSearch={handleSearch}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Sidebar */}
          <Sidebar isMobileOpen={isSidebarOpen} />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6 max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>

        {/* Toast Notifications */}
        <Toaster
          position="bottom-right"
          expand={false}
          richColors
          closeButton
        />
      </div>
    </SearchContext.Provider>
  );
}
