/**
 * 🏆 The Choice Recorder - Where Preferences Become Data ✨
 *
 * "Every choice tells a story.
 * Every preference reveals a truth.
 * We're just here to listen and remember."
 *
 * This endpoint records which response the user preferred
 * and serves up statistics for the curious data nerds among us.
 * It's democracy, but for AI responses! 🗳️
 *
 * V0 Variant Edition - Because even robots need validation sometimes.
 *
 * - The Preference Archivist
 */

import {
  recordChoice,
  getABStats,
  type ABStats,
} from '@shared/lib/abTesting';

/**
 * 🎯 POST Handler - Record User's Choice
 *
 * When the user crowns their champion response,
 * we immortalize that decision forever (or until server restart).
 * The people have spoken! 📣
 *
 * Expected body: { testId: string, winner: 'A' | 'B' }
 * Also accepts legacy format: { abTestId: string, choice: 'A' | 'B' }
 *
 * @param req - The incoming request with the user's verdict
 * @returns JSON response with success status and updated stats
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🎭 Support both naming conventions - we're flexible like that!
    // New format: testId/winner | Legacy format: abTestId/choice
    const testId = body.testId || body.abTestId;
    const winner = body.winner || body.choice;

    // 🔍 Validate the incoming data - garbage in, garbage out!
    if (!testId || typeof testId !== 'string') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing or invalid testId - every battle needs an ID!',
          hint: 'Please provide testId (string) in the request body',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (winner !== 'A' && winner !== 'B') {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Winner must be 'A' or 'B' - there are only two contenders!",
          hint: "Please provide winner: 'A' or 'B' in the request body",
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 🏆 Record the choice - let the victory be known!
    const success = recordChoice(testId, winner);

    if (!success) {
      // 🌩️ Test not found - maybe it faded into legend
      return new Response(
        JSON.stringify({
          success: false,
          error: 'A/B test not found - this battle may have faded into history',
          testId,
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 📊 Fetch fresh stats after recording
    const stats = getABStats();

    console.log(
      `🎉 ✨ CHOICE RECORDED! User chose Response ${winner} for ${testId}`
    );
    console.log(
      `📊 Current standings: A wins ${stats.aWins} | B wins ${stats.bWins} | Total: ${stats.total}`
    );

    // 🎁 Return success with updated stats
    return new Response(
      JSON.stringify({
        success: true,
        winner,
        testId,
        stats,
        message: `Response ${winner} has been crowned the champion! 🏆`,
        recordedAt: new Date().toISOString(),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (creativeChallenge: unknown) {
    const errorMessage =
      creativeChallenge instanceof Error
        ? creativeChallenge.message
        : 'Unknown error occurred';

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
 * 📊 GET Handler - Fetch A/B Testing Statistics
 *
 * For the data-driven among us who want to see
 * how the battle for best response style is going.
 * Spoiler: everyone's a winner in the pursuit of better AI! 🌟
 *
 * @returns JSON response with stats and human-readable insights
 */
export async function GET() {
  try {
    const stats: ABStats = getABStats();

    console.log('📊 ✨ A/B STATS REQUESTED');
    console.log(`🎭 Total tests: ${stats.total}`);
    console.log(`✅ With choices: ${stats.withChoice}`);
    console.log(`🅰️ A wins: ${stats.aWins} (${stats.aWinRate}%)`);
    console.log(`🅱️ B wins: ${stats.bWins} (${stats.bWinRate}%)`);

    // 🎁 Return the full statistical picture
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
    const errorMessage =
      creativeChallenge instanceof Error
        ? creativeChallenge.message
        : 'Unknown error occurred';

    console.error(`🌩️ Temporary setback fetching stats: ${errorMessage}`);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Our statistician is taking a coffee break',
        message: errorMessage,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * 🔮 Generate human-readable insights from stats
 *
 * Because raw numbers are boring, but narratives are compelling.
 * We're turning data into wisdom, one insight at a time! 📈
 *
 * Think of this as the fortune teller of A/B testing -
 * except we use math instead of crystal balls. 🔮✨
 *
 * @param stats - The raw statistics from our A/B testing arena
 * @returns Array of insight strings for human consumption
 */
function generateInsights(stats: ABStats): string[] {
  const insights: string[] = [];

  // 📊 Total participation - how much gladiatorial action have we seen?
  if (stats.total === 0) {
    insights.push('No A/B tests have been conducted yet. The arena awaits!');
  } else {
    insights.push(`${stats.total} total A/B tests have been conducted.`);
  }

  // 🎯 Participation rate - are users actually making choices?
  if (stats.total > 0) {
    const participationRate = Math.round(
      (stats.withChoice / stats.total) * 100
    );
    if (participationRate >= 80) {
      insights.push(
        `Excellent engagement! ${participationRate}% of users made a choice.`
      );
    } else if (participationRate >= 50) {
      insights.push(
        `Good engagement: ${participationRate}% of users made a choice.`
      );
    } else if (participationRate > 0) {
      insights.push(
        `${participationRate}% participation - room for improvement!`
      );
    }
  }

  // 🏆 Winner determination - who's taking home the crown?
  if (stats.withChoice > 0) {
    if (stats.aWinRate > 60) {
      insights.push(
        `Response A (Structured) is clearly winning with ${stats.aWinRate}% preference!`
      );
    } else if (stats.bWinRate > 60) {
      insights.push(
        `Response B (Conversational) is clearly winning with ${stats.bWinRate}% preference!`
      );
    } else if (stats.withChoice >= 5) {
      insights.push(
        `It's a close race! A: ${stats.aWinRate}% vs B: ${stats.bWinRate}%`
      );
    } else {
      insights.push('Early days - need more data for meaningful insights.');
    }
  }

  // 🎭 Style narrative - what does this tell us about user preferences?
  if (stats.aWins > stats.bWins && stats.withChoice >= 3) {
    insights.push(
      'Users seem to prefer the structured, step-by-step approach.'
    );
  } else if (stats.bWins > stats.aWins && stats.withChoice >= 3) {
    insights.push(
      'Users seem to prefer the warm, conversational approach.'
    );
  }

  return insights;
}
