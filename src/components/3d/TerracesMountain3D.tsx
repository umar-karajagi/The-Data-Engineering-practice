'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MASTER_CURRICULUM, 
  CurriculumStage, 
  TRACK_ROLES, 
  TrackRole 
} from '../../content/curriculum/masterCurriculum';
import { CuratedVideo } from '../../content/videos/curatedVideos';
import { useUserStore } from '../../lib/userStore';
import { 
  Play, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Sparkles, 
  Clock, 
  Flame, 
  Award, 
  ChevronRight, 
  Layers, 
  ExternalLink,
  ShieldCheck,
  Compass,
  Trophy,
  Zap,
  Target
} from 'lucide-react';

interface TerracesMountain3DProps {
  onOpenVideo: (video: CuratedVideo) => void;
  selectedRole?: 'engineer' | 'analyst' | 'scientist';
  onLaunchInterviewBoss?: () => void;
}

export const TerracesMountain3D: React.FC<TerracesMountain3DProps> = ({
  onOpenVideo,
  selectedRole = 'engineer',
  onLaunchInterviewBoss
}) => {
  const { addXP } = useUserStore();
  const [activeTerraceIdx, setActiveTerraceIdx] = useState<number>(0);
  const [completedMilestones, setCompletedMilestones] = useState<string[]>([]);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const STORAGE_KEY_COMPLETED = 'dataveda_completed_milestones_v2';

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLETED);
      if (saved) {
        setCompletedMilestones(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Compute progress for each terrace from actual localStorage episode keys
  const getStageWatchedCount = (stage: CurriculumStage) => {
    const storageKey = `dataveda_watched_episodes_${stage.milestone.replace(/\s+/g, '_')}`;
    try {
      const watched = localStorage.getItem(storageKey);
      if (watched) {
        const parsed = JSON.parse(watched);
        return Array.isArray(parsed) ? parsed.length : 0;
      }
    } catch (e) {}
    return completedMilestones.includes(stage.milestone) ? stage.playlist.totalVideos : 0;
  };

  const activeStage = MASTER_CURRICULUM[activeTerraceIdx] || MASTER_CURRICULUM[0];
  const roleConfig = TRACK_ROLES[selectedRole] || TRACK_ROLES.engineer;

  // Terrace theme colors
  const terraceColors = [
    { bg: 'from-blue-600/20 to-cyan-600/10', border: 'border-blue-500/40', text: 'text-blue-400', glow: '#3B82F6' },
    { bg: 'from-lime-600/20 to-emerald-600/10', border: 'border-lime-500/40', text: 'text-lime-400', glow: '#84CC16' },
    { bg: 'from-blue-500/20 to-indigo-600/10', border: 'border-blue-400/40', text: 'text-blue-300', glow: '#60A5FA' },
    { bg: 'from-cyan-600/20 to-teal-600/10', border: 'border-cyan-500/40', text: 'text-cyan-400', glow: '#06B6D4' },
    { bg: 'from-orange-600/20 to-amber-600/10', border: 'border-orange-500/40', text: 'text-orange-400', glow: '#F97316' },
    { bg: 'from-rose-600/20 to-red-600/10', border: 'border-rose-500/40', text: 'text-rose-400', glow: '#F43F5E' },
    { bg: 'from-emerald-600/20 to-teal-600/10', border: 'border-emerald-500/40', text: 'text-emerald-400', glow: '#10B981' },
    { bg: 'from-purple-600/20 to-indigo-600/10', border: 'border-purple-500/40', text: 'text-purple-400', glow: '#A855F7' },
    { bg: 'from-amber-500/25 to-yellow-500/15', border: 'border-amber-400/50', text: 'text-amber-300', glow: '#F59E0B' }
  ];

  return (
    <div className="relative w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl p-4 sm:p-8 overflow-hidden">
      
      {/* 3D Atmospheric Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.03] to-slate-950/80 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header with EXACT Curriculum Stats */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
            <Compass className="w-3.5 h-3.5" />
            <span>THE 9 TERRACES OF DATA MASTERY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
            Ascend The Plain Data Engineer Mountain
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            A continuous spatial elevation of 9 real curriculum stages. Terrain elevation and ambient glow reflect your actual watched progress in real time.
          </p>
        </div>

        {/* Exact Figures Badge from masterCurriculum.ts */}
        <div className="flex items-center gap-2 font-mono text-xs bg-slate-100 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black">
            61 Videos
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-brand-blue/15 text-brand-blue font-black">
            10,055 Min
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-purple-500/15 text-purple-400 font-black">
            167.6 Hours
          </div>
        </div>
      </div>

      {/* 2. Interactive Spatial 9-Terrace Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
        
        {/* Left Side: The 9 Ascending Mountain Terraces (9 stages) */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="flex items-center justify-between px-1 text-xs font-mono text-slate-500 dark:text-slate-400 pb-1">
            <span>TERRACE ELEVATION</span>
            <span>STAGE PROGRESS</span>
          </div>

          {MASTER_CURRICULUM.map((stage, idx) => {
            const isActive = activeTerraceIdx === idx;
            const watchedCount = getStageWatchedCount(stage);
            const totalCount = stage.playlist.totalVideos;
            const pct = Math.round((watchedCount / totalCount) * 100);
            const isCompleted = pct === 100 || completedMilestones.includes(stage.milestone);
            const color = terraceColors[idx];
            const isSummit = idx === 8;

            return (
              <motion.div
                key={stage.milestone}
                whileHover={{ scale: 1.01, x: 4 }}
                onClick={() => setActiveTerraceIdx(idx)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                  isActive 
                    ? `bg-slate-900 text-white ${color.border} shadow-xl shadow-emerald-500/10` 
                    : 'bg-white/80 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-400 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'
                }`}
              >
                {/* Elevation Indicator Bar */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1.5 transition-all"
                  style={{ 
                    backgroundColor: color.glow,
                    opacity: isActive ? 1 : 0.4
                  }} 
                />

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl font-mono text-xs font-black flex items-center justify-center shrink-0 ${
                      isActive 
                        ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : `0${stage.stageNumber}`}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${color.text}`}>
                          Terrace {stage.stageNumber} {isSummit ? '• 🏔️ SUMMIT' : ''}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {stage.playlist.totalDuration}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold truncate mt-0.5">
                        {stage.title}
                      </h4>
                    </div>
                  </div>

                  {/* Progress Gauge */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold">
                        {watchedCount}/{totalCount}
                      </div>
                      <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90 text-emerald-400' : 'text-slate-400'}`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Side: Active Terrace Masterclass Diorama */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage.milestone}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md shadow-xl space-y-6"
            >
              {/* Terrace Milestone Tag */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-black">
                    TERRACE 0{activeStage.stageNumber} OF 09
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    Category: {activeStage.category}
                  </span>
                </div>

                {activeStage.stageNumber === 9 && (
                  <button
                    onClick={onLaunchInterviewBoss}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-mono font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/30 hover:scale-105 transition-transform cursor-pointer"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>LAUNCH FINAL BOSS INTERVIEW</span>
                  </button>
                )}
              </div>

              {/* Title & Duration */}
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {activeStage.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Playlist: <strong className="text-emerald-500">{activeStage.playlist.playlistTitle}</strong> ({activeStage.playlist.totalVideos} Videos • {activeStage.playlist.totalDuration})
                </p>
              </div>

              {/* Primary Masterclass Video Banner */}
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 group shadow-lg">
                <img
                  src={`https://img.youtube.com/vi/${activeStage.youtubeId}/maxresdefault.jpg`}
                  alt={activeStage.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback to hqdefault if maxres not available
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${activeStage.youtubeId}/hqdefault.jpg`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => {
                      const firstEp = activeStage.playlist.episodes[0];
                      onOpenVideo({
                        id: firstEp.id,
                        title: firstEp.title,
                        category: 'track',
                        topic: 'Spark',
                        instructor: activeStage.playlist.channelName,
                        instructorRole: 'Curriculum Director',
                        youtubeId: firstEp.youtubeId,
                        youtubeUrl: firstEp.youtubeUrl,
                        duration: firstEp.duration,
                        rating: 4.9,
                        views: '500K+ views',
                        level: 'Beginner → Advanced',
                        summary: firstEp.summary,
                        techStack: activeStage.topics.slice(0, 4),
                        chapters: [
                          { time: '00:00', seconds: 0, title: 'Introduction' },
                          { time: '10:00', seconds: 600, title: 'Core Concept' },
                          { time: '25:00', seconds: 1500, title: 'Hands-on Implementation' }
                        ],
                        keyTakeaways: activeStage.revisionChecklist,
                        playlist: activeStage.playlist,
                        currentEpisodeId: firstEp.id
                      });
                    }}
                    className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-2xl shadow-emerald-500/50 group-hover:scale-110 transition-all cursor-pointer"
                  >
                    <Play className="w-7 h-7 fill-current translate-x-0.5" />
                  </button>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white text-xs">
                  <div>
                    <span className="font-mono text-emerald-400 font-bold">Featured Episode 01</span>
                    <div className="font-bold truncate max-w-md mt-0.5">
                      {activeStage.playlist.episodes[0]?.title}
                    </div>
                  </div>
                  <span className="font-mono px-2 py-1 rounded bg-black/60 backdrop-blur-md">
                    {activeStage.playlist.episodes[0]?.duration}
                  </span>
                </div>
              </div>

              {/* Episode Playlist Drawer (List of episodes in this terrace) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    ALL EPISODES IN TERRACE 0{activeStage.stageNumber} ({activeStage.playlist.totalVideos})
                  </span>
                  <span className="text-slate-400">Click to launch Cinema Scene</span>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {activeStage.playlist.episodes.map((ep, idx) => (
                    <div
                      key={ep.id}
                      onClick={() => {
                        onOpenVideo({
                          id: ep.id,
                          title: ep.title,
                          category: 'track',
                          topic: 'Spark',
                          instructor: activeStage.playlist.channelName,
                          instructorRole: 'Curriculum Director',
                          youtubeId: ep.youtubeId,
                          youtubeUrl: ep.youtubeUrl,
                          duration: ep.duration,
                          rating: 4.9,
                          views: '350K+ views',
                          level: 'Beginner → Advanced',
                          summary: ep.summary,
                          techStack: activeStage.topics.slice(0, 3),
                          chapters: [
                            { time: '00:00', seconds: 0, title: 'Overview' },
                            { time: '15:00', seconds: 900, title: 'Deep Dive' }
                          ],
                          keyTakeaways: activeStage.revisionChecklist,
                          playlist: activeStage.playlist,
                          currentEpisodeId: ep.id
                        });
                      }}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-emerald-400">
                          {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                        </span>
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold truncate text-slate-800 dark:text-slate-200 group-hover:text-emerald-500">
                            {ep.title}
                          </h5>
                          <span className="text-[10px] font-mono text-slate-400">
                            {ep.keyTopic}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 font-mono text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{ep.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revision Checklist & Topics */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <h6 className="font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Terrace Architecture Topics:</span>
                  </h6>
                  <ul className="space-y-1 text-slate-500 dark:text-slate-400">
                    {activeStage.topics.slice(0, 3).map((topic, i) => (
                      <li key={i} className="truncate">• {topic}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h6 className="font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-blue" />
                    <span>Revision Criteria:</span>
                  </h6>
                  <ul className="space-y-1 text-slate-500 dark:text-slate-400">
                    {activeStage.revisionChecklist.slice(0, 2).map((check, i) => (
                      <li key={i} className="truncate">✓ {check}</li>
                    ))}
                  </ul>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};
