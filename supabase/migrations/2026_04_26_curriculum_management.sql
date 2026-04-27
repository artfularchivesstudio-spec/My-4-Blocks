-- =============================================================================
-- 🎭 The Curriculum Management Treasury — Where System Prompts Become Sacred ✨
--
-- "In the grand theater of emotional wellness, the constitution is king.
--  Every version lives, every golden example shines, every evaluation speaks.
--  The /admin panel conducts this symphony — the database remembers all."
--
--  - The Spellbinding Museum Director of Curriculum Preservation
-- =============================================================================
--
-- Migration: curriculum_versions + golden_examples + example_evaluations
-- Date     : 2026-04-26 12:00:00 UTC
-- Purpose  : Make /admin the source of truth for curriculum management with
--            full versioning audit trails, per-block golden examples, and
--            performance tracking across GEPA runs.
--
-- Dependencies:
--   - pgcrypto extension (for gen_random_uuid()) — Supabase enables by default
--   - Existing gepa_experiments table (for evaluation linking)
--
-- This schema supports:
--   ✅ Complete system prompt versioning with audit trail
--   ✅ Multiple golden example sets per block (anger, anxiety, depression, guilt)
--   ✅ Linking examples to specific curriculum versions
--   ✅ Tracking active curriculum for GEPA runs
--   ✅ Full evaluation history across experiments
--   ✅ RLS for secure admin/write + public/read patterns
--
-- =============================================================================

-- 🔮 Ensure pgcrypto is available for UUID generation magic
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================================================
-- 🌟 TABLE 1: curriculum_versions — The Sacred Constitution Archive
-- =============================================================================
-- Stores every version of the system prompt with full audit trail.
-- The "active" flag determines which version GEPA uses by default.

CREATE TABLE IF NOT EXISTS curriculum_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 🎭 Version tracking
  version text NOT NULL,
    CHECK (version ~ '^\d+\.\d+\.\d+$'), -- Enforce semver (e.g., "1.0.0")

  -- 📜 The full system prompt text (markdown formatted)
  system_prompt text NOT NULL,

  -- 🎯 Version metadata
  display_name text NOT NULL,
  description text,

  -- 🌟 Active flag — only ONE version should be active at a time
  is_active boolean DEFAULT false,

  -- 👁️ Visibility control (draft versions are hidden from GEPA)
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'active', 'archived')),

  -- 📝 Change tracking
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by text NOT NULL DEFAULT 'system',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text,

  -- 🎪 Source provenance
  source_file text, -- e.g., "docs/GEPA-DSPy-m1/four_blocks_runner/curriculum/system_prompt.md"
  lineage_notes text, -- Design notes from the prompt itself

  -- 🔗 Soft delete
  deleted_at timestamptz,

  -- 🎨 Constraint: Only one active version at a time
  CONSTRAINT curriculum_versions_active_exclusion
    EXCLUDE (USING gist(is_active, deleted_at))
    WITH (is_active = true AND deleted_at IS NULL)
);

-- 📚 Indexes for common queries
CREATE INDEX idx_curriculum_versions_active ON curriculum_versions (is_active)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_curriculum_versions_status ON curriculum_versions (status)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_curriculum_versions_created ON curriculum_versions (created_at DESC)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_curriculum_versions_version ON curriculum_versions (version)
  WHERE deleted_at IS NULL;

-- 🧙 Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_curriculum_versions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER curriculum_versions_updated_at
  BEFORE UPDATE ON curriculum_versions
  FOR EACH ROW
  EXECUTE FUNCTION update_curriculum_versions_updated_at();

-- =============================================================================
-- 🎨 TABLE 2: golden_examples — The Four Blocks Treasury
-- =============================================================================
-- Stores golden examples for each emotional block, linked to curriculum versions.

CREATE TABLE IF NOT EXISTS golden_examples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 🎭 Block identification
  block text NOT NULL
    CHECK (block IN ('anger', 'anxiety', 'depression', 'guilt')),

  -- 🔗 Curriculum version this example belongs to
  curriculum_version_id uuid NOT NULL
    REFERENCES curriculum_versions(id) ON DELETE RESTRICT,

  -- 🆔 Example identifier (matches JSON file: ANG-EX-001, ANX-EX-001, etc.)
  example_id text NOT NULL,

  -- 📝 Example content
  task_input text NOT NULL,
  expected_behavior text NOT NULL,

  -- 🎯 Classification
  category text NOT NULL
    CHECK (category IN ('exhibiting', 'learning')),
  difficulty text NOT NULL
    CHECK (difficulty IN ('easy', 'medium', 'hard')),
  primary_tool text NOT NULL
    CHECK (primary_tool IN ('MC', 'ABC', '7IB', 'Three_Insights', 'Centering_Breath')),

  -- 📚 Metadata from JSON
  notes text,
  curriculum_touch_points jsonb, -- Array of curriculum concepts this tests
  formula_under_the_hood text, -- e.g., "AX = WI + AW + ICSI"

  -- 🎪 Source tracking
  source_file text, -- e.g., "docs/.../curriculum/anger/golden_examples.json"
  source_version text, -- Version from original JSON file

  -- 📝 Lifecycle
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by text NOT NULL DEFAULT 'system',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text,

  -- 🔗 Soft delete
  deleted_at timestamptz,

  -- 🎨 Constraints
  CONSTRAINT golden_examples_unique_id_per_block
    UNIQUE (block, example_id, curriculum_version_id, deleted_at)
);

