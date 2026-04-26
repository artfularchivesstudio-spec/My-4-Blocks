/**
 * 🔑 The Keyword Alchemist - Text-Based Search Engine ✨
 *
 * "Sometimes the simplest paths lead to wisdom.
 * Words match words, and meaning finds its way."
 *
 * - The Lexical Search Virtuoso
 */

import type { EmbeddedChunk, ScoredChunk } from "./types";

/**
 * 🚫 Common stopwords to filter out
 * These words appear everywhere and don't help with relevance.
 * (We keep "should" since it's significant in the Four Blocks context!)
 */
const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
  "be", "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "may", "might", "must", "can", "this", "that", "these", "those",
  "it", "its", "you", "he", "she", "we", "they", "my", "your", "our",
  "their", "what", "which", "who", "whom", "how", "why", "when", "where",
  "all", "any", "both", "each", "few", "more", "most", "other", "some",
  "such", "than", "too", "very", "just", "only", "also", "even", "still",
  "about", "after", "before", "between", "into", "through", "during", "again",
  "then", "once", "here", "there", "so", "if", "because", "while", "although",
  "though", "unless", "until", "whether", "not", "no", "nor", "now", "out",
  "over", "own", "same", "up", "down", "off", "much", "many", "get", "got",
  "like", "know", "think", "feel", "time", "way", "thing", "things"
]);

/**
 * 🎯 Emotion-related keywords that get bonus weight (2x)
 * These words signal emotional content - the juicy stuff! 🌶️
 */
const EMOTION_KEYWORDS = new Set([
  // 😠 Anger signals
  "anger", "angry", "rage", "furious", "frustrated", "irritated", "mad",
  "annoyed", "resentful", "hostile", "hate", "pissed", "demand", "demands",
  // 😰 Anxiety signals
  "anxiety", "anxious", "worry", "worried", "fear", "scared", "nervous",
  "panic", "dread", "terrified", "uncertain", "catastrophe", "awful",
  // 😢 Depression signals
  "depression", "depressed", "sad", "hopeless", "stuck", "worthless",
  "empty", "numb", "despair", "meaningless", "pointless",
  // 😔 Guilt signals
  "guilt", "guilty", "shame", "ashamed", "regret", "blame", "fault",
  // 📚 Four Blocks concepts
  "belief", "beliefs", "irrational", "rational", "dispute", "disputing",
  "abc", "activating", "consequence", "thoughts", "emotions", "feelings",
  "should", "must", "narrator", "observer", "blocks", "four"
]);

/**
 * 🔄 Word form expansions - normalize to base form + related terms
 * "angry" → also search "anger", "anxious" → also search "anxiety", etc.
 * This handles the "angry" vs "anger" problem! 🧠
 */
const WORD_EXPANSIONS: Record<string, string[]> = {
  // Anger family
  "angry": ["anger", "angry"],
  "anger": ["anger", "angry"],
  "mad": ["anger", "mad"],
  "furious": ["anger", "furious"],
  "frustrated": ["frustration", "frustrated", "anger"],
  // Anxiety family
  "anxious": ["anxiety", "anxious"],
  "anxiety": ["anxiety", "anxious"],
  "worried": ["worry", "worried", "anxiety"],
  "worry": ["worry", "worried", "anxiety"],
  "scared": ["fear", "scared", "anxiety"],
  "fear": ["fear", "scared", "anxiety"],
  "nervous": ["nervous", "anxiety"],
  // Depression family
  "depressed": ["depression", "depressed"],
  "depression": ["depression", "depressed"],
  "sad": ["sad", "depression", "sadness"],
  "hopeless": ["hopeless", "depression", "hopelessness"],
  // Guilt family
  "guilty": ["guilt", "guilty"],
  "guilt": ["guilt", "guilty"],
  "ashamed": ["shame", "ashamed", "guilt"],
  "shame": ["shame", "ashamed", "guilt"],
};

/**
 * 🔮 Expand a search term to include related word forms
 */
function expandTerm(term: string): string[] {
  return WORD_EXPANSIONS[term] || [term];
}

/**
 * 🌟 Perform keyword-based search on chunks
 *
 * Simple but effective term-frequency scoring.
 * Matches against content, title, keywords, and tags.
 * Now with stopword filtering and emotion boosting! 🎭
 */
