import * as React from "react"
import { cn } from "@/lib/utils"
import { Container } from "./container"

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * HTML element to render as
   * @default "section"
   */
  as?: keyof JSX.IntrinsicElements
  /**
   * Vertical spacing variant
   * @default "default"
   */
  spacing?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "default"
  /**
   * Whether to wrap content in a Container component
   * @default true
   */
  contained?: boolean
  /**
   * Container max width when contained is true
   * @default "default"
   */
  containerMaxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "default"
  /**
   * Background variant
   * @default "default"
   */
  background?: "default" | "muted" | "accent" | "primary" | "transparent"
}

/**
 * Section component that provides consistent vertical spacing and optional container wrapping
 * Built following modern design system principles for content organization
 * 
 * Features:
 * - Flexible semantic HTML elements (section, div, main, etc.)
 * - Consistent vertical rhythm with multiple spacing options
 * - Optional container wrapping for content width management
 * - Background variants for visual hierarchy
 * - Accessible and semantic structure
 */
const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ 
    className, 
    as = "section",
    spacing = "default",
    contained = true,
    containerMaxWidth = "default",
    background = "default",
    children, 
    ...props 
  }, ref) => {
    const Component = as as any
    
    const spacingClasses = {
      none: "",
      sm: "py-8 sm:py-12",
      md: "py-12 sm:py-16",
      lg: "py-16 sm:py-20",
      xl: "py-20 sm:py-24",
      "2xl": "py-24 sm:py-32",
      default: "py-16 sm:py-20 lg:py-24",
    }

    const backgroundClasses = {
      default: "bg-background",
      muted: "bg-muted/30",
      accent: "bg-accent/5",
      primary: "bg-primary text-primary-foreground",
      transparent: "bg-transparent",
    }

    const content = contained ? (
      <Container maxWidth={containerMaxWidth}>
        {children}
      </Container>
    ) : (
      children
    )

    return (
      <Component
        ref={ref}
        className={cn(
          // Base styles
          "relative",
          // Spacing
          spacingClasses[spacing],
          // Background
          backgroundClasses[background],
          className
        )}
        {...props}
      >
        {content}
      </Component>
    )
  }
)
Section.displayName = "Section"

export { Section }