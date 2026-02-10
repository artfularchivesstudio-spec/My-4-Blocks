## Usage Notes (ChatKit + Widget Builder)

### 1) Embed ChatKit in a web app (recommended integration)

The OpenAI docs describe the end-to-end setup:

- Create a ChatKit session on your server and return `{ client_secret }`.
- Install the React bindings: `npm install @openai/chatkit-react`
- Add the ChatKit loader script.
- Mount the ChatKit UI and fetch the client secret from your server.

Source: `https://platform.openai.com/docs/guides/chatkit` (see “Set up ChatKit in your product”).

**Copy/paste helpers in this repo**

- Server: `./snippets/fastapi-chatkit-session.py`
- Frontend: `./snippets/embed-chatkit-react.tsx`
- Script tag: `./snippets/chatkit-script-tag.html`

### 2) Build widgets with ChatKit Studio

If you’re building an **advanced (self-hosted) ChatKit** integration, widgets let agents render rich UI in the chat surface.

The OpenAI docs explicitly point to the Widget Builder here:

- Widget Builder: `https://widgets.chatkit.studio/`
- Advanced ChatKit guide: `https://platform.openai.com/docs/guides/custom-chatkit`

**How to use the prompts here**

- Start with: `./starting-prompt.md`
- Then choose a spec from `./widgets/` and iterate until it feels right.

### 3) Two critical “don’t shoot yourself” notes

- **Don’t store client secrets**: the docs emphasize you hand the `client_secret` to the client and don’t persist it.
- **Keep widgets small**: widgets live inside chat; speed + clarity > feature creep.

