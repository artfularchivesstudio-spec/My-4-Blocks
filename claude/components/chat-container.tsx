'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import { ChatMessage } from './chat-message'
import { ChatInput, type ChatInputHandle } from './chat-input'
import { SuggestedPrompts } from './SuggestedPrompts'
import { WelcomeHeader } from './welcome-header'
import { VoiceMode, type VoiceState as VoiceModeState } from '../../shared/components'
import type { VoiceToggleState } from './voice-toggle'
import { cn } from '@/lib/utils'
import { Sparkles, ArrowDown } from 'lucide-react'

const THINKING_MESSAGES = [
  'Reflecting on your thoughts...',
  'Considering your perspective...',
  'Exploring the underlying beliefs...',
  'Finding the right words...',
]

/**
 * 🗨️ The Chat Container - Where the conversation lives
 *
 * Manages streaming messages, auto-scroll behavior, and layout so the input
 * stays visible (especially on mobile). Cozy, steady, and very un-jerky. ✨
 */
/**
 * 🎙️ Map VoiceMode states to VoiceToggle states
 *
 * The toggle button cares about: idle, connecting, connected, error
 * VoiceMode has more granular states: idle, connecting, connected, listening, speaking, error
 */
function mapVoiceState(state: VoiceModeState): VoiceToggleState {
  if (state === 'listening' || state === 'speaking') return 'connected';
  return state as VoiceToggleState;
}

