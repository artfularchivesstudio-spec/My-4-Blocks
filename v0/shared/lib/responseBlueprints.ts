/**
 * 🎭 Response Blueprints - The Template Theater ✨
 *
 * "Two styles enter, one response leaves...
 * chosen by the seeker of wisdom!"
 *
 * Based on the first responder example:
 * - Blueprint A: Structured, step-by-step approach with formulas
 * - Blueprint B: Warm, conversational, discovery-focused
 *
 * Like choosing between a GPS with turn-by-turn directions
 * and a wise friend pointing the way! 🗺️
 *
 * - The Response Blueprint Architect
 */

/**
 * RESPONSE BLUEPRINT A - The Deterministic Cognitive Restructuring Guide (v2.0)
 *
 * Updated to canonical Four Blocks formulas per Dr. Parr's framework.
 * This is the ONLY response blueprint — no alternative approaches.
 */
export const RESPONSE_BLUEPRINT_A = `You are Four Blocks AI — a deterministic cognitive restructuring system built on Dr. Vincent E. Parr's My Four Blocks framework.

## MANDATORY Response Sequence (Every emotional response MUST follow this order):

### Step A: Stabilizing Validation (2-4 sentences)
- Name the situation plainly
- Normalize the emotion without agreeing with irrational beliefs
- No advice yet

### Step B: Formula Anchor
- State the exact Four Blocks formula verbatim before any interpretation:
  - Anger: A = ET + S (Egocentric Thinking + Should)
  - Depression: D = H1 + H2 + N (Hopelessness + Helplessness + Need)
  - Guilt: G = W1 + W2 (Wrongness + Worthlessness)
  - Anxiety: AX = WI + AW + ICSI (What-If + Awfulizing + I-Can't-Stand-It)

### Step C: Scenario Mapping
- Map the user's specific language to formula variables
- Use "your mind may be saying..." language
- 2-3 examples per variable

### Step D: Core Intervention
- Apply the SINGLE lawful cognitive shift for that emotion:
  - Anger: Soften Should → Strong Preference
  - Depression: Soften Need → Wish/Preference
  - Guilt: Separate W1 (Wrongness) from W2 (Worthlessness)
  - Anxiety: Soften WI, AW, and ICSI individually
- Preserve values and dignity
- No behavioral advice may replace this step

### Step E: Identity Protection
- Reframe the emotion as evidence of care, love, duty, or integrity
- Prevent shame collapse or moral weakening

### Step F: Single Precision Question
- Exactly ONE diagnostic question tied to the formula variables
- Never end passively
- Never ask multiple questions

## Core Principle
Events do not create emotions. Beliefs about events create emotions. If a user feels better without identifying and restructuring an irrational belief, the response has failed.

## ABSOLUTE PROHIBITIONS
- NEVER imply events cause emotions
- NEVER validate irrational beliefs
- NEVER offer comfort without restructuring
- NEVER use motivational or "stay positive" language
- NEVER provide behavioral shortcuts as cure
- NEVER inflate self-esteem
- NEVER confirm catastrophizing or reinforce hopelessness
- NEVER skip the formula in an emotional response

## Tone:
- Calm, clear, grounded, respectful, non-dramatic
- A wise, stabilizing human presence — never robotic, never hyped
- Never preachy or condescending`;

/**
 * RESPONSE BLUEPRINT B - RETIRED (v2.0)
 *
 * Blueprint B ("conversational companion") has been retired because it
 * contradicts the v2 constitution's anti-drift requirements. Language like
 * "I wonder if..." and "Share insights as discoveries, not prescriptions"
 * is exactly what the What-Not-To-Say constitutions prohibit.
 *
 * Both A/B variants now use the deterministic response sequence.
 * Blueprint B is aliased to Blueprint A for backward compatibility.
 *
 * @deprecated Use RESPONSE_BLUEPRINT_A instead
 */
export const RESPONSE_BLUEPRINT_B = RESPONSE_BLUEPRINT_A;

/**
 * 🎯 RAG Chunking Labels for Blueprint Responses
 *
 * These labels help identify which type of content
 * from the book is most relevant for each response section.
 */
export const RAG_CHUNK_LABELS = {
  VALIDATION: 'VALIDATION_TRAUMA',
  FORMULA: 'FORMULA_CORE',
  MAPPING: 'MAPPING_EXAMPLES',
  INTERVENTION: 'INTERVENTION_SHIFT',
  REFRAME: 'REFRAME_COMPASSION',
  NEXT_QUESTION: 'NEXT_QUESTION_TRIAGE',
};

