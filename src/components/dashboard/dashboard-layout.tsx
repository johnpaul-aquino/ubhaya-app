'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
