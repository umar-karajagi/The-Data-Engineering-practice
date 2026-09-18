'use client';

import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  Play, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  Star,
  Award,
  Terminal,
  FolderGit2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { getCuratedVideoById, ALL_CURATED_VIDEOS, CuratedVideo } from '../../content/videos/curatedVideos';

interface DataVedaTracksProps {
  onOpenVideo: (video: CuratedVideo) => void;
}

interface TrackDef {
  id: string;
  title: string;
  badge: string;
  duration: string;
  coursesCount: number;
  projectsCount: number;
  rating: number;
  description: string;
  stages: {
    stageNumber: number;
    title: string;
    description: string;
    modules: {
      name: string;
      duration: string;
      topic: string;
      videoQuery?: string;
    }[];
  }[];
}

const CAREER_TRACKS: TrackDef[] = [
  {
    id: 'track-de',
    title: 'Data Engineer Career Track',
    badge: 'Beginner → Advanced',
    duration: '120+ hours',
    coursesCount: 25,
    projectsCount: 12,
    rating: 4.9,
    description: 'Zero to job-ready data engineer. Master computer science fundamentals, Python and SQL, dimensional modeling and data warehousing, then move through distributed PySpark, Airflow orchestration, Kafka streaming, and modern cloud platforms, finishing with System Design and Interview Prep.',
    stages: [
      {
        stageNumber: 1,
        title: 'Foundations: Systems, Linux & Git',
        description: 'Understand how computers process data at the OS and network level before touching complex distributed systems.',
        modules: [
          { name: 'Computer Architecture & Linux Shell Command Line', duration: '4 hrs', topic: 'Linux' },
          { name: 'Git Version Control & GitHub Team Collaboration', duration: '3 hrs', topic: 'Git' },
          { name: 'Data Engineering 2026 Complete Roadmap & Mindset', duration: '2 hrs', topic: 'Overview', videoQuery: 'course-de-roadmap' }
        ]
      },
      {
        stageNumber: 2,
        title: 'Core Querying & Pipeline Development',
        description: 'Master writing production SQL and industrial Python code designed specifically for data manipulation.',
        modules: [
          { name: 'SQL for Data Engineering: Window Functions & Aggregations', duration: '12 hrs', topic: 'SQL', videoQuery: 'course-sql-masterclass' },
          { name: 'Python for Data Engineering: OOP, Generators & Concurrency', duration: '14 hrs', topic: 'Python', videoQuery: 'course-python-de' },
          { name: 'Dimensional Modeling: Kimball Star & Snowflake Schemas', duration: '6 hrs', topic: 'Data Modeling', videoQuery: 'course-data-modeling' }
        ]
      },
      {
        stageNumber: 3,
        title: 'Distributed Systems & Big Data with Spark',
        description: 'Process terabytes to petabytes of data without running out of executor memory.',
        modules: [
          { name: 'PySpark Fundamentals & Spark Architecture', duration: '16 hrs', topic: 'Spark', videoQuery: 'course-pyspark-full' },
          { name: 'Databricks, Delta Lake & Lakehouse Architecture', duration: '10 hrs', topic: 'Databricks', videoQuery: 'course-de-fundamentals' },
          { name: 'Salting, Broadcast Joins & Spark Optimization', duration: '8 hrs', topic: 'Spark', videoQuery: 'course-pyspark-full' }
        ]
      },
      {
        stageNumber: 4,
        title: 'Orchestration & Real-Time Event Streaming',
        description: 'Coordinate multi-stage dependencies and ingest events with millisecond latencies.',
        modules: [
          { name: 'Apache Airflow Mastery: DAGs, Sensors & TaskFlow API', duration: '10 hrs', topic: 'Airflow', videoQuery: 'project-twitter-airflow' },
          { name: 'Apache Kafka: Brokers, Producers, Consumers & Lag', duration: '10 hrs', topic: 'Kafka', videoQuery: 'project-kafka-crash-course' },
          { name: 'Snowflake Cloud Data Warehouse & Zero-Copy Clones', duration: '8 hrs', topic: 'Snowflake', videoQuery: 'course-snowflake-mastery' }
        ]
      },
      {
        stageNumber: 5,
        title: 'System Design & High-Stakes Interview Prep',
        description: 'Crush the final rounds at top tech companies with structured architectural patterns.',
        modules: [
          { name: 'Data Engineering System Design Masterclass', duration: '12 hrs', topic: 'System Design', videoQuery: 'course-system-design' },
          { name: '100+ Hiring Manager Questions & Behavioral Drills', duration: '6 hrs', topic: 'Interview' }
        ]
      }
    ]
  },
  {
    id: 'track-ae',
    title: 'Analytics Engineer Career Track',
    badge: 'Beginner → Intermediate',
    duration: '60+ hours',
    coursesCount: 8,
    projectsCount: 6,
    rating: 4.8,
    description: 'Bridge the gap between raw data engineering and business analytics. Transform data in production with modern software engineering practices using SQL, dbt, and cloud data warehouses.',
    stages: [
      {
        stageNumber: 1,
        title: 'Analytics Warehousing & Modeling',
        description: 'Build single sources of truth using Kimball dimensional techniques.',
        modules: [
          { name: 'Advanced SQL: CTEs, Pivots, and Analytical Queries', duration: '8 hrs', topic: 'SQL', videoQuery: 'course-sql-masterclass' },
          { name: 'Cloud Warehousing with Snowflake & BigQuery', duration: '10 hrs', topic: 'Snowflake', videoQuery: 'course-snowflake-mastery' }
        ]
      },
      {
        stageNumber: 2,
        title: 'Production Transformations with dbt',
        description: 'Modular SQL models, automated testing, documentation, and continuous integration.',
        modules: [
          { name: 'dbt Core & dbt Cloud: Models, Seeds, and Snapshots', duration: '14 hrs', topic: 'dbt' },
          { name: 'Data Quality & Governance: Schema Tests and Alerts', duration: '6 hrs', topic: 'Data Quality' },
          { name: 'Semantic Layers & Metric Stores', duration: '6 hrs', topic: 'Analytics' }
        ]
      }
    ]
  },
  {
    id: 'track-da',
    title: 'Data Analyst Career Track',
    badge: 'Beginner → Intermediate',
    duration: '60+ hours',
    coursesCount: 5,
    projectsCount: 4,
    rating: 4.8,
    description: 'Build foundational analysis skills across spreadsheets, Python data manipulation, SQL querying, business KPIs, and executive reporting.',
    stages: [
      {
        stageNumber: 1,
        title: 'Exploratory Analysis & Business Metrics',
        description: 'Extract actionable insights from raw business metrics.',
        modules: [
          { name: 'SQL for Business Analytics & Cohort Retention', duration: '12 hrs', topic: 'SQL', videoQuery: 'course-sql-masterclass' },
          { name: 'Python for Data Analysis (Pandas, NumPy, Matplotlib)', duration: '14 hrs', topic: 'Python', videoQuery: 'course-python-de' }
        ]
      },
      {
        stageNumber: 2,
        title: 'Executive Dashboards & Storytelling',
        description: 'Communicate complex insights with clarity to stakeholders.',
        modules: [
          { name: 'Interactive Dashboards with Power BI and Looker Studio', duration: '10 hrs', topic: 'Visualization' },
          { name: 'A/B Testing, Experimentation & Statistical Significance', duration: '8 hrs', topic: 'Statistics' }
        ]
      }
    ]
  }
];

