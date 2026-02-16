'use client'

/**
 * 🎭 The Blocks Preview - A Mystical Portal to Emotional Understanding
 *
 * "Four gentle guardians stand in silent witness,
 * each holding a key to the fortress of feeling.
 * Hover upon them, and their secrets unfold like morning flowers."
 *
 * - The Spellbinding Museum Director of Emotional Alchemy ✨
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * 🌟 The Four Emotional Blocks - Sacred Configuration
 *
 * Each block carries the weight of a thousand unspoken truths,
 * waiting to transform into crystallized wisdom. No pressure. 💎
 */
const EMOTIONAL_BLOCKS = [
  {
    id: 'anger',
    emoji: '🔥',
    name: 'Anger',
    color: 'anger',
    description: 'Created when we demand others or situations be different than they are.',
    bgClass: 'bg-anger',
    hoverBg: 'hover:bg-anger/90',
    textClass: 'text-anger',
    borderClass: 'border-anger/30',
  },
  {
    id: 'anxiety',
    emoji: '⚡',
    name: 'Anxiety',
    color: 'anxiety',
    description: 'Created when we catastrophize and tell ourselves we "can\'t stand" potential outcomes.',
    bgClass: 'bg-anxiety',
    hoverBg: 'hover:bg-anxiety/90',
    textClass: 'text-anxiety',
    borderClass: 'border-anxiety/30',
  },
  {
    id: 'depression',
    emoji: '🌧️',
    name: 'Depression',
    color: 'depression',
    description: 'Created when we rate ourselves as worthless or inadequate.',
    bgClass: 'bg-depression',
    hoverBg: 'hover:bg-depression/90',
    textClass: 'text-depression',
    borderClass: 'border-depression/30',
  },
  {
    id: 'guilt',
    emoji: '⚖️',
    name: 'Guilt',
    color: 'guilt',
    description: 'Created when we "should" ourselves for past actions and rate ourselves negatively.',
    bgClass: 'bg-guilt',
    hoverBg: 'hover:bg-guilt/90',
    textClass: 'text-guilt',
    borderClass: 'border-guilt/30',
  },
] as const

/**
 * 🔮 The Block Card - A Single Emotional Guardian
 *
 * Each card is a doorway to understanding. Approach with curiosity,
 * leave with wisdom (and maybe a little existential lightness). 🦋
 */
interface BlockCardProps {
  block: (typeof EMOTIONAL_BLOCKS)[number]
  isHovered: boolean
  onHover: (id: string | null) => void
}

function BlockCard({ block, isHovered, onHover }: BlockCardProps) {
  return (
    <div
      className="relative group"
      onMouseEnter={() => onHover(block.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* 🌟 The Mystical Block Itself */}
      <div
        className={cn(
          'relative flex flex-col items-center justify-center',
          'w-16 h-16 sm:w-20 sm:h-20 rounded-xl',
          'transition-all duration-300 ease-out',
          'cursor-pointer',
          block.bgClass,
          isHovered && 'scale-110 shadow-lg',
          !isHovered && 'opacity-80 hover:opacity-100'
        )}
      >
        {/* ✨ The Emoji Soul of the Block */}
        <span
          className={cn(
            'text-2xl sm:text-3xl transition-transform duration-300',
            isHovered && 'scale-110'
          )}
          role="img"
          aria-label={block.name}
        >
          {block.emoji}
        </span>

        {/* 📛 The Name Below - Only on Larger Screens */}
        <span
          className={cn(
            'hidden sm:block text-xs font-medium mt-1',
            'text-white/90 transition-opacity duration-300'
          )}
        >
          {block.name}
        </span>
      </div>

      {/* 🎪 The Hovering Description Tooltip - The Secret Whispers */}
      <div
        className={cn(
          'absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full',
          'w-48 sm:w-56 p-3 rounded-lg',
          'bg-card/95 backdrop-blur-sm border shadow-xl',
          'transition-all duration-300 ease-out z-20',
          block.borderClass,
          isHovered
            ? 'opacity-100 visible translate-y-full'
            : 'opacity-0 invisible translate-y-[calc(100%-8px)]'
        )}
      >
        {/* 🏷️ Block Title in Tooltip */}
        <div className={cn('font-semibold text-sm mb-1', block.textClass)}>
          {block.emoji} {block.name}
        </div>
        {/* 📜 The Wisdom Inscription */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {block.description}
        </p>
        {/* 🔺 The Little Arrow Pointing Up */}
        <div
          className={cn(
            'absolute -top-1.5 left-1/2 -translate-x-1/2',
            'w-3 h-3 rotate-45',
            'bg-card border-l border-t',
            block.borderClass
          )}
        />
      </div>
    </div>
  )
}

/**
 * 🎭 The Blocks Preview Component - Main Export
 *
 * This component introduces seekers to the four emotional blocks
 * with grace, hover interactions, and just the right amount of
 * mystical flair. Think of it as a museum exhibit for your psyche. 🏛️
 */
export function BlocksPreview() {
  // 🌟 Track which block is currently being pondered upon
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null)

  return (
    <div
      className={cn(
        'animate-fade-in-up opacity-0 stagger-1',
        'text-center space-y-6 pb-6'
      )}
      style={{ animationFillMode: 'forwards' }}
    >
      {/* 🎯 The Transformative Tagline */}
      <div className="space-y-2">
        <p className="text-sm sm:text-base text-muted-foreground font-medium tracking-wide">
          Transform
        </p>
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <span className="text-anger font-semibold">Anger</span>
          <span className="text-muted-foreground/60">•</span>
          <span className="text-anxiety font-semibold">Anxiety</span>
          <span className="text-muted-foreground/60">•</span>
          <span className="text-depression font-semibold">Depression</span>
          <span className="text-muted-foreground/60">•</span>
          <span className="text-guilt font-semibold">Guilt</span>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground font-medium tracking-wide">
          into peace
        </p>
      </div>

      {/* 🎪 The Four Blocks Gallery */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 pt-2 pb-8">
        {EMOTIONAL_BLOCKS.map((block) => (
          <BlockCard
            key={block.id}
            block={block}
            isHovered={hoveredBlock === block.id}
            onHover={setHoveredBlock}
          />
        ))}
      </div>

      {/* 💫 Subtle Hint for Interaction */}
      <p
        className={cn(
          'text-xs text-muted-foreground/60 italic',
          'transition-opacity duration-500',
          hoveredBlock ? 'opacity-0' : 'opacity-100'
        )}
      >
        Hover over each block to learn more
      </p>
    </div>
  )
}
