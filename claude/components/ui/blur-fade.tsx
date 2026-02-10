"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface BlurFadeProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  offset?: number
  direction?: "up" | "down" | "left" | "right"
  inView?: boolean
  blur?: string
}

export function BlurFade({
  children,
  className,
  delay = 0,
  duration = 0.4,
  offset = 6,
  direction = "down",
  inView = false,
  blur = "6px",
}: BlurFadeProps) {
  const directionMap = {
    up: { y: offset },
    down: { y: -offset },
    left: { x: offset },
    right: { x: -offset },
  }

  const initial = directionMap[direction]
  const animate = { x: 0, y: 0, opacity: 1, filter: "blur(0px)" }

  return (
    <motion.div
      initial={{
        ...initial,
        opacity: 0,
        filter: `blur(${blur})`,
      }}
      animate={inView ? animate : {}}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
