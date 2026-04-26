import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

/**
 * 📊 Admin Reports API - Viewing the GEPA Ritual Results ✨
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reportPath = searchParams.get('path');

  const rootDir = path.resolve(process.cwd(), '..');

  if (reportPath) {
    try {
      const fullPath = path.join(rootDir, reportPath);
      
      // 🛡️ Security check
      if (!fullPath.includes('docs/GEPA-DSPy-m1/hermes-agent-self-evolution/output')) {
        return NextResponse.json({ error: 'Unauthorized path' }, { status: 403 });
      }

      const content = await fs.readFile(fullPath, 'utf-8');
      return NextResponse.json({ content });
    } catch (error) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }
  }

  try {
    const outputDir = path.join(rootDir, 'docs/GEPA-DSPy-m1/hermes-agent-self-evolution/output');
    const reports = await getReportsRecursive(outputDir);
    return NextResponse.json({ reports });
  } catch (error) {
    return NextResponse.json({ reports: [] });
  }
}

async function getReportsRecursive(dir: string): Promise<any[]> {
  try {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const results = await Promise.all(dirents.map(async (dirent) => {
      const res = path.resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        return getReportsRecursive(res);
      } else {
        const stats = await fs.stat(res);
        return {
          name: dirent.name,
          path: path.relative(path.resolve(process.cwd(), '..'), res),
          size: stats.size,
          mtime: stats.mtime,
        };
      }
    }));
    return Array.prototype.concat(...results);
  } catch {
    return [];
  }
}
