'use client';

import React from 'react';
import { Terminal, BookOpen, GitBranch, Database, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-forge-border bg-forge-bg py-8 px-4 text-xs font-mono text-forge-secondary">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-track-sql" />
          <span className="text-forge-text font-bold">DataForge Platform</span>
          <span className="text-forge-muted">•</span>
          <span>Junior to Principal Data Architect Curriculum</span>
        </div>

        {/* 5 Track Indicators */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span className="flex items-center gap-1 text-track-sql font-bold">
            <span className="w-2 h-2 rounded-full bg-track-sql" /> SQL
          </span>
          <span className="flex items-center gap-1 text-track-python font-bold">
            <span className="w-2 h-2 rounded-full bg-track-python" /> Python
          </span>
          <span className="flex items-center gap-1 text-track-pyspark font-bold">
            <span className="w-2 h-2 rounded-full bg-track-pyspark" /> PySpark
          </span>
          <span className="flex items-center gap-1 text-track-warehousing font-bold">
            <span className="w-2 h-2 rounded-full bg-track-warehousing" /> Warehousing
          </span>
          <span className="flex items-center gap-1 text-track-architecture font-bold">
            <span className="w-2 h-2 rounded-full bg-track-architecture" /> Architecture
          </span>
        </div>

        <div className="text-forge-muted">
          <span>Grounded in 13 Foundational Texts</span>
        </div>

      </div>
    </footer>
  );
};
