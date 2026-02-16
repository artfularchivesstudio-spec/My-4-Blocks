# My 4 Blocks Enhancement Plan - k2

## Overview
Comprehensive plan to enhance My 4 Blocks with VectifyAI PageIndex integration, dual-response A/B testing, and model/configuration updates.

## Requirements Summary

1. **Disable Voice Speech** - Comment out voice functionality (don't remove code)
2. **Change Base Model** - Upgrade to more capable model (GPT-4o or GPT-4o-mini with higher quality)
3. **Integrate VectifyAI PageIndex** - Add PDF retrieval alongside semantic search
4. **Dual Response A/B Testing** - Generate two different responses per query
5. **Collect User Feedback** - Store input, responses, and user choice (max 100 examples)

## Implementation Strategy

### Phase 1: Foundation Updates (v0 variant first)

#### 1.1 Model Configuration Updates
- Update chat API configs in all variants
- Change from `gpt-4o-mini` to `gpt-4o` for better responses
- Adjust temperature settings for more nuanced responses

**Files to modify:**
- `/v0/app/api/chat/route.ts`
- `/claude/app/api/chat/route.ts`
- `/gemini/app/api/chat/route.ts`

#### 1.2 Disable Voice Functionality
- Comment out VoiceMode imports and usage
- Keep VoiceMode.tsx component intact (commented out)
- Disable voice toggle in UI

**Files to modify:**
- `/claude/components/ChatContainer.tsx`
- `/claude/app/chat/page.tsx`
- `/v0/app/page.tsx` (if voice exists)

### Phase 2: VectifyAI PageIndex Integration

#### 2.1 Setup PageIndex Library
- Install PageIndex from GitHub: `https://github.com/VectifyAI/PageIndex`
- Create wrapper module for PDF processing
- Generate page-level embeddings from book PDF

**New files:**
- `/shared/lib/pageIndex.ts` - PageIndex wrapper
- `/shared/lib/pdfProcessor.ts` - PDF text extraction
- `/scripts/generate-page-embeddings.ts` - Embedding generation script

#### 2.2 Dual Search System
- Keep existing semantic search (embeddings.json)
- Add PageIndex for PDF page-level retrieval
- Combine results from both systems
- Weight and rank combined results

**Files to modify:**
- `/shared/lib/vectorSearch.ts` - Add PageIndex integration
- `/shared/api/chat.ts` - Update RAG retrieval logic
- `/shared/lib/index.ts` - Export new functions

### Phase 3: Dual Response Generation

#### 3.1 Response Generation Engine
- Modify chat handler to generate TWO responses per query
- Use slightly different prompts/system messages for variation
- Stream both responses concurrently
- Present both responses to user

**Implementation approach:**
- Generate Response A: Standard approach
- Generate Response B: Alternative perspective/focus
- Display side-by-side or sequential with choice mechanism

**Files to modify:**
- `/shared/api/chat.ts` - Core dual-response logic
- `/claude/components/ChatMessage.tsx` - Display both responses
- Add response selection UI

#### 3.2 A/B Testing Framework
- Create lightweight storage system (dictionary/set)
- Store: query, responseA, responseB, userChoice, timestamp
- Max 100 entries (rotate oldest out)
- Simple JSON file storage in `/data/ab-testing.json`

**New files:**
- `/shared/lib/abTesting.ts` - Storage and tracking
- `/data/ab-testing.json` - User choice storage
- Add UI for response rating/selection

### Phase 4: UI Updates

#### 4.1 Response Display
- Show both responses with clear labeling (A/B)
- Add selection buttons ("Response A is better", "Response B is better")
- Visual differentiation between responses
- Show rationale or key differences

**Files to modify:**
- `/claude/components/ChatMessage.tsx`
- `/claude/components/ChatContainer.tsx`
- Add CSS for side-by-side or stacked display

#### 4.2 Analytics Dashboard (Optional)
- Simple view of A/B test results
- Show win rates for each response type
- Identify patterns in preferred responses

**New file:**
- `/claude/app/analytics/page.tsx`

### Phase 5: Deployment Preparation

#### 5.1 Testing Checklist
- Test dual response generation
- Verify PageIndex retrieval works
- Check A/B selection storage
- Validate all three variants (v0, claude, gemini)

#### 5.2 Build & Deploy
- Run build commands for all variants
- Deploy to Vercel production
- Monitor for issues

**Commands:**
```bash
cd /v0 && vercel --prod
cd /claude && vercel --prod
cd /gemini && vercel --prod
```

## Technical Details

### PageIndex Integration

PageIndex provides page-level retrieval from PDFs, which complements our existing chunk-based semantic search:

```typescript
// PageIndex retrieval will give us specific page context
const pageResults = await pageIndex.search(query, { topK: 3 });
// Combine with existing semantic search
const semanticResults = await findRelevantWisdom(query, 5);

// Merge and rerank results
const combined = mergeResults(pageResults, semanticResults);
```

### Dual Response Prompting

Two different system prompts will be used:

**Response A (Standard):**
```
You are a compassionate guide based on the Four Blocks framework...
Provide a direct, clear response focusing on the core issue.
```

**Response B (Alternative Perspective):**
```
You are a wise mentor using the Four Blocks framework...
Offer a different angle or deeper exploration of the underlying patterns.
```

### A/B Storage Structure

```typescript
{
  "entries": [
    {
      "id": "uuid",
      "query": "user's question",
      "responseA": "first response",
      "responseB": "second response",
      "winner": "A" | "B",
      "timestamp": "ISO date",
      "metadata": {
        "model": "gpt-4o",
        "blockType": "depression" | "anxiety" | "anger" | "guilt"
      }
    }
  ]
}
```

## File Structure Changes

```
/shared/
  /lib/
    pageIndex.ts          # NEW: PageIndex wrapper
    pdfProcessor.ts       # NEW: PDF processing
    abTesting.ts          # NEW: A/B testing storage
    vectorSearch.ts       # MODIFIED: Add PageIndex integration
  /data/
    page-embeddings.json   # NEW: Page-level embeddings
    ab-testing.json       # NEW: A/B test results

/scripts/
  generate-page-embeddings.ts  # NEW: Generate embeddings from PDF

/claude/
  /components/
    ChatMessage.tsx       # MODIFIED: Show dual responses
    ChatContainer.tsx     # MODIFIED: Add response selection
  /app/
    /api/
      chat/route.ts        # MODIFIED: Update model config

/v0/, /gemini/           # Similar updates for all variants
```

## Dependencies

### New Dependencies
- `@vectifyai/pageindex` - PDF retrieval (from GitHub)
- `pdf-parse` - PDF text extraction

### Installation
```bash
npm install @vectifyai/pageindex pdf-parse
# or
pnpm add @vectifyai/pageindex pdf-parse
```

## Testing Strategy

1. **Unit Tests:** Test PageIndex integration, A/B storage
2. **Integration Tests:** Test dual response generation
3. **Manual Testing:** Test all UI variants thoroughly
4. **Performance:** Monitor token usage with dual responses

## Success Metrics

- VectifyAI PageIndex successfully retrieves relevant pages
- Dual responses provide meaningful alternatives
- User selections are stored correctly
- All three variants deploy successfully
- Response quality is maintained or improved

## Rollback Plan

If issues arise:
1. Revert to single response generation
2. Disable PageIndex temporarily
3. Keep voice functionality commented out (easy to restore)

## Next Steps

1. Start with v0 variant implementation
2. Complete all Phase 1 tasks
3. Integrate PageIndex
4. Implement dual responses
5. Deploy to production
6. Monitor and collect user feedback

---

**Plan Version:** k2
**Date:** 2026-02-12
**Target:** Production deployment with all features
