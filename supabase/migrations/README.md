# Supabase Migrations

This directory holds versioned SQL migrations for the My 4 Blocks Supabase project.

## Naming Convention

```
YYYY_MM_DD_HHMMSS_<short-description>.sql
```

- UTC date + time prefix keeps files in lexicographic == chronological order.
- `<short-description>` is snake_case, terse, and present-tense (e.g. `gepa_experiments`).
- Companion seed files use the same prefix plus a `_seed` suffix:
  `2026_04_26_120000_gepa_experiments_seed.sql`.

## How to Apply

### Option A — Supabase CLI (preferred)

From the repository root:

```bash
supabase db push
```

This reads every file in `supabase/migrations/` and applies any that are newer
than the project's recorded migration history.

If you have not yet linked the local project to a Supabase instance:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

### Option B — Hand-paste in the Supabase Dashboard

1. Open <https://app.supabase.com> → your project → **SQL Editor**.
2. Open the migration file(s) in this directory in the order shown below.
3. Paste each into a new SQL Editor query and click **Run**.

The migration scripts are written defensively (`CREATE EXTENSION IF NOT EXISTS`,
`CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`,
`CREATE OR REPLACE FUNCTION`, `DROP POLICY IF EXISTS` before `CREATE POLICY`)
so re-running them is safe.

## Apply Order (current set)

| Order | File                                                    | Purpose                                               |
|------:|---------------------------------------------------------|-------------------------------------------------------|
| 1     | `2026_04_26_120000_gepa_experiments.sql`                | Creates `gepa_experiments`, `gepa_candidates`, `gepa_evaluations`. |
| 2     | `2026_04_26_120000_gepa_experiments_seed.sql` (optional)| Inserts one demo experiment + candidates + evaluations so `/admin` has data to render before the first real run. |

### Dependency

`gepa_candidates` and `gepa_evaluations` both reference `gepa_experiments(id)`
via `ON DELETE CASCADE` foreign keys. The schema migration creates the parent
table first, then the two children — so applying the file top-to-bottom is
sufficient. **Do not split the file** unless you preserve that order.

## Existing Tables Not Re-created Here

The `admin_config` table (used by `/admin` ConfigTab — see
`v0/lib/admin-config.ts`) **predates this migration** and is intentionally
not modified. If you ever need to reset it, write a separate migration; do
not edit the GEPA migrations.

## Removing Demo Seed Data

After the first real GEPA run lands, sweep the demo rows:

```sql
DELETE FROM gepa_experiments WHERE metadata->>'is_demo' = 'true';
-- ON DELETE CASCADE handles gepa_candidates and gepa_evaluations.
```

## Schema Summary (current set)

- **`gepa_experiments`** — one row per GEPA-DSPy run. Captures models, dataset
  provenance, the active `/admin` system prompt at run time, baseline vs
  evolved skill markdown, headline scores, environment fingerprint.
- **`gepa_candidates`** — one row per (experiment, iteration). Preserves the
  full evolved prompt text and per-iteration score plus LLMJudge sub-scores.
- **`gepa_evaluations`** — one row per (experiment, iteration, example_idx).
  Per-example agent output, score, and judge feedback for granular drill-downs.

All three tables have RLS enabled. Anon role has `SELECT` only; writes go
through the service role from the Python wrapper.
