import { randomUUID } from 'crypto'
import { readFileSync } from 'fs'
import { join } from 'path'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DEVICE_COOKIE_NAME = 'my4blocks_device_id'

// 🌟 The mystical type definitions for our session alchemy
interface SessionRequestBody {
  existingSecret?: string
}

interface OpenAISessionResponse {
  client_secret?: string
  [key: string]: unknown
}

/**
 * 🗝️ Env Resolver — "Find the secret without shouting it." 🤫
 *
 * Supports:
 * - Vercel env vars (recommended)
 * - Local dev via repo-root `.env` (two levels up from this app)
 */
function getEnv(name: string): string | undefined {
  const direct = process.env[name]?.trim()
  if (direct) return direct

  try {
    // This app lives at `codex/chatkit-home`, so repo root is `../..`.
    const rootEnvPath = join(process.cwd(), '..', '..', '.env')
    const raw = readFileSync(rootEnvPath, 'utf-8')

    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIndex = trimmed.indexOf('=')
      if (eqIndex <= 0) continue

      const key = trimmed.slice(0, eqIndex).trim()
      if (key !== name) continue

      let value = trimmed.slice(eqIndex + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      return value.trim() || undefined
    }
  } catch {
    // Silent: local-dev convenience only.
  }

  return undefined
}

/**
 * 🔮 The Session Refresher — "When secrets grow stale, we conjure anew!" ✨
 *
 * Takes an existing client_secret and breathes new life into it via the
 * OpenAI refresh endpoint. Like a phoenix, but for API tokens. 🦅🔥
 *
 * @param existingSecret - The weary secret seeking renewal
 * @param openAIApiKey - Our mystical key to the OpenAI realm
 * @param domainKey - The domain sigil for authentication
 * @returns Fresh client_secret or throws if the spirits are displeased
 */
