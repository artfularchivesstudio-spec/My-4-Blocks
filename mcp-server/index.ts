/**
 * 🎭 The MCP Server Sanctum - Where Atomic Actions Converge
 *
 * "Five tools, five portals to understanding. Each stands alone,
 * yet together they form the complete journey of emotional wisdom."
 *
 * This is the main entry point for the My 4 Blocks MCP server.
 * It exports all tools, schemas, and utilities for integration
 * with ChatGPT Apps and the Agent Builder.
 *
 * - The Spellbinding Orchestrator of My 4 Blocks
 */

// ═══════════════════════════════════════════════════════════════════════════════
// 🎪 TOOL IMPLEMENTATIONS - The Five Mystical Performers
// ═══════════════════════════════════════════════════════════════════════════════

export { identifyBlock, default as identifyBlockDefault } from './tools/identify-block.js'
export { findIrrationalBelief, default as findIrrationalBeliefDefault } from './tools/find-belief.js'
export { disputeBelief, default as disputeBeliefDefault } from './tools/dispute-belief.js'
export { createDailyPlan, default as createDailyPlanDefault } from './tools/create-daily-plan.js'
export { reflectOnDay, default as reflectOnDayDefault } from './tools/reflect-on-day.js'

// ═══════════════════════════════════════════════════════════════════════════════
// 📜 SCHEMAS - The Sacred Blueprints of Data
// ═══════════════════════════════════════════════════════════════════════════════

export {
  // 🔮 Core Enums & Types
  EmotionalBlockSchema,
  type EmotionalBlock,
  IrrationalBeliefTypeSchema,
  type IrrationalBeliefType,

  // 🎨 Metadata
  BLOCK_METADATA,
  IRRATIONAL_BELIEF_METADATA,

  // 🔍 identify_block schemas
  IdentifyBlockInputSchema,
  type IdentifyBlockInput,
  IdentifyBlockOutputSchema,
  type IdentifyBlockOutput,

  // 🧠 find_irrational_belief schemas
  FindBeliefInputSchema,
  type FindBeliefInput,
  FindBeliefOutputSchema,
  type FindBeliefOutput,

  // ⚔️ dispute_belief schemas
  DisputeBeliefInputSchema,
  type DisputeBeliefInput,
  DisputeBeliefOutputSchema,
  type DisputeBeliefOutput,

  // 📋 create_daily_plan schemas
  CreateDailyPlanInputSchema,
  type CreateDailyPlanInput,
  CreateDailyPlanOutputSchema,
  type CreateDailyPlanOutput,

  // 🌅 reflect_on_day schemas
  ReflectOnDayInputSchema,
  type ReflectOnDayInput,
  ReflectOnDayOutputSchema,
  type ReflectOnDayOutput,
} from './schemas/tool-schemas.js'

// ═══════════════════════════════════════════════════════════════════════════════
// 🛠️ REGISTRY & UTILITIES - The Stage Manager's Toolkit
// ═══════════════════════════════════════════════════════════════════════════════

export {
  // 🎯 Tool Definitions
  type ToolAnnotations,
  type ToolDefinition,

  // 🌟 Individual Tools
  identifyBlockTool,
  findBeliefTool,
  disputeBeliefTool,
  createDailyPlanTool,
  reflectOnDayTool,

  // 📚 Registry
  TOOL_REGISTRY,
  type ToolName,

  // 🔮 Utility Functions
  getAllTools,
  getToolsByCategory,
  getReadOnlyTools,
  getStatefulTools,
} from './utils/tool-registry.js'

// ═══════════════════════════════════════════════════════════════════════════════
// 🎭 CONVENIENCE OBJECT - All Tools in One Place
// ═══════════════════════════════════════════════════════════════════════════════

import { identifyBlock } from './tools/identify-block.js'
import { findIrrationalBelief } from './tools/find-belief.js'
import { disputeBelief } from './tools/dispute-belief.js'
import { createDailyPlan } from './tools/create-daily-plan.js'
import { reflectOnDay } from './tools/reflect-on-day.js'

/**
 * 🌟 The Complete Tool Suite - Ready for action
 *
 * "All five tools, gathered like the fingers of a hand,
 * ready to grasp understanding and transform distress into wisdom."
 */
export const My4BlocksTools = {
  identifyBlock,
  findIrrationalBelief,
  disputeBelief,
  createDailyPlan,
  reflectOnDay,
} as const

export default My4BlocksTools
