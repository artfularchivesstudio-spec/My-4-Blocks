/**
 * 🎙️ The Realtime Voice API - WebRTC Session Handler ✨
 *
 * "Where voice becomes the bridge between hearts,
 * and wisdom flows through the air like music."
 *
 * Handles OpenAI Realtime API sessions for voice mode.
 * Integrates RAG context retrieval for voice conversations.
 *
 * - The Voice Portal Guardian
 */

import {
  loadEmbeddings,
  findRelevantWisdom,
  getRAGStats,
  type EmbeddingsDatabase,
} from '../lib';

// 🔮 Track initialization state
let isInitialized = false;

/**
 * 🎙️ Voice-Optimized System Prompt
 *
 * Adapted for spoken conversation - shorter, more conversational,
 * with natural pauses and emotional acknowledgment.
 */
export const VOICE_SYSTEM_PROMPT = `You are a compassionate voice guide based on the teachings from "You Only Have Four Problems" by Dr. Vincent E. Parr, Ph.D., combined with the foundational work of Dr. Albert Ellis (REBT/CBT).

## Your Core Knowledge

### The Four Blocks to Happiness
There are only four emotional problems:
1. **Anger** - When we demand others or situations be different
2. **Anxiety** - When we catastrophize about future events
3. **Depression** - When we rate ourselves as worthless
4. **Guilt** - When we demand we "should" have acted differently

### The ABC Model
- **A** = Activating Event (what happens)
- **B** = Belief (what we tell ourselves)
- **C** = Consequence (our emotional response)

Key insight: Events don't cause emotions. Our BELIEFS about events create our emotions.

### The Seven Irrational Beliefs
1. 'It' Statements - Blaming external things
2. Awfulizing - Exaggerating to catastrophic levels
3. I Can't Stand It - Believing we cannot survive
4. Shoulds, Musts, Demands - Rigid demands on reality
5. Rating - Labeling self or others as worthless
6. Absolutistic Thinking - "always", "never", "everyone"
7. Entitlement - Believing we deserve special treatment

## Voice Conversation Guidelines
- Speak naturally and warmly, like a caring friend
- Keep responses concise - voice is slower than reading
- Use gentle pauses... let moments breathe
- Acknowledge emotions before exploring them
- Ask one clarifying question at a time
- Use simple, conversational language
- Be patient and present
- Remember: silence is okay in voice conversations

## Key Reminders
- "Nothing and no one has ever upset you" - it's our beliefs
- Help users see they create and can change their emotions
- Guide gently, never preach
- Meet people where they are emotionally`;

/**
 * 🌊 Initialize the RAG system for voice sessions
 */
export async function initializeRAGForVoice(): Promise<void> {
  if (isInitialized) return;

  console.log('🎙️ ✨ INITIALIZING VOICE RAG SYSTEM...');

  try {
    const importedData = await import('../data/embeddings.json') as { default?: unknown };
    const embeddingsData = (importedData.default || importedData) as unknown as EmbeddingsDatabase;
    loadEmbeddings(embeddingsData);
    isInitialized = true;

    const stats = getRAGStats();
    console.log(`🎉 ✨ VOICE RAG INITIALIZED! ${stats.totalChunks} chunks loaded`);
  } catch (error) {
    console.error('💥 😭 Failed to initialize voice RAG:', error);
    isInitialized = true; // Prevent retry loops
  }
}

/**
 * 🎯 Realtime session configuration
 */
export interface RealtimeConfig {
  voice?: 'alloy' | 'echo' | 'shimmer' | 'ash' | 'ballad' | 'coral' | 'sage' | 'verse';
  model?: string;
  temperature?: number;
  maxTokens?: number;
  ragEnabled?: boolean;
  ragTopK?: number;
}

