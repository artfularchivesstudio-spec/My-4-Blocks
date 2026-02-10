---
name: My 4 Blocks Web Lite Plan
overview: A streamlined Next.js (TypeScript) implementation of the My 4 Blocks platform, focusing on a self-contained, beautiful chat experience deployed on Vercel.
todos:
  - id: init-nextjs-lite
    content: Initialize Next.js project with Tailwind and TypeScript
    status: pending
  - id: ts-ingestion-utility
    content: Implement PDF text extraction and chunking utility in TS
    status: pending
  - id: build-magical-ui
    content: Design and build the "magical" chat UI with Framer Motion
    status: pending
  - id: integrate-ai-sdk
    content: Integrate Vercel AI SDK and setup RAG API route
    status: pending
  - id: add-suggestions
    content: Add suggested prompt "Wisdom Seeds" to the landing page
    status: pending
  - id: init-lite-docs
    content: Initialize Changelog.md and project planning docs
    status: pending
isProject: false
---

# 🎭 My 4 Blocks - The Magical Web Portal ✨

This plan creates a single-page Next.js application that serves as an interactive companion for the "You Only Have Four Problems" book. We are pivoting to a TypeScript-first approach for speed and simplicity.

## 🏗️ Technical Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS + Framer Motion (for "magical" animations)
- **AI**: Vercel AI SDK (for the chat interface)
- **Data**: Local JSON vector store (baked into the app for ultra-fast response)

---

## 🔮 Phase 1: The Digital Scribe (Data Preparation)

Since we are avoiding Python, we will handle the knowledge ingestion using TypeScript utilities.

1. **Extraction**: Use a library like `pdf-parse` or `pdfjs-dist` to extract text from `[content/you-only-have-four-problems-book-text.pdf](content/you-only-have-four-problems-book-text.pdf)`.
2. **Chunking Ritual**: Implement a TypeScript chunker (mimicking Chonkie's logic) to create overlapping token/sentence chunks.
3. **Knowledge Base**: Store these chunks in a local `data/knowledge-base.json` file for the app to reference.

## 💅 Phase 2: The Ethereal Interface (UI/UX)

Focusing on a "unique and elegant" feel.

1. **Glassmorphic Chat**: A chat interface with frosted-glass effects, subtle gradients, and floating elements.
2. **Fluid Motion**: Use **Framer Motion** for entrance animations and message transitions.
3. **Wisdom Seeds**: Suggested prompts displayed as elegant cards:
  - *"How do I identify my 'racket'?"*
    - *"Explain the formula for Anxiety."*
    - *"Who is Wu Hsin and what does he teach?"*

## 🌐 Phase 3: The Sage's Voice (AI Logic)

1. **API Route**: Create a Next.js Route Handler (`/api/chat`) using the Vercel AI SDK.
2. **RAG Logic**:
  - Perform a simple keyword/semantic search against the local `knowledge-base.json`.
    - Inject relevant book excerpts into the LLM context.
3. **Tone & Style**: Configure the system prompt to reflect the wisdom of Dr. Vincent Parr, Albert Ellis, and Zen principles.

---

## 📜 Documentation

- **Changelog.md**: Track our "twinkie" progress.
- **TODO.md**: Map out the immediate code hurdles.

---

## 🚀 Deployment

Deploy to **Vercel** with a single command.