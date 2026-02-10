/**
 * 🎭 Type Declaration for 'sentiment' package
 *
 * "When TypeScript demands papers, we provide them with flair."
 *
 * - The Type Declaration Bureaucrat
 */

declare module 'sentiment' {
  interface SentimentOptions {
    extras?: Record<string, number>;
    language?: string;
  }

  interface SentimentResult {
    score: number;
    comparative: number;
    calculation: Array<{ [key: string]: number }>;
    tokens: string[];
    words: string[];
    positive: string[];
    negative: string[];
  }

  class Sentiment {
    constructor(options?: SentimentOptions);
    analyze(phrase: string, options?: SentimentOptions): SentimentResult;
    registerLanguage(languageCode: string, language: object): void;
  }

  export = Sentiment;
}