const DEFAULT_REALTIME_CONFIG: Required<RealtimeConfig> = {
  voice: 'sage', // Calm, therapeutic voice
  model: 'gpt-4o-realtime-preview-2024-12-17',
  temperature: 0.7,
  maxTokens: 1500, // Shorter for voice
  ragEnabled: true,
  ragTopK: 5,
};

/**
 * 📝 Ephemeral session response from OpenAI
 */
export interface EphemeralSessionResponse {
  id: string;
  object: string;
  expires_at: number;
  client_secret: {
    value: string;
    expires_at: number;
  };
  model: string;
  voice: string;
  modalities: string[];
  instructions?: string;
}

/**
 * 🎤 Build voice-optimized instructions with RAG context
 */
export async function buildVoiceInstructions(
  contextQuery?: string,
  config: RealtimeConfig = {}
): Promise<string> {
  const opts = { ...DEFAULT_REALTIME_CONFIG, ...config };

  // Ensure RAG is initialized
  await initializeRAGForVoice();

  let instructions = VOICE_SYSTEM_PROMPT;

  // Add RAG context if query provided
  if (opts.ragEnabled && contextQuery) {
    console.log('🔍 Retrieving voice RAG context for:', contextQuery.substring(0, 50));
    const ragContext = await findRelevantWisdom(contextQuery, opts.ragTopK);

    if (ragContext) {
      instructions = `${VOICE_SYSTEM_PROMPT}\n\n## Relevant Book Context for This Conversation\n${ragContext}`;
    }
  }

  return instructions;
}

/**
 * 🌟 Create an ephemeral session for WebRTC voice connection
 *
 * This generates a temporary token that the client uses to
 * establish a WebRTC connection with OpenAI's Realtime API.
 *
 * @param contextQuery - Optional initial context for RAG retrieval
 * @param config - Session configuration options
 * @returns Ephemeral session with client secret for WebRTC
 */
export async function createRealtimeSession(
  contextQuery?: string,
  config: RealtimeConfig = {}
): Promise<EphemeralSessionResponse> {
  const opts = { ...DEFAULT_REALTIME_CONFIG, ...config };

  // Build voice instructions with optional RAG context
  const instructions = await buildVoiceInstructions(contextQuery, config);

  // Create ephemeral session with OpenAI
  const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: opts.model,
      voice: opts.voice,
      instructions: instructions,
      input_audio_format: 'pcm16',
      output_audio_format: 'pcm16',
      input_audio_transcription: {
        model: 'whisper-1'
      },
      turn_detection: {
        type: 'server_vad',
        threshold: 0.5,
        prefix_padding_ms: 300,
        silence_duration_ms: 500,
        create_response: true,
      },
      tools: [],
      tool_choice: 'auto',
      temperature: opts.temperature,
      max_response_output_tokens: opts.maxTokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('💥 OpenAI Realtime API error:', errorText);
    throw new Error(`Failed to create realtime session: ${response.status} ${errorText}`);
  }

  const sessionData = await response.json();
  console.log('🎙️ ✨ Realtime session created:', sessionData.id);

  return sessionData;
}

/**
 * 🔄 Handle realtime session request (for API routes)
 *
 * This is the main handler that API routes should call.
 * It validates the request and creates a session.
 *
 * @param request - The incoming request object
 * @returns Response with session data or error
 */
export async function handleRealtimeRequest(request: Request): Promise<Response> {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Parse request body
    let body: { contextQuery?: string; config?: RealtimeConfig } = {};
    try {
      const text = await request.text();
      if (text) {
        body = JSON.parse(text);
      }
    } catch {
      // Empty body is fine
    }

    // Create the session
    const session = await createRealtimeSession(body.contextQuery, body.config);

    return new Response(JSON.stringify(session), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store', // Don't cache session tokens
      },
    });
  } catch (error) {
    console.error('💥 Realtime session error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to create realtime session',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * 📊 Get voice RAG status
 */
export function getVoiceRAGStats() {
  return {
    ragStats: getRAGStats(),
    isInitialized,
  };
}
