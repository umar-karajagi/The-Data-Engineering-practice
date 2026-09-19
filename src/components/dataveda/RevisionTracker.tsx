'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Check, RotateCcw, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react';

interface RevisionTrackerProps {
  milestone: string; // e.g. "Stage 01"
  checklist: string[];
  isMilestoneCompleted: boolean;
  onCompleteMilestone: () => void;
  onResetMilestone?: () => void;
}

export const RevisionTracker: React.FC<RevisionTrackerProps> = ({
  milestone,
  checklist,
  isMilestoneCompleted,
  onCompleteMilestone,
  onResetMilestone,
}) => {
  const storageKey = `dataveda_revision_${milestone.replace(/\s+/g, '_')}`;

  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCheckedItems(JSON.parse(saved));
      } else if (isMilestoneCompleted) {
        const initial: Record<number, boolean> = {};
        checklist.forEach((_, idx) => {
          initial[idx] = true;
        });
        setCheckedItems(initial);
      }
    } catch (e) {
      console.error('Failed to load revision state:', e);
    }
    setMounted(true);
  }, [storageKey, isMilestoneCompleted, checklist]);

  const handleToggle = (index: number) => {
    const updated = { ...checkedItems, [index]: !checkedItems[index] };
    setCheckedItems(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save revision state:', e);
    }
  };

  const completedCount = checklist.filter((_, idx) => !!checkedItems[idx]).length;
  const totalCount = checklist.length;
  const allItemsChecked = totalCount > 0 && completedCount === totalCount;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleReset = () => {
    setCheckedItems({});
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {}
    if (onResetMilestone) {
      onResetMilestone();
    }
  };

  if (!mounted) {
    return (
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse">
        <div className="h-4 w-40 bg-slate-300 dark:bg-slate-700 rounded mb-3" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-blue" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
            Milestone Verification & Revision Checklist
          </h4>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
          <span>{completedCount} of {totalCount} verified</span>
          <span className="text-slate-400 dark:text-slate-600">•</span>
          <span className={`font-bold ${allItemsChecked ? 'text-emerald-600 dark:text-emerald-400' : 'text-brand-blue'}`}>
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            allItemsChecked ? 'bg-emerald-500' : 'bg-brand-blue'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Checklist items */}
      <div className="space-y-2 mb-4">
        {checklist.map((item, idx) => {
          const isChecked = !!checkedItems[idx];
          return (
            <label
              key={idx}
              onClick={() => handleToggle(idx)}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none text-xs sm:text-sm ${
                isChecked
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 text-slate-900 dark:text-slate-100'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {isChecked ? (
                  <div className="w-4 h-4 rounded bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                )}
              </div>
              <span className={`flex-1 leading-relaxed ${isChecked ? 'line-through text-slate-500 dark:text-slate-400' : ''}`}>
                {item}
              </span>
            </label>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {!allItemsChecked ? (
            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              Toggle every checklist item to unlock Milestone completion.
            </span>
          ) : isMilestoneCompleted ? (
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              Milestone verified and recorded in your progress.
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
              All checklist requirements met! Ready to finalize milestone.
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isMilestoneCompleted && (
            <button
              onClick={handleReset}
              title="Reset checklist for revision"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onCompleteMilestone}
            disabled={!allItemsChecked || isMilestoneCompleted}
            className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all ${
              isMilestoneCompleted
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 cursor-default'
                : allItemsChecked
                ? 'bg-brand-blue text-white hover:bg-brand-hover shadow-md shadow-brand-blue/20 cursor-pointer active:scale-95'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-300 dark:border-slate-700 opacity-50 cursor-not-allowed'
            }`}
          >
            {isMilestoneCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Milestone Complete</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Mark Milestone Complete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
