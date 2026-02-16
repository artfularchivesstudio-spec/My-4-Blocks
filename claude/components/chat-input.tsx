'use client'

import React from "react"

import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Send, Loader2 } from 'lucide-react'
import { VoiceToggle, type VoiceToggleState } from './voice-toggle'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
  /** Whether voice mode is active */
  voiceActive?: boolean
  /** Current voice connection state */
  voiceState?: VoiceToggleState
  /** Callback when voice toggle is clicked */
  onVoiceToggle?: () => void
}

/**
 * 🎭 The Chat Input Handle - Exposes the mystical focus powers
 *
 * Allows parent components to summon the input's attention, like a
 * well-trained familiar answering the wizard's call. 🧙‍♂️✨
 */
export interface ChatInputHandle {
  focus: () => void
}

/**
 * ✍️ The Chat Input - A soft landing for thoughts
 *
 * Autosizes the textarea, handles Enter-to-send, and stays comfortable on
 * small screens. Now with forwardRef for external focus control!
 * Because big feelings shouldn't fight tiny UI. 📱💬
 */
export const ChatInput = forwardRef<ChatInputHandle, ChatInputProps>(
  function ChatInput(
    {
      onSend,
      disabled,
      placeholder = "Share what's on your mind...",
      voiceActive = false,
      voiceState = 'idle',
      onVoiceToggle,
    },
    ref
  ) {
    const [input, setInput] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // 🔮 Expose focus method to parent components via ref
    useImperativeHandle(ref, () => ({
      focus: () => {
        textareaRef.current?.focus()
      },
    }))

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
      }
    }, [input])

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (!input.trim() || disabled) return
      onSend(input.trim())
      setInput('')
      // 🎯 Return focus to input after sending - the user's cursor is ready for more wisdom!
      setTimeout(() => textareaRef.current?.focus(), 0)
    }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

    return (
      <form onSubmit={handleSubmit} className="relative">
        {/* 🎯 The Hidden Label - Screen readers rejoice, sighted users none the wiser! */}
        <label htmlFor="chat-input" className="sr-only">
          Type your message
        </label>
        <div
          className={cn(
            'relative flex items-end gap-2 rounded-2xl',
            'bg-card border border-border',
            'shadow-lg shadow-foreground/5',
            'transition-all duration-300',
            'focus-within:border-primary/40 focus-within:shadow-xl focus-within:shadow-primary/10'
          )}
        >
          <textarea
            id="chat-input"
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              'flex-1 resize-none bg-transparent px-4 sm:px-5 py-3 sm:py-4',
              'text-sm sm:text-base text-foreground placeholder:text-muted-foreground',
              'focus:outline-none',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'min-h-[52px] sm:min-h-[56px] max-h-[200px]'
            )}
          />
          {/* 🎙️ Voice Toggle - The Mystical Mode Switch */}
          {onVoiceToggle && (
            <VoiceToggle
              state={voiceState}
              isActive={voiceActive}
              onToggle={onVoiceToggle}
              disabled={disabled}
              className="mr-1 mb-2"
            />
          )}
          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className={cn(
              'flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl mr-2 mb-2',
              'bg-primary text-primary-foreground',
              'transition-all duration-300',
              'hover:bg-primary/90 hover:scale-105',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
            )}
            aria-label="Send message"
          >
            {disabled ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-center text-[11px] sm:text-xs text-muted-foreground mt-2 sm:mt-3">
          Press Enter to send, Shift + Enter for new line
        </p>
      </form>
    )
  }
)