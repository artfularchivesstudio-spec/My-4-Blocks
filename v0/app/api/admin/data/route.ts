import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

/**
 * 📂 Admin Data API - The Sacred Archive of Three Corpora ✨
 *
 * "Three roots beneath the codebase tree —
 *  legacy whispers, v1 source-truth, and GEPA's evaluation symphony.
 *  All paths must dwell within these hallowed halls,
 *  or face the 403 banishment of the Museum Director."
 *
 * - The Spellbinding Museum Director of Training Data
 *
 * 🛡️ Permitted corpus roots (relative to repo root):
 *   1. content/training/                                  → 'legacy'         (paraphrased corpus, original behavior)
 *   2. docs/GEPA-DSPy-m1/refined-rag-dataset v1/          → 'v1'             (canonical Layer 1 source-faithful corpus)
 *   3. docs/GEPA-DSPy-m1/hermes-agent-self-evolution/datasets/  → 'gepa-datasets' (GEPA train/val/holdout JSONL)
 */

// 🎭 Corpus tag — which sacred archive a file belongs to
type CorpusTag = 'legacy' | 'v1' | 'gepa-datasets';

// 🌟 A permitted corpus root — its tag and relative path beneath the repo
interface CorpusRoot {
  corpus: CorpusTag;
  relPath: string;
}

// 📜 An entry in the listing — path + corpus + size
interface CorpusEntry {
  path: string;
  corpus: CorpusTag;
  size?: number;
}

// 🏰 The three permitted corpus roots — relative paths from the repo root.
//    Note the literal space before "v1" in the second entry; that is intentional
//    and must be preserved exactly as the directory is named on disk.
const CORPUS_ROOTS: CorpusRoot[] = [
  { corpus: 'legacy',         relPath: 'content/training' },
  { corpus: 'v1',             relPath: 'docs/GEPA-DSPy-m1/refined-rag-dataset v1' },
  { corpus: 'gepa-datasets',  relPath: 'docs/GEPA-DSPy-m1/hermes-agent-self-evolution/datasets' },
];

// 💎 Only these extensions are interesting — everything else (PDFs, binaries, .DS_Store)
//     is gracefully filtered into the cosmic void.
const ALLOWED_EXTENSIONS = new Set(['.json', '.jsonl', '.txt', '.md']);

// 🛡️ The Bouncer at the Door — resolves a user-supplied relative path against
//    the repo root and verifies it sits within ONE of our three permitted roots.
//    Returns the matching corpus tag + absolute path on success, or null on banishment.
function resolveAgainstAllowedRoots(
  rootDir: string,
  userPath: string
): { fullPath: string; corpus: CorpusTag } | null {
  // 🌟 Convert the supplied relative path into an absolute path
  const fullPath = path.resolve(rootDir, userPath);

  // 🔮 Check each permitted root, blessing the first that matches
  for (const root of CORPUS_ROOTS) {
    const absRoot = path.join(rootDir, root.relPath);
    // 🎨 Path must START with the absolute root + separator (or BE the root) —
    //    prevents prefix-collision attacks like 'content/training-evil-twin'
    if (fullPath === absRoot || fullPath.startsWith(absRoot + path.sep)) {
      return { fullPath, corpus: root.corpus };
    }
  }
  // 🌩️ No root claimed this wayward path — banishment awaits
  return null;
}

