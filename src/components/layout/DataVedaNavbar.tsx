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
  FolderGit2, 
  Layers, 
  Terminal, 
  Menu, 
  X, 
  Sparkles, 
  HelpCircle,
  Award, 
  Compass,
  Database,
  Cpu,
  User,
  LogOut,
  Zap,
  MoreVertical,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Search
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
  const { currentUser, isAuthenticated, isPro, isAdmin, isSuperAdmin, environment, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false);

  const streak = user?.streakDays || 5;
  const xp = user?.xp || 1450;

  const handleLinkClick = (tab: string) => {
    onNavigateTab(tab);
    setIsDrawerOpen(false);
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
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-emerald-500/15 dark:border-white/[0.08] bg-[#070b14]/90 dark:bg-[#070b14]/95 backdrop-blur-xl text-slate-100 font-sans transition-colors duration-200">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* ======================================================================= */}
          {/* LEFT SIDE: BRAND LOGO + DEDICATED SUBSCRIPTION / PRO STATUS PILL */}
          {/* ======================================================================= */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            
            {/* DataForge Brand Logo */}
            <div 
              onClick={() => handleLinkClick('home')}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-[1px] shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
                <div className="w-full h-full rounded-[11px] bg-[#070b14] flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                    <line x1="4" y1="22" x2="4" y2="15" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  DataForge
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 tracking-wider">
                  SOVEREIGN
                </span>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden sm:block h-5 w-[1px] bg-white/10" />

            {/* Left Side: Subscription Widget (Students & Guests) vs Founder Pill (Umar) */}
            {isSuperAdmin ? (
              /* FOUNDER SUPER-ADMIN PILL (Direct 1-Click Access) */
              <button
                onClick={onOpenDatabaseInspector}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-amber-500/10 hover:from-amber-500/20 hover:to-emerald-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-sm transition-all cursor-pointer group"
                title="Founder Authority: Click to Open User Database"
              >
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="font-bold text-slate-100 group-hover:text-amber-200">👑 Founder: Umar</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold border ${getEnvBadgeColor()}`}>
                  [{environment}]
                </span>
              </button>
            ) : (
              /* CUSTOMER / STUDENT SUBSCRIPTION PROMOTION PILL */
              <button
                onClick={() => handleLinkClick('pricing')}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-emerald-500/10 hover:from-emerald-500/20 hover:to-cyan-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-sm transition-all cursor-pointer group"
                title="Click to view Pro Membership plans and 50% discount"
              >
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-bold text-slate-100 group-hover:text-emerald-300">
                  {isPro ? 'Pro Active' : 'Pro: ₹499/mo'}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  {isPro ? 'LIFETIME' : '50% OFF'}
                </span>
              </button>
            )}

          </div>

          {/* ======================================================================= */}
          {/* CENTER: CLEAN QUICK-ACCESS PILLS (OR COMMAND LAUNCHER) */}
          {/* ======================================================================= */}
          <div className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={() => handleLinkClick('tracks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors flex items-center gap-1.5 ${
                activeTab === 'tracks'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>The 9 Terraces</span>
            </button>

            <button
              onClick={() => handleLinkClick('practice')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors flex items-center gap-1.5 ${
                activeTab === 'practice'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>The Crucible</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">500</span>
            </button>

            <button
              onClick={() => handleLinkClick('library')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors flex items-center gap-1.5 ${
                activeTab === 'library'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>The Codex</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-400 font-mono font-bold">16</span>
            </button>
          </div>

          {/* ======================================================================= */}
          {/* RIGHT SIDE: UTILITY (STREAK, THEME, USER) + THE 3-DOTS/3-LINES DRAWER BUTTON */}
          {/* ======================================================================= */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Learning Streak Flame */}
            <div 
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold select-none"
              title="Daily Learning Streak"
            >
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>{streak}d</span>
            </div>

            {/* XP Badge */}
            <div 
              className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold select-none"
              title="Current Engineering XP"
            >
              <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
              <span>{xp} XP</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10"
              title="Toggle theme (Light / Dark)"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>

            {/* User Profile Pill */}
            {isAuthenticated && currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 pl-1.5 pr-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-600 to-cyan-500 text-slate-950 font-black flex items-center justify-center text-[10px]">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-slate-200 text-xs hidden sm:inline max-w-[80px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* Profile Dropdown */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-[#0c1220] border border-emerald-500/30 rounded-2xl shadow-2xl p-2 z-50 text-xs">
                    <div className="p-2.5 border-b border-white/10 mb-1">
                      <p className="font-bold text-white">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{currentUser.email}</p>
                      <span className="mt-1.5 inline-block text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        {isSuperAdmin ? 'FOUNDER SUPER-ADMIN' : isPro ? 'PRO MEMBER' : 'STUDENT'}
                      </span>
                    </div>

                    {isSuperAdmin && (
                      <div className="p-1 space-y-1 border-b border-white/10 mb-1">
                        <button
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            onOpenDatabaseInspector?.();
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-500/15 text-emerald-300 font-medium flex items-center gap-2 cursor-pointer"
                        >
                          <Database className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Grant User Access (DB)</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            onOpenQaTracker?.();
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-cyan-500/15 text-cyan-300 font-medium flex items-center gap-2 cursor-pointer"
                        >
                          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                          <span>MNC QA Testing Tracker</span>
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-500/15 text-rose-300 font-medium flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleLinkClick('login')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 hover:border-emerald-500/40 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sign In</span>
              </button>
            )}

            {/* =================================================================== */}
            {/* THE ICONIC 3-LINES / 3-DOTS MENU BUTTON (HIDES/REVEALS ALL FEATURES) */}
            {/* =================================================================== */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 hover:from-emerald-500/20 hover:to-cyan-500/20 border border-emerald-500/40 text-white transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer group"
              title="Open Command Center (3-lines / 3-dots)"
              aria-label="Toggle Command Drawer"
            >
              {/* Animated 3-lines icon */}
              <div className="flex flex-col gap-1 items-end">
                <span className="w-4 h-0.5 bg-emerald-400 rounded-full group-hover:w-5 transition-all" />
                <span className="w-5 h-0.5 bg-cyan-400 rounded-full transition-all" />
                <span className="w-3 h-0.5 bg-emerald-400 rounded-full group-hover:w-5 transition-all" />
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 hidden sm:inline tracking-wider">
                MENU
              </span>
            </button>

          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* RIGHT-SIDE SLIDE-OVER COMMAND DRAWER (CINEMATIC HIGH-PRESTIGE MODAL) */}
      {/* ========================================================================= */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          
          {/* Backdrop Blur Overlay */}
          <div 
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-fadeIn"
          />

          {/* Slide-over Drawer Sheet */}
          <aside className="relative w-full max-w-md h-full bg-[#080d19] border-l border-emerald-500/30 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-slideInRight z-10 text-slate-100">
            
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold font-mono">
                    Δ
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">DataForge</h3>
                    <p className="text-[10px] font-mono text-emerald-400">COMMAND CENTER</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Close Drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* SECTION 1: ALL NAVIGATION FEATURES & HUBS */}
              <div className="mt-6 space-y-1.5">
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold px-2 mb-2">
                  Learning Architecture & Hubs
                </p>

                {/* Home */}
                <button
                  onClick={() => handleLinkClick('home')}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${
                    activeTab === 'home'
                      ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                      : 'hover:bg-white/5 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-emerald-400">
                      ⚡
                    </div>
                    <div>
                      <span className="font-bold text-sm block">Home</span>
                      <span className="text-[11px] text-slate-400 block">System Overview & Live Telemetry</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </button>

                {/* The 9 Terraces */}
                <button
                  onClick={() => handleLinkClick('tracks')}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${
                    activeTab === 'tracks'
                      ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                      : 'hover:bg-white/5 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">The 9 Terraces</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold">DAG 150</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block">61 Videos • 167.6h Master Curriculum</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </button>

                {/* The Crucible */}
                <button
                  onClick={() => handleLinkClick('practice')}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${
                    activeTab === 'practice'
                      ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                      : 'hover:bg-white/5 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">The Crucible</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">500 PROBS</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block">In-Browser DuckDB WASM Runner</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </button>

                {/* Summits (Projects) */}
                <button
                  onClick={() => handleLinkClick('projects')}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${
                    activeTab === 'projects'
                      ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                      : 'hover:bg-white/5 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <FolderGit2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-sm block">Production Summits</span>
                      <span className="text-[11px] text-slate-400 block">End-to-End Enterprise Blueprints</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </button>

                {/* The Codex Vault */}
                <button
                  onClick={() => handleLinkClick('library')}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${
                    activeTab === 'library'
                      ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                      : 'hover:bg-white/5 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">The Codex Vault</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">16 TEXTS</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block">Kimball, Kleppmann, Spark 3D Readers</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </button>

                {/* War Room */}
                <button
                  onClick={() => handleLinkClick('resources')}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${
                    activeTab === 'resources'
                      ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                      : 'hover:bg-white/5 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-sm block">War Room</span>
                      <span className="text-[11px] text-slate-400 block">Interview Question Bank & Final Boss</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </button>

                {/* Tiers & Pricing */}
                <button
                  onClick={() => handleLinkClick('pricing')}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${
                    activeTab === 'pricing'
                      ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                      : 'hover:bg-white/5 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">Tiers & Access</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">₹499/mo UPI</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block">Pro Membership & Commercial Licensing</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </button>
              </div>

              {/* SECTION 2: SUBSCRIPTION HIGHLIGHT CARD */}
              <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-slate-900 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    {isPro ? '✦ Active Membership' : '⚡ Pro Upgrade'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    {isPro ? 'ALL UNLOCKED' : 'CODE: DATAFORGE50'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  {isPro
                    ? 'You have lifetime full access to all 500 problems, 16 Vault texts, and portfolio blueprints.'
                    : 'Unlock in-browser execution, ATS resume audits, and full offline textbook reader for ₹499/mo.'}
                </p>
                <button
                  onClick={() => handleLinkClick('pricing')}
                  className="w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  {isPro ? 'Manage Subscription' : 'Upgrade to Pro (Instant UPI) →'}
                </button>
              </div>

              {/* SECTION 3: FOUNDER CONSOLE (Strictly Restricted to Umar Karajagi) */}
              {isSuperAdmin && (
                <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                      <span>👑 Founder Super-Admin</span>
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${getEnvBadgeColor()}`}>
                      ENV: {environment}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300">
                    Full MNC authority active. Switch release pipeline or manage subscriber accounts:
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        onOpenDatabaseInspector?.();
                      }}
                      className="p-2 rounded-xl bg-slate-900 border border-emerald-500/40 hover:bg-slate-800 text-[11px] font-bold text-emerald-300 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Database className="w-3.5 h-3.5 text-emerald-400" />
                      <span>User DB</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        onOpenQaTracker?.();
                      }}
                      className="p-2 rounded-xl bg-slate-900 border border-cyan-500/40 hover:bg-slate-800 text-[11px] font-bold text-cyan-300 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      <span>QA Tracker</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Drawer Footer */}
            <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    logout();
                  }}
                  className="text-xs font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  onClick={() => handleLinkClick('login')}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In / Create Account →</span>
                </button>
              )}

              <span className="text-[10px] font-mono text-slate-500">
                DataForge v4.2 PROD
              </span>
            </div>

          </aside>
        </div>
      )}
    </>
  );
};
