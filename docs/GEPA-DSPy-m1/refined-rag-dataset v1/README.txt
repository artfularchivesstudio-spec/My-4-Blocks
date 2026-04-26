MY4BLOCKS RAG DATASET — GURINDER HANDOFF
=========================================
Prepared by: Cale (COO, My4Blocks); expanded April 26, 2026 to add front matter, Ch 10, Ch 11, and hybrid two-layer architecture documentation.
Date: April 26, 2026
Source: Dr. Vincent Parr — "You Only Have Four Problems: The CURE for Anger, Anxiety, Depression & Guilt"


OVERVIEW
--------
This package contains the complete RAG chunking dataset for Dr. Parr's book,
covering Front Matter (Preface + Introduction) and Chapters 1–11. Chapter 12
(10 Ox-Herding Pictures) is intentionally excluded — see EXCLUDED CONTENT below.

Total chunks: 159
Total files: 24 (12 JSON + 12 TXT)


FILE STRUCTURE
--------------
Each chapter has two files:

  chapter_X_chunks.json   →   Structured JSON for RAG ingestion
  chapter_X_raw.txt       →   Plain text ground-truth reference for audit/QA

Files included:
  chapter_0_front_matter_chunks.json / chapter_0_front_matter_raw.txt   — Front Matter: Preface + Introduction (12 chunks) — covers Ellis lineage, Hagen mentor, Four Blocks definition, Four Immeasurables, Three Goals
  chapter_1_chunks.json / chapter_1_raw.txt   — Mental Contamination (15 chunks)
  chapter_2_chunks.json / chapter_2_raw.txt   — The Three Insights (7 chunks)
  chapter_3_chunks.json / chapter_3_raw.txt   — The ABCs of How Emotions Are Created (9 chunks)
  chapter_4_chunks.json / chapter_4_raw.txt   — The Seven Irrational Beliefs (35 chunks)
  chapter_5_chunks.json / chapter_5_raw.txt   — The Formula for Anger (9 chunks)
  chapter_6_chunks.json / chapter_6_raw.txt   — The Formula for Anxiety (16 chunks)
  chapter_7_chunks.json / chapter_7_raw.txt   — The Formula for Depression (12 chunks)
  chapter_8_chunks.json / chapter_8_raw.txt   — The Formula for Guilt (7 chunks)
  chapter_9_chunks.json / chapter_9_raw.txt   — The Formulas for Happiness (10 chunks)
  chapter_10_zen_chunks.json / chapter_10_zen_raw.txt   — Why Zen Meditation is Essential Mind Training (11 chunks) — covers awareness practice, Centered Breath bridge to Ch 6, "Let go" breath
  chapter_11_healthy_body_chunks.json / chapter_11_healthy_body_raw.txt   — Healthy Body, Healthy Mind (16 chunks, two-tier) — covers Sleep / Exercise / Nutrition with clinical claims and gut-brain axis


JSON SCHEMA
-----------
Each chunk follows this structure:

  {
    "concept":    "name of the framework or idea",
    "chapter":    "chapter number and title",
    "content":    "exact clinical language, not paraphrased",
    "type":       "formula | definition | framework | list | distinction | example",
    "references": "cross-references to other chapters/concepts"
  }

IMPORTANT: Content fields preserve Dr. Parr's exact clinical language.
Nothing has been paraphrased.


CHUNK TYPES USED
----------------
  formula      — Clinical equations (A=ET+S, AX=WI+AW+ICSI, D=H1+H2+N, G=W1+W2, etc.)
  definition   — Terms explicitly defined in the text
  framework    — Named multi-step processes or conceptual models
  list         — Numbered or bulleted lists kept intact as single entries
  distinction  — Contrasts between two concepts
  example      — Clinical case examples, labeled separately from theory


TWO-TIER STRUCTURE — CHAPTERS 4 AND 11
---------------------------------------
Chapter 4 (Seven Irrational Beliefs) uses a two-tier architecture:

  Tier 1 (9 chunks): Chapter-wide frameworks applicable across all 7 IBs
    — Red-Flagging, Disputing, 4 Steps to Disputing, S.O.S. Framework,
      4 Challenge Questions, Cognitive Stoppage, If/Then Logic, Master IB List,
      Physiological Effects

  Tier 2 (26 chunks): Per each of the 7 IBs — definition, red-flag phrase list,
      disputing method, and case examples where present

