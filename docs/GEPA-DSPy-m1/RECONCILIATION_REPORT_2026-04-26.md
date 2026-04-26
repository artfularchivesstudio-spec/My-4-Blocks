# RAG Corpus Reconciliation Report — 2026-04-26

## Summary

The full canonical source PDF (`content/Four blocks paperback book (full).pdf`,
205 pp., Vincent E. Parr Ph.D., 2021, Parr Institute for Mental Wellness) was
discovered and adopted as the single source of truth for the Layer 1 RAG corpus.
The Layer 1 source-faithful retrieval corpus
(`docs/GEPA-DSPy-m1/refined-rag-dataset v1/`) was expanded with three new
chapter chunk files — Chapter 0 (front matter / preface / introduction),
Chapter 10 (Why Zen Meditation is Essential Mind Training), and Chapter 11
(Healthy Body, Healthy Mind). The corpus now totals **159 chunks across 12
chunk JSON files** (24 file artifacts when raw `.txt` companions are counted,
plus README). A hybrid two-layer architecture is now formally documented:
**Layer 1** = verbatim, source-attributed, internal-only retrieval corpus;
**Layer 2** = brand-distilled response voice
(`content/unified-knowledge-base.json`), now tagged with
`_meta.do_not_train_directly: true` and forbidden as a training target.

## Files added

- `docs/GEPA-DSPy-m1/refined-rag-dataset v1/chapter_0_front_matter_chunks.json` — 12 chunks
- `docs/GEPA-DSPy-m1/refined-rag-dataset v1/chapter_0_front_matter_raw.txt` — verbatim source
- `docs/GEPA-DSPy-m1/refined-rag-dataset v1/chapter_10_zen_chunks.json` — 11 chunks
- `docs/GEPA-DSPy-m1/refined-rag-dataset v1/chapter_10_zen_raw.txt` — verbatim source
- `docs/GEPA-DSPy-m1/refined-rag-dataset v1/chapter_11_healthy_body_chunks.json` — 16 chunks
- `docs/GEPA-DSPy-m1/refined-rag-dataset v1/chapter_11_healthy_body_raw.txt` — verbatim source
- `content/Four blocks paperback book (full).pdf` — canonical source PDF (untracked, 3.5 MB)
- `docs/GEPA-DSPy-m1/SETUP_PROGRESS_AND_NEXT_STEPS.md` — new setup-progress doc

## Files modified

- `docs/GEPA-DSPy-m1/refined-rag-dataset v1/README.txt` — added HYBRID TWO-LAYER ARCHITECTURE section.
- `docs/GEPA-DSPy-m1/SETUP_PROGRESS_AND_NEXT_STEPS.md` — new §1.1 hybrid architecture; step 4 pinned to v1.
- `content/unified-knowledge-base.json` — added `_meta` block with `do_not_train_directly: true`, role/layer/purpose, source-corpus pointer, source-book attribution, rationale, hybrid-layer doc pointer, `last_audited: 2026-04-26`.

## Verification results

### JSON validity

| File | Strict JSON | After comment-strip |
|---|---|---|
| chapter_0_front_matter_chunks.json | OK | OK |
| chapter_1_chunks.json | OK | OK |
| chapter_2_chunks.json | OK | OK |
| chapter_3_chunks.json | OK | OK |
| chapter_4_chunks.json | FAIL (JSONC: 24 `//` lines) | OK (35 chunks) |
| chapter_5_chunks.json | OK | OK |
| chapter_6_chunks.json | OK | OK |
| chapter_7_chunks.json | OK | OK |
| chapter_8_chunks.json | OK | OK |
| chapter_9_chunks.json | OK | OK |
| chapter_10_zen_chunks.json | OK | OK |
| chapter_11_healthy_body_chunks.json | FAIL (JSONC: 12 `//` lines) | OK (16 chunks) |
| content/unified-knowledge-base.json | OK | OK |

