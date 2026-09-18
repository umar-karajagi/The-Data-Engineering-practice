'use client';

import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Flame, 
  Zap, 
  ArrowRight,
  Gift
} from 'lucide-react';

export const DataVedaPricing: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
          <Gift className="w-3.5 h-3.5" />
          <span>Zero Paywall Guarantee</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-forge-text">
          100% Free. <span className="text-brand-blue">Lifetime Open Access.</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-forge-muted">
          Unlike platforms that lock critical interview prep and projects behind a $279/year subscription, DataVeda offers full access with zero paywalls.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        
        {/* Competitor / Proprietary Paywall Card */}
        <div className="bg-vidhya-card/40 border border-forge-border/40 rounded-3xl p-8 flex flex-col justify-between opacity-80">
          <div>
            <span className="text-xs font-bold text-forge-muted uppercase tracking-wider">Proprietary Platforms</span>
            <h3 className="text-2xl font-bold text-forge-text mt-1">DataVidhya Pro</h3>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-rose-400 line-through">$349</span>
              <span className="text-4xl font-black text-forge-text">$279</span>
              <span className="text-xs text-forge-muted">/ year</span>
            </div>
            <p className="mt-2 text-xs text-forge-muted">
              Annual recurring charge. Content gated behind paywalls.
            </p>

            <div className="mt-8 space-y-3 text-xs text-forge-muted">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-zinc-500" />
                <span>3 Career Tracks & Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-zinc-500" />
                <span>850+ Company-Tagged Coding Problems</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-zinc-500" />
                <span>Real-World Portfolios</span>
              </div>
              <div className="flex items-center gap-2 text-rose-400 font-semibold">
                <X className="w-4 h-4" />
                <span>Gated behind $279/yr paywall</span>
              </div>
              <div className="flex items-center gap-2 text-rose-400 font-semibold">
                <X className="w-4 h-4" />
                <span>Access expires if subscription cancels</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-forge-border/30">
            <span className="text-xs text-forge-muted text-center block">Expensive for students and career switchers</span>
          </div>
        </div>

        {/* DataVeda Free Open Model Card */}
        <div className="bg-gradient-to-b from-brand-blue/10 via-vidhya-card to-vidhya-card border-2 border-brand-blue rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative">
          <div className="absolute -top-3.5 right-8 bg-brand-blue text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
            Our Open Mission
          </div>

          <div>
            <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">DataVeda Free</span>
            <h3 className="text-2xl font-black text-forge-text mt-1">100% Free Open Platform</h3>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-black text-emerald-400">$0</span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Forever Free</span>
            </div>
            <p className="mt-2 text-xs text-forge-muted">
              No credit card required. No trials. Lifetime open access for all data engineers.
            </p>

            <div className="mt-8 space-y-3.5 text-xs text-forge-text font-medium">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Full Career Tracks (DE, Analytics Engineer, Data Analyst)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>850+ Company-Tagged Problems with DuckDB WASM Runner</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-World Projects with YouTube Masterclasses & GitHub Repos</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>The Vault: Complete Online Data Engineering Book Reader</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100+ Interview Questions, SQL Drills & System Design Templates</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Active Community, Open Repositories & Free Updates</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-forge-border/30">
            <button className="w-full py-3 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-brand-hover transition-colors shadow-lg shadow-brand-blue/25 flex items-center justify-center gap-2">
              <span>Start Learning Now (100% Free)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
