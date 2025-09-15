import * as React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
  /**
   * Whether this item is the current page
   */
  isCurrent?: boolean
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLNavElement> {
  items: BreadcrumbItem[]
  /**
   * Custom separator between breadcrumb items
   */
  separator?: React.ReactNode
  /**
   * Whether to show a home icon for the first item
   */
  showHomeIcon?: boolean
  /**
   * Maximum number of items to show before collapsing
   */
  maxItems?: number
}

/**
 * Breadcrumbs component for hierarchical navigation
 * Built following modern design system principles for consistent navigation
 * 
 * Features:
 * - Customizable separator between items
 * - Home icon option for the first item
 * - Automatic truncation for long paths
 * - Current page indication
 * - Accessible with proper ARIA attributes
 * - WCAG AA+ compliant markup and focus states
 */
const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ 
    items, 
    className, 
    separator,
    showHomeIcon = false,
    maxItems,
    ...props 
  }, ref) => {
    if (!items.length) return null

    // Handle truncation if maxItems is specified
    let displayItems = items
    let hasEllipsis = false

    if (maxItems && items.length > maxItems) {
      hasEllipsis = true
      // Always show first item, last item, and fill remaining space
      if (maxItems <= 2) {
        displayItems = [items[0], items[items.length - 1]]
      } else {
        const remainingSlots = maxItems - 2 // Reserve slots for first and last
        const middleStart = 1
        const middleEnd = items.length - 1
        
        if (remainingSlots > 0) {
          displayItems = [
            items[0],
            ...items.slice(middleEnd - remainingSlots + 1, middleEnd),
            items[items.length - 1]
          ]
        } else {
          displayItems = [items[0], items[items.length - 1]]
        }
      }
    }

    const defaultSeparator = <ChevronRight className="h-4 w-4 text-muted-foreground" />

    const renderBreadcrumbItem = (item: BreadcrumbItem, index: number, isLast: boolean) => {
      const isClickable = item.href && !item.isCurrent
      const isFirst = index === 0

      const content = (
        <>
          {isFirst && showHomeIcon && (
            <Home className="h-4 w-4 mr-1" />
          )}
          {item.label}
        </>
      )

      if (isClickable) {
        return (
          <Link
            href={item.href}
            className={cn(
              "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
              "hover:underline underline-offset-4"
            )}
          >
            {content}
          </Link>
        )
      }

      return (
        <span
          className={cn(
            "text-sm font-medium",
            item.isCurrent 
              ? "text-foreground" 
              : "text-muted-foreground"
          )}
          aria-current={item.isCurrent ? "page" : undefined}
        >
          {content}
        </span>
      )
    }

    return (
      <nav
        ref={ref}
        className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}
        aria-label="Breadcrumb navigation"
        {...props}
      >
        <ol className="flex items-center space-x-1" role="list">
          {displayItems.map((item, index) => {
            const isLast = index === displayItems.length - 1
            const showEllipsis = hasEllipsis && index === 1 && displayItems.length > 2

            return (
              <React.Fragment key={`${item.href || item.label}-${index}`}>
                <li className="flex items-center">
                  {renderBreadcrumbItem(item, index, isLast)}
                </li>
                
                {/* Show ellipsis if needed */}
                {showEllipsis && (
                  <li className="flex items-center" aria-hidden="true">
                    <span className="mx-1">{separator || defaultSeparator}</span>
                    <span className="text-muted-foreground">...</span>
                  </li>
                )}
                
                {/* Show separator if not last item */}
                {!isLast && (
                  <li className="flex items-center" aria-hidden="true">
                    <span className="mx-1">{separator || defaultSeparator}</span>
                  </li>
                )}
              </React.Fragment>
            )
          })}
        </ol>
      </nav>
    )
  }
)
Breadcrumbs.displayName = "Breadcrumbs"

/**
 * Hook to generate breadcrumbs from pathname
 * Useful for automatic breadcrumb generation based on URL structure
 */
export function useBreadcrumbs(pathname: string, customLabels?: Record<string, string>) {
  return React.useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)
    
    const items: BreadcrumbItem[] = [
      { label: customLabels?.[''] || 'Home', href: '/' }
    ]
    
    let currentPath = ''
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1
      
      items.push({
        label: customLabels?.[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        href: isLast ? undefined : currentPath,
        isCurrent: isLast
      })
    })
    
    return items
  }, [pathname, customLabels])
}

export { Breadcrumbs }