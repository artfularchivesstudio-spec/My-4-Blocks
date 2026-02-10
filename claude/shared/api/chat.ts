/**
 * 🌐 The Unified Chat API - One Portal for All Realms ✨
 *
 * "Where all seekers of wisdom converge,
 * through a single gateway to understanding."
 *
 * This is THE chat API that all UI variants call.
 * It handles RAG retrieval and LLM streaming.
 *
 * - The Supreme Chat Portal
 */

import { openai } from '@ai-sdk/openai';
// 🎭 AI SDK v6 uses streamText with messages directly
import { streamText, type UIMessage, type CoreMessage } from 'ai';
import {
  loadEmbeddings,
  findRelevantWisdom,
  getRAGStats,
  type EmbeddingsDatabase,
} from '../lib';

// 🔮 Track initialization state
let isInitialized = false;

/**
 * 🌟 The System Prompt - The Guide's Personality
 *
 * Core knowledge and communication guidelines for the AI.
 */
export const SYSTEM_PROMPT = `You are a compassionate and wise guide based on the teachings from "You Only Have Four Problems" by Dr. Vincent E. Parr, Ph.D., combined with the foundational work of Dr. Albert Ellis (REBT/CBT) and other cognitive behavioral therapy pioneers.

## Your Core Knowledge

### The Four Blocks to Happiness
There are only four emotional problems that block our happiness:
1. **Anger** - Created when we demand others or situations be different than they are
2. **Anxiety** - Created when we catastrophize about future events and tell ourselves we "can't stand" potential outcomes
3. **Depression** - Created when we rate ourselves as worthless or inadequate
4. **Guilt** - Created when we demand we "should" have acted differently and rate ourselves negatively for past actions

### The ABC Model of Emotions
- **A** = Activating Event (what happens to us)
- **B** = Belief (the 60,000+ sentences we tell ourselves daily about the event)
- **C** = Consequence (emotional, behavioral, and physiological responses)
- **D** = Disputing (challenging irrational beliefs)
- **E** = Effective new belief (rational replacement)

Key insight: Events (A) don't cause our emotions (C). Our BELIEFS (B) about events create our emotions.

### The Seven Irrational Beliefs
1. **'It' Statements** - Blaming external things for our emotions
2. **Awfulizing** - Exaggerating unpleasantness to catastrophic levels
3. **I Can't Stand It (ICSI)** - Believing we cannot survive current conditions
4. **Shoulds, Musts, and Demands (SMDs)** - Rigid demands that reality be different
5. **Rating** - Labeling self or others as worthless based on behavior
6. **Absolutistic Thinking** - Using words like "always", "never", "everyone"
7. **Entitlement** - Believing we deserve special treatment

### The Three Insights
1. You create and maintain 100% of your thoughts, feelings, and behavior
2. It is essential to become aware of how you create your emotions
3. It is essential to learn how to dispute and let go of negative emotions rapidly

### The Narrator vs. The Observer
- **The Narrator**: The ego-driven part of mind that creates stories
- **The Observer**: The mindful awareness that can watch thoughts without attachment

## Your Communication Style
- Be warm, compassionate, and non-judgmental
- Use clear, accessible language
- Gently guide users to examine their beliefs
- Help identify which of the 4 blocks they're experiencing
- Point out irrational beliefs when you notice them
- Offer disputing questions to help challenge limiting beliefs
- Remind users that they have the power to change their thoughts
- Be concise but thorough
- Never be preachy or condescending
- Meet people where they are emotionally

## Key Quotes
- "Nothing and no one has ever upset you." - Dr. Parr
- "It is the beliefs we hold that go unchallenged that have the potential for causing us the most harm." - Dōgen
- "Never believe what you think!" - Dōgen
- "A thought is just a thought. It has no power except the power you give it."

Remember: Your goal is to help users understand how they create their own emotional disturbance and guide them toward peace, contentment, and joy.`;

/**
 * 🌊 Initialize the RAG system
 *
 * Loads embeddings. Call this once at startup or on first request.
 */
