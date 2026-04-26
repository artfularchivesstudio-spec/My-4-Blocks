"""
🎭 The RunRecorder — The Cosmic Chronicler of Evolution Runs ✨

"Every candidate prompt, every metric verdict, every iteration's whisper —
 the Recorder catches them all in its crystalline ledger,
 leaving no datum behind, leaving no insight unsung."

 - The Spellbinding Museum Director of GEPA Evolution Audits
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import time
import traceback
import uuid
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

# 🌟 Schema versioning — when the cosmos shifts, future migrators know which scrolls to update
SCHEMA_VERSION = "1"


# ─────────────────────────────────────────────────────────────────────────────
# 🔮 Helper alchemists — small, pure, and well-behaved
# ─────────────────────────────────────────────────────────────────────────────

def _utcnow_iso() -> str:
    """🌟 Stamp the moment in ISO 8601 UTC — the universal language of timekeepers."""
    return datetime.now(timezone.utc).isoformat()


def _safe_version(pkg: str) -> Optional[str]:
    """🔮 Peer into a package's metadata — return None if the muse is silent."""
    try:
        from importlib.metadata import version, PackageNotFoundError  # 🪶 stdlib since 3.8
        try:
            return version(pkg)
        except PackageNotFoundError:
            return None
    except Exception:
        return None


def _safe_git_sha(repo_root: Optional[Path] = None) -> Optional[str]:
    """🌟 Whisper to git for the current SHA — silently shrug if it's not a repo."""
    try:
        cwd = str(repo_root) if repo_root else None
        result = subprocess.run(
            ["git", "rev-parse", "HEAD"],
            capture_output=True,
            text=True,
            timeout=5,
            cwd=cwd,
        )
        if result.returncode == 0:
            return result.stdout.strip()
        return None
    except Exception:
        return None


def _infer_corpus(dataset_path: Optional[str]) -> str:
    """🎨 Squint at a path and divine which corpus it sprang from.

    Recognized lineages:
      • 'legacy'        → datasets/skills/<name>/
      • 'v1'            → refined-rag-dataset v1/
      • 'gepa-datasets' → datasets/gepa/...
      • 'unknown'       → the mystery box
    """
    if not dataset_path:
        return "unknown"
    p = str(dataset_path)
    if "refined-rag-dataset v1" in p or "refined-rag-dataset-v1" in p:
        return "v1"
    if "/datasets/gepa" in p or "gepa-datasets" in p:
        return "gepa-datasets"
    if "/datasets/skills" in p or p.endswith("skills"):
        return "legacy"
    return "unknown"


# ─────────────────────────────────────────────────────────────────────────────
# 📜 Dataclasses — the typed verses of our cosmic ledger
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class CandidateRecord:
    """🌟 One whispered candidate prompt and the score it earned."""
    iteration: int
    candidate_text: str
    score: float
    timestamp: str
    metadata: dict = field(default_factory=dict)


@dataclass
class EvaluationRecord:
    """🌟 One holdout example, its expected verse, and the agent's reply."""
    iteration: int
    example_idx: int
    task_input: str
    expected: str
    agent_output: str
    score: float
    judge_feedback: Optional[str]
    timestamp: str


@dataclass
class DatasetSnapshot:
    """💎 A crystallized peek at the dataset that fed this run."""
    chunk_count: int = 0
    train_count: int = 0
    val_count: int = 0
    holdout_count: int = 0
    sample_task_inputs: list = field(default_factory=list)


# ─────────────────────────────────────────────────────────────────────────────
# 🎭 The RunRecorder itself — chronicler-in-chief
# ─────────────────────────────────────────────────────────────────────────────

