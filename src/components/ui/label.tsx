"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "text-foreground",
        error: "text-destructive",
        success: "text-[hsl(var(--success-600))]",
        muted: "text-muted-foreground",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
      required: {
        true: "after:content-['*'] after:text-destructive after:ml-1",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      required: false,
    },
  }
)

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  /**
   * Whether the field is required (shows asterisk)
   */
  required?: boolean
}

/**
 * Label component for form fields
 * Built following 21st.dev design system principles for consistent form labeling
 * 
 * Features:
 * - Multiple variants for different states
 * - Size variants for different contexts
 * - Required field indicator with asterisk
 * - Accessible with proper associations
 * - WCAG AA+ compliant styling
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, variant, size, required, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ variant, size, required }), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }