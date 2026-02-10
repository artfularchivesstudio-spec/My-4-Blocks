"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface BorderBeamProps {
  className?: string
  size?: number
  duration?: number
  delay?: number
  colorFrom?: string
  colorTo?: string
  reverse?: boolean
  initialOffset?: number
  borderWidth?: number
  children?: ReactNode
}

export function BorderBeam({
  className,
  size = 50,
  duration = 6,
  delay = 0,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  reverse = false,
  initialOffset = 0,
  borderWidth = 1,
  children,
}: BorderBeamProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: "inherit",
        }}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
      >
        <motion.div
          className="absolute"
          style={{
            width: `${size}px`,
            height: `${borderWidth}px`,
            background: `linear-gradient(90deg, ${colorFrom}, ${colorTo})`,
            top: 0,
            left: `${initialOffset}%`,
          }}
          animate={{
            x: [
              "0%",
              "calc(100vw - 100%)",
              "0%"
            ],
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute"
          style={{
            width: `${borderWidth}px`,
            height: `${size}px`,
            background: `linear-gradient(180deg, ${colorFrom}, ${colorTo})`,
            top: `${initialOffset}%`,
            right: 0,
          }}
          animate={{
            y: [
              "0%",
              "calc(100vh - 100%)",
              "0%"
            ],
          }}
          transition={{
            duration,
            delay: delay + duration / 4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute"
          style={{
            width: `${size}px`,
            height: `${borderWidth}px`,
            background: `linear-gradient(270deg, ${colorFrom}, ${colorTo})`,
            bottom: 0,
            right: `${initialOffset}%`,
          }}
          animate={{
            x: [
              "0%",
              "calc(-100vw + 100%)",
              "0%"
            ],
          }}
          transition={{
            duration,
            delay: delay + duration / 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute"
          style={{
            width: `${borderWidth}px`,
            height: `${size}px`,
            background: `linear-gradient(0deg, ${colorFrom}, ${colorTo})`,
            bottom: `${initialOffset}%`,
            left: 0,
          }}
          animate={{
            y: [
              "0%",
              "calc(-100vh + 100%)",
              "0%"
            ],
          }}
          transition={{
            duration,
            delay: delay + (duration * 3) / 4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>
    </div>
  )
}
