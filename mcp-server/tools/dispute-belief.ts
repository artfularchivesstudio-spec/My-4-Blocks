/**
 * 🎭 The Dispute Belief Alchemist - Where Irrational Thoughts Meet Their Match
 *
 * "In the theater of mind, every belief must face the spotlight of inquiry.
 * Here we arm seekers with questions sharper than any blade,
 * forged in the wisdom fires of Ellis, Byron Katie, and the Stoics."
 *
 * This tool generates REBT disputation questions for challenging irrational beliefs,
 * drawing from multiple therapeutic traditions to help users question their thinking
 * and discover more rational, life-enhancing perspectives.
 *
 * - The Spellbinding Disputation Maestro of My 4 Blocks
 */

import type {
  DisputeBeliefInput,
  DisputeBeliefOutput,
  IrrationalBeliefType,
} from '../schemas/tool-schemas.js'
import { IRRATIONAL_BELIEF_METADATA } from '../schemas/tool-schemas.js'

// ═══════════════════════════════════════════════════════════════════════════════
// 🏛️ THE QUESTION LIBRARIES - Ancient Wisdom Encoded in Modern Queries
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 🧙‍♂️ Albert Ellis's Core Disputation Arsenal
 *
 * "The grandfather of REBT gave us these gems - direct, logical, and
 * devastatingly effective at exposing the emperor's new beliefs." 👑
 */
const ELLIS_QUESTIONS: Array<{
  question: string
  purpose: string
  targetBeliefs?: IrrationalBeliefType[]
}> = [
  {
    question: 'Is this belief logical? Does the conclusion actually follow from the premises?',
    purpose: 'Challenges the logical structure of the belief, exposing faulty reasoning',
  },
  {
    question: 'Where is the evidence that this belief is true?',
    purpose: 'Demands empirical proof, shifting from assumption to investigation',
  },
  {
    question: 'Is this belief helping you achieve your goals and live happily?',
    purpose: 'Evaluates pragmatic utility - does holding this belief serve you?',
    targetBeliefs: ['awfulizing', 'cant_stand_it', 'shoulds_musts_demands'],
  },
  {
    question: 'What makes this situation so awful that it cannot be tolerated?',
    purpose: 'Challenges catastrophizing by examining actual tolerance capacity',
    targetBeliefs: ['awfulizing', 'cant_stand_it'],
  },
  {
    question: 'Where is it written that things must be the way you demand?',
    purpose: 'Exposes the arbitrary nature of rigid demands on reality',
    targetBeliefs: ['shoulds_musts_demands', 'entitlement'],
  },
  {
    question: 'Even if this is unpleasant, does that make it unbearable?',
    purpose: 'Distinguishes between discomfort and genuine catastrophe',
    targetBeliefs: ['cant_stand_it', 'awfulizing'],
  },
  {
    question: 'Does one behavior or outcome define an entire person?',
    purpose: 'Challenges global self/other ratings based on specific events',
    targetBeliefs: ['rating'],
  },
  {
    question: 'Is "always" or "never" literally true, or is this an exaggeration?',
    purpose: 'Examines the accuracy of absolutistic language',
    targetBeliefs: ['absolutistic_thinking'],
  },
]

/**
 * 🦋 Byron Katie's "The Work" - Four Questions That Shake Foundations
 *
 * "She asks so simply, yet the questions land like thunder.
 * 'Is it true?' - three words that crumble castles of certainty." 🏰
 */
const BYRON_KATIE_QUESTIONS: Array<{
  question: string
  purpose: string
}> = [
  {
    question: 'Is it true?',
    purpose: 'The first gentle inquiry - inviting honest examination of the belief',
  },
  {
    question: 'Can you absolutely know that it is true?',
    purpose: 'Deepens the inquiry - even if it seems true, can you be 100% certain?',
  },
  {
    question: 'How do you react, what happens, when you believe that thought?',
    purpose: 'Explores the emotional and behavioral consequences of holding the belief',
  },
  {
    question: 'Who would you be without that thought?',
    purpose: 'Invites imagination of freedom - glimpsing life unburdened by the belief',
  },
]

/**
 * 🏛️ Stoic Wisdom Questions - From Marcus Aurelius to Modern Day
 *
 * "The Stoics knew: we suffer not from events, but from our judgments about them.
 * These questions invite the wisdom of the ancient porch into modern minds." 🌿
 */
