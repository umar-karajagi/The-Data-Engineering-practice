'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Flame, 
  Zap, 
  ArrowRight,
  Gift,
  BookOpen,
  Award,
  Video,
  Terminal,
  Trophy,
  Check,
  CreditCard,
  QrCode
} from 'lucide-react';
import { useAuth, SubscriptionPlan } from '../../lib/authStore';
import { PaywallModal } from '../monetization/PaywallModal';

export const DataVedaPricing: React.FC = () => {
  const { currentUser, isPro } = useAuth();
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<SubscriptionPlan | null>(null);
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);

  const handleOpenCheckout = (plan: SubscriptionPlan) => {
    setSelectedPlanForModal(plan);
    setIsPaywallOpen(true);
  };

  const isINR = currency === 'INR';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparent Commercial SaaS Pricing • Built for India & Global</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-50">
          Accelerate Your Career to <span className="text-brand-blue">Staff Data Engineer</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
          Unrestricted access to the 600+ page 3D classical literature vault, real-world Medallion pipelines, and 850+ company interview problems.
        </p>

        {/* Currency Switcher Toggle */}
        <div className="mt-6 inline-flex items-center p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-bold shadow-inner">
          <button
            onClick={() => setCurrency('INR')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              isINR
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span>🇮🇳 ₹ INR (India & UPI)</span>
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              !isINR
                ? 'bg-brand-blue text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span>🌐 $ USD (International)</span>
          </button>
        </div>
      </div>

      {/* Early Launch Coupon Banner */}
      <div className="max-w-3xl mx-auto mb-10 p-4 rounded-3xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-brand-blue/15 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-lg">
        <div className="flex items-center gap-3">
          <Gift className="w-6 h-6 text-amber-500 shrink-0" />
          <div>
            <strong className="text-slate-900 dark:text-slate-100 text-sm">Launch Celebration: </strong>
            <p className="text-slate-600 dark:text-slate-300 mt-0.5">
              Apply code <code className="font-mono font-bold bg-amber-500/20 px-2 py-0.5 rounded text-amber-600 dark:text-amber-400">DATAFORGE50</code> at checkout for 50% off any plan.
            </p>
          </div>
        </div>
        <button
          onClick={() => handleOpenCheckout('lifetime_vault')}
          className="shrink-0 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs transition-colors shadow-md cursor-pointer"
        >
          Claim 50% Off (Instant Unlock)
        </button>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        
        {/* TIER 1: Free Starter */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-7 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Free Preview</span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1">Free Student</h3>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 dark:text-slate-50">{isINR ? '₹0' : '$0'}</span>
              <span className="text-xs text-slate-400">/ forever</span>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Basic preview access to get familiar with our 3D reading experience and practice arena.
            </p>

            <div className="mt-8 space-y-3.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Pages 1 to 5 preview on all 13 classical books</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>10 Foundational SQL practice problems</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Creative Commons & freeCodeCamp Masterclass preview</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <X className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Full 600+ page books locked (Pages 6+)</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <X className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Verified certification credential</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <button 
              disabled={currentUser?.plan === 'free_preview'}
              className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors disabled:opacity-60 cursor-default"
            >
              {currentUser?.plan === 'free_preview' ? 'Current Active Tier' : 'Default Tier'}
            </button>
          </div>
        </div>

        {/* TIER 2: Pro Membership (Annual / Monthly) */}
        <div className="bg-white dark:bg-slate-900 border-2 border-brand-blue rounded-3xl p-7 flex flex-col justify-between shadow-xl relative">
          <div className="absolute -top-3.5 right-6 bg-brand-blue text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
            Most Popular
          </div>

          <div>
            <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">Full Access</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 mt-1">Pro Engineer</h3>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 dark:text-slate-50">{isINR ? '₹1,499' : '$199'}</span>
              <span className="text-xs text-slate-500">/ year</span>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                or {isINR ? '₹499/mo' : '$29/mo'}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              For active data practitioners seeking complete mastery of pipelines and interview preparation.
            </p>

            <div className="mt-8 space-y-3.5 text-xs text-slate-900 dark:text-slate-50 font-medium">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>All 13 Books: Complete 600+ Pages Unlocked</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>850+ Company-Tagged Problems with DuckDB WASM</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>All 48 Video Masterclasses with Full Repositories</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Interactive DAG Roadmap & Capstone Challenges</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Verified DataForge Track Certifications</span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <QrCode className="w-4 h-4 shrink-0" />
                <span>UPI (GPay / PhonePe / Paytm) & Cards Accepted</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => handleOpenCheckout('pro_annual')}
              className="w-full py-3 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-brand-hover transition-colors shadow-lg shadow-brand-blue/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isPro ? 'Manage / Renew Pro' : `Subscribe to Pro (${isINR ? '₹1,499/yr' : '$199/yr'})`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TIER 3: Lifetime Master Vault VIP */}
        <div className="bg-gradient-to-b from-emerald-500/10 via-white to-white dark:via-slate-900 dark:to-slate-900 border-2 border-emerald-500 rounded-3xl p-7 flex flex-col justify-between shadow-xl relative">
          <div className="absolute -top-3.5 right-6 bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
            Founder&apos;s VIP Tier
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Unlimited Forever</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 mt-1">Lifetime Vault Access</h3>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-black text-emerald-500">{isINR ? '₹3,499' : '$399'}</span>
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">One-Time Payment</span>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Never pay again. Includes all future books, masterclasses, and direct architect reviews.
            </p>

            <div className="mt-8 space-y-3.5 text-xs text-slate-900 dark:text-slate-50 font-medium">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Everything in Pro Engineer FOREVER</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>1-on-1 Resume & Portfolio Review by Umar Karajagi</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>All Future Literature & Tracks Added Automatically</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Priority Staff DE Referral Network</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero-Download DRM Hardened Reader License</span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <QrCode className="w-4 h-4 shrink-0" />
                <span>Instant QR Scan & Pay via Any UPI App</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => handleOpenCheckout('lifetime_vault')}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Lifetime Vault ({isINR ? '₹3,499' : '$399'})</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        reason="general"
        onUnlockSuccess={() => setIsPaywallOpen(false)}
      />

    </div>
  );
};
