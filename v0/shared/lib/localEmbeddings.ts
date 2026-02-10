/**
 * 🤖 The Local Oracle - Offline Embeddings with Transformers.js ✨
 *
 * "No cloud required, wisdom lives within.
 * Your data stays local, your insights stay free."
 *
 * Uses Hugging Face's all-MiniLM-L6-v2 model for 384-dimensional embeddings.
 * Runs entirely in Node.js or browser - no API calls! 🏠
 *
 * - The Local Embedding Maestro
 */

import { pipeline } from '@xenova/transformers';

// 🔮 Cached pipeline for reuse - using 'any' to handle transformers.js type variations
// The actual runtime type is FeatureExtractionPipeline, but we use any for flexibility
let embeddingPipeline: any = null;
let isInitializing = false;

/**
 * 🌟 Model configuration
 *
 * all-MiniLM-L6-v2: Great balance of speed and quality
 * - 384 dimensions (vs OpenAI's 1536)
 * - ~23MB model size
 * - Works offline after first download
 */
const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2';
const EMBEDDING_DIMENSION = 384;

/**
 * 🚀 Initialize the local embedding pipeline
 *
 * First call downloads the model (~23MB), subsequent calls use cache.
 * This runs fully offline after the initial download! 🏠
 */
export async function initializeLocalEmbeddings(): Promise<void> {
  if (embeddingPipeline) return;
  if (isInitializing) {
    // Wait for existing initialization
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return;
  }

  isInitializing = true;
  console.log('🤖 ✨ INITIALIZING LOCAL EMBEDDING MODEL...');
  console.log(`📦 Model: ${MODEL_NAME}`);

  try {
    embeddingPipeline = await pipeline('feature-extraction', MODEL_NAME, {
      // Use quantized model for faster inference
      quantized: true,
    });

    console.log('🎉 ✨ LOCAL EMBEDDINGS READY! Running fully offline 🏠');
  } catch (error) {
    console.error('💥 😭 Failed to initialize local embeddings:', error);
    throw error;
  } finally {
    isInitializing = false;
  }
}

/**
 * 🔮 Generate embedding for a single text
 *
 * @param text - The text to embed
 * @returns 384-dimensional embedding vector
 *
 * @example
 * const embedding = await getLocalEmbedding("I feel angry today");
 * console.log(embedding.length); // 384
 */
export async function getLocalEmbedding(text: string): Promise<number[]> {
  await initializeLocalEmbeddings();

  if (!embeddingPipeline) {
    throw new Error('Local embedding pipeline not initialized');
  }

  console.log(`🔮 Generating local embedding for: "${text.substring(0, 50)}..."`);

  // 🌟 Generate embedding with mean pooling
  const output = await embeddingPipeline(text, {
    pooling: 'mean',
    normalize: true,
  });

  // 🎨 Extract the embedding array
  const embedding = Array.from(output.data as Float32Array);

  console.log(`✨ Generated ${embedding.length}-dim embedding locally`);
  return embedding;
}

/**
 * 🌊 Generate embeddings for multiple texts (batch processing)
 *
 * @param texts - Array of texts to embed
 * @returns Array of 384-dimensional embedding vectors
 */
export async function getLocalEmbeddings(texts: string[]): Promise<number[][]> {
  await initializeLocalEmbeddings();

  if (!embeddingPipeline) {
    throw new Error('Local embedding pipeline not initialized');
  }

  console.log(`🌊 ✨ BATCH EMBEDDING ${texts.length} texts locally...`);

  const embeddings: number[][] = [];

  for (let i = 0; i < texts.length; i++) {
    const text = texts[i];
    const output = await embeddingPipeline(text, {
      pooling: 'mean',
      normalize: true,
    });

    embeddings.push(Array.from(output.data as Float32Array));

    // Progress logging for large batches
    if ((i + 1) % 10 === 0) {
      console.log(`📊 Progress: ${i + 1}/${texts.length} texts embedded`);
    }
  }

  console.log(`🎉 ✨ BATCH COMPLETE! ${embeddings.length} embeddings generated`);
  return embeddings;
}

/**
 * 📊 Get the embedding dimension for this model
 */
export function getEmbeddingDimension(): number {
  return EMBEDDING_DIMENSION;
}

/**
 * 🔍 Check if local embeddings are available/initialized
 */
export function isLocalEmbeddingsReady(): boolean {
  return embeddingPipeline !== null;
}

/**
 * 📏 Compute cosine similarity between two vectors
 *
 * This is the same algorithm as in vectorSearch.ts,
 * duplicated here for convenience when using local embeddings.
 */
export function localCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error(`Vector dimension mismatch: ${vecA.length} vs ${vecB.length}`);
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

/**
 * 🎯 Find most similar texts using local embeddings
 *
 * @param query - Query text
 * @param candidates - Array of candidate texts to compare against
 * @param topK - Number of top results to return
 * @returns Array of { text, similarity } sorted by similarity
 */
export async function findSimilarLocal(
  query: string,
  candidates: string[],
  topK: number = 5
): Promise<Array<{ text: string; similarity: number; index: number }>> {
  // 🔮 Generate query embedding
  const queryEmbedding = await getLocalEmbedding(query);

  // 🌊 Generate candidate embeddings
  const candidateEmbeddings = await getLocalEmbeddings(candidates);

  // 📊 Calculate similarities
  const results = candidates.map((text, index) => ({
    text,
    index,
    similarity: localCosineSimilarity(queryEmbedding, candidateEmbeddings[index]),
  }));

  // 🏆 Sort by similarity and return top K
  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

/**
 * 🧪 Test the local embeddings with a sample query
 */
export async function testLocalEmbeddings(): Promise<void> {
  console.log('🧪 ✨ TESTING LOCAL EMBEDDINGS...\n');

  const testQueries = [
    'I feel so angry and frustrated',
    'I am worried about the future',
    'Nothing makes me happy anymore',
    'I should have done better',
  ];

  for (const query of testQueries) {
    const embedding = await getLocalEmbedding(query);
    console.log(`Query: "${query}"`);
    console.log(`Embedding: [${embedding.slice(0, 3).map(n => n.toFixed(4)).join(', ')}...] (${embedding.length} dims)\n`);
  }

  console.log('🎉 Local embeddings test complete!');
}
