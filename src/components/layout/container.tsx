import * as React from "react"
import { cn } from "@/lib/utils"

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum width variant for the container
   * @default "default"
   */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "default"
  /**
   * Whether to center the container
   * @default true
   */
  center?: boolean
  /**
   * Custom padding override
   */
  padding?: "none" | "sm" | "md" | "lg" | "xl"
}

/**
 * Container component that provides consistent content width and centering
 * Built following 21st.dev design system principles for responsive layouts
 * 
 * Features:
 * - Responsive padding that adapts to screen size
 * - Multiple max-width variants for different content types
 * - Accessible and semantic HTML structure
 * - Optimized for both mobile and desktop experiences
 */
const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, maxWidth = "default", center = true, padding = "md", children, ...props }, ref) => {
    const maxWidthClasses = {
      sm: "max-w-sm",
      md: "max-w-md", 
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      full: "max-w-full",
      default: "max-w-7xl",
    }

    const paddingClasses = {
      none: "",
      sm: "px-4 sm:px-6",
      md: "px-4 sm:px-6 lg:px-8",
      lg: "px-6 sm:px-8 lg:px-12",
      xl: "px-8 sm:px-12 lg:px-16",
    }

    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "w-full",
          // Max width
          maxWidthClasses[maxWidth],
          // Centering
          center && "mx-auto",
          // Padding
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Container.displayName = "Container"

export { Container }