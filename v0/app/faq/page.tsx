'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { AmbientBackground } from '@/components/layout/ambient-background'
import { ChevronDown, HelpCircle, MessageCircle, Shield, Heart } from 'lucide-react'
import Link from 'next/link'

/**
 * 🎭 The FAQ Page - The Oracle of Curious Minds
 *
 * "When seekers knock upon the doors of wisdom,
 * the accordion unfolds its secrets, one revelation at a time.
 * Every question deserves an answer served with care."
 *
 * - The Spellbinding Museum Director of Curiosity
 */

// 🔮 Types for our mystical FAQ structure
interface FAQItem {
  question: string
  answer: string
}

interface FAQSection {
  title: string
  icon: React.ReactNode
  items: FAQItem[]
}

/**
 * 🌟 The Accordion Item - A Portal to Hidden Knowledge
 *
 * Opens and closes like a gentle flower responding to sunlight.
 * Each click reveals wisdom, each collapse preserves the mystery. 🌸
 */
function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-border last:border-b-0">
      {/* 🎪 The clickable header - where curiosity meets courage */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left hover:text-primary transition-colors group"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
          {question}
        </span>
        {/* ✨ The magical rotating chevron - spins like a compass finding truth */}
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {/* 🌊 The answer container - flows open like gentle waves */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 pb-4' : 'max-h-0'
        }`}
      >
        <p className="text-muted-foreground leading-relaxed pr-8">
          {answer}
        </p>
      </div>
    </div>
  )
}

/**
 * 🎭 The FAQ Accordion Section - A Chapter in the Book of Answers
 *
 * Groups related questions together like constellations in the night sky.
 * Each section is a themed collection of wisdom waiting to be discovered. 🌌
 */
function FAQAccordionSection({ section }: { section: FAQSection }) {
  // 🧠 The cosmic state keeper - remembers which portals are open
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // 🔄 Toggle handler - opens one, closes the rest (accordion style, baby!)
  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="rounded-2xl border border-border bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
      {/* 🏷️ Section header with mystical icon */}
      <h2 className="font-serif text-2xl text-foreground mb-6 flex items-center gap-3">
        {section.icon}
        {section.title}
      </h2>
      {/* 📚 The accordion items - stacked like ancient scrolls */}
      <div className="divide-y divide-border">
        {section.items.map((item, index) => (
          <AccordionItem
            key={index}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </div>
    </section>
  )
}

/**
 * 🌟 The Main FAQ Page - Where Questions Find Their Destiny
 *
 * A sanctuary for the curious, a library for the confused,
 * a gentle guide through the labyrinth of "how does this work?" 🗺️
 */
export default function FAQPage() {
  // 📜 The sacred scrolls of frequently asked questions
  const faqSections: FAQSection[] = [
    {
      title: 'About My 4 Blocks',
      icon: <Heart className="h-6 w-6 text-primary" />,
      items: [
        {
          question: 'What is My 4 Blocks?',
          answer: 'My 4 Blocks is an AI-powered emotional wellness companion based on Cognitive Behavioral Therapy (CBT) and Rational Emotive Behavior Therapy (REBT). It helps you understand and transform difficult emotions by identifying the four emotional blocks — Anger, Anxiety, Depression, and Guilt — and the thought patterns that create them.'
        },
        {
          question: 'Is this a replacement for therapy?',
          answer: 'No, My 4 Blocks is an educational and self-help tool, not a replacement for professional mental health care. It\'s designed to complement therapy by helping you understand CBT/REBT principles between sessions, or as a starting point for self-exploration. If you\'re experiencing severe distress, please reach out to a qualified mental health professional.'
        },
        {
          question: 'Who is Dr. Vincent E. Parr?',
          answer: 'Dr. Vincent E. Parr is a psychologist who spent 25+ years developing and teaching the "4 Blocks" methodology, a practical application of Albert Ellis\'s REBT principles. His work simplifies complex psychological concepts into an accessible framework that anyone can use to understand their emotional patterns.'
        },
        {
          question: 'What is CBT/REBT?',
          answer: 'Cognitive Behavioral Therapy (CBT) and Rational Emotive Behavior Therapy (REBT) are evidence-based psychological approaches that focus on the connection between thoughts, emotions, and behaviors. REBT, developed by Dr. Albert Ellis, teaches that it\'s not events that upset us, but our beliefs about those events. By identifying and challenging irrational beliefs, we can transform our emotional responses.'
        }
      ]
    },
    {
      title: 'Using the App',
      icon: <MessageCircle className="h-6 w-6 text-primary" />,
      items: [
        {
          question: 'How do I get started?',
          answer: 'Simply start a conversation! Share what\'s on your mind — a situation that\'s bothering you, an emotion you\'re feeling, or a thought pattern you want to explore. The AI will guide you through the process of understanding your emotions using the 4 Blocks framework and the ABC model.'
        },
        {
          question: 'What are the four blocks?',
          answer: 'The four blocks are Anger, Anxiety, Depression, and Guilt. These are considered the primary "blocking" emotions that prevent happiness. Anger comes from demanding others be different; Anxiety from catastrophizing the future; Depression from rating yourself as worthless; and Guilt from demanding you should have acted differently. Understanding which block you\'re experiencing helps target the specific irrational beliefs creating it.'
        },
        {
          question: 'How long does a session take?',
          answer: 'Sessions are self-paced and can be as short or long as you need. A quick check-in might take 5-10 minutes, while a deeper exploration of a challenging situation could take 20-30 minutes. The app is designed to fit your schedule and needs.'
        },
        {
          question: 'Can I save my conversations?',
          answer: 'Your conversation history is maintained during your session, allowing you to review and reflect on your progress. For privacy, conversations are not permanently stored unless you explicitly choose to save them.'
        }
      ]
    },
    {
      title: 'Privacy & Data',
      icon: <Shield className="h-6 w-6 text-primary" />,
      items: [
        {
          question: 'Is my data secure?',
          answer: 'Yes, we take your privacy seriously. All communications are encrypted, and we follow industry-standard security practices. Your personal reflections and emotional explorations are treated with the utmost confidentiality.'
        },
        {
          question: 'Do you store my conversations?',
          answer: 'Conversation data is processed in real-time to provide responses but is not permanently stored on our servers by default. We prioritize your privacy and minimize data retention. Any analytics we collect are anonymized and used solely to improve the service.'
        },
        {
          question: 'How can I delete my data?',
          answer: 'You can request deletion of any stored data by contacting our support team. We respect your right to privacy and will process deletion requests promptly in accordance with applicable privacy laws.'
        }
      ]
    },
    {
      title: 'Getting Help',
      icon: <HelpCircle className="h-6 w-6 text-primary" />,
      items: [
        {
          question: 'What if I\'m in crisis?',
          answer: 'If you\'re in crisis or having thoughts of self-harm, please reach out immediately to a crisis helpline. In the US, call or text 988 (Suicide and Crisis Lifeline). In the UK, call 116 123 (Samaritans). For other countries, visit findahelpline.com. My 4 Blocks is not equipped to handle crisis situations — please seek professional help immediately.'
        },
        {
          question: 'Where can I find a therapist?',
          answer: 'You can find a qualified therapist through resources like Psychology Today\'s therapist directory (psychologytoday.com), the Albert Ellis Institute (albertellis.org), or by asking your primary care physician for a referral. Look for therapists who specialize in CBT or REBT for approaches aligned with My 4 Blocks.'
        },
        {
          question: 'How can I learn more about CBT?',
          answer: 'Great resources include "A Guide to Rational Living" by Albert Ellis, "Feeling Good" by David Burns, and the Albert Ellis Institute website. Many therapists also offer CBT workbooks and courses. My 4 Blocks itself is designed to teach CBT/REBT principles through practice.'
        }
      ]
    }
  ]

  return (
    <div className="flex flex-col min-h-dvh bg-background relative">
      <AmbientBackground />
      <Header />
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          {/* 🎪 Hero Section - The Grand Welcome */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Everything you need to know about My 4 Blocks and your journey to emotional clarity.
            </p>
          </div>

          {/* 📚 The Accordion Sections - Chapters of Wisdom */}
          <div className="space-y-8">
            {faqSections.map((section, index) => (
              <FAQAccordionSection key={index} section={section} />
            ))}
          </div>

          {/* 🌟 Still Have Questions? - The Safety Net */}
          <section className="rounded-2xl border border-border bg-muted/30 p-6 sm:p-8 mt-10 text-center">
            <h2 className="font-serif text-xl text-foreground mb-3">
              Still have questions?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              We&apos;re here to help. Reach out and we&apos;ll get back to you as soon as possible.
            </p>
            <Link
              href="mailto:support@my4blocks.com"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Contact Support
            </Link>
          </section>

          {/* 🎯 CTA - The Invitation to Begin */}
          <div className="text-center pt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Start a Conversation
              <MessageCircle className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
