/**
 * 🎭 The Reflect On Day Tool - The Evening Mirror of the Soul
 *
 * "As the sun sets on another act of life's grand theater,
 * this tool gently reflects the day's emotional tapestry,
 * weaving insights from shadows into tomorrow's golden thread."
 *
 * This tool generates an end-of-day reflection analysis using the 4 Blocks
 * framework, helping seekers of wisdom understand their emotional patterns
 * and set intentions for continued growth.
 *
 * - The Spellbinding Twilight Alchemist of My 4 Blocks
 */

import {
  ReflectOnDayInputSchema,
  ReflectOnDayOutputSchema,
  BLOCK_METADATA,
  type ReflectOnDayInput,
  type ReflectOnDayOutput,
  type EmotionalBlock,
} from '../schemas/tool-schemas.js'

// 🌙 The Four Guardians of the Evening Watch
const ALL_BLOCKS: EmotionalBlock[] = ['anger', 'anxiety', 'depression', 'guilt']

// 🔮 Keywords that whisper of each block's presence
const BLOCK_INDICATORS: Record<EmotionalBlock, string[]> = {
  anger: [
    'frustrated', 'angry', 'annoyed', 'irritated', 'furious', 'mad',
    'resentful', 'bitter', 'hostile', 'outraged', 'should have', 'shouldn\'t have',
    'unfair', 'disrespected', 'wronged', 'demanded', 'rude', 'inconsiderate',
  ],
  anxiety: [
    'worried', 'anxious', 'nervous', 'scared', 'fearful', 'panicked',
    'overwhelmed', 'stressed', 'what if', 'can\'t handle', 'terrible',
    'catastrophe', 'disaster', 'awful', 'unbearable', 'dread', 'uncertain',
  ],
  depression: [
    'sad', 'hopeless', 'worthless', 'useless', 'failure', 'loser',
    'inadequate', 'depressed', 'empty', 'numb', 'pathetic', 'stupid',
    'can\'t do anything right', 'never good enough', 'always mess up',
  ],
  guilt: [
    'guilty', 'ashamed', 'regret', 'should have', 'shouldn\'t have',
    'let down', 'disappointed', 'wrong', 'mistake', 'fault', 'blame',
    'bad person', 'selfish', 'terrible thing', 'never forgive myself',
  ],
}

// ✨ Growth opportunities for each block - the silver linings in the emotional clouds
const GROWTH_OPPORTUNITIES: Record<EmotionalBlock, string[]> = {
  anger: [
    'Practice accepting that others may behave differently than you prefer',
    'Notice demands you place on situations and explore preferences instead',
    'Recognize when frustration signals an unmet need you can communicate',
    'Explore the vulnerability beneath the anger - what do you truly want?',
    'Consider that others act from their own beliefs, not to upset you',
  ],
  anxiety: [
    'Challenge catastrophic predictions with evidence from past experiences',
    'Practice tolerating uncertainty - most worried-about outcomes never occur',
    'Notice "what if" thinking and counter with "what is" right now',
    'Build confidence by recalling times you handled difficult situations',
    'Accept that discomfort is temporary and survivable',
  ],
  depression: [
    'Separate your actions from your worth - you are not your mistakes',
    'Challenge global self-ratings with specific, factual observations',
    'Notice accomplishments, even small ones - they matter',
    'Practice self-compassion as you would comfort a dear friend',
    'Remember: having flaws makes you human, not worthless',
  ],
  guilt: [
    'Distinguish between guilt (behavior-focused) and shame (self-focused)',
    'Ask: "Would I judge a friend this harshly for the same action?"',
    'Consider what you can learn and do differently going forward',
    'Practice making amends where possible, then releasing the guilt',
    'Accept your humanity - everyone makes mistakes; growth is the goal',
  ],
}

// 🌟 Common irrational beliefs associated with each block
const BLOCK_BELIEFS: Record<EmotionalBlock, string[]> = {
  anger: [
    'Others should always treat me fairly and considerately',
    'Things must go the way I want them to',
    'People who act badly are bad people who deserve punishment',
    'I can\'t stand it when others don\'t meet my expectations',
  ],
  anxiety: [
    'Bad things must not happen, and if they do, it will be catastrophic',
    'I can\'t handle uncertainty or discomfort',
    'I need to control outcomes to feel safe',
    'If something could go wrong, it probably will',
  ],
  depression: [
    'I must perform well and be approved of, or I am worthless',
    'My failures define who I am',
    'If I\'m not perfect, I\'m a complete failure',
    'Things will never get better',
  ],
  guilt: [
    'I must never make mistakes or hurt others',
    'When I do something wrong, I am a bad person',
    'I should have known better and acted differently',
    'I don\'t deserve forgiveness until I\'ve suffered enough',
  ],
}

