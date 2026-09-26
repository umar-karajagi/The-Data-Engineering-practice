'use client';

import React, { useState, useEffect, useMemo, memo } from 'react';
import { 
  Terminal, 
  Code2, 
  FileText, 
  ArrowLeft, 
  Layers, 
  Clock, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Copy, 
  Search, 
  ChevronRight, 
  ChevronDown,
  Sliders, 
  ListOrdered, 
  Maximize2, 
  Minimize2,
  Sparkles,
  BarChart3,
  ExternalLink,
  Zap,
  RotateCcw
} from 'lucide-react';
import { BookReference, NotebookCell } from '../../types';

interface NotebookReaderProps {
  book: BookReference;
  onBackToLibrary?: () => void;
}

// Memoized Single Cell Row to prevent re-rendering all cells on state changes
const NotebookCellRow = memo(({ 
  cell, 
  idx, 
  fontSize, 
  kernelLanguage 
}: { 
  cell: NotebookCell; 
  idx: number; 
  fontSize: number; 
  kernelLanguage?: string;
}) => {
  const isCode = cell.cellType === 'code';
  const [isOutputExpanded, setIsOutputExpanded] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(cell.source);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id={cell.id}
      className="rounded-2xl border border-forge-border/80 bg-forge-card shadow-sm hover:border-track-pyspark/30 transition-all overflow-hidden"
    >
      {/* Cell Header / Gutter */}
      <div className="px-4 py-2 bg-forge-bg/60 border-b border-forge-border/60 flex items-center justify-between text-[11px] font-mono text-forge-muted">
        <div className="flex items-center gap-2">
          {isCode ? (
            <span className="text-track-pyspark font-bold">
              In [{cell.executionCount ?? idx + 1}]:
            </span>
          ) : (
            <span className="text-track-sql flex items-center gap-1 font-bold">
              <FileText className="w-3 h-3" />
              [Doc #{idx + 1}]
            </span>
          )}
          <span className="text-[10px] text-forge-muted">
            {isCode ? (kernelLanguage || 'python') : 'Markdown'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          {isCode && (
            <button
              onClick={handleCopy}
              className="text-forge-muted hover:text-forge-text p-1 rounded transition-colors"
              title="Copy code snippet"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
          <span className="text-forge-muted">DRM Protected</span>
        </div>
      </div>

      {/* Cell Body */}
      <div className="p-4 sm:p-5">
        {isCode ? (
          <div 
            className="font-mono bg-[#0D1117] p-4 rounded-xl border border-forge-border overflow-x-auto text-[#E6EDF3] leading-relaxed whitespace-pre font-medium"
            style={{ fontSize: `${fontSize}px` }}
          >
            {cell.source}
          </div>
        ) : (
          <div className="prose prose-invert max-w-none text-sm text-forge-text font-sans leading-relaxed whitespace-pre-line">
            {cell.source}
          </div>
        )}
      </div>

      {/* Outputs Section for Code Cells */}
      {isCode && cell.outputs && cell.outputs.length > 0 && (
        <div className="border-t border-forge-border bg-forge-bg/40 p-4 space-y-3">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-forge-muted font-bold">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-emerald-400" />
              <span>Execution Output</span>
            </div>
            <button
              onClick={() => setIsOutputExpanded(!isOutputExpanded)}
              className="hover:text-forge-text flex items-center gap-1 cursor-pointer"
            >
              <span>{isOutputExpanded ? 'Collapse' : 'Expand'}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isOutputExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {isOutputExpanded && cell.outputs.map((out, outIdx) => (
            <div key={outIdx} className="space-y-2">
              
              {/* Stream / Plain Text Output */}
              {out.text && (
                <pre className="bg-[#05080C] text-emerald-300 font-mono text-xs p-3.5 rounded-xl border border-forge-border/80 overflow-x-auto whitespace-pre-wrap max-h-96">
                  {out.text}
                </pre>
              )}

              {/* Rich HTML Table Output */}
              {out.html && (
                <div 
                  className="overflow-x-auto text-xs font-mono p-3 bg-[#05080C] rounded-xl border border-forge-border text-forge-text [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-forge-border [&_th]:p-1.5 [&_td]:border [&_td]:border-forge-border [&_td]:p-1.5"
                  dangerouslySetInnerHTML={{ __html: out.html }}
                />
              )}

              {/* Matplotlib / Seaborn Image Plot Output */}
              {out.imagePngBase64 && (
                <div className="p-3 bg-white rounded-xl border border-forge-border inline-block max-w-full overflow-x-auto shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`data:image/png;base64,${out.imagePngBase64}`}
                    alt={`Notebook Plot Output ${outIdx + 1}`}
                    className="max-h-[500px] w-auto object-contain rounded"
                    loading="lazy"
                  />
                </div>
              )}

              {/* SVG Plot */}
              {out.imageSvg && (
                <div 
                  className="p-3 bg-white rounded-xl border border-forge-border inline-block max-w-full overflow-x-auto shadow-md"
                  dangerouslySetInnerHTML={{ __html: out.imageSvg }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

NotebookCellRow.displayName = 'NotebookCellRow';

export const NotebookReader: React.FC<NotebookReaderProps> = ({ book, onBackToLibrary }) => {
  const [filterMode, setFilterMode] = useState<'all' | 'code' | 'markdown'>('all');
  const [fontSize, setFontSize] = useState<number>(14);
  const [showOutline, setShowOutline] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [drmAlert, setDrmAlert] = useState<string | null>(null);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);

  // High-performance virtualization: Initial fast render of 20 cells for sub-50ms instant load
  const [visibleCount, setVisibleCount] = useState<number>(20);

  const cells: NotebookCell[] = useMemo(() => book.notebookCells || [], [book.notebookCells]);

  // Anti-download DRM keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p' || e.key === 'u')) {
        e.preventDefault();
        triggerDrmNotification('Downloading, saving, and printing are disabled to protect notebook vault content.');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerDrmNotification = (msg: string) => {
    setDrmAlert(msg);
    setTimeout(() => setDrmAlert(null), 4000);
  };

  // Filter cells
  const filteredCells = useMemo(() => {
    return cells.filter(c => {
      const matchesFilter = 
        filterMode === 'all' ? true :
        filterMode === 'code' ? c.cellType === 'code' :
        c.cellType === 'markdown';

      const matchesSearch = searchQuery.trim() === '' || c.source.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [cells, filterMode, searchQuery]);

  // Extract outline headings for Table of Contents
  const outlineItems = useMemo(() => {
    return cells
      .map((c, idx) => ({ cell: c, index: idx }))
      .filter(item => item.cell.cellType === 'markdown' && /^#{1,3}\s+(.+)$/m.test(item.cell.source))
      .map(item => {
        const match = item.cell.source.match(/^#{1,3}\s+(.+)$/m);
        return {
          title: match ? match[1].replace(/^[#\s\*\-_]+/, '').trim() : `Section ${item.index + 1}`,
          cellIndex: item.index,
          cellId: item.cell.id,
        };
      });
  }, [cells]);

  const scrollToCell = (cellId: string, cellIndex: number) => {
    // If the target cell is beyond visibleCount, expand visible count first
    if (cellIndex >= visibleCount) {
      setVisibleCount(Math.min(filteredCells.length, cellIndex + 20));
    }
    setShowOutline(false);

    setTimeout(() => {
      const el = document.getElementById(cellId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(filteredCells.length, prev + 25));
  };

  const handleLoadAll = () => {
    setVisibleCount(filteredCells.length);
  };

  const renderedCells = filteredCells.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCells.length;

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9] pb-24 font-sans selection:bg-emerald-500/30">
      
      {/* Top Header */}
      {!isZenMode && (
        <header className="sticky top-0 z-40 bg-forge-card/95 backdrop-blur-md border-b border-forge-border px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            {/* Left: Back + Notebook Title */}
            <div className="flex items-center gap-3 min-w-0">
              {onBackToLibrary && (
                <button
                  onClick={onBackToLibrary}
                  className="px-3 py-1.5 rounded-xl bg-forge-bg hover:bg-forge-surface border border-forge-border text-xs font-mono font-bold flex items-center gap-1.5 text-forge-secondary hover:text-forge-text transition-colors shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Library</span>
                </button>
              )}

              <div className="truncate">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-track-pyspark shrink-0" />
                  <span className="text-xs font-extrabold text-forge-text truncate">{book.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-track-pyspark/10 text-track-pyspark border border-track-pyspark/30">
                    {book.kernelLanguage || 'python3'}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold hidden sm:inline">
                    ⚡ Virtualized Fast Engine
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Controls & Filter */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Outline ToC Drawer Trigger */}
              <button
                onClick={() => setShowOutline(!showOutline)}
                className="px-3 py-1.5 rounded-xl bg-forge-bg hover:bg-forge-surface border border-forge-border text-xs font-mono font-bold flex items-center gap-1.5 text-forge-secondary hover:text-forge-text transition-colors cursor-pointer"
                title="View Table of Contents / Outlines"
              >
                <ListOrdered className="w-3.5 h-3.5 text-track-pyspark" />
                <span className="hidden md:inline">Outline</span>
                <span className="text-[10px] px-1 rounded bg-forge-surface text-forge-muted">{outlineItems.length}</span>
              </button>

              {/* Cell Type Filter */}
              <div className="flex p-0.5 rounded-xl bg-forge-bg border border-forge-border text-xs font-mono">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${filterMode === 'all' ? 'bg-forge-surface text-forge-text font-bold' : 'text-forge-muted'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterMode('code')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${filterMode === 'code' ? 'bg-forge-surface text-forge-text font-bold' : 'text-forge-muted'}`}
                >
                  Code
                </button>
                <button
                  onClick={() => setFilterMode('markdown')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${filterMode === 'markdown' ? 'bg-forge-surface text-forge-text font-bold' : 'text-forge-muted'}`}
                >
                  Text
                </button>
              </div>

              {/* Font Sizer */}
              <div className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-xl bg-forge-bg border border-forge-border text-xs font-mono text-forge-muted">
                <button
                  onClick={() => setFontSize(Math.max(11, fontSize - 1))}
                  className="px-1.5 hover:text-forge-text cursor-pointer"
                  title="Smaller code font"
                >
                  A-
                </button>
                <span>{fontSize}px</span>
                <button
                  onClick={() => setFontSize(Math.min(20, fontSize + 1))}
                  className="px-1.5 hover:text-forge-text cursor-pointer"
                  title="Larger code font"
                >
                  A+
                </button>
              </div>

              {/* Zen Mode */}
              <button
                onClick={() => setIsZenMode(true)}
                className="p-1.5 rounded-xl bg-forge-bg hover:bg-forge-surface border border-forge-border text-forge-muted hover:text-forge-text transition-colors cursor-pointer"
                title="Zen Full Screen Focus"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </header>
      )}

      {/* Floating Exit Zen Button */}
      {isZenMode && (
        <button
          onClick={() => setIsZenMode(false)}
          className="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-xl bg-forge-card/90 backdrop-blur-md border border-forge-border text-xs font-mono font-bold flex items-center gap-1.5 text-forge-secondary hover:text-forge-text transition-colors shadow-2xl cursor-pointer"
        >
          <Minimize2 className="w-3.5 h-3.5" />
          <span>Exit Zen</span>
        </button>
      )}

      {/* DRM Notification Toast */}
      {drmAlert && (
        <div className="fixed bottom-6 right-6 z-50 bg-forge-card border border-emerald-500/60 text-forge-text px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-mono animate-in slide-in-from-bottom-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{drmAlert}</span>
        </div>
      )}

      {/* Outline Drawer */}
      {showOutline && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-start">
          <div className="w-full max-w-sm bg-forge-card border-r border-forge-border h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-forge-border flex items-center justify-between bg-forge-bg/60">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-track-pyspark" />
                <h3 className="text-xs font-mono font-bold uppercase text-forge-text">Notebook Sections</h3>
              </div>
              <button
                onClick={() => setShowOutline(false)}
                className="text-xs font-mono text-forge-muted hover:text-forge-text cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {outlineItems.length > 0 ? (
                outlineItems.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => scrollToCell(item.cellId, item.cellIndex)}
                    className="p-2.5 rounded-xl hover:bg-forge-surface cursor-pointer text-xs font-mono text-forge-secondary hover:text-forge-text flex items-center justify-between gap-2"
                  >
                    <span className="truncate">{item.title}</span>
                    <span className="text-[10px] text-forge-muted">Cell {item.cellIndex + 1}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-xs font-mono text-forge-muted text-center">
                  No explicit markdown headers detected.
                </div>
              )}
            </div>
          </div>
          <div className="flex-1" onClick={() => setShowOutline(false)} />
        </div>
      )}

      {/* Main Notebook Canvas */}
      <main 
        className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-6 select-none"
        onContextMenu={(e) => {
          e.preventDefault();
          triggerDrmNotification('Protected Notebook: Right-click and downloading are restricted.');
        }}
      >
        
        {/* Notebook Cover Banner */}
        <div className="p-6 rounded-3xl bg-forge-card border border-forge-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-track-pyspark font-bold">
              <Terminal className="w-4 h-4" />
              <span>INTERACTIVE JUPYTER STUDY STUDIO</span>
              <span>•</span>
              <span className="text-forge-muted">{book.formatType?.toUpperCase() || 'NOTEBOOK'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-forge-text">{book.title}</h1>
            <p className="text-xs text-forge-secondary font-mono">
              Executed with outputs preserved. Protected under DataForge zero-download DRM.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-forge-bg border border-forge-border text-forge-secondary">
              <span className="text-track-sql font-bold">{cells.length}</span> Total Cells
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-forge-bg border border-forge-border text-forge-secondary">
              <span className="text-emerald-400 font-bold">{book.codeCellsCount || 0}</span> Code
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-forge-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notebook code or markdown documentation..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-forge-card border border-forge-border text-xs font-mono text-forge-text placeholder:text-forge-muted focus:outline-none focus:border-track-pyspark"
          />
        </div>

        {/* Cells Stream (Virtualized with fast incremental loading) */}
        <div className="space-y-4">
          {renderedCells.map((cell, idx) => (
            <NotebookCellRow
              key={cell.id}
              cell={cell}
              idx={idx}
              fontSize={fontSize}
              kernelLanguage={book.kernelLanguage}
            />
          ))}
        </div>

        {/* Load More Controls for heavy notebooks */}
        {hasMore && (
          <div className="p-6 rounded-2xl border border-forge-border bg-forge-card text-center space-y-3">
            <div className="text-xs font-mono text-forge-secondary">
              Showing <strong>{renderedCells.length}</strong> of <strong>{filteredCells.length}</strong> cells (Virtualized for instant performance)
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleLoadMore}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs transition-colors cursor-pointer shadow-md"
              >
                Load Next 25 Cells
              </button>
              <button
                onClick={handleLoadAll}
                className="px-4 py-2 rounded-xl border border-forge-border hover:bg-forge-surface text-forge-secondary hover:text-forge-text font-mono text-xs transition-colors cursor-pointer"
              >
                Load All ({filteredCells.length})
              </button>
            </div>
          </div>
        )}

        {filteredCells.length === 0 && (
          <div className="py-16 text-center text-xs font-mono text-forge-muted">
            No cells matched your search query.
          </div>
        )}

      </main>

    </div>
  );
};
