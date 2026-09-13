'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  UserProfile, 
  NoteItem, 
  TodoItem, 
  BadgeItem, 
  CertificateItem, 
  TrackProgressRecord,
  LibraryCheckpointAttempt,
  ContentRef,
  LinkedRef,
  CourseProgressRecord,
  ResumeProfile,
  ResumeContact,
  ResumeExperience,
  ResumeProject,
  BulletImprovement,
  CoverLetterDraft,
  StarStory
} from '../types';
import { ALL_CAREER_PATHS, getSkillCourseById } from '../content/courses/catalog';

export interface UserStoreContextType {
  user: UserProfile;
  tracksProgress: Record<string, TrackProgressRecord>;
  // Schema v3: Course and Path Progress
  courseEnrollments: string[]; // Course IDs (SF-*) and Path IDs (CP-*)
  courseProgress: Record<string, CourseProgressRecord>;
  notes: NoteItem[];
  todos: TodoItem[];
  badges: BadgeItem[];
  certificates: CertificateItem[];
  libraryCheckpoints: Record<string, LibraryCheckpointAttempt>;
  libraryBookmarks: Record<string, { lastPage: number; totalPages: number; updated: string }>;
  lastActiveItem?: {
    type: 'track_module' | 'library_chapter' | 'roadmap_node' | 'course_lesson';
    id: string;
    title: string;
    subtitle?: string;
    trackId?: string;
    bookId?: string;
    courseId?: string;
    lessonId?: string;
    timestamp: string;
  };
  // Career Studio State
  resumeProfile: ResumeProfile;
  bulletImprovements: BulletImprovement[];
  coverLetters: CoverLetterDraft[];
  starStories: StarStory[];

  // Actions
  enrollCourse: (courseOrPathId: string) => void;
  completeLesson: (courseId: string, lessonId: string, nextLessonId?: string) => void;
  passCourseQuiz: (courseId: string, moduleId: string, score: number) => boolean;
  submitCoursePlacementDiagnostic: (courseId: string, score: number, skipModuleId?: string) => { skipped: boolean; message: string };
  submitCourseCapstone: (courseId: string, rubricChecks: Record<string, boolean>, submissionNote?: string) => boolean;
  getPathProgress: (pathId: string) => { percentComplete: number; completedCourses: number; totalCourses: number; isCompleted: boolean };

  // Legacy Track Actions (backward compatibility)
  completeModule: (trackId: string, moduleId: string, score: number, tierNumber: 1 | 2 | 3, nextModuleId?: string) => void;
  submitCapstone: (trackId: string, capstoneId: string, tierNumber: 1 | 2 | 3, rubricChecks: Record<string, boolean>, submissionNote?: string) => boolean;
  submitPlacementDiagnostic: (trackId: string, score: number) => { unlockedTier: 1 | 2 | 3; message: string };

  // Career Studio Actions
  updateResumeContact: (contact: ResumeContact) => void;
  updateResumeTargetRole: (targetRole: string) => void;
  updateResumeSummary: (summary: string) => void;
  updateResumeSkills: (category: keyof ResumeProfile['skills'], skills: string[]) => void;
  addResumeExperience: (exp: ResumeExperience) => void;
  updateResumeExperience: (id: string, exp: ResumeExperience) => void;
  deleteResumeExperience: (id: string) => void;
  addResumeProject: (proj: ResumeProject) => void;
  updateResumeProject: (id: string, proj: ResumeProject) => void;
  deleteResumeProject: (id: string) => void;
  addStarStory: (story: StarStory) => void;
  updateStarStory: (id: string, story: StarStory) => void;
  deleteStarStory: (id: string) => void;
  saveCoverLetter: (draft: CoverLetterDraft) => void;

  // Global actions
  addNote: (note: { body: string; tags: string[]; contentRef?: ContentRef }) => NoteItem;
  updateNote: (id: string, body: string, tags: string[]) => void;
  deleteNote: (id: string) => void;
  addTodo: (todo: { text: string; dueDate?: string; linkedRef?: LinkedRef }) => TodoItem;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  saveBookCheckpoint: (bookId: string, chapterNumber: number, checkpointType: 'single' | 'mid' | 'end', score: number, skipped: boolean) => void;
  saveBookBookmark: (bookId: string, page: number, totalPages: number) => void;
  addXP: (amount: number) => void;
  setLastActive: (item: {
    type: 'track_module' | 'library_chapter' | 'roadmap_node' | 'course_lesson';
    id: string;
    title: string;
    subtitle?: string;
    trackId?: string;
    bookId?: string;
    courseId?: string;
    lessonId?: string;
  }) => void;
  resetToDemo: () => void;
}

const STORAGE_KEY = 'dataforge_unified_user_state_v3';

const INITIAL_USER: UserProfile = {
  id: 'de-user-786',
  name: 'Umar Karajagi',
  avatarUrl: '',
  email: 'umar@dataforge.io',
  joinedDate: 'September 2026',
  streak: 6,
  lastActiveDate: new Date().toISOString(),
  totalXp: 1450
};

