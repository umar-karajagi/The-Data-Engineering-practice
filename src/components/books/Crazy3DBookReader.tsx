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
  X
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
  // 1. Reading Mode: E-Reader (default, instant), 3D Spiral Flipbook (DearFlip), or Native PDF
  const [displayMode, setDisplayMode] = useState<ReaderDisplayMode>('ereader');

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
  const totalChapters = chapters.length;

  // 3D Spiral Settings (DearFlip style)
  const [spiralTheme, setSpiralTheme] = useState<SpiralTheme>('emerald');
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [soundOn, setSoundOn] = useState<boolean>(true);

  // E-Reader Appearance Controls
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>('dark');
  const [readerFont, setReaderFont] = useState<ReaderFont>('serif');
  const [fontSize, setFontSize] = useState<number>(17);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [showToc, setShowToc] = useState<boolean>(false);
  const [tocSearch, setTocSearch] = useState<string>('');

  // Bookmarking & Progress
  const [bookmarkedChapters, setBookmarkedChapters] = useState<string[]>([]);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  // Text to Speech
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Interactive Quiz & Flashcards
  const [quizScore, setQuizScore] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

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

  // Handle Mouse Perspective Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({ x: x * 6, y: -y * 6 });
  };

  // Next / Previous Chapter Turn Handlers
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
      }, 350);
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
      }, 350);
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

  const conceptCards = book.conceptCards || [];
  const quizQuestions = book.quizQuestions || [];

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative min-h-[94vh] bg-gradient-to-b from-[#03140E] via-[#052419] to-[#020D08] text-emerald-50 flex flex-col justify-between overflow-hidden"
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

      {/* 1. TOP HEADER & MODE SWITCHER */}
      <header className="relative z-30 bg-emerald-950/90 border-b border-emerald-900/70 backdrop-blur-md px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Back & Book Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToLibrary}
              className="px-3 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-700/60 text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Library</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  🔓 100% Unlocked
                </span>
                <span className="text-xs font-semibold text-emerald-400/80 hidden sm:inline">
                  {book.author}
                </span>
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md pt-0.5">
                {book.title}
              </h2>
            </div>
          </div>

          {/* Center: Triple Reading Mode Switcher */}
          <div className="flex items-center bg-[#021810] border border-emerald-700/60 rounded-xl p-1 text-xs font-mono">
            <button
              onClick={() => setDisplayMode('ereader')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 font-bold transition-all ${
                displayMode === 'ereader'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-emerald-400 hover:text-white'
              }`}
              title="Clean, fast chapter-by-chapter reading mode"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Chapter E-Reader</span>
            </button>

            <button
              onClick={() => setDisplayMode('spiral3d')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 font-bold transition-all ${
                displayMode === 'spiral3d'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-emerald-400 hover:text-white'
              }`}
              title="DearFlip-style 3D Spiral notebook with realistic wire coil and page flips"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D Spiral Book</span>
            </button>

            {resolvedPdfUrl && (
              <button
                onClick={() => setDisplayMode('pdf')}
                className={`px-3 py-1 rounded-lg flex items-center gap-1.5 font-bold transition-all ${
                  displayMode === 'pdf'
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'text-emerald-400 hover:text-white'
                }`}
                title="Native PDF viewer with all 600+ pages"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Full PDF Document</span>
              </button>
            )}
          </div>

          {/* Right: Controls (TOC, Speech, Sound, PDF Download) */}
          <div className="flex items-center gap-2">
            {/* Table of Contents Drawer Toggle */}
            <button
              onClick={() => setShowToc(!showToc)}
              className="px-2.5 py-1.5 rounded-xl border border-emerald-800 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
              title="Table of Contents"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden md:inline">TOC ({totalChapters})</span>
            </button>

            {/* Text to Speech (Audio Read-Along) */}
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

            {/* Sound Effects Toggle */}
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

            {/* Open / Download Raw PDF */}
            {resolvedPdfUrl && (
              <a
                href={resolvedPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold flex items-center gap-1 transition-all shadow-sm"
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
        {/* MODE A: E-READER MODE (Clean, rich markdown, instant reading) */}
        {/* ============================================================ */}
        {displayMode === 'ereader' && (
          <div className="max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
            
            {/* Chapter Header Card */}
            <div className="p-6 rounded-3xl bg-emerald-950/70 border border-emerald-800/80 shadow-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-emerald-400">
                <span className="px-2.5 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/60 font-bold">
                  Chapter {currentChapter.number} of {totalChapters}
                </span>
                <span>⏱️ Reading Time: {currentChapter.readingTime || '15 min'}</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                {currentChapter.title}
              </h1>
              {currentChapter.summary && (
                <p className="text-xs sm:text-sm text-emerald-300/80 leading-relaxed italic border-l-2 border-emerald-500 pl-3">
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
                <div className="p-5 rounded-2xl bg-emerald-900/40 border border-emerald-500/40 space-y-2">
                  <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    Senior Staff Data Engineer Advice
                  </span>
                  <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
                    {currentChapter.seniorTip}
                  </p>
                </div>
              )}

              {/* Common Anti-Pattern Warning */}
              {currentChapter.antiPattern && (
                <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-2">
                  <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Production Pitfall & Anti-Pattern to Avoid
                  </span>
                  <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                    {currentChapter.antiPattern}
                  </p>
                </div>
              )}

              {/* Linked Practice Arena Challenge */}
              {currentChapter.linkedPracticeId && onNavigatePractice && (
                <div className="p-4 rounded-2xl bg-[#031c12] border border-emerald-700/60 flex items-center justify-between gap-4">
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
        {/* MODE B: 3D SPIRAL FLIPBOOK (DearFlip Style)                   */}
        {/* ============================================================ */}
        {displayMode === 'spiral3d' && (
          <div 
            className="flex-1 flex flex-col items-center justify-center p-4 my-2 overflow-hidden"
            style={{ perspective: '1800px' }}
          >
            {/* Spiral Metal Selector */}
            <div className="flex items-center gap-2 mb-4 bg-emerald-950/80 border border-emerald-800/80 rounded-xl px-3 py-1.5 text-xs font-mono">
              <span className="text-emerald-500 font-bold">Spiral Ring Coil:</span>
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

            {/* 3D Physical Spiral Binder Stage */}
            <div
              className="relative transition-transform duration-300 ease-out"
              style={{
                transform: `rotateX(${mouseTilt.y}deg) rotateY(${mouseTilt.x}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Hardcover Outer Shadow & Bevel Backplate */}
              <div className="absolute -inset-4 sm:-inset-6 bg-[#041a12] rounded-3xl border border-emerald-800/50 shadow-[0_30px_70px_rgba(0,0,0,0.85)] z-0 pointer-events-none" />

              {/* Two-Page Open Book Spread */}
              <div className="relative flex items-center z-10">
                
                {/* LEFT PAGE: Chapter Overview & Concepts */}
                <div 
                  onClick={handlePrevChapter}
                  className="relative w-[340px] sm:w-[460px] md:w-[520px] aspect-[1/1.38] bg-[#FAF8F5] text-neutral-900 rounded-l-2xl sm:rounded-l-3xl p-6 sm:p-8 flex flex-col justify-between shadow-[inset_-15px_0_30px_rgba(0,0,0,0.1),-12px_12px_24px_rgba(0,0,0,0.4)] overflow-hidden cursor-pointer group"
                >
                  <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/20 via-black/5 to-transparent pointer-events-none z-20" />
                  
                  {/* Content Header */}
                  <div className="space-y-3 z-10">
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 border-b border-neutral-300 pb-2">
                      <span className="font-bold text-emerald-800 uppercase">Chapter {currentChapter.number}</span>
                      <span>{currentChapter.readingTime || '15 min read'}</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 leading-tight">
                      {currentChapter.title}
                    </h2>
                    <p className="text-xs text-neutral-700 leading-relaxed font-serif">
                      {currentChapter.summary}
                    </p>
                  </div>

                  {/* Core Takeaways Card */}
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5 z-10">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase">Core Chapter Rule</span>
                    <p className="text-xs text-emerald-950 font-serif leading-relaxed">
                      {currentChapter.seniorTip || 'Maintain conformed dimensions to allow cross-pipeline analytic joins.'}
                    </p>
                  </div>

                  {/* Left Page Number */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-2 border-t border-neutral-200 z-10">
                    <span>{book.title}</span>
                    <span>Page {currentChapter.number * 2 - 1}</span>
                  </div>
                </div>

                {/* 3D SPIRAL SPINE CONNECTOR */}
                <SpiralBinding3D 
                  theme={spiralTheme} 
                  ringsCount={24} 
                  isSinglePage={false} 
                />

                {/* RIGHT PAGE: Detailed Content & Anti-Pattern */}
                <div 
                  onClick={handleNextChapter}
                  className="relative w-[340px] sm:w-[460px] md:w-[520px] aspect-[1/1.38] bg-[#FAF8F5] text-neutral-900 rounded-r-2xl sm:rounded-r-3xl p-6 sm:p-8 flex flex-col justify-between shadow-[inset_15px_0_30px_rgba(0,0,0,0.1),12px_12px_24px_rgba(0,0,0,0.4)] overflow-hidden cursor-pointer group"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/20 via-black/5 to-transparent pointer-events-none z-20" />

                  {/* Anti-Pattern & Senior Tip Callouts */}
                  <div className="space-y-4 z-10">
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
                      <span className="text-[10px] font-mono font-bold text-amber-800 uppercase flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Production Anti-Pattern
                      </span>
                      <p className="text-xs text-amber-950 font-serif leading-relaxed">
                        {currentChapter.antiPattern || 'Direct joins between raw landing tables without grain declaration.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-100 border border-neutral-300 font-mono text-[11px] text-neutral-800 space-y-1">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase">Architecture Snippet</span>
                      <pre className="overflow-x-auto text-[10px] text-emerald-900">
                        <code>{`// Grain Declaration:\nCREATE OR REPLACE TABLE fact_events (\n  event_sk BIGINT,\n  user_id STRING,\n  event_timestamp TIMESTAMP\n) PARTITION BY DATE(event_timestamp);`}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Click to Turn prompt */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-2 border-t border-neutral-200 z-10">
                    <span>Page {currentChapter.number * 2}</span>
                    <span className="text-emerald-700 font-bold group-hover:translate-x-1 transition-transform">
                      {currentChapterIdx < totalChapters - 1 ? 'Turn Next Chapter →' : 'Complete Book 🎉'}
                    </span>
                  </div>
                </div>

              </div>

              {/* 3D Flipping Page Overlay */}
              <AnimatePresence>
                {isFlipping && (
                  <motion.div
                    initial={{ rotateY: flipDirection === 'next' ? 0 : -180, opacity: 1 }}
                    animate={{ rotateY: flipDirection === 'next' ? -180 : 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                    style={{
                      transformOrigin: flipDirection === 'next' ? 'left center' : 'right center',
                      transformStyle: 'preserve-3d',
                    }}
                    className={`absolute top-0 bottom-0 ${
                      flipDirection === 'next' ? 'left-1/2' : 'right-1/2'
                    } w-[340px] sm:w-[460px] md:w-[520px] aspect-[1/1.38] bg-gradient-to-r from-[#FAF8F5] via-neutral-200 to-[#FAF8F5] shadow-2xl z-40 pointer-events-none rounded-r-2xl overflow-hidden`}
                  >
                    <div className="w-full h-full bg-gradient-to-r from-black/25 via-transparent to-black/10" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom 3D Spiral Controls */}
            <div className="flex items-center gap-3 mt-6 z-20">
              <button
                onClick={handlePrevChapter}
                disabled={currentChapterIdx === 0 || isFlipping}
                className="px-4 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 disabled:opacity-40 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Page</span>
              </button>

              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800">
                Chapter {currentChapterIdx + 1} of {totalChapters}
              </span>

              <button
                onClick={handleNextChapter}
                disabled={currentChapterIdx === totalChapters - 1 || isFlipping}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
              >
                <span>Next Page</span>
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
              <span>Native PDF Viewer (All Pages Active)</span>
              <a
                href={resolvedPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-emerald-300 hover:text-white underline"
              >
                <span>Open in Full Browser Window</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Embedded Native Browser PDF Object / Iframe */}
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
