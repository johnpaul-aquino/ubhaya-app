"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  /**
   * Error message to display
   */
  error?: string
  /**
   * Success message to display
   */
  success?: string
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg"
}

export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  /**
   * Label text for the radio item
   */
  label?: string
  /**
   * Description text below the label
   */
  description?: string
  /**
   * Size variant (inherited from RadioGroup if not specified)
   */
  size?: "sm" | "md" | "lg"
}

/**
 * RadioGroup component with comprehensive form validation support
 * Built following modern design system principles for consistent form experiences
 * 
 * Features:
 * - Multiple size variants
 * - Error and success states with messages
 * - Label and description support for individual items
 * - Accessible with proper ARIA attributes
 * - WCAG AA+ compliant focus states and contrast ratios
 */
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, error, success, size = "md", id, children, ...props }, ref) => {
  return (
    <div className="space-y-2">
      <RadioGroupPrimitive.Root
        className={cn("grid gap-2", className)}
        ref={ref}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={
          error ? `${id}-error` : 
          success ? `${id}-success` : 
          undefined
        }
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<RadioGroupItemProps>, {
              size: child.props.size || size,
            })
          }
          return child
        })}
      </RadioGroupPrimitive.Root>
      
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
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, label, description, size = "md", id, ...props }, ref) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const indicatorSizeClasses = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
    lg: "h-2.5 w-2.5",
  }

  const radioElement = (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        sizeClasses[size],
        className
      )}
      id={id}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className={cn("fill-current text-current", indicatorSizeClasses[size])} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )

  // If no label, return just the radio
  if (!label) {
    return radioElement
  }

  return (
    <div className="flex items-start space-x-3">
      {radioElement}
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }