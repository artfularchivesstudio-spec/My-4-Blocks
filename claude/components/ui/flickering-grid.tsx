"use client"

import { useEffect, useRef } from "react"

interface FlickeringGridProps {
  className?: string
  squareSize?: number
  gridGap?: number
  color?: string
  maxOpacity?: number
  flickerChance?: number
  width?: number
  height?: number
}

export function FlickeringGrid({
  className = "",
  squareSize = 4,
  gridGap = 6,
  color = "rgb(107, 114, 128)",
  maxOpacity = 0.3,
  flickerChance = 0.1,
  width,
  height,
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    const w = width || rect.width
    const h = height || rect.height

    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.scale(dpr, dpr)

    const cols = Math.ceil(w / (squareSize + gridGap))
    const rows = Math.ceil(h / (squareSize + gridGap))

    const squares: Array<{ x: number; y: number; opacity: number }> = []

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        squares.push({
          x: i * (squareSize + gridGap),
          y: j * (squareSize + gridGap),
          opacity: Math.random() * maxOpacity,
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = color

      squares.forEach((square) => {
        if (Math.random() < flickerChance) {
          square.opacity = Math.random() * maxOpacity
        }
        ctx.globalAlpha = square.opacity
        ctx.fillRect(square.x, square.y, squareSize, squareSize)
      })

      requestAnimationFrame(draw)
    }

    draw()
  }, [squareSize, gridGap, color, maxOpacity, flickerChance, width, height])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  )
}
