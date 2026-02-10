'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { AmbientBackground } from '@/components/layout/ambient-background'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  ArrowRight,
  Brain,
  Flame,
  CloudLightning,
  Moon,
  Scale,
  BookOpen,
  Lightbulb,
  HelpCircle,
  RefreshCw,
  Target,
  Ban,
  AlertTriangle,
  ThumbsDown,
  Ruler,
  Infinity,
  Crown,
} from 'lucide-react'
import Link from 'next/link'

/**
 * 🎭 The Framework Page - A Deep Dive into the Alchemist's Grimoire
 *
 * "Where seekers of wisdom discover the mystical architecture of emotional
 * transformation. The ABC Model awaits, the Four Blocks stand sentinel,
 * and the Seven Irrational Beliefs reveal their true nature."
 *
 * This comprehensive page unfolds like an ancient scroll, revealing the
 * full depth of CBT/REBT wisdom through expandable accordion sections.
 * Each concept is color-coded, carefully explained, and ready to illuminate.
 *
 * - The Spellbinding Museum Director of Cognitive Clarity 🧙‍♂️
 */

// 🌟 The mystical color mappings for each emotional block
// These align with our CSS variables: anger=red, anxiety=amber, depression=blue, guilt=purple
const blockColors = {
  anger: 'bg-anger',
  anxiety: 'bg-anxiety',
  depression: 'bg-depression',
  guilt: 'bg-guilt',
} as const

// ✨ Type definitions for our cosmic data structures
interface IrrationalBelief {
  number: number
  title: string
  subtitle: string
  description: string
  examples: string[]
  antidote: string
  icon: React.ReactNode
}

interface Block {
  name: string
  color: keyof typeof blockColors
  icon: React.ReactNode
  corePattern: string
  triggerThoughts: string[]
  physicalSigns: string[]
  behaviors: string[]
  healthyAlternative: string
}

// 🔮 The Four Emotional Blocks - Detailed definitions
const fourBlocks: Block[] = [
  {
    name: 'Anger',
    color: 'anger',
    icon: <Flame className="h-5 w-5" />,
    corePattern: 'Demanding that others or the world be different than they are',
    triggerThoughts: [
      '"They SHOULD treat me fairly!"',
      '"The world MUST be just!"',
      '"How DARE they do this to me!"',
      '"This is absolutely UNACCEPTABLE!"',
      '"They have no RIGHT to..."',
    ],
    physicalSigns: [
      'Increased heart rate and blood pressure',
      'Tension in jaw, neck, and shoulders',
      'Clenched fists',
      'Feeling hot or flushed',
      'Rapid, shallow breathing',
    ],
    behaviors: [
      'Yelling or raising voice',
      'Aggressive body language',
      'Passive-aggressive actions',
      'Holding grudges and resentment',
      'Seeking revenge or retaliation',
    ],
    healthyAlternative:
      'Preference and disappointment. "I would strongly prefer they act fairly, and I\'m disappointed they didn\'t, but I can accept this imperfect reality."',
  },
  {
    name: 'Anxiety',
    color: 'anxiety',
    icon: <CloudLightning className="h-5 w-5" />,
    corePattern: 'Catastrophizing about the future and believing you cannot survive discomfort',
    triggerThoughts: [
      '"What if the worst happens?!"',
      '"I CAN\'T STAND this uncertainty!"',
      '"This will be AWFUL and TERRIBLE!"',
      '"I absolutely MUST have certainty!"',
      '"If this happens, I\'ll fall apart!"',
    ],
    physicalSigns: [
      'Racing heart and palpitations',
      'Sweating and trembling',
      'Shortness of breath',
      'Nausea or stomach upset',
      'Difficulty sleeping',
    ],
    behaviors: [
      'Excessive worrying and rumination',
      'Avoidance of feared situations',
      'Seeking constant reassurance',
      'Over-preparing and over-planning',
      'Procrastination due to fear',
    ],
    healthyAlternative:
      'Concern and caution. "I prefer things go well, and I\'ll prepare reasonably. If challenges arise, I can handle discomfort—it\'s uncomfortable, not unbearable."',
  },
  {
    name: 'Depression',
    color: 'depression',
    icon: <Moon className="h-5 w-5" />,
    corePattern: 'Rating yourself as worthless, inadequate, or fundamentally flawed',
    triggerThoughts: [
      '"I\'m worthless/useless/a failure."',
      '"I\'ll never be good enough."',
      '"Nothing will ever get better."',
      '"I don\'t deserve happiness."',
      '"What\'s the point of trying?"',
    ],
    physicalSigns: [
      'Low energy and fatigue',
      'Changes in appetite and sleep',
      'Feeling heavy or sluggish',
      'Loss of interest in activities',
      'Difficulty concentrating',
    ],
    behaviors: [
      'Social withdrawal and isolation',
      'Neglecting responsibilities',
      'Loss of motivation',
      'Ruminating on past failures',
      'Giving up on goals',
    ],
    healthyAlternative:
      'Sadness and self-acceptance. "I made a mistake, and that\'s disappointing. But I am a complex human who cannot be rated by any single action. I accept myself unconditionally."',
  },
  {
    name: 'Guilt',
    color: 'guilt',
    icon: <Scale className="h-5 w-5" />,
    corePattern: 'Demanding you should have acted differently and condemning yourself for past actions',
    triggerThoughts: [
      '"I SHOULD have known better!"',
      '"How could I have done that?!"',
      '"I\'m a terrible person for..."',
      '"I MUST make this right!"',
      '"I don\'t deserve forgiveness."',
    ],
    physicalSigns: [
      'Heaviness in chest',
      'Difficulty making eye contact',
      'Feeling physically small',
      'Tension and restlessness',
      'Sleep disturbance from rumination',
    ],
    behaviors: [
      'Excessive apologizing',
      'Self-punishment and deprivation',
      'Overcompensating to make amends',
      'Avoiding reminders of the action',
      'Seeking reassurance repeatedly',
    ],
    healthyAlternative:
      'Remorse and self-forgiveness. "I regret my action and wish I\'d done differently. I\'ll make amends where possible and learn from this. But I won\'t eternally condemn myself—I was doing my best with the awareness I had."',
  },
]

