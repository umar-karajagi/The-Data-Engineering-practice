'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  ArrowLeft, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Lock, 
  Award, 
  Flame, 
  Search, 
  Layers, 
  Lightbulb, 
  AlertTriangle, 
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Zap,
  Maximize2,
  Minimize2,
  List,
  Columns,
  X,
  Plus,
  SkipForward
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BookReference, BookQuizQuestion, BookConceptCard, ContentRef } from '../../types';
import { playSuccessChime, playHintChime } from '../../lib/sound';
import { useUserStore } from '../../lib/userStore';

interface FunPdfReaderProps {
  book: BookReference;
  onBackToLibrary?: () => void;
  onAddXP?: (amount: number) => void;
  onOpenQuickNote?: (ref?: ContentRef) => void;
}

export const FunPdfReader: React.FC<FunPdfReaderProps> = ({
  book,
  onBackToLibrary,
  onAddXP,
  onOpenQuickNote,
}) => {
  const [activeTab, setActiveTab] = useState<'pdf' | 'concepts' | 'quiz' | 'ask'>('pdf');
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);
  const [isCompanionOpen, setIsCompanionOpen] = useState<boolean>(false);
  const [companionTab, setCompanionTab] = useState<'quiz' | 'concepts' | 'ask'>('quiz');

  // Online Library Reader Controls
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageInput, setPageInput] = useState<string>('1');
  const [zoomMode, setZoomMode] = useState<'FitH' | 'Fit' | '100' | '125'>('FitH');
  const [showNavPanes, setShowNavPanes] = useState<boolean>(true);

  const [selectedChapterQuiz, setSelectedChapterQuiz] = useState<number | 'ALL'>('ALL');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});
  const [quizScore, setQuizScore] = useState<number>(0);
  const [drmAlert, setDrmAlert] = useState<string | null>(null);

  // "Ask the Book" interactive query state
  const [askQuery, setAskQuery] = useState<string>('');
  const [activeAskResult, setActiveAskResult] = useState<{
    question: string;
    answer: string;
    rule: string;
    chapter: string;
  } | null>(null);

  const conceptCards: BookConceptCard[] = book.conceptCards || [];
  const quizQuestions: BookQuizQuestion[] = book.quizQuestions || [];

  // Connect to unified user store
  let storeSaveCheckpoint: any = null;
  let storeSaveBookmark: any = null;
  let storeSetLastActive: any = null;
  let storeAddXP: any = null;
  try {
    const store = useUserStore();
    storeSaveCheckpoint = store.saveBookCheckpoint;
    storeSaveBookmark = store.saveBookBookmark;
    storeSetLastActive = store.setLastActive;
    storeAddXP = store.addXP;
  } catch {
    // Fallback if rendered outside provider
  }

  // Auto-record reading bookmark & last active item
  useEffect(() => {
    if (storeSaveBookmark) {
      storeSaveBookmark(book.id, currentPage, 100);
    }
    if (storeSetLastActive) {
      storeSetLastActive({
        type: 'library_chapter',
        id: `${book.id}-p${currentPage}`,
        title: book.title,
        subtitle: `Page ${currentPage} • ${book.author}`,
        bookId: book.id
      });
    }
  }, [book.id, book.title, book.author, currentPage, storeSaveBookmark, storeSetLastActive]);

  const handleSkipCheckpoint = (chapterNum: number) => {
    if (storeSaveCheckpoint) {
      storeSaveCheckpoint(book.id, chapterNum, 'single', 100, true);
    }
    if (storeAddXP) storeAddXP(25);
    if (onAddXP) onAddXP(25);
    playSuccessChime();
    triggerDrmNotification(`Checkpoint for chapter ${chapterNum} bypassed (Reference Reading Mode). Reading progress saved!`);
  };

  // Anti-download DRM keyboard listener & Theater mode escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p' || e.key === 'u')) {
        e.preventDefault();
        triggerDrmNotification('Downloading, saving, and printing are restricted to protect vault literature.');
      }
      if (e.key === 'Escape' && isTheaterMode) {
        setIsTheaterMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTheaterMode]);

  const triggerDrmNotification = (msg: string) => {
    setDrmAlert(msg);
    setTimeout(() => setDrmAlert(null), 4000);
  };

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(pageInput, 10);
    if (!isNaN(p) && p >= 1) {
      setCurrentPage(p);
    }
  };

  const handleNextPage = () => {
    const next = currentPage + 1;
    setCurrentPage(next);
    setPageInput(next.toString());
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prev = currentPage - 1;
      setCurrentPage(prev);
      setPageInput(prev.toString());
    }
  };

  // Handle quiz answer selection
  const handleSelectAnswer = (qId: string, optionIndex: number, correctIndex: number) => {
    if (selectedAnswers[qId] !== undefined) return; // Already answered

    const updated = { ...selectedAnswers, [qId]: optionIndex };
    setSelectedAnswers(updated);
    setRevealedExplanations({ ...revealedExplanations, [qId]: true });

    if (optionIndex === correctIndex) {
      const newScore = quizScore + 1;
      setQuizScore(newScore);
      playSuccessChime();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
      if (storeAddXP) storeAddXP(50);
      if (onAddXP) onAddXP(50);

      // Check soft checkpoint pass threshold (≥60%)
      const totalQ = quizQuestions.length;
      if (totalQ > 0 && (newScore / totalQ) >= 0.6) {
        if (storeSaveCheckpoint) {
          const chNum = typeof selectedChapterQuiz === 'number' ? selectedChapterQuiz : 1;
          storeSaveCheckpoint(book.id, chNum, 'single', Math.round((newScore / totalQ) * 100), false);
        }
      }
    } else {
      playHintChime();
    }
  };

  // Filter quiz questions
  const filteredQuestions = selectedChapterQuiz === 'ALL'
    ? quizQuestions
    : quizQuestions.filter(q => q.chapterNumber === selectedChapterQuiz);

  // "Ask the Book" Knowledge Base
  const handleAskSearch = (queryText: string) => {
    setAskQuery(queryText);
    const q = queryText.toLowerCase();

    if (q.includes('grain') || q.includes('step') || q.includes('4-step') || q.includes('declare')) {
      setActiveAskResult({
        question: 'What is the Grain in Kimball dimensional modeling, and why declare it first?',
        answer: 'The grain is the precise operational definition of what a single row represents (e.g. one retail receipt line item). Declaring the grain FIRST is mandatory because you cannot determine which dimensions (who, what, where) or facts (numeric measures) belong in the table until the grain is locked.',
        rule: 'Rule: Never mix grains in the same fact table. An order header cannot live with line items.',
        chapter: 'Chapter 2: The Kimball 4-Step Design Process'
      });
    } else if (q.includes('scd') || q.includes('slowly') || q.includes('type 2') || q.includes('history')) {
      setActiveAskResult({
        question: 'How does SCD Type 2 preserve historical context?',
        answer: 'SCD Type 2 creates a new dimension row whenever an attribute mutates, assigning a new surrogate key and updating effective_date, expiration_date, and is_current flags. Prior sales transactions remain linked to the old surrogate key, while future sales link to the new key.',
        rule: 'Rule: Always use synthetic Surrogate Keys instead of natural keys to enable historical point-in-time joins.',
        chapter: 'Chapter 3: Slowly Changing Dimensions'
      });
    } else if (q.includes('conformed') || q.includes('bus') || q.includes('drill')) {
      setActiveAskResult({
        question: 'What is a Conformed Dimension in Enterprise Bus Architecture?',
        answer: 'A conformed dimension is either identical across all business processes or a strict mathematical subset. When both Sales and Inventory fact tables join to the same conformed dim_product and dim_date, executives can perform cross-functional drill-across queries with guaranteed consistency.',
        rule: 'Rule: Establish enterprise data contracts for shared dimensions to prevent duplicate departmental silos.',
        chapter: 'Chapter 4: Enterprise Bus Architecture'
      });
    } else if (q.includes('degenerate') || q.includes('invoice') || q.includes('receipt') || q.includes('order number')) {
      setActiveAskResult({
        question: 'What is a Degenerate Dimension?',
        answer: 'A degenerate dimension is a transaction control identifier (like invoice_number, order_id, or shipment_tracking_hash) that resides directly in the fact table without a corresponding dimension table, because all other context has already been stripped into other dimensions.',
        rule: 'Rule: Do NOT create an empty dimension table that contains only an invoice number. Keep it degenerate.',
        chapter: 'Chapter 6: Degenerate & Junk Dimensions'
      });
    } else if (q.includes('accumulating') || q.includes('snapshot') || q.includes('milestone') || q.includes('cycle')) {
      setActiveAskResult({
        question: 'When should I use an Accumulating Snapshot Fact Table?',
        answer: 'Use accumulating snapshots when tracking an operational workflow with distinct milestone stages (e.g. Order Placed -> Payment Verified -> Order Picked -> Shipped -> Delivered). Each row has multiple timestamp columns that are updated as the order advances, allowing instant calculation of lag and bottleneck duration.',
        rule: 'Rule: Unlike append-only transaction facts, accumulating snapshot rows are updated throughout their lifecycle.',
        chapter: 'Chapter 5: Fact Table Types'
      });
    } else {
      setActiveAskResult({
        question: `Architectural Inquiry: "${queryText}"`,
        answer: `According to Kimball dimensional modeling principles, analytical warehouses must balance simplicity for human queries and sub-second SQL aggregation speed. Decouple writes from reads using Star Schemas with conformed dimensions.`,
        rule: 'Rule: Separate qualitative context into dimensions and quantitative numeric measurements into facts.',
        chapter: 'The Data Warehouse Toolkit — Ralph Kimball'
      });
    }
  };

  // Construct PDF URL with dynamic navigation hash
  const pdfEmbedUrl = book.pdfUrl 
    ? `${book.pdfUrl}#page=${currentPage}&view=${zoomMode}&navpanes=${showNavPanes ? 1 : 0}&toolbar=0`
    : '';

  return (
    <div className={`min-h-screen bg-[#0D1117] text-[#C9D1D9] flex flex-col ${isTheaterMode ? 'fixed inset-0 z-50 overflow-hidden' : 'pb-16'}`}>
      
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-forge-card/95 backdrop-blur-md border-b border-forge-border px-3 sm:px-6 py-2.5 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Left: Back & Title */}
          <div className="flex items-center gap-3 min-w-0">
            {onBackToLibrary && (
              <button
                onClick={onBackToLibrary}
                className="px-3 py-1.5 rounded-xl bg-forge-bg hover:bg-forge-surface border border-forge-border text-xs font-mono font-bold flex items-center gap-1.5 text-forge-secondary hover:text-forge-text transition-colors shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Shelf</span>
              </button>
            )}

            <div className="truncate">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-track-warehousing shrink-0" />
                <span className="text-xs sm:text-sm font-extrabold text-forge-text truncate">{book.title}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-track-warehousing/10 text-track-warehousing border border-track-warehousing/30 shrink-0">
                  {book.fileSizeFormatted || 'Online Library'}
                </span>
              </div>
              <p className="text-[11px] text-forge-muted font-mono truncate hidden sm:block">
                {book.author} • Unabridged Original Edition • Zero-Download Protected
              </p>
            </div>
          </div>

          {/* Right: Mode Switchers & Actions */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end shrink-0">
            
            {/* View Tabs */}
            <div className="flex items-center gap-1 bg-forge-bg border border-forge-border rounded-2xl p-1 text-xs font-mono">
              <button
                onClick={() => setActiveTab('pdf')}
                className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'pdf'
                    ? 'bg-forge-card text-track-sql shadow-sm border border-forge-border'
                    : 'text-forge-secondary hover:text-forge-text'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Book Reader</span>
              </button>

              <button
                onClick={() => setActiveTab('concepts')}
                className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'concepts'
                    ? 'bg-forge-card text-track-warehousing shadow-sm border border-forge-border'
                    : 'text-forge-secondary hover:text-forge-text'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Concept Cards</span>
                <span>({conceptCards.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'quiz'
                    ? 'bg-forge-card text-track-pyspark shadow-sm border border-forge-border'
                    : 'text-forge-secondary hover:text-forge-text'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Quizzes</span>
                <span>({quizQuestions.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('ask')}
                className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'ask'
                    ? 'bg-forge-card text-track-python shadow-sm border border-forge-border'
                    : 'text-forge-secondary hover:text-forge-text'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Ask Book</span>
              </button>
            </div>

            {/* Split Companion Toggle Button (Available when reading PDF) */}
            {activeTab === 'pdf' && (
              <button
                onClick={() => setIsCompanionOpen(!isCompanionOpen)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  isCompanionOpen
                    ? 'bg-track-sql text-white border-track-sql shadow-md'
                    : 'bg-forge-card border-forge-border text-forge-secondary hover:text-forge-text'
                }`}
                title="Open Study Companion side-by-side"
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Study Companion</span>
              </button>
            )}

            {/* Quick Note attached to page */}
            {onOpenQuickNote && (
              <button
                onClick={() => onOpenQuickNote({
                  type: 'book_page',
                  id: `${book.id}-pg${currentPage}`,
                  title: `${book.title} (Page ${currentPage})`,
                  bookId: book.id,
                  chapterNumber: currentPage,
                  label: `${book.title} (Page ${currentPage})`
                })}
                className="px-3 py-1.5 rounded-xl bg-forge-card hover:bg-forge-surface border border-forge-border text-xs font-mono font-bold flex items-center gap-1.5 text-forge-text hover:border-track-sql/60 transition-colors shrink-0 shadow-sm"
                title="Capture quick note for this page"
              >
                <Plus className="w-3.5 h-3.5 text-track-sql" />
                <span className="hidden sm:inline">Note</span>
              </button>
            )}

            {/* Direct Native Tab Pop-out */}
            {book.pdfUrl && (
              <a
                href={book.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-forge-card hover:bg-forge-surface border border-forge-border text-xs font-mono font-bold flex items-center gap-1.5 text-forge-text hover:text-track-sql transition-colors shrink-0 shadow-sm"
                title="Open unabridged book in native browser tab with full two-page spread, search, and presentation mode"
              >
                <ExternalLink className="w-3.5 h-3.5 text-track-sql" />
                <span className="hidden sm:inline">Native Tab</span>
              </a>
            )}

            {/* Theater / Fullscreen Toggle */}
            <button
              onClick={() => setIsTheaterMode(!isTheaterMode)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                isTheaterMode
                  ? 'bg-track-pyspark text-white border-track-pyspark shadow-md'
                  : 'bg-forge-card border-forge-border text-forge-text hover:border-track-pyspark/60'
              }`}
              title={isTheaterMode ? 'Exit Fullscreen Theater Mode (Esc)' : 'Maximize Reader to 100% Fullscreen'}
            >
              {isTheaterMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isTheaterMode ? 'Exit Max' : 'Maximize'}</span>
            </button>

          </div>

        </div>
      </header>

      {/* DRM Notification Banner */}
      {drmAlert && (
        <div className="fixed bottom-6 right-6 z-50 bg-forge-card border border-track-warehousing/60 text-forge-text px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-mono animate-in slide-in-from-bottom-3">
          <ShieldCheck className="w-4 h-4 text-track-warehousing shrink-0" />
          <span>{drmAlert}</span>
        </div>
      )}

      {/* TAB 1: AUTHENTIC ONLINE LIBRARY PDF READER */}
      {activeTab === 'pdf' && (
        <div className={`flex-1 flex flex-col ${isTheaterMode ? 'p-2' : 'max-w-7xl mx-auto w-full px-3 sm:px-6 pt-4'} space-y-3`}>
          
          {/* Online Library Reading Controls Bar */}
          <div className="bg-forge-card border border-forge-border rounded-2xl p-2.5 sm:px-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-md">
            
            {/* Left: Page Navigator & Jump */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-forge-bg border border-forge-border rounded-xl p-0.5">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  className="p-1.5 rounded-lg text-forge-secondary hover:text-forge-text disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <form onSubmit={handlePageSubmit} className="flex items-center gap-1 px-1">
                  <span className="text-[11px] text-forge-muted">Page</span>
                  <input
                    type="text"
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    className="w-12 text-center py-0.5 rounded bg-forge-surface border border-forge-border text-forge-text text-xs font-bold focus:outline-none focus:border-track-sql"
                  />
                </form>

                <button
                  onClick={handleNextPage}
                  className="p-1.5 rounded-lg text-forge-secondary hover:text-forge-text"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Table of Contents (Bookmarks) Toggle */}
              <button
                onClick={() => setShowNavPanes(!showNavPanes)}
                className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors ${
                  showNavPanes
                    ? 'bg-forge-bg border-track-sql/40 text-track-sql font-bold'
                    : 'bg-forge-bg border-forge-border text-forge-secondary hover:text-forge-text'
                }`}
                title="Toggle PDF Chapters / Table of Contents panel"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Outline / TOC</span>
              </button>
            </div>

            {/* Center: Zoom / View Mode */}
            <div className="flex items-center gap-1 bg-forge-bg border border-forge-border rounded-xl p-1">
              <button
                onClick={() => setZoomMode('FitH')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-colors ${
                  zoomMode === 'FitH' ? 'bg-forge-surface text-forge-text' : 'text-forge-muted hover:text-forge-text'
                }`}
                title="Fit Width"
              >
                Fit Width
              </button>
              <button
                onClick={() => setZoomMode('Fit')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-colors ${
                  zoomMode === 'Fit' ? 'bg-forge-surface text-forge-text' : 'text-forge-muted hover:text-forge-text'
                }`}
                title="Fit Page"
              >
                Fit Page
              </button>
              <button
                onClick={() => setZoomMode('100')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-colors ${
                  zoomMode === '100' ? 'bg-forge-surface text-forge-text' : 'text-forge-muted hover:text-forge-text'
                }`}
                title="100% Zoom"
              >
                100%
              </button>
              <button
                onClick={() => setZoomMode('125')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-colors ${
                  zoomMode === '125' ? 'bg-forge-surface text-forge-text' : 'text-forge-muted hover:text-forge-text'
                }`}
                title="125% Zoom"
              >
                125%
              </button>
            </div>

            {/* Right: Security Badge, Maximize & Fast Companion Trigger */}
            <div className="flex items-center gap-2 text-[11px] text-forge-secondary">
              {book.pdfUrl && (
                <a
                  href={book.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-xl bg-forge-bg border border-forge-border hover:border-track-sql text-forge-text hover:text-track-sql font-bold flex items-center gap-1 transition-colors"
                  title="Pop out in a new tab"
                >
                  <ExternalLink className="w-3 h-3 text-track-sql" />
                  <span className="hidden md:inline">Pop-out Tab</span>
                </a>
              )}

              <button
                onClick={() => setIsTheaterMode(!isTheaterMode)}
                className="px-2.5 py-1 rounded-xl bg-forge-bg border border-forge-border hover:border-track-pyspark text-forge-text hover:text-track-pyspark font-bold flex items-center gap-1 transition-colors"
                title="Maximize to 100% Fullscreen"
              >
                {isTheaterMode ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                <span className="hidden md:inline">{isTheaterMode ? 'Exit Max' : 'Maximize'}</span>
              </button>

              {!isCompanionOpen && (
                <button
                  onClick={() => {
                    setIsCompanionOpen(true);
                    setCompanionTab('quiz');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-track-pyspark/10 border border-track-pyspark/30 text-track-pyspark font-bold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Test Knowledge ({quizQuestions.length})</span>
                </button>
              )}
            </div>

          </div>

          {/* Reading Canvas & Companion Split Stage */}
          <div 
            className="flex-1 flex flex-col lg:flex-row gap-4 w-full"
            style={{
              height: isTheaterMode ? 'calc(100vh - 110px)' : 'calc(100vh - 175px)',
              minHeight: isTheaterMode ? 'calc(100vh - 110px)' : '780px',
            }}
          >
            
            {/* MAIN PDF CANVAS */}
            <div 
              className="flex-1 h-full rounded-2xl sm:rounded-3xl border border-forge-border overflow-hidden shadow-2xl bg-black relative select-none flex flex-col"
              style={{
                height: '100%',
                minHeight: isTheaterMode ? 'calc(100vh - 110px)' : '780px',
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                triggerDrmNotification('Protected Literature: Right-click and saving are restricted.');
              }}
            >
              {book.pdfUrl ? (
                <iframe
                  src={pdfEmbedUrl}
                  className="w-full h-full border-0 rounded-2xl sm:rounded-3xl"
                  style={{
                    width: '100%',
                    height: '100%',
                    minHeight: isTheaterMode ? 'calc(100vh - 110px)' : '780px',
                  }}
                  title={book.title}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-forge-muted font-mono text-xs space-y-2">
                  <BookOpen className="w-8 h-8 opacity-40 animate-pulse" />
                  <p>Streaming complete book from secure digital vault...</p>
                </div>
              )}

              {/* Watermark in bottom corner */}
              <div className="absolute bottom-2 right-4 pointer-events-none opacity-20 text-[9px] font-mono text-white tracking-wider uppercase select-none">
                DataForge Online Library • Read-Only Lending Vault
              </div>
            </div>

            {/* SIDE STUDY COMPANION PANEL (SPLIT VIEW) */}
            {isCompanionOpen && (
              <div className="w-full lg:w-[420px] xl:w-[460px] h-full flex flex-col bg-forge-card border border-forge-border rounded-3xl overflow-hidden shadow-2xl shrink-0 animate-in slide-in-from-right-4 duration-200">
                
                {/* Companion Header */}
                <div className="p-3.5 bg-forge-surface border-b border-forge-border flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-track-sql" />
                    <span className="text-xs font-mono font-extrabold text-forge-text uppercase">Study Companion</span>
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-1 bg-forge-bg border border-forge-border rounded-xl p-0.5 text-[11px] font-mono">
                    <button
                      onClick={() => setCompanionTab('quiz')}
                      className={`px-2 py-0.5 rounded-lg font-bold transition-colors ${
                        companionTab === 'quiz' ? 'bg-forge-surface text-track-pyspark' : 'text-forge-muted hover:text-forge-text'
                      }`}
                    >
                      Quiz ({quizQuestions.length})
                    </button>
                    <button
                      onClick={() => setCompanionTab('concepts')}
                      className={`px-2 py-0.5 rounded-lg font-bold transition-colors ${
                        companionTab === 'concepts' ? 'bg-forge-surface text-track-warehousing' : 'text-forge-muted hover:text-forge-text'
                      }`}
                    >
                      Cards ({conceptCards.length})
                    </button>
                    <button
                      onClick={() => setCompanionTab('ask')}
                      className={`px-2 py-0.5 rounded-lg font-bold transition-colors ${
                        companionTab === 'ask' ? 'bg-forge-surface text-track-python' : 'text-forge-muted hover:text-forge-text'
                      }`}
                    >
                      Ask
                    </button>
                  </div>

                  <button
                    onClick={() => setIsCompanionOpen(false)}
                    className="p-1 rounded-lg text-forge-muted hover:text-forge-text hover:bg-forge-bg"
                    title="Close Study Companion"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Companion Body Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
                  
                  {/* COMPANION TAB: QUIZZES */}
                  {companionTab === 'quiz' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-forge-bg border border-forge-border rounded-2xl p-3">
                        <div className="font-mono">
                          <div className="text-[10px] text-forge-muted uppercase">Score</div>
                          <div className="text-base font-extrabold text-track-pyspark">{quizScore} / {quizQuestions.length}</div>
                        </div>
                        <div className="font-mono text-right">
                          <div className="text-[10px] text-forge-muted uppercase">XP Earned</div>
                          <div className="text-base font-extrabold text-emerald-400">+{quizScore * 50} XP</div>
                        </div>
                      </div>

                      {filteredQuestions.map((q, qIndex) => {
                        const answered = selectedAnswers[q.id] !== undefined;
                        const selectedIdx = selectedAnswers[q.id];
                        const isCorrect = selectedIdx === q.correctIndex;

                        return (
                          <div key={q.id} className="p-4 rounded-2xl bg-forge-bg border border-forge-border space-y-3 shadow-sm">
                            <div className="flex items-center justify-between text-[10px] font-mono text-forge-muted">
                              <span className="text-track-pyspark font-bold">Q#{qIndex + 1}</span>
                              <span className="truncate max-w-[180px]">{q.sourceChapter}</span>
                            </div>

                            <p className="font-bold text-forge-text leading-snug">{q.question}</p>

                            <div className="space-y-1.5">
                              {q.options.map((option, optIdx) => {
                                let btnStyle = 'bg-forge-card border-forge-border text-forge-secondary hover:bg-forge-surface hover:text-forge-text';

                                if (answered) {
                                  if (optIdx === q.correctIndex) {
                                    btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold';
                                  } else if (optIdx === selectedIdx) {
                                    btnStyle = 'bg-red-950/40 border-red-500 text-red-300';
                                  } else {
                                    btnStyle = 'bg-forge-card/40 border-forge-border/40 text-forge-muted opacity-50';
                                  }
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    disabled={answered}
                                    onClick={() => handleSelectAnswer(q.id, optIdx, q.correctIndex)}
                                    className={`w-full p-2.5 rounded-xl border text-left text-[11px] font-mono transition-all flex items-center justify-between gap-2 ${btnStyle}`}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="w-5 h-5 rounded bg-forge-surface border border-forge-border flex items-center justify-center font-bold shrink-0 text-[10px]">
                                        {String.fromCharCode(65 + optIdx)}
                                      </span>
                                      <span className="truncate">{option}</span>
                                    </div>
                                    {answered && optIdx === q.correctIndex && (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {answered && (
                              <div className={`p-3 rounded-xl border text-[11px] font-mono space-y-1 ${
                                isCorrect ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                              }`}>
                                <div className="font-bold uppercase text-[9px]">
                                  {isCorrect ? 'Correct! Staff Rationale:' : 'Explanation:'}
                                </div>
                                <p className="font-sans leading-relaxed text-[11px]">{q.explanation}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* COMPANION TAB: CONCEPT CARDS */}
                  {companionTab === 'concepts' && (
                    <div className="space-y-4">
                      {conceptCards.map((card) => (
                        <div key={card.id} className="p-4 rounded-2xl bg-forge-bg border border-forge-border space-y-2.5 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-track-warehousing/10 text-track-warehousing border border-track-warehousing/30">
                              {card.category}
                            </span>
                          </div>

                          <h4 className="font-extrabold text-forge-text text-sm">{card.title}</h4>

                          <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono space-y-0.5">
                            <div className="font-bold text-[9px] uppercase text-emerald-400">Rule of Thumb</div>
                            <p className="font-sans leading-relaxed">{card.ruleOfThumb}</p>
                          </div>

                          <p className="text-forge-secondary text-[11px] leading-relaxed">
                            {card.explanation}
                          </p>

                          {card.antiPattern && (
                            <div className="p-2.5 rounded-xl bg-red-950/20 border border-red-500/30 text-red-300 text-[11px] font-mono space-y-0.5">
                              <div className="font-bold text-[9px] uppercase text-red-400">Anti-Pattern</div>
                              <p className="font-sans text-[11px] text-red-200/90">{card.antiPattern}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* COMPANION TAB: ASK THE BOOK */}
                  {companionTab === 'ask' && (
                    <div className="space-y-4">
                      <div className="p-3 bg-forge-bg border border-forge-border rounded-2xl space-y-2">
                        <div className="text-[11px] font-bold text-forge-text font-mono">Ask {book.author}</div>
                        <input
                          type="text"
                          value={askQuery}
                          onChange={(e) => handleAskSearch(e.target.value)}
                          placeholder="Search concepts or ask architecture question..."
                          className="w-full p-2.5 rounded-xl bg-forge-surface border border-forge-border text-xs text-forge-text focus:outline-none focus:border-track-python font-mono"
                        />
                      </div>

                      {activeAskResult && (
                        <div className="p-4 rounded-2xl bg-forge-bg border border-track-python/40 space-y-2 animate-in fade-in duration-150">
                          <div className="text-[10px] font-mono text-track-python font-bold">
                            {activeAskResult.chapter}
                          </div>
                          <h4 className="font-bold text-forge-text text-xs">{activeAskResult.question}</h4>
                          <p className="text-forge-secondary text-[11px] leading-relaxed">{activeAskResult.answer}</p>
                          <div className="p-2 rounded-lg bg-track-python/10 text-track-python font-mono text-[10px]">
                            {activeAskResult.rule}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>

              </div>
            )}

          </div>

        </div>
      )}

      {/* NON-PDF TABS WRAPPER */}
      {activeTab !== 'pdf' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex-1 w-full space-y-6">

        {/* TAB 2: FUN CONCEPT CARDS & RULES OF THUMB */}
        {activeTab === 'concepts' && (
          <div className="space-y-6">
            
            <div className="p-6 rounded-3xl bg-forge-card border border-forge-border space-y-2 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-mono text-track-warehousing font-bold uppercase">
                <Sparkles className="w-4 h-4" />
                <span>Executive Architectural Concept Cards</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-forge-text">
                {book.title} Core Mental Models & Rules of Thumb
              </h2>
              <p className="text-xs sm:text-sm text-forge-secondary">
                No dry walls of text. Clear, high-impact architectural cards distinguishing core design rules from catastrophic production anti-patterns.
              </p>
            </div>

            {/* Grid of Concept Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {conceptCards.map((card) => (
                <div
                  key={card.id}
                  className="p-6 rounded-3xl bg-forge-card border border-forge-border hover:border-track-warehousing/60 transition-all space-y-4 shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-track-warehousing/10 text-track-warehousing border border-track-warehousing/30">
                        {card.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-forge-text">{card.title}</h3>

                    {/* Rule of thumb highlight */}
                    <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono space-y-1">
                      <div className="flex items-center gap-1 font-bold text-[10px] uppercase text-emerald-400">
                        <Lightbulb className="w-3 h-3" />
                        <span>Staff DE Rule of Thumb</span>
                      </div>
                      <p className="leading-relaxed font-sans">{card.ruleOfThumb}</p>
                    </div>

                    <p className="text-xs text-forge-secondary leading-relaxed">
                      {card.explanation}
                    </p>
                  </div>

                  {/* Anti pattern warning */}
                  {card.antiPattern && (
                    <div className="p-3 rounded-2xl bg-red-950/20 border border-red-500/30 text-red-300 text-xs font-mono space-y-0.5">
                      <div className="flex items-center gap-1 font-bold text-[10px] uppercase text-red-400">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Production Anti-Pattern</span>
                      </div>
                      <p className="text-[11px] text-red-200/90 font-sans">{card.antiPattern}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Chapter Summaries */}
            {book.chapters.length > 0 && (
              <div className="space-y-4 pt-6">
                <h3 className="text-lg font-bold text-forge-text font-mono">Chapter Executive Overviews</h3>
                <div className="space-y-3">
                  {book.chapters.map((ch) => (
                    <div key={ch.id} className="p-5 rounded-2xl bg-forge-card border border-forge-border space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-track-warehousing">
                        <span className="font-bold">Chapter {ch.number}</span>
                        <span>{ch.readingTime}</span>
                      </div>
                      <h4 className="text-base font-bold text-forge-text">{ch.title}</h4>
                      <p className="text-xs text-forge-secondary leading-relaxed">{ch.summary}</p>
                      {ch.seniorTip && (
                        <p className="text-xs text-emerald-400 font-mono pt-1">
                          💡 Senior Tip: {ch.seniorTip}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: INTERACTIVE CHAPTER Q&A & QUIZZES */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            
            {/* Quiz Banner & Score */}
            <div className="p-6 rounded-3xl bg-forge-card border border-forge-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-track-pyspark font-bold uppercase">
                  <HelpCircle className="w-4 h-4" />
                  <span>Interactive Technical Q&A & Comprehension Engine</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-forge-text">
                  Test Your Architecture Knowledge
                </h2>
                <p className="text-xs text-forge-secondary">
                  Real scenario questions asked in Principal Data Architect & Staff DE technical interviews.
                </p>
              </div>

              {/* Score card + Checkpoint Status & Skip */}
              <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap shrink-0">
                <div className="bg-forge-bg border border-forge-border rounded-2xl p-4 flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-xs font-mono text-forge-muted">SCORE</div>
                    <div className="text-xl font-extrabold text-track-pyspark font-mono">
                      {quizScore} / {quizQuestions.length}
                    </div>
                  </div>
                  <div className="text-center border-l border-forge-border pl-4">
                    <div className="text-xs font-mono text-forge-muted">XP REWARD</div>
                    <div className="text-xl font-extrabold text-emerald-400 font-mono">
                      +{quizScore * 50} XP
                    </div>
                  </div>
                </div>

                {/* Soft checkpoint status & Skip escape hatch */}
                <div className="flex flex-col gap-1.5">
                  <div className="px-3 py-1.5 rounded-xl bg-forge-bg border border-forge-border text-[11px] font-mono flex items-center gap-2">
                    <span className="text-forge-muted">Checkpoint (≥60%):</span>
                    {quizQuestions.length > 0 && (quizScore / quizQuestions.length) >= 0.6 ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Cleared
                      </span>
                    ) : (
                      <span className="text-amber-400 font-bold">Soft Check</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleSkipCheckpoint(typeof selectedChapterQuiz === 'number' ? selectedChapterQuiz : 1)}
                    className="px-3 py-1.5 rounded-xl bg-forge-bg hover:bg-forge-surface border border-forge-border hover:border-track-warehousing/60 text-[11px] font-mono font-bold text-forge-secondary hover:text-forge-text flex items-center justify-center gap-1.5 transition-colors"
                    title="Skip checkpoint for pure reference reading (marked without penalty)"
                  >
                    <SkipForward className="w-3 h-3 text-track-warehousing" />
                    <span>Skip Checkpoint</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Questions Stream */}
            <div className="space-y-6">
              {filteredQuestions.map((q, qIndex) => {
                const answered = selectedAnswers[q.id] !== undefined;
                const selectedIdx = selectedAnswers[q.id];
                const isCorrect = selectedIdx === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="p-6 rounded-3xl bg-forge-card border border-forge-border space-y-4 shadow-lg"
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-forge-muted">
                      <span className="text-track-pyspark font-bold">
                        Question #{qIndex + 1}
                      </span>
                      <span>{q.sourceChapter}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-forge-text leading-snug">
                      {q.question}
                    </h3>

                    {/* Options */}
                    <div className="grid grid-cols-1 gap-2.5 pt-2">
                      {q.options.map((option, optIdx) => {
                        let btnStyle = 'bg-forge-bg border-forge-border text-forge-secondary hover:bg-forge-surface hover:text-forge-text';

                        if (answered) {
                          if (optIdx === q.correctIndex) {
                            btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold';
                          } else if (optIdx === selectedIdx) {
                            btnStyle = 'bg-red-950/40 border-red-500 text-red-300';
                          } else {
                            btnStyle = 'bg-forge-bg/40 border-forge-border/40 text-forge-muted opacity-50';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={answered}
                            onClick={() => handleSelectAnswer(q.id, optIdx, q.correctIndex)}
                            className={`p-3.5 rounded-2xl border text-left text-xs font-mono transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="w-6 h-6 rounded-lg bg-forge-surface border border-forge-border flex items-center justify-center font-bold shrink-0 text-[11px]">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="truncate">{option}</span>
                            </div>

                            {answered && optIdx === q.correctIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                            {answered && optIdx === selectedIdx && optIdx !== q.correctIndex && (
                              <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation Reveal */}
                    {answered && (
                      <div className={`p-4 rounded-2xl border text-xs font-mono space-y-1 animate-in fade-in duration-200 ${
                        isCorrect ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                      }`}>
                        <div className="flex items-center gap-2 font-bold uppercase text-[10px]">
                          <Lightbulb className="w-3.5 h-3.5" />
                          <span>{isCorrect ? 'Correct! Architectural Rationale:' : 'Architectural Explanation:'}</span>
                        </div>
                        <p className="font-sans leading-relaxed text-xs opacity-95">
                          {q.explanation}
                        </p>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 4: "ASK THE BOOK" INTERACTIVE Q&A KNOWLEDGE SEARCH */}
        {activeTab === 'ask' && (
          <div className="space-y-6">
            
            <div className="p-8 rounded-3xl bg-forge-card border border-forge-border space-y-4 shadow-xl text-center max-w-3xl mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-track-python/10 border border-track-python/30 flex items-center justify-center text-track-python mx-auto shadow-inner">
                <Search className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-forge-text">Ask {book.author} — Architectural Q&A</h2>
                <p className="text-xs text-forge-secondary">
                  Query the knowledge base for instant definitions, schemas, and architectural guidelines from &quot;{book.title}&quot;.
                </p>
              </div>

              {/* Search input */}
              <div className="relative">
                <input
                  type="text"
                  value={askQuery}
                  onChange={(e) => handleAskSearch(e.target.value)}
                  placeholder={`Ask a question from "${book.title}"...`}
                  className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-forge-bg border border-forge-border text-sm text-forge-text focus:outline-none focus:border-track-python font-mono shadow-inner"
                />
                <button 
                  onClick={() => handleAskSearch(askQuery)}
                  className="absolute right-2 top-2 px-3 py-1.5 rounded-xl bg-track-python text-forge-bg font-bold font-mono text-xs"
                >
                  Query
                </button>
              </div>

              {/* Suggested quick chips */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 text-[11px] font-mono">
                {[
                  'What is the Grain?',
                  'SCD Type 2 vs Type 6',
                  'What is a Degenerate Dimension?',
                  'Conformed Dimensions',
                  'Accumulating Snapshot Fact'
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAskSearch(chip)}
                    className="px-2.5 py-1 rounded-lg bg-forge-bg border border-forge-border text-forge-secondary hover:text-track-python hover:border-track-python/40 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Answer Result Card */}
            {activeAskResult && (
              <div className="max-w-3xl mx-auto p-6 rounded-3xl bg-forge-card border border-track-python/40 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between text-xs font-mono text-track-python font-bold">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Instant Knowledge Retrieval</span>
                  </div>
                  <span className="text-forge-muted text-[10px]">{activeAskResult.chapter}</span>
                </div>

                <h3 className="text-lg font-extrabold text-forge-text">{activeAskResult.question}</h3>

                <p className="text-sm text-forge-secondary leading-relaxed font-sans">
                  {activeAskResult.answer}
                </p>

                <div className="p-3.5 rounded-2xl bg-track-python/10 border border-track-python/30 text-track-python text-xs font-mono flex items-start gap-2">
                  <Zap className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{activeAskResult.rule}</span>
                </div>
              </div>
            )}

          </div>
        )}

        </main>
      )}

    </div>
  );
};