// ═══════════════════════════════════════════════════════════════════════════
// 🎭 TYPES FOR A/B TESTING ARENA
// The blueprints need their battle gear!
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 🎯 The Four Emotional Blocks - The Horsemen of the Mind! 🐴
 */
export type EmotionalBlock = 'Anger' | 'Anxiety' | 'Depression' | 'Guilt';

/**
 * 🎭 Blueprint Variant - Team A or Team B!
 */
export type BlueprintVariant = 'A' | 'B';

/**
 * 📋 Blueprint Configuration - The battle specs!
 */
export interface BlueprintConfig {
  variant: BlueprintVariant;
  name: string;
  description: string;
  prompt: string;
}

/**
 * Get Blueprint Config - Both variants now return the deterministic sequence.
 * Blueprint B is retired; both return the canonical v2 structured approach.
 */
export function getBlueprintConfig(variant: BlueprintVariant): BlueprintConfig {
  // v2: Both variants use the deterministic response sequence
  return {
    variant,
    name: 'Deterministic Cognitive Restructuring',
    description: 'Canonical Four Blocks response sequence: Validate, Formula, Map, Restructure, Protect, Question',
    prompt: RESPONSE_BLUEPRINT_A,
  };
}

/**
 * 🔮 The Four Blocks Quick Reference
 *
 * Handy reference for detecting which block the user might be experiencing.
 * Used by the emotion detection system! 🎯
 */
export const FOUR_BLOCKS_REFERENCE = {
  ANGER: {
    name: 'Anger',
    formula: 'A = ET + S (Egocentric Thinking + Should)',
    keywords: ['angry', 'furious', 'unfair', 'wrong', 'shouldn\'t', 'how dare', 'mad'],
    coreInsight: 'Anger = "I\'m right, you\'re wrong, you shouldn\'t." Intervention: Soften Should to Strong Preference.',
    intervention: 'Soften Should → Strong Preference',
  },
  ANXIETY: {
    name: 'Anxiety',
    formula: 'AX = WI + AW + ICSI (What-If + Awfulizing + I-Can\'t-Stand-It)',
    keywords: ['anxious', 'worried', 'scared', 'what if', 'nervous', 'panic', 'dread'],
    coreInsight: 'Anxiety = Feared future + catastrophic meaning + distress intolerance. Intervention: Soften WI, AW, and ICSI individually.',
    intervention: 'Soften WI, AW, and ICSI individually',
  },
  DEPRESSION: {
    name: 'Depression',
    formula: 'D = H1 + H2 + N (Hopelessness + Helplessness + Need)',
    keywords: ['depressed', 'hopeless', 'worthless', 'can\'t', 'failure', 'useless', 'empty'],
    coreInsight: 'Depression = Future permanently bad + no power to change + rigid demand reality must differ. Intervention: Soften Need to Wish/Preference.',
    intervention: 'Soften Need → Wish/Preference',
  },
  GUILT: {
    name: 'Guilt',
    formula: 'G = W1 + W2 (Wrongness + Worthlessness)',
    keywords: ['guilty', 'ashamed', 'should have', 'regret', 'blame myself', 'my fault'],
    coreInsight: 'Guilt = Perceived mistake + identity judgment "I am bad." Intervention: Separate W1 from W2.',
    intervention: 'Separate W1 (Wrongness) from W2 (Worthlessness)',
  },
};

/**
 * 🎭 Detect which block the user might be experiencing
 *
 * A simple keyword-based detection to help personalize responses.
 * Not a diagnosis, just a helpful pointer! 🧭
 *
 * @param query - The user's message
 * @returns The detected block info or undefined
 */
export function detectBlockFromQuery(query: string): {
  block: keyof typeof FOUR_BLOCKS_REFERENCE;
  name: string;
  formula: string;
  coreInsight: string;
} | undefined {
  const lower = query.toLowerCase();

  for (const [key, block] of Object.entries(FOUR_BLOCKS_REFERENCE)) {
    for (const keyword of block.keywords) {
      if (lower.includes(keyword)) {
        return {
          block: key as keyof typeof FOUR_BLOCKS_REFERENCE,
          name: block.name,
          formula: block.formula,
          coreInsight: block.coreInsight,
        };
      }
    }
  }

  return undefined;
}

/**
 * 🏷️ Detect Emotional Block from Text - The Sophisticated Pattern Matcher
 *
 * Uses regex patterns to detect which of the Four Blocks
 * might be most relevant. More nuanced than keyword matching! 🎯
 *
 * @param text - The user's message
 * @returns Most likely block or null if unclear
 */
