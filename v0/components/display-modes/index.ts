/**
 * 🎭 Display Modes - The Enchanted Gallery of Inline Components
 *
 * "A collection of compact, visually-distinct components for rendering
 * structured content within the chat experience. Each card is a tiny
 * masterpiece designed to illuminate the seeker's journey."
 *
 * These components implement ChatGPT Apps display modes:
 * - Inline cards for quick summaries in chat
 * - Fullscreen for immersive experiences (coming soon)
 * - Picture-in-Picture for ongoing sessions (coming soon)
 *
 * - The Spellbinding Museum Director of Visual Clarity 🖼️
 */

// 🔮 Inline Belief Card - Shows identified beliefs with disputation CTA
export { InlineBeliefCard } from './inline-belief-card'
export type { InlineBeliefCardProps } from './inline-belief-card'

// 📋 Daily Plan Card - Shows structured daily wellness plan
export { DailyPlanCard } from './daily-plan-card'
export type { DailyPlanCardProps } from './daily-plan-card'

// 💡 Concept Card - Bite-sized CBT/REBT educational content
export { ConceptCard } from './concept-card'
export type { ConceptCardProps } from './concept-card'

// 🎨 Common Types
export type BlockType = 'anger' | 'anxiety' | 'depression' | 'guilt'
export type ConceptCategory = 'abc-model' | 'irrational-belief' | 'disputation' | 'stoic' | 'general'
