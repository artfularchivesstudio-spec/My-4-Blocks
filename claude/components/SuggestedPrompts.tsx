/**
 * 🎨 Suggested Prompts - Beautiful card-based prompt suggestions ✨
 *
 * "Like breadcrumbs leading the seeker into the forest of wisdom."
 */

import { motion } from "framer-motion"
import {
  Flame,
  Cloud,
  Moon,
  Heart,
  Lightbulb,
  BookOpen,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { SUGGESTED_PROMPTS } from "@/lib/prompts"

const iconMap: Record<string, LucideIcon> = {
  flame: Flame,
  cloud: Cloud,
  moon: Moon,
  heart: Heart,
  lightbulb: Lightbulb,
  book: BookOpen,
  meditation: Zap,
}

const blockColors: Record<string, string> = {
  Anger: "from-red-500/20 to-orange-500/20 border-red-300 hover:from-red-500/30 hover:to-orange-500/30",
  Anxiety: "from-blue-500/20 to-cyan-500/20 border-blue-300 hover:from-blue-500/30 hover:to-cyan-500/30",
  Depression: "from-slate-500/20 to-gray-500/20 border-slate-300 hover:from-slate-500/30 hover:to-gray-500/30",
  Guilt: "from-purple-500/20 to-indigo-500/20 border-purple-300 hover:from-purple-500/30 hover:to-indigo-500/30",
  General: "from-emerald-500/20 to-teal-500/20 border-emerald-300 hover:from-emerald-500/30 hover:to-teal-500/30",
}

interface SuggestedPromptsProps {
  onPromptSelect: (prompt: string) => void
}

export function SuggestedPrompts({ onPromptSelect }: SuggestedPromptsProps) {
  return (
    <div className="w-full space-y-3">
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-slate-700 mb-2">🌟 Explore the Four Blocks</h2>
        <p className="text-sm text-slate-500">Choose a topic or ask your own question</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {SUGGESTED_PROMPTS.map((item, idx) => {
          const Icon = iconMap[item.icon]
          const colors = blockColors[item.block] || blockColors.General

          return (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={() => onPromptSelect(item.prompt)}
              className={`
                p-4 rounded-lg border-2
                bg-gradient-to-br ${colors}
                text-left transition-all duration-200
                hover:shadow-lg hover:scale-105
                backdrop-blur-sm
                group
              `}
            >
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 mt-0.5 text-slate-700 group-hover:scale-110 transition-transform" />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-slate-800">{item.title}</div>
                  <p className="text-xs text-slate-700 mt-1 line-clamp-2">{item.prompt}</p>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
