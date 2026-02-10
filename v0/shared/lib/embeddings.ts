/**
 * 🔮 The Embedding Portal - Query Vectorization ✨
 *
 * "Transform questions into mathematical journeys,
 * where meaning becomes numbers that dance with wisdom."
 *
 * Supports BOTH OpenAI API (1536 dims) and local Transformers.js (384 dims).
 * Use `setEmbeddingMode()` to switch between online/offline modes.
 *
 * - The Query Vectorization Virtuoso
 */

import OpenAI from "openai";
import { getLocalEmbedding, getLocalEmbeddings, initializeLocalEmbeddings } from "./localEmbeddings";

// 🌟 Embedding model configurations
const OPENAI_MODEL = "text-embedding-3-small";
const OPENAI_DIMENSIONS = 1536;
const LOCAL_DIMENSIONS = 384;

// 🔮 Embedding mode: 'openai' or 'local'
type EmbeddingMode = 'openai' | 'local';
let currentMode: EmbeddingMode = 'openai';

// 🔮 Lazy-initialized OpenAI client
let openaiClient: OpenAI | null = null;

/**
 * 🎛️ Set the embedding mode
 *
 * 'openai' - Uses OpenAI's text-embedding-3-small (1536 dims, requires API key)
 * 'local' - Uses Transformers.js all-MiniLM-L6-v2 (384 dims, runs offline)
 *
 * NOTE: If switching to 'local', you need embeddings generated with the local model!
 * The pre-computed embeddings use OpenAI (1536 dims) by default.
 */
export async function setEmbeddingMode(mode: EmbeddingMode): Promise<void> {
  console.log(`🎛️ ✨ EMBEDDING MODE: ${mode.toUpperCase()}`);
  currentMode = mode;

  if (mode === 'local') {
    // 🤖 Pre-initialize local model for faster first query
    await initializeLocalEmbeddings();
    console.log(`🏠 Local embeddings ready - running fully offline!`);
  }
}

/**
 * 🔍 Get the current embedding mode
 */
export function getEmbeddingMode(): EmbeddingMode {
  return currentMode;
}

/**
 * 🌊 Initialize or retrieve the OpenAI client
 *
 * Uses lazy initialization to avoid issues with missing
 * API keys at module load time.
 */
function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("🌩️ OPENAI_API_KEY not found in environment");
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

/**
 * 🌟 Generate embedding for a query string
 *
 * Uses either OpenAI or local Transformers.js based on current mode.
 *
 * @param query - The user's question or search query
 * @returns The embedding vector as an array of numbers
 */
export async function getQueryEmbedding(query: string): Promise<number[]> {
  if (currentMode === 'local') {
    return getQueryEmbeddingLocal(query);
  }
  return getQueryEmbeddingOpenAI(query);
}

/**
 * 🌐 Generate embedding using OpenAI API
 *
 * Transforms user query text into a 1536-dimensional vector
 * using OpenAI's text-embedding-3-small model.
 */
async function getQueryEmbeddingOpenAI(query: string): Promise<number[]> {
  console.log(`🌐 ✨ OPENAI EMBEDDING AWAKENS!`);
  console.log(`📝 Embedding: "${query.substring(0, 50)}..."`);

  const startTime = Date.now();

  try {
    const client = getOpenAIClient();
    const response = await client.embeddings.create({
      input: query,
      model: OPENAI_MODEL,
    });

    const embedding = response.data[0].embedding;
    const duration = Date.now() - startTime;

    console.log(`💎 OpenAI embedding: ${duration}ms (${embedding.length} dims)`);
    return embedding;
  } catch (error) {
    console.error(`💥 😭 OpenAI embedding failed:`, error);
    throw error;
  }
}

/**
 * 🏠 Generate embedding using local Transformers.js
 *
 * Transforms user query text into a 384-dimensional vector
 * using the all-MiniLM-L6-v2 model. Runs fully offline!
 */
async function getQueryEmbeddingLocal(query: string): Promise<number[]> {
  console.log(`🏠 ✨ LOCAL EMBEDDING AWAKENS!`);
  console.log(`📝 Embedding: "${query.substring(0, 50)}..."`);

  const startTime = Date.now();

  try {
    const embedding = await getLocalEmbedding(query);
    const duration = Date.now() - startTime;

    console.log(`💎 Local embedding: ${duration}ms (${embedding.length} dims)`);
    return embedding;
  } catch (error) {
    console.error(`💥 😭 Local embedding failed:`, error);
    throw error;
  }
}

/**
 * 🎨 Generate embeddings for multiple texts (batch)
 *
 * Uses current mode (OpenAI or local) for batch processing.
 */
export async function getBatchEmbeddings(texts: string[]): Promise<number[][]> {
  if (currentMode === 'local') {
    console.log(`🏠 ✨ BATCH LOCAL EMBEDDING! (${texts.length} texts)`);
    return getLocalEmbeddings(texts);
  }

  console.log(`🌐 ✨ BATCH OPENAI EMBEDDING! (${texts.length} texts)`);
  const startTime = Date.now();

  try {
    const client = getOpenAIClient();
    const response = await client.embeddings.create({
      input: texts,
      model: OPENAI_MODEL,
    });

    // 🎯 Sort by index to maintain order
    const sorted = response.data.sort((a, b) => a.index - b.index);
    const embeddings = sorted.map((d) => d.embedding);

    const duration = Date.now() - startTime;
    console.log(`💎 Batch embeddings: ${duration}ms`);

    return embeddings;
  } catch (error) {
    console.error(`💥 😭 Batch embedding failed:`, error);
    throw error;
  }
}

/**
 * 🔍 Get embedding model info
 *
 * Returns metadata about the embedding model being used.
 */
export function getEmbeddingModelInfo(): {
  mode: EmbeddingMode;
  model: string;
  dimensions: number;
} {
  if (currentMode === 'local') {
    return {
      mode: 'local',
      model: 'all-MiniLM-L6-v2',
      dimensions: LOCAL_DIMENSIONS,
    };
  }
  return {
    mode: 'openai',
    model: OPENAI_MODEL,
    dimensions: OPENAI_DIMENSIONS,
  };
}

/**
 * 🌙 Validate an embedding vector
 *
 * Checks if a vector is valid for use with our search system.
 * Validates against current mode's expected dimensions.
 */
export function validateEmbedding(embedding: unknown): embedding is number[] {
  if (!Array.isArray(embedding)) {
    return false;
  }

  const expectedDims = currentMode === 'local' ? LOCAL_DIMENSIONS : OPENAI_DIMENSIONS;

  if (embedding.length !== expectedDims) {
    console.warn(`🌙 ⚠️ Wrong embedding dimension: ${embedding.length} (expected ${expectedDims} for ${currentMode} mode)`);
    return false;
  }

  // Check all elements are numbers
  return embedding.every((n) => typeof n === "number" && !isNaN(n));
}

/**
 * 📏 Get expected embedding dimensions for current mode
 */
export function getExpectedDimensions(): number {
  return currentMode === 'local' ? LOCAL_DIMENSIONS : OPENAI_DIMENSIONS;
}
