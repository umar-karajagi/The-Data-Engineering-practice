import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parseJupyterNotebook, formatBytes } from '@/lib/notebookParser';
import { processRawBookText } from '@/lib/bookParser';
import { getEnhancedPdfMetadata } from '@/content/books/pdfBookMetadata';
import { BookReference } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const vaultDir = path.join(process.cwd(), 'vault_storage');
    
    if (!fs.existsSync(vaultDir)) {
      fs.mkdirSync(vaultDir, { recursive: true });
    }

    const files = fs.readdirSync(vaultDir);
    const vaultItems: BookReference[] = [];

    for (const file of files) {
      if (file.startsWith('.') || file.toLowerCase() === 'readme.md') continue;

      const filePath = path.join(vaultDir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) continue;

      const ext = path.extname(file).toLowerCase();
      const fileSize = stat.size;
      const formattedSize = formatBytes(fileSize);

      try {
        if (ext === '.ipynb') {
          // Read notebook content
          const content = fs.readFileSync(filePath, 'utf-8');
          const parsedNb = parseJupyterNotebook(content, file, fileSize);
          parsedNb.id = `vault-${file.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
          parsedNb.originalFileName = file;
          parsedNb.fileSizeBytes = fileSize;
          parsedNb.fileSizeFormatted = formattedSize;
          parsedNb.isCustom = true;
          parsedNb.formatType = 'notebook';
          vaultItems.push(parsedNb);
        } else if (ext === '.md' || ext === '.txt' || ext === '.json') {
          const content = fs.readFileSync(filePath, 'utf-8');
          const parsedBook = processRawBookText(content, {}, file);
          parsedBook.id = `vault-${file.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
          parsedBook.originalFileName = file;
          parsedBook.fileSizeBytes = fileSize;
          parsedBook.fileSizeFormatted = formattedSize;
          parsedBook.isCustom = true;
          parsedBook.formatType = ext === '.md' ? 'markdown' : ext === '.json' ? 'book' : 'text';
          vaultItems.push(parsedBook);
        } else if (ext === '.pdf') {
          const enhanced = getEnhancedPdfMetadata(file, fileSize);
          const pdfBook: BookReference = {
            id: `vault-${file.replace(/[^a-zA-Z0-9_-]/g, '_')}`,
            title: enhanced.title || file.replace(/\.pdf$/i, '').replace(/[-_]/g, ' '),
            author: enhanced.author || 'Vault Literature',
            coverColor: enhanced.coverColor || '#14B8A6',
            track: enhanced.track || 'warehousing',
            coreConcepts: enhanced.coreConcepts || ['Data Warehousing', 'Dimensional Modeling'],
            description: enhanced.description || `Digitized PDF document (${formattedSize}) archived in secure vault storage.`,
            keyTakeaways: enhanced.keyTakeaways || ['Archived technical book in read-only vault.'],
            chapters: enhanced.chapters || [],
            conceptCards: enhanced.conceptCards,
            quizQuestions: enhanced.quizQuestions,
            isCustom: true,
            formatType: 'pdf',
            fileSizeBytes: fileSize,
            fileSizeFormatted: formattedSize,
            originalFileName: file,
            pdfUrl: `/api/vault/pdf?file=${encodeURIComponent(file)}`,
            uploadedAt: stat.mtime.toISOString(),
          };
          vaultItems.push(pdfBook);
        }
      } catch (fileErr) {
        console.error(`Error parsing vault file ${file}:`, fileErr);
      }
    }

    return NextResponse.json({
      success: true,
      items: vaultItems,
      totalCount: vaultItems.length,
      vaultPath: vaultDir,
    });
  } catch (err: any) {
    console.error('Failed to scan vault:', err);
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