async function refreshSession(
  existingSecret: string,
  openAIApiKey: string,
  domainKey: string
): Promise<string> {
  // 🌐 ✨ SESSION REFRESH RITUAL COMMENCES!
  const refreshResponse = await fetch(
    'https://api.openai.com/v1/chatkit/sessions/refresh',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAIApiKey}`,
        'OpenAI-Beta': 'chatkit_beta=v1',
        'ChatKit-Domain-Key': domainKey,
      },
      body: JSON.stringify({
        client_secret: existingSecret,
      }),
    }
  )

  const responseJson = (await refreshResponse.json().catch(() => null)) as
    | OpenAISessionResponse
    | null

  if (!refreshResponse.ok) {
    // 🌩️ The refresh spirits have rejected our offering
    throw new Error(
      `Session refresh failed (${refreshResponse.status}): ${JSON.stringify(responseJson)}`
    )
  }

  const newSecret = responseJson?.client_secret
  if (!newSecret || typeof newSecret !== 'string') {
    // 🔮 The oracle speaks in riddles... no secret returned
    throw new Error('Session refresh response missing client_secret')
  }

  // 🎉 ✨ SESSION REFRESH MASTERPIECE COMPLETE!
  return newSecret
}

/**
 * 🎭 The Session Mint & Refresh Portal — "Fresh or renewed, secrets delivered!" 🍞✨
 *
 * Creates a new ChatKit session OR refreshes an existing one.
 *
 * POST body (optional):
 * - `existingSecret`: If provided, refreshes this secret instead of creating new
 *
 * Required env:
 * - `OPENAI_API_KEY`
 * - `CHATKIT_WORKFLOW_ID` (starts with `wf_`, from Agent Builder publish)
 * - `CHATKIT_DOMAIN_KEY` (starts with `domain_pk_`)
 *
 * Docs:
 * - `https://platform.openai.com/docs/guides/chatkit`
 * - `https://platform.openai.com/docs/guides/agent-builder`
 */
export async function POST(request: NextRequest) {
  const openAIApiKey = getEnv('OPENAI_API_KEY')
  const workflowId = getEnv('CHATKIT_WORKFLOW_ID')
  const domainKey = getEnv('CHATKIT_DOMAIN_KEY')

  // 🔍 🧙‍♂️ Peering into the mystical request body for existing secrets...
  let requestBody: SessionRequestBody = {}
  try {
    requestBody = (await request.json()) as SessionRequestBody
  } catch {
    // 🌙 No body provided, that's perfectly fine for new sessions
  }

  if (!openAIApiKey) {
    return NextResponse.json(
      {
        error: 'Missing OPENAI_API_KEY.',
        docs: { chatkit: 'https://platform.openai.com/docs/guides/chatkit' },
      },
      { status: 400 }
    )
  }

  if (!domainKey) {
    return NextResponse.json(
      {
        error: 'Missing CHATKIT_DOMAIN_KEY.',
        hint: 'Register your domain at the OpenAI domain allowlist to get a domain key like "domain_pk_...".',
        docs: {
          domainAllowlist: 'https://platform.openai.com/settings/organization/security/domain-allowlist',
        },
      },
      { status: 400 }
    )
  }

  // 🔮 ✨ The Bifurcation of Destiny: Refresh or Create?
  if (requestBody.existingSecret) {
    // 🌟 A weary secret seeks renewal — invoke the refresh ritual!
    try {
      const refreshedSecret = await refreshSession(
        requestBody.existingSecret,
        openAIApiKey,
        domainKey
      )
      // 🎉 ✨ REFRESH COMPLETE! The phoenix rises anew!
      return NextResponse.json({ client_secret: refreshedSecret })
    } catch (creativeChallenge) {
      // 🌩️ Refresh failed — but the show must go on...
      // Fall through to create a brand new session instead
      console.warn(
        '🌊 ⚠️ Session refresh failed, creating fresh session:',
        creativeChallenge instanceof Error
          ? creativeChallenge.message
          : 'Unknown error'
      )
    }
  }

  // 🎭 No existing secret (or refresh failed) — mint a fresh session!
  if (!workflowId) {
    return NextResponse.json(
      {
        error: 'Missing CHATKIT_WORKFLOW_ID.',
        hint: 'Publish a workflow in Agent Builder to get a workflow id like "wf_...".',
        docs: {
          agentBuilder: 'https://platform.openai.com/docs/guides/agent-builder',
          chatkit: 'https://platform.openai.com/docs/guides/chatkit',
        },
      },
      { status: 400 }
    )
  }

  const jar = await cookies()
  const existingDeviceId = jar.get(DEVICE_COOKIE_NAME)?.value
  const deviceId = existingDeviceId ?? randomUUID()

  // 🌐 ✨ SESSION CREATION AWAKENS! Summoning fresh secrets...
  const createSessionResponse = await fetch(
    'https://api.openai.com/v1/chatkit/sessions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAIApiKey}`,
        'OpenAI-Beta': 'chatkit_beta=v1',
        'ChatKit-Domain-Key': domainKey,
      },
      body: JSON.stringify({
        workflow: { id: workflowId },
        user: deviceId,
      }),
    }
  )

  const responseJson = (await createSessionResponse.json().catch(() => null)) as
    | OpenAISessionResponse
    | null

  if (!createSessionResponse.ok) {
    return NextResponse.json(
      {
        error: 'Failed to create ChatKit session.',
        status: createSessionResponse.status,
        details: responseJson,
      },
      { status: 500 }
    )
  }

  const clientSecret = responseJson?.client_secret
  if (!clientSecret || typeof clientSecret !== 'string') {
    return NextResponse.json(
      { error: 'ChatKit session response missing client_secret.' },
      { status: 500 }
    )
  }

  const res = NextResponse.json({ client_secret: clientSecret })

  // 🍪 Stable "user" identity without full auth — a cookie, but make it cosmic ✨
  if (!existingDeviceId) {
    res.cookies.set({
      name: DEVICE_COOKIE_NAME,
      value: deviceId,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    })
  }

  // 🎉 ✨ FRESH SESSION MASTERPIECE COMPLETE!
  return res
}

