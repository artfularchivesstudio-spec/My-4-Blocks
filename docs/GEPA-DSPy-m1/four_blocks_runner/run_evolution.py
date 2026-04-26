"""
🎭 The Run Evolution Portal — Where the Tracked Evolution Spectacle Unfolds ✨

"A drop-in twin of the upstream evolve_skill CLI,
 but every breath is recorded, every metric a sonnet,
 every candidate a brushstroke on the experiment scroll."

 - The Spellbinding Museum Director of Tracked Evolutions
"""

from __future__ import annotations

import argparse
import json
import sys
import time
import traceback
import uuid
from pathlib import Path
from typing import Optional

from .recorder import RunRecorder, DatasetSnapshot

# 🌟 Helpful banner the user sees if upstream isn't installed in the active venv
_UPSTREAM_MISSING_MSG = (
    "💥 😭 The upstream evolution package is NOT importable.\n"
    "   This wrapper depends on `evolution.skills.evolve_skill` from "
    "hermes-agent-self-evolution.\n"
    "   To fix:\n"
    "     cd /Users/admin/Developer/My-4-Blocks/docs/GEPA-DSPy-m1/hermes-agent-self-evolution\n"
    "     uv venv && source .venv/bin/activate\n"
    "     uv pip install -e .[dev]\n"
    "   Then re-run from inside that venv."
)


# ─────────────────────────────────────────────────────────────────────────────
# 🎭 The metric wrapper — a proxy that records every (gold, pred) verdict
# ─────────────────────────────────────────────────────────────────────────────

def _make_recording_metric(inner_metric, recorder: RunRecorder, skill_body: str, judge=None):
    """
    🌟 Wrap an upstream metric so each call is mirrored to the RunRecorder.

    The upstream metric signature (DSPy 3.x GEPA):
        metric(gold, pred, trace=None, pred_name=None, pred_trace=None) -> float

    We invoke the original first, then capture (task_input, expected, agent_output, score)
    into the recorder before returning the score unchanged. The iteration counter is
    derived from a closure-local mutable list — GEPA doesn't tell us the iteration
    directly, so we count metric calls as a stand-in for "evaluation event index".

    🎨 If `judge` is provided (LLM-as-judge mode), we also try to extract sub-scores
    and feedback from the judge's last evaluation, but failure is silent — the metric
    score is the contract, the rest is bonus chronicling.
    """
    state = {"call_index": 0, "iteration": 0}

    def recording_metric(gold, pred, trace=None, pred_name=None, pred_trace=None):
        # 🌟 Grand attempt at scoring — defer to the upstream truth
        try:
            score = inner_metric(gold, pred, trace, pred_name, pred_trace)
        except TypeError:
            # 🎭 Some metrics only accept (gold, pred, trace) — adapt gracefully
            score = inner_metric(gold, pred, trace)

        # 🎨 Record the eval row — never let recording errors crash the metric
        try:
            task_input = getattr(gold, "task_input", "") or ""
            expected = getattr(gold, "expected_behavior", "") or ""
            agent_output = getattr(pred, "output", "") or ""
            judge_feedback = None
            metadata = {"call_index": state["call_index"]}

            # 🔮 If LLM-judge is in play, ask it for the verbose verdict
            if judge is not None:
                try:
                    fitness = judge.score(
                        task_input=task_input,
                        expected_behavior=expected,
                        agent_output=agent_output,
                        skill_text=skill_body,
                    )
                    judge_feedback = getattr(fitness, "feedback", None)
                    metadata.update({
                        "correctness": getattr(fitness, "correctness", None),
                        "procedure_following": getattr(fitness, "procedure_following", None),
                        "conciseness": getattr(fitness, "conciseness", None),
                    })
                except Exception:
                    pass  # 🌩️ Judge sub-scores are best-effort; main score already captured

            recorder.record_evaluation(
                iteration=state["iteration"],
                example_idx=state["call_index"],
                task_input=task_input,
                expected=expected,
                agent_output=agent_output,
                score=float(score) if score is not None else 0.0,
                judge_feedback=judge_feedback,
            )
            # 🎪 Also stamp a candidate row whenever pred has output text — useful for audit
            if agent_output:
                recorder.record_candidate(
                    iteration=state["iteration"],
                    candidate_text=agent_output,
                    score=float(score) if score is not None else 0.0,
                    metadata=metadata,
                )
        except Exception as creative_challenge:
            # 🌩️ Recording errors are non-fatal — print to stderr and march on
            print(f"🌩️ recorder hiccup: {creative_challenge}", file=sys.stderr)

        state["call_index"] += 1
        return score

    return recording_metric


