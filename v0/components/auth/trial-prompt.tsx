'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Sparkles, UserPlus, LogIn } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * 🎁 The Trial Prompt - Gentle Conversion at the 3-Message Threshold
 *
 * "After three exchanges, we gently remind the wanderer:
 * 'Your journey is precious. Would you like to save it?'
 * No hard walls, just an invitation to continuity."
 *
 * - The Gracious Host of Digital Hospitality
 */

interface TrialPromptProps {
  messageCount: number
  onDismiss: () => void
}

export function TrialPrompt({ messageCount, onDismiss }: TrialPromptProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  // 🌙 Only show after exactly 3 user messages (which means 3-6 total messages)
  const shouldShow = messageCount >= 3 && !isDismissed

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss()
  }

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md"
        >
          <Card className="border-primary/20 shadow-2xl bg-gradient-to-br from-background to-muted/30 backdrop-blur-xl">
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-muted transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
            
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <CardTitle className="text-lg font-serif">Save Your Journey?</CardTitle>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                You&apos;ve had a meaningful conversation. Create a free account to save your 
                history, revisit insights, and continue your healing journey across devices.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild className="flex-1 gap-2">
                  <Link href="/signup">
                    <UserPlus className="w-4 h-4" />
                    Create Free Account
                  </Link>
                </Button>
                <Button variant="outline" asChild className="flex-1 gap-2">
                  <Link href="/login">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Link>
                </Button>
              </div>
              
              <button
                onClick={handleDismiss}
                className="w-full mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Continue without saving →
              </button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * 🎯 Message Counter Hook - Track the anonymous trial journey
 */
export function useTrialCounter() {
  const [userMessageCount, setUserMessageCount] = useState(0)
  const [isDismissed, setIsDismissed] = useState(false)

  const incrementCount = () => {
    setUserMessageCount(prev => prev + 1)
  }

  const dismiss = () => {
    setIsDismissed(true)
  }

  const reset = () => {
    setUserMessageCount(0)
    setIsDismissed(false)
  }

  return {
    userMessageCount,
    isDismissed,
    incrementCount,
    dismiss,
    reset,
    shouldShowPrompt: userMessageCount >= 3 && !isDismissed,
  }
}
