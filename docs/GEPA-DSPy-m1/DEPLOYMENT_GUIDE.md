# 🚀 GEPA-DSPy Wave 5 Deployment Guide

**Status:** 🚧 In Progress - Migrations Ready to Apply

---

## 📋 Overview

This guide walks you through deploying the Wave 5 infrastructure:
1. ✅ Database schema migrations (6 SQL files ready)
2. ✅ Knowledge graph ingestion pipeline (script ready)
3. ✅ GEPA run triggering via /admin (API endpoints ready)
4. ✅ PageIndex book indexing (script ready)

---

## 🔧 Prerequisites

- Docker Desktop running (for local Supabase)
- OR Supabase project access for Dashboard manual migrations
- Python 3.13 environment (for ingestion scripts)
- Four Blocks PDF: `content/Four blocks paperback book (full book).pdf`

---

## 📦 Step 1: Apply Database Migrations

**Current Status:** Docker daemon not running - use Supabase Dashboard

### Option A: Supabase Dashboard (Recommended when Docker is down)

1. Navigate to your Supabase project Dashboard
2. Go to **SQL Editor** (left sidebar)
3. Apply migrations in this exact order:

1. **GEPA Experiments** (2026_04_26_120000_gepa_experiments.sql)
2. **GEPA Experiments Seed** (2026_04_26_120000_gepa_experiments_seed.sql)
3. **Curriculum Tables** (2026_04_26_140000_curriculum_tables.sql)
4. **Curriculum Management** (2026_04_26_curriculum_management.sql)
5. **Curriculum Seed** (2026_04_26_curriculum_management_seed.sql)
6. **Knowledge Graph** (2026_04_26_knowledge_graph.sql)

**Verification:** After applying, run:
```sql
SELECT COUNT(*) FROM gepa_experiments;
SELECT COUNT(*) FROM curriculum_versions;
SELECT COUNT(*) FROM golden_examples;
SELECT COUNT(*) FROM knowledge_nodes;
SELECT COUNT(*) FROM knowledge_edges;
```

### Option B: Local Supabase (Docker required)

```bash
cd supabase
npx supabase start
npx supabase db reset
```

---

## 🧠 Step 2: Ingest Knowledge Graph

Once migrations are applied:

```bash
cd v0
source ../.venv-python3.13/bin/activate  # Use Python 3.13 venv
python scripts/ingest-knowledge-graph.py
```

**Expected Output:**
- Extracts 50+ concepts from system_prompt.md
- Extracts golden examples scenarios and rubrics
- Auto-generates relationships
- Stores in `knowledge_nodes` and `knowledge_edges` tables

---

## 📘 Step 3: Index Four Blocks Book with PageIndex

Install PageIndex in Python 3.13 venv:
```bash
cd ../.venv-python3.13
bin/pip install pageindex
```

Run book indexing:
```bash
cd v0
python scripts/index-four-blocks-book.py
```

**This will:**
- Parse `content/Four blocks paperback book (full book).pdf`
- Create hierarchical tree structure
- Store sections in `page_index_sections` table
- Create knowledge nodes for each section

---

## 🧪 Step 4: Trigger GEPA Run via /admin

1. Start the dev server:
```bash
cd v0
npm run dev
```

2. Navigate to `/admin`
3. Go to **ConfigTab** and verify DSPy model settings:
   - Optimizer Model: `claude-opus-4-7`
   - Eval Model: `claude-sonnet-4-6`
   - Judge Model: `claude-opus-4-7`

4. Click **"Start Evolution Run"**
5. Monitor progress via `/api/admin/experiments` API endpoint

---

## ✅ Verification Checklist

- [ ] Start Docker Desktop (if not running)
- [ ] Apply all 6 database migrations via Supabase Dashboard
- [ ] Run knowledge graph ingestion script
- [ ] Run PageIndex book indexing
- [ ] `knowledge_nodes` table populated with 50+ concepts
- [ ] `knowledge_edges` table populated with relationships
- [ ] Golden examples loaded into `golden_examples` table
- [ ] Four Blocks book indexed with PageIndex
- [ ] GEPA run triggered successfully from /admin
- [ ] Can view run details at `/api/admin/experiments/[runId]`

---

## 🐛 Troubleshooting

### Issue: DNS Resolution Failed
**Symptom:** `DNS resolution failed for db.yofxwtwyquzusbubawzh.supabase.co`
**Solution:** Start Docker Desktop and restart Supabase

### Issue: RLS Policy Errors
**Symptom:** `permission denied for table knowledge_nodes`
**Solution:** Ensure RLS policies are applied (included in migration files)

### Issue: PageIndex Python 3.14 Compatibility
**Symptom:** `ImportError: dlopen... pyexpat.cpython-314-darwin.so`
**Solution:** Use `.venv-python3.13` environment instead of system Python 3.14

### Issue: Python Process Spawns But No Output
**Symptom:** GEPA run shows "started" but no logs
**Solution:** Check `four_blocks_runner` logs in `docs/GEPA-DSPy-m1/four_blocks_runner/experiment.json`

---

## 📚 API Endpoints Reference

### GET `/api/admin/experiments`
List all GEPA evolution runs (requires anon-read RLS policy)

**Response:**
```json
{
  "experiments": [...],
  "count": 5
}
```

### GET `/api/admin/experiments/[runId]`
Deep dive into a single run with candidates and evaluations

**Response:**
```json
{
  "experiment": {...},
  "candidates": [...],
  "summary": {...}
}
```

### POST `/api/admin/dspy/run`
Trigger new GEPA evolution run (requires service-role key)

**Request:** None (reads from admin_config)

**Response:**
```json
{
  "success": true,
  "run_id": "gepa-174432...",
  "status": "started",
  "config_used": {
    "optimizer_model": "claude-opus-4-7",
    "eval_model": "claude-sonnet-4-6",
    "judge_model": "claude-opus-4-7"
  }
}
```

---

## 🎯 Database Schema Quick Reference

### Core Tables:

**`gepa_experiments`**
- experiment tracking table
- each run has unique run_id, timestamp, models used

**`gepa_candidates`**
- evolved prompts for each iteration
- links to experiment via experiment_id

**`gepa_evaluations`**
- per-example evaluation scores
- links to candidates via candidate_id

**`curriculum_versions`**
- versioned system prompts and golden examples
- semver based (v1.0.0, v1.1.0, etc.)
- active/inactive status

**`golden_examples`**
- per-block examples with rubrics
- anger, anxiety, depression, guilt

**`knowledge_nodes`**
- concept, scenario, lens, rubric, section nodes
- extracted from curriculum sources

**`knowledge_edges`**
- relationships between nodes
- types: demonstrates, relates_to, contrasts, etc.

---

## 🔄 Next Steps After Deployment

1. **Curriculum Management:** Use `/admin` UI to edit system prompts and golden examples
2. **Knowledge Graph:** Query the graph for concept relationships
3. **Experiment Tracking:** Monitor evolution runs and analyze candidate performance
4. **Continuous Improvement:** Iterate on prompts based on GEPA evaluation results

---

**Last Updated:** 2026-04-26
**Wave:** 5 - Curriculum Management & Knowledge Graph Infrastructure
