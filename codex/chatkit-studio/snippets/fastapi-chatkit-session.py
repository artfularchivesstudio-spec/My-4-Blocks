"""
🎭 ChatKit Session Minting — The Secret Token Bakery 🍞✨

"Fresh client secrets, served warm (and never stored),
so the frontend may chat without summoning security demons."

- The Spellbinding Museum Director of Backend Rituals

This is a **starting point** based on the ChatKit docs:
`https://platform.openai.com/docs/guides/chatkit`
"""

from fastapi import FastAPI
from openai import OpenAI
import os

app = FastAPI()
openai = OpenAI(api_key=os.environ["OPENAI_API_KEY"])


@app.post("/api/chatkit/session")
def create_chatkit_session():
    """
    🌟 Mint a ChatKit session client secret.

    The client secret is what the ChatKit frontend uses to open/refresh a session.
    You **do not** persist it; you hand it to the client and let it expire like a mayfly.

    (Sassy security note) 🕵️: if you store these, your future incident postmortem will be *lengthy*.
    """
    session = openai.chatkit.sessions.create(
        {
            # TODO: Fill in your workflow and user identity.
            # Example shape (from docs): { workflow: { id: "wf_..." }, user: "deviceId-or-userId" }
        }
    )
    return {"client_secret": session.client_secret}

