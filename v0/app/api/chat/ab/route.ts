/**
 * 🧪 The A/B Testing Arena - V0's Dual Response Portal ✨
 *
 * "Two responses enter the gladiatorial ring,
 * one response wins the user's heart.
 * May the best wisdom prevail!"
 *
 * This endpoint generates TWO distinct responses for the same query,
 * letting users compare and choose their preferred guidance style.
 * It's like a dating show for AI therapists! 💜
 *
 * Blueprint A: The Structured Sage - methodical, step-by-step cognitive guidance
 * Blueprint B: The Warm Friend - conversational, exploratory approach
 *
 * Both use the same RAG context, just different communication styles.
 * Science demands it! 🔬
 *
 * - The A/B Testing Colosseum Director (V0 Division)
 */

import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import {
  loadEmbeddings,
  findRelevantWisdom,
  type EmbeddingsDatabase,
} from '@shared/lib';
import { storeABTest } from '@shared/lib/abTesting';
import {
  buildEnhancedSystemPrompt,
  detectLikelyBlock,
  type EmotionalBlock,
} from '@shared/lib/responseBlueprints';

// 🌟 Using nodejs runtime for embeddings (edge limit is 1MB)
// Vercel's edge runtime is like a cozy apartment - no room for our wisdom library! 🏠
export const runtime = 'nodejs';
export const maxDuration = 120; // ⏰ Longer timeout for dual generation - patience, grasshopper!

// 🔮 Track initialization state - RAG needs to warm up before the show!
let isInitialized = false;

/**
 * 🌊 Initialize the RAG system - one embeddings to rule them all
 *
 * Loads the book's wisdom into memory so we can retrieve
 * relevant context for both responses. Sharing is caring! 📚
 */
async function initializeRAG(): Promise<void> {
  if (isInitialized) return;

  console.log('🌐 ✨ INITIALIZING RAG FOR V0 A/B TESTING...');

  try {
    const importedData = (await import('@shared/data/embeddings.json')) as {
      default?: unknown;
    };
    const embeddingsData = (importedData.default ||
      importedData) as unknown as EmbeddingsDatabase;
    loadEmbeddings(embeddingsData);
    isInitialized = true;
    console.log('💎 RAG initialized for V0 A/B arena!');
  } catch (error) {
    console.error('💥 😭 Failed to initialize RAG:', error);
    isInitialized = true; // Prevent retry loops - we tried our best
  }
}

/**
 * 🔍 Detect emotional context from the query - Simple Quick-Check
 *
 * A lightweight emotional detector for logging and metadata.
 * The more sophisticated detection in responseBlueprints.ts handles edge cases.
 * This is like emotional triage, but friendlier! 🎭
 *
 * @param query - The user's message to analyze
 * @returns Object with detected emotion and block type
 */
function detectEmotionalContext(query: string): {
  emotionDetected?: string;
  blockType?: EmotionalBlock;
} {
  const lower = query.toLowerCase();

  // 🔥 Anger detection - the "this is unfair!" vibes
  // When reality isn't conforming to their expectations
  if (
    lower.includes('angry') ||
    lower.includes('furious') ||
    lower.includes('unfair') ||
    lower.includes('mad at') ||
    lower.includes('pissed') ||
    lower.includes('frustrated') ||
    lower.includes('how dare')
  ) {
    return { emotionDetected: 'anger', blockType: 'Anger' };
  }

  // 😰 Anxiety detection - the "what if everything goes wrong?" spiral
  // Time-traveling to the worst possible futures
  if (
    lower.includes('anxious') ||
    lower.includes('worried') ||
    lower.includes('scared') ||
    lower.includes('what if') ||
    lower.includes('nervous') ||
    lower.includes('panic') ||
    lower.includes('terrified')
  ) {
    return { emotionDetected: 'anxiety', blockType: 'Anxiety' };
  }

  // 😔 Depression detection - the "I'm worthless" self-rating
  // When they're attacking WHO they are, not what they did
  if (
    lower.includes('depress') ||
    lower.includes('hopeless') ||
    lower.includes('worthless') ||
    lower.includes('no point') ||
    lower.includes('give up') ||
    lower.includes("can't go on") ||
    lower.includes('i am a failure') ||
    lower.includes("i'm a failure")
  ) {
    return { emotionDetected: 'depression', blockType: 'Depression' };
  }

  // 😓 Guilt detection - the "I should have..." regret train
  // When they're attacking what they DID, not who they are
  if (
    lower.includes('guilt') ||
    lower.includes('ashamed') ||
    lower.includes('should have') ||
    lower.includes("shouldn't have") ||
    lower.includes('my fault') ||
    lower.includes('blame myself') ||
    lower.includes('feel bad about') ||
    lower.includes('regret')
  ) {
    return { emotionDetected: 'guilt', blockType: 'Guilt' };
  }

  // 🤷 No specific block detected - let the AI's wisdom shine through!
  return {};
}

