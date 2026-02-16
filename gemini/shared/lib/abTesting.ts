/**
 * 🎭 The A/B Testing Arena - Where Responses Duel for User Favor ✨
 *
 * "Two responses enter, one response wins.
 * May the best wisdom prevail in this gladiatorial showdown!"
 *
 * In-memory storage for A/B test entries with FIFO eviction.
 * Tracks user preferences to help us understand which response
 * styles resonate best with our seekers of wisdom. 🏆
 *
 * - The A/B Testing Colosseum Director
 */

// 🎯 Maximum number of entries before we start evicting the elders
const MAX_ENTRIES = 100;

/**
 * 🏛️ A single A/B test entry - the record of a wisdom showdown
 *
 * Each entry captures the moment when two AI responses
 * stood before the user, awaiting judgment.
 */
export interface ABTestEntry {
  // 🆔 Unique identifier for this epic battle
  id: string;
  // ⏰ When this showdown began (ISO string)
  timestamp: string;
  // 💬 The user's original query that sparked this duel
  userQuery: string;
  // 🅰️ Response A - The first contender
  responseA: string;
  // 🅱️ Response B - The challenger
  responseB: string;
  // 🏆 The user's choice: 'A', 'B', or null if they walked away
  userChoice: 'A' | 'B' | null;
  // 📊 Additional metadata for the curious analyst
  metadata: ABTestMetadata;
}

/**
 * 🔮 Metadata for tracking experiment context
 *
 * Because sometimes you need to know if it was the model,
 * the temperature, or Mercury being in retrograde. 🌙
 */
export interface ABTestMetadata {
  // 🤖 Model used for response A (e.g., 'gpt-4o', 'gpt-4o-mini')
  modelA?: string;
  // 🤖 Model used for response B
  modelB?: string;
  // 🌡️ Temperature setting for A
  temperatureA?: number;
  // 🌡️ Temperature setting for B
  temperatureB?: number;
  // 📝 System prompt variant for A
  promptVariantA?: string;
  // 📝 System prompt variant for B
  promptVariantB?: string;
  // 🎭 Detected emotional block (anger, anxiety, etc.)
  detectedBlock?: string;
  // 🌶️ Sentiment intensity level
  sentimentIntensity?: 'mild' | 'moderate' | 'intense' | 'extreme';
  // ⏱️ Response time for A (ms)
  responseTimeA?: number;
  // ⏱️ Response time for B (ms)
  responseTimeB?: number;
  // 🔖 Custom tags for filtering
  tags?: string[];
  // 📦 Any extra data you want to stash
  [key: string]: unknown;
}

/**
 * 📊 Statistics from our A/B testing adventures
 *
 * The scoreboard of wisdom preference!
 */
export interface ABStats {
  // 📈 Total number of A/B tests conducted
  total: number;
  // ✅ Tests where user made a choice
  withChoice: number;
  // 🅰️ Times response A emerged victorious
  aWins: number;
  // 🅱️ Times response B claimed the crown
  bWins: number;
  // 🤷 Tests where user ghosted us (no choice)
  noChoice: number;
  // 📊 Win rate for A (percentage)
  aWinRate: number;
  // 📊 Win rate for B (percentage)
  bWinRate: number;
}

// 🏟️ The in-memory arena where all our battles are recorded
// FIFO eviction ensures we don't run out of memory - old battles fade into legend
let abTestStorage: ABTestEntry[] = [];

/**
 * 🎲 Generate a unique ID for each A/B test
 *
 * Uses timestamp + random suffix for uniqueness.
 * Like a gladiator getting their arena number. ⚔️
 */
function generateTestId(): string {
  const timestamp = Date.now().toString(36);
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `ab_${timestamp}_${randomSuffix}`;
}

