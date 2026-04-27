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

import { supabase } from '../../lib/supabase';

/**
 * 🎭 An A/B Test Entry - The record of a cosmic fork in the road
 */
export interface ABTestEntry {
  id: string;
  created_at: string;
  user_query: string;
  response_a: string;
  response_b: string;
  user_choice: 'A' | 'B' | null;
  metadata?: any;
}

// 🌟 Local cache for immediate access (max 20 entries)
let abTestCache: ABTestEntry[] = [];
const MAX_CACHE = 20;

/**
 * 🎭 Store a new A/B test entry
 *
 * Records the dual responses for later analysis in Supabase.
 *
 * @param entry - The A/B test data
 * @returns The unique ID for this test entry
 */
export async function storeABTest(entry: {
  userQuery: string;
  responseA: string;
  responseB: string;
  userChoice?: 'A' | 'B' | null;
  metadata?: any;
}): Promise<string> {
  const id = `ab_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const timestamp = new Date().toISOString();

  const dbEntry = {
    id,
    user_query: entry.userQuery,
    response_a: entry.responseA,
    response_b: entry.responseB,
    user_choice: entry.userChoice || null,
    metadata: entry.metadata || {},
    created_at: timestamp,
  };

  // 🏛️ Persist to Supabase
  try {
    const { error } = await supabase.from('ab_tests').insert([dbEntry]);
    if (error) {
      console.warn('⚠️ Supabase error storing A/B test:', error.message);
    } else {
      console.log(`🧪 ✨ A/B test persisted to Supabase: ${id}`);
    }
  } catch (err) {
    console.error('💥 Unexpected error storing A/B test:', err);
  }

  // 🌊 Update local cache (FIFO)
  const cacheEntry: ABTestEntry = {
    id,
    created_at: timestamp,
    user_query: entry.userQuery,
    response_a: entry.responseA,
    response_b: entry.responseB,
    user_choice: entry.userChoice || null,
    metadata: entry.metadata,
  };

  abTestCache.unshift(cacheEntry);
  if (abTestCache.length > MAX_CACHE) {
    abTestCache.pop();
  }

  return id;
}

/**
 * 🎯 Record user's choice
 */
export async function recordChoice(id: string, choice: 'A' | 'B'): Promise<boolean> {
  // 🏛️ Update Supabase
  try {
    const { error } = await supabase
      .from('ab_tests')
      .update({ user_choice: choice })
      .eq('id', id);
    
    if (error) {
      console.warn('⚠️ Supabase error recording choice:', error.message);
    }
  } catch (err) {
    console.error('💥 Unexpected error recording choice:', err);
  }

  // 🌊 Update local cache if present
  const entry = abTestCache.find((e) => e.id === id);
  if (entry) {
    entry.user_choice = choice;
  }

  console.log(`🎉 ✨ User chose response ${choice} for ${id}!`);
  return true;
}

/**
 * 📊 Get A/B test statistics
 */
export async function getABStats() {
  try {
    const { data, error } = await supabase
      .from('ab_tests')
      .select('user_choice');

    if (error) throw error;

    const withChoice = data?.filter((e) => e.user_choice !== null) || [];
    const aWins = withChoice.filter((e) => e.user_choice === 'A').length;
    const bWins = withChoice.filter((e) => e.user_choice === 'B').length;

    const aWinPercentage = withChoice.length > 0 ? Math.round((aWins / withChoice.length) * 100) : 0;
    const bWinPercentage = withChoice.length > 0 ? Math.round((bWins / withChoice.length) * 100) : 0;

    return {
      total: data?.length || 0,
      withChoice: withChoice.length,
      aWins,
      bWins,
      aWinPercentage,
      bWinPercentage,
    };
  } catch (err) {
    console.error('💥 Error fetching A/B stats:', err);
    return {
      total: 0,
      withChoice: 0,
      aWins: 0,
      bWins: 0,
      aWinPercentage: 0,
      bWinPercentage: 0,
    };
  }
}
