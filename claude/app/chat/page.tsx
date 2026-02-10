'use client'

import { useChat } from '@ai-sdk/react'
import { useState, useEffect, useRef } from 'react'
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Send, Loader2, Flame, Cloud, Moon, Heart, Lightbulb, BookOpen } from "lucide-react"
import dynamic from 'next/dynamic'
import { DotPattern } from "@/components/ui/dot-pattern"
import { BlurFade } from "@/components/ui/blur-fade"
import ReactMarkdown from 'react-markdown'

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
  // 🌐 Use default chat configuration (defaults to /api/chat)
  const { messages, sendMessage, status } = useChat()
  const isLoading = status === 'streaming' || status === 'submitted'
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
    
    try {
      // 🎯 AI SDK v6 expects simple { text } format, not { role, parts }
      await sendMessage({ text: currentInput })
    } catch (err) {
      console.error("Error sending message:", err)
    }
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
        <div style={{ width: "clamp(40px, 8vw, 60px)", flexShrink: 0 }} />
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
      </div>

      {/* Input Area - Enhanced with safe-area-bottom for notched devices */}
      <form onSubmit={handleSubmit} className="safe-area-bottom" style={{
        padding: "clamp(16px, 3vw, 24px)",
        borderTop: "1px solid #e5e5e5",
        background: "linear-gradient(to top, #f8fafc, #fafafa)",
        position: "relative",
        zIndex: 2
      }}>
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
      </form>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
