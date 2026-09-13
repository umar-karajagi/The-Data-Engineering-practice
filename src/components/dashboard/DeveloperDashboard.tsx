'use client';

import React from 'react';
import { 
  Trophy, 
  Flame, 
  Award, 
  Target, 
  CheckCircle2, 
  Circle,
  Database, 
  Terminal, 
  Zap, 
  BookOpen, 
  Layers, 
  Compass,
  GitBranch, 
  ArrowUpRight, 
  Sparkles,
  Calendar,
  AlertCircle,
  Clock,
  FileText,
  Plus,
  ArrowRight,
  ChevronRight,
  CheckSquare,
  Tag
} from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '../../content/projects/portfolio';
import { useUserStore } from '../../lib/userStore';
import { ContentRef, LinkedRef } from '../../types';
import { playSuccessChime } from '../../lib/sound';

export interface DeveloperDashboardProps {
  onNavigateTab?: (tab: string) => void;
  onNavigateTrack?: (trackId: string, tierNumber?: 1 | 2 | 3) => void;
  onNavigateBook?: (bookId: string) => void;
  onNavigateToContent?: (contentRef: ContentRef) => void;
  onNavigateToTarget?: (linkedRef: LinkedRef) => void;
  onNavigateCourse?: (courseId: string) => void;
  onNavigateLesson?: (courseId: string, lessonId: string) => void;
  onOpenQuickNote?: () => void;
  xp?: number;
  streak?: number;
  completedCheckpointsCount?: number;
}

