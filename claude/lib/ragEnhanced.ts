/**
 * 🔮 The Enhanced RAG Portal - Claude Edition ✨
 *
 * "Bridging the shared wisdom library with the claude realm."
 *
 * This module wraps the shared RAG library and provides
 * a simple interface for the chat route to use.
 *
 * - The Claude RAG Integration Virtuoso
 */

// 🌟 Import from shared library (using relative path)
import {
  loadEmbeddings,
  findRelevantWisdom as sharedFindRelevantWisdom,
  getRAGStats,
  retrieveKeywordOnly,
  formatContextForPrompt,
  type EmbeddingsDatabase,
} from "../shared/lib";

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

  console.log("🌐 ✨ INITIALIZING ENHANCED RAG SYSTEM (Claude)...");

  try {
    // 🔮 Dynamic import of embeddings data
    let embeddingsData: EmbeddingsDatabase;

    try {
      const data = await import("../shared/data/embeddings.json");
      embeddingsData = data.default || data;
      console.log("💎 Loaded embeddings from shared/data");
    } catch {
      // 🌙 Fallback to local embeddings for backwards compatibility
      console.log("🌙 Shared embeddings not found, checking local...");

      try {
        const localData = await import("../data/embeddings.json");
        embeddingsData = localData.default || localData;
        console.log("💎 Loaded embeddings from local data");
      } catch {
        console.log("🌙 No embeddings found, RAG will use keyword-only search");
        embeddingsLoaded = true;
        return;
      }
    }

    loadEmbeddings(embeddingsData);
    embeddingsLoaded = true;

    const stats = getRAGStats();
    console.log(`🎉 ✨ RAG INITIALIZED! ${stats.totalChunks} chunks loaded`);
  } catch (error) {
    console.error("💥 😭 Failed to initialize RAG:", error);
    embeddingsLoaded = true; // Prevent retry loops
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

  // 🌙 If no embeddings loaded, return empty context
  if (!stats.isLoaded) {
    console.log("🌙 No embeddings loaded, skipping RAG context");
    return "";
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
