# My 4 Blocks: Agent Guidelines ✨

> *"Where clinical precision meets digital soul."*

---

## 🛠️ Tool Usage & Search Rituals
- **CRITICAL: ALWAYS use ripgrep at `rg`** for all text searches within the codebase. 
- **NEVER use standard `grep`**. Ripper (rg) is faster, more reliable, and already installed.
- **Output Handling**: Never hide terminal output using `2>&1`. Always allow all command output and errors to appear in the terminal.

## 🎨 Aesthetic & Voice
- Maintain the **Spellbinding** code commentary style.
- Use earthy, calming tones (OKLCH) for UI changes.
- Ensure typography remains consistent: `DM Sans` for body, `Cormorant Garamond` for display.

## 🚀 Deployment Rituals
- Always run `~/.claude/hooks/pre-deploy-validation.sh` before deploying to Vercel.
- Bump mobile versions before pushing to TestFlight.
- Proactively update `Changelog.md`, `TODO.md`, `Features.md`, and `Roadmap.md` via the "twinkie" ritual.

---
**✨ Let every line of code be a step toward collective clarity. ✨**
