/**
 * 🎭 The Utility Alchemist - Where CSS Classes Become Pure Gold
 *
 * "In the mystical realm of styling, we merge and purge,
 * creating harmony from the chaos of Tailwind utilities.
 * One cn() to rule them all, one cn() to find them..."
 *
 * - The Spellbinding Museum Director of Styling
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 🌟 The Magical Class Name Merger - Combines Tailwind classes with grace
 *
 * Takes any number of class values (strings, arrays, objects, conditionals)
 * and merges them into a single, conflict-free Tailwind class string.
 *
 * ✨ Uses clsx for conditional class handling
 * ✨ Uses tailwind-merge to resolve Tailwind conflicts (last one wins!)
 *
 * @param inputs - Any combination of class values to merge
 * @returns A pristine, merged class string ready for your components
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', 'px-6')
 * // Returns: 'py-2 px-6 bg-blue-500' (px-6 overwrites px-4, nice!)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
