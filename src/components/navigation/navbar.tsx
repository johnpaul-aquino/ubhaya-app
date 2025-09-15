"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface NavItem {
  label: string
  href?: string
  description?: string
  children?: NavItem[]
  external?: boolean
  disabled?: boolean
}

export interface NavbarProps {
  items: NavItem[]
  className?: string
  /**
   * Whether to highlight the current page
   */
  highlightActive?: boolean
}

/**
 * Navbar component with dropdown support and active state highlighting
 * Built following modern design system principles for consistent navigation
 * 
 * Features:
 * - Hierarchical navigation with dropdown menus
 * - Active state highlighting based on current route
 * - External link handling
 * - Disabled state support
 * - Accessible keyboard navigation
 * - WCAG AA+ compliant focus management
 */
const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ items, className, highlightActive = true, ...props }, ref) => {
    const pathname = usePathname()

    const isActive = (href?: string) => {
      if (!href || !highlightActive) return false
      if (href === "/") return pathname === "/"
      return pathname.startsWith(href)
    }

    const renderNavItem = (item: NavItem, index: number) => {
      // If item has children, render as dropdown
      if (item.children && item.children.length > 0) {
        return (
          <DropdownMenu key={`${item.label}-${index}`}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "h-9 px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  item.disabled && "pointer-events-none opacity-50"
                )}
                disabled={item.disabled}
                aria-haspopup="true"
                aria-expanded="false"
              >
                {item.label}
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {item.children.map((child, childIndex) => {
                if (!child.href) {
                  return (
                    <DropdownMenuSeparator key={`sep-${childIndex}`} />
                  )
                }
                
                return (
                  <DropdownMenuItem key={`${child.label}-${childIndex}`} asChild>
                    <Link
                      href={child.href}
                      className={cn(
                        "flex flex-col items-start",
                        child.disabled && "pointer-events-none opacity-50",
                        isActive(child.href) && "bg-accent text-accent-foreground"
                      )}
                      {...(child.external && {
                        target: "_blank",
                        rel: "noopener noreferrer"
                      })}
                      aria-disabled={child.disabled}
                    >
                      <div className="font-medium">{child.label}</div>
                      {child.description && (
                        <div className="text-xs text-muted-foreground">
                          {child.description}
                        </div>
                      )}
                    </Link>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }

      // Regular nav item
      if (item.href) {
        return (
          <Link
            key={`${item.label}-${index}`}
            href={item.href}
            className={cn(
              "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2",
              isActive(item.href) && "bg-accent text-accent-foreground",
              item.disabled && "pointer-events-none opacity-50"
            )}
            {...(item.external && {
              target: "_blank",
              rel: "noopener noreferrer"
            })}
            aria-disabled={item.disabled}
            aria-current={isActive(item.href) ? "page" : undefined}
          >
            {item.label}
          </Link>
        )
      }

      // Item without href (could be used as section header)
      return (
        <span
          key={`${item.label}-${index}`}
          className={cn(
            "inline-flex items-center justify-center text-sm font-medium h-9 px-4 py-2 text-muted-foreground",
            item.disabled && "opacity-50"
          )}
          aria-disabled={item.disabled}
        >
          {item.label}
        </span>
      )
    }

    return (
      <nav
        ref={ref}
        className={cn(
          "flex items-center space-x-1",
          className
        )}
        role="navigation"
        aria-label="Main navigation"
        {...props}
      >
        {items.map(renderNavItem)}
      </nav>
    )
  }
)
Navbar.displayName = "Navbar"

export { Navbar }