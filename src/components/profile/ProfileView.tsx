'use client';

import React from 'react';
import { 
  User, 
  Flame, 
  Trophy, 
  Award, 
  FileText, 
  CheckSquare, 
  Moon, 
  Sun, 
  BookMarked, 
  Download, 
  RotateCcw, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useUserStore } from '../../lib/userStore';
import { useTheme } from '../../lib/theme';
import { ThemeMode } from '../../types';

export const ProfileView: React.FC = () => {
  const { user, tracksProgress, notes, todos, badges, certificates, resetToDemo } = useUserStore();
  const { theme, setTheme } = useTheme();

  // Calculate completed modules
  const totalCompletedModules = Object.values(tracksProgress).reduce(
    (acc, t) => acc + (t.completedModules?.length || 0), 0
  );

  const handleExportData = () => {
    const data = {
      user,
      tracksProgress,
      notes,
      todos,
      badges,
      certificates,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dataforge_backup_${user.name.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetConfirm = () => {
    if (window.confirm('Are you sure you want to reset demo data? This will restore initial seed state.')) {
      resetToDemo();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 font-sans">
      
      {/* Profile Card Banner */}
      <div className="rounded-3xl bg-forge-card border border-forge-border p-8 shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-track-sql to-track-pyspark p-0.5 shadow-lg">
            <div className="w-full h-full rounded-2xl bg-forge-bg flex items-center justify-center text-track-sql font-bold text-2xl font-mono">
              {user.name.charAt(0)}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-forge-surface text-track-sql border border-forge-border">
                Staff DE Candidate
              </span>
              <span className="text-xs text-track-pyspark font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-track-pyspark" />
                {user.streak} Day Streak
              </span>
            </div>
            <h1 className="text-2xl font-black text-forge-text mt-1">{user.name}</h1>
            <p className="text-xs text-forge-secondary font-mono">{user.email} • Member since {user.joinedDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right font-mono">
            <span className="text-[10px] text-forge-secondary uppercase block">Platform Reputation</span>
            <span className="text-xl font-bold text-forge-text flex items-center gap-1.5 justify-end">
              <Trophy className="w-4 h-4 text-track-sql" />
              {user.totalXp} XP
            </span>
          </div>
        </div>
      </div>

      {/* Progress Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-4 rounded-2xl bg-forge-card border border-forge-border space-y-1">
          <span className="text-[10px] uppercase font-bold text-forge-secondary block">Modules Mastered</span>
          <span className="text-xl font-bold text-track-sql">{totalCompletedModules}</span>
        </div>
        <div className="p-4 rounded-2xl bg-forge-card border border-forge-border space-y-1">
          <span className="text-[10px] uppercase font-bold text-forge-secondary block">Badges Unlocked</span>
          <span className="text-xl font-bold text-amber-400">{badges.filter(b => b.earned).length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-forge-card border border-forge-border space-y-1">
          <span className="text-[10px] uppercase font-bold text-forge-secondary block">Certificates</span>
          <span className="text-xl font-bold text-track-python">{certificates.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-forge-card border border-forge-border space-y-1">
          <span className="text-[10px] uppercase font-bold text-forge-secondary block">Saved Notes</span>
          <span className="text-xl font-bold text-forge-text">{notes.length}</span>
        </div>
      </div>

      {/* Theme Preference */}
      <div className="rounded-2xl bg-forge-card border border-forge-border p-6 space-y-4">
        <h2 className="text-xs font-bold text-forge-text font-mono uppercase tracking-wider">
          Theme & Display Mode
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'dark' as ThemeMode, name: 'Cyberpunk Dark', desc: 'Deep Slate & Emerald accents', icon: Moon },
            { id: 'light' as ThemeMode, name: 'Clean Light', desc: 'High-contrast day reading', icon: Sun },
            { id: 'focus' as ThemeMode, name: 'Sepia Focus', desc: 'Warm paper tone for late study', icon: BookMarked },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = theme === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setTheme(item.id)}
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  isSelected
                    ? 'bg-forge-surface border-track-sql shadow-sm'
                    : 'bg-forge-bg border-forge-border hover:border-forge-secondary/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-track-sql text-black font-bold' : 'bg-forge-card text-forge-secondary'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-forge-text">{item.name}</h3>
                  <p className="text-[11px] text-forge-secondary">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Data Management & Backup */}
      <div className="rounded-2xl bg-forge-card border border-forge-border p-6 space-y-4">
        <h2 className="text-xs font-bold text-forge-text font-mono uppercase tracking-wider">
          Data Management & Cloud Sync
        </h2>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-forge-text">Export Progress & Notes</h3>
            <p className="text-[11px] text-forge-secondary">Download complete JSON archive of all learning records, notes, and todos</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-forge-surface border border-forge-border text-xs font-bold text-forge-text hover:bg-forge-surface/80"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handleResetConfirm}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400 hover:bg-red-500/20"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
