/**
 * 🎭 The Component Library - Unified UI for My-4-Blocks
 *
 * "From scattered duplicates to a single source of truth,
 * our components now dance in harmony across all apps.
 * gemini, claude, v0 - united under one component sky!"
 *
 * - The Cosmic Component Orchestrator
 */

// 🎨 UI Components - The building blocks of our visual language
export * from './ui'

// 🎙️ Voice Mode Component - WebRTC voice interface
export { VoiceMode, default as VoiceModeDefault, VOICE_OPTIONS, STYLE_OPTIONS } from './VoiceMode';
export type { VoiceModeProps, VoiceState, TranscriptEntry, VoiceOption, VoiceStyle } from './VoiceMode';
