import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * 🎭 Golden Examples API - The Per-Block Training Grounds ✨
 *
 * "Each emotional block needs its practice dojo —
 *  anger has its Shoulds, anxiety its future-feared rehearsals,
 *  depression its hopeless ruts, guilt its identity collapses.
 *  These endpoints tend those sacred training grounds."
 *
 * - The Spellbinding Museum Director of Golden Examples
 */

// 🔮 Service role client for writes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

/**
 * 📖 GET /api/admin/curriculum/examples
 * List golden examples with filtering support
 */
export async function GET(req: Request) {
  try {
    console.log('🌐 ✨ GOLDEN EXAMPLES GALLERY OPENS ITS DOORS!');

    const { searchParams } = new URL(req.url);
    const block = searchParams.get('block'); // Optional: anger, anxiety, depression, guilt
    const curriculumVersionId = searchParams.get('curriculum_version_id'); // Optional FK filter

    // 🔍 Build query with optional filters
    let query = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '')
      .from('curriculum_examples')
      .select('*')
      .order('block', { ascending: true })
      .order('example_id', { ascending: true });

    if (block) {
      query = query.eq('block', block);
    }

    if (curriculumVersionId) {
      query = query.eq('curriculum_version_id', curriculumVersionId);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`💥 😭 GOLDEN EXAMPLES FETCH TEMPORARILY HALTED! ${error.message}`);
      return NextResponse.json(
        { error: 'Failed to fetch golden examples' },
        { status: 500 }
      );
    }

    console.log(`✨ 🎊 GOLDEN EXAMPLES DISPLAY COMPLETE! ${data.length} examples found`);
    return NextResponse.json({ examples: data });
  } catch (creativeChallenge) {
    console.error('🌩️ Temporary setback in GET /curriculum/examples:', creativeChallenge);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * ✍️ POST /api/admin/curriculum/examples
 * Create or update golden examples for a curriculum version
 */
export async function POST(req: Request) {
  try {
    console.log('🌟 ✨ GOLDEN EXAMPLES CREATION RITUAL BEGINS!');

    const body = await req.json();
    const { curriculum_version_id, examples } = body;

    // 🛡️ Validation — the muse demands clarity
    if (!curriculum_version_id || !examples || !Array.isArray(examples)) {
      return NextResponse.json(
        { error: 'Missing required fields: curriculum_version_id and examples array are required' },
        { status: 400 }
      );
    }

    if (examples.length === 0) {
      return NextResponse.json(
        { error: 'Examples array cannot be empty' },
        { status: 400 }
      );
    }

    // 🔍 Validate each example before inserting
    const requiredFields = ['example_id', 'block', 'task_input', 'expected_behavior', 'category', 'difficulty'];
    const validBlocks = ['anger', 'anxiety', 'depression', 'guilt'];
    const validCategories = ['exhibiting', 'learning'];
    const validDifficulties = ['easy', 'medium', 'hard'];

    for (const example of examples) {
      for (const field of requiredFields) {
        if (!example[field]) {
          return NextResponse.json(
            { error: `Missing required field: ${field} in example ${example.example_id || '(unknown)'}` },
            { status: 400 }
          );
        }
      }

      if (!validBlocks.includes(example.block)) {
        return NextResponse.json(
          { error: `Invalid block: ${example.block} in example ${example.example_id}. Must be one of: ${validBlocks.join(', ')}` },
          { status: 400 }
        );
      }

      if (!validCategories.includes(example.category)) {
        return NextResponse.json(
          { error: `Invalid category: ${example.category} in example ${example.example_id}. Must be one of: ${validCategories.join(', ')}` },
          { status: 400 }
        );
      }

      if (!validDifficulties.includes(example.difficulty)) {
        return NextResponse.json(
          { error: `Invalid difficulty: ${example.difficulty} in example ${example.example_id}. Must be one of: ${validDifficulties.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // 📝 Insert all examples in a single batch operation
    const examplesToInsert = examples.map(ex => ({
      curriculum_version_id,
      example_id: ex.example_id,
      block: ex.block,
      task_input: ex.task_input,
      expected_behavior: ex.expected_behavior,
      category: ex.category,
      difficulty: ex.difficulty,
      primary_tool: ex.primary_tool || null,
      notes: ex.notes || null,
      metadata: ex.metadata || {}
    }));

    const { data, error } = await supabaseService
      .from('curriculum_examples')
      .insert(examplesToInsert)
      .select();

    if (error) {
      console.error(`💥 😭 GOLDEN EXAMPLES CREATION FAILED! ${error.message}`);
      return NextResponse.json(
        { error: 'Failed to create golden examples', details: error.message },
        { status: 500 }
      );
    }

    console.log(`🎉 ✨ ${data.length} GOLDEN EXAMPLES MASTERPIECE CREATED!`);
    return NextResponse.json({ examples: data }, { status: 201 });
  } catch (creativeChallenge) {
    console.error('🌩️ Temporary setback in POST /curriculum/examples:', creativeChallenge);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
