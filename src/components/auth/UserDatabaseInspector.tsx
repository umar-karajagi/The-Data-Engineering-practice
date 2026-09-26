'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  Download, 
  RotateCcw, 
  X, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight,
  UserCheck,
  CreditCard,
  Calendar,
  Lock,
  DollarSign,
  TrendingUp,
  KeyRound,
  FileJson
} from 'lucide-react';
import { useAuth, UserAccount, UserRole, SubscriptionPlan } from '../../lib/authStore';

interface UserDatabaseInspectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserDatabaseInspector: React.FC<UserDatabaseInspectorProps> = ({
  isOpen,
  onClose
}) => {
  const { 
    allUsers, 
    currentUser, 
    databaseStats, 
    updateUserPlan, 
    updateUserRole, 
    exportDatabaseJson, 
    resetDatabaseToDefaults,
    requestPasswordReset
  } = useAuth();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    return allUsers.filter(u => {
      const matchesSearch = 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesPlan = planFilter === 'all' || u.plan === planFilter;

      return matchesSearch && matchesRole && matchesPlan;
    });
  }, [allUsers, searchTerm, roleFilter, planFilter]);

  if (!isOpen) return null;

  const handleExportJson = () => {
    const jsonStr = exportDatabaseJson();
    navigator.clipboard.writeText(jsonStr);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);

    // Also trigger file download
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dataforge-users-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetUserPassword = (email: string) => {
    const res = requestPasswordReset(email);
    if (res.success) {
      setActionSuccessMessage(`Generated reset code [${res.token}] for ${email}`);
      setTimeout(() => setActionSuccessMessage(null), 5000);
    }
  };

  const handlePlanChange = (userId: string, newPlan: SubscriptionPlan) => {
    updateUserPlan(userId, newPlan);
    setActionSuccessMessage(`Updated subscription plan to ${newPlan.replace('_', ' ').toUpperCase()}`);
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/15 text-rose-500 border border-rose-500/30">SUPER ADMIN</span>;
      case 'admin':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">ADMIN</span>;
      case 'pro_member':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">PRO MEMBER</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">STUDENT</span>;
    }
  };

  const getPlanBadge = (plan: SubscriptionPlan) => {
    switch (plan) {
      case 'lifetime_vault':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">LIFETIME VAULT</span>;
      case 'pro_annual':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">PRO ANNUAL ($199)</span>;
      case 'pro_monthly':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">PRO MONTH ($29)</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">FREE PREVIEW</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-6xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-blue flex items-center justify-center text-white shadow-lg shadow-brand-blue/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-slate-50 tracking-tight">
                  DataForge User Database & Revenue Console
                </h2>
                <span className="px-2 py-0.5 rounded bg-brand-blue/15 text-brand-blue text-[10px] font-mono font-bold">
                  v2.4 Relational
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live multi-user registry, authentication audit log & monetization manager
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-sm"
              title="Download database snapshot as JSON"
            >
              <FileJson className="w-3.5 h-3.5 text-brand-blue" />
              <span>{copiedJson ? 'Copied & Downloaded!' : 'Export DB (JSON)'}</span>
            </button>
            <button
              onClick={resetDatabaseToDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
              title="Reset database to default seed state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Seeds</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Notification Bar */}
        {actionSuccessMessage && (
          <div className="px-6 py-2 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}

        {/* Top Metric Cards */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Total Registered Users</span>
              <Users className="w-4 h-4 text-brand-blue" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-50">
              {databaseStats.totalUsers}
            </div>
            <div className="mt-1 text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{databaseStats.activeSessions} active sessions today</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Paid Subscriptions</span>
              <UserCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-50">
              {databaseStats.proUsersCount + databaseStats.lifetimeUsersCount}
            </div>
            <div className="mt-1 text-[11px] text-purple-400 font-semibold">
              {databaseStats.lifetimeUsersCount} Lifetime • {databaseStats.proUsersCount} Pro
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Gross Platform Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-500">
              ${databaseStats.totalRevenueUsd.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              Instant payouts via Stripe / UPI
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Relational Storage Health</span>
              <ShieldCheck className="w-4 h-4 text-brand-blue" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-50">
              100%
            </div>
            <div className="mt-1 text-[11px] text-emerald-400 font-semibold">
              ACID State Sync & SHA256 Hashing
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or user ID..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-brand-blue"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="pro_member">Pro Member</option>
              <option value="student">Student</option>
            </select>

            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-brand-blue"
            >
              <option value="all">All Plans</option>
              <option value="lifetime_vault">Lifetime Vault</option>
              <option value="pro_annual">Pro Annual</option>
              <option value="pro_monthly">Pro Monthly</option>
              <option value="free_preview">Free Preview</option>
            </select>
          </div>
        </div>

        {/* User Database Table */}
        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-3">User & Email</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Access Tier</th>
                <th className="pb-3">Activity</th>
                <th className="pb-3">Total Spend</th>
                <th className="pb-3 pr-3 text-right">Actions / Overrides</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredUsers.map((u) => {
                const totalSpend = u.purchaseHistory.reduce((sum, p) => sum + (p.status === 'completed' ? p.amountPaid : 0), 0);
                const isCurrent = currentUser?.id === u.id;

                return (
                  <tr key={u.id} className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${isCurrent ? 'bg-brand-blue/5 dark:bg-brand-blue/10' : ''}`}>
                    <td className="py-3 pl-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 shrink-0 text-xs">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {isCurrent && (
                              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-brand-blue/20 text-brand-blue">
                                (You)
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3">
                      {getRoleBadge(u.role)}
                    </td>

                    <td className="py-3">
                      {getPlanBadge(u.plan)}
                    </td>

                    <td className="py-3 text-slate-500 dark:text-slate-400 text-[11px]">
                      <div>Joined: {u.joinedDate}</div>
                      <div className="text-[10px] text-slate-400">
                        {u.booksReadCount} books • {u.videosWatchedCount} videos
                      </div>
                    </td>

                    <td className="py-3 font-semibold text-slate-900 dark:text-slate-200">
                      ${totalSpend}
                    </td>

                    <td className="py-3 pr-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <select
                          value={u.plan}
                          onChange={(e) => handlePlanChange(u.id, e.target.value as SubscriptionPlan)}
                          className="px-2 py-1 text-[11px] rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none"
                        >
                          <option value="free_preview">Set Free</option>
                          <option value="pro_monthly">Set Pro Monthly</option>
                          <option value="pro_annual">Set Pro Annual</option>
                          <option value="lifetime_vault">Set Lifetime Vault</option>
                        </select>

                        <button
                          onClick={() => handleResetUserPassword(u.email)}
                          className="p-1 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
                          title="Generate reset code for user"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              No registered users matched your search criteria.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div>
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredUsers.length}</strong> of <strong className="text-slate-800 dark:text-slate-200">{allUsers.length}</strong> registered platform accounts
          </div>
          <div>
            DataForge Enterprise • Multi-User Persistence Enabled
          </div>
        </div>

      </motion.div>
    </div>
  );
};
