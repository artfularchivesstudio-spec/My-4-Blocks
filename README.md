# 🧱 My4Blocks

> *"Where wisdom meets conversation — emotional education through AI"*

An AI-powered emotional education platform based on Dr. Vincent E. Parr's book *"You Only Have Four Problems."*

## ✨ Features

### 💬 Chat Mode
- **Three UI Variants**: Claude, Gemini, V0 — same intelligence, different aesthetics
- **Hybrid RAG Search**: 70% semantic + 30% keyword matching
- **280 Wisdom Chunks**: Extracted from the book with emotion-aware retrieval
- **Streaming Responses**: Real-time token streaming via GPT-4o-mini

### 🎙️ Voice Mode
- **WebRTC Realtime**: Low-latency speech-to-speech via OpenAI's Realtime API
- **9 Voice Options**: From friendly `ash` to calm `sage`
- **4 Conversation Styles**: Direct, Casual, Warm, Professional
- **RAG-Injected Instructions**: Same knowledge base, optimized for voice

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
│       └── embeddings.json   # 280 wisdom chunks
│
├── claude/                    # 🎨 Claude-themed UI
├── gemini/                    # 🌟 Gemini-themed UI
├── v0/                        # ⚡ V0-themed UI
│
└── docs/                      # 📄 Documentation
    ├── Voice_and_Chat_Architecture_v4_print.pdf
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
| **Frontend** | Next.js 16, React 19, Tailwind CSS |
| **AI Chat** | OpenAI GPT-4o-mini via AI SDK |
| **AI Voice** | OpenAI Realtime API (GPT-4o) |
| **Embeddings** | OpenAI text-embedding-3-small |
| **Search** | Custom hybrid RAG (vector + keyword) |

## 📄 Documentation

The full architecture guide is available as a print-optimized PDF:

- [Voice_and_Chat_Architecture_v4_print.pdf](docs/Voice_and_Chat_Architecture_v4_print.pdf)

## 🌐 Deployments

| Variant | URL |
|---------|-----|
| V0 | https://my4blocks.vercel.app |
| Claude | https://claude-teal-seven.vercel.app |
| Gemini | https://gemini-beige-omega.vercel.app |

## 📖 Based On

*"You Only Have Four Problems"* by Dr. Vincent E. Parr, Ph.D.

---

*Built with 🧱 and ☕ by humans and AI working together*
