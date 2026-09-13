// DataForge Learning Architecture Types & Domain Contracts
// Synthesizes public academic curriculum signals from IIT Madras, IIT Bombay, NITK Surathkal, NPTEL, and industry standards.

export type CourseKind = 'skill' | 'path';

export type SkillLevel = 
  | 'Beginner' 
  | 'Beginner to Intermediate' 
  | 'Intermediate' 
  | 'Intermediate to Advanced' 
  | 'Advanced'
  | 'Beginner to Advanced';

export type ExerciseType = 
  | 'sql' 
  | 'python' 
  | 'pyspark' 
  | 'decision' 
  | 'debugging' 
  | 'memo' 
  | 'quiz';

export interface ResearchSource {
  researchSourceTitle: string;
  researchInstitution: string;
  researchSourceType: 'university_curriculum' | 'nptel_syllabus' | 'vendor_doc' | 'standard_rfc' | 'research_paper';
  sourceUrl: string;
  lastReviewed: string;
  notes: string;
  versionOrAcademicYear?: string;
}

export interface ConceptBlock {
  id: string;
  title: string;
  content: string; // Markdown explanation (2-5 min reading chunk)
  codeSnippet?: string;
  seniorTip?: string;
  antiPattern?: string;
  diagramSvg?: string;
}

export interface InlineExercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  starterCode?: string;
  solutionCode?: string;
  expectedOutputSnippet?: string;
  testCases?: { input: string; expected: string }[];
  hints: string[];
}

export interface InlineCheck {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  estimatedMinutes: number;
  objective: string;
  conceptBlocks: ConceptBlock[];
  exercise?: InlineExercise;
  inlineChecks: InlineCheck[];
  notesEnabled?: boolean;
}

export interface ModuleQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ModuleQuiz {
  id: string;
  title: string;
  passingScorePercent: number; // 70% threshold
  questions: ModuleQuizQuestion[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  objectives: string[];
  lessons: CourseLesson[];
  quiz: ModuleQuiz;
  capstoneContribution?: string;
}

export interface PlacementDiagnosticQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  targetModuleId?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface PlacementDiagnostic {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  questions: PlacementDiagnosticQuestion[];
  qualifySkipModuleId?: string;
}

export interface CourseCapstone {
  id: string;
  title: string;
  problemStatement: string;
  businessScenario: string;
  deliverables: string[];
  rubricItems: {
    id: string;
    criterion: string;
    weightPercent: number;
    guidance: string;
  }[];
  portfolioOutput: string;
}

export interface SkillCourse {
  id: string; // e.g. "SF-01"
  slug: string;
  title: string;
  subtitle: string;
  outcomeStatement: string;
  description: string;
  level: SkillLevel;
  durationHours: number;
  skills: string[];
  roleTags: string[];
  toolTags: string[];
  prerequisites: string[];
  learningObjectives: string[];
  modules: CourseModule[];
  capstone: CourseCapstone;
  diagnostic: PlacementDiagnostic;
  status: 'ready' | 'preview' | 'in_authoring';
  featured?: boolean;
  researchSources: ResearchSource[];
  lastReviewed: string;
}

export interface CareerPath {
  id: string; // e.g. "CP-01"
  slug: string;
  title: string;
  targetRole: string;
  subtitle: string;
  outcomeStatement: string;
  description: string;
  level: SkillLevel;
  durationHoursRange: string;
  orderedCourseIds: string[]; // References SkillCourse.id
  milestones: {
    title: string;
    description: string;
    requiredCourseIds: string[];
  }[];
  capstone: CourseCapstone;
  portfolioDeliverables: string[];
  interviewPrepChecklist: string[];
  featured?: boolean;
  lastReviewed: string;
}

export interface CourseProgressRecord {
  courseId: string;
  enrolledAt: string;
  completedLessonIds: string[];
  completedModuleIds: string[];
  passedQuizIds: string[];
  diagnosticResult?: {
    taken: boolean;
    score: number;
    recommendedModuleId: string;
    skippedModuleIds: string[];
  };
  placementSkippedModuleIds: string[];
  capstoneStatus: 'not_started' | 'submitted' | 'passed';
  percentComplete: number;
  lastActivityAt: string;
}
