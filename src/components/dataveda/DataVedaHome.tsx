'use client';

import React, { useState } from 'react';
import { 
  HERO_MASTERCLASS_VIDEO, 
  CURATED_PROJECT_VIDEOS, 
  CURATED_COURSE_VIDEOS, 
  CuratedVideo 
} from '../../content/videos/curatedVideos';
import { 
  Play, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  Clock, 
  BookOpen, 
  Terminal, 
  Layers, 
  Briefcase, 
  Users, 
  ArrowRight, 
  ChevronRight, 
  ChevronDown, 
  Award, 
  ExternalLink, 
  Database, 
  Code2, 
  Compass, 
  Check, 
  Zap, 
  Flame, 
  Trophy,
  Filter
} from 'lucide-react';

interface DataVedaHomeProps {
  onOpenVideo: (video: CuratedVideo) => void;
  onNavigateTab: (tab: string) => void;
  onOpenAssessment: () => void;
  onSelectCourse?: (courseId: string) => void;
}

export const DataVedaHome: React.FC<DataVedaHomeProps> = ({
  onOpenVideo,
  onNavigateTab,
  onOpenAssessment,
  onSelectCourse
}) => {
  // Role Path Selector State ('tracks' | 'courses' | 'skills')
  const [roleTab, setRoleTab] = useState<'tracks' | 'courses' | 'skills'>('tracks');

  // Selected tool filter for tech stacks
  const [selectedTech, setSelectedTech] = useState<string>('All');

  // 4-step timeline active step
  const [activeStep, setActiveStep] = useState<number>(1);

  // 13 Tools active slide/tab
  const [activeToolIdx, setActiveToolIdx] = useState<number>(0);

  // FAQ open state
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(prev => prev === idx ? null : idx);
  };

  const techStackList = [
    { name: 'All', icon: '⚡' },
    { name: 'SQL', icon: '🗄️' },
    { name: 'Python', icon: '🐍' },
    { name: 'Spark', icon: '🔥' },
    { name: 'Airflow', icon: '🌪️' },
    { name: 'dbt', icon: '🟧' },
    { name: 'Snowflake', icon: '❄️' },
    { name: 'Kafka', icon: '📨' },
    { name: 'AWS', icon: '☁️' },
    { name: 'GCP', icon: '🌐' }
  ];

  const thirteenTools = [
    {
      title: 'Coding Problems',
      description: '850+ company-tagged SQL, Python & PySpark problems turn interviews into reruns — you walk in having already solved what Google, Meta and Amazon will ask.',
      tag: '850+ Problems',
      tabTarget: 'tracks'
    },
    {
      title: 'Curated Video Tutorials',
      description: 'Full-length, high-definition masterclasses embedded directly with interactive timestamp chapters, code snippets, and key takeaways.',
      tag: 'Full Masterclasses',
      tabTarget: 'projects'
    },
    {
      title: 'Real-World Projects',
      description: '23 production-grade data pipelines (Uber GCP, Spotify AWS, YouTube ETL, Kafka Real-Time) with architecture diagrams and GitHub repositories.',
      tag: '23 Projects',
      tabTarget: 'projects'
    },
    {
      title: 'Data Model Playground',
      description: 'Design and validate Star Schemas, Snowflake Schemas, and SCD Type 2 dimension tables directly in your browser.',
      tag: 'Interactive',
      tabTarget: 'tracks'
    },
    {
      title: 'Architecture Playground',
      description: 'Solve real-world distributed systems, capacity planning, and streaming architectures before your system design interviews.',
      tag: 'System Design',
      tabTarget: 'roadmap'
    },
    {
      title: 'Structured Learning Paths',
      description: 'Zero to job-ready roadmaps curated by senior engineers, preventing tutorial hell with structured prerequisite sequencing.',
      tag: 'Prerequisite-Gated',
      tabTarget: 'roadmap'
    },
    {
      title: 'Cloud Labs',
      description: 'Hands-on guided walkthroughs executing data workloads across AWS, GCP, Azure, Snowflake, and Databricks.',
      tag: 'Multi-Cloud',
      tabTarget: 'projects'
    },
    {
      title: 'AI Resume Evaluator',
      description: 'Real-time ATS diagnostics, keyword coverage matching against target job descriptions, and Google XYZ bullet improvements.',
      tag: 'ResumeCraft',
      tabTarget: 'resources'
    },
    {
      title: 'The Vault (Book Library)',
      description: 'Read the complete industry textbooks online: Kimball Data Warehouse Toolkit, Designing Data-Intensive Applications, and more.',
      tag: 'Full Books',
      tabTarget: 'library'
    },
    {
      title: 'Article Podcasts & Guides',
      description: '300+ concise deep dives explaining Airflow internals, PySpark memory tuning, Kafka consumer groups, and data contracts.',
      tag: 'Deep Dives',
      tabTarget: 'projects'
    },
    {
      title: 'Community Solutions',
      description: 'Explore optimal query solutions and benchmark executions contributed by engineers from Google, Amazon, and Stripe.',
      tag: 'Peer Verified',
      tabTarget: 'tracks'
    },
    {
      title: 'Karma & Leaderboard',
      description: 'Earn reputation points, unlock verified competency badges, and track your ranking across the engineering cohort.',
      tag: 'Rankings',
      tabTarget: 'certificates'
    },
    {
      title: 'Progress & Streaks',
      description: 'One sign-in, one progress record. Track consecutive daily commits and never lose your momentum.',
      tag: 'Persistence',
      tabTarget: 'dashboard'
    }
  ];

  const testimonials = [
    {
      name: 'Chanchal V',
      company: 'Certa.ai (ex-TCS)',
      role: 'AWS Data Engineer',
      quote: 'DataVeda has been a great learning experience for me transitioning into Data Engineering. The structured learning path, practical projects, and clear explanations helped me understand concepts beyond just theory. The hands-on Spotify and Uber projects gave me confidence in real-world pipelines.'
    },
    {
      name: 'Ballal Pathare',
      company: 'AGCO Corporation (ex-Infosys)',
      role: 'Technology Lead',
      quote: 'The data lab in DataVeda platform is very useful for practicing coding problems. The in-browser execution is very helpful to understand how to simplify the code written based on time complexity and coding standards.'
    },
    {
      name: 'Shakti Jagadish',
      company: 'HSBC',
      role: 'Senior Software Engineer',
      quote: 'When I started learning Data Engineering, I thought it was mainly about syntax and tools. DataVeda completely changed that understanding with its fundamentals-first approach and why-before-how explanations.'
    },
    {
      name: 'Rochita Das',
      company: 'Polen Capital',
      role: 'Data Engineer',
      quote: 'DataVeda helped me transition from Data Analyst to Data Engineer after a layoff. Having structured hands-on projects and interview questions helped me land an offer in record time.'
    },
    {
      name: 'Pradeep Guled',
      company: 'Carelon Global Solutions',
      role: 'Data Architect',
      quote: 'As a 13-year industry veteran, I was looking to upgrade my lakehouse and system design chops. Clear, hands-on projects with real-world tools — not just theory. I still use techniques I learned here daily at work.'
    }
  ];

  const faqs = [
    {
      q: 'What is DataVeda?',
      a: 'DataVeda is a comprehensive, guided learning and interview-preparation platform for data careers. It includes 3 career tracks, 28+ courses, curated YouTube video masterclasses, 850+ coding problems, in-browser DuckDB execution, 23 real-world projects, The Vault online book library, and AI-powered interview tools — all in one unified platform.'
    },
    {
      q: 'Who is this for?',
      a: 'Anyone looking to become a Data Engineer, Analytics Engineer, or Data Analyst; prepare for technical interviews; or upskill in tools like SQL, Python, Spark, dbt, Kafka, Airflow, Snowflake, AWS, and GCP. Complete beginners and seasoned engineers alike will find a clear, prerequisite-ordered path.'
    },
    {
      q: 'Do I need any prerequisites?',
      a: 'No. The Data Engineering Fundamentals and SQL courses start from absolute zero. If you already have programming or SQL experience, you can take the free Placement Diagnostic to test out of introductory modules and jump straight into advanced distributed pipelines.'
    },
    {
      q: 'Is it really 100% free with zero paywalls?',
      a: 'Yes! While other platforms charge $279+/year for isolated video access, this DataVeda edition offers 100% free open access across all 28+ courses, video masterclasses, 850+ problems, 23 projects, and online book readers with zero paywalls.'
    },
    {
      q: 'How is this different from generic YouTube playlists?',
      a: 'Random YouTube playlists teach concepts in isolation without structured order, exercise data, or validation. DataVeda curates the highest-rated, verified YouTube masterclasses and wraps them inside an authentic engineering environment: timestamp chapters, key architecture takeaways, in-browser DuckDB SQL execution, GitHub repos, notes, and career tracks.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-[#0050FF] selection:text-white pt-24 pb-20">
      
      {/* ========================================================================= */}
      {/* SECTION 1: HERO SECTION WITH FLOATING BADGES & PLAYABLE VIDEO BROWSER CHROME */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
        
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#0050FF]/12 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-12 left-10 w-48 h-48 bg-emerald-500/5 blur-[90px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="flex flex-col items-center gap-6 text-center max-w-4xl mx-auto">
            
            {/* Live Counter Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1 text-xs text-slate-700 dark:text-slate-300 shadow-sm">
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                </span>
                Live
              </span>
              <span>25,000+ engineers learning on the platform</span>
            </div>

            {/* Master Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Everything you need to become <br className="hidden sm:block" />
              a job-ready{' '}
              <span className="relative inline-flex items-baseline text-[#0050FF]">
                Data Engineer
                <span className="ml-1 inline-block h-8 w-1 animate-pulse bg-[#0050FF] align-middle" />
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Learn the fundamentals, build 23 real projects, practice 850+ company-tagged problems, and master modern cloud stacks — curated with top-tier masterclasses, start to hired.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md pt-2">
              <button
                onClick={onOpenAssessment}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#0050FF] hover:bg-[#1C449A] text-white text-sm font-semibold tracking-tight shadow-xl shadow-[#0050FF]/25 hover:shadow-[#0050FF]/40 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Take Free Assessment</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onNavigateTab('projects')}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-neutral-500 text-slate-900 dark:text-white text-sm font-semibold tracking-tight transition-colors flex items-center justify-center gap-2"
              >
                <span>Explore Career Tracks</span>
                <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-500 font-medium pt-1">
              100% Free Open Access • Zero Paywalls • Industry-Standard Masterclasses
            </p>

          </div>

          {/* ========================================================================= */}
          {/* BROWSER CHROME HERO VIDEO MOCKUP (INTERACTIVE PLAYABLE PREVIEW) */}
          {/* ========================================================================= */}
          <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden group relative">
              
              {/* Browser Window Header */}
              <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>

                <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-mono">
                  <span className="text-slate-500 dark:text-slate-500">https://</span>
                  <span className="text-slate-900 dark:text-white">dataveda.io</span>
                  <span className="text-slate-500 dark:text-slate-500">/masterclass/uber-data-analytics</span>
                </div>

                <div className="text-[11px] font-mono text-emerald-400 font-semibold hidden sm:inline">
                  WATCH MASTERCLASS
                </div>
              </div>

              {/* Video Thumbnail with Play Button */}
              <div 
                onClick={() => onOpenVideo(HERO_MASTERCLASS_VIDEO)}
                className="relative aspect-video w-full bg-black cursor-pointer overflow-hidden group"
              >
                {/* Background Poster Image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#0050FF] hover:bg-[#1C449A] text-white flex items-center justify-center shadow-2xl shadow-[#0050FF]/60 group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-white translate-x-0.5" />
                  </div>
                </div>

                {/* Video Info Overlay */}
                <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-left">
                  <div>
                    <span className="px-2.5 py-1 rounded-full bg-[#0050FF] text-white text-[11px] font-bold uppercase tracking-wider">
                      Featured Project Masterclass
                    </span>
                    <h3 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
                      Uber Data Analytics End-to-End Pipeline
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 max-w-xl">
                      GCP, Mage AI, BigQuery & Looker Studio • 1 hr 42 min • 1.2M+ Views • Darshil Parmar
                    </p>
                  </div>

                  <span className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs font-semibold text-slate-900 dark:text-slate-100 shrink-0 self-start sm:self-auto flex items-center gap-1.5">
                    <span>Click to Play in HD</span>
                    <span>▶</span>
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: SOCIAL PROOF BAR (TOP COMPANIES) */}
      {/* ========================================================================= */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-5">
          <p className="text-xs uppercase tracking-widest text-slate-600 dark:text-slate-400 font-semibold">
            Trusted by 25,000+ Aspiring & Working Data Engineers From Top Companies
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 text-sm sm:text-base font-bold tracking-tight text-slate-700 dark:text-slate-300">
            <span>Walmart Global Tech</span>
            <span>Apple</span>
            <span>Amazon</span>
            <span>Deloitte</span>
            <span>TCS</span>
            <span>Accenture</span>
            <span>Infosys</span>
            <span>Meesho</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: PICK THE ROLE. FOLLOW THE PATH. */}
      {/* ========================================================================= */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#0050FF] font-bold">
            Choose Your Path
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Pick the role. Follow the path.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Follow a complete career track, or focus on one skill at a time. Every path starts with the foundations and builds toward job-ready skills.
          </p>

          {/* Tab Switcher: Career Tracks | Courses | Skill Tracks */}
          <div className="inline-flex items-center p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mt-4">
            <button
              onClick={() => setRoleTab('tracks')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                roleTab === 'tracks' ? 'bg-[#0050FF] text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-brand-blue'
              }`}
            >
              Career Tracks
            </button>
            <button
              onClick={() => setRoleTab('courses')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                roleTab === 'courses' ? 'bg-[#0050FF] text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-brand-blue'
              }`}
            >
              Courses (28)
            </button>
            <button
              onClick={() => setRoleTab('skills')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                roleTab === 'skills' ? 'bg-[#0050FF] text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-brand-blue'
              }`}
            >
              Skill Tracks
            </button>
          </div>
        </div>

        {/* 3 Career Track Cards */}
        {roleTab === 'tracks' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Track 1: Data Engineer */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 flex flex-col justify-between hover:border-[#0050FF]/60 transition-all group relative shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                    Beginner → Advanced
                  </span>
                  <span className="text-xs font-medium text-amber-400 flex items-center gap-1">
                    ★ 4.9 (1.8k reviews)
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 group-hover:text-[#0050FF] transition-colors">
                  Data Engineer
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Zero to job-ready data engineer — fundamentals, Python and SQL, modeling and warehousing, then Spark, orchestration, streaming, and the cloud, finishing with system design.
                </p>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
                  <span><strong>120+</strong> hours</span>
                  <span>•</span>
                  <span><strong>25</strong> courses</span>
                  <span>•</span>
                  <span><strong>12</strong> projects</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">Curator: Umar Karajagi</span>
                <button
                  onClick={() => onSelectCourse ? onSelectCourse('CP-01') : onNavigateTab('projects')}
                  className="px-4 py-2 rounded-xl bg-[#0050FF] hover:bg-[#1C449A] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-[#0050FF]/20"
                >
                  <span>Explore Track</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Track 2: Analytics Engineer */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 flex flex-col justify-between hover:border-[#0050FF]/60 transition-all group relative shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] font-semibold">
                    Beginner → Intermediate
                  </span>
                  <span className="text-xs font-medium text-amber-400 flex items-center gap-1">
                    ★ 4.8 (950 reviews)
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 group-hover:text-[#0050FF] transition-colors">
                  Analytics Engineer
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Model and transform data for analytics — start with Python and SQL, then move through dimensional modeling, warehousing on Snowflake, and dbt for production transformations.
                </p>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
                  <span><strong>60+</strong> hours</span>
                  <span>•</span>
                  <span><strong>8</strong> courses</span>
                  <span>•</span>
                  <span><strong>6</strong> projects</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">Curator: Umar Karajagi</span>
                <button
                  onClick={() => onSelectCourse ? onSelectCourse('CP-02') : onNavigateTab('projects')}
                  className="px-4 py-2 rounded-xl bg-[#0050FF] hover:bg-[#1C449A] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-[#0050FF]/20"
                >
                  <span>Explore Track</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Track 3: Streaming Systems Engineer */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 flex flex-col justify-between hover:border-[#0050FF]/60 transition-all group relative shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[11px] font-semibold">
                    Intermediate → Advanced
                  </span>
                  <span className="text-xs font-medium text-amber-400 flex items-center gap-1">
                    ★ 4.9 (820 reviews)
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 group-hover:text-[#0050FF] transition-colors">
                  Streaming Systems Engineer
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Build event-driven distributed systems using Apache Kafka, Spark Structured Streaming, Flink, and cloud messaging for sub-second data processing.
                </p>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
                  <span><strong>90+</strong> hours</span>
                  <span>•</span>
                  <span><strong>7</strong> courses</span>
                  <span>•</span>
                  <span><strong>5</strong> projects</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">Curator: Umar Karajagi</span>
                <button
                  onClick={() => onSelectCourse ? onSelectCourse('CP-03') : onNavigateTab('projects')}
                  className="px-4 py-2 rounded-xl bg-[#0050FF] hover:bg-[#1C449A] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-[#0050FF]/20"
                >
                  <span>Explore Track</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Courses Tab View */}
        {roleTab === 'courses' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CURATED_COURSE_VIDEOS.map(course => (
              <div 
                key={course.id}
                className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#0050FF]/60 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded bg-[#0050FF]/15 text-[#0050FF] font-semibold">
                      {course.topic}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">{course.duration}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm line-clamp-2">
                    {course.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {course.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-400">{course.instructor}</span>
                  <button
                    onClick={() => onOpenVideo(course)}
                    className="text-xs font-bold text-[#0050FF] hover:underline flex items-center gap-1"
                  >
                    <span>Watch Masterclass</span>
                    <span>▶</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skill Tracks Tab View */}
        {roleTab === 'skills' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Python for Data Engineering', count: '4 Courses', tag: 'Python' },
              { title: 'SQL & Query Optimization', count: '5 Courses', tag: 'SQL' },
              { title: 'Spark on Databricks', count: '4 Courses', tag: 'Spark' },
              { title: 'dbt on Snowflake', count: '3 Courses', tag: 'dbt' },
              { title: 'Cloud Data (AWS & GCP)', count: '5 Courses', tag: 'Cloud' },
              { title: 'Airflow & Orchestration', count: '3 Courses', tag: 'Airflow' },
              { title: 'Kafka & Streaming', count: '3 Courses', tag: 'Kafka' },
              { title: 'System Design for DEs', count: '2 Courses', tag: 'System Design' },
            ].map((skill, i) => (
              <div 
                key={i}
                onClick={() => onNavigateTab('projects')}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#0050FF] cursor-pointer transition-all space-y-2"
              >
                <span className="text-[11px] font-semibold text-[#0050FF]">{skill.tag}</span>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{skill.title}</h4>
                <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between pt-1">
                  <span>{skill.count}</span>
                  <span className="text-[#0050FF]">Explore →</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: MASTER THE TOOLS COMPANIES ACTUALLY USE */}
      {/* ========================================================================= */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-slate-600 dark:text-slate-400 font-bold">
              Tech Stacks
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Master the tools companies actually use
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Learn the high-demand data engineering stack — from cloud platforms to orchestration tools.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {techStackList.map(t => (
              <button
                key={t.name}
                onClick={() => setSelectedTech(t.name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  selectedTech === t.name 
                    ? 'bg-[#0050FF] text-white shadow-md shadow-[#0050FF]/25' 
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-brand-blue border border-slate-200 dark:border-slate-800'
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.name}</span>
              </button>
            ))}
          </div>

          {/* Filtered Project Video Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {CURATED_PROJECT_VIDEOS
              .filter(p => selectedTech === 'All' || p.topic.toLowerCase() === selectedTech.toLowerCase() || p.techStack.some(ts => ts.toLowerCase().includes(selectedTech.toLowerCase())))
              .map(project => (
                <div 
                  key={project.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:border-[#0050FF]/60 transition-all flex flex-col justify-between group"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#0050FF]/15 text-[#0050FF] font-semibold">
                        {project.topic}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {project.duration}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base group-hover:text-[#0050FF] transition-colors line-clamp-2">
                      {project.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                      {project.summary}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-2">
                      {project.techStack.slice(0, 4).map(tool => (
                        <span key={tool} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">★ {project.rating} ({project.views})</span>
                    <button
                      onClick={() => onOpenVideo(project)}
                      className="px-3 py-1.5 rounded-lg bg-[#0050FF] hover:bg-[#1C449A] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Watch Walkthrough</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: HOW DATAVIDHYA WORKS (4-STEP PROGRESSION) */}
      {/* ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#0050FF] font-bold">
            How DataVeda Works
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            From “Where do I start?” to interview-ready.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Choose your goal, follow the right learning order, validate each skill, and prove you can apply it.
          </p>
        </div>

        {/* 4 Interactive Steps Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { num: '01', title: 'Learn in the right order', sub: 'A guided path from foundations to advanced skills.' },
            { num: '02', title: 'Validate every skill', sub: 'Assessments and quizzes reveal what you truly know.' },
            { num: '03', title: 'Prove you can apply it', sub: 'Turn knowledge into practical, verifiable skill with 23 projects.' },
            { num: '04', title: 'Get interview-ready', sub: 'Prepare with 850+ coding problems and system design.' }
          ].map(step => (
            <div
              key={step.num}
              onClick={() => setActiveStep(parseInt(step.num))}
              className={`p-6 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                activeStep === parseInt(step.num)
                  ? 'bg-white dark:bg-slate-900 border-[#0050FF] shadow-lg shadow-[#0050FF]/10'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:border-slate-700'
              }`}
            >
              <span className={`text-2xl font-mono font-bold ${activeStep === parseInt(step.num) ? 'text-[#0050FF]' : 'text-slate-500 dark:text-slate-500'}`}>
                {step.num}
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-50">{step.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{step.sub}</p>
            </div>
          ))}
        </div>

        {/* Step Detail Highlight Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-[#0050FF] uppercase">
              Step {activeStep} / 4
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
              {activeStep === 1 && 'Prerequisite sequencing prevents tutorial hell'}
              {activeStep === 2 && 'Diagnostic assessments to skip what you already know'}
              {activeStep === 3 && 'Build cloud pipelines using real production patterns'}
              {activeStep === 4 && '850+ Company-tagged coding problems with DuckDB runner'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg">
              Your path follows strict prerequisite order, so every lesson builds directly on the concepts proven before it.
            </p>
          </div>

          <button
            onClick={onOpenAssessment}
            className="px-6 py-3 rounded-xl bg-[#0050FF] hover:bg-[#1C449A] text-white text-xs font-bold shrink-0 transition-colors shadow-lg shadow-[#0050FF]/20"
          >
            Build My Free Plan →
          </button>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: 13 TOOLS SHOWCASE */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#0050FF] font-bold">
              All-In-One Platform
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Thirteen tools, one outcome — the version of you that walks out with the offer.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Everything integrated in one place with zero subscription paywalls.
            </p>
          </div>

          {/* 13 Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {thirteenTools.map((tool, idx) => (
              <div 
                key={idx}
                onClick={() => onNavigateTab(tool.tabTarget)}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#0050FF]/60 cursor-pointer transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-500 font-bold">0{idx + 1}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#0050FF]/15 text-[#0050FF] text-[10px] font-bold">
                      {tool.tag}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-50 group-hover:text-[#0050FF] transition-colors">
                    {tool.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="flex items-center text-xs font-bold text-[#0050FF] group-hover:translate-x-1 transition-transform">
                  <span>Explore Tool</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: STUDENT TESTIMONIALS */}
      {/* ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#0050FF] font-bold">
            Testimonials
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Loved by data engineers worldwide
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Real stories from 25,000+ engineers using DataVeda to land offers and level up their stack.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "{item.quote}"
              </p>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">{item.name}</div>
                <div className="text-[11px] text-[#0050FF] font-medium">{item.role}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-500">{item.company}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: 100% FREE OPEN ACCESS COMPARISON */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
              100% Free Open Access Edition
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              One plan. Everything you need to get hired.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No credit card required. No $279 annual lock-in. Everything unlocked and open.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-left space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  FREE LIFETIME ACCESS
                </span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">DataVeda Master Curriculum</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Curated with industry-standard top YouTube tutorials & real cloud labs.</p>
              </div>

              <div className="text-right">
                <div className="text-3xl font-extrabold text-emerald-400">$0 / mo</div>
                <div className="text-xs text-slate-500 dark:text-slate-500 line-through">Standard $279/yr</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>3 Career Tracks + 9 Skill Tracks</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>All 28+ Core Video Masterclasses</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>850+ Company-Tagged Coding Problems</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>23 Real-World Production Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>The Vault (Kimball & DDIA Online Books)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Career Studio & AI Resume Scorer</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-600 dark:text-slate-400">Join 25,000+ engineers leveling up today.</span>
              <button
                onClick={onOpenAssessment}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#0050FF] hover:bg-[#1C449A] text-white text-xs font-bold transition-colors shadow-lg shadow-[#0050FF]/25"
              >
                Start Learning Now (Free) →
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 9: FOUNDER'S MEMO */}
      {/* ========================================================================= */}
      <section className="py-20 max-w-4xl mx-auto px-4 text-center space-y-6">
        <span className="text-xs uppercase tracking-widest text-[#0050FF] font-bold">
          Founder's Vision
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Making data easier for everyone
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif italic max-w-2xl mx-auto">
          "When we started building DataVeda, our vision was simple: Make data engineering accessible, practical, and career-defining. Data engineering isn't just about pipelines and tools; it's about solving real problems, building systems that scale, and enabling companies to make smarter decisions. Let's build the future of data, together."
        </p>
        <div>
          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">Umar Karajagi</div>
          <div className="text-xs text-[#0050FF]">Founder & Creator, DataVeda</div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 10: FAQS ACCORDION */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-slate-600 dark:text-slate-400 font-bold">
              FAQs
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              All You Need to Know
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform ${openFaqIdx === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaqIdx === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