/**
 * 🎯 Generate a single response with the given blueprint
 *
 * The workhorse function that summons GPT-4o with a specific
 * response style. Feed it a blueprint, get therapeutic wisdom back.
 * It's like a cosmic vending machine for emotional guidance! 🎰
 *
 * @param query - The user's existential question
 * @param systemPrompt - The complete system prompt (blueprint + RAG context)
 * @param history - Previous messages in the conversation
 * @returns The AI's carefully crafted response
 */
async function generateResponse(
  query: string,
  systemPrompt: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  const result = await generateText({
    model: openai('gpt-4o'),
    system: systemPrompt,
    messages: [...history, { role: 'user' as const, content: query }],
    temperature: 0.7, // 🌡️ Just right - not too robotic, not too chaotic
    maxTokens: 2000,
  });

  return result.text;
}

/**
 * 🌟 POST Handler - The Main Event! Where Responses Duel! ⚔️
 *
 * Takes a message, generates TWO distinct responses using Blueprint A
 * (Structured Sage) and Blueprint B (Warm Friend), stores them for
 * A/B analysis, and returns both for the user to choose.
 *
 * This endpoint does NOT stream - it waits for both responses
 * to complete and returns them as a single JSON payload.
 * Good things come to those who wait! ⏳
 *
 * @param req - The incoming request with messages
 * @returns JSON response with both AI responses and metadata
 */
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log('🎭 ✨ V0 A/B PORTAL AWAKENS! Two responses shall compete!');
    const startTime = Date.now();

    // 🔮 Ensure RAG is ready - can't have a wisdom battle without wisdom!
    await initializeRAG();

    // 🎯 Extract the last message as the query
    const lastMessage = messages[messages.length - 1];
    const query = extractContent(lastMessage);

    if (!query) {
      console.error('💥 No query found in the message - the seeker spoke in riddles!');
      return new Response(
        JSON.stringify({
          error: 'No message content found',
          hint: 'Please provide a message with text content',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 📜 Build conversation history (all but the last message)
    // Like a court reporter keeping track of the trial! ⚖️
    const history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role as 'user' | 'assistant',
      content: extractContent(msg),
    }));

    // 🔍 Get RAG context for both responses - same source, different styles!
    console.log('🔍 V0 A/B Arena: Retrieving RAG context for:', query.substring(0, 50));
    const ragContext = await findRelevantWisdom(query, 5);

    // 🎭 Detect emotional context using both quick-check and sophisticated detector
    const { emotionDetected, blockType } = detectEmotionalContext(query);
    const detectedBlock = detectLikelyBlock(query); // More sophisticated pattern matching
    const finalBlockType = blockType || detectedBlock || null;

    if (finalBlockType) {
      console.log(`🎯 Detected emotional block: ${finalBlockType}`);
    }

    // 🏛️ Build the two competing system prompts using shared blueprints
    // Blueprint A: The Structured Sage - methodical, step-by-step guidance
    // Blueprint B: The Warm Friend - conversational, exploratory approach
    const blueprintA = buildEnhancedSystemPrompt('A', ragContext || undefined);
    const blueprintB = buildEnhancedSystemPrompt('B', ragContext || undefined);

    // 🌊 Generate BOTH responses in parallel - the gladiator showdown begins! ⚔️
    // Promise.all is our colosseum - may the best response win!
    console.log('🏟️ Generating dual responses in parallel...');
    const [responseA, responseB] = await Promise.all([
      generateResponse(query, blueprintA, history),
      generateResponse(query, blueprintB, history),
    ]);

    const endTime = Date.now();

    // 💾 Store for A/B analysis - every battle must be recorded for posterity! 📊
    const abTestId = storeABTest(query, responseA, responseB, {
      modelA: 'gpt-4o',
      modelB: 'gpt-4o',
      promptVariantA: 'structured-direct',
      promptVariantB: 'conversational-warm',
      detectedBlock: finalBlockType || undefined,
      responseTimeA: endTime - startTime,
      responseTimeB: endTime - startTime,
      tags: ['v0-variant', finalBlockType || 'general'].filter(Boolean) as string[],
    });

    const totalTime = endTime - startTime;
    console.log(`🎉 ✨ V0 DUAL RESPONSES GENERATED in ${totalTime}ms`);
    console.log(`🆔 A/B Test ID: ${abTestId}`);
    console.log(`📏 Response A: ${responseA.length} chars | Response B: ${responseB.length} chars`);

    // 🎁 Return both responses for the user to choose
    // Like presenting two paths in the Yellow Wood! 🍂
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
          blockType: finalBlockType,
        },
        generationTime: totalTime,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (creativeChallenge: any) {
    // 🌩️ When storms arise, we weather them with grace
    console.error(
      `🌩️ V0 A/B Arena: Temporary setback - ${creativeChallenge.message}`
    );
    console.error('📜 Stack:', creativeChallenge.stack);

    return new Response(
      JSON.stringify({
        error: 'Our dual response generators are taking a brief intermission',
        message: creativeChallenge.message,
        hint: 'The AI gladiators are catching their breath. Please try again shortly.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * 🔧 Extract text content from a message
 *
 * Handles both the 'content' and 'parts' formats
 * because the AI SDK loves to keep us on our toes. 🎪
 * Flexibility is our middle name!
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

  // 🎨 Handle 'content' property (standard style)
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

  return '';
}
