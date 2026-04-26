# GEPA + DSPy + Hermes self-evolution — progress and next steps

**Last updated:** 2026-04-26 (post-reconciliation: full PDF + hybrid two-layer corpus)  
**Workspace:** [My-4-Blocks](/Users/admin/Developer/My-4-Blocks)  
**Focus directory:** `docs/GEPA-DSPy-m1/`

This note records what was set up and changed while integrating [NousResearch/hermes-agent-self-evolution](https://github.com/NousResearch/hermes-agent-self-evolution) (DSPy + GEPA) for future prompt/skill evolution work (including your four custom blocks). It is a working log, not the project changelog.

---

## 1. Layout in this repo

| Path | Purpose |
|------|---------|
| `docs/GEPA-DSPy-m1/hermes-agent-self-evolution/` | Cloned **hermes-agent-self-evolution** package; Python venv, tests, `evolve_skill` CLI |
| `docs/GEPA-DSPy-m1/hermes-agent/` | Shallow clone of [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) — **required** so skills like `github-code-review` resolve under `skills/**/SKILL.md` |
| `docs/GEPA-DSPy-m1/refined-rag-dataset v1/` | **Canonical source corpus** for Four Blocks. Verbatim Parr language, source-attributed, two-tier where applicable. 159 chunks across 12 files (chs 0, 1–9, 10, 11). Used for retrieval / GEPA-DSPy training. **Do not paraphrase.** |
| `content/unified-knowledge-base.json` | **Brand-distilled response layer.** Paraphrased, attribution-stripped, end-user-facing. Used for system prompt. **Do not train against directly** — derive from v1. |
| `content/Four blocks paperback book (full).pdf` | Source PDF (205 pp., Parr 2021). The ground truth the v1 corpus is verified against. |

Evolution run outputs (local, typically gitignored or review before commit):

- `hermes-agent-self-evolution/datasets/skills/<skill-name>/` — train/val/holdout JSONL from synthetic or golden loads  
- `hermes-agent-self-evolution/output/<skill-name>/<timestamp>/` — `baseline_skill.md`, `evolved_skill.md`, `metrics.json`

### 1.1 Hybrid Two-Layer Architecture

- **Layer 1 (v1 source corpus):** verbatim, attributed, **internal-only**. Where the model *retrieves* from.
- **Layer 2 (brand-distilled):** paraphrased, attribution-clean, **user-facing**. Where the model's *voice* lives.
- **Why:** v1 preserves the clinical fidelity needed for accurate retrieval and GEPA training (the metric needs source-faithful `expected_behavior`). The brand layer protects positioning and avoids third-party attribution surfacing in user-facing responses.

```
Book PDF → v1 corpus (retrieval) → model → brand layer voice → user
```

---

## 2. Environment and install

### Python toolchain

- **uv** created `.venv` inside `hermes-agent-self-evolution/` (resolved to **CPython 3.12.9** on the machine used).
- Install command:

  ```bash
  cd docs/GEPA-DSPy-m1/hermes-agent-self-evolution
  uv venv .venv
  source .venv/bin/activate
  uv pip install -e ".[dev]"
  ```

- **`optuna`** is required for **MIPROv2** (fallback optimizer). It was installed manually once; **`optuna>=4.0`** was also added to **`[project.optional-dependencies] dev`** in `pyproject.toml` so future `uv pip install -e ".[dev]"` installs it.

### Secrets

- **`OPENAI_API_KEY`** is loaded from the **My-4-Blocks repo root** [`.env`](../../.env) (not committed in secure setups; your local file is authoritative).
- Example:

  ```bash
  set -a && source /Users/admin/Developer/My-4-Blocks/.env && set +a
  ```

### Hermes agent repo discovery

- **`EvolutionConfig`** resolves `hermes_agent_path` via `get_hermes_agent_path()` in `evolution/core/config.py`: `HERMES_AGENT_REPO` env → `~/.hermes/hermes-agent` → sibling `hermes-agent` under the self-evolution package root.
- **Practical choice for this monorepo:** clone upstream **hermes-agent** next to self-evolution and export:

  ```bash
  export HERMES_AGENT_REPO=/Users/admin/Developer/My-4-Blocks/docs/GEPA-DSPy-m1/hermes-agent
  ```

- **Tests:** `pytest tests/ -q` **fails** if `HERMES_AGENT_REPO` is unset and no default path exists. With the export above, **139 tests passed** (after constraint test updates; see below).

---

## 3. OpenAI models (“GPT‑5 generation”, fastest options)

Per [OpenAI Models documentation](https://platform.openai.com/docs/models):

- **`gpt-5.5`** — flagship; good for **reflection / heavy** optimization steps.
- **`gpt-5.4-mini`** — explicitly aimed at **lower latency and cost**; labeled **Faster** in the frontier comparison on the docs page.
- **`gpt-5.4-nano`** — mentioned alongside mini for latency/cost; confirm availability for your **project/API** before relying on it.

**What we learned in practice**

- **`gpt-5.5-mini`** returned **404** (`model_not_found`) — do not assume a `-mini` exists for every major version string.
- For **fast eval / dataset generation**, prefer **`openai/gpt-5.4-mini`** (and optionally **`openai/gpt-5.4-nano`** if enabled).
- DSPy is configured with strings like **`openai/<model_id>`** (LiteLLM backend).

**Suggested CLI pairing for future runs**

```bash
--optimizer-model openai/gpt-5.5
--eval-model openai/gpt-5.4-mini
```

---

## 4. Smoke test and benchmark run

### Dry run (no API optimization)

Validates skill discovery and wiring:

```bash
set -a && source /Users/admin/Developer/My-4-Blocks/.env && set +a
export HERMES_AGENT_REPO=/Users/admin/Developer/My-4-Blocks/docs/GEPA-DSPy-m1/hermes-agent
cd docs/GEPA-DSPy-m1/hermes-agent-self-evolution
source .venv/bin/activate

python -m evolution.skills.evolve_skill \
  --skill github-code-review \
  --iterations 10 \
  --eval-source synthetic \
  --optimizer-model openai/gpt-5.5 \
  --eval-model openai/gpt-5.4-mini \
  --dry-run
```

(Adjust `--eval-model` if `gpt-5.4-mini` is unavailable on your key; fall back to `openai/gpt-5.5` for both.)

### Full pipeline (synthetic eval dataset)

Regenerates synthetic examples via LLM (costs API calls):

```bash
python -m evolution.skills.evolve_skill \
  --skill github-code-review \
  --iterations 10 \
  --eval-source synthetic \
  --optimizer-model openai/gpt-5.5 \
  --eval-model openai/gpt-5.5
```

### Reuse dataset (golden folder with splits)

After the first synthetic run, splits were saved under `datasets/skills/github-code-review/`. Reload without regenerating:

```bash
python -m evolution.skills.evolve_skill \
  --skill github-code-review \
  --iterations 10 \
  --eval-source golden \
  --dataset-path datasets/skills/github-code-review \
  --optimizer-model openai/gpt-5.5 \
  --eval-model openai/gpt-5.5
```

### Holdout results (example successful run)

From `output/github-code-review/20260426_173453/metrics.json`:

| Metric | Baseline | Evolved | Delta |
|--------|----------|---------|--------|
| Holdout score (keyword-overlap metric) | ~0.492 | ~0.601 | **+0.109** (~+22% vs baseline) |
| Skill body size (chars) | 13,161 | 13,161 | 0 |

Note: this run was against the demo `github-code-review` skill. Four Blocks skill runs come next per Step 4 below; they MUST point at v1 (not unified-knowledge-base.json).

**Note:** That particular run completed optimization quickly when evaluation was cache-heavy; treat timing as environment-dependent. The **first** full run on cold cache took on the order of **minutes** and real token spend.

---

## 5. Code changes made in `hermes-agent-self-evolution`

All edits live under `docs/GEPA-DSPy-m1/hermes-agent-self-evolution/`.

### 5.1 Skill body vs YAML — constraint validator

**Problem:** `evolve_skill` validates **`skill["body"]`** (markdown after frontmatter), but `_check_skill_structure` required leading `---` and `name:` / `description:` in that string — so **every** evolution failed the “skill_structure” gate.

**Change:** `evolution/core/constraints.py` — if the artifact does **not** start with `---`, treat it as a **body fragment** and pass structure check (full SKILL.md still has YAML when assembled).

**Test:** `tests/core/test_constraints.py` — `test_missing_frontmatter` replaced with `test_body_fragment_without_frontmatter_passes`.

### 5.2 GEPA constructor (DSPy 3.2+)

**Problem:** `dspy.GEPA(..., max_steps=...)` raised **`TypeError`** — DSPy 3.2 expects budget via **`auto`** *or* **`max_full_evals`** *or* **`max_metric_calls`**, and requires **`reflection_lm`** (or a custom proposer). The metric must follow the **5-argument** GEPA signature.

**Change:** `evolution/skills/evolve_skill.py`

- Added `_gepa_skill_fitness_metric(gold, pred, trace=None, pred_name=None, pred_trace=None)` delegating to `skill_fitness_metric`.
- GEPA instantiation now uses `max_full_evals=iterations` and `reflection_lm=dspy.LM(optimizer_model, temperature=1.0, max_tokens=32000)`.
- **`compile(..., student=..., trainset=..., valset=...)`** uses keyword `student=`.

**Fallback:** On any exception, the CLI still falls back to **MIPROv2** (needs **optuna**).

### 5.3 Dependencies

**Change:** `pyproject.toml` — `dev` optional deps include **`optuna>=4.0`**.

---

## 6. Known limitations (important for your four blocks)

### 6.1 Saved SKILL.md may be unchanged even when scores move

`SkillModule` passes **`skill_instructions=self.skill_text`** into a `ChainOfThought` predictor. Optimizers (MIPROv2 / GEPA) primarily mutate **predictor instructions / demos**, not necessarily **`skill_text`**.

So **`evolved_body = optimized_module.skill_text`** can equal the baseline → **`baseline_skill.md` and `evolved_skill.md` may be byte-identical** while holdout metrics still change.

**Next design decision for block work:** define whether the evolved artifact is:

- the **full `SKILL.md`** (frontmatter + body),
- the **markdown body only**, or
- **serialized optimized instructions** (e.g. export DSPy program / signature text) merged back into your constitution JSON or app prompts.

### 6.2 Fitness function today

`skill_fitness_metric` in `evolution/core/fitness.py` is a **fast keyword-overlap** proxy vs `expected_behavior`, not full **LLM-as-judge** (the `LLMJudge` class exists but is not wired as the default metric for GEPA in the current loop).

For production block tuning you will likely want a **custom metric** (exact JSON match, JSON Schema, or judge rubric) plugged into the same interface. For Four Blocks skills, an LLM-as-judge metric scoring against v1 chunks (verbatim source) is the recommended next step over keyword overlap.

### 6.3 Optimizer path

Until you run again with the GEPA patch and confirm no fallback, assume some runs may still hit **MIPROv2** if GEPA raises (watch console for “falling back to MIPROv2”).

---

## 7. Evaluation dataset and skill format (preview for next steps)

**Golden / split JSONL** (`EvalDataset` in `evolution/core/dataset_builder.py`):

- Fields per line: `task_input`, `expected_behavior`, optional `difficulty`, `category`, `source`.
- On disk: `train.jsonl`, `val.jsonl`, `holdout.jsonl` in a directory, **or** a single `golden.jsonl` with auto-split.

**Skill file** (`evolution/skills/skill_module.py`):

- Hermes **`SKILL.md`**: YAML frontmatter (`name`, `description`) + markdown **body**.
- The evolver loads full file but optimizes and validates **body** in several places; reassembly uses `reassemble_skill(frontmatter, evolved_body)`.

**Trace-aware mutation (GEPA):**

- DSPy GEPA captures **execution traces** and uses **`reflection_lm`** plus your **metric** (optionally with feedback) to propose new instructions — see DSPy’s [GEPA class docstring](https://github.com/stanfordnlp/dspy/blob/main/dspy/teleprompt/gepa/gepa.py) in your installed `dspy` package.

---

## 8. Next steps (ordered)

1. **Lock model IDs for routine runs** — Use `gpt-5.5` + `gpt-5.4-mini` (or your account’s fastest available mini/nano) and document the exact pair that returns 200 OK from your project.

2. **Confirm GEPA path end-to-end** — Run one evolution with console logging and verify **no** MIPROv2 fallback; tune `max_full_evals` vs `auto="light"` for cost.

3. **Fix “evolved artifact” semantics** — Implement export of optimized instructions into the artifact you actually ship (SKILL body, system prompt slice, or JSON constitution field) so **git diffs** reflect real changes.

4. **Map your four blocks** — Pin GEPA-DSPy to the canonical v1 corpus.
   - `--dataset-path docs/GEPA-DSPy-m1/refined-rag-dataset\ v1/` (escape the space)
   - For each Block (Anger, Anxiety, Depression, Guilt), build a Hermes-style
     `SKILL.md` whose `body` is the brand-distilled prompt (Layer 2 voice) and
     whose evaluation harness retrieves from v1 (Layer 1 source).
   - Convert each Block's hand-written examples into `(task_input, expected_behavior)`
     pairs grounded in v1 chunks (verbatim quotes from chunks become the
     `expected_behavior` for fitness scoring).
   - **Do not** train against `content/unified-knowledge-base.json` directly —
     it is downstream of v1 and would create a paraphrase-of-paraphrase loop.
   - Skip Chapter 12 content (Bishop, third-party — see v1 README "EXCLUDED CONTENT").

5. **Convert hand-written JSON examples** — For each block, transform `(input, output)` pairs into `task_input` + rubric `expected_behavior` (or structured golden outputs + programmatic scorer).

6. **Implement block-specific metrics** — Schema validation, normalized JSON equality, fuzzy field match, or `LLMJudge` with a fixed rubric; wire into GEPA’s 5-arg metric if using reflection feedback.

7. **Train/val/holdout** — Hold out **20%** (or explicit `holdout.jsonl`) that the optimizer never trains on; report baseline vs evolved **only** on holdout.

8. **Guardrails** — Enforce **≤15 KB** skill body, **≤20%** growth vs baseline, and **semantic drift** checks (e.g. required “laws” / non-negotiable clauses must remain verbatim or be flagged in review).

9. **Human review** — Every evolved variant: **`diff` + metrics + sample failures** before adoption (no auto-commit to production prompts).

10. **Optional: upstream** — If you want Nous to benefit, prepare PRs against **hermes-agent-self-evolution** for constraint + GEPA fixes (after you’re happy with the behavior).

11. **Periodic re-audit** — Whenever the v1 corpus changes (new chunks added,
    attribution scope changes), re-run the spot-check audit (see
    `refined-rag-dataset v1/README.txt` AUDIT PROCESS) before the next
    training run. Drift between v1 and the source PDF is a training risk.

---

## 9. Quick command reference

```bash
# One-shot: env + repo + run from My-4-Blocks root
set -a && source .env && set +a
export HERMES_AGENT_REPO="$PWD/docs/GEPA-DSPy-m1/hermes-agent"
cd docs/GEPA-DSPy-m1/hermes-agent-self-evolution
source .venv/bin/activate

pytest tests/ -q

python -m evolution.skills.evolve_skill \
  --skill github-code-review \
  --iterations 10 \
  --eval-source golden \
  --dataset-path datasets/skills/github-code-review \
  --optimizer-model openai/gpt-5.5 \
  --eval-model openai/gpt-5.4-mini
```

---

## 10. Related links

- [OpenAI Models](https://platform.openai.com/docs/models)  
- [hermes-agent-self-evolution](https://github.com/NousResearch/hermes-agent-self-evolution)  
- [hermes-agent](https://github.com/NousResearch/hermes-agent)  
- [DSPy](https://github.com/stanfordnlp/dspy) / [GEPA paper](https://arxiv.org/abs/2507.19457)
