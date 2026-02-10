/**
 * 🎭 The RAG Orchestrator - Unified Retrieval System ✨
 *
 * "Where all the cosmic forces unite,
 * bringing wisdom to those who seek."
 *
 * This is the main entry point for the RAG system.
 * Coordinates embedding generation, hybrid search,
 * and graph expansion into a seamless experience.
 *
 * - The Supreme RAG Conductor
 */

import type { EmbeddedChunk, ScoredChunk, HybridSearchOptions, RetrievalResult, EmbeddingsDatabase } from "./types";
import { getQueryEmbedding } from "./embeddings";
import { hybridSearch, hybridSearchKeywordOnly } from "./hybridSearch";
import { expandWithRelated, formatExpandedContext } from "./graphExpansion";
import { formatContextForPrompt } from "./vectorSearch";

// 🔮 Cached embeddings database
let embeddingsCache: EmbeddingsDatabase | null = null;

/**
 * 🌟 Load the embeddings database
 *
 * Loads the pre-computed embeddings JSON file into memory.
 * This should be called once at application startup.
 *
 * @param embeddingsData - The parsed JSON from embeddings.json
 */
export function loadEmbeddings(embeddingsData: EmbeddingsDatabase): void {
  console.log(`🌐 ✨ EMBEDDINGS DATABASE LOADING!`);
  console.log(`📊 ${embeddingsData.total_chunks} chunks, ${embeddingsData.model} model`);

  embeddingsCache = embeddingsData;

  console.log(`💎 Embeddings loaded and cached`);
}

/**
 * 🔮 Get the loaded embeddings database
 *
 * Returns the cached embeddings or throws if not loaded.
 */
export function getEmbeddings(): EmbeddingsDatabase {
  if (!embeddingsCache) {
    throw new Error("🌩️ Embeddings not loaded! Call loadEmbeddings() first.");
  }
  return embeddingsCache;
}

/**
 * 🌊 Perform full RAG retrieval with optional graph expansion
 *
 * This is the main function to call for RAG retrieval.
 * It handles:
 * 1. Query embedding generation
 * 2. Hybrid search (semantic + keyword)
 * 3. Optional graph expansion via cross-links
 * 4. Formatted context for LLM
 *
 * @param query - The user's question or search query
 * @param options - Search configuration options
 * @returns Full retrieval result with context
 */
export async function retrieve(
  query: string,
  options: HybridSearchOptions = {}
): Promise<RetrievalResult> {
  console.log(`🎭 ✨ RAG RETRIEVAL AWAKENS!`);
  const startTime = Date.now();

  const embeddings = getEmbeddings();
  const allChunks = embeddings.chunks;

  // 🔮 Step 1: Generate query embedding
  const queryEmbedding = await getQueryEmbedding(query);

  // 🌊 Step 2: Hybrid search
  const searchResults = hybridSearch(query, queryEmbedding, allChunks, options);

  // 🕸️ Step 3: Optional graph expansion
  let expandedChunks: EmbeddedChunk[] = [];
  if (options.expandRelated !== false) {
    expandedChunks = expandWithRelated(
      searchResults,
      allChunks,
      options.maxExpansion || 2
    );
  }

  const searchTime = Date.now() - startTime;

  console.log(`🎉 ✨ RAG RETRIEVAL COMPLETE in ${searchTime}ms`);
  console.log(`📊 ${searchResults.length} main + ${expandedChunks.length} expanded`);

  return {
    chunks: searchResults,
    expandedChunks,
    queryEmbedding,
    totalMatches: searchResults.length + expandedChunks.length,
    searchTime,
  };
}

/**
 * 🌟 Quick retrieval without embedding generation
 *
 * Falls back to keyword-only search when the embedding API
 * is unavailable or for faster response times.
 */
export function retrieveKeywordOnly(
  query: string,
  topK: number = 5
): ScoredChunk[] {
  const embeddings = getEmbeddings();
  return hybridSearchKeywordOnly(query, embeddings.chunks, topK);
}

/**
 * 🎨 Get formatted context for LLM prompt
 *
 * Convenience function that retrieves and formats context
 * in a single call. Returns a string ready for the system prompt.
 */
export async function getRAGContext(
  query: string,
  options: HybridSearchOptions & { includeExpanded?: boolean } = {}
): Promise<string> {
  const result = await retrieve(query, options);

  if (options.includeExpanded !== false && result.expandedChunks?.length) {
    return formatExpandedContext(result.chunks, result.expandedChunks);
  }

  return formatContextForPrompt(result.chunks, true);
}

/**
 * 🔍 Search for relevant wisdom (simplified API)
 *
 * The simplest way to use the RAG system.
 * Returns just the formatted context string.
 *
 * @param query - The user's question
 * @param limit - Maximum number of results (default: 5)
 * @returns Formatted context string for LLM
 */
export async function findRelevantWisdom(
  query: string,
  limit: number = 5
): Promise<string> {
  try {
    return await getRAGContext(query, { topK: limit });
  } catch (error) {
    console.error(`💥 😭 RAG retrieval failed, falling back to keywords:`, error);

    // 🌙 Fallback to keyword-only search
    const keywordResults = retrieveKeywordOnly(query, limit);
    return formatContextForPrompt(keywordResults, true);
  }
}

/**
 * 📊 Get RAG system statistics
 *
 * Returns information about the loaded knowledge base.
 */
export function getRAGStats(): {
  totalChunks: number;
  model: string;
  chapters: Array<{ code: string; name: string; count: number }>;
  isLoaded: boolean;
} {
  if (!embeddingsCache) {
    return {
      totalChunks: 0,
      model: "not loaded",
      chapters: [],
      isLoaded: false,
    };
  }

  return {
    totalChunks: embeddingsCache.total_chunks,
    model: embeddingsCache.model,
    chapters: embeddingsCache.chapters,
    isLoaded: true,
  };
}
