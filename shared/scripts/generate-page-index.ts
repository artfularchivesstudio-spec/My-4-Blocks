/**
 * 🔮 The PageIndex Generation Ritual ✨
 * 
 * "Weaving the thread of pages into a tapestry of structure,
 * so the seeker may find exactly what they seek."
 */

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import { PageIndex } from '../lib/pageIndex';

async function generate() {
  const pdfPath = path.resolve(__dirname, '../../content/Four blocks paperback book (full).pdf');
  const outputDir = path.resolve(__dirname, '../data');

  console.log(`🌐 ✨ PAGEINDEX GENERATION AWAKENS!`);
  console.log(`📜 PDF Source: ${pdfPath}`);
  console.log(`💎 Output Directory: ${outputDir}`);

  const pageIndex = new PageIndex();
  
  try {
    await pageIndex.indexPDF(pdfPath, outputDir);
    console.log('🎉 ✨ RITUAL COMPLETE! THE TREE IS CRYSTALLIZED.');
  } catch (error) {
    console.error('💥 😭 THE RITUAL WAS INTERRUPTED!');
    console.error(error);
    process.exit(1);
  }
}

generate();
