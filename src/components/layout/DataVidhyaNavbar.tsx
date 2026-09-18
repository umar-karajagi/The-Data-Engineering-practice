'use client';

import React, { useState } from 'react';
import { useUserStore } from '@/lib/userStore';
import { useTheme } from '@/lib/theme';
import { 
  ChevronDown, 
  Flame, 
  Trophy, 
  Sun, 
  Moon, 
  BookOpen, 
  Briefcase, 
  Code2, 
  Layers, 
  Terminal, 
  Database, 
  Cloud, 
  Menu, 
  X, 
  Sparkles, 
  CheckSquare, 
  Award, 
  User,
  GraduationCap,
  Play
} from 'lucide-react';

interface DataVidhyaNavbarProps {
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  onOpenAssessment: () => void;
  onOpenHeroVideo?: () => void;
}

export const DataVidhyaNavbar: React.FC<DataVidhyaNavbarProps> = ({
  activeTab,
  onNavigateTab,
  onOpenAssessment,
  onOpenHeroVideo
}) => {
  const { user } = useUserStore();
  const { theme, toggleTheme } = useTheme();

  const [isLearnOpen, setIsLearnOpen] = useState<boolean>(false);
  const [isPracticeOpen, setIsPracticeOpen] = useState<boolean>(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const streak = user?.streakDays || 5;
  const xp = user?.xp || 450;

  const handleLinkClick = (tab: string) => {
    onNavigateTab(tab);
    setIsLearnOpen(false);
    setIsPracticeOpen(false);
    setIsResourcesOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col justify-center border-b border-[#262626] bg-[#0C0C0C]/85 backdrop-blur-md text-white font-sans">
      
      {/* 1. Announcement Banner */}
      <section className="bg-[#0050FF] py-1.5 px-4 text-center text-xs tracking-tight">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <p className="text-white font-medium truncate">
            DataVidhya 2.0 • 100% Free Open Access Edition • Top Curated Video Masterclasses
          </p>
          <button 
            onClick={onOpenAssessment}
            className="inline-flex items-center gap-1 font-bold text-white hover:underline shrink-0"
          >
            <span>Take Free Assessment</span>
            <span className="text-[10px]">→</span>
          </button>
        </div>
      </section>

      {/* 2. Main Navbar */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
        >
          {/* DataVidhya Geometric Icon */}
          <div className="w-8 h-8 rounded-lg bg-[#0050FF] flex items-center justify-center text-white shadow-md shadow-[#0050FF]/25 group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" y1="22" x2="4" y2="15" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold tracking-tight text-white group-hover:text-[#0050FF] transition-colors">
              Data Vidhya
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              FREE
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium">
          
          {/* LEARN DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => {
                setIsLearnOpen(!isLearnOpen);
                setIsPracticeOpen(false);
                setIsResourcesOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition-colors"
            >
              <span>Learn</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isLearnOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLearnOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 p-2 bg-[#141414] border border-[#262626] rounded-xl shadow-2xl space-y-1 animate-fadeIn">
                <button
                  onClick={() => handleLinkClick('home')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-neutral-800 flex items-start gap-2.5 group transition-colors"
                >
                  <GraduationCap className="w-4 h-4 text-[#0050FF] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-[#0050FF]">Career Tracks</div>
                    <div className="text-[11px] text-neutral-400">Data Engineer, Analytics Engineer, Data Analyst</div>
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('catalog')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-neutral-800 flex items-start gap-2.5 group transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-emerald-400">All 28+ Courses</div>
                    <div className="text-[11px] text-neutral-400">SQL, Python, Spark, Airflow, dbt, Snowflake, Kafka</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    handleLinkClick('home');
                    if (onOpenHeroVideo) onOpenHeroVideo();
                  }}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-neutral-800 flex items-start gap-2.5 group transition-colors"
                >
                  <Play className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-amber-400">Real-World Projects (23)</div>
                    <div className="text-[11px] text-neutral-400">Uber GCP, Spotify AWS, YouTube ETL & Kafka</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* PRACTICE DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => {
                setIsPracticeOpen(!isPracticeOpen);
                setIsLearnOpen(false);
                setIsResourcesOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition-colors"
            >
              <span>Practice</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isPracticeOpen ? 'rotate-180' : ''}`} />
            </button>

            {isPracticeOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 p-2 bg-[#141414] border border-[#262626] rounded-xl shadow-2xl space-y-1 animate-fadeIn">
                <button
                  onClick={() => handleLinkClick('tracks')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-neutral-800 flex items-start gap-2.5 group transition-colors"
                >
                  <Terminal className="w-4 h-4 text-[#0050FF] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-[#0050FF]">850+ Coding Problems</div>
                    <div className="text-[11px] text-neutral-400">In-browser DuckDB WASM SQL & Python practice</div>
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('roadmap')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-neutral-800 flex items-start gap-2.5 group transition-colors"
                >
                  <Layers className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-purple-400">Data Architecture Roadmap</div>
                    <div className="text-[11px] text-neutral-400">Interactive systems design milestones</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* RESOURCES DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => {
                setIsResourcesOpen(!isResourcesOpen);
                setIsLearnOpen(false);
                setIsPracticeOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition-colors"
            >
              <span>Resources</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
            </button>

            {isResourcesOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 p-2 bg-[#141414] border border-[#262626] rounded-xl shadow-2xl space-y-1 animate-fadeIn">
                <button
                  onClick={() => handleLinkClick('vault')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-neutral-800 flex items-start gap-2.5 group transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-emerald-400">The Vault (Book Library)</div>
                    <div className="text-[11px] text-neutral-400">Complete PDFs & technical textbooks online</div>
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('career-studio')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-neutral-800 flex items-start gap-2.5 group transition-colors"
                >
                  <Briefcase className="w-4 h-4 text-[#0050FF] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-[#0050FF]">Career Studio & AI Resume</div>
                    <div className="text-[11px] text-neutral-400">ATS diagnostic score & Google XYZ bullet improver</div>
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('notes')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-neutral-800 flex items-start gap-2.5 group transition-colors"
                >
                  <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-amber-400">Personal Notes & Vault</div>
                    <div className="text-[11px] text-neutral-400">All captured insights and bookmarks</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 100% FREE ACCESS LINK */}
          <button
            onClick={() => handleLinkClick('home')}
            className="px-3 py-2 text-neutral-300 hover:text-white transition-colors"
          >
            100% Free Model
          </button>
        </nav>

        {/* Right Chrome: Streak, XP, Theme, Assessment CTA */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-[#141414] border border-[#262626] text-neutral-400 hover:text-white transition-colors"
            title={`Toggle Theme (Current: ${theme})`}
          >
            {theme === 'dark' ? <Moon className="w-4 h-4 text-[#0050FF]" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Streak Badge */}
          <div 
            onClick={() => handleLinkClick('dashboard')}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#141414] border border-[#262626] text-amber-400 text-xs font-bold cursor-pointer hover:border-amber-400/40 transition-colors"
            title={`${streak} Days Streak`}
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400 animate-pulse" />
            <span>{streak}d</span>
          </div>

          {/* XP Badge */}
          <div 
            onClick={() => handleLinkClick('certificates')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141414] border border-[#262626] text-white text-xs font-bold cursor-pointer hover:border-[#0050FF]/40 transition-colors"
            title={`${xp} Total XP`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{xp} XP</span>
          </div>

          {/* Take Free Assessment Button */}
          <button
            onClick={onOpenAssessment}
            className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0050FF] hover:bg-[#1C449A] text-white text-xs font-semibold tracking-tight shadow-md shadow-[#0050FF]/25 transition-all hover:scale-[1.02]"
          >
            <span>Take Free Assessment</span>
            <span>→</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#141414] border border-[#262626] text-neutral-300"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#262626] bg-[#0C0C0C] px-4 py-4 space-y-2 animate-fadeIn">
          <button
            onClick={() => handleLinkClick('home')}
            className="w-full text-left p-2.5 rounded-lg bg-[#141414] text-xs font-semibold text-white flex items-center justify-between"
          >
            <span>Home (DataVidhya Masterclass)</span>
            <span className="text-[#0050FF]">→</span>
          </button>
          <button
            onClick={() => handleLinkClick('catalog')}
            className="w-full text-left p-2.5 rounded-lg bg-[#141414] text-xs font-semibold text-white flex items-center justify-between"
          >
            <span>All Courses & Curricula</span>
            <span className="text-[#0050FF]">→</span>
          </button>
          <button
            onClick={() => handleLinkClick('tracks')}
            className="w-full text-left p-2.5 rounded-lg bg-[#141414] text-xs font-semibold text-white flex items-center justify-between"
          >
            <span>850+ Practice Coding Problems</span>
            <span className="text-[#0050FF]">→</span>
          </button>
          <button
            onClick={() => handleLinkClick('vault')}
            className="w-full text-left p-2.5 rounded-lg bg-[#141414] text-xs font-semibold text-white flex items-center justify-between"
          >
            <span>The Vault (Online Books)</span>
            <span className="text-[#0050FF]">→</span>
          </button>
          <button
            onClick={() => handleLinkClick('career-studio')}
            className="w-full text-left p-2.5 rounded-lg bg-[#141414] text-xs font-semibold text-white flex items-center justify-between"
          >
            <span>Career Studio & AI Resume</span>
            <span className="text-[#0050FF]">→</span>
          </button>
          <button
            onClick={onOpenAssessment}
            className="w-full py-2.5 rounded-xl bg-[#0050FF] text-white text-xs font-bold text-center"
          >
            Take Free Assessment
          </button>
        </div>
      )}

    </header>
  );
};
