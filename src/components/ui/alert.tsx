import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react"
import { Button } from "./button"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        destructive:
          "border-[hsl(var(--error-300))] text-[hsl(var(--error-900))] bg-[hsl(var(--error-50))] [&>svg]:text-[hsl(var(--error-600))]",
        success:
          "border-[hsl(var(--success-300))] text-[hsl(var(--success-900))] bg-[hsl(var(--success-50))] [&>svg]:text-[hsl(var(--success-600))]",
        warning:
          "border-[hsl(var(--warning-300))] text-[hsl(var(--warning-900))] bg-[hsl(var(--warning-50))] [&>svg]:text-[hsl(var(--warning-600))]",
        info:
          "border-[hsl(var(--info-300))] text-[hsl(var(--info-900))] bg-[hsl(var(--info-50))] [&>svg]:text-[hsl(var(--info-600))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants> & {
    dismissible?: boolean
    onDismiss?: () => void
  }
>(({ className, variant, dismissible = false, onDismiss, children, ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  // Auto-select appropriate icon based on variant
  const getIcon = () => {
    switch (variant) {
      case "destructive":
        return <AlertCircle className="h-4 w-4" />
      case "success":
        return <CheckCircle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "info":
        return <Info className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  if (!isVisible) return null

  return (
    <div
      ref={ref}
      role="alert"
      aria-live="polite"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {getIcon()}
      <div className="flex-1">
        {children}
      </div>
      {dismissible && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 h-6 w-6 p-0 hover:bg-transparent"
          onClick={handleDismiss}
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

/**
 * Convenience components for common alert types
 */
export const AlertSuccess = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { dismissible?: boolean; onDismiss?: () => void }
>((props, ref) => <Alert ref={ref} variant="success" {...props} />)
AlertSuccess.displayName = "AlertSuccess"

export const AlertError = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { dismissible?: boolean; onDismiss?: () => void }
>((props, ref) => <Alert ref={ref} variant="destructive" {...props} />)
AlertError.displayName = "AlertError"

export const AlertWarning = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { dismissible?: boolean; onDismiss?: () => void }
>((props, ref) => <Alert ref={ref} variant="warning" {...props} />)
AlertWarning.displayName = "AlertWarning"

export const AlertInfo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { dismissible?: boolean; onDismiss?: () => void }
>((props, ref) => <Alert ref={ref} variant="info" {...props} />)
AlertInfo.displayName = "AlertInfo"

export { Alert, AlertTitle, AlertDescription }