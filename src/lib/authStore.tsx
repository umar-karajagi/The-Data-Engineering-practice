'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export type UserRole = 'super_admin' | 'admin' | 'pro_member' | 'student';
export type SubscriptionPlan = 'free_preview' | 'pro_monthly' | 'pro_annual' | 'lifetime_vault';
export type EnvironmentStage = 'DEV' | 'TESTING' | 'PROD';

export interface PurchaseRecord {
  transactionId: string;
  plan: SubscriptionPlan;
  amountPaid: number;
  currency: string;
  purchasedAt: string;
  method: 'card' | 'upi' | 'stripe' | 'coupon';
  couponApplied?: string;
  status: 'completed' | 'refunded';
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  plan: SubscriptionPlan;
  passwordHash: string;
  resetToken?: string;
  resetTokenExpiry?: number;
  joinedDate: string;
  lastLoginDate: string;
  status: 'active' | 'suspended';
  purchaseHistory: PurchaseRecord[];
  booksReadCount: number;
  videosWatchedCount: number;
}

export interface AuthContextType {
  currentUser: UserAccount | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPro: boolean;
  environment: EnvironmentStage;
  allUsers: UserAccount[];
  
  // Auth methods
  login: (email: string, password: string) => { success: boolean; message: string };
  signup: (name: string, email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  requestPasswordReset: (email: string) => { success: boolean; token?: string; message: string };
  resetPassword: (email: string, token: string, newPassword: string) => { success: boolean; message: string };
  
  // Monetization methods
  upgradeSubscription: (
    plan: SubscriptionPlan, 
    method: 'card' | 'upi' | 'stripe' | 'coupon', 
    amount: number, 
    coupon?: string
  ) => { success: boolean; transactionId: string; message: string };
  
  // Admin & Database Inspector methods
  updateUserRole: (userId: string, role: UserRole) => void;
  updateUserPlan: (userId: string, plan: SubscriptionPlan) => void;
  exportDatabaseJson: () => string;
  resetDatabaseToDefaults: () => void;
  
  // Environment Switcher
  setEnvironment: (env: EnvironmentStage) => void;
  
  // Metrics & Stats
  databaseStats: {
    totalUsers: number;
    proUsersCount: number;
    lifetimeUsersCount: number;
    totalRevenueUsd: number;
    activeSessions: number;
  };
}

const STORAGE_USERS_KEY = 'dataforge_multi_user_database_v2';
const STORAGE_CURRENT_USER_ID = 'dataforge_current_user_session_v2';
const STORAGE_ENV_KEY = 'dataforge_environment_stage_v2';

// Realistic hash simulation (safe for client-side demo persistence)
const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `sha256_${Math.abs(hash).toString(16).padStart(12, '0')}`;
};

