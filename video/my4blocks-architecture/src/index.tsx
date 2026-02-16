import React from 'react';
import { Frame, useCurrentFrame, useVideoConfig } from 'remotion';
import { OverviewDiagram } from './diagrams/Overview';
import { ChatFlowDiagram } from './diagrams/ChatFlow';
import { VoiceFlowDiagram } from './diagrams/VoiceFlow';
import { RAGSearchDiagram } from './diagrams/RAGSearch';
import { GraphExpansionDiagram } from './diagrams/GraphExpansion';
import { DecisionTreeDiagram } from './diagrams/DecisionTree';

export const My4BlocksArchitecture: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  const introDuration = 60;
  const diagramDuration = 120;
  const transitionDuration = 30;

  return (
    <div style={{ width, height, backgroundColor: '#0a0a0a' }}>
      {/* Intro */}
      <Frame 
        style={{
          position: 'absolute',
          top: height / 2 - 50,
          left: width / 2 - 200,
          fontSize: 48,
          color: '#ffffff',
          opacity: frame < introDuration ? 1 : 0,
          transition: 'opacity 1s ease-out',
        }}
      >
        My4Blocks V4 Architecture
      </Frame>

      {/* Overview Diagram */}
      <Frame 
        style={{
          position: 'absolute',
          top: 100,
          left: 100,
          opacity: frame >= introDuration && frame < introDuration + diagramDuration ? 1 : 0,
          transition: 'opacity 1s ease-out',
        }}
      >
        <OverviewDiagram />
      </Frame>

      {/* Chat Flow Diagram */}
      <Frame 
        style={{
          position: 'absolute',
          top: 100,
          left: 100,
          opacity: frame >= introDuration + diagramDuration + transitionDuration && 
                   frame < introDuration + 2 * diagramDuration + transitionDuration ? 1 : 0,
          transition: 'opacity 1s ease-out',
        }}
      >
        <ChatFlowDiagram />
      </Frame>

      {/* Voice Flow Diagram */}
      <Frame 
        style={{
          position: 'absolute',
          top: 100,
          left: 100,
          opacity: frame >= introDuration + 2 * diagramDuration + 2 * transitionDuration && 
                   frame < introDuration + 3 * diagramDuration + 2 * transitionDuration ? 1 : 0,
          transition: 'opacity 1s ease-out',
        }}
      >
        <VoiceFlowDiagram />
      </Frame>

      {/* RAG Search Diagram */}
      <Frame 
        style={{
          position: 'absolute',
          top: 100,
          left: 100,
          opacity: frame >= introDuration + 3 * diagramDuration + 3 * transitionDuration && 
                   frame < introDuration + 4 * diagramDuration + 3 * transitionDuration ? 1 : 0,
          transition: 'opacity 1s ease-out',
        }}
      >
        <RAGSearchDiagram />
      </Frame>

      {/* Graph Expansion Diagram */}
      <Frame 
        style={{
          position: 'absolute',
          top: 100,
          left: 100,
          opacity: frame >= introDuration + 4 * diagramDuration + 4 * transitionDuration && 
                   frame < introDuration + 5 * diagramDuration + 4 * transitionDuration ? 1 : 0,
          transition: 'opacity 1s ease-out',
        }}
      >
        <GraphExpansionDiagram />
      </Frame>

      {/* Decision Tree Diagram */}
      <Frame 
        style={{
          position: 'absolute',
          top: 100,
          left: 100,
          opacity: frame >= introDuration + 5 * diagramDuration + 5 * transitionDuration && 
                   frame < introDuration + 6 * diagramDuration + 5 * transitionDuration ? 1 : 0,
          transition: 'opacity 1s ease-out',
        }}
      >
        <DecisionTreeDiagram />
      </Frame>

      {/* Outro */}
      <Frame 
        style={{
          position: 'absolute',
          top: height / 2 - 50,
          left: width / 2 - 150,
          fontSize: 48,
          color: '#ffffff',
          opacity: frame >= introDuration + 6 * diagramDuration + 6 * transitionDuration ? 1 : 0,
          transition: 'opacity 1s ease-out',
        }}
      >
        Thank You!
      </Frame>
    </div>
  );
};