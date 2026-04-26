MY4BLOCKS RAG DATASET — GURINDER HANDOFF
=========================================
Prepared by: Cale (COO, My4Blocks)
Date: April 16, 2026
Source: Dr. Vincent Parr — "You Only Have Four Problems: The CURE for Anger, Anxiety, Depression & Guilt"


OVERVIEW
--------
This package contains the complete RAG chunking dataset for Dr. Parr's book,
covering Chapters 1–9. Chapters 10–12 (Zen Meditation, Healthy Body, 10 Ox-Herding
Pictures) were intentionally excluded as they are philosophical/supplementary and
not required for core RAG retrieval functionality.

Total chunks: 120
Total files: 18 (9 JSON + 9 TXT)


FILE STRUCTURE
--------------
Each chapter has two files:

  chapter_X_chunks.json   →   Structured JSON for RAG ingestion
  chapter_X_raw.txt       →   Plain text ground-truth reference for audit/QA

Files included:
  chapter_1_chunks.json / chapter_1_raw.txt   — Mental Contamination (15 chunks)
  chapter_2_chunks.json / chapter_2_raw.txt   — The Three Insights (7 chunks)
  chapter_3_chunks.json / chapter_3_raw.txt   — The ABCs of How Emotions Are Created (9 chunks)
  chapter_4_chunks.json / chapter_4_raw.txt   — The Seven Irrational Beliefs (35 chunks)
  chapter_5_chunks.json / chapter_5_raw.txt   — The Formula for Anger (9 chunks)
  chapter_6_chunks.json / chapter_6_raw.txt   — The Formula for Anxiety (16 chunks)
  chapter_7_chunks.json / chapter_7_raw.txt   — The Formula for Depression (12 chunks)
  chapter_8_chunks.json / chapter_8_raw.txt   — The Formula for Guilt (7 chunks)
  chapter_9_chunks.json / chapter_9_raw.txt   — The Formulas for Happiness (10 chunks)


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


CHAPTER 4 SPECIAL NOTE — TWO-TIER STRUCTURE
--------------------------------------------
Chapter 4 (Seven Irrational Beliefs) uses a two-tier architecture:

  Tier 1 (9 chunks): Chapter-wide frameworks applicable across all 7 IBs
    — Red-Flagging, Disputing, 4 Steps to Disputing, S.O.S. Framework,
      4 Challenge Questions, Cognitive Stoppage, If/Then Logic, Master IB List,
      Physiological Effects

  Tier 2 (26 chunks): Per each of the 7 IBs — definition, red-flag phrase list,
      disputing method, and case examples where present

This structure optimizes retrieval precision for the highest-utility chapter
in the dataset.


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


QUESTIONS
----------
Direct all dataset questions to Cale.
=========================================
