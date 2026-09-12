'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { LandingPage } from '../components/landing/LandingPage';
import { WindingRoadmap } from '../components/roadmap/WindingRoadmap';
import { SplitScreenArena } from '../components/practice/SplitScreenArena';
import { TopicTracker } from '../components/tracker/TopicTracker';
import { LibraryView } from '../components/books/LibraryView';
import { DeveloperDashboard } from '../components/dashboard/DeveloperDashboard';

const STORAGE_KEY = 'dataforge_master_state_v1';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'landing' | 'roadmap' | 'practice' | 'tracker' | 'books' | 'dashboard'>('landing');
  
  // Gamification & Progress State
  const [xp, setXp] = useState<number>(450);
  const [streak, setStreak] = useState<number>(5);
  const [completedCheckpoints, setCompletedCheckpoints] = useState<string[]>(['cp-1', 'cp-2']);
  const [bookmarkedCheckpoints, setBookmarkedCheckpoints] = useState<string[]>(['cp-6']);
  const [targetPracticeId, setTargetPracticeId] = useState<string | undefined>(undefined);
  const [targetBookId, setTargetBookId] = useState<string | undefined>(undefined);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.xp) setXp(parsed.xp);
        if (parsed.streak) setStreak(parsed.streak);
        if (parsed.completedCheckpoints) setCompletedCheckpoints(parsed.completedCheckpoints);
        if (parsed.bookmarkedCheckpoints) setBookmarkedCheckpoints(parsed.bookmarkedCheckpoints);
      }
    } catch (e) {
      console.error('Failed to load DataForge state', e);
    }
  }, []);

  // Save to LocalStorage
  const saveState = (newXp: number, newCheckpoints: string[], newBookmarks: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        xp: newXp,
        streak,
        completedCheckpoints: newCheckpoints,
        bookmarkedCheckpoints: newBookmarks,
      }));
    } catch (e) {
      console.error('Failed to save state', e);
    }
  };

  const handleAddXP = (amount: number) => {
    const updated = xp + amount;
    setXp(updated);
    saveState(updated, completedCheckpoints, bookmarkedCheckpoints);
  };

  const handleToggleComplete = (id: string) => {
    const exists = completedCheckpoints.includes(id);
    const updated = exists ? completedCheckpoints.filter(c => c !== id) : [...completedCheckpoints, id];
    const newXp = exists ? xp : xp + 100;
    setCompletedCheckpoints(updated);
    setXp(newXp);
    saveState(newXp, updated, bookmarkedCheckpoints);
  };

  const handleToggleBookmark = (id: string) => {
    const exists = bookmarkedCheckpoints.includes(id);
    const updated = exists ? bookmarkedCheckpoints.filter(c => c !== id) : [...bookmarkedCheckpoints, id];
    setBookmarkedCheckpoints(updated);
    saveState(xp, completedCheckpoints, updated);
  };

  const handleNavigatePractice = (practiceId: string) => {
    setTargetPracticeId(practiceId);
    setActiveTab('practice');
  };

  const handleNavigateBook = (bookId: string) => {
    setTargetBookId(bookId);
    setActiveTab('books');
  };

  return (
    <div className="min-h-screen bg-forge-bg text-forge-text flex flex-col justify-between selection:bg-track-sql selection:text-white">
      
      {/* Top Sticky Nav */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        xp={xp}
        streak={streak}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {activeTab === 'landing' && (
          <LandingPage onNavigate={(tab) => setActiveTab(tab)} />
        )}

        {activeTab === 'roadmap' && (
          <WindingRoadmap
            completedIds={completedCheckpoints}
            bookmarkedIds={bookmarkedCheckpoints}
            onToggleComplete={handleToggleComplete}
            onToggleBookmark={handleToggleBookmark}
            onNavigatePractice={handleNavigatePractice}
            onNavigateBook={handleNavigateBook}
          />
        )}

        {activeTab === 'practice' && (
          <SplitScreenArena 
            onAddXP={handleAddXP}
            initialQuestionId={targetPracticeId}
          />
        )}

        {activeTab === 'tracker' && (
          <TopicTracker 
            onNavigateBook={handleNavigateBook}
          />
        )}

        {activeTab === 'books' && (
          <LibraryView 
            onNavigatePractice={handleNavigatePractice}
            initialBookId={targetBookId}
            onAddXP={handleAddXP}
          />
        )}

        {activeTab === 'dashboard' && (
          <DeveloperDashboard
            xp={xp}
            streak={streak}
            completedCheckpointsCount={completedCheckpoints.length}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer />

    </div>
  );
}
