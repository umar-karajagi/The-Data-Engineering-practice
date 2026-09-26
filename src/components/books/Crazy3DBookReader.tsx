'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Bookmark, 
  Rotate3d, 
  Terminal, 
  Clock, 
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  Layers,
  CheckCircle2,
  X,
  List
} from 'lucide-react';
import { BookReference } from '../../types';

interface Crazy3DBookReaderProps {
  book: BookReference;
  initialChapterId?: string;
  onBackToLibrary: () => void;
  onNavigatePractice?: (practiceId: string) => void;
  onAddXP?: (amount: number) => void;
}

export const Crazy3DBookReader: React.FC<Crazy3DBookReaderProps> = ({
  book,
  initialChapterId,
  onBackToLibrary,
  onNavigatePractice,
  onAddXP
}) => {
  const [currentChapterIdx, setCurrentChapterIdx] = useState<number>(() => {
    if (!initialChapterId) return 0;
    const idx = book.chapters.findIndex(c => c.id === initialChapterId);
    return idx >= 0 ? idx : 0;
  });

  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [isOrbitMode, setIsOrbitMode] = useState<boolean>(false);
  const [showToc, setShowToc] = useState<boolean>(false);
  const [rightTab, setRightTab] = useState<'code' | 'concepts' | 'quiz'>('code');
  const [fontSize, setFontSize] = useState<number>(15);
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('serif');
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const currentChapter = book.chapters[currentChapterIdx] || book.chapters[0] || {
    id: 'ch-default',
    number: 1,
    title: book.title,
    readingTime: '15 min',
    summary: book.description,
    content: book.description
  };
  const totalChapters = book.chapters.length || 1;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleNextChapter = () => {
    if (currentChapterIdx < totalChapters - 1 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentChapterIdx(prev => prev + 1);
        setIsFlipping(false);
        if (onAddXP) onAddXP(20);
      }, 500);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIdx > 0 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentChapterIdx(prev => prev - 1);
        setIsFlipping(false);
      }, 500);
    }
  };

  const conceptCards = book.conceptCards || [];
  const quizQuestions = book.quizQuestions || [];

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative min-h-[92vh] bg-gradient-to-b from-[#03140E] via-[#052419] to-[#020D08] text-emerald-50 p-4 sm:p-8 flex flex-col justify-between overflow-hidden select-none"
    >
      
      {/* 3D Ambient Botanical Spores / Floating Leaves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mint-400/10 rounded-full blur-[140px]" />
        
        {/* Bioluminescent branch lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <path d="M-50,200 Q200,100 450,300 T900,250 T1400,400" fill="none" stroke="#34D399" strokeWidth="2" strokeDasharray="6 6" />
          <path d="M100,800 Q400,600 700,750 T1300,650" fill="none" stroke="#10B981" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Top Navigation & Status Bar */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 border-b border-emerald-900/60 pb-4 backdrop-blur-md">
        
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLibrary}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Library</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                🔓 100% Unlocked Edition
              </span>
              <span className="text-xs font-semibold text-emerald-400/80 hidden sm:inline">
                {book.author}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-sm sm:max-w-md">
              {book.title}
            </h2>
          </div>
        </div>

        {/* 3D Controls & Typography Options */}
        <div className="flex items-center gap-2">
          
          <button
            onClick={() => setShowToc(!showToc)}
            className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border border-emerald-800 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 transition-all"
            title="View Chapters List"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">TOC ({totalChapters})</span>
          </button>

          <button
            onClick={() => setIsOrbitMode(!isOrbitMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border transition-all ${
              isOrbitMode 
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/30' 
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-800 hover:border-emerald-600'
            }`}
            title="Toggle 3D Orbit Floating Chapters Ring"
          >
            <Rotate3d className="w-4 h-4" />
            <span className="hidden sm:inline">3D Chapter Halo</span>
          </button>

          <div className="flex items-center bg-emerald-950/80 border border-emerald-800/80 rounded-xl p-1 text-xs">
            <button
              onClick={() => setFontFamily('serif')}
              className={`px-2 py-1 rounded font-serif ${fontFamily === 'serif' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-emerald-500'}`}
            >
              Serif
            </button>
            <button
              onClick={() => setFontFamily('sans')}
              className={`px-2 py-1 rounded font-sans ${fontFamily === 'sans' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-emerald-500'}`}
            >
              Sans
            </button>
            <button
              onClick={() => setFontFamily('mono')}
              className={`px-2 py-1 rounded font-mono ${fontFamily === 'mono' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-emerald-500'}`}
            >
              Mono
            </button>
          </div>

          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`p-2 rounded-xl border transition-all ${
              bookmarked 
                ? 'bg-amber-500/20 border-amber-500 text-amber-400' 
                : 'bg-emerald-950/80 border-emerald-800 text-emerald-400 hover:text-emerald-200'
            }`}
            title="Bookmark Chapter"
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3D HOLOGRAPHIC CHAPTER ORBIT RING (IF ORBIT MODE IS ACTIVE) */}
      {/* ========================================================================= */}
      {isOrbitMode && (
        <div className="relative z-20 py-4 flex items-center justify-center gap-2 overflow-x-auto">
          {book.chapters.map((ch, idx) => {
            const isCur = idx === currentChapterIdx;
            return (
              <button
                key={ch.id}
                onClick={() => setCurrentChapterIdx(idx)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-all border ${
                  isCur 
                    ? 'bg-emerald-500 text-black border-emerald-300 shadow-md shadow-emerald-500/40 scale-105' 
                    : 'bg-emerald-950/90 text-emerald-300 border-emerald-800 hover:border-emerald-600'
                }`}
              >
                Ch {ch.number}: {ch.title.slice(0, 18)}...
              </button>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3D BOOK STAGE WITH REALISTIC 3D PERSPECTIVE AND TURNING PAGES */}
      {/* ========================================================================= */}
      <div 
        className="relative z-10 flex-1 flex items-center justify-center py-6 sm:py-8 [perspective:1600px]"
      >
        <motion.div
          animate={{
            rotateX: -mousePos.y * 12,
            rotateY: mousePos.x * 16,
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative w-full max-w-6xl aspect-[1.45/1] sm:aspect-[1.65/1] rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.85)] flex min-h-[550px]"
        >
          
          {/* 3D Hardcover Spine Depth Shadow */}
          <div 
            className="absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 z-30 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.65) 100%)'
            }}
          />

          {/* 3D Book Thickness Edge Layer (Paper Stack Base) */}
          <div 
            className="absolute inset-0 rounded-2xl bg-[#0F291E] border-2 border-emerald-700/60 -z-10 translate-y-3 translate-z-[-20px] shadow-2xl"
          />

          {/* ===================================================================== */}
          {/* LEFT PAGE (PAGE N - FULL CHAPTER CONTENT & SENIOR ADVICE) */}
          {/* ===================================================================== */}
          <div 
            className="w-1/2 h-full rounded-l-2xl p-6 sm:p-10 flex flex-col justify-between overflow-y-auto border-r border-emerald-950/60 relative"
            style={{
              background: 'linear-gradient(135deg, #09261A 0%, #061F14 100%)',
              color: '#ECFDF5'
            }}
          >
            <div className="space-y-4">
              {/* Chapter Header */}
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400 pb-2 border-b border-emerald-900/60">
                <span className="font-bold uppercase tracking-wider">
                  Chapter {currentChapter.number} of {totalChapters}
                </span>
                <span className="flex items-center gap-1 text-emerald-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{currentChapter.readingTime || '15 min'}</span>
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
                {currentChapter.title}
              </h1>

              {/* Core Concept Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(book.keyTakeaways?.slice(0, 3) || book.coreConcepts?.slice(0, 3) || ['Distributed Systems', 'Production Grade']).map((tag, tIdx) => (
                  <span 
                    key={tIdx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                  >
                    ★ {tag}
                  </span>
                ))}
              </div>

              {/* Chapter Summary */}
              {currentChapter.summary && (
                <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
                  {currentChapter.summary}
                </div>
              )}

              {/* Full Chapter Content Body */}
              <div className={`text-xs sm:text-sm text-emerald-100/90 leading-relaxed whitespace-pre-line space-y-2 ${
                fontFamily === 'serif' ? 'font-serif' : fontFamily === 'mono' ? 'font-mono' : 'font-sans'
              }`}>
                {currentChapter.content || book.description}
              </div>

              {/* Senior Staff DE Tip Callout */}
              {currentChapter.seniorTip && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-200 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">Senior Staff DE Tip:</span>
                    <span>{currentChapter.seniorTip}</span>
                  </div>
                </div>
              )}

              {/* Anti-Pattern Warning Callout */}
              {currentChapter.antiPattern && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">Common Anti-Pattern:</span>
                    <span>{currentChapter.antiPattern}</span>
                  </div>
                </div>
              )}

            </div>

            {/* Left Page Footer Navigation */}
            <div className="pt-4 mt-6 border-t border-emerald-900/60 flex items-center justify-between text-xs font-mono text-emerald-400">
              <button
                onClick={handlePrevChapter}
                disabled={currentChapterIdx === 0}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                  currentChapterIdx === 0 
                    ? 'opacity-30 cursor-not-allowed border-transparent' 
                    : 'bg-emerald-950 hover:bg-emerald-900 border-emerald-800 text-emerald-200'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev Chapter</span>
              </button>

              <span className="text-[11px] font-bold text-emerald-500">
                Page {currentChapter.number * 2 - 1}
              </span>
            </div>

          </div>

          {/* ===================================================================== */}
          {/* RIGHT PAGE (PAGE N+1 - CODE LAB / CONCEPT CARDS / QUIZ) */}
          {/* ===================================================================== */}
          <div 
            className="w-1/2 h-full rounded-r-2xl p-6 sm:p-10 flex flex-col justify-between overflow-y-auto relative"
            style={{
              background: 'linear-gradient(135deg, #061F14 0%, #09261A 100%)',
              color: '#ECFDF5'
            }}
          >
            <div>
              {/* Right Page Tab Switcher */}
              <div className="flex items-center justify-between gap-2 text-xs font-mono text-emerald-400 mb-4 pb-2 border-b border-emerald-900/60">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setRightTab('code')}
                    className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                      rightTab === 'code' ? 'bg-emerald-500 text-black' : 'text-emerald-400 hover:text-emerald-200'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Lab Code</span>
                  </button>

                  {conceptCards.length > 0 && (
                    <button
                      onClick={() => setRightTab('concepts')}
                      className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                        rightTab === 'concepts' ? 'bg-emerald-500 text-black' : 'text-emerald-400 hover:text-emerald-200'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Cards ({conceptCards.length})</span>
                    </button>
                  )}

                  {quizQuestions.length > 0 && (
                    <button
                      onClick={() => setRightTab('quiz')}
                      className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                        rightTab === 'quiz' ? 'bg-emerald-500 text-black' : 'text-emerald-400 hover:text-emerald-200'
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Quiz</span>
                    </button>
                  )}
                </div>

                <span className="text-[11px] text-emerald-500 font-bold">
                  Page {currentChapter.number * 2}
                </span>
              </div>

              {/* TAB 1: CODE BENCHMARK & LAB */}
              {rightTab === 'code' && (
                <div className="space-y-4">
                  <div className="rounded-xl bg-[#020B07] border border-emerald-800/80 p-4 font-mono text-xs shadow-inner">
                    <div className="flex items-center justify-between text-[11px] text-emerald-500 mb-2 border-b border-emerald-900/60 pb-1.5">
                      <span>production_pipeline.py</span>
                      <span className="text-emerald-400">Python 3.11</span>
                    </div>
                    <pre className="text-emerald-300 overflow-x-auto leading-relaxed">
{`# Chapter ${currentChapter.number}: ${currentChapter.title}
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, broadcast

spark = SparkSession.builder \\
    .appName("DataVedaPipeline") \\
    .config("spark.sql.adaptive.enabled", "true") \\
    .getOrCreate()

# High-throughput partitioned transform
df = spark.read.format("iceberg").load("lakehouse.events")
result = df.filter(col("status") == "PROCESSED") \\
           .groupBy("customer_id") \\
           .agg({"amount": "sum"})`}
                    </pre>
                  </div>

                  {/* Hands-on Interactive Practice CTA */}
                  <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800/80 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Practice Challenge Available
                      </h4>
                      <p className="text-[11px] text-emerald-300 mt-0.5">
                        Test your understanding in the interactive SQL workbench.
                      </p>
                    </div>
                    <button
                      onClick={() => onNavigatePractice ? onNavigatePractice('pyspark') : null}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black text-xs font-mono font-bold shrink-0 transition-colors shadow-md"
                    >
                      Start Lab
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: CONCEPT FLASHCARDS */}
              {rightTab === 'concepts' && (
                <div className="space-y-3">
                  {conceptCards.slice(0, 3).map((card, cIdx) => (
                    <div 
                      key={cIdx}
                      className="p-3.5 rounded-xl bg-[#020B07] border border-emerald-800/80 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-300">{card.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                          Card 0{cIdx + 1}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-100/90 leading-relaxed">
                        {card.ruleOfThumb || card.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: CHAPTER QUIZ */}
              {rightTab === 'quiz' && (
                <div className="space-y-4">
                  {quizQuestions.slice(0, 2).map((q, qIdx) => {
                    const sel = selectedAnswers[q.id];
                    const isRevealed = revealedAnswers[q.id];

                    return (
                      <div 
                        key={q.id || qIdx}
                        className="p-4 rounded-xl bg-[#020B07] border border-emerald-800/80 space-y-2.5"
                      >
                        <p className="text-xs font-bold text-white">
                          Q{qIdx + 1}: {q.question}
                        </p>

                        <div className="space-y-1.5">
                          {q.options.map((opt, optIdx) => (
                            <button
                              key={optIdx}
                              onClick={() => {
                                setSelectedAnswers(prev => ({ ...prev, [q.id]: optIdx }));
                                setRevealedAnswers(prev => ({ ...prev, [q.id]: true }));
                              }}
                              className={`w-full text-left p-2 rounded-lg text-xs font-mono transition-all border ${
                                isRevealed
                                  ? optIdx === q.correctIndex
                                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                                    : sel === optIdx
                                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                                    : 'border-emerald-950 text-emerald-500'
                                  : 'border-emerald-900/60 bg-emerald-950/40 hover:border-emerald-600 text-emerald-200'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>

                        {isRevealed && (
                          <p className="text-[11px] text-emerald-400/90 pt-1 leading-relaxed border-t border-emerald-950">
                            💡 {q.explanation}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

            {/* Right Page Footer Navigation */}
            <div className="pt-4 border-t border-emerald-900/60 flex items-center justify-between text-xs font-mono text-emerald-400">
              <span className="text-[11px] text-emerald-500">
                {Math.round(((currentChapterIdx + 1) / totalChapters) * 100)}% Complete
              </span>

              <button
                onClick={handleNextChapter}
                disabled={currentChapterIdx === totalChapters - 1}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg border transition-all ${
                  currentChapterIdx === totalChapters - 1
                    ? 'opacity-30 cursor-not-allowed border-transparent'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-black font-bold border-emerald-500 shadow-md shadow-emerald-600/30'
                }`}
              >
                <span>Turn Page in 3D</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* ===================================================================== */}
          {/* ANIMATED 3D TURNING PAGE OVERLAY (PAGE FLIP ANIMATION) */}
          {/* ===================================================================== */}
          <AnimatePresence>
            {isFlipping && (
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -180 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                style={{
                  transformOrigin: 'left center',
                  transformStyle: 'preserve-3d'
                }}
                className="absolute top-0 right-0 w-1/2 h-full z-40 rounded-r-2xl bg-gradient-to-r from-[#09261A] to-[#04160E] border-l border-emerald-700/80 shadow-2xl pointer-events-none flex items-center justify-center p-8"
              >
                <div className="text-center font-mono text-xs text-emerald-300 opacity-60">
                  <Sparkles className="w-6 h-6 mx-auto mb-2 text-emerald-400 animate-spin" />
                  <span>Flipping Page...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* CHAPTER TOC DRAWER MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showToc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#061F14] border border-emerald-700/80 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[80vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-emerald-900 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <List className="w-4 h-4 text-emerald-400" />
                  <span>Table of Contents ({totalChapters} Chapters)</span>
                </h3>
                <button
                  onClick={() => setShowToc(false)}
                  className="p-1 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-950"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto space-y-2 flex-1 pr-1">
                {book.chapters.map((ch, idx) => {
                  const isCur = idx === currentChapterIdx;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setCurrentChapterIdx(idx);
                        setShowToc(false);
                      }}
                      className={`w-full p-3 rounded-xl text-left border transition-all flex items-center justify-between text-xs font-mono ${
                        isCur
                          ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                          : 'bg-[#03140E] border-emerald-900/80 hover:border-emerald-600 text-emerald-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="opacity-70">Chapter 0{ch.number}:</span>
                        <span className="truncate">{ch.title}</span>
                      </div>
                      <span className="shrink-0 text-[10px] opacity-70">
                        {ch.readingTime || '15 min'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Hint */}
      <div className="relative z-20 text-center text-xs font-mono text-emerald-500/80 pt-2">
        <span>💡 Move your mouse to tilt the 3D book • Click "Turn Page in 3D" to flip chapters • All chapters 100% unlocked</span>
      </div>

    </div>
  );
};
