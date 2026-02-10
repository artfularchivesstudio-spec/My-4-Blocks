/**
 * 🎭 The Message Bubble - Beautiful message container with glass-morphism ✨
 *
 * "Each message floats like a thought in the mindful space,
 * gentle and transparent as morning dew."
 */

import { motion } from "framer-motion"

interface MessageBubbleProps {
  content: string
  isUser: boolean
  block?: string
  isStreaming?: boolean
}

const blockColors: Record<string, string> = {
  Anger: "from-red-50 to-orange-50 border-red-200",
  Anxiety: "from-blue-50 to-cyan-50 border-blue-200",
  Depression: "from-slate-50 to-gray-50 border-slate-200",
  Guilt: "from-purple-50 to-indigo-50 border-purple-200",
  General: "from-emerald-50 to-teal-50 border-emerald-200",
}

export function MessageBubble({
  content,
  isUser,
  block,
  isStreaming = false,
}: MessageBubbleProps) {
  const bgGradient = block && blockColors[block] ? blockColors[block] : "from-white to-gray-50"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`
          max-w-xs md:max-w-md lg:max-w-lg
          px-4 py-3 rounded-2xl
          backdrop-blur-sm
          border
          shadow-lg
          transition-all duration-200
          ${
            isUser
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400 shadow-blue-200"
              : `bg-gradient-to-br ${bgGradient} text-slate-800 shadow-slate-100`
          }
        `}
      >
        {!isUser && block && (
          <div className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">
            💫 {block}
          </div>
        )}
        <p className="text-sm md:text-base leading-relaxed">
          {content}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-current opacity-70 animate-pulse" />
          )}
        </p>
      </div>
    </motion.div>
  )
}
