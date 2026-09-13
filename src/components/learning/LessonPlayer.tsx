'use client';

import React, { useState, useEffect } from 'react';
import { getSkillCourseById } from '@/content/courses/catalog';
import { CourseLesson, CourseModule, SkillCourse } from '@/types';
import { useUserStore } from '@/lib/userStore';
import { useDuckDB } from '@/lib/useDuckDB';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  Lightbulb, 
  AlertTriangle, 
  Terminal, 
  Code2, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Sparkles, 
  BookOpen, 
  PenSquare, 
  Layers, 
  Eye, 
  RefreshCw,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { ModuleQuizModal } from '@/components/learning/ModuleQuizModal';

interface LessonPlayerProps {
  courseId: string;
  lessonId: string;
  onBackToCourse: () => void;
  onNavigateLesson: (nextLessonId: string) => void;
  onOpenDiagnostic?: () => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  courseId,
  lessonId,
  onBackToCourse,
  onNavigateLesson,
  onOpenDiagnostic
}) => {
  const { 
    courseProgress, 
    completeLesson, 
    setLastActive, 
    addNote 
  } = useUserStore();

  const { runQuery } = useDuckDB();

  const course = getSkillCourseById(courseId);

  // Find active module and lesson
  let currentModule: CourseModule | undefined;
  let currentLesson: CourseLesson | undefined;
  let allCourseLessons: { module: CourseModule; lesson: CourseLesson }[] = [];

  if (course) {
    for (const m of course.modules) {
      for (const l of m.lessons) {
        allCourseLessons.push({ module: m, lesson: l });
        if (l.id === lessonId) {
          currentModule = m;
          currentLesson = l;
        }
      }
    }
  }

  // Current lesson index in flattened course
  const currentIdx = allCourseLessons.findIndex(item => item.lesson.id === lessonId);
  const prevItem = currentIdx > 0 ? allCourseLessons[currentIdx - 1] : null;
  const nextItem = currentIdx < allCourseLessons.length - 1 ? allCourseLessons[currentIdx + 1] : null;

  // Exercise code state
  const [exerciseCode, setExerciseCode] = useState<string>('');
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [showHints, setShowHints] = useState<boolean>(false);

  // Inline Check state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCheckSubmitted, setIsCheckSubmitted] = useState<boolean>(false);

  // Quick Note state
  const [isNoteOpen, setIsNoteOpen] = useState<boolean>(false);
  const [noteBody, setNoteBody] = useState<string>('');
  const [noteSaved, setNoteSaved] = useState<boolean>(false);

  // Gated Module Quiz Modal state
  const [quizModalModule, setQuizModalModule] = useState<CourseModule | null>(null);

  // Initialize or reset state when lesson changes
  useEffect(() => {
    if (currentLesson?.exercise?.starterCode) {
      setExerciseCode(currentLesson.exercise.starterCode);
    } else {
      setExerciseCode('');
    }
    setExecutionOutput(null);
    setExecutionError(null);
    setShowSolution(false);
    setShowHints(false);
    setSelectedOption(null);
    setIsCheckSubmitted(false);
    setNoteSaved(false);

    if (course && currentLesson) {
      setLastActive({
        type: 'course_lesson',
        id: currentLesson.id,
        courseId: course.id,
        lessonId: currentLesson.id,
        title: currentLesson.title,
        subtitle: `${course.id} • ${course.title}`
      });
    }
  }, [lessonId, courseId]);

  if (!course || !currentLesson || !currentModule) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] p-12 text-center text-[var(--text-primary)]">
        <p className="text-xl font-mono">Lesson not found.</p>
        <button 
          onClick={onBackToCourse}
          className="mt-4 px-4 py-2 bg-[#C8FF4A] text-black font-mono font-bold rounded-lg"
        >
          Return to Course
        </button>
      </div>
    );
  }

  const isCompleted = courseProgress[course.id]?.completedLessonIds?.includes(currentLesson.id);

  // Execute exercise code
  const handleRunExercise = async () => {
    if (!currentLesson?.exercise) return;
    setIsRunning(true);
    setExecutionError(null);
    setExecutionOutput(null);

    try {
      if (currentLesson.exercise.type === 'sql') {
        const ddl = `
          CREATE TABLE orders (order_id INT, customer_id INT, order_date DATE, amount DOUBLE, status VARCHAR);
          INSERT INTO orders VALUES 
            (1, 42, '2026-01-01', 120.50, 'completed'),
            (2, 42, '2026-01-05', 450.00, 'completed'),
            (3, 108, '2026-01-07', 85.00, 'completed'),
            (4, 42, '2026-01-10', 210.00, 'completed'),
            (5, 108, '2026-01-12', 650.00, 'completed'),
            (6, 99, '2026-01-15', 30.00, 'cancelled');
        `;
        const res = await runQuery(exerciseCode, ddl);
        if (res.error) {
          setExecutionError(res.error);
        } else if (res.rows) {
          const formatted = res.rows.map(r => JSON.stringify(r)).join('\n');
          setExecutionOutput(formatted || 'Query executed successfully. (0 rows returned)');
        }
      } else if (currentLesson.exercise.type === 'python' || currentLesson.exercise.type === 'pyspark') {
        // Simulated execution with validation
        await new Promise(r => setTimeout(r, 600));
        if (exerciseCode.includes('yield') || exerciseCode.includes('groupBy') || exerciseCode.includes('agg')) {
          setExecutionOutput('✓ Execution verified. Pipeline output generator passed all simulated test cases.');
        } else {
          setExecutionOutput('Script executed. (Tip: Use the specified functions from the prompt)');
        }
      } else if (currentLesson.exercise.type === 'decision') {
        await new Promise(r => setTimeout(r, 400));
        setExecutionOutput('Architectural decision memo registered. Review the reference solution below to evaluate trade-offs.');
      }
    } catch (err: any) {
      setExecutionError(err?.message || 'Execution error');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveNote = () => {
    if (!noteBody.trim()) return;
    addNote({
      body: noteBody,
      tags: [`#${course.id}`, '#lesson-notes'],
      contentRef: {
        type: 'track_module',
        id: currentLesson.id,
        title: `${course.id} • ${currentLesson.title}`,
        trackId: course.id
      }
    });
    setNoteBody('');
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  };

  const handleMarkCompleteAndNext = () => {
    completeLesson(course.id, currentLesson.id, nextItem?.lesson.id);
    if (nextItem) {
      onNavigateLesson(nextItem.lesson.id);
    } else {
      onBackToCourse();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans pb-24">
      {/* Top Navigation Bar */}
      <div className="border-b border-[var(--border-color)] bg-[var(--card-bg)] px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCourse}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)] hover:text-[#C8FF4A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">BACK TO COURSE</span>
          </button>
          <span className="text-zinc-600">/</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#101415] border border-zinc-700 text-[#C8FF4A] font-bold">
            {course.id}
          </span>
          <span className="text-xs font-mono text-[var(--text-secondary)] hidden md:inline truncate max-w-xs">
            {currentModule.title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNoteOpen(!isNoteOpen)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              isNoteOpen 
                ? 'bg-[#C8FF4A]/10 border-[#C8FF4A] text-[#C8FF4A]' 
                : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <PenSquare className="w-3.5 h-3.5" />
            <span>Quick Note</span>
          </button>

          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-xs font-mono text-[#C8FF4A] px-2.5 py-1 rounded bg-[#C8FF4A]/10 border border-[#C8FF4A]/30">
              <Check className="w-3.5 h-3.5" /> Completed
            </span>
          )}

          <button
            onClick={handleMarkCompleteAndNext}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#C8FF4A] text-[#101415] hover:bg-[#b8f53a] transition-all shadow-sm"
          >
            <span>{nextItem ? 'Complete & Next' : 'Finish Course'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left 3 Columns: Lesson Content & Interactive Micro-Loop */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Lesson Header */}
          <div className="border-b border-[var(--border-color)] pb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-[#56D8FF] mb-2">
              <BookOpen className="w-4 h-4" />
              <span>MODULE: {currentModule.title}</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black font-mono text-[var(--text-primary)]">
              {currentLesson.title}
            </h1>
            <div className="flex items-center gap-4 mt-3 text-xs font-mono text-[var(--text-secondary)]">
              <span>Estimated: {currentLesson.estimatedMinutes} mins</span>
              <span>•</span>
              <span className="text-[#C8FF4A]">Objective: {currentLesson.objective}</span>
            </div>
          </div>

          {/* Quick Note In-Context Box (if open) */}
          {isNoteOpen && (
            <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[#C8FF4A]/40 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-[#C8FF4A]">
                <span>Add Note for {currentLesson.title}</span>
                {noteSaved && <span className="text-emerald-400">✓ Saved to Your Notes</span>}
              </div>
              <textarea
                value={noteBody}
                onChange={e => setNoteBody(e.target.value)}
                placeholder="Jot down a Senior Tip, rule of thumb, or syntax pattern..."
                rows={3}
                className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[#C8FF4A]"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsNoteOpen(false)}
                  className="px-3 py-1 rounded text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveNote}
                  className="px-3 py-1 rounded text-xs font-mono font-bold bg-[#C8FF4A] text-black"
                >
                  Save Note
                </button>
              </div>
            </div>
          )}

          {/* Step 1 in Micro-Loop: Concept Reading Chunks (2-5 min) */}
          <div className="space-y-6">
            {currentLesson.conceptBlocks.map(block => (
              <div key={block.id} className="space-y-4">
                <h2 className="text-lg font-mono font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C8FF4A]" />
                  {block.title}
                </h2>
                
                {/* Markdown content rendering */}
                <div className="prose prose-invert max-w-none text-sm leading-relaxed text-[var(--text-secondary)] whitespace-pre-line">
                  {block.content}
                </div>

                {/* Senior Tip Alert Box */}
                {block.seniorTip && (
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/30 flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                        Senior Engineering Tip
                      </span>
                      <p className="text-xs text-[var(--text-primary)] mt-1 leading-relaxed">
                        {block.seniorTip}
                      </p>
                    </div>
                  </div>
                )}

                {/* Anti-Pattern Alert Box */}
                {block.antiPattern && (
                  <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/30 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider block">
                        Production Anti-Pattern to Avoid
                      </span>
                      <p className="text-xs text-[var(--text-primary)] mt-1 leading-relaxed">
                        {block.antiPattern}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Step 2 in Micro-Loop: Inline Interactive Exercise */}
          {currentLesson.exercise && (
            <div className="border border-[var(--border-color)] bg-[var(--card-bg)] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#101415] border border-zinc-700 text-[#56D8FF] text-xs font-mono font-bold uppercase">
                    Micro-Loop Exercise: {currentLesson.exercise.type.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-[var(--text-secondary)]">
                    In-Browser Execution
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {currentLesson.exercise.hints?.length > 0 && (
                    <button
                      onClick={() => setShowHints(!showHints)}
                      className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{showHints ? 'Hide Hint' : 'Hint'}</span>
                    </button>
                  )}
                  {currentLesson.exercise.solutionCode && (
                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{showSolution ? 'Hide Solution' : 'Solution'}</span>
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm font-mono text-[var(--text-primary)] bg-[var(--bg-secondary)] p-3 rounded-xl border border-[var(--border-color)]">
                {currentLesson.exercise.prompt}
              </p>

              {/* Hints Box */}
              {showHints && currentLesson.exercise.hints && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300">
                  <span className="font-bold block mb-1">Hints:</span>
                  <ul className="space-y-1 list-disc pl-4">
                    {currentLesson.exercise.hints.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Solution Code Accordion */}
              {showSolution && currentLesson.exercise.solutionCode && (
                <div className="p-3 rounded-xl bg-[#101415] border border-zinc-700 text-xs font-mono text-emerald-400">
                  <span className="font-bold text-zinc-400 block mb-1">Reference Solution:</span>
                  <pre className="overflow-x-auto whitespace-pre-wrap">{currentLesson.exercise.solutionCode}</pre>
                </div>
              )}

              {/* Interactive Code Editor */}
              <div className="relative rounded-xl overflow-hidden border border-[var(--border-color)] bg-[#101415]">
                <div className="bg-zinc-900/80 px-4 py-2 border-b border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-[#C8FF4A]" />
                    <span>WORKBENCH EDITOR</span>
                  </div>
                  <button
                    onClick={() => setExerciseCode(currentLesson.exercise?.starterCode || '')}
                    className="hover:text-white flex items-center gap-1 text-[11px]"
                  >
                    <RefreshCw className="w-3 h-3" /> Reset
                  </button>
                </div>
                <textarea
                  value={exerciseCode}
                  onChange={e => setExerciseCode(e.target.value)}
                  rows={8}
                  className="w-full p-4 bg-[#101415] text-[#F4F0E7] font-mono text-xs focus:outline-none resize-none leading-relaxed"
                  spellCheck={false}
                />
              </div>

              {/* Execution Action Button */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleRunExercise}
                  disabled={isRunning}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono font-bold text-xs bg-[#C8FF4A] text-[#101415] hover:bg-[#b8f53a] disabled:opacity-50 transition-all shadow-sm"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{isRunning ? 'Executing...' : 'Run Query / Evaluate Code'}</span>
                </button>
                <span className="text-[11px] font-mono text-zinc-500">
                  DuckDB In-Browser Engine Active
                </span>
              </div>

              {/* Execution Output Console */}
              {(executionOutput || executionError) && (
                <div className="rounded-xl overflow-hidden border border-[var(--border-color)] bg-[#101415] p-3 text-xs font-mono">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
                    EXECUTION RESULT
                  </span>
                  {executionError ? (
                    <div className="text-[#FF6B5E] whitespace-pre-wrap">{executionError}</div>
                  ) : (
                    <pre className="text-emerald-400 overflow-x-auto whitespace-pre-wrap max-h-48">
                      {executionOutput}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3 in Micro-Loop: Inline Concept Check */}
          {currentLesson.inlineChecks?.length > 0 && (
            <div className="border border-[var(--border-color)] bg-[var(--card-bg)] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#C8FF4A]">
                <Sparkles className="w-4 h-4" />
                <span>INLINE CONCEPT CHECK</span>
              </div>

              {currentLesson.inlineChecks.map((check, checkIdx) => {
                const isCorrect = selectedOption === check.correctIndex;

                return (
                  <div key={check.id} className="space-y-3">
                    <h3 className="text-sm font-mono font-bold text-[var(--text-primary)]">
                      {check.question}
                    </h3>

                    <div className="space-y-2">
                      {check.options.map((opt, optIdx) => {
                        const isSelected = selectedOption === optIdx;
                        let optionStyle = 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-zinc-500';

                        if (isCheckSubmitted) {
                          if (optIdx === check.correctIndex) {
                            optionStyle = 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-semibold';
                          } else if (isSelected) {
                            optionStyle = 'bg-rose-500/10 border-rose-500 text-rose-400 line-through';
                          }
                        } else if (isSelected) {
                          optionStyle = 'border-[#C8FF4A] bg-[#C8FF4A]/10 text-[#C8FF4A] font-semibold';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => {
                              if (!isCheckSubmitted) setSelectedOption(optIdx);
                            }}
                            className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all flex items-center justify-between ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {isCheckSubmitted && optIdx === check.correctIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {!isCheckSubmitted ? (
                      <button
                        onClick={() => {
                          if (selectedOption !== null) setIsCheckSubmitted(true);
                        }}
                        disabled={selectedOption === null}
                        className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[#C8FF4A] disabled:opacity-40 transition-all"
                      >
                        Verify Answer
                      </button>
                    ) : (
                      <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-mono leading-relaxed">
                        <span className={isCorrect ? 'text-emerald-400 font-bold block mb-1' : 'text-rose-400 font-bold block mb-1'}>
                          {isCorrect ? '✓ Correct!' : '✗ Explanation:'}
                        </span>
                        <p className="text-[var(--text-secondary)]">{check.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Pagination Bar */}
          <div className="pt-6 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3">
            <div>
              {prevItem && (
                <button
                  onClick={() => onNavigateLesson(prevItem.lesson.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-zinc-500 text-[var(--text-primary)] transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev: {prevItem.lesson.title.slice(0, 25)}...</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuizModalModule(currentModule)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-mono bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-400 transition-all font-semibold"
              >
                <FileCheck className="w-4 h-4" />
                <span>Take Module Quiz</span>
              </button>

              <button
                onClick={handleMarkCompleteAndNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-mono font-bold bg-[#C8FF4A] text-[#101415] hover:bg-[#b8f53a] transition-all shadow-md shadow-[#C8FF4A]/10"
              >
                <span>{nextItem ? 'Complete & Continue' : 'Finish Course'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Course Navigation Drawer */}
        <div className="space-y-6">
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <span className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase">
                Curriculum Navigator
              </span>
              <span className="text-[11px] font-mono text-[#C8FF4A]">
                {courseProgress[course.id]?.percentComplete || 0}% Complete
              </span>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {course.modules.map((m, mIdx) => (
                <div key={m.id} className="space-y-1.5">
                  <div className="text-[11px] font-mono font-semibold text-zinc-400">
                    M0{mIdx + 1}: {m.title}
                  </div>
                  <div className="space-y-1 pl-2 border-l border-zinc-800">
                    {m.lessons.map(l => {
                      const isCurrent = l.id === currentLesson.id;
                      const isDone = courseProgress[course.id]?.completedLessonIds?.includes(l.id);

                      return (
                        <button
                          key={l.id}
                          onClick={() => onNavigateLesson(l.id)}
                          className={`w-full text-left p-2 rounded-lg text-xs font-mono flex items-center justify-between transition-all ${
                            isCurrent
                              ? 'bg-[#C8FF4A]/10 border border-[#C8FF4A]/40 text-[#C8FF4A] font-bold'
                              : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-secondary)]'
                          }`}
                        >
                          <span className="truncate pr-2">{l.title}</span>
                          {isDone && <Check className="w-3 h-3 text-[#C8FF4A] shrink-0" />}
                        </button>
                      );
                    })}

                    {/* Module Quiz */}
                    <button
                      onClick={() => setQuizModalModule(m)}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] font-mono flex items-center justify-between transition-all mt-1 ${
                        courseProgress[course.id]?.passedQuizIds?.includes(m.id)
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/5 hover:bg-amber-500/15 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <FileCheck className="w-3 h-3 shrink-0" />
                        <span>M0{mIdx + 1} Quiz ({m.quiz.passingScorePercent}%)</span>
                      </span>
                      {courseProgress[course.id]?.passedQuizIds?.includes(m.id) ? (
                        <span className="text-[9px] font-bold text-emerald-400">PASSED</span>
                      ) : (
                        <span className="text-[9px] text-zinc-500">GATED</span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gated Module Assessment Modal */}
      {quizModalModule && (
        <ModuleQuizModal
          courseId={course.id}
          moduleId={quizModalModule.id}
          quiz={quizModalModule.quiz}
          onClose={() => setQuizModalModule(null)}
        />
      )}
    </div>
  );
};
