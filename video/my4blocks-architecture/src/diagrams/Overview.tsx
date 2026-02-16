import React from 'react'
import { Frame, useCurrentFrame, useVideoConfig } from 'remotion'

export const OverviewDiagram: React.FC = () => {
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
        My4Blocks V4 Architecture
      </Frame>

      {/* Three UI Variants */}
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
          Claude UI
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
          Teal-themed interface
        </Frame>
      </Frame>

      <Frame 
        style={{
          position: 'absolute',
          top: 120,
          left: centerX - 100,
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
            color: '#ea4335',
            fontWeight: 'bold',
          }}
        >
          Gemini UI
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
          Beige-themed interface
        </Frame>
      </Frame>

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
            color: '#ff6b35',
            fontWeight: 'bold',
          }}
        >
          V0 UI
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
          Modern interface
        </Frame>
      </Frame>

      {/* Shared Library */}
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
          Shared Library
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
          Unified intelligence
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
          backgroundColor: '#ea4335',
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
          backgroundColor: '#ff6b35',
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
        Three UI variants powered by the same unified intelligence
      </Frame>
    </div>
  );
};