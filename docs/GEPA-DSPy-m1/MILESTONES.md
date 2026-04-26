# Four Blocks Self-Evolution — Milestone Log

A reverse-chronological record of major milestones in the GEPA-DSPy
self-evolution pipeline. Each milestone gets one section: what changed,
why it matters, files touched, verification, what's next.

---

## 2026-04-26 — Wave 2: Persistent Experiment Audit Trail ("leave no data behind")

**Status:** complete · pushed to `origin/main`

### What changed

The pipeline can now capture and persist every byte of a GEPA evolution
run — system prompt at run time, model identifiers, dataset corpus,
git SHA, every iteration's candidate prompt, every per-example
evaluation, judge feedback, baseline-vs-evolved skill markdown, scores,
errors. Three layers:

1. **Tracked Python wrapper** — `docs/GEPA-DSPy-m1/four_blocks_runner/`
   imports the gitignored upstream `evolve_skill` and instruments it
   with a `RunRecorder` that writes a single comprehensive
   `experiment.json` per run plus sidecar JSONL streams.
2. **Upstream patch documentation** — `UPSTREAM_PATCHES.md` + `.diff`
   record the local patches we made to the gitignored
   `hermes-agent-self-evolution/` so fresh installs can re-apply them.
3. **Supabase schema** — three new tables (`gepa_experiments`,
   `gepa_candidates`, `gepa_evaluations`) with RLS enabled + anon-read,
   service-role-write. Migration ready to run with `supabase db push`
   or paste in the SQL Editor.

### Why it matters

The `/admin` ConfigTab already exposes Optimizer / Eval / Judge model
levers but had no way to:
- read those levers when training (the dead-lever problem),
- prove what was used in any past run,
- audit per-iteration candidate prompts the optimizer generated.

This milestone closes the audit gap. Every future run is forensically
reconstructible from `experiment.json` (filesystem) + Supabase.

### Files added or modified

```
.gitignore                                            (modified)
docs/GEPA-DSPy-m1/UPSTREAM_PATCHES.md                 (new)
docs/GEPA-DSPy-m1/UPSTREAM_PATCHES.diff               (new)
docs/GEPA-DSPy-m1/four_blocks_runner/__init__.py      (new)
docs/GEPA-DSPy-m1/four_blocks_runner/__main__.py      (new)
docs/GEPA-DSPy-m1/four_blocks_runner/recorder.py      (new, ~424 lines)
docs/GEPA-DSPy-m1/four_blocks_runner/run_evolution.py (new, ~448 lines)
docs/GEPA-DSPy-m1/four_blocks_runner/README.md        (new)
docs/GEPA-DSPy-m1/four_blocks_runner/tests/test_recorder.py  (new)
supabase/migrations/2026_04_26_120000_gepa_experiments.sql        (new)
supabase/migrations/2026_04_26_120000_gepa_experiments_seed.sql   (new)
supabase/migrations/README.md                                     (new)
```

Plus pre-Wave-2 cleanups: chapter_4 + chapter_11 standardized to strict
JSON; `app/api/admin/data/route.ts` extended to v1 corpus + GEPA
datasets.

### Verification

- `pytest four_blocks_runner/tests/ -q` → 3 passed
- `python -m four_blocks_runner --skill github-code-review --iterations 2 --dry-run`
  → `experiment.json` written with `schema_version: 1`, `status: completed`,
  full models / git_sha / dspy_version captured
- All 12 v1 chunk JSONs pass `python -m json.tool` strict validation
- `tsc --noEmit` on `app/api/admin/data/route.ts` → no new errors

### Commits

- `148eaee` refactor: 🧹 Standardize v1 corpus to strict JSON
- `9e0346d` feat: 🚪 Extend admin data route to v1 corpus + GEPA datasets
- `7501607` feat: 🐍 Add four_blocks_runner — Python wrapper with experiment recorder
- `dcd1765` fix: 🧹 Untrack `__pycache__` + add Python/TS build artifacts to gitignore
- `8df43e3` docs: 📜 Document upstream patches for hermes-agent-self-evolution
- `3f5c56f` feat: 🗃️ Supabase migration — GEPA experiment audit trail

### What's next (Wave 3)

The wrapper and the schema are a passive audit substrate. They have to
get wired to the website now so the user can:

1. Trigger a run from `/admin` (POST `/api/admin/dspy/run` reads
   `admin_config`, spawns the wrapper, returns a `run_id`).
2. Watch progress live (stdout streaming or polling
   `gepa_experiments` by run_id).
3. Browse past runs in `GEPAReportsTab` — every candidate, every
   evaluation, with judge feedback.

Wave 3 also defines the **curriculum-aware system prompt + judge rubric +
ideal candidates** — the actual content of what the agent should
identify (Anger / Anxiety / Depression / Guilt) and how it should
incorporate Mental Contamination, the Three Insights, the ABCs, and
the Seven Irrational Beliefs in a natural conversational tone, not
overtly. The skill body GEPA optimizes is the company's clinical IP.

---

## 2026-04-26 — Wave 1: Reconciliation with the Full Book

**Status:** complete · pushed (commits `f7847fa` through `3a9f97f`)

See `docs/GEPA-DSPy-m1/RECONCILIATION_REPORT_2026-04-26.md` for the
full account. Summary:

- Discovered the full 205-page paperback PDF of Dr. Parr's book and
  adopted it as the canonical source of truth.
- Expanded the v1 corpus from 9 chapters / 120 chunks to 12 / 159
  (added Chapter 0 front matter, Chapter 10 Zen, Chapter 11 Healthy
  Body). Skipped Chapter 12 (Bishop, third-party).
- Documented the **hybrid two-layer architecture**: Layer 1 = v1
  source-faithful retrieval corpus; Layer 2 =
  `unified-knowledge-base.json` brand-distilled response voice
  (tagged `_meta.do_not_train_directly: true`).
- Built the `/admin` Sanctuary as the live source of truth for model
  selection, RAG params, system prompt, and the DSPy optimizer / eval
  / judge model trinity.
