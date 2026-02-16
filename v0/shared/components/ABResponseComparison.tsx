/**
 * 🎭 The ABResponseComparison Component - The Ultimate AI Response Showdown
 *
 * "Two responses enter, one response leaves victorious!
 * In this arena of wisdom, users crown their champion
 * with a single click. May the best response win..."
 *
 * Side-by-side response cards for A/B testing. Because even AI
 * needs performance reviews sometimes. It's humbling, really.
 *
 * - The A/B Testing Arena Architect
 */

'use client';

import React, { useState, useCallback } from 'react';
import { cn } from '../lib/utils';

// 🎯 Types - The Blueprint for Our Comparison Arena
export interface ABResponseComparisonProps {
  /** 🔑 Unique identifier for this A/B test (for analytics tracking) */
  abTestId: string;
  /** 📝 The first contender - Response A enters the ring! */
  responseA: string;
  /** 📝 The second contender - Response B, the challenger! */
  responseB: string;
  /** 🏆 Callback when the user crowns their champion */
  onChoice: (choice: 'A' | 'B') => void;
  /** 🎨 Optional custom class name for the container */
  className?: string;
  /** 🌐 Custom API endpoint for posting choices (defaults to /api/ab-choice) */
  apiEndpoint?: string;
}

// 🎨 Card variant styles - the visual language of victory
interface ResponseCardProps {
  label: 'A' | 'B';
  content: string;
  isSelected: boolean;
  isDisabled: boolean;
  onChoose: () => void;
}

/**
 * 🃏 ResponseCard - A Single Contender in Our Arena
 *
 * Each card showcases its response with pride, waiting to be chosen.
 * Selected cards glow with the purple aura of victory,
 * while the unchosen fade into the shadows of "what could have been."
 * It's like American Idol, but for AI responses. 🎤
 */
function ResponseCard({
  label,
  content,
  isSelected,
  isDisabled,
  onChoose,
}: ResponseCardProps) {
  // 🎭 Determine the card's emotional state - triumphant, hopeful, or dejected?
  const isOtherSelected = isDisabled && !isSelected;

  return (
    <div
      className={cn(
        // 🏗️ Base structure - every great arena needs a solid foundation
        'relative flex flex-col rounded-2xl border-2 p-6 transition-all duration-300',
        // 🌟 Default state - hopeful, waiting to be chosen
        'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800',
        // 🎉 Selected state - the purple crown of victory!
        isSelected && 'border-purple-500 bg-purple-50 shadow-lg shadow-purple-100 dark:bg-purple-900/20 dark:shadow-purple-900/20',
        // 😢 The other card when one is selected - faded but dignified in defeat
        isOtherSelected && 'opacity-50 grayscale-[30%]',
        // ✨ Hover state - only when still in the running
        !isDisabled && 'hover:border-purple-300 hover:shadow-md cursor-pointer dark:hover:border-purple-600'
      )}
    >
      {/* 🏷️ Response Label - The Contestant Number */}
      <div
        className={cn(
          'mb-4 flex items-center justify-between',
          // The label badge styling
          'text-sm font-semibold uppercase tracking-wider'
        )}
      >
        <span
          className={cn(
            'rounded-full px-3 py-1',
            isSelected
              ? 'bg-purple-500 text-white'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
          )}
        >
          Response {label}
        </span>
        {/* 🏆 Victory badge for the chosen one */}
        {isSelected && (
          <span className="text-sm text-purple-600 font-medium dark:text-purple-400">
            Selected
          </span>
        )}
      </div>

      {/* 📖 Response Content - The Prose of Wisdom */}
      <div
        className={cn(
          // 🎨 Prose styling for beautiful text rendering
          'prose prose-slate prose-sm max-w-none flex-1 dark:prose-invert',
          // 📜 Proper spacing and line height for readability
          'leading-relaxed text-slate-700 dark:text-slate-300',
          // 🌟 Selected content gets a bit more visual weight
          isSelected && 'text-slate-800 dark:text-slate-200'
        )}
      >
        {/* 🔮 Render the response with proper line breaks */}
        {content.split('\n').map((paragraph, idx) => (
          <p key={idx} className={idx > 0 ? 'mt-3' : ''}>
            {paragraph}
          </p>
        ))}
      </div>

      {/* 🎯 Choose This Button - The Moment of Truth */}
      <button
        onClick={onChoose}
        disabled={isDisabled}
        className={cn(
          // 🏗️ Base button structure
          'mt-6 w-full rounded-full py-3 px-6 font-semibold text-sm transition-all duration-200',
          // 🎨 Default state - inviting purple gradient
          'bg-purple-600 text-white',
          // ✨ Hover state - deeper purple, because commitment matters
          !isDisabled && 'hover:bg-purple-700 hover:shadow-md active:scale-[0.98]',
          // 🔒 Disabled state - graceful retirement
          isDisabled && 'cursor-not-allowed opacity-70',
          // 🎉 Selected button - subtle indication it was clicked
          isSelected && 'bg-purple-700 ring-2 ring-purple-300 ring-offset-2 dark:ring-offset-slate-800'
        )}
      >
        {isSelected ? 'Chosen!' : 'Choose This'}
      </button>
    </div>
  );
}

