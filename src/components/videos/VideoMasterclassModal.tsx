'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CuratedVideo } from '@/content/videos/curatedVideos';
import { useUserStore } from '@/lib/userStore';
import { useDuckDB } from '@/lib/useDuckDB';
import { MASTER_CURRICULUM, PlaylistEpisode } from '@/content/curriculum/masterCurriculum';
import { 
  X, 
  Play, 
  Clock, 
  Award, 
  ExternalLink, 
  Database, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  Terminal, 
  PenSquare, 
  BookOpen, 
  Layers, 
  Maximize2,
  Tv,
  ListVideo,
  ChevronLeft,
  ChevronRight,
  Code2,
  ArrowRight
} from 'lucide-react';

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface VideoMasterclassModalProps {
  video: CuratedVideo;
  onClose: () => void;
  onSelectOtherVideo?: (video: CuratedVideo) => void;
}

export const VideoMasterclassModal: React.FC<VideoMasterclassModalProps> = ({
  video: initialVideo,
  onClose,
  onSelectOtherVideo
}) => {
  const { addXP, addNote } = useUserStore();
  const { runQuery } = useDuckDB();

  const [activeVideo, setActiveVideo] = useState<CuratedVideo>(initialVideo);
  const [activeTab, setActiveTab] = useState<'takeaways' | 'chapters' | 'practice' | 'notes'>('takeaways');
  const [noteContent, setNoteContent] = useState<string>('');
  const [noteSaved, setNoteSaved] = useState<boolean>(false);

  // Sync when initialVideo changes
  useEffect(() => {
    setActiveVideo(initialVideo);
  }, [initialVideo]);

  const playlist = activeVideo.playlist;

  // Determine stage milestone for persistent localStorage key matching PlaylistTracker
  const matchedStage = useMemo(() => {
    return MASTER_CURRICULUM.find(s => 
      (playlist && s.playlist.playlistTitle === playlist.playlistTitle) ||
      s.playlist.episodes.some(e => e.id === activeVideo.id || e.youtubeId === activeVideo.youtubeId || e.id === activeVideo.currentEpisodeId)
    );
  }, [playlist, activeVideo]);

  const stageMilestone = matchedStage ? matchedStage.milestone : (activeVideo.title.match(/Stage\s*\d+/i)?.[0] || 'Stage 01');
  const storageKey = `dataveda_watched_episodes_${stageMilestone.replace(/\s+/g, '_')}`;

  const [watchedEpisodeIds, setWatchedEpisodeIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setWatchedEpisodeIds(JSON.parse(saved));
      }
    } catch (e) {}
  }, [storageKey]);

  // Current Episode index in playlist
  const currentEpisodeIndex = useMemo(() => {
    if (!playlist || !playlist.episodes) return -1;
    return playlist.episodes.findIndex(
      (ep: PlaylistEpisode) => ep.id === activeVideo.id || ep.youtubeId === activeVideo.youtubeId || ep.id === activeVideo.currentEpisodeId
    );
  }, [playlist, activeVideo]);

  const hasPrev = playlist && currentEpisodeIndex > 0;
  const hasNext = playlist && currentEpisodeIndex >= 0 && currentEpisodeIndex < playlist.episodes.length - 1;

  const currentEpId = activeVideo.currentEpisodeId || activeVideo.id;
  const isCurrentWatched = watchedEpisodeIds.includes(currentEpId);

  const toggleEpisodeWatched = (epId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let updated: string[];
    const isNowWatched = !watchedEpisodeIds.includes(epId);
    if (isNowWatched) {
      updated = [...watchedEpisodeIds, epId];
      addXP(25);
    } else {
      updated = watchedEpisodeIds.filter(id => id !== epId);
    }
    setWatchedEpisodeIds(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (err) {}
  };

  const handleSwitchEpisode = React.useCallback((ep: PlaylistEpisode) => {
    setActiveVideo(prev => ({
      ...prev,
      id: ep.id,
      title: `${stageMilestone} Ep ${ep.order}: ${ep.title}`,
      youtubeId: ep.youtubeId,
      youtubeUrl: ep.youtubeUrl,
      duration: ep.duration,
      summary: ep.summary,
      currentEpisodeId: ep.id,
      chapters: [
        { time: '00:00', seconds: 0, title: 'Introduction & Architecture' },
        { time: '12:00', seconds: 720, title: 'Implementation & Configuration' },
        { time: '28:00', seconds: 1680, title: 'Code Walkthrough & Pipeline Run' },
        { time: '45:00', seconds: 2700, title: 'Key Engineering Takeaways' }
      ]
    }));
  }, [stageMilestone]);

  const handlePrev = () => {
    if (hasPrev && playlist) {
      handleSwitchEpisode(playlist.episodes[currentEpisodeIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext && playlist) {
      handleSwitchEpisode(playlist.episodes[currentEpisodeIndex + 1]);
    }
  };

  // Keyboard navigation: ArrowLeft, ArrowRight, Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && hasPrev && playlist) {
        handleSwitchEpisode(playlist.episodes[currentEpisodeIndex - 1]);
      } else if (e.key === 'ArrowRight' && hasNext && playlist) {
        handleSwitchEpisode(playlist.episodes[currentEpisodeIndex + 1]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrev, hasNext, playlist, currentEpisodeIndex, onClose, handleSwitchEpisode]);

  // Seek time in YouTube iframe
  const handleSeek = (seconds: number) => {
    const iframe = document.getElementById('masterclass-youtube-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = `https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&start=${seconds}&rel=0`;
    }
  };

  // DuckDB workbench state
  const [queryCode, setQueryCode] = useState<string>(
    activeVideo.practiceSnippet?.code || `SELECT 'Data Engineering' as domain, COUNT(*) as pipeline_count FROM fact_table;`
  );
  const [queryOutput, setQueryOutput] = useState<string | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleRunSQL = async () => {
    if (!queryCode.trim()) return;
    setIsRunning(true);
    setQueryError(null);
    setQueryOutput(null);

    const schemaDDL = `
      CREATE TABLE IF NOT EXISTS fact_table (trip_id INT, VendorID INT, payment_type_id INT, fare_amount DOUBLE, total_amount DOUBLE);
      DELETE FROM fact_table;
      INSERT INTO fact_table VALUES 
        (1, 1, 1, 24.50, 28.50),
        (2, 2, 1, 42.00, 48.00),
        (3, 1, 2, 15.00, 15.00),
        (4, 2, 1, 85.20, 99.00),
        (5, 1, 3, 12.00, 12.50);

      CREATE TABLE IF NOT EXISTS dim_payment_type (payment_type_id INT, payment_type_name VARCHAR);
      DELETE FROM dim_payment_type;
      INSERT INTO dim_payment_type VALUES (1, 'Credit Card'), (2, 'Cash'), (3, 'Digital Wallet');

      CREATE TABLE IF NOT EXISTS departments (department_id INT, department_name VARCHAR);
      DELETE FROM departments;
      INSERT INTO departments VALUES (1, 'Data Platform'), (2, 'Analytics'), (3, 'Infrastructure');

      CREATE TABLE IF NOT EXISTS employees (employee_id INT, department_id INT, salary DOUBLE);
      DELETE FROM employees;
      INSERT INTO employees VALUES 
        (101, 1, 145000), (102, 1, 160000), (103, 1, 138000), (104, 1, 175000), (105, 1, 150000),
        (201, 2, 115000), (202, 2, 120000), (203, 2, 125000), (204, 2, 130000), (205, 2, 110000);
    `;

    try {
      const res = await runQuery(queryCode, schemaDDL);
      if (res.error) {
        setQueryError(res.error);
      } else if (res.rows) {
        const formatted = res.rows.map(r => JSON.stringify(r)).join('\n');
        setQueryOutput(formatted || 'Query succeeded. (0 rows returned)');
      }
    } catch (e: any) {
      setQueryError(e.message || 'Execution error');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveNote = () => {
    if (!noteContent.trim()) return;
    addNote({
      body: noteContent,
      tags: [`#${activeVideo.topic.toLowerCase()}`, '#video-notes', `#${activeVideo.id}`],
      contentRef: {
        type: 'track_module',
        id: activeVideo.id,
        title: activeVideo.title,
        trackId: activeVideo.topic
      }
    });
    setNoteContent('');
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  };

  const completedCount = playlist 
    ? playlist.episodes.filter((ep: PlaylistEpisode) => watchedEpisodeIds.includes(ep.id)).length 
    : 0;
  const totalEpisodes = playlist ? playlist.episodes.length : 0;
  const playlistPct = totalEpisodes > 0 ? Math.round((completedCount / totalEpisodes) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-7xl max-h-[94vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 font-sans">
        
        {/* Top Header Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-950/95 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#0050FF]/20 text-brand-blue border border-[#0050FF]/40 shrink-0">
              {stageMilestone} • {activeVideo.topic}
            </span>
            <div className="truncate">
              <span className="text-xs sm:text-sm font-bold text-white truncate block">
                {activeVideo.title}
              </span>
              <span className="text-[11px] text-slate-400">
                {playlist ? `Series: ${playlist.playlistTitle}` : `Instructor: ${activeVideo.instructor}`}
              </span>
            </div>
          </div>

          {/* Episode Prev / Next Switcher Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {playlist && (
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
                <button
                  onClick={handlePrev}
                  disabled={!hasPrev}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  title="Previous Episode (←)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono font-bold text-slate-300 px-1">
                  Ep {currentEpisodeIndex >= 0 ? currentEpisodeIndex + 1 : 1}/{totalEpisodes}
                </span>
                <button
                  onClick={handleNext}
                  disabled={!hasNext}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  title="Next Episode (→)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={() => toggleEpisodeWatched(currentEpId)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                isCurrentWatched
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrentWatched ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{isCurrentWatched ? 'Completed (+25 XP)' : 'Mark Watched (+25 XP)'}</span>
              <span className="sm:hidden">{isCurrentWatched ? 'Done' : 'Watch'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Theater Split-Screen Body: Video & Console (Left) + In-Modal Playlist Drawer (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden min-h-0">
          
          {/* LEFT 8 COLS: Video Player + Under-Player Action Bar + Tabbed Console */}
          <div className="lg:col-span-8 flex flex-col overflow-y-auto border-r border-slate-800 scrollbar-thin">
            
            {/* 16:9 Cinema Player */}
            <div className="relative w-full aspect-video bg-black shadow-2xl shrink-0">
              <iframe
                id="masterclass-youtube-iframe"
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&enablejsapi=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute top-0 left-0 w-full h-full border-0"
              />
            </div>

            {/* Video Action Strip Directly Under Player */}
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                  {activeVideo.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1 font-mono text-cyan-400">
                    <Clock className="w-3.5 h-3.5" /> {activeVideo.duration}
                  </span>
                  <span>•</span>
                  <span>★ {activeVideo.rating || 4.9} rating</span>
                  <span>•</span>
                  <span>{playlist?.channelName || activeVideo.instructor}</span>
                </div>
              </div>

              {/* Action Buttons: Watch on YouTube & Links */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleEpisodeWatched(currentEpId)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    isCurrentWatched
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrentWatched ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{isCurrentWatched ? 'Completed' : 'Mark Watched'}</span>
                </button>

                <a
                  href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-[#FF0000] hover:bg-[#CC0000] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-red-600/30"
                >
                  <span>Watch on YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {activeVideo.githubUrl && (
                  <a
                    href={activeVideo.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
                    title="View GitHub Repository"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Technical Console Navigation Tabs */}
            <div className="flex items-center border-b border-slate-800 bg-slate-900 px-4 pt-2.5 gap-2 shrink-0 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('takeaways')}
                className={`pb-2 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'takeaways'
                    ? 'border-brand-blue text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Architecture & Takeaways</span>
              </button>

              <button
                onClick={() => setActiveTab('chapters')}
                className={`pb-2 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'chapters'
                    ? 'border-brand-blue text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Chapters & Timestamps ({activeVideo.chapters.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('practice')}
                className={`pb-2 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'practice'
                    ? 'border-brand-blue text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>DuckDB SQL Workbench</span>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`pb-2 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'notes'
                    ? 'border-brand-blue text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <PenSquare className="w-3.5 h-3.5" />
                <span>My Study Notes</span>
              </button>
            </div>

            {/* Tab Panel Content */}
            <div className="p-5 flex-1 bg-slate-900/60 overflow-y-auto space-y-4">
              
              {/* TAB 1: ARCHITECTURE & TAKEAWAYS */}
              {activeTab === 'takeaways' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono mb-1.5">
                      Lecture Abstract & Pipeline Context
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {activeVideo.summary}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
                      Key Architectural Takeaways
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {activeVideo.keyTakeaways.map((point, idx) => (
                        <div 
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                          <span className="leading-relaxed">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
                      Core Technologies & Cloud Services
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeVideo.techStack.map((tech, idx) => (
                        <span 
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CHAPTERS & TIMESTAMPS */}
              {activeTab === 'chapters' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeVideo.chapters.map((ch, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSeek(ch.seconds)}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono text-xs font-bold shrink-0 group-hover:scale-105 transition-transform">
                          {idx + 1}
                        </div>
                        <span className="text-xs font-medium text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                          {ch.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-mono font-bold text-cyan-400 shrink-0 pl-2">
                        <Play className="w-3 h-3 fill-current" />
                        <span>{ch.time}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* TAB 3: DUCKDB SQL WORKBENCH */}
              {activeTab === 'practice' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      <span className="font-mono font-bold text-white">In-Browser DuckDB WASM Runner</span>
                    </div>
                    <button
                      onClick={() => setQueryCode(activeVideo.practiceSnippet?.code || 'SELECT 1;')}
                      className="text-xs text-slate-400 hover:text-cyan-300 transition-colors"
                    >
                      Reset Starter Code
                    </button>
                  </div>

                  <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950 font-mono text-xs">
                    <div className="p-3 bg-slate-950 border-b border-slate-800">
                      <textarea
                        value={queryCode}
                        onChange={(e) => setQueryCode(e.target.value)}
                        className="w-full h-36 bg-transparent text-emerald-400 font-mono text-xs focus:outline-none resize-none leading-relaxed"
                        spellCheck={false}
                        placeholder="Write SQL query..."
                      />
                    </div>

                    <div className="p-3 bg-slate-900 border-t border-slate-800 font-mono text-xs">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase tracking-wider font-bold mb-1">
                        <span>Execution Output</span>
                        {isRunning && <span className="text-cyan-400 animate-pulse">Running query in DuckDB WASM...</span>}
                      </div>
                      <pre className="text-slate-200 overflow-auto max-h-36 whitespace-pre-wrap">
                        {queryOutput || queryError || 'Click "Run Query" to execute against pre-seeded tables.'}
                      </pre>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleRunSQL}
                      disabled={isRunning}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-cyan-600/30 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Run Query</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: STUDY NOTES */}
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
                      Personal Engineering Notes
                    </h4>
                    <p className="text-xs text-slate-400">
                      Record pipeline design patterns, interview questions, or edge cases from this lesson. Notes persist in your local learning store.
                    </p>
                  </div>

                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Document your architecture observations, code patterns, or questions..."
                    className="w-full h-36 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {noteSaved ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Note saved to your Vault!
                        </span>
                      ) : (
                        'Stored with timestamp reference'
                      )}
                    </span>

                    <button
                      onClick={handleSaveNote}
                      disabled={!noteContent.trim()}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT 4 COLS: In-Modal Series Playlist Drawer */}
          <div className="lg:col-span-4 bg-slate-950 flex flex-col overflow-hidden max-h-[85vh]">
            
            {/* Drawer Header with Series Progress */}
            <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <ListVideo className="w-4 h-4 text-cyan-400" />
                  <span>Curriculum Playlist</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-cyan-400">
                  {completedCount} / {totalEpisodes} Watched
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-brand-blue rounded-full transition-all duration-300"
                  style={{ width: `${playlistPct}%` }}
                />
              </div>
            </div>

            {/* Scrollable Episode Cards List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1 scrollbar-thin">
              {playlist && playlist.episodes ? (
                playlist.episodes.map((ep: PlaylistEpisode, idx: number) => {
                  const isPlaying = ep.id === activeVideo.id || ep.youtubeId === activeVideo.youtubeId || ep.id === activeVideo.currentEpisodeId;
                  const isWatched = watchedEpisodeIds.includes(ep.id);

                  return (
                    <div
                      key={ep.id}
                      onClick={() => handleSwitchEpisode(ep)}
                      className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-start justify-between gap-2.5 ${
                        isPlaying 
                          ? 'bg-[#0050FF]/20 border border-[#0050FF]/50 text-white shadow-xs' 
                          : 'hover:bg-slate-900/80 text-slate-300 border border-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 overflow-hidden">
                        <div className="mt-0.5 shrink-0">
                          {isPlaying ? (
                            <div className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold text-[9px] animate-pulse">
                              ▶
                            </div>
                          ) : (
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border ${
                              isWatched ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-slate-700 text-slate-500'
                            }`}>
                              {isWatched ? '✓' : ep.order}
                            </div>
                          )}
                        </div>

                        <div className="overflow-hidden">
                          <div className={`text-xs font-semibold leading-tight line-clamp-2 ${
                            isPlaying ? 'text-white font-bold' : isWatched ? 'text-slate-400 line-through' : 'text-slate-200'
                          }`}>
                            {ep.title}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 mt-1 flex items-center gap-1.5">
                            <span>{ep.duration}</span>
                            {isPlaying && (
                              <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-1 py-0.2 rounded border border-cyan-500/30">
                                Now Playing
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => toggleEpisodeWatched(ep.id, e)}
                        className={`p-1 rounded transition-colors shrink-0 ${
                          isWatched ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-600 hover:text-slate-400'
                        }`}
                        title={isWatched ? 'Mark unwatched' : 'Mark watched (+25 XP)'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No playlist attached to this video.
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
