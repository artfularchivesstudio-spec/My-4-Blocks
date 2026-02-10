'use client'

import { ChatContainer } from '@/components/chat/chat-container'
import { Header } from '@/components/layout/header'
import { AmbientBackground } from '@/components/layout/ambient-background'

export default function Home() {
  const handleReset = () => {
    window.location.reload()
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background relative">
      <AmbientBackground />
      <Header onReset={handleReset} />
      <main id="main-content" className="flex-1 flex flex-col overflow-hidden min-h-0">
        <ChatContainer />
      </main>
    </div>
  )
}
