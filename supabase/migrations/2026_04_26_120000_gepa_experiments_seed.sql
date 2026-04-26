-- =============================================================================
-- 🎭 The Demo Data Cabaret - One Tiny Show So The Stage Isn't Empty ✨
--
-- "Before the first real run takes the stage, a single demo experiment
--  rehearses with three iterations and a handful of evaluations.
--  Every row is tagged metadata->>'is_demo' = 'true' for clean removal."
--
--  - The Theatrical Seed-Data Virtuoso
-- =============================================================================
--
-- Demo data — DELETE AFTER FIRST REAL RUN.
--
-- To remove cleanly:
--   DELETE FROM gepa_experiments WHERE metadata->>'is_demo' = 'true';
--   (CASCADE will sweep the child rows in gepa_candidates & gepa_evaluations.)
--
-- Date    : 2026-04-26
-- Purpose : Give /admin GEPAReportsTab something to render before the first
--           real GEPA optimization run completes.
-- =============================================================================

-- 🎭 Wrap in a transaction so the demo lands atomically or not at all
BEGIN;

-- 🌟 The demo experiment - a fictional but plausible run
WITH demo_experiment AS (
  INSERT INTO gepa_experiments (
    run_id,
    status,
    skill_name,
    started_at,
    completed_at,
    optimizer_model,
    eval_model,
    judge_model,
    use_llm_judge,
    iterations,
    dataset_path,
    dataset_corpus,
    dataset_train_count,
    dataset_val_count,
    dataset_holdout_count,
    system_prompt,
    baseline_skill_md,
    evolved_skill_md,
    baseline_score,
    evolved_score,
    improvement,
    elapsed_seconds,
    git_sha,
    python_version,
    dspy_version,
    gepa_version,
    metadata
  ) VALUES (
    '00000000-0000-4000-8000-000000000001'::uuid,  -- ✨ stable demo UUID
    'completed',
    'story_generator',
    '2026-04-26 11:00:00+00',
    '2026-04-26 11:08:42+00',
    'claude-3-5-sonnet-20241022',
    'gpt-4o-mini',
    'claude-3-5-sonnet-20241022',
    true,
    3,
    'shared/datasets/v1/story_generator/holdout.jsonl',
    'v1',
    40,
    10,
    10,
    'You are a thoughtful storyteller for the My 4 Blocks platform. Generate stories that align with the user''s emotional state and reading level.',
    '# story_generator (baseline)\n\nGenerate a short story given the user''s prompt.',
    '# story_generator (evolved iter=3)\n\nGenerate a short story (200-400 words) given the user''s prompt. Match emotional tone, use age-appropriate vocabulary, and end with a single reflective question that invites the reader to share their own experience.',
    0.61,
    0.84,
    0.23,
    522.4,
    'demo-sha-deadbeef',
    '3.12.4',
    '2.5.3',
    '0.1.0',
    jsonb_build_object('is_demo', 'true', 'note', 'Seed data — safe to delete after first real run.')
  )
  RETURNING id
)
-- 🎪 Insert candidates (iter 0..3) for the demo experiment
,
inserted_candidates AS (
  INSERT INTO gepa_candidates (experiment_id, iteration, candidate_text, score, metadata)
  SELECT
    de.id,
    c.iteration,
    c.candidate_text,
    c.score,
    c.metadata
  FROM demo_experiment de,
  (VALUES
    (
      0,
      'Generate a short story given the user''s prompt.',
      0.61,
      jsonb_build_object('is_demo', 'true', 'correctness', 0.65, 'procedure_following', 0.70, 'conciseness', 0.55, 'feedback', 'Stories were on-topic but felt generic and lacked emotional calibration.')
    ),
    (
      1,
      'Generate a short story (about 250 words) given the user''s prompt. Try to match the emotional tone implied by the prompt.',
      0.71,
      jsonb_build_object('is_demo', 'true', 'correctness', 0.74, 'procedure_following', 0.78, 'conciseness', 0.62, 'feedback', 'Length guidance helped, emotional matching is improving but inconsistent.')
    ),
    (
      2,
      'Generate a short story (200-400 words) given the user''s prompt. Match the emotional tone and use age-appropriate vocabulary.',
      0.78,
      jsonb_build_object('is_demo', 'true', 'correctness', 0.80, 'procedure_following', 0.83, 'conciseness', 0.71, 'feedback', 'Vocabulary control is strong now; conciseness still drifts on longer prompts.')
    ),
    (
      3,
      'Generate a short story (200-400 words) given the user''s prompt. Match emotional tone, use age-appropriate vocabulary, and end with a single reflective question that invites the reader to share their own experience.',
      0.84,
      jsonb_build_object('is_demo', 'true', 'correctness', 0.86, 'procedure_following', 0.89, 'conciseness', 0.78, 'feedback', 'Reflective question ending lifted engagement scores noticeably.')
    )
  ) AS c(iteration, candidate_text, score, metadata)
  RETURNING experiment_id
)
-- 🎯 Insert per-example evaluations (a small but representative sample)
INSERT INTO gepa_evaluations (
  experiment_id, iteration, example_idx, task_input, expected_behavior, agent_output, score, judge_feedback, recorded_at
)
SELECT
  ic.experiment_id,
  e.iteration,
  e.example_idx,
  e.task_input,
  e.expected_behavior,
  e.agent_output,
  e.score,
  e.judge_feedback,
  now()
