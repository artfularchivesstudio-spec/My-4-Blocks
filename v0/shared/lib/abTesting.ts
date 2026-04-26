/**
 * 🧪 The A/B Testing Laboratory - Response Comparison ✨
 *
 * "Two paths diverged in a prompt,
 * and the user chose the better road."
 *
 * Stores comparison data for improving responses.
 * Like a scientist's notebook, but for feelings! 📓🔬
 *
 * - The A/B Testing Alchemist
 */

/**
 * 🎭 An A/B Test Entry - The record of a cosmic fork in the road
 */
export interface ABTestEntry {
  id: string;
  timestamp: Date;
  userQuery: string;
  responseA: string;
  responseB: string;
  userChoice: 'A' | 'B' | null;
  metadata?: {
    emotionDetected?: string;
    blockType?: string;
    modelA?: string;
    modelB?: string;
  };
}

// 🌟 In-memory storage (max 100 entries, FIFO)
// Like a goldfish's memory, but intentionally so! 🐠
const MAX_ENTRIES = 100;
let abTestData: ABTestEntry[] = [];

/**
 * 🎭 Store a new A/B test entry
 *
 * Records the dual responses for later analysis.
 * The user's choice will be added later via recordChoice().
 *
 * @param entry - The A/B test data (minus id and timestamp, we generate those)
 * @returns The unique ID for this test entry
 */
export function storeABTest(entry: Omit<ABTestEntry, 'id' | 'timestamp'>): string {
  const id = `ab_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const fullEntry: ABTestEntry = {
    ...entry,
    id,
    timestamp: new Date(),
    userChoice: null,
  };

  // 🌊 FIFO: Remove oldest if at capacity
  // The circle of test life continues...
  if (abTestData.length >= MAX_ENTRIES) {
    abTestData.shift();
    console.log('🌙 ⚠️ A/B storage at capacity, removed oldest entry (FIFO style!)');
  }

  abTestData.push(fullEntry);
  console.log(`🧪 ✨ A/B test stored: ${id}`);

  return id;
}

/**
 * 🎯 Record user's choice
 *
 * When the user picks their preferred response, we note it here.
 * Like recording which fork they took in the road! 🍴
 *
 * @param id - The A/B test ID
 * @param choice - 'A' or 'B'
 * @returns true if found and updated, false if not found
 */
export function recordChoice(id: string, choice: 'A' | 'B'): boolean {
  const entry = abTestData.find((e) => e.id === id);
  if (!entry) {
    console.log(`🔍 A/B test ${id} not found - perhaps it was too old? (FIFO life)`);
    return false;
  }

  entry.userChoice = choice;
  console.log(`🎉 ✨ User chose response ${choice} for ${id}! The people have spoken!`);

  return true;
}

/**
 * 📊 Get A/B test statistics
 *
 * Returns the current state of our cosmic experiment.
 * Which path do seekers prefer? The data knows! 📈
 *
 * @returns Statistics about all recorded A/B tests
 */
export interface ABStats {
  total: number;
  withChoice: number;
  aWins: number;
  bWins: number;
  aWinPercentage: number;
  bWinPercentage: number;
  /** Alias for aWinPercentage */
  aWinRate: number;
  /** Alias for bWinPercentage */
  bWinRate: number;
}

export function getABStats(): ABStats {
  const withChoice = abTestData.filter((e) => e.userChoice !== null);
  const aWins = withChoice.filter((e) => e.userChoice === 'A').length;
  const bWins = withChoice.filter((e) => e.userChoice === 'B').length;

  const aWinPercentage = withChoice.length > 0 ? Math.round((aWins / withChoice.length) * 100) : 0;
  const bWinPercentage = withChoice.length > 0 ? Math.round((bWins / withChoice.length) * 100) : 0;

  return {
    total: abTestData.length,
    withChoice: withChoice.length,
    aWins,
    bWins,
    aWinPercentage,
    bWinPercentage,
    aWinRate: aWinPercentage,
    bWinRate: bWinPercentage,
  };
}

/**
 * 💾 Export all A/B data (for analysis)
 *
 * Returns a copy of all test data for external analysis.
 * Great for spreadsheet wizards and data scientists! 📊
 *
 * @returns A copy of all A/B test entries
 */
export function exportABData(): ABTestEntry[] {
  return [...abTestData];
}

/**
 * 🔍 Get a specific A/B test by ID
 *
 * Sometimes you need to revisit a specific fork in the road.
 *
 * @param id - The A/B test ID
 * @returns The test entry or undefined if not found
 */
export function getABTest(id: string): ABTestEntry | undefined {
  return abTestData.find((e) => e.id === id);
}

/**
 * 🧹 Clear all A/B test data (for testing purposes)
 *
 * Wipes the slate clean. Use responsibly! 🧼
 */
export function clearABData(): void {
  abTestData = [];
  console.log('🧹 ✨ A/B test data cleared - fresh start!');
}
