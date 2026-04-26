/**
 * 🌊 The Hybrid Oracle - Unified Search Engine ✨
 *
 * "Where keywords meet semantics,
 * the best of both worlds unite for wisdom."
 *
 * Combines keyword-based and semantic search with configurable weights.
 *
 * - The Fusion Search Maestro
 */

import type { EmbeddedChunk, ScoredChunk, HybridSearchOptions } from "./types";
import { searchEmbeddings, filterByBlockType } from "./vectorSearch";
import { keywordSearch, detectBlockFromQuery } from "./keywordSearch";

/**
 * 🌟 Default search configuration
 *
 * 70% semantic, 30% keyword - semantic search is usually more
 * powerful but keywords help with exact matches.
 */
const DEFAULT_OPTIONS: Required<HybridSearchOptions> = {
  topK: 5,
  keywordWeight: 0.3,
  semanticWeight: 0.7,
  filterBlockType: "",
  expandRelated: false,
  maxExpansion: 2,
};

/**
 * 🔮 Perform hybrid search combining keyword and semantic approaches
 *
 * 1. Run both searches in parallel (conceptually)
 * 2. Normalize scores to 0-1 range
 * 3. Combine with configurable weights
 * 4. Deduplicate and re-rank
 *
 * This gives us the precision of keywords + the understanding of semantics!
 */
export function hybridSearch(
  query: string,
  queryEmbedding: number[],
  allChunks: EmbeddedChunk[],
  options: HybridSearchOptions = {}
): ScoredChunk[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  console.log(`🌊 ✨ HYBRID SEARCH AWAKENS!`);
  console.log(`🎯 Query: "${query.substring(0, 50)}..."`);
  console.log(`⚖️ Weights: semantic=${opts.semanticWeight}, keyword=${opts.keywordWeight}`);

  // 🎭 Optionally filter by detected or specified block type
  let searchableChunks = allChunks;
  const detectedBlock = opts.filterBlockType || detectBlockFromQuery(query);

  if (detectedBlock) {
    // 🌟 Don't hard filter - boost matching blocks instead
    console.log(`🎭 Boosting block type: ${detectedBlock}`);
  }

  // 🔮 Run semantic search (the heart of understanding)
  const semanticResults = searchEmbeddings(queryEmbedding, searchableChunks, opts.topK * 2);

  // 🔑 Run keyword search (precise term matching)
  const keywordResults = keywordSearch(query, searchableChunks, opts.topK * 2);

  // 📊 Normalize semantic scores (already 0-1 from cosine similarity)
  const normalizedSemantic = semanticResults.map((r) => ({
    ...r,
    normalizedScore: r.score,
  }));

  // 📊 Normalize keyword scores (min-max normalization)
  const keywordScores = keywordResults.map((r) => r.score);
  const maxKeyword = Math.max(...keywordScores, 1); // Avoid division by zero
  const normalizedKeyword = keywordResults.map((r) => ({
    ...r,
    normalizedScore: r.score / maxKeyword,
  }));

  // 🌊 Merge results by chunk ID
  const mergedScores = new Map<string, {
    chunk: EmbeddedChunk;
    semanticScore: number;
    keywordScore: number;
    hybridScore: number;
  }>();

  // Add semantic results
  for (const result of normalizedSemantic) {
    mergedScores.set(result.chunk.id, {
      chunk: result.chunk,
      semanticScore: result.normalizedScore,
      keywordScore: 0,
      hybridScore: result.normalizedScore * opts.semanticWeight,
    });
  }

  // Add/merge keyword results
  for (const result of normalizedKeyword) {
    const existing = mergedScores.get(result.chunk.id);
    if (existing) {
      existing.keywordScore = result.normalizedScore;
      existing.hybridScore += result.normalizedScore * opts.keywordWeight;
    } else {
      mergedScores.set(result.chunk.id, {
        chunk: result.chunk,
        semanticScore: 0,
        keywordScore: result.normalizedScore,
        hybridScore: result.normalizedScore * opts.keywordWeight,
      });
    }
  }

  // Apply block type boost if detected
  if (detectedBlock) {
    for (const [, value] of mergedScores) {
      if (value.chunk.block_type === detectedBlock) {
        value.hybridScore *= 1.2; // 20% boost for matching block
      }
    }
  }

  // v2.0: Constitution-first priority boosting
  // Constitution chunks always get highest retrieval weight when
  // emotional language is detected. This ensures the formulas and
  // anti-drift rules are always present in the context.
  const constitutionBlockTypes = new Set([
    "Constitution", "Mental Contamination", "Irrational Beliefs",
    "ABCs", "Three Insights", "Happiness", "Validation",
  ]);
  const hasEmotionalContent = Boolean(detectedBlock);

  for (const [, value] of mergedScores) {
    // Boost by priority field if present (v2 chunks)
    if (value.chunk.priority === "constitution") {
      value.hybridScore *= hasEmotionalContent ? 1.5 : 1.3;
    } else if (value.chunk.priority === "course") {
      value.hybridScore *= 1.1;
    } else if (value.chunk.priority === "behavioral") {
      value.hybridScore *= hasEmotionalContent ? 1.15 : 1.05;
    }

    // Also boost by block_type for backward compatibility with
    // chunks that don't have the priority field yet
    if (!value.chunk.priority && constitutionBlockTypes.has(value.chunk.block_type)) {
      value.hybridScore *= hasEmotionalContent ? 1.3 : 1.15;
    }
  }

  // 📊 Sort by hybrid score and take top K
  const sortedResults = Array.from(mergedScores.values())
    .sort((a, b) => b.hybridScore - a.hybridScore)
    .slice(0, opts.topK);

  const results: ScoredChunk[] = sortedResults.map((r) => ({
    chunk: r.chunk,
    score: r.hybridScore,
    matchType: "hybrid" as const,
  }));

  console.log(`🎉 ✨ HYBRID SEARCH COMPLETE! ${results.length} results`);
  console.log(`📊 Top scores: ${results.slice(0, 3).map((r) => r.score.toFixed(3)).join(", ")}`);

  return results;
}

/**
 * 🌟 Simple hybrid search without needing query embedding
 *
 * Falls back to keyword-only search when embeddings aren't available.
 * Useful for quick searches or when embedding API is unavailable.
 */
export function hybridSearchKeywordOnly(
  query: string,
  allChunks: EmbeddedChunk[],
  topK: number = 5
): ScoredChunk[] {
  console.log(`🔑 Keyword-only hybrid search for: "${query.substring(0, 50)}..."`);

  const keywordResults = keywordSearch(query, allChunks, topK);

  // 🎭 Apply block type boost
  const detectedBlock = detectBlockFromQuery(query);
  if (detectedBlock) {
    keywordResults.forEach((result) => {
      if (result.chunk.block_type === detectedBlock) {
        result.score *= 1.2;
      }
    });
    // Re-sort after boosting
    keywordResults.sort((a, b) => b.score - a.score);
  }

  return keywordResults;
}
