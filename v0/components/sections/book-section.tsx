'use client'

/**
 * 📘 The Book Section - A gentle nod to the source material
 *
 * Keeps the book reference grounded and warm, without turning into a sales pitch.
 * Knowledge, not noise. 📚✨
 */
export function BookSection() {
  return (
    <section id="book" className="scroll-mt-24">
      <div className="rounded-2xl border border-border bg-background/70 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
        <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-3">
          The Book
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Based on{' '}
          <span className="font-medium text-foreground">
            &quot;You Only Have Four Problems&quot;
          </span>{' '}
          by Dr. Vincent E. Parr. The book teaches that our emotions are created by
          beliefs, not events—and that learning to dispute those beliefs unlocks
          peace, contentment, and joy.
        </p>
      </div>
    </section>
  )
}
