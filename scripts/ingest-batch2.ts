#!/usr/bin/env npx tsx
/**
 * 🔮 The Batch-2 Alchemist - Transform Emotion Blueprints into Vector Wisdom ✨
 *
 * "Where carefully crafted emotional guidance becomes searchable crystals,
 * embedding Depression, Anger, Guilt, and Anxiety into the cosmic RAG tapestry."
 *
 * This script processes CLEAN batch-2 training data from content/training/batch-2/clean/:
 * - depression.json (14 chunks)
 * - anger.json (14 chunks)
 * - guilt.json (14 chunks)
 * - anxiety.json (9 chunks)
 *
 * - The Mystical Batch-2 Ingestion Orchestrator
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import OpenAI from "openai";
import * as dotenv from "dotenv";

// 🌟 Load environment variables from .env file
dotenv.config({ path: join(__dirname, "..", ".env") });

// 🔮 Initialize the OpenAI client - the portal to embedding magic
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 🎭 Configuration constants - the sacred parameters
const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 1536;
const BATCH_2_DIR = join(__dirname, "..", "content", "training", "batch-2", "clean");
const EMBEDDINGS_FILE = join(__dirname, "..", "shared", "data", "embeddings.json");

// 🌊 Type definitions for our cosmic data structures
interface RawChunk {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  keywords?: string[];
  related?: string[];
  audience?: string;
  category?: string;
  chapter?: string;
  section?: string;
  chunk?: string;
}

interface BlueprintFile {
  chapter: string;
  category: string;
  audience: string;
  chunks: RawChunk[];
}

interface ChunkMetadata {
  chapter: string;
  section: string;
  title: string;
  tags: string[];
  keywords: string[];
  related: string[];
  audience: string;
  category: string;
}

interface EmbeddedChunk {
  id: string;
  text: string;
  embedding: number[];
  block_type: string;
  metadata: ChunkMetadata;
}

interface ChapterInfo {
  code: string;
  name: string;
  count: number;
}

interface EmbeddingsDatabase {
  version: string;
  model: string;
  dimensions: number;
  total_chunks: number;
  chapters: ChapterInfo[];
  chunks: EmbeddedChunk[];
}

// 🎨 Map category names to chapter codes and display names
// Because every emotion deserves proper labeling, darling! 💅
const CATEGORY_MAP: Record<string, { code: string; name: string; blockType: string }> = {
  depression: { code: "DEP", name: "Depression", blockType: "Depression" },
  anger: { code: "ANG", name: "Anger", blockType: "Anger" },
  guilt: { code: "GUILT", name: "Guilt", blockType: "Guilt" },
  anxiety: { code: "ANX", name: "Anxiety", blockType: "Anxiety" },
};

/**
 * 🌊 Transform text into crystallized vector wisdom
 *
 * Takes the raw content and alchemizes it into a 1536-dimensional
 * vector that captures semantic meaning. ✨
 *
 * @param text - The wisdom to be transformed
 * @returns A promise containing the sacred embedding vector
 */
async function getEmbedding(text: string): Promise<number[]> {
  const response = await client.embeddings.create({
    input: text,
    model: EMBEDDING_MODEL,
  });
  return response.data[0].embedding;
}

/**
 * 🔍 Extract JSON from wrapper text - The Great Unwrapping Ritual
 *
 * Some batch-2 files have chatty wrapper text around the actual JSON.
 * This function surgically extracts the pure JSON goodness within.
 *
 * Think of it as peeling an artisanal onion - layers of commentary,
 * then BAM! Pure JSON gold. 🧅✨
 *
 * @param content - The full file content with potential wrapper text
 * @returns The extracted JSON string, ready for parsing
 */
function extractJSON(content: string): string {
  // 🎭 Find both potential starting characters
  const firstBrace = content.indexOf("{");
  const firstBracket = content.indexOf("[");

  // 🔮 Determine which comes first - object or array
  // If array bracket comes before object brace (or no object brace exists),
  // we're dealing with a JSON array like anxiety.json
  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
    // 🌟 It's an array - find the matching closing bracket
    const lastBracket = content.lastIndexOf("]");
    if (lastBracket === -1) {
      throw new Error("🌩️ Found opening bracket but no closing bracket!");
    }
    return content.substring(firstBracket, lastBracket + 1);
  }

  // 🎭 It's an object (or object wrapped in chatty text)
  if (firstBrace === -1) {
    throw new Error("🌩️ No JSON structure found in content!");
  }
  const lastBrace = content.lastIndexOf("}");
  if (lastBrace === -1) {
    throw new Error("🌩️ Found opening brace but no closing brace!");
  }

  return content.substring(firstBrace, lastBrace + 1);
}

