import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

/**
 * 🎭 Knowledge Graph API - The Constellation Mapper ✨
 *
 * "Behold the cosmic web of wisdom — where concepts dance
 *  with scenarios, lenses paint new perspectives, and
 *  rubrics measure the mastery of understanding."
 *
 * - The Spellbinding Museum Director of Graph Topology
 */

// 🌟 Node types in our knowledge universe
type NodeType = 'concept' | 'scenario' | 'lens' | 'rubric' | 'section';

// 🔗 Edge types for relationships
type EdgeType =
  | 'applies'      // Lens applies to concept
  | 'demonstrates' // Scenario demonstrates concept
  | 'evaluates'    // Rubric evaluates scenario
  | 'contains'     // Section contains content
  | 'related-to';  // General relationship

// 📊 A node in the knowledge graph
interface GraphNode {
  id: string;           // Unique identifier
  label: string;        // Human-readable name
  type: NodeType;       // Node type
  description?: string; // Optional description
  metadata?: Record<string, any>; // Additional data
}

// 🔗 An edge between nodes
interface GraphEdge {
  id: string;           // Unique edge identifier
  source: string;       // Source node ID
  target: string;       // Target node ID
  type: EdgeType;       // Relationship type
  weight?: number;      // Connection strength (optional)
  metadata?: Record<string, any>; // Additional data
}

// 🌐 The complete knowledge graph
interface KnowledgeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  statistics: {
    totalNodes: number;
    totalEdges: number;
    connectedComponents: number;
    nodeTypes: Record<NodeType, number>;
    edgeTypes: Record<EdgeType, number>;
  };
}

/**
 * GET /api/admin/knowledge/graph
 *
 * Returns the knowledge graph as nodes and edges.
 * Supports query parameters:
 * - types: comma-separated node types to filter (e.g., "concept,lens")
 * - limit: maximum number of nodes to return (default: 500)
 * - root: start traversal from this node ID (optional)
 * - depth: traversal depth from root (default: 2)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const types = searchParams.get('types')?.split(',') as NodeType[] | undefined;
    const limit = parseInt(searchParams.get('limit') || '500', 10);
    const root = searchParams.get('root');
    const depth = parseInt(searchParams.get('depth') || '2', 10);

    // 🏰 Root of the project (outside of v0)
    const rootDir = path.resolve(process.cwd(), '..');

    // 📚 Knowledge sources
    const knowledgeSources = [
      'docs/WIKI/concepts',
      'docs/WIKI/scenarios',
      'docs/WIKI/lenses',
      'docs/WIKI/rubrics',
      'docs/GEPA-DSPy-m1/four_blocks_runner/curriculum',
    ];

    // 🎭 Build the graph from knowledge sources
    const graph = await buildKnowledgeGraph(rootDir, knowledgeSources);

    // 🔍 Apply filters if provided
    let filteredNodes = graph.nodes;
    let filteredEdges = graph.edges;

    if (types && types.length > 0) {
      const typeSet = new Set(types);
      filteredNodes = filteredNodes.filter(n => typeSet.has(n.type));

      // Keep only edges between filtered nodes
      const nodeIds = new Set(filteredNodes.map(n => n.id));
      filteredEdges = filteredEdges.filter(e =>
        nodeIds.has(e.source) && nodeIds.has(e.target)
      );
    }

    // 🌳 Subgraph traversal from root if specified
    if (root) {
      const subgraph = extractSubgraph(filteredNodes, filteredEdges, root, depth);
      filteredNodes = subgraph.nodes;
      filteredEdges = subgraph.edges;
    }

    // ✂️ Apply limit
    if (filteredNodes.length > limit) {
      filteredNodes = filteredNodes.slice(0, limit);
      const nodeIds = new Set(filteredNodes.map(n => n.id));
      filteredEdges = filteredEdges.filter(e =>
        nodeIds.has(e.source) && nodeIds.has(e.target)
      );
    }

    // 📊 Calculate statistics
    const statistics = calculateStatistics(filteredNodes, filteredEdges);

    return NextResponse.json({
      nodes: filteredNodes,
      edges: filteredEdges,
      statistics,
    });
  } catch (error) {
    console.error('💥 😭 GRAPH QUEST TEMPORARILY HALTED!', error);
    return NextResponse.json(
      { error: 'Failed to load knowledge graph' },
      { status: 500 }
    );
  }
}

/**
 * 🏗️ Build the knowledge graph from source files
 */
