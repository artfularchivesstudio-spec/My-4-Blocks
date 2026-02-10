/**
 * 🎭 Type declarations for the sentiment package
 *
 * The sentiment package doesn't have built-in types,
 * so we declare them here for TypeScript happiness! 🌈
 */

declare module 'sentiment' {
  interface SentimentResult {
    /** Overall sentiment score (can be positive, negative, or zero) */
    score: number;
    /** Score normalized by word count */
    comparative: number;
    /** Words that contributed positively */
    positive: string[];
    /** Words that contributed negatively */
    negative: string[];
    /** All tokens from the input */
    tokens: string[];
    /** Words from input */
    words: string[];
  }

  interface SentimentOptions {
    /** Custom words/scores to add to AFINN */
    extras?: Record<string, number>;
    /** Language to use (default: 'en') */
    language?: string;
  }

  class Sentiment {
    constructor(options?: SentimentOptions);
    analyze(text: string, options?: SentimentOptions): SentimentResult;
    registerLanguage(
      languageCode: string,
      language: { labels: Record<string, number> }
    ): void;
  }

  export = Sentiment;
}
