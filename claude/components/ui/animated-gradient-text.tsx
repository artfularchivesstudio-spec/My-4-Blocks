"use client"

import { cn } from "@/lib/utils"

interface AnimatedGradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  className?: string
  speed?: number
  colorFrom?: string
  colorTo?: string
}

export function AnimatedGradientText({
  children,
  className,
  speed = 1,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  style,
  ...props
}: AnimatedGradientTextProps) {
  return (
    <span
      className={cn(
        "inline-block animate-gradient bg-gradient-to-r bg-clip-text text-transparent",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(to right, ${colorFrom}, ${colorTo}, ${colorFrom})`,
        backgroundSize: "200% auto",
        animation: `gradient ${3 / speed}s linear infinite`,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  )
}
