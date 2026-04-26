import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

/**
 * 📂 Admin Data API - Managing the Sacred Training Corpus ✨
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get('path');

  // 🏰 Root of the project (outside of v0)
  const rootDir = path.resolve(process.cwd(), '..');

  if (filePath) {
    // 📖 Read a specific file
    try {
      const fullPath = path.join(rootDir, filePath);
      
      // 🛡️ Security check: ensure path is within content/training
      if (!fullPath.startsWith(path.join(rootDir, 'content/training'))) {
        return NextResponse.json({ error: 'Unauthorized path' }, { status: 403 });
      }

      const content = await fs.readFile(fullPath, 'utf-8');
      return NextResponse.json({ content });
    } catch (error) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
  }

  // 📜 List all files in training directory
  try {
    const trainingDir = path.join(rootDir, 'content/training');
    const files = await getFilesRecursive(trainingDir, 'content/training');
    return NextResponse.json({ files });
  } catch (error) {
    return NextResponse.json({ files: [] });
  }
}

export async function POST(req: Request) {
  try {
    const { filePath, content } = await req.json();
    const rootDir = path.resolve(process.cwd(), '..');
    const fullPath = path.join(rootDir, filePath);

    // 🛡️ Security check: ensure path is within content/training
    if (!fullPath.startsWith(path.join(rootDir, 'content/training'))) {
      return NextResponse.json({ error: 'Unauthorized path' }, { status: 403 });
    }

    // 📝 Ensure directory exists
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    
    // ✍️ Write the file
    await fs.writeFile(fullPath, content, 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
  }
}

async function getFilesRecursive(dir: string, baseDir: string): Promise<string[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() 
      ? getFilesRecursive(res, baseDir) 
      : path.relative(path.resolve(process.cwd(), '..'), res);
  }));
  return Array.prototype.concat(...files);
}
