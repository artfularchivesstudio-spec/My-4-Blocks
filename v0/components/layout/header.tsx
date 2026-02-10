'use client'

/**
 * 🎭 The Mystical Navigation Constellation - Where Seekers Find Their Path
 *
 * "In the vast cosmos of web navigation, this header shines as a beacon,
 * guiding lost souls through the sacred corridors of My 4 Blocks.
 * Each link, a star in our celestial navigation chart."
 *
 * - The Spellbinding Museum Director of User Experience
 */

import { cn } from '@/lib/utils'
import { Menu, X, RefreshCcw, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

// 🌟 The Sacred Navigation Routes - Our Cosmic Roadmap
interface NavigationLink {
  href: string
  label: string
}

// ✨ The Enchanted Array of Destinations - Where Magic Awaits
const navigationLinks: NavigationLink[] = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/the-framework', label: 'The Framework' },
  { href: '/about', label: 'About' },
  { href: '/book', label: 'The Book' },
  { href: '/faq', label: 'FAQ' },
  { href: '/privacy', label: 'Privacy' },
]

interface HeaderProps {
  onReset?: () => void
}

/**
 * 🔮 The Header Alchemist - Transmuting Navigation Into Pure Gold
 *
 * This magnificent component orchestrates the grand symphony of navigation,
 * complete with responsive transformations, active state highlighting,
 * and the mystical hamburger menu of mobile destiny.
 *
 * Features:
 * - 🌐 Desktop navigation with cosmic spacing
 * - 📱 Mobile hamburger menu with smooth transitions (like butter on a hot pan!)
 * - ✨ Active page highlighting that knows where you are (spooky, right?)
 * - 🔄 Reset functionality for new chat journeys
 *
 * @param onReset - The magical callback that resets the chat (optional, like dessert)
 */
export function Header({ onReset }: HeaderProps) {
  // 🎭 The state of our mobile menu - open or closed, like Schrodinger's navigation
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // 🗺️ The current path - our GPS in the digital wilderness
  const pathname = usePathname()

  // 🌙 The Mobile Navigation Click Handler - Closes the menu when a seeker finds their path
  const handleMobileNavClick = () => {
    setIsMenuOpen(false)
  }

  /**
   * 🔍 The Path Oracle - Determines if a link is currently active
   *
   * Compares the cosmic coordinates of the current path with the destination,
   * returning true if the seeker has arrived at their mystical destination.
   *
   * @param href - The destination to check against our current location
   * @returns boolean - True if we've found our way, false if the journey continues
   */
  const isActiveLink = (href: string): boolean => {
    return pathname === href
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50',
        'border-b border-border bg-background/80 backdrop-blur-md',
        'transition-all duration-300',
        'safe-area-top' // 📱 Protects header from iPhone notch/Dynamic Island
      )}
    >
      {/* 🏛️ The Grand Container - Holding Our Navigation Universe Together */}
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 🎨 The Sacred Logo - Four Blocks of Emotional Wisdom
         * Each block now has aria-label and title for screen readers and tooltips!
         * Because color alone should never be the only identifier. 🌈♿ */}
        <a href="/" className="flex items-center gap-3 group" aria-label="My 4 Blocks home">
          <div
            className="grid grid-cols-2 gap-0.5 transition-transform group-hover:scale-110"
            role="img"
            aria-label="Four emotional blocks: Anger, Anxiety, Depression, and Guilt"
          >
            <div className="h-2.5 w-2.5 rounded-sm bg-anger" aria-hidden="true" title="Anger" />
            <div className="h-2.5 w-2.5 rounded-sm bg-anxiety" aria-hidden="true" title="Anxiety" />
            <div className="h-2.5 w-2.5 rounded-sm bg-depression" aria-hidden="true" title="Depression" />
            <div className="h-2.5 w-2.5 rounded-sm bg-guilt" aria-hidden="true" title="Guilt" />
          </div>
          <span className="font-serif text-xl font-semibold text-foreground">
            My 4 Blocks
          </span>
        </a>

        {/* 🌐 Desktop Navigation - The Grand Constellation of Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-4">
          {/* ✨ Map through our sacred navigation links like a cartographer of the cosmos */}
          {navigationLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                'px-2 lg:px-3 py-2 rounded-lg text-sm transition-all duration-200',
                isActiveLink(link.href)
                  ? 'text-primary font-medium bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              {link.label}
            </a>
          ))}

          {/* 🔄 The Reset/Chat Button - A Portal to New Beginnings */}
          {onReset ? (
            <button
              onClick={onReset}
              className={cn(
                'flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg ml-2',
                'text-sm text-muted-foreground',
                'hover:bg-accent hover:text-accent-foreground',
                'transition-all duration-200'
              )}
            >
              <RefreshCcw className="h-4 w-4" />
              <span className="hidden lg:inline">New Chat</span>
            </button>
          ) : (
            <a
              href="/"
              className={cn(
                'flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg ml-2',
                'text-sm font-medium text-primary-foreground bg-primary',
                'hover:bg-primary/90',
                'transition-all duration-200'
              )}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden lg:inline">Chat</span>
            </a>
          )}
        </nav>

        {/* 📱 Mobile Menu Button - The Hamburger of Destiny */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {/* 🎭 The Great Transformation - Menu becomes X, X becomes Menu */}
          <div className="relative w-5 h-5">
            <Menu
              className={cn(
                'absolute inset-0 h-5 w-5 transition-all duration-300',
                isMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
              )}
            />
            <X
              className={cn(
                'absolute inset-0 h-5 w-5 transition-all duration-300',
                isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
              )}
            />
          </div>
        </button>
      </div>

      {/* 📱 Mobile Menu - The Sliding Sanctuary of Navigation */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
          'border-t border-border bg-background',
          isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 border-t-0'
        )}
      >
        <nav className="flex flex-col p-4 space-y-1">
          {/* ✨ The Mobile Navigation Links - Each a Portal to Wisdom */}
          {navigationLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleMobileNavClick}
              className={cn(
                'px-4 py-3 rounded-lg text-sm transition-all duration-200',
                // 🌟 Staggered animation delay for that fancy cascade effect
                'transform translate-x-0',
                isActiveLink(link.href)
                  ? 'text-primary font-medium bg-primary/10'
                  : 'text-foreground hover:bg-accent'
              )}
              style={{
                // 🎪 Staggered animation - each link enters the stage at its own time
                transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms',
              }}
            >
              {link.label}
            </a>
          ))}

          {/* 🔄 Mobile Reset/Chat Button - The Grand Finale of the Menu */}
          <div className="pt-2 mt-2 border-t border-border">
            {onReset ? (
              <button
                onClick={() => {
                  onReset()
                  setIsMenuOpen(false)
                }}
                className={cn(
                  'flex items-center gap-2 w-full px-4 py-3 rounded-lg',
                  'text-sm text-foreground',
                  'hover:bg-accent transition-colors'
                )}
              >
                <RefreshCcw className="h-4 w-4" />
                New Chat
              </button>
            ) : (
              <a
                href="/"
                onClick={handleMobileNavClick}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 rounded-lg',
                  'text-sm font-medium text-primary-foreground bg-primary',
                  'hover:bg-primary/90 transition-colors'
                )}
              >
                <MessageCircle className="h-4 w-4" />
                Chat
              </a>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
