/**
 * Share Buttons - Social sharing for blog posts
 */

'use client'

import { useState } from 'react'
import { TwitterIcon, FacebookIcon, LinkedinIcon, MailIcon, CopyIcon, CheckIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { generateShareUrls } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
  className?: string
}

export function ShareButtons({ url, title, description, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const shareUrls = generateShareUrls(url, title, description)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const shareButtons = [
    {
      name: 'Twitter',
      icon: TwitterIcon,
      url: shareUrls.twitter,
      className: 'hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950',
    },
    {
      name: 'Facebook',
      icon: FacebookIcon,
      url: shareUrls.facebook,
      className: 'hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950',
    },
    {
      name: 'LinkedIn',
      icon: LinkedinIcon,
      url: shareUrls.linkedin,
      className: 'hover:bg-blue-50 hover:text-blue-800 dark:hover:bg-blue-950',
    },
    {
      name: 'Email',
      icon: MailIcon,
      url: shareUrls.email,
      className: 'hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-800',
    },
  ]

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <span className="text-sm font-medium text-muted-foreground">Share:</span>
      
      {shareButtons.map((button) => {
        const Icon = button.icon
        return (
          <Button
            key={button.name}
            variant="ghost"
            size="sm"
            asChild
            className={cn('h-8 w-8 p-0', button.className)}
          >
            <a
              href={button.url}
              target={button.name === 'Email' ? undefined : '_blank'}
              rel={button.name === 'Email' ? undefined : 'noopener noreferrer'}
              aria-label={`Share on ${button.name}`}
            >
              <Icon className="h-4 w-4" />
            </a>
          </Button>
        )
      })}
      
      {/* Copy URL Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="h-8 w-8 p-0 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-800"
        aria-label="Copy URL"
      >
        {copied ? (
          <CheckIcon className="h-4 w-4 text-green-600" />
        ) : (
          <CopyIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}