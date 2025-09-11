"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /**
   * Error message to display
   */
  error?: string
  /**
   * Success message to display
   */
  success?: string
  /**
   * Label text for the checkbox
   */
  label?: string
  /**
   * Description text below the label
   */
  description?: string
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg"
  /**
   * Whether the checkbox is in an indeterminate state
   */
  indeterminate?: boolean
}

/**
 * Checkbox component with comprehensive form validation support
 * Built following 21st.dev design system principles for consistent form experiences
 * 
 * Features:
 * - Multiple size variants
 * - Error and success states with messages
 * - Label and description support
 * - Indeterminate state support
 * - Accessible with proper ARIA attributes
 * - WCAG AA+ compliant focus states and contrast ratios
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ 
  className, 
  error, 
  success, 
  label, 
  description, 
  size = "md",
  indeterminate = false,
  checked,
  id,
  ...props 
}, ref) => {
  const checkboxRef = React.useRef<HTMLButtonElement>(null)
  
  // Merge refs
  const mergedRef = React.useCallback((node: HTMLButtonElement) => {
    checkboxRef.current = node
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
  }, [ref])

  // Handle indeterminate state
  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5",
  }

  const iconSizeClasses = {
    sm: "h-2.5 w-2.5",
    md: "h-3 w-3",
    lg: "h-3.5 w-3.5",
  }

  const checkboxElement = (
    <CheckboxPrimitive.Root
      ref={mergedRef}
      className={cn(
        "peer shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        sizeClasses[size],
        error && "border-destructive data-[state=checked]:bg-destructive",
        success && "border-[hsl(var(--success-500))] data-[state=checked]:bg-[hsl(var(--success-500))]",
        className
      )}
      checked={indeterminate ? "indeterminate" : checked}
      id={id}
      aria-invalid={error ? "true" : "false"}
      aria-describedby={
        error ? `${id}-error` : 
        success ? `${id}-success` : 
        description ? `${id}-description` :
        undefined
      }
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn(
          "flex items-center justify-center text-current"
        )}
      >
        {indeterminate ? (
          <div className={cn(
            "bg-current rounded-sm",
            size === "sm" ? "h-0.5 w-1.5" : size === "lg" ? "h-0.5 w-2.5" : "h-0.5 w-2"
          )} />
        ) : (
          <Check className={iconSizeClasses[size]} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )

  // If no label, return just the checkbox
  if (!label) {
    return (
      <div className="space-y-1">
        {checkboxElement}
        
        {/* Error Message */}
        {error && (
          <p 
            id={id ? `${id}-error` : undefined} 
            className="text-xs text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
        
        {/* Success Message */}
        {success && !error && (
          <p 
            id={id ? `${id}-success` : undefined} 
            className="text-xs text-[hsl(var(--success-600))]"
          >
            {success}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex items-start space-x-3">
        {checkboxElement}
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor={id}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
              error && "text-destructive",
              success && "text-[hsl(var(--success-600))]"
            )}
          >
            {label}
          </label>
          {description && (
            <p 
              id={id ? `${id}-description` : undefined}
              className="text-xs text-muted-foreground"
            >
              {description}
            </p>
          )}
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <p 
          id={id ? `${id}-error` : undefined} 
          className="text-xs text-destructive ml-7"
          role="alert"
        >
          {error}
        </p>
      )}
      
      {/* Success Message */}
      {success && !error && (
        <p 
          id={id ? `${id}-success` : undefined} 
          className="text-xs text-[hsl(var(--success-600))] ml-7"
        >
          {success}
        </p>
      )}
    </div>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }