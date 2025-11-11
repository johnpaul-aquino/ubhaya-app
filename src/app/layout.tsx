import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Montserrat, Fira_Code } from 'next/font/google';
import { AuthProvider } from '@/components/auth/auth-provider';
import { Toaster } from '@/components/ui/sonner';

// Montserrat for main UI - as specified in OKLCH theme
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
  display: 'swap',
});

// Fira Code for monospace - as specified in OKLCH theme
const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Website Boilerplate',
    template: '%s | Website Boilerplate',
  },
  description: 'A professional Next.js headless website boilerplate for modern web development',
  keywords: ['nextjs', 'typescript', 'tailwindcss', 'headless', 'cms', 'boilerplate'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    title: 'Website Boilerplate',
    description: 'A professional Next.js headless website boilerplate for modern web development',
    siteName: 'Website Boilerplate',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Website Boilerplate',
    description: 'A professional Next.js headless website boilerplate for modern web development',
    creator: '@yourusername',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${montserrat.variable} ${firaCode.variable} font-sans`}>
        <AuthProvider>
          <div className="relative min-h-screen bg-background">
            <main className="relative">
              {children}
            </main>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}