const INITIAL_RESUME_PROFILE: ResumeProfile = {
  contact: {
    fullName: 'Umar Karajagi',
    email: 'umar@dataforge.io',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    linkedinUrl: 'https://linkedin.com/in/umar-karajagi',
    githubUrl: 'https://github.com/umar-karajagi',
    portfolioUrl: 'https://dataforge.dev/portfolio'
  },
  targetRole: 'Senior Data Engineer / Lakehouse Platform Architect',
  summary: 'Senior Data Engineer with 5+ years of experience designing and scaling distributed data pipelines, cloud Lakehouses, and real-time streaming architectures. Led engineering initiatives processing 50M+ daily events using PySpark, Databricks Delta Lake, and Apache Airflow with 99.9% uptime and zero ledger discrepancies.',
  skills: {
    languages: ['Python', 'SQL (ANSI, PostgreSQL, DuckDB)', 'Bash / Shell', 'Scala (Foundational)'],
    frameworksAndTools: ['Apache Spark / PySpark', 'Delta Lake', 'Apache Iceberg', 'dbt Core', 'Apache Airflow', 'Great Expectations'],
    databasesAndWarehouses: ['Snowflake', 'BigQuery', 'PostgreSQL', 'DuckDB', 'Redis'],
    cloudAndDevOps: ['AWS (S3, EMR, Glue, Athena)', 'Azure (ADLS Gen2, ADF, Databricks)', 'Docker', 'Terraform', 'GitHub Actions CI/CD'],
    methodologies: ['Medallion Architecture', 'Kimball Dimensional Modeling', 'Data Mesh', 'Data Contracts', 'DataOps']
  },
  experiences: [
    {
      id: 'exp-1',
      company: 'ScaleData Systems',
      role: 'Senior Data Engineer',
      location: 'Bengaluru, India',
      startDate: '2023-01',
      endDate: 'Present',
      current: true,
      bullets: [
        'Architected multi-tier Lakehouse platform ingesting 50M+ daily events across 8 microservices, slashing end-to-end data latency from 4 hours to 18 minutes.',
        'Eliminated PySpark executor memory spilling and data skew using salt keys and broadcast hash joins, reducing cloud cluster infrastructure costs by 38% ($14,000/month).',
        'Implemented automated data quality gates with Great Expectations in GitHub Actions, preventing 12 high-severity schema drift outages from reaching production marts.'
      ],
      techStack: ['PySpark', 'Databricks', 'Delta Lake', 'Airflow', 'AWS', 'Terraform']
    },
    {
      id: 'exp-2',
      company: 'Nexus FinTech Labs',
      role: 'Data Engineer',
      location: 'Pune, India',
      startDate: '2021-03',
      endDate: '2022-12',
      current: false,
      bullets: [
        'Designed Kimball dimensional star schema across 14 conformed dimensions and 6 transaction/snapshot fact tables for merchant payment settlements.',
        'Migrated 85 legacy cron scripts to modular dbt Core models with 100% automated test coverage and documentation.',
        'Built real-time Kafka event processor capturing payment status updates with sub-second SLA for fraud risk alerting.'
      ],
      techStack: ['Python', 'PostgreSQL', 'dbt', 'Snowflake', 'Kafka', 'Docker']
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Enterprise Lakehouse with Airflow, PySpark & Delta Lake',
      role: 'Lead Architect',
      githubUrl: 'https://github.com/umar-karajagi/The-Data-Engineering-practice-',
      bullets: [
        'Constructed end-to-end Medallion pipeline ingesting raw JSON transactions into Bronze, cleaning and deduplicating in Silver, and producing Gold SCD Type 2 dimension marts.',
        'Engineered custom Airflow sensor and backfill recovery mechanics guaranteeing strict idempotency.'
      ],
      techStack: ['PySpark', 'Delta Lake', 'Apache Airflow', 'DuckDB', 'Docker']
    },
    {
      id: 'proj-2',
      title: 'Real-Time Financial Anomaly Detection Engine',
      role: 'Creator',
      githubUrl: 'https://github.com/umar-karajagi/financial-stream-anomaly',
      bullets: [
        'Streamed 20,000 trades/sec via Kafka to Spark Structured Streaming with 5-minute tumbling windows and event-time watermarking.',
        'Cached sliding window volatility metrics in Redis for sub-50ms API fraud lookups.'
      ],
      techStack: ['Kafka', 'Spark Streaming', 'Redis', 'Python']
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'National Institute of Technology Karnataka (NITK Surathkal)',
      degree: 'B.Tech',
      fieldOfStudy: 'Computer Science and Engineering',
      startYear: '2017',
      endYear: '2021',
      gpaOrScore: '8.8 / 10'
    }
  ],
  certifications: [
    'Databricks Certified Data Engineer Professional',
    'AWS Certified Data Analytics Specialty',
    'DataForge Relational Database & ANSI SQL Certified'
  ]
};

const INITIAL_STAR_STORIES: StarStory[] = [
  {
    id: 'star-1',
    title: 'Resolving Severe PySpark Data Skew on Black Friday',
    targetQuestion: 'Tell me about a time you solved a critical distributed systems performance bottleneck under tight deadlines.',
    situation: 'During Black Friday, our payment settlement batch pipeline processing 120M records spiked from 45 minutes to 4.5 hours and began crashing with executor OutOfMemory exit code 137.',
    task: 'I needed to identify the exact cause of stage failure and restore pipeline execution within our 1-hour morning SLA without arbitrarily over-provisioning expensive cluster nodes.',
    action: 'I inspected the Spark UI event timeline and discovered severe data skew in Stage 4: 199 tasks finished in 3 seconds, while 1 single task ran for 38 minutes processing 60% of all rows due to a generic "GUEST_CHECKOUT" customer_id. I refactored the join by adding a random salt key (0 to 19) to the skewed merchant IDs and replicated the lookup dimension side.',
    result: 'Stage execution time dropped from 38 minutes to 95 seconds. The complete end-to-end pipeline completed in 32 minutes, well within SLA, saving $8,000 in emergency cluster scaling costs.',
    metricsAchieved: '96% reduction in stage runtime; 0 OOM errors; 100% SLA adherence.',
    tags: ['#pyspark', '#dataskew', '#performance', '#troubleshooting']
  },
  {
    id: 'star-2',
    title: 'Preventing Silent Data Corruption with Automated Data Contracts',
    targetQuestion: 'How do you handle breaking changes from upstream application engineering teams?',
    situation: 'Upstream checkout microservice engineers deployed a database schema update that renamed a critical currency code column without notifying the data team, corrupting downstream revenue reporting for 48 hours.',
    task: 'Establish an automated enforcement mechanism so upstream schema changes could not break production analytics silently.',
    action: 'I drafted machine-readable JSON Schema Data Contracts and built a lightweight validation GitHub Action for upstream repositories. I also integrated Great Expectations checkpoints at the bronze landing layer to fail and quarantine records before Silver transformation.',
    result: 'Over the following 12 months, the system intercepted 14 unannounced schema mutations at the PR stage, eliminating downstream pipeline downtime completely.',
    metricsAchieved: 'Zero undetected schema drift incidents; 100% contract compliance across 6 engineering teams.',
    tags: ['#datacontracts', '#dataquality', '#collaboration', '#greatexpectations']
  }
];

