# 🔮 My-4-Blocks Scripts

## 🗃️ Database Migrations

**Apply the curriculum database schema to Supabase:**

```bash
bun scripts/apply-curriculum-migration.ts
```

This applies the `2026_04_26_140000_curriculum_tables.sql` migration which creates:
- `curriculum_versions` table - stores system prompt versions
- `curriculum_examples` table - stores golden examples
- Row Level Security policies
- Indexes and triggers

### Prerequisites
- Supabase CLI installed: `npm install -g supabase`
- Logged into Supabase: `supabase link`
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL` in `.env`

---

## 🌱 Curriculum Seeding

**Seed the initial GEPA curriculum from filesystem to Supabase:**

```bash
# From project root, with Supabase credentials in .env
bun scripts/seed_curriculum.ts
```

### What it does

1. **Reads** `docs/GEPA-DSPy-m1/four_blocks_runner/curriculum/system_prompt.md`
2. **Parses** per-block `golden_examples.json` files (anger, anxiety, depression, guilt)
3. **Creates** curriculum version "v1" in Supabase `curriculum_versions` table
4. **Inserts** all golden examples into `curriculum_examples` table
5. **Returns** summary of seeded data and next steps

### Requirements

- Node.js 18+ and Bun (for running TypeScript)
- Supabase project with curriculum tables applied
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

---

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
