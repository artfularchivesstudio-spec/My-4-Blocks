/**
 * 🎭 The Knowledge Graph Constellation Viewer ✨
 *
 * "Behold the web of wisdom! Each node a star, each edge a cosmic thread.
 *  Click to explore, hover to reveal, watch the constellation illuminate."
 *
 * - The Spellbinding Astronomer of Graph Topology
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { ForceGraph, ForceNode, ForceLink } from 'd3-force-graph';

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
  tags?: string[];
  confidence?: 'high' | 'medium' | 'low';
  contested?: boolean;
}

interface KnowledgeEdge {
  id: string;
  source: string | ForceNode;
  target: string | ForceNode;
  edge_type: EdgeType;
  weight: number;
  description?: string;
}

interface GraphData {
  nodes: KnowledgeNode[];
  links: KnowledgeEdge[];
}

// 🎨 Color palette for node types
const NODE_COLORS: Record<NodeType, string> = {
  concept: '#3b82f6',    // Blue
  scenario: '#10b981',  // Green
  lens: '#f59e0b',       // Amber
  rubric: '#ef4444',     // Red
  section: '#8b5cf6'     // Purple
};

// 🎨 Color palette for edge types
const EDGE_COLORS: Record<EdgeType, string> = {
  applies: '#f59e0b',
  demonstrates: '#10b981',
  evaluates: '#ef4444',
  contains: '#8b5cf6',
  'related-to': '#6b7280',
  contradicts: '#ec4899'
};

interface KnowledgeGraphViewerProps {
  initialData?: GraphData;
  width?: number;
  height?: number;
}

/**
 * 🌟 KnowledgeGraphViewer Component
 */
export function KnowledgeGraphViewer({
  initialData,
  width = 1200,
  height = 800
}: KnowledgeGraphViewerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<GraphData>(initialData || { nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<KnowledgeNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 🔍 Load initial data
  useEffect(() => {
    if (!initialData) {
      loadGraphData();
    }
  }, []);

  // 🎨 Render the force-directed graph
  useEffect(() => {
    if (!svgRef.current || data.nodes.length === 0) return;

    // Clear previous rendering
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const g = svg.append('g');

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    // Prepare data for D3 force simulation
    const nodes = data.nodes.map(n => ({ ...n }));
    const links = data.links.map(l => ({
      ...l,
      source: typeof l.source === 'string' ? l.source : l.source.id,
      target: typeof l.target === 'string' ? l.target : l.target.id
    }));

    // Create force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links as any)
        .id((d: any) => d.id)
        .distance(100)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Create arrow markers for directed edges
    const defs = g.append('defs');

    Object.entries(EDGE_COLORS).forEach(([edgeType, color]) => {
      defs.append('marker')
        .attr('id', `arrow-${edgeType}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 20)
        .attr('refY', 0)
        .attr('markerWidth', 8)
        .attr('markerHeight', 8)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', color);
    });

    // Create edge groups
    const edgeGroups = g.append('g')
      .selectAll('g')
      .data(links)
      .enter()
      .append('g')
      .attr('class', 'edge');

    // Add edges
    edgeGroups.append('line')
      .attr('stroke', (d: any) => EDGE_COLORS[d.edge_type] || '#999')
      .attr('stroke-width', (d: any) => Math.max(1, d.weight * 3))
      .attr('marker-end', (d: any) => `url(#arrow-${d.edge_type})`)
      .attr('opacity', 0.6);

    // Add edge labels (optional, on hover)
    const edgeLabels = edgeGroups.append('text')
      .attr('class', 'edge-label')
      .attr('font-size', '10px')
      .attr('fill', '#666')
      .attr('text-anchor', 'middle')
      .attr('dy', -5)
      .text((d: any) => d.edge_type)
      .attr('opacity', 0);

    // Create node groups
    const nodeGroups = g.append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag<SVGGElement>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any
      );

    // Add node circles
    nodeGroups.append('circle')
      .attr('r', 15)
      .attr('fill', (d: any) => NODE_COLORS[d.node_type] || '#999')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('cursor', 'pointer')
      .on('click', (event, d: any) => {
        event.stopPropagation();
        setSelectedNode(d);
      })
      .on('mouseover', (event, d: any) => {
        setHoveredNode(d);
        // Highlight connected edges
        edgeGroups
          .attr('opacity', (edge: any) => {
            const isConnected = edge.source.id === d.id || edge.target.id === d.id;
            return isConnected ? 1 : 0.1;
          });
      })
      .on('mouseout', () => {
        setHoveredNode(null);
        // Reset edge opacity
        edgeGroups.attr('opacity', 0.6);
      });

    // Add node labels
    nodeGroups.append('text')
      .attr('dy', 4)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('pointer-events', 'none')
      .text((d: any) => d.title.length > 15 ? d.title.substring(0, 12) + '...' : d.title);

    // Add legend
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(20, 20)`);

    let legendY = 0;
    Object.entries(NODE_COLORS).forEach(([nodeType, color]) => {
      legend.append('circle')
        .attr('cy', legendY)
        .attr('r', 6)
        .attr('fill', color);

      legend.append('text')
        .attr('x', 15)
        .attr('y', legendY + 4)
        .text(nodeType)
        .attr('font-size', '12px')
        .attr('fill', '#333');

      legendY += 25;
    });

    // Update positions on tick
    simulation.on('tick', () => {
      edgeGroups
        .select('line')
        .attr('x1', (d: any) => (d.source as any).x)
        .attr('y1', (d: any) => (d.source as any).y)
        .attr('x2', (d: any) => (d.target as any).x)
        .attr('y2', (d: any) => (d.target as any).y);

      edgeLabels
        .attr('x', (d: any) => ((d.source as any).x + (d.target as any).x) / 2)
        .attr('y', (d: any) => ((d.source as any).y + (d.target as any).y) / 2);

      nodeGroups
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

  }, [data, width, height]);

  /**
   * 📜 Load graph data from API
   */
  async function loadGraphData() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/knowledge/graph');
      const result = await response.json();

      if (result.data) {
        setData(result.data);
      }
    } catch (error) {
      console.error('💥 😭 Failed to load graph data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative">
      {/* 🎨 Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={loadGraphData}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? '🔄 Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {/* 📊 Selected Node Panel */}
      {selectedNode && (
        <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded shadow-lg max-w-sm">
          <h3 className="font-bold text-lg mb-2">{selectedNode.title}</h3>
          <div className="text-sm text-gray-600 mb-2">
            <span className="inline-block px-2 py-1 rounded text-white text-xs mr-1"
                  style={{ backgroundColor: NODE_COLORS[selectedNode.node_type] }}>
              {selectedNode.node_type}
            </span>
            {selectedNode.confidence && (
              <span className="text-gray-500">Confidence: {selectedNode.confidence}</span>
            )}
          </div>
          {selectedNode.description && (
            <p className="text-sm text-gray-700 mb-2">{selectedNode.description}</p>
          )}
          {selectedNode.tags && selectedNode.tags.length > 0 && (
            <div className="mb-2">
              <span className="text-xs text-gray-500">Tags: </span>
              {selectedNode.tags.map(tag => (
                <span key={tag} className="inline-block bg-gray-100 px-2 py-1 rounded text-xs mr-1 mt-1">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <button
            onClick={() => setSelectedNode(null)}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            Close
          </button>
        </div>
      )}

      {/* 🎭 SVG Graph */}
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border border-gray-300 rounded bg-white"
      />
    </div>
  );
}
