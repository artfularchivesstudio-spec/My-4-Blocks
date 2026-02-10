import knowledgeBase from '@/data/knowledge-base.json';

/**
 * 🔮 The RAG Alchemist - Wisdom Retrieval Logic
 *
 * "Searching through the crystallized chunks of wisdom
 * to find the perfect verses for the seeker's inquiry."
 */

export interface Chunk {
  id: string;
  content: string;
  metadata: {
    book: string;
    author: string;
  };
}

export function findRelevantWisdom(query: string = '', limit: number = 5): string {
  // 🎨 Ensure we have a valid string to work with
  const safeQuery = String(query || '');
  console.log('🔍 Peering into the knowledge base for:', safeQuery);
  
  if (!safeQuery.trim()) {
    console.log('🌙 No query content, providing general context.');
    return (knowledgeBase.chunks as Chunk[]).slice(0, 3).map(c => c.content).join('\n\n');
  }

  const searchTerms = safeQuery.toLowerCase().split(' ').filter(term => term.length > 3);
  
  // 🎨 Simple scoring based on term frequency
  const scoredChunks = (knowledgeBase.chunks as Chunk[]).map(chunk => {
    let score = 0;
    const contentLower = chunk.content.toLowerCase();
    
    searchTerms.forEach(term => {
      if (contentLower.includes(term)) {
        score += 1;
        // 🌟 Bonus for exact matches of multiple terms
        const occurrences = contentLower.split(term).length - 1;
        score += occurrences * 0.1;
      }
    });
    
    return { chunk, score };
  });
  
  // 💎 Sort and take the best chunks
  const bestChunks = scoredChunks
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.chunk.content);
    
  if (bestChunks.length === 0) {
    console.log('🌙 ⚠️ No direct matches found, providing general context.');
    // Return a few random important chunks if no match found
    return (knowledgeBase.chunks as Chunk[]).slice(0, 3).map(c => c.content).join('\n\n');
  }
  
  console.log(`🎉 Found ${bestChunks.length} relevant wisdom fragments.`);
  return bestChunks.join('\n\n');
}
