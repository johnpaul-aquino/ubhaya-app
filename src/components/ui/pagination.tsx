/**
 * Pagination Component - Reusable pagination with search params
 */

import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  basePath: string
  searchParams?: Record<string, string | undefined>
}

export function Pagination({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  basePath,
  searchParams = {},
}: PaginationProps) {
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams()
    
    // Add existing search params
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== 'page') {
        params.set(key, value)
      }
    })
    
    // Add page param if not page 1
    if (page > 1) {
      params.set('page', page.toString())
    }
    
    const queryString = params.toString()
    return queryString ? `${basePath}?${queryString}` : basePath
  }

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (totalPages <= 1) return null

  const visiblePages = getVisiblePages()

  return (
    <nav
      className="flex items-center justify-center space-x-2"
      aria-label="Pagination"
    >
      {/* Previous button */}
      <Button
        variant="outline"
        size="sm"
        asChild={hasPrev}
        disabled={!hasPrev}
        className={cn(!hasPrev && 'pointer-events-none opacity-50')}
      >
        {hasPrev ? (
          <Link href={createPageUrl(currentPage - 1)} aria-label="Go to previous page">
            <ChevronLeftIcon className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Link>
        ) : (
          <>
            <ChevronLeftIcon className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </>
        )}
      </Button>

      {/* Page numbers */}
      <div className="flex items-center space-x-1">
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`dots-${index}`}
                className="flex h-9 w-9 items-center justify-center text-sm"
              >
                ...
              </span>
            )
          }

          const pageNumber = Number(page)
          const isCurrentPage = pageNumber === currentPage

          return (
            <Button
              key={pageNumber}
              variant={isCurrentPage ? 'default' : 'outline'}
              size="sm"
              asChild={!isCurrentPage}
              disabled={isCurrentPage}
              className={cn(
                'h-9 w-9',
                isCurrentPage && 'pointer-events-none'
              )}
            >
              {isCurrentPage ? (
                <span aria-current="page">{pageNumber}</span>
              ) : (
                <Link
                  href={createPageUrl(pageNumber)}
                  aria-label={`Go to page ${pageNumber}`}
                >
                  {pageNumber}
                </Link>
              )}
            </Button>
          )
        })}
      </div>

      {/* Next button */}
      <Button
        variant="outline"
        size="sm"
        asChild={hasNext}
        disabled={!hasNext}
        className={cn(!hasNext && 'pointer-events-none opacity-50')}
      >
        {hasNext ? (
          <Link href={createPageUrl(currentPage + 1)} aria-label="Go to next page">
            <ChevronRightIcon className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Link>
        ) : (
          <>
            <ChevronRightIcon className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </>
        )}
      </Button>
    </nav>
  )
}