// 📜 The Standard 403 Banishment — same shape for read AND write rejections
function banishedResponse() {
  return NextResponse.json(
    { error: 'Path not in allowed corpus roots: legacy training, v1, or gepa-datasets' },
    { status: 403 }
  );
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get('path');

  // 🏰 Root of the project (outside of v0)
  const rootDir = path.resolve(process.cwd(), '..');

  if (filePath) {
    // 📖 Read a specific file — must dwell within one of the three sacred roots
    const resolved = resolveAgainstAllowedRoots(rootDir, filePath);
    if (!resolved) {
      return banishedResponse();
    }

    try {
      const content = await fs.readFile(resolved.fullPath, 'utf-8');
      return NextResponse.json({ content, corpus: resolved.corpus });
    } catch (error) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
  }

  // 📜 List files across ALL THREE permitted roots, each tagged with its corpus.
  //    Missing roots are tolerated gracefully — not every dev has every dir checked out.
  const entries = await getFilesAcrossRoots(rootDir, CORPUS_ROOTS);

  // 🎭 BREAKING CHANGE: response now includes `entries: { path, corpus, size }[]`.
  //    Backward-compatible: `files: string[]` is preserved so the existing
  //    TrainingDataTab.tsx (which destructures `data.files`) continues to render.
  //    TrainingDataTab should be upgraded next phase to render the corpus badge.
  const files = entries.map((e) => e.path);
  return NextResponse.json({ files, entries });
}

export async function POST(req: Request) {
  try {
    const { filePath, content } = await req.json();
    const rootDir = path.resolve(process.cwd(), '..');

    // 🛡️ Writes must also land within one of the three sacred roots
    const resolved = resolveAgainstAllowedRoots(rootDir, filePath);
    if (!resolved) {
      return banishedResponse();
    }

    // 📝 Ensure directory exists — recursive mkdir is forgiving
    await fs.mkdir(path.dirname(resolved.fullPath), { recursive: true });

    // ✍️ Inscribe the wisdom upon the parchment
    await fs.writeFile(resolved.fullPath, content, 'utf-8');

    return NextResponse.json({ success: true, corpus: resolved.corpus });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
  }
}

// 🌐 The Cosmic Gatherer — sweeps across all permitted roots, tagging each
//    discovered scroll with its corpus of origin. Silently skips roots that
//    don't exist (so partial checkouts don't crash the listing).
async function getFilesAcrossRoots(
  rootDir: string,
  roots: CorpusRoot[]
): Promise<CorpusEntry[]> {
  // 🎪 Run all three root-walks in parallel — each yields a tagged batch
  const batches = await Promise.all(
    roots.map(async (root) => {
      const absRoot = path.join(rootDir, root.relPath);
      try {
        return await getFilesRecursive(absRoot, rootDir, root.corpus);
      } catch {
        // 🌙 Gentle reminder: this root may not exist yet on this dev's machine
        return [] as CorpusEntry[];
      }
    })
  );
  // 💎 Flatten the parallel batches into one crystallized listing
  return batches.flat();
}

// 🔮 The Recursive Scroll-Hunter — descends a single root, tagging every
//    surviving file with the supplied corpus name. Filters out the boring
//    bits (.DS_Store, hidden files, binaries, PDFs) before they pollute the listing.
async function getFilesRecursive(
  dir: string,
  baseDir: string,
  corpus: CorpusTag
): Promise<CorpusEntry[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const nestedBatches = await Promise.all(
    dirents.map(async (dirent): Promise<CorpusEntry[]> => {
      // 🌩️ Skip hidden files (.DS_Store, .gitkeep, .env, etc.) — they have no place here
      if (dirent.name.startsWith('.')) {
        return [];
      }

      const res = path.resolve(dir, dirent.name);

      if (dirent.isDirectory()) {
        // 🎪 Descend recursively — the scroll-hunt continues
        return getFilesRecursive(res, baseDir, corpus);
      }

      // 💎 Only keep extensions we actually care about
      const ext = path.extname(dirent.name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return [];
      }

      // 📐 Capture size for richer UI rendering downstream
      let size: number | undefined;
      try {
        const stat = await fs.stat(res);
        size = stat.size;
      } catch {
        // 🌊 If stat fails we still surface the file, just sans size
        size = undefined;
      }

      return [{
        path: path.relative(baseDir, res),
        corpus,
        size,
      }];
    })
  );
  // 🎉 Flatten and return — the corpus is mapped, the directory conquered
  return nestedBatches.flat();
}
