import * as React from "react"
import { cn } from "@/lib/utils"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Main headline text
   */
  title: string
  /**
   * Supporting description text
   */
  description?: string
  /**
   * Announcement badge text (appears above title)
   */
  announcement?: string
  /**
   * Primary call-to-action button
   */
  primaryAction?: {
    label: string
    href?: string
    onClick?: () => void
  }
  /**
   * Secondary call-to-action button
   */
  secondaryAction?: {
    label: string
    href?: string
    onClick?: () => void
  }
  /**
   * Hero layout variant
   */
  variant?: "default" | "centered" | "split"
  /**
   * Background variant
   */
  background?: "default" | "gradient" | "pattern" | "image"
  /**
   * Background image URL (when background is "image")
   */
  backgroundImage?: string
  /**
   * Additional content to display (e.g., features, social proof)
   */
  children?: React.ReactNode
  /**
   * Whether to show decorative elements
   */
  decorative?: boolean
}

/**
 * Hero component for landing pages and marketing sections
 * Built following 21st.dev design system principles for maximum conversion
 * 
 * Features:
 * - Multiple layout variants (default, centered, split)
 * - Background options (solid, gradient, pattern, image)
 * - Announcement badge for highlighting new features
 * - Dual CTA buttons for different user paths
 * - Responsive typography with optimal readability
 * - Accessible structure with proper heading hierarchy
 * - Support for additional content (features, testimonials, etc.)
 */
const Hero = React.forwardRef<HTMLElement, HeroProps>(
  ({ 
    className, 
    title, 
    description, 
    announcement,
    primaryAction,
    secondaryAction,
    variant = "default",
    background = "default",
    backgroundImage,
    children,
    decorative = true,
    ...props 
  }, ref) => {
    const backgroundStyles = {
      default: "bg-background",
      gradient: "bg-gradient-to-br from-primary/5 via-background to-secondary/5",
      pattern: "bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-transparent",
      image: backgroundImage ? `bg-cover bg-center bg-no-repeat` : "bg-background"
    }

    const variantStyles = {
      default: "text-left",
      centered: "text-center",
      split: "grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
    }

    const contentSection = (
      <div className={cn(
        "space-y-6",
        variant === "centered" && "max-w-4xl mx-auto",
        variant === "default" && "max-w-3xl"
      )}>
        {/* Announcement Badge */}
        {announcement && (
          <div className={cn(
            "flex",
            variant === "centered" ? "justify-center" : "justify-start"
          )}>
            <Badge 
              variant="outline" 
              className="text-sm font-medium px-4 py-1.5 bg-background/50 backdrop-blur-sm"
            >
              {announcement}
            </Badge>
          </div>
        )}

        {/* Main Title */}
        <h1 className={cn(
          "text-display-2xl font-bold text-balance leading-tight",
          "bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent"
        )}>
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className={cn(
            "text-body-xl text-muted-foreground text-pretty max-w-2xl",
            variant === "centered" && "mx-auto"
          )}>
            {description}
          </p>
        )}

        {/* Action Buttons */}
        {(primaryAction || secondaryAction) && (
          <div className={cn(
            "flex flex-wrap gap-4",
            variant === "centered" ? "justify-center" : "justify-start"
          )}>
            {primaryAction && (
              <Button
                size="lg"
                className="h-12 px-8 text-base font-semibold"
                asChild={!!primaryAction.href}
                onClick={primaryAction.onClick}
              >
                {primaryAction.href ? (
                  <a href={primaryAction.href}>
                    {primaryAction.label}
                  </a>
                ) : (
                  primaryAction.label
                )}
              </Button>
            )}
            
            {secondaryAction && (
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base font-semibold"
                asChild={!!secondaryAction.href}
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.href ? (
                  <a href={secondaryAction.href}>
                    {secondaryAction.label}
                  </a>
                ) : (
                  secondaryAction.label
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    )

    return (
      <section
        ref={ref}
        className={cn(
          "relative overflow-hidden py-20 lg:py-28",
          backgroundStyles[background],
          className
        )}
        style={background === "image" && backgroundImage ? { 
          backgroundImage: `url(${backgroundImage})` 
        } : undefined}
        {...props}
      >
        {/* Background Overlay for Image Background */}
        {background === "image" && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        )}

        {/* Decorative Elements */}
        {decorative && (
          <>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
          </>
        )}

        <Container className="relative z-10">
          <div className={variantStyles[variant]}>
            {variant === "split" ? (
              <>
                <div>{contentSection}</div>
                <div className="flex items-center justify-center">
                  {children || (
                    <div className="w-full max-w-lg aspect-square bg-muted/30 rounded-2xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                      <span className="text-muted-foreground text-sm font-medium">
                        Hero Visual
                      </span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {contentSection}
                {children && (
                  <div className={cn(
                    "mt-12",
                    variant === "centered" && "flex justify-center"
                  )}>
                    {children}
                  </div>
                )}
              </>
            )}
          </div>
        </Container>
      </section>
    )
  }
)
Hero.displayName = "Hero"

export { Hero }