**Note**: `chapter_4_chunks.json` (pre-existing) and `chapter_11_healthy_body_chunks.json` (new) use JSONC (JSON-with-comments) format — `//` separator banners between tier sections. These do not parse with strict `json.tool` but parse cleanly after stripping line comments. Recommend either standardizing on strict JSON across the corpus or documenting JSONC as the chosen flavor and updating the loader to strip comments. This is a consistency call, not a content problem.

### Schema check on new chunks

| File | Total chunks | Missing required fields | Invalid `type` | Type distribution |
|---|---|---|---|---|
| chapter_0_front_matter_chunks.json | 12 | 0 | 0 | definition×7, list×3, framework×2 |
| chapter_10_zen_chunks.json | 11 | 0 | 0 | framework×4, definition×4, list×2, example×1 |
| chapter_11_healthy_body_chunks.json | 16 | 0 | 0 | framework×9, definition×4, example×2, list×1 |

All chunks have all 5 required fields (`concept`, `chapter`, `content`, `type`, `references`). All `type` values fall in the allowed set.

### Source-fidelity sample (3 random chunks per new file vs PDF pp. 1–8, 145–147, 149–157)

| File | Chunk concept | Verdict | Notes |
|---|---|---|---|
| ch_0_front_matter | Albert Ellis Lineage — RT to RET to REBT | PASS | Verbatim match to Preface p.1 ("In my early years I studied with the world-famous clinical psychologist Dr. Albert Ellis, Ph.D., the creator of Rational Therapy (RT)...") |
| ch_0_front_matter | Three Types of Consequences — Emotional, Behavioral, Physiological | PASS | Verbatim match to Preface p.1–2 ("Dr. Ellis taught me how powerful individual words in our thinking can truly be...three types of consequences: emotional, behavioral and physiological.") |
| ch_0_front_matter | Clinging to Beliefs — Source of Suffering and Delusion | PASS (paraphrase from Introduction) | Content is faithful to Introduction passages on belief / opinion / illusion. The chunk synthesizes adjacent paragraphs rather than quoting one block — acceptable for tier-1 framework chunks. |
| ch_10_zen | Zen Defined — Meditation as Seeing Things As They Really Are | PASS | Verbatim match to p.145 paragraph beginning "The practice I recommend, as stated above, is Zen, which literally means meditation..." |
| ch_10_zen | Basic Practice of Zen — Sitting, Breathing, Observing | PASS | Verbatim match to p.145–146 paragraph "The basic practice of Zen involves sitting or lying in a quiet place, in a comfortable position with a straight back (not stiff), and focusing on your breathing..." |
| ch_10_zen | Centering Breath — Cross-Reference Bridge to Anxiety Chapter | NEAR-PASS | Source p.146–147 reads "Practice the Centering Breath referred to in the chapter on Anxiety." The chunk renders this verbatim. Minor: source uses "Centering Breath" (capitalized phrase) — chunk is consistent. |
| ch_11_healthy_body | Sleep — Top-Level Importance | PASS | Verbatim match to p.149 ("Outside of reprogramming your genetic code, quality sleep is the greatest contributor to mental and physical health. Current research indicates that 7-8.5 hours of quality sleep per night is essential for mental acuity, longevity, and performance...") |
| ch_11_healthy_body | Sleep / Manage Your Mood | PASS | Verbatim match to p.149–150 ("Do you ever find your mind racing as you lie in bed watching the hours tick by?...Use the Centered Breathing technique from the chapter on Anxiety...") — chunk preserves the "Centered Breathing" reference. |
| ch_11_healthy_body | Nutrition / Increase Quality, Reduce Quantity | PASS | Verbatim match against `chapter_11_healthy_body_raw.txt` lines 60–63 ("Quality input = quality output / Garbage in = Garbage out / Caloric restriction, intermittent fasting...minimum of 12-hour breaks...reset stem cells..."). Source PDF pp.153–154 confirm this passage. |

**Overall fidelity verdict: PASS.** All 9 sampled chunks reproduce the source faithfully. One chunk (`Clinging to Beliefs`) is a tier-1 framework synthesis spanning multiple adjacent paragraphs of the Introduction rather than a single verbatim block, which is consistent with documented chunking strategy for framework-level chunks.

