'use client';

import React from 'react';
import { 
  BookOpen, 
  Terminal, 
  Heart, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

const YoutubeIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const TwitterIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface DataVidhyaFooterProps {
  onNavigateTab: (tab: string) => void;
  onOpenVideo?: (videoId: string) => void;
}

export const DataVidhyaFooter: React.FC<DataVidhyaFooterProps> = ({
  onNavigateTab,
  onOpenVideo
}) => {
  return (
    <footer className="border-t border-[#262626] bg-[#0C0C0C] text-neutral-400 font-sans pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 text-xs">
          
          {/* Column 1: Brand & Community */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0050FF] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#0050FF]/25">
                DV
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Data Vidhya
              </span>
            </div>
            <p className="text-neutral-400 leading-relaxed text-xs">
              Everything you need to become a job-ready Data Engineer. Learn fundamentals, build 23 real-world projects, practice 850+ problems, and master modern cloud data stacks.
            </p>

            {/* Social Proof Links */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://www.youtube.com/@DarshilParmar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#141414] hover:bg-[#1C1C1E] border border-[#262626] text-red-400 flex items-center justify-center transition-colors"
                title="YouTube (200K+ Subscribers)"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://www.linkedin.com/company/datavidhya/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#141414] hover:bg-[#1C1C1E] border border-[#262626] text-blue-400 flex items-center justify-center transition-colors"
                title="LinkedIn (130K+ Followers)"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com/thedatavidhya" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#141414] hover:bg-[#1C1C1E] border border-[#262626] text-neutral-300 flex items-center justify-center transition-colors"
                title="X (Twitter - 30K+ Followers)"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://github.com/darshilparmar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#141414] hover:bg-[#1C1C1E] border border-[#262626] text-neutral-300 flex items-center justify-center transition-colors"
                title="GitHub Repositories"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Courses */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Core Courses
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onOpenVideo ? onOpenVideo('course-sql-masterclass') : onNavigateTab('catalog')} 
                  className="hover:text-white transition-colors text-left"
                >
                  SQL Fundamentals & Advanced
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenVideo ? onOpenVideo('course-python-de') : onNavigateTab('catalog')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Python for Data Engineering
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenVideo ? onOpenVideo('course-pyspark-full') : onNavigateTab('catalog')} 
                  className="hover:text-white transition-colors text-left"
                >
                  PySpark & Apache Spark
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenVideo ? onOpenVideo('course-airflow-mastery') : onNavigateTab('catalog')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Apache Airflow Orchestration
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenVideo ? onOpenVideo('project-dbt-snowflake-netflix') : onNavigateTab('catalog')} 
                  className="hover:text-white transition-colors text-left"
                >
                  dbt Core & Modern Modeling
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenVideo ? onOpenVideo('course-snowflake-mastery') : onNavigateTab('catalog')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Snowflake Data Warehousing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenVideo ? onOpenVideo('course-kafka-streaming') : onNavigateTab('catalog')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Apache Kafka Real-Time Streaming
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Real-World Projects */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Production Projects
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onOpenVideo ? onOpenVideo('hero-uber-analytics') : onNavigateTab('home')} 
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <span>Uber GCP & Mage Analytics</span>
                  <span className="text-[10px] text-[#0050FF] font-mono font-bold">1.2M+</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenVideo ? onOpenVideo('project-spotify-aws') : onNavigateTab('home')} 
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <span>Spotify AWS Lambda Pipeline</span>
                  <span className="text-[10px] text-[#0050FF] font-mono font-bold">850K+</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenVideo ? onOpenVideo('project-youtube-analysis') : onNavigateTab('home')} 
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <span>YouTube Data Analysis AWS</span>
                  <span className="text-[10px] text-[#0050FF] font-mono font-bold">620K+</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenVideo ? onOpenVideo('project-kafka-stock-market') : onNavigateTab('home')} 
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <span>Real-Time Kafka Stock Market</span>
                  <span className="text-[10px] text-[#0050FF] font-mono font-bold">740K+</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenVideo ? onOpenVideo('project-dbt-snowflake-netflix') : onNavigateTab('home')} 
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <span>Netflix dbt & Snowflake</span>
                  <span className="text-[10px] text-[#0050FF] font-mono font-bold">390K+</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Practice & Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Practice & Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigateTab('tracks')} className="hover:text-white transition-colors text-left">
                  850+ Coding Problems
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('tracks')} className="hover:text-white transition-colors text-left">
                  DuckDB In-Browser SQL Lab
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('roadmap')} className="hover:text-white transition-colors text-left">
                  Data Architecture Playground
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('career-studio')} className="hover:text-white transition-colors text-left">
                  AI Resume Evaluator & ATS
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('career-studio')} className="hover:text-white transition-colors text-left">
                  Google XYZ Bullet Improver
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('vault')} className="hover:text-white transition-colors text-left">
                  The Vault (Book & PDF Library)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Career Tracks & Guides */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Interview Guides
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onOpenVideo ? onOpenVideo('course-system-design-interview') : onNavigateTab('catalog')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Data Engineering System Design
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('catalog')} className="hover:text-white transition-colors text-left">
                  80 SQL Interview Questions (2026)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('catalog')} className="hover:text-white transition-colors text-left">
                  70 Spark Interview Questions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('catalog')} className="hover:text-white transition-colors text-left">
                  55 Snowflake Interview Questions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('catalog')} className="hover:text-white transition-colors text-left">
                  50 Kafka & Streaming Questions
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Free Model Guarantee */}
        <div className="pt-8 border-t border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span>© 2026 Data Vidhya.</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">100% Free Open Access Edition</span>
            <span>•</span>
            <span>All curated video masterclasses belong to their respective creators.</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => onNavigateTab('home')} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => onNavigateTab('home')} className="hover:text-white transition-colors">
              Terms of Use
            </button>
            <span>•</span>
            <button onClick={() => onNavigateTab('vault')} className="hover:text-white transition-colors">
              The Vault
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
