# 🔮 My-4-Blocks Shared RAG Library ✨

> "Where wisdom becomes mathematical essence, flowing through dimensional space with purpose."

This shared library provides unified RAG (Retrieval-Augmented Generation) capabilities for all My-4-Blocks project variants (gemini, claude, v0, codex).

## 📦 Structure

```
shared/
├── lib/
│   ├── index.ts           # Main exports
│   ├── rag.ts             # High-level RAG orchestrator
│   ├── types.ts           # TypeScript interfaces
│   ├── embeddings.ts      # Query embedding generation
│   ├── vectorSearch.ts    # Semantic cosine similarity search
│   ├── keywordSearch.ts   # Term-frequency keyword search
│   ├── hybridSearch.ts    # Combined keyword + semantic search
│   └── graphExpansion.ts  # Cross-link expansion
├── data/
│   └── embeddings.json    # Pre-computed embeddings (generate with script)
└── package.json
```

## 🚀 Quick Start

### 1. Generate Embeddings

First, generate the embeddings from the training data:

```bash
# From project root
cd scripts
python generate_embeddings.py
```

This creates `shared/data/embeddings.json` with all chunks and their vector embeddings.

### 2. Use in Your Project

```typescript
// Import the high-level API
import { findRelevantWisdom, loadEmbeddings } from '../shared/lib';

// Load embeddings (do this once at startup)
import embeddingsData from '../shared/data/embeddings.json';
loadEmbeddings(embeddingsData);

// Find relevant wisdom for a query
const context = await findRelevantWisdom("Why do I feel angry?", 5);
console.log(context);
```

## 🌟 API Reference

### High-Level API (rag.ts)

```typescript
// Load embeddings database
loadEmbeddings(embeddingsData: EmbeddingsDatabase): void

// Full RAG retrieval with hybrid search + graph expansion
retrieve(query: string, options?: HybridSearchOptions): Promise<RetrievalResult>

// Get formatted context for LLM prompt
findRelevantWisdom(query: string, limit?: number): Promise<string>

// Quick keyword-only search (no embeddings required)
retrieveKeywordOnly(query: string, topK?: number): ScoredChunk[]

// Check RAG system status
getRAGStats(): { totalChunks, model, chapters, isLoaded }
```

### Search Options

```typescript
interface HybridSearchOptions {
  topK?: number;           // Max results (default: 5)
  keywordWeight?: number;  // Weight for keyword search (default: 0.3)
  semanticWeight?: number; // Weight for semantic search (default: 0.7)
  filterBlockType?: string;  // Filter by emotional block
  expandRelated?: boolean;   // Use cross-link expansion (default: true)
  maxExpansion?: number;     // Max expanded chunks per result (default: 2)
}
```

### Low-Level APIs

```typescript
// Vector search
searchEmbeddings(queryEmbedding, allChunks, topK): ScoredChunk[]
cosineSimilarity(vecA, vecB): number

// Keyword search
keywordSearch(query, allChunks, topK): ScoredChunk[]
detectBlockFromQuery(query): string | undefined

// Hybrid search
hybridSearch(query, queryEmbedding, allChunks, options): ScoredChunk[]

// Graph expansion
expandWithRelated(retrievedChunks, allChunks, maxExpansion): EmbeddedChunk[]
formatExpandedContext(mainChunks, relatedChunks): string
```

## 📊 Data Schema

### EmbeddedChunk

```typescript
interface EmbeddedChunk {
  id: string;                    // Unique chunk ID (e.g., "ANG_S1_C01")
  text: string;                  // The chunk content
  embedding: number[];           // 1536-dim vector (text-embedding-3-small)
  block_type: string;            // Anger | Anxiety | Depression | Guilt | ...
  metadata: {
    chapter: string;             // Chapter code (ANG, ANX, DEP, etc.)
    section: string;             // Section ID
    title: string;               // Human-readable title
    tags: string[];              // Topic tags
    keywords: string[];          // Search keywords
    related: string[];           // Cross-linked chunk IDs
    audience: string;            // "general" or "first_responder"
    category: string;            // Category name
  }
}
```

## 🎯 Search Strategy

The hybrid search combines:

1. **Semantic Search (70%)**: Uses cosine similarity between query and chunk embeddings
2. **Keyword Search (30%)**: Uses term-frequency scoring against content, title, keywords, and tags
3. **Block Detection**: Automatically boosts results matching detected emotional block
4. **Graph Expansion**: Pulls in related chunks via the `related` field

## 🔧 Integration Examples

### Gemini Project

```typescript
// gemini/src/lib/ragEnhanced.ts
import { findRelevantWisdom } from '../../../shared/lib';

export { findRelevantWisdom };
```

### Claude Project

```typescript
// claude/lib/ragEnhanced.ts
import { findRelevantWisdom } from '../../shared/lib';

export { findRelevantWisdom };
```

### In Chat Routes

```typescript
// In your chat route
const lastMessage = messages[messages.length - 1];
const queryText = lastMessage.content;

// Get RAG context
const ragContext = await findRelevantWisdom(queryText, 5);

// Inject into system prompt
const enhancedPrompt = `${SYSTEM_PROMPT}\n\n## Relevant Context\n${ragContext}`;
```

## 🌙 Fallback Behavior

- If embeddings aren't loaded → Falls back to keyword-only search
- If semantic search fails → Falls back to keyword-only search
- If no results found → Returns general context from first few chunks

## 📈 Performance

- **Embeddings**: 86 chunks, ~50KB with embeddings
- **Search Time**: <100ms for hybrid search
- **Query Embedding**: ~200ms (OpenAI API call)
- **Memory**: ~10MB for loaded embeddings

## 🔮 Environment Variables

```bash
OPENAI_API_KEY=your-api-key  # Required for query embedding generation
```

---

✨ Built with cosmic love for the My-4-Blocks emotional wellness platform ✨
