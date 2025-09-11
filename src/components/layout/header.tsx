"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Container } from "./container"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Menu, X } from "lucide-react"

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Whether the header should be sticky
   * @default true
   */
  sticky?: boolean
  /**
   * Whether to show a border at the bottom
   * @default true
   */
  border?: boolean
  /**
   * Background opacity variant
   * @default "solid"
   */
  background?: "solid" | "blur" | "transparent"
}

interface NavigationItem {
  label: string
  href: string
  description?: string
}

const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
]

/**
 * Header component with responsive navigation and theme switching
 * Built following 21st.dev design system principles for consistent navigation
 * 
 * Features:
 * - Responsive navigation with mobile menu
 * - Theme toggle integration
 * - Accessible keyboard navigation
 * - Sticky positioning option
 * - Background variants for different layouts
 * - WCAG AA+ compliant focus states
 */
const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, sticky = true, border = true, background = "solid", ...props }, ref) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

    // Close mobile menu on escape key
    React.useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setIsMobileMenuOpen(false)
        }
      }

      if (isMobileMenuOpen) {
        document.addEventListener("keydown", handleEscape)
        document.body.style.overflow = "hidden"
      }

      return () => {
        document.removeEventListener("keydown", handleEscape)
        document.body.style.overflow = "unset"
      }
    }, [isMobileMenuOpen])

    const backgroundClasses = {
      solid: "bg-background/95",
      blur: "bg-background/80 backdrop-blur-md",
      transparent: "bg-transparent",
    }

    return (
      <header
        ref={ref}
        className={cn(
          // Base styles
          "top-0 z-50 w-full transition-all duration-200",
          // Sticky positioning
          sticky && "sticky",
          // Background
          backgroundClasses[background],
          // Border
          border && "border-b border-border/40",
          className
        )}
        {...props}
      >
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-2xl font-bold text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
                aria-label="Go to homepage"
              >
                <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">W</span>
                </div>
                <span className="font-display">Website</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav 
              className="hidden md:flex items-center space-x-1"
              role="navigation"
              aria-label="Main navigation"
            >
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              
              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden h-9 w-9 px-0"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </Container>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md"
          >
            <Container>
              <nav 
                className="flex flex-col space-y-1 py-4"
                role="navigation"
                aria-label="Mobile navigation"
              >
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center justify-start rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </Container>
          </div>
        )}
      </header>
    )
  }
)
Header.displayName = "Header"

export { Header }