/**
 * 🌅 Analyze Block Frequency - The Twilight Counter
 *
 * Examines the emotional moments to determine how frequently each block appeared.
 * Like counting stars in the evening sky, we illuminate the patterns.
 *
 * @param text - The seeker's narrative of emotional moments
 * @param block - The emotional block to analyze
 * @returns The frequency category: not_present | occasional | frequent | dominant
 *
 * "Every emotion leaves footprints in the sand of our words." 👣
 */
function analyzeBlockFrequency(
  text: string,
  block: EmotionalBlock
): 'not_present' | 'occasional' | 'frequent' | 'dominant' {
  // 🔍 The mystical text scanner - lowercase for case-insensitive matching
  const lowerText = text.toLowerCase()
  const indicators = BLOCK_INDICATORS[block]

  // 🎯 Count the whispers of this block in the narrative
  let matchCount = 0
  for (const indicator of indicators) {
    const regex = new RegExp(indicator.toLowerCase(), 'gi')
    const matches = lowerText.match(regex)
    if (matches) {
      matchCount += matches.length
    }
  }

  // 🌙 The Frequency Oracle speaks based on indicator density
  // These thresholds are like tide marks - approximate but meaningful
  if (matchCount === 0) return 'not_present'
  if (matchCount <= 2) return 'occasional'
  if (matchCount <= 5) return 'frequent'
  return 'dominant'
}

/**
 * 🔮 Extract Key Trigger - The Moment Diviner
 *
 * Attempts to identify what triggered this block based on context clues.
 * Like a detective of the heart, we seek the inciting incident.
 *
 * @param text - The seeker's narrative
 * @param block - The emotional block we're investigating
 * @returns A trigger description, or undefined if none detected
 *
 * "Every storm begins with a single raindrop." 🌧️
 */
