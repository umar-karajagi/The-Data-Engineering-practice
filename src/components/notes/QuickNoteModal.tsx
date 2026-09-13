'use client';

import React, { useState } from 'react';
import { X, Tag, FileText, Sparkles } from 'lucide-react';
import { useUserStore } from '../../lib/userStore';
import { ContentRef } from '../../types';

export const QuickNoteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  initialContentRef?: ContentRef;
}> = ({ isOpen, onClose, initialContentRef }) => {
  const { addNote } = useUserStore();
  const [body, setBody] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['#note']);

  if (!isOpen) return null;

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, '');
      if (clean && !tags.includes(`#${clean}`)) {
        setTags([...tags, `#${clean}`]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSave = () => {
    if (!body.trim()) return;
    addNote({
      body: body.trim(),
      tags,
      contentRef: initialContentRef
    });
    setBody('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-forge-card border border-forge-border rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-forge-border pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-track-sql/10 border border-track-sql/30 flex items-center justify-center text-track-sql">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-forge-text font-mono">Quick Note</h3>
              <p className="text-[11px] text-forge-secondary">Capture engineering insights, rules of thumb, and interview traps</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-forge-secondary hover:text-forge-text hover:bg-forge-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Attached Context Badge (if any) */}
        {initialContentRef && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-forge-surface/60 border border-forge-border text-xs">
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-track-sql/20 text-track-sql">
              {initialContentRef.type.replace('_', ' ')}
            </span>
            <span className="text-forge-text font-medium truncate">{initialContentRef.title}</span>
          </div>
        )}

        {/* Text Body */}
        <div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            autoFocus
            placeholder="Write your note here... (e.g. 'In Spark streaming joins, watermarks must be set to prevent RocksDB heap explosion.')"
            className="w-full bg-forge-bg border border-forge-border rounded-xl p-3 text-xs text-forge-text placeholder:text-forge-secondary focus:outline-none focus:border-track-sql resize-none font-sans"
          />
        </div>

        {/* Tags input */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5 items-center">
            {tags.map((t) => (
              <span key={t} className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-forge-surface border border-forge-border text-forge-secondary">
                {t}
                <button onClick={() => handleRemoveTag(t)} className="hover:text-red-400">×</button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-forge-secondary" />
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tag and press Enter (e.g. interview, performance)"
              className="flex-1 bg-forge-bg border border-forge-border rounded-lg px-2.5 py-1 text-xs text-forge-text focus:outline-none focus:border-track-sql"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-forge-border">
          <span className="text-[10px] text-forge-secondary font-mono flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            +25 XP for taking notes
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs text-forge-secondary hover:text-forge-text hover:bg-forge-surface transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!body.trim()}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-track-sql text-black hover:bg-track-sql/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Save Note
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
