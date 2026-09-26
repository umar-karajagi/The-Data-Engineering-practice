'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Columns,
  Square,
  Layers,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  RotateCcw,
  Volume2,
  VolumeX,
  FileText,
  Search,
  CheckCircle2,
  X,
  List,
  Sliders,
  Compass
} from 'lucide-react';
import { BookReference } from '../../types';
import { SpiralBinding3D, SpiralTheme } from './SpiralBinding3D';
import { playPageFlipSound, isSoundEnabled, toggleSound } from '../../lib/sound';

interface Crazy3DBookReaderProps {
  book: BookReference;
  initialChapterId?: string;
  onBackToLibrary: () => void;
  onNavigatePractice?: (practiceId: string) => void;
  onAddXP?: (amount: number) => void;
}

export const Crazy3DBookReader: React.FC<Crazy3DBookReaderProps> = ({
  book,
  onBackToLibrary,
  onNavigatePractice,
  onAddXP
}) => {
  // Navigation & Page State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageInputValue, setPageInputValue] = useState<string>('1');
  const [totalPages, setTotalPages] = useState<number>(book.pageCount || 1);
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(true);
  const [pdfLoadError, setPdfLoadError] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);

  // Reader Settings
  const [viewMode, setViewMode] = useState<'spread' | 'single'>('spread');
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [spiralTheme, setSpiralTheme] = useState<SpiralTheme>('emerald');
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);

  // 3D Dynamics & Drawers
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [showThumbnails, setShowThumbnails] = useState<boolean>(false);
  const [showCompanion, setShowCompanion] = useState<boolean>(false);
  const [companionTab, setCompanionTab] = useState<'tips' | 'concepts' | 'quiz' | 'chapters'>('tips');
  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Canvases refs
  const leftCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const singleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const flipFrontCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const flipBackCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Interactive Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const pdfResolvedUrl = book.pdfUrl || (book.originalFileName ? `${basePath}/vault_storage/${encodeURIComponent(book.originalFileName)}` : '');

  // 1. Initialize PDF.js Engine & Load Document
  useEffect(() => {
    let isCancelled = false;

    async function initPdfEngine() {
      setIsPdfLoading(true);
      setPdfLoadError(null);

      try {
        // Check if PDF.js is already attached to window
        let pdfjs = (window as any).pdfjsLib;

        if (!pdfjs) {
          // Load PDF.js script dynamically
          const script = document.createElement('script');
          script.src = `${basePath}/pdfjs/pdf.min.js`;
          script.async = true;

          const loadPromise = new Promise((resolve, reject) => {
            script.onload = () => resolve((window as any).pdfjsLib);
            script.onerror = () => {
              // CDN fallback if local script fails
              const cdnScript = document.createElement('script');
              cdnScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
              cdnScript.onload = () => resolve((window as any).pdfjsLib);
              cdnScript.onerror = () => reject(new Error('Failed to load PDF.js engine from both local and CDN.'));
              document.head.appendChild(cdnScript);
            };
          });

          document.head.appendChild(script);
          pdfjs = await loadPromise;
        }

        if (pdfjs) {
          pdfjs.GlobalWorkerOptions.workerSrc = `${basePath}/pdfjs/pdf.worker.min.js`;
        }

        if (!pdfResolvedUrl) {
          throw new Error('No PDF URL available for this literature.');
        }

        // Fetch PDF document
        const loadingTask = pdfjs.getDocument({
          url: pdfResolvedUrl,
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (!isCancelled) {
          setPdfDoc(doc);
          setTotalPages(doc.numPages);
          setIsPdfLoading(false);
        }
      } catch (err: any) {
        console.warn('PDF.js loading warning:', err);
        if (!isCancelled) {
          setPdfLoadError(err?.message || 'Could not load PDF document.');
          setIsPdfLoading(false);
        }
      }
    }

    initPdfEngine();

    return () => {
      isCancelled = true;
    };
  }, [pdfResolvedUrl, basePath]);

  // 2. Render PDF Pages on Canvas
  const renderPdfPage = useCallback(async (
    pageNum: number, 
    canvas: HTMLCanvasElement | null, 
    scaleMultiplier: number = 1.0
  ) => {
    if (!pdfDoc || !canvas || pageNum < 1 || pageNum > totalPages) {
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    try {
      const page = await pdfDoc.getPage(pageNum);
      const pixelRatio = typeof window !== 'undefined' ? (window.devicePixelRatio || 1.5) : 1.5;
      const baseScale = 1.35 * zoomScale * scaleMultiplier;
      const viewport = page.getViewport({ scale: baseScale * pixelRatio });

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = '100%';
      canvas.style.height = '100%';

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({
          canvasContext: ctx,
          viewport: viewport
        }).promise;
      }
    } catch (err) {
      console.error(`Error rendering PDF page ${pageNum}:`, err);
    }
  }, [pdfDoc, totalPages, zoomScale]);

  // 3. Render current spread/single pages whenever page or viewMode changes
  useEffect(() => {
    if (!pdfDoc) return;

    if (viewMode === 'single') {
      renderPdfPage(currentPage, singleCanvasRef.current);
    } else {
      // In spread mode:
      // Page 1 is cover (or single), subsequent pages are pairs: (2, 3), (4, 5)...
      if (currentPage === 1) {
        renderPdfPage(1, rightCanvasRef.current);
        // Clear left canvas for cover view
        if (leftCanvasRef.current) {
          const ctx = leftCanvasRef.current.getContext('2d');
          if (ctx) ctx.clearRect(0, 0, leftCanvasRef.current.width, leftCanvasRef.current.height);
        }
      } else {
        const leftPageNum = currentPage % 2 === 0 ? currentPage : currentPage - 1;
        const rightPageNum = leftPageNum + 1;
        renderPdfPage(leftPageNum, leftCanvasRef.current);
        renderPdfPage(rightPageNum, rightCanvasRef.current);
      }
    }

    setPageInputValue(currentPage.toString());
  }, [pdfDoc, currentPage, viewMode, renderPdfPage]);

  // Handle Mouse Perspective Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({ x: x * 6, y: -y * 6 });
  };

  // Page Turn Handlers
  const handleNextPage = () => {
    if (isFlipping) return;
    const increment = viewMode === 'spread' ? (currentPage === 1 ? 1 : 2) : 1;
    const targetPage = Math.min(totalPages, currentPage + increment);

    if (targetPage > currentPage) {
      setFlipDirection('next');
      setIsFlipping(true);
      if (soundOn) playPageFlipSound();

      setTimeout(() => {
        setCurrentPage(targetPage);
        setIsFlipping(false);
        if (onAddXP) onAddXP(10);
      }, 350);
    }
  };

  const handlePrevPage = () => {
    if (isFlipping) return;
    const decrement = viewMode === 'spread' ? (currentPage <= 2 ? 1 : 2) : 1;
    const targetPage = Math.max(1, currentPage - decrement);

    if (targetPage < currentPage) {
      setFlipDirection('prev');
      setIsFlipping(true);
      if (soundOn) playPageFlipSound();

      setTimeout(() => {
        setCurrentPage(targetPage);
        setIsFlipping(false);
      }, 350);
    }
  };

  const handleJumpToPage = (p: number) => {
    const valid = Math.max(1, Math.min(totalPages, p));
    if (soundOn) playPageFlipSound();
    setCurrentPage(valid);
    setPageInputValue(valid.toString());
    setShowThumbnails(false);
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(pageInputValue, 10);
    if (!isNaN(parsed)) {
      handleJumpToPage(parsed);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

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
        handleJumpToPage(totalPages);
      } else if (e.key === 'Escape') {
        setShowCompanion(false);
        setShowThumbnails(false);
        if (isTheaterMode) setIsTheaterMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const conceptCards = book.conceptCards || [];
  const quizQuestions = book.quizQuestions || [];

  return (
    <div 
      onMouseMove={handleMouseMove}
      className={`relative min-h-[94vh] bg-gradient-to-b from-[#03140E] via-[#052419] to-[#020D08] text-emerald-50 flex flex-col justify-between overflow-hidden select-none transition-all ${
        isTheaterMode ? 'fixed inset-0 z-50 p-2 sm:p-4' : 'p-3 sm:p-6'
      }`}
    >
      {/* Botanical Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mint-400/10 rounded-full blur-[160px]" />
        <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
          <path d="M-50,200 Q200,100 450,300 T900,250 T1400,400" fill="none" stroke="#34D399" strokeWidth="2" strokeDasharray="6 6" />
          <path d="M100,800 Q400,600 700,750 T1300,650" fill="none" stroke="#10B981" strokeWidth="1.5" />
        </svg>
      </div>

      {/* 1. TOP TOOLBAR: Controls, File Info, Spiral Style, Zoom */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-900/60 pb-3 backdrop-blur-md">
        
        {/* Left: Back & Title info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLibrary}
            className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Library</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                3D Spiral Flipbook
              </span>
              <span className="text-[11px] font-mono text-emerald-400/80 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 hidden md:inline">
                {totalPages} Total Pages Unlocked
              </span>
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md pt-0.5">
              {book.title}
            </h2>
          </div>
        </div>

        {/* Center: Spiral Metal Selector */}
        <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-800/80 rounded-xl p-1 text-[11px] font-mono hidden lg:flex">
          <span className="text-emerald-500 px-2">Coil:</span>
          {(['chrome', 'emerald', 'gold', 'obsidian'] as SpiralTheme[]).map((theme) => (
            <button
              key={theme}
              onClick={() => setSpiralTheme(theme)}
              className={`px-2 py-0.5 rounded capitalize transition-all ${
                spiralTheme === theme 
                  ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/50 font-bold' 
                  : 'text-emerald-400/70 hover:text-emerald-200'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>

        {/* Right: View Mode, Zoom, Sound, Download, Companion */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-emerald-950/80 border border-emerald-800/80 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setViewMode('spread')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'spread' ? 'bg-emerald-500/30 text-emerald-200' : 'text-emerald-500 hover:text-emerald-300'}`}
              title="Two-Page Book Spread"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('single')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'single' ? 'bg-emerald-500/30 text-emerald-200' : 'text-emerald-500 hover:text-emerald-300'}`}
              title="Single Page Notepad"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center bg-emerald-950/80 border border-emerald-800/80 rounded-xl p-0.5 text-xs hidden sm:flex">
            <button
              onClick={() => setZoomScale(prev => Math.max(0.75, prev - 0.15))}
              className="p-1.5 text-emerald-400 hover:text-emerald-200"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-1.5 text-emerald-300">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              onClick={() => setZoomScale(prev => Math.min(1.75, prev + 0.15))}
              className="p-1.5 text-emerald-400 hover:text-emerald-200"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sound Toggle */}
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
            title={soundOn ? 'Mute Page Flip Sound' : 'Enable Page Flip Sound'}
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Open / Download Raw PDF */}
          {pdfResolvedUrl && (
            <a
              href={pdfResolvedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-xs font-mono font-bold text-emerald-300 flex items-center gap-1 transition-all"
              title="Open or Download Original Complete PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Raw PDF</span>
            </a>
          )}

          {/* Study Companion Drawer Toggle */}
          <button
            onClick={() => setShowCompanion(!showCompanion)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border transition-all ${
              showCompanion 
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-md shadow-emerald-500/20' 
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-800 hover:bg-emerald-900'
            }`}
            title="Open AI Study Notes, Tips & Quizzes"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Study Companion</span>
          </button>

          {/* Theater / Fullscreen Mode */}
          <button
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            className="p-1.5 rounded-xl border border-emerald-800 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 transition-all"
            title={isTheaterMode ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isTheaterMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. MAIN READING STAGE: 3D Spiral Book */}
      <div 
        className="relative z-10 flex-1 flex items-center justify-center my-3 sm:my-6 overflow-hidden"
        style={{
          perspective: '1800px',
        }}
      >
        {isPdfLoading ? (
          // 3D Spiral Loading Skeleton
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <div className="relative w-48 h-64 rounded-2xl bg-emerald-950/60 border-2 border-emerald-500/40 p-4 shadow-2xl flex flex-col justify-between animate-pulse">
              <SpiralBinding3D theme={spiralTheme} isSinglePage={true} ringsCount={12} />
              <div className="w-full h-4 bg-emerald-500/20 rounded" />
              <div className="space-y-2">
                <div className="w-3/4 h-2.5 bg-emerald-500/10 rounded" />
                <div className="w-5/6 h-2.5 bg-emerald-500/10 rounded" />
                <div className="w-2/3 h-2.5 bg-emerald-500/10 rounded" />
              </div>
              <div className="w-1/2 h-3 bg-emerald-500/20 rounded self-end" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-emerald-300 font-mono flex items-center gap-2 justify-center">
                <Sparkles className="w-4 h-4 animate-spin text-emerald-400" />
                Opening 3D Spiral Vault...
              </p>
              <p className="text-xs text-emerald-500 font-mono">
                Streaming {book.title} (All pages unlocked)
              </p>
            </div>
          </div>
        ) : pdfLoadError ? (
          // Fallback if PDF fails to load in browser
          <div className="max-w-md p-6 bg-red-950/30 border border-red-500/30 rounded-2xl text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">Could Not Stream PDF Directly</h3>
            <p className="text-xs text-emerald-400/80 leading-relaxed">
              {pdfLoadError}
            </p>
            {pdfResolvedUrl && (
              <a
                href={pdfResolvedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs"
              >
                <Download className="w-4 h-4" />
                Open Original PDF Directly
              </a>
            )}
          </div>
        ) : (
          // 3D Physical Spiral Book Structure
          <div
            className="relative transition-transform duration-300 ease-out"
            style={{
              transform: `rotateX(${mouseTilt.y}deg) rotateY(${mouseTilt.x}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Hardcover Outer Shadow & Bevel Backplate */}
            <div className="absolute -inset-4 sm:-inset-6 bg-[#041a12] rounded-3xl border border-emerald-800/50 shadow-[0_30px_70px_rgba(0,0,0,0.85)] z-0 pointer-events-none" />

            {/* DUAL-PAGE SPREAD VIEW */}
            {viewMode === 'spread' ? (
              <div className="relative flex items-center z-10">
                
                {/* LEFT PAGE CONTAINER */}
                <div 
                  onClick={handlePrevPage}
                  className="relative w-[340px] sm:w-[460px] md:w-[540px] lg:w-[620px] aspect-[1/1.414] bg-white rounded-l-2xl sm:rounded-l-3xl shadow-[inset_-15px_0_30px_rgba(0,0,0,0.12),-12px_12px_24px_rgba(0,0,0,0.5)] overflow-hidden cursor-pointer group"
                  style={{
                    transformOrigin: 'right center',
                  }}
                >
                  {/* Left Page Edge Drop-gradient mimicking paper curvature */}
                  <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/25 via-black/10 to-transparent pointer-events-none z-20" />
                  
                  {/* Turn indicator on hover */}
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-md">
                    <ChevronLeft className="w-5 h-5" />
                  </div>

                  {currentPage === 1 ? (
                    // Cover inside blank/front flap
                    <div className="w-full h-full bg-gradient-to-br from-[#0c2419] to-[#05150e] flex flex-col items-center justify-center p-8 text-center border-r border-emerald-900/60">
                      <BookOpen className="w-16 h-16 text-emerald-500/40 mb-4" />
                      <h3 className="text-base font-bold text-emerald-300 font-mono">{book.title}</h3>
                      <p className="text-xs text-emerald-500/80 mt-1">{book.author}</p>
                      <span className="text-[10px] font-mono text-emerald-400 mt-4 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800">
                        Turn right to start reading →
                      </span>
                    </div>
                  ) : (
                    // Left Canvas Page
                    <canvas 
                      ref={leftCanvasRef} 
                      className="w-full h-full object-contain"
                    />
                  )}

                  {/* Page Number indicator */}
                  {currentPage > 1 && (
                    <div className="absolute bottom-2 left-4 text-[10px] font-mono text-gray-500 bg-white/80 px-2 py-0.5 rounded shadow-sm z-20">
                      {currentPage % 2 === 0 ? currentPage : currentPage - 1}
                    </div>
                  )}
                </div>

                {/* 3D SPIRAL SPINE CONNECTOR */}
                <SpiralBinding3D 
                  theme={spiralTheme} 
                  ringsCount={24} 
                  isSinglePage={false} 
                />

                {/* RIGHT PAGE CONTAINER */}
                <div 
                  onClick={handleNextPage}
                  className="relative w-[340px] sm:w-[460px] md:w-[540px] lg:w-[620px] aspect-[1/1.414] bg-white rounded-r-2xl sm:rounded-r-3xl shadow-[inset_15px_0_30px_rgba(0,0,0,0.12),12px_12px_24px_rgba(0,0,0,0.5)] overflow-hidden cursor-pointer group"
                  style={{
                    transformOrigin: 'left center',
                  }}
                >
                  {/* Right Page Edge Drop-gradient */}
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/25 via-black/10 to-transparent pointer-events-none z-20" />

                  {/* Turn indicator on hover */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-md">
                    <ChevronRight className="w-5 h-5" />
                  </div>

                  {/* Right Canvas Page */}
                  <canvas 
                    ref={rightCanvasRef} 
                    className="w-full h-full object-contain"
                  />

                  {/* Page Number indicator */}
                  <div className="absolute bottom-2 right-4 text-[10px] font-mono text-gray-500 bg-white/80 px-2 py-0.5 rounded shadow-sm z-20">
                    {currentPage === 1 ? 1 : (currentPage % 2 === 0 ? currentPage + 1 : currentPage)}
                  </div>
                </div>

              </div>
            ) : (
              // SINGLE-PAGE NOTEPAD VIEW
              <div 
                onClick={handleNextPage}
                className="relative w-[360px] sm:w-[500px] md:w-[640px] lg:w-[720px] aspect-[1/1.414] bg-white rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden cursor-pointer group z-10"
              >
                {/* Single Spiral Binding along Left Spine */}
                <SpiralBinding3D 
                  theme={spiralTheme} 
                  ringsCount={24} 
                  isSinglePage={true} 
                />

                {/* Left margin paper shadow under spiral */}
                <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-black/20 to-transparent pointer-events-none z-20" />

                <canvas 
                  ref={singleCanvasRef} 
                  className="w-full h-full object-contain pl-6"
                />

                <div className="absolute bottom-2 right-4 text-[10px] font-mono text-gray-500 bg-white/80 px-2 py-0.5 rounded shadow-sm z-20">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            )}

            {/* FLIPPING PAGE OVERLAY (DearFlip 3D Turning Effect) */}
            <AnimatePresence>
              {isFlipping && (
                <motion.div
                  initial={{
                    rotateY: flipDirection === 'next' ? 0 : -180,
                    opacity: 1,
                  }}
                  animate={{
                    rotateY: flipDirection === 'next' ? -180 : 0,
                    opacity: 1,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                  style={{
                    transformOrigin: flipDirection === 'next' ? 'left center' : 'right center',
                    transformStyle: 'preserve-3d',
                  }}
                  className={`absolute top-0 bottom-0 ${
                    flipDirection === 'next' ? 'left-1/2' : 'right-1/2'
                  } w-[340px] sm:w-[460px] md:w-[540px] lg:w-[620px] aspect-[1/1.414] bg-gradient-to-r from-white via-neutral-100 to-white shadow-2xl z-40 pointer-events-none rounded-r-2xl overflow-hidden`}
                >
                  <div className="w-full h-full flex items-center justify-center bg-emerald-500/5">
                    <div className="w-full h-full bg-gradient-to-r from-black/30 via-transparent to-black/10" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}
      </div>

      {/* 3. BOTTOM DEARFLIP NAVIGATION & SCRUBBER BAR */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-900/60 pt-3 backdrop-blur-md">
        
        {/* Left: Quick Jump / First / Prev buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleJumpToPage(1)}
            disabled={currentPage <= 1 || isFlipping}
            className="p-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 disabled:opacity-40 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold transition-all"
            title="First Page (Home)"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleJumpToPage(Math.max(1, currentPage - 10))}
            disabled={currentPage <= 1 || isFlipping}
            className="px-2 py-1 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 disabled:opacity-40 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold transition-all hidden sm:inline"
            title="Back 10 Pages"
          >
            -10
          </button>

          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1 || isFlipping}
            className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 disabled:opacity-40 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>
        </div>

        {/* Center: Interactive Scrubber Slider & Direct Page Input */}
        <div className="flex items-center gap-3">
          {/* Direct page input form */}
          <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-emerald-500 hidden sm:inline">Page</span>
            <input
              type="text"
              value={pageInputValue}
              onChange={(e) => setPageInputValue(e.target.value)}
              className="w-14 text-center py-1 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-200 focus:outline-none focus:border-emerald-400 font-bold"
            />
            <span className="text-emerald-400/80">/ {totalPages}</span>
          </form>

          {/* Range Scrubber */}
          <div className="hidden md:flex items-center gap-2 w-48 lg:w-72">
            <input
              type="range"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => handleJumpToPage(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Thumbnails Drawer Toggle */}
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`p-1.5 rounded-xl border text-xs font-mono transition-all ${
              showThumbnails 
                ? 'bg-emerald-500 text-black border-emerald-400' 
                : 'bg-emerald-950/80 border-emerald-800 text-emerald-300 hover:bg-emerald-900'
            }`}
            title="Thumbnails & Fast Page Grid"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Next / Last buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages || isFlipping}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black text-xs font-mono font-bold flex items-center gap-1 transition-all shadow-md shadow-emerald-500/20"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleJumpToPage(Math.min(totalPages, currentPage + 10))}
            disabled={currentPage >= totalPages || isFlipping}
            className="px-2 py-1 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 disabled:opacity-40 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold transition-all hidden sm:inline"
            title="Forward 10 Pages"
          >
            +10
          </button>

          <button
            onClick={() => handleJumpToPage(totalPages)}
            disabled={currentPage >= totalPages || isFlipping}
            className="p-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 disabled:opacity-40 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold transition-all"
            title="Last Page (End)"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. FAST THUMBNAILS & PAGE SELECTOR DRAWER */}
      <AnimatePresence>
        {showThumbnails && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="absolute bottom-16 left-4 right-4 max-h-72 bg-emerald-950/95 border-2 border-emerald-500/40 rounded-3xl p-4 shadow-2xl backdrop-blur-xl z-50 overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-emerald-800 pb-2 mb-3">
              <span className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-400" />
                Fast Navigation: All {totalPages} Pages
              </span>
              <button
                onClick={() => setShowThumbnails(false)}
                className="p-1 rounded-lg text-emerald-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Page Buttons Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handleJumpToPage(p)}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-mono font-bold transition-all border ${
                    currentPage === p
                      ? 'bg-emerald-500 text-black border-emerald-400 shadow-md scale-105'
                      : 'bg-emerald-900/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. AI STUDY COMPANION SIDE DRAWER (Tips, Concepts, Quizzes) */}
      <AnimatePresence>
        {showCompanion && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[440px] bg-[#031710]/95 border-l-2 border-emerald-500/40 shadow-2xl backdrop-blur-2xl z-50 p-6 flex flex-col justify-between overflow-hidden"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between border-b border-emerald-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono">Study Companion</h3>
                    <p className="text-[10px] text-emerald-400 font-mono">DataVeda Knowledge Synthesizer</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCompanion(false)}
                  className="p-1.5 rounded-xl border border-emerald-800 hover:bg-emerald-900 text-emerald-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Companion Tabs */}
              <div className="grid grid-cols-3 gap-1.5 bg-emerald-950/80 p-1 rounded-xl border border-emerald-800/80 mb-4 text-xs font-mono">
                <button
                  onClick={() => setCompanionTab('tips')}
                  className={`py-1.5 rounded-lg font-bold transition-all ${
                    companionTab === 'tips' ? 'bg-emerald-500 text-black shadow-sm' : 'text-emerald-400 hover:text-emerald-200'
                  }`}
                >
                  Staff Tips
                </button>
                <button
                  onClick={() => setCompanionTab('concepts')}
                  className={`py-1.5 rounded-lg font-bold transition-all ${
                    companionTab === 'concepts' ? 'bg-emerald-500 text-black shadow-sm' : 'text-emerald-400 hover:text-emerald-200'
                  }`}
                >
                  Flashcards
                </button>
                <button
                  onClick={() => setCompanionTab('quiz')}
                  className={`py-1.5 rounded-lg font-bold transition-all ${
                    companionTab === 'quiz' ? 'bg-emerald-500 text-black shadow-sm' : 'text-emerald-400 hover:text-emerald-200'
                  }`}
                >
                  Quiz
                </button>
              </div>
            </div>

            {/* Scrollable Companion Body */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
              {companionTab === 'tips' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/70 space-y-2">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      Key Literature Takeaways
                    </span>
                    <ul className="space-y-2 text-emerald-200/90 leading-relaxed list-disc list-inside">
                      {book.keyTakeaways?.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Production Anti-Pattern Warning
                    </span>
                    <p className="text-amber-200/90 leading-relaxed">
                      Avoid performing unbounded full-table shuffles and unpartitioned scans when reading petabyte-scale lakehouse tables. Always prune via partition keys and sort orders.
                    </p>
                  </div>
                </div>
              )}

              {companionTab === 'concepts' && (
                <div className="space-y-3">
                  {conceptCards.length > 0 ? (
                    conceptCards.map((card, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 space-y-2">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                          Concept #{i + 1}: {card.title}
                        </span>
                        <div className="p-2.5 rounded-xl bg-emerald-900/40 border border-emerald-700/50 font-mono text-[11px] text-emerald-300">
                          {card.ruleOfThumb}
                        </div>
                        <p className="text-emerald-200/80 leading-relaxed text-[11px]">
                          {card.explanation}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-emerald-500 font-mono text-center py-8">
                      No concept cards defined for this volume.
                    </p>
                  )}
                </div>
              )}

              {companionTab === 'quiz' && (
                <div className="space-y-4">
                  {quizQuestions.length > 0 ? (
                    quizQuestions.map((q) => {
                      const selected = selectedAnswers[q.id];
                      const isRevealed = revealedAnswers[q.id];

                      return (
                        <div key={q.id} className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 space-y-3">
                          <p className="font-semibold text-white leading-relaxed">
                            {q.question}
                          </p>
                          <div className="space-y-1.5">
                            {q.options.map((opt, optIdx) => {
                              const isChosen = selected === optIdx;
                              const isCorrect = optIdx === q.correctIndex;

                              let btnStyle = 'bg-emerald-900/40 text-emerald-200 border-emerald-800/60 hover:bg-emerald-800';
                              if (isRevealed) {
                                if (isCorrect) {
                                  btnStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500 font-bold';
                                } else if (isChosen) {
                                  btnStyle = 'bg-red-500/20 text-red-300 border-red-500';
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => {
                                    if (!isRevealed) {
                                      setSelectedAnswers(prev => ({ ...prev, [q.id]: optIdx }));
                                      setRevealedAnswers(prev => ({ ...prev, [q.id]: true }));
                                      if (optIdx === q.correctIndex && onAddXP) onAddXP(25);
                                    }
                                  }}
                                  className={`w-full text-left p-2.5 rounded-xl border text-[11px] transition-all flex items-center justify-between ${btnStyle}`}
                                >
                                  <span>{opt}</span>
                                  {isRevealed && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-emerald-500 font-mono text-center py-8">
                      No chapter quizzes defined for this volume.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Bottom XP status */}
            <div className="pt-3 border-t border-emerald-800 flex items-center justify-between text-[11px] font-mono text-emerald-400">
              <span>DataVeda Reader Studio</span>
              <span className="text-emerald-300 font-bold">100% Unlocked</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
