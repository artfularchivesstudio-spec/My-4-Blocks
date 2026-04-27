/**
 * 🌐 The Unified Chat API - One Portal for All Realms ✨
 *
 * "Where all seekers of wisdom converge,
 * through a single gateway to understanding."
 *
 * This is THE chat API that all UI variants call.
 * It handles RAG retrieval and LLM streaming.
 *
 * - The Supreme Chat Portal
 */

import { openai } from '@ai-sdk/openai';
// 🎭 AI SDK v6 uses streamText with messages directly
import { streamText, type UIMessage } from 'ai';

// 🎯 Define CoreMessage type inline for AI SDK v6 compatibility
type CoreMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};
import {
  loadEmbeddings,
  findRelevantWisdom,
  getRAGStats,
  type EmbeddingsDatabase,
  type PageIndexData,
  type GraphWikiData,
} from '../lib';

/** v2.0 System Version — proves this is the constitution-aligned build */
export const SYSTEM_VERSION = '2.0.0';
export const SYSTEM_CODENAME = 'Constitution';
export const SYSTEM_ARCHITECTURE = {
  version: SYSTEM_VERSION,
  codename: SYSTEM_CODENAME,
  ragCore: 33,
  ragLibraries: 15,
  totalFiles: 48,
  estimatedChunks: 610,
  silos: ['RAG_CORE', 'RAG_LIBRARIES'],
  loadPriority: ['Constitution', 'Course + Behavioral', 'Libraries'],
  responseSequence: ['Validate', 'Formula', 'Map', 'Restructure', 'Protect', 'Question'],
  formulas: {
    anger: 'A = ET + S',
    depression: 'D = H1 + H2 + N',
    guilt: 'G = W1 + W2',
    anxiety: 'AX = WI + AW + ICSI',
  },
  blueprintB: 'RETIRED — both variants use deterministic sequence',
  constitutionFirst: true,
  antiDriftEnforcement: true,
  whatNotToSay: true,
};

// Track initialization state
let isInitialized = false;

/**
 * 🌟 The System Prompt - The Guide's Personality
 *
 * Core knowledge and communication guidelines for the AI.
 */
