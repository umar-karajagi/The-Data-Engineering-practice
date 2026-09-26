'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft,
  ChevronsRight,
  Sparkles, 
  Download,
  ExternalLink,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  List,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Bookmark,
  FileText,
  Layers,
  Search,
  Columns,
  RotateCcw,
  Sliders,
  Code2,
  Terminal,
  HelpCircle,
  X,
  Compass,
  Eye,
  BookMarked,
  ZoomIn,
  ZoomOut,
  Loader2
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { BookReference, ContentRef } from '../../types';
import { SpiralBinding3D, SpiralTheme } from './SpiralBinding3D';
import { playPageFlipSound, isSoundEnabled, toggleSound, playSuccessChime } from '../../lib/sound';
import { saveReadingProgress, getReadingProgress, toggleChapterBookmark, getBookmarkedChapters } from '../../lib/libraryStorage';
import { useUserStore } from '../../lib/userStore';

export type BookChapter = BookReference['chapters'][number];
export type ReaderDisplayMode = 'spiral3d' | 'ereader' | 'pdf';
export type ReaderTheme = 'dark' | 'sepia' | 'oled' | 'slate';
export type ReaderFont = 'serif' | 'sans' | 'mono';

interface Crazy3DBookReaderProps {
  book: BookReference;
  initialChapterId?: string;
  onBackToLibrary: () => void;
  onNavigatePractice?: (practiceId: string) => void;
  onAddXP?: (amount: number) => void;
  onOpenQuickNote?: (ref?: ContentRef) => void;
}