export function ChatContainer() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<ChatInputHandle>(null)
  const shouldAutoScrollRef = useRef(true)
  const pulseTimeoutRef = useRef<number | null>(null)
  const previousStatusRef = useRef<string | null>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [thinkingMessage, setThinkingMessage] = useState(THINKING_MESSAGES[0])
  const [showScrollToLatest, setShowScrollToLatest] = useState(false)
  const [pulseScrollButton, setPulseScrollButton] = useState(false)

  // 🎙️ Voice mode state - the vocal manifestation of wisdom
  const [voiceModeActive, setVoiceModeActive] = useState(false)
  const [voiceState, setVoiceState] = useState<VoiceModeState>('idle')

  // 🌐 AI SDK v6 uses default configuration - /api/chat by default
  const { messages, sendMessage, status } = useChat()

  const isLoading = status === 'streaming' || status === 'submitted'
  const streamingAssistantMessageId =
    status === 'streaming'
      ? [...messages].reverse().find((m) => m.role === 'assistant')?.id
      : undefined

  useEffect(() => {
    if (messages.length > 0) {
      setHasStarted(true)
    }
  }, [messages.length])

  /**
   * ✨ Nudge the "latest" button when a new assistant message arrives
   *
   * Only pings if the user has scrolled up (i.e., button is visible).
   */
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    const wasStreaming = previousStatusRef.current === 'streaming'
    const isNowNotStreaming = status !== 'streaming'
    previousStatusRef.current = status

    if (!showScrollToLatest || !wasStreaming || !isNowNotStreaming) return
    if (!lastMessage || lastMessage.role !== 'assistant') return

    setPulseScrollButton(true)
    if (pulseTimeoutRef.current) {
      window.clearTimeout(pulseTimeoutRef.current)
    }
    pulseTimeoutRef.current = window.setTimeout(() => {
      setPulseScrollButton(false)
    }, 900)

    return () => {
      if (pulseTimeoutRef.current) {
        window.clearTimeout(pulseTimeoutRef.current)
      }
    }
  }, [messages, showScrollToLatest])

  /**
   * 🧭 The Gentle Autoscroll - keeps the latest reply in view
   *
   * We only auto-scroll if the user is already near the bottom, which avoids
   * the "yo-yo scroll" effect while streaming. Calm UX, no whiplash. 🎢❌
   *
   * Uses smooth scrolling after streaming completes, instant during active stream
   * to keep up with rapid token arrival. The best of both worlds! 🌟
   */
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer || !shouldAutoScrollRef.current) return

    // 🎯 During streaming: instant scroll keeps up with tokens
    // 🎯 After streaming: smooth scroll feels polished
    const behavior = isLoading ? 'auto' : 'smooth'

    // Using requestAnimationFrame for paint-sync, then scrolling
    requestAnimationFrame(() => {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior,
      })
    })
  }, [messages, isLoading])

  /**
   * 🎯 Focus the input when streaming completes
   *
   * After the assistant finishes responding, we gently return focus
   * to the input so the user can continue their conversation flow. ✨
   */
  useEffect(() => {
    const wasStreaming = previousStatusRef.current === 'streaming'
    const isNowReady = status === 'ready'

    if (wasStreaming && isNowReady) {
      // Small delay to let the UI settle before focusing
      setTimeout(() => chatInputRef.current?.focus(), 100)
    }
  }, [status])

  // 🎯 Track if the user is near the bottom so we don't hijack their scroll.
  const handleScroll = () => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return
    const distanceFromBottom =
      scrollContainer.scrollHeight -
      scrollContainer.scrollTop -
      scrollContainer.clientHeight
    shouldAutoScrollRef.current = distanceFromBottom < 120
    setShowScrollToLatest(distanceFromBottom > 240)
  }

  /**
   * 🧲 The "Scroll to Latest" Button - A gentle return-to-now
   *
   * Keeps the newest assistant reply within reach when the user scrolls up.
   * No drama, just a calm little elevator back to the present. 🚪⬇️
   */
  const handleScrollToLatest = () => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return
    shouldAutoScrollRef.current = true
    scrollContainer.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior: 'smooth',
    })
    setShowScrollToLatest(false)
  }

  // Cycle through thinking messages
  useEffect(() => {
    if (!isLoading) return
    const interval = setInterval(() => {
      setThinkingMessage((prev) => {
        const currentIndex = THINKING_MESSAGES.indexOf(prev)
        const nextIndex = (currentIndex + 1) % THINKING_MESSAGES.length
        return THINKING_MESSAGES[nextIndex]
      })
    }, 2500)
    return () => clearInterval(interval)
  }, [isLoading])

  const handleSendMessage = (text: string) => {
    setThinkingMessage(THINKING_MESSAGES[0])
    sendMessage({ text })
  }

  /**
   * 🎙️ Toggle Voice Mode - Switch between speaking and typing
   *
   * Like choosing between singing your feelings or writing them down.
   * Both are valid expressions of the soul! 🎭✨
   */
  const handleVoiceToggle = useCallback(() => {
    setVoiceModeActive((prev) => !prev)
  }, [])

  /**
   * 🌟 Handle Voice Session Start - The portal opens
   */
  const handleVoiceSessionStart = useCallback(() => {
    console.log('🎙️ ✨ VOICE SESSION STARTED!')
    setHasStarted(true) // Show conversation area
  }, [])

  /**
   * 🌙 Handle Voice Session End - The portal closes
   */
  const handleVoiceSessionEnd = useCallback(() => {
    console.log('🎙️ Voice session ended')
    setVoiceState('idle')
  }, [])

  /**
   * 📜 Handle Voice Transcript - Words materialize from thin air
   *
   * When the voice speaks or listens, transcripts appear
   * like whispers becoming visible in the cosmic ether. 🌬️
   */
  const handleVoiceTranscript = useCallback((text: string, role: 'user' | 'assistant') => {
    console.log(`🎙️ [${role}]: ${text}`)
    // Transcripts are displayed in the VoiceMode component
    // Could be added to messages array if desired
  }, [])

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Messages area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-4 sm:px-6 py-6 pb-28 sm:pb-32"
      >
        <div className="max-w-3xl mx-auto">
          {!hasStarted ? (
            <div className="space-y-12">
              {/* 🎭 The Grand Welcome - With Optional Blocks Preview Gallery */}
              <WelcomeHeader showBlocksPreview />
              <SuggestedPrompts
                onPromptSelect={handleSendMessage}
              />
            </div>
          ) : (
            /* 🎭 The Live Message Arena - aria-live announces new messages to screen readers!
             * Using "polite" so it doesn't interrupt, and atomic="false" so only new content is read */
            <div className="space-y-6" aria-live="polite" aria-atomic="false" role="log">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isStreaming={
                    status === 'streaming' &&
                    message.role === 'assistant' &&
                    message.id === streamingAssistantMessageId
                  }
                />
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex gap-4 animate-fade-in-up">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent border border-border">
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block rounded-2xl rounded-tl-sm bg-card border border-border px-5 py-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0ms' }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '150ms' }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-muted-foreground text-sm transition-opacity duration-300">
                          {thinkingMessage}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input area - with safe-area-bottom for notched devices */}
      <div
        className={cn(
          'sticky bottom-0 z-10 border-t border-border bg-background/90 backdrop-blur-sm',
          'px-3 sm:px-4 py-3 sm:py-4',
          'safe-area-bottom' // 📱 Protects input from iPhone home indicator
        )}
      >
        <div className="max-w-3xl mx-auto">
          {/* 🎙️ Voice Mode Interface - When the orbs awaken */}
          {voiceModeActive ? (
            <VoiceMode
              isActive={voiceModeActive}
              onActiveChange={setVoiceModeActive}
              onSessionStart={handleVoiceSessionStart}
              onSessionEnd={handleVoiceSessionEnd}
              onTranscript={handleVoiceTranscript}
              showTranscript={true}
              apiEndpoint="/api/realtime"
              className="py-4"
            />
          ) : (
            <ChatInput
              ref={chatInputRef}
              onSend={handleSendMessage}
              disabled={isLoading}
              voiceActive={voiceModeActive}
              voiceState={mapVoiceState(voiceState)}
              onVoiceToggle={handleVoiceToggle}
            />
          )}
        </div>
      </div>

      {/* Scroll-to-latest button */}
      <button
        type="button"
        onClick={handleScrollToLatest}
        className={cn(
          'fixed z-20 right-4 sm:right-6 bottom-24 sm:bottom-28',
          'h-10 w-10 rounded-full',
          'bg-card/90 border border-border shadow-lg',
          'text-foreground hover:bg-accent transition-all',
          'backdrop-blur-sm',
          showScrollToLatest
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-2 pointer-events-none'
        )}
        aria-label="Scroll to latest message"
      >
        <ArrowDown
          className={cn(
            'h-4 w-4 mx-auto',
            pulseScrollButton && 'animate-gentle-nudge'
          )}
        />
      </button>
    </div>
  )
}