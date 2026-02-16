'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import { ChatMessage } from './chat-message'
import { ChatInput, type ChatInputHandle } from './chat-input'
import { SuggestedPrompts } from './suggested-prompts'
import { WelcomeHeader } from './welcome-header'
import { ABResponseComparison } from '@shared/components'
// 🌙 Voice Mode temporarily disabled for A/B testing focus
// import { VoiceMode, type VoiceState as VoiceModeState } from '../../shared/components'
// import type { VoiceToggleState } from './voice-toggle'
import { cn } from '@/lib/utils'
import { Sparkles, ArrowDown, FlaskConical } from 'lucide-react'

// 🧪 A/B Response State - The dual-response showdown tracker
// Like a boxing match scorecard, but for AI wisdom! 🥊
interface ABResponseState {
  /** 🔑 Unique identifier for this A/B test */
  testId: string
  /** 📝 Response A - The structured contender */
  responseA: string
  /** 📝 Response B - The conversational challenger */
  responseB: string
  /** ❓ The original query that sparked this showdown */
  query: string
}

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
// 🌙 Voice Mode temporarily disabled for A/B testing focus
// /**
//  * 🎙️ Map VoiceMode states to VoiceToggle states
//  *
//  * The toggle button cares about: idle, connecting, connected, error
//  * VoiceMode has more granular states: idle, connecting, connected, listening, speaking, error
//  */
// function mapVoiceState(state: VoiceModeState): VoiceToggleState {
//   if (state === 'listening' || state === 'speaking') return 'connected';
//   return state as VoiceToggleState;
// }

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

  // 🌙 Voice Mode temporarily disabled for A/B testing focus
  // const [voiceModeActive, setVoiceModeActive] = useState(false)
  // const [voiceState, setVoiceState] = useState<VoiceModeState>('idle')
  const voiceModeActive = false // Placeholder for disabled voice mode

  // 🧪 A/B Testing Mode - The Great Response Showdown Arena! 🎭
  // When enabled, we generate TWO responses and let the user crown their champion.
  // It's like The Voice, but for AI responses. May the best wisdom win!
  const [abModeEnabled, setAbModeEnabled] = useState(false)
  const [abResponse, setAbResponse] = useState<ABResponseState | null>(null)
  const [abLoading, setAbLoading] = useState(false)

  // 🌐 AI SDK v6 uses default configuration - /api/chat by default
  const { messages, sendMessage, status } = useChat()

  const isLoading = status === 'streaming' || status === 'submitted' || abLoading
  const streamingAssistantMessageId =
    status === 'streaming'
      ? [...messages].reverse().find((m) => m.role === 'assistant')?.id
      : undefined

  // 🎯 Track if we've "started" - messages OR an active A/B test triggers this
  useEffect(() => {
    if (messages.length > 0 || abResponse !== null) {
      setHasStarted(true)
    }
  }, [messages.length, abResponse])

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

  /**
   * 🚀 handleSendMessage - The Message Dispatcher of Destiny
   *
   * When A/B mode is ON, we summon TWO responses from the dual portal.
   * When OFF, we proceed with the regular single-response flow.
   * It's like choosing between a solo act or a duet performance! 🎭
   *
   * @param text - The seeker's query, ready to spark wisdom
   */
  const handleSendMessage = useCallback(async (text: string) => {
    setThinkingMessage(THINKING_MESSAGES[0])

    if (abModeEnabled) {
      // 🧪 A/B Mode: Summon dual responses from the showdown arena!
      setAbLoading(true)
      setAbResponse(null) // 🧹 Clear any previous A/B result

      try {
        console.log('🧪 ✨ A/B MODE ENGAGED! Summoning dual responses...')

        const response = await fetch('/api/chat/ab', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: text }],
          }),
        })

        if (!response.ok) {
          throw new Error(`A/B portal returned ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        console.log('🎭 ✨ DUAL RESPONSES RECEIVED!', data.abTestId)

        // 🏟️ Set up the showdown arena with both contenders
        setAbResponse({
          testId: data.abTestId,
          responseA: data.responses.A,
          responseB: data.responses.B,
          query: text,
        })
      } catch (creativeChallenge) {
        // 🌩️ Temporary setback - fall back to regular chat
        console.error('🌩️ A/B portal hiccup:', creativeChallenge)
        // 🎭 The show must go on - use regular chat as fallback
        sendMessage({ text })
      } finally {
        setAbLoading(false)
      }
    } else {
      // 🌟 Regular mode: Single response from the wise oracle
      sendMessage({ text })
    }
  }, [abModeEnabled, sendMessage])

  /**
   * 🏆 handleABChoice - When the User Crowns Their Champion
   *
   * The user has spoken! Their preferred response is crowned victor.
   * We clear the A/B arena and add the winner to the conversation.
   * Democracy in action, one A/B test at a time! 🗳️
   *
   * Note: The ABResponseComparison component handles POSTing to /api/ab-choice
   * internally, so we just need to handle the UI state transition here.
   *
   * @param choice - 'A' or 'B' - the people have voted!
   */
  const handleABChoice = useCallback((choice: 'A' | 'B') => {
    if (!abResponse) return

    console.log(`🏆 ✨ THE PEOPLE HAVE SPOKEN! Response ${choice} is the champion!`)

    // 🎭 Get the winning response for logging/future use
    const winningResponse = choice === 'A' ? abResponse.responseA : abResponse.responseB

    // 🌟 Send the original query to the regular chat to preserve conversation flow
    sendMessage({
      text: abResponse.query,
    })

    // ✨ Brief delay to let the user message render, then clear AB state
    setTimeout(() => {
      setAbResponse(null)
    }, 100)

    // 💡 Note: The winning response won't appear in chat history since we can't
    // inject assistant messages directly. In production, you might want to:
    // 1. Store the winning response server-side and return it in the next request
    // 2. Use a custom messages state instead of useChat
    // 3. Display a summary card of the winning response
    console.log(`📜 Winning response (${choice}): ${winningResponse.substring(0, 100)}...`)
  }, [abResponse, sendMessage])

  /**
   * 🔄 toggleABMode - Flip the Experimental Switch!
   *
   * Like turning on the lights in a science lab.
   * When enabled, every query becomes an experiment! 🔬
   * When disabled, we return to our regularly scheduled programming.
   */
  const toggleABMode = useCallback(() => {
    setAbModeEnabled((prev) => {
      const newState = !prev
      console.log(`🧪 A/B Mode ${newState ? 'ACTIVATED' : 'DEACTIVATED'}`)
      return newState
    })
    // 🧹 Clear any existing A/B response when toggling
    setAbResponse(null)
  }, [])

  // 🌙 Voice Mode temporarily disabled for A/B testing focus
  // /**
  //  * 🎙️ Toggle Voice Mode - Switch between speaking and typing
  //  *
  //  * Like choosing between singing your feelings or writing them down.
  //  * Both are valid expressions of the soul! 🎭✨
  //  */
  // const handleVoiceToggle = useCallback(() => {
  //   setVoiceModeActive((prev) => !prev)
  // }, [])
  //
  // /**
  //  * 🌟 Handle Voice Session Start - The portal opens
  //  */
  // const handleVoiceSessionStart = useCallback(() => {
  //   console.log('🎙️ ✨ VOICE SESSION STARTED!')
  //   setHasStarted(true) // Show conversation area
  // }, [])
  //
  // /**
  //  * 🌙 Handle Voice Session End - The portal closes
  //  */
  // const handleVoiceSessionEnd = useCallback(() => {
  //   console.log('🎙️ Voice session ended')
  //   setVoiceState('idle')
  // }, [])
  //
  // /**
  //  * 📜 Handle Voice Transcript - Words materialize from thin air
  //  *
  //  * When the voice speaks or listens, transcripts appear
  //  * like whispers becoming visible in the cosmic ether. 🌬️
  //  */
  // const handleVoiceTranscript = useCallback((text: string, role: 'user' | 'assistant') => {
  //   console.log(`🎙️ [${role}]: ${text}`)
  //   // Transcripts are displayed in the VoiceMode component
  //   // Could be added to messages array if desired
  // }, [])

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
          ) : abResponse ? (
            /* 🏟️ The A/B Showdown Arena - Two responses enter, one leaves victorious!
             * When an A/B test is active, we show the comparison UI instead of regular chat.
             * The user's query appears above, then the dual-response cards battle for approval.
             * May the best response win! 🎭 */
            <div className="space-y-6 animate-fade-in-up">
              {/* 🗣️ The User's Original Query - What sparked this showdown */}
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-sm font-medium">You</span>
                </div>
                <div className="flex-1">
                  <div className="inline-block rounded-2xl rounded-tl-sm bg-accent/50 border border-border px-5 py-3">
                    <p className="text-foreground">{abResponse.query}</p>
                  </div>
                </div>
              </div>

              {/* 🧪 The A/B Comparison Cards - The Main Event!
                  Two AI responses face off in epic side-by-side combat.
                  Users choose their champion with a single click.
                  It's democracy meets AI, and the stakes are... well, improving prompts. */}
              <div className="pt-4">
                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <FlaskConical className="h-4 w-4" />
                  <span>Choose the response you prefer:</span>
                </div>
                <ABResponseComparison
                  abTestId={abResponse.testId}
                  responseA={abResponse.responseA}
                  responseB={abResponse.responseB}
                  onChoice={handleABChoice}
                  className="animate-fade-in"
                />
              </div>
              <div ref={messagesEndRef} />
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

              {/* 🌀 Loading indicator - thinking dots for regular chat */}
              {isLoading && messages[messages.length - 1]?.role === 'user' && !abLoading && (
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

              {/* 🧪 A/B Loading indicator - special dual-response loading state */}
              {abLoading && (
                <div className="flex gap-4 animate-fade-in-up">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 border border-purple-200 dark:bg-purple-900/30 dark:border-purple-800">
                    <FlaskConical className="h-5 w-5 text-purple-600 animate-pulse dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block rounded-2xl rounded-tl-sm bg-card border border-border px-5 py-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '0ms' }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '150ms' }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-muted-foreground text-sm transition-opacity duration-300">
                          Generating two responses for comparison...
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
          {/* 🌙 Voice Mode temporarily disabled for A/B testing focus */}
          {/* {voiceModeActive ? (
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
          ) : ( */}
          <div className="flex items-end gap-2">
            {/* 🧪 A/B Mode Toggle - The Experimental Potion Bottle!
                Click to enable dual-response showdown mode where TWO AI responses
                battle it out for the user's approval. Science, but make it dramatic! */}
            <button
              type="button"
              onClick={toggleABMode}
              className={cn(
                'flex-shrink-0 h-10 w-10 rounded-full transition-all duration-200',
                'flex items-center justify-center',
                'border hover:shadow-md',
                abModeEnabled
                  ? 'bg-purple-100 border-purple-300 text-purple-600 hover:bg-purple-200 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/50'
                  : 'bg-card border-border text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
              aria-label={abModeEnabled ? 'Disable A/B testing mode' : 'Enable A/B testing mode'}
              title={abModeEnabled ? 'A/B Mode Active - Comparing Responses' : 'Enable A/B Testing Mode'}
            >
              <FlaskConical className={cn('h-5 w-5', abModeEnabled && 'animate-pulse')} />
            </button>
            {/* 📝 The Input Field - Takes up remaining space like a well-behaved flex child */}
            <div className="flex-1 min-w-0">
              <ChatInput
                ref={chatInputRef}
                onSend={handleSendMessage}
                disabled={isLoading}
              />
            </div>
          </div>
          {/* )} */}
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
