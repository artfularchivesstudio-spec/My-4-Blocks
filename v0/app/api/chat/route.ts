/**
 * 🌐 The V0 Chat Portal - Now Unified ✨
 *
 * "Where feelings become friendly facts,
 * through the shared API's unified gateway."
 *
 * - The Unified Architecture Maestro
 */

import { handleChatRequest, type ChatConfig } from '@shared/api/chat';
import type { UIMessage } from 'ai';
import { getActiveConfig } from '@/lib/admin-config';

export const maxDuration = 60;
// 🌟 Using nodejs runtime due to embeddings size (edge limit is 1MB)
export const runtime = 'nodejs';

/**
 * 🎭 The POST Handler - Simplified Gateway with Bulletproof Error Handling
 *
 * All the magic now lives in the shared API.
 * We just pass through the messages and config.
 *
 * Now with proper try/catch to identify issues! 🛡️
 */
export async function POST(req: Request) {
  // 🔮 Check API key (shared API will also check, but fail fast)
  if (!process.env.OPENAI_API_KEY) {
    console.error('💥 OPENAI_API_KEY is missing!');
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

  try {
    // 🎯 Parse incoming messages
    const body = await req.json();
    const { messages }: { messages: UIMessage[] } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error('💥 Invalid messages payload:', JSON.stringify(body).substring(0, 200));
      return new Response(
        JSON.stringify({ error: 'Invalid messages payload', received: typeof messages }),
        { status: 400, headers: { 'content-type': 'application/json' } }
      );
    }

    // 🕵️‍♂️ Fetch dynamic config from Admin Page (Supabase)
    const adminConfig = await getActiveConfig();

    // 🌟 Configuration for this variant - merged with Admin overrides!
    const config: ChatConfig = {
      model: adminConfig.model || 'gpt-4o-2024-08-06', // 🧠 Upgraded for A/B testing - deeper reasoning for emotional guidance!
      temperature: adminConfig.temperature ?? 0.7,
      ragEnabled: adminConfig.ragEnabled ?? true,
      ragTopK: adminConfig.ragTopK ?? 5,
      systemPrompt: adminConfig.systemPrompt, // This will override the default in handleChatRequest
    };

    console.log('🌐 ✨ V0 PORTAL AWAKENS!');
    console.log(`📨 Processing ${messages.length} messages`);

    return await handleChatRequest(messages, config, req.signal);
  } catch (error) {
    // 🌩️ Catch any unhandled errors and report them
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error('💥 😭 V0 CHAT API ERROR:', errorMessage);
    if (errorStack) console.error('📜 Stack:', errorStack);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: errorMessage,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      }
    );
  }
}
