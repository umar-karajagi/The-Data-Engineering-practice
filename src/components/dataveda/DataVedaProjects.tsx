'use client';

import React from 'react';
import { 
  FolderGit2, 
  Play, 
  ExternalLink, 
  Sparkles, 
  Star, 
  Eye, 
  Clock, 
  CheckCircle2, 
  Terminal,
  Database,
  ArrowRight
} from 'lucide-react';
import { CURATED_PROJECT_VIDEOS, CuratedVideo } from '../../content/videos/curatedVideos';

interface DataVedaProjectsProps {
  onOpenVideo: (video: CuratedVideo) => void;
}

export const DataVedaProjects: React.FC<DataVedaProjectsProps> = ({ onOpenVideo }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-xs font-semibold mb-3">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Production Portfolios</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-forge-text">
          Real-World <span className="text-brand-blue">Data Engineering Projects</span>
        </h1>
        <p className="mt-2 text-base text-forge-muted max-w-3xl">
          Build genuine portfolio projects that recruiters respect. Complete end-to-end architectures with free video masterclasses, open-source GitHub codebases, and public datasets.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {CURATED_PROJECT_VIDEOS.map((project) => (
          <div 
            key={project.id}
            className="group bg-vidhya-card border border-forge-border/50 rounded-2xl overflow-hidden shadow-sm hover:border-brand-blue/50 transition-all flex flex-col"
          >
            {/* Video Thumbnail Header */}
            <div 
              onClick={() => onOpenVideo(project)}
              className="relative aspect-video bg-zinc-950 overflow-hidden cursor-pointer"
            >
              <img 
                src={`https://img.youtube.com/vi/${project.youtubeId}/hqdefault.jpg`} 
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-brand-blue text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                </div>
              </div>

              {/* Bottom Video Meta Badges */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white font-medium">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/10">
                    {project.duration}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/10 text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {project.rating}
                  </span>
                </div>
                <span className="text-zinc-300 font-medium">
                  {project.views}
                </span>
              </div>
            </div>

            {/* Project Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-blue/10 text-brand-blue">
                    {project.topic}
                  </span>
                  <span className="text-xs text-forge-muted">
                    Instructor: <span className="text-forge-text font-medium">{project.instructor}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-forge-text group-hover:text-brand-blue transition-colors line-clamp-2">
                  {project.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-forge-muted leading-relaxed line-clamp-3">
                  {project.summary}
                </p>

                {/* Tech Stack Pills */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.techStack.map((tech, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-forge-bg border border-forge-border/40 text-[11px] font-medium text-forge-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-forge-border/30 flex items-center justify-between gap-3">
                <button
                  onClick={() => onOpenVideo(project)}
                  className="flex-1 py-2 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-brand-hover transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Watch Masterclass</span>
                </button>

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl border border-forge-border/50 text-forge-muted hover:text-forge-text hover:bg-forge-bg transition-colors"
                    title="View GitHub Repository"
                  >
                    <FolderGit2 className="w-4 h-4" />
                  </a>
                )}

                {project.datasetUrl && (
                  <a
                    href={project.datasetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl border border-forge-border/50 text-forge-muted hover:text-forge-text hover:bg-forge-bg transition-colors"
                    title="Download Raw Dataset"
                  >
                    <Database className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
