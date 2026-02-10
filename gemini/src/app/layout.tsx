import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/**
 * 🎭 The Root Layout - The Grand Stage of Digital Wellness
 *
 * "Where fonts are summoned and viewports are tamed,
 * the foundation upon which all wisdom is framed."
 *
 * - The Spellbinding Layout Architect
 */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🌟 The Cosmic Viewport Configuration - Mobile-first, always
// viewportFit: 'cover' enables the sacred env() safe-area-inset variables for notched devices
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // 📱 Enable safe area insets for notched devices
};

// 📜 The Sacred Metadata Scrolls
export const metadata: Metadata = {
  title: "My 4 Blocks - Gemini",
  description: "Master your emotional blocks and find lasting contentment with AI-powered guidance",
};

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
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 🎯 The Skip Link - A Secret Passage for Keyboard Wizards */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
