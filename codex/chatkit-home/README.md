## `codex/chatkit-home` — Standalone ChatKit Home

This is a **separate Next.js app** that lives in `codex/` so it doesn’t touch the `v0/` app.

### What it does

- Embeds ChatKit using `@openai/chatkit-react`
- Loads the ChatKit runtime script
- Mints ChatKit sessions from `/api/chatkit/session`
- Uses theming options from:
  - `https://platform.openai.com/docs/guides/chatkit-themes`

### Required env vars

- `OPENAI_API_KEY`
- `CHATKIT_WORKFLOW_ID` (starts with `wf_`, from Agent Builder publish)

### Run locally

```bash
cd codex/chatkit-home
pnpm install
pnpm dev
```

### Deploy on Vercel

```bash
cd codex/chatkit-home
vercel --prod
```

