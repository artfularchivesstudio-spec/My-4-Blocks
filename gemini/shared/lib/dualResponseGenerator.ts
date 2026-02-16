/**
 * 🎭 The Dual Response Generator - Parallel Wisdom Creation ✨
 *
 * "Two paths diverge in the digital wood,
 * and we shall stream them both simultaneously,
 * for science, for wisdom, for the seekers of truth!"
 *
 * This module generates TWO AI responses concurrently using different
 * blueprints (A: Structured, B: Conversational). It's the heart of
 * our A/B testing infrastructure - running parallel theatrical productions
 * where both shows perform live, and the audience picks their favorite.
 *
 * Based on "You Only Have Four Problems" by Dr. Vincent E. Parr, Ph.D.
 *
 * - The Dual Response Orchestrator
 */

import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import {
  buildEnhancedSystemPrompt,
  detectLikelyBlock,
  type BlueprintVariant,
  type EmotionalBlock,
} from './responseBlueprints';

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 TYPE DEFINITIONS
// The mystical contracts that govern dual response generation
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 🎨 Configuration options for dual generation
 *
 * Fine-tune the dual response generation process.
 * Like adjusting the dials on a cosmic mixing board! 🎛️
 */
export interface DualGenerationOptions {
  // 🤖 OpenAI model to use (gpt-4o, gpt-4o-mini, etc.)
  model?: 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4-turbo';
  // 🌡️ Temperature for response creativity (0 = focused, 1 = creative)
  temperature?: number;
  // 📏 Maximum tokens per response
  maxTokens?: number;
  // 🔮 Additional context from RAG retrieval
  ragContext?: string;
  // 🎲 Randomly swap A/B order to reduce position bias?
  randomizeOrder?: boolean;
  // 🆔 Session ID for tracking
  sessionId?: string;
}

/**
 * 🏆 The final result of a dual generation
 *
 * Contains both responses, timing data, and metadata
 * for analytics and A/B test storage.
 */
export interface DualResponseResult {
  // 🆔 Unique identifier for this generation
  generationId: string;
  // ⏰ When generation started
  timestamp: string;
  // 💬 Original user query
  userQuery: string;
  // 🅰️ Response A (Structured blueprint)
  responseA: {
    content: string;
    variant: BlueprintVariant;
    promptName: string;
    timeMs: number;
  };
  // 🅱️ Response B (Conversational blueprint)
  responseB: {
    content: string;
    variant: BlueprintVariant;
    promptName: string;
    timeMs: number;
  };
  // 🎭 Detected emotional block from user query
  detectedBlock: EmotionalBlock | null;
  // 🔄 Were the responses swapped for position bias mitigation?
  wasSwapped: boolean;
  // 🤖 Model used for generation
  model: string;
  // 📊 Total generation time (wall clock)
  totalTimeMs: number;
}

/**
 * 🌊 Callbacks for streaming dual responses
 *
 * When you want to stream both responses in real-time,
 * these callbacks let you handle each chunk as it arrives.
 * Like watching two plays unfold simultaneously! 🎭
 */
export interface DualStreamingCallbacks {
  // 📥 Called when a chunk arrives for response A
  onChunkA?: (chunk: string, fullContent: string) => void;
  // 📥 Called when a chunk arrives for response B
  onChunkB?: (chunk: string, fullContent: string) => void;
  // ✅ Called when response A completes
  onCompleteA?: (content: string, timeMs: number) => void;
  // ✅ Called when response B completes
  onCompleteB?: (content: string, timeMs: number) => void;
  // 💥 Called on error
  onError?: (error: Error, variant: 'A' | 'B') => void;
  // 🎉 Called when both responses are complete
  onBothComplete?: (result: DualResponseResult) => void;
}

/**
 * 🔮 Internal state for tracking generation progress
 *
 * Used internally to coordinate the parallel generation.
 * The conductor's score for our dual symphony! 🎼
 */
export interface DualGenerationState {
  // 🅰️ Content accumulated for A
  contentA: string;
  // 🅱️ Content accumulated for B
  contentB: string;
  // ⏱️ Start time for A
  startTimeA: number;
  // ⏱️ Start time for B
  startTimeB: number;
  // ⏱️ End time for A (set on completion)
  endTimeA?: number;
  // ⏱️ End time for B (set on completion)
  endTimeB?: number;
  // ✅ Is A complete?
  completeA: boolean;
  // ✅ Is B complete?
  completeB: boolean;
  // 💥 Error for A (if any)
  errorA?: Error;
  // 💥 Error for B (if any)
  errorB?: Error;
}

