'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ListVideo, 
  Check, 
  RotateCcw,
  ExternalLink,
  Tv
} from 'lucide-react';
import { StagePlaylist, PlaylistEpisode } from '../../content/curriculum/masterCurriculum';
import { useUserStore } from '../../lib/userStore';

interface PlaylistTrackerProps {
  stageMilestone: string; // e.g. "Stage 01"
  playlist: StagePlaylist;
  onPlayEpisode: (episode: PlaylistEpisode) => void;
  activePlayingEpisodeId?: string | null;
}

export const PlaylistTracker: React.FC<PlaylistTrackerProps> = ({
  stageMilestone,
  playlist,
  onPlayEpisode,
  activePlayingEpisodeId
}) => {
  const { addXP } = useUserStore();
  const storageKey = `dataveda_watched_episodes_${stageMilestone.replace(/\s+/g, '_')}`;

  const [watchedIds, setWatchedIds] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<'all' | 'unwatched' | 'watched'>('all');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setWatchedIds(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
    setMounted(true);
  }, [storageKey]);

  const toggleWatched = (episodeId: string) => {
    let updated: string[];
    const isNowWatched = !watchedIds.includes(episodeId);
    if (isNowWatched) {
      updated = [...watchedIds, episodeId];
      addXP(25); // reward for finishing a video lesson
    } else {
      updated = watchedIds.filter(id => id !== episodeId);
    }
    setWatchedIds(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetWatched = () => {
    setWatchedIds([]);
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {}
  };

  const totalVideos = playlist.episodes.length;
  const watchedCount = watchedIds.length;
  const progressPercent = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;
  const allWatched = totalVideos > 0 && watchedCount >= totalVideos;

  // Calculate total playlist time and watched time dynamically
  const totalPlaylistMinutes = playlist.episodes.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);

  const watchedMinutes = playlist.episodes
    .filter(ep => watchedIds.includes(ep.id))
    .reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  
  const formatMinutes = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m} min`;
    return `${h} hr ${m > 0 ? `${m} min` : ''}`.trim();
  };

  const totalPlaylistDuration = formatMinutes(totalPlaylistMinutes);

  const nextUnwatchedEpisode = playlist.episodes.find(ep => !watchedIds.includes(ep.id)) || playlist.episodes[0];

  const filteredEpisodes = playlist.episodes.filter(ep => {
    const isWatched = watchedIds.includes(ep.id);
    if (filterMode === 'watched') return isWatched;
    if (filterMode === 'unwatched') return !isWatched;
    return true;
  });

  if (!mounted) {
    return (
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse my-4">
        <div className="h-4 w-48 bg-slate-300 dark:bg-slate-700 rounded mb-2" />
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
    );
  }

  return (
    <div className="my-5 rounded-2xl border border-brand-blue/20 bg-gradient-to-br from-brand-blue/[0.03] via-slate-50 dark:via-slate-900/90 to-brand-blue/[0.03] p-5 shadow-sm">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue text-[11px] font-bold uppercase tracking-wider">
              <Tv className="w-3.5 h-3.5" />
              Complete Series Playlist ({totalVideos} Videos • {totalPlaylistDuration})
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
              by {playlist.channelName}
            </span>
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-50">
            {playlist.playlistTitle}
          </h4>
        </div>

        {/* Action Button: Play Next Unwatched */}
        <div className="flex items-center gap-2">
          {watchedCount > 0 && (
            <button
              onClick={handleResetWatched}
              title="Reset watched tracker"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => onPlayEpisode(nextUnwatchedEpisode)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-brand-blue text-white text-xs sm:text-sm font-semibold hover:bg-brand-hover transition-colors shadow-sm inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{allWatched ? 'Rewatch Series' : `Resume Ep ${nextUnwatchedEpisode.order}`}</span>
          </button>
        </div>
      </div>

      {/* Progress Metric Bar */}
      <div className="bg-white dark:bg-slate-950/70 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800/80 mb-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Watched: {watchedCount} of {totalVideos} Videos ({progressPercent}%)
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-500 dark:text-slate-400">
              {formatMinutes(watchedMinutes)} watched of {totalPlaylistDuration}
            </span>
          </div>
          {allWatched && (
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Series Completed!
            </span>
          )}
        </div>

        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              allWatched ? 'bg-emerald-500' : 'bg-brand-blue'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs & Collapsible Toggle */}
      <div className="flex items-center justify-between gap-2 pt-1 pb-3 text-xs border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-1">
          <span className="text-slate-500 dark:text-slate-400 mr-1 font-medium">Show:</span>
          {(['all', 'unwatched', 'watched'] as const).map((mode) => {
            const count = mode === 'all' 
              ? totalVideos 
              : mode === 'unwatched' 
              ? totalVideos - watchedCount 
              : watchedCount;
            return (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors capitalize ${
                  filterMode === mode
                    ? 'bg-brand-blue text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {mode} ({count})
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-brand-blue font-medium transition-colors"
        >
          <span>{isExpanded ? 'Collapse Episodes' : `Expand All (${totalVideos})`}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Episodes List */}
      {isExpanded && (
        <div className="mt-4 space-y-2.5 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
          {filteredEpisodes.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500 dark:text-slate-400">
              No episodes matching filter &quot;{filterMode}&quot;.
            </div>
          ) : (
            filteredEpisodes.map((ep) => {
              const isWatched = watchedIds.includes(ep.id);
              const isPlaying = activePlayingEpisodeId === ep.id;

              return (
                <div
                  key={ep.id}
                  className={`p-3 sm:p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isPlaying
                      ? 'bg-brand-blue/10 border-brand-blue ring-1 ring-brand-blue/40 shadow-sm'
                      : isWatched
                      ? 'bg-slate-50/80 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 opacity-90'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                  }`}
                >
                  {/* Left: Checkbox + Number + Title */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    
                    {/* Watched Toggle Checkbox */}
                    <button
                      type="button"
                      onClick={() => toggleWatched(ep.id)}
                      className="mt-0.5 flex-shrink-0 cursor-pointer"
                      title={isWatched ? 'Mark as unwatched' : 'Mark as watched (+25 XP)'}
                    >
                      {isWatched ? (
                        <div className="w-5 h-5 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-brand-blue transition-colors" />
                      )}
                    </button>

                    {/* Episode Number */}
                    <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 mt-0.5 shrink-0">
                      {ep.order.toString().padStart(2, '0')}.
                    </span>

                    {/* Title and Metadata */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className={`text-xs font-semibold hover:text-brand-blue cursor-pointer transition-colors ${
                          isWatched ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'
                        }`}
                          onClick={() => onPlayEpisode(ep)}
                        >
                          {ep.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          {ep.keyTopic}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {ep.summary}
                      </p>
                    </div>
                  </div>

                  {/* Right: Duration & Play Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pl-8 sm:pl-0">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {ep.duration}
                    </span>

                    <button
                      onClick={() => onPlayEpisode(ep)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                        isPlaying
                          ? 'bg-brand-blue text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-brand-blue hover:text-white text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{isPlaying ? 'Playing' : 'Play Video'}</span>
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
};
