# My 4 Blocks - A/B Testing & Enhanced RAG Implementation Plan

## Overview

Transform the My 4 Blocks chat application with:
1. Dual response A/B testing
2. PageIndex-enhanced retrieval (alongside existing semantic search)
3. Upgraded model (gpt-4o for deeper, more meaningful responses)
4. Response blueprint following the first responder example
5. Voice mode disabled (commented out, not removed)

---

## Phase 1: Disable Voice Mode (Temporary)

### File: `claude/shared/components/VoiceMode.tsx`
**Action**: Comment out the voice functionality while preserving the code

```tsx
// 🌙 Voice Mode temporarily disabled for A/B testing focus
// Uncomment when ready to re-enable voice features
```

### File: `claude/app/chat/page.tsx` (or wherever VoiceMode is rendered)
**Action**: Comment out VoiceMode component import and usage

---

## Phase 2: Upgrade Base Model

### File: `claude/app/api/chat/route.ts`
**Change**:
```typescript
const config: ChatConfig = {
  model: 'gpt-4o',  // 🌟 Upgraded from gpt-4o-mini for deeper responses
  temperature: 0.7,
  ragEnabled: true,
  ragTopK: 5,
};
```

### File: `claude/shared/api/chat.ts`
**Change default config**:
```typescript
const DEFAULT_CONFIG: Required<ChatConfig> = {
  model: 'gpt-4o',  // 🌟 Better reasoning for emotional guidance
  temperature: 0.7,
  maxTokens: 3000,  // 🎯 Increased for detailed responses
  ragEnabled: true,
  ragTopK: 5,
};
```

---

## Phase 3: Add PageIndex Retrieval

### 3.1 Install PageIndex
```bash
cd /Users/admin/Developer/My-4-Blocks/claude
npm install pageindex  # Or clone from https://github.com/VectifyAI/PageIndex
```

### 3.2 Create PageIndex Service
**New File**: `claude/shared/lib/pageIndexSearch.ts`

```typescript
/**
 * 🔮 The PageIndex Oracle - Structural PDF Retrieval ✨
 *
 * "Where pages reveal their hidden wisdom,
 * structured context meets semantic understanding."
 *
 * Uses VectifyAI/PageIndex for page-level retrieval
 * alongside our existing chunk-based semantic search.
 */

import { PageIndex } from 'pageindex';  // Or local import

// 🌟 Cached PageIndex instance
let pageIndexInstance: PageIndex | null = null;

export interface PageResult {
  pageNumber: number;
  content: string;
  relevanceScore: number;
  chapter?: string;
}

/**
 * 🎭 Initialize PageIndex with the Four Blocks PDF
 */
export async function initializePageIndex(): Promise<void> {
  if (pageIndexInstance) return;

  console.log('🔮 ✨ INITIALIZING PAGEINDEX...');

  pageIndexInstance = new PageIndex();
  await pageIndexInstance.loadPDF('/path/to/you-only-have-four-problems-book-text.pdf');

  console.log('💎 PageIndex initialized successfully');
}

/**
 * 🌊 Search for relevant pages
 */
export async function searchPages(
  query: string,
  topK: number = 3
): Promise<PageResult[]> {
  if (!pageIndexInstance) {
    await initializePageIndex();
  }

  const results = await pageIndexInstance.search(query, topK);
  return results.map(r => ({
    pageNumber: r.page,
    content: r.text,
    relevanceScore: r.score,
    chapter: extractChapterFromPage(r.page),
  }));
}

/**
 * 🎨 Format page results for context
 */
export function formatPageContext(pages: PageResult[]): string {
  return pages.map((p, i) =>
    `[Page ${p.pageNumber}${p.chapter ? ` - ${p.chapter}` : ''}]:\n${p.content}`
  ).join('\n\n---\n\n');
}
```

### 3.3 Create Unified Multi-Source Retrieval
**New File**: `claude/shared/lib/unifiedRetrieval.ts`

