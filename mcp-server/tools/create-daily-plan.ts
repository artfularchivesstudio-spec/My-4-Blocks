/**
 * 🎭 The Daily Plan Alchemist - Where Intentions Become Emotional Wellness
 *
 * "At dawn we set our compass; by dusk we chart our growth.
 *  Between the blocks of feeling, wisdom's garden grows."
 *
 * This tool weaves together morning intentions, block awareness, and evening
 * reflection into a structured daily practice. No toxic positivity here -
 * just rational, REBT-style affirmations that acknowledge reality while
 * encouraging growth.
 *
 * - The Spellbinding Daily Orchestrator of My 4 Blocks
 */

import {
  CreateDailyPlanInputSchema,
  CreateDailyPlanOutputSchema,
  BLOCK_METADATA,
  type CreateDailyPlanInput,
  type CreateDailyPlanOutput,
  type EmotionalBlock,
} from '../schemas/tool-schemas.js'

// ═══════════════════════════════════════════════════════════════════════════════
// 🌅 MORNING CHECK-IN CONTENT LIBRARY - The Dawn Chorus
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 🌟 Morning questions calibrated by available time
 * Quick = 1-2 mins, Moderate = 5-10 mins, Extended = 15+ mins
 *
 * "The morning question sets the day's equation - solve it wisely!" 🧮
 */
const MORNING_QUESTIONS: Record<'quick' | 'moderate' | 'extended', string[][]> = {
  quick: [
    [
      'What is one thing I can accept today, even if I do not like it?',
      'Where might I demand perfection from myself or others today?',
      'What would "good enough" look like today?',
    ],
    [
      'What emotion am I waking up with, and can I simply notice it without judging?',
      'What is one thing within my control today?',
      'How can I be kind to myself if things do not go as planned?',
    ],
  ],
  moderate: [
    [
      'What am I telling myself about this day before it has even begun?',
      'Are there any "shoulds" or "musts" lurking in my expectations?',
      'What would it mean to approach today with curiosity rather than judgment?',
    ],
    [
      'Where might I be prone to awfulizing today, and can I catch it early?',
      'What is a realistic expectation I can set, rather than a demand?',
      "If I disappoint myself today, how might I respond with self-compassion?",
    ],
    [
      'What hidden demands am I placing on the world today?',
      'How might I practice unconditional self-acceptance, regardless of what happens?',
      'What would a wise, calm version of myself say about today?',
    ],
  ],
  extended: [
    [
      'What story am I already telling myself about how today will unfold?',
      'Where have I placed my self-worth - in outcomes, or in my inherent value as a person?',
      'What beliefs might I carry today that could turn disappointment into despair?',
    ],
    [
      'If I imagine my "ideal self" navigating today, what does that look like?',
      'What past patterns of thinking might resurface, and how can I prepare?',
      'What would it mean to fully accept myself today, flaws and all?',
    ],
    [
      'What rigid expectations am I holding that I could soften into preferences?',
      'How might I practice being present rather than catastrophizing about the future?',
      'Where can I find equanimity today, even in discomfort?',
    ],
  ],
}

/**
 * 🌟 Morning intentions calibrated by time and optional challenges
 *
 * "An intention is a compass, not a cage - let it guide, not imprison!" 🧭
 */
