/**
 * 🌐 The Gemini Chat Portal - Now Unified ✨
 *
 * "All paths lead to the same wisdom,
 * through the shared API's single gateway."
 *
 * - The Unified Architecture Maestro
 */

import { handleChatRequest, type ChatConfig } from '@shared/api/chat';

// 🌟 Using nodejs runtime due to embeddings size (edge limit is 1MB)
export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * 🎯 Message type for the shared API
 * Using a simple interface that matches what handleChatRequest expects
 */
interface NormalizedMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * 🎭 The POST Handler - Simplified Gateway
 *
 * All the magic now lives in the shared API.
 * We just pass through the messages and config.
 */
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 🔮 Convert gemini's parts format to standard message format
    // The shared API's extractMessageContent handles both 'content' and 'parts' formats,
    // so we just need to ensure we have proper structure
    const normalizedMessages: NormalizedMessage[] = messages.map((msg: any) => {
      // Handle gemini's parts array format
      if (Array.isArray(msg.parts)) {
        const textContent = msg.parts
          .filter((part: any) => part.type === 'text')
          .map((part: any) => part.text)
          .join('\n');
        return {
          id: msg.id || crypto.randomUUID(),
          role: msg.role as 'user' | 'assistant' | 'system',
          content: textContent,
        };
      }
      // Already has content property
      return {
        id: msg.id || crypto.randomUUID(),
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content || '',
      };
    });

    // 🌟 Configuration for this variant
    const config: ChatConfig = {
      model: 'gpt-4o-mini', // 💰 Using the cost-effective model
      temperature: 0.7,
      ragEnabled: true,
      ragTopK: 5,
    };

    console.log('🌐 ✨ GEMINI PORTAL AWAKENS!');
    // 🎭 Cast to any to bypass strict type checking - the shared API handles it gracefully
    return handleChatRequest(normalizedMessages as any, config, req.signal);

  } catch (creativeChallenge: any) {
    console.error(`🌩️ Temporary setback in the gemini portal: ${creativeChallenge.message}`);

    return new Response(
      JSON.stringify({
        error: "Our digital muses are taking a brief intermission",
        message: creativeChallenge.message
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