// 📜 The Seven Irrational Beliefs - The full grimoire
const sevenIrrationalBeliefs: IrrationalBelief[] = [
  {
    number: 1,
    title: '"It" Statements',
    subtitle: 'Blaming External Things',
    icon: <Target className="h-5 w-5 text-muted-foreground" />,
    description:
      'Believing that external events, people, or circumstances directly cause our emotions. This removes personal responsibility and leaves us feeling powerless.',
    examples: [
      '"It makes me so angry when..."',
      '"They made me feel terrible."',
      '"The weather ruined my mood."',
      '"This situation is making me anxious."',
      '"You hurt my feelings."',
    ],
    antidote:
      'Replace "it/they made me feel" with "I created feelings of ___ when I thought ___." You are the author of your emotional story, not external events.',
  },
  {
    number: 2,
    title: 'Awfulizing',
    subtitle: 'Catastrophic Exaggeration',
    icon: <AlertTriangle className="h-5 w-5 text-muted-foreground" />,
    description:
      'Exaggerating negative events to catastrophic proportions. Turning inconveniences into disasters, setbacks into tragedies, and difficulties into the worst possible outcomes.',
    examples: [
      '"This is the WORST thing ever!"',
      '"My life is completely ruined!"',
      '"This is absolutely TERRIBLE!"',
      '"It\'s a complete DISASTER!"',
      '"Everything is falling apart!"',
    ],
    antidote:
      'Ask: "On a scale of 0-100%, how bad is this really?" Remember: very few things in life are truly 100% awful. Most challenges are inconvenient, not catastrophic.',
  },
  {
    number: 3,
    title: 'I Can\'t Stand It',
    subtitle: 'Low Frustration Tolerance',
    icon: <Ban className="h-5 w-5 text-muted-foreground" />,
    description:
      'Believing we cannot survive or cope with discomfort, difficulty, or unpleasant situations. This belief makes us fragile and avoidant.',
    examples: [
      '"I can\'t stand this anymore!"',
      '"This is unbearable!"',
      '"I can\'t take this!"',
      '"I\'ll die if this happens!"',
      '"I can\'t handle any more!"',
    ],
    antidote:
      'Challenge: "I am standing it right now. I\'ve survived 100% of my worst days so far. I can tolerate discomfort—I just don\'t prefer it."',
  },
  {
    number: 4,
    title: 'Shoulds, Musts, Demands',
    subtitle: 'Rigid Requirements',
    icon: <ThumbsDown className="h-5 w-5 text-muted-foreground" />,
    description:
      'Turning preferences into absolute demands. The world MUST be a certain way, people SHOULD act as we expect, and things HAVE TO go our way. This is the core of most emotional disturbance.',
    examples: [
      '"You SHOULD have known!"',
      '"I MUST succeed!"',
      '"They HAVE TO respect me!"',
      '"Life SHOULDN\'T be this hard!"',
      '"I OUGHT TO be perfect!"',
    ],
    antidote:
      'Transform demands into preferences: "I would strongly prefer ___, but I accept reality doesn\'t always match my preferences. I can cope with this disappointment."',
  },
  {
    number: 5,
    title: 'Rating',
    subtitle: 'Global Self/Other Labeling',
    icon: <Ruler className="h-5 w-5 text-muted-foreground" />,
    description:
      'Judging the entire worth of yourself or others based on specific behaviors or traits. Confusing actions with identity, mistakes with worthlessness.',
    examples: [
      '"I\'m such an idiot."',
      '"They\'re a complete jerk."',
      '"I\'m worthless."',
      '"She\'s a terrible person."',
      '"I\'m a total failure."',
    ],
    antidote:
      'Separate actions from identity: "I did something foolish" (not "I am foolish"). Humans are too complex to be globally rated. Rate behaviors, not beings.',
  },
  {
    number: 6,
    title: 'Absolutistic Thinking',
    subtitle: 'Always/Never/Everyone',
    icon: <Infinity className="h-5 w-5 text-muted-foreground" />,
    description:
      'Thinking in extreme, all-or-nothing terms. Using words like always, never, everyone, no one, everything, nothing—which are almost never literally true.',
    examples: [
      '"I ALWAYS mess things up."',
      '"Nobody EVER listens to me."',
      '"EVERYONE thinks I\'m stupid."',
      '"NOTHING ever works out."',
      '"I NEVER get what I want."',
    ],
    antidote:
      'Replace absolutes with accurate language: "sometimes," "often," "some people," "in this instance." Reality is nuanced, not absolute.',
  },
  {
    number: 7,
    title: 'Entitlement',
    subtitle: 'Deserving Special Treatment',
    icon: <Crown className="h-5 w-5 text-muted-foreground" />,
    description:
      'Believing you deserve special treatment, privileges, or outcomes simply because you want them or because of who you are. Expecting the universe to bend to your will.',
    examples: [
      '"I deserve better than this!"',
      '"After all I\'ve done, I should get..."',
      '"I\'ve earned the right to..."',
      '"It\'s not fair—I deserve..."',
      '"I shouldn\'t have to deal with this!"',
    ],
    antidote:
      'Accept: "The universe doesn\'t owe me anything. I can work toward what I want, but I\'m not entitled to specific outcomes. Fairness is a concept, not a guarantee."',
  },
]

