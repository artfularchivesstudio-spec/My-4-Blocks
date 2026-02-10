'use client'

import { useMemo, useState } from 'react'
import { ChatKit, useChatKit } from '@openai/chatkit-react'

/**
 * 🎭 My 4 Blocks — ChatKit Home (Codex edition)
 *
 * A standalone ChatKit embed that lives in `codex/`, not in `v0/`.
 *
 * Theming options reference:
 * - `https://platform.openai.com/docs/guides/chatkit-themes`
 *
 * (Sassy aside) 🧂: This page has one job: load ChatKit. It will not volunteer
 * to show “About” cards unless you explicitly ask it to.
 */
export default function HomePage() {
  const [setupError, setSetupError] = useState<string | null>(null)

  // 🎨 ChatKit theming - therapeutic forest green to match My 4 Blocks
  const options = useMemo(
    () => ({
      theme: {
        colorScheme: 'dark' as const,
        color: { accent: { primary: '#4a9b7f', level: 2 as const } },
        radius: 'round' as const,
        density: 'compact' as const,
        typography: { fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif" },
      },
      startScreen: {
        greeting: "What's weighing on your mind?",
        prompts: [
          {
            label: 'Identify my block',
            prompt:
              "I'm feeling upset about something. Help me identify which of the 4 blocks (Anger, Anxiety, Depression, or Guilt) I'm experiencing.",
            icon: 'search' as const,
          },
          {
            label: 'Find the belief',
            prompt:
              'I feel anxious. Ask me questions until we find the irrational belief creating it.',
            icon: 'lightbulb' as const,
          },
          {
            label: 'Dispute a thought',
            prompt: 'Here is the sentence in my head: "…". Help me dispute it using REBT questions.',
            icon: 'write' as const,
          },
          {
            label: 'Daily reflection',
            prompt:
              "Help me reflect on my day using the 4 Blocks framework. I will share what happened.",
            icon: 'sparkle' as const,
          },
        ],
      },
      composer: {
        placeholder: 'What happened… and what did you tell yourself about it?',
      },
    }),
    []
  )

  const { control } = useChatKit({
    api: {
      /**
       * 🔮 The Secret Keeper — "Fresh secrets or phoenix-risen renewals!" ✨
       *
       * When ChatKit needs a client_secret, we either:
       * - Refresh an existing secret (if provided) — like giving a tired token a spa day 🧖‍♂️
       * - Create a brand new session — minting fresh credentials from the OpenAI forge 🔥
       *
       * @param existing - The weary secret seeking renewal, or undefined for a fresh start
       * @returns The mystical client_secret that unlocks ChatKit's powers
       */
      async getClientSecret(existing) {
        // 🌐 ✨ SECRET ACQUISITION RITUAL COMMENCES!
        const res = await fetch('/api/chatkit/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // 🔮 Pass the existing secret for refresh if we have one
          body: JSON.stringify(existing ? { existingSecret: existing } : {}),
        })

        if (!res.ok) {
          // 🌩️ Temporary setback in the mystical realm...
          const json = (await res.json().catch(() => null)) as
            | { error?: string; hint?: string; docs?: Record<string, string> }
            | null

          const message =
            json?.error ?? `ChatKit session failed (${res.status}).`
          const details = [message, json?.hint]
            .filter(Boolean)
            .join('\n')
            .trim()

          setSetupError(details || message)
          throw new Error(message)
        }

        // 🎉 ✨ SECRET ACQUISITION MASTERPIECE COMPLETE!
        if (setupError) setSetupError(null)

        const { client_secret } = (await res.json()) as { client_secret: string }
        return client_secret
      },
    },
    ...options,
  })

  return (
    <div>
      {/* 🌌 The Ambient Canvas - Where therapy meets aesthetics */}
      <div className="world" />

      <div className="wrap">
        {/* 🎭 Header with Logo */}
        <header className="header">
          <div className="logo">
            <div className="logo-blocks">
              <div className="logo-block anger" />
              <div className="logo-block anxiety" />
              <div className="logo-block depression" />
              <div className="logo-block guilt" />
            </div>
            <span className="logo-text">My 4 Blocks</span>
          </div>
        </header>

        {/* ✨ Tagline */}
        <p className="tagline">
          Transform difficult emotions into peace and understanding
        </p>

        {/* 🔮 The Four Blocks Preview */}
        <div className="blocks-preview">
          <div className="block-item">
            <div className="block-icon anger">🔥</div>
            <span className="block-label">Anger</span>
          </div>
          <div className="block-item">
            <div className="block-icon anxiety">⚡</div>
            <span className="block-label">Anxiety</span>
          </div>
          <div className="block-item">
            <div className="block-icon depression">🌧️</div>
            <span className="block-label">Depression</span>
          </div>
          <div className="block-item">
            <div className="block-icon guilt">⚖️</div>
            <span className="block-label">Guilt</span>
          </div>
        </div>

        {/* ⚠️ Setup Warning (if needed) */}
        {setupError && (
          <div className="warn">
            <strong>Setup needed</strong>
            {'\n'}
            {setupError}
            {'\n\n'}
            Add env vars:
            {'\n'}- OPENAI_API_KEY
            {'\n'}- CHATKIT_WORKFLOW_ID (wf_...)
            {'\n'}- CHATKIT_DOMAIN_KEY (domain_pk_...)
          </div>
        )}

        {/* 🎪 The Chat Panel - Where conversations bloom */}
        <div className="panel">
          <div className="chatBox">
            <ChatKit control={control} className="h-full w-full" />
          </div>
        </div>

        {/* 📍 Footer */}
        <footer className="footer">
          <a href="https://my4blocks.vercel.app/about" target="_blank" rel="noopener noreferrer">
            About
          </a>
          •
          <a href="https://my4blocks.vercel.app/the-framework" target="_blank" rel="noopener noreferrer">
            The Framework
          </a>
          •
          <a href="https://my4blocks.vercel.app/privacy" target="_blank" rel="noopener noreferrer">
            Privacy
          </a>
        </footer>
      </div>
    </div>
  )
}

