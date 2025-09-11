import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Container } from "./container"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Whether to show the top border
   * @default true
   */
  border?: boolean
  /**
   * Layout variant
   * @default "default"
   */
  variant?: "default" | "minimal" | "extended"
}

interface FooterLink {
  label: string
  href: string
  external?: boolean
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

const footerSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/api", external: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Community", href: "/community", external: true },
      { label: "Status", href: "/status", external: true },
      { label: "Support", href: "/support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "License", href: "/license" },
    ],
  },
]

const socialLinks = [
  { 
    name: "GitHub", 
    href: "https://github.com", 
    icon: Github,
    label: "Follow us on GitHub"
  },
  { 
    name: "Twitter", 
    href: "https://twitter.com", 
    icon: Twitter,
    label: "Follow us on Twitter"
  },
  { 
    name: "LinkedIn", 
    href: "https://linkedin.com", 
    icon: Linkedin,
    label: "Follow us on LinkedIn"
  },
  { 
    name: "Email", 
    href: "mailto:contact@example.com", 
    icon: Mail,
    label: "Send us an email"
  },
]

/**
 * Footer component with flexible layouts and comprehensive link organization
 * Built following 21st.dev design system principles for consistent site structure
 * 
 * Features:
 * - Multiple layout variants (default, minimal, extended)
 * - Organized link sections for easy navigation
 * - Social media integration
 * - Accessible navigation with proper ARIA labels
 * - Responsive design that adapts to screen size
 * - SEO-friendly structure with proper semantic markup
 */
const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, border = true, variant = "default", ...props }, ref) => {
    const currentYear = new Date().getFullYear()

    if (variant === "minimal") {
      return (
        <footer
          ref={ref}
          className={cn(
            "w-full py-8",
            border && "border-t border-border/40",
            className
          )}
          {...props}
        >
          <Container>
            <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs">W</span>
                </div>
                <span className="font-semibold">Website Boilerplate</span>
              </div>
              
              {/* Copyright */}
              <p className="text-sm text-muted-foreground">
                © {currentYear} Website Boilerplate. All rights reserved.
              </p>
            </div>
          </Container>
        </footer>
      )
    }

    return (
      <footer
        ref={ref}
        className={cn(
          "w-full bg-muted/20",
          border && "border-t border-border/40",
          className
        )}
        {...props}
      >
        <Container>
          <div className="py-12 lg:py-16">
            {/* Main footer content */}
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
              {/* Company info */}
              <div className="col-span-2 lg:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">W</span>
                  </div>
                  <span className="font-bold text-lg font-display">Website Boilerplate</span>
                </div>
                <p className="text-sm text-muted-foreground max-w-xs mb-6">
                  A modern, accessible, and performant Next.js boilerplate built with 21st.dev design principles.
                </p>
                
                {/* Social links */}
                <div className="flex space-x-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon
                    return (
                      <Link
                        key={social.name}
                        href={social.href}
                        className="text-muted-foreground hover:text-foreground transition-colors p-2 -m-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        aria-label={social.label}
                        {...(social.href.startsWith('http') && {
                          target: "_blank",
                          rel: "noopener noreferrer"
                        })}
                      >
                        <Icon className="h-5 w-5" />
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Footer links */}
              {footerSections.map((section) => (
                <div key={section.title} className="col-span-1">
                  <h3 className="font-semibold text-foreground mb-4">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                          {...(link.external && {
                            target: "_blank",
                            rel: "noopener noreferrer"
                          })}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Bottom section */}
            <div className="mt-12 pt-8 border-t border-border/40 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
              <p className="text-sm text-muted-foreground">
                © {currentYear} Website Boilerplate. All rights reserved.
              </p>
              <div className="flex items-center space-x-6">
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </footer>
    )
  }
)
Footer.displayName = "Footer"

export { Footer }