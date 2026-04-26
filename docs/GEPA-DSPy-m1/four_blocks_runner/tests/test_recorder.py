"""
🧪 Tests for the RunRecorder — verifying that no datum slips through the cracks.

"Each test is a tiny seance: we summon a recorder, whisper a few candidates,
 finalize the run, and demand the scroll match the prophecy."
"""

import json
import sys
from pathlib import Path

import pytest

# 🎨 Make the package importable when running from the repo root
PKG_PARENT = Path(__file__).resolve().parents[2]  # .../GEPA-DSPy-m1
if str(PKG_PARENT) not in sys.path:
    sys.path.insert(0, str(PKG_PARENT))

from four_blocks_runner.recorder import RunRecorder, DatasetSnapshot, SCHEMA_VERSION  # noqa: E402


# 🌟 Smoke test — happy path: start, record, finalize, flush, inspect
def test_recorder_writes_complete_experiment_json(tmp_path):
    """🧪 Verify a full lifecycle leaves a well-formed experiment.json behind.

    The cosmic intent: prove that schema_version + status + counts + scores
    all show up in the right shape after one orchestrated run. If this test
    cracks, the audit trail leaks data — which would be a tragedy worthy of
    the ages. 🎭
    """
    recorder = RunRecorder(run_id="test-run-001")

    # 🎨 Boot the run with a synthetic dataset snapshot for richer assertions
    snapshot = DatasetSnapshot(
        chunk_count=42,
        train_count=20,
        val_count=10,
        holdout_count=12,
        sample_task_inputs=["q1", "q2", "q3"],
    )
    run_dir = recorder.start(
        skill_name="github-code-review",
        output_root=tmp_path,
        iterations=2,
        dataset_path=str(tmp_path / "fake-dataset"),
        optimizer_model="openai/gpt-4.1",
        eval_model="openai/gpt-4.1-mini",
        judge_model="openai/gpt-4.1",
        use_llm_judge=True,
        system_prompt="You are a careful reviewer.",
        baseline_skill_md="# Baseline skill body\n\nDo the thing.",
        dataset_snapshot=snapshot,
    )

    # 🎪 Stream a few candidates + evaluations
    recorder.record_candidate(
        iteration=0,
        candidate_text="Improved instructions v1",
        score=0.42,
        metadata={"correctness": 0.5, "conciseness": 0.4},
    )
    recorder.record_candidate(
        iteration=1,
        candidate_text="Improved instructions v2",
        score=0.71,
        metadata={"correctness": 0.8, "conciseness": 0.7},
    )
    recorder.record_evaluation(
        iteration=0,
        example_idx=0,
        task_input="What does this PR do?",
        expected="Summarize the diff",
        agent_output="It refactors X.",
        score=0.7,
        judge_feedback="Good but could mention edge cases.",
    )

    # 🎉 Finalize and crystallize
    recorder.finalize(
        status="completed",
        baseline_score=0.40,
        evolved_score=0.71,
        evolved_skill_md="# Evolved skill body\n\nDo the thing better.",
    )
    experiment_path = recorder.flush()

    # 🔮 Verify the scroll
    assert experiment_path.exists(), "experiment.json must exist"
    payload = json.loads(experiment_path.read_text())

    assert payload["schema_version"] == SCHEMA_VERSION
    assert payload["run_id"] == "test-run-001"
    assert payload["status"] == "completed"
    assert payload["skill_name"] == "github-code-review"
    assert payload["iterations"] == 2
    assert payload["models"]["optimizer_model"] == "openai/gpt-4.1"
    assert payload["models"]["eval_model"] == "openai/gpt-4.1-mini"
    assert payload["models"]["judge_model"] == "openai/gpt-4.1"
    assert payload["use_llm_judge"] is True
    assert payload["candidate_count"] == 2
    assert payload["evaluation_count"] == 1
    assert payload["scores"]["baseline_score"] == 0.40
    assert payload["scores"]["evolved_score"] == 0.71
    assert payload["scores"]["improvement"] == pytest.approx(0.31, rel=1e-3)
    assert payload["dataset"]["snapshot"]["chunk_count"] == 42
    assert payload["system_prompt"] == "You are a careful reviewer."
    assert payload["baseline_skill_md"].startswith("# Baseline skill body")
    assert payload["evolved_skill_md"].startswith("# Evolved skill body")
    assert payload["paths"]["run_dir"].endswith(run_dir.name)

    # 🎪 JSONL mirrors should also exist with correct row counts
    candidates_lines = (run_dir / "candidates.jsonl").read_text().strip().splitlines()
    evaluations_lines = (run_dir / "evaluations.jsonl").read_text().strip().splitlines()
    assert len(candidates_lines) == 2
    assert len(evaluations_lines) == 1

    # 🌟 Side-car skill files written
    assert (run_dir / "baseline_skill.md").exists()
    assert (run_dir / "evolved_skill.md").exists()


# 🌩️ Failure path — recorder should still flush even when run is marked failed
def test_recorder_handles_failed_status(tmp_path):
    """🧪 A failed run must still leave behind a flushable scroll with the error."""
    recorder = RunRecorder()
    recorder.start(
        skill_name="arxiv",
        output_root=tmp_path,
        iterations=1,
    )
    recorder.finalize(status="failed", error="boom: something broke")
    path = recorder.flush()
    payload = json.loads(path.read_text())
    assert payload["status"] == "failed"
    assert "boom" in payload["error"]
    assert payload["candidate_count"] == 0
    assert payload["evaluation_count"] == 0


# 🔮 Corpus inference — quick sanity on the path heuristic
def test_corpus_inference_via_dataset_path(tmp_path):
    """🧪 Path heuristic: 'refined-rag-dataset v1' → corpus 'v1'."""
    recorder = RunRecorder()
    fake_path = tmp_path / "refined-rag-dataset v1" / "chunks.jsonl"
    fake_path.parent.mkdir(parents=True)
    fake_path.write_text("{}\n")
    recorder.start(
        skill_name="x",
        output_root=tmp_path / "out",
        dataset_path=str(fake_path),
    )
    assert recorder.dataset_corpus == "v1"
    recorder.finalize(status="completed")
    recorder.flush()
