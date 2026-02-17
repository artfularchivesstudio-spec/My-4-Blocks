'use client'

import { useChat } from '@ai-sdk/react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Send, Loader2, Flame, Cloud, Moon, Heart, Lightbulb, BookOpen, Mic, MicOff, FlaskConical } from "lucide-react"
import dynamic from 'next/dynamic'
import { DotPattern } from "@/components/ui/dot-pattern"
import { BlurFade } from "@/components/ui/blur-fade"
import ReactMarkdown from 'react-markdown'
import { VoiceMode, type VoiceState } from '../../shared/components'

// 🧪 Dynamically import ABResponseComparison to avoid SSR issues
const ABResponseComparison = dynamic(
  () => import('../../shared/components/ABResponseComparison').then(mod => mod.ABResponseComparison),
  { ssr: false }
)

// 🧪 A/B Response State - The dual-response showdown tracker
interface ABResponseState {
  testId: string
  responseA: string
  responseB: string
  query: string
}

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

const suggestedPrompts = [
  { 
    icon: Flame, 
    color: "#ef4444", 
    title: "Managing Anger", 
    prompt: "I keep getting angry at things I can't control. How can I stop?",
  },
  { 
    icon: Cloud, 
    color: "#3b82f6", 
    title: "Understanding Anxiety", 
    prompt: "I'm worried about what might happen. How can I stop worrying?",
  },
  { 
    icon: Moon, 
    color: "#64748b", 
    title: "Overcoming Depression", 
    prompt: "I feel hopeless and unmotivated. What can I do?",
  },
  { 
    icon: Heart, 
    color: "#a855f7", 
    title: "Releasing Guilt", 
    prompt: "I feel guilty about something I did. How can I let it go?",
  },
  { 
    icon: Lightbulb, 
    color: "#10b981", 
    title: "The ABCs Model", 
    prompt: "How do my thoughts create my emotions?",
  },
  { 
    icon: BookOpen, 
    color: "#f59e0b", 
    title: "Core Beliefs", 
    prompt: "What are the irrational beliefs that cause suffering?",
  },
]

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [lottieData, setLottieData] = useState(null)

  // 🧪 A/B Testing Mode - The Great Response Showdown Arena! 🎭
  const [abModeEnabled, setAbModeEnabled] = useState(false)
  const [abResponse, setAbResponse] = useState<ABResponseState | null>(null)
  const [abLoading, setAbLoading] = useState(false)

  // 🌐 Use default chat configuration (defaults to /api/chat)
  const { messages, sendMessage, status } = useChat()
  const isLoading = status === 'streaming' || status === 'submitted' || abLoading

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 🎙️ Voice mode state - breathing orb vibes
  const [voiceModeActive, setVoiceModeActive] = useState(false)
  const [voiceState, setVoiceState] = useState<VoiceState>('idle')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load Lottie animation from public folder
  useEffect(() => {
    fetch('/Sunrise - Breathe in Breathe out.json')
      .then(res => res.json())
      .then(data => setLottieData(data))
      .catch(err => console.error('Failed to load Lottie:', err))
  }, [])

  const handlePromptClick = (promptText: string) => {
    setInput(promptText)
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const currentInput = input
    setInput('')

    if (abModeEnabled) {
      // 🧪 A/B Mode: Summon dual responses from the showdown arena!
      setAbLoading(true)
      setAbResponse(null)

      try {
        console.log('🧪 ✨ A/B MODE ENGAGED! Summoning dual responses...')

        const response = await fetch('/api/chat/ab', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: currentInput }],
          }),
        })

        if (!response.ok) {
          throw new Error(`A/B portal returned ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        console.log('🎭 ✨ DUAL RESPONSES RECEIVED!', data.abTestId)

        setAbResponse({
          testId: data.abTestId,
          responseA: data.responses.A,
          responseB: data.responses.B,
          query: currentInput,
        })
      } catch (err) {
        console.error('🌩️ A/B portal hiccup:', err)
        await sendMessage({ text: currentInput })
      } finally {
        setAbLoading(false)
      }
    } else {
      try {
        // 🎯 AI SDK v6 expects simple { text } format, not { role, parts }
        await sendMessage({ text: currentInput })
      } catch (err) {
        console.error("Error sending message:", err)
      }
    }
  }

  /**
   * 🏆 handleABChoice - When the User Crowns Their Champion
   */
  const handleABChoice = useCallback((choice: 'A' | 'B') => {
    if (!abResponse) return

    console.log(`🏆 ✨ THE PEOPLE HAVE SPOKEN! Response ${choice} is the champion!`)

    sendMessage({ text: abResponse.query })

    setTimeout(() => {
      setAbResponse(null)
    }, 100)
  }, [abResponse, sendMessage])

  /**
   * 🎙️ Toggle Voice Mode - Switch between speaking and typing
   */
  const handleVoiceToggle = useCallback(() => {
    setVoiceModeActive((prev) => !prev)
  }, [])

  /**
   * 🌟 Voice session started - The sunrise awakens
   */
  const handleVoiceSessionStart = useCallback(() => {
    console.log('🎙️ ✨ VOICE SESSION STARTED!')
  }, [])

  /**
   * 🌙 Voice session ended - Sunset, peaceful
   */
  const handleVoiceSessionEnd = useCallback(() => {
    console.log('🎙️ Voice session ended')
    setVoiceState('idle')
  }, [])

  /**
   * 📜 Voice transcript received
   */
  const handleVoiceTranscript = useCallback((text: string, role: 'user' | 'assistant') => {
    console.log(`🎙️ [${role}]: ${text}`)
  }, [])

  /**
   * 🌅 Sunrise-Inspired Voice Orb - Breathing animation style
   *
   * Matches the Lottie sunrise breathing animation aesthetic
   */
  const renderSunriseOrb = (state: VoiceState) => {
    const stateColors = {
      idle: { from: '#f97316', to: '#fb923c', glow: 'rgba(249, 115, 22, 0.3)' },
      connecting: { from: '#3b82f6', to: '#60a5fa', glow: 'rgba(59, 130, 246, 0.4)' },
      connected: { from: '#10b981', to: '#34d399', glow: 'rgba(16, 185, 129, 0.4)' },
      listening: { from: '#8b5cf6', to: '#a78bfa', glow: 'rgba(139, 92, 246, 0.5)' },
      speaking: { from: '#f59e0b', to: '#fbbf24', glow: 'rgba(245, 158, 11, 0.5)' },
      error: { from: '#ef4444', to: '#f87171', glow: 'rgba(239, 68, 68, 0.4)' },
    }

    const colors = stateColors[state]

    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          position: 'relative',
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
          boxShadow: `0 0 60px ${colors.glow}, 0 0 100px ${colors.glow}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Breathing pulse animation */}
        <motion.div
          animate={{
            scale: state === 'idle' ? [1, 1.1, 1] : [1, 1.15, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: state === 'speaking' ? 1.5 : 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), transparent)`,
          }}
        />

        {/* Pulse rings for active states */}
        {(state === 'listening' || state === 'speaking') && (
          <>
            <motion.div
              animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `3px solid ${colors.from}`,
              }}
            />
            <motion.div
              animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `3px solid ${colors.from}`,
              }}
            />
          </>
        )}

        {/* State icon */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          {state === 'connecting' && (
            <Loader2 size={32} color="white" style={{ animation: 'spin 1s linear infinite' }} />
          )}
          {(state === 'connected' || state === 'listening' || state === 'idle') && (
            <Mic size={32} color="white" />
          )}
          {state === 'speaking' && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Send size={28} color="white" />
            </motion.div>
          )}
          {state === 'error' && (
            <MicOff size={32} color="white" />
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <div
      id="main-content"
      style={{
      minHeight: "100vh",
      background: "#fafafa",
      display: "flex",
      flexDirection: "column",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Calm Static Background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <DotPattern width={20} height={20} cx={1} cy={1} cr={1} className="w-full h-full" />
      </div>

      {/* Header */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "clamp(12px, 2vw, 16px) clamp(16px, 3vw, 24px)",
        borderBottom: "1px solid #e5e5e5",
        background: "#fafafa",
        position: "relative",
        zIndex: 2
      }}>
        {/* 🏠 The Homeward Beacon - A proper 44px touch target for our wayfinding travelers */}
        <Link
          href="/"
          className="touch-target"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(4px, 1vw, 8px)",
            color: "#1a1a1a",
            textDecoration: "none",
            fontSize: "clamp(0.8rem, 2vw, 0.875rem)",
            fontWeight: 500,
            transition: "color 0.2s ease",
            minHeight: "44px",
            minWidth: "44px",
            marginLeft: "-8px", // Optical alignment to compensate for touch padding
            borderRadius: "8px"
          }}
        >
          <ChevronLeft size={18} style={{ width: "clamp(16px, 2.5vw, 18px)", height: "clamp(16px, 2.5vw, 18px)" }} />
          <span className="hidden sm:inline">Back</span>
        </Link>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(8px, 1.5vw, 12px)"
        }}>
          {/* 🎨 The Four Blocks Logo - Clean SVG */}
          <Image src="/logo-blocks.svg" alt="My 4 Blocks Logo" width={60} height={60} style={{ width: "clamp(40px, 8vw, 60px)", height: "auto" }} />
          <h1 style={{
            fontSize: "clamp(1rem, 3vw, 1.25rem)",
            fontWeight: 600,
            color: "#1a1a1a",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
            My 4 Blocks Chat
          </h1>
        </div>
        {/* 🧪 A/B Testing Toggle - The Experiment Button */}
        <button
          onClick={() => setAbModeEnabled(!abModeEnabled)}
          title={abModeEnabled ? 'A/B Mode Active - Comparing Responses' : 'Enable A/B Testing Mode'}
          style={{
            padding: "8px",
            borderRadius: "8px",
            border: "none",
            background: abModeEnabled ? "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)" : "transparent",
            color: abModeEnabled ? "white" : "#64748b",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            minWidth: "44px",
            minHeight: "44px"
          }}
        >
          <FlaskConical size={20} style={{ animation: abModeEnabled ? "pulse 2s infinite" : "none" }} />
        </button>
      </header>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "clamp(16px, 3vw, 24px)", position: "relative", zIndex: 1 }}>
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              maxWidth: "min(900px, 100%)",
              margin: "0 auto"
            }}
          >
            {/* Welcome Section with Sunrise GIF */}
            <BlurFade delay={0.1} inView={true}>
              <div style={{ textAlign: "center", marginBottom: "clamp(32px, 6vw, 48px)", paddingTop: "clamp(12px, 2vw, 20px)" }}>
                {/* Beautiful Sunrise Breathing Animation */}
                <div style={{ marginBottom: "clamp(16px, 3vw, 20px)", display: "flex", justifyContent: "center" }}>
                  {lottieData && (
                    <Lottie 
                      animationData={lottieData}
                      loop={true}
                      style={{ 
                        width: "clamp(120px, 20vw, 180px)", 
                        height: "clamp(80px, 13vw, 120px)",
                      }}
                    />
                  )}
                </div>
                <h2 style={{
                  fontSize: "clamp(1.5rem, 4vw, 1.75rem)",
                  fontWeight: 500,
                  fontFamily: "serif",
                  color: "#1a1a1a",
                  marginBottom: "clamp(8px, 1.5vw, 12px)",
                  padding: "0 clamp(16px, 4vw, 0)"
                }}>
                  Welcome to Your Journey
                </h2>
                <p style={{ 
                  color: "#666", 
                  fontSize: "clamp(0.875rem, 2vw, 0.95rem)",
                  lineHeight: 1.6,
                  padding: "0 clamp(16px, 4vw, 0)"
                }}>
                  Choose a topic below or ask your own question about emotional wellness.
                </p>
              </div>
            </BlurFade>

            {/* Suggested Prompts Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "clamp(12px, 2vw, 16px)" }}>
              {suggestedPrompts.map((item, idx) => {
                const Icon = item.icon
                return (
                  <BlurFade key={idx} delay={0.2 + idx * 0.05} inView={true}>
                    {/* 🎭 The Prompt Palette - Each suggestion a gateway to emotional exploration */}
                    <motion.button
                      onClick={() => handlePromptClick(item.prompt)}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      style={{
                        width: "100%",
                        padding: "clamp(18px, 3.5vw, 24px)",
                        minHeight: "44px", // WCAG 2.5.5 touch target compliance
                        background: "white",
                        border: "1px solid #e5e5e5",
                        borderRadius: "16px",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        display: "flex",
                        flexDirection: "column",
                        gap: "clamp(12px, 2vw, 14px)",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                        borderLeft: `3px solid ${item.color}`,
                        outline: "none" // Focus handled by className
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 8px 24px ${item.color}20, 0 4px 12px rgba(0, 0, 0, 0.08)`
                        e.currentTarget.style.borderColor = item.color
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)"
                        e.currentTarget.style.borderColor = "#e5e5e5"
                        e.currentTarget.style.borderLeft = `3px solid ${item.color}`
                      }}
                    >
                      {/* 🌟 Icon container - sized for visual harmony (parent button handles touch target) */}
                      <div style={{
                        width: "clamp(40px, 6vw, 44px)",
                        height: "clamp(40px, 6vw, 44px)",
                        borderRadius: "10px",
                        background: `${item.color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}>
                        <Icon size={20} color={item.color} style={{ width: "clamp(20px, 3vw, 24px)", height: "clamp(20px, 3vw, 24px)" }} />
                      </div>
                      <div>
                        <div style={{
                          fontWeight: 600,
                          color: "#1a1a1a",
                          marginBottom: "clamp(4px, 1vw, 6px)",
                          fontSize: "clamp(0.95rem, 2.2vw, 1.05rem)"
                        }}>
                          {item.title}
                        </div>
                        <p style={{
                          fontSize: "clamp(0.85rem, 1.9vw, 0.9rem)",
                          color: "#64748b",
                          lineHeight: 1.5,
                          margin: 0
                        }}>
                          {item.prompt}
                        </p>
                      </div>
                    </motion.button>
                  </BlurFade>
                )
              })}
            </div>
          </motion.div>
        ) : (
          /* 🎭 The Live Message Arena - aria-live announces new messages to screen readers!
           * Using "polite" so it doesn't interrupt, and atomic="false" so only new content is read */
          <div
            aria-live="polite"
            aria-atomic="false"
            role="log"
            style={{ maxWidth: "min(800px, 100%)", margin: "0 auto", padding: "0 clamp(8px, 1.5vw, 0)" }}
          >
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  marginBottom: "clamp(16px, 3vw, 20px)",
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
                }}
              >
                <div style={{
                  maxWidth: "min(80%, 100%)",
                  padding: "clamp(12px, 2vw, 16px) clamp(16px, 3vw, 20px)",
                  borderRadius: "16px",
                  background: msg.role === "user" ? "#3b82f6" : "white",
                  color: msg.role === "user" ? "white" : "#1a1a1a",
                  border: msg.role === "assistant" ? "1px solid #e5e5e5" : "none",
                  fontSize: "clamp(0.875rem, 2vw, 0.95rem)",
                  lineHeight: 1.7,
                  wordBreak: "break-word"
                }}>
                  {msg.parts?.map((part: any, i: number) => {
                    if (part.type !== 'text') return null
                    
                    // Render markdown for assistant messages, plain text for user
                    if (msg.role === 'assistant') {
                      return (
                        <div key={i} className="prose prose-sm max-w-none">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p style={{ margin: '0 0 12px 0' }}>{children}</p>,
                              strong: ({ children }) => <strong style={{ fontWeight: 600, color: '#1a1a1a' }}>{children}</strong>,
                              ul: ({ children }) => <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>{children}</ul>,
                              ol: ({ children }) => <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>{children}</ol>,
                              li: ({ children }) => <li style={{ marginBottom: '4px' }}>{children}</li>,
                              h1: ({ children }) => <h1 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '16px 0 8px' }}>{children}</h1>,
                              h2: ({ children }) => <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '14px 0 6px' }}>{children}</h2>,
                              h3: ({ children }) => <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '12px 0 4px' }}>{children}</h3>,
                              blockquote: ({ children }) => (
                                <blockquote style={{ 
                                  borderLeft: '3px solid #8b5cf6', 
                                  paddingLeft: '12px', 
                                  margin: '12px 0',
                                  fontStyle: 'italic',
                                  color: '#4b5563'
                                }}>
                                  {children}
                                </blockquote>
                              ),
                              code: ({ children }) => (
                                <code style={{ 
                                  background: '#f3f4f6', 
                                  padding: '2px 6px', 
                                  borderRadius: '4px',
                                  fontSize: '0.85em'
                                }}>
                                  {children}
                                </code>
                              ),
                            }}
                          >
                            {part.text}
                          </ReactMarkdown>
                        </div>
                      )
                    }
                    return <span key={i}>{part.text}</span>
                  })}
                  {isLoading && idx === messages.length - 1 && msg.role === 'assistant' && (!msg.parts || msg.parts.length === 0) && (
                    <span style={{ display: "flex", alignItems: "center", gap: "clamp(6px, 1vw, 8px)" }}>
                      <Loader2 size={16} style={{ width: "clamp(14px, 2vw, 16px)", height: "clamp(14px, 2vw, 16px)", animation: "spin 1s linear infinite" }} />
                      Thinking...
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* 🧪 A/B Response Comparison Arena */}
        {abResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              maxWidth: "min(900px, 100%)",
              margin: "0 auto",
              padding: "clamp(16px, 3vw, 24px)"
            }}
          >
            <div style={{
              textAlign: "center",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}>
              <FlaskConical size={20} style={{ color: "#8b5cf6" }} />
              <span style={{ fontWeight: 600, color: "#1a1a1a" }}>Compare Responses</span>
            </div>
            <p style={{
              textAlign: "center",
              color: "#64748b",
              fontSize: "0.9rem",
              marginBottom: "20px"
            }}>
              Your question: &quot;{abResponse.query}&quot;
            </p>
            <ABResponseComparison
              abTestId={abResponse.testId}
              responseA={abResponse.responseA}
              responseB={abResponse.responseB}
              onChoice={handleABChoice}
            />
          </motion.div>
        )}
      </div>

      {/* Input Area - Enhanced with safe-area-bottom for notched devices */}
      <div className="safe-area-bottom" style={{
        padding: "clamp(16px, 3vw, 24px)",
        borderTop: "1px solid #e5e5e5",
        background: "linear-gradient(to top, #f8fafc, #fafafa)",
        position: "relative",
        zIndex: 2
      }}>
        <AnimatePresence mode="wait">
          {voiceModeActive ? (
            /* 🎙️ Voice Mode - Sunrise breathing orb */
            <motion.div
              key="voice-mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                maxWidth: "min(800px, 100%)",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "clamp(16px, 3vw, 24px)"
              }}
            >
              <VoiceMode
                isActive={voiceModeActive}
                onActiveChange={setVoiceModeActive}
                onSessionStart={handleVoiceSessionStart}
                onSessionEnd={handleVoiceSessionEnd}
                onTranscript={handleVoiceTranscript}
                showTranscript={false}
                apiEndpoint="/api/realtime"
                renderOrb={renderSunriseOrb}
              />
              <button
                onClick={handleVoiceToggle}
                style={{
                  marginTop: '16px',
                  padding: '8px 16px',
                  fontSize: 'clamp(0.85rem, 2vw, 0.9rem)',
                  color: '#64748b',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
              >
                Switch to text mode
              </button>
            </motion.div>
          ) : (
            /* ✍️ Text Input Mode */
            <motion.form
              key="text-mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
            >
              <div style={{
                maxWidth: "min(800px, 100%)",
                margin: "0 auto",
                display: "flex",
                gap: "clamp(10px, 2vw, 14px)",
                alignItems: "center",
                background: "white",
                padding: "clamp(6px, 1vw, 8px)",
                borderRadius: "16px",
                border: "2px solid #e2e8f0",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(59, 130, 246, 0.05)",
                transition: "all 0.3s ease"
              }}>
                {/* 🎯 The Hidden Label - Screen readers shall know thy purpose! */}
                <label htmlFor="chat-input" className="sr-only">
                  Type your message
                </label>
                {/* 💬 The Thought Canvas - Where seekers articulate their inner world */}
                <input
                  id="chat-input"
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Share what's on your mind..."
                  disabled={isLoading}
                  className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
                  style={{
                    flex: 1,
                    padding: "clamp(12px, 2vw, 16px) clamp(14px, 2.5vw, 20px)",
                    minHeight: "44px", // WCAG 2.5.5 touch target
                    borderRadius: "12px",
                    border: "none",
                    fontSize: "clamp(0.95rem, 2.2vw, 1.05rem)",
                    outline: "none",
                    background: "transparent",
                    color: "#1a1a1a"
                  }}
                />
                {/* 🎙️ Voice Toggle Button - Sunrise aesthetic */}
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  disabled={isLoading}
                  className="focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                  style={{
                    padding: "clamp(12px, 2vw, 14px)",
                    minHeight: "44px",
                    minWidth: "44px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
                    color: "white",
                    border: "none",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                    flexShrink: 0,
                    boxShadow: "0 4px 15px rgba(249, 115, 22, 0.4)",
                    opacity: isLoading ? 0.5 : 1,
                    outline: "none"
                  }}
                >
                  <Mic size={20} style={{ width: "clamp(18px, 2.5vw, 20px)", height: "clamp(18px, 2.5vw, 20px)" }} />
                </button>
                {/* 🚀 The Send Catalyst - Where thoughts transform into digital conversation */}
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  style={{
                    padding: "clamp(12px, 2vw, 14px) clamp(18px, 3.5vw, 24px)",
                    minHeight: "44px", // WCAG 2.5.5 touch target minimum
                    minWidth: "44px",
                    borderRadius: "12px",
                    background: isLoading || !input.trim()
                      ? "linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)"
                      : "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                    color: "white",
                    fontWeight: 600,
                    border: "none",
                    cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "clamp(6px, 1.2vw, 8px)",
                    fontSize: "clamp(0.9rem, 2.2vw, 1rem)",
                    transition: "all 0.3s ease",
                    flexShrink: 0,
                    boxShadow: isLoading || !input.trim()
                      ? "none"
                      : "0 4px 15px rgba(59, 130, 246, 0.4), 0 2px 4px rgba(139, 92, 246, 0.3)",
                    transform: "scale(1)",
                    outline: "none" // Focus handled by className
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && input.trim()) {
                      e.currentTarget.style.transform = "scale(1.05)"
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.5), 0 4px 8px rgba(139, 92, 246, 0.4)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading && input.trim()) {
                      e.currentTarget.style.transform = "scale(1)"
                      e.currentTarget.style.boxShadow = "0 4px 15px rgba(59, 130, 246, 0.4), 0 2px 4px rgba(139, 92, 246, 0.3)"
                    }
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} style={{ width: "clamp(16px, 2.5vw, 18px)", height: "clamp(16px, 2.5vw, 18px)", animation: "spin 1s linear infinite" }} />
                      <span className="hidden sm:inline">Thinking...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} style={{ width: "clamp(16px, 2.5vw, 18px)", height: "clamp(16px, 2.5vw, 18px)" }} />
                      <span className="hidden sm:inline">Send</span>
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}
