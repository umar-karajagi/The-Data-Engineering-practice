// DataForge Core TypeScript Types and Interfaces

export type ThemeMode = 'dark' | 'light' | 'focus';

export type TrackType = 'sql' | 'python' | 'pyspark' | 'warehousing' | 'architecture' | 'dsa' | 'azure' | 'behavioral';

export type DifficultyLevel = 'Beginner' | 'Easy' | 'Medium' | 'Hard' | 'Advanced' | 'Staff DE';

export type CheckpointStatus = 'locked' | 'unlocked' | 'completed';

export interface BookReference {
  id: string;
  title: string;
  author: string;
  coverColor: string;
  track: TrackType;
  coreConcepts: string[];
  description: string;
  keyTakeaways: string[];
  chapters: {
    id: string;
    number: number;
    title: string;
    readingTime: string;
    summary: string;
    content: string;
    seniorTip?: string;
    antiPattern?: string;
    linkedPracticeId?: string;
  }[];
  isCustom?: boolean;
  uploadedAt?: string;
  fileSize?: string;
  fileSizeBytes?: number;
  fileSizeFormatted?: string;
  formatType?: 'notebook' | 'pdf' | 'markdown' | 'book' | 'text';
  pageCount?: number;
  originalFileName?: string;
  isNotebook?: boolean;
  notebookCells?: NotebookCell[];
  totalCells?: number;
  codeCellsCount?: number;
  markdownCellsCount?: number;
  kernelLanguage?: string;
  pdfUrl?: string;
  quizQuestions?: BookQuizQuestion[];
  conceptCards?: BookConceptCard[];
}

export interface BookQuizQuestion {
  id: string;
  chapterNumber: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceChapter: string;
}

export interface BookConceptCard {
  id: string;
  title: string;
  ruleOfThumb: string;
  explanation: string;
  antiPattern?: string;
  category: string;
}

export interface NotebookOutput {
  outputType: 'stream' | 'execute_result' | 'display_data' | 'error';
  text?: string;
  html?: string;
  imagePngBase64?: string;
  imageSvg?: string;
  ename?: string;
  evalue?: string;
  traceback?: string[];
}

export interface NotebookCell {
  id: string;
  cellType: 'markdown' | 'code';
  source: string;
  executionCount?: number | null;
  outputs?: NotebookOutput[];
}

export interface TestCase {
  id?: number;
  name?: string;
  description?: string;
  check?: string;
  input?: any;
  expected?: any;
}

export interface Question {
  id: string;
  title: string;
  track: TrackType;
  source_book: string; // References one of the 13 books
  difficulty: DifficultyLevel;
  category: string;
  company?: string;
  xp: number;
  prompt: string;
  scenario?: string;
  solution_design?: string;
  solution_approach?: string;
  requirements?: {
    functional: string[];
    non_functional: string[];
  };
  evaluation_criteria?: string[];
  validation_checklist?: string[];
  starter_code?: string;
  init_ddl?: string;
  solution_sql?: string;
  solution_code?: string;
  test_cases?: TestCase[];
  expected_output?: any;
  hints: {
    tier: 1 | 2 | 3;
    title: string;
    body: string;
  }[];
  interview_edge_case: string;
  optimization_guide?: {
    timeComplexity: string;
    spaceComplexity: string;
    explainPlanNotes: string;
    productionPitfall: string;
  };
}

export interface TopicItem {
  id: string;
  track: TrackType;
  title: string;
  category: string;
  difficulty: DifficultyLevel;
  priority: 'High' | 'Medium' | 'Low';
  confidence: 1 | 2 | 3 | 4 | 5;
  status: 'Not Started' | 'In Progress' | 'Done' | 'Skip';
  source_book: string;
  summary: string;
  keyInterviewQuestions: string[];
  notes?: string;
}

export interface ProjectCaseStudy {
  id: string;
  title: string;
  subtitle: string;
  track: TrackType;
  difficulty: DifficultyLevel;
  technologies: string[];
  architectureDiagramUrl?: string;
  businessScenario: string;
  pipelineArchitecture: string[];
  githubBlueprint: string;
  keyLessons: string[];
}

export interface ExecutionResult {
  success: boolean;
  columns?: string[];
  rows?: Record<string, any>[];
  rowCount?: number;
  executionTimeMs?: number;
  error?: string;
  testValidation?: {
    passed: boolean;
    reason?: string;
  };
}

export interface UserProgress {
  xp: number;
  streak: number;
  level: number;
  levelTitle: string;
  theme: ThemeMode;
  currentCheckpointIndex: number; // For character avatar walking
  completedMilestones: string[];
  bookmarkedMilestones: string[];
  solvedQuestions: Record<string, string[]>; // track -> questionIds
  bookmarkedQuestions: string[];
  completedChapters: string[];
  topicTrackerStatus: Record<string, {
    status: 'Not Started' | 'In Progress' | 'Done' | 'Skip';
    confidence: number;
    notes?: string;
  }>;
  activityLog: Record<string, number>; // YYYY-MM-DD -> count
  badges: string[];
}