const MORNING_INTENTIONS: Record<'quick' | 'moderate' | 'extended', string[]> = {
  quick: [
    'I will notice one moment where my thinking creates unnecessary suffering.',
    'I will catch one "should" statement and gently question it.',
    'I will practice acceptance when something does not go my way.',
  ],
  moderate: [
    'Today I will observe my emotional blocks as signals, not as enemies.',
    'I will treat my irrational beliefs as visitors, acknowledging them without believing them.',
    'I will practice distinguishing between preferences and demands.',
    'When I notice emotional disturbance, I will pause and ask: what am I telling myself?',
  ],
  extended: [
    'I will cultivate awareness of the gap between events and my interpretations of them.',
    'Today I will practice unconditional self-acceptance, independent of my performance.',
    'I will approach challenges as opportunities to examine my beliefs, not as threats.',
    'I will remember that my worth does not fluctuate based on how this day unfolds.',
    'I will treat each emotional disturbance as valuable data, not as something to suppress.',
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 BLOCK-SPECIFIC CONTENT - The Four Emotional Compass Points
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 🔥⚡🌧️⚖️ Awareness prompts for each block
 *
 * "Know thy block, and thou shalt know where freedom lies!" 🗝️
 */
const BLOCK_AWARENESS_PROMPTS: Record<EmotionalBlock, string[]> = {
  anger: [
    'Notice if you catch yourself thinking "They should not have done that" - this is the anger block activating.',
    'Pay attention to moments when you demand that others or situations be different than they are.',
    'Watch for frustration that escalates beyond the situation - this signals an underlying demand.',
    'Observe when you feel the urge to control what you cannot control.',
    'Notice if you are rating others as "bad" or "wrong" rather than seeing their behavior as unfortunate.',
  ],
  anxiety: [
    'Notice when your mind races to worst-case scenarios - this is the anxiety block at work.',
    "Observe moments when you tell yourself you \"can't stand\" or \"couldn't cope\" with potential outcomes.",
    'Watch for catastrophizing language in your inner dialogue: "awful," "terrible," "disaster."',
    'Pay attention to the gap between what is happening and what you fear might happen.',
    'Notice when uncertainty feels unbearable - this reveals a demand for certainty.',
  ],
  depression: [
    'Observe if you catch yourself rating your whole self based on a single event or failure.',
    'Notice thoughts like "I am worthless" or "I am a failure" - these are the depression block in action.',
    'Watch for global negative self-evaluations rather than specific behavioral assessments.',
    'Pay attention to hopelessness narratives that treat temporary situations as permanent.',
    'Notice if you are taking responsibility for things outside your control.',
  ],
  guilt: [
    'Notice "I should have" statements that come with self-condemnation.',
    'Observe when you rate yourself as "bad" rather than acknowledging a specific mistake.',
    'Watch for the difference between healthy remorse (acknowledging error) and unhealthy guilt (global self-rating).',
    'Pay attention to perfectionist demands you place on your past self.',
    'Notice when you demand that you "should have known better" at a time when you did not.',
  ],
}

/**
 * 🎯 Challenge questions for each block - The Disputation Daggers
 *
 * "A belief unexamined is a tyrant; a belief questioned is a guide!" ⚔️
 */
const BLOCK_CHALLENGE_QUESTIONS: Record<EmotionalBlock, string[]> = {
  anger: [
    'Is it true that they absolutely SHOULD have acted differently, or is this my preference elevated to a demand?',
    'Even if their behavior was unfortunate, does it follow that they are a worthless person?',
    'What evidence is there that people MUST behave the way I want them to?',
    'How does demanding that reality be different actually help me here?',
    'Can I acknowledge that I dislike this while accepting that it has happened?',
  ],
  anxiety: [
    'What is the actual evidence that this catastrophe will occur, versus my fear that it might?',
    'Even if the worst happened, is it true that I absolutely could not cope?',
    'Have I survived difficult things before that I once thought were unbearable?',
    'Am I fortune-telling, or am I dealing with what is actually happening right now?',
    'What is the difference between "I would not like this" and "I could not stand this"?',
  ],
  depression: [
    'Does this one event or failure actually prove I am worthless as a whole person?',
    'Can I separate my behavior from my intrinsic worth as a human being?',
    'What would I say to a friend who made this same mistake?',
    'Is it possible to accept myself unconditionally while still wanting to improve?',
    'Am I confusing "I did poorly" with "I am a poor person"?',
  ],
  guilt: [
    'Given what I knew at the time, was a different choice truly possible?',
    'Am I holding my past self to standards I only learned later?',
    'Does making a mistake mean I am fundamentally bad, or just fallibly human?',
    'What is the difference between "I wish I had acted differently" and "I absolutely should have"?',
    'Can I feel appropriate remorse while refusing to globally damn myself?',
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🌙 EVENING REFLECTION CONTENT - The Twilight Reckoning
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 🌙 Evening review questions calibrated by time
 *
 * "The evening mind is a gentle scholar, not a harsh judge!" 📚
 */
const EVENING_QUESTIONS: Record<'quick' | 'moderate' | 'extended', string[][]> = {
  quick: [
    [
      'What is one moment today where I noticed my thinking creating unnecessary suffering?',
      'What is one thing I can accept about today, even if I did not like it?',
      'What do I want to remember for tomorrow?',
    ],
    [
      'Which emotional block showed up most today?',
      'Was there a moment I caught an irrational belief in action?',
      'What can I let go of before sleep?',
    ],
  ],
  moderate: [
    [
      'Where did I place demands on myself, others, or the world today?',
      'Did I practice any self-acceptance, or did I tie my worth to outcomes?',
      'What beliefs surfaced that are worth examining?',
    ],
    [
      'Which of the four blocks was most active today, and what triggered it?',
      'Was there a moment I chose a rational response over a reactive one?',
      'What would I do differently with the wisdom I have now?',
    ],
    [
      'Did I awfulize, catastrophize, or demand today? Where?',
      'How did I treat myself when things did not go well?',
      'What pattern am I noticing that I want to work on?',
    ],
  ],
  extended: [
    [
      'What was the gap between my expectations and reality today, and how did I handle it?',
      'Where did I confuse my preferences for demands?',
      "What beliefs drove my emotional responses, and are they serving me?",
    ],
    [
      'If I could go back with REBT wisdom, which moment would I approach differently?',
      'Where did I practice (or fail to practice) unconditional self-acceptance?',
      'What did today teach me about my relationship with discomfort?',
    ],
    [
      'Which irrational beliefs have the strongest grip on me, based on today?',
      'How did I respond when my emotional blocks activated?',
      'What is one thing I can commit to practicing tomorrow?',
    ],
  ],
}

/**
 * 🙏 Gratitude prompts - REBT-style (acknowledging reality, not toxic positivity)
 *
 * "Gratitude is the art of seeing clearly, not the delusion of seeing rosily!" 🌹
 */
const GRATITUDE_PROMPTS: string[] = [
  'What is one thing that went well today that I had no control over?',
  'Is there something difficult today that I can nonetheless find value in?',
  'What is one moment today where I was present rather than lost in thought?',
  'What is something I have that I often take for granted?',
  'Is there a challenge today that helped me learn something about myself?',
  'What is one small thing that made today slightly better than it could have been?',
  'Can I appreciate my own efforts today, regardless of the outcomes?',
  'What is something I noticed today that I might have rushed past before?',
]

// ═══════════════════════════════════════════════════════════════════════════════
// 💎 AFFIRMATION LIBRARY - Rational Self-Talk, Not Wishful Thinking
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 💎 REBT-style affirmations - grounded, rational, and actually helpful
 * No "I am perfect just as I am" nonsense - just clear-eyed wisdom
 *
 * "A good affirmation is a compass, not a blindfold!" 🧭✨
 */
const RATIONAL_AFFIRMATIONS: Record<'general' | EmotionalBlock, string[]> = {
  general: [
    'I can accept myself unconditionally while still working to improve.',
    'My worth as a person does not depend on my achievements or others\' approval.',
    'I prefer things to go well, but I do not demand that they must.',
    'Discomfort is unpleasant but not unbearable - I have survived it before.',
    'I am a fallible human being, and that is okay.',
    'I can acknowledge what went wrong without condemning myself entirely.',
    'My emotions are signals to examine my thinking, not facts about reality.',
    'I do not need certainty to move forward.',
    'Accepting reality does not mean approving of it.',
    'I can hold preferences strongly while releasing demands.',
  ],
  anger: [
    'Others will sometimes act in ways I dislike - this is unfortunate but not unacceptable.',
    'I can strongly prefer fairness without demanding that the universe provide it.',
    'People behave according to their own conditioning, not my preferences.',
    'I can assert my boundaries without demanding that others never cross them.',
    'Frustration is natural, but I do not have to escalate it into rage.',
  ],
  anxiety: [
    'I do not have to know how things will turn out to handle what comes.',
    'Uncertainty is uncomfortable but not catastrophic.',
    'I have coped with difficult things before, and I can do so again.',
    'Worry is not preparation - presence is.',
    'I can feel anxious and still take wise action.',
  ],
  depression: [
    'A setback is an event, not a verdict on my worth as a person.',
    'I can be disappointed in my actions without being disgusted by my self.',
    'My value is inherent, not earned or lost.',
    'Feeling low does not make me a low person.',
    'I can practice self-compassion even when I do not feel I deserve it.',
  ],
  guilt: [
    'I can regret my actions without condemning my entire self.',
    'Making a mistake does not make me a mistake.',
    'I did what I knew how to do at the time; I can learn and do better.',
    'Healthy remorse motivates change; unhealthy guilt just punishes.',
    'I can make amends without self-flagellation.',
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎪 THE MAIN ALCHEMICAL FUNCTION - Where It All Comes Together
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 🌟 Select a random item from an array
 *
 * "Fortune favors the varied - let randomness be our spice!" 🎲
 */
function selectRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

/**
 * 🎨 Get the blocks to focus on, defaulting to all four
 *
 * "No block left behind, unless deliberately so!" 🎯
 */
function getEffectiveBlocks(focusAreas?: EmotionalBlock[]): EmotionalBlock[] {
  if (focusAreas && focusAreas.length > 0) {
    return focusAreas
  }
  return ['anger', 'anxiety', 'depression', 'guilt']
}

/**
 * 🌅 Generate morning check-in content
 *
 * "The dawn breaks not just on the world, but on our awareness!" ☀️
 */
function generateMorningCheckIn(
  timeAvailable: 'quick' | 'moderate' | 'extended',
  currentChallenges?: string
): CreateDailyPlanOutput['morning_check_in'] {
  // 🎨 Select questions based on time available
  const questionSets = MORNING_QUESTIONS[timeAvailable]
  const questions = selectRandom(questionSets)

  // 🌟 Select an intention
  let intention = selectRandom(MORNING_INTENTIONS[timeAvailable])

  // ✨ If there are current challenges, we might personalize the intention
  if (currentChallenges) {
    // 🎭 Add a challenge-aware intention sometimes
    const challengeIntentions = [
      `Given my current challenges, I will practice noticing when my thinking amplifies my distress.`,
      `Today I will observe how my beliefs about my challenges shape my emotional response to them.`,
      `I will remember that my current difficulties are part of life, not evidence of my inadequacy.`,
    ]
    // 🎲 50% chance to swap in a challenge-aware intention
    if (Math.random() > 0.5) {
      intention = selectRandom(challengeIntentions)
    }
  }

  return { questions, intention }
}

/**
 * 🎯 Generate block-specific focus content
 *
 * "Each block a teacher, each prompt a lesson waiting to unfold!" 📖
 */
function generateBlockFocuses(
  blocks: EmotionalBlock[],
  timeAvailable: 'quick' | 'moderate' | 'extended'
): CreateDailyPlanOutput['block_focuses'] {
  return blocks.map((block) => {
    const metadata = BLOCK_METADATA[block]

    // 🔮 Select awareness prompt and challenge question
    const awarenessPrompt = selectRandom(BLOCK_AWARENESS_PROMPTS[block])
    const challengeQuestion = selectRandom(BLOCK_CHALLENGE_QUESTIONS[block])

    return {
      block,
      awareness_prompt: awarenessPrompt,
      challenge_question: challengeQuestion,
    }
  })
}

/**
 * 🌙 Generate evening reflection content
 *
 * "As the day folds, let the mind unfold its learnings!" 🦉
 */
function generateEveningReflection(
  timeAvailable: 'quick' | 'moderate' | 'extended'
): CreateDailyPlanOutput['evening_reflection'] {
  const questionSets = EVENING_QUESTIONS[timeAvailable]
  const reviewQuestions = selectRandom(questionSets)
  const gratitudePrompt = selectRandom(GRATITUDE_PROMPTS)

  return {
    review_questions: reviewQuestions,
    gratitude_prompt: gratitudePrompt,
  }
}

/**
 * 💎 Generate a rational affirmation
 *
 * "Not a rose-tinted mantra, but a clear-eyed compass!" 🧭
 */
function generateAffirmation(
  primaryBlock?: EmotionalBlock,
  currentChallenges?: string
): string {
  // 🎯 If we have a primary block focus, lean towards block-specific affirmation
  if (primaryBlock && Math.random() > 0.3) {
    return selectRandom(RATIONAL_AFFIRMATIONS[primaryBlock])
  }

  // 🌟 Otherwise, use a general rational affirmation
  return selectRandom(RATIONAL_AFFIRMATIONS.general)
}

/**
 * 🎭 The Main Daily Plan Creation Function - The Grand Orchestrator
 *
 * Takes the user's input and weaves together a complete daily emotional
 * wellness plan using the 4 Blocks framework. This is REBT in action:
 * practical, rational, and compassionate without being saccharine.
 *
 * @param input - The user's preferences: focus areas, challenges, intentions, time available
 * @returns A structured daily plan with morning, block, and evening components
 *
 * "From scattered intentions, a symphony of self-awareness emerges!" 🎼
 */
export async function createDailyPlan(
  input: CreateDailyPlanInput
): Promise<CreateDailyPlanOutput> {
  console.log('🌐 ✨ DAILY PLAN ALCHEMY AWAKENS!')

  // 🎨 Parse and validate input (Zod handles this, but we log for visibility)
  const validatedInput = CreateDailyPlanInputSchema.parse(input)

  // 🕐 Determine effective time availability
  const timeAvailable = validatedInput.time_available ?? 'moderate'
  console.log(`🔍 🧙‍♂️ Time available: ${timeAvailable}`)

  // 🎯 Determine which blocks to focus on
  const effectiveBlocks = getEffectiveBlocks(validatedInput.focus_areas)
  console.log(`🎯 Focus blocks: ${effectiveBlocks.join(', ')}`)

  // 🌅 Generate morning check-in
  const morningCheckIn = generateMorningCheckIn(
    timeAvailable,
    validatedInput.current_challenges
  )
  console.log('☀️ Morning check-in generated')

  // 🎪 Generate block-specific focuses
  const blockFocuses = generateBlockFocuses(effectiveBlocks, timeAvailable)
  console.log(`🎭 Block focuses generated for ${blockFocuses.length} blocks`)

  // 🌙 Generate evening reflection
  const eveningReflection = generateEveningReflection(timeAvailable)
  console.log('🌙 Evening reflection generated')

  // 💎 Generate a rational affirmation
  const primaryBlock = effectiveBlocks[0]
  const affirmation = generateAffirmation(
    primaryBlock,
    validatedInput.current_challenges
  )
  console.log('💎 Rational affirmation crystallized')

  // 🎉 Assemble the complete daily plan
  const dailyPlan: CreateDailyPlanOutput = {
    morning_check_in: morningCheckIn,
    block_focuses: blockFocuses,
    evening_reflection: eveningReflection,
    affirmation,
  }

  // ✅ Validate output against schema
  const validatedOutput = CreateDailyPlanOutputSchema.parse(dailyPlan)

  console.log('🎉 ✨ DAILY PLAN MASTERPIECE COMPLETE!')

  return validatedOutput
}

// 🌟 Export as both default and named export for maximum flexibility
export default createDailyPlan
