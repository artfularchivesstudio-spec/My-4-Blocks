import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * 📊 Admin A/B Tests API - Viewing the Dual Response Duel Results ⚔️
 * 
 * "Where the data tells the story of which path the seeker chose."
 */
export async function GET() {
  try {
    // 🔍 Fetch recent A/B tests from Supabase
    // We'll try to fetch from 'ab_tests' table.
    // If it doesn't exist yet, we'll return an empty list.
    const { data, error } = await supabase
      .from('ab_tests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.warn('⚠️ Supabase error fetching A/B tests:', error.message)
      return NextResponse.json({ tests: [] })
    }

    return NextResponse.json({ tests: data || [] })
  } catch (error) {
    console.error('💥 Error in A/B Tests API:', error)
    return NextResponse.json({ tests: [] })
  }
}

/**
 * 🎯 Record a choice or update metadata
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, userChoice, metadata } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
    }

    const { error } = await supabase
      .from('ab_tests')
      .update({ 
        user_choice: userChoice,
        metadata: metadata 
      })
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('💥 Error updating A/B test:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
