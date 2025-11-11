"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "./button"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Error message to display below the input
   */
  error?: string
  /**
   * Success message to display below the input
   */
  success?: string
  /**
   * Whether to show character counter for inputs with maxLength
   */
  showCounter?: boolean
  /**
   * Input size variant
   */
  inputSize?: "sm" | "md" | "lg"
  /**
   * Left icon element
   */
  leftIcon?: React.ReactNode
  /**
   * Right icon element
   */
  rightIcon?: React.ReactNode
}

/**
 * Input component with comprehensive form validation support
 * Built following modern design system principles for consistent form experiences
 * 
 * Features:
 * - Multiple size variants
 * - Error and success states with messages
 * - Character counter for inputs with maxLength
 * - Icon support (left and right)
 * - Password visibility toggle for password inputs
 * - Accessible with proper ARIA attributes
 * - WCAG AA+ compliant focus states
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    error, 
    success, 
    showCounter = false,
    inputSize = "md",
    leftIcon,
    rightIcon,
    maxLength,
    value,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [currentLength, setCurrentLength] = React.useState(0)
    
    const isPassword = type === "password"
    const actualType = isPassword && showPassword ? "text" : type

    const sizeClasses = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-3 py-2 text-sm",
      lg: "h-12 px-4 py-3 text-base",
    }

    React.useEffect(() => {
      if (typeof value === "string") {
        setCurrentLength(value.length)
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentLength(e.target.value.length)
      props.onChange?.(e)
    }

    const inputElement = (
      <input
        type={actualType}
        className={cn(
          // Base styles
          "flex w-full rounded-md border border-input bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          // Size variants
          sizeClasses[inputSize],
          // State styles
          error && "border-destructive focus-visible:ring-destructive",
          success && "border-[hsl(var(--success-500))] focus-visible:ring-[hsl(var(--success-500))]",
          // Icon padding adjustments
          leftIcon && (inputSize === "sm" ? "pl-8" : inputSize === "lg" ? "pl-12" : "pl-10"),
          (rightIcon || isPassword) && (inputSize === "sm" ? "pr-8" : inputSize === "lg" ? "pr-12" : "pr-10"),
          className
        )}
        ref={ref}
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={
          error ? `${props.id}-error` : 
          success ? `${props.id}-success` : 
          undefined
        }
        {...props}
      />
    )

    const wrappedInput = leftIcon || rightIcon || isPassword ? (
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className={cn(
            "absolute left-0 top-0 flex items-center justify-center pointer-events-none text-muted-foreground",
            inputSize === "sm" ? "h-8 w-8" : inputSize === "lg" ? "h-12 w-12" : "h-10 w-10"
          )}>
            {leftIcon}
          </div>
        )}
        
        {inputElement}
        
        {/* Right Icon or Password Toggle */}
        {(rightIcon || isPassword) && (
          <div className={cn(
            "absolute right-0 top-0 flex items-center justify-center",
            inputSize === "sm" ? "h-8 w-8" : inputSize === "lg" ? "h-12 w-12" : "h-10 w-10"
          )}>
            {isPassword ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-full w-full p-0 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            ) : (
              <div className="pointer-events-none text-muted-foreground">
                {rightIcon}
              </div>
            )}
          </div>
        )}
      </div>
    ) : inputElement

    return (
      <div className="space-y-1">
        {wrappedInput}
        
        {/* Character Counter */}
        {showCounter && maxLength && (
          <div className="flex justify-end">
            <span className={cn(
              "text-xs text-muted-foreground",
              currentLength > maxLength * 0.9 && "text-warning",
              currentLength === maxLength && "text-destructive"
            )}>
              {currentLength}/{maxLength}
            </span>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <p 
            id={`${props.id}-error`} 
            className="text-xs text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
        
        {/* Success Message */}
        {success && !error && (
          <p 
            id={`${props.id}-success`} 
            className="text-xs text-[hsl(var(--success-600))]"
          >
            {success}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }