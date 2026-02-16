/**
 * 🌐 The API Portal - OpenAI client orchestration ✨
 *
 * "Where human questions become crystallized wisdom through the cosmic API."
 */

import { OpenAI } from "openai"

// 🔮 Lazy initialize the OpenAI client at runtime, not build time
let openaiInstance: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set. Please configure it in Vercel environment variables.")
  }
  
  if (!openaiInstance) {
    openaiInstance = new OpenAI({
      apiKey: apiKey,
    })
  }
  return openaiInstance
}

/**
 * 🌐 Generate embeddings for semantic search
 * Transforms text into dimensional wisdom for retrieval
 */
export async function getEmbedding(text: string): Promise<number[]> {
  console.log("🌐 ✨ EMBEDDING REQUEST ENTERS THE PORTAL!")

  try {
    const openai = getOpenAIClient()
    const response = await openai.embeddings.create({
      input: text,
      model: "text-embedding-3-small",
    })

    console.log("✨ 🎊 EMBEDDING PORTAL TRANSFORMATION COMPLETE!")
    return response.data[0].embedding
  } catch (error) {
    console.error("Embedding error:", error)
    if (error instanceof Error && (error.message.includes("API key") || error.message.includes("401"))) {
      throw new Error("OpenAI API key is invalid or expired. Please check your Vercel environment variables.")
    }
    throw error
  }
}

/**
 * 🎭 Stream a response from the oracle
 * Returns an async generator for real-time wisdom delivery
 */
export async function* streamChat(
  systemPrompt: string,
  userMessage: string,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>
): AsyncGenerator<string, void, unknown> {
  console.log("🌐 ✨ CHAT STREAM AWAKENS!")

  try {
    const openai = getOpenAIClient()
    const messages = [
      ...conversationHistory.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user" as const, content: userMessage },
    ]

    const stream = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages,
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 1024,
    })

    for await (const chunk of stream) {
      if (chunk.choices[0]?.delta?.content) {
        yield chunk.choices[0].delta.content
      }
    }

    console.log("🎉 ✨ CHAT STREAM MASTERPIECE COMPLETE!")
  } catch (error) {
    console.error("Stream chat error:", error)
    if (error instanceof Error && (error.message.includes("API key") || error.message.includes("401") || error.message.includes("authentication"))) {
      throw new Error("OpenAI API key is invalid or expired. Please check your Vercel environment variables.")
    }
    throw error
  }
}