// Default seed accounts: Founder/Super Admin, Staff Pro Member, and Free Student
const SEED_USERS: UserAccount[] = [
  {
    id: 'usr-founder-001',
    name: 'Umar Karajagi',
    email: 'umar@dataforge.io',
    role: 'super_admin',
    plan: 'lifetime_vault',
    passwordHash: hashPassword('Password123!'),
    joinedDate: '2026-01-15',
    lastLoginDate: new Date().toISOString(),
    status: 'active',
    purchaseHistory: [
      {
        transactionId: 'TXN-DF-FOUNDER-001',
        plan: 'lifetime_vault',
        amountPaid: 399,
        currency: 'USD',
        purchasedAt: '2026-01-15T09:00:00Z',
        method: 'coupon',
        couponApplied: 'FOUNDER_GENESIS',
        status: 'completed'
      }
    ],
    booksReadCount: 13,
    videosWatchedCount: 48
  },
  {
    id: 'usr-pro-002',
    name: 'Sarah Chen',
    email: 'sarah.chen@techcorp.io',
    role: 'pro_member',
    plan: 'pro_annual',
    passwordHash: hashPassword('Password123!'),
    joinedDate: '2026-02-10',
    lastLoginDate: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'active',
    purchaseHistory: [
      {
        transactionId: 'TXN-DF-ANNUAL-8492',
        plan: 'pro_annual',
        amountPaid: 199,
        currency: 'USD',
        purchasedAt: '2026-02-10T14:32:00Z',
        method: 'card',
        couponApplied: 'EARLYBIRD',
        status: 'completed'
      }
    ],
    booksReadCount: 6,
    videosWatchedCount: 22
  },
  {
    id: 'usr-pro-003',
    name: 'Alexei Ivanov',
    email: 'alexei@lakehouse.dev',
    role: 'pro_member',
    plan: 'pro_monthly',
    passwordHash: hashPassword('Password123!'),
    joinedDate: '2026-03-01',
    lastLoginDate: new Date(Date.now() - 3600000 * 18).toISOString(),
    status: 'active',
    purchaseHistory: [
      {
        transactionId: 'TXN-DF-MONTH-9104',
        plan: 'pro_monthly',
        amountPaid: 29,
        currency: 'USD',
        purchasedAt: '2026-03-01T11:20:00Z',
        method: 'stripe',
        status: 'completed'
      }
    ],
    booksReadCount: 4,
    videosWatchedCount: 15
  },
  {
    id: 'usr-free-004',
    name: 'Priya Sharma',
    email: 'priya.s@student.edu',
    role: 'student',
    plan: 'free_preview',
    passwordHash: hashPassword('Password123!'),
    joinedDate: '2026-03-12',
    lastLoginDate: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'active',
    purchaseHistory: [],
    booksReadCount: 1,
    videosWatchedCount: 5
  },
  {
    id: 'usr-free-005',
    name: 'David Miller',
    email: 'david.m@cloudanalytics.net',
    role: 'student',
    plan: 'free_preview',
    passwordHash: hashPassword('Password123!'),
    joinedDate: '2026-03-20',
    lastLoginDate: new Date(Date.now() - 3600000 * 36).toISOString(),
    status: 'active',
    purchaseHistory: [],
    booksReadCount: 2,
    videosWatchedCount: 3
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<UserAccount[]>(SEED_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>('usr-founder-001');
  const [environment, setEnvironmentState] = useState<EnvironmentStage>('PROD');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load persistent user database on mount
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem(STORAGE_USERS_KEY);
      if (savedUsers) {
        const parsed = JSON.parse(savedUsers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAllUsers(parsed);
        }
      } else {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(SEED_USERS));
      }

      const savedUserId = localStorage.getItem(STORAGE_CURRENT_USER_ID);
      if (savedUserId) {
        setCurrentUserId(savedUserId);
      }

      const savedEnv = localStorage.getItem(STORAGE_ENV_KEY) as EnvironmentStage;
      if (savedEnv && ['DEV', 'TESTING', 'PROD'].includes(savedEnv)) {
        setEnvironmentState(savedEnv);
      }
    } catch (e) {
      console.warn('Failed to load user database from localStorage', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save database mutations to localStorage
  const saveUsersToStorage = (users: UserAccount[]) => {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to persist users to localStorage', e);
    }
  };

  const currentUser = useMemo(() => {
    return allUsers.find(u => u.id === currentUserId) || null;
  }, [allUsers, currentUserId]);

  const isAuthenticated = Boolean(currentUser);
  const isAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'admin';
  const isPro = currentUser?.role === 'super_admin' || 
                currentUser?.plan === 'pro_monthly' || 
                currentUser?.plan === 'pro_annual' || 
                currentUser?.plan === 'lifetime_vault';

  // Environment Switcher
  const setEnvironment = (env: EnvironmentStage) => {
    setEnvironmentState(env);
    try {
      localStorage.setItem(STORAGE_ENV_KEY, env);
    } catch (e) {}
  };

  // Sign in
  const login = (email: string, password: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const target = allUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!target) {
      return { success: false, message: 'Account not found with this email address.' };
    }

    if (target.status === 'suspended') {
      return { success: false, message: 'This account has been suspended by system administration.' };
    }

    const hashed = hashPassword(password);
    // Allow either exact hash match or standard demo password for developer convenience
    if (target.passwordHash !== hashed && password !== 'Password123!' && password !== 'admin123') {
      return { success: false, message: 'Incorrect password. Try again or reset password.' };
    }

    const now = new Date().toISOString();
    const updatedUsers = allUsers.map(u => u.id === target.id ? { ...u, lastLoginDate: now } : u);
    setAllUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);

    setCurrentUserId(target.id);
    try {
      localStorage.setItem(STORAGE_CURRENT_USER_ID, target.id);
    } catch (e) {}

    return { success: true, message: `Welcome back, ${target.name}!` };
  };

  // Sign up
  const signup = (name: string, email: string, password: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName || cleanName.length < 2) {
      return { success: false, message: 'Please enter a valid full name.' };
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    const exists = allUsers.some(u => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, message: 'An account already exists with this email. Please sign in.' };
    }

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      role: 'student',
      plan: 'free_preview',
      passwordHash: hashPassword(password),
      joinedDate: new Date().toISOString().split('T')[0],
      lastLoginDate: new Date().toISOString(),
      status: 'active',
      purchaseHistory: [],
      booksReadCount: 0,
      videosWatchedCount: 0
    };

    const updatedUsers = [newUser, ...allUsers];
    setAllUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);

    setCurrentUserId(newUser.id);
    try {
      localStorage.setItem(STORAGE_CURRENT_USER_ID, newUser.id);
    } catch (e) {}

    return { success: true, message: `Account created successfully! Welcome to DataForge, ${cleanName}.` };
  };

  // Logout
  const logout = () => {
    setCurrentUserId('');
    try {
      localStorage.removeItem(STORAGE_CURRENT_USER_ID);
    } catch (e) {}
  };

  // Password Reset Token Request
  const requestPasswordReset = (email: string): { success: boolean; token?: string; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const target = allUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!target) {
      return { success: false, message: 'No registered user found with that email address.' };
    }

    // Generate 6-digit numeric verification token
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 15 * 60 * 1000; // 15 mins

    const updatedUsers = allUsers.map(u => 
      u.id === target.id ? { ...u, resetToken: token, resetTokenExpiry: expiry } : u
    );
    setAllUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);

    return { 
      success: true, 
      token, 
      message: `Verification code generated for ${target.email}: [${token}]. (Valid for 15 minutes)` 
    };
  };

  // Reset Password using token
  const resetPassword = (email: string, token: string, newPassword: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanToken = token.trim();

    if (newPassword.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    const target = allUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (!target) {
      return { success: false, message: 'User not found.' };
    }

    if (!target.resetToken || target.resetToken !== cleanToken) {
      return { success: false, message: 'Invalid verification code. Please check and try again.' };
    }

    if (target.resetTokenExpiry && Date.now() > target.resetTokenExpiry) {
      return { success: false, message: 'Verification code has expired. Please request a new one.' };
    }

    const newHash = hashPassword(newPassword);
    const updatedUsers = allUsers.map(u => 
      u.id === target.id ? { 
        ...u, 
        passwordHash: newHash, 
        resetToken: undefined, 
        resetTokenExpiry: undefined,
        lastLoginDate: new Date().toISOString()
      } : u
    );

    setAllUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);
    setCurrentUserId(target.id);
    try {
      localStorage.setItem(STORAGE_CURRENT_USER_ID, target.id);
    } catch (e) {}

    return { success: true, message: 'Password reset successful! You are now logged in.' };
  };

  // Upgrade Subscription / Checkout handler
  const upgradeSubscription = (
    plan: SubscriptionPlan,
    method: 'card' | 'upi' | 'stripe' | 'coupon',
    amount: number,
    coupon?: string
  ): { success: boolean; transactionId: string; message: string } => {
    if (!currentUser) {
      return { success: false, transactionId: '', message: 'Please sign in or create an account to activate subscription.' };
    }

    const transactionId = `TXN-DF-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: PurchaseRecord = {
      transactionId,
      plan,
      amountPaid: amount,
      currency: 'USD',
      purchasedAt: new Date().toISOString(),
      method,
      couponApplied: coupon,
      status: 'completed'
    };

    const newRole: UserRole = currentUser.role === 'super_admin' ? 'super_admin' : 'pro_member';

    const updatedUsers = allUsers.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          role: newRole,
          plan,
          purchaseHistory: [newRecord, ...u.purchaseHistory]
        };
      }
      return u;
    });

    setAllUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);

    return {
      success: true,
      transactionId,
      message: `Success! Your ${plan.replace('_', ' ').toUpperCase()} access is now fully active.`
    };
  };

  // Admin: Update user role
  const updateUserRole = (userId: string, role: UserRole) => {
    const updated = allUsers.map(u => u.id === userId ? { ...u, role } : u);
    setAllUsers(updated);
    saveUsersToStorage(updated);
  };

  // Admin: Update user plan
  const updateUserPlan = (userId: string, plan: SubscriptionPlan) => {
    const updated = allUsers.map(u => {
      if (u.id === userId) {
        const isProPlan = plan !== 'free_preview';
        const role: UserRole = u.role === 'super_admin' ? 'super_admin' : (isProPlan ? 'pro_member' : 'student');
        return {
          ...u,
          plan,
          role
        };
      }
      return u;
    });
    setAllUsers(updated);
    saveUsersToStorage(updated);
  };

  // Admin: Export DB JSON
  const exportDatabaseJson = (): string => {
    const data = {
      exportedAt: new Date().toISOString(),
      platform: 'DataForge Enterprise',
      version: '2.4.0',
      totalUsers: allUsers.length,
      users: allUsers.map(({ passwordHash, resetToken, resetTokenExpiry, ...safe }) => safe)
    };
    return JSON.stringify(data, null, 2);
  };

  // Reset to default seed users
  const resetDatabaseToDefaults = () => {
    setAllUsers(SEED_USERS);
    setCurrentUserId('usr-founder-001');
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(SEED_USERS));
      localStorage.setItem(STORAGE_CURRENT_USER_ID, 'usr-founder-001');
    } catch (e) {}
  };

  // Database stats calculations
  const databaseStats = useMemo(() => {
    let proCount = 0;
    let lifetimeCount = 0;
    let revenue = 0;

    for (const u of allUsers) {
      if (u.plan === 'pro_monthly' || u.plan === 'pro_annual') proCount++;
      if (u.plan === 'lifetime_vault') lifetimeCount++;
      for (const p of u.purchaseHistory) {
        if (p.status === 'completed') {
          revenue += p.amountPaid;
        }
      }
    }

    return {
      totalUsers: allUsers.length,
      proUsersCount: proCount,
      lifetimeUsersCount: lifetimeCount,
      totalRevenueUsd: revenue,
      activeSessions: Math.max(1, Math.min(allUsers.length, Math.floor(allUsers.length * 0.6)))
    };
  }, [allUsers]);

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      isAdmin,
      isPro,
      environment,
      allUsers,
      login,
      signup,
      logout,
      requestPasswordReset,
      resetPassword,
      upgradeSubscription,
      updateUserRole,
      updateUserPlan,
      exportDatabaseJson,
      resetDatabaseToDefaults,
      setEnvironment,
      databaseStats
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
