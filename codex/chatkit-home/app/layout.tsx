import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'

/**
 * 🎭 ChatKit Home Layout — "Where the Four Blocks Meet Conversation" 🌿✨
 *
 * A therapeutic ChatKit experience powered by OpenAI and guided by
 * Dr. Vincent E. Parr's Four Blocks framework. Transform Anger, Anxiety,
 * Depression, and Guilt into peace and understanding.
 *
 * ChatKit Runtime: https://cdn.platform.openai.com/deployments/chatkit/chatkit.js
 * Docs: https://platform.openai.com/docs/guides/chatkit
 *
 * - The Spellbinding Layout Architect 🏛️
 */
export const metadata: Metadata = {
  title: 'My 4 Blocks | Transform Your Emotions',
  description: 'An AI-powered companion that helps you understand and transform Anger, Anxiety, Depression, and Guilt into peace. Based on the Four Blocks methodology by Dr. Vincent E. Parr.',
  keywords: ['mental wellness', 'four blocks', 'emotional health', 'anger management', 'anxiety relief', 'Dr. Vincent Parr'],
  authors: [{ name: 'Dr. Vincent E. Parr' }],
  openGraph: {
    title: 'My 4 Blocks | Transform Your Emotions',
    description: 'Transform Anger, Anxiety, Depression, and Guilt into peace and understanding.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f1a16',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  )
}

