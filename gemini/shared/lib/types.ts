/**
 * 🔮 The Type Oracle - Shared Types for RAG System ✨
 *
 * "Where structure meets meaning,
 * types guide wisdom through the void."
 *
 * - The Cosmic Type Architect
 */

/**
 * 🌟 An embedded chunk with all metadata intact
 * The atomic unit of wisdom in our RAG universe
 */
export interface EmbeddedChunk {
  id: string;
  text: string;
  embedding: number[];
  block_type: "Anger" | "Anxiety" | "Depression" | "Guilt" | "Mental Contamination" | "ABCs" | "Three Insights" | "Irrational Beliefs" | "Happiness" | "General";
  metadata: ChunkMetadata;
}

/**
 * 🎨 Metadata that enriches each chunk
 * Cross-links, tags, and context for intelligent retrieval
 */
export interface ChunkMetadata {
  chapter: string;
  section: string;
  title: string;
  tags: string[];
  keywords: string[];
  related: string[];
  audience: "general" | "first_responder";
  category: string;
}

/**
 * 💎 A chunk with its relevance score
 * The result of the retrieval oracle's work
 */
export interface ScoredChunk {
  chunk: EmbeddedChunk;
  score: number;
  matchType?: "semantic" | "keyword" | "hybrid";
}

/**
 * 🌊 The embeddings database structure
 * The crystallized knowledge waiting for queries
 */
export interface EmbeddingsDatabase {
  version: string;
  model: string;
  dimensions: number;
  total_chunks: number;
  chapters: ChapterInfo[];
  chunks: EmbeddedChunk[];
  metadata: DatabaseMetadata;
}

/**
 * 📚 Chapter information
 */
export interface ChapterInfo {
  code: string;
  name: string;
  count: number;
}

/**
 * 📜 Database-level metadata
 */
export interface DatabaseMetadata {
  source: string;
  description: string;
  blocks: string[];
  additional_topics: string[];
}

/**
 * 🎯 Options for hybrid search
 */
export interface HybridSearchOptions {
  topK?: number;
  keywordWeight?: number;
  semanticWeight?: number;
  filterBlockType?: string;
  expandRelated?: boolean;
  maxExpansion?: number;
}

/**
 * 🔮 Result of the retrieval with all context
 */
export interface RetrievalResult {
  chunks: ScoredChunk[];
  expandedChunks?: EmbeddedChunk[];
  queryEmbedding: number[];
  totalMatches: number;
  searchTime: number;
}
