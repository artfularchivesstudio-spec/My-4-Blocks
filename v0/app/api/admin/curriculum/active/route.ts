import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * 🎭 Active Curriculum API - The GEPA Interface ✨
 *
 * "Four blocks runner needs fuel: the system prompt that shapes
 *  the Companion's voice, and golden examples that test its wisdom.
 *  This endpoint serves that sacred meal in the exact format GEPA expects."
 *
 * - The Spellbinding Museum Director of GEPA Interfaces
 */

/**
 * 📖 GET /api/admin/curriculum/active
 * Get the active curriculum for GEPA (system prompt + golden examples)
 *
 * Returns the exact format four_blocks_runner expects:
 * - system_prompt: string (the active system prompt text)
 * - golden_examples: { block: [{ id, input, output }] } (per-block examples)
 */
export async function GET(req: Request) {
  try {
    console.log('🌐 ✨ ACTIVE CURRICULUM REQUEST FROM GEPA RUNNER!');

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''
    );

    // 🔍 First, fetch the active curriculum version
    const { data: versionData, error: versionError } = await supabase
      .from('curriculum_versions')
      .select('id, version, system_prompt')
      .eq('status', 'active')
      .single();

    if (versionError) {
      console.error(`💥 😭 NO ACTIVE CURRICULUM FOUND! ${versionError.message}`);
      return NextResponse.json(
        { error: 'No active curriculum version found. Please activate a version in the admin panel.' },
        { status: 404 }
      );
    }

    console.log(`📜 Active version "${versionData.version}" found! Fetching golden examples...`);

    // 🎭 Next, fetch all golden examples for this version
    const { data: examplesData, error: examplesError } = await supabase
      .from('curriculum_examples')
      .select('example_id, block, task_input, expected_behavior, category, difficulty, primary_tool, notes')
      .eq('curriculum_version_id', versionData.id);

    if (examplesError) {
      console.error(`💥 😭 GOLDEN EXAMPLES FETCH FAILED! ${examplesError.message}`);
      return NextResponse.json(
        { error: 'Failed to fetch golden examples' },
        { status: 500 }
      );
    }

    // 🎪 Transform examples into the format four_blocks_runner expects
    // Group by block, then transform each example
    const goldenExamplesByBlock: Record<string, Array<{
      id: string;
      input: string;
      output: string;
    }>> = {
      anger: [],
      anxiety: [],
      depression: [],
      guilt: []
    };

    for (const example of examplesData) {
      const transformed = {
        id: example.example_id,
        input: example.task_input,
        output: example.expected_behavior
      };

      // Add to the appropriate block
      if (example.block in goldenExamplesByBlock) {
        goldenExamplesByBlock[example.block].push(transformed);
      }
    }

    console.log(`✨ 🎊 ACTIVE CURRICULUM SERVED! Version: ${versionData.version}, Examples: ${examplesData.length}`);

    // 🎭 Return in the exact format four_blocks_runner expects
    return NextResponse.json({
      system_prompt: versionData.system_prompt,
      golden_examples: goldenExamplesByBlock
    });
  } catch (creativeChallenge) {
    console.error('🌩️ Temporary setback in GET /curriculum/active:', creativeChallenge);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
