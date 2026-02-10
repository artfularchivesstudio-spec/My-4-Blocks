# v0 Text-to-UI Prompt for My 4 Blocks

Copy the prompt below into [v0.dev](https://v0.dev) to generate a UI that matches this project’s purpose and structure.

---

## Prompt (paste this into v0)

```
Build a single-page web UI for "My 4 Blocks" — a daily planning and emotional wellness app based on CBT/REBT (Albert Ellis / Seth Hagan style). The product is inspired by the idea "You Only Have Four Problems" and the book of the same name.

**Core concept**
- User picks exactly 4 "blocks" (focus areas) for the day. Tagline: "Pick 4. Everything else is noise." and "If it isn't a Block, it isn't happening."
- The 4 blocks are also emotional domains: Anger, Anxiety, Depression, Guilt — each with a distinct color (e.g. red, amber, blue, emerald).
- Each block has: a short title, an optional "Why it matters" line, and a time box selector: 15m, 30m, 1h, 2h.

**What to build**
1. **Hero / planner section**
   - Heading: "Today's 4 Blocks" with a date or "Today" caption.
   - Four repeated sections (Block 1 … Block 4). For each: label ("Block 1"), editable title (placeholder: "Name it."), optional "Why it matters" (placeholder), and a time-box dropdown (15m, 30m, 1h, 2h). Use dividers between blocks.
   - Footer line: "If it isn't a Block, it isn't happening." in muted text.
   - Primary CTA: "Commit my 4 Blocks".

2. **Daily plan summary card** (compact, can sit below or in a sidebar)
   - "Morning Intention" with a short line of text and a sun icon.
   - "Today's Focus Areas": four small badges, one per block (Anger, Anxiety, Depression, Guilt), each with a colored dot and label; optional tooltip/prompt per block.
   - An italic affirmation line with a sparkles icon.
   - Optional "View Full Plan" link/button.

3. **"How it works" steps** (numbered list or cards)
   - Step 1: Share your situation — tell us what happened and how you feel.
   - Step 2: Discover your block — we identify which of the 4 blocks is active.
   - Step 3: Find the belief — uncover the irrational belief behind the emotion.
   - Step 4: Question & transform — disputation questions to challenge the belief.
   - Step 5: Find peace — replace with rational alternatives.
   Use simple icons (message, search, brain, help, sun) and soft background tints per step.

4. **Concept / belief card** (reusable component)
   - Title, short content (1–2 sentences), and a category badge (e.g. ABC Model, Irrational Belief, Disputation, General). Use distinct border/background colors per category. Optional "Learn more" link.

5. **Navigation**
   - Header with logo/brand "My 4 Blocks" and links: How It Works, The Framework, About, The Book, FAQ, Privacy. Include a "New chat" or reset-style button. Mobile: hamburger menu.

**Design**
- Feel calm, clear, and a bit "magical" — not corporate or generic. Use a serif or distinctive font for headings.
- Subtle ambient background (e.g. very soft gradient or noise) and card-style sections with light borders/shadows.
- Color-code the four blocks consistently (Anger=red, Anxiety=amber, Depression=blue, Guilt=emerald/green).
- Use shadcn/ui-style primitives if possible: Card, Button, Select, Input, subtle dividers, muted text for captions.
- Dark mode friendly: use semantic tokens (e.g. background, foreground, muted, border) so it works in light and dark.

**Tech**
- Next.js App Router, React, TypeScript. Use Tailwind CSS. Prefer client components only where interactivity is needed.
```

---

## Usage

1. Go to [v0.dev](https://v0.dev).
2. Paste the prompt above (the block starting with "Build a single-page web UI...").
3. Generate and iterate (e.g. "add dark mode", "make the 4 blocks a form with validation", "add the concept card twice with different categories").

## Customization ideas

- **Chat-first**: "Add a chat layout: left or center main area with message list and input; right or below, the Today's 4 Blocks planner card and a daily plan summary card."
- **Framework page**: "Add a second page 'The Framework' with accordions: one section for each of the 4 blocks (Anger, Anxiety, Depression, Guilt) with core pattern, trigger thoughts, and healthy alternative; another section listing 7 irrational beliefs with title, short description, and antidote."
- **Suggested prompts**: "Below the chat input, add 3–4 suggested prompt chips (e.g. 'Help me plan my 4 blocks', 'I'm feeling anxious about work', 'Explain the ABC model') that prefill the input on click."

---

*Generated from the My-4-Blocks codebase for use with v0.dev.*
