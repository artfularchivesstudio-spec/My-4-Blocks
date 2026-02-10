/**
 * 🎭 The Sentiment Alchemist - Emotion Intensity Detection ✨
 *
 * "ANGRY!!!! speaks louder than 'angry',
 * and this module hears the difference."
 *
 * Uses AFINN-based sentiment analysis to detect emotional intensity.
 * Complements our rule-based block detection with nuance! 🌶️
 *
 * - The Emotion Intensity Virtuoso
 */

import Sentiment from 'sentiment';

// 🔮 Initialize the sentiment analyzer
const sentiment = new Sentiment();

/**
 * 🌟 Sentiment analysis result with our custom emotional context
 */
export interface EmotionAnalysis {
  // 📊 Raw sentiment score (-5 to +5 scale, aggregated)
  score: number;
  // 📈 Comparative score (normalized by word count)
  comparative: number;
  // 🎭 Detected emotional intensity level
  intensity: 'mild' | 'moderate' | 'intense' | 'extreme';
  // 😤 Whether the text shows frustration markers (caps, punctuation)
  hasIntensityMarkers: boolean;
  // 🔥 Intensity multiplier based on caps/punctuation
  intensityMultiplier: number;
  // 📝 Positive words found
  positiveWords: string[];
  // 📝 Negative words found
  negativeWords: string[];
}

/**
 * 🌶️ Detect intensity markers like CAPS and excessive punctuation
 *
 * "ANGRY!!!!" → high intensity
 * "angry" → normal intensity
 */
function detectIntensityMarkers(text: string): { hasMarkers: boolean; multiplier: number } {
  let multiplier = 1.0;

  // 🔥 Check for ALL CAPS words (3+ chars)
  const capsWords = text.match(/\b[A-Z]{3,}\b/g) || [];
  if (capsWords.length > 0) {
    multiplier += 0.3 * Math.min(capsWords.length, 3); // Up to 0.9 boost
  }

  // ❗ Check for excessive punctuation (!!!, ???, etc.)
  const excessivePunctuation = text.match(/[!?]{2,}/g) || [];
  if (excessivePunctuation.length > 0) {
    multiplier += 0.2 * Math.min(excessivePunctuation.length, 3); // Up to 0.6 boost
  }

  // 😤 Check for repeated letters (soooo, nooooo)
  const repeatedLetters = text.match(/(.)\1{2,}/g) || [];
  if (repeatedLetters.length > 0) {
    multiplier += 0.1 * Math.min(repeatedLetters.length, 3); // Up to 0.3 boost
  }

  return {
    hasMarkers: multiplier > 1.0,
    multiplier: Math.min(multiplier, 2.5), // Cap at 2.5x
  };
}

/**
 * 🎯 Convert raw score to intensity level
 */
function scoreToIntensity(score: number, multiplier: number): EmotionAnalysis['intensity'] {
  const adjustedScore = Math.abs(score) * multiplier;

  if (adjustedScore < 2) return 'mild';
  if (adjustedScore < 5) return 'moderate';
  if (adjustedScore < 10) return 'intense';
  return 'extreme';
}

/**
 * 🔮 Analyze text for emotional sentiment and intensity
 *
 * @param text - The text to analyze
 * @returns Detailed emotion analysis with intensity metrics
 *
 * @example
 * analyzeSentiment("I'm so angry!!!")
 * // → { intensity: 'intense', hasIntensityMarkers: true, ... }
 *
 * analyzeSentiment("I feel a bit upset")
 * // → { intensity: 'mild', hasIntensityMarkers: false, ... }
 */
export function analyzeSentiment(text: string): EmotionAnalysis {
  // 🎭 Run AFINN-based analysis
  const result = sentiment.analyze(text);

  // 🌶️ Check for intensity markers
  const { hasMarkers, multiplier } = detectIntensityMarkers(text);

  return {
    score: result.score,
    comparative: result.comparative,
    intensity: scoreToIntensity(result.score, multiplier),
    hasIntensityMarkers: hasMarkers,
    intensityMultiplier: multiplier,
    positiveWords: result.positive,
    negativeWords: result.negative,
  };
}

/**
 * 🌟 Quick check if text expresses negative emotion
 */
export function isNegative(text: string): boolean {
  const result = sentiment.analyze(text);
  return result.score < 0;
}

/**
 * 🌟 Quick check if text expresses positive emotion
 */
export function isPositive(text: string): boolean {
  const result = sentiment.analyze(text);
  return result.score > 0;
}

/**
 * 🎭 Get a human-readable summary of the emotion
 */
export function getEmotionSummary(analysis: EmotionAnalysis): string {
  const direction = analysis.score < 0 ? 'negative' : analysis.score > 0 ? 'positive' : 'neutral';
  const markers = analysis.hasIntensityMarkers ? ' (with intensity markers!)' : '';

  return `${analysis.intensity} ${direction} sentiment${markers}`;
}

/**
 * 🔥 Enhance block detection with intensity information
 *
 * Combines our rule-based block detection with sentiment intensity
 * to provide richer context for the AI response.
 */
export function getEmotionalContext(text: string, detectedBlock?: string): string {
  const analysis = analyzeSentiment(text);

  if (!detectedBlock) {
    return `User sentiment: ${getEmotionSummary(analysis)}`;
  }

  const intensityDesc = {
    'mild': 'showing mild signs of',
    'moderate': 'experiencing moderate',
    'intense': 'expressing strong',
    'extreme': 'expressing very intense',
  }[analysis.intensity];

  return `User is ${intensityDesc} ${detectedBlock.toLowerCase()}. ${
    analysis.hasIntensityMarkers
      ? 'Their message shows intensity markers (caps/punctuation) suggesting heightened emotional state.'
      : ''
  }`;
}