const STOIC_QUESTIONS: Array<{
  question: string
  purpose: string
  targetBeliefs?: IrrationalBeliefType[]
}> = [
  {
    question: 'Is this within my control, or am I distressing myself over externals?',
    purpose: 'Applies the dichotomy of control - the cornerstone of Stoic peace',
  },
  {
    question: 'What would a wise person do in this situation?',
    purpose: 'Invokes the Stoic sage as a guide - what would Marcus Aurelius counsel?',
  },
  {
    question: 'In ten years, will this matter as much as it seems to now?',
    purpose: 'Provides temporal perspective - the view from above the drama',
    targetBeliefs: ['awfulizing', 'cant_stand_it'],
  },
  {
    question: 'Am I judging this situation or the person, rather than simply observing?',
    purpose: 'Distinguishes between perception and projection',
    targetBeliefs: ['rating', 'it_statements'],
  },
  {
    question: 'How might this challenge be an opportunity for growth or virtue?',
    purpose: 'Reframes difficulty as a chance for character development',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// 🔮 THE RATIONAL ALTERNATIVE GENERATOR - Crafting Healthier Perspectives
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 🌟 Generates a rational alternative belief based on the type of irrational thinking
 *
 * "Every crooked belief has a straighter cousin waiting to be discovered.
 * Here we play matchmaker to the mind's better nature." 💫
 *
 * @param beliefStatement - The original irrational belief
 * @param beliefType - Optional categorization for targeted alternatives
 * @returns A rational alternative belief statement
 */
function generateRationalAlternative(
  beliefStatement: string,
  beliefType?: IrrationalBeliefType
): string {
  // 🎨 Type-specific rational alternatives - tailored wisdom for each flavor of irrationality
  const typeSpecificAlternatives: Record<IrrationalBeliefType, string[]> = {
    it_statements: [
      'External events influence me, but I create my emotional responses through my beliefs about those events.',
      'I am the author of my feelings - situations provide the ink, but I hold the pen.',
      'What happened may be unfortunate, but my reaction to it is within my power to choose.',
    ],
    awfulizing: [
      'This is unpleasant and I wish it were different, but it is not the worst thing possible.',
      'I can rate this situation as very bad (0-100) without declaring it catastrophic.',
      'Bad things happen in life, but labeling them as "awful" only amplifies my suffering.',
    ],
    cant_stand_it: [
      'This is uncomfortable, but history proves I have survived discomfort before.',
      'I may not like this, but I can stand it - I am more resilient than I give myself credit for.',
      'Difficulty does not equal impossibility - I can tolerate what I do not prefer.',
    ],
    shoulds_musts_demands: [
      'I would prefer things to be different, but there is no universal law requiring it.',
      'My preferences are valid, but demanding reality conform to them creates suffering.',
      'Wishing is healthy; demanding is tyranny - I choose to wish, not command.',
    ],
    rating: [
      'One action does not define an entire person - humans are too complex for simple labels.',
      'I can evaluate behavior without condemning the whole person (including myself).',
      'Mistakes prove humanity, not worthlessness - we are all works in progress.',
    ],
    absolutistic_thinking: [
      'Sometimes this happens, but not always - reality lives in shades, not absolutes.',
      'Let me consider the actual frequency rather than the exaggerated extreme.',
      'The words "always" and "never" are rarely accurate - most truths live in between.',
    ],
    entitlement: [
      'I would like to be treated well, but the universe owes me nothing specific.',
      'My worth as a person does not depend on receiving what I want.',
      'Preferences are healthy; entitlements set me up for resentment.',
    ],
  }

  // 🎭 Select from type-specific alternatives if type is known
  if (beliefType && typeSpecificAlternatives[beliefType]) {
    const alternatives = typeSpecificAlternatives[beliefType]
    return alternatives[Math.floor(Math.random() * alternatives.length)]
  }

  // 🌙 General rational alternative when type is unknown - cast a wider net
  const generalAlternatives = [
    'I can prefer things to be different without demanding they must be.',
    'This situation is challenging, but I am capable of responding thoughtfully.',
    'My worth as a person is not determined by this circumstance.',
    'I may not like what happened, but I can choose how I respond to it.',
    'This is one moment in a long life - it does not define everything.',
  ]

  return generalAlternatives[Math.floor(Math.random() * generalAlternatives.length)]
}

/**
 * 🌈 Generates a reframe suggestion based on the belief and context
 *
 * "Reframing is not denial - it's choosing which picture frame
 * best honors the complexity of our experience." 🖼️
 *
 * @param beliefStatement - The original belief being disputed
 * @param context - Optional additional context about the situation
 * @returns A gentle reframe of the situation
 */
function generateReframeSuggestion(beliefStatement: string, context?: string): string {
  const reframes = [
    'Consider that this challenge might be teaching you something valuable about your own resilience and values.',
    'What if this difficult moment is actually redirecting you toward something that serves you better?',
    'Perhaps this situation, while painful, is an invitation to practice the kind of person you want to become.',
    'Even in difficulty, you retain the power to choose your response - that itself is a form of freedom.',
    'What if the discomfort you feel is not a sign of weakness, but of growth happening in real time?',
    'Consider that you are handling something difficult, and that is worthy of acknowledgment rather than criticism.',
    'This moment will pass, and future-you will look back with wisdom that present-you is still gathering.',
  ]

  return reframes[Math.floor(Math.random() * reframes.length)]
}

// ═══════════════════════════════════════════════════════════════════════════════
// ⚔️ THE MAIN DISPUTATION ENGINE - Where Beliefs Face the Crucible
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 🎭 disputeBelief - The Grand Disputation Ceremony
 *
 * "When a belief enters this function, it does not leave unchanged.
 * Armed with questions from three great traditions, we illuminate
 * the shadows where irrational thinking hides."
 *
 * This function generates 4-6 disputation questions drawn from:
 * - Albert Ellis's REBT direct questioning
 * - Byron Katie's "The Work" inquiry
 * - Stoic philosophical examination
 *
 * It also provides a rational alternative belief and a gentle reframe
 * to help the user construct healthier thinking patterns.
 *
 * @param input - The irrational belief to dispute, with optional type and context
 * @returns DisputeBeliefOutput with questions, rational alternative, and reframe
 *
 * 🎪 "Every irrational belief thinks itself reasonable until the questions arrive.
 * We're just delivering the invitation to the inquiry party." 🎉
 */
export async function disputeBelief(input: DisputeBeliefInput): Promise<DisputeBeliefOutput> {
  const { belief_statement, belief_type, context } = input

  console.log('⚔️ ✨ DISPUTATION CEREMONY COMMENCES!')
  console.log(`🔍 🧙‍♂️ Examining belief: "${belief_statement}"`)

  if (belief_type) {
    const metadata = IRRATIONAL_BELIEF_METADATA[belief_type]
    console.log(`🏷️ Belief type identified: ${metadata.label}`)
  }

  // 🎨 Gather our disputation arsenal from each tradition
  const selectedQuestions: DisputeBeliefOutput['disputation_questions'] = []

  // 🧙‍♂️ Select 2 Ellis questions (prioritize type-specific if available)
  const ellisPool = belief_type
    ? ELLIS_QUESTIONS.filter(
        (q) => !q.targetBeliefs || q.targetBeliefs.includes(belief_type)
      )
    : ELLIS_QUESTIONS

  const shuffledEllis = [...ellisPool].sort(() => Math.random() - 0.5)
  for (let i = 0; i < Math.min(2, shuffledEllis.length); i++) {
    selectedQuestions.push({
      question: shuffledEllis[i].question,
      purpose: shuffledEllis[i].purpose,
      source: 'ellis',
    })
  }

  // 🦋 Select 2 Byron Katie questions (always include the first two as they're foundational)
  selectedQuestions.push({
    question: BYRON_KATIE_QUESTIONS[0].question,
    purpose: BYRON_KATIE_QUESTIONS[0].purpose,
    source: 'byron_katie',
  })

  // 🎲 Randomly select one more from the remaining Katie questions
  const remainingKatie = BYRON_KATIE_QUESTIONS.slice(1)
  const randomKatie = remainingKatie[Math.floor(Math.random() * remainingKatie.length)]
  selectedQuestions.push({
    question: randomKatie.question,
    purpose: randomKatie.purpose,
    source: 'byron_katie',
  })

  // 🏛️ Select 1-2 Stoic questions (prioritize type-specific if available)
  const stoicPool = belief_type
    ? STOIC_QUESTIONS.filter(
        (q) => !q.targetBeliefs || q.targetBeliefs.includes(belief_type)
      )
    : STOIC_QUESTIONS

  const shuffledStoic = [...stoicPool].sort(() => Math.random() - 0.5)
  const stoicCount = Math.random() > 0.5 ? 2 : 1 // 🎲 Sometimes 1, sometimes 2
  for (let i = 0; i < Math.min(stoicCount, shuffledStoic.length); i++) {
    selectedQuestions.push({
      question: shuffledStoic[i].question,
      purpose: shuffledStoic[i].purpose,
      source: 'stoic',
    })
  }

  // 🌟 Generate the rational alternative
  const rational_alternative = generateRationalAlternative(belief_statement, belief_type)

  // 🌈 Generate the reframe suggestion
  const reframe_suggestion = generateReframeSuggestion(belief_statement, context)

  console.log(`🎉 ✨ DISPUTATION ARSENAL PREPARED! ${selectedQuestions.length} questions ready.`)

  // 🎭 Compose the final output - the disputation is ready!
  const mysticalOutput: DisputeBeliefOutput = {
    disputation_questions: selectedQuestions,
    rational_alternative,
    reframe_suggestion,
  }

  return mysticalOutput
}

// 🌟 Default export for convenient importing
export default disputeBelief