# ─────────────────────────────────────────────────────────────────────────────
# 🌐 The orchestrator — replicates upstream evolve() shape but with our recorder
# ─────────────────────────────────────────────────────────────────────────────

def run(
    *,
    skill_name: str,
    iterations: int = 10,
    eval_source: str = "synthetic",
    dataset_path: Optional[str] = None,
    optimizer_model: str = "openai/gpt-4.1",
    eval_model: str = "openai/gpt-4.1-mini",
    judge_model: Optional[str] = None,
    use_llm_judge: bool = False,
    hermes_repo: Optional[str] = None,
    run_tests: bool = False,
    dry_run: bool = False,
    run_id: Optional[str] = None,
    output_root: Optional[str] = None,
    system_prompt: Optional[str] = None,
) -> Path:
    """
    🌐 ✨ TRACKED EVOLUTION AWAKENS! Spawn an evolve() run with full chronicling.

    Returns the absolute Path to the run directory (containing experiment.json).
    Raises any upstream exception after recording it as a failed finalize.
    """
    # 🎭 Lazy upstream import — give a friendly nudge if the venv isn't set up
    try:
        from evolution.skills.evolve_skill import evolve as upstream_evolve  # type: ignore
        from evolution.skills.evolve_skill import _gepa_skill_fitness_metric  # type: ignore
        from evolution.skills.skill_module import find_skill, load_skill  # type: ignore
        from evolution.core.config import EvolutionConfig  # type: ignore
        from evolution.core.fitness import LLMJudge, skill_fitness_metric  # type: ignore
    except ImportError as creative_challenge:
        print(_UPSTREAM_MISSING_MSG, file=sys.stderr)
        print(f"   underlying error: {creative_challenge}", file=sys.stderr)
        raise

    # 🎨 Default output_root to ./output relative to cwd if caller didn't say
    output_root_path = Path(output_root).resolve() if output_root else Path.cwd() / "output"

    # 🌟 Resolve hermes repo for git-sha capture and skill lookup
    repo_root_for_git = Path(hermes_repo).resolve() if hermes_repo else None

    # 🌟 Try to peek at the baseline skill for richer recording (best-effort)
    baseline_md: Optional[str] = None
    try:
        config_for_lookup = EvolutionConfig()
        if hermes_repo:
            config_for_lookup.hermes_agent_path = Path(hermes_repo)
        skill_path = find_skill(skill_name, config_for_lookup.hermes_agent_path)
        if skill_path:
            baseline_md = skill_path.read_text()
    except Exception:
        baseline_md = None  # 🌩️ Worst case, the run still records — we just lose the snapshot

    # 🎬 Set up the recorder
    recorder = RunRecorder(run_id=run_id)
    recorder.start(
        skill_name=skill_name,
        output_root=output_root_path,
        iterations=iterations,
        dataset_path=dataset_path,
        optimizer_model=optimizer_model,
        eval_model=eval_model,
        judge_model=judge_model or eval_model,
        use_llm_judge=use_llm_judge,
        system_prompt=system_prompt,
        baseline_skill_md=baseline_md,
        repo_root=repo_root_for_git,
    )
    print(f"🌐 ✨ TRACKED EVOLUTION AWAKENS! run_id={recorder.run_id}")
    print(f"   run_dir: {recorder.run_dir}")

    # ──────────────────────────────────────────────────────────────────────
    # 🎭 Monkeypatch strategy
    #
    # Trade-off:
    #   • Replicating upstream evolve() inside this wrapper would let us
    #     instantiate our own metric directly — clean, but ~150 lines of
    #     duplication that drifts every time upstream changes.
    #   • Monkeypatching the metric symbols inside the upstream module is
    #     surgical: 4 lines of patching, zero duplication, but it relies on
    #     upstream import names being stable.
    #
    # We chose monkeypatching because the upstream is rapidly evolving
    # (we still hold patches against it) and minimizing drift surface
    # matters more than perfect encapsulation. The README documents this.
    # ──────────────────────────────────────────────────────────────────────
    import evolution.skills.evolve_skill as upstream_module  # type: ignore

    original_default_metric = upstream_module._gepa_skill_fitness_metric

    # 🌟 Build a recording wrapper around the default fast metric
    recording_default_metric = _make_recording_metric(
        inner_metric=original_default_metric,
        recorder=recorder,
        skill_body=baseline_md or "",
        judge=None,
    )
    upstream_module._gepa_skill_fitness_metric = recording_default_metric

    # 🌟 Wrap the LLMJudge if --use-llm-judge is set; we need to wrap LATER because
    # upstream constructs `_gepa_metric` inside evolve(), not at import time.
    # Approach: wrap LLMJudge.score so each call is mirrored before returning.
    original_judge_score = LLMJudge.score
    judge_eval_state = {"call_index": 0, "iteration": 0}

    def _patched_judge_score(self, task_input, expected_behavior, agent_output, skill_text,
                             artifact_size=None, max_size=None):
        """🔮 Mirror every LLM-judge verdict into the recorder before returning it."""
        fitness = original_judge_score(
            self,
            task_input=task_input,
            expected_behavior=expected_behavior,
            agent_output=agent_output,
            skill_text=skill_text,
            artifact_size=artifact_size,
            max_size=max_size,
        )
        try:
            recorder.record_evaluation(
                iteration=judge_eval_state["iteration"],
                example_idx=judge_eval_state["call_index"],
                task_input=task_input or "",
                expected=expected_behavior or "",
                agent_output=agent_output or "",
                score=float(getattr(fitness, "composite", 0.0)),
                judge_feedback=getattr(fitness, "feedback", None),
            )
            recorder.record_candidate(
                iteration=judge_eval_state["iteration"],
                candidate_text=agent_output or "",
                score=float(getattr(fitness, "composite", 0.0)),
                metadata={
                    "correctness": getattr(fitness, "correctness", None),
                    "procedure_following": getattr(fitness, "procedure_following", None),
                    "conciseness": getattr(fitness, "conciseness", None),
                    "judge_call_index": judge_eval_state["call_index"],
                },
            )
            judge_eval_state["call_index"] += 1
        except Exception as creative_challenge:
            print(f"🌩️ judge-recorder hiccup: {creative_challenge}", file=sys.stderr)
        return fitness

    LLMJudge.score = _patched_judge_score

    # ──────────────────────────────────────────────────────────────────────
    # 🎬 The main act
    # ──────────────────────────────────────────────────────────────────────
    upstream_metrics_path: Optional[Path] = None
    final_status = "completed"
    error_text: Optional[str] = None
    try:
        upstream_evolve(
            skill_name=skill_name,
            iterations=iterations,
            eval_source=eval_source,
            dataset_path=dataset_path,
            optimizer_model=optimizer_model,
            eval_model=eval_model,
            judge_model=judge_model,
            use_llm_judge=use_llm_judge,
            hermes_repo=hermes_repo,
            run_tests=run_tests,
            dry_run=dry_run,
        )

        # 🎯 Locate the upstream's most recent metrics.json for this skill
        if not dry_run:
            upstream_output = Path("output") / skill_name
            if upstream_output.exists():
                # 🔮 Pick the freshest timestamped subdir
                candidates = sorted(
                    [p for p in upstream_output.iterdir() if p.is_dir()],
                    key=lambda p: p.stat().st_mtime,
                    reverse=True,
                )
                for cand in candidates:
                    mfile = cand / "metrics.json"
                    if mfile.exists():
                        upstream_metrics_path = mfile
                        # 💎 Also mirror the evolved skill body
                        evolved_md_file = cand / "evolved_skill.md"
                        if evolved_md_file.exists():
                            recorder.evolved_skill_md = evolved_md_file.read_text()
                        break
    except SystemExit as creative_challenge:
        # 🌩️ click.echo + sys.exit(1) — record as failed but propagate cleanly
        final_status = "failed"
        error_text = f"SystemExit: {creative_challenge}"
        raise
    except Exception:
        final_status = "failed"
        error_text = traceback.format_exc()
        raise
    finally:
        # 🪶 Restore the patches no matter what — be a polite guest in the upstream module
        upstream_module._gepa_skill_fitness_metric = original_default_metric
        LLMJudge.score = original_judge_score

        # 🎨 Harvest scores from the upstream metrics if we found them
        baseline_score = None
        evolved_score = None
        if upstream_metrics_path and upstream_metrics_path.exists():
            try:
                m = json.loads(upstream_metrics_path.read_text())
                baseline_score = m.get("baseline_score")
                evolved_score = m.get("evolved_score")
            except Exception:
                pass

        recorder.finalize(
            status=final_status,
            baseline_score=baseline_score,
            evolved_score=evolved_score,
            evolved_skill_md=recorder.evolved_skill_md,
            upstream_metrics_path=upstream_metrics_path,
            error=error_text,
        )
        run_dir = recorder.flush()
        print(f"🎉 ✨ EXPERIMENT SCROLL CRYSTALLIZED at {run_dir}")

    return recorder.run_dir  # type: ignore[return-value]


