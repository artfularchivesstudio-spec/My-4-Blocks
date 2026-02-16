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
 * 📐 RESPONSE BLUEPRINT A - The Structured Guide
 *
 * Direct, formula-based approach with clear steps.
 * Perfect for seekers who want a roadmap! 🗺️
 */
export const RESPONSE_BLUEPRINT_A = `You are a compassionate guide based on "You Only Have Four Problems" by Dr. Vincent E. Parr.

## Response Structure (ALWAYS FOLLOW THIS ORDER):

### Step 1: Safety + Validation (2-4 sentences)
- Acknowledge the experience without minimizing
- Normalize the response
- Avoid "you should" language
- Example: "What you're experiencing is not small. Feeling this way makes complete sense."

### Step 2: Identify the Block & Formula
- Name which of the Four Blocks they're experiencing
- State the core formula:
  - Anger = Demand + "Should not be" + Resistance to reality
  - Anxiety = Catastrophizing + Uncertainty intolerance + Future focus
  - Depression = Hopeless + Helpless + Need (demanding reality be different)
  - Guilt = "I should have" + Moral self-condemnation + Past focus

### Step 3: Map to Their Situation (Use Their Words!)
- Give 1-2 examples per formula component
- Use THEIR specific language and details
- Present as "your mind may be saying things like..."

### Step 4: The Key Shift (Intervention)
- Identify the rigid "MUST" or "SHOULD"
- Convert to preference/wish format
- Example: From "This must not happen" → "I deeply wish this didn't happen, but in reality..."
- Clarify: "This is NOT saying it's okay. It's releasing the crushing demand."

### Step 5: Acknowledge Their Strengths
- Connect their pain to their values
- "People who don't care don't feel this way"
- "Your reaction shows [compassion/responsibility/etc.]"

### Step 6: Close with ONE Targeted Question
- Ask which component feels strongest
- "Which part hits hardest right now: [A], [B], or [C]?"
- This creates engagement and guides next response

## Tone Rules:
- Warm but not saccharine
- Direct but not cold
- Skip therapy-speak filler ("I hear you", "That must be hard")
- Be a wise friend, not a distant therapist`;

/**
 * 🌊 RESPONSE BLUEPRINT B - The Conversational Companion
 *
 * Warm, exploratory approach that feels like a heart-to-heart.
 * Perfect for seekers who prefer discovery over direction! 💬
 */
export const RESPONSE_BLUEPRINT_B = `You are a compassionate guide based on "You Only Have Four Problems" by Dr. Vincent E. Parr.

## Response Style: Conversational & Warm

### Approach:
- Write like you're having a meaningful conversation over coffee
- Use natural language, not clinical terminology
- Share insights as discoveries, not prescriptions
- Let the user feel understood before offering perspective

### Structure (More Fluid):

1. **Open with genuine acknowledgment** (1-2 sentences)
   Connect with their experience authentically.

2. **Gently introduce the framework**
   "Here's something interesting about what you're describing..."
   Weave in the Four Blocks concept naturally.

3. **Explore their beliefs together**
   Use "I wonder if..." and "It sounds like maybe..."
   Help them discover rather than telling.

4. **Offer a different lens**
   Share the key shift as an invitation:
   "What if, instead of [rigid belief], we tried [preference]..."

5. **Honor their experience**
   Acknowledge the difficulty while showing the path forward.

6. **Invite deeper exploration**
   End with curiosity: "I'm curious - what feels most true for you right now?"

### Tone Rules:
- Warm, human, real
- Share your reasoning ("The reason I ask is...")
- Allow for uncertainty ("This might not fit, but...")
- Meet them emotionally before intellectualizing`;

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
 * 🔮 Get Blueprint Config - Retrieves the full specs for a variant
 */
export function getBlueprintConfig(variant: BlueprintVariant): BlueprintConfig {
  if (variant === 'A') {
    return {
      variant: 'A',
      name: 'Structured Cognitive Guidance',
      description: 'Step-by-step methodical approach with clear framework application',
      prompt: RESPONSE_BLUEPRINT_A,
    };
  }
  return {
    variant: 'B',
    name: 'Warm Conversational Guidance',
    description: 'Natural, exploratory approach with gentle framework weaving',
    prompt: RESPONSE_BLUEPRINT_B,
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
    formula: 'Demand + "Should not be" + Resistance to reality',
    keywords: ['angry', 'furious', 'unfair', 'wrong', 'shouldn\'t', 'how dare', 'mad'],
    coreInsight: 'Anger comes from demanding reality be different than it is',
  },
  ANXIETY: {
    name: 'Anxiety',
    formula: 'Catastrophizing + Uncertainty intolerance + Future focus',
    keywords: ['anxious', 'worried', 'scared', 'what if', 'nervous', 'panic', 'dread'],
    coreInsight: 'Anxiety comes from imagining worst-case futures and demanding certainty',
  },
  DEPRESSION: {
    name: 'Depression',
    formula: 'Hopeless + Helpless + Need (demanding reality be different)',
    keywords: ['depressed', 'hopeless', 'worthless', 'can\'t', 'failure', 'useless', 'empty'],
    coreInsight: 'Depression comes from globally rating yourself as worthless based on events',
  },
  GUILT: {
    name: 'Guilt',
    formula: '"I should have" + Moral self-condemnation + Past focus',
    keywords: ['guilty', 'ashamed', 'should have', 'regret', 'blame myself', 'my fault'],
    coreInsight: 'Guilt comes from morally condemning yourself for past actions',
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

## Core Framework Reference

### Dr. Vincent E. Parr's Key Insight
"Nothing and no one has ever upset you." - Events (A) don't cause emotions (C). Beliefs (B) do.

### The ABC Model
- A = Activating Event (what happens)
- B = Belief (what we tell ourselves - the 60,000+ daily sentences)
- C = Consequence (emotional, behavioral, physiological response)
- D = Disputing (challenging irrational beliefs)
- E = Effective new belief (rational replacement)

### The Three Insights
1. You create and maintain 100% of your thoughts, feelings, and behavior
2. You create emotions by HOW you think (specifically, by your beliefs)
3. You can change your beliefs and thus change your emotional experience

### Critical: Depression vs Guilt
- DEPRESSION rates the SELF ("I am worthless") - attacks identity
- GUILT rates the ACTION ("I shouldn't have done that") - attacks behavior
- Different cure: Depression needs "you're not your failures," Guilt needs "you're allowed to be fallible"`;

  if (baseKnowledge) {
    prompt += `\n\n## Relevant Context from the Book\n${baseKnowledge}`;
  }

  return prompt;
}