### Cross-reference integrity

- 39 distinct reference strings across the 3 new files.
- Distinct chapter numbers referenced: **{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}** — all in v1.
- **Zero references to Chapter 12 / Bishop / Ox-Herding** (the excluded chapter).
- No references to non-existent chapters.
- 5 random reference samples resolved as follows:
  - `chapter_11 :: Exercise — Top-Level Importance` → all 5 sub-references resolve (1 exact + 4 fuzzy chapter pointers like "The Formula for Anxiety (Chapter 6)").
  - `chapter_11 :: Sleep — Top-Level Importance` → all 5 resolve exactly.
  - `chapter_10 :: Zen as Mind Training, Not Woo-Woo — Disclaimer` → 3 of 4 resolve (fuzzy); "The ABCs of How Emotions are Created" labelled DANGLING by exact-match but the concept exists in v1 under nearby variants — chapter pointer resolves correctly.
  - `chapter_11 :: Healthy Body, Healthy Mind — Closing Synthesis` → 3 exact, 2 fuzzy chapter pointers ("Zen Meditation (Chapter 10)", "The Formulas for Happiness (Chapter 9)") — pointed-to chapters exist.
  - `chapter_0 :: Three Goals of the Book and Mastery Course` → 1 exact, 1 fuzzy, 1 chapter pointer to Chapter 9 (exists).

**Reference style**: references are written as semicolon-delimited concept-name + chapter-pointer strings (e.g. `"Disputing (Chapter 4)"`) rather than strict concept-id lookups. All chapter pointers target existing chapters. No dangling cross-chapter pointers detected.

### GEPA-DSPy --dry-run smoke test

```
🧬 Hermes Agent Self-Evolution — Evolving skill: github-code-review
  Loaded: skills/github/github-code-review/SKILL.md
  Name: github-code-review
  Size: 13,577 chars
  Description: Review code changes by analyzing git diffs, leaving inline comments on PRs, and ...

DRY RUN — setup validated successfully.
  Would generate eval dataset (source: synthetic)
  Would run GEPA optimization (2 iterations)
  Would validate constraints and create PR
```

**Outcome: PASS.** The `evolve_skill` CLI imports cleanly under `.venv`, finds the `github-code-review` SKILL.md from `HERMES_AGENT_REPO`, and validates dry-run setup. Harness is healthy.

## Open items / manual follow-ups

The following are flagged for the user; **do not commit/push without explicit instruction**:

- `git rm content/you-only-have-four-problems-book-text.pdf` — already shown as deleted in the working tree (status `D`); user to confirm and commit the removal.
- `git add "content/Four blocks paperback book (full).pdf"` — currently untracked (3.5 MB binary). User decision whether to commit to repo or store via Git LFS / external content store.
- `rm content/Untitled` — IDE artifact in `content/` (zero-byte placeholder). User to delete.
- Re-evaluate commits `f153268` and `31f7062` under the hybrid posture: with verbatim chunks now staying source-attributed in Layer 1 (and only Layer 2 paraphrased for end-user surfaces), system-prompt purification may or may not still be the right call per surface. Specifically: any internal-only retrieval surface should keep attributions; only direct-response / brand-voice surfaces need the purification. This is a per-surface decision, not a global one.
- Standardize JSON flavor: chapters 4 and 11 use JSONC (with `//` comments). Either convert to strict JSON or update the dataset loader to strip line comments. Currently the corpus has a mixed convention.

## Next steps for the parallel GEPA-DSPy agent

See `docs/GEPA-DSPy-m1/SETUP_PROGRESS_AND_NEXT_STEPS.md` **§4** — that document now pins the canonical training/retrieval dataset to:

```
docs/GEPA-DSPy-m1/refined-rag-dataset v1/
```

and explicitly forbids training against the brand layer
(`content/unified-knowledge-base.json`). Per `_meta.do_not_train_directly: true`
on the brand layer, training pipelines must source from Layer 1 only. Layer 2
is reserved for end-user response style and system-prompt seeding.