This structure optimizes retrieval precision for the highest-utility chapter
in the dataset.

Chapter 11 (Healthy Body, Healthy Mind) also uses a two-tier structure:
Tier 1 = chapter-wide frameworks (Sleep / Exercise / Nutrition top-level),
Tier 2 = sub-items within each pillar (clinical claims, gut-brain axis,
specific protocols).


CORE FORMULAS — QUICK REFERENCE
---------------------------------
  Anger:      A = ET + S
              (Egocentric Thinking + Should)

  Anxiety:    AX = WI + AW + ICSI
              (What If? + Awfulizing + I Can't Stand It!)

  Depression: D = H1 + H2 + N
              (Hopelessness + Helplessness + Need)

  Guilt:      G = W1 + W2
              (Wrongness + Worthlessness)

  Happiness (Short):  100% A = 0% D
                      (Total Acceptance = Zero Disturbance)

  Happiness (Long):   H = USA + UAOW + SN
                      (Unconditional Self-Acceptance +
                       Unconditional Acceptance of Others and the World +
                       Staying Now)

  Greater Happiness:  GH = H + CA – HF
                      (Happiness + Creative Absorption – Hassle Factor)

  ABC Model:  A = Activating Event
              B = Belief or Belief System
              C = Consequences
              D = Disputing
              E = Equanimity or new Effective Belief


CROSS-REFERENCE ARCHITECTURE
------------------------------
The "references" field in each chunk flags explicit connections to other
concepts and chapters. This enables graph-style retrieval traversal in
addition to standard vector search.

Key hub concepts with the most outbound references:
  - The Seven Irrational Beliefs (Chapter 4)
  - The ABCs of How Emotions Are Created (Chapter 3)
  - Red-Flagging and Disputing (Chapter 4)
  - Acceptance (Chapter 3)
  - The 4 Steps to Disputing (Chapter 4)


AUDIT PROCESS
--------------
The raw .txt files mirror the JSON content exactly and are intended for
human QA. If any chunk in the JSON appears malformed, truncated, or
incorrectly attributed during ingestion, the corresponding .txt entry
is the ground-truth reference for correction.


HYBRID TWO-LAYER ARCHITECTURE
------------------------------
The My4Blocks knowledge stack is split into two layers with distinct roles.
This dataset is Layer 1.

  Layer 1 — Source corpus (this dataset, v1):
    Verbatim Parr language. Source-attributed (Ellis, Katie, REBT, CBT,
    Hagen, Buddha appear as the book uses them). Used for retrieval by
    GEPA-DSPy training and RAG lookup. Internal-facing — never shown raw
    to end users.

  Layer 2 — Brand-distilled response layer:
    content/unified-knowledge-base.json at the repo root. Paraphrased to
    brand voice. No third-party attributions. Used for system prompt
    content and direct response style. End-user-facing.

Why both:
  v1 preserves the clinical fidelity Cale's handoff promised ("Nothing has
  been paraphrased"). The brand layer protects voice and product
  positioning. The model retrieves on v1, speaks in the brand layer's
  voice.

Attribution density — where source attributions are concentrated:
  - Chapter 0 (front matter) — Ellis, Hagen, REBT, CBT origins
  - Chapter 4 — "Four Challenge Questions — Ellis and Byron Katie",
                "Albert Ellis used to say..." quotes
  - Chapter 5 — "The Parr Institute" brand mention
  - Chapter 7 — "Albert Ellis again here" (PYA: Push Your Ass)
  - Chapter 10 — "REBT and CBT" disclaimer + Buddha quote
  - Chapters 1, 3, 6, 8, 9 — "naturally clean," no third-party attributions

Rule for response layer construction:
  When generating the brand layer, suppress retrieval of chapter_0 + the
  listed Ellis/Katie chunks in chs 2/4/7, OR replace attributed phrasings
  with brand-voice paraphrases.


EXCLUDED CONTENT
-----------------
Chapter 12 (Lessons From the 10 Ox-Herding Pictures, book pp.159–190) is
intentionally excluded. The book's colophon attributes it to
Dr. Kathleen Shakai Bishop (used with author's express written permission).
Re-distributing it as training data requires separate permission scope
review. Do not re-add without legal sign-off.

Epilogue (pp.191–192) and Acknowledgements (pp.193–194) are not chunked —
non-substantive for retrieval.


QUESTIONS
----------
Direct all dataset questions to Cale.
=========================================