export function detectLikelyBlock(text: string): EmotionalBlock | null {
  const lowerText = text.toLowerCase();

  // Depression patterns: global self-rating ("I am..." statements)
  const depressionPatterns = [
    /i('m| am) (a |such a |so |just )?(failure|loser|worthless|useless|nothing|pathetic|stupid|dumb|idiot)/,
    /i('m| am) not (good |worth |)enough/,
    /what('s| is) (wrong|the point) with me/,
    /i hate (myself|who i am)/,
    /i can'?t do anything right/,
    /nobody (loves|likes|cares about|wants) me/,
  ];

  // Guilt patterns: regret about specific actions
  const guiltPatterns = [
    /i should(n'?t| not) have/,
    /i wish i had(n'?t| not)/,
    /i feel (so |really |)?(bad|terrible|awful) (about|for) (what i|doing|saying)/,
    /how could i (have |)(do|say|be so)/,
    /i made (a |such a )?(terrible|horrible|awful|big) mistake/,
    /i('m| am) (so |)ashamed (of|that)/,
  ];

  // Anxiety patterns: future catastrophizing
  const anxietyPatterns = [
    /what if/,
    /i('m| am) (so |really |)?(worried|anxious|scared|terrified|afraid|nervous) (about|that)/,
    /i can'?t stop (thinking|worrying) about/,
    /something (bad|terrible|awful) (is going to|will|might)/,
    /i('m| am) freaking out/,
    /panic/,
  ];

  // Anger patterns: demands directed at others/situations
  const angerPatterns = [
    /(he|she|they|it|you|people|everyone) should(n'?t| not)?(?! have)/,
    /(he|she|they|it|this|that) (is|are) (so |)(unfair|wrong|ridiculous|stupid|absurd)/,
    /how (dare|could) (he|she|they|you)/,
    /i('m| am) (so |really |)?(angry|furious|pissed|mad|livid|enraged)/,
    /this (is |)(shouldn'?t|must not|can'?t) be happening/,
  ];

  // 🎯 Check patterns in order of specificity
  for (const pattern of depressionPatterns) {
    if (pattern.test(lowerText)) return 'Depression';
  }
  for (const pattern of guiltPatterns) {
    if (pattern.test(lowerText)) return 'Guilt';
  }
  for (const pattern of anxietyPatterns) {
    if (pattern.test(lowerText)) return 'Anxiety';
  }
  for (const pattern of angerPatterns) {
    if (pattern.test(lowerText)) return 'Anger';
  }

  return null;
}

/**
 * 🎭 Build Enhanced System Prompt with Blueprint - The Complete Battle Armor!
 *
 * Combines the base knowledge with a specific blueprint for A/B testing.
 * Returns a complete system prompt ready for the chat API.
 *
 * @param variant - Which blueprint to use ('A' or 'B')
 * @param baseKnowledge - Optional additional context (e.g., RAG results)
 * @returns Complete system prompt string
 */
export function buildEnhancedSystemPrompt(
  variant: BlueprintVariant,
  baseKnowledge?: string
): string {
  const blueprint = getBlueprintConfig(variant);

  let prompt = `${blueprint.prompt}

## Core Framework Reference (v2.0 Canonical)

### Core Conviction
Events do not create emotions. Beliefs about events create emotions. This is operational law.

### The Four Emotional Formulas (NON-NEGOTIABLE)
- Anger: A = ET + S (Egocentric Thinking + Should)
- Depression: D = H1 + H2 + N (Hopelessness + Helplessness + Need)
- Guilt: G = W1 + W2 (Wrongness + Worthlessness)
- Anxiety: AX = WI + AW + ICSI (What-If + Awfulizing + I-Can't-Stand-It)

### The Five Cognitive Frameworks (Causal Chain)
Event → Mental Contamination → Seven Irrational Beliefs → ABCs → Three Insights → Happiness

### ABCs — A (Activating Event) → B (Belief) → C (Consequence)
A does NOT cause C. B causes C. Changing B changes C.

### Three Insights — The Permanent Shift
- Insight 1: "There is no reason I must have what I want." (Demand → Preference)
- Insight 2: "I can stand what I don't like." (Catastrophe → Difficulty)
- Insight 3: "I am worthwhile even when I fail." (Self-Condemnation → Unconditional Worth)

### Happiness Definition (Final Authority)
Happiness = emotional peace created by rational thinking. NOT pleasure, success, achievement, approval, or comfort.`;

  if (baseKnowledge) {
    prompt += `\n\n## Relevant Context from the Book\n${baseKnowledge}`;
  }

  return prompt;
}
