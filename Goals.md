We are rethinking how to do our approach for our website and project MY4Blocks: 
https://www.my4blocks.com/

It's based on you-only-have-four-problems-book-text.pdf, but feel free to look around for more of our content online.

Based on the Four Blocks methodology developed by Dr. Vincent E. Parr through decades of clinical experience.

Why dont we start by taking our main book, using Chonkie python library to make chunks and embeddings of all the content we find, make sure it has the right metadata, and can do keyword, semantic, and graph RAG.

Let's start with a wonderful chat experience with some suggested initial prompts so users can learn more about My 4 Blocks

The UI/Frontend has to feel magical, unique, beautiful, and truly unique and elegant.

---

**Where things stand (April 2026):** The web app (Next.js in `v0/`, plus `claude/` and `gemini/` variants) uses hybrid RAG with embeddings in `shared/data/embeddings.json`. Training content lives under `content/training/batch-1/` and `content/unified-knowledge-base.json`, with additional structured exports in `docs/RAG-PACKAGE/` and `docs/GEPA-DSPy-m1/`. A Flutter client is in `mobile/` for iOS and Android. See the root [README](README.md) and [Changelog](Changelog.md) for the latest layout and history.