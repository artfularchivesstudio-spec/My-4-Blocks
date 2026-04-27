
import { loadEmbeddings, retrieveKeywordOnly } from './shared/lib/rag.ts';
import { keywordSearch } from './shared/lib/keywordSearch.ts';
import * as fs from 'fs';

const embeddings = JSON.parse(fs.readFileSync('./shared/data/embeddings.json', 'utf8'));
loadEmbeddings(embeddings);

const query = 'I should have known better';
const results = keywordSearch(query, embeddings.chunks, 5);

console.log('Query:', query);
console.log('Results:', results.map(r => ({
  id: r.chunk.id,
  block_type: r.chunk.block_type,
  score: r.score,
  text: r.chunk.text.substring(0, 50) + '...'
})));

const expectedBlock = 'Guilt';
const matchingBlock = results.some(r => r.chunk.block_type === expectedBlock);
console.log('Matching block found:', matchingBlock);
