'use client';

import React, { useState } from 'react';
import { 
  getSkillCourseById, 
  getCareerPathById, 
  getCareerPathsReferencingCourse,
  getCoursesForCareerPath 
} from '@/content/courses/catalog';
import { SkillCourse, CareerPath, CourseModule } from '@/types';
import { useUserStore } from '@/lib/userStore';
import { ModuleQuizModal } from '@/components/learning/ModuleQuizModal';
import { CapstoneEvaluationModal } from '@/components/learning/CapstoneEvaluationModal';
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  BookOpen, 
  FileText, 
  Code2, 
  AlertCircle, 
  GraduationCap, 
  Check, 
  Layers, 
  ExternalLink,
  Target,
  FileCheck
} from 'lucide-react';

interface CourseDetailViewProps {
  productId: string; // SF-* or CP-*
  onBack: () => void;
  onStartLesson: (courseId: string, lessonId: string) => void;
  onOpenDiagnostic: (courseId: string) => void;
  onSelectCourse?: (courseId: string) => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  productId,
  onBack,
  onStartLesson,
  onOpenDiagnostic,
  onSelectCourse
}) => {
  const { 
    courseEnrollments, 
    courseProgress, 
    enrollCourse, 
    user,
    getPathProgress 
  } = useUserStore();

  const isPath = productId.startsWith('CP-');
  const course = !isPath ? getSkillCourseById(productId) : undefined;
  const path = isPath ? getCareerPathById(productId) : undefined;

  const [activeQuizModule, setActiveQuizModule] = useState<CourseModule | null>(null);
  const [isCapstoneModalOpen, setIsCapstoneModalOpen] = useState<boolean>(false);

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'sf-04-m1': true,
    'sf-02-m1': true,
    'sf-15-m1': true
  });

  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!course && !path) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] p-12 text-center text-[var(--text-primary)]">
        <p className="text-xl font-mono">Course or Path {productId} not found.</p>
        <button 
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-[#C8FF4A] text-black font-mono font-bold rounded-lg"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------
  // SKILL COURSE DETAIL VIEW (9 Canonical Sections)
  // -------------------------------------------------------------
  if (course) {
    const isEnrolled = courseEnrollments.includes(course.id);
    const progress = courseProgress[course.id];
    const percent = progress?.percentComplete || 0;
    const isPassed = progress?.capstoneStatus === 'passed';
    const referencingPaths = getCareerPathsReferencingCourse(course.id);
    const firstLessonId = course.modules[0]?.lessons[0]?.id;

    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans pb-24">
        {/* Back Navigation Bar */}
        <div className="border-b border-[var(--border-color)] bg-[var(--card-bg)] px-6 py-4 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] hover:text-[#C8FF4A] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>CATALOG INDEX</span>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[var(--text-secondary)]">
                SPEC: <strong className="text-[var(--text-primary)]">{course.id}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono">
                100% Free Open Access
              </span>
            </div>
          </div>
        </div>

        {/* 1. Header & Specification Plate */}
        <div className="relative border-b border-[var(--border-color)] bg-[var(--card-bg)] px-6 py-12 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded bg-[#101415] border border-zinc-700 text-[#C8FF4A] font-mono text-sm font-bold">
                {course.id}
              </span>
              <span className="px-2.5 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-secondary)]">
                {course.level}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero Monetization • Open Learning
              </span>
            </div>

            <h1 className="text-2xl lg:text-4xl font-black font-mono tracking-tight text-[var(--text-primary)] max-w-4xl">
              {course.title}
            </h1>
            <p className="mt-3 text-base lg:text-lg text-[var(--text-secondary)] max-w-3xl leading-relaxed">
              {course.subtitle}
            </p>

            {/* Outcome Callout Box */}
            <div className="mt-6 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] max-w-3xl flex items-start gap-3">
              <Target className="w-5 h-5 text-[#C8FF4A] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-mono text-[#C8FF4A] font-semibold uppercase tracking-wider block">
                  Target Engineering Competency
                </span>
                <p className="text-sm text-[var(--text-primary)] mt-0.5">
                  {course.outcomeStatement}
                </p>
              </div>
            </div>

            {/* Action Row */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {firstLessonId && (
                <button
                  onClick={() => {
                    enrollCourse(course.id);
                    onStartLesson(course.id, firstLessonId);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono font-bold text-sm bg-[#C8FF4A] text-[#101415] hover:bg-[#b8f53a] transition-all shadow-md"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{percent > 0 ? `Continue Lesson (${percent}%)` : 'Start Learning Free'}</span>
                </button>
              )}

              {course.diagnostic && (
                <button
                  onClick={() => onOpenDiagnostic(course.id)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-mono font-semibold text-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[#56D8FF] text-[var(--text-primary)] transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#56D8FF]" />
                  <span>Take Placement Diagnostic (Skip Modules)</span>
                </button>
              )}

              <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] ml-auto">
                <Clock className="w-4 h-4" />
                <span>{course.durationHours} Hours Dedicated Practice</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid (9 Canonical Sections) */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left 2 Columns: Curriculum, Lessons, Capstone */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* 2. What You Will Learn */}
            <section className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6">
              <h2 className="text-lg font-mono font-bold text-[var(--text-primary)] flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-[#C8FF4A]" />
                WHAT YOU WILL LEARN
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.learningObjectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF4A] mt-2 shrink-0" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Interactive Curriculum Preview Accordion */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-mono font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#56D8FF]" />
                  COURSE CURRICULUM ({course.modules.length} Modules)
                </h2>
                <span className="text-xs font-mono text-[var(--text-secondary)]">
                  70% Threshold Required on Module Quizzes
                </span>
              </div>

              <div className="space-y-3">
                {course.modules.map((module, idx) => {
                  const isExpanded = Boolean(expandedModules[module.id]);
                  const isModCompleted = progress?.completedModuleIds?.includes(module.id);
                  const isSkipped = progress?.placementSkippedModuleIds?.includes(module.id);

                  return (
                    <div 
                      key={module.id}
                      className="border border-[var(--border-color)] bg-[var(--card-bg)] rounded-xl overflow-hidden transition-all"
                    >
                      {/* Accordion Module Header */}
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--bg-secondary)]/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <span className="px-2 py-1 rounded bg-[var(--bg-secondary)] text-xs font-mono text-[var(--text-secondary)] border border-[var(--border-color)]">
                            0{idx + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-mono font-bold text-[var(--text-primary)]">
                                {module.title}
                              </h3>
                              {isModCompleted && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#C8FF4A] px-2 py-0.5 rounded bg-[#C8FF4A]/10 border border-[#C8FF4A]/30">
                                  <Check className="w-3 h-3" /> Passed
                                </span>
                              )}
                              {isSkipped && (
                                <span className="text-[10px] font-mono text-[#56D8FF] px-2 py-0.5 rounded bg-[#56D8FF]/10 border border-[#56D8FF]/30">
                                  Placement Skipped
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">
                              {module.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 ml-4">
                          <span className="text-xs font-mono text-[var(--text-secondary)] hidden sm:inline">
                            {module.estimatedMinutes} mins
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[var(--text-secondary)]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
                          )}
                        </div>
                      </button>

                      {/* Accordion Lessons Content */}
                      {isExpanded && (
                        <div className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/30 p-4 space-y-3">
                          {module.lessons.map(lesson => {
                            const isLessonDone = progress?.completedLessonIds?.includes(lesson.id);

                            return (
                              <div 
                                key={lesson.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[#C8FF4A]/40 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${
                                    isLessonDone ? 'bg-[#C8FF4A] text-black' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                                  }`}>
                                    {isLessonDone ? <Check className="w-3.5 h-3.5" /> : <BookOpen className="w-3 h-3" />}
                                  </div>
                                  <div>
                                    <div className="text-xs font-mono font-medium text-[var(--text-primary)]">
                                      {lesson.title}
                                    </div>
                                    <div className="text-[11px] text-[var(--text-secondary)] mt-0.5 flex items-center gap-2">
                                      <span>{lesson.estimatedMinutes} min</span>
                                      <span>•</span>
                                      <span className="text-[#C8FF4A]">Micro-loop: Read $\rightarrow$ Practice $\rightarrow$ Check</span>
                                    </div>
                                  </div>
                                </div>

                                <button
                                  onClick={() => {
                                    enrollCourse(course.id);
                                    onStartLesson(course.id, lesson.id);
                                  }}
                                  className="px-3 py-1 rounded text-xs font-mono font-semibold bg-[var(--bg-secondary)] hover:bg-[#C8FF4A] hover:text-black border border-[var(--border-color)] transition-all"
                                >
                                  {isLessonDone ? 'Review' : 'Play Lesson'}
                                </button>
                              </div>
                            );
                          })}

                          {/* Module Quiz Card */}
                          <div className="p-3 rounded-lg bg-[var(--card-bg)] border border-amber-500/20 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-xs font-mono">
                            <div className="flex items-center gap-2 text-amber-400">
                              <FileCheck className="w-4 h-4 shrink-0" />
                              <span>Module Quiz: {module.quiz.questions.length} Questions (Passing: {module.quiz.passingScorePercent}%)</span>
                              {progress?.passedQuizIds?.includes(module.id) && (
                                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                                  PASSED
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                enrollCourse(course.id);
                                setActiveQuizModule(module);
                              }}
                              className="px-3 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all font-bold text-xs"
                            >
                              {progress?.passedQuizIds?.includes(module.id) ? 'Retake Quiz' : 'Take Module Quiz'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 4. Production Capstone Preview */}
            <section className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono text-xs font-bold uppercase">
                  Production Capstone Specification
                </span>
                <span className="text-xs font-mono text-[var(--text-secondary)]">
                  Portfolio-Ready Deliverable
                </span>
              </div>

              <h2 className="text-xl font-mono font-bold text-[var(--text-primary)]">
                {course.capstone.title}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                {course.capstone.problemStatement}
              </p>

              <div className="mt-4 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                <span className="text-xs font-mono text-zinc-400 font-semibold block mb-1">
                  BUSINESS SCENARIO
                </span>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {course.capstone.businessScenario}
                </p>
              </div>

              {/* Rubric Table */}
              <div className="mt-5 space-y-2">
                <span className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider block">
                  Evaluation Rubric ({course.capstone.rubricItems.length} Criteria)
                </span>
                <div className="space-y-1.5">
                  {course.capstone.rubricItems.map(item => (
                    <div 
                      key={item.id}
                      className="p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-start justify-between gap-4 text-xs font-mono"
                    >
                      <div>
                        <span className="font-bold text-[var(--text-primary)]">{item.criterion}</span>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{item.guidance}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#C8FF4A]/10 text-[#C8FF4A] shrink-0 font-bold">
                        {item.weightPercent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <span className="text-zinc-500">Output: {course.capstone.portfolioOutput}</span>
                <div className="flex items-center gap-3">
                  {isPassed ? (
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Capstone Verified
                      </span>
                      <button
                        onClick={() => setIsCapstoneModalOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-zinc-300 hover:text-white transition-all font-semibold"
                      >
                        Review Submission
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        enrollCourse(course.id);
                        setIsCapstoneModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#C8FF4A] hover:bg-[#b8f53a] text-[#101415] font-bold font-mono transition-all flex items-center gap-2 shadow-md shadow-[#C8FF4A]/10"
                    >
                      <Award className="w-4 h-4" />
                      <span>Submit Capstone Evaluation</span>
                    </button>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Metadata, Prerequisites, Certificate, Research Signals */}
          <div className="space-y-8">
            
            {/* 5. Who This is For & Prerequisites */}
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Audience & Target Roles
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {course.roleTags.map(r => (
                  <span key={r} className="px-2 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-secondary)]">
                    {r}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-[var(--border-color)]">
                <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Prerequisites
                </h4>
                <ul className="space-y-1 text-xs text-[var(--text-secondary)]">
                  {course.prerequisites.map((p, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#C8FF4A]">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[var(--border-color)]">
                <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Tools & Technologies
                </h4>
                <div className="flex flex-wrap gap-1">
                  {course.toolTags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 6. Foundry Certificate of Mastery Preview */}
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
                <Award className="w-4 h-4" />
                <span>FOUNDRY CERTIFICATE OF MASTERY</span>
              </div>
              <h3 className="text-base font-mono font-bold text-[var(--text-primary)]">
                Cryptographically Verifiable
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                Earned strictly by passing all module quizzes ($\ge 70\%$) and passing the Capstone rubric evaluation. 100% free with public verification link.
              </p>

              {/* High-Fidelity Mock Certificate Card */}
              <div className="mt-4 p-4 rounded-xl bg-[#101415] border border-zinc-700 text-center relative shadow-inner">
                <div className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                  DATAFORGE FOUNDRY SPECIFICATION
                </div>
                <div className="text-sm font-mono font-bold text-[#C8FF4A] mt-2">
                  Certificate of Technical Mastery
                </div>
                <div className="text-xs text-zinc-300 mt-1 font-serif italic">
                  Issued to {user.name}
                </div>
                <div className="text-[11px] font-mono text-zinc-400 mt-2">
                  {course.title}
                </div>
                <div className="mt-3 pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>ID: DF-CERT-{course.id}-XXXX</span>
                  <span className="text-emerald-400">UNPAID • MERIT-ONLY</span>
                </div>
              </div>
            </div>

            {/* 7. Curriculum Research Sources */}
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6">
              <div className="flex items-center gap-2 text-xs font-mono text-[#56D8FF] mb-2">
                <GraduationCap className="w-4 h-4" />
                <span>CURRICULUM RESEARCH SIGNALS</span>
              </div>
              <h3 className="text-sm font-mono font-bold text-[var(--text-primary)]">
                Academic & Open Standard Citations
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Synthesized from public university curricula and standards:
              </p>

              <div className="mt-4 space-y-2.5">
                {course.researchSources.map((source, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs">
                    <div className="font-mono font-semibold text-[var(--text-primary)]">
                      {source.researchInstitution}: {source.researchSourceTitle}
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                      {source.notes}
                    </p>
                    <a 
                      href={source.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-mono text-[#56D8FF] hover:underline mt-1.5"
                    >
                      <span>View Public Syllabus Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. Career Paths Referencing This Course */}
            {referencingPaths.length > 0 && (
              <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6">
                <span className="text-xs font-mono text-[#C8FF4A] uppercase tracking-wider block mb-2">
                  Part of {referencingPaths.length} Career Path{referencingPaths.length > 1 ? 's' : ''}
                </span>
                <p className="text-xs text-[var(--text-secondary)] mb-3">
                  Completing this course satisfies requirements across these paths:
                </p>
                <div className="space-y-2">
                  {referencingPaths.map(rp => (
                    <button
                      key={rp.id}
                      onClick={() => onSelectCourse && onSelectCourse(rp.id)}
                      className="w-full text-left p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[#C8FF4A]/50 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-[var(--text-primary)]">
                        <span>{rp.title}</span>
                        <span className="text-zinc-500">{rp.id}</span>
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                        {rp.targetRole}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gated Module Assessment Modal */}
        {activeQuizModule && (
          <ModuleQuizModal
            courseId={course.id}
            moduleId={activeQuizModule.id}
            quiz={activeQuizModule.quiz}
            onClose={() => setActiveQuizModule(null)}
            onQuizPassed={() => {
              // Re-evaluates via user store reactive update
            }}
          />
        )}

        {/* Production Capstone Evaluation Rubric Modal */}
        {isCapstoneModalOpen && (
          <CapstoneEvaluationModal
            courseId={course.id}
            capstone={course.capstone}
            onClose={() => setIsCapstoneModalOpen(false)}
            onCapstonePassed={() => {
              // Re-evaluates via user store reactive update
            }}
          />
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // CAREER PATH DETAIL VIEW
  // -------------------------------------------------------------
  if (path) {
    const coursesInPath = getCoursesForCareerPath(path.id);
    const progress = getPathProgress(path.id);
    const isEnrolled = courseEnrollments.includes(path.id);

    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans pb-24">
        {/* Back Navigation Bar */}
        <div className="border-b border-[var(--border-color)] bg-[var(--card-bg)] px-6 py-4 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] hover:text-[#C8FF4A] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>CATALOG INDEX</span>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[var(--text-secondary)]">
                CAREER PATH: <strong className="text-[var(--text-primary)]">{path.id}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono">
                100% Free Complete Track
              </span>
            </div>
          </div>
        </div>

        {/* Path Header */}
        <div className="relative border-b border-[var(--border-color)] bg-[var(--card-bg)] px-6 py-12 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded bg-[#101415] border border-zinc-700 text-[#C8FF4A] font-mono text-sm font-bold">
                {path.id}
              </span>
              <span className="px-2.5 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-secondary)]">
                Target: {path.targetRole}
              </span>
              <span className="text-xs font-mono text-[var(--text-secondary)] px-2 py-0.5 rounded bg-[var(--bg-secondary)]">
                {path.durationHoursRange}
              </span>
            </div>

            <h1 className="text-3xl lg:text-5xl font-black font-mono tracking-tight text-[var(--text-primary)] max-w-4xl">
              {path.title}
            </h1>
            <p className="mt-3 text-base lg:text-lg text-[var(--text-secondary)] max-w-3xl leading-relaxed">
              {path.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  enrollCourse(path.id);
                  if (coursesInPath[0]?.modules[0]?.lessons[0]?.id) {
                    onStartLesson(coursesInPath[0].id, coursesInPath[0].modules[0].lessons[0].id);
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono font-bold text-sm bg-[#C8FF4A] text-[#101415] hover:bg-[#b8f53a] transition-all shadow-md"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isEnrolled ? 'Continue Career Path' : 'Enroll in Full Career Path (Free)'}</span>
              </button>

              <div className="flex items-center gap-3 ml-auto text-xs font-mono">
                <span className="text-zinc-400">
                  {progress.completedCourses} of {progress.totalCourses} Courses Completed
                </span>
                <div className="w-24 bg-[var(--bg-secondary)] rounded-full h-2.5 overflow-hidden border border-[var(--border-color)]">
                  <div 
                    className="bg-[#C8FF4A] h-full rounded-full transition-all"
                    style={{ width: `${progress.percentComplete}%` }}
                  />
                </div>
                <span className="text-[#C8FF4A] font-bold">{progress.percentComplete}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Path Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Milestones & Ordered Courses */}
            <section className="space-y-6">
              <h2 className="text-lg font-mono font-bold text-[var(--text-primary)]">
                CURRICULUM MILESTONES & SKILL COURSES
              </h2>

              <div className="space-y-8">
                {path.milestones.map((ms, idx) => (
                  <div key={idx} className="border border-[var(--border-color)] bg-[var(--card-bg)] rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-[#C8FF4A] font-bold">
                        PHASE 0{idx + 1}
                      </span>
                    </div>
                    <h3 className="text-base font-mono font-bold text-[var(--text-primary)]">
                      {ms.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      {ms.description}
                    </p>

                    <div className="mt-4 space-y-2">
                      {ms.requiredCourseIds.map(cId => {
                        const courseItem = getSkillCourseById(cId);
                        const cProg = courseProgress[cId];
                        const isDone = cProg?.capstoneStatus === 'passed' || (cProg?.percentComplete || 0) >= 100;

                        if (!courseItem) return null;

                        return (
                          <div 
                            key={cId}
                            onClick={() => onSelectCourse && onSelectCourse(cId)}
                            className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[#56D8FF]/50 transition-all flex items-center justify-between cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <span className="px-2 py-0.5 rounded bg-[#101415] border border-zinc-700 text-[#56D8FF] font-mono text-xs font-bold">
                                {courseItem.id}
                              </span>
                              <div>
                                <h4 className="text-xs font-mono font-bold text-[var(--text-primary)]">
                                  {courseItem.title}
                                </h4>
                                <span className="text-[11px] text-[var(--text-secondary)]">
                                  {courseItem.durationHours} hrs • {courseItem.level}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {isDone ? (
                                <span className="inline-flex items-center gap-1 text-xs font-mono text-[#C8FF4A]">
                                  <CheckCircle2 className="w-4 h-4" /> Passed
                                </span>
                              ) : (
                                <span className="text-xs font-mono text-zinc-500">
                                  {cProg?.percentComplete ? `${cProg.percentComplete}%` : 'Not Started'}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Path Capstone */}
            <section className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6">
              <span className="text-xs font-mono text-purple-400 font-bold uppercase">
                End-of-Path Architecture Capstone
              </span>
              <h2 className="text-xl font-mono font-bold text-[var(--text-primary)] mt-1">
                {path.capstone.title}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-2">
                {path.capstone.problemStatement}
              </p>
              <div className="mt-4 space-y-2">
                <span className="text-xs font-mono text-zinc-400 uppercase">Deliverables:</span>
                <ul className="space-y-1 text-xs text-[var(--text-secondary)]">
                  {path.capstone.deliverables.map((d, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#C8FF4A] shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          {/* Right Column: Interview Prep & Deliverables */}
          <div className="space-y-8">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C8FF4A]" />
                Portfolio Deliverables
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Projects ready for your GitHub portfolio upon path completion:
              </p>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                {path.portfolioDeliverables.map((item, i) => (
                  <li key={i} className="p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] font-mono">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#56D8FF]" />
                Technical Interview Drill List
              </h3>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                {path.interviewPrepChecklist.map((q, i) => (
                  <li key={i} className="p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    <span className="text-[#56D8FF] font-mono font-bold block mb-1">Q0{i+1}:</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
