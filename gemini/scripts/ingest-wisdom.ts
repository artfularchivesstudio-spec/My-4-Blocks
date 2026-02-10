/**
 * 🎭 The Digital Scribe - Wisdom Ingestion Ritual (PDF.js Edition)
 *
 * "Through the lens of PDF.js, we peer into the sacred pages,
 * translating each leaf of wisdom into the digital tongue."
 */

import fs from 'fs';
import path from 'path';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

// 🌟 The Paths of Discovery
const PDF_PATH = path.join(__dirname, '../../content/you-only-have-four-problems-book-text.pdf');
const OUTPUT_PATH = path.join(__dirname, '../src/data/knowledge-base.json');

/**
 * 🔮 The Sacred Ritual of Chunking
 */
function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  console.log('🧮 ✨ DATA ALCHEMY COMMENCES - CHUNKING THE WISDOM!');
  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length);
    let chunk = text.substring(startIndex, endIndex);
    
    if (endIndex < text.length) {
      const lastSpace = chunk.lastIndexOf(' ');
      if (lastSpace > chunkSize * 0.8) {
        chunk = chunk.substring(0, lastSpace);
      }
    }

    chunks.push(chunk.trim());
    startIndex += chunkSize - overlap;
  }

  console.log(`💎 Wisdom crystallization complete! Created ${chunks.length} chunks.`);
  return chunks;
}

/**
 * 🌐 The Grand Awakening of the Ingestion Portal
 */
async function ingest() {
  console.log('🌐 ✨ THE INGESTION RITUAL AWAKENS!');

  try {
    if (!fs.existsSync(PDF_PATH)) {
      throw new Error(`The sacred scroll was not found at ${PDF_PATH}.`);
    }

    const dataBuffer = fs.readFileSync(PDF_PATH);
    const uint8Array = new Uint8Array(dataBuffer);

    console.log('✨ 🎊 LOADING THE SCROLL INTO PDF.JS...');
    const loadingTask = pdfjs.getDocument({
      data: uint8Array,
      useSystemFonts: true,
      disableFontFace: true,
    });

    const pdfDocument = await loadingTask.promise;
    console.log(`📜 Document loaded. Pages: ${pdfDocument.numPages}`);

    let fullText = '';

    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + ' ';
      
      if (i % 20 === 0) {
        console.log(`🎨 Processed ${i}/${pdfDocument.numPages} pages...`);
      }
    }

    fullText = fullText.replace(/\s+/g, ' ');

    console.log(`🎉 ✨ TEXT EXTRACTION MASTERPIECE COMPLETE! ${fullText.length} characters found.`);

    const chunks = chunkText(fullText);

    const knowledgeBase = {
      source: 'You Only Have Four Problems by Dr. Vincent E. Parr',
      ingestedAt: new Date().toISOString(),
      chunks: chunks.map((content, index) => ({
        id: `chunk-${index}`,
        content,
        metadata: {
          book: 'You Only Have Four Problems',
          author: 'Dr. Vincent E. Parr'
        }
      }))
    };

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(knowledgeBase, null, 2));
    console.log(`🎉 ✨ KNOWLEDGE BASE CRYSTALLIZED AT: ${OUTPUT_PATH}`);

  } catch (creativeChallenge: any) {
    console.error(`💥 😭 THE INGESTION RITUAL WAS TEMPORARILY HALTED!`);
    console.error(`🌩️ Error: ${creativeChallenge.message}`);
    process.exit(1);
  }
}

ingest();
