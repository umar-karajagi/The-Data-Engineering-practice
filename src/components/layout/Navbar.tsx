'use client';

import React from 'react';
import { 
  Terminal, 
  Flame, 
  Trophy, 
  Map, 
  Code2, 
  BookOpen, 
  CheckSquare, 
  BarChart3, 
  Sun, 
  Moon, 
  BookMarked,
  FileText,
  Award,
  User,
  Plus,
  Compass,
  Briefcase
} from 'lucide-react';
import { useTheme } from '../../lib/theme';
import { useUserStore } from '../../lib/userStore';

export interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onOpenQuickNote?: () => void;
  xp?: number;
  streak?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenQuickNote,
  xp: propXp, 
  streak: propStreak 
}) => {
  const { theme, toggleTheme } = useTheme();

  // Try reading from unified store if available
  let storeUser: any = null;
  try {
    const store = useUserStore();
    storeUser = store?.user;
  } catch {
    // If rendered outside provider
  }

  const currentXp = propXp ?? storeUser?.xp ?? 450;
  const currentStreak = propStreak ?? storeUser?.streakDays ?? 5;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'catalog', label: 'Catalog', icon: Compass, badge: '30 Prods' },
    { id: 'career-studio', label: 'Career Studio', icon: Briefcase, badge: 'Resume' },
    { id: 'tracks', label: 'Tracks', icon: Code2, badge: 'Learn' },
    { id: 'vault', label: 'The Vault', icon: BookOpen, badge: 'Books' },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'todos', label: 'Todos', icon: CheckSquare },
    { id: 'certificates', label: 'Badges & Certs', icon: Award },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 bg-forge-bg/95 backdrop-blur-md border-b border-forge-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-2">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
            title="DataForge — Staff Data Engineer Mastery Platform"
          >
            <div className="w-8 h-8 rounded-lg bg-forge-card border border-forge-border flex items-center justify-center group-hover:border-track-sql transition-colors">
              <Terminal className="w-4 h-4 text-track-sql" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5 font-mono">
                <span className="font-bold text-sm text-forge-text tracking-tight">DataForge</span>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-forge-surface text-track-python border border-forge-border">
                  Staff DE
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-0.5 font-mono">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-forge-card text-forge-text border border-forge-border shadow-sm'
                      : 'text-forge-secondary hover:text-forge-text hover:bg-forge-surface/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-track-sql' : 'text-forge-secondary'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-track-sql/10 text-track-sql border border-track-sql/20">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Chrome: + Note, Theme Switcher, Streak, XP */}
          <div className="flex items-center gap-2 font-mono shrink-0">
            
            {/* Quick Note Button */}
            {onOpenQuickNote && (
              <button
                onClick={onOpenQuickNote}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-forge-card hover:bg-forge-surface border border-forge-border hover:border-track-sql/60 text-xs font-bold text-forge-text transition-all shadow-sm"
                title="Open Quick Note (Draft note from anywhere)"
              >
                <Plus className="w-3.5 h-3.5 text-track-sql" />
                <span className="hidden sm:inline">Note</span>
              </button>
            )}

            {/* Theme Mode Toggle (Dark -> Light -> Focus) */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-forge-card border border-forge-border text-forge-secondary hover:text-forge-text transition-colors"
              title={`Active Theme: ${theme.toUpperCase()} (Click to toggle Dark/Light/Focus)`}
            >
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-track-sql" />
              ) : theme === 'light' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <BookMarked className="w-4 h-4 text-amber-700" />
              )}
            </button>

            {/* Streak Counter */}
            <div 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-forge-card border border-forge-border text-track-pyspark cursor-pointer hover:border-track-pyspark/60 transition-colors"
              title={`${currentStreak} days consecutive engineering streak`}
            >
              <Flame className="w-3.5 h-3.5 fill-track-pyspark animate-pulse" />
              <span className="text-xs font-bold">{currentStreak}d</span>
            </div>

            {/* XP Reputation */}
            <div 
              onClick={() => setActiveTab('certificates')}
              className="flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-xl bg-forge-card border border-forge-border cursor-pointer hover:border-track-sql/60 transition-colors"
              title={`${currentXp} Engineering Reputation XP`}
            >
              <Trophy className="w-3.5 h-3.5 text-track-sql" />
              <span className="text-xs font-bold text-forge-text">{currentXp} XP</span>
            </div>

          </div>

        </div>
      </div>

      {/* Horizontal scrolling navigation for tablets / mobile */}
      <div className="lg:hidden flex items-center gap-1 border-t border-forge-border bg-forge-bg px-2 py-1.5 font-mono overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap shrink-0 transition-colors ${
                isActive 
                  ? 'bg-forge-card text-track-sql font-bold border border-forge-border shadow-sm' 
                  : 'text-forge-secondary hover:text-forge-text'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