export function keywordSearch(
  query: string,
  allChunks: EmbeddedChunk[],
  topK: number = 5
): ScoredChunk[] {
  // 🎨 Tokenize, strip punctuation, filter stopwords
  const rawTerms = query
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // 🧹 Remove punctuation (but ANGRY!!!! still matched "angry")
    .split(/\s+/)
    .filter((term) => term.length > 2 && !STOPWORDS.has(term));

  if (rawTerms.length === 0) {
    console.log("🌙 No meaningful search terms found");
    return [];
  }

  // 🔄 Expand terms to include word form variations (angry → anger, etc.)
  const searchTerms = [...new Set(rawTerms.flatMap(expandTerm))];

  console.log(`🔑 Searching for keywords: ${searchTerms.join(", ")}`);

  // 🌊 Score each chunk based on term matches
  const scoredChunks: ScoredChunk[] = allChunks.map((chunk) => {
    let score = 0;

    // 📖 Combine searchable text from multiple fields
    const contentLower = chunk.text.toLowerCase();
    const titleLower = (chunk.metadata?.title ?? "").toLowerCase();
    const keywordsStr = (chunk.metadata?.keywords ?? []).join(" ").toLowerCase();
    const tagsStr = (chunk.metadata?.tags ?? []).join(" ").toLowerCase();

    for (const term of searchTerms) {
      // 🌶️ Emotion keywords get 2x multiplier - they're the spicy stuff!
      const emotionMultiplier = EMOTION_KEYWORDS.has(term) ? 2 : 1;

      // 🎯 Content matches (base score)
      if (contentLower.includes(term)) {
        score += 1 * emotionMultiplier;
        // 🌟 Bonus for multiple occurrences
        const occurrences = contentLower.split(term).length - 1;
        score += Math.min(occurrences * 0.1, 0.5);
      }

      // 💎 Title matches (2x weight - titles are important!)
      if (titleLower.includes(term)) {
        score += 2 * emotionMultiplier;
      }

      // 🔮 Keyword matches (1.5x weight - curated terms)
      if (keywordsStr.includes(term)) {
        score += 1.5 * emotionMultiplier;
      }

      // 🏷️ Tag matches (1.5x weight)
      if (tagsStr.includes(term)) {
        score += 1.5 * emotionMultiplier;
      }
    }

    return {
      chunk,
      score,
      matchType: "keyword" as const,
    };
  });

  // 📊 Filter and sort by score
  const results = scoredChunks
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  console.log(`🔑 Found ${results.length} keyword matches`);
  return results;
}

/**
 * 🎭 Detect emotional block from query text
 *
 * Attempts to identify which of the Four Blocks
 * the user might be asking about. Returns undefined
 * if no clear block is detected.
 */
export function detectBlockFromQuery(query: string): string | undefined {
  const queryLower = query.toLowerCase();

  // 🎨 Block detection patterns - expanded for natural language
  const blockPatterns: Record<string, string[]> = {
    Anger: [
      "anger", "angry", "rage", "furious", "frustrated", "irritated", "mad",
      "annoyed", "resentful", "hostile", "hate", "pissed"
    ],
    Anxiety: [
      "anxiety", "anxious", "worry", "worried", "fear", "scared", "nervous", "panic",
      "what if", "dread", "terrified", "uneasy", "apprehensive", "can't stand",
      "something bad", "future", "uncertain"
    ],
    Depression: [
      "depression", "depressed", "sad", "hopeless", "stuck", "unmotivated", "down",
      "worthless", "nothing matters", "pointless", "empty", "numb", "despair",
      "meaningless", "no point", "give up"
    ],
    Guilt: [
      "guilt", "guilty", "shame", "ashamed", "regret", "mistake", "should have",
      "shouldn't have", "my fault", "blame myself", "wrong", "apologize"
    ],
  };

  for (const [block, patterns] of Object.entries(blockPatterns)) {
    if (patterns.some((pattern) => queryLower.includes(pattern))) {
      console.log(`🎭 Detected emotional block: ${block}`);
      return block;
    }
  }

  return undefined;
}