const INITIAL_COURSE_PROGRESS: Record<string, CourseProgressRecord> = {
  'SF-04': {
    courseId: 'SF-04',
    enrolledAt: '2026-09-10',
    completedLessonIds: ['sf-04-l1', 'sf-04-l2'],
    completedModuleIds: ['sf-04-m1'],
    passedQuizIds: ['sf-04-q1'],
    placementSkippedModuleIds: [],
    capstoneStatus: 'not_started',
    percentComplete: 65,
    lastActivityAt: '2026-09-12T17:30:00Z'
  },
  'SF-02': {
    courseId: 'SF-02',
    enrolledAt: '2026-09-11',
    completedLessonIds: ['sf-02-l1'],
    completedModuleIds: ['sf-02-m1'],
    passedQuizIds: ['sf-02-q1'],
    placementSkippedModuleIds: [],
    capstoneStatus: 'not_started',
    percentComplete: 50,
    lastActivityAt: '2026-09-12T14:10:00Z'
  },
  'SF-15': {
    courseId: 'SF-15',
    enrolledAt: '2026-09-12',
    completedLessonIds: ['sf-15-l1'],
    completedModuleIds: [],
    passedQuizIds: [],
    placementSkippedModuleIds: [],
    capstoneStatus: 'not_started',
    percentComplete: 30,
    lastActivityAt: '2026-09-12T18:00:00Z'
  }
};

const INITIAL_BADGES: BadgeItem[] = [
  { id: 'b-query-virtuoso', name: 'DuckDB Query Virtuoso', description: 'Ran analytical SQL queries with zero memory spills', iconName: 'Database', category: 'tracks', earned: true, earnedAt: '2026-09-10' },
  { id: 'b-kimball-scholar', name: 'Kimball Apprentice', description: 'Mastered dimensional star schemas & SCD Type 2 point-in-time joins', iconName: 'Layers', category: 'vault', earned: true, earnedAt: '2026-09-11' },
  { id: 'b-catalyst-tuner', name: 'Catalyst Tuner', description: 'Diagnosed and mitigated distributed data skew via salting', iconName: 'Zap', category: 'tracks', earned: true, earnedAt: '2026-09-12' },
  { id: 'b-pipeline-builder', name: 'Clean Pipeline Builder', description: 'Constructed an idempotent ingestion pipeline with dead letter queues', iconName: 'CheckCircle2', category: 'tracks', earned: true, earnedAt: '2026-09-12' },
  { id: 'b-literature-scholar', name: 'Literature Scholar', description: 'Read 5+ foundational classic data engineering book chapters', iconName: 'BookOpen', category: 'vault', earned: false, progressCurrent: 3, progressTarget: 5 },
  { id: 'b-streak-master', name: '7-Day Consistency', description: 'Maintained a 7-day active practice streak in DataForge', iconName: 'Flame', category: 'streak', earned: false, progressCurrent: 6, progressTarget: 7 },
  { id: 'b-principal-architect', name: 'Staff Architect', description: 'Achieved level 5 reputation and completed a Tier 3 Capstone project', iconName: 'Trophy', category: 'general', earned: false, progressCurrent: 1, progressTarget: 3 }
];

const INITIAL_TODOS: TodoItem[] = [
  {
    id: 'todo-1',
    userId: 'de-user-786',
    text: 'Review Delta Lake Liquid Clustering vs Z-Order trade-offs in SF-18',
    done: false,
    dueDate: new Date().toISOString().split('T')[0],
    linkedRef: { type: 'module', id: 'SF-18', title: 'Databricks Lakehouse Platform & Medallion Architecture' },
    createdAt: '2026-09-12'
  },
  {
    id: 'todo-2',
    userId: 'de-user-786',
    text: 'Complete Capstone for SF-04: Analytical SQL Engine Benchmark',
    done: false,
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    linkedRef: { type: 'track', id: 'SF-04', title: 'Relational Database Fundamentals, ANSI SQL & Execution Engines' },
    createdAt: '2026-09-12'
  },
  {
    id: 'todo-3',
    userId: 'de-user-786',
    text: 'Run ATS Diagnostic on Senior Data Engineer resume in Career Studio',
    done: true,
    dueDate: '2026-09-11',
    createdAt: '2026-09-10'
  }
];

