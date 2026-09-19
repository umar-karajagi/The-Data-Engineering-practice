'use client';

import React, { useState } from 'react';
import { useUserStore } from '../../lib/userStore';
import { useTheme } from '../../lib/theme';
import { 
  ChevronDown, 
  Flame, 
  Trophy, 
  Sun, 
  Moon, 
  BookOpen, 
  Code2, 
  FolderGit2, 
  Layers, 
  Terminal, 
  Menu, 
  X, 
  Sparkles, 
  HelpCircle,
  Award, 
  Compass,
  Play
} from 'lucide-react';

interface DataVedaNavbarProps {
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  onOpenAssessment?: () => void;
  onOpenHeroVideo?: () => void;
}

export const DataVedaNavbar: React.FC<DataVedaNavbarProps> = ({
  activeTab,
  onNavigateTab,
  onOpenAssessment,
  onOpenHeroVideo
}) => {
  const { user } = useUserStore();
  const { theme, toggleTheme } = useTheme();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const streak = user?.streakDays || 5;
  const xp = user?.xp || 1450;

  const handleLinkClick = (tab: string) => {
    onNavigateTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col justify-center border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md text-slate-900 dark:text-slate-50 font-sans transition-colors duration-200">
      
      {/* 1. Top Announcement Banner */}
      <section className="bg-brand-blue py-1.5 px-4 text-center text-xs tracking-tight">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <p className="text-white font-medium truncate">
            ✨ DataVeda • 100% Free Open-Access Data Engineering Platform • YouTube Masterclasses Embedded
          </p>
          <button 
            onClick={() => handleLinkClick('pricing')}
            className="inline-flex items-center gap-1 font-bold text-white hover:underline shrink-0 cursor-pointer"
          >
            <span>Learn Zero-Paywall Promise</span>
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
          {/* DataVeda Geometric Logo */}
          <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center text-white shadow-md shadow-brand-blue/30 group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" y1="22" x2="4" y2="15" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-50 group-hover:text-brand-blue transition-colors">
              DataVeda
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              FREE
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 text-sm font-medium">
          
          {/* HOME */}
          <button
            onClick={() => handleLinkClick('home')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'home' 
                ? 'text-brand-blue bg-brand-blue/10 dark:bg-brand-blue/15 font-bold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            Home
          </button>

          {/* LEARN / TRACKS */}
          <button
            onClick={() => handleLinkClick('tracks')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'tracks' 
                ? 'text-brand-blue bg-brand-blue/10 dark:bg-brand-blue/15 font-bold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-4 h-4 text-brand-blue" />
            <span>Tracks</span>
          </button>

          {/* PRACTICE (850+ PROBLEMS) */}
          <button
            onClick={() => handleLinkClick('practice')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'practice' 
                ? 'text-brand-blue bg-brand-blue/10 dark:bg-brand-blue/15 font-bold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-500" />
            <span>Practice</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-bold">850+</span>
          </button>

          {/* PROJECTS */}
          <button
            onClick={() => handleLinkClick('projects')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'projects' 
                ? 'text-brand-blue bg-brand-blue/10 dark:bg-brand-blue/15 font-bold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <FolderGit2 className="w-4 h-4 text-purple-500" />
            <span>Projects</span>
          </button>

          {/* THE LIBRARY (THE VAULT PRESERVED) */}
          <button
            onClick={() => handleLinkClick('library')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'library' 
                ? 'text-brand-blue bg-brand-blue/10 dark:bg-brand-blue/15 font-bold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>The Library</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold">Vault</span>
          </button>

          {/* RESOURCES / INTERVIEW QUESTIONS */}
          <button
            onClick={() => handleLinkClick('resources')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'resources' 
                ? 'text-brand-blue bg-brand-blue/10 dark:bg-brand-blue/15 font-bold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-cyan-500" />
            <span>Resources</span>
          </button>

          {/* PRICING / FREE MODEL */}
          <button
            onClick={() => handleLinkClick('pricing')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'pricing' 
                ? 'text-brand-blue bg-brand-blue/10 dark:bg-brand-blue/15 font-bold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            Pricing
          </button>
        </nav>

        {/* Right Utility Bar: Streak, XP, Theme & CTA */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Streak Flame */}
          <div 
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-bold select-none"
            title="Daily Learning Streak"
          >
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span>{streak}d</span>
          </div>

          {/* XP Trophy */}
          <div 
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold select-none"
            title="Total XP Earned"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{xp} XP</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Toggle theme (Light / Dark / Warm)"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => handleLinkClick('tracks')}
            className="px-4 py-1.5 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-brand-hover transition-colors shadow-md shadow-brand-blue/25 shrink-0 cursor-pointer"
          >
            Start Free
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-2 animate-fadeIn shadow-lg">
          <button
            onClick={() => handleLinkClick('home')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Home
          </button>
          <button
            onClick={() => handleLinkClick('tracks')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Curriculum Milestones
          </button>
          <button
            onClick={() => handleLinkClick('practice')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Practice Arena (850+ Problems)
          </button>
          <button
            onClick={() => handleLinkClick('projects')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Real-World Projects
          </button>
          <button
            onClick={() => handleLinkClick('library')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            The Library (The Vault)
          </button>
          <button
            onClick={() => handleLinkClick('resources')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            100+ Interview Questions & Guides
          </button>
          <button
            onClick={() => handleLinkClick('pricing')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Pricing & Zero Paywall
          </button>
        </div>
      )}

    </header>
  );
};
