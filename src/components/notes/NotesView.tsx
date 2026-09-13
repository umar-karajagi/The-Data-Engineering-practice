'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Tag, 
  Trash2, 
  Edit3, 
  ArrowUpRight, 
  Plus, 
  BookOpen, 
  Layers, 
  MapPin,
  Sparkles
} from 'lucide-react';
import { useUserStore } from '../../lib/userStore';
import { ContentRef, NoteItem } from '../../types';

export const NotesView: React.FC<{
  onNavigateToContent?: (ref: ContentRef) => void;
  onOpenQuickNote?: () => void;
}> = ({ onNavigateToContent, onOpenQuickNote }) => {
  const { notes, deleteNote, updateNote } = useUserStore();
  const [filterTab, setFilterTab] = useState<'all' | 'general' | 'attached'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState('');

  // Extract all unique tags
  const allTags = Array.from(new Set(notes.flatMap(n => n.tags)));

  // Filter notes
  const filteredNotes = notes.filter(n => {
    // Tab filter
    if (filterTab === 'general' && n.contentRef) return false;
    if (filterTab === 'attached' && !n.contentRef) return false;

    // Tag filter
    if (selectedTag && !n.tags.includes(selectedTag)) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchBody = n.body.toLowerCase().includes(q);
      const matchTitle = (n.contentRef?.label || '').toLowerCase().includes(q);
      const matchTags = n.tags.some(t => t.toLowerCase().includes(q));
      if (!matchBody && !matchTitle && !matchTags) return false;
    }

    return true;
  });

  const handleStartEdit = (note: NoteItem) => {
    setEditingNoteId(note.id);
    setEditBody(note.body);
  };

  const handleSaveEdit = (note: NoteItem) => {
    if (editBody.trim()) {
      updateNote(note.id, editBody.trim(), note.tags);
    }
    setEditingNoteId(null);
  };

  const getRefIcon = (type?: string) => {
    switch (type) {
      case 'library_chapter': return BookOpen;
      case 'track_module': return Layers;
      case 'roadmap_node': return MapPin;
      default: return FileText;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-forge-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-track-sql/10 border border-track-sql/30 flex items-center justify-center text-track-sql">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-forge-text tracking-tight">Engineering Notes & Insights</h1>
              <p className="text-xs text-forge-secondary font-mono">
                Unified knowledge base • General thoughts and attached book/module notes
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenQuickNote}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-track-sql text-black font-bold text-xs hover:bg-track-sql/90 transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Control Bar: Filter Tabs, Search & Tag Chips */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1 p-1 bg-forge-card border border-forge-border rounded-xl font-mono text-xs">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filterTab === 'all' ? 'bg-forge-surface text-track-sql shadow-sm' : 'text-forge-secondary hover:text-forge-text'
            }`}
          >
            All Notes ({notes.length})
          </button>
          <button
            onClick={() => setFilterTab('general')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filterTab === 'general' ? 'bg-forge-surface text-track-sql shadow-sm' : 'text-forge-secondary hover:text-forge-text'
            }`}
          >
            General ({notes.filter(n => !n.contentRef).length})
          </button>
          <button
            onClick={() => setFilterTab('attached')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filterTab === 'attached' ? 'bg-forge-surface text-track-sql shadow-sm' : 'text-forge-secondary hover:text-forge-text'
            }`}
          >
            Attached ({notes.filter(n => n.contentRef).length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-forge-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes and tags..."
            className="w-full bg-forge-card border border-forge-border rounded-xl pl-9 pr-4 py-1.5 text-xs text-forge-text placeholder:text-forge-secondary focus:outline-none focus:border-track-sql font-mono"
          />
        </div>

      </div>

      {/* Tag Filter Pills */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] text-forge-secondary font-mono mr-1">Filter by tag:</span>
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="text-[11px] px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
            >
              Clear tag ✕
            </button>
          )}
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`text-[11px] px-2 py-0.5 rounded-md border font-mono transition-colors ${
                selectedTag === tag
                  ? 'bg-track-sql/20 text-track-sql border-track-sql/40 font-bold'
                  : 'bg-forge-card text-forge-secondary border-forge-border hover:border-track-sql/30 hover:text-forge-text'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="rounded-2xl bg-forge-card border border-forge-border p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-forge-surface flex items-center justify-center text-forge-secondary mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-forge-text">No notes found</h3>
          <p className="text-xs text-forge-secondary max-w-sm mx-auto">
            {searchQuery || selectedTag 
              ? 'No notes match your current search or tag filters.' 
              : 'You haven\'t created any notes yet. Click "New Note" or use the inline note affordances while reading books or practicing modules.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => {
            const RefIcon = getRefIcon(note.contentRef?.type);
            const isEditing = editingNoteId === note.id;

            return (
              <div 
                key={note.id}
                className="rounded-2xl bg-forge-card border border-forge-border p-5 flex flex-col justify-between hover:border-track-sql/30 transition-all space-y-4 shadow-sm group"
              >
                {/* Attached Content Badge */}
                <div className="flex items-center justify-between gap-2 border-b border-forge-border pb-3">
                  {note.contentRef ? (
                    <button
                      onClick={() => onNavigateToContent && onNavigateToContent(note.contentRef!)}
                      className="flex items-center gap-2 text-left group-hover:text-track-sql transition-colors"
                      title="Jump to source context"
                    >
                      <div className="w-6 h-6 rounded-md bg-forge-surface border border-forge-border flex items-center justify-center text-track-sql shrink-0">
                        <RefIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <span className="text-[10px] uppercase font-bold text-track-sql tracking-wider block">
                          {note.contentRef.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-semibold text-forge-text truncate block max-w-xs">
                          {note.contentRef.label}
                        </span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-forge-secondary shrink-0" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-forge-secondary text-xs font-mono">
                      <FileText className="w-3.5 h-3.5" />
                      <span>General Note</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    {!isEditing && (
                      <button
                        onClick={() => handleStartEdit(note)}
                        className="p-1 rounded-md text-forge-secondary hover:text-forge-text hover:bg-forge-surface"
                        title="Edit note"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1 rounded-md text-forge-secondary hover:text-red-400 hover:bg-forge-surface"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Note Body */}
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                        rows={4}
                        className="w-full bg-forge-bg border border-track-sql rounded-xl p-3 text-xs text-forge-text focus:outline-none resize-none font-sans"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="px-2.5 py-1 rounded-md text-[11px] text-forge-secondary hover:bg-forge-surface"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(note)}
                          className="px-3 py-1 rounded-md text-[11px] font-bold bg-track-sql text-black hover:bg-track-sql/90"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-forge-text leading-relaxed whitespace-pre-wrap font-sans">
                      {note.body}
                    </p>
                  )}
                </div>

                {/* Tags & Timestamp Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-forge-border/50 text-[11px] font-mono text-forge-secondary">
                  <div className="flex flex-wrap gap-1 items-center">
                    {note.tags.map((tag) => (
                      <span 
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className="cursor-pointer px-1.5 py-0.5 rounded bg-forge-surface border border-forge-border hover:border-track-sql/40 hover:text-track-sql transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span>{new Date(note.updatedAt || note.createdAt).toLocaleDateString()}</span>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
