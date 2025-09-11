import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Error message to display below the textarea
   */
  error?: string
  /**
   * Success message to display below the textarea
   */
  success?: string
  /**
   * Whether to show character counter for textareas with maxLength
   */
  showCounter?: boolean
  /**
   * Whether the textarea should auto-resize based on content
   */
  autoResize?: boolean
  /**
   * Minimum number of rows when auto-resizing
   */
  minRows?: number
  /**
   * Maximum number of rows when auto-resizing
   */
  maxRows?: number
}

/**
 * Textarea component with comprehensive form validation and auto-resize support
 * Built following 21st.dev design system principles for consistent form experiences
 * 
 * Features:
 * - Auto-resize functionality based on content
 * - Error and success states with messages
 * - Character counter for textareas with maxLength
 * - Configurable min/max rows for auto-resize
 * - Accessible with proper ARIA attributes
 * - WCAG AA+ compliant focus states
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    error, 
    success, 
    showCounter = false,
    autoResize = false,
    minRows = 2,
    maxRows = 8,
    maxLength,
    value,
    onChange,
    rows,
    ...props 
  }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    const [currentLength, setCurrentLength] = React.useState(0)
    
    // Merge refs
    const mergedRef = React.useCallback((node: HTMLTextAreaElement) => {
      textareaRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }, [ref])

    React.useEffect(() => {
      if (typeof value === "string") {
        setCurrentLength(value.length)
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      setCurrentLength(newValue.length)
      
      // Auto-resize logic
      if (autoResize && textareaRef.current) {
        // Reset height to calculate new height
        textareaRef.current.style.height = 'auto'
        
        const scrollHeight = textareaRef.current.scrollHeight
        const lineHeight = parseInt(getComputedStyle(textareaRef.current).lineHeight)
        const maxHeight = lineHeight * maxRows
        const minHeight = lineHeight * minRows
        
        const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight)
        textareaRef.current.style.height = `${newHeight}px`
      }
      
      onChange?.(e)
    }

    // Set initial height for auto-resize
    React.useEffect(() => {
      if (autoResize && textareaRef.current && value) {
        handleChange({ target: textareaRef.current } as React.ChangeEvent<HTMLTextAreaElement>)
      }
    }, [autoResize, value])

    const textareaElement = (
      <textarea
        className={cn(
          // Base styles
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          // State styles
          error && "border-destructive focus-visible:ring-destructive",
          success && "border-[hsl(var(--success-500))] focus-visible:ring-[hsl(var(--success-500))]",
          // Auto-resize styles
          autoResize && "resize-none overflow-hidden",
          className
        )}
        ref={mergedRef}
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        rows={autoResize ? minRows : rows}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={
          error ? `${props.id}-error` : 
          success ? `${props.id}-success` : 
          undefined
        }
        {...props}
      />
    )

    return (
      <div className="space-y-1">
        {textareaElement}
        
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
Textarea.displayName = "Textarea"

export { Textarea }