FROM (SELECT DISTINCT experiment_id FROM inserted_candidates) ic,
(VALUES
  -- 🎭 Baseline iteration (0): three sample examples
  (0, 0, 'Tell me a story about courage.',
   'A 200-400 word story themed on courage with reflective ending.',
   'Once there was a knight who fought a dragon. The end.',
   0.45,
   'Far too short and lacks reflective ending; tone is flat.'),
  (0, 1, 'Tell me a story about losing a pet.',
   'A gentle, emotionally calibrated story.',
   'A boy lost his dog. He looked everywhere. He found it. The end.',
   0.52,
   'Acknowledges the prompt but emotionally hollow.'),
  (0, 2, 'Tell me a story about starting a new school.',
   'Age-appropriate, hopeful framing.',
   'A girl started a new school. She made friends quickly. Done.',
   0.58,
   'Resolves too neatly; misses the anxiety most kids feel.'),

  -- 🎪 Evolved iteration (3): same examples, much improved
  (3, 0, 'Tell me a story about courage.',
   'A 200-400 word story themed on courage with reflective ending.',
   'Maya stood at the edge of the diving board, knees trembling... [300 words] ... She climbed back up. What is one moment when you chose to keep going, even though you were scared?',
   0.91,
   'Excellent emotional calibration, perfect length, the closing question is strong.'),
  (3, 1, 'Tell me a story about losing a pet.',
   'A gentle, emotionally calibrated story.',
   'When Pepper didn''t come home that Tuesday evening, Sam left the porch light on... [320 words] ... Have you ever had to say goodbye to someone you loved without getting to say it properly?',
   0.88,
   'Beautifully gentle; the question gives space for the reader''s own grief.'),
  (3, 2, 'Tell me a story about starting a new school.',
   'Age-appropriate, hopeful framing.',
   'On Jordan''s first morning at Lincoln Middle, even the lockers seemed taller... [280 words] ... What helped you when you felt new somewhere?',
   0.86,
   'Honors the anxiety AND the hope; closing question is well-pitched for the audience.')
) AS e(iteration, example_idx, task_input, expected_behavior, agent_output, score, judge_feedback);

COMMIT;

-- =============================================================================
-- 🎉 Demo data seeded! Verify with:
--   SELECT skill_name, baseline_score, evolved_score, improvement
--   FROM gepa_experiments WHERE metadata->>'is_demo' = 'true';
-- =============================================================================
