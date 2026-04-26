'use client'

/**
 * 🌟 The About Section - Gentle context for curious minds
 *
 * A compact explainer that clarifies the app’s purpose and philosophy,
 * without hijacking the chat experience. Elegant, calm, and a tiny bit poetic. 🎭
 */
export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24">
      <div className="rounded-2xl border border-border bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
        <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-3">
          About
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          My 4 Blocks is a calm, supportive guide grounded in the Four Blocks methodology
          by Dr. Vincent E. Parr. It helps you recognize the beliefs that create Anger,
          Anxiety, Depression, and Guilt—then gently challenges them so you can return to
          peace and clarity.
        </p>
      </div>
    </section>
  )
}
