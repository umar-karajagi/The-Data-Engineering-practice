import { BookReference, NotebookCell, NotebookOutput, TrackType } from '../types';

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Parses raw .ipynb JSON into an interactive BookReference + NotebookCell structure
 */
export function parseJupyterNotebook(
  rawJson: string | object,
  fileName: string,
  fileSizeBytes: number = 0
): BookReference {
  let nbData: any;
  if (typeof rawJson === 'string') {
    nbData = JSON.parse(rawJson);
  } else {
    nbData = rawJson;
  }

  const rawCells = nbData.cells || [];
  const cells: NotebookCell[] = [];
  let codeCount = 0;
  let markdownCount = 0;
  let detectedTitle = '';
  let detectedAuthor = 'Data Engineering Lab';
  let kernelLanguage = nbData.metadata?.language_info?.name || 'python';

  // Process raw cells
  for (let i = 0; i < rawCells.length; i++) {
    const raw = rawCells[i];
    const cellType = raw.cell_type === 'code' ? 'code' : 'markdown';
    
    // Normalize source lines
    let source = '';
    if (Array.isArray(raw.source)) {
      source = raw.source.join('');
    } else if (typeof raw.source === 'string') {
      source = raw.source;
    }

    if (cellType === 'code') {
      codeCount++;
    } else {
      markdownCount++;
      if (!detectedTitle) {
        const titleMatch = source.match(/^#\s+(.+)$/m);
        if (titleMatch) {
          detectedTitle = titleMatch[1].replace(/^[#\s\*\-_]+/, '').trim();
        }
      }
    }

    // Parse outputs for code cells
    const outputs: NotebookOutput[] = [];
    if (Array.isArray(raw.outputs)) {
      for (const out of raw.outputs) {
        if (out.output_type === 'stream') {
          const text = Array.isArray(out.text) ? out.text.join('') : (out.text || '');
          outputs.push({
            outputType: 'stream',
            text,
          });
        } else if (out.output_type === 'execute_result' || out.output_type === 'display_data') {
          const data = out.data || {};
          let html = '';
          let text = '';
          let imagePng = '';
          let imageSvg = '';

          if (data['text/html']) {
            html = Array.isArray(data['text/html']) ? data['text/html'].join('') : data['text/html'];
          }
          if (data['text/plain']) {
            text = Array.isArray(data['text/plain']) ? data['text/plain'].join('') : data['text/plain'];
          }
          if (data['image/png']) {
            imagePng = data['image/png'];
          }
          if (data['image/svg+xml']) {
            imageSvg = Array.isArray(data['image/svg+xml']) ? data['image/svg+xml'].join('') : data['image/svg+xml'];
          }

          outputs.push({
            outputType: out.output_type,
            text,
            html,
            imagePngBase64: imagePng,
            imageSvg,
          });
        } else if (out.output_type === 'error') {
          outputs.push({
            outputType: 'error',
            ename: out.ename,
            evalue: out.evalue,
            traceback: Array.isArray(out.traceback) ? out.traceback : [],
          });
        }
      }
    }

    cells.push({
      id: `cell-${i + 1}-${raw.id || Math.random().toString(36).substring(2, 6)}`,
      cellType,
      source,
      executionCount: raw.execution_count,
      outputs,
    });
  }

  // Fallback title from filename
  if (!detectedTitle) {
    detectedTitle = fileName.replace(/\.ipynb$/i, '').replace(/[-_]/g, ' ');
    detectedTitle = detectedTitle.replace(/\b\w/g, l => l.toUpperCase());
  }

  // Infer track
  let detectedTrack: TrackType = 'architecture';
  const allText = cells.map(c => c.source).join(' ').toLowerCase();
  if (allText.includes('pyspark') || allText.includes('spark') || allText.includes('sc.parallelize')) {
    detectedTrack = 'pyspark';
  } else if (allText.includes('select ') || allText.includes('duckdb') || allText.includes('postgres') || allText.includes('from ')) {
    detectedTrack = 'sql';
  } else if (allText.includes('pandas') || allText.includes('numpy') || allText.includes('def ') || allText.includes('class ')) {
    detectedTrack = 'python';
  } else if (allText.includes('star schema') || allText.includes('fact_') || allText.includes('dim_') || allText.includes('scd')) {
    detectedTrack = 'warehousing';
  } else if (allText.includes('tree') || allText.includes('binary_search') || allText.includes('leetcode')) {
    detectedTrack = 'dsa';
  }

  // Auto-group into Chapters based on major markdown headings or cell chunks
  const chapters = groupCellsIntoChapters(cells, detectedTitle);

  const formattedSize = fileSizeBytes > 0 ? formatBytes(fileSizeBytes) : 'Large Notebook';

  return {
    id: `nb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: detectedTitle,
    author: detectedAuthor,
    coverColor: '#F97316', // Notebook Orange / PySpark
    track: detectedTrack,
    coreConcepts: ['Jupyter Lab', 'Interactive Notebook', 'Executable Code', 'Visual Analytics', 'Data Engineering'],
    description: `Production Jupyter Notebook containing ${cells.length} cells (${codeCount} code, ${markdownCount} markdown). Formatted for distraction-free interactive study with outputs.`,
    keyTakeaways: [
      `Total of ${cells.length} interactive cells across ${chapters.length} structured sections.`,
      `Includes executable code cells, markdown explanations, and rich visual output representations.`,
      `Kernel configured for ${kernelLanguage}. Protected under DataForge DRM.`
    ],
    chapters,
    isCustom: true,
    isNotebook: true,
    notebookCells: cells,
    totalCells: cells.length,
    codeCellsCount: codeCount,
    markdownCellsCount: markdownCount,
    kernelLanguage,
    formatType: 'notebook',
    fileSizeBytes,
    fileSizeFormatted: formattedSize,
    originalFileName: fileName,
    uploadedAt: new Date().toISOString(),
  };
}

/**
 * Groups notebook cells into readable chapters
 */
function groupCellsIntoChapters(cells: NotebookCell[], bookTitle: string) {
  const chapters: BookReference['chapters'] = [];
  let currentTitle = 'Introduction & Setup';
  let currentCells: NotebookCell[] = [];
  let chNumber = 1;

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];

    // Check if cell is a markdown cell with a high-level heading (# or ##)
    const isMajorHeading = cell.cellType === 'markdown' && /^#{1,2}\s+(.+)$/m.test(cell.source);
    
    if (isMajorHeading && currentCells.length > 0) {
      // Save current chapter
      const chapterContent = currentCells.map(c => {
        if (c.cellType === 'markdown') return c.source;
        return `\`\`\`python\n${c.source}\n\`\`\``;
      }).join('\n\n');

      const wordCount = chapterContent.split(/\s+/).filter(Boolean).length;
      const readingTimeMin = Math.max(2, Math.ceil(wordCount / 200));

      chapters.push({
        id: `nb-ch-${chNumber}`,
        number: chNumber,
        title: currentTitle,
        readingTime: `${readingTimeMin} min`,
        summary: `Covers ${currentCells.length} notebook cells with code execution and architectural principles.`,
        content: chapterContent,
        seniorTip: 'Trace data frame transformations step-by-step and inspect schema mutations between operations.',
      });

      chNumber++;
      currentCells = [];
      const match = cell.source.match(/^#{1,2}\s+(.+)$/m);
      currentTitle = match ? match[1].replace(/^[#\s\*\-_]+/, '').trim() : `Section ${chNumber}`;
    }

    currentCells.push(cell);

    // If no headings exist for 25 cells, split logically
    if (currentCells.length >= 25) {
      const chapterContent = currentCells.map(c => {
        if (c.cellType === 'markdown') return c.source;
        return `\`\`\`python\n${c.source}\n\`\`\``;
      }).join('\n\n');

      const wordCount = chapterContent.split(/\s+/).filter(Boolean).length;
      const readingTimeMin = Math.max(2, Math.ceil(wordCount / 200));

      chapters.push({
        id: `nb-ch-${chNumber}`,
        number: chNumber,
        title: currentTitle,
        readingTime: `${readingTimeMin} min`,
        summary: `Interactive section with ${currentCells.length} cells.`,
        content: chapterContent,
        seniorTip: 'Review code comments and output dataframes to verify transformation logic.',
      });

      chNumber++;
      currentCells = [];
      currentTitle = `Section ${chNumber}: Pipeline Execution`;
    }
  }

  // Add final remaining chunk
  if (currentCells.length > 0) {
    const chapterContent = currentCells.map(c => {
      if (c.cellType === 'markdown') return c.source;
      return `\`\`\`python\n${c.source}\n\`\`\``;
    }).join('\n\n');

    const wordCount = chapterContent.split(/\s+/).filter(Boolean).length;
    const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));

    chapters.push({
      id: `nb-ch-${chNumber}`,
      number: chNumber,
      title: chNumber === 1 ? `${bookTitle} — Full Lab` : currentTitle,
      readingTime: `${readingTimeMin} min`,
      summary: `Final notebook execution section containing ${currentCells.length} cells.`,
      content: chapterContent,
      seniorTip: 'Ensure all resources, sessions, and data sinks are properly unpersisted and committed.',
    });
  }

  return chapters;
}
