'use client';

/**
 * 🔗 The Graph Edge - Cosmic Tethers of Meaning ✨
 *
 * "Edges bind the stars in constellations of thought,
 *  glowing with the light of relationship and purpose.
 *  Follow the golden threads and discover new connections."
 *
 * - The Spellbinding Museum Director of Interstellar Links
 */

import React from 'react';
import { GraphEdgeData, NodeVisualization, EdgeType } from './KnowledgeGraphView';

interface GraphEdgeProps {
  edge: GraphEdgeData;
  sourcePos: NodeVisualization;
  targetPos: NodeVisualization;
  label: string;
  highlighted: boolean;
}

export default function GraphEdge({
  edge,
  sourcePos,
  targetPos,
  label,
  highlighted,
}: GraphEdgeProps) {
  // 🎨 Get edge color by type
  const getColor = (type: EdgeType): string => {
    const colors = {
      applies: '#8b5cf6',      // Purple
      demonstrates: '#10b981', // Green
      evaluates: '#f59e0b',     // Orange
      contains: '#ef4444',     // Red
      'related-to': '#64748b', // Slate
    };
    return colors[type] || '#64748b';
  };

  const color = getColor(edge.type);
  const opacity = highlighted ? 0.8 : 0.2;
  const strokeWidth = highlighted ? 2 : 1;

  // 🎯 Calculate edge label position
  const midX = (sourcePos.x + targetPos.x) / 2;
  const midY = (sourcePos.y + targetPos.y) / 2;

  // 📐 Calculate angle for label rotation
  const angle = Math.atan2(targetPos.y - sourcePos.y, targetPos.x - sourcePos.x);
  const labelAngle = angle > Math.PI / 2 || angle < -Math.PI / 2 ? angle + Math.PI : angle;

  return (
    <g className="edge-group">
      {/* 🔗 The edge line */}
      <line
        x1={sourcePos.x}
        y1={sourcePos.y}
        x2={targetPos.x}
        y2={targetPos.y}
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={opacity}
        markerEnd="url(#arrowhead)"
        className="transition-all duration-200"
        style={{
          filter: highlighted ? `drop-shadow(0 0 4px ${color})` : 'none',
        }}
      />

      {/* 🏷️ Edge label (background) */}
      {highlighted && (
        <rect
          x={midX - 25}
          y={midY - 8}
          width={50}
          height={16}
          rx={4}
          fill="white"
          opacity={0.9}
          className="pointer-events-none"
        />
      )}

      {/* 🏷️ Edge label (text) */}
      {highlighted && (
        <text
          x={midX}
          y={midY}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[10px] font-medium fill-slate-700 pointer-events-none"
          transform={`rotate(${labelAngle}rad, ${midX}, ${midY})`}
          style={{
            fontSize: '9px',
          }}
        >
          {label}
        </text>
      )}
    </g>
  );
}
