/**
 * 🎭 The Belief Excavator - Where Hidden Demands Surface Into Clarity
 *
 * "Beneath every storm of emotion lies a buried demand,
 * a silent 'should' or 'must' waiting to be unearthed.
 * We are archaeologists of the psyche, gently brushing away
 * the sediment of reactivity to reveal the fossil of belief."
 *
 * This tool implements the ABC Model of Rational Emotive Behavior Therapy (REBT):
 *   A - Activating Event (what happened)
 *   B - Belief (what we tell ourselves)
 *   C - Consequence (the emotional/behavioral result)
 *
 * The magic? B causes C, not A. The event doesn't create the emotion -
 * our belief about the event does. Revolutionary, isn't it? 🔮
 *
 * - The Spellbinding Belief Archaeologist of My 4 Blocks
 */

import {
  FindBeliefInputSchema,
  FindBeliefOutputSchema,
  IRRATIONAL_BELIEF_METADATA,
  type FindBeliefInput,
  type FindBeliefOutput,
  type IrrationalBeliefType,
  type EmotionalBlock,
} from '../schemas/tool-schemas.js'

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 LINGUISTIC ALCHEMY - The Patterns That Betray Our Hidden Beliefs
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 🔍 The Linguistic Fingerprints of Irrational Beliefs
 *
 * Each belief type leaves telltale traces in our language.
 * Like a detective following breadcrumbs, we trace these patterns
 * back to their irrational source. Elementary, my dear Watson! 🕵️
 */
