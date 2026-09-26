'use client';

import React, { useState } from 'react';
import { useUserStore } from '../../lib/userStore';
import { useAuth } from '../../lib/authStore';
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
  Play,
  Database,
  Cpu,
  User,
  LogOut,
  ShieldCheck,
  Lock
} from 'lucide-react';

interface DataVedaNavbarProps {
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  onOpenAssessment?: () => void;
  onOpenHeroVideo?: () => void;
  onOpenAuthModal?: () => void;
  onOpenDatabaseInspector?: () => void;
  onOpenQaTracker?: () => void;
}

export const DataVedaNavbar: React.FC<DataVedaNavbarProps> = ({
  activeTab,
  onNavigateTab,
  onOpenAssessment,
  onOpenHeroVideo,
  onOpenAuthModal,
  onOpenDatabaseInspector,
  onOpenQaTracker
}) => {
  const { user } = useUserStore();
  const { currentUser, isAuthenticated, isPro, isAdmin, environment, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false);

  const streak = user?.streakDays || 5;
  const xp = user?.xp || 1450;

  const handleLinkClick = (tab: string) => {
    onNavigateTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getEnvBadgeColor = () => {
    switch (environment) {
      case 'PROD':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30';
      case 'TESTING':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col justify-center border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md text-slate-900 dark:text-slate-50 font-sans transition-colors duration-200">
      
      {/* 1. Top Enterprise Release & Environment Banner */}
      <section className="bg-slate-950 text-white py-1 px-4 text-center text-xs tracking-tight border-b border-slate-800 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
          
          {/* Left: Environment Indicator */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenQaTracker}
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border transition-colors cursor-pointer flex items-center gap-1 ${getEnvBadgeColor()}`}
              title="Click to switch environment or open MNC Testing Tracker"
            >
              <Cpu className="w-3 h-3" />
              <span>ENV: [{environment}]</span>
            </button>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              MNC Pipeline: DEV → TESTING → PROD
            </span>
          </div>

          {/* Center: Mission / Coupon Note */}
          <p className="text-[11px] font-medium text-slate-300 truncate hidden md:block">
            🚀 DataForge Enterprise • Use code <code className="text-amber-400 font-mono font-bold">DATAFORGE50</code> for 50% off Vault Access
          </p>

          {/* Right: DB Console & QA Quick Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDatabaseInspector}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Database className="w-3 h-3 text-brand-blue" />
              <span>User DB Console</span>
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={onOpenQaTracker}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <span>QA Tracker</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">16/16 PASS</span>
            </button>
          </div>

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
              DataForge
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              VAULT
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

          {/* THE LIBRARY (600+ PAGES REAL 3D BOOKS) */}
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
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold">3D Vault</span>
          </button>

          {/* RESOURCES */}
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

          {/* PRICING */}
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

        {/* Right Utility Bar: Streak, XP, Identity & CTA */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          
          {/* Streak Flame */}
          <div 
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-bold select-none"
            title="Daily Learning Streak"
          >
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span>{streak}d</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Toggle theme (Light / Dark / Warm)"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* User Account / Sign In Widget */}
          {isAuthenticated && currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-[10px]">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-[11px] leading-none truncate max-w-[90px]">
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div className="text-[9px] font-mono text-emerald-500 leading-none mt-0.5">
                    {currentUser.role === 'super_admin' ? 'Founder' : isPro ? 'Pro Member' : 'Student'}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* User Dropdown */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs animate-fadeIn">
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{currentUser.email}</p>
                    <div className="mt-1">
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20">
                        Tier: {currentUser.plan.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => { setIsUserDropdownOpen(false); onOpenDatabaseInspector?.(); }}
                    className="w-full text-left px-2.5 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <Database className="w-3.5 h-3.5 text-brand-blue" />
                    <span>User Database Inspector</span>
                  </button>

                  <button
                    onClick={() => { setIsUserDropdownOpen(false); onOpenQaTracker?.(); }}
                    className="w-full text-left px-2.5 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    <span>MNC QA Testing Tracker</span>
                  </button>

                  <button
                    onClick={() => { setIsUserDropdownOpen(false); onOpenAuthModal?.(); }}
                    className="w-full text-left px-2.5 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Switch Account Persona</span>
                  </button>

                  <div className="border-t border-slate-100 dark:border-slate-800/80 mt-1 pt-1">
                    <button
                      onClick={() => { setIsUserDropdownOpen(false); logout(); }}
                      className="w-full text-left px-2.5 py-2 rounded-xl text-rose-500 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}

          {/* Primary CTA */}
          <button
            onClick={() => handleLinkClick('pricing')}
            className="px-4 py-1.5 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-brand-hover transition-colors shadow-md shadow-brand-blue/25 shrink-0 cursor-pointer"
          >
            {isPro ? 'Pro Active' : 'Upgrade Pro'}
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
            The Library (3D 600+ Page Vault)
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
            Pricing & Pro Membership
          </button>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <button
              onClick={() => { setIsMobileMenuOpen(false); onOpenDatabaseInspector?.(); }}
              className="flex-1 py-2 text-center text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800"
            >
              User DB Console
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); onOpenQaTracker?.(); }}
              className="flex-1 py-2 text-center text-xs font-bold rounded-lg bg-brand-blue text-white"
            >
              QA Tracker
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
