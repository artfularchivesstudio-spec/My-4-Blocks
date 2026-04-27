/**
 * Dual Response Generator (v2.0)
 *
 * Both responses now use the deterministic cognitive restructuring sequence.
 * Blueprint B has been retired per the v2 constitution.
 * A/B testing now compares variations within the deterministic sequence
 * (e.g., verbosity levels) rather than structured vs. unstructured approaches.
 */

import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { findRelevantWisdom } from './rag';
import { storeABTest } from './abTesting';
import {
  RESPONSE_BLUEPRINT_A,
  RESPONSE_BLUEPRINT_B,
  detectBlockFromQuery,
} from './responseBlueprints';

/**
 * 🎭 The shape of a dual response - two paths, one choice
 */
export interface DualResponse {
  abTestId: string;
  responseA: string;
  responseB: string;
  context: {
    query: string;
    emotionDetected?: string;
    blockType?: string;
  };
}

/**
 * 🌟 Generate two distinct responses for A/B testing
 *
 * Like a choose-your-own-adventure book, but for emotional wisdom!
 * Both responses use the same RAG context but different styles.
 *
 * @param query - The user's message/question
 * @param conversationHistory - Previous messages for context
 * @returns Two responses with tracking ID for choice recording
 */
export async function generateDualResponses(
  query: string,
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<DualResponse> {
  console.log('🎭 ✨ DUAL RESPONSE GENERATION BEGINS! Two paths await...');

  // 🔮 Get RAG context from our semantic search
  const ragContext = await findRelevantWisdom(query, 5);
  const contextSection = ragContext
    ? `\n\n## Relevant Book Context (from "You Only Have Four Problems")\n${ragContext}`
    : '';

  // 🎯 Detect emotion/block type from query
  const blockInfo = detectBlockFromQuery(query);
  const emotionDetected = blockInfo?.name;
  const blockType = blockInfo?.block;

  if (blockInfo) {
    console.log(`🔍 Detected block: ${blockInfo.name} - "${blockInfo.coreInsight}"`);
  }

  // 🌊 Generate both responses in parallel - efficiency is a virtue!
  console.log('🎪 📦 Generating both responses in parallel...');

  const [responseA, responseB] = await Promise.all([
    generateResponse(query, contextSection, RESPONSE_BLUEPRINT_A, conversationHistory, 'A'),
    generateResponse(query, contextSection, RESPONSE_BLUEPRINT_B, conversationHistory, 'B'),
  ]);

  console.log('✨ 🎊 Both responses generated successfully!');

  // 💾 Store for A/B analysis
  const abTestId = storeABTest({
    userQuery: query,
    responseA,
    responseB,
    metadata: {
      emotionDetected,
      blockType,
      modelA: 'gpt-4o-2024-08-06',
      modelB: 'gpt-4o-2024-08-06',
    },
  });

  return {
    abTestId,
    responseA,
    responseB,
    context: {
      query,
      emotionDetected,
      blockType,
    },
  };
}

/**
 * 🎨 Generate a single response with a specific blueprint
 *
 * The actual LLM call happens here. Each blueprint creates a different
 * personality and structure for the response.
 *
 * @param query - The user's question
 * @param contextSection - RAG context from the book
 * @param blueprintPrompt - The style/structure prompt to use
 * @param history - Conversation history
 * @param label - 'A' or 'B' for logging
 * @returns The generated response text
 */
async function generateResponse(
  query: string,
  contextSection: string,
  blueprintPrompt: string,
  history: Array<{ role: string; content: string }>,
  label: string
): Promise<string> {
  console.log(`🌟 Generating response ${label}...`);

  try {
    const result = await generateText({
      model: openai('gpt-4o-2024-08-06'),
      system: blueprintPrompt + contextSection,
      messages: [
        ...history.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user' as const, content: query },
      ],
      temperature: 0.7,
      maxTokens: 2000,
    });

    console.log(`✅ Response ${label} generated (${result.text.length} chars)`);
    return result.text;
  } catch (error) {
    console.error(`💥 😭 Response ${label} generation failed:`, error);
    throw error;
  }
}

/**
 * 🔍 Detect emotional context from query (simpler version)
 *
 * Returns structured info about the detected emotion/block.
 * This is a helper for callers who want just the basics.
 *
 * @param query - The user's message
 * @returns Emotion and block type if detected
 */
export function detectEmotionalContext(query: string): {
  emotionDetected?: string;
  blockType?: string;
} {
  const blockInfo = detectBlockFromQuery(query);

  if (blockInfo) {
    return {
      emotionDetected: blockInfo.name.toLowerCase(),
      blockType: blockInfo.name,
    };
  }

  return {};
}
