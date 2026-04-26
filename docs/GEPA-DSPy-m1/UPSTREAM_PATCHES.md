# UPSTREAM_PATCHES — `hermes-agent-self-evolution`

**Last updated:** 2026-04-26
**Scope:** Local edits applied to the vendored upstream clone at
`docs/GEPA-DSPy-m1/hermes-agent-self-evolution/`.

## Why this file exists

The upstream clone at `docs/GEPA-DSPy-m1/hermes-agent-self-evolution/` is
**gitignored** by `.gitignore:44`:

```
docs/GEPA-DSPy-m1/hermes-agent-self-evolution/
```

The exclusion was intentional from commit `f7847fa` so the upstream package
behaves like a vendored dependency rather than a tracked subtree. The
consequence: any local edits we make to that tree do **not** ship via
`git pull`. Anyone setting up a fresh dev machine clones the upstream and
ends up without our patches.

This document is the source of truth for those patches. It records:

1. **Why** each patch exists (semantic justification),
2. **What** the changes are (file-by-file diff-grade detail),
3. **How** to re-apply them after a fresh clone or upstream pull.

A companion file `UPSTREAM_PATCHES.diff` contains the same edits as a
unified-diff that can be fed to `git apply`. It is hand-crafted (the
upstream tree is gitignored, so no upstream baseline is checked in to
diff against).

### TL;DR

After cloning `hermes-agent-self-evolution` upstream, apply these patches
**before** running the `four_blocks_runner` wrapper. Either run
`scripts/apply-upstream-patches.sh` (when present), or apply the changes
in Section 3 by hand.

---

## Section 1 — Why these patches exist

### Patch A — `--judge-model` and `--use-llm-judge` CLI flags

The upstream `evolve_skill.py` CLI exposed only `--optimizer-model` and
`--eval-model`. We added a third lever, `--judge-model`, plus a feature
toggle `--use-llm-judge` that swaps the GEPA metric from the fast
keyword-overlap heuristic to a deeper LLM-as-judge metric.

These flags are surfaced in the website `/admin` ConfigTab so the
LLM-as-judge model is configurable independently of the eval model.

### Patch B — `LLMJudge.score()` uses `config.judge_model`, not `config.eval_model`

The upstream `LLMJudge.score()` constructed its `dspy.LM` from
`config.eval_model`. That is wrong semantically:

- The **eval model** runs the agent during evaluation — it is the actor.
- The **judge model** scores the agent's output — it is the impartial critic.

Conflating them means changing the eval model also (silently) changes the
judge model. Patch B routes the judge through `config.judge_model` so the
two roles are independent.

A clarifying docstring was added to `score()` documenting the distinction.

---

## Section 2 — How to apply

### Option A — Apply the bundled diff (preferred on the dev machine)

```bash
cd /Users/admin/Developer/My-4-Blocks/docs/GEPA-DSPy-m1
git apply UPSTREAM_PATCHES.diff
```

A helper script `scripts/apply-upstream-patches.sh` automates this when
present. The diff is hand-crafted — line numbers in hunk headers reference
the **post-patch** file as the authoritative target, with `-` lines
showing what the upstream original is expected to contain.

If `git apply` fails because the upstream has drifted, fall back to
Option B.

### Option B — Apply manually (robust against upstream drift)

The changes are small and self-contained. Read Section 3 below and edit
the two files by hand.

---

## Section 3 — The exact changes

Two files are touched:

1. `evolution/skills/evolve_skill.py` — five regions modified.
2. `evolution/core/fitness.py` — two regions modified.

All paths are **relative to the upstream root** at
`docs/GEPA-DSPy-m1/hermes-agent-self-evolution/`.

### 3.1 `evolution/skills/evolve_skill.py`

#### Change 1 — Module docstring (header) advertises the new flags

`evolve_skill.py:1-13` — the docstring now documents the three-model
trinity and the `--use-llm-judge` toggle.

```python
"""Evolve a Hermes Agent skill using DSPy + GEPA.

Usage:
    python -m evolution.skills.evolve_skill --skill github-code-review --iterations 10
    python -m evolution.skills.evolve_skill --skill arxiv --eval-source golden --dataset datasets/skills/arxiv/
    python -m evolution.skills.evolve_skill --skill arxiv --use-llm-judge --judge-model openai/gpt-4o

CLI flags (the trinity of models):
    --optimizer-model   Model for GEPA reflective mutations (the architect)
    --eval-model        Model that runs the agent during evaluation (the actor)
    --judge-model       Model that scores agent output via LLM-as-judge (the critic)
    --use-llm-judge     Switch GEPA's metric from keyword-overlap to LLM-as-judge
"""
```

