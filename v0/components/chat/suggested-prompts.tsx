'use client'

import { cn } from '@/lib/utils'
import { Flame, Wind, Cloud, Heart, Lightbulb, BookOpen, Brain, Sparkles, Scale, Eye, ArrowRight, Info } from 'lucide-react'
import Link from 'next/link'

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void
  disabled?: boolean
}

const PROMPT_CATEGORIES = [
  {
    title: 'Learn the Fundamentals',
    icon: BookOpen,
    prompts: [
      {
        text: 'What are the four blocks to happiness and how do they affect me?',
        icon: Lightbulb,
        color: 'text-primary',
      },
      {
        text: 'Explain the ABC model - how do my beliefs create my emotions?',
        icon: Brain,
        color: 'text-primary',
      },
      {
        text: 'What are the 7 irrational beliefs I should watch out for?',
        icon: Eye,
        color: 'text-primary',
      },
    ],
  },
  {
    title: 'Work Through Your Feelings',
    icon: Heart,
    prompts: [
      {
        text: "Someone did something that really upset me and I can't let it go",
        icon: Flame,
        color: 'text-anger',
      },
      {
        text: "I keep worrying about the future and can't stop catastrophizing",
        icon: Wind,
        color: 'text-anxiety',
      },
      {
        text: "I feel like I'm not good enough and keep putting myself down",
        icon: Cloud,
        color: 'text-depression',
      },
      {
        text: "I feel terrible about something I did and can't forgive myself",
        icon: Heart,
        color: 'text-guilt',
      },
    ],
  },
  {
    title: 'Deepen Your Practice',
    icon: Sparkles,
    prompts: [
      {
        text: 'How can I train my Observer to notice irrational thoughts?',
        icon: Eye,
        color: 'text-primary',
      },
      {
        text: 'Help me dispute an irrational belief I have',
        icon: Scale,
        color: 'text-primary',
      },
    ],
  },
]

export function SuggestedPrompts({ onSelect, disabled }: SuggestedPromptsProps) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {PROMPT_CATEGORIES.map((category, categoryIndex) => (
        <div
          key={category.title}
          className={cn(
            'space-y-4 animate-fade-in-up opacity-0',
            categoryIndex === 0 && 'stagger-1',
            categoryIndex === 1 && 'stagger-2',
            categoryIndex >= 2 && 'stagger-3'
          )}
          style={{ animationFillMode: 'forwards' }}
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <category.icon className="h-4 w-4" />
            <h3 className="text-sm font-medium uppercase tracking-wide">
              {category.title}
            </h3>
          </div>
          <div
            className={cn(
              'grid gap-3',
              category.prompts.length <= 2
                ? 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-1 sm:grid-cols-2'
            )}
          >
            {category.prompts.map((prompt, index) => (
              <button
                key={prompt.text}
                onClick={() => onSelect(prompt.text)}
                disabled={disabled}
                className={cn(
                  'group relative flex items-start gap-3 p-4 rounded-xl',
                  'bg-card border border-border',
                  'text-left transition-all duration-300',
                  'hover:border-primary/30 hover:shadow-md hover:shadow-primary/5',
                  'hover:-translate-y-0.5',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
                  'animate-fade-in-up opacity-0',
                  index === 0 && 'stagger-1',
                  index === 1 && 'stagger-2',
                  index === 2 && 'stagger-3',
                  index >= 3 && 'stagger-4'
                )}
                style={{ animationFillMode: 'forwards' }}
              >
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                    'bg-muted transition-colors group-hover:bg-accent',
                    prompt.color
                  )}
                >
                  <prompt.icon className="h-4 w-4" />
                </div>
                <span className="text-sm text-foreground leading-relaxed pt-1.5">
                  {prompt.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Quick links to About & Book */}
      <div
        className="grid sm:grid-cols-2 gap-4 pt-4 animate-fade-in-up opacity-0 stagger-4"
        style={{ animationFillMode: 'forwards' }}
      >
        <Link
          href="/about"
          className={cn(
            'group flex items-center justify-between p-4 rounded-xl',
            'bg-card/70 border border-border backdrop-blur-sm',
            'transition-all duration-300',
            'hover:border-primary/30 hover:shadow-md hover:shadow-primary/5',
            'hover:-translate-y-0.5'
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-primary">
              <Info className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">About</h4>
              <p className="text-xs text-muted-foreground">Learn how it works</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
        <Link
          href="/book"
          className={cn(
            'group flex items-center justify-between p-4 rounded-xl',
            'bg-card/70 border border-border backdrop-blur-sm',
            'transition-all duration-300',
            'hover:border-primary/30 hover:shadow-md hover:shadow-primary/5',
            'hover:-translate-y-0.5'
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-primary">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">The Book</h4>
              <p className="text-xs text-muted-foreground">The wisdom behind it</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
      </div>
    </div>
  )
}
