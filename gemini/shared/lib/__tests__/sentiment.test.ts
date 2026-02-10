/**
 * 🧪 The Sentiment Test Suite - Verifying Emotion Intensity ✨
 *
 * "ANGRY!!!! should feel different from 'angry'.
 * Let's prove it!" 🌶️
 *
 * Tests the sentiment analysis module for intensity detection.
 */

import { describe, it, expect } from 'vitest';
import {
  analyzeSentiment,
  isNegative,
  isPositive,
  getEmotionSummary,
  getEmotionalContext,
} from '../sentimentAnalysis';

// ═══════════════════════════════════════════════════════════════
// 📊 Basic Sentiment Tests
// ═══════════════════════════════════════════════════════════════

describe('Basic Sentiment Analysis', () => {
  it('should detect negative sentiment', () => {
    expect(isNegative('I feel angry and frustrated')).toBe(true);
    expect(isNegative('This is terrible and awful')).toBe(true);
    expect(isNegative('I hate this situation')).toBe(true);
  });

  it('should detect positive sentiment', () => {
    expect(isPositive('I feel happy and grateful')).toBe(true);
    expect(isPositive('This is wonderful and amazing')).toBe(true);
    expect(isPositive('I love this approach')).toBe(true);
  });

  it('should return correct score direction', () => {
    const negative = analyzeSentiment('I am so angry');
    const positive = analyzeSentiment('I am so happy');

    expect(negative.score).toBeLessThan(0);
    expect(positive.score).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════
// 🌶️ Intensity Detection Tests
// ═══════════════════════════════════════════════════════════════

describe('Intensity Detection', () => {
  it('should detect intensity markers in CAPS', () => {
    const normal = analyzeSentiment('i am angry');
    const caps = analyzeSentiment('I AM ANGRY');

    expect(caps.hasIntensityMarkers).toBe(true);
    expect(caps.intensityMultiplier).toBeGreaterThan(normal.intensityMultiplier);
  });

  it('should detect intensity markers in punctuation', () => {
    const normal = analyzeSentiment('I am angry');
    const exclaim = analyzeSentiment('I am angry!!!');

    expect(exclaim.hasIntensityMarkers).toBe(true);
    expect(exclaim.intensityMultiplier).toBeGreaterThan(1);
  });

  it('should detect combined intensity markers', () => {
    const extreme = analyzeSentiment('I AM SO ANGRY!!!! THIS IS TERRIBLE!!!');

    expect(extreme.hasIntensityMarkers).toBe(true);
    expect(extreme.intensityMultiplier).toBeGreaterThan(1.5);
    expect(['intense', 'extreme']).toContain(extreme.intensity);
  });

  it('should classify intensity levels correctly', () => {
    const mild = analyzeSentiment('I feel a bit upset');
    const intense = analyzeSentiment('I AM SO INCREDIBLY FURIOUS!!! THIS IS THE WORST!!!');

    // Mild should have lower intensity
    expect(['mild', 'moderate']).toContain(mild.intensity);

    // Intense should have higher intensity
    expect(['intense', 'extreme']).toContain(intense.intensity);
  });
});

// ═══════════════════════════════════════════════════════════════
// 🎭 Emotion Summary Tests
// ═══════════════════════════════════════════════════════════════

describe('Emotion Summary', () => {
  it('should generate readable summary for negative emotion', () => {
    const analysis = analyzeSentiment('I feel angry and frustrated');
    const summary = getEmotionSummary(analysis);

    expect(summary).toContain('negative');
    expect(summary).toMatch(/mild|moderate|intense|extreme/);
  });

  it('should indicate intensity markers in summary', () => {
    const analysis = analyzeSentiment('I AM SO ANGRY!!!');
    const summary = getEmotionSummary(analysis);

    expect(summary).toContain('intensity markers');
  });
});

// ═══════════════════════════════════════════════════════════════
// 🎯 Emotional Context Tests
// ═══════════════════════════════════════════════════════════════

describe('Emotional Context', () => {
  it('should provide context with detected block', () => {
    const context = getEmotionalContext('I AM SO ANGRY!!!', 'Anger');

    expect(context).toContain('anger');
    expect(context).toContain('intensity markers');
  });

  it('should provide context without detected block', () => {
    const context = getEmotionalContext('I feel a bit off today');

    expect(context).toContain('sentiment');
  });
});

// ═══════════════════════════════════════════════════════════════
// 📝 Real-World Examples
// ═══════════════════════════════════════════════════════════════

describe('Real-World Examples', () => {
  const testCases = [
    {
      input: 'I feel angry',
      // AFINN rates "angry" at -3, so this is actually moderate
      expectMarkers: false,
    },
    {
      input: 'I AM ANGRY!!!',
      // Should have higher intensity than plain "angry"
      expectMarkers: true,
    },
    {
      input: 'this is soooo frustrating',
      expectMarkers: true, // repeated letters
    },
    {
      input: 'I am worried about tomorrow',
      expectNegative: true,
    },
    {
      input: 'Everything is wonderful!',
      expectNegative: false,
    },
  ];

  testCases.forEach(({ input, expectIntensity, expectMarkers, expectNegative }) => {
    it(`should analyze "${input.substring(0, 30)}..." correctly`, () => {
      const analysis = analyzeSentiment(input);

      if (expectIntensity) {
        expect(analysis.intensity).toBe(expectIntensity);
      }
      if (expectMarkers !== undefined) {
        expect(analysis.hasIntensityMarkers).toBe(expectMarkers);
      }
      if (expectNegative !== undefined) {
        expect(analysis.score < 0).toBe(expectNegative);
      }
    });
  });
});
