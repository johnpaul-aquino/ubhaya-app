"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Menu, ChevronRight, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { NavItem } from "./navbar"

export interface MobileMenuProps {
  items: NavItem[]
  className?: string
  /**
   * Whether to highlight the current page
   */
  highlightActive?: boolean
  /**
   * Custom trigger button
   */
  trigger?: React.ReactNode
  /**
   * Menu title for accessibility
   */
  title?: string
  /**
   * Menu description for accessibility
   */
  description?: string
}

/**
 * MobileMenu component with collapsible sections and active state highlighting
 * Built following 21st.dev design system principles for mobile navigation
 * 
 * Features:
 * - Collapsible sections for hierarchical navigation
 * - Active state highlighting based on current route
 * - Sheet-based overlay with smooth animations
 * - Accessible keyboard navigation and screen reader support
 * - Auto-close on navigation
 * - Custom trigger support
 * - WCAG AA+ compliant focus management
 */
const MobileMenu = React.forwardRef<HTMLDivElement, MobileMenuProps>(
  ({ 
    items, 
    className, 
    highlightActive = true,
    trigger,
    title = "Navigation Menu",
    description = "Navigate through the site sections",
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [expandedSections, setExpandedSections] = React.useState<string[]>([])
    const pathname = usePathname()

    const isActive = (href?: string) => {
      if (!href || !highlightActive) return false
      if (href === "/") return pathname === "/"
      return pathname.startsWith(href)
    }

    const toggleSection = (sectionLabel: string) => {
      setExpandedSections(prev => 
        prev.includes(sectionLabel)
          ? prev.filter(label => label !== sectionLabel)
          : [...prev, sectionLabel]
      )
    }

    const closeMenu = () => {
      setIsOpen(false)
    }

    // Close menu when pathname changes (user navigated)
    React.useEffect(() => {
      closeMenu()
    }, [pathname])

    const renderMobileNavItem = (item: NavItem, index: number) => {
      // If item has children, render as collapsible section
      if (item.children && item.children.length > 0) {
        const isExpanded = expandedSections.includes(item.label)
        
        return (
          <Collapsible
            key={`${item.label}-${index}`}
            open={isExpanded}
            onOpenChange={() => toggleSection(item.label)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between h-auto p-4 text-left font-medium text-base hover:bg-accent hover:text-accent-foreground",
                  item.disabled && "pointer-events-none opacity-50"
                )}
                disabled={item.disabled}
              >
                <span>{item.label}</span>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isExpanded && "rotate-180"
                )} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pb-2">
              <div className="pl-4 space-y-1">
                {item.children.map((child, childIndex) => (
                  <Link
                    key={`${child.label}-${childIndex}`}
                    href={child.href || "#"}
                    className={cn(
                      "flex items-center rounded-md px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      isActive(child.href) && "bg-accent text-accent-foreground",
                      child.disabled && "pointer-events-none opacity-50"
                    )}
                    onClick={child.href ? closeMenu : undefined}
                    {...(child.external && {
                      target: "_blank",
                      rel: "noopener noreferrer"
                    })}
                    aria-disabled={child.disabled}
                    aria-current={isActive(child.href) ? "page" : undefined}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{child.label}</div>
                      {child.description && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {child.description}
                        </div>
                      )}
                    </div>
                    {child.external && (
                      <ChevronRight className="h-3 w-3 opacity-60" />
                    )}
                  </Link>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )
      }

      // Regular nav item
      if (item.href) {
        return (
          <Link
            key={`${item.label}-${index}`}
            href={item.href}
            className={cn(
              "flex items-center rounded-md px-4 py-4 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              isActive(item.href) && "bg-accent text-accent-foreground",
              item.disabled && "pointer-events-none opacity-50"
            )}
            onClick={closeMenu}
            {...(item.external && {
              target: "_blank",
              rel: "noopener noreferrer"
            })}
            aria-disabled={item.disabled}
            aria-current={isActive(item.href) ? "page" : undefined}
          >
            <div className="flex-1">
              {item.label}
              {item.description && (
                <div className="text-sm text-muted-foreground mt-1">
                  {item.description}
                </div>
              )}
            </div>
            {item.external && (
              <ChevronRight className="h-4 w-4 opacity-60" />
            )}
          </Link>
        )
      }

      // Item without href (section header)
      return (
        <div
          key={`${item.label}-${index}`}
          className={cn(
            "px-4 py-2 text-sm font-semibold text-muted-foreground",
            item.disabled && "opacity-50"
          )}
        >
          {item.label}
        </div>
      )
    }

    const defaultTrigger = (
      <Button
        variant="ghost"
        size="sm"
        className="h-9 w-9 px-0"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
    )

    return (
      <div ref={ref} className={className} {...props}>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            {trigger || defaultTrigger}
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="px-6 py-4 border-b">
              <SheetTitle className="text-left">{title}</SheetTitle>
              <SheetDescription className="text-left text-sm">
                {description}
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto py-4">
              <nav
                className="space-y-1"
                role="navigation"
                aria-label="Mobile navigation"
              >
                {items.map(renderMobileNavItem)}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    )
  }
)
MobileMenu.displayName = "MobileMenu"

export { MobileMenu }