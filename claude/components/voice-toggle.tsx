/**
 * 🎙️ Voice Toggle Component - Switch between text and voice modes ✨
 *
 * "A gentle switch between speaking and typing,
 * honoring both forms of human expression."
 *
 * - The Voice Mode Gatekeeper
 */

'use client';

import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type VoiceToggleState = 'idle' | 'connecting' | 'connected' | 'error';

interface VoiceToggleProps {
  /** Current voice state */
  state?: VoiceToggleState;
  /** Whether voice mode is active */
  isActive: boolean;
  /** Callback when toggle is clicked */
  onToggle: () => void;
  /** Whether the toggle is disabled */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 🎤 VoiceToggle - Animated microphone button for voice mode
 *
 * Provides a visual toggle between text and voice input modes
 * with animated states for connecting, active, and error.
 */
export function VoiceToggle({
  state = 'idle',
  isActive,
  onToggle,
  disabled = false,
  className,
  size = 'md',
}: VoiceToggleProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9 sm:h-10 sm:w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const isConnecting = state === 'connecting';
  const hasError = state === 'error';

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled || isConnecting}
      className={cn(
        'flex items-center justify-center rounded-xl',
        'transition-all duration-300',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        isActive
          ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30'
          : hasError
          ? 'bg-destructive text-destructive-foreground'
          : 'bg-muted text-muted-foreground hover:bg-muted/80',
        isConnecting && 'animate-pulse',
        className
      )}
      aria-label={isActive ? 'Switch to text mode' : 'Switch to voice mode'}
      title={isActive ? 'Switch to text mode' : 'Switch to voice mode'}
    >
      {isConnecting ? (
        <Loader2 className={cn(iconSizes[size], 'animate-spin')} />
      ) : isActive ? (
        <MicOff className={iconSizes[size]} />
      ) : (
        <Mic className={iconSizes[size]} />
      )}
    </button>
  );
}

export default VoiceToggle;