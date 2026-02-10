'use client'

import type { UIMessage } from 'ai'
import { cn } from '@/lib/utils'
import { User, Sparkles } from 'lucide-react'

interface ChatMessageProps {
  message: UIMessage
  isStreaming?: boolean
}

/**
 * 🎭 The Message Bubble - A tiny stage for big feelings
 *
 * While the assistant is streaming, we add a subtle glow + shimmer + blinking
 * cursor so the response feels “alive” (without going full disco ball). ✨🪩
 */
export function ChatMessage({ message, isStreaming = false }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const isAssistant = !isUser

  return (
    <div
      className={cn(
        'flex gap-4 animate-fade-in-up opacity-0',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
      style={{ animationFillMode: 'forwards' }}
    >
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-accent text-accent-foreground border border-border'
        )}
      >
        {isUser ? (
          <User className="h-5 w-5" />
        ) : (
          <Sparkles className={cn('h-5 w-5', isStreaming && 'animate-pulse-soft')} />
        )}
      </div>
      <div
        className={cn(
          'flex-1 space-y-2 overflow-hidden',
          isUser ? 'text-right' : 'text-left'
        )}
      >
        <div
          className={cn(
            'inline-block rounded-2xl px-5 py-3 max-w-[85%] relative',
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-sm'
              : 'bg-card border border-border rounded-tl-sm shadow-sm',
            isAssistant && isStreaming && 'magic-streaming-bubble'
          )}
        >
          <div
            className={cn(
              'prose-chat text-[15px]',
              isAssistant && isStreaming && 'magic-streaming-text'
            )}
          >
            {message.parts.map((part, index) => {
              if (part.type === 'text') {
                return (
                  <div
                    key={index}
                    className="whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: formatMessage(part.text),
                    }}
                  />
                )
              }
              return null
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 📜 The Markdown Alchemist - Transforms raw text into beautiful HTML
 *
 * Handles headers, bold, italic, lists, and line breaks so the assistant's
 * wisdom displays properly. No fancy libraries, just regex wizardry. 🧙‍♂️
 */
function formatMessage(text: string): string {
  // Split into lines for block-level processing
  const lines = text.split('\n')
  const htmlLines: string[] = []
  let inList = false
  let listType: 'ul' | 'ol' | null = null

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    // Convert **bold** to <strong>
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Convert *italic* to <em> (but not if it's a list marker)
    line = line.replace(/(?<!\s)\*([^*\n]+)\*(?!\s)/g, '<em>$1</em>')

    // Headers: ### Header -> <h4>, ## Header -> <h3>, # Header -> <h2>
    if (line.match(/^#{1,4}\s/)) {
      // Close any open list
      if (inList) {
        htmlLines.push(listType === 'ol' ? '</ol>' : '</ul>')
        inList = false
        listType = null
      }
      const level = (line.match(/^#+/) || [''])[0].length
      const headerText = line.replace(/^#+\s*/, '')
      const tag = level === 1 ? 'h2' : level === 2 ? 'h3' : level === 3 ? 'h4' : 'h5'
      htmlLines.push(`<${tag} class="font-semibold text-foreground mt-4 mb-2">${headerText}</${tag}>`)
      continue
    }

    // Unordered list: - item or * item
    if (line.match(/^\s*[-*]\s+/)) {
      const content = line.replace(/^\s*[-*]\s+/, '')
      if (!inList || listType !== 'ul') {
        if (inList) htmlLines.push(listType === 'ol' ? '</ol>' : '</ul>')
        htmlLines.push('<ul class="list-disc list-inside my-2 space-y-1">')
        inList = true
        listType = 'ul'
      }
      htmlLines.push(`<li>${content}</li>`)
      continue
    }

    // Ordered list: 1. item
    if (line.match(/^\s*\d+\.\s+/)) {
      const content = line.replace(/^\s*\d+\.\s+/, '')
      if (!inList || listType !== 'ol') {
        if (inList) htmlLines.push(listType === 'ol' ? '</ol>' : '</ul>')
        htmlLines.push('<ol class="list-decimal list-inside my-2 space-y-1">')
        inList = true
        listType = 'ol'
      }
      htmlLines.push(`<li>${content}</li>`)
      continue
    }

    // Close list if we hit a non-list line
    if (inList && line.trim() !== '') {
      htmlLines.push(listType === 'ol' ? '</ol>' : '</ul>')
      inList = false
      listType = null
    }

    // Empty line = paragraph break
    if (line.trim() === '') {
      if (inList) {
        htmlLines.push(listType === 'ol' ? '</ol>' : '</ul>')
        inList = false
        listType = null
      }
      htmlLines.push('<br />')
      continue
    }

    // Regular text
    htmlLines.push(line)
  }

  // Close any remaining open list
  if (inList) {
    htmlLines.push(listType === 'ol' ? '</ol>' : '</ul>')
  }

  return htmlLines.join('\n')
}
