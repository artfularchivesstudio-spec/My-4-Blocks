'use client'

/**
 * 🎭 The Ambient Background - A Dreamy Canvas of Floating Orbs and Gentle Waves
 *
 * "In the twilight between pixels and poetry, we paint the void with whispers
 * of gradient orbs and spectral ships that drift through digital seas.
 * May your viewport never overflow, and may animations respect the weary."
 *
 * - The Spellbinding Museum Director of Atmospheric Effects
 */

import { cn } from '@/lib/utils'
import { FlickeringGrid } from '@/components/ui/flickering-grid'

// 🌟 The Mystical Media Query Hook - Respects those who prefer stillness
// (Because not everyone wants their screen to dance, and that's valid)
const motionSafeClasses = 'motion-safe:animate-float'

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/*
        ✨ Subtle flickering grid (Magic UI inspired)
        🎨 Now with responsive spotlight mask - smaller on mobile, grander on desktop
        📱 Mobile: 350px circle | 💻 Tablet: 500px | 🖥️ Desktop: 700px
        🌙 Uses CSS custom property approach via multiple gradient classes
      */}
      <FlickeringGrid
        className={cn(
          'absolute inset-0 z-0 opacity-[0.06]',
          // 🔮 Responsive spotlight mask - progressively larger as viewport grows
          // Mobile-first: start with smaller mask, expand on larger screens
          '[mask-image:radial-gradient(350px_circle_at_50%_35%,black,transparent)]',
          'sm:[mask-image:radial-gradient(500px_circle_at_50%_35%,black,transparent)]',
          'md:[mask-image:radial-gradient(700px_circle_at_50%_35%,black,transparent)]'
        )}
        squareSize={3}
        gridGap={7}
        // Lower flicker chance for "calm", not "casino" 🎰 → 🧘
        flickerChance={0.05}
        maxOpacity={0.22}
        color="oklch(0.35 0.08 160)"
      />

      {/* 🌫️ Soft vignette to keep content readable - the gentle guardian of legibility */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(80%_60%_at_50%_30%,transparent,oklch(0.98_0.005_90/0.55))] dark:bg-[radial-gradient(80%_60%_at_50%_30%,transparent,oklch(0.15_0.02_150/0.65))]" />

      {/*
        🔵 Subtle Gradient Orbs - The Floating Spirits of Ambiance
        📱 Responsive sizing: mobile-friendly -> tablet -> desktop
        🌙 motion-safe: respects prefers-reduced-motion for accessibility

        Size progression:
        - Mobile (default): Compact orbs that won't escape their viewport prison
        - sm (640px+): Medium orbs for tablets
        - md (768px+): Full majestic orbs as originally intended
      */}

      {/* 🟢 Primary orb - top-right floating dream bubble */}
      <div
        className={cn(
          'absolute -top-20 -right-20 sm:-top-32 sm:-right-32 md:-top-40 md:-right-40',
          'w-48 h-48 sm:w-80 sm:h-80 md:w-96 md:h-96',
          'rounded-full z-0',
          'bg-primary/5 blur-3xl',
          motionSafeClasses
        )}
        style={{ animationDuration: '8s' }}
      />

      {/* 🟡 Anxiety orb - left-side golden glow (because anxiety deserves representation too) */}
      <div
        className={cn(
          'absolute top-1/3 -left-20 sm:-left-32 md:-left-40',
          'w-40 h-40 sm:w-64 sm:h-64 md:w-80 md:h-80',
          'rounded-full z-0',
          'bg-anxiety/5 blur-3xl',
          motionSafeClasses
        )}
        style={{ animationDuration: '12s', animationDelay: '-4s' }}
      />

      {/* 🔵 Depression orb - bottom-right contemplative presence */}
      <div
        className={cn(
          'absolute -bottom-10 right-1/4 sm:-bottom-16 md:-bottom-20',
          'w-32 h-32 sm:w-56 sm:h-56 md:w-72 md:h-72',
          'rounded-full z-0',
          'bg-depression/5 blur-3xl',
          motionSafeClasses
        )}
        style={{ animationDuration: '10s', animationDelay: '-2s' }}
      />

      {/*
        ⛵ A faint drifting "ship" silhouette (inspired by `with-loving-memory-for-cindy`)
        📱 Hidden on mobile (< 640px) - too large for tiny viewports
        🖥️ Visible from sm breakpoint onwards
        🌙 Respects prefers-reduced-motion for accessibility
      */}
      <div
        className={cn(
          'absolute -bottom-10 left-1/2 -translate-x-1/2 z-0',
          'opacity-[0.06] dark:opacity-[0.08]',
          // 📱 Hide on mobile to prevent overflow, reveal on larger screens
          'hidden sm:block',
          motionSafeClasses
        )}
        style={{ animationDuration: '14s', animationDelay: '-3s' }}
      >
        <ShipSilhouette />
      </div>
    </div>
  )
}

/**
 * ⛵ The "Tiny Ship That Could" — A soft SVG silhouette for ambience
 *
 * "Across the digital seas it sails, carrying dreams and viewport tales.
 * With responsive sizing it now roams, safe on tablets, hidden on phones."
 *
 * 🎨 Features:
 * - Uses max-w-full to prevent overflow on any container
 * - Aspect ratio preserved via viewBox
 * - Semantic aria-hidden for screen readers (it's decorative, folks!)
 */
function ShipSilhouette() {
  return (
    <svg
      className="max-w-full h-auto"
      width="420"
      height="220"
      viewBox="0 0 420 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g opacity="1">
        {/* 🌊 Waves - the eternal rhythm of the digital ocean */}
        <path
          d="M20 170 C60 150, 100 190, 140 170 C180 150, 220 190, 260 170 C300 150, 340 190, 380 170"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.35"
        />
        <path
          d="M40 190 C80 170, 120 210, 160 190 C200 170, 240 210, 280 190 C320 170, 360 210, 400 190"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.22"
        />

        {/* 🚢 Hull - the sturdy base of our spectral vessel */}
        <path
          d="M120 150 H290 C275 170 250 185 210 190 C170 185 140 170 120 150 Z"
          fill="currentColor"
          opacity="0.45"
        />

        {/* 📍 Mast - standing tall through digital storms */}
        <path
          d="M210 70 V150"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.55"
        />

        {/* ⛵ Sails - catching the winds of user interaction */}
        <path
          d="M210 78 C250 92 280 120 290 150 H210 V78 Z"
          fill="currentColor"
          opacity="0.28"
        />
        <path
          d="M210 78 C175 95 150 120 140 150 H210 V78 Z"
          fill="currentColor"
          opacity="0.18"
        />
      </g>
    </svg>
  )
}
