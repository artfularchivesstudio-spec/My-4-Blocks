/**
 * 🎭 The RAG Orchestrator - Unified Retrieval System ✨
 *
 * "Where all the cosmic forces unite,
 * bringing wisdom to those who seek."
 *
 * This is the main entry point for the RAG system.
 * Coordinates embedding generation, hybrid search,
 * and graph expansion into a seamless experience.
 *
 * - The Supreme RAG Conductor
 */

import type {
  EmbeddedChunk,
  ScoredChunk,
  HybridSearchOptions,
  RetrievalResult,
  EmbeddingsDatabase,
  PageIndexData,
  GraphWikiData,
} from "./types";
import { getQueryEmbedding } from "./embeddings";
import { hybridSearch, hybridSearchKeywordOnly } from "./hybridSearch";
import { expandWithRelated, formatExpandedContext } from "./graphExpansion";
import { formatContextForPrompt } from "./vectorSearch";

// 🔮 Cached databases
let embeddingsCache: EmbeddingsDatabase | null = null;
let pageIndexCache: PageIndexData | null = null;
let graphWikiCache: GraphWikiData | null = null;

/**
 * 🌟 Load the RAG databases
 *
 * Loads the pre-computed embeddings, page index, and graph wiki.
 *
 * @param embeddingsData - The parsed JSON from embeddings.json
 * @param pageIndexData - The parsed JSON from page_index.json
 * @param graphWikiData - The parsed JSON from graph_wiki.json
 */
export function loadEmbeddings(
  embeddingsData: EmbeddingsDatabase,
  pageIndexData?: PageIndexData,
  graphWikiData?: GraphWikiData
): void {
  console.log(`🌐 ✨ RAG DATABASES LOADING!`);
  
  if (embeddingsData) {
    console.log(`📊 Embeddings: ${embeddingsData.total_chunks} chunks, ${embeddingsData.model} model`);
    embeddingsCache = embeddingsData;
  }

  if (pageIndexData) {
    console.log(`📚 Page Index: ${Object.keys(pageIndexData.pages).length} pages loaded`);
    pageIndexCache = pageIndexData;
  }

  if (graphWikiData) {
    console.log(`🕸️ Graph Wiki: ${graphWikiData.nodes.length} nodes, ${graphWikiData.edges.length} edges`);
    graphWikiCache = graphWikiData;
  }

  console.log(`💎 Databases loaded and cached`);
}

/**
 * 🔮 Get the loaded embeddings database
 *
 * Returns the cached embeddings or throws if not loaded.
 */
export function getEmbeddings(): EmbeddingsDatabase {
  if (!embeddingsCache) {
    throw new Error("🌩️ Embeddings not loaded! Call loadEmbeddings() first.");
  }
  return embeddingsCache;
}

/**
 * 🌊 Perform full RAG retrieval with optional graph expansion
 *
 * This is the main function to call for RAG retrieval.
 * It handles:
 * 1. Query embedding generation
 * 2. Hybrid search (semantic + keyword)
 * 3. Optional graph expansion via cross-links
 * 4. Formatted context for LLM
 *
 * @param query - The user's question or search query
 * @param options - Search configuration options
 * @returns Full retrieval result with context
 */
export async function retrieve(
  query: string,
  options: HybridSearchOptions = {}
): Promise<RetrievalResult> {
  console.log(`🎭 ✨ RAG RETRIEVAL AWAKENS!`);
  const startTime = Date.now();

  const embeddings = getEmbeddings();
  const allChunks = embeddings.chunks;

  // 🔮 Step 1: Generate query embedding
  const queryEmbedding = await getQueryEmbedding(query);

  // 🌊 Step 2: Hybrid search
  const searchResults = hybridSearch(query, queryEmbedding, allChunks, options);

  // 🕸️ Step 3: Optional graph expansion
  let expandedChunks: EmbeddedChunk[] = [];
  if (options.expandRelated !== false) {
    expandedChunks = expandWithRelated(
      searchResults,
      allChunks,
      options.maxExpansion || 2
    );
  }

  const searchTime = Date.now() - startTime;

  console.log(`🎉 ✨ RAG RETRIEVAL COMPLETE in ${searchTime}ms`);
  console.log(`📊 ${searchResults.length} main + ${expandedChunks.length} expanded`);

  return {
    chunks: searchResults,
    expandedChunks,
    queryEmbedding,
    totalMatches: searchResults.length + expandedChunks.length,
    searchTime,
  };
}

/**
 * 📚 Search for relevant pages in the Page Index
 * 
 * Uses keyword matching to find pages that discuss the query.
 * Returns formatted page excerpts with citations.
 */
