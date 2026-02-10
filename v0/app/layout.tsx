import React from "react"
import type { Metadata, Viewport } from 'next'
import { DM_Sans, Cormorant_Garamond, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
})

const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'My 4 Blocks | Find Peace Through Understanding',
  description: 'Discover how Anger, Anxiety, Depression, and Guilt are created—and learn to transform them into peace, contentment, and joy. Based on CBT principles by Dr. Vincent E. Parr.',
  keywords: ['mental wellness', 'CBT', 'cognitive behavioral therapy', 'anger management', 'anxiety relief', 'depression help', 'emotional wellbeing', 'mindfulness'],
  authors: [{ name: 'Dr. Vincent E. Parr' }],
  openGraph: {
    title: 'My 4 Blocks | Find Peace Through Understanding',
    description: 'Transform Anger, Anxiety, Depression, and Guilt into peace and contentment.',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
    generator: 'v0.app'
}

// 🌟 The Cosmic Viewport Configuration - Now with notch-aware safe areas!
// viewportFit: 'cover' tells the browser we'll handle the notch ourselves, like a responsible adult
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f7f4' },
    { media: '(prefers-color-scheme: dark)', color: '#1a2420' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // 📱 Enable safe area insets for notched devices
}

/**
 * 🎭 The Root Layout Alchemist - Where Accessibility Dreams Come True
 *
 * "In the theater of the web, every performer deserves a spotlight,
 * and every keyboard navigator deserves a skip link to main stage!"
 *
 * - The Spellbinding Museum Director of Inclusive Design
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        {/* 🎯 The Skip Link - A Secret Passage for Keyboard Wizards */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
