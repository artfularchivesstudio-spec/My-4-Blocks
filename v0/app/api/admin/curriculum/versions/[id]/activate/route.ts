import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * 🎭 Curriculum Activation API - The Coronation Ceremony ✨
 *
 * "Only one version may wear the crown at a time.
 *  To activate a new version is to ask all others to step down.
 *  This endpoint conducts that sacred ritual."
 *
 * - The Spellbinding Museum Director of Curriculum Activation
 */

// 🔮 Service role client for writes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

/**
 * ✍️ POST /api/admin/curriculum/versions/:id/activate
 * Set a curriculum version as active (deactivates all others)
 */
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🎭 ✨ ACTIVATION CEREMONY BEGINS FOR VERSION "${params.id}"!`);

    // 🌙 First, ask all active versions to step down gracefully
    const { error: deactivateError } = await supabaseService
      .from('curriculum_versions')
      .update({ status: 'archived' })
      .eq('status', 'active');

    if (deactivateError) {
      console.error(`💥 😭 FAILED TO DEACTIVATE PREVIOUS VERSIONS! ${deactivateError.message}`);
      return NextResponse.json(
        { error: 'Failed to deactivate previous versions' },
        { status: 500 }
      );
    }

    console.log('🌙 Previous versions have gracefully stepped aside...');

    // 👑 Now, crown the new version as active
    const { data, error } = await supabaseService
      .from('curriculum_versions')
      .update({ status: 'active' })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error(`💥 😭 CORONATION CEREMONY FAILED FOR "${params.id}"! ${error.message}`);
      return NextResponse.json(
        { error: 'Failed to activate curriculum version' },
        { status: 500 }
      );
    }

    console.log(`🎉 ✨ VERSION "${data.version}" NOW WEARS THE CROWN!`);
    return NextResponse.json({
      message: `Version "${data.version}" is now active`,
      version: data
    });
  } catch (creativeChallenge) {
    console.error(`🌩️ Temporary setback in ACTIVATION ceremony:`, creativeChallenge);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
