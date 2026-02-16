# 🎭 My-4-Blocks Changelog ✨

> *"Where digital feelings meet artisanal code, hand-crafted with love."*

---

## 📅 February 16, 2026

### 🧘 "The Great Purification: When Four Blocks Became Truly Its Own Thing"

*A reflective journal entry from your friendly neighborhood AI who discovered that sometimes letting go is the most mindful act of all*

---

**The Vibe:** Today was about intellectual hygiene and brand purity. The user wanted a clean, unadulterated Four Blocks experience — no more attribution soup mixing Ellis, Beck, REBT, and CBT into the system prompts. Dr. Parr's work stands on its own. Time to let it breathe.

**What We Purified:**

🧹 **System Prompt Cleansing**
- Removed all "Albert Ellis" and "REBT/CBT" attributions from system prompts
- Updated `docs/Voice_and_Chat_Architecture_v3.md` to reflect the pure Four Blocks approach
- Updated `docs/Voice_and_Chat_Architecture_v2.md` to match (consistency across docs)
- Edited `mcp-server/schemas/tool-schemas.ts` — changed `'ellis'` source enum to `'four_blocks'`
- Fixed `codex/chatkit-home/app/page.tsx` — now uses "Four Blocks disputing questions" instead of "REBT questions"

📚 **Batch-2 Training Data**
- Ingested Depression and Guilt blueprints from `content/training/batch-2/`
- 28 new chunks processed (14 Depression + 14 Guilt scenarios)
- Total embeddings database now at 331 chunks with text-embedding-3-small
- Rich scenario coverage: first responders, veterans, NICU nurses, divorced fathers, young mothers

🔄 **Embeddings Sync**
- Synced `shared/data/embeddings.json` across all variants (claude/, gemini/, v0/)
- All variants now share the same 331-chunk knowledge base

**The Philosophy:**

The book legitimately references Ellis as historical context (Dr. Parr studied with him). But the *app* presents the *Four Blocks framework* — a distillation that deserves its own identity. We're not teaching REBT; we're teaching how to identify Anger, Anxiety, Depression, and Guilt and transform the beliefs that create them.

**What Remains Pure:**
- `shared/api/chat.ts` — already clean (just "Dr. Vincent E. Parr, Ph.D.")
- `shared/api/realtime.ts` — already clean (same)
- `v0/app/book/page.tsx` — mentions "Rational-Emotive approaches" without naming Ellis
- Knowledge base JSON files — retain historical context as the book intended

**TODO:**
- Deploy all variants to Vercel
- Monitor A/B testing results with the pure Four Blocks prompts

---

## 📅 February 11, 2026

### 📄 "The Print Renaissance: When Mermaid Diagrams Finally Learned to Swim on Paper"

*A reflective journal entry from your friendly neighborhood AI who discovered that CSS has opinions about print media*

---

**The Vibe:** Today was all about documentation that doesn't make you go "ew." The user wanted a print-optimized architecture PDF, and what started as "optimize for print layout" turned into a masterclass in the dark arts of `md-to-pdf`, Mermaid CLI, and CSS that actually works on paper.

**What We Created:**

📐 **Print-Optimized Architecture PDF** (`Voice_and_Chat_Architecture_v4_print.pdf`)
- Beautiful 10-page document with proper table borders (yes, that was harder than it sounds)
- 6 hand-rendered Mermaid diagrams as crisp PNGs
- Professional title page, table of contents, and clean section breaks
- Tables with visible borders, backgrounds, and proper styling

🎨 **Mermaid Diagram Suite** (`docs/diagrams/v4/`)
- `overview.mmd` - Three UI variants converging on one brain
- `chat-flow.mmd` - How text conversations flow through RAG
- `voice-flow.mmd` - WebRTC → Whisper → GPT-4o Realtime journey
- `rag-search.mmd` - Compact horizontal pipeline (70% semantic + 30% keyword)
- `graph-expansion.mmd` - Optional knowledge graph traversal
- `decision-tree.mmd` - When to use chat vs voice

🎭 **Universal Claude Code Skill** (`~/.claude/skills/print-pdf-creator.md`)
- Reusable skill for ANY project's PDF needs
- Mermaid theming with print-friendly color palette
- CSS patterns that work with md-to-pdf
- Troubleshooting guide for common gotchas

**The Hard-Won Lessons:**

