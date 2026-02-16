import React from 'react'
import { Frame, useCurrentFrame, useVideoConfig } from 'remotion'

export const RAGSearchDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Background */}
      <Frame 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#0a0a0a',
          borderRadius: 20,
          opacity: 0.8,
        }}
      ></Frame>

      {/* Title */}
      <Frame 
        style={{
          position: 'absolute',
          top: 50,
          left: centerX - 200,
          fontSize: 36,
          color: '#ffffff',
          fontWeight: 'bold',
          opacity: 1,
        }}
      >
        RAG Search Architecture
      </Frame>

      {/* Vector Search */}
      <Frame 
        style={{
          position: 'absolute',
          top: 120,
          left: 100,
          width: 200,
          height: 200,
          backgroundColor: '#1a1a1a',
          borderRadius: 10,
          opacity: 0.9,
        }}
      >
        <Frame 
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            fontSize: 24,
            color: '#4a9eff',
            fontWeight: 'bold',
          }}
        >
          Vector Search
        </Frame>
        <Frame 
          style={{
            position: 'absolute',
            top: 60,
            left: 20,
            fontSize: 16,
            color: '#cccccc',
            width: 160,
          }}
        >
          Cosine similarity
        </Frame>
      </Frame>

      {/* Keyword Search */}
      <Frame 
        style={{
          position: 'absolute',
          top: 350,
          left: centerX - 100,
          width: 200,
          height: 200,
          backgroundColor: '#2a2a2a',
          borderRadius: 15,
          opacity: 1,
        }}
      >
        <Frame 
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            fontSize: 24,
            color: '#ffffff',
            fontWeight: 'bold',
          }}
        >
          Keyword Search
        </Frame>
        <Frame 
          style={{
            position: 'absolute',
            top: 60,
            left: 20,
            fontSize: 16,
            color: '#cccccc',
            width: 160,
          }}
        >
          TF-IDF with boosting
        </Frame>
      </Frame>

      {/* Graph Expansion */}
      <Frame 
        style={{
          position: 'absolute',
          top: 120,
          left: width - 300,
          width: 200,
          height: 200,
          backgroundColor: '#1a1a1a',
          borderRadius: 10,
          opacity: 0.9,
        }}
      >
        <Frame 
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            fontSize: 24,
            color: '#4a9eff',
            fontWeight: 'bold',
          }}
        >
          Graph Expansion
        </Frame>
        <Frame 
          style={{
            position: 'absolute',
            top: 60,
            left: 20,
            fontSize: 16,
            color: '#cccccc',
            width: 160,
          }}
        >
          Related chunk traversal
        </Frame>
      </Frame>

      {/* Arrows */}
      <Frame 
        style={{
          position: 'absolute',
          top: 250,
          left: 200,
          width: 50,
          height: 50,
          backgroundColor: '#4a9eff',
          borderRadius: 25,
          transform: 'rotate(45deg)',
          opacity: 0.8,
        }}
      ></Frame>

      <Frame 
        style={{
          position: 'absolute',
          top: 250,
          left: centerX - 25,
          width: 50,
          height: 50,
          backgroundColor: '#4a9eff',
          borderRadius: 25,
          transform: 'rotate(45deg)',
          opacity: 0.8,
        }}
      ></Frame>

      <Frame 
        style={{
          position: 'absolute',
          top: 250,
          left: width - 250,
          width: 50,
          height: 50,
          backgroundColor: '#4a9eff',
          borderRadius: 25,
          transform: 'rotate(45deg)',
          opacity: 0.8,
        }}
      ></Frame>

      {/* Description */}
      <Frame 
        style={{
          position: 'absolute',
          top: 580,
          left: 100,
          width: width - 200,
          fontSize: 18,
          color: '#cccccc',
          textAlign: 'center',
        }}
      >
        Hybrid search combining semantic and keyword matching
      </Frame>
    </div>
  );
};