const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    userId: 'de-user-786',
    body: 'Rule of Thumb: When asked in Staff DE interviews about stateful streaming joins, always specify an Event-Time Watermark. Without a watermark, RocksDB state stores retain historical keys indefinitely until executor memory crashes.',
    tags: ['#interview', '#streaming', '#pyspark', '#SF-17'],
    createdAt: '2026-09-11T14:20:00Z',
    updatedAt: '2026-09-11T14:20:00Z'
  },
  {
    id: 'note-2',
    userId: 'de-user-786',
    body: 'Kimball Chapter 3 Insight: Conformed dimensions are the backbone of the Enterprise Data Bus. If customer_id has conflicting surrogate definitions across marts, cross-functional drill-down is impossible.',
    tags: ['#warehousing', '#kimball', '#SF-07'],
    contentRef: { type: 'library_chapter', id: 'book-1-ch-3', title: 'The Data Warehouse Toolkit - Ch 3', bookId: 'book-1' },
    createdAt: '2026-09-12T09:15:00Z',
    updatedAt: '2026-09-12T09:15:00Z'
  },
  {
    id: 'note-3',
    userId: 'de-user-786',
    body: 'PySpark Broadcast threshold defaults to 10MB (`spark.sql.autoBroadcastJoinThreshold`). If cluster executors have 16GB+ memory, safely bump this to 64MB or 128MB to convert slow SortMergeJoins into BHJ.',
    tags: ['#performance', '#catalyst', '#SF-15'],
    createdAt: '2026-09-12T16:40:00Z',
    updatedAt: '2026-09-12T16:40:00Z'
  }
];

const INITIAL_TRACKS_PROGRESS: Record<string, TrackProgressRecord> = {
  sql: {
    trackId: 'sql',
    diagnosticTaken: false,
    unlockedTier: 2,
    completedModules: ['sql-m101', 'sql-m102', 'sql-m103'],
    moduleRecords: {
      'sql-m101': { moduleId: 'sql-m101', learned: true, testPassed: true, score: 100, attempts: 1, lastAttemptedAt: '2026-09-10' },
      'sql-m102': { moduleId: 'sql-m102', learned: true, testPassed: true, score: 100, attempts: 1, lastAttemptedAt: '2026-09-11' },
      'sql-m103': { moduleId: 'sql-m103', learned: true, testPassed: true, score: 75, attempts: 1, lastAttemptedAt: '2026-09-11' },
      'sql-m201': { moduleId: 'sql-m201', learned: true, testPassed: false, score: 50, attempts: 1, lastAttemptedAt: '2026-09-12' }
    },
    capstoneRecords: {
      'sql-cap-t1': { capstoneId: 'sql-cap-t1', passed: true, rubricChecks: { 'rubric-sql-1-1': true, 'rubric-sql-1-2': true, 'rubric-sql-1-3': true }, submittedAt: '2026-09-11' }
    }
  }
};

const UserStoreContext = createContext<UserStoreContextType | undefined>(undefined);