// 🎭 Disputation techniques - The wizard's toolkit
const disputationTechniques = {
  ellis: {
    title: "Ellis's REBT Questions",
    subtitle: 'The Scientific Method for Beliefs',
    questions: [
      {
        question: 'Is this belief true?',
        explanation:
          'What evidence supports this belief? What evidence contradicts it? Would this hold up in a court of law?',
      },
      {
        question: 'Is this belief logical?',
        explanation:
          'Does the conclusion actually follow from the premises? Just because I want something, does that mean I must have it?',
      },
      {
        question: 'Is this belief helpful?',
        explanation:
          'Where does this belief get me? Does holding this belief help me achieve my goals or does it create suffering?',
      },
      {
        question: 'What would I tell a friend?',
        explanation:
          'If someone I cared about had this thought, what would I say to them? Why am I harder on myself?',
      },
    ],
  },
  byronKatie: {
    title: "Byron Katie's The Work",
    subtitle: 'Four Questions + Turnarounds',
    questions: [
      {
        question: 'Is it true?',
        explanation: 'Can you absolutely know that this thought is true? Sit with this deeply.',
      },
      {
        question: 'Can you absolutely know that it\'s true?',
        explanation:
          'Go deeper. Is there any scenario where this might not be 100% true?',
      },
      {
        question: 'How do you react when you believe that thought?',
        explanation:
          'What happens? How do you treat yourself and others? What do you feel in your body?',
      },
      {
        question: 'Who would you be without the thought?',
        explanation:
          'Close your eyes. Imagine you\'re in the same situation but you\'ve never had this thought. Who are you now?',
      },
    ],
    turnarounds: [
      {
        type: 'To the self',
        example: '"They should listen to me" → "I should listen to me"',
      },
      {
        type: 'To the other',
        example: '"They should listen to me" → "I should listen to them"',
      },
      {
        type: 'To the opposite',
        example: '"They should listen to me" → "They shouldn\'t listen to me"',
      },
    ],
  },
  stoic: {
    title: 'Stoic Philosophy Approach',
    subtitle: 'Ancient Wisdom for Modern Minds',
    principles: [
      {
        name: 'The Dichotomy of Control',
        description:
          'Distinguish what you can control (your thoughts, actions, values) from what you cannot (others\' actions, external events, outcomes). Focus only on the former.',
        practicalQuestion: 'Is this within my control? If not, why am I spending energy on it?',
      },
      {
        name: 'Memento Mori',
        description:
          'Remember that you are mortal. Life is finite. Will this matter on your deathbed? Does this align with how you want to spend your precious time?',
        practicalQuestion: 'Will this matter in 5 years? Am I living according to my values?',
      },
      {
        name: 'Amor Fati',
        description:
          'Love your fate. Not just accept what happens, but embrace it as necessary for your growth. Every obstacle is an opportunity.',
        practicalQuestion: 'How might this challenge be exactly what I need for growth?',
      },
      {
        name: 'View from Above',
        description:
          'Zoom out. See yourself from the cosmos. You are a tiny being on a tiny planet in a vast universe. Does this problem truly warrant cosmic despair?',
        practicalQuestion: 'How significant is this in the grand scope of existence?',
      },
    ],
  },
}