function extractKeyTrigger(text: string, block: EmotionalBlock): string | undefined {
  const lowerText = text.toLowerCase()

  // 🎭 Common trigger patterns for each block
  const triggerPatterns: Record<EmotionalBlock, { pattern: RegExp; extract: string }[]> = {
    anger: [
      { pattern: /when (?:they|he|she|someone|my \w+) (.*?)(?:\.|,|$)/i, extract: 'when someone $1' },
      { pattern: /because (?:they|he|she) (.*?)(?:\.|,|$)/i, extract: 'others $1' },
      { pattern: /unfair|disrespected|ignored/i, extract: 'feeling disrespected or treated unfairly' },
    ],
    anxiety: [
      { pattern: /worried about (.*?)(?:\.|,|$)/i, extract: 'concerns about $1' },
      { pattern: /what if (.*?)(?:\.|,|$)/i, extract: 'uncertainty about $1' },
      { pattern: /scared (?:of|that) (.*?)(?:\.|,|$)/i, extract: 'fear of $1' },
    ],
    depression: [
      { pattern: /failed at (.*?)(?:\.|,|$)/i, extract: 'perceived failure in $1' },
      { pattern: /(?:not|never) good enough/i, extract: 'self-critical thoughts about adequacy' },
      { pattern: /(?:made a |my )mistake/i, extract: 'dwelling on past mistakes' },
    ],
    guilt: [
      { pattern: /shouldn't have (.*?)(?:\.|,|$)/i, extract: 'regret about $1' },
      { pattern: /let (?:them|him|her|someone) down/i, extract: 'feeling like you disappointed someone' },
      { pattern: /my fault/i, extract: 'taking excessive responsibility' },
    ],
  }

  const patterns = triggerPatterns[block]
  for (const { pattern, extract } of patterns) {
    if (pattern.test(lowerText)) {
      return extract.replace(/\$1/g, '...')
    }
  }

  // 🌙 If no specific trigger found, check if block was explicitly mentioned
  const indicators = BLOCK_INDICATORS[block]
  for (const indicator of indicators) {
    if (lowerText.includes(indicator)) {
      return `moments involving feelings of ${BLOCK_METADATA[block].label.toLowerCase()}`
    }
  }

  return undefined
}

/**
 * 🎯 Select Random Growth Opportunity - The Wisdom Selector
 *
 * Chooses a growth opportunity that resonates with the block's frequency.
 * Like drawing a tarot card, each selection holds meaning.
 *
 * @param block - The emotional block
 * @param frequency - How often it appeared
 * @returns A personalized growth opportunity
 *
 * "Growth comes not from avoiding the storm, but dancing in the rain." 🌦️
 */
function selectGrowthOpportunity(
  block: EmotionalBlock,
  frequency: 'not_present' | 'occasional' | 'frequent' | 'dominant'
): string {
  const opportunities = GROWTH_OPPORTUNITIES[block]

  // 🌟 Select based on frequency - more presence = deeper work suggested
  if (frequency === 'not_present') {
    return `Continue building awareness of ${BLOCK_METADATA[block].label.toLowerCase()} patterns when they arise`
  }

  // 🎲 Select a random opportunity from the pool
  const randomIndex = Math.floor(Math.random() * opportunities.length)
  return opportunities[randomIndex]
}

/**
 * 📜 Generate Beliefs to Examine - The Belief Archaeologist
 *
 * Unearths 1-3 beliefs worth examining based on the day's patterns.
 * Like finding fossils, each belief tells a story of the past shaping the present.
 *
 * @param emotionalMoments - The seeker's narrative
 * @param blocksExperienced - Explicitly mentioned blocks
 * @returns Array of beliefs with their related blocks
 *
 * "Beliefs are the invisible architects of our emotions." 🏛️
 */
function generateBeliefsToExamine(
  emotionalMoments: string,
  blocksExperienced: EmotionalBlock[] = []
): Array<{ belief: string; related_block: EmotionalBlock }> {
  const beliefs: Array<{ belief: string; related_block: EmotionalBlock }> = []

  // 🔍 Determine which blocks to focus on
  const relevantBlocks = blocksExperienced.length > 0
    ? blocksExperienced
    : ALL_BLOCKS.filter((block) => analyzeBlockFrequency(emotionalMoments, block) !== 'not_present')

  // 🎭 Select 1-3 beliefs based on the most present blocks
  const maxBeliefs = Math.min(3, relevantBlocks.length || 1)

  for (let i = 0; i < maxBeliefs; i++) {
    const block = relevantBlocks[i] || 'anxiety' // Default to anxiety if somehow empty
    const blockBeliefs = BLOCK_BELIEFS[block]
    const randomBelief = blockBeliefs[Math.floor(Math.random() * blockBeliefs.length)]

    beliefs.push({
      belief: randomBelief,
      related_block: block,
    })
  }

  return beliefs
}

/**
 * 🎉 Generate Celebration - The Joy Finder
 *
 * Crafts an acknowledgment of something positive from the day.
 * Even in darkness, we search for and celebrate the light.
 *
 * @param wins - Optional wins mentioned by the seeker
 * @param emotionalMoments - The day's narrative
 * @returns A celebration statement
 *
 * "The smallest candle shines brightest in the deepest night." 🕯️
 */
function generateCelebration(wins?: string, emotionalMoments?: string): string {
  // 🌟 If wins were explicitly shared, celebrate those
  if (wins && wins.trim().length > 0) {
    return `Today you acknowledged: "${wins.trim()}". This awareness itself is worth celebrating - you're actively engaging with your emotional growth.`
  }

  // 🌙 Default celebrations for the brave work of reflection
  const defaultCelebrations = [
    'You took time to reflect on your emotional experience today. This commitment to self-awareness is the foundation of growth.',
    'You showed up for yourself by examining your day. That takes courage and dedication.',
    'Simply noticing your emotional patterns is a significant step. Many go through life unaware - you chose awareness.',
    'You honored your emotions by giving them attention. This is self-compassion in action.',
    'Taking time for evening reflection shows commitment to your wellbeing. That matters.',
  ]

  return defaultCelebrations[Math.floor(Math.random() * defaultCelebrations.length)]
}

/**
 * 🌅 Generate Tomorrow's Intention - The Dawn Weaver
 *
 * Crafts a concrete intention for the next day based on today's patterns.
 * Like planting seeds in the evening for tomorrow's garden.
 *
 * @param blocksAnalysis - Analysis of each block's presence
 * @param challenges - Any challenges mentioned
 * @returns A concrete intention for tomorrow
 *
 * "Tomorrow begins in the wisdom of tonight." 🌄
 */
function generateTomorrowIntention(
  blocksAnalysis: ReflectOnDayOutput['blocks_analysis'],
  challenges?: string
): string {
  // 🔍 Find the most present block
  const dominantBlock = blocksAnalysis.find((b) => b.frequency === 'dominant')
  const frequentBlock = blocksAnalysis.find((b) => b.frequency === 'frequent')
  const primaryBlock = dominantBlock || frequentBlock

  // 🎯 Intention generators for each block
  const blockIntentions: Record<EmotionalBlock, string[]> = {
    anger: [
      'Tomorrow, I will pause before reacting and ask: "Is this a preference or a demand?"',
      'When frustrated tomorrow, I will take three breaths and consider the other person\'s perspective.',
      'I will notice when I use "should" about others and gently reframe to "I would prefer."',
    ],
    anxiety: [
      'Tomorrow, when worry arises, I will ask: "What evidence do I have that I can handle this?"',
      'I will catch one "what if" thought and replace it with "what is" (what\'s actually happening now).',
      'When uncertainty appears, I will remind myself: "I have survived every uncertain moment so far."',
    ],
    depression: [
      'Tomorrow, I will notice one thing I did well, no matter how small.',
      'When self-critical thoughts arise, I will ask: "Would I say this to a friend?"',
      'I will practice separating my actions from my worth - mistakes don\'t define me.',
    ],
    guilt: [
      'Tomorrow, I will practice appropriate guilt (learning from mistakes) not excessive guilt (self-punishment).',
      'When guilt arises, I will ask: "What can I learn and do differently?" then release the rest.',
      'I will treat myself with the same compassion I would offer someone I love.',
    ],
  }

  if (primaryBlock) {
    const intentions = blockIntentions[primaryBlock.block]
    return intentions[Math.floor(Math.random() * intentions.length)]
  }

  // 🌟 General intention if no specific block was dominant
  const generalIntentions = [
    'Tomorrow, I will approach my emotions with curiosity rather than judgment.',
    'I will notice one emotional moment and pause to identify what belief is underneath.',
    'I will practice the art of accepting what I cannot change while taking action on what I can.',
    'Tomorrow, I will treat myself with the same kindness I would offer a dear friend.',
  ]

  return generalIntentions[Math.floor(Math.random() * generalIntentions.length)]
}

/**
 * 📝 Generate Summary - The Narrative Weaver
 *
 * Creates a brief, compassionate summary of the day's emotional landscape.
 * Like a gentle narrator closing the day's chapter.
 *
 * @param blocksAnalysis - Analysis of all blocks
 * @param challenges - Any challenges mentioned
 * @param wins - Any wins mentioned
 * @returns A compassionate summary
 *
 * "Every day is a story; the summary helps us understand the plot." 📖
 */
function generateSummary(
  blocksAnalysis: ReflectOnDayOutput['blocks_analysis'],
  challenges?: string,
  wins?: string
): string {
  const presentBlocks = blocksAnalysis.filter((b) => b.frequency !== 'not_present')
  const dominantBlocks = blocksAnalysis.filter((b) => b.frequency === 'dominant' || b.frequency === 'frequent')

  // 🎭 Craft the narrative based on what was present
  if (presentBlocks.length === 0) {
    return 'Today appears to have been relatively calm emotionally, with no major blocks dominating your experience. This is a good opportunity to appreciate emotional equilibrium when it occurs.'
  }

  if (dominantBlocks.length > 0) {
    const blockNames = dominantBlocks.map((b) => BLOCK_METADATA[b.block].label.toLowerCase())
    const blockList = blockNames.length === 1
      ? blockNames[0]
      : `${blockNames.slice(0, -1).join(', ')} and ${blockNames[blockNames.length - 1]}`

    return `Today's emotional landscape was significantly shaped by ${blockList}. Remember: experiencing these emotions is human and valid. What matters is how we understand and work with them.`
  }

  const occasionalBlocks = presentBlocks.map((b) => BLOCK_METADATA[b.block].label.toLowerCase())
  const blockList = occasionalBlocks.length === 1
    ? occasionalBlocks[0]
    : `${occasionalBlocks.slice(0, -1).join(', ')} and ${occasionalBlocks[occasionalBlocks.length - 1]}`

  return `Today included moments of ${blockList}, though none dominated the day. This balanced experience offers opportunities for gentle reflection without overwhelm.`
}

/**
 * 🌅 Reflect On Day - The Evening Alchemist's Grand Ritual
 *
 * Generates a comprehensive end-of-day reflection analysis using the 4 Blocks
 * framework. This tool transmutes the raw ore of daily emotional experience
 * into golden insights for continued growth.
 *
 * @param input - The seeker's account of their day
 * @returns A complete reflection with analysis, beliefs, celebration, and intention
 *
 * "In the quiet of evening, we turn today's experiences into tomorrow's wisdom." 🌙✨
 *
 * The reflection includes:
 * - 📊 Summary: A compassionate overview of the emotional landscape
 * - 🔍 Blocks Analysis: Frequency, triggers, and growth opportunities for each block
 * - 💭 Beliefs to Examine: 1-3 beliefs worth exploring based on patterns
 * - 🎉 Celebration: Acknowledgment of wins, big or small
 * - 🌅 Tomorrow Intention: A concrete, actionable intention for the next day
 */
export async function reflectOnDay(input: ReflectOnDayInput): Promise<ReflectOnDayOutput> {
  console.log('🌅 ✨ EVENING REFLECTION RITUAL AWAKENS!')

  // 🔮 Validate the sacred input (Zod guards the gates)
  const validatedInput = ReflectOnDayInputSchema.parse(input)
  const { emotional_moments, blocks_experienced, wins, challenges } = validatedInput

  console.log('🔍 🧙‍♂️ Peering into the day\'s emotional tapestry...')

  // 🎭 Analyze each of the four blocks
  const blocksAnalysis: ReflectOnDayOutput['blocks_analysis'] = ALL_BLOCKS.map((block) => {
    // 🌟 Check if this block was explicitly mentioned or detect from narrative
    const wasExplicitlyMentioned = blocks_experienced?.includes(block) ?? false
    const detectedFrequency = analyzeBlockFrequency(emotional_moments, block)

    // 🎯 If explicitly mentioned but not detected, upgrade to at least 'occasional'
    const frequency = wasExplicitlyMentioned && detectedFrequency === 'not_present'
      ? 'occasional'
      : detectedFrequency

    // 🔮 Extract trigger and growth opportunity
    const keyTrigger = frequency !== 'not_present'
      ? extractKeyTrigger(emotional_moments, block)
      : undefined

    const growthOpportunity = selectGrowthOpportunity(block, frequency)

    return {
      block,
      frequency,
      key_trigger: keyTrigger,
      growth_opportunity: growthOpportunity,
    }
  })

  console.log('📜 Unearthing beliefs worth examining...')

  // 🧠 Generate beliefs to examine
  const beliefsToExamine = generateBeliefsToExamine(emotional_moments, blocks_experienced)

  console.log('🎉 Finding something to celebrate...')

  // 🌟 Generate celebration
  const celebration = generateCelebration(wins, emotional_moments)

  console.log('🌅 Weaving tomorrow\'s intention...')

  // 🌄 Generate tomorrow's intention
  const tomorrowIntention = generateTomorrowIntention(blocksAnalysis, challenges)

  console.log('📝 Crafting the compassionate summary...')

  // 📖 Generate summary
  const summary = generateSummary(blocksAnalysis, challenges, wins)

  // 🎭 Validate the output before sending it forth
  const spellbindingResult: ReflectOnDayOutput = {
    summary,
    blocks_analysis: blocksAnalysis,
    beliefs_to_examine: beliefsToExamine,
    celebration,
    tomorrow_intention: tomorrowIntention,
  }

  // ✨ Validate with Zod for type safety and schema compliance
  const validatedOutput = ReflectOnDayOutputSchema.parse(spellbindingResult)

  console.log('🎉 ✨ EVENING REFLECTION MASTERPIECE COMPLETE!')

  return validatedOutput
}

// 🌟 Export as default and named export for maximum flexibility
// "A rose by any name would smell as sweet, but imports are picky." 🌹
export default reflectOnDay
