import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * 📜 Curriculum Version Detail API - A Single Version's Story ✨
 *
 * "Each version holds a universe of intent — what we asked the Companion
 *  to see, how we asked it to listen, what we forbade it to name.
 *  This endpoint whispers that tale."
 *
 * - The Spellbinding Museum Director of Curriculum Persistence
 */

// 🔮 Service role client for writes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

/**
 * 📖 GET /api/admin/curriculum/versions/:id
 * Get a specific curriculum version by ID
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🌐 ✨ CURRICULUM VERSION "${params.id}" AWAKENS FROM THE ARCHIVE!`);

    const { data, error } = await createClient(
      supabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''
    )
      .from('curriculum_versions')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error(`💥 😭 CURRICULUM VERSION "${params.id}" NOT FOUND! ${error.message}`);
      return NextResponse.json(
        { error: 'Curriculum version not found' },
        { status: 404 }
      );
    }

    console.log(`✨ 🎊 CURRICULUM VERSION "${params.id}" REVEALED!`);
    return NextResponse.json({ version: data });
  } catch (creativeChallenge) {
    console.error(`🌩️ Temporary setback in GET /curriculum/versions/${params.id}:`, creativeChallenge);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * ✍️ PUT /api/admin/curriculum/versions/:id
 * Update a curriculum version (notes, metadata, etc.)
 */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🌟 ✨ CURRICULUM VERSION "${params.id}" TRANSFORMATION RITUAL BEGINS!`);

    const body = await req.json();
    const { notes, metadata, system_prompt } = body;

    // 📝 Update the version (only allowed fields)
    const updateData: any = {};
    if (notes !== undefined) updateData.notes = notes;
    if (metadata !== undefined) updateData.metadata = metadata;
    if (system_prompt !== undefined) updateData.system_prompt = system_prompt;

    const { data, error } = await supabaseService
      .from('curriculum_versions')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error(`💥 😭 CURRICULUM VERSION "${params.id}" UPDATE FAILED! ${error.message}`);
      return NextResponse.json(
        { error: 'Failed to update curriculum version' },
        { status: 500 }
      );
    }

    console.log(`🎉 ✨ CURRICULUM VERSION "${params.id}" TRANSFORMATION COMPLETE!`);
    return NextResponse.json({ version: data });
  } catch (creativeChallenge) {
    console.error(`🌩️ Temporary setback in PUT /curriculum/versions/${params.id}:`, creativeChallenge);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
