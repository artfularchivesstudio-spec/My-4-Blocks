'use client'

import { Header } from '@/components/layout/header'
import { AmbientBackground } from '@/components/layout/ambient-background'
import { ArrowRight, Brain, Heart, Lightbulb, Shield } from 'lucide-react'
import Link from 'next/link'

/**
 * 🌟 The About Page - A gentle introduction to the philosophy
 *
 * Explains the CBT/REBT foundation and how My 4 Blocks helps users
 * understand their emotional landscape. Knowledge is power, served warm. 🫖
 */
export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background relative">
      <AmbientBackground />
      <Header />
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground mb-4">
              About My 4 Blocks
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              A calm, supportive guide grounded in proven psychological principles.
            </p>
          </div>

          {/* Main content */}
          <div className="space-y-10">
            {/* What it is */}
            <section className="rounded-2xl border border-border bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
              <h2 className="font-serif text-2xl text-foreground mb-4 flex items-center gap-3">
                <Heart className="h-6 w-6 text-primary" />
                What is My 4 Blocks?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                My 4 Blocks is an AI-powered companion that helps you understand and
                transform difficult emotions. It&apos;s based on Cognitive Behavioral
                Therapy (CBT) and Rational Emotive Behavior Therapy (REBT) — proven
                approaches developed by pioneers like Dr. Albert Ellis.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The name comes from the core insight: there are only <strong className="text-foreground">four emotional
                blocks</strong> that prevent happiness — Anger, Anxiety, Depression, and Guilt.
                Understanding how you create these emotions is the first step to freedom.
              </p>
            </section>

            {/* The Four Blocks */}
            <section>
              <h2 className="font-serif text-2xl text-foreground mb-6 text-center">
                The Four Emotional Blocks
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-card/50 p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-4 w-4 rounded-sm bg-anger" />
                    <h3 className="font-semibold text-foreground">Anger</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Created when we demand others or situations be different than they are.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card/50 p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-4 w-4 rounded-sm bg-anxiety" />
                    <h3 className="font-semibold text-foreground">Anxiety</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Created when we catastrophize about the future and tell ourselves we
                    &quot;can&apos;t stand&quot; potential outcomes.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card/50 p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-4 w-4 rounded-sm bg-depression" />
                    <h3 className="font-semibold text-foreground">Depression</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Created when we rate ourselves as worthless or inadequate.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card/50 p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-4 w-4 rounded-sm bg-guilt" />
                    <h3 className="font-semibold text-foreground">Guilt</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Created when we demand we &quot;should&quot; have acted differently and rate
                    ourselves negatively for past actions.
                  </p>
                </div>
              </div>
            </section>

            {/* How it works */}
            <section className="rounded-2xl border border-border bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
              <h2 className="font-serif text-2xl text-foreground mb-4 flex items-center gap-3">
                <Brain className="h-6 w-6 text-primary" />
                How It Works
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The foundation is the <strong className="text-foreground">ABC Model</strong>:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground w-6">A</span>
                  <span><strong>Activating Event</strong> — what happens to you</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground w-6">B</span>
                  <span><strong>Belief</strong> — the thoughts you tell yourself about the event</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground w-6">C</span>
                  <span><strong>Consequence</strong> — your emotional, behavioral, and physical response</span>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <em>Key insight:</em> Events (A) don&apos;t cause your emotions (C). Your
                <strong className="text-foreground"> beliefs</strong> (B) about events create your emotions.
                This is why two people can experience the same event and feel completely different.
              </p>
            </section>

            {/* Core principles */}
            <section className="rounded-2xl border border-border bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
              <h2 className="font-serif text-2xl text-foreground mb-4 flex items-center gap-3">
                <Lightbulb className="h-6 w-6 text-primary" />
                Core Principles
              </h2>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary font-semibold">1.</span>
                  <span>You create and maintain 100% of your thoughts, feelings, and behavior.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-semibold">2.</span>
                  <span>It is essential to become aware of how you create your emotions.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-semibold">3.</span>
                  <span>It is essential to learn how to dispute and let go of negative emotions rapidly.</span>
                </li>
              </ul>
            </section>

            {/* Disclaimer */}
            <section className="rounded-2xl border border-border bg-muted/30 p-6 sm:p-8">
              <h2 className="font-serif text-xl text-foreground mb-3 flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                Important Note
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                My 4 Blocks is an educational tool, not a replacement for professional mental
                health care. If you&apos;re experiencing severe distress, please reach out to a
                qualified therapist or counselor. This app is designed to complement — not
                replace — professional support.
              </p>
            </section>

            {/* CTA */}
            <div className="text-center pt-4">
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
