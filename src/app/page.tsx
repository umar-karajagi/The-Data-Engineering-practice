'use client';

import React, { useState, useEffect } from 'react';
import { UserStoreProvider, useUserStore } from '../lib/userStore';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { DataVidhyaNavbar } from '../components/layout/DataVidhyaNavbar';
import { DataVidhyaFooter } from '../components/layout/DataVidhyaFooter';
import { DataVidhyaHome } from '../components/datavidhya/DataVidhyaHome';
import { VideoMasterclassModal } from '../components/videos/VideoMasterclassModal';
import { CuratedVideo, HERO_MASTERCLASS_VIDEO, getCuratedVideoById } from '../content/videos/curatedVideos';
import { LandingPage } from '../components/landing/LandingPage';
import { DeveloperDashboard } from '../components/dashboard/DeveloperDashboard';
import { TracksView } from '../components/tracks/TracksView';
import { LibraryView } from '../components/books/LibraryView';
import { WindingRoadmap } from '../components/roadmap/WindingRoadmap';
import { NotesView } from '../components/notes/NotesView';
import { TodosView } from '../components/todos/TodosView';
import { CertificatesView } from '../components/certificates/CertificatesView';
import { ProfileView } from '../components/profile/ProfileView';
import { QuickNoteModal } from '../components/notes/QuickNoteModal';
import { CatalogView } from '../components/catalog/CatalogView';
import { CourseDetailView } from '../components/courses/CourseDetailView';
import { LessonPlayer } from '../components/learning/LessonPlayer';
import { PlacementDiagnosticModal } from '../components/diagnostics/PlacementDiagnosticModal';
import { CareerStudioView } from '../components/career-studio/CareerStudioView';
import { ContentRef, LinkedRef } from '../types';

type ActiveTab = 
  | 'home'
  | 'dashboard'
  | 'catalog'
  | 'course-detail'
  | 'lesson-player'
  | 'career-studio'
  | 'tracks'
  | 'vault'
  | 'roadmap'
  | 'notes'
  | 'todos'
  | 'certificates'
  | 'profile'
  | 'landing';

const ROADMAP_STORAGE_KEY = 'dataforge_roadmap_state_v2';

