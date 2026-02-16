/**
 * 🧪 The A/B Testing Arena - Gemini's Dual Response Portal ✨
 *
 * "Two responses enter the ring,
 * one response wins the user's heart.
 * May the best wisdom prevail!"
 *
 * This endpoint generates TWO distinct responses for the same query,
 * letting users compare and choose their preferred guidance style.
 * It's like speed dating, but for AI responses. 💜
 *
 * - The A/B Testing Gladiator Master
 */

import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import {
  loadEmbeddings,
  findRelevantWisdom,
  type EmbeddingsDatabase,
} from '@shared/lib';
import { storeABTest } from '@shared/lib/abTesting';
import { SYSTEM_PROMPT } from '@shared/api/chat';

// 🌟 Using nodejs runtime for embeddings (edge limit is 1MB)
export const runtime = 'nodejs';
export const maxDuration = 120; // ⏰ Longer timeout for dual generation

// 🔮 Track initialization state
let isInitialized = false;

/**
 * 🌊 Initialize the RAG system - one embeddings to rule them all
 */
async function initializeRAG(): Promise<void> {
  if (isInitialized) return;

  console.log('🌐 ✨ INITIALIZING RAG FOR A/B TESTING...');

  try {
    const importedData = (await import('@shared/data/embeddings.json')) as {
      default?: unknown;
    };
    const embeddingsData = (importedData.default ||
      importedData) as unknown as EmbeddingsDatabase;
    loadEmbeddings(embeddingsData);
    isInitialized = true;
    console.log('💎 RAG initialized for A/B arena!');
  } catch (error) {
    console.error('💥 😭 Failed to initialize RAG:', error);
    isInitialized = true; // Prevent retry loops
  }
}

/**
 * 🎭 Response Blueprint A - Structured & Direct
 *
 * Follows the "first responder" template:
 * Validation -> Formula -> Mapping -> Shift -> Strengths -> Question
 * Like a well-organized therapy session, but without the awkward silences.
 */
const BLUEPRINT_A = `${SYSTEM_PROMPT}

## Response Structure (ALWAYS FOLLOW THIS ORDER):

### Step 1: Safety + Validation (2-4 sentences)
- Acknowledge the experience without minimizing
- Normalize the response
- Example: "What you're experiencing is not small. Feeling this way makes complete sense."

### Step 2: Identify the Block & Formula
- Name which of the Four Blocks they're experiencing
- State the core formula (e.g., Anger = Demand + "Should not be" + Resistance)

### Step 3: Map to Their Situation (Use Their Words!)
- Give 1-2 examples per formula component
- Present as "your mind may be saying things like..."

### Step 4: The Key Shift (Intervention)
- Convert rigid "MUST" to preference format
- "From 'This must not happen' to 'I deeply wish this didn't happen, but...'"

### Step 5: Acknowledge Their Strengths
- Connect their pain to their values
- "Your reaction shows [compassion/responsibility/etc.]"

### Step 6: Close with ONE Targeted Question
- Ask which component feels strongest
- Creates engagement and guides next response

## Tone: Warm but direct. Skip therapy-speak filler.`;

/**
 * 🎨 Response Blueprint B - Conversational & Warm
 *
 * More like chatting with a wise friend over coffee.
 * Less clinical structure, more natural flow.
 * The vibe is "understanding grandmother who also has a PhD."
 */
const BLUEPRINT_B = `${SYSTEM_PROMPT}

## Response Style: Conversational & Warm

### Approach:
- Write like you're having a meaningful conversation over coffee
- Use natural language, not clinical terminology
- Share insights as discoveries, not prescriptions
- Let the user feel understood before offering perspective

### Structure (More Fluid):

1. **Open with genuine acknowledgment** (1-2 sentences)
   Connect with their experience authentically.

2. **Gently introduce the framework**
   "Here's something interesting about what you're describing..."
   Weave in the Four Blocks concept naturally.

3. **Explore their beliefs together**
   Use "I wonder if..." and "It sounds like maybe..."
   Help them discover rather than telling.

4. **Offer a different lens**
   Share the key shift as an invitation:
   "What if, instead of [rigid belief], we tried [preference]..."

5. **Honor their experience**
   Acknowledge the difficulty while showing the path forward.

6. **Invite deeper exploration**
   End with curiosity: "I'm curious - what feels most true for you right now?"

### Tone: Warm, human, real. Allow for uncertainty.`;

/**
 * 🔍 Detect emotional context from the query
 *
 * Because knowing whether someone is angry or anxious
 * helps us track which blocks get the most attention.
 * It's like emotional metadata! 📊
 */