/**
 * 📥 Store a new A/B test entry in our arena
 *
 * Records the battle for posterity. If we're at capacity,
 * the oldest battle is gracefully retired to make room. 🎭
 *
 * @param userQuery - The seeker's original question
 * @param responseA - The first wisdom offering
 * @param responseB - The alternative path of enlightenment
 * @param metadata - Extra context for the experiment
 * @returns The unique ID for this test entry
 *
 * @example
 * const testId = storeABTest(
 *   "How do I deal with anger?",
 *   "Take a deep breath and...",
 *   "Anger is a signal that...",
 *   { modelA: 'gpt-4o', modelB: 'gpt-4o-mini' }
 * );
 */
export function storeABTest(
  userQuery: string,
  responseA: string,
  responseB: string,
  metadata: ABTestMetadata = {}
): string {
  const id = generateTestId();

  const entry: ABTestEntry = {
    id,
    timestamp: new Date().toISOString(),
    userQuery,
    responseA,
    responseB,
    userChoice: null, // 🤔 Awaiting judgment...
    metadata,
  };

  // 🧹 FIFO eviction - if we're at capacity, remove the oldest entry
  // "The oldest battles become legends, but we can't keep all the scrolls"
  if (abTestStorage.length >= MAX_ENTRIES) {
    const evicted = abTestStorage.shift();
    if (evicted) {
      console.log(`🎭 A/B Arena: Evicted oldest entry ${evicted.id} to make room for new battles`);
    }
  }

  abTestStorage.push(entry);

  console.log(`🌟 A/B Arena: New test stored with ID ${id} (${abTestStorage.length}/${MAX_ENTRIES} slots used)`);

  return id;
}

/**
 * 🏆 Record the user's choice for an A/B test
 *
 * The moment of truth! The user has spoken,
 * and their preference shall be immortalized. 🎖️
 *
 * @param testId - The ID of the test to update
 * @param choice - The user's preference: 'A' or 'B'
 * @returns true if recorded successfully, false if test not found
 *
 * @example
 * const success = recordChoice('ab_lx3k2p_7f9m2', 'A');
 * if (success) {
 *   console.log('The people have spoken!');
 * }
 */
export function recordChoice(testId: string, choice: 'A' | 'B'): boolean {
  const entry = abTestStorage.find((e) => e.id === testId);

  if (!entry) {
    console.log(`🌩️ A/B Arena: Test ${testId} not found - perhaps it faded into legend?`);
    return false;
  }

  // 🎭 Record the verdict!
  const previousChoice = entry.userChoice;
  entry.userChoice = choice;

  if (previousChoice === null) {
    console.log(`🏆 A/B Arena: User chose ${choice} for test ${testId} - A champion emerges!`);
  } else {
    console.log(`🔄 A/B Arena: Choice updated from ${previousChoice} to ${choice} for test ${testId}`);
  }

  return true;
}

/**
 * 📊 Get comprehensive statistics from our A/B testing battles
 *
 * Returns the scoreboard: who's winning, who's losing,
 * and how many seekers walked away without choosing. 📈
 *
 * @returns Stats object with totals, wins, and percentages
 *
 * @example
 * const stats = getABStats();
 * console.log(`Response A wins ${stats.aWinRate}% of the time!`);
 */
export function getABStats(): ABStats {
  const total = abTestStorage.length;
  const withChoice = abTestStorage.filter((e) => e.userChoice !== null).length;
  const aWins = abTestStorage.filter((e) => e.userChoice === 'A').length;
  const bWins = abTestStorage.filter((e) => e.userChoice === 'B').length;
  const noChoice = total - withChoice;

  // 📐 Calculate win rates (avoid division by zero - math, not magic!)
  const aWinRate = withChoice > 0 ? Math.round((aWins / withChoice) * 100 * 10) / 10 : 0;
  const bWinRate = withChoice > 0 ? Math.round((bWins / withChoice) * 100 * 10) / 10 : 0;

  return {
    total,
    withChoice,
    aWins,
    bWins,
    noChoice,
    aWinRate,
    bWinRate,
  };
}

/**
 * 📤 Export all A/B test data for analysis
 *
 * Returns a copy of all entries. Perfect for when you want to
 * dump everything into a spreadsheet and find enlightenment
 * through pivot tables. 📊
 *
 * @returns Array of all A/B test entries (shallow copy)
 *
 * @example
 * const allData = exportABData();
 * const jsonData = JSON.stringify(allData, null, 2);
 * // Now go make beautiful charts!
 */
