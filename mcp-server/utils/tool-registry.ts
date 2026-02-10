/**
 * 🎭 The Tool Registry - Where Atomic Actions Gather Their Power
 *
 * "Each tool stands alone, yet together they form a symphony of understanding."
 *
 * This registry defines our MCP tools following OpenAI best practices:
 * - Action-oriented names (verb-based)
 * - "Use this when..." descriptions with edge cases
 * - Proper annotations (readOnlyHint, destructiveHint, openWorldHint)
 *
 * - The Spellbinding Tool Curator of My 4 Blocks
 */

import {
  IdentifyBlockInputSchema,
  IdentifyBlockOutputSchema,
  FindBeliefInputSchema,
  FindBeliefOutputSchema,
  DisputeBeliefInputSchema,
  DisputeBeliefOutputSchema,
  CreateDailyPlanInputSchema,
  CreateDailyPlanOutputSchema,
  ReflectOnDayInputSchema,
  ReflectOnDayOutputSchema,
} from '../schemas/tool-schemas.js'
import type { z } from 'zod'

// 🎯 Tool annotation types following OpenAI MCP spec
export interface ToolAnnotations {
  /**
   * If true, the tool does not modify any state (read-only operation).
   * Model can auto-approve these without explicit user confirmation.
   */
  readOnlyHint?: boolean

  /**
   * If true, the tool may perform destructive operations like deletion.
   * Should require explicit confirmation.
   */
  destructiveHint?: boolean

  /**
   * If true, the tool interacts with external systems outside the user's
   * environment (e.g., web APIs, external services).
   */
  openWorldHint?: boolean
}

// 🌟 Tool definition interface
export interface ToolDefinition<
  TInput extends z.ZodType = z.ZodType,
  TOutput extends z.ZodType = z.ZodType
