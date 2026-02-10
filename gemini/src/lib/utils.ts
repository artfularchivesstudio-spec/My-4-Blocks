import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 🌟 The Sacred Weaving of Tailwind Classes
 * 
 * Merging styles with grace and precision.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