/**
 * 📊 Progress update for UI display
 *
 * Useful for showing progress bars or status indicators
 * while both responses are being generated.
 */
export interface DualGenerationProgress {
  // 🅰️ Response A progress
  progressA: {
    status: 'pending' | 'streaming' | 'complete' | 'error';
    charCount: number;
    timeMs: number;
  };
  // 🅱️ Response B progress
  progressB: {
    status: 'pending' | 'streaming' | 'complete' | 'error';
    charCount: number;
    timeMs: number;
  };
  // 📊 Overall progress percentage (0-100)
  overallProgress: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// 🛠️ HELPER FUNCTIONS
// The magical utilities that power our dual generation
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 🎲 Generate a unique ID for each dual generation
 *
 * Uses timestamp + random suffix for guaranteed uniqueness.
 * Every dual performance gets its own special ticket! 🎫
 */
export function generateGenerationId(): string {
  const timestamp = Date.now().toString(36);
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `dual_${timestamp}_${randomSuffix}`;
}

/**
 * 🎭 Prepare messages for a specific blueprint variant
 *
 * Takes the conversation history and prepares it with
 * the appropriate system prompt for A or B variant.
 *
 * @param messages - Original conversation messages
 * @param variant - Which blueprint to use ('A' or 'B')
 * @param ragContext - Optional RAG context to include
 * @returns Formatted messages for OpenAI API
 */
export function prepareDualGeneration(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  variant: BlueprintVariant,
  ragContext?: string
): ChatCompletionMessageParam[] {
  // 🎨 Build the enhanced system prompt with our blueprint
  const systemPrompt = buildEnhancedSystemPrompt(variant, ragContext);

  // 🌟 Construct the messages array with system prompt first
  const preparedMessages: ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...messages.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
  ];

  return preparedMessages;
}

/**
 * 🔄 Determine if we should swap A/B order
 *
 * Position bias is real! Sometimes people prefer the first option
 * just because it's first. We randomly swap to mitigate this.
 * May the true winner emerge, regardless of position! 🏆
 */
export function shouldRandomizeOrder(option?: boolean): boolean {
  // If not explicitly set, 50% chance of swapping
  if (option === undefined) {
    return Math.random() < 0.5;
  }
  return option;
}

/**
 * 🔀 Swap responses in a result object
 *
 * If we randomized the order, this function swaps them back
 * so 'A' always represents Blueprint A internally,
 * even if it was shown second to the user.
 *
 * @param result - The original result
 * @returns Result with responses swapped
 */
export function swapResponses(result: DualResponseResult): DualResponseResult {
  return {
    ...result,
    responseA: result.responseB,
    responseB: result.responseA,
    wasSwapped: true,
  };
}

/**
 * ⏱️ Calculate time difference between two responses
 *
 * Useful for analytics - did the structured approach take
 * longer than the conversational one?
 *
 * @param timeA - Time for response A in ms
 * @param timeB - Time for response B in ms
 * @returns Object with difference and which was faster
 */
export function compareGenerationTimes(
  timeA: number,
  timeB: number
): { differenceMs: number; faster: 'A' | 'B' | 'tie' } {
  const diff = Math.abs(timeA - timeB);

  // 🎯 Consider it a tie if within 100ms
  if (diff < 100) {
    return { differenceMs: diff, faster: 'tie' };
  }

  return {
    differenceMs: diff,
    faster: timeA < timeB ? 'A' : 'B',
  };
}

/**
 * 📏 Compare response lengths
 *
 * Analytics helper - does Blueprint A tend to be wordier
 * than Blueprint B?
 *
 * @param contentA - Response A content
 * @param contentB - Response B content
 * @returns Comparison stats
 */
export function compareResponseLengths(
  contentA: string,
  contentB: string
): {
  lengthA: number;
  lengthB: number;
  differenceChars: number;
  longerResponse: 'A' | 'B' | 'tie';
} {
  const lengthA = contentA.length;
  const lengthB = contentB.length;
  const diff = Math.abs(lengthA - lengthB);

  // 🎯 Consider it a tie if within 50 characters
  if (diff < 50) {
    return {
      lengthA,
      lengthB,
      differenceChars: diff,
      longerResponse: 'tie',
    };
  }

  return {
    lengthA,
    lengthB,
    differenceChars: diff,
    longerResponse: lengthA > lengthB ? 'A' : 'B',
  };
}

