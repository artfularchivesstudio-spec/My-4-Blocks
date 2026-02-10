'use client'

import { Header } from '@/components/layout/header'
import { AmbientBackground } from '@/components/layout/ambient-background'
import {
  ArrowRight,
  MessageCircle,
  Search,
  Brain,
  HelpCircle,
  Sun,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

/**
 * 🎭 The How It Works Page - A Journey Through Emotional Alchemy
 *
 * "Step by step, the fog lifts. Belief by belief, peace arrives.
 * This page illuminates the path from suffering to serenity,
 * one mystical transformation at a time."
 *
 * - The Spellbinding Museum Director of Cognitive Clarity 🔮
 */

// 🌟 The Sacred Steps - Each a portal to understanding
const journeySteps = [
  {
    number: 1,
    title: 'Share Your Situation',
    description: 'Start by telling us what happened and how you feel. No judgment, just a safe space to express yourself.',
    icon: MessageCircle,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    number: 2,
    title: 'Discover Your Block',
    description: 'We identify which of the 4 blocks — Anger, Anxiety, Depression, or Guilt — is active in your experience.',
    icon: Search,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    number: 3,
    title: 'Find the Belief',
    description: 'Together we uncover the irrational belief creating your emotion. This is where the magic begins.',
    icon: Brain,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    number: 4,
    title: 'Question & Transform',
    description: 'Use powerful disputation questions to challenge the belief. Is it logical? Is it helpful? Is it true?',
    icon: HelpCircle,
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
  },
  {
    number: 5,
    title: 'Find Peace',
    description: 'Replace irrational beliefs with rational, peaceful alternatives. Feel the shift from suffering to serenity.',
    icon: Sun,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background relative">
      <AmbientBackground />
      <Header />
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          {/* 🎭 Hero Section - The Grand Opening */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground mb-4">
              How It Works
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              A gentle, step-by-step journey from emotional distress to clarity and peace.
            </p>
          </div>

          {/* 🌟 Main Content - The Theatrical Stages */}
          <div className="space-y-10">
            {/* ✨ The Journey Steps - Five Acts of Transformation */}
            <section>
              <h2 className="font-serif text-2xl text-foreground mb-8 text-center flex items-center justify-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                Your Journey to Peace
              </h2>

              <div className="space-y-4">
                {journeySteps.map((step, index) => {
                  const IconComponent = step.icon
                  return (
                    <div
                      key={step.number}
                      className="rounded-xl border border-border bg-card/70 p-5 sm:p-6 shadow-sm backdrop-blur-sm transition-all hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">
                        {/* 🔢 The Mystical Number Circle */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full ${step.bgColor} flex items-center justify-center`}>
                          <IconComponent className={`h-6 w-6 ${step.color}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-muted-foreground">
                              Step {step.number}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg text-foreground mb-2">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* 🎨 Connector Line (except for last item) */}
                      {index < journeySteps.length - 1 && (
                        <div className="ml-6 mt-4 h-4 w-px bg-border" />
                      )}
                    </div>
                  )
                })}
              </div>
            </section>

            {/* 🧠 The ABC Model - The Heart of REBT */}
            <section className="rounded-2xl border border-border bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
              <h2 className="font-serif text-2xl text-foreground mb-6 text-center">
                The ABC Model
              </h2>

              {/* 🎭 Visual ABC Flow */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
                {/* A - Activating Event */}
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 w-full sm:w-auto sm:min-w-[140px]">
                  <span className="text-2xl font-bold text-blue-500 mb-1">A</span>
                  <span className="text-sm font-medium text-foreground">Event</span>
                  <span className="text-xs text-muted-foreground mt-1">What happened</span>
                </div>

                {/* Arrow */}
                <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90 sm:rotate-0 flex-shrink-0" />

                {/* B - Belief */}
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 w-full sm:w-auto sm:min-w-[140px]">
                  <span className="text-2xl font-bold text-purple-500 mb-1">B</span>
                  <span className="text-sm font-medium text-foreground">Belief</span>
                  <span className="text-xs text-muted-foreground mt-1">What you think</span>
                </div>

                {/* Arrow */}
                <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90 sm:rotate-0 flex-shrink-0" />

                {/* C - Consequence */}
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 w-full sm:w-auto sm:min-w-[140px]">
                  <span className="text-2xl font-bold text-rose-500 mb-1">C</span>
                  <span className="text-sm font-medium text-foreground">Emotion</span>
                  <span className="text-xs text-muted-foreground mt-1">How you feel</span>
                </div>
              </div>

              {/* 💡 The Key Insight - Where minds are blown */}
              <div className="rounded-xl bg-primary/5 border border-primary/20 p-5 text-center">
                <p className="text-foreground font-medium mb-2">
                  The Key Insight
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Events don&apos;t cause emotions. Your <strong className="text-foreground">BELIEFS</strong> about events do.
                </p>
                <p className="text-sm text-muted-foreground mt-3">
                  This is why two people can experience the same event and feel completely different.
                </p>
              </div>
            </section>

            {/* 🔮 What Makes This Different */}
            <section className="rounded-2xl border border-border bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
              <h2 className="font-serif text-2xl text-foreground mb-4 flex items-center gap-3">
                <Brain className="h-6 w-6 text-primary" />
                Why This Approach Works
              </h2>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary font-semibold flex-shrink-0">1.</span>
                  <span>
                    <strong className="text-foreground">It&apos;s evidence-based</strong> — grounded in CBT and REBT,
                    developed by Dr. Albert Ellis and used by therapists worldwide.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-semibold flex-shrink-0">2.</span>
                  <span>
                    <strong className="text-foreground">It puts you in control</strong> — you learn to identify and
                    change the beliefs that create your suffering.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-semibold flex-shrink-0">3.</span>
                  <span>
                    <strong className="text-foreground">It&apos;s sustainable</strong> — once you learn the skill of
                    disputing irrational beliefs, you have it for life.
                  </span>
                </li>
              </ul>
            </section>

            {/* 🎪 CTA Section - The Grand Finale */}
            <div className="text-center pt-4">
              <p className="text-muted-foreground mb-6">
                Ready to begin your journey from distress to peace?
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Start a Conversation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
