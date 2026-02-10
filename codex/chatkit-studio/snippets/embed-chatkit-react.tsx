/**
 * 🎭 `My4BlocksChat` — The Pocket Coach Portal
 *
 * "A small window where intentions become commitments,
 *  and commitments become the day's quiet victories."
 *
 * - The Spellbinding Museum Director of Tiny-but-Mighty UI
 *
 * Notes:
 * - This is a **copy/paste starting point** based on the OpenAI ChatKit docs.
 * - You must implement a server endpoint that returns `{ client_secret }`.
 */

import { ChatKit, useChatKit } from "@openai/chatkit-react";

/**
 * 🌟 Summon the ChatKit widget — without summoning chaos.
 *
 * This mounts a ChatKit chat widget connected to your workflow (via a client secret).
 * If you implement refresh logic, you can reuse `existing` to renew sessions.
 *
 * (Whimsical warning) 🧙‍♂️: do not store the `client_secret` long-term; it’s a hot potato.
 */
export function My4BlocksChat() {
  const { control } = useChatKit({
    api: {
      async getClientSecret(existing) {
        if (existing) {
          // TODO: implement session refresh (server should mint a new client_secret).
          // 😇 Future-you will thank present-you for not ignoring this forever.
        }

        const res = await fetch("/api/chatkit/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const { client_secret } = (await res.json()) as { client_secret: string };
        return client_secret;
      },
    },
  });

  return <ChatKit control={control} className="h-[600px] w-[360px]" />;
}

