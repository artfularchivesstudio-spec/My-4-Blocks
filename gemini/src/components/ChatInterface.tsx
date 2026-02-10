'use client';

/**
 * 🎭 The Chat Interface - The Ethereal Portal
 *
 * "A digital sanctuary where questions meet wisdom.
 * Watch as thoughts materialize in the glass of enlightenment."
 *
 * Features: Auto-scroll to latest message, input focus after send,
 * wisdom seed focus, and smooth UX throughout. ✨
 *
 * - The Theatrical Interface Virtuoso
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, RefreshCw, Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { VoiceMode, type VoiceState } from '../../shared/components';

// 🌟 The Wisdom Seeds - Initial Prompts for Seekers
const WISDOM_SEEDS = [
  { id: 'racket', label: "What is my 'racket'?", prompt: "Can you explain what Dr. Parr means by a 'racket' and how I can identify mine?" },
  { id: 'anxiety', label: "Formula for Anxiety", prompt: "What is the formula for Anxiety according to the book?" },
  { id: 'four-problems', label: "The Four Problems", prompt: "What are the only four problems we ever really have?" },
  { id: 'wu-hsin', label: "Who is Wu Hsin?", prompt: "Tell me about the Wu Hsin quote at the beginning of the book." },
];

export const ChatInterface = () => {
  // 🎨 Manual input state for this version of the AI SDK
  const [input, setInput] = useState('');
  // 🌐 Use default chat configuration (defaults to /api/chat)
  const { messages, sendMessage, status, error: chatError } = useChat();
  const isLoading = status === 'streaming' || status === 'submitted';
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousStatusRef = useRef<string | null>(null);

  // 🎙️ Voice mode state - glass-morphism meets voice
  const [voiceModeActive, setVoiceModeActive] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');

  /**
   * 🧭 The Smooth Scroll Enchantment - Glides to the latest wisdom
   *
   * During streaming: instant scroll to keep up with tokens
   * After streaming: smooth scroll for that polished feeling 🌊
   */
  useEffect(() => {
    if (scrollRef.current) {
      const behavior = isLoading ? 'auto' : 'smooth';
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior,
      });
    }
  }, [messages, isLoading]);

  /**
   * 🔮 Focus Restoration - Return cursor to input when streaming completes
   *
   * After the assistant finishes their wisdom, the user's cursor awaits
   * in the input field, ready for the next profound question. 🎪
   */
  useEffect(() => {
    const wasStreaming = previousStatusRef.current === 'streaming';
    const isNowReady = status === 'ready';
    previousStatusRef.current = status;

    if (wasStreaming && isNowReady) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [status]);

  /**
   * 🌱 The Wisdom Seed Handler - Plants a prompt and focuses the input
   *
   * When a seeker clicks a suggested prompt, we plant it in the input
   * and summon their cursor to tend to it. Ready to harvest wisdom! 🌾
   */
  const onSeedClick = (prompt: string) => {
    setInput(prompt);
    // 🎯 Focus the input so user can review/edit/submit immediately
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    setInput('');

    // 🎯 Keep focus on input while message sends - smoother UX!
    inputRef.current?.focus();

    try {
      // 🎯 AI SDK v6 expects simple { text } format, not { role, parts }
      await sendMessage({ text: currentInput });
    } catch (err) {
      console.error("🌩️ Error sending message:", err);
    }
  };

  /**
   * 🎙️ Toggle Voice Mode - Speak your heart through the glass portal
   */
  const handleVoiceToggle = useCallback(() => {
    setVoiceModeActive((prev) => !prev);
  }, []);

  /**
   * 🌟 Voice session started - The portal awakens
   */
  const handleVoiceSessionStart = useCallback(() => {
    console.log('🎙️ ✨ VOICE SESSION STARTED!');
  }, []);

  /**
   * 🌙 Voice session ended - The portal rests
   */
  const handleVoiceSessionEnd = useCallback(() => {
    console.log('🎙️ Voice session ended');
    setVoiceState('idle');
  }, []);

  /**
   * 📜 Voice transcript received - Words from the ether
   */
  const handleVoiceTranscript = useCallback((text: string, role: 'user' | 'assistant') => {
    console.log(`🎙️ [${role}]: ${text}`);
  }, []);

  /**
   * 🎨 Glass-morphism Voice Orb - Ethereal visualization
   */
  const renderGlassOrb = (state: VoiceState) => {
    const stateColors = {
      idle: 'from-purple-400/30 to-blue-400/30',
      connecting: 'from-blue-400/40 to-cyan-400/40',
      connected: 'from-emerald-400/40 to-teal-400/40',
      listening: 'from-purple-500/50 to-pink-500/50',
      speaking: 'from-amber-400/50 to-orange-400/50',
      error: 'from-red-400/50 to-rose-400/50',
    };

    const glowColors = {
      idle: 'shadow-purple-500/20',
      connecting: 'shadow-blue-500/30',
      connected: 'shadow-emerald-500/30',
      listening: 'shadow-purple-500/40',
      speaking: 'shadow-amber-500/40',
      error: 'shadow-red-500/40',
    };

    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          'relative w-32 h-32 rounded-full',
          'bg-gradient-to-br',
          stateColors[state],
          'backdrop-blur-lg border border-white/30',
          'shadow-2xl',
          glowColors[state],
          'flex items-center justify-center'
        )}
      >
        {/* Inner glow */}
        <div className={cn(
          'absolute inset-4 rounded-full',
          'bg-gradient-to-br from-white/40 to-transparent',
          'backdrop-blur-sm'
        )} />

        {/* Animated rings for active states */}
        {(state === 'listening' || state === 'speaking') && (
          <>
            <motion.div
              className={cn(
                'absolute inset-0 rounded-full border-2',
                state === 'listening' ? 'border-purple-400/50' : 'border-amber-400/50'
              )}
              animate={{ scale: [1, 1.3], opacity: [0.8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className={cn(
                'absolute inset-0 rounded-full border-2',
                state === 'listening' ? 'border-purple-400/50' : 'border-amber-400/50'
              )}
              animate={{ scale: [1, 1.3], opacity: [0.8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}

        {/* State indicator */}
        <div className="relative z-10">
          {state === 'connecting' && (
            <Loader2 className="w-8 h-8 text-white/80 animate-spin" />
          )}
          {(state === 'connected' || state === 'listening') && (
            <Mic className="w-8 h-8 text-white/90" />
          )}
          {state === 'speaking' && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Bot className="w-8 h-8 text-white/90" />
            </motion.div>
          )}
          {state === 'idle' && (
            <Mic className="w-8 h-8 text-white/60" />
          )}
          {state === 'error' && (
            <MicOff className="w-8 h-8 text-white/80" />
          )}
        </div>
      </motion.div>
    );
  };

  return (
    // 🎪 The Glass Container - Responsive height: full on mobile, 80vh on desktop
    <div className="flex flex-col h-screen sm:h-[85vh] md:h-[80vh] max-h-[100dvh] w-full max-w-4xl mx-auto glass sm:rounded-3xl overflow-hidden shadow-xl border border-black/5 bg-white/40">
      {/* 🌟 Header Ritual - Responsive padding and sizing with safe-area-top for notched devices */}
      <div className="p-4 sm:p-5 md:p-6 border-b border-black/5 flex items-center justify-between bg-black/5 safe-area-top">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex-shrink-0">
            {/* 🎨 The Four Blocks Logo - Clean SVG replacing the hideous waveform */}
            <Image
              src="/logo-blocks.svg"
              alt="My 4 Blocks Logo"
              width={40}
              height={40}
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              My 4 Blocks
            </h1>
            <p className="text-[10px] sm:text-xs text-black/40">Digital Companion for Happiness Mastery</p>
          </div>
        </div>
        {isLoading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="w-5 h-5 text-purple-600/50" />
          </motion.div>
        )}
      </div>

      {/* 📜 The Scroll of Messages - Responsive padding */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-6 scroll-smooth bg-white/20"
      >
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 px-2"
            >
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl font-light text-black/80">Welcome to My 4 Blocks</h2>
                <p className="text-sm sm:text-base text-black/40 max-w-md mx-auto">
                  Learn how to master your emotional blocks and find lasting contentment. How can I help you today?
                </p>
              </div>

              {/* 🎯 Wisdom Seeds Grid - Stacks on mobile, 2-col on tablet+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full max-w-lg">
                {WISDOM_SEEDS.map((seed) => (
                  <button
                    key={seed.id}
                    onClick={() => onSeedClick(seed.prompt)}
                    className="p-3 sm:p-4 glass-card glass text-left text-xs sm:text-sm text-black/60 hover:text-black/90 active:scale-[0.98] rounded-xl sm:rounded-2xl transition-all border-black/5"
                  >
                    {seed.label}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            /* 🎭 The Live Message Arena - aria-live announces new messages to screen readers!
             * Using "polite" so it doesn't interrupt, and atomic="false" so only new content is read */
            <div aria-live="polite" aria-atomic="false" role="log" className="contents">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-4 max-w-[85%]",
                    m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
                    m.role === 'user' ? "bg-purple-600/10 border border-purple-600/20" : "bg-blue-600/10 border border-blue-600/20"
                  )}>
                    {m.role === 'user' ? <User className="w-4 h-4 text-purple-600" /> : <Bot className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed",
                    m.role === 'user'
                      ? "bg-purple-600/10 border border-purple-600/20 text-black/90 rounded-tr-none"
                      : "bg-black/5 border border-black/10 text-black/80 rounded-tl-none"
                  )}>
                    {m.parts.map((part, i) =>
                      part.type === 'text' ? <span key={i}>{part.text}</span> : null
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {chatError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 text-sm rounded-xl">
              🌩️ Something went wrong: {chatError.message}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* ✍️ The Writing Desk - Responsive input area with safe-area-bottom for notched devices */}
      <div className="p-3 sm:p-4 md:p-6 bg-black/5 border-t border-black/10 safe-area-bottom">
        <AnimatePresence mode="wait">
          {voiceModeActive ? (
            /* 🎙️ Voice Mode Interface - Glass-morphism voice orb */
            <motion.div
              key="voice-mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center py-4"
            >
              <VoiceMode
                isActive={voiceModeActive}
                onActiveChange={setVoiceModeActive}
                onSessionStart={handleVoiceSessionStart}
                onSessionEnd={handleVoiceSessionEnd}
                onTranscript={handleVoiceTranscript}
                showTranscript={false}
                apiEndpoint="/api/realtime"
                renderOrb={renderGlassOrb}
              />
              <button
                onClick={handleVoiceToggle}
                className="mt-4 px-4 py-2 text-sm text-black/50 hover:text-black/80 transition-colors"
              >
                Switch to text mode
              </button>
            </motion.div>
          ) : (
            /* ✍️ Text Input Mode */
            <motion.form
              key="text-mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
            >
              {/* 🎯 The Hidden Label - Screen readers shall know thy purpose! */}
              <label htmlFor="chat-input" className="sr-only">
                Type your message
              </label>
              <div className="relative group flex gap-2">
                <input
                  ref={inputRef}
                  id="chat-input"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your question here..."
                  className="flex-1 bg-white/50 border border-black/10 rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-4 sm:pl-6 pr-12 sm:pr-14 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/40 transition-all text-sm sm:text-base text-black placeholder:text-black/20"
                />
                {/* 🎙️ Voice Toggle Button */}
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  disabled={isLoading}
                  aria-label="Switch to voice mode"
                  className={cn(
                    "p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all",
                    "bg-gradient-to-br from-purple-500/20 to-blue-500/20",
                    "border border-purple-500/30 hover:border-purple-500/50",
                    "hover:from-purple-500/30 hover:to-blue-500/30",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "backdrop-blur-sm shadow-md"
                  )}
                >
                  <Mic className="w-5 h-5 text-purple-600" />
                </button>
                <button
                  type="submit"
                  disabled={!input || isLoading}
                  aria-label="Send message"
                  className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-purple-600 hover:bg-purple-500 active:scale-95 disabled:bg-black/10 disabled:text-black/20 transition-all shadow-md text-white"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-2 sm:mt-3 text-[9px] sm:text-[10px] text-center text-black/20 uppercase tracking-widest">
                Happiness is a practice, not a destination
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