export default function FrameworkPage() {
  // 🌙 State for controlling which accordion sections are open
  const [openAbcSection, setOpenAbcSection] = useState<string | undefined>(undefined)

  return (
    <div className="flex flex-col min-h-dvh bg-background relative">
      <AmbientBackground />
      <Header />
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          {/* 🎭 Hero Section - The Grand Entrance */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground mb-4">
              The Framework
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A deep dive into the psychology behind emotional transformation. Understand the
              architecture of your mind and learn to reshape your emotional landscape.
            </p>
          </div>

          {/* 📚 Main content sections */}
          <div className="space-y-10">
            {/* ═══════════════════════════════════════════════════════════════
                🧠 THE ABC MODEL - The Foundation of All Wisdom
            ═══════════════════════════════════════════════════════════════ */}
            <section className="rounded-2xl border border-border bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
              <h2 className="font-serif text-2xl text-foreground mb-4 flex items-center gap-3">
                <Brain className="h-6 w-6 text-primary" />
                The ABC Model
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Developed by Dr. Albert Ellis, the ABC Model is the cornerstone of Rational
                Emotive Behavior Therapy (REBT). It reveals how our{' '}
                <strong className="text-foreground">beliefs</strong>, not events, create our
                emotional responses.
              </p>

              <Accordion
                type="single"
                collapsible
                value={openAbcSection}
                onValueChange={setOpenAbcSection}
                className="space-y-2"
              >
                {/* A = Activating Event */}
                <AccordionItem
                  value="a-event"
                  className="border border-border rounded-xl px-4 bg-card/50"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-serif text-lg font-semibold text-primary">
                        A
                      </span>
                      <span className="font-medium text-foreground">
                        Activating Event — What Happens
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pl-11">
                    <p className="mb-3">
                      The <strong className="text-foreground">Activating Event</strong> is any
                      situation, event, or stimulus that triggers our thought process. It&apos;s the
                      external reality—what actually happened, stripped of interpretation.
                    </p>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <p className="text-sm font-medium text-foreground">Examples:</p>
                      <ul className="text-sm space-y-1 ml-4 list-disc">
                        <li>Your boss gives you critical feedback on your report</li>
                        <li>A friend cancels plans at the last minute</li>
                        <li>You make a mistake during a presentation</li>
                        <li>Someone cuts you off in traffic</li>
                      </ul>
                    </div>
                    <p className="mt-3 text-sm italic">
                      Key insight: The event itself is neutral. It becomes &quot;good&quot; or
                      &quot;bad&quot; only through our interpretation.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                {/* B = Belief */}
                <AccordionItem
                  value="b-belief"
                  className="border border-border rounded-xl px-4 bg-card/50"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-serif text-lg font-semibold text-primary">
                        B
                      </span>
                      <span className="font-medium text-foreground">
                        Belief — What We Tell Ourselves
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pl-11">
                    <p className="mb-3">
                      The <strong className="text-foreground">Belief</strong> is your internal
                      interpretation of the event—the thoughts, evaluations, and meanings you
                      assign. This is where emotional disturbance is created or prevented.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2 mb-4">
                      <div className="bg-destructive/10 rounded-lg p-4">
                        <p className="text-sm font-medium text-destructive mb-2">
                          Irrational Beliefs:
                        </p>
                        <ul className="text-sm space-y-1">
                          <li>&quot;This is awful! I can&apos;t stand it!&quot;</li>
                          <li>&quot;They SHOULD have treated me better!&quot;</li>
                          <li>&quot;I&apos;m a complete failure.&quot;</li>
                        </ul>
                      </div>
                      <div className="bg-primary/10 rounded-lg p-4">
                        <p className="text-sm font-medium text-primary mb-2">Rational Beliefs:</p>
                        <ul className="text-sm space-y-1">
                          <li>&quot;This is unfortunate, but manageable.&quot;</li>
                          <li>&quot;I&apos;d prefer respect, but I can cope.&quot;</li>
                          <li>&quot;I made a mistake; I can learn from it.&quot;</li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-sm italic">
                      This is the leverage point. Change your beliefs, change your emotions.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                {/* C = Consequence */}
                <AccordionItem
                  value="c-consequence"
                  className="border border-border rounded-xl px-4 bg-card/50"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-serif text-lg font-semibold text-primary">
                        C
                      </span>
                      <span className="font-medium text-foreground">
                        Consequence — The Emotional Response
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pl-11">
                    <p className="mb-3">
                      The <strong className="text-foreground">Consequence</strong> is your
                      emotional, behavioral, and physical response. It includes feelings,
                      actions, and bodily sensations.
                    </p>
                    <div className="space-y-3">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm font-medium text-foreground mb-2">
                          Emotional consequences:
                        </p>
                        <p className="text-sm">
                          Anger, anxiety, depression, guilt, shame, jealousy, hurt, etc.
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm font-medium text-foreground mb-2">
                          Behavioral consequences:
                        </p>
                        <p className="text-sm">
                          Avoidance, aggression, withdrawal, procrastination, substance use, etc.
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm font-medium text-foreground mb-2">
                          Physical consequences:
                        </p>
                        <p className="text-sm">
                          Racing heart, tension, fatigue, insomnia, stomach upset, etc.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* The Key Insight */}
                <AccordionItem
                  value="key-insight"
                  className="border-2 border-primary/30 rounded-xl px-4 bg-primary/5"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Lightbulb className="h-6 w-6 text-primary" />
                      <span className="font-medium text-foreground">
                        The Key Insight: B Causes C, Not A
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <div className="bg-card rounded-lg p-4 space-y-4">
                      <p className="font-medium text-foreground text-center text-lg">
                        A → B → C (not A → C)
                      </p>
                      <p>
                        Most people believe that events (A) directly cause their emotions (C).
                        &quot;He made me angry.&quot; &quot;The traffic stressed me out.&quot;
                      </p>
                      <p>
                        But the truth is:{' '}
                        <strong className="text-foreground">
                          your beliefs (B) about events create your emotions
                        </strong>
                        . This is why two people can experience the same event and feel
                        completely different emotions.
                      </p>
                      <div className="bg-muted/50 rounded-lg p-4 text-sm">
                        <p className="font-medium text-foreground mb-2">Example:</p>
                        <p className="mb-2">
                          <strong>Event:</strong> Boss gives critical feedback.
                        </p>
                        <p className="mb-2">
                          <strong>Person 1&apos;s belief:</strong> &quot;I&apos;m a failure. I&apos;ll
                          probably get fired.&quot; → Feels depressed and anxious.
                        </p>
                        <p>
                          <strong>Person 2&apos;s belief:</strong> &quot;Good feedback helps me
                          improve. I can learn from this.&quot; → Feels motivated.
                        </p>
                      </div>
                      <p className="italic text-center">
                        You are the author of your emotional experience. This is both liberating
                        and empowering.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                🎨 THE FOUR BLOCKS - The Emotional Color Palette
            ═══════════════════════════════════════════════════════════════ */}
            <section className="rounded-2xl border border-border bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
              <h2 className="font-serif text-2xl text-foreground mb-4 flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="h-3 w-3 rounded-sm bg-anger" />
                  <div className="h-3 w-3 rounded-sm bg-anxiety" />
                  <div className="h-3 w-3 rounded-sm bg-depression" />
                  <div className="h-3 w-3 rounded-sm bg-guilt" />
                </div>
                The Four Blocks
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                There are only four emotional states that block happiness. Each has a distinct
                thought pattern, physical signature, and pathway to resolution.
              </p>

              <Accordion type="single" collapsible className="space-y-3">
                {fourBlocks.map((block) => (
                  <AccordionItem
                    key={block.name}
                    value={block.name.toLowerCase()}
                    className="border border-border rounded-xl px-4 bg-card/50 overflow-hidden"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className={`h-5 w-5 rounded-md ${blockColors[block.color]}`} />
                        <span className="font-medium text-foreground">{block.name}</span>
                        <span className="text-sm text-muted-foreground hidden sm:inline">
                          — {block.corePattern.split(' ').slice(0, 5).join(' ')}...
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {/* Core Pattern Highlight */}
                      <div
                        className={`rounded-lg p-4 mb-4 border-l-4`}
                        style={{
                          borderLeftColor: `var(--${block.color})`,
                          backgroundColor: `oklch(from var(--${block.color}) l c h / 0.1)`,
                        }}
                      >
                        <p className="font-medium text-foreground flex items-center gap-2">
                          {block.icon}
                          Core Pattern:
                        </p>
                        <p className="mt-1">{block.corePattern}</p>
                      </div>

                      {/* Details Grid */}
                      <div className="grid gap-4 sm:grid-cols-2 mb-4">
                        <div className="bg-muted/30 rounded-lg p-4">
                          <p className="text-sm font-medium text-foreground mb-2">
                            Trigger Thoughts:
                          </p>
                          <ul className="text-sm space-y-1">
                            {block.triggerThoughts.map((thought, i) => (
                              <li key={i} className="italic">
                                {thought}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-4">
                          <p className="text-sm font-medium text-foreground mb-2">
                            Physical Signs:
                          </p>
                          <ul className="text-sm space-y-1">
                            {block.physicalSigns.map((sign, i) => (
                              <li key={i}>{sign}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="bg-muted/30 rounded-lg p-4 mb-4">
                        <p className="text-sm font-medium text-foreground mb-2">
                          Common Behaviors:
                        </p>
                        <ul className="text-sm grid sm:grid-cols-2 gap-1">
                          {block.behaviors.map((behavior, i) => (
                            <li key={i}>• {behavior}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Healthy Alternative */}
                      <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                        <p className="text-sm font-medium text-primary mb-2">
                          Healthy Alternative:
                        </p>
                        <p className="text-sm text-foreground">{block.healthyAlternative}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                📜 THE SEVEN IRRATIONAL BELIEFS - The Full Grimoire
            ═══════════════════════════════════════════════════════════════ */}
            <section className="rounded-2xl border border-border bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
              <h2 className="font-serif text-2xl text-foreground mb-4 flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-primary" />
                The Seven Irrational Beliefs
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                These are the core cognitive distortions that generate emotional suffering. Learn
                to recognize them, and you gain the power to dispute and dissolve them.
              </p>

              <Accordion type="single" collapsible className="space-y-3">
                {sevenIrrationalBeliefs.map((belief) => (
                  <AccordionItem
                    key={belief.number}
                    value={`belief-${belief.number}`}
                    className="border border-border rounded-xl px-4 bg-card/50"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                          {belief.number}
                        </span>
                        <div className="text-left">
                          <span className="font-medium text-foreground">{belief.title}</span>
                          <span className="text-muted-foreground text-sm hidden sm:inline">
                            {' '}
                            — {belief.subtitle}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pl-10">
                      <div className="flex items-start gap-3 mb-4">
                        {belief.icon}
                        <p>{belief.description}</p>
                      </div>

                      <div className="bg-destructive/10 rounded-lg p-4 mb-4">
                        <p className="text-sm font-medium text-destructive mb-2">
                          Examples of this belief:
                        </p>
                        <ul className="text-sm space-y-1">
                          {belief.examples.map((example, i) => (
                            <li key={i} className="italic">
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                        <p className="text-sm font-medium text-primary mb-2">The Antidote:</p>
                        <p className="text-sm text-foreground">{belief.antidote}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                🔮 DISPUTATION TECHNIQUES - The Wizard's Toolkit
            ═══════════════════════════════════════════════════════════════ */}
            <section className="rounded-2xl border border-border bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
              <h2 className="font-serif text-2xl text-foreground mb-4 flex items-center gap-3">
                <HelpCircle className="h-6 w-6 text-primary" />
                Disputation Techniques
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Once you identify irrational beliefs, use these powerful questioning techniques
                to challenge and transform them. Each approach offers a unique lens.
              </p>

              <Accordion type="single" collapsible className="space-y-3">
                {/* Ellis's REBT Questions */}
                <AccordionItem
                  value="ellis"
                  className="border border-border rounded-xl px-4 bg-card/50"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <RefreshCw className="h-5 w-5 text-muted-foreground" />
                      <div className="text-left">
                        <span className="font-medium text-foreground">
                          {disputationTechniques.ellis.title}
                        </span>
                        <span className="text-muted-foreground text-sm hidden sm:inline">
                          {' '}
                          — {disputationTechniques.ellis.subtitle}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p className="mb-4">
                      Dr. Albert Ellis developed these questions to systematically challenge
                      irrational beliefs. Apply them rigorously to any disturbing thought.
                    </p>
                    <div className="space-y-3">
                      {disputationTechniques.ellis.questions.map((q, i) => (
                        <div key={i} className="bg-muted/30 rounded-lg p-4">
                          <p className="font-medium text-foreground mb-1">
                            {i + 1}. {q.question}
                          </p>
                          <p className="text-sm">{q.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Byron Katie's The Work */}
                <AccordionItem
                  value="byron-katie"
                  className="border border-border rounded-xl px-4 bg-card/50"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <RefreshCw className="h-5 w-5 text-muted-foreground" />
                      <div className="text-left">
                        <span className="font-medium text-foreground">
                          {disputationTechniques.byronKatie.title}
                        </span>
                        <span className="text-muted-foreground text-sm hidden sm:inline">
                          {' '}
                          — {disputationTechniques.byronKatie.subtitle}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p className="mb-4">
                      Byron Katie&apos;s &quot;The Work&quot; is a meditative inquiry process.
                      For any stressful thought, ask these four questions, then do the
                      turnarounds.
                    </p>

                    <div className="space-y-3 mb-6">
                      {disputationTechniques.byronKatie.questions.map((q, i) => (
                        <div key={i} className="bg-muted/30 rounded-lg p-4">
                          <p className="font-medium text-foreground mb-1">
                            {i + 1}. {q.question}
                          </p>
                          <p className="text-sm">{q.explanation}</p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border pt-4">
                      <p className="font-medium text-foreground mb-3">The Turnarounds:</p>
                      <div className="space-y-2">
                        {disputationTechniques.byronKatie.turnarounds.map((t, i) => (
                          <div key={i} className="bg-primary/10 rounded-lg p-3">
                            <p className="text-sm font-medium text-primary">{t.type}:</p>
                            <p className="text-sm">{t.example}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm italic mt-3">
                        For each turnaround, find three genuine examples of how it could be as
                        true or truer than your original thought.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Stoic Philosophy */}
                <AccordionItem
                  value="stoic"
                  className="border border-border rounded-xl px-4 bg-card/50"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <RefreshCw className="h-5 w-5 text-muted-foreground" />
                      <div className="text-left">
                        <span className="font-medium text-foreground">
                          {disputationTechniques.stoic.title}
                        </span>
                        <span className="text-muted-foreground text-sm hidden sm:inline">
                          {' '}
                          — {disputationTechniques.stoic.subtitle}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p className="mb-4">
                      The ancient Stoics (Marcus Aurelius, Seneca, Epictetus) developed
                      powerful mental frameworks that align beautifully with modern CBT.
                    </p>
                    <div className="space-y-4">
                      {disputationTechniques.stoic.principles.map((p, i) => (
                        <div key={i} className="bg-muted/30 rounded-lg p-4">
                          <p className="font-medium text-foreground mb-2">{p.name}</p>
                          <p className="text-sm mb-3">{p.description}</p>
                          <div className="bg-primary/10 rounded p-2">
                            <p className="text-sm font-medium text-primary">Ask yourself:</p>
                            <p className="text-sm italic">{p.practicalQuestion}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                🚀 Call to Action - Begin the Journey
            ═══════════════════════════════════════════════════════════════ */}
            <div className="text-center pt-4 space-y-4">
              <p className="text-muted-foreground">
                Ready to apply these principles to your own thoughts?
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
