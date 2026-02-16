'use client'

/**
 * 🎭 The Welcome Header - A Grand Entrance to Emotional Mastery
 *
 * "At the threshold of understanding stands this welcoming herald,
 * beckoning seekers into the realm of self-discovery with open arms
 * and the faint scent of freshly brewed existential tea."
 *
 * - The Spellbinding Museum Director of First Impressions ✨
 */

import { cn } from '@/lib/utils'
import { BlocksPreview } from '@/components/home/blocks-preview'

/**
 * 🌟 WelcomeHeader Props - Configuration for the Welcome Experience
 *
 * @property showBlocksPreview - Whether to display the interactive blocks preview
 *                               (defaults to false to keep the hero clean and minimal)
 */
interface WelcomeHeaderProps {
  showBlocksPreview?: boolean
}

export function WelcomeHeader({ showBlocksPreview = false }: WelcomeHeaderProps) {
  return (
    <div className="text-center space-y-6 py-8">
      {/* 🏰 Logo/Brand - The Grand Castle Gates */}
      <div className="animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
        <div className="inline-flex items-center justify-center mb-4">
          <div className="relative">
            {/* 🎨 Four blocks representing the emotions - A mosaic of feelings */}
            <div className="grid grid-cols-2 gap-1.5">
              <div className="h-5 w-5 rounded-md bg-anger/80 animate-pulse-soft" style={{ animationDelay: '0ms' }} />
              <div className="h-5 w-5 rounded-md bg-anxiety/80 animate-pulse-soft" style={{ animationDelay: '200ms' }} />
              <div className="h-5 w-5 rounded-md bg-depression/80 animate-pulse-soft" style={{ animationDelay: '400ms' }} />
              <div className="h-5 w-5 rounded-md bg-guilt/80 animate-pulse-soft" style={{ animationDelay: '600ms' }} />
            </div>
          </div>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground tracking-tight text-balance">
          My 4 Blocks
        </h1>
      </div>

      {/* 📜 Tagline - The Prophetic Inscription */}
      <div
        className="animate-fade-in-up opacity-0 stagger-1"
        style={{ animationFillMode: 'forwards' }}
      >
        <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed text-pretty">
          Discover how{' '}
          <span className="text-anger font-medium">Anger</span>,{' '}
          <span className="text-anxiety font-medium">Anxiety</span>,{' '}
          <span className="text-depression font-medium">Depression</span>, and{' '}
          <span className="text-guilt font-medium">Guilt</span>{' '}
          are created—and learn to transform them into peace.
        </p>
      </div>

      {/* 🎪 The Interactive Blocks Preview - Optional Visual Enhancement */}
      {showBlocksPreview && (
        <div className="pt-4">
          <BlocksPreview />
        </div>
      )}

      {/* 💭 Quote - Wisdom from the Oracle */}
      <div
        className="animate-fade-in-up opacity-0 stagger-2"
        style={{ animationFillMode: 'forwards' }}
      >
        <blockquote className="relative max-w-md mx-auto">
          <div className="absolute -top-2 -left-2 text-4xl text-primary/20 font-serif">"</div>
          <p className="text-muted-foreground italic text-sm sm:text-base px-6">
            Nothing and no one has ever upset you.
          </p>
          <footer className="mt-2 text-xs text-muted-foreground/70">
            — Dr. Vincent E. Parr
          </footer>
        </blockquote>
      </div>

      {/* ✂️ Divider - The Threshold to Adventure */}
      <div
        className={cn(
          'flex items-center gap-4 max-w-xs mx-auto',
          'animate-fade-in-up opacity-0 stagger-3'
        )}
        style={{ animationFillMode: 'forwards' }}
      >
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground uppercase tracking-widest">
          Begin your journey
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>
    </div>
  )
}
