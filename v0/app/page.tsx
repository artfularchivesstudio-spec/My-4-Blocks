'use client'

import { ChatContainer } from '@/components/chat/chat-container'
import { Header } from '@/components/layout/header'
import { AmbientBackground } from '@/components/layout/ambient-background'
import { Sparkles, ArrowRight, Smartphone } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Home() {
  const [showInvite, setShowInvite] = useState(false)

  useEffect(() => {
    // Show the invite after a short delay for a "magical" entrance
    const timer = setTimeout(() => setShowInvite(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleReset = () => {
    window.location.reload()
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background relative">
      <AmbientBackground />
      <Header onReset={handleReset} />
      
      {/* 🌟 The Enchanted App Invitation - A Portal to the Pocket Sanctuary */}
      {showInvite && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="bg-primary/95 backdrop-blur-2xl border border-primary-foreground/30 rounded-2xl p-5 shadow-[0_12px_48px_rgba(0,0,0,0.2)] flex items-center justify-between gap-4 group cursor-pointer hover:bg-primary transition-all duration-500 overflow-hidden">
            {/* ✨ Magical Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center text-primary-foreground shadow-inner group-hover:scale-110 transition-transform duration-500">
                <Smartphone className="w-6 h-6 animate-float" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-primary-foreground flex items-center gap-2">
                  The Pocket Sanctuary <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                </h3>
                <p className="text-sm text-primary-foreground/90 leading-snug">Experience the magic of My 4 Blocks anywhere. Join the TestFlight today!</p>
              </div>
            </div>
            <a 
              href="https://testflight.apple.com/join/Ay3BWxKW" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-foreground/20 text-primary-foreground group-hover:bg-primary-foreground group-hover:text-primary transition-all duration-500 shadow-lg"
            >
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                setShowInvite(false)
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-background/80 backdrop-blur-md border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <main id="main-content" className="flex-1 flex flex-col overflow-hidden min-h-0">
        <ChatContainer />
      </main>
    </div>
  )
}
