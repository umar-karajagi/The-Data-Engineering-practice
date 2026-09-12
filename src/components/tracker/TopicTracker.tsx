'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Star, 
  Search, 
  Filter, 
  BookOpen, 
  HelpCircle, 
  FileEdit, 
  Save, 
  X, 
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { TRACKER_TOPICS } from '../../content/tracker/topics';
import { TopicItem, TrackType } from '../../types';

export const TopicTracker: React.FC<{
  onNavigateBook?: (bookId: string) => void;
}> = ({ onNavigateBook }) => {
  const [topics, setTopics] = useState<TopicItem[]>(TRACKER_TOPICS);
  const [activeTrack, setActiveTrack] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);
  const [notesDrawerOpen, setNotesDrawerOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

  const tracks: { id: string; label: string; count: number; color: string }[] = [
    { id: 'ALL', label: 'All Tracks', count: 137, color: 'var(--text-primary)' },
    { id: 'sql', label: 'SQL (23)', count: 23, color: 'var(--track-sql)' },
    { id: 'pyspark', label: 'Python & Spark (19)', count: 19, color: 'var(--track-pyspark)' },
    { id: 'dsa', label: 'DSA for DE (16)', count: 16, color: 'var(--track-dsa)' },
    { id: 'azure', label: 'Azure & Databricks (18)', count: 18, color: 'var(--track-azure)' },
    { id: 'warehousing', label: 'Data Warehousing (16)', count: 16, color: 'var(--track-warehousing)' },
    { id: 'architecture', label: 'Core DE & Systems (30)', count: 30, color: 'var(--track-architecture)' },
    { id: 'behavioral', label: 'Behavioral & Global (15)', count: 15, color: 'var(--track-behavioral)' },
  ];

  const handleStatusChange = (id: string, newStatus: TopicItem['status']) => {
    setTopics(topics.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleConfidenceChange = (id: string, stars: 1 | 2 | 3 | 4 | 5) => {
    setTopics(topics.map(t => t.id === id ? { ...t, confidence: stars } : t));
  };

  const filteredTopics = topics.filter(t => {
    const matchesTrack = activeTrack === 'ALL' || t.track === activeTrack;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.source_book.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrack && matchesSearch;
  });

  const completedCount = topics.filter(t => t.status === 'Done').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forge-border pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-forge-secondary">
            <span className="text-track-python font-bold">137-TOPIC INTERVIEW PREPARATION TRACKER</span>
            <span>•</span>
            <span className="text-forge-text font-bold">{completedCount} of {topics.length} Mastered</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forge-text tracking-tight mt-1">
            Data Engineering Technical Interview Matrix
          </h1>
          <p className="text-xs sm:text-sm text-forge-secondary mt-1">
            Track confidence (1–5 stars), review question edge cases, and save notes across all 8 disciplines.
          </p>
        </div>

        {/* Overall Progress Meter */}
        <div className="bg-forge-card p-4 rounded-2xl border border-forge-border min-w-[240px] space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-forge-secondary">Overall Mastery</span>
            <span className="text-track-sql font-bold">{Math.round((completedCount / topics.length) * 100)}%</span>
          </div>
          <div className="w-full bg-forge-surface rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-track-sql to-track-warehousing h-full transition-all duration-500"
              style={{ width: `${(completedCount / topics.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Track Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-forge-card p-4 rounded-2xl border border-forge-border">
        
        {/* Track Pills */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          {tracks.map((tr) => (
            <button
              key={tr.id}
              onClick={() => setActiveTrack(tr.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeTrack === tr.id
                  ? 'bg-forge-bg text-forge-text border border-forge-border shadow-sm'
                  : 'text-forge-secondary hover:text-forge-text'
              }`}
            >
              <span style={{ color: tr.color }}>{tr.label}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-forge-muted" />
          <input
            type="text"
            placeholder="Filter topics, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-forge-bg border border-forge-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-forge-text placeholder-forge-muted focus:outline-none focus:border-track-sql w-56 font-mono"
          />
        </div>

      </div>

      {/* Topics Table List */}
      <div className="bg-forge-card border border-forge-border rounded-2xl overflow-hidden shadow-xl">
        <div className="divide-y divide-forge-border/60">
          {filteredTopics.map((item) => {
            const isDone = item.status === 'Done';

            return (
              <div 
                key={item.id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  isDone ? 'bg-forge-bg/40' : 'hover:bg-forge-bg/60'
                }`}
              >
                
                {/* Left: Status Toggle & Info */}
                <div className="flex items-start gap-3.5 max-w-2xl">
                  <button
                    onClick={() => handleStatusChange(item.id, isDone ? 'In Progress' : 'Done')}
                    className="mt-0.5"
                    title="Toggle Completed"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-forge-muted hover:text-forge-text" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                      <span className={`px-2 py-0.2 rounded font-bold uppercase ${
                        item.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-forge-surface text-forge-secondary'
                      }`}>
                        {item.priority} Priority
                      </span>
                      <span className="text-forge-muted">•</span>
                      <span className="text-forge-secondary font-bold">{item.category}</span>
                      <span className="text-forge-muted">•</span>
                      <span className="text-track-warehousing truncate max-w-xs">{item.source_book}</span>
                    </div>

                    <h3 
                      onClick={() => {
                        setSelectedTopic(item);
                        setNoteText(item.notes || '');
                        setNotesDrawerOpen(true);
                      }}
                      className="text-sm font-bold text-forge-text hover:text-track-sql cursor-pointer transition-colors"
                    >
                      {item.title}
                    </h3>

                    <p className="text-xs text-forge-secondary font-sans leading-relaxed line-clamp-1">
                      {item.summary}
                    </p>
                  </div>
                </div>

                {/* Right: Confidence Stars & Actions */}
                <div className="flex items-center gap-6 sm:self-center font-mono">
                  
                  {/* 1-5 Star Confidence Rating */}
                  <div className="flex items-center gap-1" title="Confidence rating (1 to 5)">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        onClick={() => handleConfidenceChange(item.id, star as any)}
                        className={`w-4 h-4 cursor-pointer transition-colors ${
                          star <= item.confidence 
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-forge-border hover:text-amber-400'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Status Badge */}
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                    className="bg-forge-bg border border-forge-border rounded-lg px-2.5 py-1 text-xs text-forge-text font-mono focus:outline-none focus:border-track-sql"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                    <option value="Skip">Skip</option>
                  </select>

                  {/* Notes Drawer trigger */}
                  <button
                    onClick={() => {
                      setSelectedTopic(item);
                      setNoteText(item.notes || '');
                      setNotesDrawerOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-forge-muted hover:text-forge-text hover:bg-forge-surface"
                    title="Open Notes & Interview Questions"
                  >
                    <FileEdit className="w-4 h-4" />
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Slide-over Notes & Deep-Dive Drawer */}
      {notesDrawerOpen && selectedTopic && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-forge-card border-l border-forge-border h-full overflow-y-auto p-6 space-y-6 shadow-2xl flex flex-col justify-between">
            
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-forge-border pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-track-sql">
                    {selectedTopic.category}
                  </span>
                  <h2 className="text-lg font-bold text-forge-text mt-0.5">{selectedTopic.title}</h2>
                </div>
                <button onClick={() => setNotesDrawerOpen(false)} className="text-forge-muted hover:text-forge-text">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Source book citation */}
              <div className="p-3.5 rounded-xl bg-forge-bg border border-forge-border space-y-1">
                <span className="text-[10px] font-mono font-bold text-track-warehousing uppercase">
                  Source Literature Reference:
                </span>
                <p className="text-xs font-bold text-forge-text">{selectedTopic.source_book}</p>
              </div>

              {/* Summary */}
              <p className="text-xs text-forge-secondary font-sans leading-relaxed bg-forge-bg p-3.5 rounded-xl border border-forge-border">
                {selectedTopic.summary}
              </p>

              {/* Key Interview Questions */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                  Common Technical Interview Questions:
                </span>
                <div className="space-y-2">
                  {selectedTopic.keyInterviewQuestions.map((q, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-forge-bg border border-forge-border text-xs text-forge-text italic font-sans">
                      "{q}"
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Notes */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-forge-text uppercase">
                  Personal Study Notes & Cheat Sheet:
                </span>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={5}
                  placeholder="Record your solution outline, key nuances, or company-specific questions..."
                  className="w-full bg-forge-bg border border-forge-border rounded-xl p-3 text-xs text-forge-text placeholder-forge-muted focus:outline-none focus:border-track-sql font-mono resize-y"
                />
              </div>

            </div>

            <div className="pt-4 border-t border-forge-border flex justify-end">
              <button
                onClick={() => {
                  setTopics(topics.map(t => t.id === selectedTopic.id ? { ...t, notes: noteText } : t));
                  setNotesDrawerOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-track-sql hover:bg-blue-600 text-white text-xs font-mono font-bold"
              >
                Save Notes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
