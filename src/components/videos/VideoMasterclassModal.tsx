'use client';

import React, { useState } from 'react';
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
  Maximize2 
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
  video,
  onClose,
  onSelectOtherVideo
}) => {
  const { addXP, addNote, user } = useUserStore();
  const { runQuery } = useDuckDB();

  const [activeTab, setActiveTab] = useState<'chapters' | 'takeaways' | 'practice' | 'notes'>('chapters');
  const [currentSeconds, setCurrentSeconds] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [noteContent, setNoteContent] = useState<string>('');
  const [noteSaved, setNoteSaved] = useState<boolean>(false);

  // Workbench state
  const [queryCode, setQueryCode] = useState<string>(video.practiceSnippet?.code || '');
  const [queryOutput, setQueryOutput] = useState<string | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleSeek = (seconds: number) => {
    setCurrentSeconds(seconds);
    const iframe = document.getElementById('masterclass-youtube-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&start=${seconds}&rel=0`;
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
      tags: [`#${video.topic.toLowerCase()}`, '#video-notes', `#${video.id}`],
      contentRef: {
        type: 'track_module',
        id: video.id,
        title: video.title,
        trackId: video.topic
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
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-[#0C0C0C] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden text-neutral-100 font-sans">
        
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 border-b border-[#262626] bg-[#141414] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0050FF]/15 text-[#0050FF] border border-[#0050FF]/30 text-xs font-semibold shrink-0">
              {video.topic}
            </span>
            <span className="text-xs font-medium text-neutral-400 truncate hidden sm:inline">
              {video.instructor} • {video.instructorRole}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={video.youtubeUrl || `https://www.youtube.com/watch?v=${video.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-red-600/15 hover:bg-red-600/25 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Open video directly on YouTube"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Watch on YouTube</span>
            </a>

            <button
              onClick={handleCompleteVideo}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isCompleted 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-[#0050FF] hover:bg-[#1C449A] text-white shadow-md shadow-[#0050FF]/20'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mastered (+75 XP)</span>
                </>
              ) : (
                <>
                  <Award className="w-3.5 h-3.5" />
                  <span>Complete (+75 XP)</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              aria-label="Close masterclass modal"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Main 16:9 Video Player */}
          <div className="relative w-full rounded-xl overflow-hidden bg-black border border-[#262626] shadow-2xl" style={{ paddingBottom: '56.25%' }}>
            <iframe
              id="masterclass-youtube-iframe"
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&enablejsapi=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute top-0 left-0 w-full h-full border-0"
            />
          </div>

          {/* Title & Metadata Strip */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#262626] pb-4">
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {video.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                <span className="flex items-center gap-1 text-amber-400 font-medium">
                  ★ {video.rating} rating
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {video.duration}
                </span>
                <span>•</span>
                <span>{video.views}</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300">
                  {video.level}
                </span>
              </div>
            </div>

            {/* External Links */}
            <div className="flex items-center gap-2 shrink-0">
              {video.githubUrl && (
                <a
                  href={video.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#1C1C1E] hover:bg-[#262626] border border-[#262626] text-xs font-medium text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 text-neutral-500" />
                </a>
              )}
              {video.datasetUrl && (
                <a
                  href={video.datasetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#1C1C1E] hover:bg-[#262626] border border-[#262626] text-xs font-medium text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Database className="w-3.5 h-3.5 text-[#0050FF]" />
                  <span>Dataset</span>
                  <ExternalLink className="w-3 h-3 text-neutral-500" />
                </a>
              )}
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="border-b border-[#262626]">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('chapters')}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'chapters'
                    ? 'border-[#0050FF] text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                Chapters & Timestamps ({video.chapters.length})
              </button>
              <button
                onClick={() => setActiveTab('takeaways')}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'takeaways'
                    ? 'border-[#0050FF] text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                Key Architecture & Notes
              </button>
              {video.practiceSnippet && (
                <button
                  onClick={() => setActiveTab('practice')}
                  className={`px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === 'practice'
                      ? 'border-[#0050FF] text-white'
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  In-Browser Practice Workbench
                </button>
              )}
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'notes'
                    ? 'border-[#0050FF] text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                My Personal Notes
              </button>
            </div>
          </div>

          {/* TAB 1: CHAPTERS & TIMESTAMPS */}
          {activeTab === 'chapters' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {video.chapters.map((chap, i) => (
                <button
                  key={i}
                  onClick={() => handleSeek(chap.seconds)}
                  className="p-3 rounded-xl bg-[#141414] hover:bg-[#1C1C1E] border border-[#262626] hover:border-[#0050FF]/50 text-left flex items-center justify-between gap-3 group transition-all"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="px-2 py-0.5 rounded bg-black border border-neutral-700 font-mono text-[11px] text-[#0050FF] shrink-0 font-bold">
                      {chap.time}
                    </span>
                    <span className="text-xs font-medium text-neutral-200 group-hover:text-white truncate">
                      {chap.title}
                    </span>
                  </div>
                  <Play className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#0050FF] shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          )}

          {/* TAB 2: KEY ARCHITECTURE & SUMMARY */}
          {activeTab === 'takeaways' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#141414] border border-[#262626] space-y-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
                  Course Architecture & Summary
                </span>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {video.summary}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
                  Key Takeaways & Production Patterns
                </span>
                <div className="space-y-2">
                  {video.keyTakeaways.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#141414] border border-[#262626] flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#0050FF]/15 text-[#0050FF] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="text-xs text-neutral-200 leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
                  Tech Stack Utilized
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {video.techStack.map(tech => (
                    <span key={tech} className="px-2.5 py-1 rounded-lg bg-[#1C1C1E] border border-[#262626] text-xs text-neutral-300 font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: IN-BROWSER WORKBENCH */}
          {activeTab === 'practice' && video.practiceSnippet && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-[#0050FF]/10 border border-[#0050FF]/30 text-xs text-neutral-200 flex items-center justify-between">
                <span>{video.practiceSnippet.explanation}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black text-[#0050FF] border border-[#0050FF]/40">
                  DuckDB WASM Engine
                </span>
              </div>

              {/* Code Editor */}
              <div className="rounded-xl overflow-hidden border border-[#262626] bg-[#101415]">
                <div className="px-4 py-2 border-b border-[#262626] bg-[#141414] flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-neutral-400">SQL Exercise Editor</span>
                  <button
                    onClick={handleRunSQL}
                    disabled={isRunning}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0050FF] hover:bg-[#1C449A] text-white text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>{isRunning ? 'Running Query...' : 'Run Query'}</span>
                  </button>
                </div>
                <textarea
                  value={queryCode}
                  onChange={(e) => setQueryCode(e.target.value)}
                  className="w-full h-40 p-4 bg-transparent font-mono text-xs text-neutral-200 focus:outline-none resize-none leading-relaxed"
                  spellCheck={false}
                />
              </div>

              {/* Execution Results */}
              {queryError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                  {queryError}
                </div>
              )}

              {queryOutput && (
                <div className="p-3.5 rounded-xl bg-black border border-[#262626] text-xs font-mono text-emerald-400 whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {queryOutput}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MY PERSONAL NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#141414] border border-[#262626] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-300">
                    Draft Private Note (Saved to your Engineer Record)
                  </span>
                  {noteSaved && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                      <Check className="w-3.5 h-3.5" /> Saved to Notes!
                    </span>
                  )}
                </div>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Note down timestamp insights, questions, or key code syntax from this video..."
                  className="w-full h-32 p-3 rounded-xl bg-[#0C0C0C] border border-[#262626] text-xs text-neutral-200 focus:outline-none focus:border-[#0050FF] resize-none"
                />
                <button
                  onClick={handleSaveNote}
                  disabled={!noteContent.trim()}
                  className="px-4 py-2 rounded-xl bg-[#0050FF] hover:bg-[#1C449A] text-white text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40"
                >
                  <PenSquare className="w-3.5 h-3.5" />
                  <span>Save Note</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
