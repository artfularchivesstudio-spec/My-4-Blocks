'use client';

import { ChatInterface } from '@/components/ChatInterface';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

/**
 * 🎭 The Grand Entrance - My 4 Blocks Landing
 *
 * "Step into the sanctuary of self-discovery.
 * Leave your troubles at the portal and enter the space of clarity."
 */
export default function Home() {
  return (
    <main id="main-content" className="min-h-screen relative flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-purple-50/30 via-white to-blue-50/20 overflow-hidden">

      <div className="w-full flex flex-col items-center gap-8 relative z-10">
        {/* 🎭 Header Masterpiece */}
        <div className="text-center space-y-4 mb-4">
          <div className="flex flex-col items-center justify-center gap-4 mb-2">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="relative"
            >
              <div className="absolute inset-0 blur-xl bg-purple-500/20 rounded-full" />
              <Image 
                src="/logo.webp" 
                alt="My 4 Blocks Logo" 
                width={120} 
                height={120} 
                className="drop-shadow-sm relative z-10"
              />
            </motion.div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-xs uppercase tracking-[0.3em] text-purple-600/80 font-medium">
                Rational Emotive Wisdom
              </span>
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-gray-900">
            You Only Have <span className="text-purple-600 font-normal">Four</span> Problems
          </h1>
          <p className="text-black/40 font-light text-lg italic max-w-2xl mx-auto">
            "The cause of and solution to emotional suffering is in your hands."
          </p>
        </div>

        {/* 🔮 The Portal Itself */}
        <ChatInterface />

        {/* 📜 Footer Credits - now within content flow */}
        <footer className="py-8 text-[10px] text-black/20 uppercase tracking-[0.2em]">
          Inspired by Dr. Vincent Parr & Dr. Albert Ellis
        </footer>
      </div>
    </main>
  );
}
