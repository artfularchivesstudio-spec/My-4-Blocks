/**
 * 🎭 The Tool Schema Sanctum - Where Parameters Find Their True Form
 *
 * "Every input carries intention; every validation, a guardian of clarity."
 *
 * These Zod schemas define the shapes of data flowing through our MCP tools.
 * Minimal, purposeful, and just enough structure to let the model choose wisely.
 *
 * - The Spellbinding Schema Architect of My 4 Blocks
 */

import { z } from 'zod'

// 🔮 The Four Blocks - The emotional compass points
export const EmotionalBlockSchema = z.enum([
  'anger',
  'anxiety',
  'depression',
  'guilt',
])
export type EmotionalBlock = z.infer<typeof EmotionalBlockSchema>

// 🎨 Block metadata for display purposes
export const BLOCK_METADATA: Record<
  EmotionalBlock,
  { label: string; color: string; emoji: string; description: string }
> = {
  anger: {
    label: 'Anger',
    color: '#E57373',
    emoji: '🔥',
    description: 'Created when we demand others or situations be different than they are.',
  },
  anxiety: {
    label: 'Anxiety',
    color: '#64B5F6',
    emoji: '⚡',
    description: "Created when we catastrophize about the future and tell ourselves we can't stand potential outcomes.",
  },
  depression: {
    label: 'Depression',
    color: '#90A4AE',
    emoji: '🌧️',
    description: 'Created when we rate ourselves as worthless or inadequate.',
  },
  guilt: {
    label: 'Guilt',
    color: '#9575CD',
    emoji: '⚖️',
    description: 'Created when we demand we "should" have acted differently and rate ourselves negatively.',
  },
}

// 🌟 The Seven Irrational Beliefs
export const IrrationalBeliefTypeSchema = z.enum([
  'it_statements',
  'awfulizing',
  'cant_stand_it',
  'shoulds_musts_demands',
  'rating',
  'absolutistic_thinking',
  'entitlement',
])
export type IrrationalBeliefType = z.infer<typeof IrrationalBeliefTypeSchema>

export const IRRATIONAL_BELIEF_METADATA: Record<
  IrrationalBeliefType,
  { label: string; description: string; example: string }
