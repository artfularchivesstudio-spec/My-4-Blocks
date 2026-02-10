## ChatKit Studio Widgets — Start Here

This folder is a **Codex scratchpad** for building ChatKit widgets using the Widget Builder at `https://widgets.chatkit.studio/`.

### What this is

- **Goal**: help you quickly design “widgets” (rich UI cards/forms inside ChatKit) and also embed ChatKit on a website/app.
- **Inputs**: your product story + tone + the “4 Blocks” ritual.
- **Outputs**: prompts/specs/snippets you can copy into your real app/server.

### The key docs (pulled from OpenAI Developer Docs MCP)

- **Embed ChatKit in your frontend**: the recommended integration flow (session → client secret → script tag → mount widget) lives at:
  - `https://platform.openai.com/docs/guides/chatkit`
- **Advanced / self-hosted ChatKit + widgets** (includes a direct link to the Widget Builder):
  - `https://platform.openai.com/docs/guides/custom-chatkit`

### Files you’ll care about first

- **Starting prompt**: `./starting-prompt.md`
- **Widget prompts/specs**:
  - `./widgets/four-blocks-planner.md`
  - `./widgets/daily-retro.md`
- **Copy/paste integration snippets** (based on the docs above):
  - `./snippets/fastapi-chatkit-session.py`
  - `./snippets/embed-chatkit-react.tsx`
  - `./snippets/chatkit-script-tag.html`

### Minimal workflow (fastest path)

1. Open the Widget Builder: `https://widgets.chatkit.studio/`
2. Paste `starting-prompt.md` as your base instruction.
3. Then pick a widget spec from `./widgets/` and iterate.
4. When you’re ready to embed ChatKit in your app, use the snippets in `./snippets/`.