export const UserStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [tracksProgress, setTracksProgress] = useState<Record<string, TrackProgressRecord>>(INITIAL_TRACKS_PROGRESS);
  const [courseEnrollments, setCourseEnrollments] = useState<string[]>(['SF-04', 'SF-02', 'SF-15', 'CP-01']);
  const [courseProgress, setCourseProgress] = useState<Record<string, CourseProgressRecord>>(INITIAL_COURSE_PROGRESS);
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [todos, setTodos] = useState<TodoItem[]>(INITIAL_TODOS);
  const [badges, setBadges] = useState<BadgeItem[]>(INITIAL_BADGES);
  const [certificates, setCertificates] = useState<CertificateItem[]>([
    {
      id: 'DF-CERT-SF-04-8921',
      userId: 'de-user-786',
      userName: 'Umar Karajagi',
      trackId: 'SF-04',
      trackTitle: 'Relational Database Fundamentals, ANSI SQL & Execution Engines',
      issuedAt: '2026-09-11',
      averageScore: 94,
      verificationUrl: 'https://dataforge.dev/verify/DF-CERT-SF-04-8921'
    }
  ]);
  const [libraryCheckpoints, setLibraryCheckpoints] = useState<Record<string, LibraryCheckpointAttempt>>({});
  const [libraryBookmarks, setLibraryBookmarks] = useState<Record<string, { lastPage: number; totalPages: number; updated: string }>>({
    'book-1': { lastPage: 45, totalPages: 600, updated: '2026-09-12' },
    'book-2': { lastPage: 112, totalPages: 560, updated: '2026-09-11' }
  });
  const [lastActiveItem, setLastActiveItem] = useState<{
    type: 'track_module' | 'library_chapter' | 'roadmap_node' | 'course_lesson';
    id: string;
    title: string;
    subtitle?: string;
    trackId?: string;
    bookId?: string;
    courseId?: string;
    lessonId?: string;
    timestamp: string;
  }>({
    type: 'course_lesson',
    id: 'sf-04-l2',
    courseId: 'SF-04',
    lessonId: 'sf-04-l2',
    title: 'Query Execution Plans: Reading EXPLAIN and EXPLAIN ANALYZE',
    subtitle: 'SF-04 • Relational Databases & ANSI SQL',
    timestamp: '2026-09-12T17:30:00Z'
  });

  // Career Studio State
  const [resumeProfile, setResumeProfile] = useState<ResumeProfile>(INITIAL_RESUME_PROFILE);
  const [bulletImprovements, setBulletImprovements] = useState<BulletImprovement[]>([
    {
      id: 'bi-1',
      original: 'Wrote Spark jobs to process customer data and fix errors.',
      improved: 'Engineered distributed PySpark ETL pipelines ingesting 50M+ daily events, eliminating data skew via salting and reducing runtime by 72% ($14K monthly cloud savings).',
      formula: 'XYZ',
      actionVerb: 'Engineered',
      metricAdded: '50M+ daily events, 72% runtime reduction, $14K savings',
      context: 'ScaleData Systems Lakehouse'
    }
  ]);
  const [coverLetters, setCoverLetters] = useState<CoverLetterDraft[]>([]);
  const [starStories, setStarStories] = useState<StarStory[]>(INITIAL_STAR_STORIES);

  // Load state on mount with backward-compatible migration
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('dataforge_unified_user_state_v2');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.user) setUser(data.user);
        if (data.tracksProgress) setTracksProgress(data.tracksProgress);
        if (data.courseEnrollments) setCourseEnrollments(data.courseEnrollments);
        if (data.courseProgress) setCourseProgress(data.courseProgress);
        if (data.resumeProfile) setResumeProfile(data.resumeProfile);
        if (data.starStories) setStarStories(data.starStories);
        if (data.notes) setNotes(data.notes);
        if (data.todos) setTodos(data.todos);
        if (data.badges) setBadges(data.badges);
        if (data.certificates) setCertificates(data.certificates);
        if (data.libraryCheckpoints) setLibraryCheckpoints(data.libraryCheckpoints);
        if (data.libraryBookmarks) setLibraryBookmarks(data.libraryBookmarks);
        if (data.lastActiveItem) setLastActiveItem(data.lastActiveItem);
      }
    } catch (e) {
      console.warn('Could not load saved user state', e);
    }
  }, []);

  const persistState = (partial: any) => {
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      const prev = existing ? JSON.parse(existing) : {};
      const updated = { ...prev, ...partial };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not persist user state', e);
    }
  };

  const addXP = (amount: number) => {
    setUser(prev => {
      const updated = { ...prev, totalXp: prev.totalXp + amount };
      persistState({ user: updated });
      return updated;
    });
  };

  // Course Actions
  const enrollCourse = (courseOrPathId: string) => {
    setCourseEnrollments(prev => {
      if (prev.includes(courseOrPathId)) return prev;
      const updated = [...prev, courseOrPathId];
      persistState({ courseEnrollments: updated });
      return updated;
    });
    // Initialize progress record if not present
    setCourseProgress(prev => {
      if (prev[courseOrPathId]) return prev;
      const newRecord: CourseProgressRecord = {
        courseId: courseOrPathId,
        enrolledAt: new Date().toISOString(),
        completedLessonIds: [],
        completedModuleIds: [],
        passedQuizIds: [],
        placementSkippedModuleIds: [],
        capstoneStatus: 'not_started',
        percentComplete: 0,
        lastActivityAt: new Date().toISOString()
      };
      const updated = { ...prev, [courseOrPathId]: newRecord };
      persistState({ courseProgress: updated });
      return updated;
    });
    addXP(25);
  };

  const completeLesson = (courseId: string, lessonId: string, nextLessonId?: string) => {
    setCourseProgress(prev => {
      const course = getSkillCourseById(courseId);
      const current = prev[courseId] || {
        courseId,
        enrolledAt: new Date().toISOString(),
        completedLessonIds: [],
        completedModuleIds: [],
        passedQuizIds: [],
        placementSkippedModuleIds: [],
        capstoneStatus: 'not_started',
        percentComplete: 0,
        lastActivityAt: new Date().toISOString()
      };

      const completedLessonIds = current.completedLessonIds.includes(lessonId)
        ? current.completedLessonIds
        : [...current.completedLessonIds, lessonId];

      // Calculate total lessons in course
      let totalLessons = 1;
      if (course) {
        totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
      }
      const percentComplete = Math.min(100, Math.round((completedLessonIds.length / Math.max(1, totalLessons)) * 100));

      const updatedRecord: CourseProgressRecord = {
        ...current,
        completedLessonIds,
        percentComplete,
        lastActivityAt: new Date().toISOString()
      };

      const updated = { ...prev, [courseId]: updatedRecord };
      persistState({ courseProgress: updated });
      return updated;
    });

    addXP(50);
  };

  const passCourseQuiz = (courseId: string, moduleId: string, score: number): boolean => {
    const passed = score >= 70;
    if (passed) {
      setCourseProgress(prev => {
        const current = prev[courseId] || {
          courseId,
          enrolledAt: new Date().toISOString(),
          completedLessonIds: [],
          completedModuleIds: [],
          passedQuizIds: [],
          placementSkippedModuleIds: [],
          capstoneStatus: 'not_started',
          percentComplete: 0,
          lastActivityAt: new Date().toISOString()
        };

        const updatedPassedQuizzes = current.passedQuizIds.includes(moduleId)
          ? current.passedQuizIds
          : [...current.passedQuizIds, moduleId];

        const updatedCompletedModules = current.completedModuleIds.includes(moduleId)
          ? current.completedModuleIds
          : [...current.completedModuleIds, moduleId];

        const updatedRecord: CourseProgressRecord = {
          ...current,
          passedQuizIds: updatedPassedQuizzes,
          completedModuleIds: updatedCompletedModules,
          lastActivityAt: new Date().toISOString()
        };

        const updated = { ...prev, [courseId]: updatedRecord };
        persistState({ courseProgress: updated });
        return updated;
      });

      addXP(100);
    }
    return passed;
  };

  const submitCoursePlacementDiagnostic = (courseId: string, score: number, skipModuleId?: string): { skipped: boolean; message: string } => {
    const passed = score >= 70;
    const skippedModuleIds = (passed && skipModuleId) ? [skipModuleId] : [];

    setCourseProgress(prev => {
      const current = prev[courseId] || {
        courseId,
        enrolledAt: new Date().toISOString(),
        completedLessonIds: [],
        completedModuleIds: [],
        passedQuizIds: [],
        placementSkippedModuleIds: [],
        capstoneStatus: 'not_started',
        percentComplete: 0,
        lastActivityAt: new Date().toISOString()
      };

      const updatedRecord: CourseProgressRecord = {
        ...current,
        diagnosticResult: {
          taken: true,
          score,
          recommendedModuleId: skipModuleId || '',
          skippedModuleIds
        },
        placementSkippedModuleIds: Array.from(new Set([...current.placementSkippedModuleIds, ...skippedModuleIds])),
        lastActivityAt: new Date().toISOString()
      };

      const updated = { ...prev, [courseId]: updatedRecord };
      persistState({ courseProgress: updated });
      return updated;
    });

    addXP(100);

    if (passed && skipModuleId) {
      return { skipped: true, message: `Score: ${score}%. Placement diagnostic passed! Introductory module placement skipped.` };
    }
    return { skipped: false, message: `Score: ${score}%. We recommend starting from Module 1 for full foundational coverage.` };
  };

  const submitCourseCapstone = (courseId: string, rubricChecks: Record<string, boolean>, submissionNote?: string): boolean => {
    const totalChecks = Object.keys(rubricChecks).length;
    const passedChecks = Object.values(rubricChecks).filter(Boolean).length;
    const passed = totalChecks === 0 || (passedChecks / totalChecks) >= 0.75;

    if (passed) {
      setCourseProgress(prev => {
        const current = prev[courseId] || {
          courseId,
          enrolledAt: new Date().toISOString(),
          completedLessonIds: [],
          completedModuleIds: [],
          passedQuizIds: [],
          placementSkippedModuleIds: [],
          capstoneStatus: 'not_started',
          percentComplete: 0,
          lastActivityAt: new Date().toISOString()
        };

        const updatedRecord: CourseProgressRecord = {
          ...current,
          capstoneStatus: 'passed',
          percentComplete: 100,
          lastActivityAt: new Date().toISOString()
        };

        const updated = { ...prev, [courseId]: updatedRecord };
        persistState({ courseProgress: updated });
        return updated;
      });

      // Issue course certificate
      const course = getSkillCourseById(courseId);
      const certId = `DF-CERT-${courseId}-${Math.floor(100000 + Math.random() * 900000)}`;
      const newCert: CertificateItem = {
        id: certId,
        userId: user.id,
        userName: user.name,
        trackId: courseId,
        trackTitle: course?.title || `${courseId} Mastery`,
        issuedAt: new Date().toISOString().split('T')[0],
        averageScore: 95,
        verificationUrl: `https://dataforge.dev/verify/${certId}`
      };

      setCertificates(prev => {
        const updated = [...prev.filter(c => c.trackId !== courseId), newCert];
        persistState({ certificates: updated });
        return updated;
      });

      addXP(400);
    }
    return passed;
  };

  // Dynamic Career Path Progress calculation (One progress record across all paths!)
  const getPathProgress = (pathId: string) => {
    const path = ALL_CAREER_PATHS.find(p => p.id === pathId);
    if (!path) return { percentComplete: 0, completedCourses: 0, totalCourses: 0, isCompleted: false };

    const totalCourses = path.orderedCourseIds.length;
    if (totalCourses === 0) return { percentComplete: 0, completedCourses: 0, totalCourses: 0, isCompleted: false };

    let completedCount = 0;
    let sumPercent = 0;

    for (const cId of path.orderedCourseIds) {
      const rec = courseProgress[cId];
      if (rec) {
        if (rec.capstoneStatus === 'passed' || rec.percentComplete >= 100) {
          completedCount += 1;
        }
        sumPercent += rec.percentComplete || 0;
      }
    }

    const overallPercent = Math.round(sumPercent / totalCourses);
    return {
      percentComplete: overallPercent,
      completedCourses: completedCount,
      totalCourses,
      isCompleted: completedCount === totalCourses && totalCourses > 0
    };
  };

  // Legacy Track compatibility methods
  const completeModule = (
    trackId: string, 
    moduleId: string, 
    score: number, 
    tierNumber: 1 | 2 | 3,
    nextModuleId?: string
  ) => {
    const passed = score >= 70;
    setTracksProgress(prev => {
      const currentTrack = prev[trackId] || {
        trackId,
        diagnosticTaken: false,
        unlockedTier: 1,
        completedModules: [],
        moduleRecords: {},
        capstoneRecords: {}
      };

      const prevRecord = currentTrack.moduleRecords[moduleId];
      const attempts = (prevRecord?.attempts || 0) + 1;
      const bestScore = Math.max(score, prevRecord?.score || 0);
      const isNewlyPassed = passed && !currentTrack.completedModules.includes(moduleId);

      const updatedCompleted = isNewlyPassed 
        ? [...currentTrack.completedModules, moduleId] 
        : currentTrack.completedModules;

      const updatedModuleRecords = {
        ...currentTrack.moduleRecords,
        [moduleId]: {
          moduleId,
          learned: true,
          testPassed: passed || Boolean(prevRecord?.testPassed),
          score: bestScore,
          attempts,
          lastAttemptedAt: new Date().toISOString()
        }
      };

      const updatedTrack: TrackProgressRecord = {
        ...currentTrack,
        completedModules: updatedCompleted,
        moduleRecords: updatedModuleRecords
      };

      const updatedAll = { ...prev, [trackId]: updatedTrack };
      persistState({ tracksProgress: updatedAll });
      return updatedAll;
    });

    if (passed) {
      addXP(100);
    }
  };

  const submitCapstone = (
    trackId: string, 
    capstoneId: string, 
    tierNumber: 1 | 2 | 3, 
    rubricChecks: Record<string, boolean>,
    submissionNote?: string
  ): boolean => {
    const totalCriteria = Object.keys(rubricChecks).length;
    const passedCriteria = Object.values(rubricChecks).filter(Boolean).length;
    const passed = totalCriteria === 0 || (passedCriteria / totalCriteria) >= 0.75;

    setTracksProgress(prev => {
      const currentTrack = prev[trackId] || {
        trackId,
        diagnosticTaken: false,
        unlockedTier: 1,
        completedModules: [],
        moduleRecords: {},
        capstoneRecords: {}
      };

      const nextTier = (passed && tierNumber < 3) 
        ? Math.max(currentTrack.unlockedTier, (tierNumber + 1) as 2 | 3) as 1 | 2 | 3 
        : currentTrack.unlockedTier;

      const updatedTrack: TrackProgressRecord = {
        ...currentTrack,
        unlockedTier: nextTier,
        capstoneRecords: {
          ...currentTrack.capstoneRecords,
          [capstoneId]: {
            capstoneId,
            passed,
            rubricChecks,
            submissionNote,
            submittedAt: new Date().toISOString()
          }
        }
      };

      const updatedAll = { ...prev, [trackId]: updatedTrack };
      persistState({ tracksProgress: updatedAll });
      return updatedAll;
    });

    if (passed) {
      addXP(300);
    }
    return passed;
  };

  const submitPlacementDiagnostic = (trackId: string, score: number) => {
    let unlockedTier: 1 | 2 | 3 = 1;
    let message = 'Diagnostic complete! You have started at Foundation Tier 1.';

    if (score >= 90) {
      unlockedTier = 3;
      message = 'Outstanding performance! You placed directly into Tier 3 (Mastery).';
    } else if (score >= 70) {
      unlockedTier = 2;
      message = 'Strong performance! You placed into Tier 2 (Applied).';
    }

    setTracksProgress(prev => {
      const currentTrack = prev[trackId] || {
        trackId,
        diagnosticTaken: false,
        unlockedTier: 1,
        completedModules: [],
        moduleRecords: {},
        capstoneRecords: {}
      };

      const updatedTrack: TrackProgressRecord = {
        ...currentTrack,
        diagnosticTaken: true,
        diagnosticScore: score,
        unlockedTier: Math.max(currentTrack.unlockedTier, unlockedTier) as 1 | 2 | 3
      };

      const updatedAll = { ...prev, [trackId]: updatedTrack };
      persistState({ tracksProgress: updatedAll });
      return updatedAll;
    });

    addXP(150);
    return { unlockedTier, message };
  };

  // Career Studio Actions
  const updateResumeContact = (contact: ResumeContact) => {
    setResumeProfile(prev => {
      const updated = { ...prev, contact };
      persistState({ resumeProfile: updated });
      return updated;
    });
  };

  const updateResumeTargetRole = (targetRole: string) => {
    setResumeProfile(prev => {
      const updated = { ...prev, targetRole };
      persistState({ resumeProfile: updated });
      return updated;
    });
  };

  const updateResumeSummary = (summary: string) => {
    setResumeProfile(prev => {
      const updated = { ...prev, summary };
      persistState({ resumeProfile: updated });
      return updated;
    });
  };

  const updateResumeSkills = (category: keyof ResumeProfile['skills'], skills: string[]) => {
    setResumeProfile(prev => {
      const updated = {
        ...prev,
        skills: {
          ...prev.skills,
          [category]: skills
        }
      };
      persistState({ resumeProfile: updated });
      return updated;
    });
  };

  const addResumeExperience = (exp: ResumeExperience) => {
    setResumeProfile(prev => {
      const updated = { ...prev, experiences: [exp, ...prev.experiences] };
      persistState({ resumeProfile: updated });
      return updated;
    });
  };

  const updateResumeExperience = (id: string, exp: ResumeExperience) => {
    setResumeProfile(prev => {
      const updated = {
        ...prev,
        experiences: prev.experiences.map(e => e.id === id ? exp : e)
      };
      persistState({ resumeProfile: updated });
      return updated;
    });
  };

  const deleteResumeExperience = (id: string) => {
    setResumeProfile(prev => {
      const updated = {
        ...prev,
        experiences: prev.experiences.filter(e => e.id !== id)
      };
      persistState({ resumeProfile: updated });
      return updated;
    });
  };

  const addResumeProject = (proj: ResumeProject) => {
    setResumeProfile(prev => {
      const updated = { ...prev, projects: [proj, ...prev.projects] };
      persistState({ resumeProfile: updated });
      return updated;
    });
  };

  const updateResumeProject = (id: string, proj: ResumeProject) => {
    setResumeProfile(prev => {
      const updated = {
        ...prev,
        projects: prev.projects.map(p => p.id === id ? proj : p)
      };
      persistState({ resumeProfile: updated });
      return updated;
    });
  };

  const deleteResumeProject = (id: string) => {
    setResumeProfile(prev => {
      const updated = {
        ...prev,
        projects: prev.projects.filter(p => p.id !== id)
      };
      persistState({ resumeProfile: updated });
      return updated;
    });
  };

  const addStarStory = (story: StarStory) => {
    setStarStories(prev => {
      const updated = [story, ...prev];
      persistState({ starStories: updated });
      return updated;
    });
    addXP(50);
  };

  const updateStarStory = (id: string, story: StarStory) => {
    setStarStories(prev => {
      const updated = prev.map(s => s.id === id ? story : s);
      persistState({ starStories: updated });
      return updated;
    });
  };

  const deleteStarStory = (id: string) => {
    setStarStories(prev => {
      const updated = prev.filter(s => s.id !== id);
      persistState({ starStories: updated });
      return updated;
    });
  };

  const saveCoverLetter = (draft: CoverLetterDraft) => {
    setCoverLetters(prev => {
      const exists = prev.some(c => c.id === draft.id);
      const updated = exists ? prev.map(c => c.id === draft.id ? draft : c) : [draft, ...prev];
      persistState({ coverLetters: updated });
      return updated;
    });
    addXP(30);
  };

  // Notes, Todos, Books
  const addNote = (noteData: { body: string; tags: string[]; contentRef?: ContentRef }) => {
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      userId: user.id,
      body: noteData.body,
      tags: noteData.tags.map(t => t.startsWith('#') ? t : `#${t}`),
      contentRef: noteData.contentRef,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setNotes(prev => {
      const updated = [newNote, ...prev];
      persistState({ notes: updated });
      return updated;
    });

    addXP(25);
    return newNote;
  };

  const updateNote = (id: string, body: string, tags: string[]) => {
    setNotes(prev => {
      const updated = prev.map(n => n.id === id ? {
        ...n,
        body,
        tags: tags.map(t => t.startsWith('#') ? t : `#${t}`),
        updatedAt: new Date().toISOString()
      } : n);
      persistState({ notes: updated });
      return updated;
    });
  };

  const deleteNote = (id: string) => {
    setNotes(prev => {
      const updated = prev.filter(n => n.id !== id);
      persistState({ notes: updated });
      return updated;
    });
  };

  const addTodo = (todoData: { text: string; dueDate?: string; linkedRef?: LinkedRef }) => {
    const newTodo: TodoItem = {
      id: `todo-${Date.now()}`,
      userId: user.id,
      text: todoData.text,
      done: false,
      dueDate: todoData.dueDate,
      linkedRef: todoData.linkedRef,
      createdAt: new Date().toISOString()
    };

    setTodos(prev => {
      const updated = [newTodo, ...prev];
      persistState({ todos: updated });
      return updated;
    });

    return newTodo;
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, done: !t.done } : t);
      persistState({ todos: updated });
      return updated;
    });
    addXP(15);
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => {
      const updated = prev.filter(t => t.id !== id);
      persistState({ todos: updated });
      return updated;
    });
  };

  const saveBookCheckpoint = (
    bookId: string, 
    chapterNumber: number, 
    checkpointType: 'single' | 'mid' | 'end', 
    score: number, 
    skipped: boolean
  ) => {
    const passed = score >= 60 || skipped;
    const key = `${bookId}-ch${chapterNumber}-${checkpointType}`;

    setLibraryCheckpoints(prev => {
      const updated = {
        ...prev,
        [key]: {
          id: key,
          bookId,
          chapterNumber,
          checkpointType,
          score,
          passed,
          skipped,
          attemptedAt: new Date().toISOString()
        }
      };
      persistState({ libraryCheckpoints: updated });
      return updated;
    });

    if (passed && !skipped) {
      addXP(50);
    }
  };

  const saveBookBookmark = (bookId: string, page: number, totalPages: number) => {
    setLibraryBookmarks(prev => {
      const updated = {
        ...prev,
        [bookId]: { lastPage: page, totalPages, updated: new Date().toISOString() }
      };
      persistState({ libraryBookmarks: updated });
      return updated;
    });
  };

  const setLastActive = (item: {
    type: 'track_module' | 'library_chapter' | 'roadmap_node' | 'course_lesson';
    id: string;
    title: string;
    subtitle?: string;
    trackId?: string;
    bookId?: string;
    courseId?: string;
    lessonId?: string;
  }) => {
    const newItem = { ...item, timestamp: new Date().toISOString() };
    setLastActiveItem(newItem);
    persistState({ lastActiveItem: newItem });
  };

  const resetToDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(INITIAL_USER);
    setTracksProgress(INITIAL_TRACKS_PROGRESS);
    setCourseEnrollments(['SF-04', 'SF-02', 'SF-15', 'CP-01']);
    setCourseProgress(INITIAL_COURSE_PROGRESS);
    setResumeProfile(INITIAL_RESUME_PROFILE);
    setStarStories(INITIAL_STAR_STORIES);
    setNotes(INITIAL_NOTES);
    setTodos(INITIAL_TODOS);
    setBadges(INITIAL_BADGES);
    setCertificates([]);
    setLibraryCheckpoints({});
    setLibraryBookmarks({
      'book-1': { lastPage: 45, totalPages: 600, updated: '2026-09-12' },
      'book-2': { lastPage: 112, totalPages: 560, updated: '2026-09-11' }
    });
    setLastActiveItem({
      type: 'course_lesson',
      id: 'sf-04-l2',
      courseId: 'SF-04',
      lessonId: 'sf-04-l2',
      title: 'Query Execution Plans: Reading EXPLAIN and EXPLAIN ANALYZE',
      subtitle: 'SF-04 • Relational Databases & ANSI SQL',
      timestamp: '2026-09-12T17:30:00Z'
    });
  };

  return (
    <UserStoreContext.Provider value={{
      user,
      tracksProgress,
      courseEnrollments,
      courseProgress,
      notes,
      todos,
      badges,
      certificates,
      libraryCheckpoints,
      libraryBookmarks,
      lastActiveItem,
      resumeProfile,
      bulletImprovements,
      coverLetters,
      starStories,
      enrollCourse,
      completeLesson,
      passCourseQuiz,
      submitCoursePlacementDiagnostic,
      submitCourseCapstone,
      getPathProgress,
      completeModule,
      submitCapstone,
      submitPlacementDiagnostic,
      updateResumeContact,
      updateResumeTargetRole,
      updateResumeSummary,
      updateResumeSkills,
      addResumeExperience,
      updateResumeExperience,
      deleteResumeExperience,
      addResumeProject,
      updateResumeProject,
      deleteResumeProject,
      addStarStory,
      updateStarStory,
      deleteStarStory,
      saveCoverLetter,
      addNote,
      updateNote,
      deleteNote,
      addTodo,
      toggleTodo,
      deleteTodo,
      saveBookCheckpoint,
      saveBookBookmark,
      addXP,
      setLastActive,
      resetToDemo
    }}>
      {children}
    </UserStoreContext.Provider>
  );
};

export const useUserStore = () => {
  const context = useContext(UserStoreContext);
  if (!context) {
    throw new Error('useUserStore must be used within a UserStoreProvider');
  }
  return context;
};
