// DataForge Career Studio & ResumeCraft Types

export interface ResumeContact {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

export interface ResumeExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
  techStack: string[];
}

export interface ResumeProject {
  id: string;
  title: string;
  role: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  bullets: string[];
  techStack: string[];
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  gpaOrScore?: string;
}

export interface ResumeProfile {
  contact: ResumeContact;
  targetRole: string;
  summary: string;
  skills: {
    languages: string[];
    frameworksAndTools: string[];
    databasesAndWarehouses: string[];
    cloudAndDevOps: string[];
    methodologies: string[];
  };
  experiences: ResumeExperience[];
  projects: ResumeProject[];
  education: ResumeEducation[];
  certifications: string[];
}

export interface ATSCheckItem {
  id: string;
  category: 'formatting' | 'keywords' | 'metrics' | 'sections' | 'file_readability';
  label: string;
  status: 'pass' | 'warning' | 'fail';
  explanation: string;
  recommendation: string;
}

export interface ATSDiagnosticReport {
  overallScore: number; // 0-100
  checks: ATSCheckItem[];
  wordCount: number;
  actionVerbCount: number;
  metricCount: number;
  readabilityGrade: string;
}

export interface SuggestedCourseMatch {
  courseId: string;
  courseTitle: string;
  skill: string;
  reason: string;
}

export interface JobMatchResult {
  matchScore: number; // 0-100
  matchedSkills: string[];
  missingSkills: string[];
  topKeywordsInJob: { keyword: string; count: number; presentInResume: boolean }[];
  recommendations: string[];
  suggestedCourses: SuggestedCourseMatch[];
}

export interface BulletImprovement {
  id: string;
  original: string;
  improved: string;
  formula: 'XYZ' | 'CAR' | 'STAR';
  actionVerb: string;
  metricAdded: string;
  context: string;
}

export interface CoverLetterDraft {
  id: string;
  targetCompany: string;
  targetRole: string;
  tone: 'technical' | 'direct' | 'collaborative';
  opening: string;
  technicalFit: string;
  closing: string;
  fullMarkdown: string;
  updatedAt: string;
}

export interface StarStory {
  id: string;
  title: string;
  targetQuestion: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  metricsAchieved: string;
  tags: string[];
}

export interface PortfolioProjectPack {
  id: string;
  title: string;
  targetRole: string;
  architectureType: string;
  problemStatement: string;
  techStack: string[];
  starterRepoStructure: string[];
  readmeTemplate: string;
  sampleDatasetNotes: string;
}
