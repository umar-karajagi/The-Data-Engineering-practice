'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  Shield,
  Zap,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth, UserAccount } from '../../lib/authStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'signin' | 'signup' | 'forgot';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'signin',
  onSuccess
}) => {
  const { login, signup, requestPasswordReset, resetPassword, currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'forgot'>(initialTab);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // Sign In state
  const [signInEmail, setSignInEmail] = useState<string>('umar@dataforge.io');
  const [signInPassword, setSignInPassword] = useState<string>('Password123!');
  
  // Sign Up state
  const [signUpName, setSignUpName] = useState<string>('');
  const [signUpEmail, setSignUpEmail] = useState<string>('');
  const [signUpPassword, setSignUpPassword] = useState<string>('');
  
  // Forgot Password state
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [resetToken, setResetToken] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [generatedCodeNotification, setGeneratedCodeNotification] = useState<string | null>(null);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);

  // Status feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

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
          onSuccess?.();
          onClose();
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
          onSuccess?.();
          onClose();
        }, 700);
      } else {
        setErrorMessage(res.message);
      }
    }, 400);
  };

  const handleRequestResetToken = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = requestPasswordReset(forgotEmail);
      setIsLoading(false);
      if (res.success) {
        setGeneratedCodeNotification(res.token || null);
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
          onSuccess?.();
          onClose();
        }, 800);
      } else {
        setErrorMessage(res.message);
      }
    }, 400);
  };

  // Quick Account Login Helper for Demoing
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
          onSuccess?.();
          onClose();
        }, 500);
      } else {
        setErrorMessage(res.message);
      }
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-blue flex items-center justify-center text-white shadow-md shadow-brand-blue/30">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                DataForge Identity & Vault Access
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Secure multi-user session & enterprise credentials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 text-xs font-semibold">
          <button
            onClick={() => { setActiveTab('signin'); setErrorMessage(null); setSuccessMessage(null); }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              activeTab === 'signin'
                ? 'border-brand-blue text-brand-blue dark:text-brand-blue bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('signup'); setErrorMessage(null); setSuccessMessage(null); }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              activeTab === 'signup'
                ? 'border-brand-blue text-brand-blue dark:text-brand-blue bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => { setActiveTab('forgot'); setErrorMessage(null); setSuccessMessage(null); setForgotStep(1); }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              activeTab === 'forgot'
                ? 'border-brand-blue text-brand-blue dark:text-brand-blue bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Reset Password
          </button>
        </div>

        {/* Alerts */}
        <div className="px-6 pt-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Tab 1: SIGN IN */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignIn} className="p-6 space-y-4">
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
              className="w-full py-2.5 rounded-xl bg-brand-blue hover:bg-brand-hover text-white text-xs font-bold transition-all shadow-md shadow-brand-blue/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
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

            {/* Quick Demo Login Switcher */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                ⚡ Quick Demo Persona Switcher (Instant Test)
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => quickLoginAs('umar@dataforge.io', 'Password123!')}
                  className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold hover:bg-emerald-500/20 text-center transition-colors truncate"
                  title="Founder & Super Admin (Lifetime Vault)"
                >
                  Founder
                </button>
                <button
                  type="button"
                  onClick={() => quickLoginAs('sarah.chen@techcorp.io', 'Password123!')}
                  className="p-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold hover:bg-purple-500/20 text-center transition-colors truncate"
                  title="Staff DE (Pro Annual)"
                >
                  Pro Member
                </button>
                <button
                  type="button"
                  onClick={() => quickLoginAs('priya.s@student.edu', 'Password123!')}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold hover:bg-slate-200 dark:hover:bg-slate-700 text-center transition-colors truncate"
                  title="Student (Free Preview)"
                >
                  Free Student
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: SIGN UP */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp} className="p-6 space-y-4">
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
              By creating an account you receive Free Preview Vault access, 850+ practice questions, and sample chapters.
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-brand-blue hover:bg-brand-hover text-white text-xs font-bold transition-all shadow-md shadow-brand-blue/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
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

        {/* Tab 3: FORGOT / RESET PASSWORD */}
        {activeTab === 'forgot' && (
          <div className="p-6">
            {forgotStep === 1 ? (
              <form onSubmit={handleRequestResetToken} className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Enter your account email. We will generate a secure 6-digit one-time token to reset your password.
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
                  className="w-full py-2.5 rounded-xl bg-brand-blue hover:bg-brand-hover text-white text-xs font-bold transition-all shadow-md shadow-brand-blue/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send 6-Digit Verification Code</span>
                      <KeyRound className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmReset} className="space-y-4">
                {generatedCodeNotification && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs">
                    <div className="font-bold flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Verification Code Generated:</span>
                    </div>
                    <div className="font-mono text-base font-black tracking-widest mt-1 text-center py-1 bg-amber-500/15 rounded-lg select-all">
                      {generatedCodeNotification}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    6-Digit Verification Code
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
                    Enter New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password (min 6 chars)"
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

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                        <span>Update Password & Login</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </motion.div>
    </div>
  );
};
