'use client';

/**
 * 🎭 The Graph Node - Cosmic Stardust Visualization ✨
 *
 * "Each concept a glowing star in the firmament of wisdom,
 *  burning with the color of its kind and the gravity of its meaning.
 *  Hover close and feel the warmth of understanding bloom."
 *
 * - The Spellbinding Museum Director of Celestial Nodes
 */

import React, { useMemo } from 'react';
import { GraphNodeData, NodeVisualization, NodeType } from './KnowledgeGraphView';

interface GraphNodeProps {
  node: GraphNodeData;
  position: NodeVisualization;
  highlighted: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
  onHover: () => void;
}

export default function GraphNode({
  node,
  position,
  highlighted,
  onClick,
  onDoubleClick,
  onHover,
}: GraphNodeProps) {
  // 🎨 Get node shape by type
  const getShape = (type: NodeType): string => {
    const shapes = {
      concept: 'circle',
      scenario: 'diamond',
      lens: 'circle',
      rubric: 'rect',
      section: 'rect',
    };
    return shapes[type] || 'circle';
  };

  const shape = getShape(node.type);

  // 🎨 Render the node based on shape
  const renderShape = () => {
    const opacity = highlighted ? 1 : 0.4;
    const stroke = highlighted ? position.color : '#64748b';
    const strokeWidth = highlighted ? 3 : 1;

    switch (shape) {
      case 'circle':
        return (
          <circle
            cx={position.x}
            cy={position.y}
            r={position.radius}
            fill={position.color}
            stroke={stroke}
            strokeWidth={strokeWidth}
            opacity={opacity}
            className="transition-all duration-200 cursor-pointer hover:opacity-80"
            style={{ filter: highlighted ? 'drop-shadow(0 0 8px ' + position.color + ')' : 'none' }}
          />
        );

      case 'diamond':
        return (
          <polygon
            points={`${position.x},${position.y - position.radius} ${
              position.x + position.radius
            },${position.y} ${position.x},${position.y + position.radius} ${
              position.x - position.radius
            },${position.y}`}
            fill={position.color}
            stroke={stroke}
            strokeWidth={strokeWidth}
            opacity={opacity}
            className="transition-all duration-200 cursor-pointer hover:opacity-80"
            style={{ filter: highlighted ? 'drop-shadow(0 0 8px ' + position.color + ')' : 'none' }}
          />
        );

      case 'rect':
        const size = position.radius * 1.5;
        return (
          <rect
            x={position.x - size / 2}
            y={position.y - size / 2}
            width={size}
            height={size}
            rx={4}
            fill={position.color}
            stroke={stroke}
            strokeWidth={strokeWidth}
            opacity={opacity}
            className="transition-all duration-200 cursor-pointer hover:opacity-80"
            style={{ filter: highlighted ? 'drop-shadow(0 0 8px ' + position.color + ')' : 'none' }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <g
      className="node-group"
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={onHover}
      onMouseLeave={() => onHover('')}
    >
      {/* ✨ The node shape */}
      {renderShape()}

      {/* 🏷️ Node label */}
      <text
        x={position.x}
        y={position.y + position.radius + 15}
        textAnchor="middle"
        className="text-xs font-medium fill-slate-700 dark:text-slate-300 pointer-events-none"
        style={{ opacity: highlighted ? 1 : 0.5 }}
      >
        {node.label.length > 20 ? node.label.slice(0, 17) + '...' : node.label}
      </text>

      {/* 🎯 Type indicator */}
      <text
        x={position.x}
        y={position.y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs font-bold fill-white pointer-events-none"
        style={{ fontSize: position.radius * 0.8, opacity: highlighted ? 1 : 0.7 }}
      >
        {node.type.charAt(0).toUpperCase()}
      </text>
    </g>
  );
}
