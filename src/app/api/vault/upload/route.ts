import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parseJupyterNotebook, formatBytes } from '@/lib/notebookParser';
import { processRawBookText } from '@/lib/bookParser';
import { getEnhancedPdfMetadata } from '@/content/books/pdfBookMetadata';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const vaultDir = path.join(process.cwd(), 'vault_storage');
    if (!fs.existsSync(vaultDir)) {
      fs.mkdirSync(vaultDir, { recursive: true });
    }

    const safeFileName = file.name.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    const targetPath = path.join(vaultDir, safeFileName);

    // Stream / write buffer to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(targetPath, buffer);

    const fileSize = buffer.length;
    const formattedSize = formatBytes(fileSize);
    const ext = path.extname(safeFileName).toLowerCase();

    let parsedBook: any;

    if (ext === '.ipynb') {
      const content = buffer.toString('utf-8');
      parsedBook = parseJupyterNotebook(content, safeFileName, fileSize);
      parsedBook.id = `vault-${safeFileName.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
      parsedBook.originalFileName = safeFileName;
      parsedBook.fileSizeBytes = fileSize;
      parsedBook.fileSizeFormatted = formattedSize;
      parsedBook.isCustom = true;
      parsedBook.formatType = 'notebook';
    } else if (ext === '.pdf') {
      const enhanced = getEnhancedPdfMetadata(safeFileName, fileSize);
      parsedBook = {
        id: `vault-${safeFileName.replace(/[^a-zA-Z0-9_-]/g, '_')}`,
        title: enhanced.title || safeFileName.replace(/\.pdf$/i, '').replace(/[-_]/g, ' '),
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
        originalFileName: safeFileName,
        pdfUrl: `/api/vault/pdf?file=${encodeURIComponent(safeFileName)}`,
        uploadedAt: new Date().toISOString(),
      };
    } else {
      const content = buffer.toString('utf-8');
      parsedBook = processRawBookText(content, {}, safeFileName);
      parsedBook.id = `vault-${safeFileName.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
      parsedBook.originalFileName = safeFileName;
      parsedBook.fileSizeBytes = fileSize;
      parsedBook.fileSizeFormatted = formattedSize;
      parsedBook.isCustom = true;
      parsedBook.formatType = ext === '.md' ? 'markdown' : 'text';
    }

    return NextResponse.json({
      success: true,
      item: parsedBook,
      message: `File ${safeFileName} (${formattedSize}) securely ingested into vault.`,
    });
  } catch (err: any) {
    console.error('Failed to upload file to vault:', err);
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
