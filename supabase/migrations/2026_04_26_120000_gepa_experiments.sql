-- =============================================================================
-- 🎭 The GEPA-DSPy Chronicle - Where Every Experiment's Soul Is Preserved ✨
--
-- "Three tables stand as witness to every iteration's whisper,
--  every candidate's hopeful prompt, every evaluation's verdict.
--  Leave no data behind — the audit trail is sacred."
--
--  - The Spellbinding Museum Director of Experiment Persistence
-- =============================================================================
--
-- Migration: gepa_experiments + gepa_candidates + gepa_evaluations
-- Date     : 2026-04-26 12:00:00 UTC
-- Purpose  : Persist GEPA-DSPy optimization runs with full iteration-level
--            detail so the /admin GEPAReportsTab can render a queryable
--            audit trail of every prompt evolution.
--
-- Dependencies:
--   - pgcrypto extension (for gen_random_uuid()) — Supabase enables by default
--   - Does NOT touch the existing admin_config table (predates this migration)
--
-- Order matters: gepa_experiments first, then the two child tables that FK to it.
-- =============================================================================

-- 🔮 Ensure pgcrypto is available for UUID generation magic
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================================================
-- 🌟 TABLE 1: gepa_experiments — The Grand Ledger of Optimization Runs
-- =============================================================================
-- One row per GEPA-DSPy run. Captures the full provenance: models, dataset,
-- system prompt at run time, baseline vs evolved scores, environment versions.

CREATE TABLE IF NOT EXISTS gepa_experiments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 🎭 Externally-generated run identifier (wrapper passes via --run-id)
  run_id uuid NOT NULL UNIQUE,

  -- 🎨 Lifecycle status of the run
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'running', 'completed', 'failed', 'partial')),

  -- 🧙 Which skill is being optimized (e.g. "story_generator", "tutor")
  skill_name text NOT NULL,

  -- ⏰ Temporal markers
  started_at   timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz NULL,

  -- 🎼 Model identifiers — capture every actor in the optimization symphony
  optimizer_model text,
  eval_model      text,
  judge_model     text,
  use_llm_judge   boolean DEFAULT false,

  -- 🎪 Optimization config
  iterations integer,

  -- 📚 Dataset provenance — leave no data behind
  dataset_path           text,
  dataset_corpus         text
    CHECK (dataset_corpus IN ('legacy', 'v1', 'gepa-datasets', 'unknown')),
  dataset_train_count    integer,
  dataset_val_count      integer,
  dataset_holdout_count  integer,

  -- 📜 The active /admin system prompt at run time (snapshot, not reference)
  system_prompt text,

  -- 🎭 Skill markdown before & after evolution
  baseline_skill_md text,
  evolved_skill_md  text,

  -- 💎 Headline metrics
  baseline_score   double precision,
  evolved_score    double precision,
  improvement      double precision,
  elapsed_seconds  double precision,

  -- 🌌 Environment fingerprint — for reproducibility forensics
  git_sha        text,
  python_version text,
  dspy_version   text,
  gepa_version   text,

  -- 🌩️ If status='failed', the full traceback lives here
  error text,

  -- 🎁 Future-reserved escape hatch for anything else
  metadata jsonb DEFAULT '{}'::jsonb,

  -- 🕰️ Audit timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 📜 Inscribe the table's purpose for future archaeologists
COMMENT ON TABLE  gepa_experiments IS
  'Top-level record of each GEPA-DSPy optimization run. One row per run; child tables capture per-iteration and per-example detail.';
COMMENT ON COLUMN gepa_experiments.run_id IS
  'Externally-generated UUID passed via the --run-id CLI flag, allowing the wrapper to upsert by run_id.';
COMMENT ON COLUMN gepa_experiments.status IS
  'Lifecycle: pending → running → (completed | failed | partial). partial = some iterations recorded before failure.';
COMMENT ON COLUMN gepa_experiments.system_prompt IS
  'Snapshot of the active /admin system prompt at the moment the run started. Auditable, even if admin_config later changes.';
COMMENT ON COLUMN gepa_experiments.dataset_corpus IS
  'Which dataset family was used: legacy (pre-v1), v1 (current production), gepa-datasets (community benchmarks), or unknown.';
COMMENT ON COLUMN gepa_experiments.metadata IS
  'Forward-compatible bag for ad-hoc keys (e.g. is_demo, notes, parent_run_id). Prefer adding columns when a key becomes load-bearing.';

-- 🔍 Indexes — make the admin UI's queries lightning-fast
CREATE INDEX IF NOT EXISTS idx_gepa_experiments_skill_name
  ON gepa_experiments (skill_name);
CREATE INDEX IF NOT EXISTS idx_gepa_experiments_status
  ON gepa_experiments (status);
CREATE INDEX IF NOT EXISTS idx_gepa_experiments_created_at_desc
  ON gepa_experiments (created_at DESC);
-- (run_id already has a unique index from the UNIQUE constraint)


-- =============================================================================
-- 🌟 TABLE 2: gepa_candidates — Per-Iteration Prompt Evolution Snapshots
-- =============================================================================
-- One row per candidate prompt produced at each iteration. The candidate_text
-- is the full evolved instruction at that iteration; metadata captures
-- LLMJudge sub-scores when use_llm_judge=true.

