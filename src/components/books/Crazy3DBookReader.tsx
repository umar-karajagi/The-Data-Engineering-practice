'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
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
  BookMarked
} from 'lucide-react';
import { BookReference, ContentRef } from '../../types';
import { SpiralBinding3D, SpiralTheme } from './SpiralBinding3D';
import { playPageFlipSound, isSoundEnabled, toggleSound, playSuccessChime } from '../../lib/sound';
import { saveReadingProgress, getReadingProgress, toggleChapterBookmark, getBookmarkedChapters } from '../../lib/libraryStorage';
import { useUserStore } from '../../lib/userStore';

export type BookChapter = BookReference['chapters'][number];
export type ReaderDisplayMode = 'ereader' | 'spiral3d' | 'pdf';
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
  // 1. Reading Mode: E-Reader, 3D Spiral Flipbook, or Native PDF
  const [displayMode, setDisplayMode] = useState<ReaderDisplayMode>('spiral3d');
  const [show3DCover, setShow3DCover] = useState<boolean>(false);

  // Chapter Navigation State
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
  const nextChapter = chapters[currentChapterIdx + 1] || null;
  const prevChapter = chapters[currentChapterIdx - 1] || null;
  const totalChapters = chapters.length;

  // 3D Spiral Settings (DearFlip style)
  const [spiralTheme, setSpiralTheme] = useState<SpiralTheme>('emerald');
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [soundOn, setSoundOn] = useState<boolean>(true);

  // E-Reader Appearance Controls
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>('dark');
  const [readerFont, setReaderFont] = useState<ReaderFont>('serif');
  const [fontSize, setFontSize] = useState<number>(17);
  const [showToc, setShowToc] = useState<boolean>(false);
  const [tocSearch, setTocSearch] = useState<string>('');

  // Bookmarking & Progress
  const [bookmarkedChapters, setBookmarkedChapters] = useState<string[]>([]);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);

  // Text to Speech
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Compute Static PDF URL
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const pdfFileName = book.originalFileName || '';
  const resolvedPdfUrl = book.pdfUrl || (pdfFileName ? `${basePath}/vault_storage/${encodeURIComponent(pdfFileName)}` : '');

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

  // Load reading progress
  useEffect(() => {
    const bookmarks = getBookmarkedChapters(book.id);
    setBookmarkedChapters(bookmarks);

    const savedProgress = getReadingProgress(book.id);
    if (savedProgress) {
      if (savedProgress.completedChapterIds) {
        setCompletedChapters(savedProgress.completedChapterIds);
      }
      if (!initialChapterId && savedProgress.lastChapterId) {
        const idx = chapters.findIndex(c => c.id === savedProgress.lastChapterId);
        if (idx >= 0) setCurrentChapterIdx(idx);
      }
    }
  }, [book.id, initialChapterId, chapters]);

  // Set last active
  useEffect(() => {
    if (storeSetLastActive && currentChapter) {
      storeSetLastActive({
        type: 'library_chapter',
        id: `${book.id}-${currentChapter.id}`,
        title: book.title,
        subtitle: `Chapter ${currentChapter.number}: ${currentChapter.title}`,
        bookId: book.id
      });
    }
  }, [book.id, book.title, currentChapter, storeSetLastActive]);

  // High-Quality Page Turn Handlers with Smooth Physics
  const handleNextChapter = () => {
    if (currentChapterIdx < totalChapters - 1 && !isFlipping) {
      setFlipDirection('next');
      setIsFlipping(true);
      if (soundOn) playPageFlipSound();

      setTimeout(() => {
        setCurrentChapterIdx(prev => prev + 1);
        setIsFlipping(false);
        if (onAddXP) onAddXP(15);
        if (storeAddXP) storeAddXP(15);
      }, 480);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIdx > 0 && !isFlipping) {
      setFlipDirection('prev');
      setIsFlipping(true);
      if (soundOn) playPageFlipSound();

      setTimeout(() => {
        setCurrentChapterIdx(prev => prev - 1);
        setIsFlipping(false);
      }, 480);
    }
  };

  const handleJumpToChapter = (idx: number) => {
    if (soundOn) playPageFlipSound();
    setCurrentChapterIdx(idx);
    setShowToc(false);
  };

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

  // Book Primary Vibrant Color
  const themeColor = book.coverColor || '#10B981';

  return (
    <div className="relative min-h-[94vh] bg-gradient-to-b from-[#02110B] via-[#041D14] to-[#010906] text-emerald-50 flex flex-col justify-between overflow-hidden antialiased">
      
      {/* Dynamic Ambient Color Backlight */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute top-1/6 left-1/4 w-[500px] h-[500px] rounded-full blur-[160px] opacity-25"
          style={{ backgroundColor: themeColor }}
        />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-mint-400/10 rounded-full blur-[160px]" />
        
        {/* Subtle Cybernetic Grid */}
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
              {/* Miniature Vibrant 3D Spine Thumbnail */}
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
                displayMode === 'spiral3d' && !show3DCover
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/25 scale-[1.02]'
                  : 'text-emerald-400 hover:text-white'
              }`}
              title="DearFlip-style 3D Spiral Book with realistic page curl and vivid hardcover"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D Spiral Book</span>
            </button>

            <button
              onClick={() => setDisplayMode('ereader')}
              className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 font-bold transition-all ${
                displayMode === 'ereader'
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/25 scale-[1.02]'
                  : 'text-emerald-400 hover:text-white'
              }`}
              title="Clean, fast chapter reading with crisp typography"
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

            {/* Table of Contents Drawer Toggle */}
            <button
              onClick={() => setShowToc(!showToc)}
              className="px-2.5 py-1.5 rounded-xl border border-emerald-800 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
              title="Table of Contents"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden md:inline">TOC ({totalChapters})</span>
            </button>

            {/* Text to Speech */}
            <button
              onClick={handleToggleSpeech}
              className={`p-1.5 rounded-xl border transition-all ${
                isSpeaking 
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-md animate-pulse' 
                  : 'bg-emerald-950/80 border-emerald-800 text-emerald-400 hover:text-emerald-200'
              }`}
              title={isSpeaking ? 'Pause Audio Read-Along' : 'Listen with Audio Read-Along'}
            >
              {isSpeaking ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
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

            {/* Bookmark Chapter */}
            <button
              onClick={handleToggleBookmark}
              className={`p-1.5 rounded-xl border transition-all ${
                isBookmarked 
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400' 
                  : 'bg-emerald-950/80 border-emerald-800 text-emerald-400 hover:text-emerald-200'
              }`}
              title="Bookmark Chapter"
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </button>

            {/* Raw PDF Download */}
            {resolvedPdfUrl && (
              <a
                href={resolvedPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-extrabold flex items-center gap-1 transition-all shadow-sm"
                title="Open or Download Original PDF"
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
        {/* MODE A: 3D SPIRAL BOOK (DearFlip Style with Rich Colors & Crisp Text) */}
        {/* ============================================================ */}
        {displayMode === 'spiral3d' && (
          <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 my-auto overflow-hidden">
            
            {/* Top Toolbar: Spiral Style & Quick Status */}
            <div className="flex items-center gap-3 mb-4 bg-emerald-950/90 border border-emerald-800/80 rounded-2xl px-4 py-2 text-xs font-mono shadow-md backdrop-blur-md">
              <span className="text-emerald-400 font-bold">Spiral Coil:</span>
              {(['emerald', 'chrome', 'gold', 'obsidian'] as SpiralTheme[]).map((theme) => (
                <button
                  key={theme}
                  onClick={() => setSpiralTheme(theme)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                    spiralTheme === theme 
                      ? 'bg-emerald-500 text-black font-extrabold shadow-sm' 
                      : 'text-emerald-400 hover:text-white'
                  }`}
                >
                  {theme}
                </button>
              ))}
              <span className="text-emerald-700">|</span>
              <span className="text-emerald-300 font-semibold">
                Chapter {currentChapter.number} of {totalChapters}
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
                  {/* Ornate Gold Foil Debossed Frame */}
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
                      DataVeda Master Literature Vault
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
                /* 3D DUAL-PAGE SPREAD VIEW (High-Contrast, Crisp, Zero Blur)*/
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
                    {/* Gilded Silk Bookmark Ribbon Hanging Below */}
                    <div 
                      className="absolute left-1/2 -bottom-10 w-4 h-14 -translate-x-1/2 rounded-b-md shadow-2xl z-0"
                      style={{
                        backgroundColor: themeColor,
                        borderLeft: '1px solid rgba(255,255,255,0.4)',
                        clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)'
                      }}
                    />
                  </div>

                  {/* ================= LEFT PAGE ================= */}
                  <div 
                    onClick={handlePrevChapter}
                    className="relative w-[340px] sm:w-[460px] md:w-[530px] aspect-[1/1.38] bg-white text-slate-900 rounded-l-2xl sm:rounded-l-3xl p-6 sm:p-9 flex flex-col justify-between shadow-[inset_-20px_0_35px_rgba(0,0,0,0.08),-15px_15px_30px_rgba(0,0,0,0.5)] overflow-hidden cursor-pointer group z-10"
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
                    
                    {/* Decorative Top Accent Ribbon in Book Cover Color */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-2 z-20"
                      style={{ backgroundColor: themeColor }}
                    />

                    {/* Page Header */}
                    <div className="space-y-3 z-10 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500 border-b border-slate-200 pb-2">
                        <span 
                          className="px-2 py-0.5 rounded text-[10px] uppercase font-extrabold"
                          style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
                        >
                          Chapter {currentChapter.number}
                        </span>
                        <span>⏱️ {currentChapter.readingTime || '15 min read'}</span>
                      </div>

                      <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                        {currentChapter.title}
                      </h2>

                      {currentChapter.summary && (
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif italic border-l-3 border-emerald-500 pl-3">
                          {currentChapter.summary}
                        </p>
                      )}
                    </div>

                    {/* Senior Staff Core Rule Callout */}
                    <div 
                      className="p-4 rounded-2xl border space-y-1.5 z-10 my-auto shadow-sm"
                      style={{ 
                        backgroundColor: `${themeColor}08`, 
                        borderColor: `${themeColor}30` 
                      }}
                    >
                      <span 
                        className="text-[10px] font-mono font-extrabold uppercase flex items-center gap-1.5"
                        style={{ color: themeColor }}
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        Senior Staff Core Rule
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 font-serif leading-relaxed">
                        {currentChapter.seniorTip || 'Always declare the business grain before dimensioning tables to prevent fact explosion.'}
                      </p>
                    </div>

                    {/* Left Page Footer */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-200 z-10">
                      <span className="font-semibold text-slate-600 truncate max-w-[200px]">{book.title}</span>
                      <span>Page {currentChapter.number * 2 - 1}</span>
                    </div>
                  </div>

                  {/* ================= 3D SPIRAL SPINE ================= */}
                  <SpiralBinding3D 
                    theme={spiralTheme} 
                    ringsCount={24} 
                    isSinglePage={false} 
                  />

                  {/* ================= RIGHT PAGE ================= */}
                  <div 
                    onClick={handleNextChapter}
                    className="relative w-[340px] sm:w-[460px] md:w-[530px] aspect-[1/1.38] bg-white text-slate-900 rounded-r-2xl sm:rounded-r-3xl p-6 sm:p-9 flex flex-col justify-between shadow-[inset_20px_0_35px_rgba(0,0,0,0.08),15px_15px_30px_rgba(0,0,0,0.5)] overflow-hidden cursor-pointer group z-10"
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
                      className="absolute top-0 left-0 right-0 h-2 z-20"
                      style={{ backgroundColor: themeColor }}
                    />

                    {/* Right Page Body Content & Code Snippet */}
                    <div className="space-y-4 z-10 pt-1">
                      {/* Anti-Pattern Warning */}
                      <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 space-y-1.5 shadow-sm">
                        <span className="text-[10px] font-mono font-bold text-amber-800 uppercase flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          Production Anti-Pattern to Avoid
                        </span>
                        <p className="text-xs text-amber-950 font-serif leading-relaxed">
                          {currentChapter.antiPattern || 'Direct fact-to-fact table joins without conformed dimension bridges.'}
                        </p>
                      </div>

                      {/* Architecture DDL Snippet */}
                      <div className="p-4 rounded-2xl bg-slate-900 text-emerald-300 font-mono text-[11px] space-y-1 shadow-md border border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Production Spec</span>
                        <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-400">
                          <code>{`// Core Architecture Pattern:\nCREATE OR REPLACE TABLE dim_customer (\n  customer_sk BIGINT PRIMARY KEY,\n  customer_id STRING,\n  valid_from TIMESTAMP,\n  valid_to TIMESTAMP,\n  is_current BOOLEAN\n) PARTITION BY DATE(valid_from);`}</code>
                        </pre>
                      </div>
                    </div>

                    {/* Right Page Footer */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-200 z-10">
                      <span>Page {currentChapter.number * 2}</span>
                      <span className="text-emerald-700 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        {currentChapterIdx < totalChapters - 1 ? (
                          <><span>Turn Page</span> <ChevronRight className="w-3.5 h-3.5" /></>
                        ) : (
                          <span>Finish Volume 🎉</span>
                        )}
                      </span>
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
                      duration: 0.48,
                      ease: [0.22, 1, 0.36, 1], // Smooth natural spring curve
                    }}
                    style={{
                      transformOrigin: flipDirection === 'next' ? 'left center' : 'right center',
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                    }}
                    className={`absolute top-0 bottom-0 ${
                      flipDirection === 'next' ? 'left-1/2' : 'right-1/2'
                    } w-[340px] sm:w-[460px] md:w-[530px] aspect-[1/1.38] bg-white shadow-2xl z-40 pointer-events-none rounded-r-2xl sm:rounded-r-3xl overflow-hidden border-r border-slate-300`}
                  >
                    {/* Realistic Sweeping Curvature Highlight & Shadow */}
                    <div className="w-full h-full p-8 flex flex-col justify-between relative bg-gradient-to-r from-slate-100 via-white to-slate-200">
                      <div className="space-y-3 opacity-60">
                        <div className="h-4 bg-slate-300 rounded w-1/3" />
                        <div className="h-6 bg-slate-400 rounded w-3/4" />
                        <div className="h-3 bg-slate-200 rounded w-full" />
                        <div className="h-3 bg-slate-200 rounded w-5/6" />
                      </div>
                      
                      {/* Traveling Specular Glint */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-black/20 pointer-events-none" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Bottom 3D Spiral Navigation Bar */}
            <div className="flex items-center gap-4 mt-6 z-20">
              <button
                onClick={handlePrevChapter}
                disabled={currentChapterIdx === 0 || isFlipping}
                className="px-4 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 disabled:opacity-40 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Chapter</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-300 bg-emerald-950/80 px-4 py-2 rounded-xl border border-emerald-800 font-bold shadow-inner">
                  {currentChapterIdx + 1} / {totalChapters}
                </span>
              </div>

              <button
                onClick={handleNextChapter}
                disabled={currentChapterIdx === totalChapters - 1 || isFlipping}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black text-xs font-mono font-extrabold flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/25"
              >
                <span>Next Chapter</span>
                <ChevronRight className="w-4 h-4" />
              </button>
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

              <span className="text-xs font-mono text-emerald-400">
                {currentChapterIdx + 1} / {totalChapters}
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
              <span>Native PDF Document Viewer (All Pages Active)</span>
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
                    <p className="text-[10px] text-emerald-400 font-mono">{totalChapters} Chapters Unlocked</p>
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
                      onClick={() => handleJumpToChapter(originalIdx)}
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

            {/* Bottom info */}
            <div className="pt-3 border-t border-emerald-800 text-[11px] font-mono text-emerald-400 flex items-center justify-between">
              <span>DataVeda Reader</span>
              <span className="text-emerald-300 font-bold">100% Free</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