/**
 * 📊 Create initial progress state
 *
 * Returns a fresh progress object for tracking
 * dual generation progress.
 */
export function createInitialProgress(): DualGenerationProgress {
  return {
    progressA: { status: 'pending', charCount: 0, timeMs: 0 },
    progressB: { status: 'pending', charCount: 0, timeMs: 0 },
    overallProgress: 0,
  };
}

/**
 * 📈 Update progress based on current state
 *
 * Calculates overall progress percentage based on
 * individual response statuses.
 */
export function updateProgress(state: DualGenerationState): DualGenerationProgress {
  const now = Date.now();

  // 🅰️ Calculate A progress
  const progressA = {
    status: state.errorA
      ? ('error' as const)
      : state.completeA
        ? ('complete' as const)
        : state.contentA.length > 0
          ? ('streaming' as const)
          : ('pending' as const),
    charCount: state.contentA.length,
    timeMs: state.endTimeA ? state.endTimeA - state.startTimeA : now - state.startTimeA,
  };

  // 🅱️ Calculate B progress
  const progressB = {
    status: state.errorB
      ? ('error' as const)
      : state.completeB
        ? ('complete' as const)
        : state.contentB.length > 0
          ? ('streaming' as const)
          : ('pending' as const),
    charCount: state.contentB.length,
    timeMs: state.endTimeB ? state.endTimeB - state.startTimeB : now - state.startTimeB,
  };

  // 📊 Calculate overall progress
  // Each response contributes 50% when complete
  let overallProgress = 0;
  if (state.completeA || state.errorA) overallProgress += 50;
  if (state.completeB || state.errorB) overallProgress += 50;

  // If streaming but not complete, estimate based on chars
  // (Rough estimate: average response ~1000 chars)
  if (!state.completeA && !state.errorA && state.contentA.length > 0) {
    overallProgress += Math.min(49, Math.floor((state.contentA.length / 1000) * 49));
  }
  if (!state.completeB && !state.errorB && state.contentB.length > 0) {
    overallProgress += Math.min(49, Math.floor((state.contentB.length / 1000) * 49));
  }

  return {
    progressA,
    progressB,
    overallProgress: Math.min(100, overallProgress),
  };
}

/**
 * 🏗️ Create a DualResponseResult from generation state
 *
 * Final assembly of all the pieces into a beautiful result object.
 * Like the final curtain call after both shows complete! 🎭
 */
export function createDualResponseResult(
  generationId: string,
  userQuery: string,
  state: DualGenerationState,
  model: string,
  wasSwapped: boolean,
  startTime: number
): DualResponseResult {
  const detectedBlock = detectLikelyBlock(userQuery);

  return {
    generationId,
    timestamp: new Date().toISOString(),
    userQuery,
    responseA: {
      content: state.contentA,
      variant: 'A',
      promptName: 'Structured Cognitive Guidance',
      timeMs: state.endTimeA ? state.endTimeA - state.startTimeA : 0,
    },
    responseB: {
      content: state.contentB,
      variant: 'B',
      promptName: 'Warm Conversational Guidance',
      timeMs: state.endTimeB ? state.endTimeB - state.startTimeB : 0,
    },
    detectedBlock,
    wasSwapped,
    model,
    totalTimeMs: Date.now() - startTime,
  };
}

/**
 * 📋 Generate a comparison summary for logging/analytics
 *
 * Creates a human-readable summary of the dual generation.
 * Perfect for debugging or analytics dashboards!
 */
export function generateComparisonSummary(result: DualResponseResult): string {
  const timeComparison = compareGenerationTimes(result.responseA.timeMs, result.responseB.timeMs);

  const lengthComparison = compareResponseLengths(
    result.responseA.content,
    result.responseB.content
  );

  return `
🎭 Dual Generation Summary
═══════════════════════════════════════
📍 ID: ${result.generationId}
⏰ Total Time: ${result.totalTimeMs}ms
🎯 Detected Block: ${result.detectedBlock || 'None detected'}
🔀 Order Swapped: ${result.wasSwapped ? 'Yes' : 'No'}

📊 Response A (Structured):
   • Time: ${result.responseA.timeMs}ms
   • Length: ${lengthComparison.lengthA} chars

📊 Response B (Conversational):
   • Time: ${result.responseB.timeMs}ms
   • Length: ${lengthComparison.lengthB} chars

⚡ Speed Winner: ${timeComparison.faster === 'tie' ? 'Tie!' : `Response ${timeComparison.faster}`}
📏 Length Winner: ${lengthComparison.longerResponse === 'tie' ? 'Tie!' : `Response ${lengthComparison.longerResponse}`}
═══════════════════════════════════════
  `.trim();
}

