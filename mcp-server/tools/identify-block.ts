/**
 * 🎭 The Block Identifier - A Compass for the Emotional Wilderness
 *
 * "In the theater of the mind, emotions perform their ancient dances.
 * This tool peers behind the curtain to name what lurks in shadow,
 * for naming is the first step toward understanding."
 *
 * Uses linguistic pattern matching to identify which of the 4 emotional blocks
 * (Anger, Anxiety, Depression, Guilt) is most prominently at play.
 *
 * - The Spellbinding Emotion Alchemist of My 4 Blocks
 */

import {
  IdentifyBlockInput,
  IdentifyBlockOutput,
  EmotionalBlock,
  BLOCK_METADATA,
} from '../schemas/tool-schemas.js'

// 🔮 The Mystical Indicator Patterns - Keywords that betray each block's presence
// Like emotional fingerprints, these phrases reveal what lurks beneath the surface

interface BlockIndicators {
  keywords: string[]
  phrases: RegExp[]
  weight: number
}

/**
 * 🎨 The Sacred Lexicon - A map of words to their emotional territories
 *
 * Each block carries its own vocabulary, its own way of speaking pain.
 * These patterns are the decoder ring for emotional distress.
 * (Ellis would be proud... or mildly exasperated, same thing really 🙃)
 */
