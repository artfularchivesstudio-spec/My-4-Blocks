/**
 * 🎭 Knowledge Graph Search — Where Concepts Collide ✨
 *
 * "In the constellation of wisdom, every connection illuminates truth.
 *  Search not just by text, but by relationship and reasoning path."
 *
 * - The Spellbinding Cartographer of Graph Topology
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 🔮 Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Service role for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 🎯 Types for our knowledge universe
type NodeType = 'concept' | 'scenario' | 'lens' | 'rubric' | 'section';
type EdgeType = 'applies' | 'demonstrates' | 'evaluates' | 'contains' | 'related-to' | 'contradicts';

interface KnowledgeNode {
  id: string;
  slug: string;
  title: string;
  node_type: NodeType;
  content?: string;
  description?: string;
  metadata?: Record<string, any>;
  tags?: string[];
  confidence?: 'high' | 'medium' | 'low';
  contested?: boolean;
}

interface KnowledgeEdge {
  id: string;
  source_id: string;
  target_id: string;
  edge_type: EdgeType;
  weight: number;
  description?: string;
}

interface GraphSearchResult {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  statistics: {
    total_nodes: number;
    total_edges: number;
    nodes_by_type: Record<NodeType, number>;
    edges_by_type: Record<EdgeType, number>;
  };
}

/**
 * 🌟 GET /api/admin/knowledge/search
 *
 * Query parameters:
 *   - q: Search query text
 *   - types: Comma-separated node types to filter (concept,scenario,lens,rubric,section)
 *   - depth: Traversal depth for graph expansion (default: 2)
 *   - limit: Maximum results (default: 20)
 *
 * Performs reasoning-based search across the knowledge graph:
 *   1. Full-text search for matching nodes
 *   2. Expand results with related nodes (BFS traversal)
 *   3. Return subgraph with nodes, edges, and statistics
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 ✨ KNOWLEDGE GRAPH SEARCH AWAKENS!');

    // 🎯 Parse query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const typesParam = searchParams.get('types') || '';
    const depth = parseInt(searchParams.get('depth') || '2', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    console.log(`🔍 ✨ Query: "${query}" | Types: ${typesParam || 'all'} | Depth: ${depth} | Limit: ${limit}`);

    // 🎭 Filter by node types if specified
    const types = typesParam ? typesParam.split(',') as NodeType[] : null;

    // 📜 Step 1: Search for matching nodes
    const { data: matchedNodes, error: searchError } = await supabase
      .rpc('search_knowledge_graph', {
        p_query_text: query,
        p_node_types: types
      });

    if (searchError) {
      console.error('💥 😭 Search failed:', searchError);
      return NextResponse.json(
        { error: 'Search query failed', details: searchError },
        { status: 500 }
      );
    }

    if (!matchedNodes || matchedNodes.length === 0) {
      console.log('🌙 ⚠️ No matching nodes found');
      return NextResponse.json({
        nodes: [],
        edges: [],
        statistics: {
          total_nodes: 0,
          total_edges: 0,
          nodes_by_type: {} as Record<NodeType, number>,
          edges_by_type: {} as Record<EdgeType, number>
        }
      });
    }

    console.log(`🎉 ✨ Found ${matchedNodes.length} matching nodes!`);

    // 🌳 Step 2: Expand subgraph around matched nodes (limited depth)
    const rootNodeIds = matchedNodes.map((n: any) => n.node_id).slice(0, 5); // Limit expansion
    const expandedNodeIds = new Set<string>(rootNodeIds);
    const expandedEdgeIds = new Set<string>();

    for (const nodeId of rootNodeIds) {
      // Get subgraph using BFS traversal function
      const { data: subgraph, error: subgraphError } = await supabase
        .rpc('get_knowledge_subgraph', {
          p_root_node_id: nodeId,
          p_max_depth: depth
        });

      if (!subgraphError && subgraph) {
        // Collect nodes and edges
        subgraph.forEach((item: any) => {
          if (item.node_id) expandedNodeIds.add(item.node_id);
          if (item.edge_id) expandedEdgeIds.add(item.edge_id);
        });
      }
    }

    // 📚 Step 3: Fetch full node and edge data
    const nodesList = Array.from(expandedNodeIds);
    const edgesList = Array.from(expandedEdgeIds);

    const [nodesResult, edgesResult] = await Promise.all([
      supabase
        .from('knowledge_nodes')
        .select('*')
        .in('id', nodesList.length > 0 ? nodesList : ['00000000-0000-0000-0000-000000000000']), // Handle empty
        .is('deleted_at', null),
      supabase
        .from('knowledge_edges')
        .select('*')
        .in('id', edgesList.length > 0 ? edgesList : ['00000000-0000-0000-0000-000000000000'])
        .is('deleted_at', null)
    ]);

    const nodes: KnowledgeNode[] = nodesResult.data || [];
    const edges: KnowledgeEdge[] = edgesResult.data || [];

    // 📊 Step 4: Calculate statistics
    const stats = calculateStatistics(nodes, edges);

    console.log(`✨ 🎊 SEARCH COMPLETE! ${nodes.length} nodes, ${edges.length} edges`);

    return NextResponse.json({
      nodes,
      edges,
      statistics: stats
    } as GraphSearchResult);

  } catch (error) {
    console.error('💥 😭 Search endpoint failed:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}

/**
 * 🧮 Calculate graph statistics
 */
function calculateStatistics(
  nodes: KnowledgeNode[],
  edges: KnowledgeEdge[]
): GraphSearchResult['statistics'] {
  // Count nodes by type
  const nodesByType = nodes.reduce((acc, node) => {
    acc[node.node_type] = (acc[node.node_type] || 0) + 1;
    return acc;
  }, {} as Record<NodeType, number>);

  // Count edges by type
  const edgesByType = edges.reduce((acc, edge) => {
    acc[edge.edge_type] = (acc[edge.edge_type] || 0) + 1;
    return acc;
  }, {} as Record<EdgeType, number>);

  return {
    total_nodes: nodes.length,
    total_edges: edges.length,
    nodes_by_type: nodesByType,
    edges_by_type: edgesByType
  };
}
