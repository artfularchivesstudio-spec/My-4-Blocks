'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { ChatMessage } from './chat-message'
import { ChatInput, type ChatInputHandle } from './chat-input'
import { SuggestedPrompts } from './suggested-prompts'
import { WelcomeHeader } from './welcome-header'
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

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

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
   * the “yo-yo scroll” effect while streaming. Calm UX, no whiplash. 🎢❌
   */
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer || !shouldAutoScrollRef.current) return

    const behavior = isLoading ? 'auto' : 'smooth'
    requestAnimationFrame(() => {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior,
      })
    })
  }, [messages, isLoading])

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
                onSelect={handleSendMessage}
                disabled={isLoading}
              />
            </div>
          ) : (
            <div className="space-y-6">
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

      {/* Input area */}
      <div
        className={cn(
          'sticky bottom-0 z-10 border-t border-border bg-background/90 backdrop-blur-sm',
          'px-3 sm:px-4 py-3 sm:py-4'
        )}
      >
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
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
