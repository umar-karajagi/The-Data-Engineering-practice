'use client';

import React from 'react';
import { 
  Terminal, 
  ArrowRight, 
  Database, 
  Code2, 
  Zap, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  Compass, 
  ShieldCheck, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { FOUNDATIONAL_BOOKS } from '../../content/books';

export const LandingPage: React.FC<{
  onNavigate: (view: 'landing' | 'roadmap' | 'practice' | 'tracker' | 'books' | 'dashboard') => void;
}> = ({ onNavigate }) => {
  return (
    <div className="space-y-24 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Hero Section */}
      <div className="text-center space-y-8 max-w-4xl mx-auto pt-6">
        
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forge-card border border-forge-border text-xs font-mono text-forge-secondary shadow-sm">
          <span className="w-2 h-2 rounded-full bg-track-python animate-pulse" />
          <span className="text-forge-text font-bold">DataForge</span>
          <span className="text-forge-muted">|</span>
          <span className="text-track-sql font-semibold flex items-center gap-1">
            Built on 13 Foundational Texts <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-forge-text tracking-tight leading-[1.1]">
          The Developer Platform for{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-track-sql via-track-warehousing to-track-python">
            Mastering Data Engineering
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-forge-secondary leading-relaxed max-w-2xl mx-auto font-sans">
          From zero to Principal Data Architect. Practice 1,800+ SQL, Python, PySpark, Warehousing, DSA & System Design challenges in-browser, traverse the 137-topic interview matrix, and architect petabyte-scale lakehouses with zero server setup.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigate('roadmap')}
            className="px-6 py-3 rounded-xl bg-track-sql hover:bg-blue-600 text-white text-sm font-mono font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
          >
            <Compass className="w-4 h-4" />
            <span>Start Winding Roadmap Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('practice')}
            className="px-6 py-3 rounded-xl bg-forge-card hover:bg-forge-surface text-forge-text border border-forge-border text-sm font-mono font-bold flex items-center gap-2 transition-all hover:border-forge-text"
          >
            <Code2 className="w-4 h-4 text-track-python" />
            <span>Launch Code Arena (1,800 Qs)</span>
          </button>
        </div>

      </div>

      {/* Animated Skill-Tree / Live Pipeline DAG Preview */}
      <div className="relative rounded-3xl bg-forge-card border border-forge-border p-6 sm:p-10 shadow-2xl overflow-hidden">
        
        <div className="flex items-center justify-between border-b border-forge-border pb-4 mb-8 font-mono text-xs text-forge-secondary">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
            </div>
            <span className="ml-2 text-forge-text font-bold">PIPELINE ARCHITECTURE CANVAS</span>
            <span>::</span>
            <span className="text-track-warehousing">enterprise_medallion_lakehouse.py</span>
          </div>

          <span className="text-[11px] px-2.5 py-1 rounded bg-forge-bg border border-forge-border text-track-python font-bold">
            ● DuckDB-WASM In-Browser Active
          </span>
        </div>

        {/* Pipeline Nodes Flow */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative">
          
          <div className="p-4 rounded-xl bg-forge-bg border border-track-sql/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-track-sql uppercase">Track: SQL / CDC</span>
              <Database className="w-4 h-4 text-track-sql" />
            </div>
            <div className="font-mono text-xs font-bold text-forge-text">PostgreSQL WAL</div>
            <p className="text-[11px] text-forge-secondary leading-snug">Debezium log capture</p>
          </div>

          <div className="p-4 rounded-xl bg-forge-bg border border-track-architecture/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-track-architecture uppercase">Event Buffer</span>
              <Cpu className="w-4 h-4 text-track-architecture" />
            </div>
            <div className="font-mono text-xs font-bold text-forge-text">Apache Kafka</div>
            <p className="text-[11px] text-forge-secondary leading-snug">Sticky assignors, EOS</p>
          </div>

          <div className="p-4 rounded-xl bg-forge-bg border border-track-pyspark/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-track-pyspark uppercase">Distributed</span>
              <Zap className="w-4 h-4 text-track-pyspark" />
            </div>
            <div className="font-mono text-xs font-bold text-forge-text">PySpark Engine</div>
            <p className="text-[11px] text-forge-secondary leading-snug">Catalyst Whole-Stage</p>
          </div>

          <div className="p-4 rounded-xl bg-forge-bg border border-track-warehousing/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-track-warehousing uppercase">Lakehouse</span>
              <Layers className="w-4 h-4 text-track-warehousing" />
            </div>
            <div className="font-mono text-xs font-bold text-forge-text">Delta Lake & Iceberg</div>
            <p className="text-[11px] text-forge-secondary leading-snug">ACID, Z-ORDER, Time Travel</p>
          </div>

          <div className="col-span-2 md:col-span-1 p-4 rounded-xl bg-forge-bg border border-track-python/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-track-python uppercase">Serving & BI</span>
              <Terminal className="w-4 h-4 text-track-python" />
            </div>
            <div className="font-mono text-xs font-bold text-forge-text">Trino & Polars</div>
            <p className="text-[11px] text-forge-secondary leading-snug">Vectorized Sub-second</p>
          </div>

        </div>

      </div>

      {/* Social Proof Strip */}
      <div className="text-center space-y-4">
        <p className="text-xs font-mono uppercase tracking-widest text-forge-muted">
          Mastering systems with engineers from leading engineering organizations
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-forge-secondary font-mono text-sm font-semibold opacity-80">
          <span>NETFLIX</span>
          <span>UBER</span>
          <span>SNOWFLAKE</span>
          <span>STRIPE</span>
          <span>DATABRICKS</span>
          <span>AIRBNB</span>
        </div>
      </div>

      {/* The 13 Foundational Books Shelf */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forge-card border border-forge-border text-xs font-mono text-track-warehousing">
            <BookOpen className="w-3.5 h-3.5" />
            Curriculum Grounded in Industry Authorities
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-forge-text tracking-tight">
            13 Foundational Text References
          </h2>
          <p className="text-xs sm:text-sm text-forge-secondary max-w-xl mx-auto">
            Every challenge, system design sandbox, and tracker module cites exact concepts from the seminal books that defined Data Engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FOUNDATIONAL_BOOKS.slice(0, 8).map((b) => (
            <div 
              key={b.id}
              onClick={() => onNavigate('books')}
              className="p-5 rounded-2xl bg-forge-card border border-forge-border hover:border-forge-text transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-forge-bg border border-forge-border text-forge-muted">
                  {b.track}
                </span>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.coverColor }} />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-forge-text group-hover:text-track-sql transition-colors leading-snug">
                {b.title}
              </h3>
              <p className="text-[11px] text-forge-secondary font-mono">{b.author}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
