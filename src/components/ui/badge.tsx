import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-[hsl(var(--success-500))] text-white hover:bg-[hsl(var(--success-600))]",
        warning:
          "border-transparent bg-[hsl(var(--warning-500))] text-white hover:bg-[hsl(var(--warning-600))]",
        info:
          "border-transparent bg-[hsl(var(--info-500))] text-white hover:bg-[hsl(var(--info-600))]",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Whether the badge should be interactive (clickable)
   */
  interactive?: boolean
}

/**
 * Badge component for status indicators, tags, and labels
 * Built following modern design system principles for consistent visual hierarchy
 * 
 * Features:
 * - Multiple variants for different semantic meanings
 * - Size variants for different contexts
 * - Interactive states for clickable badges
 * - Accessible with proper focus management
 * - WCAG AA+ compliant contrast ratios
 */
function Badge({ 
  className, 
  variant, 
  size,
  interactive = false,
  ...props 
}: BadgeProps) {
  const Component = interactive ? "button" : "div"
  
  return (
    <Component
      className={cn(
        badgeVariants({ variant, size }),
        interactive && "cursor-pointer hover:scale-105 active:scale-95 transition-transform",
        className
      )}
      {...props}
    />
  )
}

export { Badge, badgeVariants }