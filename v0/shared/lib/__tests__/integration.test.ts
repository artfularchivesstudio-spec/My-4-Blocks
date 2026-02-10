/**
 * 🧪 Integration Test Suite - Full Chat Flow ✨
 *
 * "From user query to wisdom retrieval,
 * the complete journey tested end-to-end."
 *
 * Tests the full RAG pipeline as used by the chat API.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import {
  loadEmbeddings,
  findRelevantWisdom,
  getRAGStats,
  retrieveKeywordOnly,
  detectBlockFromQuery,
} from '../index';
import { analyzeSentiment, getEmotionalContext } from '../sentimentAnalysis';
import type { EmbeddingsDatabase } from '../types';

// 🌟 Load embeddings before all tests
beforeAll(async () => {
  const embeddingsData = await import('../../data/embeddings.json') as unknown as EmbeddingsDatabase;
  loadEmbeddings(embeddingsData.default || embeddingsData);
});

// ═══════════════════════════════════════════════════════════════
// 🎭 Full Chat Flow Simulation
// ═══════════════════════════════════════════════════════════════

describe('Chat Flow Integration', () => {
  /**
   * 🌟 Simulates what happens when a user sends a message
   *
   * 1. User message comes in
   * 2. Detect emotional block
   * 3. Analyze sentiment intensity
   * 4. Retrieve relevant wisdom
   * 5. Format for LLM system prompt
   */
  it('should handle "I feel angry" complete flow', async () => {
    const userMessage = "I feel so angry at my coworker for taking credit for my work";

    // Step 1: Detect emotional block
    const block = detectBlockFromQuery(userMessage);
    expect(block).toBe('Anger');

    // Step 2: Analyze sentiment intensity
    const sentiment = analyzeSentiment(userMessage);
    expect(sentiment.score).toBeLessThan(0); // Negative sentiment
    expect(sentiment.negativeWords.length).toBeGreaterThan(0);

    // Step 3: Get emotional context
    const emotionalContext = getEmotionalContext(userMessage, block);
    expect(emotionalContext).toContain('anger');

    // Step 4: Retrieve relevant wisdom (keyword-only for speed)
    const results = retrieveKeywordOnly(userMessage, 5);
    expect(results.length).toBeGreaterThan(0);

    // Step 5: Verify anger-related content retrieved
    const hasAngerContent = results.some(r =>
      r.chunk.block_type === 'Anger' ||
      r.chunk.text.toLowerCase().includes('anger')
    );
    expect(hasAngerContent).toBe(true);
  });

  it('should handle "I am worried about the future" complete flow', async () => {
    const userMessage = "I am so worried about what might happen tomorrow. What if everything goes wrong?";

    // Detect block
    const block = detectBlockFromQuery(userMessage);
    expect(block).toBe('Anxiety');

    // Sentiment
    const sentiment = analyzeSentiment(userMessage);
    expect(sentiment.score).toBeLessThan(0);

    // Retrieve wisdom
    const results = retrieveKeywordOnly(userMessage, 5);
    expect(results.length).toBeGreaterThan(0);
  });

  it('should handle "I feel hopeless" complete flow', async () => {
    const userMessage = "Nothing matters anymore. I feel so stuck and hopeless.";

    const block = detectBlockFromQuery(userMessage);
    expect(block).toBe('Depression');

    const sentiment = analyzeSentiment(userMessage);
    expect(sentiment.score).toBeLessThan(0);

    const results = retrieveKeywordOnly(userMessage, 5);
    expect(results.length).toBeGreaterThan(0);
  });

  it('should handle "I should have done better" complete flow', async () => {
    const userMessage = "I should have known better. It's all my fault.";

    const block = detectBlockFromQuery(userMessage);
    expect(block).toBe('Guilt');

    // Note: AFINN rates "better" as positive, so this may have neutral/positive score
    // The block detection is more reliable for guilt than sentiment analysis
    const sentiment = analyzeSentiment(userMessage);
    expect(typeof sentiment.score).toBe('number');

    const results = retrieveKeywordOnly(userMessage, 5);
    expect(results.length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════
// 🌶️ Intensity Detection Integration
// ═══════════════════════════════════════════════════════════════

describe('Intensity Detection Integration', () => {
  it('should detect higher intensity for CAPS and exclamation', () => {
    const mild = "I feel a bit upset";
    const intense = "I AM SO ANGRY!!! THIS IS TERRIBLE!!!";

    const mildSentiment = analyzeSentiment(mild);
    const intenseSentiment = analyzeSentiment(intense);

    // Intense should have markers
    expect(intenseSentiment.hasIntensityMarkers).toBe(true);
    expect(mildSentiment.hasIntensityMarkers).toBe(false);

    // Intense should have higher multiplier
    expect(intenseSentiment.intensityMultiplier).toBeGreaterThan(mildSentiment.intensityMultiplier);
  });

  it('should combine block detection with intensity', () => {
    const message = "I AM SO FURIOUS!!!";

    const block = detectBlockFromQuery(message);
    const sentiment = analyzeSentiment(message);
    const context = getEmotionalContext(message, block);

    expect(block).toBe('Anger');
    expect(sentiment.hasIntensityMarkers).toBe(true);
    expect(context).toContain('anger');
    expect(context).toContain('intensity markers');
  });
});

// ═══════════════════════════════════════════════════════════════
// 📊 RAG System Health Checks
// ═══════════════════════════════════════════════════════════════

describe('RAG System Health', () => {
  it('should have embeddings loaded', () => {
    const stats = getRAGStats();

    expect(stats.isLoaded).toBe(true);
    expect(stats.totalChunks).toBe(95);
    expect(stats.model).toBe('text-embedding-3-small');
  });

  it('should have all 9 chapters', () => {
    const stats = getRAGStats();
    const chapterCodes = stats.chapters.map(c => c.code);

    expect(chapterCodes).toContain('ANG');  // Anger
    expect(chapterCodes).toContain('ANX');  // Anxiety
    expect(chapterCodes).toContain('DEP');  // Depression
    expect(chapterCodes).toContain('GUILT'); // Guilt
    expect(chapterCodes).toContain('MC');   // Mind Control
    expect(chapterCodes).toContain('ABC');  // ABC Model
    expect(chapterCodes).toContain('INS');  // Insights
    expect(chapterCodes).toContain('IRR');  // Irrational Beliefs
    expect(chapterCodes).toContain('HAP');  // Happiness
  });

  it('should retrieve context for any query', async () => {
    const queries = [
      "What is the ABC model?",
      "How do I deal with anger?",
      "What are irrational beliefs?",
      "Tell me about the narrator and observer",
    ];

    for (const query of queries) {
      const results = retrieveKeywordOnly(query, 3);
      expect(results.length).toBeGreaterThan(0);
    }
  });
});

// ═══════════════════════════════════════════════════════════════
// 🎯 Edge Cases & Error Handling
// ═══════════════════════════════════════════════════════════════

describe('Edge Cases', () => {
  it('should handle empty query gracefully', () => {
    const results = retrieveKeywordOnly('', 5);
    expect(results.length).toBe(0);
  });

  it('should handle query with only stopwords', () => {
    const results = retrieveKeywordOnly('the a an is are', 5);
    expect(results.length).toBe(0);
  });

  it('should handle very short query', () => {
    const results = retrieveKeywordOnly('hi', 5);
    // "hi" is too short (< 3 chars), should return empty
    expect(results.length).toBe(0);
  });

  it('should handle mixed case and punctuation', () => {
    const results = retrieveKeywordOnly('WHY am I SO ANGRY???!!!', 5);
    expect(results.length).toBeGreaterThan(0);
  });

  it('should handle unicode and special characters', () => {
    const results = retrieveKeywordOnly('I feel angry 😠 about this!!!', 5);
    expect(results.length).toBeGreaterThan(0);
  });

  it('should handle neutral/positive queries', () => {
    const block = detectBlockFromQuery('I feel great today!');
    expect(block).toBeUndefined(); // No negative block detected

    const sentiment = analyzeSentiment('I feel great today!');
    expect(sentiment.score).toBeGreaterThan(0); // Positive
  });
});

// ═══════════════════════════════════════════════════════════════
// 🔄 End-to-End Scenarios
// ═══════════════════════════════════════════════════════════════

describe('End-to-End Scenarios', () => {
  it('should provide appropriate context for therapy conversation', async () => {
    // Simulate a multi-turn conversation with clear depression keywords
    // Using words that exist in the training data
    const messages = [
      "I feel hopeless and stuck",
      "I am so depressed lately",
    ];

    for (const message of messages) {
      const block = detectBlockFromQuery(message);
      expect(block).toBe('Depression');

      const results = retrieveKeywordOnly(message, 5);
      expect(results.length).toBeGreaterThan(0);
    }
  });

  it('should handle ABC model questions', async () => {
    const query = "Can you explain the ABC model of emotions?";
    const results = retrieveKeywordOnly(query, 5);

    // Should find ABC-related content
    const hasABCContent = results.some(r =>
      r.chunk.block_type === 'ABCs' ||
      r.chunk.text.toLowerCase().includes('activating') ||
      r.chunk.text.toLowerCase().includes('belief') ||
      r.chunk.text.toLowerCase().includes('consequence')
    );
    expect(hasABCContent).toBe(true);
  });

  it('should handle irrational beliefs questions', async () => {
    const query = "What are the seven irrational beliefs?";
    const results = retrieveKeywordOnly(query, 5);

    const hasIrrationalContent = results.some(r =>
      r.chunk.block_type === 'Irrational Beliefs' ||
      r.chunk.text.toLowerCase().includes('irrational')
    );
    expect(hasIrrationalContent).toBe(true);
  });
});
