'use client';

import { useState, useEffect, useCallback } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';

export interface UserSuggestion {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
}

interface MentionAutocompleteProps {
  query: string;
  onSelect: (user: UserSuggestion) => void;
  onClose: () => void;
}

/**
 * Mention Autocomplete Component
 * Dropdown for selecting users to @mention
 */
export function MentionAutocomplete({
  query,
  onSelect,
  onClose,
}: MentionAutocompleteProps) {
  const [users, setUsers] = useState<UserSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fetch users based on query
  const fetchUsers = useCallback(async (search: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);

      const response = await fetch(`/api/users?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.users.slice(0, 10)); // Limit to 10 results
        setSelectedIndex(0);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(query);
    }, 200);

    return () => clearTimeout(timer);
  }, [query, fetchUsers]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!users.length) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % users.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + users.length) % users.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (users[selectedIndex]) {
            onSelect(users[selectedIndex]);
          }
          break;
        case 'Tab':
          e.preventDefault();
          if (users[selectedIndex]) {
            onSelect(users[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [users, selectedIndex, onSelect]);

  if (loading && users.length === 0) {
    return (
      <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-popover border rounded-lg shadow-lg p-3">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Searching...</span>
        </div>
      </div>
    );
  }

  if (!loading && users.length === 0) {
    return (
      <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-popover border rounded-lg shadow-lg p-3">
        <p className="text-sm text-muted-foreground text-center">
          No users found
        </p>
      </div>
    );
  }

  return (
    <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-popover border rounded-lg shadow-lg overflow-hidden">
      <div className="p-1.5 text-xs text-muted-foreground border-b">
        Select a user to mention
      </div>
      <div className="max-h-[200px] overflow-y-auto py-1">
        {users.map((user, index) => {
          const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

          return (
            <button
              key={user.id}
              type="button"
              className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                index === selectedIndex
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-muted'
              }`}
              onClick={() => onSelect(user)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      {loading && users.length > 0 && (
        <div className="border-t px-3 py-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Updating...</span>
        </div>
      )}
    </div>
  );
}