> {
  /** Tool name (verb-based, action-oriented) */
  name: string

  /** Description including "Use this when..." guidance and edge cases */
  description: string

  /** MCP annotations for model behavior hints */
  annotations: ToolAnnotations

  /** Input parameter schema */
  inputSchema: TInput

  /** Output schema */
  outputSchema: TOutput

  /** Categories for organization */
  categories: string[]
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎪 THE FIVE CORE TOOLS - The Ensemble Cast of My 4 Blocks
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 🔍 identify_block - Identify which emotional block the user is experiencing
 *
 * Use this when the user describes an emotional challenge but hasn't yet
 * identified the core emotion. Do not use for general conversation or when
 * the block is already clear.
 */
export const identifyBlockTool: ToolDefinition<
  typeof IdentifyBlockInputSchema,
  typeof IdentifyBlockOutputSchema
> = {
  name: 'identify_block',
  description: `Identify which of the 4 emotional blocks (Anger, Anxiety, Depression, Guilt) a user is experiencing based on their situation.

Use this when:
- The user describes an emotional challenge but hasn't identified the core emotion
- Multiple emotions seem present and you need to find the primary one
- The user uses vague terms like "upset", "bad", or "stressed"

Do NOT use when:
- The block is already clearly identified
- The user is having general conversation
- The user is asking about the framework itself (use educational response instead)

The model should gather situation, feelings, and optionally thought patterns before calling this tool.`,

  annotations: {
    readOnlyHint: true, // 🌟 Analysis only - doesn't change state
    destructiveHint: false,
    openWorldHint: false,
  },

  inputSchema: IdentifyBlockInputSchema,
  outputSchema: IdentifyBlockOutputSchema,
  categories: ['analysis', 'emotional-wellness', 'four-blocks'],
}

/**
 * 🧠 find_irrational_belief - Extract the underlying belief from user narrative
 *
 * Use this when the situation has been shared and you want to identify the
 * specific irrational belief creating the emotional disturbance.
 */
export const findBeliefTool: ToolDefinition<
  typeof FindBeliefInputSchema,
  typeof FindBeliefOutputSchema
> = {
  name: 'find_irrational_belief',
  description: `Extract the underlying irrational belief from a user's narrative using the ABC model.

Use this when:
- The user has shared a situation and their emotional response
- You want to help them see the belief (B) between event (A) and consequence (C)
- The user seems stuck in a pattern and needs the belief made explicit

Do NOT use when:
- The user hasn't shared enough context about the situation
- The conversation is focused on coping strategies rather than understanding
- The user has already clearly articulated their belief

This tool reveals the hidden demand or irrational thinking pattern causing distress.`,

  annotations: {
    readOnlyHint: true, // 🌟 Analysis only - doesn't change state
    destructiveHint: false,
    openWorldHint: false,
  },

  inputSchema: FindBeliefInputSchema,
  outputSchema: FindBeliefOutputSchema,
  categories: ['analysis', 'cbt', 'rebt', 'abc-model'],
}

/**
 * ⚔️ dispute_belief - Generate disputation questions for challenging beliefs
 *
 * Use this when a belief has been identified and the user is ready to
 * challenge it with REBT disputation questions.
 */
export const disputeBeliefTool: ToolDefinition<
  typeof DisputeBeliefInputSchema,
  typeof DisputeBeliefOutputSchema
> = {
  name: 'dispute_belief',
  description: `Generate REBT disputation questions to challenge an identified irrational belief.

Use this when:
- A specific belief has been identified and articulated
- The user shows readiness to question their thinking
- The user explicitly asks for help challenging a thought

Do NOT use when:
- No belief has been identified yet (use find_irrational_belief first)
- The user is in crisis and needs support rather than cognitive work
- The user is resistant to examining their beliefs (validate first)

Returns questions from Ellis, Byron Katie, and Stoic traditions along with a rational alternative.`,

  annotations: {
    readOnlyHint: true, // 🌟 Provides questions only - doesn't change state
    destructiveHint: false,
    openWorldHint: false,
  },

  inputSchema: DisputeBeliefInputSchema,
  outputSchema: DisputeBeliefOutputSchema,
  categories: ['therapeutic', 'rebt', 'disputation', 'byron-katie'],
}

/**
 * 📋 create_daily_plan - Generate a 4 Blocks daily planning structure
 *
 * Use this when the user wants to create a structured daily plan
 * for emotional wellness using the 4 Blocks framework.
 */
export const createDailyPlanTool: ToolDefinition<
  typeof CreateDailyPlanInputSchema,
  typeof CreateDailyPlanOutputSchema
> = {
  name: 'create_daily_plan',
  description: `Create a structured daily emotional wellness plan using the 4 Blocks framework.

Use this when:
- The user asks for a daily plan or morning routine
- The user wants to proactively work on emotional wellness
- The user mentions wanting to be more aware of their emotional patterns

Do NOT use when:
- The user is in the middle of processing a specific emotional situation
- The user just wants to chat without structured guidance
- The user has limited time and needs quick support instead

Creates morning check-in, block-specific awareness prompts, and evening reflection.`,

  annotations: {
    readOnlyHint: false, // 📝 Creates new content - may want confirmation
    destructiveHint: false,
    openWorldHint: false,
  },

  inputSchema: CreateDailyPlanInputSchema,
  outputSchema: CreateDailyPlanOutputSchema,
  categories: ['planning', 'daily-practice', 'four-blocks', 'routine'],
}

/**
 * 🌅 reflect_on_day - End-of-day reflection using the 4 Blocks framework
 *
 * Use this when the user wants to process and reflect on their day's
 * emotional experiences.
 */
export const reflectOnDayTool: ToolDefinition<
  typeof ReflectOnDayInputSchema,
  typeof ReflectOnDayOutputSchema
> = {
  name: 'reflect_on_day',
  description: `Generate an end-of-day reflection analysis using the 4 Blocks framework.

Use this when:
- The user wants to reflect on their day
- The user shares multiple emotional moments from the day
- The user asks "how did I do today?" or similar

Do NOT use when:
- The user is focused on a single in-the-moment situation
- It's morning and they're planning ahead (use create_daily_plan instead)
- The user is in distress and needs immediate support

Analyzes emotional patterns, identifies beliefs to examine, and sets tomorrow's intention.`,

  annotations: {
    readOnlyHint: false, // 📝 Writes reflection - may want confirmation
    destructiveHint: false,
    openWorldHint: false,
  },

  inputSchema: ReflectOnDayInputSchema,
  outputSchema: ReflectOnDayOutputSchema,
  categories: ['reflection', 'daily-practice', 'four-blocks', 'evening'],
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 TOOL REGISTRY - The Complete Catalog
// ═══════════════════════════════════════════════════════════════════════════════

export const TOOL_REGISTRY = {
  identify_block: identifyBlockTool,
  find_irrational_belief: findBeliefTool,
  dispute_belief: disputeBeliefTool,
  create_daily_plan: createDailyPlanTool,
  reflect_on_day: reflectOnDayTool,
} as const

export type ToolName = keyof typeof TOOL_REGISTRY

/**
 * 🔮 Get all tools as an array for registration
 *
 * "When the curtain rises, all players must be ready." 🎭
 */
export function getAllTools(): ToolDefinition[] {
  return Object.values(TOOL_REGISTRY)
}

/**
 * 🎯 Get tools by category
 *
 * "Find the right ensemble for the scene at hand." 🎪
 */
export function getToolsByCategory(category: string): ToolDefinition[] {
  return getAllTools().filter((tool) => tool.categories.includes(category))
}

/**
 * 🌟 Get read-only tools (can be auto-approved)
 *
 * "These gentle observers ask permission of no one." 👀
 */
export function getReadOnlyTools(): ToolDefinition[] {
  return getAllTools().filter((tool) => tool.annotations.readOnlyHint === true)
}

/**
 * 📝 Get tools that modify state (may need confirmation)
 *
 * "These scribes await the nod before ink meets parchment." ✍️
 */
export function getStatefulTools(): ToolDefinition[] {
  return getAllTools().filter((tool) => tool.annotations.readOnlyHint !== true)
}