> = {
  it_statements: {
    label: "'It' Statements",
    description: 'Blaming external things for our emotions',
    example: '"It made me so angry" or "That situation ruined my day"',
  },
  awfulizing: {
    label: 'Awfulizing',
    description: 'Exaggerating unpleasantness to catastrophic levels',
    example: '"This is the worst thing that could ever happen"',
  },
  cant_stand_it: {
    label: "I Can't Stand It",
    description: 'Believing we cannot survive current conditions',
    example: '"I can\'t take this anymore" or "This is unbearable"',
  },
  shoulds_musts_demands: {
    label: 'Shoulds, Musts, and Demands',
    description: 'Rigid demands that reality be different',
    example: '"They should have known better" or "I must succeed"',
  },
  rating: {
    label: 'Rating',
    description: 'Labeling self or others as worthless based on behavior',
    example: '"I\'m such an idiot" or "They are a terrible person"',
  },
  absolutistic_thinking: {
    label: 'Absolutistic Thinking',
    description: 'Using words like "always", "never", "everyone"',
    example: '"I always mess things up" or "Nobody ever listens to me"',
  },
  entitlement: {
    label: 'Entitlement',
    description: 'Believing we deserve special treatment',
    example: '"I deserve to be treated better" or "Life owes me happiness"',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎪 TOOL INPUT SCHEMAS - The Stage Directions for Each Performance
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 🔍 identify_block - Input schema
 *
 * Use this when: The user describes an emotional challenge but hasn't yet
 * identified the core emotion they're experiencing.
 */
export const IdentifyBlockInputSchema = z.object({
  situation: z
    .string()
    .min(10)
    .max(1000)
    .describe('Brief description of what happened (1-3 sentences)'),
  feelings: z
    .string()
    .min(3)
    .max(500)
    .describe('Words the user used to describe their emotions'),
  thought_pattern: z
    .string()
    .max(500)
    .optional()
    .describe('What the user is telling themselves about the situation'),
})
export type IdentifyBlockInput = z.infer<typeof IdentifyBlockInputSchema>

/**
 * 🔍 identify_block - Output schema
 */
export const IdentifyBlockOutputSchema = z.object({
  primary_block: EmotionalBlockSchema.describe('The primary emotional block identified'),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe('Confidence level from 0 to 1'),
  secondary_block: EmotionalBlockSchema.optional().describe(
    'A secondary block that may also be present'
  ),
  reasoning: z
    .string()
    .describe('Brief explanation of why this block was identified'),
  key_indicators: z
    .array(z.string())
    .describe('Specific words or phrases that pointed to this block'),
})
export type IdentifyBlockOutput = z.infer<typeof IdentifyBlockOutputSchema>

// ───────────────────────────────────────────────────────────────────────────────

/**
 * 🧠 find_irrational_belief - Input schema
 *
 * Use this when: The user has shared their situation and you want to extract
 * the underlying irrational belief causing the emotional disturbance.
 */
export const FindBeliefInputSchema = z.object({
  situation: z
    .string()
    .min(10)
    .max(1000)
    .describe("The activating event - what happened in the user's narrative"),
  emotional_response: z
    .string()
    .min(3)
    .max(500)
    .describe('How the user feels about the situation'),
  self_talk: z
    .string()
    .max(1000)
    .optional()
    .describe('Any statements the user makes about what they tell themselves'),
  identified_block: EmotionalBlockSchema.optional().describe(
    'If a block has already been identified, include it for context'
  ),
})
export type FindBeliefInput = z.infer<typeof FindBeliefInputSchema>

/**
 * 🧠 find_irrational_belief - Output schema
 */
export const FindBeliefOutputSchema = z.object({
  belief_statement: z
    .string()
    .describe('The extracted irrational belief in clear, quotable form'),
  belief_type: IrrationalBeliefTypeSchema.describe(
    'Which of the 7 irrational belief types this matches'
  ),
  abc_breakdown: z.object({
    a_event: z.string().describe('The activating event (what happened)'),
    b_belief: z.string().describe('The belief (what they tell themselves)'),
    c_consequence: z.string().describe('The emotional/behavioral consequence'),
  }),
  underlying_demand: z
    .string()
    .optional()
    .describe('The hidden demand beneath the belief (should/must/have to)'),
})
export type FindBeliefOutput = z.infer<typeof FindBeliefOutputSchema>

// ───────────────────────────────────────────────────────────────────────────────

/**
 * ⚔️ dispute_belief - Input schema
 *
 * Use this when: A belief has been identified and the user is ready to
 * challenge it with Four Blocks disputation questions.
 */
export const DisputeBeliefInputSchema = z.object({
  belief_statement: z
    .string()
    .min(5)
    .max(500)
    .describe('The irrational belief to dispute'),
  belief_type: IrrationalBeliefTypeSchema.optional().describe(
    'Type of belief for targeted disputation'
  ),
  context: z
    .string()
    .max(500)
    .optional()
    .describe('Additional context about the situation'),
})
export type DisputeBeliefInput = z.infer<typeof DisputeBeliefInputSchema>

/**
 * ⚔️ dispute_belief - Output schema
 */
export const DisputeBeliefOutputSchema = z.object({
  disputation_questions: z.array(
    z.object({
      question: z.string().describe('The disputation question'),
      purpose: z.string().describe('Why this question helps challenge the belief'),
      source: z.enum(['four_blocks', 'byron_katie', 'stoic', 'general']).describe(
        'The therapeutic tradition this question comes from'
      ),
    })
  ),
  rational_alternative: z
    .string()
    .describe('A rational alternative belief to consider'),
  reframe_suggestion: z
    .string()
    .optional()
    .describe('A gentle reframe of the situation'),
})
export type DisputeBeliefOutput = z.infer<typeof DisputeBeliefOutputSchema>

// ───────────────────────────────────────────────────────────────────────────────

/**
 * 📋 create_daily_plan - Input schema
 *
 * Use this when: The user wants to create a structured daily plan using
 * the 4 Blocks framework for emotional wellness.
 */
export const CreateDailyPlanInputSchema = z.object({
  focus_areas: z
    .array(EmotionalBlockSchema)
    .min(1)
    .max(4)
    .optional()
    .describe('Which blocks to focus on today (default: all 4)'),
  current_challenges: z
    .string()
    .max(500)
    .optional()
    .describe('Any current emotional challenges the user is working through'),
  intentions: z
    .string()
    .max(500)
    .optional()
    .describe("User's intentions or goals for the day"),
  time_available: z
    .enum(['quick', 'moderate', 'extended'])
    .optional()
    .describe('How much time the user has for reflection today'),
})
export type CreateDailyPlanInput = z.infer<typeof CreateDailyPlanInputSchema>

/**
 * 📋 create_daily_plan - Output schema
 */
export const CreateDailyPlanOutputSchema = z.object({
  morning_check_in: z.object({
    questions: z.array(z.string()).describe('Questions to ask yourself this morning'),
    intention: z.string().describe('A morning intention to set'),
  }),
  block_focuses: z.array(
    z.object({
      block: EmotionalBlockSchema,
      awareness_prompt: z.string().describe('A prompt to increase awareness of this block'),
      challenge_question: z.string().describe('A question to challenge beliefs related to this block'),
    })
  ),
  evening_reflection: z.object({
    review_questions: z.array(z.string()).describe('Questions for evening reflection'),
    gratitude_prompt: z.string().describe('A gratitude-focused prompt'),
  }),
  affirmation: z.string().describe('A rational affirmation for the day'),
})
export type CreateDailyPlanOutput = z.infer<typeof CreateDailyPlanOutputSchema>

// ───────────────────────────────────────────────────────────────────────────────

/**
 * 🌅 reflect_on_day - Input schema
 *
 * Use this when: The user wants to do an end-of-day reflection using
 * the 4 Blocks framework.
 */
export const ReflectOnDayInputSchema = z.object({
  emotional_moments: z
    .string()
    .min(10)
    .max(2000)
    .describe('Description of emotionally significant moments from the day'),
  blocks_experienced: z
    .array(EmotionalBlockSchema)
    .optional()
    .describe('Which blocks were triggered today'),
  wins: z
    .string()
    .max(500)
    .optional()
    .describe('Any wins or positive moments to acknowledge'),
  challenges: z
    .string()
    .max(500)
    .optional()
    .describe('Any challenges or difficult moments'),
})
export type ReflectOnDayInput = z.infer<typeof ReflectOnDayInputSchema>

/**
 * 🌅 reflect_on_day - Output schema
 */
export const ReflectOnDayOutputSchema = z.object({
  summary: z.string().describe('A brief summary of the emotional landscape of the day'),
  blocks_analysis: z.array(
    z.object({
      block: EmotionalBlockSchema,
      frequency: z.enum(['not_present', 'occasional', 'frequent', 'dominant']),
      key_trigger: z.string().optional().describe('What seemed to trigger this block'),
      growth_opportunity: z.string().describe('An opportunity for growth'),
    })
  ),
  beliefs_to_examine: z.array(
    z.object({
      belief: z.string().describe('A belief worth examining'),
      related_block: EmotionalBlockSchema,
    })
  ),
  celebration: z.string().describe('Something to celebrate or acknowledge from the day'),
  tomorrow_intention: z.string().describe('An intention for tomorrow'),
})
export type ReflectOnDayOutput = z.infer<typeof ReflectOnDayOutputSchema>
