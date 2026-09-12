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