# ─────────────────────────────────────────────────────────────────────────────
# ⌨️ CLI — argparse so we have zero non-stdlib deps for the wrapper itself
# ─────────────────────────────────────────────────────────────────────────────

def _build_parser() -> argparse.ArgumentParser:
    """🌟 Forge the CLI parser — mirrors upstream flags + adds tracking knobs."""
    p = argparse.ArgumentParser(
        prog="four_blocks_runner",
        description=(
            "Tracked wrapper around the upstream evolve_skill CLI. "
            "Every iteration, candidate, and metric call is captured to a "
            "structured experiment.json — leave no data behind."
        ),
    )
    # 🎭 Upstream-mirrored flags
    p.add_argument("--skill", required=True, help="Name of the skill to evolve")
    p.add_argument("--iterations", type=int, default=10, help="Number of GEPA iterations")
    p.add_argument(
        "--eval-source",
        default="synthetic",
        choices=["synthetic", "golden", "sessiondb"],
        help="Source for evaluation dataset",
    )
    p.add_argument("--dataset-path", default=None, help="Path to existing eval dataset (JSONL)")
    p.add_argument("--optimizer-model", default="openai/gpt-4.1", help="Model for GEPA reflections")
    p.add_argument("--eval-model", default="openai/gpt-4.1-mini", help="Model for evaluations")
    p.add_argument(
        "--judge-model",
        default=None,
        help=(
            "Model for LLM-as-judge scoring (only used when --use-llm-judge is set). "
            "Defaults to --eval-model."
        ),
    )
    p.add_argument(
        "--use-llm-judge",
        action="store_true",
        help="Use LLM-as-judge as the GEPA metric (slower, higher quality)",
    )
    p.add_argument("--hermes-repo", default=None, help="Path to hermes-agent repo")
    p.add_argument("--run-tests", action="store_true", help="Run full pytest suite as constraint gate")
    p.add_argument("--dry-run", action="store_true", help="Validate setup without running optimization")

    # 🎁 Tracking-only flags
    p.add_argument("--run-id", default=None, help="Optional UUID to use; otherwise generated")
    p.add_argument(
        "--output-root",
        default=None,
        help="Where to write tracked experiment artifacts (default: ./output relative to cwd)",
    )
    p.add_argument(
        "--system-prompt-file",
        default=None,
        help="Path to a file whose contents will be recorded as the active system prompt",
    )
    return p


