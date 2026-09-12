'use client';

import React from 'react';
import { 
  Trophy, 
  Flame, 
  Award, 
  Target, 
  CheckCircle2, 
  Database, 
  Terminal, 
  Zap, 
  BookOpen, 
  Layers, 
  Compass,
  GitBranch,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '../../content/projects/portfolio';
import { FOUNDATIONAL_BOOKS } from '../../content/books';

export const DeveloperDashboard: React.FC<{
  xp: number;
  streak: number;
  completedCheckpointsCount: number;
}> = ({ xp = 450, streak = 5, completedCheckpointsCount = 3 }) => {
  
  // Calculate level
  const getLevelInfo = (currentXp: number) => {
    if (currentXp < 300) return { level: 1, title: 'Data Apprentice', nextXp: 300, base: 0 };
    if (currentXp < 800) return { level: 2, title: 'Pipeline Wrangler', nextXp: 800, base: 300 };
    if (currentXp < 1600) return { level: 3, title: 'Query Whisperer', nextXp: 1600, base: 800 };
    if (currentXp < 2600) return { level: 4, title: 'Spark Commander', nextXp: 2600, base: 1600 };
    if (currentXp < 4000) return { level: 5, title: 'Lakehouse Architect', nextXp: 4000, base: 2600 };
    return { level: 6, title: 'Principal Data Architect', nextXp: 6000, base: 4000 };
  };

  const lvl = getLevelInfo(xp);

  // Generate GitHub-style activity heatmap (16 weeks x 7 days)
  const generateHeatmap = () => {
    const weeks = [];
    for (let w = 15; w >= 0; w--) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        let level = 0;
        const rand = Math.random();
        if (rand > 0.85) level = 4;
        else if (rand > 0.65) level = 3;
        else if (rand > 0.45) level = 2;
        else if (rand > 0.25) level = 1;
        days.push({ day: d, level });
      }
      weeks.push(days);
    }
    return weeks;
  };

  const heatmapWeeks = generateHeatmap();

  const getHeatmapColor = (lvl: number) => {
    switch (lvl) {
      case 4: return 'bg-track-warehousing';
      case 3: return 'bg-track-warehousing/70';
      case 2: return 'bg-track-warehousing/40';
      case 1: return 'bg-forge-surface';
      default: return 'bg-forge-bg';
    }
  };

  const badges = [
    { id: 'b1', title: 'DuckDB Query Virtuoso', desc: 'Ran first in-browser analytical SQL query with zero spills', unlocked: true, icon: Database, color: 'text-track-sql' },
    { id: 'b2', title: 'Kimball Apprentice', desc: 'Mastered SCD Type 2 point-in-time joins', unlocked: true, icon: Layers, color: 'text-track-warehousing' },
    { id: 'b3', title: 'Catalyst Tuner', desc: 'Identified and mitigated distributed data skew', unlocked: true, icon: Zap, color: 'text-track-pyspark' },
    { id: 'b4', title: 'Literature Scholar', desc: 'Read 3+ foundational book chapters', unlocked: false, icon: BookOpen, color: 'text-track-python' },
    { id: 'b5', title: 'Principal Architect', desc: 'Reached Level 5 in DataForge reputation', unlocked: false, icon: Trophy, color: 'text-track-architecture' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Level & Reputation Banner */}
      <div className="rounded-3xl bg-forge-card border border-forge-border p-8 shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-track-sql/10 border border-track-sql/30 flex items-center justify-center text-track-sql shadow-lg">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-forge-bg text-track-sql border border-forge-border">
                Level {lvl.level} DE
              </span>
              <span className="text-xs text-track-pyspark font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-track-pyspark" />
                {streak} Day Streak
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-forge-text mt-1">{lvl.title}</h1>
            <p className="text-xs text-forge-secondary font-mono mt-0.5">Total Reputation: {xp} XP</p>
          </div>
        </div>

        {/* Level XP Target */}
        <div className="bg-forge-bg p-5 rounded-2xl border border-forge-border space-y-2 min-w-[280px]">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-forge-secondary">Progress to Lvl {lvl.level + 1}</span>
            <span className="text-track-sql font-bold">{xp} / {lvl.nextXp} XP</span>
          </div>
          <div className="w-full bg-forge-surface rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-track-sql to-track-warehousing h-full transition-all duration-500"
              style={{ width: `${Math.min(100, ((xp - lvl.base) / (lvl.nextXp - lvl.base)) * 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-forge-muted font-mono text-right">
            {lvl.nextXp - xp} XP to level up
          </p>
        </div>
      </div>

      {/* GitHub-Style Activity Heatmap */}
      <div className="bg-forge-card border border-forge-border rounded-2xl p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-sm font-mono font-bold text-forge-text uppercase tracking-wider">
              Engineering Practice Activity
            </h2>
            <p className="text-xs text-forge-secondary">Daily commit and query execution ledger</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-forge-muted">
            <span>Less</span>
            <span className="w-3 h-3 rounded bg-forge-bg border border-forge-border" />
            <span className="w-3 h-3 rounded bg-forge-surface" />
            <span className="w-3 h-3 rounded bg-track-warehousing/40" />
            <span className="w-3 h-3 rounded bg-track-warehousing/70" />
            <span className="w-3 h-3 rounded bg-track-warehousing" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pt-2">
          <div className="flex gap-1.5 min-w-[700px]">
            {heatmapWeeks.map((week, widx) => (
              <div key={widx} className="flex flex-col gap-1.5">
                {week.map((day, didx) => (
                  <div
                    key={didx}
                    className={`w-3.5 h-3.5 rounded-sm border border-forge-border/40 transition-colors ${getHeatmapColor(day.level)}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2-Column: Radar Chart + Badges Shelf */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SVG Radar Chart of Topic Mastery (5 cols) */}
        <div className="lg:col-span-5 bg-forge-card border border-forge-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold text-forge-text uppercase tracking-wider">
              Mastery Radar
            </h2>
            <span className="text-xs font-mono text-track-sql">5 Disciplines</span>
          </div>

          <div className="py-4 flex flex-col items-center justify-center">
            <svg viewBox="0 0 300 260" className="w-full max-w-[260px] h-auto">
              <polygon points="150,30 264,113 220,247 80,247 36,113" fill="none" stroke="var(--border-color)" strokeWidth="1" />
              <polygon points="150,60 231,119 200,215 100,215 69,119" fill="none" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3,3" />
              <polygon points="150,90 198,125 180,183 120,183 102,125" fill="none" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3,3" />
              
              <line x1="150" y1="150" x2="150" y2="30" stroke="var(--border-color)" strokeWidth="1" />
              <line x1="150" y1="150" x2="264" y2="113" stroke="var(--border-color)" strokeWidth="1" />
              <line x1="150" y1="150" x2="220" y2="247" stroke="var(--border-color)" strokeWidth="1" />
              <line x1="150" y1="150" x2="80" y2="247" stroke="var(--border-color)" strokeWidth="1" />
              <line x1="150" y1="150" x2="36" y2="113" stroke="var(--border-color)" strokeWidth="1" />

              <polygon 
                points="150,45 240,118 205,230 90,225 48,115" 
                fill="rgba(59, 130, 246, 0.2)" 
                stroke="var(--track-sql)" 
                strokeWidth="2" 
              />

              <circle cx="150" cy="45" r="4" fill="var(--track-sql)" />
              <circle cx="240" cy="118" r="4" fill="var(--track-python)" />
              <circle cx="205" cy="230" r="4" fill="var(--track-pyspark)" />
              <circle cx="90" cy="225" r="4" fill="var(--track-warehousing)" />
              <circle cx="48" cy="115" r="4" fill="var(--track-architecture)" />

              <text x="150" y="20" textAnchor="middle" fill="var(--track-sql)" fontSize="10" fontFamily="monospace" fontWeight="bold">SQL</text>
              <text x="275" y="115" textAnchor="start" fill="var(--track-python)" fontSize="10" fontFamily="monospace" fontWeight="bold">Python</text>
              <text x="225" y="258" textAnchor="middle" fill="var(--track-pyspark)" fontSize="10" fontFamily="monospace" fontWeight="bold">PySpark</text>
              <text x="75" y="258" textAnchor="middle" fill="var(--track-warehousing)" fontSize="10" fontFamily="monospace" fontWeight="bold">Lakehouse</text>
              <text x="20" y="115" textAnchor="end" fill="var(--track-architecture)" fontSize="10" fontFamily="monospace" fontWeight="bold">Arch</text>
            </svg>
          </div>
        </div>

        {/* Recent Badges Shelf (7 cols) */}
        <div className="lg:col-span-7 bg-forge-card border border-forge-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-track-pyspark" />
              <h2 className="text-sm font-mono font-bold text-forge-text uppercase tracking-wider">
                Recent Badges & Honors
              </h2>
            </div>
            <span className="text-xs font-mono text-forge-muted">
              {badges.filter(b => b.unlocked).length} of {badges.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badges.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                    b.unlocked ? 'bg-forge-bg border-forge-border' : 'bg-forge-bg/30 border-forge-border/40 opacity-40'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    b.unlocked ? 'bg-forge-card border border-forge-border ' + b.color : 'bg-forge-card text-forge-muted'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-bold text-forge-text">{b.title}</h3>
                      {b.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-forge-secondary mt-0.5 leading-snug">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Guided Portfolio Projects Showcase */}
      <div className="bg-forge-card border border-forge-border rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-track-azure uppercase">
              <GitBranch className="w-4 h-4" />
              Module 3: End-to-End Guided Portfolio Projects
            </div>
            <h2 className="text-lg font-bold text-forge-text">Production Architectural Blueprints</h2>
          </div>
          <span className="text-xs font-mono text-forge-muted">Production Blueprints</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PORTFOLIO_PROJECTS.map((proj) => (
            <div key={proj.id} className="p-5 rounded-2xl bg-forge-bg border border-forge-border space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-forge-muted">
                  <span className="uppercase font-bold text-track-sql">{proj.track}</span>
                  <span className="text-forge-text font-bold">{proj.difficulty}</span>
                </div>
                <h3 className="text-sm font-bold text-forge-text leading-snug">{proj.title}</h3>
                <p className="text-xs text-forge-secondary font-sans leading-relaxed line-clamp-3">
                  {proj.businessScenario}
                </p>
              </div>

              <div className="pt-2 border-t border-forge-border flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {proj.technologies.slice(0, 2).map((t, idx) => (
                    <span key={idx} className="text-[9px] font-mono px-2 py-0.5 rounded bg-forge-card border border-forge-border text-forge-secondary">
                      {t}
                    </span>
                  ))}
                </div>
                <a
                  href={proj.githubBlueprint}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono font-bold text-track-sql hover:underline flex items-center gap-1"
                >
                  <span>Repo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
