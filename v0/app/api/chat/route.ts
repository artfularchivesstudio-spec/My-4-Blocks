/**
 * 🌐 The V0 Chat Portal - Now Unified ✨
 *
 * "Where feelings become friendly facts,
 * through the shared API's unified gateway."
 *
 * - The Unified Architecture Maestro
 */

import { handleChatRequest, type ChatConfig } from '../../../shared/api/chat';
import type { UIMessage } from 'ai';

export const maxDuration = 60;
export const runtime = 'edge';

/**
 * 🎭 The POST Handler - Simplified Gateway
 *
 * All the magic now lives in the shared API.
 * We just pass through the messages and config.
 */
export async function POST(req: Request) {
  // 🔮 Check API key (shared API will also check, but fail fast)
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({
        error: 'Missing OPENAI_API_KEY',
        hint: 'Set OPENAI_API_KEY in Vercel project env vars for production.',
      }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      }
    );
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  // 🌟 Configuration for this variant
  const config: ChatConfig = {
    model: 'gpt-4o-mini', // 💰 Cost-effective wisdom delivery
    temperature: 0.7,
    ragEnabled: true,
    ragTopK: 5,
  };

  console.log('🌐 ✨ V0 PORTAL AWAKENS!');
  return handleChatRequest(messages, config, req.signal);
}