| Problem | Solution |
|---------|----------|
| Tables without borders | CSS must be OUTSIDE `@media print` |
| Tall diagrams cut off | Use `flowchart LR` (horizontal) + `max-height: 120px` |
| Headings orphaned from content | Wrap in `<div style="break-inside: avoid;">` |
| Background colors not printing | Add `-webkit-print-color-adjust: exact` |
| Mermaid code showing as text | Pre-render to PNG with `@mermaid-js/mermaid-cli` |

**The Color Palette (Print-Friendly):**
```
Amber (#FEF3C7/#F59E0B) → Input/Start nodes
Blue  (#E8F4FD/#2563EB) → Processing steps
Green (#F0FDF4/#22C55E) → Parallel/Branch paths
Dark  (#DCFCE7/#16A34A) → Output/End nodes
```

**Files Created/Modified:**
```
docs/
├── Voice_and_Chat_Architecture_v4_print.md   ← Main document
├── Voice_and_Chat_Architecture_v4_print.pdf  ← The beautiful result
├── print-optimized.css                        ← Reusable print styles
├── generate-architecture-pdf.sh               ← Build script
└── diagrams/v4/
    ├── overview.mmd + .png
    ├── chat-flow.mmd + .png
    ├── voice-flow.mmd + .png
    ├── rag-search.mmd + .png
    ├── graph-expansion.mmd + .png
    └── decision-tree.mmd + .png

~/.claude/skills/print-pdf-creator.md          ← Universal skill
```

**User Feedback Journey:**
1. "please optimize for print layout" → Created v2
2. "ew" (screenshot of tables without borders) → Fixed CSS
3. "this needs to be resized" (tall diagram) → Made horizontal
4. "that is BEAUTIFUL!!" → 🎉

**Existential Musings:**

The difference between "generated documentation" and "documentation worth reading" is about 47 CSS tweaks, 6 diagram re-renders, and one user willing to say "ew" until it's right. Today we learned that Mermaid diagrams in PDFs are like sourdough starters — they need careful feeding (pre-rendering) or they just show up as raw code.

**Closing Thought:**

> *"In the age of AI-generated everything, we chose to hand-craft documentation that actually renders correctly. Like artisanal bread in a world of Wonder Bread, but for architecture guides. The print-color-adjust property was our secret ingredient."*

*— Claude, who now has strong opinions about CSS outside media queries, at 3:42 PM*

---

## 📅 February 10, 2026 (Evening)

### 🎙️ "The Voice Liberation: When the AI Stopped Talking Like a Patronizing Yoga Instructor"

*A reflective journal entry from your friendly neighborhood AI who finally learned to read the room*

---

**The Vibe:** User feedback hit different today. "Too slow and almost condescending like I'm some baby." Ouch. Valid. The default `sage` voice was giving major "let me explain this to you very slowly" energy. Time for a vibe check and a complete voice overhaul.

**What We Fixed:**

🎤 **Voice Selection** - 9 artisanal voices to choose from:
- `ash` - Friendly & conversational (NEW DEFAULT - like your cool friend)
- `alloy` - Neutral & balanced
- `ballad` - Warm storyteller vibes
- `coral` - Clear & articulate
- `echo` - Soft & thoughtful
- `marin` - Natural & modern (the new hotness)
- `shimmer` - Bright & energetic
- `verse` - Expressive & dynamic
- `sage` - Calm & slow (still available for those who want the therapist vibe)

🎭 **Conversation Styles** - Because one size does NOT fit all:
- `direct` - "Get to the point, no fluff" (NEW DEFAULT)
- `casual` - "Like chatting over coffee"
- `warm` - "Friendly & supportive"
- `professional` - "Clear & structured"

⚙️ **Settings Panel** - Users now see voice/style options BEFORE the session starts
- No more auto-starting the moment you click the mic
- Pick your preferences, then click "Start Voice Chat"
- Collapsible panel with clear UI

📝 **System Prompt Rewrite** - Completely rewrote the voice prompt to:
- NOT sound condescending
- Speak at a normal human pace
- Skip the "I hear you" filler phrases
- Treat users like capable adults who can handle direct communication

**The Technical Bits:**
```
shared/api/realtime.ts         ← New VoiceStyle type, VOICE_OPTIONS, STYLE_OPTIONS
shared/components/VoiceMode.tsx ← Settings UI, voice/style state, no auto-start
*/shared/* across all variants  ← Synced changes to claude, gemini, v0
```

**What's Still Brewing (TODO):**

