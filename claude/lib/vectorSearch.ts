/**
 * 🔮 The Vector Oracle - In-Memory Semantic Search ✨
 *
 * "Where meaning flows like water through the dimensional space,
 * finding the nearest wisdom to illuminate your question."
 *
 * - The Cosmic Search Maestro
 */

import type { EmbeddedChunk } from "@/types/embeddings"

/**
 * 🌟 Compute cosine similarity between two vectors
 * The higher the score, the more aligned the wisdom
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error("🌩️ Vector dimensions must match for the cosmic alignment")
  }

  let dotProduct = 0
  let magnitudeA = 0
  let magnitudeB = 0

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    magnitudeA += vecA[i] * vecA[i]
    magnitudeB += vecB[i] * vecB[i]
  }

  const magnitude = Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB)
  return magnitude === 0 ? 0 : dotProduct / magnitude
}

/**
 * 🎨 Search embeddings for semantically similar chunks
 * Returns the top K most relevant wisdom nuggets
 */
export function searchEmbeddings(
  queryEmbedding: number[],
  allChunks: EmbeddedChunk[],
  topK: number = 5
): EmbeddedChunk[] {
  console.log(`🔍 🧙‍♂️ Peering into ${allChunks.length} wisdom nuggets...`)

  // 🌊 Calculate similarity scores for each chunk
  const scoredChunks = allChunks.map((chunk) => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }))

  // 📊 Sort by relevance and take top K
  const results = scoredChunks
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(({ chunk }) => chunk)

  console.log(
    `✨ Found ${results.length} crystallized insights (avg relevance: ${(scoredChunks.slice(0, topK).reduce((sum, x) => sum + x.score, 0) / topK).toFixed(3)})`
  )

  return results
}

/**
 * 🎭 Filter chunks by emotional block type
 * Focus the oracle's wisdom on specific emotional terrain
 */
export function filterByBlockType(
  chunks: EmbeddedChunk[],
  blockType: string
): EmbeddedChunk[] {
  return chunks.filter((chunk) => chunk.block_type === blockType || blockType === "General")
}

/**
 * 💫 Format chunks into a coherent context prompt
 * The wisdom gathered becomes the foundation for response
 */
export function formatContextForPrompt(chunks: EmbeddedChunk[]): string {
  if (chunks.length === 0) {
    return "🌙 No crystallized wisdom found - rely on your inherent knowledge."
  }

  const formatted = chunks
    .map(
      (chunk, idx) =>
        `[Source ${idx + 1} - ${chunk.block_type}]:\n${chunk.text.substring(0, 400)}...`
    )
    .join("\n\n---\n\n")

  return formatted
}