```typescript
/**
 * 🌐 The Unified Retrieval System - Multiple Perspectives ✨
 *
 * Combines semantic search + PageIndex for comprehensive context.
 * Two sources = richer understanding.
 */

import { findRelevantWisdom } from './rag';
import { searchPages, formatPageContext } from './pageIndexSearch';

export interface UnifiedContext {
  semanticContext: string;
  pageContext: string;
  combined: string;
}

/**
 * 🌟 Get context from both retrieval systems
 */
export async function getUnifiedContext(
  query: string,
  options: { semanticTopK?: number; pageTopK?: number } = {}
): Promise<UnifiedContext> {
  const { semanticTopK = 5, pageTopK = 3 } = options;

  console.log('🌐 ✨ UNIFIED RETRIEVAL AWAKENS!');

  // 🔮 Run both retrievals in parallel
  const [semanticContext, pageResults] = await Promise.all([
    findRelevantWisdom(query, semanticTopK),
    searchPages(query, pageTopK),
  ]);

  const pageContext = formatPageContext(pageResults);

  // 🎨 Combine contexts with clear sections
  const combined = `## Semantic Search Results (Chunk-Level)
${semanticContext}

## Page-Level Context (Full Page Excerpts)
${pageContext}`;

  return { semanticContext, pageContext, combined };
}
```

---

## Phase 4: A/B Testing System

### 4.1 Create A/B Response Storage
**New File**: `claude/shared/lib/abTesting.ts`

```typescript
/**
 * 🧪 The A/B Testing Laboratory - Response Comparison ✨
 *
 * "Two paths diverged in a prompt,
 * and the user chose the better road."
 *
 * Stores comparison data for improving responses.
 */

export interface ABTestEntry {
  id: string;
  timestamp: Date;
  userQuery: string;
  responseA: string;
  responseB: string;
  userChoice: 'A' | 'B' | null;
  metadata?: {
    emotionDetected?: string;
    blockType?: string;
    modelA?: string;
    modelB?: string;
  };
}

// 🌟 In-memory storage (max 100 entries, FIFO)
const MAX_ENTRIES = 100;
let abTestData: ABTestEntry[] = [];

/**
 * 🎭 Store a new A/B test entry
 */
export function storeABTest(entry: Omit<ABTestEntry, 'id' | 'timestamp'>): string {
  const id = `ab_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const fullEntry: ABTestEntry = {
    ...entry,
    id,
    timestamp: new Date(),
    userChoice: null,
  };

  // 🌊 FIFO: Remove oldest if at capacity
  if (abTestData.length >= MAX_ENTRIES) {
    abTestData.shift();
    console.log('🌙 ⚠️ A/B storage at capacity, removed oldest entry');
  }

  abTestData.push(fullEntry);
  console.log(`🧪 ✨ A/B test stored: ${id}`);

  return id;
}

/**
 * 🎯 Record user's choice
 */
export function recordChoice(id: string, choice: 'A' | 'B'): boolean {
  const entry = abTestData.find(e => e.id === id);
  if (!entry) return false;

  entry.userChoice = choice;
  console.log(`🎉 User chose response ${choice} for ${id}`);

  return true;
}

/**
 * 📊 Get A/B test statistics
 */
export function getABStats(): {
  total: number;
  withChoice: number;
  aWins: number;
  bWins: number;
} {
  const withChoice = abTestData.filter(e => e.userChoice !== null);
  return {
    total: abTestData.length,
    withChoice: withChoice.length,
    aWins: withChoice.filter(e => e.userChoice === 'A').length,
    bWins: withChoice.filter(e => e.userChoice === 'B').length,
  };
}

/**
 * 💾 Export all A/B data (for analysis)
 */