export const Crazy3DBookReader: React.FC<Crazy3DBookReaderProps> = ({
  book,
  initialChapterId,
  onBackToLibrary,
  onNavigatePractice,
  onAddXP,
  onOpenQuickNote
}) => {
  // 1. Reading Mode: 3D Spiral Flipbook (Default), E-Reader, or Native PDF
  const [displayMode, setDisplayMode] = useState<ReaderDisplayMode>('spiral3d');
  const [show3DCover, setShow3DCover] = useState<boolean>(false);

  // PDF Document State (All 600+ Real PDF Pages)
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pdfTotalPages, setPdfTotalPages] = useState<number>(book.pageCount || 600);
  const [currentPdfPage, setCurrentPdfPage] = useState<number>(1);
  const [pageInputValue, setPageInputValue] = useState<string>('1');
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(true);
  const [isPageRendering, setIsPageRendering] = useState<boolean>(false);
  const [pdfLoadError, setPdfLoadError] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1.0);

  // Canvases for Left and Right Real PDF Pages
  const leftCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const leftRenderTaskRef = useRef<any>(null);
  const rightRenderTaskRef = useRef<any>(null);

  // Chapter Navigation State (for E-Reader Mode)
  const chapters: BookChapter[] = useMemo(() => {
    return book.chapters && book.chapters.length > 0 ? book.chapters : [
      {
        id: `${book.id}-ch1`,
        number: 1,
        title: 'Architectural Foundations & Core Principles',
        readingTime: '20 min',
        summary: book.description || 'Comprehensive foundational overview of this engineering discipline.',
        content: `# ${book.title}\n\n**Author:** ${book.author}\n\n${book.description}\n\n### Key Concepts\n${(book.coreConcepts || []).map(c => `- **${c}**`).join('\n')}\n\n### Core Engineering Takeaways\n${(book.keyTakeaways || []).map(t => `> ${t}`).join('\n\n')}`,
        seniorTip: 'Always align schema grain and partition layouts with business query patterns to eliminate full lakehouse shuffles.',
        antiPattern: 'Performing unpartitioned full table scans and nested subqueries on petabyte scale datasets.'
      }
    ];
  }, [book]);

  const [currentChapterIdx, setCurrentChapterIdx] = useState<number>(() => {
    if (!initialChapterId) return 0;
    const idx = chapters.findIndex(c => c.id === initialChapterId);
    return idx >= 0 ? idx : 0;
  });

  const currentChapter = chapters[currentChapterIdx] || chapters[0];
  const totalChapters = chapters.length;

  // 3D Spiral Settings (DearFlip style)
  const [spiralTheme, setSpiralTheme] = useState<SpiralTheme>('emerald');
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);

  // E-Reader Controls
  const [showToc, setShowToc] = useState<boolean>(false);
  const [tocSearch, setTocSearch] = useState<string>('');
  const [bookmarkedChapters, setBookmarkedChapters] = useState<string[]>([]);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);

  // Text to Speech
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Compute Static PDF URL
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const pdfFileName = book.originalFileName || '';
  const resolvedPdfUrl = book.pdfUrl || (pdfFileName ? `${basePath}/vault_storage/${encodeURIComponent(pdfFileName)}` : '');

  // Book Primary Vibrant Color
  const themeColor = book.coverColor || '#10B981';

  // User store hook
  let storeSetLastActive: any = null;
  let storeAddXP: any = null;
  try {
    const store = useUserStore();
    storeSetLastActive = store.setLastActive;
    storeAddXP = store.addXP;
  } catch {
    // outside provider
  }

  // 1. Initialize PDF.js Engine & Load Real PDF Document
  useEffect(() => {
    let isCancelled = false;

    async function loadPdfDocument() {
      if (!resolvedPdfUrl) {
        setIsPdfLoading(false);
        return;
      }

      setIsPdfLoading(true);
      setPdfLoadError(null);

      try {
        if (typeof window !== 'undefined') {
          // Set Worker Source (Same origin to prevent CORS restriction)
          pdfjsLib.GlobalWorkerOptions.workerSrc = `${window.location.origin}${basePath}/pdfjs/pdf.worker.min.js`;
        }

        const loadingTask = pdfjsLib.getDocument({
          url: resolvedPdfUrl,
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (!isCancelled) {
          setPdfDoc(doc);
          setPdfTotalPages(doc.numPages);
          setIsPdfLoading(false);
        }
      } catch (err: any) {
        console.warn('PDF.js loading failed, falling back to embedded mode:', err);
        if (!isCancelled) {
          setPdfLoadError(err?.message || 'Could not load PDF document.');
          setIsPdfLoading(false);
        }
      }
    }

    loadPdfDocument();

    return () => {
      isCancelled = true;
    };
  }, [resolvedPdfUrl, basePath]);

  // 2. Render Real PDF Pages on Left & Right 3D Canvases
  const renderPageToCanvas = useCallback(async (
    doc: any,
    pageNum: number,
    canvas: HTMLCanvasElement | null,
    renderTaskRef: React.MutableRefObject<any>
  ) => {
    if (!doc || !canvas || pageNum < 1 || pageNum > doc.numPages) {
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    try {
      // Cancel any ongoing render task on this canvas
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // ignore cancel error
        }
        renderTaskRef.current = null;
      }

      const page = await doc.getPage(pageNum);
      const pixelRatio = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1.5, 2.0) : 1.5;
      const baseScale = 1.25 * zoomScale * pixelRatio;
      const viewport = page.getViewport({ scale: baseScale });

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = '100%';
      canvas.style.height = '100%';

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const renderTask = page.render({
          canvasContext: ctx,
          viewport: viewport
        });
        renderTaskRef.current = renderTask;
        await renderTask.promise;
        renderTaskRef.current = null;
      }
    } catch (err: any) {
      if (err?.name !== 'RenderingCancelledException') {
        console.error(`Error rendering page ${pageNum}:`, err);
      }
    }
  }, [zoomScale]);

  // Re-render canvases whenever currentPdfPage, pdfDoc, or zoom changes
  useEffect(() => {
    if (!pdfDoc || displayMode !== 'spiral3d' || show3DCover) return;

    setIsPageRendering(true);

    if (currentPdfPage === 1) {
      // Page 1 is on Right, Left page is Front Flap/Inside Cover
      if (leftCanvasRef.current) {
        const ctx = leftCanvasRef.current.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, leftCanvasRef.current.width, leftCanvasRef.current.height);
      }
      renderPageToCanvas(pdfDoc, 1, rightCanvasRef.current, rightRenderTaskRef).finally(() => {
        setIsPageRendering(false);
      });
    } else {
      const leftPageNum = currentPdfPage % 2 === 0 ? currentPdfPage : currentPdfPage - 1;
      const rightPageNum = leftPageNum + 1;

      Promise.all([
        renderPageToCanvas(pdfDoc, leftPageNum, leftCanvasRef.current, leftRenderTaskRef),
        renderPageToCanvas(pdfDoc, rightPageNum, rightCanvasRef.current, rightRenderTaskRef)
      ]).finally(() => {
        setIsPageRendering(false);
      });
    }

    setPageInputValue(currentPdfPage.toString());
  }, [pdfDoc, currentPdfPage, displayMode, show3DCover, renderPageToCanvas]);

  // Page Turn Actions (3D Flip Animation Across Real PDF Pages)
  const handleNextPage = () => {
    if (isFlipping) return;
    const step = currentPdfPage === 1 ? 1 : 2;
    const targetPage = Math.min(pdfTotalPages, currentPdfPage + step);

    if (targetPage > currentPdfPage) {
      setFlipDirection('next');
      setIsFlipping(true);
      if (soundOn) playPageFlipSound();

      setTimeout(() => {
        setCurrentPdfPage(targetPage);
        setPageInputValue(targetPage.toString());
        setIsFlipping(false);
        if (onAddXP) onAddXP(10);
        if (storeAddXP) storeAddXP(10);
      }, 420);
    }
  };

  const handlePrevPage = () => {
    if (isFlipping) return;
    const step = currentPdfPage <= 2 ? 1 : 2;
    const targetPage = Math.max(1, currentPdfPage - step);

    if (targetPage < currentPdfPage) {
      setFlipDirection('prev');
      setIsFlipping(true);
      if (soundOn) playPageFlipSound();

      setTimeout(() => {
        setCurrentPdfPage(targetPage);
        setPageInputValue(targetPage.toString());
        setIsFlipping(false);
      }, 420);
    }
  };

  const handleJumpToPage = (p: number) => {
    const valid = Math.max(1, Math.min(pdfTotalPages, p));
    if (soundOn) playPageFlipSound();
    setCurrentPdfPage(valid);
    setPageInputValue(valid.toString());
    setShow3DCover(false);
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(pageInputValue, 10);
    if (!isNaN(parsed)) {
      handleJumpToPage(parsed);
    }
  };

  // Chapter Navigation Actions (for E-Reader Mode)
  const handleNextChapter = () => {
    if (currentChapterIdx < totalChapters - 1) {
      setCurrentChapterIdx(prev => prev + 1);
      if (soundOn) playPageFlipSound();
      if (onAddXP) onAddXP(15);
      if (storeAddXP) storeAddXP(15);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIdx > 0) {
      setCurrentChapterIdx(prev => prev - 1);
      if (soundOn) playPageFlipSound();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (displayMode === 'spiral3d') {
        if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
          e.preventDefault();
          handleNextPage();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          handlePrevPage();
        } else if (e.key === 'Home') {
          e.preventDefault();
          handleJumpToPage(1);
        } else if (e.key === 'End') {
          e.preventDefault();
          handleJumpToPage(pdfTotalPages);
        }
      } else if (displayMode === 'ereader') {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleNextChapter();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrevChapter();
        }
      }

      if (e.key === 'Escape') {
        setShowToc(false);
        if (isTheaterMode) setIsTheaterMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Text-to-Speech
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!currentChapter) return;

    window.speechSynthesis.cancel();
    const cleanText = currentChapter.content.replace(/[#*_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Bookmark Toggle
  const handleToggleBookmark = () => {
    if (!currentChapter) return;
    const updated = toggleChapterBookmark(book.id, currentChapter.id);
    setBookmarkedChapters(updated);
  };

  const isBookmarked = currentChapter ? bookmarkedChapters.includes(currentChapter.id) : false;

  // Filter TOC
  const filteredChapters = chapters.filter(ch => 
    ch.title.toLowerCase().includes(tocSearch.toLowerCase()) ||
    (ch.summary && ch.summary.toLowerCase().includes(tocSearch.toLowerCase()))
  );

  return (
    <div 
      className={`relative min-h-[94vh] bg-gradient-to-b from-[#02110B] via-[#041D14] to-[#010906] text-emerald-50 flex flex-col justify-between overflow-hidden antialiased ${
        isTheaterMode ? 'fixed inset-0 z-50 p-2 sm:p-4' : ''
      }`}
    >
      {/* Dynamic Ambient Color Backlight */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute top-1/6 left-1/4 w-[500px] h-[500px] rounded-full blur-[160px] opacity-25"
          style={{ backgroundColor: themeColor }}
        />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-mint-400/10 rounded-full blur-[160px]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* 1. TOP HEADER & MODE SWITCHER */}
      <header className="relative z-30 bg-[#02130C]/90 border-b border-emerald-900/60 backdrop-blur-md px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Back & Book Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToLibrary}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Library</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div 
                className="w-7 h-9 rounded-md shadow-md flex items-center justify-center text-white text-[9px] font-bold shrink-0 border border-white/20"
                style={{ background: `linear-gradient(135deg, ${themeColor} 0%, #061A11 120%)` }}
              >
                <BookMarked className="w-4 h-4 opacity-90" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span 
                    className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-extrabold border shadow-sm"
                    style={{ 
                      backgroundColor: `${themeColor}20`, 
                      color: themeColor,
                      borderColor: `${themeColor}40`
                    }}
                  >
                    {book.track.toUpperCase()}
                  </span>
                  <span className="text-xs font-semibold text-emerald-300/80 hidden sm:inline">
                    {book.author}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 font-bold hidden md:inline">
                    📖 {pdfTotalPages} Pages Unlocked
                  </span>
                </div>
                <h2 className="text-xs sm:text-sm font-extrabold text-white truncate max-w-xs sm:max-w-md pt-0.5 tracking-tight">
                  {book.title}
                </h2>
              </div>
            </div>
          </div>

          {/* Center: Triple Reading Mode Switcher */}
          <div className="flex items-center bg-[#010D08] border border-emerald-800/80 rounded-2xl p-1 text-xs font-mono shadow-inner">
            <button
              onClick={() => { setDisplayMode('spiral3d'); setShow3DCover(false); }}
              className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 font-bold transition-all ${
                displayMode === 'spiral3d'
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/25 scale-[1.02]'
                  : 'text-emerald-400 hover:text-white'
              }`}
              title="DearFlip-style 3D Spiral Book rendering all 600+ real PDF pages"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D Spiral Book ({pdfTotalPages}p)</span>
            </button>

            <button
              onClick={() => setDisplayMode('ereader')}
              className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 font-bold transition-all ${
                displayMode === 'ereader'
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/25 scale-[1.02]'
                  : 'text-emerald-400 hover:text-white'
              }`}
              title="Chapter summary and study notes mode"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Chapter E-Reader</span>
            </button>

            {resolvedPdfUrl && (
              <button
                onClick={() => setDisplayMode('pdf')}
                className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 font-bold transition-all ${
                  displayMode === 'pdf'
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/25 scale-[1.02]'
                    : 'text-emerald-400 hover:text-white'
                }`}
                title="Full original PDF document with native high-DPI engine"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Full PDF Document</span>
              </button>
            )}
          </div>

          {/* Right: Controls & Actions */}
          <div className="flex items-center gap-2">
            {/* 3D Cover Toggle */}
            {displayMode === 'spiral3d' && (
              <button
                onClick={() => setShow3DCover(!show3DCover)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border transition-all ${
                  show3DCover 
                    ? 'bg-amber-400 text-black border-amber-300 shadow-md' 
                    : 'bg-emerald-950/80 border-emerald-800 text-emerald-300 hover:bg-emerald-900'
                }`}
                title="Toggle 3D Hardcover Cover Display"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{show3DCover ? 'Inside Pages' : '3D Cover'}</span>
              </button>
            )}

            {/* Zoom Controls */}
            {displayMode === 'spiral3d' && !show3DCover && (
              <div className="flex items-center bg-emerald-950/80 border border-emerald-800/80 rounded-xl p-0.5 text-xs hidden sm:flex">
                <button
                  onClick={() => setZoomScale(prev => Math.max(0.75, prev - 0.15))}
                  className="p-1.5 text-emerald-400 hover:text-emerald-200"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono px-1.5 text-emerald-300 font-bold">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  onClick={() => setZoomScale(prev => Math.min(1.6, prev + 0.15))}
                  className="p-1.5 text-emerald-400 hover:text-emerald-200"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Table of Contents Drawer Toggle */}
            <button
              onClick={() => setShowToc(!showToc)}
              className="px-2.5 py-1.5 rounded-xl border border-emerald-800 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
              title="Table of Contents"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden md:inline">TOC</span>
            </button>

            {/* Sound FX Toggle */}
            <button
              onClick={() => {
                const next = !soundOn;
                setSoundOn(next);
                toggleSound(next);
              }}
              className={`p-1.5 rounded-xl border text-xs transition-all ${
                soundOn 
                  ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300' 
                  : 'bg-emerald-950/40 border-emerald-900 text-emerald-600'
              }`}
              title={soundOn ? 'Sound FX Enabled' : 'Sound Muted'}
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Theater Mode */}
            <button
              onClick={() => setIsTheaterMode(!isTheaterMode)}
              className="p-1.5 rounded-xl border border-emerald-800 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 transition-all"
              title={isTheaterMode ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isTheaterMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Raw PDF Download */}
            {resolvedPdfUrl && (
              <a
                href={resolvedPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-extrabold flex items-center gap-1 transition-all shadow-sm"
                title="Open or Download Original Complete PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Raw PDF</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* 2. BODY CONTENT: Renders chosen reading mode */}
      <main className="relative z-10 flex-1 flex flex-col justify-between overflow-hidden">
        
        {/* ============================================================ */}
        {/* MODE A: 3D SPIRAL BOOK (DearFlip Style with REAL PDF PAGES)  */}
        {/* ============================================================ */}
        {displayMode === 'spiral3d' && (
          <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 my-auto overflow-hidden">
            
            {/* Top Toolbar: Coil Selection & Real PDF Status */}
            <div className="flex items-center gap-3 mb-3 bg-emerald-950/90 border border-emerald-800/80 rounded-2xl px-4 py-1.5 text-xs font-mono shadow-md backdrop-blur-md">
              <span className="text-emerald-400 font-bold">Spiral Ring:</span>
              {(['emerald', 'chrome', 'gold', 'obsidian'] as SpiralTheme[]).map((theme) => (
                <button
                  key={theme}
                  onClick={() => setSpiralTheme(theme)}
                  className={`px-2 py-0.5 rounded capitalize transition-all ${
                    spiralTheme === theme 
                      ? 'bg-emerald-500 text-black font-extrabold shadow-sm' 
                      : 'text-emerald-400 hover:text-white'
                  }`}
                >
                  {theme}
                </button>
              ))}
              <span className="text-emerald-700">|</span>
              <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                {isPdfLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                    <span>Loading Document...</span>
                  </>
                ) : (
                  <span>
                    Spread: {currentPdfPage === 1 ? '1' : `${currentPdfPage % 2 === 0 ? currentPdfPage : currentPdfPage - 1}-${(currentPdfPage % 2 === 0 ? currentPdfPage : currentPdfPage - 1) + 1}`} of {pdfTotalPages}
                  </span>
                )}
              </span>
            </div>

            {/* 3D Physical Book Stage */}
            <div 
              className="relative my-auto"
              style={{
                perspective: '2200px',
              }}
            >
              {show3DCover ? (
                /* -------------------------------------------------------- */
                /* 3D HARDCOVER FRONT COVER VIEW                            */
                /* -------------------------------------------------------- */
                <motion.div
                  initial={{ rotateY: 15, scale: 0.95 }}
                  animate={{ rotateY: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="relative w-[360px] sm:w-[480px] md:w-[540px] aspect-[1/1.42] rounded-3xl p-8 sm:p-12 shadow-[0_35px_80px_rgba(0,0,0,0.9)] border-4 border-amber-400/40 flex flex-col justify-between text-white relative overflow-hidden group cursor-pointer"
                  style={{
                    background: `linear-gradient(145deg, ${themeColor} 0%, #03140D 100%)`,
                    transformStyle: 'preserve-3d',
                  }}
                  onClick={() => setShow3DCover(false)}
                >
                  <div className="absolute inset-4 border-2 border-amber-300/30 rounded-2xl pointer-events-none" />
                  <div className="absolute inset-6 border border-amber-300/20 rounded-xl pointer-events-none" />

                  {/* Corner Ornaments */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-400 pointer-events-none" />
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-400 pointer-events-none" />
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-400 pointer-events-none" />
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-400 pointer-events-none" />

                  {/* Top Cover Header */}
                  <div className="relative z-10 space-y-2 text-center pt-2">
                    <span className="text-[10px] sm:text-xs font-mono tracking-widest text-amber-300 font-extrabold uppercase">
                      DataVeda Master Vault • {pdfTotalPages} Pages
                    </span>
                    <div className="w-12 h-0.5 bg-amber-400/60 mx-auto" />
                  </div>

                  {/* Center Emblem & Title */}
                  <div className="relative z-10 text-center space-y-4 my-auto">
                    <div 
                      className="w-20 h-20 mx-auto rounded-2xl border-2 border-amber-300/60 flex items-center justify-center shadow-2xl backdrop-blur-sm"
                      style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                    >
                      <BookOpen className="w-10 h-10 text-amber-300" />
                    </div>

                    <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
                      {book.title}
                    </h1>

                    <p className="text-sm sm:text-base font-serif italic text-amber-200/90">
                      by {book.author}
                    </p>
                  </div>

                  {/* Bottom Cover Badge */}
                  <div className="relative z-10 text-center space-y-2 pb-2">
                    <div className="w-12 h-0.5 bg-amber-400/60 mx-auto" />
                    <p className="text-[11px] font-mono text-emerald-300 font-bold uppercase tracking-wider">
                      Click to Open Spiral Book 📖
                    </p>
                  </div>
                </motion.div>
              ) : (
                /* -------------------------------------------------------- */
                /* 3D DUAL-PAGE SPREAD VIEW (Rendering Real PDF Pages)      */
                /* -------------------------------------------------------- */
                <div 
                  className="relative flex items-center z-10"
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Realistic Hardcover Underlay Framing (Vibrant Color Border) */}
                  <div 
                    className="absolute -inset-3 sm:-inset-5 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] z-0 pointer-events-none border-2 border-white/10"
                    style={{
                      background: `linear-gradient(135deg, ${themeColor} 0%, #03140D 100%)`,
                    }}
                  >
                    {/* Gilded Silk Bookmark Ribbon */}
                    <div 
                      className="absolute left-1/2 -bottom-10 w-4 h-14 -translate-x-1/2 rounded-b-md shadow-2xl z-0"
                      style={{
                        backgroundColor: themeColor,
                        borderLeft: '1px solid rgba(255,255,255,0.4)',
                        clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)'
                      }}
                    />
                  </div>

                  {/* ================= LEFT PAGE CANVAS ================= */}
                  <div 
                    onClick={handlePrevPage}
                    className="relative w-[340px] sm:w-[460px] md:w-[530px] aspect-[1/1.414] bg-white text-slate-900 rounded-l-2xl sm:rounded-l-3xl shadow-[inset_-20px_0_35px_rgba(0,0,0,0.08),-15px_15px_30px_rgba(0,0,0,0.5)] overflow-hidden cursor-pointer group z-10 flex flex-col justify-between"
                    style={{
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility',
                      backfaceVisibility: 'hidden',
                      transform: 'translateZ(0)',
                    }}
                  >
                    {/* Center Spine Curvature Drop-shadow */}
                    <div className="absolute right-0 top-0 bottom-0 w-14 bg-gradient-to-l from-black/15 via-black/5 to-transparent pointer-events-none z-20" />
                    
                    {/* Decorative Top Accent Ribbon */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-1.5 z-20"
                      style={{ backgroundColor: themeColor }}
                    />

                    {/* Turn Indicator on Hover */}
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-md">
                      <ChevronLeft className="w-5 h-5" />
                    </div>

                    {currentPdfPage === 1 ? (
                      // Front Inner Flap / Title Plate
                      <div className="w-full h-full bg-gradient-to-br from-[#0c2419] to-[#04150e] flex flex-col items-center justify-center p-8 text-center text-white relative">
                        <div 
                          className="w-16 h-16 rounded-2xl border border-white/20 flex items-center justify-center mb-4 shadow-xl"
                          style={{ backgroundColor: `${themeColor}30` }}
                        >
                          <BookOpen className="w-8 h-8 text-emerald-300" />
                        </div>
                        <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
                          {book.track.toUpperCase()}
                        </span>
                        <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1 mb-2">
                          {book.title}
                        </h2>
                        <p className="text-xs text-emerald-200/80 font-serif italic mb-6">
                          {book.author}
                        </p>
                        <span className="text-[10px] font-mono text-emerald-300 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 font-bold">
                          Turn Right to Begin (Page 1) →
                        </span>
                      </div>
                    ) : (
                      // Real Left PDF Page Canvas
                      <div className="w-full h-full relative flex items-center justify-center bg-white">
                        <canvas 
                          ref={leftCanvasRef} 
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute bottom-2 left-4 text-[10px] font-mono text-slate-500 bg-white/90 px-2 py-0.5 rounded shadow-sm z-20 border border-slate-200 font-bold">
                          Page {currentPdfPage % 2 === 0 ? currentPdfPage : currentPdfPage - 1}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ================= 3D SPIRAL SPINE ================= */}
                  <SpiralBinding3D 
                    theme={spiralTheme} 
                    ringsCount={24} 
                    isSinglePage={false} 
                  />

                  {/* ================= RIGHT PAGE CANVAS ================= */}
                  <div 
                    onClick={handleNextPage}
                    className="relative w-[340px] sm:w-[460px] md:w-[530px] aspect-[1/1.414] bg-white text-slate-900 rounded-r-2xl sm:rounded-r-3xl shadow-[inset_20px_0_35px_rgba(0,0,0,0.08),15px_15px_30px_rgba(0,0,0,0.5)] overflow-hidden cursor-pointer group z-10 flex flex-col justify-between"
                    style={{
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility',
                      backfaceVisibility: 'hidden',
                      transform: 'translateZ(0)',
                    }}
                  >
                    {/* Center Spine Curvature Drop-shadow */}
                    <div className="absolute left-0 top-0 bottom-0 w-14 bg-gradient-to-r from-black/15 via-black/5 to-transparent pointer-events-none z-20" />

                    {/* Decorative Top Accent Ribbon */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-1.5 z-20"
                      style={{ backgroundColor: themeColor }}
                    />

                    {/* Turn Indicator on Hover */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-md">
                      <ChevronRight className="w-5 h-5" />
                    </div>

                    {/* Real Right PDF Page Canvas */}
                    <div className="w-full h-full relative flex items-center justify-center bg-white">
                      <canvas 
                        ref={rightCanvasRef} 
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute bottom-2 right-4 text-[10px] font-mono text-slate-500 bg-white/90 px-2 py-0.5 rounded shadow-sm z-20 border border-slate-200 font-bold">
                        Page {currentPdfPage === 1 ? 1 : (currentPdfPage % 2 === 0 ? currentPdfPage + 1 : currentPdfPage)}
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* HIGH-QUALITY 3D PAGE TURN CURL ANIMATION */}
              <AnimatePresence>
                {isFlipping && (
                  <motion.div
                    initial={{
                      rotateY: flipDirection === 'next' ? 0 : -180,
                      z: 10,
                      opacity: 1,
                    }}
                    animate={{
                      rotateY: flipDirection === 'next' ? -180 : 0,
                      z: 45,
                      opacity: 1,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.42,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      transformOrigin: flipDirection === 'next' ? 'left center' : 'right center',
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                    }}
                    className={`absolute top-0 bottom-0 ${
                      flipDirection === 'next' ? 'left-1/2' : 'right-1/2'
                    } w-[340px] sm:w-[460px] md:w-[530px] aspect-[1/1.414] bg-white shadow-2xl z-40 pointer-events-none rounded-r-2xl sm:rounded-r-3xl overflow-hidden border-r border-slate-300`}
                  >
                    <div className="w-full h-full p-8 flex flex-col justify-between relative bg-gradient-to-r from-slate-100 via-white to-slate-200">
                      <div className="space-y-4 opacity-40">
                        <div className="h-4 bg-slate-400 rounded w-1/4" />
                        <div className="h-8 bg-slate-500 rounded w-4/5" />
                        <div className="space-y-2 pt-4">
                          <div className="h-2.5 bg-slate-300 rounded w-full" />
                          <div className="h-2.5 bg-slate-300 rounded w-11/12" />
                          <div className="h-2.5 bg-slate-300 rounded w-5/6" />
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-black/20 pointer-events-none" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Bottom 3D Spiral Navigation Bar (Scrubber & Jump) */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 w-full max-w-4xl px-2 z-20">
              
              {/* Left: Quick Jump / First / Prev buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleJumpToPage(1)}
                  disabled={currentPdfPage <= 1 || isFlipping}
                  className="p-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 disabled:opacity-40 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold transition-all"
                  title="First Page (Home)"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleJumpToPage(Math.max(1, currentPdfPage - 10))}
                  disabled={currentPdfPage <= 1 || isFlipping}
                  className="px-2.5 py-1 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 disabled:opacity-40 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold transition-all hidden sm:inline"
                  title="Back 10 Pages"
                >
                  -10
                </button>

                <button
                  onClick={handlePrevPage}
                  disabled={currentPdfPage <= 1 || isFlipping}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 disabled:opacity-40 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>
              </div>

              {/* Center: Real Range Scrubber & Direct Page Jump Input */}
              <div className="flex items-center gap-3">
                <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1.5 text-xs font-mono">
                  <span className="text-emerald-500 font-bold hidden sm:inline">Page</span>
                  <input
                    type="text"
                    value={pageInputValue}
                    onChange={(e) => setPageInputValue(e.target.value)}
                    className="w-14 text-center py-1 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-200 focus:outline-none focus:border-emerald-400 font-extrabold"
                  />
                  <span className="text-emerald-400 font-bold">/ {pdfTotalPages}</span>
                </form>

                {/* Range Scrubber (Drag across all 600+ pages!) */}
                <div className="hidden md:flex items-center gap-2 w-44 lg:w-64">
                  <input
                    type="range"
                    min={1}
                    max={pdfTotalPages}
                    value={currentPdfPage}
                    onChange={(e) => handleJumpToPage(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>

              {/* Right: Next / +10 / Last buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleNextPage}
                  disabled={currentPdfPage >= pdfTotalPages || isFlipping}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black text-xs font-mono font-extrabold flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/25"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleJumpToPage(Math.min(pdfTotalPages, currentPdfPage + 10))}
                  disabled={currentPdfPage >= pdfTotalPages || isFlipping}
                  className="px-2.5 py-1 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 disabled:opacity-40 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold transition-all hidden sm:inline"
                  title="Forward 10 Pages"
                >
                  +10
                </button>

                <button
                  onClick={() => handleJumpToPage(pdfTotalPages)}
                  disabled={currentPdfPage >= pdfTotalPages || isFlipping}
                  className="p-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 disabled:opacity-40 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold transition-all"
                  title="Last Page (End)"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODE B: CHAPTER E-READER (High-Contrast, Crisp Typography)   */}
        {/* ============================================================ */}
        {displayMode === 'ereader' && (
          <div className="max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
            
            {/* Chapter Header Card with Rich Book Theme Color */}
            <div 
              className="p-6 sm:p-8 rounded-3xl border shadow-xl space-y-3 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${themeColor}15 0%, #03170E 100%)`,
                borderColor: `${themeColor}40`
              }}
            >
              <div 
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: themeColor }}
              />

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <span 
                  className="px-3 py-1 rounded-full font-bold uppercase tracking-wider border shadow-sm"
                  style={{
                    backgroundColor: `${themeColor}25`,
                    color: themeColor,
                    borderColor: `${themeColor}50`
                  }}
                >
                  Chapter {currentChapter.number} of {totalChapters}
                </span>
                <span className="text-emerald-300 font-semibold">
                  ⏱️ Reading Time: {currentChapter.readingTime || '15 min'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {currentChapter.title}
              </h1>

              {currentChapter.summary && (
                <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed italic border-l-3 border-emerald-400 pl-3">
                  {currentChapter.summary}
                </p>
              )}
            </div>

            {/* Chapter Content Body */}
            <div className="p-6 sm:p-10 rounded-3xl bg-emerald-950/40 border border-emerald-900/60 shadow-2xl backdrop-blur-sm space-y-6">
              <div className="prose prose-invert prose-emerald max-w-none text-emerald-100 text-sm sm:text-base leading-relaxed space-y-4 font-serif">
                {currentChapter.content.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('# ')) {
                    return <h2 key={idx} className="text-xl font-bold text-white border-b border-emerald-800/60 pb-2">{paragraph.replace('# ', '')}</h2>;
                  }
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={idx} className="text-base font-bold text-emerald-300 pt-2">{paragraph.replace('### ', '')}</h3>;
                  }
                  if (paragraph.startsWith('> ')) {
                    return (
                      <blockquote key={idx} className="p-3 rounded-xl bg-emerald-900/30 border-l-4 border-emerald-400 font-mono text-xs text-emerald-200">
                        {paragraph.replace('> ', '')}
                      </blockquote>
                    );
                  }
                  if (paragraph.startsWith('```')) {
                    return (
                      <pre key={idx} className="p-4 rounded-2xl bg-black/60 border border-emerald-900 font-mono text-xs text-emerald-300 overflow-x-auto">
                        <code>{paragraph.replace(/```[a-z]*/g, '')}</code>
                      </pre>
                    );
                  }
                  return <p key={idx} className="leading-relaxed">{paragraph}</p>;
                })}
              </div>

              {/* Senior Staff DE Tip Callout */}
              {currentChapter.seniorTip && (
                <div className="p-5 rounded-2xl bg-emerald-900/40 border border-emerald-500/40 space-y-2 shadow-sm">
                  <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    Senior Staff Data Engineer Advice
                  </span>
                  <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed font-serif">
                    {currentChapter.seniorTip}
                  </p>
                </div>
              )}

              {/* Common Anti-Pattern Warning */}
              {currentChapter.antiPattern && (
                <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-2 shadow-sm">
                  <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Production Pitfall & Anti-Pattern to Avoid
                  </span>
                  <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed font-serif">
                    {currentChapter.antiPattern}
                  </p>
                </div>
              )}

              {/* Linked Practice Arena Challenge */}
              {currentChapter.linkedPracticeId && onNavigatePractice && (
                <div className="p-4 rounded-2xl bg-[#031c12] border border-emerald-700/60 flex items-center justify-between gap-4 shadow-md">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Interactive Lab Practice</span>
                    <p className="text-xs text-emerald-200 font-semibold">Test your understanding with runnable production exercises.</p>
                  </div>
                  <button
                    onClick={() => onNavigatePractice(currentChapter.linkedPracticeId!)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold flex items-center gap-1 shrink-0"
                  >
                    <span>Launch Lab</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Chapter Navigation Bar */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-emerald-900/60">
              <button
                onClick={handlePrevChapter}
                disabled={currentChapterIdx === 0}
                className="px-4 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 disabled:opacity-40 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Chapter</span>
              </button>

              <span className="text-xs font-mono text-emerald-400 font-bold">
                Chapter {currentChapterIdx + 1} / {totalChapters}
              </span>

              <button
                onClick={handleNextChapter}
                disabled={currentChapterIdx === totalChapters - 1}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
              >
                <span>Next Chapter</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODE C: FULL NATIVE PDF DOCUMENT VIEWER (All 600+ pages)     */}
        {/* ============================================================ */}
        {displayMode === 'pdf' && resolvedPdfUrl && (
          <div className="flex-1 w-full h-[85vh] p-2 sm:p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2 px-2 text-xs font-mono text-emerald-400">
              <span className="font-bold">Native PDF Document Viewer (All {pdfTotalPages} Pages Active)</span>
              <a
                href={resolvedPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-emerald-300 hover:text-white underline font-bold"
              >
                <span>Open in Full Browser Window</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex-1 w-full bg-neutral-900 rounded-2xl overflow-hidden border border-emerald-800 shadow-2xl relative">
              <iframe
                src={`${resolvedPdfUrl}#toolbar=1&navpanes=1`}
                className="w-full h-full border-0 rounded-2xl"
                title={book.title}
              />
            </div>
          </div>
        )}

      </main>

      {/* 3. TABLE OF CONTENTS DRAWER */}
      <AnimatePresence>
        {showToc && (
          <motion.div
            initial={{ x: -360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -360, opacity: 0 }}
            className="fixed top-0 left-0 bottom-0 w-full sm:w-96 bg-[#031710]/95 border-r-2 border-emerald-500/40 shadow-2xl backdrop-blur-2xl z-50 p-6 flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between border-b border-emerald-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <List className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono">Table of Contents</h3>
                    <p className="text-[10px] text-emerald-400 font-mono">{pdfTotalPages} Pages • {totalChapters} Chapters</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowToc(false)}
                  className="p-1.5 rounded-xl border border-emerald-800 hover:bg-emerald-900 text-emerald-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search chapters */}
              <div className="relative mb-4">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                <input
                  type="text"
                  placeholder="Filter chapters..."
                  value={tocSearch}
                  onChange={(e) => setTocSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-800 text-xs text-emerald-200 placeholder-emerald-600 focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Chapters list */}
              <div className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-1">
                {filteredChapters.map((ch) => {
                  const originalIdx = chapters.findIndex(c => c.id === ch.id);
                  const isCurrent = originalIdx === currentChapterIdx;

                  return (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setCurrentChapterIdx(originalIdx);
                        setShowToc(false);
                      }}
                      className={`w-full text-left p-3 rounded-2xl border text-xs transition-all flex items-start gap-2.5 ${
                        isCurrent
                          ? 'bg-emerald-500 text-black border-emerald-400 font-bold shadow-md'
                          : 'bg-emerald-950/60 hover:bg-emerald-900 border-emerald-800/80 text-emerald-200'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] shrink-0 font-mono font-bold ${
                        isCurrent ? 'bg-black text-emerald-300' : 'bg-emerald-900 text-emerald-400'
                      }`}>
                        {ch.number}
                      </span>
                      <div className="truncate">
                        <p className="truncate leading-tight">{ch.title}</p>
                        <span className={`text-[10px] font-mono ${isCurrent ? 'text-black/70' : 'text-emerald-500'}`}>
                          {ch.readingTime || '15 min'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-emerald-800 text-[11px] font-mono text-emerald-400 flex items-center justify-between">
              <span>DataVeda Reader</span>
              <span className="text-emerald-300 font-bold">100% Unlocked</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
