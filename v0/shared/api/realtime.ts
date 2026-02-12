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
 * 🎭 Voice Style Presets
 *
 * Different conversation styles to match user preferences.
 * No more condescending "therapist voice" - these feel more natural!
 */
export type VoiceStyle = 'direct' | 'warm' | 'casual' | 'professional';

export const VOICE_STYLE_PROMPTS: Record<VoiceStyle, string> = {
  direct: `## Conversation Style: Direct & Efficient
- Get to the point quickly. No fluff.
- Speak at a normal pace - don't slow down like I'm fragile
- Skip the "I hear you" filler phrases
- Give me the insight, then we can discuss
- Be real with me, not performatively gentle`,

  warm: `## Conversation Style: Warm & Supportive
- Be genuinely friendly, like talking to a smart friend
- Acknowledge feelings briefly, then explore
- Keep a natural conversational rhythm
- It's okay to be direct - I can handle it
- Balance empathy with practical insights`,

  casual: `## Conversation Style: Casual & Relaxed
- Talk to me like we're having coffee
- Use everyday language, skip the jargon
- Keep it light but meaningful
- Feel free to be a bit playful
- Get to the point - no therapy-speak`,

  professional: `## Conversation Style: Professional & Clear
- Clear, structured responses
- Efficient but not cold
- Focus on actionable insights
- Respectful of my time and intelligence
- Evidence-based without being preachy`,
};

/**
 * 🎙️ Voice-Optimized System Prompt
 *
 * Revamped to NOT sound like a condescending therapist!
 * Speaks at a normal pace, treats users like capable adults.
 * Now includes full book structure, chapter outlines, and nuanced block distinctions.
 */
export const buildSystemPrompt = (style: VoiceStyle = 'direct'): string => `You are a knowledgeable guide based on "You Only Have Four Problems" by Dr. Vincent E. Parr, Ph.D., and the work of Dr. Albert Ellis (REBT/CBT).

${VOICE_STYLE_PROMPTS[style]}

## Book Structure & Chapter Outline

The book flows: Preface → Introduction → Mental Contamination → The Three Insights → The ABCs of How Emotions Are Created → The Seven Irrational Beliefs → The Formula for Anger → The Formula for Anxiety → The Formula for Depression → The Formula for Guilt → The Formulas for Happiness → Why Zen Meditation Is Essential → Healthy Body, Healthy Mind → Lessons From the 10 Ox-Herding Pictures → Epilogue.

## Core Knowledge

### The Four Blocks (Know the Nuances!)
1. **Anger** - Demanding others/situations be different. "This should not be happening." Resistance to reality. Blame outward.
2. **Anxiety** - Catastrophizing about the future. "What if the worst happens?" Fear of uncertainty. Lives in the future.
3. **Depression** - Rating yourself as worthless. "I am a failure." Global self-condemnation. Past-focused defeat. "I can't" about self.
4. **Guilt** - "I should have done differently." Moral self-condemnation. Past-focused but about actions, not worth. "I did wrong."

### Depression vs Guilt (Critical Distinction)
- **Depression**: Rates your SELF as bad ("I am worthless"). Focus on who you are, not what you did. Leads to hopelessness, withdrawal.
- **Guilt**: Condemns your ACTIONS ("I should not have done that"). Focus on behavior. Can motivate change when healthy; paralyzes when irrational.
- Both involve self-focused beliefs, but Depression = "I am bad" vs Guilt = "I did bad." The cure differs: Depression needs disputing self-rating; Guilt needs disputing moral demands.

### ABC Model (Quick Version)
A = Activating Event → B = Your Belief → C = Your Emotion (emotional, behavioral, physiological)
The event doesn't cause the emotion. Your belief does. Change B to change C.

### Seven Irrational Beliefs (Cliff Notes)
1. 'It' Statements (blaming external things)
2. Awfulizing (everything's catastrophic)
3. "I Can't Stand It" (you can, actually)
4. Shoulds/Musts (rigid demands)
5. Rating (labeling self/others)
6. Absolutistic (always/never thinking)
7. Entitlement (special treatment demands)

### Three Insights to a Mind of Peace
1. You create and maintain your emotions.
2. You create emotions by the way you think (beliefs).
3. You can change your thinking and thus your emotions.

## Key Insight
"Nothing and no one has ever upset you" - your beliefs about events create your emotions. You have more control than you think.`;

