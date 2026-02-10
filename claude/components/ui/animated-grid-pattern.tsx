"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface AnimatedGridPatternProps {
  className?: string
  width?: number
  height?: number
  x?: number
  y?: number
  strokeDasharray?: number
  numSquares?: number
  maxOpacity?: number
  duration?: number
  repeatDelay?: number
}

export function AnimatedGridPattern({
  className,
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 200,
  maxOpacity = 0.5,
  duration = 1,
  repeatDelay = 0.5,
}: AnimatedGridPatternProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = svgRef.current
    const rect = svg.getBoundingClientRect()
    const squares: Array<{ element: SVGRectElement; opacity: number }> = []

    for (let i = 0; i < numSquares; i++) {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
      rect.setAttribute("width", String(width))
      rect.setAttribute("height", String(height))
      rect.setAttribute("x", String((i % Math.sqrt(numSquares)) * (width + 1)))
      rect.setAttribute("y", String(Math.floor(i / Math.sqrt(numSquares)) * (height + 1)))
      rect.setAttribute("fill", "currentColor")
      rect.setAttribute("opacity", String(Math.random() * maxOpacity))
      svg.appendChild(rect)
      squares.push({ element: rect, opacity: Math.random() * maxOpacity })
    }

    const animate = () => {
      squares.forEach((square) => {
        const newOpacity = Math.random() * maxOpacity
        square.element.style.opacity = String(newOpacity)
        square.opacity = newOpacity
      })
    }

    const interval = setInterval(animate, duration * 1000)
    setTimeout(() => clearInterval(interval), (duration + repeatDelay) * 1000 * 10)

    return () => {
      clearInterval(interval)
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild)
      }
    }
  }, [numSquares, maxOpacity, duration, repeatDelay, width, height])

  return (
    <svg
      ref={svgRef}
      className={cn("absolute inset-0 h-full w-full", className)}
      style={{ opacity: 0.1 }}
    />
  )
}
