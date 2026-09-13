'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Lightbulb, 
  AlertTriangle, 
  Code2, 
  Sparkles,
  Bookmark,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Maximize2,
  Minimize2,
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Lock,
  ListOrdered,
  Plus
} from 'lucide-react';
import { BookReference, ContentRef } from '../../types';
import { 
  saveReadingProgress, 
  getReadingProgress, 
  toggleChapterBookmark, 
  getBookmarkedChapters 
} from '../../lib/libraryStorage';
import { useUserStore } from '../../lib/userStore';

export type ReaderTheme = 'dark' | 'sepia' | 'oled' | 'slate';
export type ReaderFont = 'serif' | 'sans' | 'mono';

interface BookReaderProps {
  book: BookReference;
  initialChapterId?: string;
  onBackToLibrary?: () => void;
  onNavigatePractice?: (practiceId: string) => void;
  onOpenQuickNote?: (ref?: ContentRef) => void;
}

export const BookReader: React.FC<BookReaderProps> = ({
  book,
  initialChapterId,
  onBackToLibrary,
  onNavigatePractice,
  onOpenQuickNote,
}) => {
  // Reading state
  const [currentChapterId, setCurrentChapterId] = useState<string>(
    initialChapterId || book.chapters[0]?.id || ''
  );
  const currentChapter = book.chapters.find(c => c.id === currentChapterId) || book.chapters[0];
  const currentChapterIndex = book.chapters.findIndex(c => c.id === currentChapterId);

  // User store hook
  let storeSetLastActive: any = null;
  try {
    const store = useUserStore();
    storeSetLastActive = store.setLastActive;
  } catch {
    // outside provider
  }

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

  // Appearance controls
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>('dark');
  const [readerFont, setReaderFont] = useState<ReaderFont>('serif');
  const [fontSize, setFontSize] = useState<number>(18);
  const [lineSpacing, setLineSpacing] = useState<'compact' | 'normal' | 'relaxed' | 'loose'>('relaxed');
  const [columnWidth, setColumnWidth] = useState<'narrow' | 'standard' | 'wide'>('standard');
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [showAppearanceMenu, setShowAppearanceMenu] = useState<boolean>(false);
  const [showTocDrawer, setShowTocDrawer] = useState<boolean>(false);
  const [tocSearch, setTocSearch] = useState<string>('');

  // DRM & Security Alert
  const [drmAlert, setDrmAlert] = useState<string | null>(null);

  // Bookmarks & Completion
  const [bookmarkedChapters, setBookmarkedChapters] = useState<string[]>([]);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);

  // Scroll Progress
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  // Text to Speech (Audio Read-Along)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load progress and bookmarks on mount
  useEffect(() => {
    const bookmarks = getBookmarkedChapters(book.id);
    setBookmarkedChapters(bookmarks);

    const savedProgress = getReadingProgress(book.id);
    if (savedProgress) {
      if (savedProgress.completedChapterIds) {
        setCompletedChapters(savedProgress.completedChapterIds);
      }
      if (!initialChapterId && savedProgress.lastChapterId) {
        setCurrentChapterId(savedProgress.lastChapterId);
      }
    }
  }, [book.id, initialChapterId]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const el = contentContainerRef.current;
      if (!el) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
        setScrollProgress(pct);
        saveReadingProgress(book.id, currentChapterId, pct);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [book.id, currentChapterId]);

  // Anti-download / DRM keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Intercept Ctrl+S, Cmd+S, Ctrl+P, Cmd+P, Ctrl+U, Cmd+U
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p' || e.key === 'u')) {
        e.preventDefault();
        triggerDrmNotification('Downloading, saving, and printing are disabled to protect library content.');
      }
      // Intercept copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        // Allow in code blocks, but block full book extraction
        const selection = window.getSelection()?.toString();
        if (selection && selection.length > 250) {
          e.preventDefault();
          triggerDrmNotification('Text extraction limit exceeded: DataForge Digital Library is read-only.');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerDrmNotification = (msg: string) => {
    setDrmAlert(msg);
    setTimeout(() => setDrmAlert(null), 4000);
  };

  // Text-To-Speech Handlers
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      triggerDrmNotification('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!currentChapter) return;

    window.speechSynthesis.cancel();
    const cleanText = currentChapter.content.replace(/[#*_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speechRate;
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleStopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const handleBookmarkToggle = () => {
    if (!currentChapter) return;
    const updated = toggleChapterBookmark(book.id, currentChapter.id);
    setBookmarkedChapters(updated);
  };

  const handleMarkChapterCompleted = () => {
    if (!currentChapter) return;
    const isDone = completedChapters.includes(currentChapter.id);
    let updated: string[];
    if (isDone) {
      updated = completedChapters.filter(id => id !== currentChapter.id);
    } else {
      updated = [...completedChapters, currentChapter.id];
    }
    setCompletedChapters(updated);
    saveReadingProgress(book.id, currentChapter.id, 100, !isDone);
  };

  const handleJumpChapter = (chapterId: string) => {
    handleStopSpeech();
    setCurrentChapterId(chapterId);
    setShowTocDrawer(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    saveReadingProgress(book.id, chapterId, 0);
  };

  // Filter TOC
  const filteredChapters = book.chapters.filter(ch => 
    ch.title.toLowerCase().includes(tocSearch.toLowerCase()) ||
    ch.summary.toLowerCase().includes(tocSearch.toLowerCase())
  );

  // Theme Styling Classes
  const getThemeClasses = () => {
    switch (readerTheme) {
      case 'sepia':
        return 'bg-[#FAF6EE] text-[#2B2520] border-[#E8DFD1]';
      case 'oled':
        return 'bg-[#000000] text-[#E5E7EB] border-[#1F2937]';
      case 'slate':
        return 'bg-[#1E222A] text-[#D8DEE9] border-[#2E3440]';
      case 'dark':
      default:
        return 'bg-forge-bg text-forge-text border-forge-border';
    }
  };

  const getContainerBg = () => {
    switch (readerTheme) {
      case 'sepia':
        return 'bg-[#F2ECE1]';
      case 'oled':
        return 'bg-black';
      case 'slate':
        return 'bg-[#181B20]';
      case 'dark':
      default:
        return 'bg-[#0D1117]';
    }
  };

  const getFontFamily = () => {
    switch (readerFont) {
      case 'sans':
        return 'font-sans';
      case 'mono':
        return 'font-mono';
      case 'serif':
      default:
        return 'font-serif';
    }
  };

  const getColumnWidthClass = () => {
    switch (columnWidth) {
      case 'narrow':
        return 'max-w-2xl';
      case 'wide':
        return 'max-w-5xl';
      case 'standard':
      default:
        return 'max-w-3xl';
    }
  };

  const getLineSpacingClass = () => {
    switch (lineSpacing) {
      case 'compact':
        return 'leading-normal';
      case 'loose':
        return 'leading-loose';
      case 'relaxed':
      default:
        return 'leading-relaxed';
    }
  };

  const isBookmarked = currentChapter ? bookmarkedChapters.includes(currentChapter.id) : false;
  const isCompleted = currentChapter ? completedChapters.includes(currentChapter.id) : false;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${getContainerBg()}`} ref={contentContainerRef}>
      
      {/* Scroll Progress Bar at Top */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-forge-border/40 z-50">
        <div 
          className="h-full bg-gradient-to-r from-track-sql to-track-warehousing transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Reading Navigation Bar */}
      {!isZenMode && (
        <header className="sticky top-0 z-40 bg-forge-card/90 backdrop-blur-md border-b border-forge-border px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            {/* Left: Back & Book Title */}
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
                  <span className="text-xs font-extrabold text-forge-text truncate">{book.title}</span>
                  {book.isCustom && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-track-sql/10 text-track-sql border border-track-sql/30">
                      Personal Vault
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-forge-muted font-mono truncate">
                  {book.author} • Chapter {currentChapterIndex + 1} of {book.chapters.length}
                </p>
              </div>
            </div>

            {/* Right: Reader Controls (TOC, TTS, Appearance, Zen) */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* Table of Contents Button */}
              <button
                onClick={() => setShowTocDrawer(!showTocDrawer)}
                className="px-3 py-1.5 rounded-xl bg-forge-bg hover:bg-forge-surface border border-forge-border text-xs font-mono font-bold flex items-center gap-1.5 text-forge-secondary hover:text-forge-text transition-colors"
                title="Table of Contents"
              >
                <ListOrdered className="w-3.5 h-3.5 text-track-sql" />
                <span className="hidden sm:inline">Contents</span>
              </button>

              {/* Text to Speech Audio Read-Aloud */}
              <div className="flex items-center bg-forge-bg border border-forge-border rounded-xl p-0.5">
                <button
                  onClick={handleToggleSpeech}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
                    isSpeaking 
                      ? 'bg-track-pyspark text-white' 
                      : 'text-forge-secondary hover:text-forge-text'
                  }`}
                  title={isSpeaking ? 'Pause Audio' : 'Listen with Audio Read-Aloud'}
                >
                  {isSpeaking ? <Pause className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span className="hidden md:inline">{isSpeaking ? 'Listening' : 'Listen'}</span>
                </button>

                {isSpeaking && (
                  <button
                    onClick={handleStopSpeech}
                    className="p-1 text-forge-muted hover:text-red-400"
                    title="Stop Audio"
                  >
                    <VolumeX className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Bookmark Toggle */}
              <button
                onClick={handleBookmarkToggle}
                className={`p-1.5 rounded-xl border transition-colors ${
                  isBookmarked 
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' 
                    : 'bg-forge-bg border-forge-border text-forge-muted hover:text-forge-text'
                }`}
                title="Bookmark Chapter"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              </button>

              {/* Appearance / Typography Menu Toggle */}
              <div className="relative">
                <button
                  onClick={() => setShowAppearanceMenu(!showAppearanceMenu)}
                  className="px-3 py-1.5 rounded-xl bg-forge-bg hover:bg-forge-surface border border-forge-border text-xs font-mono font-bold flex items-center gap-1.5 text-forge-secondary hover:text-forge-text transition-colors"
                  title="Typography & Themes"
                >
                  <Sliders className="w-3.5 h-3.5 text-track-warehousing" />
                  <span className="hidden sm:inline">Aa</span>
                </button>

                {/* Appearance Flyout */}
                {showAppearanceMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-forge-card border border-forge-border rounded-2xl p-4 shadow-2xl z-50 space-y-4 animate-in fade-in slide-in-from-top-2">
                    
                    {/* Theme selector */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-forge-muted font-bold">Theme</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { id: 'dark', label: 'Dark', bg: 'bg-[#0D1117] text-white border-forge-border' },
                          { id: 'sepia', label: 'Sepia', bg: 'bg-[#FAF6EE] text-[#2B2520] border-[#E8DFD1]' },
                          { id: 'oled', label: 'OLED', bg: 'bg-black text-white border-gray-800' },
                          { id: 'slate', label: 'Slate', bg: 'bg-[#1E222A] text-[#D8DEE9] border-[#2E3440]' },
                        ].map((th) => (
                          <button
                            key={th.id}
                            onClick={() => setReaderTheme(th.id as ReaderTheme)}
                            className={`py-1.5 text-xs font-mono font-bold rounded-lg border flex items-center justify-center transition-all ${th.bg} ${
                              readerTheme === th.id ? 'ring-2 ring-track-sql' : ''
                            }`}
                          >
                            {th.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font selector */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-forge-muted font-bold">Typography</label>
                      <div className="grid grid-cols-3 gap-1.5 text-xs">
                        <button
                          onClick={() => setReaderFont('serif')}
                          className={`py-1.5 rounded-lg border font-serif text-center transition-all ${
                            readerFont === 'serif' ? 'bg-forge-bg text-track-sql border-track-sql' : 'border-forge-border text-forge-secondary'
                          }`}
                        >
                          Serif
                        </button>
                        <button
                          onClick={() => setReaderFont('sans')}
                          className={`py-1.5 rounded-lg border font-sans text-center transition-all ${
                            readerFont === 'sans' ? 'bg-forge-bg text-track-sql border-track-sql' : 'border-forge-border text-forge-secondary'
                          }`}
                        >
                          Sans
                        </button>
                        <button
                          onClick={() => setReaderFont('mono')}
                          className={`py-1.5 rounded-lg border font-mono text-center transition-all ${
                            readerFont === 'mono' ? 'bg-forge-bg text-track-sql border-track-sql' : 'border-forge-border text-forge-secondary'
                          }`}
                        >
                          Mono
                        </button>
                      </div>
                    </div>

                    {/* Font Size */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono text-forge-muted">
                        <span>SIZE</span>
                        <span>{fontSize}px</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                          className="flex-1 py-1 rounded bg-forge-bg border border-forge-border text-xs font-bold text-forge-secondary hover:text-forge-text"
                        >
                          A-
                        </button>
                        <button
                          onClick={() => setFontSize(Math.min(26, fontSize + 2))}
                          className="flex-1 py-1 rounded bg-forge-bg border border-forge-border text-xs font-bold text-forge-secondary hover:text-forge-text"
                        >
                          A+
                        </button>
                      </div>
                    </div>

                    {/* Column Width */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-forge-muted font-bold">Margin Width</label>
                      <div className="grid grid-cols-3 gap-1 text-[11px] font-mono">
                        {(['narrow', 'standard', 'wide'] as const).map((w) => (
                          <button
                            key={w}
                            onClick={() => setColumnWidth(w)}
                            className={`py-1 rounded capitalize border ${
                              columnWidth === w ? 'bg-forge-bg text-track-sql border-track-sql' : 'border-forge-border text-forge-secondary'
                            }`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Audio Speed */}
                    <div className="space-y-1.5 pt-1 border-t border-forge-border">
                      <div className="flex justify-between text-[10px] font-mono text-forge-muted">
                        <span>AUDIO READ SPEED</span>
                        <span>{speechRate}x</span>
                      </div>
                      <div className="flex gap-1">
                        {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                          <button
                            key={rate}
                            onClick={() => setSpeechRate(rate)}
                            className={`flex-1 py-0.5 rounded text-[10px] font-mono border ${
                              speechRate === rate ? 'bg-track-pyspark text-white border-track-pyspark' : 'border-forge-border text-forge-secondary'
                            }`}
                          >
                            {rate}x
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* Zen Fullscreen Toggle */}
              <button
                onClick={() => setIsZenMode(true)}
                className="p-1.5 rounded-xl bg-forge-bg hover:bg-forge-surface border border-forge-border text-forge-secondary hover:text-forge-text transition-colors"
                title="Zen Mode (Distraction-Free)"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

            </div>

          </div>
        </header>
      )}

      {/* Zen Mode Exit Floating Pill */}
      {isZenMode && (
        <button
          onClick={() => setIsZenMode(false)}
          className="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-full bg-forge-card/80 backdrop-blur-md border border-forge-border text-xs font-mono text-forge-secondary hover:text-forge-text shadow-xl flex items-center gap-1.5"
        >
          <Minimize2 className="w-3.5 h-3.5" />
          <span>Exit Zen</span>
        </button>
      )}

      {/* DRM Notification Banner */}
      {drmAlert && (
        <div className="fixed bottom-6 right-6 z-50 bg-forge-card border border-track-warehousing/60 text-forge-text px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-mono animate-in slide-in-from-bottom-3">
          <ShieldCheck className="w-4 h-4 text-track-warehousing shrink-0" />
          <span>{drmAlert}</span>
        </div>
      )}

      {/* Table of Contents Drawer */}
      {showTocDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-start">
          <div className="w-full max-w-sm bg-forge-card border-r border-forge-border h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-forge-border flex items-center justify-between bg-forge-bg/60">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-track-sql" />
                <h3 className="text-xs font-mono font-bold uppercase text-forge-text">Table of Contents</h3>
              </div>
              <button
                onClick={() => setShowTocDrawer(false)}
                className="p-1 rounded-lg text-forge-muted hover:text-forge-text"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Search filter */}
            <div className="p-3 border-b border-forge-border">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-forge-muted absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={tocSearch}
                  onChange={(e) => setTocSearch(e.target.value)}
                  placeholder="Search chapters..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-forge-bg border border-forge-border text-xs text-forge-text focus:outline-none focus:border-track-sql font-mono"
                />
              </div>
            </div>

            {/* Chapters List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {filteredChapters.map((ch, idx) => {
                const isActive = ch.id === currentChapter?.id;
                const isChDone = completedChapters.includes(ch.id);
                const isChBookmarked = bookmarkedChapters.includes(ch.id);

                return (
                  <div
                    key={ch.id}
                    onClick={() => handleJumpChapter(ch.id)}
                    className={`p-3 rounded-xl cursor-pointer text-xs transition-all flex items-start justify-between gap-2 ${
                      isActive 
                        ? 'bg-track-sql/10 border border-track-sql text-forge-text font-bold'
                        : 'hover:bg-forge-surface text-forge-secondary border border-transparent'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-forge-muted">
                        <span>Ch {ch.number || idx + 1}</span>
                        <span>•</span>
                        <span>{ch.readingTime}</span>
                        {isChDone && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        {isChBookmarked && <Bookmark className="w-3 h-3 text-amber-400 fill-amber-400" />}
                      </div>
                      <p className="truncate text-xs">{ch.title}</p>
                    </div>

                    <ChevronRight className="w-3.5 h-3.5 text-forge-muted shrink-0 mt-1" />
                  </div>
                );
              })}
            </div>

            {/* Drawer Footer Stats */}
            <div className="p-4 border-t border-forge-border bg-forge-bg/60 text-[11px] font-mono text-forge-muted flex justify-between">
              <span>{completedChapters.length} / {book.chapters.length} Completed</span>
              <span className="text-track-sql font-bold">
                {Math.round((completedChapters.length / book.chapters.length) * 100)}%
              </span>
            </div>

          </div>

          <div className="flex-1" onClick={() => setShowTocDrawer(false)} />
        </div>
      )}

      {/* Main Distraction-Free Reading Canvas */}
      <main 
        className={`mx-auto px-6 py-12 transition-all duration-300 ${getColumnWidthClass()} select-none`}
        onContextMenu={(e) => {
          e.preventDefault();
          triggerDrmNotification('Protected Digital Library: Right-click is restricted.');
        }}
      >
        {currentChapter ? (
          <article 
            className={`rounded-3xl border shadow-xl p-8 sm:p-14 space-y-8 relative overflow-hidden transition-colors duration-300 ${getThemeClasses()}`}
          >
            
            {/* Subtle DRM Watermark */}
            <div className="absolute top-4 right-6 pointer-events-none opacity-20 text-[9px] font-mono tracking-widest text-forge-muted uppercase">
              DataForge Secure Reader • Read-Only
            </div>

            {/* Chapter Header */}
            <div className="space-y-3 border-b border-current/10 pb-6">
              <div className="flex items-center justify-between text-xs font-mono text-current/60">
                <div className="flex items-center gap-2">
                  <span className="font-bold">Chapter #{currentChapter.number || currentChapterIndex + 1}</span>
                  <span>•</span>
                  <span>{currentChapter.readingTime} read</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMarkChapterCompleted}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                      isCompleted 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'border-current/20 text-current/70 hover:text-current'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isCompleted ? 'Completed' : 'Mark as Read'}</span>
                  </button>
                </div>
              </div>

              <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight ${getFontFamily()}`}>
                {currentChapter.title}
              </h1>

              {currentChapter.summary && (
                <p className={`text-sm sm:text-base opacity-75 font-sans leading-relaxed pt-1`}>
                  {currentChapter.summary}
                </p>
              )}
            </div>

            {/* Main Chapter Content Body */}
            <div 
              className={`space-y-6 whitespace-pre-line ${getFontFamily()} ${getLineSpacingClass()}`}
              style={{ fontSize: `${fontSize}px` }}
            >
              {currentChapter.content}
            </div>

            {/* Interactive Coding Challenge CTA */}
            {currentChapter.linkedPracticeId && onNavigatePractice && (
              <div className="p-6 rounded-2xl bg-current/5 border border-current/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1 font-sans">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-track-sql uppercase">
                    <Code2 className="w-4 h-4" />
                    Hands-on Arena Challenge
                  </div>
                  <h4 className="text-sm font-bold text-current">
                    Practice This Architectural Concept
                  </h4>
                  <p className="text-xs opacity-75">
                    Launch in-browser DuckDB or Python editor with test assertions.
                  </p>
                </div>

                <button
                  onClick={() => onNavigatePractice(currentChapter.linkedPracticeId!)}
                  className="px-5 py-2.5 rounded-xl bg-track-sql hover:bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 shrink-0 font-sans"
                >
                  <span>Launch Practice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Staff DE Tip */}
            {currentChapter.seniorTip && (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5 font-sans">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
                  <Lightbulb className="w-4 h-4" />
                  Staff Architect Takeaway
                </div>
                <p className="text-xs opacity-90 leading-relaxed">
                  {currentChapter.seniorTip}
                </p>
              </div>
            )}

            {/* Bottom Chapter Paging Buttons */}
            <div className="pt-8 border-t border-current/10 flex items-center justify-between gap-4 font-sans">
              {currentChapterIndex > 0 ? (
                <button
                  onClick={() => handleJumpChapter(book.chapters[currentChapterIndex - 1].id)}
                  className="px-4 py-2.5 rounded-xl bg-current/5 hover:bg-current/10 border border-current/15 text-xs font-mono font-bold flex items-center gap-2 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Chapter</span>
                </button>
              ) : (
                <div />
              )}

              {currentChapterIndex < book.chapters.length - 1 ? (
                <button
                  onClick={() => handleJumpChapter(book.chapters[currentChapterIndex + 1].id)}
                  className="px-5 py-2.5 rounded-xl bg-track-sql hover:bg-blue-600 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-md transition-all"
                >
                  <span>Next Chapter</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleMarkChapterCompleted();
                    if (onBackToLibrary) onBackToLibrary();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-md transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Finish Book</span>
                </button>
              )}
            </div>

          </article>
        ) : (
          <div className="text-center py-20 font-mono text-sm text-forge-muted">
            No chapter selected. Open table of contents to select a chapter.
          </div>
        )}
      </main>

    </div>
  );
};
