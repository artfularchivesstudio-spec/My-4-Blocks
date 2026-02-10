/**
 * 🧪 The RAG Test Suite - Verifying Wisdom Retrieval ✨
 *
 * "Trust, but verify. Even cosmic wisdom needs testing!"
 *
 * Tests the shared RAG library with real expectations.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import {
  loadEmbeddings,
  getRAGStats,
  retrieveKeywordOnly,
  getEmbeddings,
} from '../rag';
import {
  cosineSimilarity,
  searchEmbeddings,
  filterByBlockType,
  formatContextForPrompt,
  buildChunkIndex,
} from '../vectorSearch';
import {
  keywordSearch,
  detectBlockFromQuery,
} from '../keywordSearch';
import {
  hybridSearch,
  hybridSearchKeywordOnly,
} from '../hybridSearch';
import {
  expandWithRelated,
  analyzeConnectivity,
} from '../graphExpansion';
import type { EmbeddingsDatabase, EmbeddedChunk } from '../types';

// 🌟 Load embeddings before all tests
let embeddingsData: EmbeddingsDatabase;

beforeAll(async () => {
  // Load the real embeddings
  embeddingsData = await import('../../data/embeddings.json');
  loadEmbeddings(embeddingsData);
});

// ═══════════════════════════════════════════════════════════════
// 📊 RAG System Tests
// ═══════════════════════════════════════════════════════════════

describe('RAG System', () => {
  it('should load embeddings successfully', () => {
    const stats = getRAGStats();

    expect(stats.isLoaded).toBe(true);
    expect(stats.totalChunks).toBe(95);
    expect(stats.model).toBe('text-embedding-3-small');
    expect(stats.chapters.length).toBe(9);
  });

  it('should have all expected chapters', () => {
    const stats = getRAGStats();
    const chapterCodes = stats.chapters.map(c => c.code);

    expect(chapterCodes).toContain('ANG');
    expect(chapterCodes).toContain('ANX');
    expect(chapterCodes).toContain('DEP');
    expect(chapterCodes).toContain('GUILT');
    expect(chapterCodes).toContain('MC');
    expect(chapterCodes).toContain('ABC');
    expect(chapterCodes).toContain('INS');
    expect(chapterCodes).toContain('IRR');
    expect(chapterCodes).toContain('HAP');
  });

  it('should have valid embeddings for all chunks', () => {
    const db = getEmbeddings();

    for (const chunk of db.chunks) {
      expect(chunk.embedding).toBeDefined();
      expect(chunk.embedding.length).toBe(1536);
      expect(chunk.embedding.every(n => typeof n === 'number')).toBe(true);
    }
  });
});

// ═══════════════════════════════════════════════════════════════
// 🔮 Vector Search Tests
// ═══════════════════════════════════════════════════════════════

describe('Vector Search', () => {
  it('should compute cosine similarity correctly', () => {
    // Identical vectors should have similarity 1
    const vec1 = [1, 0, 0];
    const vec2 = [1, 0, 0];
    expect(cosineSimilarity(vec1, vec2)).toBeCloseTo(1);

    // Orthogonal vectors should have similarity 0
    const vec3 = [1, 0, 0];
    const vec4 = [0, 1, 0];
    expect(cosineSimilarity(vec3, vec4)).toBeCloseTo(0);

    // Opposite vectors should have similarity -1
    const vec5 = [1, 0, 0];
    const vec6 = [-1, 0, 0];
    expect(cosineSimilarity(vec5, vec6)).toBeCloseTo(-1);
  });

  it('should throw on dimension mismatch', () => {
    expect(() => cosineSimilarity([1, 2], [1, 2, 3])).toThrow();
  });

  it('should filter chunks by block type', () => {
    const db = getEmbeddings();
    const angerChunks = filterByBlockType(db.chunks, 'Anger');

    expect(angerChunks.length).toBe(9);
    expect(angerChunks.every(c => c.block_type === 'Anger')).toBe(true);
  });

  it('should build chunk index correctly', () => {
    const db = getEmbeddings();
    const index = buildChunkIndex(db.chunks);

    expect(index.size).toBe(95);
    expect(index.get('ANG_S1_C01')).toBeDefined();
    expect(index.get('ANG_S1_C01')?.block_type).toBe('Anger');
  });
});

// ═══════════════════════════════════════════════════════════════
// 🔑 Keyword Search Tests
// ═══════════════════════════════════════════════════════════════

describe('Keyword Search', () => {
  it('should detect anger from query', () => {
    expect(detectBlockFromQuery('Why am I so angry?')).toBe('Anger');
    expect(detectBlockFromQuery('I feel frustrated and mad')).toBe('Anger');
  });

  it('should detect anxiety from query', () => {
    expect(detectBlockFromQuery('I feel anxious about tomorrow')).toBe('Anxiety');
    expect(detectBlockFromQuery('What if something bad happens?')).toBe('Anxiety');
    expect(detectBlockFromQuery('I am worried about my job')).toBe('Anxiety');
  });

  it('should detect depression from query', () => {
    expect(detectBlockFromQuery('I feel so sad and hopeless')).toBe('Depression');
    expect(detectBlockFromQuery('Nothing matters anymore')).toBe('Depression');
  });

  it('should detect guilt from query', () => {
    expect(detectBlockFromQuery('I feel guilty about what I did')).toBe('Guilt');
    expect(detectBlockFromQuery('I should have known better')).toBe('Guilt');
  });

  it('should return undefined for neutral queries', () => {
    expect(detectBlockFromQuery('Tell me about the ABC model')).toBeUndefined();
    expect(detectBlockFromQuery('What is REBT?')).toBeUndefined();
  });

  it('should find relevant chunks by keywords', () => {
    const db = getEmbeddings();
    const results = keywordSearch('anger demands reality', db.chunks, 5);

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].score).toBeGreaterThan(0);

    // Top results should be anger-related
    const topChunk = results[0].chunk;
    expect(
      topChunk.block_type === 'Anger' ||
      topChunk.text.toLowerCase().includes('anger')
    ).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════
// 🌊 Hybrid Search Tests
// ═══════════════════════════════════════════════════════════════

describe('Hybrid Search', () => {
  it('should perform keyword-only hybrid search', () => {
    const db = getEmbeddings();
    const results = hybridSearchKeywordOnly('Why do I feel angry?', db.chunks, 5);

    expect(results.length).toBe(5);
    expect(results[0].matchType).toBe('keyword');

    // Should boost anger-related chunks
    const angerChunks = results.filter(r => r.chunk.block_type === 'Anger');
    expect(angerChunks.length).toBeGreaterThan(0);
  });

  it('should combine keyword and semantic search', () => {
    const db = getEmbeddings();
    // Use a real embedding from the first chunk
    const queryEmbedding = db.chunks[0].embedding;

    const results = hybridSearch(
      'anger demands should',
      queryEmbedding,
      db.chunks,
      { topK: 5 }
    );

    expect(results.length).toBe(5);
    expect(results[0].matchType).toBe('hybrid');
    expect(results[0].score).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════
// 🕸️ Graph Expansion Tests
// ═══════════════════════════════════════════════════════════════

describe('Graph Expansion', () => {
  it('should expand with related chunks', () => {
    const db = getEmbeddings();

    // Get anger chunks which have related links
    const angerResults = keywordSearch('anger demands', db.chunks, 3);

    const expanded = expandWithRelated(angerResults, db.chunks, 2);

    // Should find related chunks
    expect(expanded.length).toBeGreaterThan(0);

    // Expanded chunks should be different from originals
    const originalIds = new Set(angerResults.map(r => r.chunk.id));
    const allExpanded = expanded.every(c => !originalIds.has(c.id));
    expect(allExpanded).toBe(true);
  });

  it('should analyze connectivity', () => {
    const db = getEmbeddings();
    const connectivity = analyzeConnectivity(db.chunks);

    expect(connectivity.totalRelations).toBeGreaterThan(0);
    expect(connectivity.avgRelationsPerChunk).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════
// 🎯 Integration Tests - Real Queries with Expected Results
// ═══════════════════════════════════════════════════════════════

describe('Integration: Real Query Expectations', () => {
  const testCases = [
    {
      query: 'Why do I feel angry all the time?',
      expectedBlock: 'Anger',
      expectedKeywords: ['anger', 'demand', 'should'],
      description: 'Should retrieve anger-related content',
    },
    {
      query: 'What if something bad happens tomorrow?',
      expectedBlock: 'Anxiety',
      expectedKeywords: ['anxiety', 'certainty', 'future'],
      description: 'Should retrieve anxiety-related content',
    },
    {
      query: 'I feel hopeless and stuck',
      expectedBlock: 'Depression',
      expectedKeywords: ['depression', 'change', 'moment'],
      description: 'Should retrieve depression-related content',
    },
    {
      query: 'I should have known better',
      expectedBlock: 'Guilt',
      expectedKeywords: ['guilt', 'past', 'perfection'],
      description: 'Should retrieve guilt-related content',
    },
    {
      query: 'What are the seven irrational beliefs?',
      expectedBlock: 'Irrational Beliefs',
      expectedKeywords: ['irrational', 'beliefs', 'must'],
      description: 'Should retrieve irrational beliefs content',
    },
    {
      query: 'How does the ABC model work?',
      expectedBlock: 'ABCs',
      expectedKeywords: ['activating', 'belief', 'consequence'],
      description: 'Should retrieve ABC model content',
    },
  ];

  testCases.forEach(({ query, expectedBlock, expectedKeywords, description }) => {
    it(description, () => {
      const db = getEmbeddings();
      const results = keywordSearch(query, db.chunks, 5);

      expect(results.length).toBeGreaterThan(0);

      // At least one result should match expected block
      const matchingBlock = results.some(r => r.chunk.block_type === expectedBlock);
      expect(matchingBlock).toBe(true);

      // Combined text should contain expected keywords
      const combinedText = results.map(r => r.chunk.text.toLowerCase()).join(' ');
      const hasKeywords = expectedKeywords.some(kw => combinedText.includes(kw));
      expect(hasKeywords).toBe(true);
    });
  });
});

// ═══════════════════════════════════════════════════════════════
// 📝 Context Formatting Tests
// ═══════════════════════════════════════════════════════════════

describe('Context Formatting', () => {
  it('should format context with metadata', () => {
    const db = getEmbeddings();
    const results = keywordSearch('anger', db.chunks, 3);
    const formatted = formatContextForPrompt(results, true);

    expect(formatted).toContain('[Source 1');
    expect(formatted).toContain('Anger');
    expect(formatted.length).toBeGreaterThan(100);
  });

  it('should include "See also" for related chunks', () => {
    const db = getEmbeddings();
    const results = keywordSearch('anger demands', db.chunks, 3);
    const formatted = formatContextForPrompt(results, true);

    // Anger chunks have related links
    expect(formatted).toContain('See also:');
  });

  it('should handle empty results gracefully', () => {
    const formatted = formatContextForPrompt([], true);
    expect(formatted).toContain('No crystallized wisdom found');
  });
});
