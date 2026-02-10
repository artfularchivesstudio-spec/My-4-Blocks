import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "My 4 Blocks - Emotional Wellness Guide",
  description:
    "Transform your emotional life using the Four Blocks framework - Anger, Anxiety, Depression, and Guilt",
  openGraph: {
    title: "My 4 Blocks",
    description: "Discover peace through understanding the Four Blocks",
    type: "website",
  },
}

// 🌟 The Cosmic Viewport Configuration - Now with notch-aware safe areas!
// viewportFit: 'cover' extends content into the notch area, and we handle the rest with CSS env()
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover", // 📱 Enable safe area insets for notched devices
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
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        {/* 🎯 The Skip Link - A Secret Passage for Keyboard Wizards */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
