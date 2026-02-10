/**
 * 🔮 The Enhanced RAG Portal - Gemini Edition ✨
 *
 * "Bridging the shared wisdom library with the gemini realm."
 *
 * This module wraps the shared RAG library and provides
 * a simple interface for the chat route to use.
 *
 * - The Gemini RAG Integration Virtuoso
 */

// 🌟 Import from shared library (using relative path)
import {
  loadEmbeddings,
  findRelevantWisdom as sharedFindRelevantWisdom,
  getRAGStats,
  retrieveKeywordOnly,
  formatContextForPrompt,
  type EmbeddingsDatabase,
} from "../../../shared/lib";

// 🔮 Track if embeddings are loaded
let embeddingsLoaded = false;

/**
 * 🌊 Initialize the RAG system with embeddings
 *
 * This should be called once at startup or on first request.
 * Handles lazy loading of the embeddings database.
 */
export async function initializeRAG(): Promise<void> {
  if (embeddingsLoaded) return;

  console.log("🌐 ✨ INITIALIZING ENHANCED RAG SYSTEM...");

  try {
    // 🔮 Dynamic import of embeddings data
    // First try to load from shared/data (preferred)
    let embeddingsData: EmbeddingsDatabase;

    try {
      // 🎭 Dynamic import with type assertion to bypass strict JSON typing
      // The actual data structure is validated at runtime by loadEmbeddings
      const data = await import("../../../shared/data/embeddings.json") as { default?: unknown };
      embeddingsData = (data.default || data) as unknown as EmbeddingsDatabase;
      console.log("💎 Loaded embeddings from shared/data");
    } catch {
      // 🌙 Fallback to local knowledge base for backwards compatibility
      console.log("🌙 Shared embeddings not found, using local knowledge base");
      const knowledgeBase = await import("../data/knowledge-base.json");

      // 🎨 Convert legacy format to new format
      const chunks = (knowledgeBase.default?.chunks || knowledgeBase.chunks || []).map(
        (chunk: any, idx: number) => ({
          id: chunk.id || `chunk_${idx}`,
          text: chunk.content || chunk.text || "",
          embedding: chunk.embedding || [],
          block_type: "General" as const,
          metadata: {
            chapter: "",
            section: "",
            title: chunk.id || `Chunk ${idx}`,
            tags: [],
            keywords: [],
            related: [],
            audience: "general" as const,
            category: "",
          },
        })
      );

      embeddingsData = {
        version: "1.0-legacy",
        model: "none",
        dimensions: 0,
        total_chunks: chunks.length,
        chapters: [],
        chunks,
        metadata: {
          source: "Legacy Knowledge Base",
          description: "Converted from gemini knowledge-base.json",
          blocks: [],
          additional_topics: [],
        },
      };
    }

    loadEmbeddings(embeddingsData);
    embeddingsLoaded = true;

    const stats = getRAGStats();
    console.log(`🎉 ✨ RAG INITIALIZED! ${stats.totalChunks} chunks loaded`);
  } catch (error) {
    console.error("💥 😭 Failed to initialize RAG:", error);
    throw error;
  }
}

/**
 * 🌟 Find relevant wisdom for a query
 *
 * Hybrid search (semantic + keyword) with graph expansion.
 * Falls back to keyword-only if semantic search fails.
 *
 * @param query - The user's question or message
 * @param limit - Maximum number of results (default: 5)
 * @returns Formatted context string for LLM
 */
export async function findRelevantWisdom(
  query: string,
  limit: number = 5
): Promise<string> {
  // 🔮 Ensure RAG is initialized
  await initializeRAG();

  const stats = getRAGStats();

  // 🌙 If no embeddings or legacy mode, use keyword search
  if (!stats.isLoaded || stats.model === "none") {
    console.log("🔑 Using keyword-only search (no embeddings)");
    const keywordResults = retrieveKeywordOnly(query, limit);
    return formatContextForPrompt(keywordResults, true);
  }

  // 🌟 Use full hybrid search
  try {
    return await sharedFindRelevantWisdom(query, limit);
  } catch (error) {
    console.error("💥 Hybrid search failed, falling back to keywords:", error);
    const keywordResults = retrieveKeywordOnly(query, limit);
    return formatContextForPrompt(keywordResults, true);
  }
}

/**
 * 📊 Get RAG system status
 */
export { getRAGStats };

/**
 * 🔄 Re-export types for convenience
 */
export type { EmbeddingsDatabase };
