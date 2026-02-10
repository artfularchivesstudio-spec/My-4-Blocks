'use client'

import { Header } from '@/components/layout/header'
import { AmbientBackground } from '@/components/layout/ambient-background'
import { ArrowRight, BookOpen, Quote, Sparkles } from 'lucide-react'
import Link from 'next/link'

/**
 * 📘 The Book Page - Honoring the source material
 *
 * Provides context about Dr. Vincent E. Parr's "You Only Have Four Problems"
 * and the lineage of CBT/REBT thought that informs this app. 📚✨
 */
export default function BookPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background relative">
      <AmbientBackground />
      <Header />
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-4">
              <BookOpen className="h-12 w-12 text-primary" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground mb-4">
              The Book
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              The wisdom behind My 4 Blocks
            </p>
          </div>

          {/* Main content */}
          <div className="space-y-10">
            {/* Book intro */}
            <section className="rounded-2xl border border-border bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
              <h2 className="font-serif text-2xl text-foreground mb-4">
                &quot;You Only Have Four Problems&quot;
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                by <strong className="text-foreground">Dr. Vincent E. Parr, Ph.D.</strong>
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This book presents a revolutionary yet simple idea: all of our emotional
                suffering can be traced back to just four core problems — Anger, Anxiety,
                Depression, and Guilt. More importantly, it shows that these emotions are
                not caused by external events, but by our own <em>beliefs</em> about those events.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Drawing on decades of research in Cognitive Behavioral Therapy (CBT) and
                Rational Emotive Behavior Therapy (REBT), Dr. Parr provides practical
                tools for identifying and disputing the irrational beliefs that create
                emotional disturbance.
              </p>
            </section>

            {/* Key quote */}
            <section className="relative">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 sm:p-10">
                <Quote className="h-8 w-8 text-primary/40 mb-4" />
                <blockquote className="font-serif text-xl sm:text-2xl text-foreground leading-relaxed mb-4">
                  &quot;Nothing and no one has ever upset you.&quot;
                </blockquote>
                <footer className="text-muted-foreground">
                  — Dr. Vincent E. Parr
                </footer>
              </div>
            </section>

            {/* The lineage */}
            <section className="rounded-2xl border border-border bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
              <h2 className="font-serif text-2xl text-foreground mb-4">
                The Intellectual Lineage
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The book builds upon the groundbreaking work of several pioneers:
              </p>
              <ul className="space-y-4 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Dr. Albert Ellis</strong> — founder of
                  Rational Emotive Behavior Therapy (REBT), who first identified the ABC
                  model of emotions.
                </li>
                <li>
                  <strong className="text-foreground">Dr. Aaron Beck</strong> — founder of
                  Cognitive Behavioral Therapy (CBT), whose work on cognitive distortions
                  transformed psychology.
                </li>
                <li>
                  <strong className="text-foreground">The Stoic philosophers</strong> —
                  Epictetus, Marcus Aurelius, and Seneca, who taught that our judgments
                  about events, not the events themselves, cause our suffering.
                </li>
                <li>
                  <strong className="text-foreground">Byron Katie</strong> — whose &quot;The
                  Work&quot; provides practical disputing questions for challenging beliefs.
                </li>
              </ul>
            </section>

            {/* Core teachings */}
            <section className="rounded-2xl border border-border bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
              <h2 className="font-serif text-2xl text-foreground mb-4">
                Core Teachings
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">The Seven Irrational Beliefs</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>&apos;It&apos; Statements</strong> — blaming external things for our emotions</li>
                    <li>• <strong>Awfulizing</strong> — exaggerating unpleasantness to catastrophic levels</li>
                    <li>• <strong>I Can&apos;t Stand It</strong> — believing we cannot survive current conditions</li>
                    <li>• <strong>Shoulds, Musts, and Demands</strong> — rigid demands that reality be different</li>
                    <li>• <strong>Rating</strong> — labeling self or others as worthless based on behavior</li>
                    <li>• <strong>Absolutistic Thinking</strong> — using words like &quot;always&quot;, &quot;never&quot;, &quot;everyone&quot;</li>
                    <li>• <strong>Entitlement</strong> — believing we deserve special treatment</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">The Disputing Questions</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Is it true?</li>
                    <li>Is it absolutely true (100%)?</li>
                    <li>How do you feel when you believe this thought?</li>
                    <li>How would you feel if this thought never entered your mind?</li>
                  </ol>
                </div>
              </div>
            </section>

            {/* More quotes */}
            <section>
              <h2 className="font-serif text-2xl text-foreground mb-6 text-center">
                Words of Wisdom
              </h2>
              <div className="grid gap-4">
                <div className="rounded-xl border border-border bg-card/50 p-5">
                  <p className="text-muted-foreground italic mb-2">
                    &quot;It is the beliefs we hold that go unchallenged that have the potential
                    for causing us the most harm.&quot;
                  </p>
                  <p className="text-xs text-muted-foreground/70">— Dōgen</p>
                </div>
                <div className="rounded-xl border border-border bg-card/50 p-5">
                  <p className="text-muted-foreground italic mb-2">
                    &quot;We cannot choose our external circumstances, but we can always choose
                    how we respond to them.&quot;
                  </p>
                  <p className="text-xs text-muted-foreground/70">— Epictetus</p>
                </div>
                <div className="rounded-xl border border-border bg-card/50 p-5">
                  <p className="text-muted-foreground italic mb-2">
                    &quot;A thought is just a thought. It has no power except the power you give it.&quot;
                  </p>
                  <p className="text-xs text-muted-foreground/70">— From the book</p>
                </div>
              </div>
            </section>

            {/* CTA */}
            <div className="text-center pt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                Try It Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
