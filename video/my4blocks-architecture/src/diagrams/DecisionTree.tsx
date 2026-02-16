import React from 'react'
import { Frame, useCurrentFrame, useVideoConfig } from 'remotion'

export const DecisionTreeDiagram: React.FC = () => {
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
        Decision Tree Architecture
      </Frame>

      {/* Start Node */}
      <Frame 
        style={{
          position: 'absolute',
          top: 120,
          left: centerX - 50,
          width: 100,
          height: 100,
          backgroundColor: '#1a1a1a',
          borderRadius: 50,
          opacity: 0.9,
        }}
      >
        <Frame 
          style={{
            position: 'absolute',
            top: 30,
            left: 20,
            fontSize: 24,
            color: '#4a9eff',
            fontWeight: 'bold',
          }}
        >
          Start
        </Frame>
      </Frame>

      {/* Chat Mode Node */}
      <Frame 
        style={{
          position: 'absolute',
          top: 280,
          left: 100,
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
          Chat Mode
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
          Text-based interaction
        </Frame>
      </Frame>

      {/* Voice Mode Node */}
      <Frame 
        style={{
          position: 'absolute',
          top: 280,
          left: width - 300,
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
          Voice Mode
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
          Speech-based interaction
        </Frame>
      </Frame>

      {/* Arrows */}
      <Frame 
        style={{
          position: 'absolute',
          top: 220,
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
          top: 380,
          left: 250,
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
          top: 380,
          left: width - 300,
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
          top: 520,
          left: 100,
          width: width - 200,
          fontSize: 18,
          color: '#cccccc',
          textAlign: 'center',
        }}
      >
        Decision tree routing between chat and voice modes
      </Frame>
    </div>
  );
};