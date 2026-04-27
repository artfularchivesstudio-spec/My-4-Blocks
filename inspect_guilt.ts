
import { loadEmbeddings } from './shared/lib/rag.ts';
import * as fs from 'fs';

const embeddings = JSON.parse(fs.readFileSync('./shared/data/embeddings.json', 'utf8'));
const guiltChunks = embeddings.chunks.filter(c => c.block_type === 'Guilt');

console.log('Guilt chunks:', guiltChunks.length);
guiltChunks.slice(0, 3).forEach(c => {
  console.log('---');
  console.log('ID:', c.id);
  console.log('Text:', c.text.substring(0, 200));
});
