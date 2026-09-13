'use client';

import React, { useState } from 'react';
import { getSkillCourseById } from '@/content/courses/catalog';
import { useUserStore } from '@/lib/userStore';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw, 
  GraduationCap,
  ShieldCheck,
  Check
} from 'lucide-react';

interface PlacementDiagnosticModalProps {
  courseId: string;
  onClose: () => void;
  onComplete: (skipped: boolean) => void;
}

export const PlacementDiagnosticModal: React.FC<PlacementDiagnosticModalProps> = ({
  courseId,
  onClose,
  onComplete
}) => {
  const { submitCoursePlacementDiagnostic } = useUserStore();
  const course = getSkillCourseById(courseId);
  const diagnostic = course?.diagnostic;

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [diagnosticResult, setDiagnosticResult] = useState<{ skipped: boolean; message: string; score: number } | null>(null);

  if (!course || !diagnostic || diagnostic.questions.length === 0) {
    return null;
  }

  const questions = diagnostic.questions;
  const currentQ = questions[currentQuestionIdx];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIdx === totalQuestions - 1;

  const handleSelectOption = (optIdx: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: optIdx
    }));
  };

  const handleNextOrFinish = () => {
    if (isLastQuestion) {
      // Calculate score
      let correctCount = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          correctCount += 1;
        }
      });
      const score = Math.round((correctCount / totalQuestions) * 100);
      const res = submitCoursePlacementDiagnostic(course.id, score, diagnostic.qualifySkipModuleId);
      setDiagnosticResult({ ...res, score });
      setIsFinished(true);
    } else {
      setCurrentQuestionIdx(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden text-[var(--text-primary)] font-sans">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-secondary)]/50">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#101415] border border-zinc-700 text-[#56D8FF] font-mono text-xs font-bold">
              {course.id}
            </span>
            <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
              PLACEMENT DIAGNOSTIC
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close diagnostic modal"
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {!isFinished ? (
            <div className="space-y-6">
              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)] mb-2">
                  <span>Question {currentQuestionIdx + 1} of {totalQuestions}</span>
                  <span>{currentQ.difficulty || 'Intermediate'}</span>
                </div>
                <div className="w-full bg-[var(--bg-secondary)] rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-[#C8FF4A] h-full rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIdx + 1) / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <h3 className="text-base font-mono font-bold text-[var(--text-primary)] leading-relaxed">
                  {currentQ.question}
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Select the most technically accurate answer:
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-mono transition-all flex items-center justify-between ${
                        isSelected 
                          ? 'border-[#C8FF4A] bg-[#C8FF4A]/10 text-[#C8FF4A] font-semibold' 
                          : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-zinc-500'
                      }`}
                    >
                      <span>{option}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#C8FF4A] shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                <button
                  onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIdx === 0}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-white disabled:opacity-30"
                >
                  Previous
                </button>

                <button
                  onClick={handleNextOrFinish}
                  disabled={selectedAnswers[currentQuestionIdx] === undefined}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-mono font-bold bg-[#C8FF4A] text-[#101415] hover:bg-[#b8f53a] disabled:opacity-40 transition-all shadow-sm"
                >
                  <span>{isLastQuestion ? 'Complete Diagnostic' : 'Next Question'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Results View */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-[#C8FF4A]/10 border border-[#C8FF4A]/40 text-[#C8FF4A]">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-black font-mono text-[var(--text-primary)]">
                  Diagnostic Evaluation Complete
                </h3>
                <div className="text-3xl font-black font-mono text-[#C8FF4A] mt-2">
                  {diagnosticResult?.score}%
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-md mx-auto leading-relaxed">
                  {diagnosticResult?.message}
                </p>
              </div>

              {diagnosticResult?.skipped ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 max-w-md mx-auto flex items-center gap-2 text-left">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <span>
                    Introductory module has been marked as <strong>Placement Skipped</strong>. You can proceed directly to Module 2.
                  </span>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-mono text-zinc-400 max-w-md mx-auto text-left">
                  <span>
                    We recommend beginning from <strong>Module 1</strong> to solidify foundational storage mechanics and query execution fundamentals.
                  </span>
                </div>
              )}

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setIsFinished(false);
                    setCurrentQuestionIdx(0);
                    setSelectedAnswers({});
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-mono bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-zinc-500"
                >
                  Retake Diagnostic
                </button>
                <button
                  onClick={() => {
                    onComplete(Boolean(diagnosticResult?.skipped));
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-mono font-bold bg-[#C8FF4A] text-[#101415] hover:bg-[#b8f53a] shadow-sm"
                >
                  Continue to Course
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
