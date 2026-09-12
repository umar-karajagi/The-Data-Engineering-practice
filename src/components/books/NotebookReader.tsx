'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Sliders, 
  ListOrdered, 
  Maximize2, 
  Minimize2,
  Sparkles,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { BookReference, NotebookCell } from '../../types';

interface NotebookReaderProps {
  book: BookReference;
  onBackToLibrary?: () => void;
}

export const NotebookReader: React.FC<NotebookReaderProps> = ({ book, onBackToLibrary }) => {
  const [filterMode, setFilterMode] = useState<'all' | 'code' | 'markdown'>('all');
  const [fontSize, setFontSize] = useState<number>(14);
  const [showOutline, setShowOutline] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [drmAlert, setDrmAlert] = useState<string | null>(null);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);

  const cells: NotebookCell[] = book.notebookCells || [];

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
  const filteredCells = cells.filter(c => {
    const matchesFilter = 
      filterMode === 'all' ? true :
      filterMode === 'code' ? c.cellType === 'code' :
      c.cellType === 'markdown';

    const matchesSearch = searchQuery.trim() === '' || c.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Extract outline headings for Table of Contents
  const outlineItems = cells
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

  const scrollToCell = (cellId: string) => {
    const el = document.getElementById(cellId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setShowOutline(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9] pb-24">
      
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
                  {book.fileSizeFormatted && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-forge-bg text-forge-muted border border-forge-border">
                      {book.fileSizeFormatted}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-forge-muted font-mono truncate">
                  {cells.length} Total Cells ({book.codeCellsCount || 0} code, {book.markdownCellsCount || 0} markdown)
                </p>
              </div>
            </div>

            {/* Right: Controls & DRM status */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* Outline Button */}
              <button
                onClick={() => setShowOutline(!showOutline)}
                className="px-3 py-1.5 rounded-xl bg-forge-bg hover:bg-forge-surface border border-forge-border text-xs font-mono font-bold flex items-center gap-1.5 text-forge-secondary hover:text-forge-text transition-colors"
              >
                <ListOrdered className="w-3.5 h-3.5 text-track-sql" />
                <span className="hidden sm:inline">Notebook Outline</span>
              </button>

              {/* View filter pills */}
              <div className="flex items-center bg-forge-bg border border-forge-border rounded-xl p-0.5 text-xs font-mono">
                {(['all', 'code', 'markdown'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFilterMode(mode)}
                    className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all ${
                      filterMode === mode 
                        ? 'bg-track-pyspark text-white shadow-sm' 
                        : 'text-forge-secondary hover:text-forge-text'
                    }`}
                  >
                    {mode === 'all' ? 'All Flow' : mode}
                  </button>
                ))}
              </div>

              {/* Font Size controls */}
              <div className="flex items-center bg-forge-bg border border-forge-border rounded-xl px-2 py-1 text-xs font-mono gap-1 text-forge-secondary">
                <button 
                  onClick={() => setFontSize(Math.max(12, fontSize - 1))}
                  className="hover:text-forge-text px-1"
                  title="Smaller code font"
                >
                  A-
                </button>
                <span className="text-[10px] text-forge-muted">{fontSize}px</span>
                <button 
                  onClick={() => setFontSize(Math.min(20, fontSize + 1))}
                  className="hover:text-forge-text px-1"
                  title="Larger code font"
                >
                  A+
                </button>
              </div>

              {/* Zen Fullscreen */}
              <button
                onClick={() => setIsZenMode(!isZenMode)}
                className="p-1.5 rounded-xl bg-forge-bg hover:bg-forge-surface border border-forge-border text-forge-secondary hover:text-forge-text transition-colors"
                title="Zen Mode"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

            </div>

          </div>
        </header>
      )}

      {/* Zen exit button */}
      {isZenMode && (
        <button
          onClick={() => setIsZenMode(false)}
          className="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-full bg-forge-card/80 backdrop-blur-md border border-forge-border text-xs font-mono text-forge-secondary hover:text-forge-text shadow-xl flex items-center gap-1.5"
        >
          <Minimize2 className="w-3.5 h-3.5" />
          <span>Exit Zen</span>
        </button>
      )}

      {/* DRM Notification Toast */}
      {drmAlert && (
        <div className="fixed bottom-6 right-6 z-50 bg-forge-card border border-track-warehousing/60 text-forge-text px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-mono animate-in slide-in-from-bottom-3">
          <ShieldCheck className="w-4 h-4 text-track-warehousing shrink-0" />
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
                className="text-xs font-mono text-forge-muted hover:text-forge-text"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {outlineItems.length > 0 ? (
                outlineItems.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => scrollToCell(item.cellId)}
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
              <span className="text-track-sql font-bold">{cells.length}</span> Cells
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-forge-bg border border-forge-border text-forge-secondary">
              <span className="text-emerald-400 font-bold">{book.codeCellsCount || 0}</span> Code
            </div>
          </div>
        </div>

        {/* Cells Stream */}
        <div className="space-y-4">
          {filteredCells.map((cell, idx) => {
            const isCode = cell.cellType === 'code';

            return (
              <div
                key={cell.id}
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
                      {isCode ? (book.kernelLanguage || 'python') : 'Markdown'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-forge-muted">Read-Only DRM</span>
                  </div>
                </div>

                {/* Cell Body */}
                <div className="p-4 sm:p-5">
                  {isCode ? (
                    <div 
                      className="font-mono bg-[#0D1117] p-4 rounded-xl border border-forge-border overflow-x-auto text-[#E6EDF3] leading-relaxed whitespace-pre"
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
                    <div className="text-[10px] font-mono uppercase text-forge-muted font-bold flex items-center gap-1.5">
                      <Terminal className="w-3 h-3 text-emerald-400" />
                      <span>Execution Output</span>
                    </div>

                    {cell.outputs.map((out, outIdx) => (
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
                            <img
                              src={`data:image/png;base64,${out.imagePngBase64}`}
                              alt={`Notebook Plot Output ${outIdx + 1}`}
                              className="max-h-[500px] w-auto object-contain rounded"
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

                        {/* Error Traceback */}
                        {out.ename && (
                          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 font-mono text-xs space-y-1">
                            <div className="font-bold text-red-400">
                              {out.ename}: {out.evalue}
                            </div>
                            {out.traceback && out.traceback.length > 0 && (
                              <pre className="text-[11px] text-red-300/80 whitespace-pre-wrap overflow-x-auto max-h-48 pt-1">
                                {out.traceback.join('\n')}
                              </pre>
                            )}
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {filteredCells.length === 0 && (
          <div className="text-center py-16 bg-forge-card border border-forge-border rounded-3xl font-mono text-xs text-forge-muted">
            No cells matching your current filter.
          </div>
        )}

      </main>

    </div>
  );
};
