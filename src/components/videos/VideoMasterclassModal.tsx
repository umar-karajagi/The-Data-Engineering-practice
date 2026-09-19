'use client';

import React, { useState, useEffect } from 'react';
import { CuratedVideo } from '@/content/videos/curatedVideos';
import { useUserStore } from '@/lib/userStore';
import { useDuckDB } from '@/lib/useDuckDB';
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
  ListVideo
} from 'lucide-react';
import { PlaylistEpisode } from '@/content/curriculum/masterCurriculum';

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
  const { addXP, addNote, user } = useUserStore();
  const { runQuery } = useDuckDB();

  const [activeVideo, setActiveVideo] = useState<CuratedVideo>(initialVideo);
  const [activeTab, setActiveTab] = useState<'playlist' | 'chapters' | 'takeaways' | 'practice' | 'notes'>(
    initialVideo.playlist ? 'playlist' : 'chapters'
  );
  const [currentSeconds, setCurrentSeconds] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [noteContent, setNoteContent] = useState<string>('');
  const [noteSaved, setNoteSaved] = useState<boolean>(false);

  // Watched state for playlist
  const [watchedEpisodeIds, setWatchedEpisodeIds] = useState<string[]>([]);

  useEffect(() => {
    setActiveVideo(initialVideo);
    if (initialVideo.playlist) {
      setActiveTab('playlist');
    }
  }, [initialVideo]);

  const playlist = activeVideo.playlist;
  const stageMilestone = initialVideo.title.split(':')[0] || 'Stage 01';
  const storageKey = `dataveda_watched_episodes_${stageMilestone.replace(/\s+/g, '_')}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setWatchedEpisodeIds(JSON.parse(saved));
      }
    } catch (e) {}
  }, [storageKey]);

  const toggleEpisodeWatched = (epId: string) => {
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
    } catch (e) {}
  };

  const handleSwitchEpisode = (ep: PlaylistEpisode) => {
    const updatedVideo: CuratedVideo = {
      ...activeVideo,
      id: ep.id,
      title: `${stageMilestone} Ep ${ep.order}: ${ep.title}`,
      youtubeId: ep.youtubeId,
      youtubeUrl: ep.youtubeUrl,
      duration: ep.duration,
      summary: ep.summary,
      currentEpisodeId: ep.id,
      chapters: [
        { time: '00:00', seconds: 0, title: 'Introduction & Architecture' },
        { time: '10:00', seconds: 600, title: 'Hands-on Implementation' },
        { time: '25:00', seconds: 1500, title: 'Code Walkthrough & Pipeline Run' },
        { time: '40:00', seconds: 2400, title: 'Key Takeaways & Production Checks' }
      ]
    };
    setActiveVideo(updatedVideo);
  };

  // Workbench state
  const [queryCode, setQueryCode] = useState<string>(activeVideo.practiceSnippet?.code || '');
  const [queryOutput, setQueryOutput] = useState<string | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleSeek = (seconds: number) => {
    setCurrentSeconds(seconds);
    const iframe = document.getElementById('masterclass-youtube-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = `https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&start=${seconds}&rel=0`;
    }
  };

  const handleCompleteVideo = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      addXP(75);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 font-sans">
        
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#0050FF]/15 text-[#0050FF] border border-[#0050FF]/30 shrink-0">
              {activeVideo.topic} Masterclass
            </span>
            <div className="truncate">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate block">
                {activeVideo.title}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Instructor: {activeVideo.instructor} ({activeVideo.instructorRole})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleCompleteVideo}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isCompleted 
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {isCompleted ? <Check className="w-3.5 h-3.5" /> : <Award className="w-3.5 h-3.5 text-amber-500" />}
              <span>{isCompleted ? 'Completed (+75 XP)' : 'Mark Watched (+75 XP)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* YouTube Video Player Embed */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg border border-slate-200 dark:border-slate-800">
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

          {/* Title & Metadata Strip */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                {activeVideo.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1 text-amber-500 font-medium">
                  ★ {activeVideo.rating} rating
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {activeVideo.duration}
                </span>
                <span>•</span>
                <span>{activeVideo.views}</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                  {activeVideo.level}
                </span>
              </div>
            </div>

            {/* External Links */}
            <div className="flex items-center gap-2 shrink-0">
              {activeVideo.githubUrl && (
                <a
                  href={activeVideo.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-brand-blue flex items-center gap-1.5 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}
              {activeVideo.datasetUrl && (
                <a
                  href={activeVideo.datasetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-brand-blue flex items-center gap-1.5 transition-colors"
                >
                  <Database className="w-3.5 h-3.5 text-[#0050FF]" />
                  <span>Dataset</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              
              {playlist && (
                <button
                  onClick={() => setActiveTab('playlist')}
                  className={`px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'playlist'
                      ? 'border-[#0050FF] text-brand-blue font-bold'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-brand-blue'
                  }`}
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>Series Playlist ({playlist.episodes.length} Videos)</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('chapters')}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'chapters'
                    ? 'border-[#0050FF] text-brand-blue font-bold'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-brand-blue'
                }`}
              >
                Chapters & Timestamps ({activeVideo.chapters.length})
              </button>

              <button
                onClick={() => setActiveTab('takeaways')}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'takeaways'
                    ? 'border-[#0050FF] text-brand-blue font-bold'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-brand-blue'
                }`}
              >
                Key Architecture & Notes
              </button>

              {activeVideo.practiceSnippet && (
                <button
                  onClick={() => setActiveTab('practice')}
                  className={`px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === 'practice'
                      ? 'border-[#0050FF] text-brand-blue font-bold'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-brand-blue'
                  }`}
                >
                  In-Browser Practice Workbench
                </button>
              )}

              <button
                onClick={() => setActiveTab('notes')}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'notes'
                    ? 'border-[#0050FF] text-brand-blue font-bold'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-brand-blue'
                }`}
              >
                My Study Notes
              </button>
            </div>
          </div>

          {/* TAB 1: PLAYLIST LESSONS */}
          {activeTab === 'playlist' && playlist && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {playlist.playlistTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Total Duration: {playlist.totalDuration} • {watchedEpisodeIds.length} of {playlist.episodes.length} Watched
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {playlist.episodes.map((ep: PlaylistEpisode) => {
                  const isCurrent = activeVideo.youtubeId === ep.youtubeId;
                  const isWatched = watchedEpisodeIds.includes(ep.id);

                  return (
                    <div
                      key={ep.id}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCurrent
                          ? 'bg-brand-blue/10 border-brand-blue ring-1 ring-brand-blue/40 shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={() => toggleEpisodeWatched(ep.id)}
                          className="mt-0.5 flex-shrink-0 cursor-pointer"
                          title={isWatched ? 'Mark unwatched' : 'Mark watched (+25 XP)'}
                        >
                          {isWatched ? (
                            <div className="w-5 h-5 rounded bg-emerald-500 text-white flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                          )}
                        </button>

                        <span className="text-xs font-mono font-bold text-slate-400 mt-0.5">
                          {ep.order.toString().padStart(2, '0')}.
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-semibold cursor-pointer hover:text-brand-blue ${
                              isCurrent ? 'text-brand-blue font-bold' : isWatched ? 'line-through text-slate-500' : 'text-slate-900 dark:text-slate-100'
                            }`}
                              onClick={() => handleSwitchEpisode(ep)}
                            >
                              {ep.title}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              {ep.keyTopic}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {ep.summary}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 pl-8 sm:pl-0">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {ep.duration}
                        </span>

                        <button
                          onClick={() => handleSwitchEpisode(ep)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                            isCurrent
                              ? 'bg-brand-blue text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-brand-blue hover:text-white'
                          }`}
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{isCurrent ? 'Now Playing' : 'Play'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CHAPTERS & TIMESTAMPS */}
          {activeTab === 'chapters' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeVideo.chapters.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSeek(ch.seconds)}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-brand-blue/60 hover:bg-brand-blue/[0.04] transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center font-mono text-xs font-bold shrink-0 group-hover:scale-105 transition-transform">
                      {idx + 1}
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-brand-blue transition-colors truncate">
                      {ch.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-brand-blue shrink-0 pl-2">
                    <Play className="w-3 h-3 fill-brand-blue" />
                    <span>{ch.time}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* TAB 3: KEY ARCHITECTURE & NOTES */}
          {activeTab === 'takeaways' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-1">
                  Masterclass Summary
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeVideo.summary}
                </p>
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-2">
                Key Architectural Takeaways
              </h4>
              <div className="grid grid-cols-1 gap-2.5">
                {activeVideo.keyTakeaways.map((point, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Technologies Practiced in this Session
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeVideo.techStack.map((tech, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRACTICE WORKBENCH */}
          {activeTab === 'practice' && activeVideo.practiceSnippet && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-1">
                  Session Practice Problem
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeVideo.practiceSnippet.explanation}
                </p>
              </div>

              {/* Code Editor */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950">
                <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-brand-blue" />
                    <span className="font-mono">SQL / DuckDB In-Memory Execution</span>
                  </div>
                  <button
                    onClick={() => setQueryCode(activeVideo.practiceSnippet?.code || '')}
                    className="hover:text-brand-blue transition-colors cursor-pointer"
                  >
                    Reset Starter Code
                  </button>
                </div>

                <div className="p-4 font-mono text-sm bg-slate-50 dark:bg-slate-950">
                  <textarea
                    value={queryCode}
                    onChange={(e) => setQueryCode(e.target.value)}
                    className="w-full h-40 bg-transparent text-emerald-600 dark:text-emerald-400 font-mono text-xs sm:text-sm focus:outline-none resize-none leading-relaxed"
                    spellCheck={false}
                  />
                </div>

                {/* Output Console */}
                <div className="p-3 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 uppercase tracking-wider font-bold mb-1.5">
                    <span>Execution Result</span>
                    {isRunning && <span className="text-brand-blue animate-pulse">Running query...</span>}
                  </div>
                  <pre className="text-slate-800 dark:text-slate-200 overflow-auto max-h-32 whitespace-pre-wrap">
                    {queryOutput || queryError || 'Click "Run Query" to execute against pre-seeded DuckDB WASM memory.'}
                  </pre>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleRunSQL}
                  disabled={isRunning}
                  className="px-5 py-2 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-brand-hover transition-colors flex items-center gap-1.5 shadow-md shadow-brand-blue/20 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Run Query</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: STUDY NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-1">
                  Personal Study Notes
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Record key insights, pipeline snippets, and interview observations from this masterclass. Notes persist in your local learning store.
                </p>
              </div>

              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Write your session takeaways, architectural lessons, or questions to review..."
                className="w-full h-44 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-brand-blue leading-relaxed"
              />

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {noteSaved ? (
                    <span className="text-emerald-500 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Note saved to your Vault!
                    </span>
                  ) : (
                    'Notes are stored with course timestamp'
                  )}
                </span>

                <button
                  onClick={handleSaveNote}
                  disabled={!noteContent.trim()}
                  className="px-4 py-2 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Save Note
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