#### Change 2 — `evolve()` signature gains `judge_model` and `use_llm_judge`

`evolve_skill.py:51-83` — the function signature, the resolution of the
judge model with backward-compatible fallback, and the
`EvolutionConfig` construction.

```python
def evolve(
    skill_name: str,
    iterations: int = 10,
    eval_source: str = "synthetic",
    dataset_path: Optional[str] = None,
    optimizer_model: str = "openai/gpt-4.1",
    eval_model: str = "openai/gpt-4.1-mini",
    judge_model: Optional[str] = None,                   # ADDED
    use_llm_judge: bool = False,                         # ADDED
    hermes_repo: Optional[str] = None,
    run_tests: bool = False,
    dry_run: bool = False,
):
    """Main evolution function — orchestrates the full optimization loop.

    The Three-Model Trinity:
      - optimizer_model -> GEPA's reflective architect (rewrites prompts)
      - eval_model      -> the agent's voice during evaluation runs
      - judge_model     -> LLM-as-judge's impartial gavel (falls back to eval_model)
    """

    # Resolve judge model with backward-compatible fallback to eval_model
    resolved_judge_model = judge_model or eval_model     # ADDED

    config = EvolutionConfig(
        iterations=iterations,
        optimizer_model=optimizer_model,
        eval_model=eval_model,
        judge_model=resolved_judge_model,                # ADDED
        run_pytest=run_tests,
    )
```

#### Change 3 — Console block prints the model trinity early

`evolve_skill.py:88-92` — surfaces the three models in the run log
immediately after the banner, before any work happens, so logs show the
cast list.

```python
console.print(f"  Optimizer model: [bold]{optimizer_model}[/bold]")
console.print(f"  Eval model:      [bold]{eval_model}[/bold]")
console.print(f"  Judge model:     [bold]{resolved_judge_model}[/bold]" + ("" if judge_model else " [dim](defaulted from --eval-model)[/dim]"))
console.print(f"  Use LLM judge:   [bold]{use_llm_judge}[/bold]")
```

#### Change 4 — Metric-selection conditional before `dspy.GEPA(...)`

`evolve_skill.py:184-204` — replaces the unconditional
`metric_fn = _gepa_skill_fitness_metric` line with a branch that picks
between keyword-overlap (default) and LLM-as-judge.

```python
# Choose the GEPA metric: keyword-overlap (fast) or LLM-as-judge (deep)
# The user toggles this with --use-llm-judge; default stays fast for backward compat
if use_llm_judge:
    judge = LLMJudge(config)

    def _gepa_metric(gold, pred, trace=None, pred_name=None, pred_trace=None):
        # The mystical critic — uses LLMJudge against config.judge_model
        # GEPA passes 5 args; we surface only what the judge needs to render verdict
        score = judge.score(
            task_input=getattr(gold, "task_input", "") or "",
            expected_behavior=getattr(gold, "expected_behavior", "") or "",
            agent_output=getattr(pred, "output", "") or "",
            skill_text=skill["body"],
        )
        return score.composite

    metric_fn = _gepa_metric
    console.print(f"  Metric: [bold magenta]LLM-as-judge[/bold magenta] ({config.judge_model})")
else:
    metric_fn = _gepa_skill_fitness_metric
    console.print(f"  Metric: [bold]keyword-overlap[/bold] (fast)")
```

The downstream `optimizer = dspy.GEPA(metric=metric_fn, ...)` then uses
whichever was selected.

Also, the optimizer-config console block at `evolve_skill.py:167-171`
gained one line:

```python
console.print(f"  Judge model: {config.judge_model}")
```

#### Change 5 — `metrics.json` records `judge_model` and `use_llm_judge`

`evolve_skill.py:325-343` — the metrics dict written to disk now logs
the judge model and the toggle alongside the other model selections.

```python
metrics = {
    "skill_name": skill_name,
    "timestamp": timestamp,
    "iterations": iterations,
    "optimizer_model": optimizer_model,
    "eval_model": eval_model,
    "judge_model": config.judge_model,    # ADDED
    "use_llm_judge": use_llm_judge,       # ADDED
    "baseline_score": avg_baseline,
    ...
}
```

#### Change 6 — Click decorators and `main()` wire the new flags

