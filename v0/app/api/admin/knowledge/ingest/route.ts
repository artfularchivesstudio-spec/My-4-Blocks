/**
 * 🎭 Knowledge Graph Ingestion — Where Wisdom Flows In ✨
 *
 * "From raw text to structured knowledge, every concept finds its home.
 *  The pipeline transforms, the constellation grows, wisdom compounds."
 *
 * - The Spellbinding Alchemist of Graph Topology
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { spawn } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(require('child_process').exec);

// 🔮 Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * 🌟 POST /api/admin/knowledge/ingest
 *
 * Triggers the knowledge graph ingestion pipeline:
 *   1. Extracts concepts from system_prompt.md
 *   2. Parses golden_examples.json for scenarios and rubrics
 *   3. Auto-extracts relationships between entities
 *   4. Stores everything in the knowledge graph
 *
 * Returns ingestion summary with counts of extracted entities
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🌐 ✨ KNOWLEDGE GRAPH INGESTION AWAKENS!');

    // 🎯 Parse request body for optional parameters
    const body = await request.json().catch(() => ({}));
    const { sources = ['system_prompt', 'golden_examples'], force = false } = body;

    console.log(`📊 ✨ Ingesting from: ${sources.join(', ')}`);

    // 📜 Step 1: Run the ingestion script
    const scriptPath = '/Users/admin/Developer/My-4-Blocks/v0/scripts/ingest-knowledge-graph.py';
    const venvPath = '/Users/admin/Developer/My-4-Blocks/v0/.venv-python3.13/bin/python';

    console.log(`🐍 ✨ Running ingestion script with Python 3.13...`);

    const { stdout, stderr } = await execAsync(
      `${venvPath} ${scriptPath}`
    );

    if (stderr && !stderr.includes('⚠️')) {
      console.error('💥 😭 Ingestion script errors:', stderr);
      return NextResponse.json(
        { error: 'Ingestion failed', details: stderr },
        { status: 500 }
      );
    }

    // 📊 Step 2: Parse ingestion results from output
    const summary = parseIngestionOutput(stdout);

    // 📚 Step 3: Verify data was stored
    const verification = await verifyIngestion();

    console.log('✨ 🎊 INGESTION MASTERPIECE COMPLETE!');

    return NextResponse.json({
      success: true,
      summary,
      verification,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('💥 😭 Ingestion failed:', error);
    return NextResponse.json(
      {
        error: 'Ingestion failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * 🧮 Parse ingestion output to extract summary
 */
function parseIngestionOutput(output: string) {
  const summary = {
    concepts_extracted: 0,
    scenarios_extracted: 0,
    rubrics_extracted: 0,
    relationships_extracted: 0,
    total_nodes: 0
  };

  // Parse counts from output (looking for patterns like "Extracted 42 concepts")
  const conceptsMatch = output.match(/Extracted (\d+) concepts/);
  const scenariosMatch = output.match(/Extracted (\d+) scenarios/);
  const rubricsMatch = output.match(/Extracted (\d+) rubrics/);
  const relationshipsMatch = output.match(/Extracted (\d+) relationships/);

  if (conceptsMatch) summary.concepts_extracted = parseInt(conceptsMatch[1], 10);
  if (scenariosMatch) summary.scenarios_extracted = parseInt(scenariosMatch[1], 10);
  if (rubricsMatch) summary.rubrics_extracted = parseInt(rubricsMatch[1], 10);
  if (relationshipsMatch) summary.relationships_extracted = parseInt(relationshipsMatch[1], 10);

  summary.total_nodes = summary.concepts_extracted + summary.scenarios_extracted + summary.rubrics_extracted;

  return summary;
}

/**
 * 🔍 Verify ingestion by querying database
 */
async function verifyIngestion() {
  try {
    // Count nodes by type
    const { data: concepts } = await supabase
      .from('knowledge_nodes')
      .select('id', { count: 'exact', head: true })
      .eq('node_type', 'concept');

    const { data: scenarios } = await supabase
      .from('knowledge_nodes')
      .select('id', { count: 'exact', head: true })
      .eq('node_type', 'scenario');

    const { data: rubrics } = await supabase
      .from('knowledge_nodes')
      .select('id', { count: 'exact', head: true })
      .eq('node_type', 'rubric');

    // Count edges
    const { data: edges } = await supabase
      .from('knowledge_edges')
      .select('id', { count: 'exact', head: true });

    return {
      concepts_in_db: concepts || 0,
      scenarios_in_db: scenarios || 0,
      rubrics_in_db: rubrics || 0,
      edges_in_db: edges || 0,
      total_nodes_in_db: (concepts || 0) + (scenarios || 0) + (rubrics || 0)
    };

  } catch (error) {
    console.error('💥 😭 Verification failed:', error);
    return {
      concepts_in_db: 0,
      scenarios_in_db: 0,
      rubrics_in_db: 0,
      edges_in_db: 0,
      total_nodes_in_db: 0,
      verification_error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * 🌟 GET /api/admin/knowledge/ingest/status
 *
 * Returns current ingestion status and statistics
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 ✨ Checking ingestion status...');

    // Get graph statistics
    const { data: stats, error } = await supabase
      .rpc('get_knowledge_graph_stats');

    if (error) {
      console.error('💥 😭 Failed to get statistics:', error);
      return NextResponse.json(
        { error: 'Failed to retrieve statistics', details: error },
        { status: 500 }
      );
    }

    // Get recent activity
    const { data: recentNodes } = await supabase
      .from('knowledge_nodes')
      .select('node_type, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      statistics: stats?.[0] || {},
      recent_activity: recentNodes || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('💥 😭 Status check failed:', error);
    return NextResponse.json(
      {
        error: 'Status check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