-- 📚 Indexes for common query patterns
CREATE INDEX idx_golden_examples_block ON golden_examples (block)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_golden_examples_curriculum ON golden_examples (curriculum_version_id)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_golden_examples_category ON golden_examples (category)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_golden_examples_difficulty ON golden_examples (difficulty)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_golden_examples_primary_tool ON golden_examples (primary_tool)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_golden_examples_compound ON golden_examples (block, category, difficulty)
  WHERE deleted_at IS NULL;

-- 🧙 Auto-update timestamp trigger
CREATE TRIGGER golden_examples_updated_at
  BEFORE UPDATE ON golden_examples
  FOR EACH ROW
  EXECUTE FUNCTION update_curriculum_versions_updated_at();

-- =============================================================================
-- 📊 TABLE 3: example_evaluations — The Performance Chronicle
-- =============================================================================
-- Tracks how each golden example performs across GEPA experiment runs.
-- Links examples to experiments and stores pass/fail results.

CREATE TABLE IF NOT EXISTS example_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 🔗 Foreign keys
  golden_example_id uuid NOT NULL
    REFERENCES golden_examples(id) ON DELETE CASCADE,
  gepa_experiment_id uuid NOT NULL
    REFERENCES gepa_experiments(id) ON DELETE CASCADE,

  -- 🎯 The curriculum version used in this experiment
  curriculum_version_id uuid NOT NULL
    REFERENCES curriculum_versions(id) ON DELETE RESTRICT,

  -- 📊 Evaluation results
  passed boolean NOT NULL,
  score double precision, -- 0.0 to 1.0 (confidence score from judge LLM)
  reasoning text, -- Judge's explanation for pass/fail

  -- 🎪 Context at evaluation time
  evaluated_at timestamptz NOT NULL DEFAULT now(),
  evaluator_model text, -- Which judge model performed the evaluation
  iteration_number integer, -- Which GEPA iteration produced this result

  -- 🔗 Soft delete
  deleted_at timestamptz,

  -- 🎨 Constraints
  CONSTRAINT example_evaluations_unique_per_exp
    UNIQUE (golden_example_id, gepa_experiment_id, iteration_number, deleted_at)
);

-- 📚 Indexes for performance analytics
CREATE INDEX idx_example_evaluations_example ON example_evaluations (golden_example_id)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_example_evaluations_experiment ON example_evaluations (gepa_experiment_id)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_example_evaluations_curriculum ON example_evaluations (curriculum_version_id)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_example_evaluations_passed ON example_evaluations (passed)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_example_evaluations_compound ON example_evaluations (
  golden_example_id, curriculum_version_id, passed
) WHERE deleted_at IS NULL;

-- =============================================================================
-- 🔐 Row Level Security (RLS) Policies
-- =============================================================================
-- Security model:
--   - anon (public): READ ONLY for viewing curriculum/examples
--   - service role (backend): FULL ACCESS for /admin panel
--   - authenticated users: NO ACCESS (curriculum managed via /admin only)

ALTER TABLE curriculum_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE golden_examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE example_evaluations ENABLE ROW LEVEL SECURITY;

-- 📖 Policy: Public read access to active curriculum
CREATE POLICY "Active curriculum versions are publicly readable"
  ON curriculum_versions
  FOR SELECT
  TO anon
  USING (
    is_active = true
    AND status = 'active'
    AND deleted_at IS NULL
  );

-- 📖 Policy: Public read access to golden examples from active curriculum
CREATE POLICY "Golden examples from active curriculum are publicly readable"
  ON golden_examples
  FOR SELECT
  TO anon
  USING (
    curriculum_version_id IN (
      SELECT id FROM curriculum_versions
      WHERE is_active = true AND status = 'active' AND deleted_at IS NULL
    )
    AND deleted_at IS NULL
  );