export function exportABData(): ABTestEntry[] {
  // 📋 Return a shallow copy so external modifications don't corrupt our arena
  return [...abTestStorage];
}

/**
 * 🔍 Get a specific A/B test entry by ID
 *
 * Sometimes you just need to revisit a particular battle.
 * Like watching game replays, but for AI responses. 🎬
 *
 * @param testId - The ID of the test to retrieve
 * @returns The entry if found, undefined otherwise
 */
export function getABTest(testId: string): ABTestEntry | undefined {
  return abTestStorage.find((e) => e.id === testId);
}

/**
 * 🗑️ Clear all A/B test data
 *
 * Nuclear option. Use with caution.
 * Sometimes you need a clean slate. 🧹
 *
 * @returns The number of entries that were cleared
 */
export function clearABData(): number {
  const count = abTestStorage.length;
  abTestStorage = [];
  console.log(`🧹 A/B Arena: Cleared ${count} entries - a fresh start awaits!`);
  return count;
}

/**
 * 📊 Get recent A/B tests (for dashboard display)
 *
 * Returns the most recent N entries, newest first.
 * Perfect for showing "Recent Experiments" in a UI. 🎭
 *
 * @param limit - Maximum number of entries to return (default: 10)
 * @returns Array of recent entries, newest first
 */
export function getRecentABTests(limit: number = 10): ABTestEntry[] {
  return abTestStorage.slice(-limit).reverse();
}

/**
 * 🔎 Filter A/B tests by metadata criteria
 *
 * Find all tests that match certain conditions.
 * Great for analyzing "did model X perform better for anger queries?"
 *
 * @param predicate - Filter function to apply
 * @returns Filtered array of matching entries
 *
 * @example
 * // Find all tests where gpt-4o was model A
 * const gpt4oTests = filterABTests(
 *   (entry) => entry.metadata.modelA === 'gpt-4o'
 * );
 */
export function filterABTests(predicate: (entry: ABTestEntry) => boolean): ABTestEntry[] {
  return abTestStorage.filter(predicate);
}

/**
 * 📈 Get win rate by metadata field
 *
 * Analyze which configurations perform best.
 * The data nerd's dream function. 🤓
 *
 * @param field - The metadata field to group by
 * @returns Map of field values to their win stats
 *
 * @example
 * const byModel = getWinRateByMetadata('modelA');
 * // { 'gpt-4o': { tests: 50, wins: 35, winRate: 70 }, ... }
 */
export function getWinRateByMetadata(
  field: keyof ABTestMetadata
): Map<string, { tests: number; wins: number; winRate: number }> {
  const stats = new Map<string, { tests: number; wins: number }>();

  for (const entry of abTestStorage) {
    const value = String(entry.metadata[field] ?? 'unknown');

    if (!stats.has(value)) {
      stats.set(value, { tests: 0, wins: 0 });
    }

    const current = stats.get(value)!;
    current.tests++;

    // 🏆 Count as a win for A's configuration if A won
    if (entry.userChoice === 'A') {
      current.wins++;
    }
  }

  // 📊 Calculate win rates
  const result = new Map<string, { tests: number; wins: number; winRate: number }>();

  for (const [key, { tests, wins }] of stats) {
    result.set(key, {
      tests,
      wins,
      winRate: tests > 0 ? Math.round((wins / tests) * 100 * 10) / 10 : 0,
    });
  }

  return result;
}

/**
 * 🎯 Get the current storage capacity info
 *
 * How full is our arena? Are we about to start evicting?
 *
 * @returns Current usage stats
 */
export function getStorageInfo(): { used: number; max: number; percentFull: number } {
  return {
    used: abTestStorage.length,
    max: MAX_ENTRIES,
    percentFull: Math.round((abTestStorage.length / MAX_ENTRIES) * 100),
  };
}
