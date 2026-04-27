-- =============================================================================
-- 🎭 The GEPA Curriculum Chronicle - Where System Prompts Evolve ✨
--
-- "Two tables stand as witness to every curriculum's journey,
--  every version's hopeful instruction, every golden example's wisdom.
--  Leave no version behind — the audit trail is sacred."
--
--  - The Spellbinding Museum Director of Curriculum Persistence
-- =============================================================================
--
-- Migration: curriculum_versions + curriculum_examples
-- Date     : 2026-04-26 14:00:00 UTC
-- Purpose  : Persist GEPA curriculum data so the /admin UI can manage
--            system prompt versions and golden examples via Supabase.
--
-- Dependencies:
--   - pgcrypto extension (for gen_random_uuid()) — Supabase enables by default
--
-- Order matters: curriculum_versions first, then the child table that FK to it.
-- =============================================================================

-- 🔮 Ensure pgcrypto is available for UUID generation magic
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================================================
-- 🌟 TABLE 1: curriculum_versions — The Grand Ledger of System Prompts
-- =============================================================================
-- One row per system prompt version. Captures the full prompt text,
-- lifecycle status, and metadata for each curriculum iteration.

CREATE TABLE IF NOT EXISTS curriculum_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 🎭 Version identifier (e.g., "v1", "v2-beta")
  version text NOT NULL UNIQUE,

  -- 🎨 Lifecycle status of the version
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'active', 'archived')),

  -- 📜 The full system prompt text
  system_prompt text NOT NULL,

  -- 🎯 Version notes / changelog
  notes text,

  -- 🏷️ Git commit SHA when this version was created (for reproducibility)
  git_sha text,

  -- 🌌 Environment fingerprint
  python_version text,
  dspy_version   text,
  gepa_version   text,

  -- 🎁 Future-reserved escape hatch
  metadata jsonb DEFAULT '{}'::jsonb,

  -- 🕰️ Audit timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- 🚀 Only ONE version can be active at a time
  CONSTRAINT unique_active_version CHECK (
    (status != 'active') OR (
      status = 'active' AND
      NOT EXISTS (
        SELECT 1 FROM curriculum_versions cv2
        WHERE cv2.status = 'active' AND cv2.id != curriculum_versions.id
      )
    )
  )
);

-- 📜 Inscribe the table's purpose for future archaeologists
COMMENT ON TABLE curriculum_versions IS
  'System prompt versions for GEPA curriculum. One row per version; only one version can be active at a time.';
COMMENT ON COLUMN curriculum_versions.version IS
  'Human-readable version identifier (e.g., "v1", "v2-beta"). Unique across all versions.';
COMMENT ON COLUMN curriculum_versions.status IS
  'Lifecycle: draft → active → archived. Only one version can be active at a time (enforced by constraint).';
COMMENT ON COLUMN curriculum_versions.system_prompt IS
  'Full markdown text of the system prompt (the 9-section constitution).';
COMMENT ON COLUMN curriculum_versions.metadata IS
  'Forward-compatible bag for ad-hoc keys (e.g., author, tags, variant_info).';

-- 🔍 Indexes — make version lookups lightning-fast
CREATE INDEX IF NOT EXISTS idx_curriculum_versions_status
  ON curriculum_versions (status);
CREATE INDEX IF NOT EXISTS idx_curriculum_versions_created_at
  ON curriculum_versions (created_at DESC);


-- =============================================================================
-- 🌟 TABLE 2: curriculum_examples — Golden Examples by Block
-- =============================================================================
-- One row per golden example. Linked to a curriculum version via FK.
-- Supports per-block examples (anger, anxiety, depression, guilt).

