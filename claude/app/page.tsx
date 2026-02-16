'use client'

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { DotPattern } from "@/components/ui/dot-pattern"
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"

export default function Home() {
  return (
    <div
      id="main-content"
      style={{
      minHeight: "100vh",
      background: "#fafafa",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "clamp(20px, 5vw, 40px) clamp(16px, 4vw, 20px)",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Calm Static Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <DotPattern
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1}
          className="w-full h-full"
        />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: "clamp(24px, 4vw, 32px)", position: "relative", zIndex: 1 }}
      >
{/* 🎨 The Four Blocks Logo - Clean SVG with accessibility */}
        <Image
          src="/logo-blocks.svg"
          alt="My 4 Blocks Logo - Four emotional blocks: Anger, Anxiety, Depression, and Guilt"
          width={100}
          height={100}
          style={{
            objectFit: "contain",
            display: "block",
            width: "clamp(80px, 15vw, 100px)",
            height: "auto"
          }}
          priority
        />
      </motion.div>

      {/* Title with Animated Gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ textAlign: "center", marginBottom: "clamp(20px, 3vw, 24px)", position: "relative", zIndex: 1, padding: "0 clamp(16px, 4vw, 0)" }}
      >
        <AnimatedGradientText style={{
          fontSize: "clamp(1.75rem, 8vw, 3rem)",
          fontFamily: "serif",
          letterSpacing: "-0.02em",
          marginBottom: "clamp(16px, 3vw, 24px)",
          display: "block",
          lineHeight: 1.2
        }}>
          My 4 Blocks
        </AnimatedGradientText>
      </motion.div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{ textAlign: "center", maxWidth: "min(600px, 90vw)", marginBottom: "clamp(24px, 4vw, 32px)", position: "relative", zIndex: 1, padding: "0 clamp(16px, 4vw, 0)" }}
      >
        <p style={{
          fontSize: "clamp(0.95rem, 2.5vw, 1.125rem)",
          lineHeight: 1.7,
          color: "#666",
          marginBottom: "clamp(16px, 3vw, 24px)"
        }}>
          Discover how <span style={{ color: "#ef4444", fontWeight: 500 }}>Anger</span>, <span style={{ color: "#f59e0b", fontWeight: 500 }}>Anxiety</span>, <span style={{ color: "#3b82f6", fontWeight: 500 }}>Depression</span>, and <span style={{ color: "#a855f7", fontWeight: 500 }}>Guilt</span> are created—and learn to transform them into peace.
        </p>
      </motion.div>

      {/* Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{ maxWidth: "min(400px, 85vw)", margin: "0 auto clamp(24px, 4vw, 32px)", position: "relative", padding: "0 clamp(16px, 4vw, 24px)", zIndex: 1 }}
      >
        <div style={{ position: "absolute", top: "-8px", left: "clamp(8px, 2vw, -8px)", fontSize: "clamp(1.5rem, 4vw, 2rem)", color: "rgba(0,0,0,0.1)", fontFamily: "serif" }}>&quot;</div>
        <p style={{ fontStyle: "italic", color: "#666", fontSize: "clamp(0.8rem, 2vw, 0.875rem)", lineHeight: 1.6 }}>
          Nothing and no one has ever upset you.
        </p>
        <footer style={{ marginTop: "8px", fontSize: "clamp(0.7rem, 1.8vw, 0.75rem)", color: "#999" }}>— Dr. Vincent E. Parr</footer>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(12px, 2vw, 16px)",
          maxWidth: "min(300px, 80vw)",
          margin: "0 auto clamp(24px, 4vw, 32px)",
          position: "relative",
          zIndex: 1
        }}
      >
        <div style={{ flex: 1, height: "1px", background: "#e5e5e5" }} />
        <div style={{ flex: 1, height: "1px", background: "#e5e5e5" }} />
      </motion.div>

      {/* CTA Button - VIBRANT GRADIENT */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "center", width: "100%" }}
      >
        <Link href="/chat" style={{ textDecoration: "none", display: "block", width: "100%", maxWidth: "min(320px, 90vw)" }}>
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: "clamp(18px, 4vw, 22px) clamp(36px, 8vw, 56px)",
              width: "100%",
              display: "block",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: "14px",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(102, 126, 234, 0.5), 0 10px 40px rgba(118, 75, 162, 0.4)",
              transition: "all 0.3s ease"
            }}
          >
            <span style={{
              fontSize: "clamp(1.05rem, 2.8vw, 1.2rem)",
              fontWeight: 700,
              color: "white",
              letterSpacing: "0.08em",
              display: "block",
              textAlign: "center",
              textShadow: "0 2px 4px rgba(0,0,0,0.25)"
            }}>
              START YOUR JOURNEY
            </span>
          </motion.button>
        </Link>
      </motion.div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  )
}
