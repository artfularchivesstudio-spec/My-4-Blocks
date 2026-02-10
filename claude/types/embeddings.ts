/**
 * 🎭 The Type Sanctuary - Type definitions for our mystical oracle ✨
 */

export interface EmbeddedChunk {
  id: string
  text: string
  embedding: number[]
  block_type: "Anger" | "Anxiety" | "Depression" | "Guilt" | "General"
  metadata: {
    chunk_index: number
    token_count: number
    block: string
  }
}

export interface EmbeddingsData {
  version: string
  model: string
  total_chunks: number
  chunks: EmbeddedChunk[]
  metadata: {
    source: string
    author: string
    blocks: string[]
    description: string
  }
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
  block?: "Anger" | "Anxiety" | "Depression" | "Guilt" | "General"
  sources?: string[]
}

export interface ChatRequest {
  message: string
  history?: ChatMessage[]
}

export interface ChatResponse {
  message: string
  block?: string
  sources: EmbeddedChunk[]
}
