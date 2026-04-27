'use client';

/**
 * 🎭 The Knowledge Graph View - Constellation of Wisdom ✨
 *
 * "Behold the cosmic web where concepts dance with scenarios,
 *  lenses paint new perspectives, and rubrics measure mastery.
 *  Each node a star, each edge a gravitational force of meaning."
 *
 * - The Spellbinding Museum Director of Graph Visualization
 */

import React, { useState, useEffect, useRef } from 'react';
import { Network, RefreshCw, ZoomIn, ZoomOut, Maximize2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import GraphNode from './GraphNode';
import GraphEdge from './GraphEdge';
import GraphSearch from './GraphSearch';
import GraphFilters from './GraphFilters';

// 🌟 Node types in our universe
export type NodeType = 'concept' | 'scenario' | 'lens' | 'rubric' | 'section';

// 🔗 Edge types for relationships
export type EdgeType = 'applies' | 'demonstrates' | 'evaluates' | 'contains' | 'related-to';

// 📊 Graph node structure
export interface GraphNodeData {
  id: string;
  label: string;
  type: NodeType;
  description?: string;
  metadata?: Record<string, any>;
}

// 🔗 Graph edge structure
export interface GraphEdgeData {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  weight?: number;
  metadata?: Record<string, any>;
}

// 🌐 Complete graph data
export interface KnowledgeGraph {
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
  statistics: {
    totalNodes: number;
    totalEdges: number;
    connectedComponents: number;
    nodeTypes: Record<NodeType, number>;
    edgeTypes: Record<EdgeType, number>;
  };
}

// 🎨 Node visualization properties
interface NodeVisualization {
  x: number;
  y: number;
  radius: number;
  color: string;
  highlighted: boolean;
}

// 🔗 Edge visualization properties
interface EdgeVisualization {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  highlighted: boolean;
}

export default function KnowledgeGraphView() {
  const [graph, setGraph] = useState<KnowledgeGraph | null>(null);
  const [nodePositions, setNodePositions] = useState<Map<string, NodeVisualization>>(new Map());
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [highlightedPath, setHighlightedPath] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<Set<NodeType>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // 🌐 Load the graph data
  const loadGraph = async (nodeTypes?: NodeType[]) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (nodeTypes && nodeTypes.length > 0) {
        params.set('types', nodeTypes.join(','));
      }
      params.set('limit', '500');

      const response = await fetch(`/api/admin/knowledge/graph?${params}`);
      if (!response.ok) throw new Error('Failed to load graph');

      const data: KnowledgeGraph = await response.json();
      setGraph(data);

      // 🎨 Calculate initial positions using force-directed layout
      const positions = calculateForceDirectedLayout(data.nodes, data.edges);
      setNodePositions(positions);
    } catch (error) {
      console.error('💥 😭 GRAPH LOADING QUEST FAILED!', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 🎨 Force-directed layout algorithm
  const calculateForceDirectedLayout = (
    nodes: GraphNodeData[],
    edges: GraphEdgeData[],
    iterations: number = 100
  ): Map<string, NodeVisualization> => {
    const positions = new Map<string, NodeVisualization>();
    const nodeRadius = 30;

    // 🌟 Initialize random positions
    for (const node of nodes) {
      positions.set(node.id, {
        x: Math.random() * 800 - 400,
        y: Math.random() * 600 - 300,
        radius: getNodeRadius(node.type),
        color: getNodeColor(node.type),
        highlighted: false,
      });
    }

    // 🔮 Apply forces iteratively
    for (let i = 0; i < iterations; i++) {
      // Repulsion between nodes
      for (const node1 of nodes) {
        const pos1 = positions.get(node1.id)!;
        for (const node2 of nodes) {
          if (node1.id === node2.id) continue;

          const pos2 = positions.get(node2.id)!;
          const dx = pos1.x - pos2.x;
          const dy = pos1.y - pos2.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 5000 / (distance * distance);

          const angle = Math.atan2(dy, dx);
          pos1.x += Math.cos(angle) * force * 0.1;
          pos1.y += Math.sin(angle) * force * 0.1;
        }
      }

      // Attraction along edges
      for (const edge of edges) {
        const pos1 = positions.get(edge.source);
        const pos2 = positions.get(edge.target);
        if (!pos1 || !pos2) continue;

        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const force = (distance - 150) * 0.05;
        const angle = Math.atan2(dy, dx);

        pos1.x += Math.cos(angle) * force;
        pos1.y += Math.sin(angle) * force;
        pos2.x -= Math.cos(angle) * force;
        pos2.y -= Math.sin(angle) * force;
      }

      // Center gravity
      for (const node of nodes) {
        const pos = positions.get(node.id)!;
        pos.x -= pos.x * 0.01;
        pos.y -= pos.y * 0.01;
      }
    }

    return positions;
  };

  // 🎨 Get node color by type
  const getNodeColor = (type: NodeType): string => {
    const colors = {
      concept: '#3b82f6',    // Blue
      scenario: '#10b981',   // Green
      lens: '#8b5cf6',      // Purple
      rubric: '#f59e0b',     // Orange
      section: '#ef4444',    // Red
    };
    return colors[type] || '#6b7280';
  };

  // 📏 Get node radius by type
  const getNodeRadius = (type: NodeType): number => {
    const radii = {
      concept: 25,
      scenario: 20,
      lens: 22,
      rubric: 18,
      section: 15,
    };
    return radii[type] || 20;
  };

  // 🔍 Find shortest path between nodes
  const findShortestPath = (startId: string, endId: string): Set<string> => {
    if (!graph) return new Set();

    const pathSet = new Set<string>();
    const queue: Array<{ nodeId: string; path: string[] }> = [
      { nodeId: startId, path: [startId] }
    ];
    const visited = new Set<string>([startId]);

    while (queue.length > 0) {
      const { nodeId, path } = queue.shift()!;

      if (nodeId === endId) {
        path.forEach(id => pathSet.add(id));
        // Add edges along the path
        for (let i = 0; i < path.length - 1; i++) {
          const edge = graph.edges.find(
            e =>
              (e.source === path[i] && e.target === path[i + 1]) ||
              (e.target === path[i] && e.source === path[i + 1])
          );
          if (edge) pathSet.add(edge.id);
        }
        return pathSet;
      }

      // Find neighbors
      const neighbors = graph.edges.filter(
        e => e.source === nodeId || e.target === nodeId
      );

      for (const edge of neighbors) {
        const neighborId = edge.source === nodeId ? edge.target : edge.source;
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          queue.push({ nodeId: neighborId, path: [...path, neighborId] });
        }
      }
    }

    return pathSet;
  };

  // 🎯 Handle node click
  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);

    // 🔍 Find path from search result to clicked node
    if (searchQuery && graph) {
      const searchNode = graph.nodes.find(
        n => n.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (searchNode) {
        const path = findShortestPath(searchNode.id, nodeId);
        setHighlightedPath(path);
      }
    }
  };

  // 🎯 Handle node double-click
  const handleNodeDoubleClick = (nodeId: string) => {
    // Expand to show 2-hop neighbors
    if (!graph) return;

    const pathSet = new Set<string>([nodeId]);
    const queue: Array<{ nodeId: string; depth: number }> = [
      { nodeId, depth: 0 }
    ];

    while (queue.length > 0) {
      const { nodeId: currId, depth } = queue.shift()!;

      if (depth >= 2) continue;

      const neighbors = graph.edges.filter(
        e => e.source === currId || e.target === currId
      );

      for (const edge of neighbors) {
        const neighborId = edge.source === currId ? edge.target : edge.source;
        if (!pathSet.has(neighborId)) {
          pathSet.add(neighborId);
          pathSet.add(edge.id);
          queue.push({ nodeId: neighborId, depth: depth + 1 });
        }
      }
    }

    setHighlightedPath(pathSet);
  };

  // 🎯 Handle node hover
  const handleNodeHover = (nodeId: string | null) => {
    setHoveredNode(nodeId);
  };

  // 🔍 Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query && graph) {
      const searchNode = graph.nodes.find(
        n => n.label.toLowerCase().includes(query.toLowerCase())
      );
      if (searchNode) {
        setHighlightedPath(new Set([searchNode.id]));
      }
    } else {
      setHighlightedPath(new Set());
    }
  };

  // 🎛️ Handle filter change
  const handleFilterChange = (types: Set<NodeType>) => {
    setFilters(types);
    loadGraph(Array.from(types));
  };

  // 📐 Handle zoom
  const handleZoom = (delta: number) => {
    setZoom(z => Math.max(0.1, Math.min(5, z + delta)));
  };

  // 🖱️ Handle pan drag
  const handlePanStart = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handlePanMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handlePanEnd = () => {
    setIsDragging(false);
  };

  // 💾 Export graph data
  const handleExport = () => {
    if (!graph) return;

    const dataStr = JSON.stringify(graph, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'knowledge-graph.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // 🌐 Initial load
  useEffect(() => {
    loadGraph();
  }, []);

  // 🎨 Render edge labels
  const getEdgeLabel = (type: EdgeType): string => {
    const labels = {
      applies: 'applies to',
      demonstrates: 'demonstrates',
      evaluates: 'evaluates',
      contains: 'contains',
      'related-to': 'related to',
    };
    return labels[type] || type;
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* 🌐 Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadGraph(Array.from(filters))}
            disabled={isLoading}
            className="gap-2 bg-white/50 dark:bg-slate-800/50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={!graph}
            className="gap-2 bg-white/50 dark:bg-slate-800/50"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>

          <div className="flex items-center gap-1 bg-white/50 dark:bg-slate-800/50 rounded-lg border p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleZoom(-0.2)}
              className="h-7 w-7 p-0"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs font-medium min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleZoom(0.2)}
              className="h-7 w-7 p-0"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <GraphSearch onSearch={handleSearch} />
          <GraphFilters
            selectedTypes={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      {/* 📊 Statistics Panel */}
      {graph && (
        <div className="absolute bottom-4 left-4 z-20 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg border p-3 shadow-lg">
          <div className="text-xs space-y-1">
            <div className="font-semibold flex items-center gap-2">
              <Network className="w-3 h-3" />
              Graph Statistics
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground">
              <span>Nodes: {graph.statistics.totalNodes}</span>
              <span>Edges: {graph.statistics.totalEdges}</span>
              <span>Components: {graph.statistics.connectedComponents}</span>
            </div>
          </div>
        </div>
      )}

      {/* 🎭 Graph Canvas */}
      <div
        ref={canvasRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onMouseDown={handlePanStart}
        onMouseMove={handlePanMove}
        onMouseUp={handlePanEnd}
        onMouseLeave={handlePanEnd}
      >
        <svg
          ref={svgRef}
          className="w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center',
          }}
        >
          <defs>
            {/* 🎨 Arrow marker for edges */}
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#64748b" />
            </marker>
          </defs>

          {/* 🔗 Render edges */}
          {graph?.edges.map((edge) => {
            const sourcePos = nodePositions.get(edge.source);
            const targetPos = nodePositions.get(edge.target);
            if (!sourcePos || !targetPos) return null;

            const isHighlighted =
              highlightedPath.has(edge.id) ||
              highlightedPath.has(edge.source) ||
              highlightedPath.has(edge.target) ||
              highlightedPath.size === 0;

            return (
              <GraphEdge
                key={edge.id}
                edge={edge}
                sourcePos={sourcePos}
                targetPos={targetPos}
                label={getEdgeLabel(edge.type)}
                highlighted={isHighlighted}
              />
            );
          })}

          {/* 🌟 Render nodes */}
          {graph?.nodes.map((node) => {
            const pos = nodePositions.get(node.id);
            if (!pos) return null;

            const isHighlighted =
              highlightedPath.has(node.id) || highlightedPath.size === 0;

            return (
              <GraphNode
                key={node.id}
                node={node}
                position={pos}
                highlighted={isHighlighted}
                onClick={() => handleNodeClick(node.id)}
                onDoubleClick={() => handleNodeDoubleClick(node.id)}
                onHover={() => handleNodeHover(node.id)}
              />
            );
          })}
        </svg>
      </div>

      {/* 📋 Node Details Panel */}
      {selectedNode && graph && (
        <div className="absolute top-20 right-4 z-20 w-80 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg border p-4 shadow-lg">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="text-sm font-semibold text-muted-foreground mb-1">
                {selectedNode.toUpperCase()}
              </div>
              <h3 className="text-lg font-bold">
                {graph.nodes.find(n => n.id === selectedNode)?.label}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedNode(null)}
              className="h-8 w-8 p-0"
            >
              ×
            </Button>
          </div>

          {graph.nodes.find(n => n.id === selectedNode)?.description && (
            <p className="text-sm text-muted-foreground mb-3">
              {graph.nodes.find(n => n.id === selectedNode)?.description}
            </p>
          )}

          <div className="space-y-2 text-xs">
            <div className="font-semibold">Connections:</div>
            {graph.edges
              .filter(e => e.source === selectedNode || e.target === selectedNode)
              .map((edge) => {
                const isSource = edge.source === selectedNode;
                const otherNodeId = isSource ? edge.target : edge.source;
                const otherNode = graph.nodes.find(n => n.id === otherNodeId);
                return (
                  <div key={edge.id} className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {isSource ? '→' : '←'}
                    </span>
                    <span className="font-medium">{otherNode?.label}</span>
                    <span className="text-muted-foreground">
                      ({getEdgeLabel(edge.type)})
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