// ==========================================
// UNIFIED DATA ARCHITECTURE & PROGRESS MODEL
// ==========================================

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  email: string;
  joinedDate: string;
  streak: number;
  streakDays?: number;
  lastActiveDate: string;
  totalXp: number;
  xp?: number;
}

export interface ContentRef {
  type: 'track_module' | 'library_chapter' | 'roadmap_node' | 'book_page' | 'track_capstone' | 'general';
  id: string;
  title: string;
  label?: string;
  trackId?: string;
  bookId?: string;
  chapterNumber?: number;
  nodeId?: string;
  moduleId?: string;
}

export interface LinkedRef {
  type: 'track' | 'module' | 'book' | 'roadmap_node' | 'url';
  id: string;
  title: string;
  label?: string;
  trackId?: string;
  bookId?: string;
  targetId?: string;
  url?: string;
}

export interface NoteItem {
  id: string;
  userId: string;
  body: string;
  tags: string[];
  contentRef?: ContentRef;
  createdAt: string;
  updatedAt: string;
}

export interface TodoItem {
  id: string;
  userId: string;
  text: string;
  done: boolean;
  completed?: boolean;
  dueDate?: string; // YYYY-MM-DD
  urgency?: 'today' | 'overdue' | 'upcoming';
  linkedRef?: LinkedRef;
  createdAt: string;
}

export interface CertificateItem {
  id: string; // e.g. DF-CERT-SQL-849201
  userId: string;
  userName: string;
  trackId: string;
  trackTitle: string;
  issuedAt: string;
  averageScore: number;
  verificationUrl?: string;
}

export interface BadgeItem {
  id: string;
  name: string;
  title?: string;
  description: string;
  iconName: string;
  category: 'tracks' | 'vault' | 'streak' | 'general';
  earned: boolean;
  unlocked?: boolean;
  earnedAt?: string;
  progressCurrent?: number;
  progressTarget?: number;
}

export interface TrackModuleQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TrackModuleTest {
  id: string;
  title: string;
  description: string;
  passingScore: number; // default 70
  questions: TrackModuleQuestion[];
}

export interface TrackModule {
  id: string;
  tierId: string;
  trackId: string;
  title: string;
  order: number;
  durationMinutes: number;
  learnContent: {
    overview: string;
    keyConcepts: {
      title: string;
      description: string;
      codeSnippet?: string;
    }[];
    seniorTip: string;
    antiPattern: string;
  };
  test: TrackModuleTest;
}

export interface TierCapstone {
  id: string;
  tierId: string;
  trackId: string;
  title: string;
  description: string;
  businessScenario: string;
  deliverables: string[];
  rubricItems: {
    id: string;
    criterion: string;
    weightPercent: number;
    guidance: string;
  }[];
}

export interface TrackTier {
  id: string;
  trackId: string;
  tierNumber: 1 | 2 | 3;
  name: 'Foundation' | 'Applied' | 'Mastery';
  description: string;
  modules: TrackModule[];
  capstone: TierCapstone;
}

export interface TrackDefinition {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  iconName: string;
  accentColor: string;
  tiers: TrackTier[];
  placementDiagnostic: {
    title: string;
    description: string;
    questions: TrackModuleQuestion[];
    qualifyAppliedScore: number; // e.g. 70
    qualifyMasteryScore: number; // e.g. 90
  };
}

export interface ModuleProgressRecord {
  moduleId: string;
  learned: boolean;
  testPassed: boolean;
  score: number;
  attempts: number;
  lastAttemptedAt?: string;
}

export interface CapstoneProgressRecord {
  capstoneId: string;
  passed: boolean;
  rubricChecks: Record<string, boolean>;
  submissionNote?: string;
  submittedAt?: string;
}

export interface TrackProgressRecord {
  trackId: string;
  diagnosticTaken: boolean;
  diagnosticScore?: number;
  unlockedTier: 1 | 2 | 3; // 1 = Foundation, 2 = Applied, 3 = Mastery
  currentTier?: 1 | 2 | 3;
  completedModules: string[];
  completedCapstones?: string[];
  moduleRecords: Record<string, ModuleProgressRecord>;
  capstoneRecords: Record<string, CapstoneProgressRecord>;
}

export interface LibraryCheckpointAttempt {
  id: string;
  bookId: string;
  chapterNumber: number;
  checkpointType: 'single' | 'mid' | 'end';
  score: number;
  passed: boolean;
  skipped: boolean;
  attemptedAt: string;
}

export * from './learning';
export * from './career';

