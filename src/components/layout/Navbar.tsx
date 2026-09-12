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
  Home
} from 'lucide-react';
import { useTheme } from '../../lib/theme';

export const Navbar: React.FC<{
  activeTab: string;
  setActiveTab: (tab: any) => void;
  xp?: number;
  streak?: number;
}> = ({ activeTab, setActiveTab, xp = 450, streak = 5 }) => {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'landing', label: 'Overview', icon: Home },
    { id: 'roadmap', label: 'Winding Road', icon: Map, badge: 'Journey' },
    { id: 'practice', label: 'Code Arena', icon: Code2, badge: '1,800 Qs' },
    { id: 'tracker', label: '137 Topics', icon: CheckSquare },
    { id: 'books', label: 'Library', icon: BookOpen, badge: 'Vault' },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-forge-bg/90 backdrop-blur-md border-b border-forge-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-forge-card border border-forge-border flex items-center justify-center group-hover:border-track-sql transition-colors">
              <Terminal className="w-4 h-4 text-track-sql" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono">
                <span className="font-bold text-sm text-forge-text tracking-tight">DataForge</span>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-forge-surface text-track-python border border-forge-border">
                  Staff DE
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 font-mono">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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

          {/* Right Chrome: Theme Switcher + Gamification Stats */}
          <div className="flex items-center gap-3 font-mono">
            
            {/* Theme Mode Toggle (Dark -> Light -> Focus) */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-forge-card border border-forge-border text-forge-secondary hover:text-forge-text"
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
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-forge-card border border-forge-border text-track-pyspark">
              <Flame className="w-3.5 h-3.5 fill-track-pyspark animate-pulse" />
              <span className="text-xs font-bold">{streak}d</span>
            </div>

            {/* XP Reputation */}
            <div className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-forge-card border border-forge-border">
              <Trophy className="w-3.5 h-3.5 text-track-sql" />
              <span className="text-xs font-bold text-forge-text">{xp} XP</span>
            </div>

          </div>

        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-forge-border bg-forge-bg px-2 py-1.5 font-mono">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded text-[10px] ${
                isActive ? 'text-track-sql font-bold' : 'text-forge-secondary'
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