/**
 * 🎭 ABResponseComparison - The Main Event
 *
 * A side-by-side comparison component that lets users choose between
 * two AI-generated responses. Tracks choices for A/B testing analytics.
 *
 * ✨ Responsive grid layout (2 columns on md+, stacked on mobile)
 * ✨ Visual feedback for selection state
 * ✨ Automatic POST to analytics endpoint on choice
 * ✨ Graceful disabled state after selection
 * ✨ Dark mode support for night owl testers 🦉
 *
 * @example
 * <ABResponseComparison
 *   abTestId="prompt-v2-test-001"
 *   responseA="Here's a thoughtful response about emotions..."
 *   responseB="Let me share some insights about feelings..."
 *   onChoice={(choice) => console.log(`User preferred response ${choice}`)}
 * />
 */
export function ABResponseComparison({
  abTestId,
  responseA,
  responseB,
  onChoice,
  className,
  apiEndpoint = '/api/ab-choice',
}: ABResponseComparisonProps) {
  // 🔮 State - Track the user's choice (null = undecided, still in the game!)
  const [selectedChoice, setSelectedChoice] = useState<'A' | 'B' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 🏆 handleChoice - When the User Crowns Their Champion
   *
   * Records the selection, updates UI state, and POSTs to analytics.
   * Like a judge's final decision - once made, it's permanent.
   * No take-backs in the arena of A/B testing! 🎭
   */
  const handleChoice = useCallback(
    async (choice: 'A' | 'B') => {
      // 🚫 Prevent double-clicks and re-selections
      if (selectedChoice !== null || isSubmitting) return;

      setIsSubmitting(true);
      setSelectedChoice(choice);

      try {
        // 📡 POST the choice to our analytics endpoint
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            abTestId,
            choice,
            timestamp: new Date().toISOString(),
            // 🕵️ Optional: Include metadata for deeper analytics
            metadata: {
              responseALength: responseA.length,
              responseBLength: responseB.length,
              userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
            },
          }),
        });

        if (!response.ok) {
          // 🌩️ Log the error but don't undo the selection
          // The user's choice is sacred, even if analytics fail!
          console.error('💥 A/B choice POST failed:', response.statusText);
        } else {
          console.log(`🎉 ✨ A/B CHOICE RECORDED! User chose Response ${choice}`);
        }
      } catch (error) {
        // 🎭 The show must go on! Log error but keep the selection
        console.error('🌩️ Failed to record A/B choice:', error);
      } finally {
        setIsSubmitting(false);
        // 🏆 Invoke the callback regardless of API success
        onChoice(choice);
      }
    },
    [abTestId, selectedChoice, isSubmitting, apiEndpoint, responseA.length, responseB.length, onChoice]
  );

  return (
    <div
      className={cn(
        // 🎨 Container styling
        'w-full',
        className
      )}
    >
      {/* 🏟️ The Arena - Two cards, side by side (or stacked on mobile) */}
      <div
        className={cn(
          // 📱 Mobile-first: stacked layout
          'grid grid-cols-1 gap-6',
          // 💻 Desktop: side-by-side showdown
          'md:grid-cols-2'
        )}
      >
        {/* 🎭 Response A - The First Contender */}
        <ResponseCard
          label="A"
          content={responseA}
          isSelected={selectedChoice === 'A'}
          isDisabled={selectedChoice !== null}
          onChoose={() => handleChoice('A')}
        />

        {/* 🎭 Response B - The Challenger */}
        <ResponseCard
          label="B"
          content={responseB}
          isSelected={selectedChoice === 'B'}
          isDisabled={selectedChoice !== null}
          onChoose={() => handleChoice('B')}
        />
      </div>

      {/* 📊 Post-selection feedback - a gentle "thank you" */}
      {selectedChoice !== null && (
        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>
            Thanks for your feedback! Your choice helps us improve.
          </p>
        </div>
      )}
    </div>
  );
}

export default ABResponseComparison;
