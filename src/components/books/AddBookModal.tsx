'use client';

import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Layers, 
  Clock, 
  Loader2,
  FileCode,
  Lock
} from 'lucide-react';
import { BookReference, TrackType } from '../../types';
import { parseUploadedFile, processRawBookText } from '../../lib/bookParser';
import { saveCustomBook } from '../../lib/libraryStorage';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAdded: (book: BookReference) => void;
}

export const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose, onBookAdded }) => {
  const [mode, setMode] = useState<'upload' | 'paste'>('upload');
  
  // File upload state
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<BookReference | null>(null);

  // Manual paste state
  const [pasteTitle, setPasteTitle] = useState('');
  const [pasteAuthor, setPasteAuthor] = useState('');
  const [pasteTrack, setPasteTrack] = useState<TrackType>('architecture');
  const [pasteContent, setPasteContent] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setSelectedFile(file);
    setIsProcessing(true);
    setErrorMsg(null);
    setParsedPreview(null);

    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      
      // If .ipynb or file > 2MB, stream upload to secure backend vault API
      if (ext === 'ipynb' || file.size > 2 * 1024 * 1024) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/vault/upload', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Upload failed with status ${res.status}`);
        }
        const data = await res.json();
        if (data.item) {
          setParsedPreview(data.item);
          return;
        }
      }

      const parsedBook = await parseUploadedFile(file);
      if (!parsedBook.chapters || parsedBook.chapters.length === 0) {
        throw new Error('Could not parse any readable chapters from this file.');
      }
      setParsedPreview(parsedBook);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Failed to parse file. Please try pasting the text content instead.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePasteSubmit = () => {
    if (!pasteContent.trim()) {
      setErrorMsg('Please paste some text content for your book.');
      return;
    }
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const parsed = processRawBookText(pasteContent, {
        title: pasteTitle.trim() || undefined,
        author: pasteAuthor.trim() || undefined,
        track: pasteTrack,
      });
      setParsedPreview(parsed);
    } catch (err: any) {
      setErrorMsg('Failed to format text: ' + err?.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveAndRead = () => {
    if (!parsedPreview) return;
    saveCustomBook(parsedPreview);
    onBookAdded(parsedPreview);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-forge-card border border-forge-border rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-forge-border flex items-center justify-between bg-forge-bg/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-track-sql/10 border border-track-sql/30 flex items-center justify-center text-track-sql shadow-inner">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-forge-text">Add Book to Personal Library</h2>
              <p className="text-xs text-forge-secondary font-mono">
                Auto-converts into an Apple Books / Kindle-style reading canvas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-forge-surface hover:bg-forge-border flex items-center justify-center text-forge-secondary hover:text-forge-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Protection Alert Note */}
        <div className="mx-6 mt-6 p-3.5 rounded-2xl bg-forge-bg border border-forge-border flex items-center justify-between text-xs font-mono text-forge-secondary">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-track-warehousing shrink-0" />
            <span>Anti-Download DRM Active: Books are private to your device and read-only.</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-track-warehousing/10 text-track-warehousing font-bold border border-track-warehousing/30">
            SECURE VAULT
          </span>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="px-6 pt-4 flex gap-2">
          <button
            onClick={() => { setMode('upload'); setErrorMsg(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              mode === 'upload'
                ? 'bg-track-sql text-white shadow-md shadow-blue-500/20'
                : 'bg-forge-bg text-forge-secondary hover:text-forge-text border border-forge-border'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload File (.pdf, .md, .txt, .epub)</span>
          </button>

          <button
            onClick={() => { setMode('paste'); setErrorMsg(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              mode === 'paste'
                ? 'bg-track-sql text-white shadow-md shadow-blue-500/20'
                : 'bg-forge-bg text-forge-secondary hover:text-forge-text border border-forge-border'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Manuscript Text</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          
          {mode === 'upload' && !parsedPreview && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                dragActive
                  ? 'border-track-sql bg-track-sql/10 scale-[0.99]'
                  : 'border-forge-border bg-forge-bg/40 hover:bg-forge-bg hover:border-track-sql/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.md,.markdown,.txt,.json,.epub"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-14 h-14 rounded-2xl bg-forge-surface border border-forge-border flex items-center justify-center text-track-sql shadow-lg">
                {isProcessing ? (
                  <Loader2 className="w-7 h-7 animate-spin text-track-sql" />
                ) : (
                  <UploadCloud className="w-7 h-7" />
                )}
              </div>

              <div>
                <p className="text-sm font-bold text-forge-text">
                  {isProcessing ? 'Converting and structuring book...' : 'Click to select or drag and drop your book'}
                </p>
                <p className="text-xs text-forge-secondary font-mono mt-1">
                  Supports PDF, Markdown (.md), Plain Text (.txt), and JSON Books
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono text-forge-muted mt-2">
                <span className="px-2 py-0.5 rounded bg-track-pyspark/10 text-track-pyspark border border-track-pyspark/30 font-bold">.IPYNB (Jupyter)</span>
                <span className="px-2 py-0.5 rounded bg-forge-surface border border-forge-border">.PDF</span>
                <span className="px-2 py-0.5 rounded bg-forge-surface border border-forge-border">.MD</span>
                <span className="px-2 py-0.5 rounded bg-forge-surface border border-forge-border">.TXT</span>
                <span className="px-2 py-0.5 rounded bg-forge-surface border border-forge-border">.JSON</span>
              </div>

              <div className="mt-4 p-3 rounded-2xl bg-forge-bg border border-forge-border text-left w-full text-[11px] font-mono text-forge-secondary space-y-1">
                <div className="text-track-sql font-bold flex items-center gap-1.5">
                  <span>⚡ Have 100MB–200MB Notebooks or Books?</span>
                </div>
                <p className="text-[10px] text-forge-muted">
                  You can drop massive files directly into <code className="text-forge-text">dataforge/vault_storage/</code> on your computer, then click <strong>Scan & Sync Vault</strong> in the Library!
                </p>
              </div>
            </div>
          )}

          {mode === 'paste' && !parsedPreview && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-forge-secondary uppercase font-bold">Book Title</label>
                  <input
                    type="text"
                    value={pasteTitle}
                    onChange={(e) => setPasteTitle(e.target.value)}
                    placeholder="e.g. Database Internals"
                    className="w-full px-3.5 py-2 rounded-xl bg-forge-bg border border-forge-border text-xs text-forge-text focus:outline-none focus:border-track-sql"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-forge-secondary uppercase font-bold">Author</label>
                  <input
                    type="text"
                    value={pasteAuthor}
                    onChange={(e) => setPasteAuthor(e.target.value)}
                    placeholder="e.g. Alex Petrov"
                    className="w-full px-3.5 py-2 rounded-xl bg-forge-bg border border-forge-border text-xs text-forge-text focus:outline-none focus:border-track-sql"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-forge-secondary uppercase font-bold">Discipline Track</label>
                  <select
                    value={pasteTrack}
                    onChange={(e) => setPasteTrack(e.target.value as TrackType)}
                    className="w-full px-3.5 py-2 rounded-xl bg-forge-bg border border-forge-border text-xs text-forge-text focus:outline-none focus:border-track-sql"
                  >
                    <option value="architecture">Architecture & Systems</option>
                    <option value="sql">SQL & Relational</option>
                    <option value="python">Python Engineering</option>
                    <option value="pyspark">PySpark & Distributed</option>
                    <option value="warehousing">Data Warehousing</option>
                    <option value="dsa">DSA for Data Engineers</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-forge-secondary uppercase font-bold">
                  Manuscript / Chapter Text Content
                </label>
                <textarea
                  value={pasteContent}
                  onChange={(e) => setPasteContent(e.target.value)}
                  placeholder="Paste your markdown notes, book chapters, or reading materials here (use # Chapter or headings to split into chapters automatically)..."
                  rows={8}
                  className="w-full p-4 rounded-2xl bg-forge-bg border border-forge-border text-xs text-forge-text font-mono focus:outline-none focus:border-track-sql resize-none"
                />
              </div>

              <button
                onClick={handlePasteSubmit}
                disabled={isProcessing || !pasteContent.trim()}
                className="w-full py-3 rounded-2xl bg-track-sql hover:bg-blue-600 disabled:opacity-50 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Format into Reader Edition</span>
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/40 flex items-center gap-3 text-xs text-red-300 font-mono">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Parsed Preview Card */}
          {parsedPreview && (
            <div className="bg-forge-bg border border-track-sql/40 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-track-sql font-bold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Book Converted Successfully!</span>
                </div>
                <button
                  onClick={() => setParsedPreview(null)}
                  className="text-forge-secondary hover:text-forge-text text-[11px]"
                >
                  Change File / Edit
                </button>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-20 rounded-xl flex items-center justify-center text-white font-extrabold shadow-md shrink-0 text-center p-1 leading-tight text-xs"
                  style={{ backgroundColor: parsedPreview.coverColor }}
                >
                  {parsedPreview.title.substring(0, 20)}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="text-base font-extrabold text-forge-text truncate">{parsedPreview.title}</h3>
                  <p className="text-xs text-forge-secondary font-mono truncate">{parsedPreview.author}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-forge-muted">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-track-sql" />
                      {parsedPreview.chapters.length} Chapters
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-track-pyspark" />
                      ~{parsedPreview.chapters.reduce((acc, c) => acc + (parseInt(c.readingTime) || 10), 0)} min total
                    </span>
                    <span>•</span>
                    <span className="uppercase text-track-python font-bold">
                      {parsedPreview.track}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sample chapters snippet */}
              <div className="space-y-2 pt-2 border-t border-forge-border">
                <span className="text-[11px] font-mono text-forge-muted uppercase">Structured Chapters:</span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {parsedPreview.chapters.map((ch) => (
                    <div key={ch.id} className="p-2 rounded-xl bg-forge-card border border-forge-border text-xs flex justify-between items-center">
                      <span className="font-bold text-forge-text truncate pr-2">
                        Ch {ch.number}: {ch.title}
                      </span>
                      <span className="text-[10px] font-mono text-forge-secondary shrink-0">
                        {ch.readingTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save CTA */}
              <div className="pt-2">
                <button
                  onClick={handleSaveAndRead}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Save to My Library & Open Reader</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
