"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * 🎭 FlickeringGrid - The Dynamic Digital Canvas
 * 
 * "A grid of light that dances with the rhythms of thought.
 * Subtle, flickering, and full of life."
 */

interface FlickeringGridProps {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "rgb(0, 0, 0)",
  width,
  height,
  className,
  maxOpacity = 0.3,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const memoizedColor = useMemo(() => {
    const rgb = color.match(/\d+/g);
    if (!rgb) return `0, 0, 0`;
    return `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;
  }, [color]);

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, width: number, height: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      return { ctx, cols: Math.floor(width / (squareSize + gridGap)), rows: Math.floor(height / (squareSize + gridGap)) };
    },
    [squareSize, gridGap]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: containerWidth, height: containerHeight } = entry.contentRect;
        setCanvasSize({ width: width || containerWidth, height: height || containerHeight });
      }
    });

    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    intersectionObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvasSize.width === 0 || canvasSize.height === 0 || !isInView) return;

    const { ctx, cols, rows } = setupCanvas(canvas, canvasSize.width, canvasSize.height);
    if (!ctx) return;

    let animationFrameId: number;
    const gridParams = new Float32Array(cols * rows);

    // 🌟 Initialize grid with random opacities
    for (let i = 0; i < gridParams.length; i++) {
      gridParams[i] = Math.random() * maxOpacity;
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const index = i * rows + j;
          
          // 🎨 Update flicker logic
          if (Math.random() < flickerChance) {
            gridParams[index] = Math.random() * maxOpacity;
          }

          ctx.fillStyle = `rgba(${memoizedColor}, ${gridParams[index]})`;
          ctx.fillRect(
            i * (squareSize + gridGap),
            j * (squareSize + gridGap),
            squareSize,
            squareSize
          );
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasSize, isInView, flickerChance, maxOpacity, memoizedColor, squareSize, gridGap, setupCanvas]);

  return (
    <div ref={containerRef} className={`size-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
        }}
      />
    </div>
  );
};
