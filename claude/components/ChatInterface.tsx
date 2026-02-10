/**
 * 🎭 Chat Interface - The heart of the mindful conversation space ✨
 *
 * "A sanctuary where questions become illumination, and confusion becomes clarity."
 *
 * Features: Auto-scroll to latest, input focus after send, smooth UX flow.
 */

"use client"

import { useEffect, useRef, useState } from "react"
import { Send, Loader } from "lucide-react"
import { MessageBubble } from "./MessageBubble"
import type { ChatMessage } from "@/types/embeddings"

interface ChatInterfaceProps {
  onSendMessage: (message: string) => Promise<void>
  isLoading: boolean
}

export function ChatInterface({ onSendMessage, isLoading }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [streamingMessage, setStreamingMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const wasLoadingRef = useRef(false)

  /**
   * 🧭 The Smooth Scroll Ritual - Glides to the latest wisdom
   *
   * Uses scrollTo with smooth behavior for a polished feel. Falls back
   * to scrollIntoView when the container ref isn't available. 🌊✨
   */
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior,
      })
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior })
    }
  }

  // 🎯 Auto-scroll when messages change or streaming updates
  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingMessage])

  /**
   * 🔮 Focus Magic - Return cursor to input when loading completes
   *
   * After the assistant finishes their wisdom, the user's cursor awaits
   * in the input field, ready for the next profound question. 🎪
   */
  useEffect(() => {
    if (wasLoadingRef.current && !isLoading) {
      // Loading just finished - focus the input!
      setTimeout(() => inputRef.current?.focus(), 100)
    }
    wasLoadingRef.current = isLoading
  }, [isLoading])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setStreamingMessage("")

    // 🎯 Keep focus on input while sending - smoother UX!
    inputRef.current?.focus()

    try {
      await onSendMessage(input)
    } catch (error) {
      console.error("🌩️ Temporary setback:", error)
      const errorMessage: ChatMessage = {
        role: "assistant",
        content:
          "🌙 A gentle interruption has occurred. Please try again in a moment.",
        block: "General",
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  // Add streaming message to display
  useEffect(() => {
    if (streamingMessage && !isLoading) {
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: streamingMessage,
        block: "General",
      }
      setMessages((prev) => [...prev, assistantMessage])
      setStreamingMessage("")
    }
  }, [isLoading, streamingMessage])

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="space-y-4">
              <div className="text-4xl">🧘</div>
              <h3 className="text-xl font-semibold text-slate-700">
                Welcome to the Four Blocks
              </h3>
              <p className="text-slate-600 max-w-xs">
                Ask a question about managing Anger, Anxiety, Depression, or Guilt.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <MessageBubble
                key={idx}
                content={msg.content}
                isUser={msg.role === "user"}
                block={msg.block}
              />
            ))}
            {streamingMessage && (
              <MessageBubble
                content={streamingMessage}
                isUser={false}
                isStreaming={isLoading}
              />
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Form - with safe-area-bottom for notched devices */}
      <form onSubmit={handleSendMessage} className="border-t border-slate-200 p-4 safe-area-bottom">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the Four Blocks..."
            disabled={isLoading}
            className="
              flex-1 px-4 py-2 rounded-lg
              border border-slate-300
              focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              bg-white text-slate-800 placeholder-slate-500
            "
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="
              px-4 py-2 rounded-lg
              bg-gradient-to-r from-blue-500 to-blue-600
              text-white font-medium
              hover:from-blue-600 hover:to-blue-700
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              flex items-center gap-2
            "
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Listening...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
