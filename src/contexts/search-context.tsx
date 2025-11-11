'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFilters: {
    status?: string;
    priority?: string;
    dateRange?: { start: Date; end: Date };
  };
  setSearchFilters: (filters: SearchContextType['searchFilters']) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchContextType['searchFilters']>({});

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchFilters({});
  }, []);

  const value = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      searchFilters,
      setSearchFilters,
      clearSearch,
    }),
    [searchQuery, searchFilters, clearSearch]
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

/**
 * Utility function to filter items based on search query
 */
export function filterBySearchQuery<T extends Record<string, any>>(
  items: T[],
  query: string,
  searchFields: (keyof T)[]
): T[] {
  if (!query.trim()) return items;

  const lowerQuery = query.toLowerCase();

  return items.filter((item) =>
    searchFields.some((field) => {
      const value = item[field];
      if (value == null) return false;
      return String(value).toLowerCase().includes(lowerQuery);
    })
  );
}