const BLOCK_INDICATORS: Record<EmotionalBlock, BlockIndicators> = {
  anger: {
    keywords: [
      'unfair',
      "shouldn't",
      'wrong',
      'stupid',
      'idiot',
      'hate',
      'furious',
      'mad',
      'angry',
      'pissed',
      'frustrated',
      'annoyed',
      'irritated',
      'resentful',
      'outraged',
      'bitter',
      'hostile',
      'violated',
      'disrespected',
      'betrayed',
      'injustice',
      'nerve',
      'audacity',
      'inconsiderate',
      'selfish',
      'rude',
    ],
    phrases: [
      /they\s+should(n'?t)?/i,
      /how\s+dare/i,
      /can'?t\s+believe\s+(they|he|she|it)/i,
      /makes?\s+me\s+(so\s+)?(angry|mad|furious)/i,
      /no\s+right\s+to/i,
      /always\s+does?\s+this/i,
      /never\s+listen/i,
      /sick\s+(and\s+tired\s+)?of/i,
      /who\s+do\s+they\s+think/i,
      /supposed\s+to/i,
    ],
    weight: 1.0,
  },

  anxiety: {
    keywords: [
      'worried',
      'anxious',
      'nervous',
      'scared',
      'terrified',
      'panic',
      'dread',
      'fear',
      'overwhelmed',
      'stressed',
      'tense',
      'uneasy',
      'apprehensive',
      'catastrophe',
      'disaster',
      'terrible',
      'awful',
      'worst',
      'horrible',
      'unbearable',
      'handle',
      'cope',
      'control',
    ],
    phrases: [
      /what\s+if/i,
      /can'?t\s+(handle|stand|take|cope|deal)/i,
      /going\s+to\s+(be\s+)?(terrible|awful|disaster|horrible)/i,
      /might\s+(happen|go\s+wrong|fail)/i,
      /could\s+(go\s+wrong|fail|be\s+bad)/i,
      /worst\s+(case|thing|scenario)/i,
      /never\s+(recover|be\s+okay|get\s+over)/i,
      /too\s+much/i,
      /out\s+of\s+control/i,
      /something\s+bad/i,
      /everything\s+will/i,
    ],
    weight: 1.0,
  },

  depression: {
    keywords: [
      'worthless',
      'hopeless',
      'failure',
      'useless',
      'pathetic',
      'loser',
      'inadequate',
      'inferior',
      'incompetent',
      'stupid',
      'defective',
      'broken',
      'empty',
      'numb',
      'sad',
      'depressed',
      'miserable',
      'despair',
      'meaningless',
      'pointless',
      'unlovable',
      'unwanted',
      'rejected',
      'alone',
      'lonely',
    ],
    phrases: [
      /i('m|\s+am)\s+(a\s+)?(failure|loser|worthless|useless|pathetic)/i,
      /nothing\s+(matters|works|helps)/i,
      /always\s+(fail|mess|screw)/i,
      /never\s+(good|smart|enough)/i,
      /what'?s\s+(the\s+)?point/i,
      /no\s+(point|hope|use)/i,
      /will\s+never\s+(be|get|have)/i,
      /i\s+can'?t\s+do\s+anything\s+right/i,
      /everyone\s+else\s+(is|can)/i,
      /something\s+wrong\s+with\s+me/i,
      /i'?m\s+not\s+(good|smart|capable)/i,
    ],
    weight: 1.0,
  },

  guilt: {
    keywords: [
      'guilty',
      'ashamed',
      'shame',
      'regret',
      'remorse',
      'sorry',
      'blame',
      'fault',
      'wrong',
      'bad',
      'terrible',
      'awful',
      'mistake',
      'selfish',
      'thoughtless',
      'careless',
      'inconsiderate',
      'hurt',
      'damaged',
      'ruined',
    ],
    phrases: [
      /should(n'?t)?\s+have/i,
      /could\s+have/i,
      /if\s+(only\s+)?i\s+had/i,
      /my\s+fault/i,
      /i\s+(caused|made|did|ruined|hurt)/i,
      /i'?m\s+(so\s+)?(terrible|awful|bad|selfish)/i,
      /let\s+(them|everyone|him|her)\s+down/i,
      /how\s+could\s+i/i,
      /i\s+knew\s+better/i,
      /what\s+have\s+i\s+done/i,
      /never\s+forgive\s+(myself|me)/i,
    ],
    weight: 1.0,
  },
}

/**
 * 🌟 The Score Keeper - Tallies the presence of each emotional block
 *
 * Analyzes text for keyword matches and phrase patterns, returning
 * a weighted score for each block. It's like emotional archaeology,
 * but with regex instead of tiny brushes. ⛏️
 *
 * @param text - The combined text to analyze for emotional indicators
 * @returns A record mapping each block to its detection score
 */
function calculateBlockScores(text: string): Record<EmotionalBlock, number> {
  const normalizedText = text.toLowerCase()
  const scores: Record<EmotionalBlock, number> = {
    anger: 0,
    anxiety: 0,
    depression: 0,
    guilt: 0,
  }

  // 🔍 Scan the textual terrain for emotional landmarks
  const blocks: EmotionalBlock[] = ['anger', 'anxiety', 'depression', 'guilt']

  for (const block of blocks) {
    const indicators = BLOCK_INDICATORS[block]
    let blockScore = 0
    let matchCount = 0

    // 🎯 Keyword hunting - each word is a breadcrumb on the emotional trail
    for (const keyword of indicators.keywords) {
      const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'gi')
      const matches = normalizedText.match(keywordRegex)
      if (matches) {
        blockScore += matches.length * 1.0
        matchCount += matches.length
      }
    }

    // 🌊 Phrase pattern matching - the deeper currents of meaning
    for (const pattern of indicators.phrases) {
      if (pattern.test(text)) {
        blockScore += 2.0 // Phrases carry more weight, like emotional anchors
        matchCount += 1
      }
    }

    // ✨ Apply the mystical weight and normalize
    scores[block] = blockScore * indicators.weight
  }

  return scores
}

/**
 * 🎪 The Indicator Extractor - Finds the smoking guns of emotion
 *
 * Returns the specific words and phrases that led to the block identification.
 * Because transparency is key, and users deserve to know why we think they're
 * experiencing what they're experiencing. Knowledge is power! 💪
 *
 * @param text - The text to scan for indicators
 * @param block - The emotional block to find indicators for
 * @returns Array of matched keywords and phrase descriptions
 */
function extractKeyIndicators(text: string, block: EmotionalBlock): string[] {
  const normalizedText = text.toLowerCase()
  const indicators = BLOCK_INDICATORS[block]
  const found: string[] = []

  // 🔮 Crystal ball keyword detection
  for (const keyword of indicators.keywords) {
    const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'gi')
    if (keywordRegex.test(normalizedText)) {
      found.push(`"${keyword}"`)
    }
  }

  // 🎭 Pattern matching for the sophisticated phrases
  for (const pattern of indicators.phrases) {
    const match = text.match(pattern)
    if (match) {
      found.push(`"${match[0]}"`)
    }
  }

  // Keep it concise - the top 5 most telling indicators
  // (Nobody needs a dissertation on why they're anxious 📚)
  return [...new Set(found)].slice(0, 5)
}

/**
 * 🔮 The Reasoning Weaver - Crafts the explanation behind the identification
 *
 * Creates a human-readable explanation of why we believe a particular
 * block is at play. Think of it as the fortune teller's interpretation,
 * but backed by linguistic analysis rather than tea leaves. 🍵
 *
 * @param primaryBlock - The identified primary emotional block
 * @param secondaryBlock - Optional secondary block
 * @param indicators - The key indicators that led to this conclusion
 * @returns A prose explanation of the identification
 */
function generateReasoning(
  primaryBlock: EmotionalBlock,
  secondaryBlock: EmotionalBlock | undefined,
  indicators: string[]
): string {
  const metadata = BLOCK_METADATA[primaryBlock]
  const indicatorList = indicators.slice(0, 3).join(', ')

  let reasoning = `The language patterns suggest ${metadata.emoji} ${metadata.label} as the primary emotional block. `
  reasoning += `Key indicators like ${indicatorList} point to ${metadata.description.toLowerCase()} `

  if (secondaryBlock) {
    const secondaryMeta = BLOCK_METADATA[secondaryBlock]
    reasoning += `There are also traces of ${secondaryMeta.emoji} ${secondaryMeta.label}, which may be intertwined with the primary emotion.`
  }

  return reasoning.trim()
}

/**
 * 🎭 The Grand Identifier - The Main Event of Emotional Recognition
 *
 * This is the star of the show! Takes in a user's situation, feelings, and
 * thought patterns, then performs the mystical analysis to determine which
 * of the four emotional blocks is most prominently at play.
 *
 * Think of it as an emotional GPS - "Recalculating... you appear to be
 * heading toward Anger Canyon. Would you like to take a different route?" 🗺️
 *
 * @param input - The situation, feelings, and thought patterns to analyze
 * @returns The identification results with reasoning and confidence
 *
 * @example
 * ```typescript
 * const result = await identifyBlock({
 *   situation: "My coworker took credit for my work in the meeting",
 *   feelings: "furious, disrespected, betrayed",
 *   thought_pattern: "They shouldn't have done that, it's so unfair!"
 * });
 * // Returns: { primary_block: 'anger', confidence: 0.85, ... }
 * ```
 */
export async function identifyBlock(input: IdentifyBlockInput): Promise<IdentifyBlockOutput> {
  // 🌟 Combine all the mystical ingredients into one cauldron of text
  const combinedText = [
    input.situation,
    input.feelings,
    input.thought_pattern || '',
  ].join(' ')

  // 🧮 Calculate the cosmic scores for each emotional territory
  const scores = calculateBlockScores(combinedText)

  // 🏆 Sort to find the champion block (and the runner-up, poor thing)
  const sortedBlocks = (Object.entries(scores) as [EmotionalBlock, number][])
    .sort((a, b) => b[1] - a[1])

  const [primaryEntry, secondaryEntry] = sortedBlocks
  const [primaryBlock, primaryScore] = primaryEntry
  const [secondaryBlock, secondaryScore] = secondaryEntry

  // 📊 Calculate confidence - how sure are we about this emotional diagnosis?
  // Higher score differential = higher confidence
  const totalScore = Object.values(scores).reduce((sum, s) => sum + s, 0)
  let confidence: number

  if (totalScore === 0) {
    // 🌙 No clear indicators - we're reading tea leaves at this point
    confidence = 0.25
  } else {
    // ✨ The primary block's dominance determines our confidence
    const dominanceRatio = primaryScore / totalScore
    const spreadFactor = primaryScore > 0 && secondaryScore > 0
      ? (primaryScore - secondaryScore) / primaryScore
      : 1.0

    confidence = Math.min(0.95, Math.max(0.3, (dominanceRatio + spreadFactor) / 2))
  }

  // 🔍 Extract the telltale indicators that led us here
  const keyIndicators = extractKeyIndicators(combinedText, primaryBlock)

  // 🎪 Only include secondary block if it has meaningful presence
  // (We don't want to confuse folks with weak signals)
  const includeSecondary = secondaryScore > 0 && secondaryScore >= primaryScore * 0.4

  // 📜 Weave the reasoning narrative
  const reasoning = generateReasoning(
    primaryBlock,
    includeSecondary ? secondaryBlock : undefined,
    keyIndicators
  )

  // 🎉 The grand revelation!
  return {
    primary_block: primaryBlock,
    confidence: Math.round(confidence * 100) / 100, // Round to 2 decimal places
    secondary_block: includeSecondary ? secondaryBlock : undefined,
    reasoning,
    key_indicators: keyIndicators.length > 0
      ? keyIndicators
      : ['No strong linguistic indicators found - result based on overall tone'],
  }
}

// 🌟 Export the mystical function for the world to use
// (Both named and default, because flexibility is a virtue)
export default identifyBlock
