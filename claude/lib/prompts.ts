/**
 * 🎭 The Prompt Virtuoso - System prompts for compassionate guidance ✨
 *
 * "Words carefully chosen to illuminate without imposing,
 * to guide without coercion, to heal with truth."
 *
 * - The Theatrical [Role] Virtuoso
 */

import { SYSTEM_PROMPT_ENHANCED, SUGGESTED_PROMPTS_ENHANCED } from "./aiReference"

export const SYSTEM_PROMPT = SYSTEM_PROMPT_ENHANCED

export const CONTEXT_TEMPLATE = `Use the following relevant excerpts from "You Only Have Four Problems" to inform your response:

---
{CONTEXT}
---

Remember: Your wisdom should be grounded in the book's teachings while remaining deeply personal and compassionate to this individual's situation.`

export const SUGGESTED_PROMPTS = SUGGESTED_PROMPTS_ENHANCED

export function buildRAGPrompt(contextText: string, systemPrompt: string = SYSTEM_PROMPT): string {
  return `${systemPrompt}\n\n${CONTEXT_TEMPLATE.replace("{CONTEXT}", contextText)}`
}