export const DataVedaTracks: React.FC<DataVedaTracksProps> = ({ onOpenVideo }) => {
  const [selectedTrackId, setSelectedTrackId] = useState<string>('track-de');
  const activeTrack = CAREER_TRACKS.find(t => t.id === selectedTrackId) || CAREER_TRACKS[0];

  const handleLaunchModule = (videoQuery?: string) => {
    if (videoQuery) {
      const match = getCuratedVideoById(videoQuery);
      if (match) {
        onOpenVideo(match);
        return;
      }
    }
    // Fallback to first verified video
    if (ALL_CURATED_VIDEOS.length > 0) {
      onOpenVideo(ALL_CURATED_VIDEOS[0]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-xs font-semibold mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Curated Learning Progression</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-forge-text">
          Structured <span className="text-brand-blue">Career Tracks</span>
        </h1>
        <p className="mt-2 text-base text-forge-muted max-w-3xl">
          Pick the role. Follow the path. Learn in the exact prerequisite order, accompanied by top-rated video masterclasses, hands-on milestones, and real portfolio projects.
        </p>
      </div>

      {/* Track Tabs */}
      <div className="flex flex-wrap gap-3 mb-10">
        {CAREER_TRACKS.map((track) => (
          <button
            key={track.id}
            onClick={() => setSelectedTrackId(track.id)}
            className={`px-5 py-3 rounded-2xl border text-sm font-bold transition-all flex items-center gap-2.5 ${
              selectedTrackId === track.id
                ? 'bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20'
                : 'bg-vidhya-card border-forge-border/50 text-forge-muted hover:text-forge-text hover:border-brand-blue/40'
            }`}
          >
            <span>{track.title}</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
              selectedTrackId === track.id ? 'bg-white/20 text-white' : 'bg-forge-bg text-forge-muted'
            }`}>
              {track.duration}
            </span>
          </button>
        ))}
      </div>

      {/* Track Overview Card */}
      <div className="bg-vidhya-card border border-forge-border/50 rounded-3xl p-8 mb-12 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-forge-border/30">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-brand-blue/10 text-brand-blue">
                {activeTrack.badge}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {activeTrack.rating} Rating
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-forge-text">
              {activeTrack.title}
            </h2>
            <p className="mt-2 text-sm text-forge-muted max-w-3xl leading-relaxed">
              {activeTrack.description}
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-forge-muted block">Estimated Duration</span>
              <span className="text-lg font-black text-forge-text">{activeTrack.duration}</span>
            </div>
            <button 
              onClick={() => handleLaunchModule(activeTrack.stages[0]?.modules[0]?.videoQuery)}
              className="px-6 py-3 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-brand-hover transition-colors shadow-md shadow-brand-blue/20 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Stage 1</span>
            </button>
          </div>
        </div>

        {/* Track Curriculum Stages */}
        <div className="mt-8 space-y-8">
          {activeTrack.stages.map((stage) => (
            <div 
              key={stage.stageNumber}
              className="bg-forge-bg/60 border border-forge-border/40 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-[11px] font-bold text-brand-blue uppercase tracking-wider">
                    Stage 0{stage.stageNumber}
                  </span>
                  <h3 className="text-lg font-bold text-forge-text mt-0.5">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-forge-muted mt-1">
                    {stage.description}
                  </p>
                </div>
              </div>

              {/* Modules in this Stage */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                {stage.modules.map((mod, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleLaunchModule(mod.videoQuery)}
                    className="p-4 rounded-xl bg-vidhya-card border border-forge-border/40 hover:border-brand-blue/50 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-forge-muted mb-2">
                        <span className="font-semibold text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded">
                          {mod.topic}
                        </span>
                        <span>{mod.duration}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-forge-text group-hover:text-brand-blue transition-colors line-clamp-2">
                        {mod.name}
                      </h4>
                    </div>

                    <div className="mt-4 pt-3 border-t border-forge-border/30 flex items-center justify-between text-[11px] text-forge-muted">
                      <span className="flex items-center gap-1 group-hover:text-brand-blue transition-colors">
                        <Play className="w-3 h-3 fill-current" />
                        <span>Watch Masterclass</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