// ═══════════════════════════════════════════════════════════════════════════
// 🌟 MAIN GENERATION FUNCTIONS
// The stars of our show - where the magic actually happens!
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 🎭 Generate dual responses (non-streaming)
 *
 * The main event! Generates TWO responses concurrently using
 * Blueprint A (Structured) and Blueprint B (Conversational).
 *
 * Both requests run in parallel for maximum efficiency.
 * Like running two theatrical productions simultaneously! 🎪
 *
 * @param messages - The conversation history
 * @param openaiClient - Initialized OpenAI client
 * @param options - Configuration options
 * @returns Promise resolving to DualResponseResult
 *
 * @example
 * const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
 * const result = await generateDualResponses(
 *   [{ role: 'user', content: 'I feel so angry at my boss!' }],
 *   openai,
 *   { model: 'gpt-4o-mini', temperature: 0.7 }
 * );
 * console.log('Response A:', result.responseA.content);
 * console.log('Response B:', result.responseB.content);
 */
export async function generateDualResponses(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  openaiClient: OpenAI,
  options: DualGenerationOptions = {}
): Promise<DualResponseResult> {
  const {
    model = 'gpt-4o-mini',
    temperature = 0.7,
    maxTokens = 2000,
    ragContext,
    randomizeOrder = false,
  } = options;

  console.log('🌐 ✨ DUAL GENERATION AWAKENS! Preparing two parallel wisdom streams...');

  const generationId = generateGenerationId();
  const startTime = Date.now();
  const shouldSwap = shouldRandomizeOrder(randomizeOrder);

  // 🎨 Extract the user's query from the last message
  const lastMessage = messages[messages.length - 1];
  const userQuery = lastMessage?.content || '';

  // 🅰️ Prepare messages for Blueprint A (Structured)
  const messagesA = prepareDualGeneration(messages, 'A', ragContext);

  // 🅱️ Prepare messages for Blueprint B (Conversational)
  const messagesB = prepareDualGeneration(messages, 'B', ragContext);

  // 🚀 Launch both requests in parallel - may the best wisdom flow!
  console.log(`🎪 📦 Launching parallel requests with model ${model}...`);

  const startTimeA = Date.now();
  const startTimeB = Date.now();

  const [responseA, responseB] = await Promise.all([
    openaiClient.chat.completions
      .create({
        model,
        messages: messagesA,
        temperature,
        max_tokens: maxTokens,
      })
      .then((response) => ({
        content: response.choices[0]?.message?.content || '',
        timeMs: Date.now() - startTimeA,
      })),

    openaiClient.chat.completions
      .create({
        model,
        messages: messagesB,
        temperature,
        max_tokens: maxTokens,
      })
      .then((response) => ({
        content: response.choices[0]?.message?.content || '',
        timeMs: Date.now() - startTimeB,
      })),
  ]);

  console.log(`🎉 ✨ DUAL GENERATION COMPLETE! A: ${responseA.timeMs}ms, B: ${responseB.timeMs}ms`);

  // 🏗️ Assemble the final result
  const result: DualResponseResult = {
    generationId,
    timestamp: new Date().toISOString(),
    userQuery,
    responseA: {
      content: responseA.content,
      variant: 'A',
      promptName: 'Structured Cognitive Guidance',
      timeMs: responseA.timeMs,
    },
    responseB: {
      content: responseB.content,
      variant: 'B',
      promptName: 'Warm Conversational Guidance',
      timeMs: responseB.timeMs,
    },
    detectedBlock: detectLikelyBlock(userQuery),
    wasSwapped: shouldSwap,
    model,
    totalTimeMs: Date.now() - startTime,
  };

  // 🔀 Swap if needed for position bias mitigation
  if (shouldSwap) {
    console.log('🔀 Order randomized to mitigate position bias');
    return swapResponses(result);
  }

  return result;
}

/**
 * 🌊 Generate dual responses with streaming
 *
 * For when you want to show both responses being generated
 * in real-time! Each chunk is delivered via callbacks.
 *
 * Like watching two improv performers riff simultaneously! 🎭
 *
 * @param messages - The conversation history
 * @param openaiClient - Initialized OpenAI client
 * @param callbacks - Callbacks for handling chunks and completion
 * @param options - Configuration options
 * @returns Promise resolving to DualResponseResult when both complete
 *
 * @example
 * const result = await streamDualResponses(
 *   messages,
 *   openai,
 *   {
 *     onChunkA: (chunk, full) => updateUIForA(full),
 *     onChunkB: (chunk, full) => updateUIForB(full),
 *     onBothComplete: (result) => showComparisonUI(result),
 *   },
 *   { model: 'gpt-4o-mini' }
 * );
 */
