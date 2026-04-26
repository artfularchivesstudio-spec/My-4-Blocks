/**
 * 🧪 The A/B Testing Arena - Claude's Dual Response Portal ✨
 *
 * "Two responses enter the ring,
 * one response wins the user's heart.
 * May the best wisdom prevail!"
 *
 * This endpoint generates TWO distinct responses for the same query,
 * letting users compare and choose their preferred guidance style.
 * It's like a Four Blocks framework showdown! 🎭
 *
 * Blueprint A = Structured & Methodical (the GPS navigator)
 * Blueprint B = Warm & Conversational (the wise coffee shop friend)
 *
 * - The A/B Testing Gladiator Master
 */

import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import {
  loadEmbeddings,
  findRelevantWisdom,
  type EmbeddingsDatabase,
  storeABTest,
  buildEnhancedSystemPrompt,
  detectLikelyBlock,
  type EmotionalBlock,
} from '@shared/lib';

// 🌟 Using nodejs runtime for embeddings (edge limit is 1MB, and we're bigger than a breadbox)
export const runtime = 'nodejs';
export const maxDuration = 120; // ⏰ Longer timeout for dual generation - patience is a virtue!

// 🔮 Track initialization state - because we only want to load embeddings once
let isInitialized = false;

/**
 * 🌊 Initialize the RAG system - one embeddings database to rule them all
 *
 * Loads the crystallized wisdom from the embeddings JSON file.
 * This is a one-time operation per cold start - we remember things! 🧠
 */
async function initializeRAG(): Promise<void> {
  if (isInitialized) return;

  console.log('🌐 ✨ INITIALIZING RAG FOR CLAUDE A/B TESTING...');

  try {
    // 🔮 Dynamic import of embeddings - handle module wrapper shenanigans
    const importedData = (await import('@shared/data/embeddings.json')) as {
      default?: unknown;
    };
    const embeddingsData = (importedData.default ||
      importedData) as unknown as EmbeddingsDatabase;
    loadEmbeddings(embeddingsData);
    isInitialized = true;
    console.log('💎 RAG initialized for Claude A/B arena! Let the battles begin!');
  } catch (error) {
    console.error('💥 😭 Failed to initialize RAG:', error);
    isInitialized = true; // 🛡️ Prevent retry loops - we tried our best!
  }
}

/**
 * 🔍 Detect emotional context from the query
 *
 * Because knowing whether someone is angry or anxious
 * helps us track which blocks get the most attention.
 * It's like emotional metadata for the curious analyst! 📊
 *
 * @param query - The user's soul-bearing question
 * @returns Object with emotionDetected and blockType, or empty object if no clear signal
 */
function detectEmotionalContext(query: string): {
  emotionDetected?: string;
  blockType?: EmotionalBlock;
} {
  // 🎯 Use the shared library's sophisticated block detection
  const detectedBlock = detectLikelyBlock(query);

  if (detectedBlock) {
    return {
      emotionDetected: detectedBlock.toLowerCase(),
      blockType: detectedBlock,
    };
  }

  // 🤷 No specific block detected - the AI will figure it out!
  return {};
}

/**
 * 🎯 Generate a single response with the given blueprint
 *
 * The workhorse function that actually talks to GPT-4o.
 * Feed it a blueprint, get wisdom back. It's like alchemy, but for feelings! 🧪
 *
 * @param query - The seeker's question
 * @param ragContext - Retrieved context from the book
 * @param systemPrompt - The full system prompt with blueprint baked in
 * @param history - Conversation history (we don't forget!)
 * @returns The AI's response text
 */
async function generateResponse(
  query: string,
  ragContext: string,
  systemPrompt: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  // 🎨 Enhance the system prompt with RAG context if available
  const enhancedPrompt = ragContext
    ? `${systemPrompt}\n\n## Retrieved Book Context\n${ragContext}`
    : systemPrompt;

  const result = await generateText({
    model: openai('gpt-4o'),
    system: enhancedPrompt,
    messages: [...history, { role: 'user' as const, content: query }],
    temperature: 0.7, // 🌡️ Warm enough for creativity, cool enough for consistency
    maxTokens: 2000, // 📜 Enough space for thoughtful responses
  });

  return result.text;
}

/**
 * 🔧 Extract text content from a message
 *
 * Handles both the 'content' and 'parts' formats
 * because the AI SDK loves to keep us on our toes. 🎪
 * It's like being a polyglot, but for data structures!
 *
 * @param message - The message object in any of its myriad forms
 * @returns The extracted text content as a string
 */
