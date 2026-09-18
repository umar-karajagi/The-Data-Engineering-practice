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

  const [isLearnOpen, setIsLearnOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const streak = user?.streakDays || 5;
  const xp = user?.xp || 1450;

  const handleLinkClick = (tab: string) => {
    onNavigateTab(tab);
    setIsLearnOpen(false);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col justify-center border-b border-[#262626] bg-[#0C0C0C]/90 backdrop-blur-md text-white font-sans">
      
      {/* 1. Top Announcement Banner */}
      <section className="bg-brand-blue py-1.5 px-4 text-center text-xs tracking-tight">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <p className="text-white font-medium truncate">
            ✨ DataVeda • 100% Free Open-Access Data Engineering Platform • YouTube Masterclasses Embedded
          </p>
          <button 
            onClick={() => handleLinkClick('pricing')}
            className="inline-flex items-center gap-1 font-bold text-white hover:underline shrink-0"
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
            <span className="text-lg font-black tracking-tight text-white group-hover:text-brand-blue transition-colors">
              DataVeda
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              FREE
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium">
          
          {/* HOME */}
          <button
            onClick={() => handleLinkClick('home')}
            className={`px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'home' ? 'text-white bg-neutral-800/80 font-semibold' : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            Home
          </button>

          {/* LEARN / TRACKS */}
          <button
            onClick={() => handleLinkClick('tracks')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'tracks' ? 'text-white bg-neutral-800/80 font-semibold' : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            <Compass className="w-4 h-4 text-brand-blue" />
            <span>Tracks</span>
          </button>

          {/* PRACTICE (850+ PROBLEMS) */}
          <button
            onClick={() => handleLinkClick('practice')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'practice' ? 'text-white bg-neutral-800/80 font-semibold' : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Practice</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-mono font-bold">850+</span>
          </button>

          {/* PROJECTS */}
          <button
            onClick={() => handleLinkClick('projects')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'projects' ? 'text-white bg-neutral-800/80 font-semibold' : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            <FolderGit2 className="w-4 h-4 text-purple-400" />
            <span>Projects</span>
          </button>

          {/* THE LIBRARY (THE VAULT PRESERVED) */}
          <button
            onClick={() => handleLinkClick('library')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'library' ? 'text-white bg-neutral-800/80 font-semibold' : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>The Library</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-bold">Vault</span>
          </button>

          {/* RESOURCES / INTERVIEW QUESTIONS */}
          <button
            onClick={() => handleLinkClick('resources')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'resources' ? 'text-white bg-neutral-800/80 font-semibold' : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>Resources</span>
          </button>

          {/* PRICING / FREE MODEL */}
          <button
            onClick={() => handleLinkClick('pricing')}
            className={`px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'pricing' ? 'text-white bg-neutral-800/80 font-semibold' : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            Pricing
          </button>
        </nav>

        {/* Right Utility Bar: Streak, XP, Theme & CTA */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          
          {/* Streak Flame */}
          <div 
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold"
            title="Daily Learning Streak"
          >
            <Flame className="w-3.5 h-3.5 fill-orange-400" />
            <span>{streak}d</span>
          </div>

          {/* XP Trophy */}
          <div 
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold"
            title="Total Karma & XP Earned"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{xp} XP</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => handleLinkClick('tracks')}
            className="px-4 py-1.5 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-brand-hover transition-colors shadow-md shadow-brand-blue/25 shrink-0"
          >
            Start Free
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0C0C0C] border-b border-[#262626] px-4 py-4 space-y-2 animate-fadeIn">
          <button
            onClick={() => handleLinkClick('home')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-neutral-200 hover:bg-neutral-800"
          >
            Home
          </button>
          <button
            onClick={() => handleLinkClick('tracks')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-neutral-200 hover:bg-neutral-800"
          >
            Career Tracks
          </button>
          <button
            onClick={() => handleLinkClick('practice')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-neutral-200 hover:bg-neutral-800"
          >
            Practice (850+ Problems)
          </button>
          <button
            onClick={() => handleLinkClick('projects')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-neutral-200 hover:bg-neutral-800"
          >
            Real-World Projects
          </button>
          <button
            onClick={() => handleLinkClick('library')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-neutral-200 hover:bg-neutral-800"
          >
            The Library (The Vault)
          </button>
          <button
            onClick={() => handleLinkClick('resources')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-neutral-200 hover:bg-neutral-800"
          >
            100+ Interview Questions & Guides
          </button>
          <button
            onClick={() => handleLinkClick('pricing')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-neutral-200 hover:bg-neutral-800"
          >
            Pricing & Free Model
          </button>
        </div>
      )}

    </header>
  );
};
