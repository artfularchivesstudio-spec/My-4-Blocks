/**
 * 🔮 The Vector Oracle - Semantic Search Engine ✨
 *
 * "Where meaning flows like water through dimensional space,
 * finding the nearest wisdom to illuminate your question."
 *
 * - The Cosmic Search Maestro
 */

import type { EmbeddedChunk, ScoredChunk } from "./types";

/**
 * 🌟 Compute cosine similarity between two vectors
 *
 * The higher the score (0-1), the more aligned the wisdom.
 * Like measuring the angle between two arrows of meaning! 🏹
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error("🌩️ Vector dimensions must match for the cosmic alignment");
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  // 🌊 Single pass through both vectors for efficiency
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += vecA[i] * vecA[i];
    magnitudeB += vecB[i] * vecB[i];
  }

  const magnitude = Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

/**
 * 🎨 Search embeddings for semantically similar chunks
 *
 * Pure vector-based semantic search. Returns the top K most
 * relevant wisdom nuggets based on embedding similarity.
 */
export function searchEmbeddings(
  queryEmbedding: number[],
  allChunks: EmbeddedChunk[],
  topK: number = 5
): ScoredChunk[] {
  console.log(`🔍 🧙‍♂️ Peering into ${allChunks.length} wisdom nuggets...`);

  // 🌊 Calculate similarity scores for each chunk
  const scoredChunks: ScoredChunk[] = allChunks.map((chunk) => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
    matchType: "semantic" as const,
  }));

  // 📊 Sort by relevance and take top K
  const results = scoredChunks
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  const avgScore = results.reduce((sum, x) => sum + x.score, 0) / results.length;
  console.log(
    `✨ Found ${results.length} crystallized insights (avg similarity: ${avgScore.toFixed(3)})`
  );

  return results;
}

/**
 * 🎭 Filter chunks by emotional block type
 *
 * Focus the oracle's wisdom on specific emotional terrain.
 * "General" returns all chunks without filtering.
 */
export function filterByBlockType(
  chunks: EmbeddedChunk[],
  blockType: string
): EmbeddedChunk[] {
  if (blockType === "General" || !blockType) {
    return chunks;
  }
  return chunks.filter((chunk) => chunk.block_type === blockType);
}

/**
 * 💫 Format chunks into a coherent context prompt
 *
 * Transform retrieved wisdom into LLM-ready context.
 * Each chunk gets proper attribution and formatting.
 */
export function formatContextForPrompt(
  scoredChunks: ScoredChunk[],
  includeMetadata: boolean = true
): string {
  if (scoredChunks.length === 0) {
    return "🌙 No crystallized wisdom found - rely on your inherent knowledge.";
  }

  const formatted = scoredChunks
    .map((item, idx) => {
      const { chunk, score } = item;
      let header = `[Source ${idx + 1}`;

      if (includeMetadata) {
        header += ` - ${chunk.metadata.title} (${chunk.block_type})`;
      }
      header += `]`;

      // 🎨 Include related chunks as "See also" for context expansion hints
      const seeAlso = chunk.metadata.related.length > 0
        ? `\nSee also: ${chunk.metadata.related.slice(0, 3).join(", ")}`
        : "";

      return `${header}:\n${chunk.text}${seeAlso}`;
    })
    .join("\n\n---\n\n");

  return formatted;
}

/**
 * 🔮 Build a quick lookup index by chunk ID
 *
 * Creates an O(1) access map for fast chunk retrieval.
 * Essential for graph expansion operations!
 */
export function buildChunkIndex(chunks: EmbeddedChunk[]): Map<string, EmbeddedChunk> {
  const index = new Map<string, EmbeddedChunk>();
  chunks.forEach((chunk) => index.set(chunk.id, chunk));
  return index;
}