CREATE TABLE IF NOT EXISTS gepa_candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 🔗 FK to the parent experiment; cascade on delete keeps the table tidy
  experiment_id uuid NOT NULL
    REFERENCES gepa_experiments(id) ON DELETE CASCADE,

  -- 🎭 Iteration index within the run (0 = baseline, 1..N = evolved)
  iteration integer NOT NULL,

  -- 📜 The evolved prompt/instruction at this iteration — the star of the show
  candidate_text text NOT NULL,

  -- 💎 Aggregate score for this candidate
  score double precision,

  -- 🎁 Sub-scores from LLMJudge: { correctness, procedure_following,
  --     conciseness, feedback }, plus any future fields
  metadata jsonb DEFAULT '{}'::jsonb,

  -- 🕰️ When this candidate was logged
  recorded_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  gepa_candidates IS
  'Per-iteration candidate prompts produced during GEPA optimization. The full prompt text is preserved at each step.';
COMMENT ON COLUMN gepa_candidates.iteration IS
  'Iteration index within the parent run. 0 = baseline candidate; 1..N = evolved candidates.';
COMMENT ON COLUMN gepa_candidates.metadata IS
  'LLMJudge sub-scores ({correctness, procedure_following, conciseness, feedback}) plus any extra per-candidate signals.';

-- 🔍 Indexes
CREATE INDEX IF NOT EXISTS idx_gepa_candidates_experiment_iteration
  ON gepa_candidates (experiment_id, iteration);
CREATE INDEX IF NOT EXISTS idx_gepa_candidates_recorded_at
  ON gepa_candidates (recorded_at);


-- =============================================================================
-- 🌟 TABLE 3: gepa_evaluations — Per-Example Verdicts (the granular truth)
-- =============================================================================
-- One row per (iteration × example). This is the bottom of the audit pyramid:
-- if a candidate scored 0.42, you can drill into exactly which examples failed
-- and what the judge said about each.

CREATE TABLE IF NOT EXISTS gepa_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 🔗 FK to the parent experiment
  experiment_id uuid NOT NULL
    REFERENCES gepa_experiments(id) ON DELETE CASCADE,

  -- 🎭 Iteration index (0 = baseline, 1..N = evolved iterations)
  iteration integer NOT NULL,

  -- 🎯 Index of the example within the holdout/val set
  example_idx integer NOT NULL,

  -- 📥 Inputs and expectations
  task_input         text,
  expected_behavior  text,

  -- 📤 What the agent actually produced
  agent_output text,

  -- 💎 Score for this single example
  score double precision,

  -- 🧙 The judge's prose feedback (when use_llm_judge=true)
  judge_feedback text,

  -- 🕰️ When this evaluation was logged
  recorded_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  gepa_evaluations IS
  'Per-example evaluation results: one row per (iteration, example_idx). Enables "show me the worst-scoring examples" drill-downs.';
COMMENT ON COLUMN gepa_evaluations.iteration IS
  'Iteration index. 0 = baseline evaluation; 1..N = evaluations of evolved candidates.';
COMMENT ON COLUMN gepa_evaluations.example_idx IS
  'Zero-based index of the example within the holdout/val dataset for this run.';
COMMENT ON COLUMN gepa_evaluations.judge_feedback IS
  'Free-form feedback from LLMJudge.feedback; null when use_llm_judge=false.';

-- 🔍 Indexes
CREATE INDEX IF NOT EXISTS idx_gepa_evaluations_experiment_iter_example
  ON gepa_evaluations (experiment_id, iteration, example_idx);
CREATE INDEX IF NOT EXISTS idx_gepa_evaluations_score
  ON gepa_evaluations (score);


-- =============================================================================
-- 🎼 The updated_at Auto-Update Trigger - Time Marches On Automatically
-- =============================================================================
-- Reusable function: any table that needs auto-updated `updated_at` can attach.
-- CREATE OR REPLACE so we play nicely if a sibling migration already defined it.

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  -- ✨ Stamp the row with the current moment — gentle but inexorable
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 🎭 Drop & recreate trigger so re-running this migration is idempotent
DROP TRIGGER IF EXISTS set_updated_at_gepa_experiments ON gepa_experiments;
CREATE TRIGGER set_updated_at_gepa_experiments
  BEFORE UPDATE ON gepa_experiments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- =============================================================================
-- 🛡️ Row-Level Security - The Velvet Rope of the Audit Hall
-- =============================================================================
-- Posture:
--   • RLS enabled on all three tables
--   • Anon role can SELECT (admin UI uses anon key, internal tool, low risk)
--   • No anon-write policy → writes happen via service_role only
--     (service_role bypasses RLS by Supabase design)
-- If stricter access is desired later, narrow the SELECT policy to require
-- an authenticated admin role/claim.

ALTER TABLE gepa_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gepa_candidates  ENABLE ROW LEVEL SECURITY;
ALTER TABLE gepa_evaluations ENABLE ROW LEVEL SECURITY;

-- 🎭 Drop existing policies first so re-running is idempotent
DROP POLICY IF EXISTS "Anon can read experiments" ON gepa_experiments;
DROP POLICY IF EXISTS "Anon can read candidates"  ON gepa_candidates;
DROP POLICY IF EXISTS "Anon can read evaluations" ON gepa_evaluations;

-- 🌟 Read policies — admin UI consumes via anon key
CREATE POLICY "Anon can read experiments" ON gepa_experiments
  FOR SELECT USING (true);

CREATE POLICY "Anon can read candidates" ON gepa_candidates
  FOR SELECT USING (true);

CREATE POLICY "Anon can read evaluations" ON gepa_evaluations
  FOR SELECT USING (true);

-- 🚫 No INSERT/UPDATE/DELETE policies for anon → writes require service_role.

-- =============================================================================
-- 🎉 ✨ MIGRATION MASTERPIECE COMPLETE!
-- =============================================================================
-- Three tables stand ready. Apply with: supabase db push
-- (or hand-paste this file in app.supabase.com → SQL Editor).
-- =============================================================================
