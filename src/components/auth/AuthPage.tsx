'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  BookOpen,
  Terminal,
  Award,
  Database,
  Eye,
  EyeOff,
  Zap,
  Check
} from 'lucide-react';
import { useAuth } from '../../lib/authStore';

interface AuthPageProps {
  onNavigateHome: () => void;
  onNavigateLibrary: () => void;
  initialMode?: 'signin' | 'signup' | 'forgot';
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onNavigateHome,
  onNavigateLibrary,
  initialMode = 'signin'
}) => {
  const { login, signup, requestPasswordReset, resetPassword, currentUser, isAuthenticated, isPro, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Sign In inputs
  const [signInEmail, setSignInEmail] = useState<string>('umar@dataforge.io');
  const [signInPassword, setSignInPassword] = useState<string>('Password123!');

  // Sign Up inputs
  const [signUpName, setSignUpName] = useState<string>('');
  const [signUpEmail, setSignUpEmail] = useState<string>('');
  const [signUpPassword, setSignUpPassword] = useState<string>('');

  // Forgot password inputs
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [resetToken, setResetToken] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);

  // Status indicators
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = login(signInEmail, signInPassword);
      setIsLoading(false);
      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          onNavigateLibrary();
        }, 600);
      } else {
        setErrorMessage(res.message);
      }
    }, 350);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = signup(signUpName, signUpEmail, signUpPassword);
      setIsLoading(false);
      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          onNavigateLibrary();
        }, 700);
      } else {
        setErrorMessage(res.message);
      }
    }, 400);
  };

  const handleRequestToken = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = requestPasswordReset(forgotEmail);
      setIsLoading(false);
      if (res.success) {
        setGeneratedCode(res.token || null);
        setResetToken(res.token || '');
        setSuccessMessage(res.message);
        setForgotStep(2);
      } else {
        setErrorMessage(res.message);
      }
    }, 350);
  };

  const handleConfirmReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = resetPassword(forgotEmail, resetToken, newPassword);
      setIsLoading(false);
      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          onNavigateHome();
        }, 800);
      } else {
        setErrorMessage(res.message);
      }
    }, 400);
  };

  const quickLoginAs = (email: string, pass: string) => {
    setSignInEmail(email);
    setSignInPassword(pass);
    setErrorMessage(null);
    setIsLoading(true);
    setTimeout(() => {
      const res = login(email, pass);
      setIsLoading(false);
      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          onNavigateLibrary();
        }, 500);
      } else {
        setErrorMessage(res.message);
      }
    }, 250);
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Left Side: Brand Showcase & Indian Engineering Community */}
        <div className="lg:col-span-5 p-8 sm:p-10 bg-gradient-to-br from-[#02130C] via-[#041F14] to-[#010906] text-white flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-emerald-900/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-black font-black shadow-lg shadow-emerald-500/30">
                DF
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white">DataForge Vault</span>
                <span className="text-[10px] font-mono block text-emerald-400">Identity & Access Manager</span>
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                Your Gateway to Staff Data Engineering Mastery
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-emerald-300/80 leading-relaxed">
                Join thousands of senior data engineers across India and globally learning Medallion lakehouses, 3D literature, and real-world architectures.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-emerald-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>13 Classical Data Engineering Books (600+ Real Pages)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-emerald-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>850+ Company-Tagged Problems with DuckDB WASM</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-emerald-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero-Download Vault DRM Protection</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-emerald-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>UPI (GPay / PhonePe) & Rupee Pricing Supported</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 mt-6 border-t border-emerald-900/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-800 border border-emerald-600 flex items-center justify-center text-xs font-bold text-white">
                UK
              </div>
              <div>
                <p className="text-xs font-bold text-white">Umar Karajagi</p>
                <p className="text-[11px] text-emerald-400 font-mono">Founder & Lead Platform Architect</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          
          {/* If already authenticated, show logged-in state */}
          {isAuthenticated && currentUser ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto border-2 border-emerald-500 font-black text-xl">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-50">
                  You are signed in as {currentUser.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  {currentUser.email} • Tier: <strong className="text-emerald-500 uppercase">{currentUser.plan.replace('_', ' ')}</strong>
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={onNavigateLibrary}
                  className="px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-hover text-white text-xs font-bold transition-all shadow-md shadow-brand-blue/30 cursor-pointer flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Open 3D Vault Library</span>
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Tab Selector */}
              <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold mb-6">
                <button
                  onClick={() => { setActiveTab('signin'); setErrorMessage(null); setSuccessMessage(null); }}
                  className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'signin'
                      ? 'bg-white dark:bg-slate-900 text-brand-blue shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setActiveTab('signup'); setErrorMessage(null); setSuccessMessage(null); }}
                  className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'signup'
                      ? 'bg-white dark:bg-slate-900 text-brand-blue shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Create Account
                </button>
                <button
                  onClick={() => { setActiveTab('forgot'); setErrorMessage(null); setSuccessMessage(null); setForgotStep(1); }}
                  className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'forgot'
                      ? 'bg-white dark:bg-slate-900 text-brand-blue shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Reset Password
                </button>
              </div>

              {/* Feedback Notifications */}
              {errorMessage && (
                <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
              {successMessage && (
                <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* TAB 1: SIGN IN */}
              {activeTab === 'signin' && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-blue"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => { setActiveTab('forgot'); setForgotEmail(signInEmail); }}
                        className="text-[11px] text-brand-blue hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-blue"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-brand-blue hover:bg-brand-hover text-white text-xs font-bold transition-all shadow-md shadow-brand-blue/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In to Vault</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Instant Demo Persona Switcher */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      ⚡ Quick Test Personas (One-Click Sign In)
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => quickLoginAs('umar@dataforge.io', 'Password123!')}
                        className="p-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold hover:bg-emerald-500/20 text-center transition-colors truncate"
                      >
                        Founder Umar
                      </button>
                      <button
                        type="button"
                        onClick={() => quickLoginAs('sarah.chen@techcorp.io', 'Password123!')}
                        className="p-2 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold hover:bg-purple-500/20 text-center transition-colors truncate"
                      >
                        Pro Sarah
                      </button>
                      <button
                        type="button"
                        onClick={() => quickLoginAs('priya.s@student.edu', 'Password123!')}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold hover:bg-slate-200 dark:hover:bg-slate-700 text-center transition-colors truncate"
                      >
                        Student Priya
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 2: SIGN UP */}
              {activeTab === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-blue"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Work or Academic Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-blue"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Create Password (min. 6 chars)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-blue"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    By registering you instantly receive Free Student Vault access, 850+ coding problems, and sample book chapters.
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-brand-blue hover:bg-brand-hover text-white text-xs font-bold transition-all shadow-md shadow-brand-blue/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Create Free Account</span>
                        <Sparkles className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* TAB 3: FORGOT PASSWORD */}
              {activeTab === 'forgot' && (
                <div className="space-y-4">
                  {forgotStep === 1 ? (
                    <form onSubmit={handleRequestToken} className="space-y-4">
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Enter your registered account email. A 6-digit OTP verification token will be generated to reset your credentials.
                      </p>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Account Email
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            placeholder="e.g. umar@dataforge.io"
                            className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-blue"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-xl bg-brand-blue hover:bg-brand-hover text-white text-xs font-bold transition-all shadow-md shadow-brand-blue/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Generate 6-Digit OTP</span>
                            <KeyRound className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleConfirmReset} className="space-y-4">
                      {generatedCode && (
                        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs">
                          <div className="font-bold flex items-center gap-1.5">
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>Verification OTP Code:</span>
                          </div>
                          <div className="font-mono text-lg font-black tracking-widest mt-1 text-center py-1.5 bg-amber-500/15 rounded-xl select-all">
                            {generatedCode}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          6-Digit OTP Code
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={resetToken}
                          onChange={(e) => setResetToken(e.target.value)}
                          placeholder="123456"
                          className="w-full px-3 py-2 text-center tracking-widest font-mono text-base font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-blue"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          New Password
                        </label>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New password (min 6 chars)"
                          className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-blue"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setForgotStep(1)}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-hover text-white text-xs font-bold transition-all shadow-md shadow-brand-blue/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                        >
                          {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <span>Reset Password & Sign In</span>
                              <CheckCircle2 className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
};