function DataForgeMasterApp() {
  const { user, addXP } = useUserStore();
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeVideoModal, setActiveVideoModal] = useState<CuratedVideo | null>(null);

  // Selected Course and Lesson for Interactive Learning Flow
  const [selectedCourseId, setSelectedCourseId] = useState<string>('SF-04');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('sf-04-l1');

  // Placement Diagnostic Modal State
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState<boolean>(false);
  const [diagnosticCourseId, setDiagnosticCourseId] = useState<string>('SF-04');

  // Deep link targets across legacy sections
  const [targetTrackId, setTargetTrackId] = useState<string | undefined>(undefined);
  const [targetBookId, setTargetBookId] = useState<string | undefined>(undefined);

  // Roadmap completion and bookmark state
  const [completedRoadmapIds, setCompletedRoadmapIds] = useState<string[]>([
    'node-linux', 
    'node-git', 
    'node-sql-fund'
  ]);
  const [bookmarkedRoadmapIds, setBookmarkedRoadmapIds] = useState<string[]>([
    'node-spark-distributed',
    'node-security-iam'
  ]);

  // Global Quick Note Modal State
  const [isQuickNoteOpen, setIsQuickNoteOpen] = useState<boolean>(false);
  const [quickNoteRef, setQuickNoteRef] = useState<ContentRef | undefined>(undefined);

  // Load roadmap local state
  useEffect(() => {
    try {
      const saved = localStorage.getItem(ROADMAP_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.completed) setCompletedRoadmapIds(parsed.completed);
        if (parsed.bookmarked) setBookmarkedRoadmapIds(parsed.bookmarked);
      }
    } catch (e) {
      console.warn('Failed to load roadmap state', e);
    }
  }, []);

  // Save roadmap local state
  const saveRoadmapState = (completed: string[], bookmarked: string[]) => {
    try {
      localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify({
        completed,
        bookmarked
      }));
    } catch (e) {
      console.warn('Failed to save roadmap state', e);
    }
  };

  const handleToggleRoadmapComplete = (id: string) => {
    const exists = completedRoadmapIds.includes(id);
    const updated = exists 
      ? completedRoadmapIds.filter(c => c !== id) 
      : [...completedRoadmapIds, id];
    setCompletedRoadmapIds(updated);
    if (!exists) {
      addXP(100);
    }
    saveRoadmapState(updated, bookmarkedRoadmapIds);
  };

  const handleToggleRoadmapBookmark = (id: string) => {
    const exists = bookmarkedRoadmapIds.includes(id);
    const updated = exists 
      ? bookmarkedRoadmapIds.filter(c => c !== id) 
      : [...bookmarkedRoadmapIds, id];
    setBookmarkedRoadmapIds(updated);
    saveRoadmapState(completedRoadmapIds, updated);
  };

  // Catalog and Course Handlers
  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setActiveTab('course-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPath = (pathId: string) => {
    setSelectedCourseId(pathId);
    setActiveTab('course-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartLesson = (courseId: string, lessonId: string) => {
    setSelectedCourseId(courseId);
    setSelectedLessonId(lessonId);
    setActiveTab('lesson-player');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDiagnostic = (courseId: string) => {
    setDiagnosticCourseId(courseId);
    setIsDiagnosticModalOpen(true);
  };

  // Cross-Navigation Handlers
  const handleNavigateTrack = (trackId: string, _tierNumber?: number) => {
    setTargetTrackId(trackId);
    setActiveTab('tracks');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateBook = (bookId: string) => {
    setTargetBookId(bookId);
    setActiveTab('vault');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToContent = (contentRef: ContentRef) => {
    if (contentRef.type === 'track_module' || contentRef.type === 'track_capstone') {
      handleNavigateTrack(contentRef.trackId || 'sql');
    } else if (contentRef.type === 'library_chapter' || contentRef.type === 'book_page') {
      handleNavigateBook(contentRef.bookId || 'kimball-dwt');
    } else if (contentRef.type === 'roadmap_node') {
      setActiveTab('roadmap');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateToTarget = (linkedRef: LinkedRef) => {
    if (linkedRef.type === 'track' || linkedRef.type === 'module') {
      // Check if it's a course format like SF-*
      if (linkedRef.id?.startsWith('SF-') || linkedRef.targetId?.startsWith('SF-')) {
        handleSelectCourse(linkedRef.targetId || linkedRef.id || 'SF-04');
      } else {
        handleNavigateTrack(linkedRef.trackId || linkedRef.targetId || linkedRef.id || 'sql');
      }
    } else if (linkedRef.type === 'book') {
      handleNavigateBook(linkedRef.bookId || linkedRef.targetId || linkedRef.id || 'kimball-dwt');
    } else if (linkedRef.type === 'roadmap_node') {
      setActiveTab('roadmap');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (linkedRef.type === 'url' && linkedRef.url) {
      window.open(linkedRef.url, '_blank');
    }
  };

  const handleOpenQuickNote = (contentRef?: ContentRef) => {
    setQuickNoteRef(contentRef);
    setIsQuickNoteOpen(true);
  };

  return (
    <div className="min-h-screen bg-forge-bg text-forge-text flex flex-col justify-between selection:bg-track-sql selection:text-white">
      
      {/* 1. Global Sticky Navigation */}
      <DataVidhyaNavbar
        activeTab={activeTab}
        onNavigateTab={(tab: string) => {
          setActiveTab(tab as ActiveTab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAssessment={() => handleOpenDiagnostic('SF-04')}
        onOpenHeroVideo={() => setActiveVideoModal(HERO_MASTERCLASS_VIDEO)}
      />

      {/* 2. Main Canonical Views Router */}
      <main className="flex-1 pb-16">
        
        {/* VIEW 0: DATAVIDHYA HOMEPAGE (13 CANONICAL SECTIONS + YOUTUBE MASTERCLASSES) */}
        {activeTab === 'home' && (
          <DataVidhyaHome
            onOpenVideo={(video) => setActiveVideoModal(video)}
            onNavigateTab={(tab) => {
              setActiveTab(tab as ActiveTab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAssessment={() => handleOpenDiagnostic('SF-04')}
            onSelectCourse={handleSelectCourse}
          />
        )}

        {/* VIEW 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <DeveloperDashboard
            onNavigateTab={(tab) => {
              setActiveTab(tab as ActiveTab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateTrack={handleNavigateTrack}
            onNavigateBook={handleNavigateBook}
            onNavigateToContent={handleNavigateToContent}
            onNavigateToTarget={handleNavigateToTarget}
            onNavigateCourse={handleSelectCourse}
            onNavigateLesson={handleStartLesson}
            onOpenQuickNote={() => handleOpenQuickNote()}
          />
        )}

        {/* VIEW 2: FOUNDRY CATALOG (30 PRODUCTS: 25 SKILL COURSES & 5 CAREER PATHS) */}
        {activeTab === 'catalog' && (
          <CatalogView
            onSelectCourse={handleSelectCourse}
            onSelectPath={handleSelectPath}
            onStartLesson={handleStartLesson}
          />
        )}

        {/* VIEW 3: COURSE OR PATH DETAIL VIEW (9 CANONICAL SECTIONS) */}
        {activeTab === 'course-detail' && (
          <CourseDetailView
            productId={selectedCourseId}
            onBack={() => setActiveTab('catalog')}
            onStartLesson={handleStartLesson}
            onOpenDiagnostic={handleOpenDiagnostic}
            onSelectCourse={handleSelectCourse}
          />
        )}

        {/* VIEW 4: LESSON PLAYER (MICRO-LOOP: CONCEPT -> EXERCISE -> CHECK) */}
        {activeTab === 'lesson-player' && (
          <LessonPlayer
            courseId={selectedCourseId}
            lessonId={selectedLessonId}
            onBackToCourse={() => setActiveTab('course-detail')}
            onNavigateLesson={(nextLId) => setSelectedLessonId(nextLId)}
            onOpenDiagnostic={() => handleOpenDiagnostic(selectedCourseId)}
          />
        )}

        {/* VIEW 5: CAREER STUDIO & RESUMECRAFT (8 WORKBENCH TOOLS) */}
        {activeTab === 'career-studio' && (
          <CareerStudioView
            onNavigateCourse={handleSelectCourse}
          />
        )}

        {/* VIEW 6: TRACKS (GATED PROGRESSION + EMBEDDED PRACTICE ARENA) */}
        {activeTab === 'tracks' && (
          <TracksView
            initialTrackId={targetTrackId || 'sql'}
            onOpenQuickNote={handleOpenQuickNote}
          />
        )}

        {/* VIEW 7: THE VAULT (LIBRARY WITH 11 CATEGORIES & PDF READER) */}
        {activeTab === 'vault' && (
          <LibraryView
            initialBookId={targetBookId}
            onNavigatePractice={(practiceId) => {
              setTargetTrackId(practiceId);
              setActiveTab('tracks');
            }}
            onAddXP={addXP}
            onOpenQuickNote={handleOpenQuickNote}
          />
        )}

        {/* VIEW 8: ROADMAP (4 LEVELED LEGS: ASSOCIATE, MID, SENIOR, STAFF ARCHITECT) */}
        {activeTab === 'roadmap' && (
          <WindingRoadmap
            completedIds={completedRoadmapIds}
            bookmarkedIds={bookmarkedRoadmapIds}
            onToggleComplete={handleToggleRoadmapComplete}
            onToggleBookmark={handleToggleRoadmapBookmark}
            onNavigateTrack={handleNavigateTrack}
            onNavigateBook={handleNavigateBook}
            onOpenQuickNote={handleOpenQuickNote}
          />
        )}

        {/* VIEW 9: NOTES (GENERAL + ATTACHED POLYMORPHIC NOTES & TAG FILTERS) */}
        {activeTab === 'notes' && (
          <NotesView
            onNavigateToContent={handleNavigateToContent}
            onOpenQuickNote={() => handleOpenQuickNote()}
          />
        )}

        {/* VIEW 10: TODOS (PERSONAL TASK LIST LINKED TO TRACKS/MODULES/BOOKS) */}
        {activeTab === 'todos' && (
          <TodosView
            onNavigateToTarget={handleNavigateToTarget}
          />
        )}

        {/* VIEW 11: CERTIFICATES & BADGES (VERIFIED CREDENTIALS & ACHIEVEMENTS) */}
        {activeTab === 'certificates' && (
          <CertificatesView
            onNavigateTrack={handleNavigateTrack}
          />
        )}

        {/* VIEW 12: PROFILE & SETTINGS (ACCOUNT, EXPORT BACKUP, THEME, DEMO RESET) */}
        {activeTab === 'profile' && (
          <ProfileView />
        )}

        {/* VIEW 13: OPTIONAL LANDING OVERVIEW */}
        {activeTab === 'landing' && (
          <LandingPage
            onNavigate={(tab) => {
              const mappedTab: ActiveTab = 
                tab === 'practice' ? 'tracks' : 
                tab === 'tracker' ? 'roadmap' : 
                tab === 'books' ? 'vault' : 
                (tab as ActiveTab);
              setActiveTab(mappedTab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

      </main>

      {/* 3. Universal Floating Quick Note Modal */}
      <QuickNoteModal
        isOpen={isQuickNoteOpen}
        onClose={() => setIsQuickNoteOpen(false)}
        initialContentRef={quickNoteRef}
      />

      {/* 4. Placement Diagnostic Modal */}
      {isDiagnosticModalOpen && (
        <PlacementDiagnosticModal
          courseId={diagnosticCourseId}
          onClose={() => setIsDiagnosticModalOpen(false)}
          onComplete={(skipped) => {
            setIsDiagnosticModalOpen(false);
          }}
        />
      )}

      {/* 5. Global Site Footer */}
      <DataVidhyaFooter
        onNavigateTab={(tab) => {
          setActiveTab(tab as ActiveTab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenVideo={(videoId) => {
          const v = getCuratedVideoById(videoId);
          if (v) setActiveVideoModal(v);
        }}
      />

      {/* 6. Video Masterclass Modal */}
      {activeVideoModal && (
        <VideoMasterclassModal
          video={activeVideoModal}
          onClose={() => setActiveVideoModal(null)}
        />
      )}

    </div>
  );
}

export default function Home() {
  return (
    <UserStoreProvider>
      <DataForgeMasterApp />
    </UserStoreProvider>
  );
}