export const DeveloperDashboard: React.FC<DeveloperDashboardProps> = ({
  onNavigateTab,
  onNavigateTrack,
  onNavigateBook,
  onNavigateToContent,
  onNavigateToTarget,
  onNavigateCourse,
  onNavigateLesson,
  onOpenQuickNote,
}) => {
  const { 
    user, 
    tracksProgress, 
    lastActiveItem, 
    todos, 
    notes, 
    badges, 
    toggleTodo 
  } = useUserStore();

  const xp = user.totalXp ?? user.xp ?? 450;
  const streak = user.streak ?? user.streakDays ?? 5;

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
        const rand = (w * 7 + d) % 9;
        if (rand === 1 || rand === 5) level = 4;
        else if (rand === 3 || rand === 7) level = 3;
        else if (rand === 2) level = 2;
        else if (rand === 0 || rand === 4) level = 1;
        days.push({ day: d, level });
      }
      weeks.push(days);
    }
    return weeks;
  };

  const heatmapWeeks = generateHeatmap();

  const getHeatmapColor = (l: number) => {
    switch (l) {
      case 4: return 'bg-track-warehousing';
      case 3: return 'bg-track-warehousing/70';
      case 2: return 'bg-track-warehousing/40';
      case 1: return 'bg-forge-surface';
      default: return 'bg-forge-bg';
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Urgent / today todos
  const urgentTodos = todos
    .filter(t => !t.done && !t.completed)
    .sort((a, b) => {
      const aDue = a.dueDate || '';
      const bDue = b.dueDate || '';
      if (!aDue) return 1;
      if (!bDue) return -1;
      return aDue.localeCompare(bDue);
    })
    .slice(0, 4);

  // Recent notes
  const recentNotes = notes.slice(0, 3);

  // Resume item handler
  const handleResumeLastActive = () => {
    if (!lastActiveItem) {
      if (onNavigateTab) onNavigateTab('catalog');
      else if (onNavigateTrack) onNavigateTrack('sql', 1);
      return;
    }

    if (lastActiveItem.type === 'course_lesson' && lastActiveItem.courseId && lastActiveItem.lessonId) {
      if (onNavigateLesson) {
        onNavigateLesson(lastActiveItem.courseId, lastActiveItem.lessonId);
      } else if (onNavigateTab) {
        onNavigateTab('catalog');
      }
    } else if (lastActiveItem.type === 'track_module' && lastActiveItem.trackId) {
      if (onNavigateTrack) {
        onNavigateTrack(lastActiveItem.trackId);
      } else if (onNavigateTab) {
        onNavigateTab('tracks');
      }
    } else if (lastActiveItem.type === 'library_chapter' && lastActiveItem.bookId) {
      if (onNavigateBook) {
        onNavigateBook(lastActiveItem.bookId);
      } else if (onNavigateTab) {
        onNavigateTab('vault');
      }
    } else {
      if (onNavigateTab) onNavigateTab('catalog');
    }
  };

  const trackKeys = [
    { id: 'sql', label: 'SQL Mastery', color: 'text-track-sql', border: 'hover:border-track-sql/60' },
    { id: 'python', label: 'Python for DE', color: 'text-track-python', border: 'hover:border-track-python/60' },
    { id: 'pyspark', label: 'PySpark Distributed', color: 'text-track-pyspark', border: 'hover:border-track-pyspark/60' },
    { id: 'databricks', label: 'Databricks Lakehouse', color: 'text-track-azure', border: 'hover:border-track-azure/60' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* 1. RESUME WHERE YOU LEFT OFF (HERO CARD) */}
      <div className="rounded-3xl bg-gradient-to-r from-forge-card via-forge-card to-forge-surface border border-forge-border p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2 py-0.5 rounded-md bg-track-sql/10 text-track-sql border border-track-sql/20 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {lastActiveItem ? 'Where You Left Off' : 'Recommended Starting Point'}
              </span>
              <span className="text-forge-muted hidden sm:inline">• One Unified Progress Record</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-forge-text tracking-tight">
                {lastActiveItem ? lastActiveItem.title : 'SQL Mastery: Tier 1 Foundation'}
              </h1>
              <p className="text-sm text-forge-secondary mt-1 font-mono">
                {lastActiveItem?.subtitle || 'Gated curriculum: Learn module concepts -> score ≥70% on diagnostic -> unlock next Tier.'}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-forge-muted pt-1">
              <span className="flex items-center gap-1 text-track-pyspark font-bold">
                <Flame className="w-3.5 h-3.5 fill-track-pyspark" />
                {streak} Day Streak
              </span>
              <span>•</span>
              <span className="text-forge-text font-bold">{xp} Total XP</span>
              <span>•</span>
              <span>Level {lvl.level} ({lvl.title})</span>
            </div>
          </div>

          {/* Action button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleResumeLastActive}
              className="px-6 py-3.5 rounded-2xl bg-track-sql text-white font-mono font-bold text-sm shadow-lg shadow-track-sql/20 hover:bg-track-sql/90 transition-all flex items-center gap-2 group"
            >
              <span>{lastActiveItem ? 'Resume Session' : 'Start Journey'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {onOpenQuickNote && (
              <button
                onClick={onOpenQuickNote}
                className="p-3.5 rounded-2xl bg-forge-bg hover:bg-forge-surface border border-forge-border text-forge-secondary hover:text-forge-text transition-colors"
                title="Quick Note"
              >
                <Plus className="w-4 h-4 text-track-sql" />
              </button>
            )}
          </div>

        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-track-sql/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. REPUTATION & LEVEL PROGRESSION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-forge-card border border-forge-border p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-forge-muted">
            <span>Reputation Rank</span>
            <span className="text-track-sql font-bold">Level {lvl.level} of 6</span>
          </div>
          <div className="text-lg font-extrabold text-forge-text">{lvl.title}</div>
          <div className="w-full bg-forge-surface rounded-full h-2 overflow-hidden mt-2">
            <div 
              className="bg-gradient-to-r from-track-sql to-track-warehousing h-full transition-all duration-500"
              style={{ width: `${Math.min(100, ((xp - lvl.base) / (lvl.nextXp - lvl.base)) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-forge-muted pt-1">
            <span>{xp} XP</span>
            <span>{lvl.nextXp - xp} XP to Next Lvl</span>
          </div>
        </div>

        <div className="rounded-2xl bg-forge-card border border-forge-border p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-forge-muted">
            <span>Daily Commitment</span>
            <span className="text-track-pyspark font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-track-pyspark" />
              {streak} Days
            </span>
          </div>
          <div className="text-lg font-extrabold text-forge-text">Active Engineering Cadence</div>
          <p className="text-xs text-forge-secondary font-mono">
            Practice daily in Tracks or Read Library books to maintain your multiplier.
          </p>
        </div>

        <div className="rounded-2xl bg-forge-card border border-forge-border p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-forge-muted">
            <span>Credentials & Badges</span>
            <span className="text-emerald-400 font-bold">{badges.filter(b => b.earned ?? b.unlocked).length} Unlocked</span>
          </div>
          <div className="text-lg font-extrabold text-forge-text">Verified Competency</div>
          <button
            onClick={() => onNavigateTab && onNavigateTab('certificates')}
            className="text-xs font-mono font-bold text-track-sql hover:underline flex items-center gap-1 pt-1"
          >
            <span>View Certificates & Badges</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2.5. FOUNDRY CATALOG & CAREER STUDIO SPOTLIGHT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          onClick={() => onNavigateTab && onNavigateTab('catalog')}
          className="group rounded-2xl bg-gradient-to-br from-forge-card to-forge-surface border border-forge-border hover:border-[#C8FF4A]/60 p-6 transition-all cursor-pointer relative overflow-hidden shadow-lg"
        >
          <div className="flex items-center justify-between gap-4">
            <span className="px-2.5 py-0.5 rounded bg-[#C8FF4A]/10 border border-[#C8FF4A]/30 text-[#C8FF4A] text-xs font-mono font-bold uppercase">
              30 Products Catalog
            </span>
            <ArrowRight className="w-4 h-4 text-forge-muted group-hover:text-[#C8FF4A] group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-xl font-mono font-bold text-forge-text group-hover:text-[#C8FF4A] transition-colors mt-3">
            Foundry Engineering Catalog
          </h3>
          <p className="text-xs text-forge-secondary mt-1 leading-relaxed">
            Explore 25 modular Skill Courses (SF-01 to SF-25) and 5 Career Paths (CP-01 to CP-05) synthesizing IIT/NIT/NPTEL curricula.
          </p>
          <div className="flex items-center gap-3 mt-4 text-xs font-mono text-forge-muted">
            <span className="text-[#C8FF4A]">✓ 100% Free Open Access</span>
            <span>•</span>
            <span>Zero Duplicated Requirements</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab && onNavigateTab('career-studio')}
          className="group rounded-2xl bg-gradient-to-br from-forge-card to-forge-surface border border-forge-border hover:border-[#56D8FF]/60 p-6 transition-all cursor-pointer relative overflow-hidden shadow-lg"
        >
          <div className="flex items-center justify-between gap-4">
            <span className="px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold uppercase">
              ResumeCraft & Career OS
            </span>
            <ArrowRight className="w-4 h-4 text-forge-muted group-hover:text-[#56D8FF] group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-xl font-mono font-bold text-forge-text group-hover:text-[#56D8FF] transition-colors mt-3">
            Career Studio & ATS Diagnostics
          </h3>
          <p className="text-xs text-forge-secondary mt-1 leading-relaxed">
            Resume workspace, job description matcher with course bridges, Google XYZ formula bullet improver, and STAR story interview bank.
          </p>
          <div className="flex items-center gap-3 mt-4 text-xs font-mono text-forge-muted">
            <span className="text-[#56D8FF]">✓ 100% Client-Side Privacy</span>
            <span>•</span>
            <span>Live ATS Scoring</span>
          </div>
        </div>
      </div>

      {/* 3. TRACKS PROGRESS MATRIX */}
      <div className="rounded-3xl bg-forge-card border border-forge-border p-6 sm:p-8 space-y-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono font-bold text-track-sql uppercase tracking-wider">
              Gated Skill Curricula
            </div>
            <h2 className="text-xl font-extrabold text-forge-text">Track Progression & Capstones</h2>
          </div>
          <button
            onClick={() => onNavigateTab && onNavigateTab('tracks')}
            className="px-4 py-2 rounded-xl bg-forge-bg hover:bg-forge-surface border border-forge-border text-xs font-mono font-bold text-forge-text hover:text-track-sql transition-colors self-start sm:self-auto flex items-center gap-1.5"
          >
            <span>Explore All Tracks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trackKeys.map((tk) => {
            const prog = tracksProgress[tk.id] || {
              trackId: tk.id,
              diagnosticTaken: false,
              unlockedTier: 1,
              completedModules: [],
              moduleRecords: {},
              capstoneRecords: {}
            };
            const currentTier = (prog.unlockedTier ?? prog.currentTier ?? 1) as 1 | 2 | 3;
            const tierNames = ['Foundation', 'Applied', 'Mastery'];
            const currentTierName = tierNames[currentTier - 1] || 'Foundation';
            const modulesCount = prog.completedModules.length;
            const hasCapstonePassed = Object.values(prog.capstoneRecords || {}).some(c => c?.passed);

            return (
              <div 
                key={tk.id}
                onClick={() => onNavigateTrack ? onNavigateTrack(tk.id, currentTier) : onNavigateTab && onNavigateTab('tracks')}
                className={`p-5 rounded-2xl bg-forge-bg border border-forge-border ${tk.border} transition-all cursor-pointer space-y-4 hover:shadow-md flex flex-col justify-between`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className={`font-bold uppercase ${tk.color}`}>{tk.id.toUpperCase()}</span>
                    <span className="px-2 py-0.5 rounded bg-forge-card border border-forge-border text-forge-secondary font-bold">
                      Tier {currentTier}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-forge-text leading-snug">{tk.label}</h3>
                  <p className="text-xs text-forge-secondary font-mono">
                    {currentTierName} • {modulesCount} modules done
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-forge-border/60">
                  <div className="flex justify-between text-[10px] font-mono text-forge-muted">
                    <span>Capstone:</span>
                    <span className={hasCapstonePassed ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                      {hasCapstonePassed ? 'Verified ✓' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-track-sql group">
                    <span>Enter Track</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. TWO-COLUMN: TODAY'S TODOS & QUICK-JUMP NOTES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Today / Overdue Todos Widget (6 cols) */}
        <div className="lg:col-span-6 rounded-3xl bg-forge-card border border-forge-border p-6 space-y-4 shadow-lg flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-track-sql" />
                <h2 className="text-sm font-mono font-bold text-forge-text uppercase tracking-wider">
                  Today & Overdue Todos
                </h2>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-forge-bg border border-forge-border text-forge-secondary font-bold">
                {todos.filter(t => !t.completed).length} active
              </span>
            </div>

            {urgentTodos.length === 0 ? (
              <div className="p-8 rounded-2xl bg-forge-bg border border-dashed border-forge-border text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs font-mono text-forge-text font-bold">All urgent tasks completed!</p>
                <p className="text-[11px] text-forge-secondary font-mono">
                  Add custom reminders linked to tracks or books.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {urgentTodos.map((todo) => {
                  const isOverdue = todo.dueDate ? todo.dueDate < todayStr : false;
                  const isToday = todo.dueDate ? todo.dueDate === todayStr : false;

                  return (
                    <div 
                      key={todo.id}
                      className="p-3.5 rounded-2xl bg-forge-bg border border-forge-border hover:border-forge-border/80 transition-all flex items-start gap-3"
                    >
                      <button
                        onClick={() => {
                          toggleTodo(todo.id);
                          playSuccessChime();
                        }}
                        className="mt-0.5 text-forge-muted hover:text-emerald-400 transition-colors"
                        title="Mark complete (+25 XP)"
                      >
                        <Circle className="w-4 h-4" />
                      </button>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-forge-text truncate">
                            {todo.text}
                          </p>
                          {isOverdue && (
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
                              Overdue
                            </span>
                          )}
                          {isToday && (
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                              Today
                            </span>
                          )}
                        </div>

                        {todo.linkedRef && (
                          <div 
                            onClick={() => onNavigateToTarget && onNavigateToTarget(todo.linkedRef!)}
                            className="inline-flex items-center gap-1 text-[10px] font-mono text-track-sql hover:underline cursor-pointer"
                          >
                            <Target className="w-3 h-3" />
                            <span>{todo.linkedRef.title ?? todo.linkedRef.label}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-forge-border flex items-center justify-between">
            <button
              onClick={() => onNavigateTab && onNavigateTab('todos')}
              className="text-xs font-mono font-bold text-track-sql hover:underline flex items-center gap-1"
            >
              <span>Manage All Todos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigateTab && onNavigateTab('todos')}
              className="px-3 py-1.5 rounded-xl bg-forge-bg hover:bg-forge-surface border border-forge-border text-xs font-mono font-bold text-forge-text flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-track-sql" />
              <span>Add Todo</span>
            </button>
          </div>
        </div>

        {/* Right: Quick-Jump Notes (6 cols) */}
        <div className="lg:col-span-6 rounded-3xl bg-forge-card border border-forge-border p-6 space-y-4 shadow-lg flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-track-python" />
                <h2 className="text-sm font-mono font-bold text-forge-text uppercase tracking-wider">
                  Latest Saved Notes
                </h2>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-forge-bg border border-forge-border text-forge-secondary font-bold">
                {notes.length} notes
              </span>
            </div>

            {recentNotes.length === 0 ? (
              <div className="p-8 rounded-2xl bg-forge-bg border border-dashed border-forge-border text-center space-y-2">
                <FileText className="w-8 h-8 text-forge-muted mx-auto" />
                <p className="text-xs font-mono text-forge-text font-bold">No notes captured yet</p>
                <p className="text-[11px] text-forge-secondary font-mono">
                  Capture architectural gotchas and interview takeaways from any module or book.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentNotes.map((note) => (
                  <div 
                    key={note.id}
                    className="p-3.5 rounded-2xl bg-forge-bg border border-forge-border hover:border-forge-border/80 transition-all space-y-2"
                  >
                    <p className="text-xs text-forge-text line-clamp-2 leading-relaxed">
                      {note.body}
                    </p>

                    <div className="flex items-center justify-between gap-2 flex-wrap text-[10px] font-mono">
                      {note.contentRef ? (
                        <button
                          onClick={() => onNavigateToContent && onNavigateToContent(note.contentRef!)}
                          className="px-2 py-0.5 rounded-md bg-track-sql/10 text-track-sql border border-track-sql/20 font-bold hover:underline flex items-center gap-1"
                        >
                          <Compass className="w-3 h-3" />
                          <span className="truncate max-w-[200px]">{note.contentRef.title ?? note.contentRef.label}</span>
                        </button>
                      ) : (
                        <span className="text-forge-muted font-bold">General Note</span>
                      )}

                      <div className="flex items-center gap-1">
                        {note.tags.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="px-1.5 py-0.2 rounded bg-forge-card border border-forge-border text-forge-secondary">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-forge-border flex items-center justify-between">
            <button
              onClick={() => onNavigateTab && onNavigateTab('notes')}
              className="text-xs font-mono font-bold text-track-sql hover:underline flex items-center gap-1"
            >
              <span>Browse All Notes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {onOpenQuickNote && (
              <button
                onClick={onOpenQuickNote}
                className="px-3 py-1.5 rounded-xl bg-forge-bg hover:bg-forge-surface border border-forge-border text-xs font-mono font-bold text-forge-text flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-track-sql" />
                <span>+ Take Note</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* 5. GITHUB-STYLE ACTIVITY HEATMAP */}
      <div className="bg-forge-card border border-forge-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="space-y-0.5">
            <h2 className="text-sm font-mono font-bold text-forge-text uppercase tracking-wider">
              Engineering Practice Activity
            </h2>
            <p className="text-xs text-forge-secondary font-mono">16-week query execution and diagnostic attempt ledger</p>
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

      {/* 6. MASTERY RADAR & BADGES SHELF */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SVG Radar Chart of Topic Mastery (5 cols) */}
        <div className="lg:col-span-5 bg-forge-card border border-forge-border rounded-3xl p-6 space-y-4 shadow-lg">
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
        <div className="lg:col-span-7 bg-forge-card border border-forge-border rounded-3xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-track-pyspark" />
              <h2 className="text-sm font-mono font-bold text-forge-text uppercase tracking-wider">
                Earned Badges & Honors
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('certificates')}
              className="text-xs font-mono font-bold text-track-sql hover:underline"
            >
              All {badges.length} Badges →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badges.map((b) => {
              const isUnlocked = b.earned ?? b.unlocked;
              return (
                <div
                  key={b.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                    isUnlocked ? 'bg-forge-bg border-forge-border' : 'bg-forge-bg/30 border-forge-border/40 opacity-40'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isUnlocked ? 'bg-forge-card border border-forge-border text-track-sql' : 'bg-forge-card text-forge-muted'
                  }`}>
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-bold text-forge-text">{b.name ?? b.title}</h3>
                      {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-forge-secondary mt-0.5 leading-snug">{b.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 7. GUIDED PORTFOLIO BLUEPRINTS */}
      <div className="bg-forge-card border border-forge-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-track-azure uppercase">
              <GitBranch className="w-4 h-4" />
              Enterprise Blueprint Catalog
            </div>
            <h2 className="text-xl font-extrabold text-forge-text">Production Architectural Blueprints</h2>
          </div>
          <span className="text-xs font-mono text-forge-muted hidden sm:inline">Production Blueprints</span>
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
