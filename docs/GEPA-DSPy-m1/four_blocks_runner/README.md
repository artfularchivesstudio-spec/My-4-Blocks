# four_blocks_runner

🎭 **Tracked wrapper around the upstream GEPA-DSPy `evolve_skill` CLI.**

Every iteration's candidate prompt, every metric verdict, every model identifier,
the dataset version, the active system prompt at run time, errors, timing — all
captured into a structured `experiment.json` so the admin UI can audit any past run.

> **Leave no data behind.**

---

## Why this exists

The actual evolution machinery lives at
`docs/GEPA-DSPy-m1/hermes-agent-self-evolution/` — but that directory is
**gitignored** (see `.gitignore:44`). Local patches we've applied to
`evolve_skill.py` and `fitness.py` (adding `--judge-model` / `--use-llm-judge`
and wiring `LLMJudge`) exist on disk only — they don't ship in the repo.

This package lives **outside** the gitignored path so it's committed alongside
the rest of the website. It imports the upstream module from the active venv
and instruments it from the outside, capturing run telemetry into
`experiment.json` artifacts that the admin UI can read.

---

## Install / activation

This wrapper has **zero non-stdlib dependencies of its own**, but it imports the
upstream package. Activate the upstream venv before running:

```bash
cd /Users/admin/Developer/My-4-Blocks/docs/GEPA-DSPy-m1
source hermes-agent-self-evolution/.venv/bin/activate

# Smoke import:
python -c "from four_blocks_runner import RunRecorder, run; print('OK')"
```

If the upstream isn't installed yet:

```bash
cd hermes-agent-self-evolution
uv venv && source .venv/bin/activate
uv pip install -e .[dev]
```

---

## CLI usage

The CLI mirrors upstream's `evolve_skill` flags exactly, plus three tracking
knobs (`--run-id`, `--output-root`, `--system-prompt-file`):

```bash
# All upstream flags forwarded:
python -m four_blocks_runner \
  --skill github-code-review \
  --iterations 10 \
  --optimizer-model openai/gpt-4.1 \
  --eval-model openai/gpt-4.1-mini \
  --judge-model openai/gpt-4.1 \
  --use-llm-judge \
  --hermes-repo /Users/admin/Developer/My-4-Blocks/docs/GEPA-DSPy-m1/hermes-agent \
  --run-id 9b1fce7e-...        # optional; auto-generated if omitted
  --output-root /var/runs      # default: ./output relative to cwd
  --system-prompt-file ./prompt.txt  # contents recorded in experiment.json
```