function extractContent(message: any): string {
  if (!message) return '';

  // 🌟 Handle 'parts' array format (AI SDK v4+ style)
  if (Array.isArray(message.parts)) {
    return message.parts
      .filter((part: any) => part.type === 'text')
      .map((part: any) => part.text)
      .join('\n');
  }

  // 🎨 Handle 'content' property (classic style)
  if (typeof message.content === 'string') {
    return message.content;
  }

  // 🌊 Handle array content (multimodal messages)
  if (Array.isArray(message.content)) {
    return message.content
      .filter((part: any) => part.type === 'text')
      .map((part: any) => part.text)
      .join('\n');
  }

  return ''; // 🤷 Give up gracefully
}

/**
 * 🌟 POST Handler - The Main Event!
 *
 * Takes a message, generates TWO distinct responses using Blueprint A and B,
 * stores them for A/B analysis, and returns both in a JSON response.
 * Let the battle begin! ⚔️
 *
 * This endpoint does NOT stream - it waits for both responses
 * and returns a complete JSON payload. Patience is a virtue! 🙏
 */
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log('🎭 ✨ CLAUDE A/B PORTAL AWAKENS!');
    const startTime = Date.now();

    // 🔮 Ensure RAG is ready - we need our wisdom loaded!
    await initializeRAG();

    // 🎯 Extract the last message as the query
    const lastMessage = messages[messages.length - 1];
    const query = extractContent(lastMessage);

    if (!query) {
      console.error('💥 No query content found in the last message!');
      return new Response(
        JSON.stringify({
          error: 'No query content found',
          message: 'The last message appears to be empty or malformed.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 📜 Build conversation history (all but the last message)
    const history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role as 'user' | 'assistant',
      content: extractContent(msg),
    }));

    // 🔍 Get RAG context for both responses - shared wisdom for all!
    console.log('🔍 Retrieving RAG context for:', query.substring(0, 50));
    const ragContext = await findRelevantWisdom(query, 5);

    // 🎭 Detect emotional context for metadata
    const { emotionDetected, blockType } = detectEmotionalContext(query);

    if (blockType) {
      console.log(`🎯 Detected emotional block: ${blockType} - targeting with precision!`);
    }

    // 🏛️ Build the enhanced system prompts for both blueprints
    const systemPromptA = buildEnhancedSystemPrompt('A', ragContext || undefined);
    const systemPromptB = buildEnhancedSystemPrompt('B', ragContext || undefined);

    // ⏱️ Track individual response times
    const timeA = Date.now();

    // 🌊 Generate BOTH responses in parallel - the gladiator showdown!
    // Using Promise.all for maximum efficiency - why wait when you can race?
    const [responseA, responseB] = await Promise.all([
      generateResponse(query, '', systemPromptA, history),
      generateResponse(query, '', systemPromptB, history),
    ]);

    const responseTimeA = Date.now() - timeA;
    const responseTimeB = Date.now() - timeA; // 📊 Same time for parallel execution

    // 💾 Store for A/B analysis - every battle must be recorded for posterity!
    const abTestId = storeABTest(query, responseA, responseB, {
      modelA: 'gpt-4o',
      modelB: 'gpt-4o',
      promptVariantA: 'structured-methodical',
      promptVariantB: 'warm-conversational',
      detectedBlock: blockType,
      responseTimeA,
      responseTimeB,
      tags: ['claude-variant', blockType || 'general'].filter(Boolean),
    });

    const totalTime = Date.now() - startTime;
    console.log(`🎉 ✨ DUAL RESPONSES GENERATED in ${totalTime}ms`);
    console.log(`🆔 A/B Test ID: ${abTestId}`);

    // 🎁 Return both responses for the user to choose
    // The moment of truth - let the people decide! 🏆
    // Structure matches V0 implementation for consistency across variants
    return new Response(
      JSON.stringify({
        abTestId,
        responses: {
          A: responseA,
          B: responseB,
        },
        metadata: {
          variantA: {
            name: 'Structured Cognitive Guidance',
            description: 'Step-by-step methodical approach with clear framework application',
          },
          variantB: {
            name: 'Warm Conversational Guidance',
            description: 'Natural, exploratory approach with gentle framework weaving',
          },
        },
        context: {
          query,
          emotionDetected: emotionDetected || null,
          blockType: blockType || null,
        },
        generationTime: totalTime,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (creativeChallenge: any) {
    // 🌩️ Temporary setback in our theatrical production
    console.error(
      `🌩️ Temporary setback in the Claude A/B arena: ${creativeChallenge.message}`
    );
    console.error('📜 Stack trace:', creativeChallenge.stack);

    return new Response(
      JSON.stringify({
        error: 'Our dual response generators are taking a brief intermission',
        message: creativeChallenge.message,
        hint: 'The show must go on - please try again in a moment!',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
