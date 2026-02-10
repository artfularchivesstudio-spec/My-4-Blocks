'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

/**
 * ✨ The Flickering Grid - A constellation of tiny squares
 *
 * Inspired by Magic UI’s `FlickeringGrid` background component.
 * Docs: `https://magicui.design/docs/components/flickering-grid`
 *
 * This renders a Canvas-based grid where each square randomly changes opacity
 * over time. It’s deliberately subtle so your UI feels “alive” without
 * screaming “I AM AN ANIMATED BACKGROUND, LOOK AT ME!!!” 🎭
 */
export interface FlickeringGridProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Size of each square in the grid (CSS pixels). */
  squareSize?: number
  /** Gap between squares in the grid (CSS pixels). */
  gridGap?: number
  /** Probability factor for flickering per second (0..1-ish). */
  flickerChance?: number
  /** Square color (any valid CSS color string). */
  color?: string
  /** Fixed width; otherwise uses container width. */
  width?: number
  /** Fixed height; otherwise uses container height. */
  height?: number
  /** Maximum opacity of squares (0..1). */
  maxOpacity?: number
}

type GridParams = {
  cols: number
  rows: number
  squares: Float32Array
  dpr: number
}

export function FlickeringGrid({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = 'rgb(0, 0, 0)',
  width,
  height,
  className,
  maxOpacity = 0.2,
  ...props
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isInView, setIsInView] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  const memoizedColorPrefix = useMemo(() => {
    // 🌈 Convert any CSS color to an rgba(r,g,b, prefix we can quickly append opacity to.
    const toRGBAColorPrefix = (inputColor: string) => {
      if (typeof window === 'undefined') return 'rgba(0, 0, 0,'

      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 1
      const ctx = canvas.getContext('2d')
      if (!ctx) return 'rgba(0, 0, 0,'

      ctx.fillStyle = inputColor
      ctx.fillRect(0, 0, 1, 1)

      const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data)
      return `rgba(${r}, ${g}, ${b},`
    }

    return toRGBAColorPrefix(color)
  }, [color])

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, w: number, h: number): GridParams => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`

      const cols = Math.max(1, Math.floor(w / (squareSize + gridGap)))
      const rows = Math.max(1, Math.floor(h / (squareSize + gridGap)))

      const squares = new Float32Array(cols * rows)
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity
      }

      return { cols, rows, squares, dpr }
    },
    [squareSize, gridGap, maxOpacity]
  )

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTimeSeconds: number) => {
      // 🎲 A little randomness, a little restraint, a whole lot of vibe.
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTimeSeconds) {
          squares[i] = Math.random() * maxOpacity
        }
      }
    },
    [flickerChance, maxOpacity]
  )

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      { cols, rows, squares, dpr }: GridParams
    ) => {
      ctx.clearRect(0, 0, w, h)

      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          const opacity = squares[x * rows + y]
          if (opacity <= 0) continue

          ctx.fillStyle = `${memoizedColorPrefix}${opacity})`
          ctx.fillRect(
            x * (squareSize + gridGap) * dpr,
            y * (squareSize + gridGap) * dpr,
            squareSize * dpr,
            squareSize * dpr
          )
        }
      }
    },
    [memoizedColorPrefix, squareSize, gridGap]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId = 0
    let gridParams: GridParams | null = null
    let lastTime = 0

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    const updateCanvasSize = () => {
      const newWidth = width ?? container.clientWidth
      const newHeight = height ?? container.clientHeight
      setCanvasSize({ width: newWidth, height: newHeight })
      gridParams = setupCanvas(canvas, newWidth, newHeight)
    }

    updateCanvasSize()

    const animate = (time: number) => {
      if (!isInView || !gridParams) return

      if (!lastTime) lastTime = time
      const deltaTime = Math.max(0, (time - lastTime) / 1000)
      lastTime = time

      // 🧘 If the user prefers reduced motion, we freeze the flicker (but still render).
      if (!prefersReducedMotion) {
        updateSquares(gridParams.squares, deltaTime)
      }

      drawGrid(ctx, canvas.width, canvas.height, gridParams)
      animationFrameId = requestAnimationFrame(animate)
    }

    const resizeObserver = new ResizeObserver(() => updateCanvasSize())
    resizeObserver.observe(container)

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0 }
    )
    intersectionObserver.observe(container)

    if (isInView) {
      animationFrameId = requestAnimationFrame(animate)
    }

    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView])

  return (
    <div
      ref={containerRef}
      className={cn('relative size-full', className)}
      // eslint-disable-next-line react/no-unknown-property
      data-canvas-width={canvasSize.width}
      // eslint-disable-next-line react/no-unknown-property
      data-canvas-height={canvasSize.height}
      {...props}
    >
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  )
}

