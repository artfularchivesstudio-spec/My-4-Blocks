'use client'

import { cn } from '@/lib/utils'
import { Brain, AlertTriangle, HelpCircle, BookOpen, ArrowRight, Lightbulb } from 'lucide-react'

/**
 * 🎭 The Concept Card - A Pocket-Sized Wisdom Stage
 *
 * "In the theater of the mind, each concept is an actor,
 * stepping briefly onto the stage to deliver its line of truth,
 * then gracefully bowing before fading into understanding."
 *
 * - The Spellbinding Museum Director of Cognitive Wisdom
 */

// 🌟 The mystical categories of cognitive enlightenment
type ConceptCategory = 'abc-model' | 'irrational-belief' | 'disputation' | 'stoic' | 'general'

interface ConceptCardProps {
  title: string           // 📜 e.g., "The ABC Model", "Awfulizing"
  content: string         // 🎭 Brief explanation (1-2 sentences)
  category: ConceptCategory
  learnMoreLink?: string  // 🔗 Optional portal to deeper wisdom
  icon?: React.ReactNode  // 🎨 Optional custom icon (overrides category default)
}

// 🎨 The Chromatic Registry - Each category gets its own mystical color palette
// Like paint swatches for the soul, but with more Tailwind classes ✨
const categoryStyles: Record<ConceptCategory, {
  bg: string
  border: string
  iconBg: string
  iconColor: string
}> = {
  'abc-model': {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-200 dark:border-purple-800/50',
    iconBg: 'bg-purple-100 dark:bg-purple-900/50',
    iconColor: 'text-purple-600 dark:text-purple-400'
  },
  'irrational-belief': {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800/50',
    iconBg: 'bg-amber-100 dark:bg-amber-900/50',
    iconColor: 'text-amber-600 dark:text-amber-400'
  },
  'disputation': {
    bg: 'bg-cyan-50 dark:bg-cyan-950/30',
    border: 'border-cyan-200 dark:border-cyan-800/50',
    iconBg: 'bg-cyan-100 dark:bg-cyan-900/50',
    iconColor: 'text-cyan-600 dark:text-cyan-400'
  },
  'stoic': {
    bg: 'bg-slate-50 dark:bg-slate-950/30',
    border: 'border-slate-200 dark:border-slate-700/50',
    iconBg: 'bg-slate-100 dark:bg-slate-800/50',
    iconColor: 'text-slate-600 dark:text-slate-400'
  },
  'general': {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800/50',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400'
  }
}

// 🎭 The Icon Summoner - Conjures the appropriate symbol for each category
// Because every concept deserves its own little visual herald! 📯
const categoryIcons: Record<ConceptCategory, React.ReactNode> = {
  'abc-model': <Brain className="h-4 w-4" />,
  'irrational-belief': <AlertTriangle className="h-4 w-4" />,
  'disputation': <HelpCircle className="h-4 w-4" />,
  'stoic': <BookOpen className="h-4 w-4" />,
  'general': <Lightbulb className="h-4 w-4" />
}

/**
 * 🌟 The Concept Card Component - Where Four Blocks wisdom gets cozy
 *
 * A compact, inline-friendly card that presents bite-sized cognitive concepts
 * during conversation. Think of it as a fortune cookie, but actually helpful
 * and backed by decades of psychological research. 🥠🧠
 *
 * @param title - The concept's noble name (e.g., "Catastrophizing")
 * @param content - A brief explanation (keep it snappy, 1-2 sentences max)
 * @param category - The cognitive family this concept belongs to
 * @param learnMoreLink - Optional URL for seekers of deeper wisdom
 * @param icon - Custom icon override (for when you want to get fancy)
 */
export function ConceptCard({
  title,
  content,
  category,
  learnMoreLink,
  icon
}: ConceptCardProps) {
  const styles = categoryStyles[category]
  const defaultIcon = categoryIcons[category]

  // 🎨 The icon to display - custom overrides the default, naturally
  const displayIcon = icon || defaultIcon

  return (
    <div
      className={cn(
        // 🌟 Base structural styling
        'inline-flex flex-col gap-2 rounded-xl border p-3',
        // 📐 Compact sizing for inline chat display
        'max-w-sm w-full',
        // ✨ Subtle animation on entrance (matching chat-message vibe)
        'animate-fade-in-up opacity-0',
        // 🎨 Category-specific coloring
        styles.bg,
        styles.border
      )}
      style={{ animationFillMode: 'forwards' }}
    >
      {/* 🎭 The Header Row - Icon + Title in harmonious alignment */}
      <div className="flex items-center gap-2">
        {/* 🔮 Icon Container - A small stage for our symbolic friend */}
        <div
          className={cn(
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-md',
            styles.iconBg,
            styles.iconColor
          )}
        >
          {displayIcon}
        </div>

        {/* 📜 Title - Bold and proud, as concepts should be */}
        <h4 className="font-semibold text-sm text-foreground leading-tight">
          {title}
        </h4>
      </div>

      {/* 🎪 Content Section - Where the wisdom lives */}
      <p className="text-xs text-muted-foreground leading-relaxed pl-8">
        {content}
      </p>

      {/* 🔗 Learn More Link - Optional portal to deeper understanding */}
      {learnMoreLink && (
        <a
          href={learnMoreLink}
          className={cn(
            'inline-flex items-center gap-1 text-xs font-medium pl-8',
            'transition-colors duration-200',
            'text-primary/70 hover:text-primary',
            'group'
          )}
        >
          Learn more
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </a>
      )}
    </div>
  )
}

// 🎉 Export the category type for those who wish to conjure cards programmatically
export type { ConceptCardProps, ConceptCategory }
