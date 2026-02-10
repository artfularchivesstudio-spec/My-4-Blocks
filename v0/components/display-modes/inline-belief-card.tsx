'use client'

/**
 * 🎭 The Inline Belief Card - A Compact Crystal of Cognitive Insight
 *
 * "In the mystical theater of the mind, irrational beliefs lurk in shadows.
 * This compact card shines a gentle spotlight upon them, revealing their
 * true nature so the seeker may choose to dispute and dissolve them."
 *
 * A sleek, inline card component for displaying an identified belief and
 * its associated emotional block. Designed to fit gracefully within chat
 * messages, yet powerful enough to initiate the disputation ritual.
 *
 * - The Spellbinding Museum Director of Cognitive Clarity 🧙‍♂️
 */

import * as React from 'react'
import { Flame, CloudLightning, Moon, Scale, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// ✨ Type definitions for the cosmic props
export interface InlineBeliefCardProps {
  /** 📜 The irrational belief statement to be displayed and potentially disputed */
  belief: string
  /** 🎨 The emotional block this belief creates (anger=red, anxiety=amber, depression=blue, guilt=purple) */
  block: 'anger' | 'anxiety' | 'depression' | 'guilt'
  /** 🏷️ The type of irrational belief, e.g., "Awfulizing", "Shoulds & Musts" */
  beliefType?: string
  /** 🔮 Callback when the seeker wishes to dispute this belief and transform it */
  onDispute?: () => void
  /** 🌙 Optional additional className for the card container */
  className?: string
}

// 🌟 The mystical color mappings for each emotional block
// These align with our CSS variables: anger=red, anxiety=amber, depression=blue, guilt=purple
const blockConfig = {
  anger: {
    bgClass: 'bg-anger/10',
    borderClass: 'border-anger/30',
    badgeBgClass: 'bg-anger',
    textClass: 'text-anger',
    icon: Flame,
    label: 'Anger',
  },
  anxiety: {
    bgClass: 'bg-anxiety/10',
    borderClass: 'border-anxiety/30',
    badgeBgClass: 'bg-anxiety',
    textClass: 'text-anxiety',
    icon: CloudLightning,
    label: 'Anxiety',
  },
  depression: {
    bgClass: 'bg-depression/10',
    borderClass: 'border-depression/30',
    badgeBgClass: 'bg-depression',
    textClass: 'text-depression',
    icon: Moon,
    label: 'Depression',
  },
  guilt: {
    bgClass: 'bg-guilt/10',
    borderClass: 'border-guilt/30',
    badgeBgClass: 'bg-guilt',
    textClass: 'text-guilt',
    icon: Scale,
    label: 'Guilt',
  },
} as const

/**
 * 🔮 The Inline Belief Card Component
 *
 * A compact, visually-distinct card for displaying an identified irrational belief
 * alongside its emotional block. Perfect for embedding within chat messages where
 * the AI has identified a belief pattern worth examining.
 *
 * Features:
 * - Color-coded block badge (Anger=red, Anxiety=amber, Depression=blue, Guilt=purple)
 * - Quotable belief display with subtle emphasis
 * - Optional belief type label (e.g., "Awfulizing", "Low Frustration Tolerance")
 * - "Dispute This Belief" button for initiating the transformation ritual
 *
 * It's like a tiny emotional X-ray, but prettier and with better typography. 🩺✨
 */
export function InlineBeliefCard({
  belief,
  block,
  beliefType,
  onDispute,
  className,
}: InlineBeliefCardProps) {
  // 🎭 Summon the configuration for this emotional block
  const config = blockConfig[block]
  const BlockIcon = config.icon

  return (
    <div
      className={cn(
        // 🌟 Base card styling - compact yet elegant
        'rounded-xl border shadow-sm overflow-hidden',
        // 🎨 Block-specific coloring for that magical aura
        config.bgClass,
        config.borderClass,
        className,
      )}
    >
      {/* 📦 Content container with comfortable padding */}
      <div className="p-4 space-y-3">
        {/* 🏷️ Header: Block badge + optional belief type */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* 🎨 The Block Badge - a colored gem of emotional categorization */}
          <div
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium',
              config.badgeBgClass,
              'text-white',
            )}
          >
            <BlockIcon className="h-3.5 w-3.5" />
            <span>{config.label}</span>
          </div>

          {/* 📜 Optional belief type label - the cognitive distortion's true name */}
          {beliefType && (
            <span className="text-xs text-muted-foreground font-medium bg-muted/50 px-2 py-1 rounded-md">
              {beliefType}
            </span>
          )}
        </div>

        {/* 💬 The Belief Statement - displayed in a quotable, thoughtful format */}
        <blockquote className="pl-3 border-l-2 border-muted-foreground/30">
          <p className="text-sm text-foreground leading-relaxed italic">
            &ldquo;{belief}&rdquo;
          </p>
        </blockquote>

        {/* 🔮 Dispute Button - the portal to transformation */}
        {onDispute && (
          <div className="pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onDispute}
              className={cn(
                'w-full gap-2 text-xs font-medium',
                'hover:bg-primary/10 hover:text-primary hover:border-primary/30',
                'transition-colors duration-200',
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Dispute This Belief
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
