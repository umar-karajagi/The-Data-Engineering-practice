'use client';

import React, { useState } from 'react';
import { ModuleQuiz } from '@/types';
import { useUserStore } from '@/lib/userStore';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Award, 
  Check,
  FileCheck
} from 'lucide-react';

interface ModuleQuizModalProps {
  courseId: string;
  moduleId: string;
  quiz: ModuleQuiz;
  onClose: () => void;
  onQuizPassed?: () => void;
}

export const ModuleQuizModal: React.FC<ModuleQuizModalProps> = ({
  courseId,
  moduleId,
  quiz,
  onClose,
  onQuizPassed
}) => {
  const { passCourseQuiz } = useUserStore();

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [hasPassed, setHasPassed] = useState<boolean>(false);

  const questions = quiz.questions;
  const currentQ = questions[currentIdx];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIdx === totalQuestions - 1;

  const handleSelectOption = (optIdx: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIdx]: optIdx
    }));
  };

  const handleNextOrSubmit = () => {
    if (isLastQuestion) {
      // Grade quiz
      let correct = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          correct += 1;
        }
      });
      const finalScore = Math.round((correct / Math.max(1, totalQuestions)) * 100);
      const passed = passCourseQuiz(courseId, moduleId, finalScore);
      setScore(finalScore);
      setHasPassed(passed);
      setIsSubmitted(true);
      if (passed && onQuizPassed) {
        onQuizPassed();
      }
    } else {
      setCurrentIdx(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden text-[var(--text-primary)] font-sans">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-secondary)]/50">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#101415] border border-zinc-700 text-[#C8FF4A] font-mono text-xs font-bold">
              {courseId}
            </span>
            <span className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase">
              {quiz.title} (Passing: {quiz.passingScorePercent}%)
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close quiz modal"
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {!isSubmitted ? (
            <div className="space-y-6">
              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)] mb-2">
                  <span>Question {currentIdx + 1} of {totalQuestions}</span>
                  <span>Required: {quiz.passingScorePercent}%</span>
                </div>
                <div className="w-full bg-[var(--bg-secondary)] rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-[#C8FF4A] h-full rounded-full transition-all duration-300"
                    style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <h3 className="text-base font-mono font-bold text-[var(--text-primary)] leading-relaxed">
                  {currentQ.question}
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Select the best technical option:
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentIdx] === optIdx;
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
                  onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                  disabled={currentIdx === 0}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-white disabled:opacity-30"
                >
                  Previous
                </button>

                <button
                  onClick={handleNextOrSubmit}
                  disabled={selectedAnswers[currentIdx] === undefined}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-mono font-bold bg-[#C8FF4A] text-[#101415] hover:bg-[#b8f53a] disabled:opacity-40 transition-all shadow-sm"
                >
                  <span>{isLastQuestion ? 'Submit Assessment' : 'Next Question'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Results View */
            <div className="space-y-6 text-center py-4">
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center border ${
                hasPassed 
                  ? 'bg-[#C8FF4A]/10 border-[#C8FF4A]/40 text-[#C8FF4A]' 
                  : 'bg-rose-500/10 border-rose-500/40 text-rose-400'
              }`}>
                {hasPassed ? <Sparkles className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
              </div>

              <div>
                <h3 className="text-2xl font-black font-mono text-[var(--text-primary)]">
                  {hasPassed ? 'Module Quiz Passed!' : 'Assessment Incomplete'}
                </h3>
                <div className={`text-4xl font-black font-mono mt-2 ${hasPassed ? 'text-[#C8FF4A]' : 'text-rose-400'}`}>
                  {score}%
                </div>
                <p className="text-xs font-mono text-[var(--text-secondary)] mt-2">
                  Passing threshold: {quiz.passingScorePercent}%
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-mono text-left max-w-md mx-auto leading-relaxed">
                {hasPassed ? (
                  <span className="text-emerald-400">
                    ✓ Congratulations! You scored {score}%. This module has been recorded as complete in your unified engineer record. Subsequent lessons and capstones are unlocked.
                  </span>
                ) : (
                  <span className="text-rose-300">
                    Score: {score}%. A minimum score of {quiz.passingScorePercent}% is required to clear this quality gate. Review the concept blocks and senior tips, then retake the assessment.
                  </span>
                )}
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                {!hasPassed && (
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setCurrentIdx(0);
                      setSelectedAnswers({});
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-mono bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-zinc-500"
                  >
                    Retake Assessment
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-xs font-mono font-bold bg-[#C8FF4A] text-[#101415] hover:bg-[#b8f53a] shadow-sm"
                >
                  {hasPassed ? 'Continue Course' : 'Review Concepts'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
