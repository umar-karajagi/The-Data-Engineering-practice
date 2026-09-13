'use client';

import React, { useState } from 'react';
import { CourseCapstone } from '@/types';
import { useUserStore } from '@/lib/userStore';
import { 
  X, 
  CheckCircle2, 
  Award, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ExternalLink,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

interface CapstoneEvaluationModalProps {
  courseId: string;
  capstone: CourseCapstone;
  onClose: () => void;
  onCapstonePassed: () => void;
}

export const CapstoneEvaluationModal: React.FC<CapstoneEvaluationModalProps> = ({
  courseId,
  capstone,
  onClose,
  onCapstonePassed
}) => {
  const { submitCourseCapstone } = useUserStore();

  const [rubricChecks, setRubricChecks] = useState<Record<string, boolean>>({});
  const [submissionNote, setSubmissionNote] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [hasPassed, setHasPassed] = useState<boolean>(false);

  const totalCriteria = capstone.rubricItems.length;
  const checkedCount = Object.values(rubricChecks).filter(Boolean).length;
  const passRatio = totalCriteria > 0 ? checkedCount / totalCriteria : 1;
  const canPass = passRatio >= 0.75;

  const toggleCheck = (id: string) => {
    setRubricChecks(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSubmit = () => {
    const passed = submitCourseCapstone(courseId, rubricChecks, submissionNote);
    setHasPassed(passed);
    setIsSubmitted(true);
    if (passed) {
      onCapstonePassed();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden text-[var(--text-primary)] font-sans">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-secondary)]/50">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#101415] border border-zinc-700 text-purple-400 font-mono text-xs font-bold uppercase">
              {courseId} CAPSTONE
            </span>
            <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
              PRODUCTION RUBRIC EVALUATION
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close capstone modal"
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {!isSubmitted ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-mono font-bold text-[var(--text-primary)]">
                  {capstone.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                  Evaluate your engineering deliverables against the 4 weighted production rubric criteria. To qualify for technical certificate issuance, at least 75% of weighted rubric criteria must be verified.
                </p>
              </div>

              {/* Rubric Items Checklist */}
              <div className="space-y-2.5">
                <span className="text-xs font-mono text-[var(--text-secondary)] uppercase">
                  Criteria Verification ({checkedCount}/{totalCriteria} Checked)
                </span>
                {capstone.rubricItems.map(item => {
                  const isChecked = Boolean(rubricChecks[item.id]);

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`p-3.5 rounded-xl border text-xs font-mono transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isChecked
                          ? 'border-[#C8FF4A] bg-[#C8FF4A]/10 text-[var(--text-primary)]'
                          : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-zinc-500'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${isChecked ? 'text-[#C8FF4A]' : 'text-[var(--text-primary)]'}`}>
                            {item.criterion}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--bg-secondary)] text-zinc-400 border border-[var(--border-color)]">
                            Weight: {item.weightPercent}%
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-[var(--text-secondary)]">
                          {item.guidance}
                        </p>
                      </div>

                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                        isChecked ? 'bg-[#C8FF4A] border-[#C8FF4A] text-black' : 'border-zinc-600 bg-zinc-900'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submission Notes / Repo Link */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[var(--text-secondary)] block">
                  GitHub Repository Link or Architectural Notes (Optional)
                </label>
                <input
                  type="text"
                  value={submissionNote}
                  onChange={e => setSubmissionNote(e.target.value)}
                  placeholder="https://github.com/your-username/lakehouse-capstone"
                  className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[#C8FF4A]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                <div className="text-xs font-mono">
                  {canPass ? (
                    <span className="text-[#C8FF4A]">✓ Passing Threshold Met ({Math.round(passRatio * 100)}%)</span>
                  ) : (
                    <span className="text-amber-400">Needs $\ge 75\%$ Rubric Confirmation</span>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!canPass}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-mono font-bold bg-[#C8FF4A] text-[#101415] hover:bg-[#b8f53a] disabled:opacity-40 transition-all shadow-sm"
                >
                  <Award className="w-4 h-4" />
                  <span>Submit & Claim Certificate</span>
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
                  Capstone Mastery Confirmed
                </h3>
                <p className="text-xs font-mono text-[#C8FF4A] mt-2">
                  +400 XP Awarded • Technical Credential Generated
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-2 max-w-md mx-auto leading-relaxed">
                  Congratulations! You have demonstrated verified technical competency for <strong>{capstone.title}</strong>. Your verifiable certificate of technical mastery has been added to your profile.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-mono text-left max-w-md mx-auto leading-relaxed">
                <div className="text-zinc-400 font-bold mb-1">CERTIFICATE ISSUED:</div>
                <div className="text-[#C8FF4A] font-bold">DF-CERT-{courseId}-XXXXXX</div>
                <div className="text-zinc-500 text-[11px] mt-1">Verified on 100% Free Open Access Foundry Ledger</div>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-xs font-mono font-bold bg-[#C8FF4A] text-[#101415] hover:bg-[#b8f53a] shadow-sm"
                >
                  View in Badges & Certs
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
