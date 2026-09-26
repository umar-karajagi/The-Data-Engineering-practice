'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  QrCode, 
  Tag, 
  ArrowRight, 
  Zap,
  BookOpen,
  Tv,
  Terminal,
  Trophy,
  Check,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth, SubscriptionPlan } from '../../lib/authStore';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: 'book_page_limit' | 'video_masterclass' | 'practice_advanced' | 'general';
  targetTitle?: string;
  onUnlockSuccess?: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  reason = 'book_page_limit',
  targetTitle,
  onUnlockSuccess
}) => {
  const { currentUser, upgradeSubscription, isAuthenticated } = useAuth();

  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('lifetime_vault');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'stripe'>('upi');
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successReceipt, setSuccessReceipt] = useState<{
    txId: string;
    amount: number;
    currency: string;
    plan: SubscriptionPlan;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isINR = currency === 'INR';

  // Regional Pricing Matrix
  const basePricesINR: Record<SubscriptionPlan, number> = {
    free_preview: 0,
    pro_monthly: 499,
    pro_annual: 1499,
    lifetime_vault: 3499
  };

  const basePricesUSD: Record<SubscriptionPlan, number> = {
    free_preview: 0,
    pro_monthly: 29,
    pro_annual: 199,
    lifetime_vault: 399
  };

  const currentBasePrice = isINR ? basePricesINR[selectedPlan] : basePricesUSD[selectedPlan];
  const finalPrice = Math.max(0, Math.round(currentBasePrice * (1 - discountPercent / 100)));
  const currencySymbol = isINR ? '₹' : '$';

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const code = couponCode.trim().toUpperCase();

    if (code === 'DATAFORGE50') {
      setDiscountPercent(50);
      setAppliedCoupon('DATAFORGE50 (50% OFF Applied)');
    } else if (code === 'FOUNDER') {
      setDiscountPercent(100);
      setAppliedCoupon('FOUNDER (100% VIP Free Pass Applied)');
    } else if (code === 'EARLYBIRD') {
      setDiscountPercent(35);
      setAppliedCoupon('EARLYBIRD (35% OFF Applied)');
    } else {
      setErrorMsg('Invalid discount code. Try DATAFORGE50 or EARLYBIRD');
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsProcessing(true);

    setTimeout(() => {
      const res = upgradeSubscription(
        selectedPlan,
        appliedCoupon ? 'coupon' : (paymentMethod as any),
        finalPrice,
        appliedCoupon || undefined
      );

      setIsProcessing(false);

      if (res.success) {
        try {
          confetti({
            particleCount: 110,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (e) {}

        setSuccessReceipt({
          txId: res.transactionId,
          amount: finalPrice,
          currency: isINR ? 'INR' : 'USD',
          plan: selectedPlan
        });

        setTimeout(() => {
          onUnlockSuccess?.();
        }, 1200);
      } else {
        setErrorMsg(res.message);
      }
    }, 1100);
  };

  const getReasonHeading = () => {
    switch (reason) {
      case 'book_page_limit':
        return {
          badge: 'Preview Limit Reached',
          title: 'Unlock Full 600+ Pages of The Vault',
          desc: `You’ve enjoyed the free preview of ${targetTitle ? `"${targetTitle}"` : 'this book'}. Upgrade to read all 600+ pages of all 13 classical data engineering books with zero downloads and interactive exercises.`
        };
      case 'video_masterclass':
        return {
          badge: 'Pro Masterclass',
          title: 'Unlock Enterprise Video Masterclasses',
          desc: 'Get unrestricted access to complete end-to-end video pipelines, project walkthroughs, and architecture reviews.'
        };
      default:
        return {
          badge: 'Unlock Unlimited Access',
          title: 'Invest in Your Data Engineering Career',
          desc: 'Join hundreds of senior data engineers learning with zero-latency 3D literature, real-world Medallion pipelines, and DuckDB WASM problem solving.'
        };
    }
  };

  const heading = getReasonHeading();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/30">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{heading.badge}</span>
            </span>

            {/* Currency Pill */}
            <div className="flex p-0.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`px-2 py-0.5 rounded-md transition-colors ${isINR ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500'}`}
              >
                ₹ INR
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-2 py-0.5 rounded-md transition-colors ${!isINR ? 'bg-brand-blue text-white shadow-sm' : 'text-slate-500'}`}
              >
                $ USD
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Success Receipt View */}
          {successReceipt ? (
            <div className="py-8 text-center space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500 text-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50">
                Subscription Activated!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Welcome to full vault access. Your license has been confirmed and registered in our enterprise database.
              </p>

              <div className="max-w-xs mx-auto p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-left space-y-2 font-mono">
                <div className="flex justify-between text-slate-500">
                  <span>Transaction ID:</span>
                  <span className="text-slate-900 dark:text-slate-200 font-bold">{successReceipt.txId}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Tier:</span>
                  <span className="text-emerald-500 font-bold">{successReceipt.plan.replace('_', ' ').toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Amount Paid:</span>
                  <span className="text-slate-900 dark:text-slate-200 font-bold">{isINR ? `₹${successReceipt.amount}` : `$${successReceipt.amount} USD`}</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-hover text-white text-xs font-bold transition-all shadow-md shadow-brand-blue/30 cursor-pointer"
                >
                  Continue Reading Now (All Pages Unlocked)
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Heading */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                  {heading.title}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {heading.desc}
                </p>
              </div>

              {/* Tier Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                
                {/* Option 1: Monthly Pro */}
                <div 
                  onClick={() => setSelectedPlan('pro_monthly')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedPlan === 'pro_monthly'
                      ? 'border-brand-blue bg-brand-blue/5 dark:bg-brand-blue/10 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Monthly Pro</span>
                      {selectedPlan === 'pro_monthly' && <Check className="w-4 h-4 text-brand-blue" />}
                    </div>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900 dark:text-slate-50">
                        {isINR ? '₹499' : '$29'}
                      </span>
                      <span className="text-[11px] text-slate-400">/ month</span>
                    </div>
                    <ul className="mt-3 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>All 13 books (600+ pages)</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Video Masterclasses</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Cancel anytime</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Option 2: Annual Pro */}
                <div 
                  onClick={() => setSelectedPlan('pro_annual')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between relative ${
                    selectedPlan === 'pro_annual'
                      ? 'border-purple-500 bg-purple-500/5 dark:bg-purple-500/10 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="absolute -top-2.5 right-3 px-2 py-0.2 rounded-full bg-purple-600 text-white text-[9px] font-black uppercase tracking-wider">
                    Save 75%
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Annual Pro</span>
                      {selectedPlan === 'pro_annual' && <Check className="w-4 h-4 text-purple-500" />}
                    </div>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900 dark:text-slate-50">
                        {isINR ? '₹1,499' : '$199'}
                      </span>
                      <span className="text-[11px] text-slate-400">/ year</span>
                    </div>
                    <ul className="mt-3 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>All 13 books (600+ pages)</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Verified Track Certificates</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Priority Discord Support</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Option 3: Lifetime Vault (Best Value) */}
                <div 
                  onClick={() => setSelectedPlan('lifetime_vault')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between relative ${
                    selectedPlan === 'lifetime_vault'
                      ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-lg'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="absolute -top-2.5 right-3 px-2 py-0.2 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider">
                    Lifetime VIP
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Lifetime Vault</span>
                      {selectedPlan === 'lifetime_vault' && <Check className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900 dark:text-slate-50">
                        {isINR ? '₹3,499' : '$399'}
                      </span>
                      <span className="text-[11px] text-slate-400">one-time</span>
                    </div>
                    <ul className="mt-3 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Forever Access to All Books</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>All Future Books & Tracks</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Founder 1-on-1 Code Review</span>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>

              {/* Coupon Code Section */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Discount code (e.g. DATAFORGE50, FOUNDER)"
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 uppercase font-mono tracking-wider focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {appliedCoupon && (
                  <div className="mt-2 text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{appliedCoupon}</span>
                  </div>
                )}
                {errorMsg && (
                  <div className="mt-2 text-[11px] font-semibold text-rose-500">
                    {errorMsg}
                  </div>
                )}
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckout} className="space-y-4 pt-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50">
                  <div className="text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Total Due Today: </span>
                    {discountPercent > 0 && (
                      <span className="line-through text-slate-400 mr-1.5">
                        {currencySymbol}{currentBasePrice}
                      </span>
                    )}
                    <span className="text-base font-black text-slate-900 dark:text-slate-50">
                      {currencySymbol}{finalPrice} {isINR ? 'INR' : 'USD'}
                    </span>
                  </div>

                  {/* Payment method selector */}
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors flex items-center gap-1 ${
                        paymentMethod === 'upi'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      <QrCode className="w-3 h-3" />
                      <span>UPI / QR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors flex items-center gap-1 ${
                        paymentMethod === 'card'
                          ? 'border-brand-blue bg-brand-blue/10 text-brand-blue'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      <CreditCard className="w-3 h-3" />
                      <span>Card / Razorpay</span>
                    </button>
                  </div>
                </div>

                {paymentMethod === 'upi' ? (
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-center space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Scan to Pay via Any UPI App (GPay, PhonePe, Paytm, BHIM)
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-500/10 py-1 px-3 rounded-lg inline-block border border-emerald-500/20 select-all">
                      dataforge.payments@okhdfcbank
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-center gap-2 pt-1">
                      <span>Google Pay</span>
                      <span>•</span>
                      <span>PhonePe</span>
                      <span>•</span>
                      <span>Paytm</span>
                      <span>•</span>
                      <span>BHIM UPI</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="col-span-2">
                      <input
                        type="text"
                        required
                        defaultValue="4242 •••• •••• 4242"
                        placeholder="Card Number"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        defaultValue="12/28"
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        defaultValue="786"
                        placeholder="CVC"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-brand-blue hover:bg-brand-hover text-white text-xs font-bold transition-all shadow-lg shadow-brand-blue/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Gateway Handshake...</span>
                    </div>
                  ) : (
                    <>
                      <span>Pay {currencySymbol}{finalPrice} & Unlock All 600+ Pages Instantly</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>256-Bit SSL Encrypted</span>
                </span>
                <span>•</span>
                <span>Instant Automatic Access</span>
                <span>•</span>
                <span>30-Day Money-Back Guarantee</span>
              </div>
            </>
          )}

        </div>
      </motion.div>
    </div>
  );
};
