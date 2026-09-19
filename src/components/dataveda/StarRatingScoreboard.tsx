'use client';

import React from 'react';
import { Star, Trophy, Award, Zap, Database, Terminal, GitBranch, Cpu, Layers } from 'lucide-react';
import { 
  PracticeCategory, 
  STAR_TIERS, 
  getTopicStats, 
  getGrandStats 
} from '../../content/practice/practiceProblems';

interface StarRatingScoreboardProps {
  solvedProblemIds: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CATEGORY_ICONS: Record<PracticeCategory, React.ElementType> = {
  'SQL': Database,
  'Python': Terminal,
  'DSA': GitBranch,
  'PySpark': Cpu,
  'Data Modeling': Layers
};

export const StarRatingScoreboard: React.FC<StarRatingScoreboardProps> = ({
  solvedProblemIds,
  selectedCategory,
  onSelectCategory
}) => {
  const grandStats = getGrandStats(solvedProblemIds);
  const categories: PracticeCategory[] = ['SQL', 'Python', 'DSA', 'PySpark', 'Data Modeling'];

  return (
    <div className="mb-8 space-y-4">
      {/* Overall Grand Header Stats */}
      <div className="bg-gradient-to-r from-brand-blue/10 via-brand-purple/10 to-emerald-500/10 dark:from-brand-blue/20 dark:via-brand-purple/20 dark:to-emerald-500/20 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-sm">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                  Engineering Mastery Rating
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                  HackerRank & LeetCode Standard
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Earn marks by solving problems across 5 difficulty modes. Cross rating milestones to unlock 1 to 5 Star ratings.
              </p>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap">
            <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Marks</div>
              <div className="text-base sm:text-lg font-black text-brand-blue font-mono">
                {grandStats.totalScore.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ 15,000</span>
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Stars Earned</div>
              <div className="text-base sm:text-lg font-black text-amber-500 flex items-center justify-center gap-1 font-mono">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{grandStats.totalStars}</span>
                <span className="text-xs font-normal text-slate-400">/ 25</span>
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Problems Solved</div>
              <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {grandStats.totalSolved} <span className="text-xs font-normal text-slate-400">/ 500</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Topic Star Rating Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {categories.map((cat) => {
          const stats = getTopicStats(cat, solvedProblemIds);
          const IconComponent = CATEGORY_ICONS[cat] || Terminal;
          const isSelected = selectedCategory === cat;

          return (
            <div
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={
                "p-4 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between " +
                (isSelected
                  ? "bg-white dark:bg-slate-900 border-brand-blue ring-2 ring-brand-blue/20 shadow-md scale-[1.02] "
                  : "bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs ")
              }
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={
                      "p-1.5 rounded-lg " +
                      (isSelected ? "bg-brand-blue text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400")
                    }>
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {cat}
                    </span>
                  </div>

                  {/* Solved Count Badge */}
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {stats.solvedCount}/100
                  </span>
                </div>

                {/* Stars Display (1 to 5 Stars) */}
                <div className="flex items-center gap-1 my-2">
                  {[1, 2, 3, 4, 5].map((starIdx) => {
                    const isEarned = starIdx <= stats.stars;
                    return (
                      <Star
                        key={starIdx}
                        className={
                          "w-4 h-4 transition-transform " +
                          (isEarned 
                            ? "fill-amber-400 text-amber-500 drop-shadow-xs scale-105" 
                            : "text-slate-200 dark:text-slate-800 fill-slate-100 dark:fill-slate-800/40")
                        }
                      />
                    );
                  })}
                  <span className="text-xs font-bold font-mono ml-1 text-slate-700 dark:text-slate-300">
                    {stats.stars > 0 ? stats.stars + "★" : "0★"}
                  </span>
                </div>
              </div>

              {/* Score & Progress Bar */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] mb-1.5 font-medium">
                  <span className="text-slate-600 dark:text-slate-400 font-mono">
                    <strong className="text-slate-900 dark:text-slate-100 font-bold">{stats.totalScore}</strong> pts
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {stats.nextTier ? ("Next: " + stats.nextTier.minScore + " pts") : "Max Rating!"}
                  </span>
                </div>

                {/* Mini Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-brand-blue rounded-full transition-all duration-500"
                    style={{ width: Math.min(100, Math.max(stats.totalScore > 0 ? 5 : 0, (stats.totalScore / 1000) * 100)) + "%" }}
                  />
                </div>

                {/* Badge Title */}
                <div className="mt-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                  {stats.currentTier ? stats.currentTier.badgeName : 'Unranked (Solve to rank)'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
