'use client';

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Layers, 
  Play, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  Star,
  Award,
  Terminal,
  FolderGit2,
  Lock,
  Unlock,
  ArrowRight,
  ShieldCheck,
  Check,
  Briefcase,
  TrendingUp,
  GraduationCap,
  Tv,
  ListVideo
} from 'lucide-react';
import { MASTER_CURRICULUM, TRACK_ROLES, CurriculumStage, TrackRole, PlaylistEpisode } from '../../content/curriculum/masterCurriculum';
import { RevisionTracker } from './RevisionTracker';
import { PlaylistTracker } from './PlaylistTracker';
import { CuratedVideo } from '../../content/videos/curatedVideos';
import { useUserStore } from '../../lib/userStore';

interface DataVedaTracksProps {
  onOpenVideo: (video: CuratedVideo) => void;
}

type RoleId = 'engineer' | 'analyst' | 'scientist';

export const DataVedaTracks: React.FC<DataVedaTracksProps> = ({ onOpenVideo }) => {
  const { addXP } = useUserStore();
  const [selectedRole, setSelectedRole] = useState<RoleId>('engineer');
  const [completedMilestones, setCompletedMilestones] = useState<string[]>([]);
  const [unrestrictedMode, setUnrestrictedMode] = useState<boolean>(true);
  const [activeEpisodeId, setActiveEpisodeId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const STORAGE_KEY_COMPLETED = 'dataveda_completed_milestones_v2';
  const STORAGE_KEY_ROLE = 'dataveda_selected_role_v2';

  useEffect(() => {
    try {
      const savedCompleted = localStorage.getItem(STORAGE_KEY_COMPLETED);
      if (savedCompleted) {
        setCompletedMilestones(JSON.parse(savedCompleted));
      }
      const savedRole = localStorage.getItem(STORAGE_KEY_ROLE) as RoleId | null;
      if (savedRole && TRACK_ROLES[savedRole]) {
        setSelectedRole(savedRole);
      }
    } catch (e) {
      console.error(e);
    }
    setMounted(true);
  }, []);

  const handleSelectRole = (role: RoleId) => {
    setSelectedRole(role);
    try {
      localStorage.setItem(STORAGE_KEY_ROLE, role);
    } catch (e) {}
  };

  const handleCompleteMilestone = (milestone: string) => {
    if (!completedMilestones.includes(milestone)) {
      const updated = [...completedMilestones, milestone];
      setCompletedMilestones(updated);
      try {
        localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(updated));
      } catch (e) {}
      addXP(100);
    }
  };

  const handleResetMilestone = (milestone: string) => {
    const updated = completedMilestones.filter(m => m !== milestone);
    setCompletedMilestones(updated);
    try {
      localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(updated));
    } catch (e) {}
  };

  const currentTrack = TRACK_ROLES[selectedRole];
  const roleStages = MASTER_CURRICULUM.filter(stage => 
    currentTrack.targetStages.includes(stage.stageNumber)
  );

  const roleCompletedCount = roleStages.filter(s => completedMilestones.includes(s.milestone)).length;
  const roleTotalCount = roleStages.length;
  const roleProgressPercent = Math.round((roleCompletedCount / roleTotalCount) * 100);

  // All courses and milestones are 100% unlocked
  const isStageUnlocked = (_stageIndexInTrack: number) => {
    return true;
  };

  const handlePlayEpisode = (stage: CurriculumStage, episode: PlaylistEpisode) => {
    setActiveEpisodeId(episode.id);
    const episodeVideo: CuratedVideo = {
      id: episode.id,
      title: `${stage.milestone} Ep ${episode.order}: ${episode.title}`,
      category: 'track',
      topic: (stage.category as any) || 'Azure',
      instructor: stage.playlist.channelName,
      instructorRole: 'DataVeda Engineering Faculty',
      youtubeId: episode.youtubeId,
      youtubeUrl: episode.youtubeUrl,
      duration: episode.duration,
      rating: 4.9,
      views: '450K+ views',
      level: 'Beginner → Advanced',
      summary: episode.summary,
      techStack: [stage.category, episode.keyTopic, 'Cloud Engineering'],
      chapters: [
        { time: '00:00', seconds: 0, title: 'Concept Overview & Setup' },
        { time: '12:40', seconds: 760, title: 'Architecture & Implementation' },
        { time: '35:20', seconds: 2120, title: 'Hands-on Pipeline Walkthrough' },
        { time: '58:00', seconds: 3480, title: 'Best Practices & Common Pitfalls' }
      ],
      keyTakeaways: [
        episode.summary,
        `Mastered ${episode.keyTopic} for production pipelines`,
        'Completed revision checklist item'
      ],
      playlist: stage.playlist,
      currentEpisodeId: episode.id
    };
    onOpenVideo(episodeVideo);
  };

  const handleWatchStageVideo = (stage: CurriculumStage) => {
    const firstEp = stage.playlist.episodes[0];
    handlePlayEpisode(stage, firstEp);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Banner */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-xs font-semibold mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Self-Paced Milestones • 100% Free & Open Access</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-50">
          Curriculum <span className="text-brand-blue">Milestones & Playlists</span>
        </h1>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-3xl">
          Learn at your own pace without arbitrary week deadlines. Every milestone includes a complete multi-video playlist series with full hours, detailed lesson breakdowns, and individual progress tracking.
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {(['engineer', 'analyst', 'scientist'] as RoleId[]).map((roleKey) => {
          const track = TRACK_ROLES[roleKey];
          const isSelected = selectedRole === roleKey;
          return (
            <button
              key={roleKey}
              onClick={() => handleSelectRole(roleKey)}
              className={`p-5 rounded-2xl text-left border transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 border-brand-blue ring-2 ring-brand-blue/30 shadow-lg shadow-brand-blue/5'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
              )}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    isSelected
                      ? 'bg-brand-blue/15 text-brand-blue border-brand-blue/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}>
                    {track.badge}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {track.targetStages.length} Milestones
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {track.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {track.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-brand-blue" />
                  {track.estimatedHours}
                </span>
                <span className={`font-semibold flex items-center gap-1 ${
                  isSelected ? 'text-brand-blue' : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {isSelected ? 'Active Track' : 'Select Track'}
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Track Stats & Progression Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-10 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-5 h-5 text-brand-blue" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                {currentTrack.title} Overview
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              {currentTrack.description}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">Career Outcomes:</span>
              {currentTrack.careerOutcomes.map((outcome, idx) => (
                <span key={idx} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {outcome}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:w-80 flex-shrink-0 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-slate-700 dark:text-slate-300">Milestones Verified</span>
              <span className="text-brand-blue">{roleCompletedCount} of {roleTotalCount} ({roleProgressPercent}%)</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-brand-blue rounded-full transition-all duration-300"
                style={{ width: `${roleProgressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px]">
              <button
                onClick={() => setUnrestrictedMode(!unrestrictedMode)}
                className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-brand-blue transition-colors cursor-pointer"
                title="Toggle unrestricted review mode to inspect any milestone"
              >
                {unrestrictedMode ? <Unlock className="w-3.5 h-3.5 text-emerald-500" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{unrestrictedMode ? 'Self-Paced Unrestricted' : 'Sequential Unlock'}</span>
              </button>
              <span className="text-slate-400 dark:text-slate-600">
                {roleStages.length} Milestones
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stages List */}
      <div className="space-y-8">
        {roleStages.map((stage, trackIdx) => {
          const isCompleted = completedMilestones.includes(stage.milestone);
          const isUnlocked = isStageUnlocked(trackIdx);

          return (
            <div
              key={stage.milestone}
              className={`rounded-2xl border transition-all duration-200 ${
                isCompleted
                  ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800/60 shadow-sm'
                  : isUnlocked
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
                  : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/60 opacity-85'
              }`}
            >
              {/* Stage Top Bar */}
              <div className="p-6 sm:p-7">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                      isCompleted
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : isUnlocked
                        ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-5 h-5 stroke-[3]" />
                      ) : !isUnlocked ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        stage.stageNumber.toString().padStart(2, '0')
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                          {stage.milestone}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {stage.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mt-0.5">
                        {stage.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      <Clock className="w-3.5 h-3.5" />
                      {stage.durationEstimate}
                    </span>

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    ) : !isUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                        <Lock className="w-3.5 h-3.5" />
                        Locked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-lg bg-brand-blue/15 text-brand-blue border border-brand-blue/30">
                        <Sparkles className="w-3.5 h-3.5" />
                        In Progress
                      </span>
                    )}
                  </div>
                </div>

                {/* Locked Banner if not unlocked */}
                {!isUnlocked && (
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between gap-4 mb-5">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span>
                        This milestone unlocks sequentially after completing <strong>{roleStages[trackIdx - 1]?.milestone}</strong>.
                      </span>
                    </div>
                    <button
                      onClick={() => setUnrestrictedMode(true)}
                      className="text-brand-blue font-semibold hover:underline flex-shrink-0 cursor-pointer"
                    >
                      Unlock for Review
                    </button>
                  </div>
                )}

                {/* Topics Grid */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                    Exhaustive Syllabus Topics ({stage.topics.length} Key Domains)
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    {stage.topics.map((topic, tIdx) => (
                      <div
                        key={tIdx}
                        className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/70 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2 flex-shrink-0" />
                        <span className="leading-relaxed">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Multi-Video Playlist & Watched Series Tracker */}
                <PlaylistTracker
                  stageMilestone={stage.milestone}
                  playlist={stage.playlist}
                  onPlayEpisode={(ep) => handlePlayEpisode(stage, ep)}
                  activePlayingEpisodeId={activeEpisodeId}
                />

                {/* Revision Checklist Component */}
                <RevisionTracker
                  milestone={stage.milestone}
                  checklist={stage.revisionChecklist}
                  isMilestoneCompleted={isCompleted}
                  onCompleteMilestone={() => handleCompleteMilestone(stage.milestone)}
                  onResetMilestone={() => handleResetMilestone(stage.milestone)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Completion Certificate Callout */}
      {roleCompletedCount === roleTotalCount && roleTotalCount > 0 && (
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-brand-blue/10 to-emerald-500/10 border border-emerald-500/30 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50">
            Congratulations! {currentTrack.title} Completed
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto mt-2">
            You have verified all {roleTotalCount} milestones and watched the series lessons. You are now prepared for industrial engineering interviews and production data pipelines.
          </p>
        </div>
      )}

    </div>
  );
};