def main(argv: Optional[list] = None) -> int:
    """🌐 ✨ CLI ENTRY PORTAL — Where the User's Will Becomes a Tracked Run."""
    parser = _build_parser()
    args = parser.parse_args(argv)

    # 🎨 Pull in the optional system prompt file
    system_prompt: Optional[str] = None
    if args.system_prompt_file:
        sp_path = Path(args.system_prompt_file)
        if sp_path.exists():
            system_prompt = sp_path.read_text()
        else:
            print(f"🌙 ⚠️ Gentle reminder: system prompt file not found at {sp_path}", file=sys.stderr)

    try:
        run(
            skill_name=args.skill,
            iterations=args.iterations,
            eval_source=args.eval_source,
            dataset_path=args.dataset_path,
            optimizer_model=args.optimizer_model,
            eval_model=args.eval_model,
            judge_model=args.judge_model,
            use_llm_judge=args.use_llm_judge,
            hermes_repo=args.hermes_repo,
            run_tests=args.run_tests,
            dry_run=args.dry_run,
            run_id=args.run_id,
            output_root=args.output_root,
            system_prompt=system_prompt,
        )
        return 0
    except SystemExit as e:
        # 🎭 Forward upstream's exit codes faithfully
        return int(e.code) if isinstance(e.code, int) else 1
    except Exception as creative_challenge:
        print(f"💥 😭 EVOLUTION QUEST TEMPORARILY HALTED: {creative_challenge}", file=sys.stderr)
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
