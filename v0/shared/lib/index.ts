/**
 * 🔮 The Shared RAG Library - Unified Exports ✨
 *
 * "One library to rule them all,
 * bringing wisdom to every corner of the realm."
 *
 * This is the main entry point for the shared RAG library.
 * Import from here to use RAG features across all My-4-Blocks variants.
 *
 * - The Library Export Maestro
 */

// 🎭 Main RAG orchestrator (most common use)
export {
  loadEmbeddings,
  getEmbeddings,
  retrieve,
  retrieveKeywordOnly,
  getRAGContext,
  findRelevantWisdom,
  getRAGStats,
} from "./rag";

// 🔮 Embedding generation (supports OpenAI or local mode!)
export {
  getQueryEmbedding,
  getBatchEmbeddings,
  getEmbeddingModelInfo,
  validateEmbedding,
  setEmbeddingMode,
  getEmbeddingMode,
  getExpectedDimensions,
} from "./embeddings";

// 🌊 Search functions
export {
  hybridSearch,
  hybridSearchKeywordOnly,
} from "./hybridSearch";

export {
  searchEmbeddings,
  cosineSimilarity,
  filterByBlockType,
  formatContextForPrompt,
  buildChunkIndex,
} from "./vectorSearch";

export {
  keywordSearch,
  detectBlockFromQuery,
} from "./keywordSearch";

// 🕸️ Graph expansion
export {
  expandWithRelated,
  formatExpandedContext,
  getAllRelatedIds,
  analyzeConnectivity,
} from "./graphExpansion";

// 🎭 Sentiment analysis (local, no API!)
export {
  analyzeSentiment,
  isNegative,
  isPositive,
  getEmotionSummary,
  getEmotionalContext,
  type EmotionAnalysis,
} from "./sentimentAnalysis";

// 🤖 Local embeddings (stub for Vercel - actual uses OpenAI)
export {
  initializeLocalEmbeddings,
  getLocalEmbedding,
  getLocalEmbeddings,
  getEmbeddingDimension,
  isLocalEmbeddingsReady,
  localCosineSimilarity,
  findSimilarLocal,
  testLocalEmbeddings,
} from "./localEmbeddings";

// 📐 Types
export type {
  EmbeddedChunk,
  ChunkMetadata,
  ScoredChunk,
  EmbeddingsDatabase,
  ChapterInfo,
  DatabaseMetadata,
  HybridSearchOptions,
  RetrievalResult,
} from "./types";

// 🎨 Utilities (for shared UI components)
export { cn } from "./utils";