export async function initializeRAG(): Promise<void> {
  if (isInitialized) return;

  console.log('🌐 ✨ INITIALIZING UNIFIED RAG SYSTEM...');

  try {
    // 🔮 Dynamic import of embeddings - handle module wrapper
    const importedData = await import('../data/embeddings.json') as { default?: unknown };
    const embeddingsData = (importedData.default || importedData) as unknown as EmbeddingsDatabase;
    loadEmbeddings(embeddingsData);
    isInitialized = true;

    const stats = getRAGStats();
    console.log(`🎉 ✨ RAG INITIALIZED! ${stats.totalChunks} chunks loaded`);
  } catch (error) {
    console.error('💥 😭 Failed to initialize RAG:', error);
    isInitialized = true; // Prevent retry loops
  }
}

/**
 * 🎯 Chat request configuration
 */
export interface ChatConfig {
  model?: 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4-turbo';
  temperature?: number;
  maxTokens?: number;
  ragEnabled?: boolean;
  ragTopK?: number;
}

const DEFAULT_CONFIG: Required<ChatConfig> = {
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 2000,
  ragEnabled: true,
  ragTopK: 5,
};

/**
 * 🌟 Process a chat request with RAG-enhanced context
 *
 * This is the main function that all UI variants should call.
 *
 * @param messages - The conversation history
 * @param config - Optional configuration
 * @returns A streaming response
 */
export async function handleChatRequest(
  messages: UIMessage[],
  config: ChatConfig = {},
  abortSignal?: AbortSignal
): Promise<Response> {
  const opts = { ...DEFAULT_CONFIG, ...config };

  // 🔮 Ensure RAG is initialized
  await initializeRAG();

  // 🎨 Extract query from last message
  const lastMessage = messages[messages.length - 1];
  const queryText = extractMessageContent(lastMessage);

  // 🌟 Build enhanced system prompt
  let systemPrompt = SYSTEM_PROMPT;

  if (opts.ragEnabled && queryText) {
    console.log('🔍 Retrieving RAG context for:', queryText.substring(0, 50));
    const ragContext = await findRelevantWisdom(queryText, opts.ragTopK);

    if (ragContext) {
      systemPrompt = `${SYSTEM_PROMPT}\n\n## Relevant Book Context\n${ragContext}`;
    }
  }

  // 🌊 Stream the response
  // 🎭 Convert UIMessages to CoreMessages manually (AI SDK v6 compatible)
  const coreMessages: CoreMessage[] = messages.map((msg) => ({
    role: msg.role as 'user' | 'assistant',
    content: extractMessageContent(msg),
  }));

  const result = streamText({
    model: openai(opts.model),
    system: systemPrompt,
    messages: coreMessages,
    abortSignal,
    temperature: opts.temperature,
    maxTokens: opts.maxTokens,
  });

  // 🎭 AI SDK v6 uses toDataStreamResponse for the data stream protocol
  return result.toDataStreamResponse();
}

/**
 * 🔧 Extract text content from a UI message
 *
 * Handles various message formats from the AI SDK.
 * Supports both old format (content) and new format (parts).
 * Ensures we always return a string, never undefined!
 */
function extractMessageContent(message: UIMessage): string {
  if (!message) return '';

  // 🌟 NEW FORMAT: Handle 'parts' array (AI SDK v4+)
  const parts = (message as any).parts;
  if (Array.isArray(parts)) {
    const texts = parts
      .filter((part: any) => part && part.type === 'text')
      .map((part: any) => part.text || '');
    const result = texts.join('\n');
    if (result) return result;
  }

  // 🎨 OLD FORMAT: Handle 'content' property
  // Using 'any' to bypass strict type narrowing issues
  // In AI SDK v4+, UIMessage no longer has 'content', only 'parts'
  const content: any = (message as any).content;

  // 🌙 Handle undefined or null content
  if (content === undefined || content === null) {
    return '';
  }

  // 🎨 Handle string content (most common)
  if (typeof content === 'string') {
    return content;
  }

  // 🌊 Handle array of content parts (multimodal messages)
  if (Array.isArray(content)) {
    const texts = content
      .filter((part: any) => part && part.type === 'text')
      .map((part: any) => part.text || '');
    return texts.join('\n') || '';
  }

  // 🔮 Fallback - stringify anything else
  try {
    return JSON.stringify(content) || '';
  } catch {
    return '';
  }
}

/**
 * 📊 Get current RAG status
 */
export function getChatAPIStats() {
  return {
    ragStats: getRAGStats(),
    isInitialized,
  };
}