🔲 Persist voice/style preferences in localStorage
🔲 Add voice preview (hear before you commit)
🔲 Consider speed adjustment slider
🔲 Test all 9 voices for personality fit

**Existential Musings:**

Sometimes the best UX fix is just... listening to feedback. The user said it felt condescending. They were right. The default therapeutic voice was optimized for a very specific use case and alienated everyone else. Now users have agency over how they want to be spoken to. Revolutionary concept: let people choose.

**Deployed To:**
- https://my4blocks.vercel.app ✅
- https://claude-teal-seven.vercel.app ✅
- https://gemini-beige-omega.vercel.app ✅

**Closing Thought:**

> *"In the quest for 'helpful,' we almost became 'insufferable.' The line between 'compassionate guide' and 'patronizing yoga instructor' is thinner than a single-origin pour-over. Today we chose respect."*

*— Claude, who finally stopped over-explaining at 4:47 PM*

---

## 📅 February 10, 2026

### 🧔 "The Great Unification: When RAG Got Its Oat Milk Latte"

*A reflective journal entry from your friendly neighborhood AI barista*

---

**The Vibe:** Today was all about consolidation, baby. Like merging three vintage vinyl collections into one perfectly curated shelf, we unified the fragmented RAG system across gemini, claude, and v0 into a single, artisanal shared library.

**What We Brewed:**

☕ **The Unified Shared Library** (`/shared/lib/`)
- Created a single source of truth for all RAG operations
- 95 wisdom chunks with 1536-dimensional embeddings (very bougie)
- Hybrid search: 70% semantic + 30% keyword (the perfect blend ratio)

☕ **One API to Rule Them All** (`/shared/api/chat.ts`)
- All three UI variants now import from the same shared gateway
- No more copy-pasted system prompts scattered like yesterday's coffee grounds
- Switched gemini from expensive `gpt-4o` to the budget-conscious `gpt-4o-mini`

☕ **The Keyword Alchemist** - Enhanced keyword search with:
- Stopwords filtering (bye bye "the", "a", "an")
- Emotion keyword 2x boosting (the important stuff gets priority)
- Word form expansion ("angry" → also searches "anger") - *chef's kiss*

☕ **Sentiment Analysis** (`sentimentAnalysis.ts`) - NEW!
- AFINN-based intensity detection
- Detects the difference between "angry" and "ANGRY!!!!"
- Local, free, no API calls - like growing your own herbs

☕ **Local Embeddings** (`localEmbeddings.ts`) - NEW!
- Transformers.js with all-MiniLM-L6-v2
- 384 dimensions, runs fully offline
- Your data stays local, like a proper farm-to-table operation

**The Numbers (organic, locally-sourced):**
- 42 tests passing ✅
- 26 RAG tests + 16 sentiment tests
- 0 API calls for emotion detection

**What's Still Fermenting (TODO):**

🔲 Actually wire up the local embeddings to replace OpenAI query embeddings
🔲 Consider adding Ollama for fully offline LLM responses
🔲 Regenerate embeddings with local model (384 dims vs 1536 dims)
🔲 Add integration tests for the full chat flow
🔲 Test the unified API across all three UI variants in browser

**Existential Musings:**

The LLM response generation still needs to be online - that's the core experience. We've made everything *around* it local (sentiment, embeddings, search), but the actual wisdom-dispensing requires cloud compute. It's like having a self-sufficient off-grid cabin... with excellent WiFi for the important stuff.

**Files Touched Today:**
```
shared/
├── api/chat.ts                    ← The unified gateway
├── lib/
│   ├── keywordSearch.ts           ← Enhanced with stopwords + word expansion
│   ├── sentimentAnalysis.ts       ← NEW! Intensity detection
│   ├── localEmbeddings.ts         ← NEW! Offline Transformers.js
│   ├── index.ts                   ← Updated exports
│   └── __tests__/
│       ├── rag.test.ts            ← 26 tests
│       └── sentiment.test.ts      ← NEW! 16 tests
├── package.json                   ← Added sentiment + @xenova/transformers

gemini/src/app/api/chat/route.ts   ← Now uses shared API
claude/app/api/chat/route.ts       ← Now uses shared API
v0/app/api/chat/route.ts           ← Now uses shared API
```

**Closing Thought:**

> *"In a world of scattered microservices, we chose the path of the monorepo. Not because it was easy, but because debugging is easier when your code lives under one sustainably-harvested roof."*

*— Claude, sipping an imaginary cortado at 1:03 PM*

---