/**
 * 📖 Read and parse a batch-2 file - The File Whisperer
 *
 * Handles both wrapped JSON files (Depression, Anger, Guilt blueprints)
 * and pure JSON arrays (anxiety.txt).
 *
 * @param filename - The name of the file to read
 * @returns An array of raw chunks ready for embedding
 */
function readBatch2File(filename: string): { chunks: RawChunk[]; category: string } {
  const filepath = join(BATCH_2_DIR, filename);
  console.log(`📖 Reading: ${filename}`);

  const rawContent = readFileSync(filepath, "utf-8");

  // 🎪 Extract the JSON from wrapper text
  const jsonString = extractJSON(rawContent);

  try {
    const parsed = JSON.parse(jsonString);

    // 🔮 Handle both object format (blueprints) and array format (anxiety)
    if (Array.isArray(parsed)) {
      // 🌟 Pure array format (json_anxiety.txt)
      const firstChunk = parsed[0];
      const category = firstChunk?.category || "anxiety";
      console.log(`  💎 Found ${parsed.length} chunks (array format, category: ${category})`);
      return { chunks: parsed, category };
    } else {
      // 🎭 Object format (blueprints with chapter/category/audience wrapper)
      const chunks = parsed.chunks || [];
      const category = parsed.category || "unknown";
      console.log(`  💎 Found ${chunks.length} chunks (object format, category: ${category})`);
      return { chunks, category };
    }
  } catch (error) {
    console.error(`💥 😭 Failed to parse JSON from ${filename}:`, error);
    throw error;
  }
}

/**
 * 🎨 Transform a raw chunk into an embedded chunk - The Embedding Forge
 *
 * Takes a raw chunk from the batch-2 files and transforms it into
 * a fully-fledged embedded chunk with vector magic and metadata.
 *
 * @param chunk - The raw chunk data
 * @param category - The emotion category (depression, anger, etc.)
 * @param embedding - The pre-computed embedding vector
 * @returns A beautifully structured embedded chunk
 */
function createEmbeddedChunk(
  chunk: RawChunk,
  category: string,
  embedding: number[]
): EmbeddedChunk {
  const categoryInfo = CATEGORY_MAP[category] || { code: "GEN", name: "General", blockType: "General" };

  return {
    id: chunk.id || chunk.chunk || `batch2_${category}_${Date.now()}`,
    text: chunk.content,
    embedding,
    block_type: categoryInfo.blockType,
    metadata: {
      chapter: chunk.chapter || categoryInfo.code,
      section: chunk.section || "",
      title: chunk.title || "",
      tags: chunk.tags || [],
      keywords: chunk.keywords || [],
      related: chunk.related || [],
      audience: (chunk.audience as "general" | "first_responder") || "general",
      category: category,
    },
  };
}

/**
 * 📊 Update chapter counts in the database - The Census Taker
 *
 * After adding new chunks, we need to update (or add) chapter
 * statistics. This function handles the counting ceremony.
 *
 * @param chapters - Existing chapter info array
 * @param category - The category being added
 * @param count - Number of chunks being added
 * @returns Updated chapter info array
 */
function updateChapterCounts(
  chapters: ChapterInfo[],
  category: string,
  count: number
): ChapterInfo[] {
  const categoryInfo = CATEGORY_MAP[category];
  if (!categoryInfo) {
    console.log(`🌙 ⚠️ Unknown category: ${category}, skipping chapter update`);
    return chapters;
  }

  const existingIndex = chapters.findIndex((c) => c.code === categoryInfo.code);
  if (existingIndex >= 0) {
    // 🔄 Update existing chapter count
    chapters[existingIndex].count += count;
  } else {
    // ✨ Add new chapter entry
    chapters.push({
      code: categoryInfo.code,
      name: categoryInfo.name,
      count,
    });
  }

  return chapters;
}

/**
 * 🚀 The Grand Orchestration - Main ingestion ceremony
 *
 * 1. Load existing embeddings database
 * 2. Process each batch-2 file
 * 3. Generate embeddings for all chunks
 * 4. Merge into existing database
 * 5. Save the crystallized wisdom
 *
 * May the embeddings be ever in your favor! 🏹
 */