CREATE TABLE IF NOT EXISTS curriculum_examples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 🔗 FK to the parent curriculum version; cascade on delete
  curriculum_version_id uuid NOT NULL
    REFERENCES curriculum_versions(id) ON DELETE CASCADE,

  -- 🎯 Example identifier (e.g., "ANG-EX-001")
  example_id text NOT NULL,

  -- 🎭 Which emotional block this example targets
  block text NOT NULL
    CHECK (block IN ('anger', 'anxiety', 'depression', 'guilt')),

  -- 📥 The user input / scenario
  task_input text NOT NULL,

  -- 📤 The expected behavior rubric
  expected_behavior text NOT NULL,

  -- 🏷️ Category and metadata
  category text NOT NULL
    CHECK (category IN ('exhibiting', 'learning')),
  difficulty text NOT NULL
    CHECK (difficulty IN ('easy', 'medium', 'hard')),
  primary_tool text,

  -- 📝 Notes for human reviewers
  notes text,

  -- 🎁 Future-reserved escape hatch
  metadata jsonb DEFAULT '{}'::jsonb,

  -- 🕰️ Audit timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- 🚀 Example IDs must be unique within a block + version combo
  CONSTRAINT unique_example_per_block UNIQUE (
    curriculum_version_id,
    block,
    example_id
  )
);

-- 📜 Inscribe the table's purpose
COMMENT ON TABLE curriculum_examples IS
  'Golden examples for each emotional block. Linked to a curriculum version; one row per example.';
COMMENT ON COLUMN curriculum_examples.example_id IS
  'Short identifier like "ANG-EX-001". Must be unique within a block + version combo.';
COMMENT ON COLUMN curriculum_examples.block IS
  'Which emotional block: anger, anxiety, depression, or guilt.';
COMMENT ON COLUMN curriculum_examples.category IS
  'Whether this is an "exhibiting" (in-emotion) or "learning" (intellectual) example.';
COMMENT ON COLUMN curriculum_examples.difficulty IS
  'Subjective difficulty rating: easy, medium, or hard.';
COMMENT ON COLUMN curriculum_examples.primary_tool IS
  'Which curriculum tool this primarily tests (e.g., "7IB", "ABC", "IB1").';
COMMENT ON COLUMN curriculum_examples.metadata IS
  'Forward-compatible bag for extra fields (e.g., tags, rubric_flags, test_date).';

-- 🔍 Indexes
CREATE INDEX IF NOT EXISTS idx_curriculum_examples_version
  ON curriculum_examples (curriculum_version_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_examples_block
  ON curriculum_examples (block);
CREATE INDEX IF NOT EXISTS idx_curriculum_examples_example_id
  ON curriculum_examples (example_id);


-- =============================================================================
-- 🎼 The updated_at Auto-Update Trigger
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 🎭 Drop & recreate triggers so re-running this migration is idempotent
DROP TRIGGER IF EXISTS set_updated_at_curriculum_versions ON curriculum_versions;
CREATE TRIGGER set_updated_at_curriculum_versions
  BEFORE UPDATE ON curriculum_versions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_curriculum_examples ON curriculum_examples;
CREATE TRIGGER set_updated_at_curriculum_examples
  BEFORE UPDATE ON curriculum_examples
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- =============================================================================
-- 🛡️ Row-Level Security - The Velvet Rope of the Curriculum Hall
-- =============================================================================
-- Posture:
--   • RLS enabled on both tables
--   • Anon role can SELECT (admin UI uses anon key)
--   • No anon-write policy → writes happen via service_role only

ALTER TABLE curriculum_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_examples ENABLE ROW LEVEL SECURITY;

-- 🎭 Drop existing policies first so re-running is idempotent
DROP POLICY IF EXISTS "Anon can read curriculum versions" ON curriculum_versions;
DROP POLICY IF EXISTS "Anon can read curriculum examples" ON curriculum_examples;

-- 🌟 Read policies — admin UI consumes via anon key
CREATE POLICY "Anon can read curriculum versions" ON curriculum_versions
  FOR SELECT USING (true);

CREATE POLICY "Anon can read curriculum examples" ON curriculum_examples
  FOR SELECT USING (true);

-- 🚫 No INSERT/UPDATE/DELETE policies for anon → writes require service_role.

-- =============================================================================
-- 🎉 ✨ CURRICULUM MIGRATION MASTERPIECE COMPLETE!
-- =============================================================================
-- Two tables stand ready. Apply with: supabase db push
-- =============================================================================