Dry-run (forwards to upstream's `--dry-run`):

```bash
python -m four_blocks_runner --skill github-code-review --iterations 2 --dry-run \
  --output-root /tmp/fbr-smoke
```

---

## Programmatic usage

```python
from four_blocks_runner import RunRecorder, run

# Option A — direct CLI-equivalent call:
run_dir = run(
    skill_name="github-code-review",
    iterations=10,
    optimizer_model="openai/gpt-4.1",
    eval_model="openai/gpt-4.1-mini",
    judge_model="openai/gpt-4.1",
    use_llm_judge=True,
    output_root="/var/runs",
    system_prompt=open("/etc/active_prompt.txt").read(),
)
print(f"experiment.json -> {run_dir / 'experiment.json'}")

# Option B — use RunRecorder standalone for any custom pipeline:
recorder = RunRecorder()
recorder.start(skill_name="x", output_root="/tmp/runs", iterations=5)
recorder.record_candidate(iteration=0, candidate_text="...", score=0.7)
recorder.record_evaluation(iteration=0, example_idx=0, task_input="q", expected="e", agent_output="a", score=0.7)
recorder.finalize(status="completed", baseline_score=0.5, evolved_score=0.7)
recorder.flush()
```

---

## Output schema

After a run, the run directory contains:

```
<output_root>/<skill>/<YYYYMMDD_HHMMSS>__<run_id>/
├── experiment.json         # the comprehensive scroll (schema_version: "1")
├── candidates.jsonl        # one candidate per line (streaming-friendly)
├── evaluations.jsonl       # one evaluation per line
├── baseline_skill.md       # mirrored from upstream's output
├── evolved_skill.md        # mirrored from upstream's output (if successful)
├── metrics.json            # mirrored from upstream's metrics.json
└── RECORDER_STARTED.txt    # heartbeat sentinel written at start()
```

### `experiment.json` shape

```jsonc
{
  "schema_version": "1",
  "run_id": "9b1fce7e-...",
  "status": "completed",                       // 'completed' | 'failed' | 'partial'
  "started_at":   "2026-04-26T14:00:00+00:00", // ISO 8601 UTC
  "completed_at": "2026-04-26T14:12:34+00:00",
  "elapsed_seconds": 754.21,
  "skill_name": "github-code-review",
  "iterations": 10,
  "use_llm_judge": true,
  "models": {
    "optimizer_model": "openai/gpt-4.1",
    "eval_model":      "openai/gpt-4.1-mini",
    "judge_model":     "openai/gpt-4.1"
  },
  "dataset": {
    "path":   "/abs/path/to/datasets/skills/github-code-review",
    "corpus": "legacy",                        // 'legacy' | 'v1' | 'gepa-datasets' | 'unknown'
    "snapshot": {
      "chunk_count": 42,
      "train_count": 20,
      "val_count": 10,
      "holdout_count": 12,
      "sample_task_inputs": ["...", "...", "..."]
    }
  },
  "system_prompt": "You are a careful reviewer...",
  "environment": {
    "python_version": "3.12.9",
    "dspy_version":   "3.2.1",
    "gepa_version":   null,
    "git_sha":        "f7847faabc...",
    "platform":       "darwin"
  },
  "baseline_skill_md": "---\nname: github-code-review\n---\n# Original body...",
  "evolved_skill_md":  "---\n...\n---\n# Evolved body...",
  "scores": {
    "baseline_score": 0.40,
    "evolved_score":  0.71,
    "improvement":    0.31
  },
  "upstream_metrics": { /* full mirror of upstream's metrics.json */ },
  "candidates": [
    {
      "iteration": 0,
      "candidate_text": "...",
      "score": 0.42,
      "timestamp": "2026-04-26T14:00:30+00:00",
      "metadata": {
        "correctness": 0.5,
        "procedure_following": 0.4,
        "conciseness": 0.4
      }
    }
  ],
  "evaluations": [
    {
      "iteration": 0,
      "example_idx": 0,
      "task_input":   "What does this PR do?",
      "expected":     "Summarize the diff",
      "agent_output": "It refactors X.",
      "score": 0.7,
      "judge_feedback": "Good but could mention edge cases.",
      "timestamp": "2026-04-26T14:00:31+00:00"
    }
  ],
  "candidate_count": 12,
  "evaluation_count": 36,
  "error": null,
  "extra": {},
  "paths": {
    "output_root": "/abs/path/to/output",
    "run_dir":     "/abs/path/to/output/github-code-review/20260426_140000__<uuid>"
  }
}
```

### Reading output with `jq`

```bash
# Latest run for a skill:
RUN=$(ls -td output/github-code-review/* | head -1)

# Quick summary:
jq '{run_id, status, scores, candidate_count, evaluation_count}' "$RUN/experiment.json"

# Top 5 candidates by score:
jq '.candidates | sort_by(-.score) | .[0:5] | map({iteration, score, text: .candidate_text[0:80]})' \
   "$RUN/experiment.json"

# Evaluations whose score < 0.5 (where the agent struggled):
jq '.evaluations | map(select(.score < 0.5))' "$RUN/experiment.json"

# Stream candidates as they land (during a long run):
tail -f "$RUN/candidates.jsonl" | jq -C .
```

---

## How the admin trigger endpoint will use this

The Next.js admin endpoint (planned) will:

1. Read `dspyOptimizerModel`, `dspyEvalModel`, `dspyJudgeModel`, and the active
   system prompt from Supabase `admin_config`.
2. Spawn this wrapper as a subprocess with those values forwarded as flags:

   ```
   python -m four_blocks_runner \
     --skill <selected> \
     --optimizer-model <...> --eval-model <...> --judge-model <...> \
     --use-llm-judge \
     --output-root /var/four-blocks/runs \
     --run-id <uuid the endpoint allocated> \
     --system-prompt-file /tmp/<run_id>.prompt.txt
   ```
3. Watch `<output_root>/<skill>/*__<run_id>/experiment.json` for completion.
4. Push the JSON into Supabase for the admin UI to render.

This wrapper itself does **not** push to Supabase — that's the endpoint's job.
The contract is: this package writes a faithful local artifact; the endpoint
ingests it.

---

## Environment variables

Consumed:

- `OPENAI_API_KEY` — required for any non-dry-run; passed through to DSPy.
- `HERMES_AGENT_REPO` — optional; fallback for `--hermes-repo` if not given on
  the CLI. The admin endpoint should set this.

Future-reserved (the wrapper itself does NOT read these — the Next.js endpoint
will use them to push results upstream):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`

---

## Implementation notes

### Metric instrumentation strategy: monkeypatching vs. replication

Two options for capturing every metric call:

| Approach | Pros | Cons |
|---|---|---|
| **Monkeypatch** the upstream's `_gepa_skill_fitness_metric` and `LLMJudge.score` symbols | ~6 lines of patching, zero duplication, follows upstream evolution automatically | Requires upstream's symbol names to remain stable; an upstream rename breaks us |
| **Replicate** upstream `evolve()` here with our own metric injected | Cleaner encapsulation, no global state mutation | ~150 lines of duplication that drift every time the upstream is refactored |

We chose monkeypatching for now because:

1. The upstream is rapidly evolving (we still hold local patches against it).
2. Drift surface matters more than encapsulation purity at this stage.
3. The patches are restored in a `finally:` so other code in the same process
   sees vanilla behavior afterward.

If upstream stabilizes, switching to replication is straightforward — the
`RunRecorder` API doesn't change.

### Schema versioning

`experiment.json` always carries a top-level `"schema_version": "1"` field.
Future schema changes should bump this and ship a migration script.

---

## Testing

```bash
cd /Users/admin/Developer/My-4-Blocks/docs/GEPA-DSPy-m1
source hermes-agent-self-evolution/.venv/bin/activate
python -m pytest four_blocks_runner/tests/ -q
```

The recorder unit tests are **standalone** — they don't import upstream and run
without it. Only `run_evolution.run()` itself needs the upstream venv.

---

## File map

```
four_blocks_runner/
├── __init__.py             # exposes RunRecorder, run, main
├── __main__.py             # `python -m four_blocks_runner` entry
├── README.md               # this file
├── recorder.py             # RunRecorder + helpers
├── run_evolution.py        # CLI entrypoint + monkeypatch glue
└── tests/
    ├── __init__.py
    └── test_recorder.py    # smoke + failure-path + corpus-inference tests
```