export async function streamDualResponses(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  openaiClient: OpenAI,
  callbacks: DualStreamingCallbacks = {},
  options: DualGenerationOptions = {}
): Promise<DualResponseResult> {
  const {
    model = 'gpt-4o-mini',
    temperature = 0.7,
    maxTokens = 2000,
    ragContext,
    randomizeOrder = false,
  } = options;

  console.log('🌊 ✨ DUAL STREAMING AWAKENS! Opening two parallel streams of wisdom...');

  const generationId = generateGenerationId();
  const startTime = Date.now();
  const shouldSwap = shouldRandomizeOrder(randomizeOrder);

  // 🎨 Extract user query
  const lastMessage = messages[messages.length - 1];
  const userQuery = lastMessage?.content || '';

  // 📊 Initialize state
  const state: DualGenerationState = {
    contentA: '',
    contentB: '',
    startTimeA: Date.now(),
    startTimeB: Date.now(),
    completeA: false,
    completeB: false,
  };

  // 🅰️ & 🅱️ Prepare messages for both blueprints
  const messagesA = prepareDualGeneration(messages, 'A', ragContext);
  const messagesB = prepareDualGeneration(messages, 'B', ragContext);

  // 🌊 Create streaming promise for A
  const streamA = async () => {
    try {
      state.startTimeA = Date.now();

      const stream = await openaiClient.chat.completions.create({
        model,
        messages: messagesA,
        temperature,
        max_tokens: maxTokens,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          state.contentA += content;
          callbacks.onChunkA?.(content, state.contentA);
        }
      }

      state.endTimeA = Date.now();
      state.completeA = true;
      callbacks.onCompleteA?.(state.contentA, state.endTimeA - state.startTimeA);
      console.log(`✅ Stream A complete: ${state.contentA.length} chars in ${state.endTimeA - state.startTimeA}ms`);
    } catch (error) {
      state.errorA = error as Error;
      state.completeA = true;
      callbacks.onError?.(state.errorA, 'A');
      console.error('💥 Stream A error:', error);
    }
  };

  // 🌊 Create streaming promise for B
  const streamB = async () => {
    try {
      state.startTimeB = Date.now();

      const stream = await openaiClient.chat.completions.create({
        model,
        messages: messagesB,
        temperature,
        max_tokens: maxTokens,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          state.contentB += content;
          callbacks.onChunkB?.(content, state.contentB);
        }
      }

      state.endTimeB = Date.now();
      state.completeB = true;
      callbacks.onCompleteB?.(state.contentB, state.endTimeB - state.startTimeB);
      console.log(`✅ Stream B complete: ${state.contentB.length} chars in ${state.endTimeB - state.startTimeB}ms`);
    } catch (error) {
      state.errorB = error as Error;
      state.completeB = true;
      callbacks.onError?.(state.errorB, 'B');
      console.error('💥 Stream B error:', error);
    }
  };

  // 🚀 Launch both streams in parallel!
  console.log('🎪 📦 Launching parallel streams...');
  await Promise.all([streamA(), streamB()]);

  console.log('🎉 ✨ DUAL STREAMING COMPLETE! Both wisdom streams have concluded.');

  // 🏗️ Assemble the final result
  let result = createDualResponseResult(
    generationId,
    userQuery,
    state,
    model,
    shouldSwap,
    startTime
  );

  // 🔀 Swap if needed
  if (shouldSwap) {
    console.log('🔀 Order randomized to mitigate position bias');
    result = swapResponses(result);
  }

  // 🎊 Notify completion
  callbacks.onBothComplete?.(result);

  return result;
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎁 DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export default {
  // 🆔 ID Generation
  generateGenerationId,
  // 🎨 Preparation
  prepareDualGeneration,
  createDualResponseResult,
  // 🔀 Order Randomization
  shouldRandomizeOrder,
  swapResponses,
  // 📊 Comparison Helpers
  compareGenerationTimes,
  compareResponseLengths,
  // 📈 Progress Tracking
  createInitialProgress,
  updateProgress,
  // 📋 Logging
  generateComparisonSummary,
  // 🌟 Main Functions
  generateDualResponses,
  streamDualResponses,
};
