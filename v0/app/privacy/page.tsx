'use client'

import { Header } from '@/components/layout/header'
import { AmbientBackground } from '@/components/layout/ambient-background'
import { Shield, Lock, Eye, FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'

/**
 * 🛡️ The Privacy Policy Page - Guardian of Digital Trust
 *
 * "In the theater of data, transparency is the noblest virtue.
 * Here we illuminate the sacred covenant between user and service,
 * where trust is the currency and clarity the law."
 *
 * - The Spellbinding Museum Director of Data Sanctuaries
 */
export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background relative">
      <AmbientBackground />
      <Header />
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          {/* 🌟 Hero - The Grand Entrance to Our Privacy Sanctuary */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Your trust is sacred. Here&apos;s how we protect and respect your data.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: January 31, 2026
            </p>
          </div>

          {/* 📜 Main Content - The Scrolls of Digital Covenant */}
          <div className="space-y-10">
            {/* 🔍 What We Collect - The Gathering of Necessary Wisdoms */}
            <section className="rounded-2xl border border-border bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
              <h2 className="font-serif text-2xl text-foreground mb-4 flex items-center gap-3">
                <Eye className="h-6 w-6 text-primary" />
                What Data We Collect
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect only what&apos;s necessary to provide you with a meaningful,
                personalized experience:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary font-semibold shrink-0">•</span>
                  <span><strong className="text-foreground">Conversation History:</strong> Your chat messages
                  are stored to maintain context and provide continuity in your sessions.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-semibold shrink-0">•</span>
                  <span><strong className="text-foreground">Device Identifier:</strong> A randomly generated
                  device ID stored in cookies helps us recognize returning users without requiring account creation.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-semibold shrink-0">•</span>
                  <span><strong className="text-foreground">Usage Analytics:</strong> Anonymous usage data
                  collected via Vercel Analytics helps us understand how people use the app and improve the experience.</span>
                </li>
              </ul>
            </section>

            {/* 🎯 How We Use Data - The Purpose Behind the Collection */}
            <section className="rounded-2xl border border-border bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
              <h2 className="font-serif text-2xl text-foreground mb-4 flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                How We Use Your Data
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Your data serves one primary purpose: making My 4 Blocks better for you.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary font-semibold shrink-0">1.</span>
                  <span><strong className="text-foreground">Provide the Service:</strong> Your conversations
                  enable AI responses tailored to your emotional journey and context.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-semibold shrink-0">2.</span>
                  <span><strong className="text-foreground">Session Continuity:</strong> The device ID
                  ensures your conversation history persists across sessions.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-semibold shrink-0">3.</span>
                  <span><strong className="text-foreground">Improve Experience:</strong> Analytics help us
                  identify areas for improvement and understand usage patterns.</span>
                </li>
              </ul>
            </section>

            {/* 🚫 What We DON'T Collect - The Sacred Boundaries */}
            <section className="rounded-2xl border border-border bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
              <h2 className="font-serif text-2xl text-foreground mb-4 flex items-center gap-3">
                <Lock className="h-6 w-6 text-primary" />
                What We Don&apos;t Collect
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We believe in minimal data collection. Here&apos;s what we <strong className="text-foreground">never</strong> collect:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-destructive font-semibold shrink-0">✗</span>
                  <span><strong className="text-foreground">Protected Health Information (PHI):</strong> We
                  are not a healthcare provider and do not collect or store PHI as defined by HIPAA.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-destructive font-semibold shrink-0">✗</span>
                  <span><strong className="text-foreground">Login Credentials:</strong> No accounts,
                  no passwords, no email addresses required.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-destructive font-semibold shrink-0">✗</span>
                  <span><strong className="text-foreground">Precise Location:</strong> We don&apos;t track
                  GPS coordinates or precise geolocation data.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-destructive font-semibold shrink-0">✗</span>
                  <span><strong className="text-foreground">Financial Information:</strong> No payment
                  data is collected through this application.</span>
                </li>
              </ul>
            </section>

            {/* 🤝 Data Sharing - Our Trusted Partners */}
            <section className="rounded-2xl border border-border bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
              <h2 className="font-serif text-2xl text-foreground mb-4 flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                Data Sharing
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We share data only with essential service providers:
              </p>
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-card/50 p-5">
                  <h3 className="font-semibold text-foreground mb-2">OpenAI</h3>
                  <p className="text-sm text-muted-foreground">
                    Your conversation messages are sent to OpenAI&apos;s API to generate thoughtful,
                    contextual responses. OpenAI processes this data according to their
                    <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer"
                       className="text-primary hover:underline ml-1">privacy policy</a>.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card/50 p-5">
                  <h3 className="font-semibold text-foreground mb-2">Vercel</h3>
                  <p className="text-sm text-muted-foreground">
                    Anonymous analytics data is processed by Vercel to help us understand
                    usage patterns and improve performance. See their
                    <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer"
                       className="text-primary hover:underline ml-1">privacy policy</a>.
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We do not sell your data to third parties. Ever.
              </p>
            </section>

            {/* 🍪 Cookie Usage - The Digital Breadcrumbs */}
            <section className="rounded-2xl border border-border bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
              <h2 className="font-serif text-2xl text-foreground mb-4">
                Cookie Usage
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use a single essential cookie:
              </p>
              <div className="rounded-xl border border-border bg-card/50 p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground font-mono text-sm">device_id</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Essential</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  A randomly generated identifier that enables session continuity without
                  requiring account creation. This cookie allows you to return to previous
                  conversations and maintains your chat history.
                </p>
              </div>
            </section>

            {/* ⚖️ Your Rights - Power to the User */}
            <section className="rounded-2xl border border-border bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
              <h2 className="font-serif text-2xl text-foreground mb-4">
                Your Rights
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You have control over your data:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary font-semibold shrink-0">•</span>
                  <span><strong className="text-foreground">Request Data Deletion:</strong> Contact us
                  to request complete deletion of your conversation history and associated data.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-semibold shrink-0">•</span>
                  <span><strong className="text-foreground">Clear Cookies:</strong> You can clear your
                  browser cookies at any time to remove your device identifier. This will start
                  a fresh session with no history.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-semibold shrink-0">•</span>
                  <span><strong className="text-foreground">Access Your Data:</strong> You may request
                  a copy of the data we have associated with your device ID.</span>
                </li>
              </ul>
            </section>

            {/* ⚠️ Important Disclaimer - The Sacred Warning */}
            <section className="rounded-2xl border border-border bg-muted/30 p-6 sm:p-8">
              <h2 className="font-serif text-xl text-foreground mb-3 flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                Important Disclaimer
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                <strong className="text-foreground">My 4 Blocks is not a replacement for professional
                mental health care.</strong> While our AI companion is grounded in CBT and REBT
                principles, it is an educational and supportive tool — not a licensed therapist.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you&apos;re experiencing severe emotional distress, suicidal thoughts, or a mental
                health crisis, please reach out to a qualified mental health professional or contact
                emergency services immediately.
              </p>
            </section>

            {/* 📧 Contact - The Portal of Communication */}
            <section className="rounded-2xl border border-border bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
              <h2 className="font-serif text-2xl text-foreground mb-4">
                Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this privacy policy or wish to exercise your data rights,
                please contact us at:
              </p>
              <p className="mt-3">
                <a href="mailto:privacy@my4blocks.com"
                   className="text-primary hover:underline font-medium">
                  privacy@my4blocks.com
                </a>
              </p>
            </section>

            {/* 🎬 CTA - The Return to Journey */}
            <div className="text-center pt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Return Home
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
