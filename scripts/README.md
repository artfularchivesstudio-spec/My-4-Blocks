# 🔮 My-4-Blocks Ingestion Scripts

## Full PDF RAG Pipeline (Chonkie)

**Ingest the complete book PDF into shared embeddings for all variants:**

```bash
# From project root, with OPENAI_API_KEY in .env
python scripts/ingest_pdf_rag.py
```

Or with pyenv Python (if your default python lacks deps):

```bash
~/.pyenv/versions/3.10.13/bin/python scripts/ingest_pdf_rag.py
```

### What it does

1. **Extracts** full text from `content/you-only-have-four-problems-book-text.pdf` via pdfplumber
2. **Chunks** with Chonkie (TokenChunker, 500 tokens, 100 overlap) for semantic boundaries
3. **Embeds** via OpenAI `text-embedding-3-small`
4. **Writes** to `shared/data/embeddings.json`
5. **Syncs** to `claude/shared/data/`, `gemini/shared/data/`, `v0/shared/data/`

### Requirements

```bash
pip install -r scripts/requirements.txt
```

### Dependencies

- pdfplumber
- chonkie
- openai
- python-dotenv

---

## Legacy: Unified Knowledge Base

To generate from the curated `unified-knowledge-base.json` instead:

```bash
python scripts/generate_embeddings.py
```

This uses the hand-curated training content, not the raw PDF.
