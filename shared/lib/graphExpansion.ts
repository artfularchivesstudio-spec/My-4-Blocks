/**
 * 🕸️ The Graph Expander - Cross-Link Navigation ✨
 *
 * "Wisdom is not isolated islands,
 * but a web of interconnected insights."
 *
 * Uses the `related` field in chunks to expand context
 * with connected wisdom. A lightweight graph RAG approach!
 *
 * - The Knowledge Graph Navigator
 */

import type { EmbeddedChunk, ScoredChunk } from "./types";
import { buildChunkIndex } from "./vectorSearch";

/**
 * 🌟 Expand retrieved chunks using cross-links
 *
 * Given the top retrieved chunks, find related chunks that
 * weren't already retrieved. This provides contextual depth
 * without requiring a full graph database.
 *
 * @param retrievedChunks - The chunks retrieved by search
 * @param allChunks - The full chunk database
 * @param maxExpansion - Maximum additional chunks to add per retrieved chunk
 * @returns Additional related chunks that weren't already retrieved
 */
export function expandWithRelated(
  retrievedChunks: ScoredChunk[],
  allChunks: EmbeddedChunk[],
  maxExpansion: number = 2
): EmbeddedChunk[] {
  console.log(`🕸️ ✨ GRAPH EXPANSION AWAKENS!`);

  // 🔮 Build lookup index for O(1) access
  const chunkIndex = buildChunkIndex(allChunks);

  // 📦 Track retrieved IDs to avoid duplicates
  const retrievedIds = new Set(retrievedChunks.map((r) => r.chunk.id));

  // 🌊 Collect related chunks with their scores
  const relatedWithScores: Array<{ chunk: EmbeddedChunk; parentScore: number; depth: number }> = [];

  for (const scored of retrievedChunks) {
    const relatedIds = scored.chunk.metadata.related || [];

    for (const relatedId of relatedIds.slice(0, maxExpansion * 2)) {
      // 🎯 Skip if already retrieved
      if (retrievedIds.has(relatedId)) continue;

      // 🔍 Find the related chunk
      const relatedChunk = chunkIndex.get(relatedId);
      if (relatedChunk) {
        relatedWithScores.push({
          chunk: relatedChunk,
          parentScore: scored.score,
          depth: 1,
        });
      }
    }
  }

  // 📊 Score related chunks by parent score (higher parent = more relevant related)
  // Also deduplicate by taking highest scored instance
  const uniqueRelated = new Map<string, { chunk: EmbeddedChunk; score: number }>();

  for (const item of relatedWithScores) {
    const existing = uniqueRelated.get(item.chunk.id);
    const score = item.parentScore * 0.5; // Related chunks get 50% of parent score

    if (!existing || existing.score < score) {
      uniqueRelated.set(item.chunk.id, { chunk: item.chunk, score });
    }
  }

  // 📊 Sort by score and take top results
  const sortedRelated = Array.from(uniqueRelated.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, retrievedChunks.length * maxExpansion)
    .map((r) => r.chunk);

  console.log(`🕸️ Expanded with ${sortedRelated.length} related chunks`);

  if (sortedRelated.length > 0) {
    console.log(`📚 Related topics: ${sortedRelated.slice(0, 3).map((c) => c.metadata.title).join(", ")}`);
  }

  return sortedRelated;
}

/**
 * 🎨 Format expanded context for LLM prompt
 *
 * Creates a context string that includes both main results
 * and related expansions, clearly labeled for the LLM.
 */
export function formatExpandedContext(
  mainChunks: ScoredChunk[],
  relatedChunks: EmbeddedChunk[]
): string {
  const sections: string[] = [];

  // 🌟 Main results section
  if (mainChunks.length > 0) {
    sections.push("## Primary Sources");
    mainChunks.forEach((item, idx) => {
      sections.push(
        `\n### [${idx + 1}] ${item.chunk.metadata?.title ?? item.chunk.text.slice(0, 50) + "..."} (${item.chunk.block_type})\n${item.chunk.text}`
      );
    });
  }

  // 🕸️ Related context section
  if (relatedChunks.length > 0) {
    sections.push("\n## Related Context");
    relatedChunks.forEach((chunk, idx) => {
      sections.push(
        `\n### [Related ${idx + 1}] ${chunk.metadata?.title ?? chunk.text.slice(0, 50) + "..."}\n${chunk.text}`
      );
    });
  }

  return sections.join("\n");
}

/**
 * 🔍 Get all related chunk IDs from a set of chunks
 *
 * Useful for building relationship graphs or understanding
 * the connection structure of retrieved results.
 */
export function getAllRelatedIds(chunks: EmbeddedChunk[]): Set<string> {
  const allRelated = new Set<string>();

  for (const chunk of chunks) {
    for (const relatedId of chunk.metadata.related || []) {
      allRelated.add(relatedId);
    }
  }

  return allRelated;
}

/**
 * 📊 Analyze the connectivity of retrieved chunks
 *
 * Returns statistics about how interconnected the retrieved
 * results are, useful for debugging and quality assessment.
 */
export function analyzeConnectivity(chunks: EmbeddedChunk[]): {
  totalRelations: number;
  avgRelationsPerChunk: number;
  internalLinks: number;
  externalLinks: number;
} {
  const chunkIds = new Set(chunks.map((c) => c.id));
  let totalRelations = 0;
  let internalLinks = 0;
  let externalLinks = 0;

  for (const chunk of chunks) {
    const related = chunk.metadata.related || [];
    totalRelations += related.length;

    for (const relatedId of related) {
      if (chunkIds.has(relatedId)) {
        internalLinks++;
      } else {
        externalLinks++;
      }
    }
  }

  return {
    totalRelations,
    avgRelationsPerChunk: chunks.length > 0 ? totalRelations / chunks.length : 0,
    internalLinks,
    externalLinks,
  };
}