async function buildKnowledgeGraph(
  rootDir: string,
  sources: string[]
): Promise<KnowledgeGraph> {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  for (const source of sources) {
    const sourcePath = path.join(rootDir, source);

    try {
      await fs.access(sourcePath);
      await traverseDirectory(sourcePath, rootDir, nodes, edges);
    } catch {
      // 🌙 Gentle reminder: source may not exist yet
      continue;
    }
  }

  return { nodes, edges, statistics: calculateStatistics(nodes, edges) };
}

/**
 * 🔮 Traverse a directory and extract graph data
 */
async function traverseDirectory(
  dir: string,
  rootDir: string,
  nodes: GraphNode[],
  edges: GraphEdge[]
): Promise<void> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });

  for (const dirent of dirents) {
    if (dirent.name.startsWith('.')) continue;

    const fullPath = path.resolve(dir, dirent.name);
    const relativePath = path.relative(rootDir, fullPath);

    if (dirent.isDirectory()) {
      await traverseDirectory(fullPath, rootDir, nodes, edges);
    } else if (dirent.isFile()) {
      await processFile(fullPath, relativePath, nodes, edges);
    }
  }
}

/**
 * 📜 Process a single file and extract graph elements
 */
async function processFile(
  fullPath: string,
  relativePath: string,
  nodes: GraphNode[],
  edges: GraphEdge[]
): Promise<void> {
  try {
    const content = await fs.readFile(fullPath, 'utf-8');
    const ext = path.extname(fullPath).toLowerCase();

    // 🎭 Determine node type from path
    let nodeType: NodeType;
    if (relativePath.includes('/concepts/') || relativePath.includes('\\concepts\\')) {
      nodeType = 'concept';
    } else if (relativePath.includes('/scenarios/') || relativePath.includes('\\scenarios\\')) {
      nodeType = 'scenario';
    } else if (relativePath.includes('/lenses/') || relativePath.includes('\\lenses\\')) {
      nodeType = 'lens';
    } else if (relativePath.includes('/rubrics/') || relativePath.includes('\\rubrics\\')) {
      nodeType = 'rubric';
    } else if (relativePath.includes('/curriculum/') || relativePath.includes('\\curriculum\\')) {
      nodeType = 'section';
    } else {
      return; // Skip unknown types
    }

    // 🌟 Create node ID from path
    const nodeId = relativePath
      .replace(/\.(md|txt|json|jsonl)$/i, '')
      .replace(/[\/\\]/g, ':');

    // 📝 Extract label from filename or content
    const label = extractLabel(content, fullPath);

    // 🔍 Extract relationships from content
    const relationships = extractRelationships(content, nodeId);

    // ➕ Add node if not exists
    if (!nodes.find(n => n.id === nodeId)) {
      nodes.push({
        id: nodeId,
        label,
        type: nodeType,
        description: extractDescription(content),
        metadata: {
          path: relativePath,
          size: content.length,
        },
      });
    }

    // 🔗 Add edges for relationships
    for (const rel of relationships) {
      if (!edges.find(e => e.id === rel.id)) {
        edges.push(rel);
      }
    }
  } catch (error) {
    // 🌊 Skip files that can't be read
  }
}

/**
 * 🏷️ Extract a human-readable label from content
 */
function extractLabel(content: string, filePath: string): string {
  // Try to find a title in markdown
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    return titleMatch[1].trim();
  }

  // Fall back to filename
  const fileName = path.basename(filePath);
  return fileName
    .replace(/\.(md|txt|json|jsonl)$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * 📝 Extract description from content
 */
function extractDescription(content: string): string {
  // Look for first paragraph after title
  const lines = content.split('\n');
  let foundTitle = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#')) {
      foundTitle = true;
    } else if (foundTitle && trimmed.length > 0) {
      return trimmed.slice(0, 200) + (trimmed.length > 200 ? '...' : '');
    }
  }

  return '';
}

/**
 * 🔍 Extract relationships from content
 */