`evolve_skill.py:356-383` — two new `@click.option` decorators and two
new params plumbed through `main()` into `evolve()`.

```python
@click.option("--judge-model", default=None, help="Model for LLM-as-judge scoring (only used when --use-llm-judge is set). Defaults to --eval-model.")
@click.option("--use-llm-judge", is_flag=True, default=False, help="Use LLM-as-judge as the GEPA metric (slower, higher quality) instead of the default keyword-overlap metric")
...
def main(skill, iterations, eval_source, dataset_path, optimizer_model, eval_model, judge_model, use_llm_judge, hermes_repo, run_tests, dry_run):
    """Evolve a Hermes Agent skill using DSPy + GEPA optimization."""
    evolve(
        skill_name=skill,
        ...
        judge_model=judge_model,           # ADDED
        use_llm_judge=use_llm_judge,       # ADDED
        ...
    )
```

### 3.2 `evolution/core/fitness.py`

#### Change 1 — `LLMJudge.score()` uses the judge model

`fitness.py:75-81` — the line constructing the LM was changed.

```python
# UPSTREAM (wrong):
# lm = dspy.LM(self.config.eval_model)

# PATCHED (correct):
lm = dspy.LM(self.config.judge_model)
```

The judge is the impartial scorer; it must run on `judge_model`. The
`eval_model` is for running the agent itself elsewhere in the pipeline.

#### Change 2 — Clarifying docstring on `score()`

`fitness.py:73-78` — added text explaining the eval-vs-judge distinction
that motivated Patch B.

```python
"""Score an agent output using LLM-as-judge.

The judge wears its own robes — uses config.judge_model (NOT eval_model!).
The eval model runs the agent; the judge model evaluates the agent. Different roles,
different models. Mixing them up is the bug we're fixing here.
"""
```

> Note: `EvolutionConfig.judge_model` already exists as a class attribute
> in `evolution/core/config.py` (default `"openai/gpt-4.1"`). The patches
> above only change *who reads it* and *how it is wired through the CLI*.
> No `config.py` change is required.

---

## Section 4 — Verification after applying

```bash
cd /Users/admin/Developer/My-4-Blocks/docs/GEPA-DSPy-m1/hermes-agent-self-evolution
source .venv/bin/activate
python -m evolution.skills.evolve_skill --help | grep -E "judge-model|use-llm-judge"
```

Expected output:

```
  --judge-model TEXT              Model for LLM-as-judge scoring (only used
  --use-llm-judge                 Use LLM-as-judge as the GEPA metric (slower,
```

Two lines confirm both flags are present. If the grep returns empty, the
patches are not applied.

For Patch B, a quick grep against the source confirms the judge is wired
to the right config field:

```bash
rg -n "self.config.judge_model|self.config.eval_model" evolution/core/fitness.py
```

Expected: a hit on `self.config.judge_model` inside `score()`. No hit on
`self.config.eval_model` inside `score()`.

---

## Section 5 — Re-applying after upstream pull

If a future `git pull` against the upstream introduces conflicts:

1. The `four_blocks_runner` wrapper at
   `docs/GEPA-DSPy-m1/four_blocks_runner/` is the long-term home for our
   extensions. The upstream patches are a temporary bridge until we fully
   decouple.
2. **Workflow:** re-apply by hand if `git apply UPSTREAM_PATCHES.diff`
   fails due to upstream drift. The diff in this directory documents the
   intent; the file is small enough to merge by eye.
3. The wrapper's metric-selection logic is being moved into
   `four_blocks_runner/run_evolution.py`. Once that lands, the upstream
   patches become **optional** — the wrapper will replicate the metric
   selection and recording without touching upstream files.

---

## Section 6 — Future state

The trajectory:

1. **Wave 2** — `four_blocks_runner` wrapper takes over metric selection
   and metrics recording, calling into upstream `evolve()` with its own
   metric callable rather than relying on the upstream branch.
2. Once Wave 2 ships, the upstream `evolve_skill.py` patches become
   unnecessary because the wrapper supplies the metric directly to
   `dspy.GEPA(metric=...)`.
3. Long-term: vendor only the small upstream subset we depend on
   (`SkillModule`, `LLMJudge`, `EvolutionConfig`), or fork the upstream
   into a tracked sibling directory under `vendor/`.

When that work lands, this file gets a "deprecated — wrapper handles it"
note at the top and the `.diff` becomes informational only.
