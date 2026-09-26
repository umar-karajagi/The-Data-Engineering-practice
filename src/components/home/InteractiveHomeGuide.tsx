'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  UserCheck, 
  Terminal, 
  Database, 
  Code2, 
  Layers, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  Clock, 
  Award, 
  ExternalLink, 
  ChevronRight, 
  Check, 
  Flame, 
  Compass, 
  Cpu, 
  GitBranch, 
  BookOpen, 
  FolderGit2, 
  Zap, 
  TrendingUp, 
  GraduationCap, 
  Laptop, 
  Building2, 
  Filter
} from 'lucide-react';
import { CuratedVideo, HERO_MASTERCLASS_VIDEO, CURATED_PROJECT_VIDEOS } from '../../content/videos/curatedVideos';

interface InteractiveHomeGuideProps {
  onOpenVideo: (video: CuratedVideo) => void;
  onNavigateTab: (tab: string) => void;
}

export type GuideStage = 'profile' | 'foundation' | 'tracks' | 'projects';

interface BackgroundOption {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

interface GoalOption {
  id: string;
  title: string;
  roleTitle: string;
  salaryRange: string;
  icon: string;
  desc: string;
  recommendedFirstVideo: CuratedVideo;
}

export const InteractiveHomeGuide: React.FC<InteractiveHomeGuideProps> = ({
  onOpenVideo,
  onNavigateTab
}) => {
  const [activeStage, setActiveStage] = useState<GuideStage>('profile');

  // Stage 1: Profile state
  const [selectedBackground, setSelectedBackground] = useState<string>('student');
  const [selectedGoal, setSelectedGoal] = useState<string>('data_engineer');
  const [selectedExperience, setSelectedExperience] = useState<string>('0');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('90days');

  // Stage 3: Track selector
  const [selectedTrackTab, setSelectedTrackTab] = useState<'de' | 'da' | 'ds'>('de');

  // Stage 4: Project filter
  const [projectTrackFilter, setProjectTrackFilter] = useState<'all' | 'de' | 'da' | 'ds'>('all');

  const backgroundOptions: BackgroundOption[] = [
    {
      id: 'student',
      label: 'College Student / Fresher',
      icon: '🎓',
      desc: 'Computer science, engineering or BCA/MCA student looking for first job in data'
    },
    {
      id: 'swe_switch',
      label: 'Software / Web Dev (Switching)',
      icon: '💻',
      desc: 'Frontend, backend or full-stack developer moving to high-demand big data pipelines'
    },
    {
      id: 'analyst_up',
      label: 'Data / Business Analyst (Upskilling)',
      icon: '📊',
      desc: 'Experienced in SQL and Excel, aiming to build scalable distributed Spark & Kafka pipelines'
    },
    {
      id: 'non_tech',
      label: 'Non-Tech / Mech / Civil / Commerce',
      icon: '⚙️',
      desc: 'Starting from scratch; needs structured zero-prerequisite foundation in Python and SQL'
    },
    {
      id: 'qa_support',
      label: 'QA / DevOps / Tech Support',
      icon: '🧪',
      desc: 'Has industry experience; pivoting to core data architecture and lakehouse engineering'
    }
  ];

  const daVideo = CURATED_PROJECT_VIDEOS.find(v => v.id === 'project-dbt-snowflake') || HERO_MASTERCLASS_VIDEO;
  const dsVideo = CURATED_PROJECT_VIDEOS.find(v => v.id === 'project-zomato-ai') || HERO_MASTERCLASS_VIDEO;

  const goalOptions: GoalOption[] = [
    {
      id: 'data_engineer',
      title: 'Data Engineer (The Core Flagship)',
      roleTitle: 'Data Engineer / Lakehouse Architect',
      salaryRange: '₹10L - ₹32L+ CTC in India • $135k+ Global',
      icon: '🚀',
      desc: 'Build massive streaming and batch pipelines using Apache Spark, Kafka, Iceberg, and Airflow.',
      recommendedFirstVideo: HERO_MASTERCLASS_VIDEO
    },
    {
      id: 'data_analyst',
      title: 'Data Analyst & BI Specialist',
      roleTitle: 'Analytics Engineer / Senior BI Analyst',
      salaryRange: '₹7L - ₹20L+ CTC in India • $95k+ Global',
      icon: '📈',
      desc: 'Master dimensional data modeling (Kimball), advanced SQL window analytics, dbt, and Power BI.',
      recommendedFirstVideo: daVideo
    },
    {
      id: 'data_scientist',
      title: 'Data Scientist & AI/ML Engineer',
      roleTitle: 'Data Scientist / Machine Learning Engineer',
      salaryRange: '₹12L - ₹35L+ CTC in India • $145k+ Global',
      icon: '🤖',
      desc: 'Develop predictive models, feature stores, end-to-end MLOps pipelines, and LLM data ingestion.',
      recommendedFirstVideo: dsVideo
    }
  ];

  const currentGoalData = goalOptions.find(g => g.id === selectedGoal) || goalOptions[0];

  return (
    <section className="relative z-20 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Container Frame */}
      <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-300">
        
        {/* 1. TOP PROGRESS STEPPER */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-3 sm:p-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            
            {/* STEP 1 */}
            <button
              onClick={() => setActiveStage('profile')}
              className={`p-3 rounded-2xl flex items-center gap-3 text-left transition-all cursor-pointer ${
                activeStage === 'profile'
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                activeStage === 'profile'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                01
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">Step 01</div>
                <div className="text-xs font-bold truncate text-slate-900 dark:text-slate-100">Profile & Background</div>
              </div>
            </button>

            {/* STEP 2 */}
            <button
              onClick={() => setActiveStage('foundation')}
              className={`p-3 rounded-2xl flex items-center gap-3 text-left transition-all cursor-pointer ${
                activeStage === 'foundation'
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                activeStage === 'foundation'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                02
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-500">100% Free</div>
                <div className="text-xs font-bold truncate text-slate-900 dark:text-slate-100">SQL & Python Basics</div>
              </div>
            </button>

            {/* STEP 3 */}
            <button
              onClick={() => setActiveStage('tracks')}
              className={`p-3 rounded-2xl flex items-center gap-3 text-left transition-all cursor-pointer ${
                activeStage === 'tracks'
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                activeStage === 'tracks'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                03
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">Step 03</div>
                <div className="text-xs font-bold truncate text-slate-900 dark:text-slate-100">DE, DA, DS Tracks</div>
              </div>
            </button>

            {/* STEP 4 */}
            <button
              onClick={() => setActiveStage('projects')}
              className={`p-3 rounded-2xl flex items-center gap-3 text-left transition-all cursor-pointer ${
                activeStage === 'projects'
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                activeStage === 'projects'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                04
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">Step 04</div>
                <div className="text-xs font-bold truncate text-slate-900 dark:text-slate-100">Goal-Aligned Projects</div>
              </div>
            </button>

          </div>
        </div>

        {/* 2. STAGE CONTENTS */}
        <div className="p-6 sm:p-8">
          
          {/* ========================================================================= */}
          {/* STAGE 1: PROFILE BUILDING & BACKGROUND UNDERSTANDING                     */}
          {/* ========================================================================= */}
          {activeStage === 'profile' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Step 1: Interactive Profile & Background Diagnostic</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
                  Where are you starting from, and what is your goal?
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                  Tell us your current background. DataForge will calculate your career transition path and match the exact videos, 20-30 min modules, and projects suited for you.
                </p>
              </div>

              {/* 1.1 Question: Background */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                  1. Your Current Background
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {backgroundOptions.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => setSelectedBackground(bg.id)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedBackground === bg.id
                          ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-950/20 shadow-md ring-1 ring-emerald-500'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{bg.icon}</span>
                        {selectedBackground === bg.id && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {bg.label}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {bg.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 1.2 Question: Target Career Role */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                  2. Select Your Target Career Role
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {goalOptions.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedGoal === goal.id
                          ? 'border-brand-blue bg-blue-500/5 dark:bg-blue-950/20 shadow-md ring-1 ring-brand-blue'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{goal.icon}</span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-blue/10 text-brand-blue">
                            Target
                          </span>
                        </div>
                        <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">
                          {goal.title}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {goal.desc}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {goal.salaryRange}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 1.3 Question: Experience & Timeframe */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Years of Professional Tech Experience:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: '0', label: '0 yrs (Fresher)' },
                      { id: '1-3', label: '1 - 3 yrs' },
                      { id: '3+', label: '3+ yrs (Senior)' }
                    ].map(exp => (
                      <button
                        key={exp.id}
                        onClick={() => setSelectedExperience(exp.id)}
                        className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                          selectedExperience === exp.id
                            ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-transparent shadow'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {exp.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Target Timeframe to Placement:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: '90days', label: '⚡ 90-Day Sprint' },
                      { id: '6months', label: '📅 6 Months' },
                      { id: 'parttime', label: '🎓 Part-Time' }
                    ].map(time => (
                      <button
                        key={time.id}
                        onClick={() => setSelectedTimeframe(time.id)}
                        className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                          selectedTimeframe === time.id
                            ? 'bg-emerald-600 text-white border-transparent shadow'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {time.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 1.4 DIAGNOSTIC RESULT & PERSONALIZED RECOMMENDATION BANNER */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-brand-blue/10 to-purple-500/10 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500 text-slate-950">
                      88% Career Match
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Personalized Recommendation for You
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-2">
                    Recommended Start: 20-30 min Python & SQL Foundation → {currentGoalData.roleTitle} Track
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                    Based on your background, start with our 100% free bite-sized SQL and Python modules, then proceed to the distributed Spark and Lakehouse DAGs.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <button
                    onClick={() => onOpenVideo(currentGoalData.recommendedFirstVideo)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Suggested First Video</span>
                  </button>

                  <button
                    onClick={() => setActiveStage('foundation')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Next: Free Foundation (SQL & Python)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 2: FREE FOUNDATION: SQL & PYTHON (100% FREE FOR EVERYONE)          */}
          {/* ========================================================================= */}
          {activeStage === 'foundation' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Step 2: 100% Free Foundation Knowledge (SQL & Python)</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
                    Essential Core Prerequisites • 100% Free for Everyone
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                    Every data engineering, analyst, and AI interview begins with SQL and Python efficiency. Master each concept in dedicated <strong>20 to 30 minute bite-sized modules</strong>.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-mono text-xs font-bold border border-emerald-500/20">
                    5 Modules • 2 hrs 13 min total
                  </span>
                </div>
              </div>

              {/* 5 Modular 20-30 min Lessons */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Module 1 */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col justify-between hover:border-emerald-500/40 transition-colors shadow-sm">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-emerald-500 font-bold">MODULE 01 • PYTHON</span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 24 mins
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">
                      Python Data Structures & Memory Efficiency
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      Memory footprints of lists vs generators, dictionary hash collision prevention, and itertools for processing large records.
                    </p>
                    <div className="mt-3 text-[11px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-100 dark:border-slate-800/80">
                      <div>⏱️ 0:00 Setup & Objects</div>
                      <div>⏱️ 7:30 Generators vs Lists</div>
                      <div>⏱️ 16:00 Itertools Streaming</div>
                      <div>⏱️ 21:00 Practice Challenge</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => onOpenVideo(HERO_MASTERCLASS_VIDEO)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Watch (24m)</span>
                    </button>
                    <button
                      onClick={() => onNavigateTab('practice')}
                      className="py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      Practice
                    </button>
                  </div>
                </div>

                {/* Module 2 */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col justify-between hover:border-emerald-500/40 transition-colors shadow-sm">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-emerald-500 font-bold">MODULE 02 • PYTHON</span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 28 mins
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">
                      Python File Processing, JSON & Parquet I/O
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      Chunked file ingestion, parsing nested JSON schemas, and writing memory-efficient Snappy Parquet files with PyArrow.
                    </p>
                    <div className="mt-3 text-[11px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-100 dark:border-slate-800/80">
                      <div>⏱️ 0:00 Chunk Iterators</div>
                      <div>⏱️ 8:15 Nested JSON Normalizing</div>
                      <div>⏱️ 17:30 PyArrow Parquet Export</div>
                      <div>⏱️ 25:00 Live Code Review</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => onOpenVideo(HERO_MASTERCLASS_VIDEO)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Watch (28m)</span>
                    </button>
                    <button
                      onClick={() => onNavigateTab('practice')}
                      className="py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      Practice
                    </button>
                  </div>
                </div>

                {/* Module 3 */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col justify-between hover:border-emerald-500/40 transition-colors shadow-sm">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-brand-blue font-bold">MODULE 03 • SQL</span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 26 mins
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">
                      Zero-to-Hero SQL Mastery & Joins
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      Exact clause execution order (FROM → WHERE → GROUP BY → HAVING → SELECT), aggregate math, and multi-table INNER/LEFT/FULL joins.
                    </p>
                    <div className="mt-3 text-[11px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-100 dark:border-slate-800/80">
                      <div>⏱️ 0:00 SQL Clause Order</div>
                      <div>⏱️ 9:00 GROUP BY vs HAVING</div>
                      <div>⏱️ 17:30 Complex Multi-Joins</div>
                      <div>⏱️ 22:45 Interview Questions</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => onOpenVideo(HERO_MASTERCLASS_VIDEO)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-brand-blue hover:bg-brand-hover text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Watch (26m)</span>
                    </button>
                    <button
                      onClick={() => onNavigateTab('practice')}
                      className="py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      DuckDB
                    </button>
                  </div>
                </div>

                {/* Module 4 */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col justify-between hover:border-emerald-500/40 transition-colors shadow-sm">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-brand-blue font-bold">MODULE 04 • SQL</span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 30 mins
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">
                      Advanced SQL (Window Functions & CTEs)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      ROW_NUMBER, DENSE_RANK, LEAD/LAG, rolling 7-day moving averages, and recursive Common Table Expressions.
                    </p>
                    <div className="mt-3 text-[11px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-100 dark:border-slate-800/80">
                      <div>⏱️ 0:00 Window Partitions</div>
                      <div>⏱️ 10:20 Rolling Averages</div>
                      <div>⏱️ 21:00 Recursive CTEs</div>
                      <div>⏱️ 27:30 LeetCode Hard Drill</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => onOpenVideo(HERO_MASTERCLASS_VIDEO)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-brand-blue hover:bg-brand-hover text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Watch (30m)</span>
                    </button>
                    <button
                      onClick={() => onNavigateTab('practice')}
                      className="py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      DuckDB
                    </button>
                  </div>
                </div>

                {/* Module 5 */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col justify-between hover:border-emerald-500/40 transition-colors shadow-sm">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-purple-500 font-bold">MODULE 05 • PANDAS</span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 25 mins
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">
                      Pandas & NumPy for High-Throughput ETL
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      Vectorized operations over row-iteration loops, handling missing data, and multi-index aggregations for data preparation.
                    </p>
                    <div className="mt-3 text-[11px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-100 dark:border-slate-800/80">
                      <div>⏱️ 0:00 Vectorization Power</div>
                      <div>⏱️ 8:40 Null Imputation</div>
                      <div>⏱️ 17:00 Multi-Index Groupby</div>
                      <div>⏱️ 22:15 Memory Profiling</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => onOpenVideo(HERO_MASTERCLASS_VIDEO)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Watch (25m)</span>
                    </button>
                    <button
                      onClick={() => onNavigateTab('practice')}
                      className="py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      Python Lab
                    </button>
                  </div>
                </div>

              </div>

              {/* Bottom Nav */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Completed the basics? Ready to specialize in production distributed systems?
                </span>
                <button
                  onClick={() => setActiveStage('tracks')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Step 3: Specialization Tracks (DE, DA, DS)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 3: SPECIALIZED CAREER TRACKS (DE, DA, DS)                           */}
          {/* ========================================================================= */}
          {activeStage === 'tracks' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Step 3: Industry-Standard Career Tracks</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
                  Choose Your Specialization: Data Engineer, Analyst, or Data Science
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                  Each curriculum track is sequenced with structured 20-30 min video modules, interactive DAG nodes, and real-world system design questions.
                </p>
              </div>

              {/* 3 Track Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <button
                  onClick={() => setSelectedTrackTab('de')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    selectedTrackTab === 'de'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>The Data Engineer Track (Flagship)</span>
                </button>

                <button
                  onClick={() => setSelectedTrackTab('da')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    selectedTrackTab === 'da'
                      ? 'bg-brand-blue text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>The Data Analyst Track</span>
                </button>

                <button
                  onClick={() => setSelectedTrackTab('ds')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    selectedTrackTab === 'ds'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The Data Science Track</span>
                </button>
              </div>

              {/* TRACK 1: DATA ENGINEER */}
              {selectedTrackTab === 'de' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <div>
                      <strong className="text-emerald-500 text-sm">Data Engineer Roadmap</strong>: Distributed Computing (Apache Spark), Modern Lakehouse (Delta Lake, Iceberg), Orchestration (Airflow, Mage), Real-Time Streaming (Kafka, Flink).
                    </div>
                    <span className="font-mono text-emerald-500 font-bold shrink-0">6 Modules • 20-30 min each</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { mod: '01', title: 'Apache Spark Distributed Architecture', time: '28m', tech: 'Spark / PySpark', desc: 'Driver vs Executor memory, RDD partitions, and execution stages.' },
                      { mod: '02', title: 'PySpark Shuffles, Broadcasts & Tuning', time: '29m', tech: 'PySpark', desc: 'Eliminating data skew, broadcast hash joins, and memory spillage.' },
                      { mod: '03', title: 'Lakehouse ACID Storage (Delta & Iceberg)', time: '25m', tech: 'Delta / Iceberg', desc: 'Metadata transaction logs, time travel, compaction, and schema evolution.' },
                      { mod: '04', title: 'Workflow Orchestration with Airflow & Mage', time: '27m', tech: 'Airflow / Mage', desc: 'Writing dynamic Python DAGs, sensor triggers, and automated backfills.' },
                      { mod: '05', title: 'Real-Time Streaming with Apache Kafka', time: '30m', tech: 'Kafka', desc: 'Topic partitions, consumer offsets, consumer groups, and exactly-once semantics.' },
                      { mod: '06', title: 'Cloud Warehousing on Snowflake & BigQuery', time: '26m', tech: 'Snowflake / GCP', desc: 'Clustering keys, micro-partition pruning, and query cost optimization.' }
                    ].map(item => (
                      <div key={item.mod} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-emerald-500/40 transition-colors">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-emerald-500 font-bold">MODULE {item.mod} • {item.tech}</span>
                          <span className="text-slate-400">{item.time}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                          <button
                            onClick={() => onOpenVideo(HERO_MASTERCLASS_VIDEO)}
                            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1 cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Watch Module</span>
                          </button>
                          <span className="text-[10px] font-mono text-slate-400">20-30m lesson</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TRACK 2: DATA ANALYST */}
              {selectedTrackTab === 'da' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <div>
                      <strong className="text-brand-blue text-sm">Data Analyst Roadmap</strong>: Dimensional Kimball Data Modeling, Advanced Cohort SQL, Power BI DAX Formulas, Tableau Dashboards, and dbt.
                    </div>
                    <span className="font-mono text-brand-blue font-bold shrink-0">5 Modules • 20-30 min each</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { mod: '01', title: 'Business SQL & Cohort Retention Analytics', time: '24m', tech: 'SQL', desc: 'Calculating Monthly Active Users (MAU), customer churn rates, and LTV.' },
                      { mod: '02', title: 'Kimball Data Modeling (Star Schemas & SCD)', time: '28m', tech: 'Kimball Modeling', desc: 'Fact tables, dimension tables, degenerate dimensions, and SCD Type 2 history.' },
                      { mod: '03', title: 'Enterprise Power BI & DAX Measure Modeling', time: '26m', tech: 'Power BI', desc: 'CALCULATE, time intelligence functions, and relationship cardinality.' },
                      { mod: '04', title: 'Tableau Interactive Dashboards & Storytelling', time: '25m', tech: 'Tableau', desc: 'Parameters, Level of Detail (LOD) expressions, and executive visual layout.' },
                      { mod: '05', title: 'Analytics Engineering with dbt & Metrics Layer', time: '27m', tech: 'dbt', desc: 'Building staged models, semantic layers, and automated schema tests.' }
                    ].map(item => (
                      <div key={item.mod} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-brand-blue/40 transition-colors">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-brand-blue font-bold">MODULE {item.mod} • {item.tech}</span>
                          <span className="text-slate-400">{item.time}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                          <button
                            onClick={() => onOpenVideo(HERO_MASTERCLASS_VIDEO)}
                            className="text-xs font-bold text-brand-blue hover:text-blue-400 flex items-center gap-1 cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Watch Module</span>
                          </button>
                          <span className="text-[10px] font-mono text-slate-400">20-30m lesson</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TRACK 3: DATA SCIENCE */}
              {selectedTrackTab === 'ds' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <div>
                      <strong className="text-purple-400 text-sm">Data Science & AI Roadmap</strong>: Statistical EDA, Supervised Machine Learning, XGBoost Optimization, Production MLOps, and LLM Vector Pipelines.
                    </div>
                    <span className="font-mono text-purple-400 font-bold shrink-0">5 Modules • 20-30 min each</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { mod: '01', title: 'Applied Statistics, Probability & A/B Testing', time: '25m', tech: 'Statistics', desc: 'Hypothesis testing, p-values, z-scores, and designing statistical sample sizes.' },
                      { mod: '02', title: 'Supervised ML: Trees, Regression & Forests', time: '28m', tech: 'Scikit-Learn', desc: 'Cost functions, feature scaling, cross-validation, and bias-variance tradeoff.' },
                      { mod: '03', title: 'Gradient Boosting & XGBoost Hyperparameter Tuning', time: '30m', tech: 'XGBoost', desc: 'Loss reduction, learning rate, tree depth, and early stopping criteria.' },
                      { mod: '04', title: 'MLOps: Model Registry & FastAPI Serving', time: '27m', tech: 'MLflow / FastAPI', desc: 'Containerizing model artifacts with Docker and deploying real-time prediction REST APIs.' },
                      { mod: '05', title: 'LLM Data Pipelines & Vector Databases (RAG)', time: '26m', tech: 'LangChain / Chroma', desc: 'Chunking strategies, embedding generation, semantic search, and retrieval pipelines.' }
                    ].map(item => (
                      <div key={item.mod} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-purple-500/40 transition-colors">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-purple-400 font-bold">MODULE {item.mod} • {item.tech}</span>
                          <span className="text-slate-400">{item.time}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                          <button
                            onClick={() => onOpenVideo(HERO_MASTERCLASS_VIDEO)}
                            className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Watch Module</span>
                          </button>
                          <span className="text-[10px] font-mono text-slate-400">20-30m lesson</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Nav */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Ready to put this knowledge into real production portfolios recruiters respect?
                </span>
                <button
                  onClick={() => setActiveStage('projects')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Step 4: Goal-Aligned Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 4: GOAL-ALIGNED PRODUCTION CAPSTONE PROJECTS                        */}
          {/* ========================================================================= */}
          {activeStage === 'projects' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    <FolderGit2 className="w-3.5 h-3.5" />
                    <span>Step 4: Goal-Aligned Real-World Production Projects</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
                    Production Capstones Tailored to Your Target Role
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                    Every project is divided into 20-30 min step-by-step video modules, architecture DAGs, and GitHub source code to give you an unbeatable resume portfolio.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {(['all', 'de', 'da', 'ds'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setProjectTrackFilter(f)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition-all ${
                        projectTrackFilter === f
                          ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {f === 'all' ? 'All Roles' : f.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4 Flagship Projects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Project 1: Uber GCP Lakehouse */}
                {(projectTrackFilter === 'all' || projectTrackFilter === 'de' || projectTrackFilter === 'da') && (
                  <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
                        DE & DA CAPSTONE
                      </span>
                      <span className="text-xs text-slate-400 font-mono">4 Modules • 1 hr 42m total</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
                      Uber Real-Time Data Analytics & Lakehouse Pipeline
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      End-to-end cloud pipeline: ingest trip data into Google Cloud Storage, orchestrate transformations using Mage AI, warehouse in BigQuery, and visualize in Looker Studio.
                    </p>

                    {/* 20-30 min Modules */}
                    <div className="space-y-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span>Module 1: Architecture & GCP Bucket Provisioning</span>
                        <span className="text-slate-400">20 min</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span>Module 2: Mage AI Pipeline Orchestration</span>
                        <span className="text-slate-400">28 min</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span>Module 3: BigQuery Partitioning & Star Schema</span>
                        <span className="text-slate-400">25 min</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span>Module 4: Executive Looker Studio Dashboard</span>
                        <span className="text-slate-400">22 min</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => onOpenVideo(HERO_MASTERCLASS_VIDEO)}
                        className="flex-1 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Watch Project Modules</span>
                      </button>
                      <button
                        onClick={() => onNavigateTab('projects')}
                        className="py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        View Architecture
                      </button>
                    </div>
                  </div>
                )}

                {/* Project 2: Spotify AWS Streaming */}
                {(projectTrackFilter === 'all' || projectTrackFilter === 'de') && (
                  <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold font-mono">
                        DATA ENGINEER CAPSTONE
                      </span>
                      <span className="text-xs text-slate-400 font-mono">3 Modules • 1 hr 17m total</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
                      Spotify Real-Time Streaming Architecture on AWS
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Deploy serverless Lambda functions to query the Spotify API, stage JSON in S3 data lake, crawl schema with AWS Glue, and query via serverless Athena SQL.
                    </p>

                    <div className="space-y-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span>Module 1: Serverless Spotify Ingestion (Lambda)</span>
                        <span className="text-slate-400">24 min</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span>Module 2: S3 Event Notification & Staging</span>
                        <span className="text-slate-400">26 min</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span>Module 3: Glue Catalog, Crawler & Athena SQL</span>
                        <span className="text-slate-400">27 min</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => onOpenVideo(HERO_MASTERCLASS_VIDEO)}
                        className="flex-1 py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Watch Project Modules</span>
                      </button>
                      <button
                        onClick={() => onNavigateTab('projects')}
                        className="py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        View Architecture
                      </button>
                    </div>
                  </div>
                )}

                {/* Project 3: E-Commerce Customer Retention & dbt */}
                {(projectTrackFilter === 'all' || projectTrackFilter === 'da') && (
                  <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold font-mono">
                        DATA ANALYST CAPSTONE
                      </span>
                      <span className="text-xs text-slate-400 font-mono">3 Modules • 1 hr 15m total</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
                      E-Commerce Retention & Modern Analytics with dbt
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Design Kimball star schemas in Snowflake, author staged transformation models with dbt, validate data freshness tests, and produce executive Power BI metrics.
                    </p>

                    <div className="space-y-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span>Module 1: Dimensional Schema & SCD Modeling</span>
                        <span className="text-slate-400">22 min</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span>Module 2: dbt Transformations & Data Tests</span>
                        <span className="text-slate-400">28 min</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span>Module 3: Executive Retention Power BI Dashboard</span>
                        <span className="text-slate-400">25 min</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => onOpenVideo(HERO_MASTERCLASS_VIDEO)}
                        className="flex-1 py-2 px-4 rounded-xl bg-brand-blue hover:bg-brand-hover text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Watch Project Modules</span>
                      </button>
                      <button
                        onClick={() => onNavigateTab('projects')}
                        className="py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        View Architecture
                      </button>
                    </div>
                  </div>
                )}

                {/* Project 4: Real-Time Fraud ML Pipeline */}
                {(projectTrackFilter === 'all' || projectTrackFilter === 'ds' || projectTrackFilter === 'de') && (
                  <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold font-mono">
                        DATA SCIENCE & ML CAPSTONE
                      </span>
                      <span className="text-xs text-slate-400 font-mono">3 Modules • 1 hr 19m total</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
                      Financial Fraud Real-Time Detection & ML Pipeline
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Stream credit card transactions through Kafka, extract real-time sliding features with PySpark, train an XGBoost classifier, and deploy a containerized FastAPI endpoint.
                    </p>

                    <div className="space-y-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span>Module 1: Real-Time Kafka Transaction Streaming</span>
                        <span className="text-slate-400">25 min</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span>Module 2: PySpark Feature Store & XGBoost Model</span>
                        <span className="text-slate-400">28 min</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span>Module 3: Containerized FastAPI Inference Endpoint</span>
                        <span className="text-slate-400">26 min</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => onOpenVideo(HERO_MASTERCLASS_VIDEO)}
                        className="flex-1 py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Watch Project Modules</span>
                      </button>
                      <button
                        onClick={() => onNavigateTab('projects')}
                        className="py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        View Architecture
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Ready to Practice & Test CTA */}
              <div className="p-6 rounded-3xl bg-slate-900 dark:bg-slate-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
                <div>
                  <h4 className="text-base font-bold">Ready to write live code and test your skills?</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Jump into the DuckDB practice arena with 850+ company-tagged problems or read the textbooks in the 3D Vault.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => onNavigateTab('practice')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Open Practice Arena (850+)
                  </button>
                  <button
                    onClick={() => onNavigateTab('library')}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    3D Book Vault
                  </button>
                </div>
              </div>

            </motion.div>
          )}

        </div>

      </div>

    </section>
  );
};
