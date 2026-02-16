/**
 * 🏆 The Choice Recorder - Where Preferences Become Immortal Data ✨
 *
 * "In the grand arena of AI responses, every choice matters.
 * Every preference is a vote for better wisdom.
 * We're the humble scribes documenting history as it unfolds."
 *
 * This endpoint records which response the user crowned champion
 * and serves up delicious statistics for the data-hungry among us.
 * Democracy in action, one A/B test at a time! 🗳️
 *
 * - The Preference Archivist of Claude's Domain
 */

import {
  recordChoice,
  getABStats,
  type ABStats,
} from '@shared/lib/abTesting';

/**
 * 🎯 POST Handler - Record the User's Sacred Choice
 *
 * When a seeker of wisdom crowns their champion response,
 * we immortalize that decision in our in-memory halls of fame.
 * (Or at least until the server restarts... such is the ephemeral nature of glory!) 🏛️
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { testId, winner, timestamp, metadata } = body;

    // 🔍 Validate the incoming payload - we're sticklers for good data hygiene!
    if (!testId || typeof testId !== 'string') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing or invalid testId - every gladiatorial battle needs an identifier!',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (winner !== 'A' && winner !== 'B') {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Winner must be 'A' or 'B' - this is a two-horse race, partner! 🐴🐴",
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 🏆 Record the choice - let the trumpets sound!
    const success = recordChoice(testId, winner);

    if (!success) {
      // 🌩️ Test not found - perhaps it faded into the mists of time
      return new Response(
        JSON.stringify({
          success: false,
          error: 'A/B test not found - this battle may have already passed into legend',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 📊 Fetch fresh stats after recording the verdict
    const stats = getABStats();

    console.log(`🎉 ✨ CHOICE RECORDED! User crowned Response ${winner} for test ${testId}`);
    console.log(`📊 Current scoreboard: A wins ${stats.aWins} | B wins ${stats.bWins} | Total: ${stats.total}`);

    // 🎁 Return success with the latest standings
    return new Response(
      JSON.stringify({
        success: true,
        winner,
        testId,
        stats,
        message: `Response ${winner} has been crowned champion! May their wisdom reign supreme! 🏆`,
        recordedAt: timestamp || new Date().toISOString(),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (creativeChallenge: unknown) {
    // 🌩️ Something went wrong - but the show must go on!
    const errorMessage = creativeChallenge instanceof Error
      ? creativeChallenge.message
      : String(creativeChallenge);

    console.error(`🌩️ Temporary setback recording choice: ${errorMessage}`);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Our preference recorder is taking a brief intermission',
        message: errorMessage,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * 📊 GET Handler - Summon the Statistics Oracle
 *
 * For the data-driven souls who crave insight into
 * how the great response showdown is unfolding.
 * Come one, come all, and witness the numbers! 🌟
 */
export async function GET() {
  try {
    const stats: ABStats = getABStats();

    console.log('📊 ✨ A/B STATS ORACLE CONSULTED');
    console.log(`🎭 Total tests: ${stats.total}`);
    console.log(`✅ With choices: ${stats.withChoice}`);
    console.log(`🅰️ A wins: ${stats.aWins} (${stats.aWinRate}%)`);
    console.log(`🅱️ B wins: ${stats.bWins} (${stats.bWinRate}%)`);

    // 🎁 Return the full statistical tapestry
    return new Response(
      JSON.stringify({
        success: true,
        stats,
        insights: generateInsights(stats),
        retrievedAt: new Date().toISOString(),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (creativeChallenge: unknown) {
    // 🌩️ The oracle is having a moment
    const errorMessage = creativeChallenge instanceof Error
      ? creativeChallenge.message
      : String(creativeChallenge);

    console.error(`🌩️ Temporary setback fetching stats: ${errorMessage}`);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Our statistics oracle is meditating - please try again shortly',
        message: errorMessage,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * 🔮 Generate Human-Readable Insights from Raw Stats
 *
 * Because raw numbers are like uncooked ingredients -
 * nutritious but not exactly appetizing. Let's cook! 👨‍🍳
 * We transform data into wisdom, one insight at a time.
 */
function generateInsights(stats: ABStats): string[] {
  const insights: string[] = [];

  // 📊 Total participation - how crowded is our arena?
  if (stats.total === 0) {
    insights.push('No A/B tests have been conducted yet. The arena awaits its first challengers!');
  } else {
    insights.push(`${stats.total} total A/B tests have been conducted in this session.`);
  }

  // 🎯 Engagement metrics - are the people participating?
  if (stats.total > 0) {
    const participationRate = Math.round((stats.withChoice / stats.total) * 100);
    if (participationRate >= 80) {
      insights.push(`Exceptional engagement! ${participationRate}% of users rendered a verdict.`);
    } else if (participationRate >= 50) {
      insights.push(`Solid engagement: ${participationRate}% of users made their choice known.`);
    } else if (participationRate > 0) {
      insights.push(`${participationRate}% participation rate - room to grow!`);
    }
  }

  // 🏆 Champion determination - who's winning the hearts?
  if (stats.withChoice > 0) {
    if (stats.aWinRate > 60) {
      insights.push(`Response A (Structured) is dominating with ${stats.aWinRate}% preference!`);
    } else if (stats.bWinRate > 60) {
      insights.push(`Response B (Conversational) is winning hearts with ${stats.bWinRate}% preference!`);
    } else if (stats.withChoice >= 5) {
      insights.push(`Neck and neck! A: ${stats.aWinRate}% vs B: ${stats.bWinRate}% - every vote counts!`);
    } else {
      insights.push('Still early days - gathering more wisdom before drawing conclusions.');
    }
  }

  // 🎭 Style preference narrative
  if (stats.aWins > stats.bWins && stats.withChoice >= 3) {
    insights.push('Users appear to favor the structured, step-by-step guidance style.');
  } else if (stats.bWins > stats.aWins && stats.withChoice >= 3) {
    insights.push('Users appear to favor the warm, conversational coaching style.');
  }

  return insights;
}