function extractRelationships(content: string, sourceId: string): GraphEdge[] {
  const edges: GraphEdge[] = [];
  let edgeCounter = 0;

  // Look for relationship patterns
  // Pattern: "relates to:", "applies to:", "demonstrates:", etc.
  const relationPatterns = [
    { regex: /relates to:\s*([^\n]+)/gi, type: 'related-to' as EdgeType },
    { regex: /applies to:\s*([^\n]+)/gi, type: 'applies' as EdgeType },
    { regex: /demonstrates:\s*([^\n]+)/gi, type: 'demonstrates' as EdgeType },
    { regex: /evaluates:\s*([^\n]+)/gi, type: 'evaluates' as EdgeType },
    { regex: /contains:\s*([^\n]+)/gi, type: 'contains' as EdgeType },
  ];

  for (const pattern of relationPatterns) {
    let match;
    while ((match = pattern.regex.exec(content)) !== null) {
      const targetLabel = match[1].trim();
      const targetId = targetLabel
        .toLowerCase()
        .replace(/[^\w\s:]/g, '')
        .replace(/\s+/g, ':');

      edges.push({
        id: `${sourceId}:${targetId}:${pattern.type}:${edgeCounter++}`,
        source: sourceId,
        target: targetId,
        type: pattern.type,
        weight: 1,
      });
    }
  }

  return edges;
}

/**
 * 🌳 Extract subgraph starting from a root node
 */
function extractSubgraph(
  nodes: GraphNode[],
  edges: GraphEdge[],
  root: string,
  maxDepth: number
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const visitedNodes = new Set<string>();
  const visitedEdges = new Set<string>();
  const queue: Array<{ nodeId: string; depth: number }> = [
    { nodeId: root, depth: 0 }
  ];

  while (queue.length > 0) {
    const { nodeId, depth } = queue.shift()!;

    if (visitedNodes.has(nodeId) || depth > maxDepth) {
      continue;
    }

    visitedNodes.add(nodeId);

    // Find neighbors
    const neighbors = edges.filter(
      e => e.source === nodeId || e.target === nodeId
    );

    for (const edge of neighbors) {
      visitedEdges.add(edge.id);
      const neighborId = edge.source === nodeId ? edge.target : edge.source;

      if (!visitedNodes.has(neighborId)) {
        queue.push({ nodeId: neighborId, depth: depth + 1 });
      }
    }
  }

  return {
    nodes: nodes.filter(n => visitedNodes.has(n.id)),
    edges: edges.filter(e => visitedEdges.has(e.id)),
  };
}

/**
 * 📊 Calculate graph statistics
 */
function calculateStatistics(
  nodes: GraphNode[],
  edges: GraphEdge[]
): KnowledgeGraph['statistics'] {
  const nodeTypes: Record<NodeType, number> = {
    concept: 0,
    scenario: 0,
    lens: 0,
    rubric: 0,
    section: 0,
  };

  const edgeTypes: Record<EdgeType, number> = {
    applies: 0,
    demonstrates: 0,
    evaluates: 0,
    contains: 0,
    'related-to': 0,
  };

  // Count node types
  for (const node of nodes) {
    nodeTypes[node.type]++;
  }

  // Count edge types
  for (const edge of edges) {
    edgeTypes[edge.type]++;
  }

  // Calculate connected components using BFS
  const visited = new Set<string>();
  let components = 0;

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      components++;
      bfsVisit(node.id, nodes, edges, visited);
    }
  }

  return {
    totalNodes: nodes.length,
    totalEdges: edges.length,
    connectedComponents: components,
    nodeTypes,
    edgeTypes,
  };
}

/**
 * 🔮 BFS traversal to find connected components
 */
function bfsVisit(
  startId: string,
  nodes: GraphNode[],
  edges: GraphEdge[],
  visited: Set<string>
): void {
  const queue = [startId];
  visited.add(startId);

  while (queue.length > 0) {
    const currentId = queue.shift()!;

    // Find neighbors
    for (const edge of edges) {
      let neighborId: string | null = null;

      if (edge.source === currentId) {
        neighborId = edge.target;
      } else if (edge.target === currentId) {
        neighborId = edge.source;
      }

      if (neighborId && !visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push(neighborId);
      }
    }
  }
}