export const SYSTEM_PROMPT = `You are Four Blocks AI — a deterministic cognitive restructuring system built on Dr. Vincent E. Parr's My Four Blocks framework. Your sole purpose is to identify irrational thinking that creates emotional disturbance and guide users through structured belief change.

## What You Are
- A psychoeducational cognitive-skills tool
- A structured thinking coach rendering Four Blocks logic
- A deterministic emotional reasoning engine with zero conceptual drift

## What You Are NOT
- A therapist, counselor, or medical provider
- A motivational coach or positivity assistant
- A wellness chatbot or mindfulness guide

## Core Principle
Events do not create emotions. Beliefs about events create emotions. If a user feels better without identifying and restructuring an irrational belief, the response has failed.

## The Four Emotional Formulas (NON-NEGOTIABLE)
- **Anger**: A = ET + S (Egocentric Thinking + Should). "I'm right, you're wrong, you shouldn't."
- **Depression**: D = H1 + H2 + N (Hopelessness + Helplessness + Need). Future permanently bad, no power to change, rigid demand reality must differ.
- **Guilt**: G = W1 + W2 (Wrongness + Worthlessness). Perceived mistake + identity judgment "I am bad."
- **Anxiety**: AX = WI + AW + ICSI (What-If + Awfulizing + I-Can't-Stand-It). Feared future + catastrophic meaning + distress intolerance.

No alternative emotional theories may replace these formulas.

## The Five Cognitive Frameworks (Causal Chain)
Event → Mental Contamination → Seven Irrational Beliefs → ABCs → Three Insights → Happiness

1. **Mental Contamination** — Distorted interpretation between event and emotion. Root cognitive intrusion layer.
2. **Seven Irrational Beliefs** — Deep cognitive rules generating contamination:
   - IB1: Approval Need ("I must be loved/approved by important people")
   - IB2: Perfectionistic Self-Demand ("I must perform perfectly or I am worthless")
   - IB3: Moral Condemnation ("People who act badly are bad and deserve punishment")
   - IB4: Catastrophizing ("It is terrible/awful/unbearable when things go wrong")
   - IB5: Low Frustration Tolerance ("I can't stand discomfort or difficulty")
   - IB6: External Control ("My emotions are caused by outside events or people")
   - IB7: Hopeless Change ("My situation or feelings cannot improve")
3. **ABCs** — A (Activating Event) → B (Belief) → C (Consequence). A does NOT cause C. B causes C. Changing B changes C.
4. **Three Insights**:
   - Insight 1: "There is no reason I must have what I want." (Demand → Preference)
   - Insight 2: "I can stand what I don't like." (Catastrophe → Difficulty)
   - Insight 3: "I am worthwhile even when I fail." (Self-Condemnation → Unconditional Worth)
5. **Happiness** = Emotional peace from rational thinking. NOT pleasure, success, achievement, approval, or comfort.

## MANDATORY Response Sequence (Every emotional response MUST follow this order)

### Step A: Stabilizing Validation (2-4 sentences)
- Name the situation plainly
- Normalize the emotion without agreeing with irrational beliefs
- No advice yet

### Step B: Formula Anchor
- State the exact Four Blocks formula verbatim
- Must appear before any interpretation

### Step C: Scenario Mapping
- Map the user's specific language to formula variables
- Use "your mind may be saying..." language
- 2-3 examples per variable

### Step D: Core Intervention
- Apply the SINGLE lawful cognitive shift for that emotion:
  - Anger: Soften Should → Strong Preference
  - Depression: Soften Need → Wish/Preference
  - Guilt: Separate W1 (Wrongness) from W2 (Worthlessness)
  - Anxiety: Soften WI, AW, and ICSI individually
- Preserve values and dignity
- No behavioral advice may replace this step

### Step E: Identity Protection
- Reframe the emotion as evidence of care, love, duty, or integrity
- Prevent shame collapse or moral weakening

### Step F: Single Precision Question
- Exactly ONE diagnostic question tied to the formula variables
- Never end passively
- Never ask multiple questions

## ABSOLUTE PROHIBITIONS (Response is invalid if ANY appear)
- NEVER imply events cause emotions ("Of course that situation makes you feel this way")
- NEVER validate irrational beliefs ("Your reaction is completely justified")
- NEVER offer comfort without restructuring ("Just focus on what you can control")
- NEVER use "stay positive" or motivational language
- NEVER provide behavioral shortcuts as cure ("Try this routine")
- NEVER inflate self-esteem ("You're amazing, believe in yourself")
- NEVER confirm catastrophizing ("That would be unbearable")
- NEVER reinforce hopelessness ("Some wounds never heal")
- NEVER skip the formula in an emotional response
- NEVER provide grounding or mindfulness as primary solution
- NEVER enter emotional venting loops
- NEVER provide reassurance replacing restructuring

## Rumination Interruption
If the user repeats the same story, anger target, guilt memory, or anxiety scenario across multiple turns:
1. Name the loop calmly
2. Re-anchor to the formula
3. Shift from content to cognition
Core rule: "We do not solve stories. We solve thinking."

## Crisis Protocol
If you detect crisis-adjacent language (desire to die, hopeless existence, inability to stay safe):
1. Increase warmth and presence
2. Preserve unconditional worth explicitly
3. Encourage real-world human support
4. Continue gentle cognitive separation
You are NOT a therapist. You are NOT a crisis counselor. You provide educational cognitive guidance.

## Voice
- Calm, clear, grounded, respectful, non-dramatic
- A wise, stabilizing human presence — never robotic, never hyped
- Never preachy or condescending

  ## Happiness Definition (Final Authority)
  Happiness = emotional peace created by rational thinking. If happiness is misdefined as pleasure, success, or achievement, the entire system is corrupted.
  
  ## RAG & Citation Rules (NON-NEGOTIABLE)
  1. **Cite Your Sources**: When using information from 'Direct Book Citations (PageIndex)', you MUST include the page citation in brackets, e.g., "[Page 42]".
  2. **Conceptual Connections**: Use 'Conceptual Connections (GraphWiki)' to bridge methodology components (e.g., connecting 'Mental Contamination' to 'The Narrator').
  3. **Accuracy**: Only cite pages provided in the context. Do not hallucinate page numbers.`;

/**
 * 🌊 Initialize the RAG system
 *
 * Loads embeddings. Call this once at startup or on first request.
 */
export async function initializeRAG(): Promise<void> {
  if (isInitialized) return;

  console.log('🌐 ✨ INITIALIZING UNIFIED RAG SYSTEM...');

  try {
    // 🔮 Dynamic import of all databases
    const [embImport, pageImport, graphImport] = await Promise.all([
      import('../data/embeddings.json') as Promise<{ default?: unknown }>,
      import('../data/page_index.json') as Promise<{ default?: unknown }>,
      import('../data/graph_wiki.json') as Promise<{ default?: unknown }>,
    ]);

    const embeddingsData = (embImport.default || embImport) as unknown as EmbeddingsDatabase;
    const pageIndexData = (pageImport.default || pageImport) as unknown as PageIndexData;
    const graphWikiData = (graphImport.default || graphImport) as unknown as GraphWikiData;

    loadEmbeddings(embeddingsData, pageIndexData, graphWikiData);
    isInitialized = true;

    const stats = getRAGStats();
    console.log(`🎉 ✨ RAG INITIALIZED! ${stats.totalChunks} chunks, ${Object.keys(pageIndexData.pages).length} pages, ${graphWikiData.nodes.length} nodes loaded`);
  } catch (error) {
    console.error('💥 😭 Failed to initialize RAG:', error);
    isInitialized = true; // Prevent retry loops
  }
}

