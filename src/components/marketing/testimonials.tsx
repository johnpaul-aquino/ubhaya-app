import * as React from "react"
import { cn } from "@/lib/utils"
import { Container } from "@/components/layout/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

export interface Testimonial {
  /**
   * Testimonial content/quote
   */
  content: string
  /**
   * Author name
   */
  author: string
  /**
   * Author title/role
   */
  title?: string
  /**
   * Author company
   */
  company?: string
  /**
   * Author avatar image URL
   */
  avatar?: string
  /**
   * Star rating (1-5)
   */
  rating?: number
  /**
   * Featured testimonial (appears larger/highlighted)
   */
  featured?: boolean
}

export interface TestimonialsProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Testimonials to display
   */
  testimonials: Testimonial[]
  /**
   * Section title
   */
  title?: string
  /**
   * Section description
   */
  description?: string
  /**
   * Section badge
   */
  badge?: string
  /**
   * Layout variant
   */
  variant?: "grid" | "masonry" | "carousel" | "featured"
  /**
   * Number of columns for grid layout
   */
  columns?: 1 | 2 | 3
  /**
   * Whether to show ratings
   */
  showRatings?: boolean
  /**
   * Whether to show quote icons
   */
  showQuotes?: boolean
}

/**
 * Testimonials component for displaying customer feedback and social proof
 * Built following 21st.dev design system principles for credibility and trust
 * 
 * Features:
 * - Multiple layout variants (grid, masonry, featured)
 * - Star ratings display
 * - Author information with avatars
 * - Featured testimonials for highlights
 * - Responsive grid layouts
 * - Quote icons for visual appeal
 * - Accessible structure with proper markup
 */
const Testimonials = React.forwardRef<HTMLElement, TestimonialsProps>(
  ({ 
    className, 
    testimonials, 
    title, 
    description, 
    badge,
    variant = "grid",
    columns = 3,
    showRatings = true,
    showQuotes = true,
    ...props 
  }, ref) => {
    const gridColumns = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    }

    const renderStars = (rating: number) => {
      if (!showRatings) return null
      
      return (
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < rating 
                  ? "fill-yellow-400 text-yellow-400" 
                  : "fill-muted text-muted-foreground"
              )}
            />
          ))}
        </div>
      )
    }

    const renderTestimonial = (testimonial: Testimonial, index: number) => {
      const testimonialContent = (
        <>
          {testimonial.rating && renderStars(testimonial.rating)}
          
          <div className="relative">
            {showQuotes && (
              <Quote className="absolute -top-2 -left-1 h-6 w-6 text-muted-foreground/30" />
            )}
            <blockquote className={cn(
              "text-foreground leading-relaxed",
              showQuotes && "pl-8",
              testimonial.featured ? "text-lg" : "text-base"
            )}>
              {testimonial.content}
            </blockquote>
          </div>
          
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border/50">
            {testimonial.avatar ? (
              <img
                src={testimonial.avatar}
                alt={testimonial.author}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {testimonial.author.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-foreground text-sm truncate">
                {testimonial.author}
              </div>
              {(testimonial.title || testimonial.company) && (
                <div className="text-xs text-muted-foreground truncate">
                  {testimonial.title}
                  {testimonial.title && testimonial.company && " at "}
                  {testimonial.company}
                </div>
              )}
            </div>
          </div>
        </>
      )

      if (variant === "featured" && testimonial.featured) {
        return (
          <Card key={index} className="col-span-full lg:col-span-2 p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-0">
              {testimonialContent}
            </CardContent>
          </Card>
        )
      }

      return (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            {testimonialContent}
          </CardContent>
        </Card>
      )
    }

    const featuredTestimonials = testimonials.filter(t => t.featured)
    const regularTestimonials = testimonials.filter(t => !t.featured)

    return (
      <section
        ref={ref}
        className={cn("py-16 sm:py-20", className)}
        {...props}
      >
        <Container>
          {/* Section Header */}
          {(title || description || badge) && (
            <div className="text-center max-w-3xl mx-auto mb-16">
              {badge && (
                <div className="mb-4">
                  <Badge variant="outline" className="text-sm font-medium px-4 py-1.5">
                    {badge}
                  </Badge>
                </div>
              )}
              
              {title && (
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                  {title}
                </h2>
              )}
              
              {description && (
                <p className="text-lg text-muted-foreground text-balance">
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Testimonials Grid */}
          {variant === "featured" && featuredTestimonials.length > 0 ? (
            <div className="space-y-8">
              {/* Featured Testimonials */}
              <div className={cn("grid gap-6", gridColumns[columns])}>
                {featuredTestimonials.map(renderTestimonial)}
              </div>
              
              {/* Regular Testimonials */}
              {regularTestimonials.length > 0 && (
                <div className={cn("grid gap-6", gridColumns[columns])}>
                  {regularTestimonials.map((testimonial, index) => 
                    renderTestimonial(testimonial, index + featuredTestimonials.length)
                  )}
                </div>
              )}
            </div>
          ) : variant === "masonry" ? (
            <div className={cn("columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6")}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="break-inside-avoid">
                  {renderTestimonial(testimonial, index)}
                </div>
              ))}
            </div>
          ) : (
            <div className={cn("grid gap-6", gridColumns[columns])}>
              {testimonials.map(renderTestimonial)}
            </div>
          )}
        </Container>
      </section>
    )
  }
)
Testimonials.displayName = "Testimonials"

export { Testimonials }