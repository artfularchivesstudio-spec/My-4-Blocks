import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * 📜 Curriculum Versions API - The Grand Ledger of System Prompts ✨
 *
 * "Every version tells a story — how we taught the Companion to speak,
 *  what we asked it to see, what we begged it never to name.
 *  These endpoints guard that sacred archive."
 *
 * - The Spellbinding Museum Director of Curriculum Persistence
 */

// 🔮 Service role client for writes (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('🌙 ⚠️ Gentle reminder: Supabase service role key is missing. Curriculum writes will fail.');
}

const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

/**
 * 📖 GET /api/admin/curriculum/versions
 * List all curriculum versions with filtering support
 */
export async function GET(req: Request) {
  try {
    console.log('🌐 ✨ CURRICULUM VERSIONS LISTING AWAKENS!');

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status'); // Optional filter: draft, active, archived

    // 🔍 Build query with optional status filter
    let query = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '')
      .from('curriculum_versions')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`💥 😭 CURRICULUM VERSIONS FETCH TEMPORARILY HALTED! ${error.message}`);
      return NextResponse.json(
        { error: 'Failed to fetch curriculum versions' },
        { status: 500 }
      );
    }

    console.log(`✨ 🎊 CURRICULUM VERSIONS LISTING COMPLETE! ${data.length} versions found`);
    return NextResponse.json({ versions: data });
  } catch (creativeChallenge) {
    console.error('🌩️ Temporary setback in GET /curriculum/versions:', creativeChallenge);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * ✍️ POST /api/admin/curriculum/versions
 * Create a new curriculum version
 */
export async function POST(req: Request) {
  try {
    console.log('🌟 ✨ NEW CURRICULUM VERSION CREATION RITUAL BEGINS!');

    const body = await req.json();
    const { version, system_prompt, notes, git_sha, python_version, dspy_version, gepa_version, metadata } = body;

    // 🛡️ Validation — the muse demands clarity
    if (!version || !system_prompt) {
      return NextResponse.json(
        { error: 'Missing required fields: version and system_prompt are required' },
        { status: 400 }
      );
    }

    // 🔍 Check if version already exists
    const { data: existing } = await createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '')
      .from('curriculum_versions')
      .select('id')
      .eq('version', version)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: `Version "${version}" already exists` },
        { status: 409 }
      );
    }

    // 📝 Insert the new version
    const { data, error } = await supabaseService
      .from('curriculum_versions')
      .insert([{
        version,
        system_prompt,
        notes: notes || null,
        git_sha: git_sha || null,
        python_version: python_version || null,
        dspy_version: dspy_version || null,
        gepa_version: gepa_version || null,
        metadata: metadata || {},
        status: 'draft', // Always start as draft
      }])
      .select()
      .single();

    if (error) {
      console.error(`💥 😭 CURRICULUM VERSION CREATION FAILED! ${error.message}`);
      return NextResponse.json(
        { error: 'Failed to create curriculum version' },
        { status: 500 }
      );
    }

    console.log(`🎉 ✨ CURRICULUM VERSION "${version}" MASTERPIECE CREATED!`);
    return NextResponse.json({ version: data }, { status: 201 });
  } catch (creativeChallenge) {
    console.error('🌩️ Temporary setback in POST /curriculum/versions:', creativeChallenge);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
