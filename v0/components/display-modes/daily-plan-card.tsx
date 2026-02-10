'use client'

/**
 * 🎭 The Daily Plan Card - A Compact Canvas of Your Healing Journey
 *
 * "In the dawn's gentle light, intentions crystallize,
 * four blocks of emotion await their sacred rites,
 * and affirmations whisper courage into the seeking soul."
 *
 * - The Spellbinding Museum Director of Daily Wellness 🌅
 */

import * as React from 'react'
import { Sun, Sparkles, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// 🌟 The Block Type Constellation - Each emotion wears its signature hue
type BlockType = 'anger' | 'anxiety' | 'depression' | 'guilt'

// 🎨 The Chromatic Map - Where emotions meet their destined colors
const blockColors: Record<BlockType, { bg: string; border: string; label: string }> = {
  anger: {
    bg: 'bg-red-500',
    border: 'border-red-400',
    label: 'Anger'
  },
  anxiety: {
    bg: 'bg-amber-500',
    border: 'border-amber-400',
    label: 'Anxiety'
  },
  depression: {
    bg: 'bg-blue-500',
    border: 'border-blue-400',
    label: 'Depression'
  },
  guilt: {
    bg: 'bg-emerald-500',
    border: 'border-emerald-400',
    label: 'Guilt'
  }
}

// 🔮 The Sacred Props Interface - Blueprint for daily transformation
interface DailyPlanCardProps {
  /** 🌅 The morning intention - your compass for the day ahead */
  morningIntention: string
  /** 🎪 The four blocks of emotional focus - each with its guiding prompt */
  blockFocuses: Array<{
    block: BlockType
    prompt: string
  }>
  /** ✨ The affirmation - whispered encouragement for the journey */
  affirmation: string
  /** 🚪 The portal to expanded wisdom - callback to view full plan */
  onViewFull?: () => void
  /** 🎨 Optional className for external styling sorcery */
  className?: string
}

/**
 * 🌟 The Daily Plan Card Component - Where Morning Magic Meets Evening Serenity
 *
 * A compact inline card that displays your daily 4 Blocks healing plan summary.
 * Think of it as a pocket-sized treasure map to emotional wellness.
 * Perfect for at-a-glance inspiration without overwhelming the senses. 🗺️✨
 *
 * Features:
 * - Prominent morning intention with a sunny disposition ☀️
 * - Four delightful colored dots representing each emotional block
 * - Italicized affirmation that sparkles with hope
 * - "View Full Plan" button for those craving deeper wisdom
 *
 * Usage: Drop it in a chat interface, dashboard, or wherever daily
 * inspiration is needed. It plays well with others! 🎭
 */
export function DailyPlanCard({
  morningIntention,
  blockFocuses,
  affirmation,
  onViewFull,
  className
}: DailyPlanCardProps) {
  return (
    <Card
      className={cn(
        'w-full max-w-md overflow-hidden',
        'bg-gradient-to-br from-card to-card/80',
        'border border-border/60',
        'shadow-md hover:shadow-lg transition-shadow duration-300',
        className
      )}
    >
      {/* 🌅 The Morning Intention Herald - Where the day's purpose unfolds */}
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <Sun className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Morning Intention
            </p>
            <p className="text-sm font-medium text-foreground leading-relaxed">
              {morningIntention}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* 🎪 The Block Focus Constellation - Four dots of emotional destiny */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Today's Focus Areas
          </p>
          <div className="flex flex-wrap gap-2">
            {blockFocuses.map((focus, index) => (
              <BlockBadge
                key={`${focus.block}-${index}`}
                block={focus.block}
                prompt={focus.prompt}
              />
            ))}
          </div>
        </div>

        {/* ✨ The Affirmation Whisper - Italicized words of encouragement */}
        <div className="flex items-start gap-2 pt-2 border-t border-border/40">
          <Sparkles className="h-4 w-4 mt-0.5 text-purple-500 dark:text-purple-400 shrink-0" />
          <p className="text-sm italic text-muted-foreground leading-relaxed">
            "{affirmation}"
          </p>
        </div>
      </CardContent>

      {/* 🚪 The Portal Footer - Gateway to deeper exploration */}
      {onViewFull && (
        <CardFooter className="pt-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewFull}
            className="w-full justify-between text-muted-foreground hover:text-foreground group"
          >
            <span>View Full Plan</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

// 🎨 The Block Badge - A tiny jewel representing each emotional focus
interface BlockBadgeProps {
  block: BlockType
  prompt: string
}

/**
 * 🔮 The Block Badge Component - Miniature Medallions of Emotional Focus
 *
 * Each badge is a colored dot with a tooltip-like label, representing
 * one of the four emotional blocks. Hover to reveal the day's prompt!
 * Like tiny emotional traffic lights guiding your wellness journey. 🚦💫
 */
function BlockBadge({ block, prompt }: BlockBadgeProps) {
  const colors = blockColors[block]

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-full',
        'bg-secondary/50 border border-border/50',
        'transition-colors hover:bg-secondary'
      )}
      title={prompt}
    >
      {/* 🎯 The chromatic dot - signature color of each block */}
      <span
        className={cn(
          'h-2.5 w-2.5 rounded-full',
          colors.bg,
          'ring-1 ring-white/20'
        )}
      />
      {/* 📛 The label - announcing the block's identity */}
      <span className="text-xs font-medium text-foreground/80">
        {colors.label}
      </span>
    </div>
  )
}

// 🌟 Export the mystical component for the realm to enjoy
export type { DailyPlanCardProps, BlockType }
