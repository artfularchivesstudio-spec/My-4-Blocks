'use client'

import { cn } from '@/lib/utils'
import { Heart, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer
      className={cn(
        'border-t border-border bg-muted/30',
        'px-4 py-6'
      )}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span>Based on</span>
            <a
              href="https://parrinstitute.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium"
            >
              "You Only Have Four Problems"
              <ExternalLink className="h-3 w-3" />
            </a>
            <span>by Dr. Vincent E. Parr</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Inspired by</span>
            <span className="text-foreground font-medium">Albert Ellis</span>
            <span>&</span>
            <span className="text-foreground font-medium">CBT</span>
            <Heart className="h-3 w-3 text-guilt" />
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground/70 mt-4">
          This is an educational tool. For serious mental health concerns, please consult a qualified professional.
        </p>
      </div>
    </footer>
  )
}
