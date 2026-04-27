import { NextResponse } from 'next/server';

/**
 * 📤 Knowledge Graph Export - Save the Constellation ✨
 *
 * "For those who wish to preserve the stars in digital amber,
 *  this endpoint provides the complete graph in portable formats.
 *  Export as JSON, or visualize in your favorite tools."
 *
 * - The Spellbinding Museum Director of Data Export
 */

export async function GET(req: Request) {
  try {
    // 📊 Fetch the graph data
    const graphResponse = await fetch(
      new URL('/api/admin/knowledge/graph', req.url)
    );
    if (!graphResponse.ok) {
      throw new Error('Failed to fetch graph data');
    }

    const graph = await graphResponse.json();

    // 📋 Return exportable data
    return NextResponse.json({
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      graph,
      formats: {
        json: 'Direct JSON download',
        gephi: 'Import to Gephi (via JSON)',
        cytoscape: 'Import to Cytoscape.js (via JSON)',
        d3: 'Use in D3.js visualizations',
      },
    });
  } catch (error) {
    console.error('💥 😭 GRAPH EXPORT QUEST FAILED!', error);
    return NextResponse.json(
      { error: 'Failed to export knowledge graph' },
      { status: 500 }
    );
  }
}
