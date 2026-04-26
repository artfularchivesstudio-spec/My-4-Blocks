# 🧱 My4Blocks

> *"Where wisdom meets conversation — emotional education through AI"*

An AI-powered emotional education platform based on Dr. Vincent E. Parr's book *"You Only Have Four Problems."*

## ✨ Features

### 🛠️ Admin Sanctuary
- **System Mastery Portal**: Password-protected `/admin` dashboard for real-time system orchestration.
- **Dynamic Configuration**: Hot-swappable LLM models (GPT-4o/mini/turbo), temperature control, and RAG Top-K tuning.
- **Constitution Editor**: Live editing of the `System Prompt` (the core laws of the Four Blocks guide).
- **Dataset Orchestration**: In-browser manager for the `content/training/` corpus with JSON validation and file uploads.
- **Evolution Visibility**: Integrated GEPA reports and interactive Knowledge Graph visualization.

### 💬 Chat Mode
- **Three UI Variants**: Claude, Gemini, V0 — same intelligence, different aesthetics
- **Hybrid RAG Search**: 70% semantic + 30% keyword matching
- **346 Retrievable Chunks**: Expanded RAG over `shared/data/embeddings.json` (now includes Preface, Introduction, Ch 10 Zen, and Ch 11 Healthy Body)
- **Streaming Responses**: Real-time token streaming via GPT-4o-mini (overridable via Admin)

### 🎙️ Voice Mode
- **WebRTC Realtime**: Low-latency speech-to-speech via OpenAI's Realtime API
- **9 Voice Options**: From friendly `ash` to calm `sage`
- **4 Conversation Styles**: Direct, Casual, Warm, Professional
- **RAG-Injected Instructions**: Same knowledge base, optimized for voice

### 🏛️ Data Source & Training
- **Canonical Corpus**: Verbatim chunks from the full 205-page paperback in `docs/GEPA-DSPy-m1/refined-rag-dataset v1/`.
- **Expanded Coverage**: Recently reconciled Preface, Introduction, Chapter 10 (Zen), and Chapter 11 (Healthy Body) into the RAG corpus.
- **Admin Orchestration**: The `/admin` portal now acts as the primary source of truth for runtime parameters, persisting changes to Supabase and updating all Vercel instances instantly.

## 🏗️ Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Claude UI  │     │  Gemini UI   │     │    V0 UI     │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       └────────────────────┼────────────────────┘
                            │
                   ┌────────▼────────┐
                   │  Shared Library │
                   │  /shared/lib/   │
                   └────────┬────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
     ┌────────▼──────┐ ┌────▼────┐ ┌──────▼──────┐
     │ Vector Search │ │ Keyword │ │   Graph     │
     │ (Cosine Sim)  │ │ Search  │ │  Expansion  │
     └───────────────┘ └─────────┘ └─────────────┘
```

## 📁 Project Structure

```
My-4-Blocks/
├── shared/                    # 🧠 The unified intelligence
│   ├── api/
│   │   ├── chat.ts           # Chat endpoint handler
│   │   └── realtime.ts       # Voice WebRTC session
│   ├── lib/
│   │   ├── vectorSearch.ts   # Semantic similarity
│   │   ├── keywordSearch.ts  # TF-IDF with boosting
│   │   └── graphExpansion.ts # Related chunk traversal
│   └── data/
│       └── embeddings.json   # Vector store for hybrid RAG
│
├── mobile/                    # 📱 Native iOS & Android (Flutter, BLoC, Supabase)
│   └── lib/                   # App shell, auth, chat + SSE
├── claude/                    # 🎨 Claude-themed UI
├── gemini/                    # 🌟 Gemini-themed UI
├── v0/                        # ⚡ V0-themed UI (default public site)
│
├── content/                   # Training curriculum & unified KB
│   ├── training/batch-1/      # Per-topic JSON (migrated from legacy flat `json_*.txt`)
│   └── unified-knowledge-base.json  # Structured library metadata + chunks
│
└── docs/                      # 📄 Documentation
    ├── Voice_and_Chat_Architecture_v4_print.pdf
    ├── GEPA-DSPy-m1/         # Refined RAG chunk handoff (ch.1–9, JSON + raw text)
    ├── RAG-PACKAGE/          # RAG-CORE constitutions + RAG-LIBRARIES scenario sets
    ├── print-optimized.css
    └── diagrams/v4/          # Mermaid source + PNGs
```

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run a variant
cd v0 && pnpm dev      # or claude/ or gemini/

# Open http://localhost:3000
```

## 📚 The Four Blocks

| Block | Description | Key Thought |
|-------|-------------|-------------|
| **Anger** | Demanding others/situations be different | *"This should not be happening"* |
| **Anxiety** | Catastrophizing about the future | *"What if the worst happens?"* |
| **Depression** | Rating your SELF as worthless | *"I am a failure"* |
| **Guilt** | Self-condemnation about actions | *"I should have done differently"* |

### The ABC Model

- **A** — Activating Event (what happens)
- **B** — Belief (your thoughts about it)
- **C** — Consequence (your emotional response)

> *"Events don't cause emotions; BELIEFS do!"*

## 🔧 Tech Stack

| Layer | Technology |
|-------|------------|
| **Mobile App** | Flutter, BLoC, Supabase, Dio |
| **Frontend** | Next.js 16, React 19, Tailwind CSS |
| **AI Chat** | OpenAI GPT-4o-mini via AI SDK |
| **AI Voice** | OpenAI Realtime API (GPT-4o) |
| **Embeddings** | OpenAI text-embedding-3-small |
| **Search** | Custom hybrid RAG (vector + keyword) |

## 📄 Documentation

- **Architecture (print PDF):** [Voice_and_Chat_Architecture_v4_print.pdf](docs/Voice_and_Chat_Architecture_v4_print.pdf)
- **RAG asset packs (JSON):** `docs/RAG-PACKAGE/RAG-CORE/` and `docs/RAG-PACKAGE/RAG-LIBRARIES/` — constitutions, course slices, and behavioral/scenario libraries for prompts and evals.
- **GEPA / DSPy handoff (chapters 1–9):** `docs/GEPA-DSPy-m1/refined-rag-dataset v1/` — per-chapter `chapter_*_chunks.json` + `chapter_*_raw.txt`; see `README.txt` in that folder.
- **Variant playbooks:** `claude/`, `gemini/`, and `v0/README.md` for per-app quick starts.

## 🌐 Deployments

| Variant | URL |
|---------|-----|
| V0 | https://my4blocks.vercel.app |
| Claude | https://claude-teal-seven.vercel.app |
| Gemini | https://gemini-beige-omega.vercel.app |

## 🔑 App Store Review
For Apple App Store Connect reviews, please provide the following pre-verified test credentials:
- **Email**: `appstore-review@my4blocks.com`
- **Password**: `Review4Blocks2026!`
*(Note: Account is initialized as confirmed in Supabase.)*

## 📖 Based On

*"You Only Have Four Problems"* by Dr. Vincent E. Parr, Ph.D.

---

*Built with 🧱 and ☕ by humans and AI working together*
