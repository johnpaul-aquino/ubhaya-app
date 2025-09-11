"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * Theme toggle component with dropdown for theme selection
 * Provides accessible theme switching with keyboard navigation
 * Follows WCAG AA+ standards with proper ARIA labels
 */
export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 px-0"
          aria-label={`Current theme: ${theme}. Click to change theme`}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer"
          aria-describedby="theme-light-description"
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          <span id="theme-light-description" className="sr-only">
            Switch to light theme
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer"
          aria-describedby="theme-dark-description"
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          <span id="theme-dark-description" className="sr-only">
            Switch to dark theme
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer"
          aria-describedby="theme-system-description"
        >
          <div className="mr-2 h-4 w-4 relative">
            <Sun className="h-2 w-2 absolute top-0 left-0" />
            <Moon className="h-2 w-2 absolute bottom-0 right-0" />
          </div>
          <span>System</span>
          <span id="theme-system-description" className="sr-only">
            Use system theme setting
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}