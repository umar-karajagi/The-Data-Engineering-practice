'use client';

import React from 'react';
import { 
  Terminal, 
  FolderGit2, 
  Sparkles, 
  CheckCircle2, 
  Heart,
  BookOpen,
  HelpCircle,
  Compass
} from 'lucide-react';

interface DataVedaFooterProps {
  onNavigateTab: (tab: string) => void;
}

export const DataVedaFooter: React.FC<DataVedaFooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        {/* Top 5-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          {/* Col 1: Brand & Bio */}
          <div className="col-span-2 space-y-4">
            <div 
              onClick={() => onNavigateTab('home')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-lg bg-brand-blue flex items-center justify-center text-slate-900 dark:text-slate-50 shadow-md shadow-brand-blue/30">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
              </div>
              <span className="text-base font-black text-slate-900 dark:text-slate-50 group-hover:text-brand-blue transition-colors">
                DataVeda
              </span>
            </div>
            
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed max-w-sm">
              The complete data engineering interview prep, coding arena, and real-world project platform. Everything you need to become a job-ready Data Engineer with 100% free open access.
            </p>

            <div className="pt-2 flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Zero Paywalls • Curated YouTube Masterclasses</span>
            </div>
          </div>

          {/* Col 2: Career Tracks */}
          <div className="space-y-3">
            <h4 className="text-slate-900 dark:text-slate-50 text-xs font-bold uppercase tracking-wider">Career Tracks</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigateTab('tracks')} className="hover:text-slate-900 dark:text-slate-50 transition-colors">
                  Data Engineer Track
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('tracks')} className="hover:text-slate-900 dark:text-slate-50 transition-colors">
                  Analytics Engineer Track
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('tracks')} className="hover:text-slate-900 dark:text-slate-50 transition-colors">
                  Data Analyst Track
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('tracks')} className="hover:text-slate-900 dark:text-slate-50 transition-colors">
                  Streaming Systems Track
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Practice & Portfolios */}
          <div className="space-y-3">
            <h4 className="text-slate-900 dark:text-slate-50 text-xs font-bold uppercase tracking-wider">Practice & Projects</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigateTab('practice')} className="hover:text-slate-900 dark:text-slate-50 transition-colors">
                  850+ Coding Problems
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('practice')} className="hover:text-slate-900 dark:text-slate-50 transition-colors">
                  In-Browser DuckDB WASM
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('projects')} className="hover:text-slate-900 dark:text-slate-50 transition-colors">
                  Uber Analytics (GCP + Mage)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('projects')} className="hover:text-slate-900 dark:text-slate-50 transition-colors">
                  Spotify AWS Pipeline
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('library')} className="hover:text-slate-900 dark:text-slate-50 transition-colors">
                  The Library (The Vault)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources & Guides */}
          <div className="space-y-3">
            <h4 className="text-slate-900 dark:text-slate-50 text-xs font-bold uppercase tracking-wider">Resources & Guides</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigateTab('resources')} className="hover:text-slate-900 dark:text-slate-50 transition-colors">
                  100+ DE Interview Questions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('resources')} className="hover:text-slate-900 dark:text-slate-50 transition-colors">
                  80 SQL Interview Questions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('resources')} className="hover:text-slate-900 dark:text-slate-50 transition-colors">
                  70 PySpark Questions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('resources')} className="hover:text-slate-900 dark:text-slate-50 transition-colors">
                  Airflow First DAG Guide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('resources')} className="hover:text-slate-900 dark:text-slate-50 transition-colors">
                  Medallion Architecture Guide
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500">
          <p>© 2026 DataVeda. All rights reserved. Open learning platform.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigateTab('home')} className="hover:text-slate-700 dark:text-slate-300">Home</button>
            <button onClick={() => onNavigateTab('tracks')} className="hover:text-slate-700 dark:text-slate-300">Tracks</button>
            <button onClick={() => onNavigateTab('practice')} className="hover:text-slate-700 dark:text-slate-300">Practice</button>
            <button onClick={() => onNavigateTab('library')} className="hover:text-slate-700 dark:text-slate-300">The Library</button>
            <button onClick={() => onNavigateTab('pricing')} className="hover:text-slate-700 dark:text-slate-300">Zero Paywall Promise</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
