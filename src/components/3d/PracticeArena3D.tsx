'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PRACTICE_PROBLEMS, 
  PracticeCategory, 
  PracticeModeNumber,
  MODE_CONFIG 
} from '../../content/practice/practiceProblems';
import { 
  Star, 
  Award, 
  Trophy, 
  CheckCircle2, 
  Layers, 
  Terminal, 
  Flame, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useUserStore } from '../../lib/userStore';

interface PracticeArena3DProps {
  onSelectProblem?: (problemId: string) => void;
}

export const PracticeArena3D: React.FC<PracticeArena3DProps> = ({ onSelectProblem }) => {
  const { user } = useUserStore();
  const [selectedCategory, setSelectedCategory] = useState<PracticeCategory>('SQL');
  const [selectedMode, setSelectedMode] = useState<PracticeModeNumber>(1);

  // Exact 5 topics from practiceProblems.ts
  const categories: PracticeCategory[] = ['SQL', 'Python', 'DSA', 'PySpark', 'Data Modeling'];
  const modes: PracticeModeNumber[] = [1, 2, 3, 4, 5];

  const categoryIcons: Record<PracticeCategory, string> = {
    'SQL': '🗄️',
    'Python': '🐍',
    'DSA': '⚡',
    'PySpark': '🔥',
    'Data Modeling': '📐'
  };

  // Filter problems for active category & mode (20 per mode)
  const currentProblems = PRACTICE_PROBLEMS.filter(
    p => p.category === selectedCategory && p.mode === selectedMode
  );

  // Star-rank ladder from Section 5 of the Master Prompt
  const starLadder = [
    { stars: '⭐', solved: 10, title: 'Novice Data Engineer', color: 'text-amber-600' },
    { stars: '⭐⭐', solved: 25, title: 'Junior Practitioner', color: 'text-slate-400' },
    { stars: '⭐⭐⭐', solved: 50, title: 'Mid-Level Data Engineer', color: 'text-amber-400' },
    { stars: '⭐⭐⭐⭐', solved: 75, title: 'Senior Pipeline Architect', color: 'text-cyan-400' },
    { stars: '⭐⭐⭐⭐⭐', solved: 100, title: 'Staff / Principal Master', color: 'text-purple-400' }
  ];

  return (
    <div className="relative w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl p-4 sm:p-8 overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-xs font-bold font-mono">
            <Trophy className="w-3.5 h-3.5" />
            <span>THE 500-QUESTION ARENA (5 TOPICS × 5 MODES)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
            The Coding Arena: 5 Pillars & Concentric Rings
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Exactly 500 company-tagged challenges. 100 problems per topic pillar divided into 5 progressive mode rings (20 questions each).
          </p>
        </div>

        {/* 5-Star Rank Badge Summary */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
          {starLadder.map((tier, idx) => (
            <div 
              key={idx} 
              className="px-2.5 py-1 rounded-xl text-center font-mono text-[10px]"
              title={`${tier.title} (${tier.solved}+ Solved)`}
            >
              <div className="text-xs">{tier.stars}</div>
              <div className="text-slate-500 font-bold">{tier.solved}p</div>
            </div>
          ))}
        </div>
      </div>

      {/* 5 Topic Pillars Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-6">
        {categories.map(cat => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white border-brand-blue shadow-lg shadow-brand-blue/20'
                  : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-400 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span>{categoryIcons[cat]}</span>
                <span className="text-slate-400">100 Problems</span>
              </div>
              <div className="text-xs sm:text-sm font-bold mt-1 truncate">{cat}</div>
            </button>
          );
        })}
      </div>

      {/* 5 Concentric Mode Rings */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-slate-200 dark:border-slate-800">
        {modes.map(modeNum => {
          const isSelected = selectedMode === modeNum;
          const config = MODE_CONFIG[modeNum];
          return (
            <button
              key={modeNum}
              onClick={() => setSelectedMode(modeNum)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-white'
              }`}
            >
              Ring {modeNum}: {config.name} ({config.marks} Marks • 20 Problems)
            </button>
          );
        })}
      </div>

      {/* Problems Grid (20 problems in active mode) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
        {currentProblems.map((prob, idx) => (
          <div
            key={prob.id}
            onClick={() => onSelectProblem && onSelectProblem(prob.id)}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 hover:border-brand-blue/50 hover:bg-brand-blue/5 transition-all flex items-center justify-between gap-3 cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-brand-blue">
                {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                    {prob.company}
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                    prob.difficulty === 'Easy' ? 'text-emerald-500 bg-emerald-500/10' :
                    prob.difficulty === 'Medium' ? 'text-amber-500 bg-amber-500/10' : 'text-rose-500 bg-rose-500/10'
                  }`}>
                    {prob.difficulty}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold truncate text-slate-900 dark:text-slate-100 group-hover:text-brand-blue mt-0.5">
                  {prob.title}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 font-mono text-xs text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                +{prob.marks} XP
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