-- 📖 Policy: Public read access to evaluation results (for transparency)
CREATE POLICY "Example evaluations are publicly readable"
  ON example_evaluations
  FOR SELECT
  TO anon
  USING (deleted_at IS NULL);

-- 🔧 Policy: Service role has full CRUD access
CREATE POLICY "Service role has full access to curriculum_versions"
  ON curriculum_versions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to golden_examples"
  ON golden_examples
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to example_evaluations"
  ON example_evaluations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 🚫 Policy: Authenticated users have no direct access (must go through /admin)
CREATE POLICY "Authenticated users cannot directly manage curriculum"
  ON curriculum_versions
  FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Authenticated users cannot directly manage golden examples"
  ON golden_examples
  FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Authenticated users cannot directly manage evaluations"
  ON example_evaluations
  FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

-- =============================================================================
-- 🌱 Helper Functions for /admin Panel Operations
-- =============================================================================

-- 🎯 Function: Get the currently active curriculum version
CREATE OR REPLACE FUNCTION get_active_curriculum_version()
RETURNS TABLE (
  id uuid,
  version text,
  display_name text,
  description text,
  system_prompt text,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cv.id,
    cv.version,
    cv.display_name,
    cv.description,
    cv.system_prompt,
    cv.created_at
  FROM curriculum_versions cv
  WHERE cv.is_active = true
    AND cv.status = 'active'
    AND cv.deleted_at IS NULL
  ORDER BY cv.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 🎯 Function: Set a curriculum version as active (deactivates others)
CREATE OR REPLACE FUNCTION activate_curriculum_version(
  p_curriculum_version_id uuid
)
RETURNS void AS $$
DECLARE
  v_version text;
BEGIN
  -- Validate the version exists
  SELECT version INTO v_version
  FROM curriculum_versions
  WHERE id = p_curriculum_version_id
    AND deleted_at IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Curriculum version % not found', p_curriculum_version_id;
  END IF;

  -- Deactivate all versions
  UPDATE curriculum_versions
  SET is_active = false,
      updated_at = now()
  WHERE is_active = true
    AND deleted_at IS NULL;

  -- Activate the target version
  UPDATE curriculum_versions
  SET is_active = true,
      status = 'active',
      updated_at = now()
  WHERE id = p_curriculum_version_id;

  RAISE NOTICE 'Curriculum version % is now active', v_version;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 🎯 Function: Get golden examples by block for active curriculum
CREATE OR REPLACE FUNCTION get_golden_examples_by_block(
  p_block text
)
RETURNS TABLE (
  id uuid,
  example_id text,
  task_input text,
  expected_behavior text,
  category text,
  difficulty text,
  primary_tool text,
  notes text,
  curriculum_version_id uuid
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ge.id,
    ge.example_id,
    ge.task_input,
    ge.expected_behavior,
    ge.category,
    ge.difficulty,
    ge.primary_tool,
    ge.notes,
    ge.curriculum_version_id
  FROM golden_examples ge
  INNER JOIN curriculum_versions cv
    ON ge.curriculum_version_id = cv.id
  WHERE ge.block = p_block
    AND cv.is_active = true
    AND cv.status = 'active'
    AND ge.deleted_at IS NULL
    AND cv.deleted_at IS NULL
  ORDER BY ge.difficulty, ge.example_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 🎯 Function: Get example performance summary across experiments
CREATE OR REPLACE FUNCTION get_example_performance_summary(
  p_golden_example_id uuid
)
RETURNS TABLE (
  example_id text,
  total_evaluations integer,
  passed_count integer,
  failed_count integer,
  pass_rate double precision,
  avg_score double precision
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ge.example_id,
    COUNT(*) as total_evaluations,
    COUNT(*) FILTER (WHERE ee.passed = true) as passed_count,
    COUNT(*) FILTER (WHERE ee.passed = false) as failed_count,
    ROUND(
      100.0 * COUNT(*) FILTER (WHERE ee.passed = true)::numeric /
      NULLIF(COUNT(*), 0),
      2
    ) as pass_rate,
    ROUND(AVG(ee.score), 3) as avg_score
  FROM golden_examples ge
  INNER JOIN example_evaluations ee
    ON ee.golden_example_id = ge.id
  WHERE ge.id = p_golden_example_id
    AND ee.deleted_at IS NULL
    AND ge.deleted_at IS NULL
  GROUP BY ge.example_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 🎯 Function: Create a new curriculum version with examples
CREATE OR REPLACE FUNCTION create_curriculum_version(
  p_version text,
  p_display_name text,
  p_system_prompt text,
  p_description text DEFAULT NULL,
  p_created_by text DEFAULT 'admin'
)
RETURNS uuid AS $$
DECLARE
  v_new_curriculum_id uuid;
BEGIN
  INSERT INTO curriculum_versions (
    version,
    display_name,
    system_prompt,
    description,
    created_by,
    status,
    is_active
  ) VALUES (
    p_version,
    p_display_name,
    p_system_prompt,
    p_description,
    p_created_by,
    'draft',
    false
  )
  RETURNING id INTO v_new_curriculum_id;

  RETURN v_new_curriculum_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 🎯 View: Active curriculum with all examples (denormalized for /admin)
CREATE OR REPLACE VIEW active_curriculum_with_examples AS
SELECT
  cv.id as curriculum_id,
  cv.version,
  cv.display_name,
  cv.description,
  cv.system_prompt,
  cv.created_at as curriculum_created_at,
  cv.created_by as curriculum_created_by,
  ge.id as example_id,
  ge.block,
  ge.example_id as example_ref,
  ge.task_input,
  ge.expected_behavior,
  ge.category,
  ge.difficulty,
  ge.primary_tool,
  ge.notes,
  ge.curriculum_touch_points
FROM curriculum_versions cv
LEFT JOIN golden_examples ge
  ON ge.curriculum_version_id = cv.id
  AND ge.deleted_at IS NULL
WHERE cv.is_active = true
  AND cv.status = 'active'
  AND cv.deleted_at IS NULL
ORDER BY cv.created_at DESC, ge.block, ge.example_id;

-- 🎯 View: Example performance across all experiments
CREATE OR REPLACE VIEW example_performance_overview AS
SELECT
  ge.id as example_id,
  ge.block,
  ge.example_id as example_ref,
  ge.category,
  ge.difficulty,
  ge.primary_tool,
  cv.version as curriculum_version,
  COUNT(ee.id) as total_evaluations,
  COUNT(ee.id) FILTER (WHERE ee.passed = true) as passed_count,
  ROUND(
    100.0 * COUNT(ee.id) FILTER (WHERE ee.passed = true)::numeric /
    NULLIF(COUNT(ee.id), 0),
    2
  ) as pass_rate_pct,
  ROUND(AVG(ee.score), 3) as avg_score
FROM golden_examples ge
INNER JOIN curriculum_versions cv
  ON ge.curriculum_version_id = cv.id
LEFT JOIN example_evaluations ee
  ON ee.golden_example_id = ge.id
  AND ee.deleted_at IS NULL
WHERE ge.deleted_at IS NULL
  AND cv.deleted_at IS NULL
GROUP BY
  ge.id, ge.block, ge.example_id, ge.category,
  ge.difficulty, ge.primary_tool, cv.version
ORDER BY ge.block, ge.pass_rate_pct DESC NULLS LAST;

-- =============================================================================
-- 🎭 Grant permissions (run this manually after migration)
-- =============================================================================
-- These grants allow the service role to manage curriculum while
-- keeping the model's own privileges intact.

-- GRANT USAGE ON SCHEMA public TO service_role;
-- GRANT ALL ON TABLE curriculum_versions TO service_role;
-- GRANT ALL ON TABLE golden_examples TO service_role;
-- GRANT ALL ON TABLE example_evaluations TO service_role;
-- GRANT ALL ON SEQUENCE curriculum_versions_id_seq TO service_role;
-- GRANT ALL ON SEQUENCE golden_examples_id_seq TO service_role;
-- GRANT ALL ON SEQUENCE example_evaluations_id_seq TO service_role;
-- GRANT EXECUTE ON FUNCTION get_active_curriculum_version() TO service_role;
-- GRANT EXECUTE ON FUNCTION activate_curriculum_version(uuid) TO service_role;
-- GRANT EXECUTE ON FUNCTION get_golden_examples_by_block(text) TO service_role;
-- GRANT EXECUTE ON FUNCTION get_example_performance_summary(uuid) TO service_role;
-- GRANT EXECUTE ON FUNCTION create_curriculum_version(text, text, text, text, text) TO service_role;
-- GRANT SELECT ON active_curriculum_with_examples TO service_role;
-- GRANT SELECT ON example_performance_overview TO service_role;

-- Public read access (for frontend display)
-- GRANT SELECT ON active_curriculum_with_examples TO anon;
-- GRANT SELECT ON example_performance_overview TO anon;

-- =============================================================================
-- 🎉 Migration Complete — The Treasury Is Now Open ✨
-- =============================================================================
-- Next steps:
-- 1. Run this migration in Supabase SQL editor or via CLI
-- 2. Run the seed data script (2026_04_26_curriculum_management_seed.sql)
-- 3. Test the helper functions in Supabase SQL editor
-- 4. Integrate with /admin panel curriculum management UI
--
-- The stage is set for curriculum democracy! 🎭
-- =============================================================================