function detectEmotionalContext(query: string): {
  emotionDetected?: string;
  blockType?: string;
} {
  const lower = query.toLowerCase();

  // 🔥 Anger detection - the "this is unfair!" vibe
  if (
    lower.includes('angry') ||
    lower.includes('furious') ||
    lower.includes('unfair') ||
    lower.includes('mad at')
  ) {
    return { emotionDetected: 'anger', blockType: 'Anger' };
  }

  // 😰 Anxiety detection - the "what if everything goes wrong?" energy
  if (
    lower.includes('anxious') ||
    lower.includes('worried') ||
    lower.includes('scared') ||
    lower.includes('what if')
  ) {
    return { emotionDetected: 'anxiety', blockType: 'Anxiety' };
  }

  // 😔 Depression detection - the "I'm worthless" spiral
  if (
    lower.includes('depress') ||
    lower.includes('hopeless') ||
    lower.includes('worthless') ||
    lower.includes('no point')
  ) {
    return { emotionDetected: 'depression', blockType: 'Depression' };
  }

  // 😓 Guilt detection - the "I should have..." regret train
  if (
    lower.includes('guilt') ||
    lower.includes('ashamed') ||
    lower.includes('should have') ||
    lower.includes('my fault')
  ) {
    return { emotionDetected: 'guilt', blockType: 'Guilt' };
  }

  return {}; // 🤷 No specific block detected
}

/**
 * 🎯 Generate a single response with the given blueprint
 *
 * The workhorse function that actually talks to GPT-4o.
 * Feed it a blueprint, get wisdom back. Simple economics.
 */
async function generateResponse(
  query: string,
  ragContext: string,
  blueprint: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  const systemPrompt = ragContext
    ? `${blueprint}\n\n## Retrieved Book Context\n${ragContext}`
    : blueprint;

  const result = await generateText({
    model: openai('gpt-4o'),
    system: systemPrompt,
    messages: [...history, { role: 'user' as const, content: query }],
    temperature: 0.7,
    maxTokens: 2000,
  });

  return result.text;
}

/**
 * 🌟 POST Handler - The Main Event!
 *
 * Takes a message, generates TWO distinct responses,
 * stores them for A/B analysis, and returns both.
 * Let the battle begin! ⚔️
 */
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log('🎭 ✨ GEMINI A/B PORTAL AWAKENS!');
    const startTime = Date.now();

    // 🔮 Ensure RAG is ready
    await initializeRAG();

    // 🎯 Extract the last message as the query
    const lastMessage = messages[messages.length - 1];
    const query = extractContent(lastMessage);

    // 📜 Build conversation history (all but the last message)
    const history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role as 'user' | 'assistant',
      content: extractContent(msg),
    }));

    // 🔍 Get RAG context for both responses
    console.log('🔍 Retrieving RAG context for:', query.substring(0, 50));
    const ragContext = await findRelevantWisdom(query, 5);

    // 🎭 Detect emotional context for metadata
    const { emotionDetected, blockType } = detectEmotionalContext(query);

    // 🌊 Generate BOTH responses in parallel - the gladiator showdown!
    const [responseA, responseB] = await Promise.all([
      generateResponse(query, ragContext, BLUEPRINT_A, history),
      generateResponse(query, ragContext, BLUEPRINT_B, history),
    ]);

    // 💾 Store for A/B analysis - every battle must be recorded for posterity
    const abTestId = storeABTest(query, responseA, responseB, {
      modelA: 'gpt-4o',
      modelB: 'gpt-4o',
      promptVariantA: 'structured-direct',
      promptVariantB: 'conversational-warm',
      detectedBlock: blockType,
      responseTimeA: Date.now() - startTime,
      responseTimeB: Date.now() - startTime,
      tags: ['gemini-variant', blockType || 'general'].filter(Boolean),
    });

    const totalTime = Date.now() - startTime;
    console.log(`🎉 ✨ DUAL RESPONSES GENERATED in ${totalTime}ms`);
    console.log(`🆔 A/B Test ID: ${abTestId}`);

    // 🎁 Return both responses for the user to choose
    return new Response(
      JSON.stringify({
        abTestId,
        responses: {
          A: responseA,
          B: responseB,
        },
        context: {
          query,
          emotionDetected,
          blockType,
        },
        generationTime: totalTime,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (creativeChallenge: any) {
    console.error(
      `🌩️ Temporary setback in the A/B arena: ${creativeChallenge.message}`
    );

    return new Response(
      JSON.stringify({
        error: 'Our dual response generators are taking a brief intermission',
        message: creativeChallenge.message,
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
 */
function extractContent(message: any): string {
  if (!message) return '';

  // 🌟 Handle 'parts' array format (Gemini style)
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

  // 🌊 Handle array content
  if (Array.isArray(message.content)) {
    return message.content
      .filter((part: any) => part.type === 'text')
      .map((part: any) => part.text)
      .join('\n');
  }

  return '';
}