async function main(): Promise<void> {
  console.log("🌐 ✨ BATCH-2 INGESTION AWAKENS!");
  console.log("━".repeat(60));

  // 🔑 Check for API key
  if (!process.env.OPENAI_API_KEY) {
    console.error("💥 😭 OPENAI_API_KEY not found!");
    console.log("🌙 Please set it in your .env file");
    process.exit(1);
  }

  // 📖 Load existing embeddings database
  console.log("\n📚 Loading existing embeddings database...");
  let database: EmbeddingsDatabase;
  try {
    const existingData = readFileSync(EMBEDDINGS_FILE, "utf-8");
    database = JSON.parse(existingData);
    console.log(`  💎 Loaded ${database.total_chunks} existing chunks`);
  } catch (error) {
    console.error("💥 😭 Failed to load embeddings database:", error);
    process.exit(1);
  }

  // 🎭 The clean batch-2 files to process (51 total chunks)
  const batch2Files = [
    "depression.json",
    "anger.json",
    "guilt.json",
    "anxiety.json",
  ];

  // 🌟 Collect all new chunks
  const allNewChunks: { chunk: RawChunk; category: string }[] = [];
  const categoryCounts: Record<string, number> = {};

  console.log("\n🔍 Scanning batch-2 files...");
  console.log("━".repeat(60));

  for (const filename of batch2Files) {
    try {
      const { chunks, category } = readBatch2File(filename);
      for (const chunk of chunks) {
        allNewChunks.push({ chunk, category });
      }
      categoryCounts[category] = (categoryCounts[category] || 0) + chunks.length;
    } catch (error) {
      console.error(`💥 😭 Failed to process ${filename}:`, error);
      // Continue with other files
    }
  }

  console.log("\n📊 Summary of chunks to embed:");
  for (const [category, count] of Object.entries(categoryCounts)) {
    console.log(`  🎭 ${category}: ${count} chunks`);
  }
  console.log(`  📦 Total: ${allNewChunks.length} chunks`);

  // 🌊 Generate embeddings for all chunks
  console.log("\n🔮 Generating embeddings...");
  console.log("━".repeat(60));

  const newEmbeddedChunks: EmbeddedChunk[] = [];
  const existingIds = new Set(database.chunks.map((c) => c.id));

  for (let i = 0; i < allNewChunks.length; i++) {
    const { chunk, category } = allNewChunks[i];

    // 🚫 Skip if chunk ID already exists
    if (existingIds.has(chunk.id || chunk.chunk || "")) {
      console.log(`🌙 ⚠️ Skipping duplicate: ${chunk.id || chunk.chunk}`);
      continue;
    }

    // 🌟 Skip empty content
    if (!chunk.content?.trim()) {
      console.log(`🌙 ⚠️ Skipping empty chunk: ${chunk.id || chunk.chunk}`);
      continue;
    }

    console.log(`🎪 📦 [${i + 1}/${allNewChunks.length}] Embedding: ${chunk.id || chunk.chunk || chunk.title?.substring(0, 30)}...`);

    try {
      const embedding = await getEmbedding(chunk.content);
      const embeddedChunk = createEmbeddedChunk(chunk, category, embedding);
      newEmbeddedChunks.push(embeddedChunk);

      // 🌙 Small delay to respect rate limits - we're civilized folk
      if (i % 10 === 9) {
        console.log("  ☕ Brief meditation... (rate limit kindness)");
        await new Promise((r) => setTimeout(r, 500));
      }
    } catch (error) {
      console.error(`💥 😭 Failed to embed chunk ${chunk.id}:`, error);
    }
  }

  console.log(`\n🎉 ✨ EMBEDDING MASTERPIECE COMPLETE!`);
  console.log(`  🌟 New chunks embedded: ${newEmbeddedChunks.length}`);

  // 🔄 Merge new chunks into database
  console.log("\n💾 Merging into database...");
  database.chunks.push(...newEmbeddedChunks);
  database.total_chunks = database.chunks.length;

  // 📊 Update chapter counts
  for (const [category, count] of Object.entries(categoryCounts)) {
    database.chapters = updateChapterCounts(database.chapters, category, count);
  }

  // 🎨 Update version to reflect batch-2 addition
  database.version = "3.1";

  // 💎 Save the crystallized wisdom
  console.log(`\n💎 Crystallizing wisdom to: ${EMBEDDINGS_FILE}`);
  writeFileSync(EMBEDDINGS_FILE, JSON.stringify(database, null, 2));

  // 📊 Final summary
  console.log("\n" + "━".repeat(60));
  console.log("📊 Final Database Summary:");
  console.log(`  📦 Total chunks: ${database.total_chunks}`);
  console.log(`  🔮 Embedding model: ${database.model}`);
  console.log(`  📐 Dimensions: ${database.dimensions}`);
  console.log("\n  🎭 Chapters:");
  for (const chapter of database.chapters.sort((a, b) => b.count - a.count)) {
    console.log(`    ${chapter.code} (${chapter.name}): ${chapter.count} chunks`);
  }

  console.log("\n✨ 🎊 BATCH-2 INGESTION RITUAL COMPLETE!");
  console.log("🔮 Your wisdom crystals are ready for RAG retrieval");
  console.log("━".repeat(60));
}

// 🚀 Launch the cosmic ingestion ceremony
main().catch((error) => {
  console.error("💥 😭 Fatal error during ingestion:", error);
  process.exit(1);
});