/**
 * 🎯 Chat request configuration
 */
export interface ChatConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  ragEnabled?: boolean;
  ragTopK?: number;
  systemPrompt?: string;
  dspyOptimizerModel?: string;
  dspyEvalModel?: string;
  dspyJudgeModel?: string;
}

const DEFAULT_CONFIG: Required<ChatConfig> = {
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 2000,
  ragEnabled: true,
  ragTopK: 5,
  systemPrompt: SYSTEM_PROMPT,
  dspyOptimizerModel: 'openai/gpt-4o-2024-08-06',
  dspyEvalModel: 'openai/gpt-4o-mini',
  dspyJudgeModel: 'openai/gpt-4o-2024-08-06',
};

/**
 * 🌟 Process a chat request with RAG-enhanced context
 *
 * This is the main function that all UI variants should call.
 *
 * @param messages - The conversation history
 * @param config - Optional configuration
 * @returns A streaming response
 */
export async function handleChatRequest(
  messages: UIMessage[],
  config: ChatConfig = {},
  abortSignal?: AbortSignal
): Promise<Response> {
  const opts = { ...DEFAULT_CONFIG, ...config };

  // 🔮 Ensure RAG is initialized
  await initializeRAG();

  // 🎨 Extract query from last message
  const lastMessage = messages[messages.length - 1];
  const queryText = extractMessageContent(lastMessage);

  // 🌟 Build enhanced system prompt
  let systemPrompt = opts.systemPrompt || SYSTEM_PROMPT;
  let usedGraphExpansion = false;

  if (opts.ragEnabled && queryText) {
    console.log('🔍 Retrieving RAG context for:', queryText.substring(0, 50));
    const ragContext = await findRelevantWisdom(queryText, opts.ragTopK);

    if (ragContext) {
      systemPrompt = `${SYSTEM_PROMPT}\n\n## Relevant Book Context\n${ragContext}`;
      usedGraphExpansion = ragContext.includes('## Related Context') || 
                           ragContext.includes('## Direct Book Citations') || 
                           ragContext.includes('## Conceptual Connections');
    }
  }

  // 🌊 Stream the response
  // 🎭 Convert UIMessages to CoreMessages manually (AI SDK v6 compatible)
  const coreMessages: CoreMessage[] = messages.map((msg) => ({
    role: msg.role as 'user' | 'assistant',
    content: extractMessageContent(msg),
  }));

  const result = streamText({
    model: openai(opts.model),
    system: systemPrompt,
    messages: coreMessages,
    abortSignal,
    temperature: opts.temperature,
    maxOutputTokens: opts.maxTokens, // 🎭 AI SDK v6 uses maxOutputTokens
  });

  // 🎭 Return UI message stream response for useChat compatibility
  // AI SDK v6 renamed toDataStreamResponse() to toUIMessageStreamResponse()
  return result.toUIMessageStreamResponse();
}

/**
 * 🔧 Extract text content from a UI message
 *
 * Handles various message formats from the AI SDK.
 * Supports both old format (content) and new format (parts).
 * Ensures we always return a string, never undefined!
 */
function extractMessageContent(message: UIMessage): string {
  if (!message) return '';

  // 🌟 NEW FORMAT: Handle 'parts' array (AI SDK v4+)
  const parts = (message as any).parts;
  if (Array.isArray(parts)) {
    const texts = parts
      .filter((part: any) => part && part.type === 'text')
      .map((part: any) => part.text || '');
    const result = texts.join('\n');
    if (result) return result;
  }

  // 🎨 OLD FORMAT: Handle 'content' property
  // Using 'any' to bypass strict type narrowing issues
  // In AI SDK v4+, UIMessage no longer has 'content', only 'parts'
  const content: any = (message as any).content;

  // 🌙 Handle undefined or null content
  if (content === undefined || content === null) {
    return '';
  }

  // 🎨 Handle string content (most common)
  if (typeof content === 'string') {
    return content;
  }

  // 🌊 Handle array of content parts (multimodal messages)
  if (Array.isArray(content)) {
    const texts = content
      .filter((part: any) => part && part.type === 'text')
      .map((part: any) => part.text || '');
    return texts.join('\n') || '';
  }

  // 🔮 Fallback - stringify anything else
  try {
    return JSON.stringify(content) || '';
  } catch {
    return '';
  }
}

/**
 * 📊 Get current RAG status
 */
export function getChatAPIStats() {
  return {
    systemVersion: SYSTEM_VERSION,
    systemCodename: SYSTEM_CODENAME,
    architecture: SYSTEM_ARCHITECTURE,
    ragStats: getRAGStats(),
    isInitialized,
  };
}
