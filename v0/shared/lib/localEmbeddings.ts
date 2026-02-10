/**
 * 🤖 The Local Oracle - STUB VERSION ✨
 *
 * This is a stub that doesn't actually use @xenova/transformers
 * to avoid Vercel deployment issues with sharp dependency.
 *
 * The RAG system uses OpenAI embeddings instead.
 *
 * - The Local Embedding Stub
 */

// Stub exports - these functions throw if called
export async function initializeLocalEmbeddings(): Promise<void> {
  throw new Error('Local embeddings disabled in production - use OpenAI mode');
}

export async function getLocalEmbedding(_text: string): Promise<number[]> {
  throw new Error('Local embeddings disabled in production - use OpenAI mode');
}

export async function getLocalEmbeddings(_texts: string[]): Promise<number[][]> {
  throw new Error('Local embeddings disabled in production - use OpenAI mode');
}

export function getEmbeddingDimension(): number {
  return 384;
}

export function isLocalEmbeddingsReady(): boolean {
  return false;
}

export function localCosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function findSimilarLocal(
  _query: string,
  _documents: string[],
  _topK?: number
): Promise<{ index: number; similarity: number; text: string }[]> {
  throw new Error('Local embeddings disabled in production - use OpenAI mode');
}

export async function testLocalEmbeddings(): Promise<void> {
  console.log('🌙 Local embeddings are disabled in production');
}
