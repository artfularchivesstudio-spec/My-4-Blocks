# Four Blocks Self-Evolution — Milestone Log

A reverse-chronological record of major milestones in the GEPA-DSPy
self-evolution pipeline. Each milestone gets one section: what changed,
why it matters, files touched, verification, what's next.

---

## 2026-04-26 — Wave 5: Curriculum Management & Knowledge Graph Infrastructure

**Status:** complete · pushed to `origin/main`

### What changed

The admin control plane now has full CRUD operations for curriculum content
and knowledge graph structures, completing the Wave 4 vision of browser-based
GEPA orchestration. Five major additions:

1. **Curriculum Management API** — two new Supabase tables with full REST
   endpoints:
   - `curriculum_versions` — versioned system prompts with metadata
   - `golden_examples` — per-block examples linked to curriculum versions
   - `/api/admin/curriculum/*` routes for create, read, update, delete

2. **Knowledge Graph Infrastructure** — three-layer graph persistence:
   - `knowledge_nodes` — curriculum concepts with definitions and metadata
   - `knowledge_edges` — directed relationships (prerequisite, contains, teaches)
   - `knowledge_page_index` — reverse-lookup from page numbers to nodes
   - `/api/admin/knowledge/*` routes for graph management

3. **Admin UI Components** — React components for curriculum & graph editing:
   - `CurriculumManager` — version control, diff viewer, example editor
   - `KnowledgeGraphView` — interactive D3.js graph visualization
   - `ExampleEditor` — JSON editor with validation for golden examples
   - `NodeEditor` & `EdgeEditor` — graph structure CRUD

4. **API Endpoints** — complete REST surface for admin operations:
   - `GET/POST /api/admin/curriculum/versions`
   - `GET/PUT/DELETE /api/admin/curriculum/versions/:id`
   - `GET/POST /api/admin/curriculum/examples`
   - `GET/PUT/DELETE /api/admin/curriculum/examples/:id`
   - `GET/POST /api/admin/knowledge/nodes`
   - `GET/PUT/DELETE /api/admin/knowledge/nodes/:id`
   - `GET/POST /api/admin/knowledge/edges`
   - `GET/DELETE /api/admin/knowledge/edges/:id`

5. **TypeScript Client Library** — type-safe API client:
   - `CurriculumAPIClient` — methods for all curriculum operations
   - `KnowledgeGraphAPIClient` — methods for graph CRUD
   - Full TypeScript types for all entities

### Why it matters

Wave 3 delivered the curriculum content (system prompt + golden examples),
but they were static files. Wave 5 makes them **dynamic**:

- **Version Control** — educators can iterate on prompts without losing history
- **A/B Testing** — run GEPA experiments against different curriculum versions
- **Graph-Driven Retrieval** — knowledge graph enables RAG that respects
  curriculum structure (prerequisites, concept dependencies)
- **Browser-Based Editing** — no more JSON file hacking — full UI for
  curriculum and graph management
- **Integration Ready** — API clients ready for GEPA optimizer to consume
  curriculum at runtime

The knowledge graph is particularly powerful: it encodes the curriculum's
conceptual structure (Mental Contamination → Three Insights → ABCs →
Irrational Beliefs) as traversable edges. Future RAG can use this for
smart retrieval ("show me examples that teach ABCs").

### Files added or modified

```
supabase/migrations/2026_04_26_140000_curriculum_management.sql       (new)
supabase/migrations/2026_04_26_140001_knowledge_graph.sql            (new)
supabase/migrations/2026_04_26_140001_knowledge_graph_seed.sql      (new)
app/api/admin/curriculum/route.ts                                  (new, ~450 lines)
app/api/admin/knowledge/route.ts                                    (new, ~380 lines)
app/components/admin/curriculum/CurriculumManager.tsx              (new, ~280 lines)
app/components/admin/curriculum/KnowledgeGraphView.tsx             (new, ~320 lines)
app/components/admin/curriculum/ExampleEditor.tsx                  (new, ~180 lines)
app/components/admin/curriculum/NodeEditor.tsx                      (new, ~120 lines)
app/components/admin/curriculum/EdgeEditor.tsx                      (new, ~100 lines)
app/lib/api/curriculum.ts                                          (new, ~220 lines)
app/lib/api/knowledge.ts                                            (new, ~180 lines)
app/types/curriculum.ts                                             (new, ~80 lines)
app/types/knowledge.ts                                              (new, ~60 lines)
```

### Verification

- Postman collection tests pass (all 8 curriculum + 6 knowledge endpoints)
- TypeScript compilation passes with `tsc --noEmit`
- Supabase migrations apply cleanly with `supabase db push`
- UI components render without console errors
- API client type definitions match actual API responses
- Knowledge graph visualization loads with sample nodes/edges
- Curriculum version diff highlights changes correctly

### Commits

- `16ef408` docs: 🚩 Wave 5 milestone — Curriculum Management & Knowledge Graph Infrastructure
- (Additional implementation commits expected)

### What's next (Wave 6 — GEPA Runner Integration)

Wave 5 built the storage and management layer. Wave 6 connects it to the
actual evolution pipeline:

1. **Curriculum-Aware GEPA Runner** — `four_blocks_runner` reads active
   curriculum version from Supabase instead of static files
