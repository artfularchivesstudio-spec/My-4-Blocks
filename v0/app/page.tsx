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
          <div className="bg-primary/90 backdrop-blur-xl border border-primary-foreground/20 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex items-center justify-between gap-4 group cursor-pointer hover:bg-primary transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center text-primary-foreground animate-pulse">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-primary-foreground">The Pocket Sanctuary Awaits</h3>
                <p className="text-xs text-primary-foreground/80 leading-tight">Try our magical new mobile app for the full experience.</p>
              </div>
            </div>
            <a 
              href="https://testflight.apple.com/join/placeholder" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-foreground/20 text-primary-foreground group-hover:bg-primary-foreground group-hover:text-primary transition-all duration-300"
            >
              <ArrowRight className="w-4 h-4" />
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