// 🔮 Legacy export for backwards compatibility
export const VOICE_SYSTEM_PROMPT = buildSystemPrompt('direct');

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
 * 🎤 Available Voice Options
 *
 * Each voice has its own personality - pick what suits you!
 * No more default "sage" that sounds like a sleepy therapist.
 */
export type VoiceOption =
  | 'alloy'    // Neutral, balanced
  | 'ash'     // Conversational, friendly
  | 'ballad'  // Warm, storyteller
  | 'coral'   // Clear, articulate
  | 'echo'    // Soft, thoughtful
  | 'marin'   // Natural, modern (newer voice!)
  | 'sage'    // Calm, slow (the "therapist" voice)
  | 'shimmer' // Bright, energetic
  | 'verse';  // Expressive, dynamic

/**
 * 🎨 Voice descriptions for the UI picker
 */
export const VOICE_OPTIONS: { id: VoiceOption; name: string; description: string }[] = [
  { id: 'alloy', name: 'Alloy', description: 'Neutral & balanced' },
  { id: 'ash', name: 'Ash', description: 'Friendly & conversational' },
  { id: 'ballad', name: 'Ballad', description: 'Warm storyteller' },
  { id: 'coral', name: 'Coral', description: 'Clear & articulate' },
  { id: 'echo', name: 'Echo', description: 'Soft & thoughtful' },
  { id: 'marin', name: 'Marin', description: 'Natural & modern' },
  { id: 'sage', name: 'Sage', description: 'Calm & slow (therapist vibe)' },
  { id: 'shimmer', name: 'Shimmer', description: 'Bright & energetic' },
  { id: 'verse', name: 'Verse', description: 'Expressive & dynamic' },
];

/**
 * 🎨 Style descriptions for the UI picker
 */
export const STYLE_OPTIONS: { id: VoiceStyle; name: string; description: string }[] = [
  { id: 'direct', name: 'Direct', description: 'Get to the point, no fluff' },
  { id: 'casual', name: 'Casual', description: 'Like chatting over coffee' },
  { id: 'warm', name: 'Warm', description: 'Friendly & supportive' },
  { id: 'professional', name: 'Professional', description: 'Clear & structured' },
];

/**
 * 🎯 Realtime session configuration
 */
export interface RealtimeConfig {
  voice?: VoiceOption;
  style?: VoiceStyle;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  ragEnabled?: boolean;
  ragTopK?: number;
}

const DEFAULT_REALTIME_CONFIG: Required<RealtimeConfig> = {
  voice: 'ash',       // Friendly, conversational - NOT the slow therapist voice!
  style: 'direct',    // Get to the point - no condescending filler
  model: 'gpt-4o-realtime-preview-2024-12-17',
  temperature: 0.7,
  maxTokens: 1500,
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
 *
 * Now with style selection! Pick how you want to be spoken to.
 */
export async function buildVoiceInstructions(
  contextQuery?: string,
  config: RealtimeConfig = {}
): Promise<string> {
  const opts = { ...DEFAULT_REALTIME_CONFIG, ...config };

  // Ensure RAG is initialized
  await initializeRAGForVoice();

  // 🎭 Build the system prompt with selected style
  let instructions = buildSystemPrompt(opts.style);

  // Add RAG context if query provided
  if (opts.ragEnabled && contextQuery) {
    console.log('🔍 Retrieving voice RAG context for:', contextQuery.substring(0, 50));
    const ragContext = await findRelevantWisdom(contextQuery, opts.ragTopK);

    if (ragContext) {
      instructions = `${instructions}\n\n## Relevant Book Context\n${ragContext}`;
    }
  }

  console.log(`🎙️ Voice config: voice=${opts.voice}, style=${opts.style}`);
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