class RunRecorder:
    """
    🎭 The Cosmic Chronicler — captures every byte of an evolution run.

    Lifecycle:
        recorder = RunRecorder()
        recorder.start(skill_name=..., output_root=..., ...)
        recorder.record_candidate(iteration=0, candidate_text=..., score=...)
        recorder.record_evaluation(iteration=0, example_idx=0, ...)
        recorder.finalize(status='completed', baseline_score=..., evolved_score=...)
        recorder.flush()  # writes experiment.json + jsonl mirrors
    """

    def __init__(self, run_id: Optional[str] = None) -> None:
        # 🌟 Identity — every run wears its own UUID like a sigil
        self.run_id: str = run_id or str(uuid.uuid4())

        # 🌟 Lifecycle markers
        self.started_at: Optional[str] = None
        self.completed_at: Optional[str] = None
        self._start_monotonic: Optional[float] = None
        self.status: str = "pending"

        # 🌟 Run-level metadata (set during start())
        self.skill_name: str = ""
        self.dataset_path: Optional[str] = None
        self.dataset_corpus: str = "unknown"
        self.optimizer_model: Optional[str] = None
        self.eval_model: Optional[str] = None
        self.judge_model: Optional[str] = None
        self.use_llm_judge: bool = False
        self.iterations: int = 0
        self.system_prompt: Optional[str] = None
        self.python_version: str = ""
        self.dspy_version: Optional[str] = None
        self.gepa_version: Optional[str] = None
        self.git_sha: Optional[str] = None
        self.baseline_skill_md: Optional[str] = None
        self.dataset_snapshot: DatasetSnapshot = DatasetSnapshot()

        # 🌟 Outcome (set during finalize())
        self.baseline_score: Optional[float] = None
        self.evolved_score: Optional[float] = None
        self.improvement: Optional[float] = None
        self.evolved_skill_md: Optional[str] = None
        self.elapsed_seconds: Optional[float] = None
        self.error: Optional[str] = None
        self.upstream_metrics: Optional[dict] = None  # 💎 mirrored from upstream metrics.json
        self.extra: dict = {}  # 🪶 any extra blob the caller wants to stash

        # 🌟 Streaming records
        self.candidates: list[CandidateRecord] = []
        self.evaluations: list[EvaluationRecord] = []

        # 🌟 Output paths (set during start())
        self.output_root: Optional[Path] = None
        self.run_dir: Optional[Path] = None

    # ──────────────────────────────────────────────────────────────────────
    # 🌐 Lifecycle: start / record / finalize / flush
    # ──────────────────────────────────────────────────────────────────────

    def start(
        self,
        skill_name: str,
        output_root: Path | str,
        *,
        iterations: int = 0,
        dataset_path: Optional[str] = None,
        optimizer_model: Optional[str] = None,
        eval_model: Optional[str] = None,
        judge_model: Optional[str] = None,
        use_llm_judge: bool = False,
        system_prompt: Optional[str] = None,
        baseline_skill_md: Optional[str] = None,
        dataset_snapshot: Optional[DatasetSnapshot] = None,
        repo_root: Optional[Path | str] = None,
    ) -> Path:
        """
        🌐 ✨ RECORDING AWAKENS! Stamp run start, gather lineage, prepare the run dir.

        Returns the absolute Path to the run directory (also stored on self.run_dir).
        """
        # 🎨 Capture wall-clock + monotonic times — one for humans, one for math
        self.started_at = _utcnow_iso()
        self._start_monotonic = time.monotonic()
        self.status = "running"

        # 🎨 Stash run metadata
        self.skill_name = skill_name
        self.iterations = iterations
        self.dataset_path = str(Path(dataset_path).resolve()) if dataset_path else None
        self.dataset_corpus = _infer_corpus(self.dataset_path)
        self.optimizer_model = optimizer_model
        self.eval_model = eval_model
        self.judge_model = judge_model
        self.use_llm_judge = use_llm_judge
        self.system_prompt = system_prompt
        self.baseline_skill_md = baseline_skill_md
        if dataset_snapshot:
            self.dataset_snapshot = dataset_snapshot

        # 🎨 Environment lineage — never let future-you wonder which dspy ate today's tokens
        self.python_version = sys.version.split()[0]
        self.dspy_version = _safe_version("dspy") or _safe_version("dspy-ai")
        self.gepa_version = _safe_version("gepa")
        self.git_sha = _safe_git_sha(Path(repo_root) if repo_root else None)

        # 🎨 Materialize the run directory: <output_root>/<skill>/<ts>__<run_id>/
        ts = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        self.output_root = Path(output_root).resolve()
        self.run_dir = self.output_root / skill_name / f"{ts}__{self.run_id}"
        self.run_dir.mkdir(parents=True, exist_ok=True)

        # 🎪 Drop a quick "hello, world" stub so a watcher knows the run exists
        (self.run_dir / "RECORDER_STARTED.txt").write_text(
            f"{self.started_at} | {self.skill_name} | {self.run_id}\n"
        )
        return self.run_dir

    def record_candidate(
        self,
        iteration: int,
        candidate_text: str,
        score: float,
        metadata: Optional[dict] = None,
    ) -> None:
        """🌟 Append one candidate-and-score whisper to the streaming ledger."""
        self.candidates.append(
            CandidateRecord(
                iteration=iteration,
                candidate_text=candidate_text or "",
                score=float(score) if score is not None else 0.0,
                timestamp=_utcnow_iso(),
                metadata=metadata or {},
            )
        )

    def record_evaluation(
        self,
        iteration: int,
        example_idx: int,
        task_input: str,
        expected: str,
        agent_output: str,
        score: float,
        judge_feedback: Optional[str] = None,
    ) -> None:
        """🌟 Append one example-level evaluation row to the streaming ledger."""
        self.evaluations.append(
            EvaluationRecord(
                iteration=iteration,
                example_idx=example_idx,
                task_input=task_input or "",
                expected=expected or "",
                agent_output=agent_output or "",
                score=float(score) if score is not None else 0.0,
                judge_feedback=judge_feedback,
                timestamp=_utcnow_iso(),
            )
        )

    def finalize(
        self,
        *,
        status: str = "completed",
        baseline_score: Optional[float] = None,
        evolved_score: Optional[float] = None,
        evolved_skill_md: Optional[str] = None,
        upstream_metrics_path: Optional[Path | str] = None,
        error: Optional[str] = None,
        extra: Optional[dict] = None,
    ) -> None:
        """
        🎉 ✨ RECORDING CRESCENDOS! Stamp completion + harvest final scores.

        Pass a status of 'completed', 'failed', or 'partial' depending on the dénouement.
        If `upstream_metrics_path` points at the upstream's metrics.json, we mirror it.
        """
        self.completed_at = _utcnow_iso()
        if self._start_monotonic is not None:
            self.elapsed_seconds = round(time.monotonic() - self._start_monotonic, 3)
        self.status = status
        self.baseline_score = baseline_score
        self.evolved_score = evolved_score
        if baseline_score is not None and evolved_score is not None:
            self.improvement = round(evolved_score - baseline_score, 6)
        self.evolved_skill_md = evolved_skill_md
        self.error = error
        if extra:
            self.extra.update(extra)

        # 💎 Mirror the upstream's metrics.json into our run dir if findable
        if upstream_metrics_path:
            try:
                src = Path(upstream_metrics_path)
                if src.exists() and self.run_dir:
                    dst = self.run_dir / "metrics.json"
                    shutil.copy2(src, dst)
                    self.upstream_metrics = json.loads(src.read_text())
            except Exception as creative_challenge:
                # 🌩️ Mirroring is best-effort — never let it kill the recorder
                self.extra["upstream_mirror_error"] = str(creative_challenge)

    def flush(self) -> Path:
        """
        💎 Crystallize all wisdom to disk: experiment.json + candidates.jsonl + evaluations.jsonl.

        Also writes baseline_skill.md and evolved_skill.md if their bodies are present.
        Returns the absolute path to experiment.json.
        """
        if self.run_dir is None:
            raise RuntimeError(
                "🌩️ Recorder.flush() called before start() — there's no run dir to write to."
            )

        # 🎨 Write the side-car skill files (these mirror upstream conventions)
        if self.baseline_skill_md is not None:
            (self.run_dir / "baseline_skill.md").write_text(self.baseline_skill_md)
        if self.evolved_skill_md is not None:
            (self.run_dir / "evolved_skill.md").write_text(self.evolved_skill_md)

        # 🎪 Write streaming JSONL mirrors — one row per line, friendly to `jq` and tail -f
        candidates_path = self.run_dir / "candidates.jsonl"
        with candidates_path.open("w") as f:
            for c in self.candidates:
                f.write(json.dumps(asdict(c), ensure_ascii=False) + "\n")

        evaluations_path = self.run_dir / "evaluations.jsonl"
        with evaluations_path.open("w") as f:
            for e in self.evaluations:
                f.write(json.dumps(asdict(e), ensure_ascii=False) + "\n")

        # 💎 The grand experiment.json — the comprehensive scroll
        experiment_path = self.run_dir / "experiment.json"
        experiment_path.write_text(json.dumps(self.to_dict(), indent=2, ensure_ascii=False))
        return experiment_path

    # ──────────────────────────────────────────────────────────────────────
    # 🔮 Serialization
    # ──────────────────────────────────────────────────────────────────────

    def to_dict(self) -> dict:
        """🔮 Translate the entire run into a JSON-safe dict — schema-versioned."""
        run_dir_str = str(self.run_dir.resolve()) if self.run_dir else None
        output_root_str = str(self.output_root.resolve()) if self.output_root else None

        return {
            "schema_version": SCHEMA_VERSION,
            "run_id": self.run_id,
            "status": self.status,
            "started_at": self.started_at,
            "completed_at": self.completed_at,
            "elapsed_seconds": self.elapsed_seconds,
            "skill_name": self.skill_name,
            "iterations": self.iterations,
            "use_llm_judge": self.use_llm_judge,
            "models": {
                "optimizer_model": self.optimizer_model,
                "eval_model": self.eval_model,
                "judge_model": self.judge_model,
            },
            "dataset": {
                "path": self.dataset_path,
                "corpus": self.dataset_corpus,
                "snapshot": asdict(self.dataset_snapshot),
            },
            "system_prompt": self.system_prompt,
            "environment": {
                "python_version": self.python_version,
                "dspy_version": self.dspy_version,
                "gepa_version": self.gepa_version,
                "git_sha": self.git_sha,
                "platform": sys.platform,
            },
            "baseline_skill_md": self.baseline_skill_md,
            "evolved_skill_md": self.evolved_skill_md,
            "scores": {
                "baseline_score": self.baseline_score,
                "evolved_score": self.evolved_score,
                "improvement": self.improvement,
            },
            "upstream_metrics": self.upstream_metrics,
            "candidates": [asdict(c) for c in self.candidates],
            "evaluations": [asdict(e) for e in self.evaluations],
            "candidate_count": len(self.candidates),
            "evaluation_count": len(self.evaluations),
            "error": self.error,
            "extra": self.extra,
            "paths": {
                "output_root": output_root_str,
                "run_dir": run_dir_str,
            },
        }