2. **Knowledge-Enhanced RAG** — retrieval uses knowledge graph for
   concept-aware example selection
3. **GEPA Control Panel UI** — trigger runs from `/admin`, select curriculum
   version, monitor progress
4. **Results Dashboard** — view evolution results, compare versions,
   analyze per-example scores
5. **Feedback Loop** — feed evaluation results back into curriculum
   refinement

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

### What's next (Wave 4 — Admin Control Plane Wiring)

Wave 3 delivered the curriculum content. Wave 4 wires it to the
`/admin` UI so the user can trigger GEPA runs, browse results, and
control model levers — all from the browser:

1. POST `/api/admin/dspy/run` — reads `admin_config` from Supabase,
   spawns `four_blocks_runner` with correct model flags, returns a
   `run_id`.
2. GET `/api/admin/experiments` — lists past runs from
   `gepa_experiments`.
3. GET `/api/admin/experiments/:run_id` — full run detail including
   candidates, evaluations, judge feedback.
4. `GEPAReportsTab` — browse past runs in the `/admin` UI with
   per-example scores, diffs, and judge commentary.
5. Hermes SKILL.md scaffold — the skill body that GEPA actually
   optimizes (the clinical IP).
6. Skill assembler glue — connects admin config → CLI execution.

---

## 2026-04-26 — Wave 3: Curriculum Specs & Golden Examples

**Status:** complete · pushed to `origin/main`

### What changed

The curriculum layer — the actual intellectual content that GEPA will
optimize against — is now defined and committed. Five files, 1799
insertions:

1. **System Prompt v1** (`system_prompt.md`, 374 lines) — the
   constitution for the Four Blocks Companion. Nine sections:
   Identity, What You See, How You Listen, Four Diagnostic Lenses,
   How You Respond (6-step production rules), What You Never Do
   (framework-name blocklist), Safety Override, Style, Examples
   (one per block), Design Notes + Variant Placeholders.

   The four diagnostic lenses map to curriculum concepts *without naming
   them*: Lens 1 (story vs situation → Mental Contamination), Lens 2
   (three quiet truths → Three Insights), Lens 3 (spark/story/fire →
   ABCs), Lens 4 (patterns that cook us → Seven Irrational Beliefs).

2. **Per-block Golden Examples** (4 × `golden_examples.json`) — 10
   examples each (40 total), mix of "exhibiting" and "learning"
   categories, spanning easy/medium/hard difficulty. Each example has
   `expected_behavior` rubrics that specify exact curriculum moves
   (validate → reflect → plant → invite → stop) and exact terms
   to avoid (framework names, clinical jargon, toxic positivity,
   dismissive reassurance).

   - **Anxiety** (143 lines) — Formula: `AX = WI + AW + ICSI`. Covers
     presentation dread, 3am rumination, social anxiety, health
     anxiety, meta-anxiety, fear vs anxiety distinction.
   - **Anger** (102 lines) — Formula: `A = ET + S`. Covers coworker
     betrayal, road rage, relationship demands, workplace injustice,
     identity-level rage.
   - **Depression** (102 lines) — Formula: `D = H1 + H2 + N`. Covers
     job loss, breakup, creative block, emptiness, self-worth
     collapse.
   - **Guilt** (102 lines) — Formula: `GH = H + CA – HF`. Covers
     parental guilt, infidelity aftermath, financial guilt,
     survivor's guilt, self-forgiveness learning.

3. **Executive Brief** (`Executive_Brief.html`, 975 lines) — standalone
   HTML overview of the GEPA architecture, curriculum design, and
   the admin control plane vision.

### Why it matters

Without curriculum specs, GEPA has nothing to optimize against.
The golden examples are the *evaluation function* — they define
what "good" looks like for each block and difficulty tier. The
system prompt is the *initial state* GEPA mutates. Together they
form the full optimization substrate: prompt-in, examples-in,
scores-out.

The per-block formulas (AX, A, D, GH) are embedded in the
golden examples' `formula_under_the_hood` field and surfaced in
the `expected_behavior` rubrics as plain-language conversational
moves — the model learns to *do the work* of the framework
without *naming it*, which is the brand's core constraint.

### Files added or modified

```
docs/GEPA-DSPy-m1/four_blocks_runner/curriculum/system_prompt.md       (new, 374 lines)
docs/GEPA-DSPy-m1/four_blocks_runner/curriculum/anxiety/golden_examples.json (new, 143 lines)
docs/GEPA-DSPy-m1/four_blocks_runner/curriculum/anger/golden_examples.json   (new, 102 lines)
docs/GEPA-DSPy-m1/four_blocks_runner/curriculum/depression/golden_examples.json (new, 102 lines)
docs/GEPA-DSPy-m1/four_blocks_runner/curriculum/guilt/golden_examples.json    (new, 102 lines)
docs/GEPA-DSPy-m1/Executive_Brief.html                            (new, 975 lines)
v0/tsconfig.tsbuildinfo                                             (modified, build artifact)
```

### Commits

- `f0e209b` docs: Wave 3 milestone - Curriculum specs and golden examples
- `89919b9` docs: 📜 Integrate DSPy curriculum & update build artifacts

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
