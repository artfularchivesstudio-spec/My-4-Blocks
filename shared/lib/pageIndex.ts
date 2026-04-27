/**
 * 🎭 The PageIndex Oracle - Structural PDF Retrieval ✨
 * 
 * "Where the tree of knowledge branches deep,
 * and every leaf reveals its numbered place."
 * 
 * Uses VectifyAI/PageIndex logic for hierarchical, page-level indexing.
 */

import fs from 'fs';
import path from 'path';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import OpenAI from 'openai';

// 🌟 Types for our Mystical Tree
export interface PageIndexNode {
  title: string;
  node_id: string;
  start_page: number;
  end_page: number;
  summary: string;
  nodes?: PageIndexNode[];
}

export interface PageIndexData {
  title: string;
  pages: { [key: number]: string };
  tree: PageIndexNode;
}

export class PageIndex {
  private openai: OpenAI;
  private data: PageIndexData | null = null;

  constructor(apiKey?: string) {
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
  }

  /**
   * 📜 Load a crystallized index from disk
   */
  async loadIndex(indexPath: string): Promise<void> {
    const rawData = fs.readFileSync(indexPath, 'utf-8');
    this.data = JSON.parse(rawData);
  }

  /**
   * 🔍 Search for wisdom within the tree
   */
  async search(query: string, topK: number = 3): Promise<{ page: number; content: string; score: number }[]> {
    if (!this.data) throw new Error("PageIndex not loaded. Run loadIndex() first.");
    
    console.log(`🔍 🧙‍♂️ PEERING INTO THE TREE FOR: "${query}"`);

    // 🌟 Step 1: Find the most relevant chapters using the tree
    const chapterScores = await Promise.all(this.data.tree.nodes?.map(async (node) => {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ 
          role: "user", 
          content: `On a scale of 0-10, how relevant is this chapter to the query?
          Query: ${query}
          Chapter: ${node.title}
          Summary: ${node.summary}
          Return only the number.` 
        }],
      });
      return { node, score: parseFloat(response.choices[0].message.content || "0") };
    }) || []);

    const bestChapters = chapterScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);

    console.log(`📚 Focused on chapters: ${bestChapters.map(c => c.node.title).join(', ')}`);

    // 🌟 Step 2: Search within the pages of the best chapters
    const candidatePages: { page: number; content: string; score: number }[] = [];
    
    for (const { node } of bestChapters) {
      for (let p = node.start_page; p <= node.end_page; p++) {
        const text = this.data.pages[p];
        if (!text) continue;

        // Simple keyword matching for speed in this example
        const keywords = query.toLowerCase().split(' ');
        let score = 0;
        keywords.forEach(kw => {
          if (text.toLowerCase().includes(kw)) score += 1;
        });

        if (score > 0) {
          candidatePages.push({ page: p, content: text, score });
        }
      }
    }

    return candidatePages
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  /**
   * 🏗️ Index a PDF and crystallize its structure
   */
  async indexPDF(pdfPath: string, outputDir: string): Promise<void> {
    console.log('🌐 ✨ COMMENCING PDF INDEXING RITUAL...');
    
    const dataBuffer = fs.readFileSync(pdfPath);
    const uint8Array = new Uint8Array(dataBuffer);

    const loadingTask = pdfjs.getDocument({
      data: uint8Array,
      useSystemFonts: true,
      disableFontFace: true,
    });

    const pdfDocument = await loadingTask.promise;
    const numPages = pdfDocument.numPages;
    console.log(`📜 Scroll loaded with ${numPages} pages.`);

    const pages: { [key: number]: string } = {};
    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      pages[i] = pageText;
      
      if (i % 20 === 0) {
        console.log(`🎨 Captured ${i}/${numPages} pages...`);
      }
    }

    console.log('✨ 🎊 PAGES CAPTURED! NOW BUILDING THE HIERARCHICAL TREE...');

    // 🌟 Identify Chapters/Sections using LLM (simplified for now)
    // We'll process in chunks of 10 pages to find chapter markers
    const tree = await this.buildTree(pages, numPages);

    this.data = {
      title: path.basename(pdfPath),
      pages,
      tree,
    };

    const outputPath = path.join(outputDir, 'page_index.json');
    fs.writeFileSync(outputPath, JSON.stringify(this.data, null, 2));
    console.log(`🎉 ✨ PAGE INDEX CRYSTALLIZED AT: ${outputPath}`);
  }

  private async buildTree(pages: { [key: number]: string }, numPages: number): Promise<PageIndexNode> {
    console.log('🔍 Detecting document structure...');

    // 🌟 Extract a "mini-toc" by taking the first 200 characters of each page
    const pageSnapshots = Object.entries(pages)
      .map(([num, text]) => `Page ${num}: ${text.substring(0, 300)}...`)
      .join('\n');

    const prompt = `
      You are an expert document architect. I have extracted the first 300 characters of each page from a book.
      Your task is to identify the main chapters and their starting page numbers.
      
      Document Title: Four Blocks Paperback Book
      Total Pages: ${numPages}
      
      Page Snapshots:
      ${pageSnapshots}
      
      Return a JSON object with a 'chapters' key.
      Include all major chapters, specially the Four Blocks: Anger, Anxiety, Depression, and Guilt.
      Example: { "chapters": [{"title": "Introduction", "start_page": 1}, {"title": "The Anger Block", "start_page": 45}] }
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content || '{"chapters": []}';
    console.log('🔍 Raw LLM response:', content);
    const detected = JSON.parse(content);
    const chapterList: { title: string, start_page: number }[] = detected.chapters || [];

    console.log(`📜 Detected ${chapterList.length} chapters.`);

    const rootNode: PageIndexNode = {
      title: "Four Blocks Paperback Book",
      node_id: "root",
      start_page: 1,
      end_page: numPages,
      summary: "Comprehensive guide to emotional wellness using the Four Blocks methodology.",
      nodes: []
    };

    for (let i = 0; i < chapterList.length; i++) {
      const start = chapterList[i].start_page;
      const end = (i < chapterList.length - 1) ? chapterList[i+1].start_page - 1 : numPages;
      
      // Get a summary for this chapter
      const chapterText = Object.entries(pages)
        .filter(([num]) => parseInt(num) >= start && parseInt(num) <= end)
        .map(([_, text]) => text)
        .join(' ')
        .substring(0, 4000); // Sample the chapter

      const summaryResponse = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: `Summarize this chapter in 2 sentences: ${chapterText}` }],
      });

      rootNode.nodes?.push({
        title: chapterList[i].title,
        node_id: `ch_${i+1}`,
        start_page: start,
        end_page: end,
        summary: summaryResponse.choices[0].message.content || "Chapter summary unavailable.",
      });
    }

    return rootNode;
  }
}
