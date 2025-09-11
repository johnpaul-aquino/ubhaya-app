/**
 * Blog Filters - Search and filter controls for blog listing
 */

'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { debounce } from '@/lib/utils'

interface BlogFiltersProps {
  currentCategory?: string
  currentAuthor?: string
  currentTag?: string
  currentSearch?: string
}

export function BlogFilters({
  currentCategory,
  currentAuthor,
  currentTag,
  currentSearch,
}: BlogFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState(currentSearch || '')

  const updateFilters = (newFilters: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Update or remove filter parameters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    
    // Reset to first page when filtering
    params.delete('page')
    
    const queryString = params.toString()
    const url = queryString ? `/blog?${queryString}` : '/blog'
    
    startTransition(() => {
      router.push(url)
    })
  }

  const debouncedSearch = debounce((term: string) => {
    updateFilters({ search: term || undefined })
  }, 300)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    debouncedSearch(value)
  }

  const clearFilters = () => {
    setSearchTerm('')
    startTransition(() => {
      router.push('/blog')
    })
  }

  const hasActiveFilters = currentCategory || currentAuthor || currentTag || currentSearch

  return (
    <div className="mb-8 space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          disabled={isPending}
        />
        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-foreground" />
          </div>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filters:</span>
          
          {currentCategory && (
            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">
              Category: {currentCategory}
              <button
                onClick={() => updateFilters({ category: undefined })}
                className="ml-1 hover:text-primary/80"
                disabled={isPending}
              >
                ×
              </button>
            </span>
          )}
          
          {currentAuthor && (
            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">
              Author: {currentAuthor}
              <button
                onClick={() => updateFilters({ author: undefined })}
                className="ml-1 hover:text-primary/80"
                disabled={isPending}
              >
                ×
              </button>
            </span>
          )}
          
          {currentTag && (
            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">
              Tag: {currentTag}
              <button
                onClick={() => updateFilters({ tag: undefined })}
                className="ml-1 hover:text-primary/80"
                disabled={isPending}
              >
                ×
              </button>
            </span>
          )}
          
          {currentSearch && (
            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">
              Search: &quot;{currentSearch}&quot;
              <button
                onClick={() => {
                  setSearchTerm('')
                  updateFilters({ search: undefined })
                }}
                className="ml-1 hover:text-primary/80"
                disabled={isPending}
              >
                ×
              </button>
            </span>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            disabled={isPending}
            className="h-auto px-2 py-1 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}