'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Bookmark, 
  Rotate3d, 
  Maximize2, 
  Minimize2, 
  Terminal, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Share2, 
  Layers, 
  Check, 
  Compass,
  Volume2,
  BookMarked
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
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [isOrbitMode, setIsOrbitMode] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(16);
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('serif');
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const currentChapter = book.chapters[currentChapterIdx] || book.chapters[0];
  const totalChapters = book.chapters.length;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleNextChapter = () => {
    if (currentChapterIdx < totalChapters - 1 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('next');
      setTimeout(() => {
        setCurrentChapterIdx(prev => prev + 1);
        setIsFlipping(false);
        if (onAddXP) onAddXP(20);
      }, 550);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIdx > 0 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('prev');
      setTimeout(() => {
        setCurrentChapterIdx(prev => prev - 1);
        setIsFlipping(false);
      }, 550);
    }
  };

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
              className={`px-2 py-1 rounded font-serif ${fontFamily === 'serif' ? 'bg-emerald-500/20 text-emerald-300' : 'text-emerald-500'}`}
            >
              Serif
            </button>
            <button
              onClick={() => setFontFamily('sans')}
              className={`px-2 py-1 rounded font-sans ${fontFamily === 'sans' ? 'bg-emerald-500/20 text-emerald-300' : 'text-emerald-500'}`}
            >
              Sans
            </button>
            <button
              onClick={() => setFontFamily('mono')}
              className={`px-2 py-1 rounded font-mono ${fontFamily === 'mono' ? 'bg-emerald-500/20 text-emerald-300' : 'text-emerald-500'}`}
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
        className="relative z-10 flex-1 flex items-center justify-center py-6 sm:py-10 [perspective:1600px]"
      >
        <motion.div
          animate={{
            rotateX: -mousePos.y * 14,
            rotateY: mousePos.x * 18,
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative w-full max-w-5xl aspect-[1.45/1] sm:aspect-[1.55/1] rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.85)] flex"
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
          {/* LEFT PAGE (PAGE N - OVERVIEW, ARCHITECTURE, TAKEAWAYS) */}
          {/* ===================================================================== */}
          <div 
            className="w-1/2 h-full rounded-l-2xl p-6 sm:p-10 flex flex-col justify-between overflow-y-auto border-r border-emerald-950/60 relative"
            style={{
              background: 'linear-gradient(135deg, #09261A 0%, #061F14 100%)',
              color: '#ECFDF5'
            }}
          >
            <div>
              {/* Chapter Header */}
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-4 pb-2 border-b border-emerald-900/60">
                <span className="font-bold uppercase tracking-wider">
                  Chapter {currentChapter.number} of {totalChapters}
                </span>
                <span className="flex items-center gap-1 text-emerald-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{currentChapter.readingTime || '15 min'}</span>
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {currentChapter.title}
              </h1>

              {/* Core Concept Pills */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                {(book.keyTakeaways?.slice(0, 3) || book.coreConcepts?.slice(0, 3) || ['Distributed Systems', 'Production Grade', 'High Throughput']).map((tag, tIdx) => (
                  <span 
                    key={tIdx}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                  >
                    ★ {tag}
                  </span>
                ))}
              </div>

              {/* Overview Synopsis */}
              <div className={`mt-6 text-xs sm:text-sm text-emerald-100/90 leading-relaxed space-y-3 ${
                fontFamily === 'serif' ? 'font-serif' : fontFamily === 'mono' ? 'font-mono' : 'font-sans'
              }`}>
                <p>
                  {currentChapter.summary || 'In this milestone chapter, we dissect the foundational principles of building production data pipelines, exploring memory trade-offs, fault tolerance, and query execution plans.'}
                </p>
                <p className="text-emerald-200/80">
                  Mastering this architecture equips data engineers to handle petabyte-scale transformations with zero downtime and strict data contracts.
                </p>
              </div>

            </div>

            {/* Left Page Footer Navigation */}
            <div className="pt-4 border-t border-emerald-900/60 flex items-center justify-between text-xs font-mono text-emerald-400">
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
          {/* RIGHT PAGE (PAGE N+1 - CODE BENCHMARK & HANDS-ON WORKBENCH) */}
          {/* ===================================================================== */}
          <div 
            className="w-1/2 h-full rounded-r-2xl p-6 sm:p-10 flex flex-col justify-between overflow-y-auto relative"
            style={{
              background: 'linear-gradient(135deg, #061F14 0%, #09261A 100%)',
              color: '#ECFDF5'
            }}
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-4 pb-2 border-b border-emerald-900/60">
                <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Production Code & Lab</span>
                </span>
                <span className="text-[11px] text-emerald-500 font-bold">
                  Page {currentChapter.number * 2}
                </span>
              </div>

              {/* Code Snippet Box */}
              <div className="rounded-xl bg-[#020B07] border border-emerald-800/80 p-4 font-mono text-xs shadow-inner">
                <div className="flex items-center justify-between text-[11px] text-emerald-500 mb-2 border-b border-emerald-900/60 pb-1.5">
                  <span>pipeline_executor.py</span>
                  <span className="text-emerald-400">Python 3.11</span>
                </div>
                <pre className="text-emerald-300 overflow-x-auto leading-relaxed">
{`# ${currentChapter.title}
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
              <div className="mt-6 p-4 rounded-xl bg-emerald-950/70 border border-emerald-800/80 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Chapter Exercise Available
                  </h4>
                  <p className="text-[11px] text-emerald-300 mt-0.5">
                    Test your understanding with company-tagged practice questions.
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
                transition={{ duration: 0.55, ease: 'easeInOut' }}
                style={{
                  transformOrigin: 'left center',
                  transformStyle: 'preserve-3d'
                }}
                className="absolute top-0 right-0 w-1/2 h-full z-40 rounded-r-2xl bg-gradient-to-r from-[#09261A] to-[#04160E] border-l border-emerald-700/80 shadow-2xl pointer-events-none flex items-center justify-center p-8"
              >
                <div className="text-center font-mono text-xs text-emerald-300 opacity-60">
                  <Sparkles className="w-6 h-6 mx-auto mb-2 text-emerald-400 animate-spin" />
                  <span>Turning Page...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>

      {/* Bottom Hint */}
      <div className="relative z-20 text-center text-xs font-mono text-emerald-500/80 pt-2">
        <span>💡 Move your mouse to tilt the 3D book in real-time perspective • Click "Turn Page in 3D" to flip chapters</span>
      </div>

    </div>
  );
};