export function findRelevantPageIndex(query: string, limit: number = 2): string {
  if (!pageIndexCache) return "";

  const queryLower = query.toLowerCase();
  const searchTerms = queryLower.split(/\s+/).filter(t => t.length > 3);
  
  const scoredPages: { pageNum: string, text: string, score: number }[] = [];

  for (const [pageNum, text] of Object.entries(pageIndexCache.pages)) {
    let score = 0;
    for (const term of searchTerms) {
      if (text.toLowerCase().includes(term)) {
        score += 1;
        // Bonus for exact phrase if query has multiple words
        if (queryLower.length > 5 && text.toLowerCase().includes(queryLower)) {
          score += 5;
        }
      }
    }
    if (score > 0) {
      scoredPages.push({ pageNum, text, score });
    }
  }

  const results = scoredPages
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  if (results.length === 0) return "";

  return results.map(r => `[Page ${r.pageNum}]: ${r.text.substring(0, 500)}...`).join("\n\n");
}

/**
 * 🕸️ Search for relevant nodes and connections in the Graph Wiki
 * 
 * Finds nodes that match the query and returns their descriptions
 * and their primary relationships.
 */
export function findRelevantGraphConnections(query: string, limit: number = 3): string {
  if (!graphWikiCache) return "";

  const queryLower = query.toLowerCase();
  
  // Find matching nodes
  const matchingNodes = graphWikiCache.nodes.filter(node => 
    node.label.toLowerCase().includes(queryLower) || 
    node.description.toLowerCase().includes(queryLower) ||
    node.id.toLowerCase().includes(queryLower)
  ).slice(0, limit);

  if (matchingNodes.length === 0) return "";

  const sections: string[] = [];

  for (const node of matchingNodes) {
    let nodeContext = `### ${node.label} (${node.category})\n${node.description}`;
    
    // Find related edges
    const relatedEdges = graphWikiCache.edges.filter(edge => 
      edge.source === node.id || edge.target === node.id
    ).slice(0, 3);

    if (relatedEdges.length > 0) {
      const connections = relatedEdges.map(edge => {
        const otherNodeId = edge.source === node.id ? edge.target : edge.source;
        const otherNode = graphWikiCache?.nodes.find(n => n.id === otherNodeId);
        return `- ${edge.relation}: ${otherNode?.label || otherNodeId}`;
      }).join("\n");
      nodeContext += `\nConnections:\n${connections}`;
    }
    
    sections.push(nodeContext);
  }

  return sections.join("\n\n");
}

/**
 * 🌟 Quick retrieval without embedding generation
 *
 * Falls back to keyword-only search when the embedding API
 * is unavailable or for faster response times.
 */
export function retrieveKeywordOnly(
  query: string,
  topK: number = 5
): ScoredChunk[] {
  const embeddings = getEmbeddings();
  return hybridSearchKeywordOnly(query, embeddings.chunks, topK);
}

/**
 * 🎨 Get formatted context for LLM prompt
 *
 * Convenience function that retrieves and formats context
 * in a single call. Returns a string ready for the system prompt.
 */
export async function getRAGContext(
  query: string,
  options: HybridSearchOptions & { includeExpanded?: boolean; includePageIndex?: boolean; includeGraphWiki?: boolean } = {}
): Promise<string> {
  const result = await retrieve(query, options);
  let context = "";

  if (options.includeExpanded !== false && result.expandedChunks?.length) {
    context = formatExpandedContext(result.chunks, result.expandedChunks);
  } else {
    context = formatContextForPrompt(result.chunks, true);
  }

  // 📚 Add Page Index context if requested
  if (options.includePageIndex !== false && pageIndexCache) {
    const pageContext = findRelevantPageIndex(query);
    if (pageContext) {
      context += `\n\n## Direct Book Citations (PageIndex)\n${pageContext}`;
    }
  }

  // 🕸️ Add Graph Wiki context if requested
  if (options.includeGraphWiki !== false && graphWikiCache) {
    const graphContext = findRelevantGraphConnections(query);
    if (graphContext) {
      context += `\n\n## Conceptual Connections (GraphWiki)\n${graphContext}`;
    }
  }

  return context;
}

/**
 * 🔍 Search for relevant wisdom (simplified API)
 *
 * The simplest way to use the RAG system.
 * Returns just the formatted context string.
 *
 * @param query - The user's question
 * @param limit - Maximum number of results (default: 5)
 * @returns Formatted context string for LLM
 */
export async function findRelevantWisdom(
  query: string,
  limit: number = 5
): Promise<string> {
  try {
    return await getRAGContext(query, { topK: limit });
  } catch (error) {
    console.error(`💥 😭 RAG retrieval failed, falling back to keywords:`, error);

    // 🌙 Fallback to keyword-only search
    const keywordResults = retrieveKeywordOnly(query, limit);
    return formatContextForPrompt(keywordResults, true);
  }
}

/**
 * 📊 Get RAG system statistics
 *
 * Returns information about the loaded knowledge base.
 */
export function getRAGStats(): {
  totalChunks: number;
  model: string;
  chapters: Array<{ code: string; name: string; count: number }>;
  isLoaded: boolean;
} {
  if (!embeddingsCache) {
    return {
      totalChunks: 0,
      model: "not loaded",
      chapters: [],
      isLoaded: false,
    };
  }

  return {
    totalChunks: embeddingsCache.total_chunks,
    model: embeddingsCache.model,
    chapters: embeddingsCache.chapters,
    isLoaded: true,
  };
}