export function exportABData(): ABTestEntry[] {
  return [...abTestData];
}
```

### 4.2 Create Dual Response Generator
**New File**: `claude/shared/lib/dualResponseGenerator.ts`

```typescript
/**
 * 🎭 The Dual Response Theater - A/B Response Generation ✨
 *
 * Generates two distinct responses using different approaches:
 * - Response A: Direct, structured (following the blueprint)
 * - Response B: Warm, conversational (alternative style)
 */

import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { getUnifiedContext } from './unifiedRetrieval';
import { storeABTest } from './abTesting';
import { RESPONSE_BLUEPRINT_A, RESPONSE_BLUEPRINT_B } from './responseBlueprints';

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
 */
export async function generateDualResponses(
  query: string,
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<DualResponse> {
  console.log('🎭 ✨ DUAL RESPONSE GENERATION BEGINS!');

  // 🔮 Get unified context from both retrieval systems
  const context = await getUnifiedContext(query);

  // 🎯 Detect emotion/block type from query
  const { emotionDetected, blockType } = detectEmotionalContext(query);

  // 🌊 Generate both responses in parallel
  const [responseA, responseB] = await Promise.all([
    generateResponse(query, context.combined, RESPONSE_BLUEPRINT_A, conversationHistory),
    generateResponse(query, context.combined, RESPONSE_BLUEPRINT_B, conversationHistory),
  ]);

  // 💾 Store for A/B analysis
  const abTestId = storeABTest({
    userQuery: query,
    responseA,
    responseB,
    metadata: { emotionDetected, blockType },
  });

  return {
    abTestId,
    responseA,
    responseB,
    context: { query, emotionDetected, blockType },
  };
}

async function generateResponse(
  query: string,
  context: string,
  blueprintPrompt: string,
  history: Array<{ role: string; content: string }>
): Promise<string> {
  const result = await generateText({
    model: openai('gpt-4o'),
    system: blueprintPrompt + '\n\n## Retrieved Context\n' + context,
    messages: [
      ...history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user', content: query },
    ],
    temperature: 0.7,
    maxTokens: 2000,
  });

  return result.text;
}

function detectEmotionalContext(query: string): { emotionDetected?: string; blockType?: string } {
  const lower = query.toLowerCase();

  if (lower.includes('angry') || lower.includes('furious') || lower.includes('unfair')) {
    return { emotionDetected: 'anger', blockType: 'Anger' };
  }
  if (lower.includes('anxious') || lower.includes('worried') || lower.includes('scared')) {
    return { emotionDetected: 'anxiety', blockType: 'Anxiety' };
  }
  if (lower.includes('depress') || lower.includes('hopeless') || lower.includes('worthless')) {
    return { emotionDetected: 'depression', blockType: 'Depression' };
  }
  if (lower.includes('guilt') || lower.includes('ashamed') || lower.includes('should have')) {
    return { emotionDetected: 'guilt', blockType: 'Guilt' };
  }

  return {};
}
```

---

## Phase 5: Response Blueprint System

### 5.1 Create Blueprint Prompts
**New File**: `claude/shared/lib/responseBlueprints.ts`

```typescript
/**
 * 🎭 Response Blueprints - The Template Theater ✨
 *
 * Based on the first responder example:
 * - Structured, step-by-step approach
 * - Formula explanation
 * - Mapping to user's situation
 * - Intervention technique
 * - Closing question for engagement
 */

export const RESPONSE_BLUEPRINT_A = `You are a compassionate guide based on "You Only Have Four Problems" by Dr. Vincent E. Parr.

## Response Structure (ALWAYS FOLLOW THIS ORDER):

### Step 1: Safety + Validation (2-4 sentences)
- Acknowledge the experience without minimizing
- Normalize the response
- Avoid "you should" language
- Example: "What you're experiencing is not small. Feeling this way makes complete sense."

### Step 2: Identify the Block & Formula
- Name which of the Four Blocks they're experiencing
- State the core formula:
  - Anger = Demand + "Should not be" + Resistance to reality
  - Anxiety = Catastrophizing + Uncertainty intolerance + Future focus
  - Depression = Hopeless + Helpless + Need (demanding reality be different)
  - Guilt = "I should have" + Moral self-condemnation + Past focus

### Step 3: Map to Their Situation (Use Their Words!)
- Give 1-2 examples per formula component
- Use THEIR specific language and details
- Present as "your mind may be saying things like..."

### Step 4: The Key Shift (Intervention)
- Identify the rigid "MUST" or "SHOULD"
- Convert to preference/wish format
- Example: From "This must not happen" → "I deeply wish this didn't happen, but in reality..."
- Clarify: "This is NOT saying it's okay. It's releasing the crushing demand."

### Step 5: Acknowledge Their Strengths
- Connect their pain to their values
- "People who don't care don't feel this way"
- "Your reaction shows [compassion/responsibility/etc.]"

### Step 6: Close with ONE Targeted Question
- Ask which component feels strongest
- "Which part hits hardest right now: [A], [B], or [C]?"
- This creates engagement and guides next response

## Tone Rules:
- Warm but not saccharine
- Direct but not cold
- Skip therapy-speak filler ("I hear you", "That must be hard")
- Be a wise friend, not a distant therapist`;

export const RESPONSE_BLUEPRINT_B = `You are a compassionate guide based on "You Only Have Four Problems" by Dr. Vincent E. Parr.

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

### Tone Rules:
- Warm, human, real
- Share your reasoning ("The reason I ask is...")
- Allow for uncertainty ("This might not fit, but...")
- Meet them emotionally before intellectualizing`;

/**
 * 🎯 RAG Chunking Labels for Blueprint Responses
 */
export const RAG_CHUNK_LABELS = {
  VALIDATION: 'VALIDATION_TRAUMA',
  FORMULA: 'FORMULA_CORE',
  MAPPING: 'MAPPING_EXAMPLES',
  INTERVENTION: 'INTERVENTION_SHIFT',
  REFRAME: 'REFRAME_COMPASSION',
  NEXT_QUESTION: 'NEXT_QUESTION_TRIAGE',
};
```

---

## Phase 6: Update Chat API for A/B Testing

### File: `claude/shared/api/chat.ts`
**Add A/B testing mode**:

```typescript
/**
 * 🧪 Handle A/B test chat request
 *
 * Returns both responses for user comparison.
 */
export async function handleABTestChatRequest(
  messages: UIMessage[],
  config: ChatConfig = {}
): Promise<Response> {
  const lastMessage = messages[messages.length - 1];
  const queryText = extractMessageContent(lastMessage);

  // Convert previous messages to history format
  const history = messages.slice(0, -1).map(m => ({
    role: m.role,
    content: extractMessageContent(m),
  }));

  const dualResponse = await generateDualResponses(queryText, history);

  return new Response(JSON.stringify({
    abTestId: dualResponse.abTestId,
    responses: {
      A: dualResponse.responseA,
      B: dualResponse.responseB,
    },
    context: dualResponse.context,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

### New API Route: `claude/app/api/chat/ab/route.ts`

```typescript
/**
 * 🧪 A/B Testing Chat Endpoint ✨
 */
import { handleABTestChatRequest } from '@shared/api/chat';

export const runtime = 'nodejs';
export const maxDuration = 120;  // Longer for dual generation

export async function POST(req: Request) {
  const { messages } = await req.json();
  return handleABTestChatRequest(messages);
}
```

### New API Route: `claude/app/api/ab-choice/route.ts`

```typescript
/**
 * 🎯 Record A/B Test Choice ✨
 */
import { recordChoice, getABStats } from '@shared/lib/abTesting';

export async function POST(req: Request) {
  const { abTestId, choice } = await req.json();
  const success = recordChoice(abTestId, choice);
  return Response.json({ success, stats: getABStats() });
}

export async function GET() {
  return Response.json(getABStats());
}
```

---

## Phase 7: Frontend A/B Comparison UI

### New Component: `claude/components/ABResponseComparison.tsx`

```tsx
/**
 * 🧪 A/B Response Comparison UI ✨
 */
'use client';

import { useState } from 'react';

interface ABResponseProps {
  abTestId: string;
  responseA: string;
  responseB: string;
  onChoice: (choice: 'A' | 'B') => void;
}

export function ABResponseComparison({
  abTestId,
  responseA,
  responseB,
  onChoice,
}: ABResponseProps) {
  const [selected, setSelected] = useState<'A' | 'B' | null>(null);

  const handleSelect = async (choice: 'A' | 'B') => {
    setSelected(choice);

    // Record choice to API
    await fetch('/api/ab-choice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ abTestId, choice }),
    });

    onChoice(choice);
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <ResponseCard
        label="Response A"
        content={responseA}
        isSelected={selected === 'A'}
        onSelect={() => handleSelect('A')}
        disabled={selected !== null}
      />
      <ResponseCard
        label="Response B"
        content={responseB}
        isSelected={selected === 'B'}
        onSelect={() => handleSelect('B')}
        disabled={selected !== null}
      />
    </div>
  );
}

function ResponseCard({
  label,
  content,
  isSelected,
  onSelect,
  disabled,
}: {
  label: string;
  content: string;
  isSelected: boolean;
  onSelect: () => void;
  disabled: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-purple-500 bg-purple-50'
          : disabled
          ? 'border-gray-200 opacity-50'
          : 'border-gray-200 hover:border-purple-300 cursor-pointer'
      }`}
      onClick={disabled ? undefined : onSelect}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-sm text-gray-600">{label}</span>
        {!disabled && (
          <button className="text-xs px-3 py-1 bg-purple-500 text-white rounded-full">
            Choose This
          </button>
        )}
      </div>
      <div className="prose prose-sm max-w-none">
        {content}
      </div>
    </div>
  );
}
```

---

## Implementation Order

1. **Phase 1**: Disable voice (5 min) - Comment out VoiceMode
2. **Phase 2**: Upgrade model (5 min) - Change to gpt-4o
3. **Phase 5**: Response blueprints (15 min) - Create blueprint prompts
4. **Phase 4**: A/B testing storage (20 min) - Create storage system
5. **Phase 3**: PageIndex integration (45 min) - Add second retrieval source
6. **Phase 6**: Update API (30 min) - Add A/B endpoints
7. **Phase 7**: Frontend UI (30 min) - Build comparison component

---

## Files to Create/Modify

### New Files:
- `claude/shared/lib/pageIndexSearch.ts`
- `claude/shared/lib/unifiedRetrieval.ts`
- `claude/shared/lib/abTesting.ts`
- `claude/shared/lib/dualResponseGenerator.ts`
- `claude/shared/lib/responseBlueprints.ts`
- `claude/app/api/chat/ab/route.ts`
- `claude/app/api/ab-choice/route.ts`
- `claude/components/ABResponseComparison.tsx`

### Modified Files:
- `claude/app/api/chat/route.ts` (model upgrade)
- `claude/shared/api/chat.ts` (model upgrade + A/B handler)
- `claude/shared/components/VoiceMode.tsx` (comment out)
- `claude/app/chat/page.tsx` (comment out voice, add A/B UI)

---

## Testing Checklist

- [ ] Voice mode is disabled (page loads without voice UI)
- [ ] Chat uses gpt-4o model
- [ ] A/B endpoint returns two distinct responses
- [ ] Responses follow the blueprint structure
- [ ] User can select preferred response
- [ ] Choice is recorded in storage
- [ ] Stats endpoint returns correct counts
- [ ] PageIndex retrieval works alongside semantic search
- [ ] Storage correctly limits to 100 entries (FIFO)