const BELIEF_DETECTION_PATTERNS: Record<IrrationalBeliefType, RegExp[]> = {
  it_statements: [
    /\b(it|that|this)\s+(made|makes|caused|causes)\s+me/i,
    /\b(it|that|this)\s+(is|was)\s+(making|driving|pushing)/i,
    /\bruined\s+(my|the)/i,
    /\bthe\s+situation\s+(made|caused|created)/i,
  ],
  awfulizing: [
    /\b(awful|terrible|horrible|catastrophic|disaster|worst|nightmare)/i,
    /\bthe\s+end\s+of\s+(the\s+world|everything)/i,
    /\bcouldn't\s+be\s+worse/i,
    /\b(never|ever)\s+(recover|survive|get\s+over)/i,
    /\b(100%|completely|utterly|totally)\s+(bad|ruined|destroyed)/i,
  ],
  cant_stand_it: [
    /\b(can't|cannot|couldn't)\s+(stand|take|bear|handle|tolerate|cope)/i,
    /\b(unbearable|intolerable|insufferable)/i,
    /\b(too\s+much|overwhelming)/i,
    /\bI\s+(just\s+)?can't/i,
    /\b(drive|driving)\s+me\s+(crazy|insane|mad)/i,
  ],
  shoulds_musts_demands: [
    /\b(should|shouldn't|must|mustn't|have\s+to|ought\s+to|need\s+to)\b/i,
    /\b(supposed\s+to|required\s+to|obligated)/i,
    /\b(has|have)\s+no\s+right/i,
    /\bhow\s+dare\s+(he|she|they|you)/i,
    /\b(always|never)\s+should/i,
  ],
  rating: [
    /\b(I'm|I\s+am|he's|she's|they're|you're)\s+(a|an|such\s+a)?\s*(idiot|fool|failure|loser|worthless|stupid|incompetent)/i,
    /\b(bad|terrible|horrible|awful)\s+(person|human|mother|father|employee)/i,
    /\b(completely|totally|utterly)\s+(worthless|useless|inadequate)/i,
    /\b(deserve|deserves)\s+to\s+(fail|suffer|be\s+punished)/i,
    /\b(good|bad)\s+for\s+nothing/i,
  ],
  absolutistic_thinking: [
    /\b(always|never|everyone|no\s+one|nothing|everything|nobody|everybody)\b/i,
    /\b(every\s+time|all\s+the\s+time|constantly|forever)/i,
    /\b(100%|completely|entirely|totally)\b/i,
    /\bnot\s+a\s+single/i,
    /\bwithout\s+exception/i,
  ],
  entitlement: [
    /\b(deserve|deserves|owed|owes|entitled|owe\s+me)/i,
    /\b(fair|unfair|justice|injustice)/i,
    /\bshould\s+(get|have|receive|be\s+given)/i,
    /\b(my|our)\s+right\s+to/i,
    /\bhow\s+(come|is\s+it\s+that)\s+I\s+(don't|didn't)/i,
  ],
}

/**
 * 🌩️ The Emotional Block to Belief Type Affinity Matrix
 *
 * Certain blocks tend to dance with certain beliefs.
 * Anger loves demands, anxiety adores awfulizing,
 * depression clings to rating, guilt embraces shoulds.
 * It's like a cosmic matchmaking service for misery! 💔
 */
const BLOCK_BELIEF_AFFINITY: Record<EmotionalBlock, IrrationalBeliefType[]> = {
  anger: ['shoulds_musts_demands', 'rating', 'entitlement', 'it_statements'],
  anxiety: ['awfulizing', 'cant_stand_it', 'absolutistic_thinking', 'shoulds_musts_demands'],
  depression: ['rating', 'absolutistic_thinking', 'awfulizing', 'cant_stand_it'],
  guilt: ['shoulds_musts_demands', 'rating', 'absolutistic_thinking', 'entitlement'],
}

/**
 * 🎭 Demand Extraction Templates
 *
 * Every irrational belief contains a hidden demand.
 * These templates help us phrase that demand explicitly.
 * Because sometimes we need to say the quiet part loud! 📢
 */
const DEMAND_TEMPLATES: Record<IrrationalBeliefType, string[]> = {
  it_statements: [
    'External circumstances must not affect me negatively.',
    'The situation should have been different so I wouldn\'t feel this way.',
  ],
  awfulizing: [
    'Bad things absolutely must not happen to me.',
    'This situation must not be as bad as it is.',
  ],
  cant_stand_it: [
    'I must not experience discomfort or difficulty.',
    'Life must be easy and comfortable.',
  ],
  shoulds_musts_demands: [
    'Things must be the way I want them to be.',
    'Others must behave according to my expectations.',
  ],
  rating: [
    'I must be perfect/competent to be worthwhile.',
    'A person\'s worth is determined by their behavior.',
  ],
  absolutistic_thinking: [
    'Things must always go a certain way.',
    'Reality must conform to my absolute expectations.',
  ],
  entitlement: [
    'I deserve special treatment because of who I am.',
    'The world must be fair to me specifically.',
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔮 THE CORE ALCHEMY - Where Narratives Become Understanding
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 🌟 The Activating Event Extractor - Distilling "What Happened"
 *
 * Separates the objective event from the emotional interpretation.
 * Like a chemist separating compounds, we isolate the pure event
 * from the reactive elements surrounding it. 🧪
 *
 * @param situation - The user's description of what happened
 * @returns A concise, objective description of the activating event
 */
function extractActivatingEvent(situation: string): string {
  // 🎨 Remove emotional language to find the objective event
  const emotionalWords = /\b(terrible|awful|horrible|amazing|wonderful|unfair|ridiculous|stupid|crazy)\b/gi
  let objectiveEvent = situation.replace(emotionalWords, '')

  // ✨ Clean up extra whitespace from removals
  objectiveEvent = objectiveEvent.replace(/\s+/g, ' ').trim()

  // 🌟 Truncate if too long, keeping the essence
  if (objectiveEvent.length > 200) {
    objectiveEvent = objectiveEvent.substring(0, 197) + '...'
  }

  return objectiveEvent || situation.substring(0, 200)
}

/**
 * 🧠 The Belief Type Classifier - Sorting Irrationality into Categories
 *
 * Analyzes the self-talk and situation to determine which of the
 * seven irrational belief types is most prominent.
 * Think of it as a sorting hat for cognitive distortions! 🎩✨
 *
 * @param selfTalk - What the user tells themselves
 * @param emotionalResponse - How they feel
 * @param identifiedBlock - The emotional block if already identified
 * @returns The classified belief type and confidence score
 */
function classifyBeliefType(
  selfTalk: string | undefined,
  emotionalResponse: string,
  identifiedBlock?: EmotionalBlock
): { beliefType: IrrationalBeliefType; confidence: number } {
  const textToAnalyze = `${selfTalk || ''} ${emotionalResponse}`.toLowerCase()
  const scores: Record<IrrationalBeliefType, number> = {
    it_statements: 0,
    awfulizing: 0,
    cant_stand_it: 0,
    shoulds_musts_demands: 0,
    rating: 0,
    absolutistic_thinking: 0,
    entitlement: 0,
  }

  // 🔍 Score based on linguistic pattern matches
  for (const [beliefType, patterns] of Object.entries(BELIEF_DETECTION_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(textToAnalyze)) {
        scores[beliefType as IrrationalBeliefType] += 1
      }
    }
  }

  // 🎯 Boost scores for belief types that are commonly associated with the identified block
  if (identifiedBlock && BLOCK_BELIEF_AFFINITY[identifiedBlock]) {
    const affinityTypes = BLOCK_BELIEF_AFFINITY[identifiedBlock]
    affinityTypes.forEach((type, index) => {
      // 🌟 Higher boost for more strongly associated types
      scores[type] += (4 - index) * 0.5
    })
  }

  // ✨ Find the winning belief type
  let maxScore = 0
  let detectedType: IrrationalBeliefType = 'shoulds_musts_demands' // 🎪 Default - the most common!

  for (const [beliefType, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score
      detectedType = beliefType as IrrationalBeliefType
    }
  }

  // 📊 Calculate confidence (normalized to 0-1 range)
  const confidence = Math.min(maxScore / 5, 1) // Max out at 5 pattern matches

  return { beliefType: detectedType, confidence }
}

/**
 * 🎭 The Belief Statement Crafter - Articulating the Unspoken
 *
 * Takes the raw material of self-talk and emotional response
 * and forges it into a clear, quotable belief statement.
 * We're giving voice to the whispers of the mind! 💭
 *
 * @param selfTalk - The user's internal dialogue
 * @param emotionalResponse - Their emotional state
 * @param beliefType - The classified belief type
 * @returns A clear articulation of the irrational belief
 */
function craftBeliefStatement(
  selfTalk: string | undefined,
  emotionalResponse: string,
  beliefType: IrrationalBeliefType
): string {
  // 🌟 If self-talk is provided and substantial, use it as the base
  if (selfTalk && selfTalk.length > 10) {
    // ✨ Clean and format the self-talk
    let statement = selfTalk.trim()

    // 🎨 Ensure it's in first person if not already
    if (!statement.match(/^I\s/i) && !statement.match(/\bI\b/i)) {
      statement = `I believe that ${statement.toLowerCase()}`
    }

    // 💫 Add quotation marks if not present
    if (!statement.startsWith('"') && !statement.startsWith("'")) {
      statement = `"${statement}"`
    }

    return statement
  }

  // 🔮 Infer belief from emotional response and belief type
  const metadata = IRRATIONAL_BELIEF_METADATA[beliefType]
  const emotionLower = emotionalResponse.toLowerCase()

  // 🎪 Generate contextual belief statements based on type
  const templates: Record<IrrationalBeliefType, string> = {
    it_statements: `"This situation is making me feel ${emotionLower}."`,
    awfulizing: `"This is absolutely terrible and couldn't be worse."`,
    cant_stand_it: `"I can't stand feeling this way - it's unbearable."`,
    shoulds_musts_demands: `"This shouldn't be happening - things must be different."`,
    rating: `"I am inadequate because of how I'm handling this."`,
    absolutistic_thinking: `"Things always go wrong for me - this never changes."`,
    entitlement: `"I deserve better than this - it's unfair."`,
  }

  return templates[beliefType] || `"${metadata.example}"`
}

/**
 * 🌊 The Demand Excavator - Unearthing the "Must" Beneath the "Mist"
 *
 * Every irrational belief hides a demand - a should, must, or have to.
 * We dig beneath the surface emotion to find this hidden tyrant.
 * Time to expose the puppet master! 🎭
 *
 * @param beliefType - The type of irrational belief
 * @param selfTalk - The user's self-talk if available
 * @returns The underlying demand statement
 */
function excavateUnderlyingDemand(
  beliefType: IrrationalBeliefType,
  selfTalk: string | undefined
): string {
  const templates = DEMAND_TEMPLATES[beliefType]

  // 🔍 If self-talk contains explicit demands, extract them
  if (selfTalk) {
    const demandMatch = selfTalk.match(
      /\b(should|shouldn't|must|mustn't|have\s+to|need\s+to|ought\s+to)[^.!?]*/i
    )
    if (demandMatch) {
      return `The hidden demand: "${demandMatch[0].trim()}"`
    }
  }

  // 🎲 Select appropriate template based on belief type
  const template = templates[0] // Primary demand template
  return template
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🌟 THE MAIN RITUAL - The Grand Performance
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 🧠 Find Irrational Belief - The Heart of ABC Analysis
 *
 * "Between stimulus and response there is a space. In that space
 * is our power to choose our response. In our response lies our
 * growth and our freedom." - Viktor Frankl (well, sort of the idea!)
 *
 * This function takes a user's narrative and performs the mystical
 * alchemy of ABC analysis:
 *   1. Extract the A (Activating Event) from the situation
 *   2. Identify the B (Belief) from self-talk or infer from emotions
 *   3. Determine the C (Consequence) from emotional response
 *   4. Classify the belief type using our seven categories
 *   5. Excavate the underlying demand (the hidden "should/must/have to")
 *
 * Think of it as emotional archaeology meets cognitive cartography! 🗺️
 *
 * @param input - The user's narrative containing situation, emotions, and self-talk
 * @returns A complete ABC breakdown with belief classification and underlying demand
 *
 * @example
 * ```typescript
 * const mysticalResult = await findIrrationalBelief({
 *   situation: "My colleague got promoted instead of me",
 *   emotional_response: "Furious and resentful",
 *   self_talk: "It's so unfair! I worked harder than them!"
 * })
 * // Returns the hidden belief: entitlement + the demand for fairness
 * ```
 *
 * Fun fact: Ellis called his approach "rational" not because emotions are
 * bad, but because irrational beliefs CREATE unnecessary suffering.
 * We're not becoming robots - we're becoming free! 🤖➡️🦋
 */
export async function findIrrationalBelief(
  input: FindBeliefInput
): Promise<FindBeliefOutput> {
  console.log('🧠 ✨ BELIEF EXCAVATION RITUAL COMMENCES!')
  console.log(`🔍 🎭 Peering into the narrative depths...`)

  // 🌟 Validate input (Zod does the heavy lifting, but we double-check)
  const validatedInput = FindBeliefInputSchema.parse(input)
  const { situation, emotional_response, self_talk, identified_block } = validatedInput

  // 🎨 Step 1: Extract the Activating Event (A)
  console.log(`📍 Extracting Activating Event from situation...`)
  const activatingEvent = extractActivatingEvent(situation)

  // 🔮 Step 2 & 3: Classify the Belief Type
  console.log(`🎯 Classifying belief type from linguistic patterns...`)
  const { beliefType } = classifyBeliefType(
    self_talk,
    emotional_response,
    identified_block
  )

  // ✨ Step 4: Craft the Belief Statement (B)
  console.log(`💭 Crafting explicit belief statement...`)
  const beliefStatement = craftBeliefStatement(self_talk, emotional_response, beliefType)

  // 🌊 Step 5: Excavate the Underlying Demand
  console.log(`⛏️ Excavating the hidden demand...`)
  const underlyingDemand = excavateUnderlyingDemand(beliefType, self_talk)

  // 🎭 Construct the ABC breakdown
  const abcBreakdown = {
    a_event: activatingEvent,
    b_belief: beliefStatement,
    c_consequence: `Emotional consequence: ${emotional_response}`,
  }

  // 📜 Build the final output
  const spellbindingOutput: FindBeliefOutput = {
    belief_statement: beliefStatement,
    belief_type: beliefType,
    abc_breakdown: abcBreakdown,
    underlying_demand: underlyingDemand,
  }

  // 🎉 Validate output against schema (trust but verify!)
  const validatedOutput = FindBeliefOutputSchema.parse(spellbindingOutput)

  console.log(`🎉 ✨ BELIEF EXCAVATION MASTERPIECE COMPLETE!`)
  console.log(`💎 Discovered belief type: ${IRRATIONAL_BELIEF_METADATA[beliefType].label}`)

  return validatedOutput
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📤 EXPORTS - Sending Our Creation Into The World
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 🌟 Default export for convenience
 * Named export for explicit imports
 *
 * "Whether you call me by name or by nature, I shall answer." 📞
 */
export default findIrrationalBelief
