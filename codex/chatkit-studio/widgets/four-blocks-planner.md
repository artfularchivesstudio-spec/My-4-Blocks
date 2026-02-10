## Widget Spec — “4 Blocks Planner”

### What this widget is for

Collect the user’s **4 Blocks for today**, then confirm/lock them in as a lightweight commitment ritual.

### Layout

- **Header**
  - Title: “Today’s 4 Blocks”
  - Subtitle: Today’s date (e.g., “Fri, Jan 30”)
- **Body**
  - Four repeated rows/sections:
    - **Block # (1–4) label**
    - **Title** (required)
    - **Why it matters** (optional, 1–2 sentences)
    - **Time box** (optional; dropdown: 15m / 30m / 45m / 1h / 2h)
  - Small helper text:
    - “If it isn’t a Block, it isn’t happening.”
- **Footer**
  - Primary button: “Commit my 4 Blocks”
  - Secondary action: “Suggest Blocks” (if titles empty)

### Interaction rules

- Validate **title required** for each block.
- If the user leaves 1–2 blocks blank, allow:
  - “Commit the ones I have” (and mark missing as “Intentionally empty”)
  - OR “Suggest Blocks” based on their stated goals.
- After commit, show a compact confirmation state:
  - “Locked. Now win the next hour.”

### Microcopy (tight + coach-y)

- Empty state hint: “Pick 4. Everything else is noise.”
- Validation: “Give this Block a name.”
- Success: “Committed. The day is yours.”

### Optional enhancement (nice-to-have)

Add a tiny “Confidence” selector (Low / Medium / High) per block.

