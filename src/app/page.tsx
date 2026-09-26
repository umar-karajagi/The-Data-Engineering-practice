'use client';

import React, { useState } from 'react';
import { UserStoreProvider, useUserStore } from '../lib/userStore';
import { AuthProvider, useAuth } from '../lib/authStore';
import { DataVedaNavbar } from '../components/layout/DataVedaNavbar';
import { DataVedaFooter } from '../components/layout/DataVedaFooter';
import { DataVedaHome } from '../components/dataveda/DataVedaHome';
import { DataVedaTracks } from '../components/dataveda/DataVedaTracks';
import { DataVedaPractice } from '../components/dataveda/DataVedaPractice';
import { DataVedaProjects } from '../components/dataveda/DataVedaProjects';
import { DataVedaResources } from '../components/dataveda/DataVedaResources';
import { DataVedaPricing } from '../components/dataveda/DataVedaPricing';
import { LibraryView } from '../components/books/LibraryView';
import { VideoMasterclassModal } from '../components/videos/VideoMasterclassModal';
import { CuratedVideo, HERO_MASTERCLASS_VIDEO } from '../content/videos/curatedVideos';
import { AuthModal } from '../components/auth/AuthModal';
import { UserDatabaseInspector } from '../components/auth/UserDatabaseInspector';
import { QaTestingTracker } from '../components/enterprise/QaTestingTracker';
import { SentinelMonitorBot } from '../components/enterprise/SentinelMonitorBot';

type ActiveTab = 
  | 'home'
  | 'tracks'
  | 'practice'
  | 'projects'
  | 'library'
  | 'resources'
  | 'pricing';

function DataVedaApp() {
  const { user, addXP } = useUserStore();
  const { currentUser, isPro } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeVideoModal, setActiveVideoModal] = useState<CuratedVideo | null>(null);

  // Enterprise Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isDatabaseInspectorOpen, setIsDatabaseInspectorOpen] = useState<boolean>(false);
  const [isQaTrackerOpen, setIsQaTrackerOpen] = useState<boolean>(false);

  const handleNavigateTab = (tab: string) => {
    setActiveTab(tab as ActiveTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col justify-between selection:bg-brand-blue selection:text-white transition-colors duration-200">
      
      {/* 1. Global DataVeda Navigation with Auth & Environment Integration */}
      <DataVedaNavbar
        activeTab={activeTab}
        onNavigateTab={handleNavigateTab}
        onOpenHeroVideo={() => setActiveVideoModal(HERO_MASTERCLASS_VIDEO)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenDatabaseInspector={() => setIsDatabaseInspectorOpen(true)}
        onOpenQaTracker={() => setIsQaTrackerOpen(true)}
      />

      {/* 2. Main Page Views */}
      <main className="flex-1 pt-20 pb-16">
        
        {/* VIEW 1: HOME (Exact 13 Sections Clone of DataVidhya) */}
        {activeTab === 'home' && (
          <DataVedaHome
            onOpenVideo={(video) => setActiveVideoModal(video)}
            onNavigateTab={handleNavigateTab}
            onOpenAssessment={() => handleNavigateTab('practice')}
            onSelectCourse={() => handleNavigateTab('tracks')}
          />
        )}

        {/* VIEW 2: CAREER TRACKS (Data Engineer, Analytics Engineer, Data Analyst) */}
        {activeTab === 'tracks' && (
          <DataVedaTracks
            onOpenVideo={(video) => setActiveVideoModal(video)}
          />
        )}

        {/* VIEW 3: PRACTICE (850+ Company-Tagged Coding Problems + DuckDB WASM Runner) */}
        {activeTab === 'practice' && (
          <DataVedaPractice />
        )}

        {/* VIEW 4: PROJECTS (Real-World End-to-End Production Portfolios) */}
        {activeTab === 'projects' && (
          <DataVedaProjects
            onOpenVideo={(video) => setActiveVideoModal(video)}
          />
        )}

        {/* VIEW 5: THE LIBRARY (Our 600+ Page 3D Vault) */}
        {activeTab === 'library' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <LibraryView
              onAddXP={addXP}
            />
          </div>
        )}

        {/* VIEW 6: RESOURCES (100+ Interview Questions Bank & Tech Guides) */}
        {activeTab === 'resources' && (
          <DataVedaResources />
        )}

        {/* VIEW 7: PRICING (Commercial SaaS Tiers & Lifetime Vault Access) */}
        {activeTab === 'pricing' && (
          <DataVedaPricing />
        )}

      </main>

      {/* 3. Global DataVeda Footer */}
      <DataVedaFooter 
        onNavigateTab={handleNavigateTab}
      />

      {/* 4. Global Full-Screen Video Masterclass Modal */}
      {activeVideoModal && (
        <VideoMasterclassModal
          video={activeVideoModal}
          onClose={() => setActiveVideoModal(null)}
          onSelectOtherVideo={(v) => setActiveVideoModal(v)}
        />
      )}

      {/* 5. Enterprise Sentinel Watchdog Bot */}
      <SentinelMonitorBot />

      {/* 6. Multi-User Authentication Modal (Sign In, Sign Up, Forgot Password) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* 7. Admin & Multi-User Database Inspector Console */}
      <UserDatabaseInspector
        isOpen={isDatabaseInspectorOpen}
        onClose={() => setIsDatabaseInspectorOpen(false)}
      />

      {/* 8. MNC QA Testing Tracker & Release Pipeline (DEV -> TESTING -> PROD) */}
      <QaTestingTracker
        isOpen={isQaTrackerOpen}
        onClose={() => setIsQaTrackerOpen(false)}
      />

    </div>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <UserStoreProvider>
        <DataVedaApp />
      </UserStoreProvider>
    </AuthProvider>
  );
}
