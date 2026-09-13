'use client';

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Code, 
  Zap, 
  Layers, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  BookOpen, 
  Award, 
  Play, 
  Sparkles, 
  ChevronRight, 
  AlertCircle, 
  X, 
  Clock, 
  Terminal, 
  FileText, 
  ShieldAlert, 
  Flame,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { MASTER_TRACKS } from '../../content/tracks/trackCatalog';
import { useUserStore } from '../../lib/userStore';
import { TrackDefinition, TrackTier, TrackModule, TrackModuleTest } from '../../types';
import { SplitScreenArena } from '../practice/SplitScreenArena';

export const TracksView: React.FC<{
  initialTrackId?: string;
  onOpenQuickNote?: (ref: any) => void;
}> = ({ initialTrackId = 'sql', onOpenQuickNote }) => {
  const { tracksProgress, completeModule, submitCapstone, submitPlacementDiagnostic, setLastActive, addXP } = useUserStore();
  const [activeTrackId, setActiveTrackId] = useState<string>(initialTrackId);
  const [activeTab, setActiveTab] = useState<'curriculum' | 'arena'>('curriculum');

  useEffect(() => {
    if (initialTrackId) {
      setActiveTrackId(initialTrackId);
    }
  }, [initialTrackId]);

  // Modal states
  const [activeLearnModule, setActiveLearnModule] = useState<TrackModule | null>(null);
  const [activeTestModule, setActiveTestModule] = useState<{ module: TrackModule; tierNumber: 1 | 2 | 3 } | null>(null);
  const [activeCapstoneTier, setActiveCapstoneTier] = useState<{ tier: TrackTier; trackId: string } | null>(null);
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);

  // Test state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(0);

  // Diagnostic state
  const [diagAnswers, setDiagAnswers] = useState<Record<string, number>>({});
  const [diagResult, setDiagResult] = useState<{ unlockedTier: 1 | 2 | 3; message: string } | null>(null);

  // Capstone state
  const [rubricChecks, setRubricChecks] = useState<Record<string, boolean>>({});
  const [capstoneNote, setCapstoneNote] = useState('');

  const currentTrack = MASTER_TRACKS.find(t => t.id === activeTrackId) || MASTER_TRACKS[0];
  const currentProgress = tracksProgress[activeTrackId] || {
    trackId: activeTrackId,
    diagnosticTaken: false,
    unlockedTier: 1,
    completedModules: [],
    moduleRecords: {},
    capstoneRecords: {}
  };

  const getTrackIcon = (iconName: string) => {
    switch (iconName) {
      case 'Database': return Database;
      case 'Code': return Code;
      case 'Zap': return Zap;
      case 'Layers': return Layers;
      default: return Database;
    }
  };

  // Helper to check if module is unlocked
  const isModuleUnlocked = (tier: TrackTier, moduleIndex: number) => {
    // Check tier unlock
    if (tier.tierNumber > currentProgress.unlockedTier) return false;
    // First module of an unlocked tier is always open
    if (moduleIndex === 0) return true;
    // Previous module in the same tier must be passed
    const prevModule = tier.modules[moduleIndex - 1];
    return currentProgress.completedModules.includes(prevModule.id);
  };

  const handleStartLearn = (module: TrackModule) => {
    setActiveLearnModule(module);
    setLastActive({
      type: 'track_module',
      id: module.id,
      title: module.title,
      subtitle: `${currentTrack.name} • Tier ${module.tierId.split('-')[2]}`,
      trackId: activeTrackId
    });
  };

  const handleStartTest = (module: TrackModule, tierNumber: 1 | 2 | 3) => {
    setActiveTestModule({ module, tierNumber });
    setSelectedAnswers({});
    setTestSubmitted(false);
    setTestScore(0);
  };

  const handleTestSubmit = () => {
    if (!activeTestModule) return;
    const questions = activeTestModule.module.test.questions;
    let correct = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });

    const calculatedScore = Math.round((correct / questions.length) * 100);
    setTestScore(calculatedScore);
    setTestSubmitted(true);

    completeModule(
      activeTrackId,
      activeTestModule.module.id,
      calculatedScore,
      activeTestModule.tierNumber
    );
  };

  const handleStartDiagnostic = () => {
    setDiagAnswers({});
    setDiagResult(null);
    setShowDiagnosticModal(true);
  };

  const handleDiagnosticSubmit = () => {
    const questions = currentTrack.placementDiagnostic.questions;
    let correct = 0;
    questions.forEach(q => {
      if (diagAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });

    const score = Math.round((correct / questions.length) * 100);
    const res = submitPlacementDiagnostic(activeTrackId, score);
    setDiagResult(res);
  };

  const handleOpenCapstone = (tier: TrackTier) => {
    setActiveCapstoneTier({ tier, trackId: activeTrackId });
    const existing = currentProgress.capstoneRecords[tier.capstone.id];
    setRubricChecks(existing?.rubricChecks || {});
    setCapstoneNote(existing?.submissionNote || '');
  };

  const handleSubmitCapstoneModal = () => {
    if (!activeCapstoneTier) return;
    submitCapstone(
      activeTrackId,
      activeCapstoneTier.tier.capstone.id,
      activeCapstoneTier.tier.tierNumber,
      rubricChecks,
      capstoneNote
    );
    setActiveCapstoneTier(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-sans">
      
      {/* 1. Track Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-forge-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-forge-card border border-forge-border text-forge-secondary">
              Skill Tracks
            </span>
            <span className="text-xs text-forge-secondary font-mono">
              Gated progression • Learn → Test (≥70%) → Capstone
            </span>
          </div>
          <h1 className="text-2xl font-black text-forge-text tracking-tight mt-1">{currentTrack.name}</h1>
          <p className="text-xs text-forge-secondary font-mono mt-0.5">{currentTrack.shortDesc}</p>
        </div>

        {/* Diagnostic Placement Button */}
        <div>
          <button
            onClick={handleStartDiagnostic}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-track-sql/20 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-bold font-mono transition-all hover:border-amber-400 active:scale-95 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Placement Diagnostic (Skip Tiers)</span>
          </button>
        </div>
      </div>

      {/* 2. Track Switcher Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {MASTER_TRACKS.map((track) => {
          const Icon = getTrackIcon(track.iconName);
          const isSelected = activeTrackId === track.id;
          const prog = tracksProgress[track.id];
          const completedCount = prog?.completedModules?.length || 0;

          return (
            <button
              key={track.id}
              onClick={() => setActiveTrackId(track.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3.5 ${
                isSelected
                  ? 'bg-forge-card border-track-sql shadow-md ring-1 ring-track-sql/30'
                  : 'bg-forge-card/40 border-forge-border hover:border-forge-secondary/50 hover:bg-forge-card/80'
              }`}
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-inner"
                style={{
                  backgroundColor: `${track.accentColor}15`,
                  borderColor: `${track.accentColor}40`,
                  color: track.accentColor
                }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold text-forge-text truncate">{track.name.split('&')[0]}</h3>
                <div className="flex items-center gap-2 text-[10px] font-mono text-forge-secondary mt-0.5">
                  <span>Tier {prog?.unlockedTier || 1}</span>
                  <span>•</span>
                  <span>{completedCount} Completed</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Sub-Navigation: Gated Curriculum vs Ungated Practice Arena */}
      <div className="flex items-center justify-between border-b border-forge-border pb-3">
        <div className="flex items-center gap-2 p-1 bg-forge-card border border-forge-border rounded-xl font-mono text-xs">
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'curriculum'
                ? 'bg-forge-surface text-track-sql shadow-sm'
                : 'text-forge-secondary hover:text-forge-text'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Gated Curriculum</span>
          </button>
          <button
            onClick={() => setActiveTab('arena')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'arena'
                ? 'bg-forge-surface text-track-sql shadow-sm'
                : 'text-forge-secondary hover:text-forge-text'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Ungated Practice Arena (300 Qs)</span>
          </button>
        </div>

        <span className="text-xs text-forge-secondary font-mono hidden sm:inline">
          {activeTab === 'curriculum' ? 'Passing requirement: ≥70% score per test' : 'Free drill mode: no gating'}
        </span>
      </div>

      {/* 4. MAIN CONTENT AREA */}

      {/* A. UNGATED PRACTICE ARENA TAB */}
      {activeTab === 'arena' && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-forge-card border border-forge-border text-xs text-forge-secondary font-mono flex items-center justify-between">
            <span>Drill freely from the 300-question practice pool for {currentTrack.name}. Does not affect module gating.</span>
            <span className="text-track-sql font-bold">Ungated Practice Mode</span>
          </div>
          <SplitScreenArena onAddXP={addXP} />
        </div>
      )}

      {/* B. GATED CURRICULUM TAB */}
      {activeTab === 'curriculum' && (
        <div className="space-y-8">
          {currentTrack.tiers.map((tier) => {
            const isTierUnlocked = tier.tierNumber <= currentProgress.unlockedTier;
            const tierCompletedModules = tier.modules.filter(m => currentProgress.completedModules.includes(m.id)).length;
            const capstonePassed = currentProgress.capstoneRecords[tier.capstone.id]?.passed;

            return (
              <div 
                key={tier.id}
                className={`rounded-3xl border p-6 space-y-6 transition-all ${
                  isTierUnlocked
                    ? 'bg-forge-card border-forge-border shadow-md'
                    : 'bg-forge-card/30 border-forge-border/40 opacity-60'
                }`}
              >
                {/* Tier Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-forge-border pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm border ${
                      isTierUnlocked ? 'bg-track-sql/10 text-track-sql border-track-sql/40' : 'bg-forge-surface text-forge-secondary border-forge-border'
                    }`}>
                      T{tier.tierNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-forge-text font-mono">
                          Tier {tier.tierNumber} — {tier.name}
                        </h2>
                        {isTierUnlocked ? (
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-track-python/10 text-track-python border border-track-python/30 flex items-center gap-1 font-bold">
                            <Unlock className="w-3 h-3" /> Unlocked
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-forge-surface text-forge-secondary border border-forge-border flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Locked (Complete Tier {tier.tierNumber - 1} Capstone)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-forge-secondary mt-0.5">{tier.description}</p>
                    </div>
                  </div>

                  {/* Tier Progress meter */}
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-forge-secondary">Progress:</span>
                    <span className="font-bold text-forge-text">{tierCompletedModules} / {tier.modules.length} Modules</span>
                    {capstonePassed && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                        Capstone Passed ✓
                      </span>
                    )}
                  </div>
                </div>

                {/* Modules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {tier.modules.map((module, mIdx) => {
                    const unlocked = isModuleUnlocked(tier, mIdx);
                    const record = currentProgress.moduleRecords[module.id];
                    const isPassed = record?.testPassed;
                    const score = record?.score || 0;

                    return (
                      <div
                        key={module.id}
                        className={`rounded-2xl border p-4.5 flex flex-col justify-between space-y-4 transition-all ${
                          !unlocked
                            ? 'bg-forge-surface/30 border-forge-border/40 opacity-50'
                            : isPassed
                              ? 'bg-forge-surface/60 border-track-python/30 hover:border-track-python/60'
                              : 'bg-forge-surface border-forge-border hover:border-track-sql/40'
                        }`}
                      >
                        {/* Top: Status & Order */}
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-forge-secondary">Module {module.order} • {module.durationMinutes} min</span>
                          {isPassed ? (
                            <span className="text-track-python font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Passed ({score}%)
                            </span>
                          ) : unlocked ? (
                            <span className="text-amber-400 font-semibold flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              In Progress
                            </span>
                          ) : (
                            <span className="text-forge-secondary flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              Locked
                            </span>
                          )}
                        </div>

                        {/* Middle: Title & Overview */}
                        <div>
                          <h3 className="text-xs font-bold text-forge-text leading-snug">{module.title}</h3>
                          <p className="text-[11px] text-forge-secondary mt-1.5 line-clamp-2 leading-relaxed">
                            {module.learnContent.overview}
                          </p>
                        </div>

                        {/* Bottom: Action Buttons */}
                        <div className="flex items-center gap-2 pt-2 border-t border-forge-border/40">
                          <button
                            onClick={() => handleStartLearn(module)}
                            disabled={!unlocked}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-forge-card border border-forge-border text-xs font-semibold text-forge-text hover:bg-forge-card/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-track-sql" />
                            <span>Learn</span>
                          </button>
                          <button
                            onClick={() => handleStartTest(module, tier.tierNumber)}
                            disabled={!unlocked}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                              isPassed
                                ? 'bg-track-python/20 text-track-python border border-track-python/40 hover:bg-track-python/30'
                                : 'bg-track-sql text-black hover:bg-track-sql/90'
                            }`}
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>{isPassed ? 'Retest' : 'Test (≥70%)'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tier Capstone Project Card */}
                <div className={`rounded-2xl border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                  tierCompletedModules >= tier.modules.length && isTierUnlocked
                    ? 'bg-gradient-to-r from-amber-500/10 via-forge-surface to-track-sql/10 border-amber-500/40 shadow-sm'
                    : 'bg-forge-surface/30 border-forge-border/40 opacity-60'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Tier {tier.tierNumber} Capstone
                      </span>
                      {capstonePassed && (
                        <span className="text-xs font-mono font-bold text-track-python flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-forge-text">{tier.capstone.title}</h4>
                    <p className="text-xs text-forge-secondary max-w-2xl">{tier.capstone.description}</p>
                  </div>

                  <button
                    onClick={() => handleOpenCapstone(tier)}
                    disabled={!isTierUnlocked || tierCompletedModules < tier.modules.length}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 shadow-sm"
                  >
                    {capstonePassed ? 'Review Rubric' : 'Start Capstone (Rubric)'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 5. LEARN DRAWER / MODAL */}
      {activeLearnModule && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-forge-card border border-forge-border rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-forge-border pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-track-sql/20 text-track-sql">
                  Learn Phase
                </span>
                <h2 className="text-xl font-black text-forge-text mt-1">{activeLearnModule.title}</h2>
              </div>
              <button
                onClick={() => setActiveLearnModule(null)}
                className="p-1 rounded-xl bg-forge-surface border border-forge-border text-forge-secondary hover:text-forge-text"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Overview */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold text-forge-secondary uppercase tracking-wider">Overview</h3>
              <p className="text-xs text-forge-text leading-relaxed">{activeLearnModule.learnContent.overview}</p>
            </div>

            {/* Key Architectural Concepts */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold text-forge-secondary uppercase tracking-wider">Key Concepts & Implementation</h3>
              {activeLearnModule.learnContent.keyConcepts.map((concept, idx) => (
                <div key={idx} className="rounded-xl bg-forge-bg border border-forge-border p-4 space-y-2">
                  <h4 className="text-xs font-bold text-track-sql font-mono">{concept.title}</h4>
                  <p className="text-xs text-forge-secondary leading-relaxed">{concept.description}</p>
                  {concept.codeSnippet && (
                    <pre className="bg-black/50 border border-forge-border rounded-lg p-3 text-[11px] font-mono text-forge-text overflow-x-auto">
                      <code>{concept.codeSnippet}</code>
                    </pre>
                  )}
                </div>
              ))}
            </div>

            {/* Senior Rule of Thumb & Anti-Pattern */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                <span className="font-mono font-bold text-emerald-400 block text-[10px] uppercase">Staff DE Rule of Thumb</span>
                <p className="text-forge-text leading-relaxed">{activeLearnModule.learnContent.seniorTip}</p>
              </div>
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-1">
                <span className="font-mono font-bold text-red-400 block text-[10px] uppercase">Production Anti-Pattern</span>
                <p className="text-forge-text leading-relaxed">{activeLearnModule.learnContent.antiPattern}</p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-forge-border">
              <button
                onClick={() => onOpenQuickNote && onOpenQuickNote({
                  type: 'track_module',
                  id: activeLearnModule.id,
                  title: activeLearnModule.title,
                  trackId: activeTrackId
                })}
                className="flex items-center gap-1.5 text-xs text-forge-secondary hover:text-track-sql font-mono"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>+ Capture Note</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveLearnModule(null)}
                  className="px-4 py-2 rounded-xl text-xs text-forge-secondary hover:text-forge-text"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const mod = activeLearnModule;
                    setActiveLearnModule(null);
                    handleStartTest(mod, 1);
                  }}
                  className="px-4 py-2 rounded-xl bg-track-sql text-black font-bold text-xs hover:bg-track-sql/90"
                >
                  Take Test (≥70%)
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 6. TEST MODAL */}
      {activeTestModule && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-forge-card border border-forge-border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-forge-border pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                  Gated Assessment
                </span>
                <h2 className="text-xl font-black text-forge-text mt-1">{activeTestModule.module.test.title}</h2>
                <p className="text-xs text-forge-secondary font-mono mt-0.5">Passing threshold: ≥70% score required to advance</p>
              </div>
              <button
                onClick={() => setActiveTestModule(null)}
                className="p-1 rounded-xl bg-forge-surface border border-forge-border text-forge-secondary hover:text-forge-text"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {activeTestModule.module.test.questions.map((q, qIdx) => (
                <div key={q.id} className="p-4 rounded-2xl bg-forge-bg border border-forge-border space-y-3">
                  <h4 className="text-xs font-bold text-forge-text leading-snug">
                    {qIdx + 1}. {q.question}
                  </h4>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[q.id] === optIdx;
                      const isCorrect = q.correctIndex === optIdx;

                      let style = 'bg-forge-card border-forge-border text-forge-secondary hover:border-track-sql/50';
                      if (testSubmitted) {
                        if (isCorrect) {
                          style = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                        } else if (isSelected && !isCorrect) {
                          style = 'bg-red-500/20 border-red-500 text-red-300';
                        }
                      } else if (isSelected) {
                        style = 'bg-track-sql/20 border-track-sql text-track-sql font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => {
                            if (!testSubmitted) {
                              setSelectedAnswers({ ...selectedAnswers, [q.id]: optIdx });
                            }
                          }}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${style}`}
                        >
                          <span className="font-mono font-bold mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {testSubmitted && (
                    <div className="p-3 rounded-xl bg-forge-surface/60 border border-forge-border text-[11px] text-forge-secondary leading-relaxed">
                      <span className="font-bold text-track-sql font-mono mr-1">Explanation:</span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Result Feedback & Submit Button */}
            <div className="pt-4 border-t border-forge-border space-y-3">
              {testSubmitted && (
                <div className={`p-4 rounded-xl border text-center space-y-1 ${
                  testScore >= 70 ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-red-500/10 border-red-500/40 text-red-300'
                }`}>
                  <h3 className="text-sm font-bold font-mono">
                    {testScore >= 70 ? '🎉 Test Passed!' : '❌ Did Not Meet 70% Passing Threshold'}
                  </h3>
                  <p className="text-xs">
                    You scored <span className="font-bold">{testScore}%</span>. {testScore >= 70 ? 'The next module has been unlocked!' : 'Review the concepts and retake when ready.'}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setActiveTestModule(null)}
                  className="px-4 py-2 rounded-xl text-xs text-forge-secondary hover:text-forge-text"
                >
                  {testSubmitted ? 'Done' : 'Cancel'}
                </button>
                {!testSubmitted && (
                  <button
                    onClick={handleTestSubmit}
                    disabled={Object.keys(selectedAnswers).length < activeTestModule.module.test.questions.length}
                    className="px-5 py-2 rounded-xl bg-track-sql text-black font-bold text-xs hover:bg-track-sql/90 disabled:opacity-40 shadow-sm"
                  >
                    Submit Test
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 7. TIER CAPSTONE RUBRIC MODAL */}
      {activeCapstoneTier && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-forge-card border border-amber-500/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex items-start justify-between border-b border-forge-border pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                  Capstone Self-Evaluation Rubric
                </span>
                <h2 className="text-xl font-black text-forge-text mt-1">{activeCapstoneTier.tier.capstone.title}</h2>
              </div>
              <button
                onClick={() => setActiveCapstoneTier(null)}
                className="p-1 rounded-xl bg-forge-surface border border-forge-border text-forge-secondary hover:text-forge-text"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-forge-secondary uppercase">Scenario & Deliverables</h4>
              <p className="text-xs text-forge-text leading-relaxed">{activeCapstoneTier.tier.capstone.businessScenario}</p>
              <ul className="list-disc list-inside text-xs text-forge-secondary space-y-1 pl-1">
                {activeCapstoneTier.tier.capstone.deliverables.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-forge-secondary uppercase">Self-Evaluation Rubric Checklist</h4>
              {activeCapstoneTier.tier.capstone.rubricItems.map((item) => {
                const isChecked = Boolean(rubricChecks[item.id]);

                return (
                  <div 
                    key={item.id}
                    onClick={() => setRubricChecks({ ...rubricChecks, [item.id]: !isChecked })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isChecked ? 'bg-amber-500/10 border-amber-500/40 text-forge-text' : 'bg-forge-bg border-forge-border text-forge-secondary hover:border-amber-500/20'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-1 rounded accent-amber-500"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold text-forge-text">{item.criterion}</h5>
                        <span className="text-[10px] font-mono text-amber-400 font-semibold">({item.weightPercent}%)</span>
                      </div>
                      <p className="text-[11px] text-forge-secondary leading-relaxed">{item.guidance}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <label className="text-xs font-mono text-forge-secondary block mb-1">Architecture Notes / Repo Link (Optional)</label>
              <textarea
                value={capstoneNote}
                onChange={(e) => setCapstoneNote(e.target.value)}
                rows={3}
                placeholder="Paste your GitHub blueprint link or architectural design summary here..."
                className="w-full bg-forge-bg border border-forge-border rounded-xl p-3 text-xs text-forge-text focus:outline-none focus:border-amber-500 resize-none font-sans"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-forge-border">
              <span className="text-[11px] font-mono text-amber-400">
                +300 XP on successful submission
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveCapstoneTier(null)}
                  className="px-4 py-2 rounded-xl text-xs text-forge-secondary hover:text-forge-text"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitCapstoneModal}
                  className="px-5 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 shadow-sm"
                >
                  Submit Capstone
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 8. PLACEMENT DIAGNOSTIC MODAL */}
      {showDiagnosticModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-forge-card border border-amber-500/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-start justify-between border-b border-forge-border pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                  Placement Diagnostic
                </span>
                <h2 className="text-xl font-black text-forge-text mt-1">{currentTrack.placementDiagnostic.title}</h2>
                <p className="text-xs text-forge-secondary font-mono mt-0.5">
                  ≥70% qualifies for Tier 2 (Applied) • ≥90% qualifies directly for Tier 3 (Mastery)
                </p>
              </div>
              <button
                onClick={() => setShowDiagnosticModal(false)}
                className="p-1 rounded-xl bg-forge-surface border border-forge-border text-forge-secondary hover:text-forge-text"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {diagResult ? (
              <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-500/10 to-forge-bg border border-amber-500/40 text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-forge-text">Diagnostic Completed!</h3>
                <p className="text-xs text-forge-secondary max-w-sm mx-auto leading-relaxed">{diagResult.message}</p>
                <div className="p-3 rounded-xl bg-forge-surface font-mono text-xs font-bold text-track-sql inline-block">
                  Tier {diagResult.unlockedTier} is now Unlocked!
                </div>
                <div>
                  <button
                    onClick={() => setShowDiagnosticModal(false)}
                    className="px-5 py-2 rounded-xl bg-track-sql text-black font-bold text-xs hover:bg-track-sql/90"
                  >
                    Enter Curriculum
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {currentTrack.placementDiagnostic.questions.map((q, idx) => (
                  <div key={q.id} className="p-4 rounded-2xl bg-forge-bg border border-forge-border space-y-3">
                    <h4 className="text-xs font-bold text-forge-text">
                      {idx + 1}. {q.question}
                    </h4>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = diagAnswers[q.id] === optIdx;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => setDiagAnswers({ ...diagAnswers, [q.id]: optIdx })}
                            className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                              isSelected ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' : 'bg-forge-card border-forge-border text-forge-secondary hover:border-amber-500/40'
                            }`}
                          >
                            <span className="font-mono font-bold mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="flex justify-end gap-2 pt-4 border-t border-forge-border">
                  <button
                    onClick={() => setShowDiagnosticModal(false)}
                    className="px-4 py-2 rounded-xl text-xs text-forge-secondary hover:text-forge-text"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDiagnosticSubmit}
                    disabled={Object.keys(diagAnswers).length < currentTrack.placementDiagnostic.questions.length}
                    className="px-5 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 disabled:opacity-40"
                  >
                    Evaluate Placement
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
