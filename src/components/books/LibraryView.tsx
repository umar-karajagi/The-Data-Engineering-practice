'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Layers, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  Lock, 
  Unlock,
  BookMarked,
  ArrowRight,
  ShieldCheck,
  Flame,
  Award,
  RefreshCw,
  Table as TableIcon,
  LayoutGrid,
  Terminal,
  FolderSync,
  Rotate3d
} from 'lucide-react';
import { FOUNDATIONAL_BOOKS } from '../../content/books';
import { BookReference, TrackType } from '../../types';
import { Crazy3DBookReader } from './Crazy3DBookReader';
import { BookReader } from './BookReader';
import { NotebookReader } from './NotebookReader';
import { FunPdfReader } from './FunPdfReader';
import { MasterCatalogTable } from './MasterCatalogTable';
import { AddBookModal } from './AddBookModal';
import { getCustomBooks, deleteCustomBook, getReadingProgress } from '../../lib/libraryStorage';
import { ContentRef } from '../../types';

interface LibraryViewProps {
  initialBookId?: string;
  onNavigatePractice?: (practiceId: string) => void;
  onAddXP?: (amount: number) => void;
  onOpenQuickNote?: (ref?: ContentRef) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ 
  initialBookId, 
  onNavigatePractice, 
  onAddXP,
  onOpenQuickNote 
}) => {
  // Books collection
  const [customBooks, setCustomBooks] = useState<BookReference[]>([]);
  const [vaultBooks, setVaultBooks] = useState<BookReference[]>([]);
  const [activeBook, setActiveBook] = useState<BookReference | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedTrack, setSelectedTrack] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'shelf' | 'catalog'>('shelf');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  // Sync server-side vault storage
  const syncVaultStorage = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/vault/scan');
      if (res.ok) {
        const data = await res.json();
        if (data.items) {
          setVaultBooks(data.items);
          setSyncStatusMsg(`Synced ${data.items.length} items from vault_storage/`);
          setTimeout(() => setSyncStatusMsg(null), 3500);
        }
      }
    } catch (e) {
      console.warn('Vault scan endpoint offline or failed', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Load custom books and scan vault on mount
  useEffect(() => {
    const loaded = getCustomBooks();
    setCustomBooks(loaded);
    syncVaultStorage();
  }, []);

  // Combined books: vault books + user client custom books + foundational texts
  const allBooksMap = new Map<string, BookReference>();
  
  // 1. Foundational books
  FOUNDATIONAL_BOOKS.forEach(b => allBooksMap.set(b.id, b));
  // 2. Client custom books
  customBooks.forEach(b => allBooksMap.set(b.id, b));
  // 3. Server vault books (merge if matching originalFileName or title, else add as new)
  vaultBooks.forEach(v => {
    const existingKey = Array.from(allBooksMap.keys()).find(k => {
      const existing = allBooksMap.get(k);
      if (!existing) return false;
      if (existing.originalFileName && v.originalFileName && existing.originalFileName === v.originalFileName) return true;
      if (existing.title && v.title && existing.title.toLowerCase().trim() === v.title.toLowerCase().trim()) return true;
      return false;
    });

    if (existingKey) {
      const existing = allBooksMap.get(existingKey)!;
      allBooksMap.set(existingKey, {
        ...existing,
        ...v,
        id: existing.id,
        pdfUrl: v.pdfUrl || existing.pdfUrl,
        formatType: v.formatType || existing.formatType || 'pdf',
        fileSizeFormatted: v.fileSizeFormatted || existing.fileSizeFormatted,
        conceptCards: (v.conceptCards && v.conceptCards.length > 0) ? v.conceptCards : existing.conceptCards,
        quizQuestions: (v.quizQuestions && v.quizQuestions.length > 0) ? v.quizQuestions : existing.quizQuestions,
        chapters: (existing.chapters && existing.chapters.length > 0) ? existing.chapters : (v.chapters || []),
      });
    } else {
      allBooksMap.set(v.id, v);
    }
  });

  const allBooks = Array.from(allBooksMap.values());

  // Handle opening initial book
  useEffect(() => {
    if (initialBookId && allBooks.length > 0) {
      const target = allBooks.find(b => b.id === initialBookId);
      if (target) {
        setActiveBook(target);
      }
    }
  }, [initialBookId, allBooks.length]);

  const handleBookAdded = (newBook: BookReference) => {
    setCustomBooks(prev => [newBook, ...prev]);
    setActiveBook(newBook);
    syncVaultStorage();
  };

  const handleDeleteCustom = (e: React.MouseEvent, bookId: string) => {
    e.stopPropagation();
    if (window.confirm('Remove this book from your personal library vault?')) {
      deleteCustomBook(bookId);
      setCustomBooks(prev => prev.filter(b => b.id !== bookId));
      setVaultBooks(prev => prev.filter(b => b.id !== bookId));
      if (activeBook?.id === bookId) {
        setActiveBook(null);
      }
    }
  };

  // Filter books for Shelf view
  const filteredBooks = allBooks.filter(book => {
    const isNb = book.isNotebook || book.formatType === 'notebook';
    const concepts = (book.coreConcepts || []).map(c => c.toLowerCase());
    const matchesTrack = 
      selectedTrack === 'ALL' ? true :
      selectedTrack === 'notebooks' ? isNb :
      selectedTrack === 'custom' ? book.isCustom :
      selectedTrack === 'streaming' ? (concepts.some(c => c.includes('streaming') || c.includes('kafka')) || book.track === 'pyspark') :
      selectedTrack === 'dbt' ? (concepts.some(c => c.includes('dbt') || c.includes('warehousing')) || book.track === 'warehousing') :
      selectedTrack === 'dataops' ? (concepts.some(c => c.includes('test') || c.includes('quality') || c.includes('ci/cd') || c.includes('ops'))) :
      selectedTrack === 'cloud' ? (concepts.some(c => c.includes('cloud') || c.includes('aws') || c.includes('azure') || c.includes('terraform')) || book.track === 'azure') :
      selectedTrack === 'graph' ? (concepts.some(c => c.includes('graph') || c.includes('vector'))) :
      selectedTrack === 'systemdesign' ? (concepts.some(c => c.includes('design') || c.includes('architecture')) || book.track === 'architecture') :
      book.track === selectedTrack;

    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.originalFileName && book.originalFileName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      book.coreConcepts.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTrack && matchesSearch;
  });

  const totalChapters = allBooks.reduce((acc, b) => acc + (b.chapters?.length || 0), 0);
  const notebookCount = allBooks.filter(b => b.isNotebook || b.formatType === 'notebook').length;

  // Active Reading View
  if (activeBook) {
    if (activeBook.isNotebook || activeBook.formatType === 'notebook') {
      return (
        <NotebookReader
          book={activeBook}
          onBackToLibrary={() => setActiveBook(null)}
        />
      );
    }

    return (
      <Crazy3DBookReader
        book={activeBook}
        onBackToLibrary={() => setActiveBook(null)}
        onNavigatePractice={onNavigatePractice}
        onAddXP={onAddXP}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Library Banner */}
      <div className="bg-forge-card border border-forge-border rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 font-mono text-xs text-track-sql">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold uppercase">
              Digital Library & Notebook Vault
            </span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1 font-bold">
              <Unlock className="w-3.5 h-3.5" />
              100% Unlocked Open Access Vault
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-forge-text tracking-tight">
            Data Engineering Master Literature & Notebooks
          </h1>

          <p className="text-xs sm:text-sm text-forge-secondary leading-relaxed">
            Distraction-free Crazy 3D interactive e-reader and Jupyter Notebook studio. Read complete technical books, research papers, and interactive notebooks with true 3D page flip physics and unlocked open access.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-forge-muted">
            <span className="flex items-center gap-1.5 text-forge-text font-bold">
              <BookOpen className="w-4 h-4 text-track-sql" />
              {allBooks.length} Total Literature Items
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-track-pyspark font-bold">
              <Terminal className="w-4 h-4" />
              {notebookCount} Jupyter Notebooks
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-track-python font-bold">
              <Sparkles className="w-4 h-4" />
              13 Foundational Books
            </span>
          </div>
        </div>

        {/* Action Buttons: Add Book & Sync Vault */}
        <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-track-sql hover:bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Book / Notebook</span>
          </button>

          <button
            onClick={syncVaultStorage}
            disabled={isSyncing}
            className="px-4 py-2.5 rounded-xl bg-forge-bg hover:bg-forge-surface border border-forge-border text-forge-secondary hover:text-forge-text text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all"
            title="Scan dataforge/vault_storage folder on your computer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-track-sql' : ''}`} />
            <span>{isSyncing ? 'Syncing Vault...' : 'Scan & Sync Vault'}</span>
          </button>

          {syncStatusMsg && (
            <div className="text-[10px] font-mono text-emerald-400 text-center flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{syncStatusMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* View Mode Switcher: Visual Bookshelf vs Master Catalog Table */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-forge-border pb-4">
        
        {/* Toggle Pills */}
        <div className="flex items-center bg-forge-card border border-forge-border rounded-2xl p-1 text-xs font-mono">
          <button
            onClick={() => setViewMode('shelf')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
              viewMode === 'shelf'
                ? 'bg-forge-bg text-track-sql shadow-sm border border-forge-border'
                : 'text-forge-secondary hover:text-forge-text'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Visual Bookshelf</span>
          </button>

          <button
            onClick={() => setViewMode('catalog')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
              viewMode === 'catalog'
                ? 'bg-forge-bg text-track-sql shadow-sm border border-forge-border'
                : 'text-forge-secondary hover:text-forge-text'
            }`}
          >
            <TableIcon className="w-4 h-4 text-track-pyspark" />
            <span>Master Catalog & Inventory ({allBooks.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-forge-muted">
          <Lock className="w-3.5 h-3.5 text-track-warehousing" />
          <span>Local Vault: <code className="text-forge-text">dataforge/vault_storage/</code></span>
        </div>

      </div>

      {/* Render selected view */}
      {viewMode === 'catalog' ? (
        <MasterCatalogTable
          books={allBooks}
          onSelectBook={(b) => setActiveBook(b)}
          onSyncVault={syncVaultStorage}
          isSyncing={isSyncing}
        />
      ) : (
        <div className="space-y-6">
          
          {/* Track Filter Pills & Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {[
                { id: 'ALL', label: 'All Literature' },
                { id: 'notebooks', label: `Notebooks (${notebookCount})` },
                { id: 'sql', label: '1. Relational DBs & SQL' },
                { id: 'warehousing', label: '2. Warehousing & Modeling' },
                { id: 'architecture', label: '3. Distributed Systems' },
                { id: 'pyspark', label: '4. Big Data & PySpark' },
                { id: 'python', label: '5. Python & Systems Eng' },
                { id: 'streaming', label: '6. Streaming & Kafka' },
                { id: 'dbt', label: '7. Analytics & dbt' },
                { id: 'dataops', label: '8. Data Quality & DataOps' },
                { id: 'cloud', label: '9. Cloud & Terraform' },
                { id: 'graph', label: '10. Graph & Vector DBs' },
                { id: 'systemdesign', label: '11. System Design' },
              ].map((track) => (
                <button
                  key={track.id}
                  onClick={() => setSelectedTrack(track.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                    selectedTrack === track.id
                      ? 'bg-forge-bg text-track-sql border-track-sql shadow-sm'
                      : 'bg-forge-card text-forge-secondary hover:text-forge-text border-forge-border'
                  }`}
                >
                  {track.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72 shrink-0">
              <Search className="w-3.5 h-3.5 text-forge-muted absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, notebook, concept..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-forge-card border border-forge-border text-xs text-forge-text font-mono focus:outline-none focus:border-track-sql"
              />
            </div>
          </div>

          {/* Book & Notebook Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => {
              const isNb = book.isNotebook || book.formatType === 'notebook';
              const progress = getReadingProgress(book.id);
              const completedCount = progress?.completedChapterIds?.length || 0;
              const pct = book.chapters.length > 0 
                ? Math.round((completedCount / book.chapters.length) * 100) 
                : 0;

              return (
                <div
                  key={book.id}
                  onClick={() => setActiveBook(book)}
                  className="bg-forge-card border border-forge-border rounded-3xl p-6 space-y-4 hover:border-track-sql/60 transition-all cursor-pointer shadow-lg hover:shadow-2xl flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Top Accent Strip */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1.5 transition-all group-hover:h-2"
                    style={{ backgroundColor: book.coverColor }}
                  />

                  <div className="space-y-4">
                    {/* Header: Track & Custom / Notebook Tag */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-forge-bg border border-forge-border text-forge-secondary">
                          {book.track}
                        </span>

                        {isNb && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-track-pyspark/10 text-track-pyspark border border-track-pyspark/30 flex items-center gap-1">
                            <Terminal className="w-2.5 h-2.5" />
                            Notebook
                          </span>
                        )}

                        {book.fileSizeFormatted && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-track-warehousing/10 text-track-warehousing border border-track-warehousing/30 font-bold">
                            {book.fileSizeFormatted}
                          </span>
                        )}
                      </div>

                      {book.isCustom && (
                        <button
                          onClick={(e) => handleDeleteCustom(e, book.id)}
                          className="p-1.5 rounded-lg text-forge-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Remove from vault"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* 3D Spine & Title */}
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-16 h-22 rounded-xl flex flex-col justify-between p-2 text-white font-bold shadow-xl shrink-0 group-hover:scale-105 transition-transform"
                        style={{ 
                          background: `linear-gradient(135deg, ${book.coverColor} 0%, #0D1117 140%)`,
                          borderLeft: '3px solid rgba(255,255,255,0.3)'
                        }}
                      >
                        {isNb ? <Terminal className="w-4 h-4 opacity-80" /> : <BookMarked className="w-4 h-4 opacity-80" />}
                        <span className="text-[9px] font-mono font-extrabold uppercase leading-tight line-clamp-2">
                          {book.title}
                        </span>
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <h3 className="text-base font-extrabold text-forge-text group-hover:text-track-sql transition-colors line-clamp-2">
                          {book.title}
                        </h3>
                        <p className="text-xs text-forge-secondary font-mono truncate">
                          {book.author}
                        </p>
                        <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-forge-muted">
                          {isNb && book.totalCells ? (
                            <span>{book.totalCells} Cells</span>
                          ) : (
                            <span>{book.chapters.length} Chapters</span>
                          )}
                          <span>•</span>
                          <span>{book.isCustom ? 'Protected Vault' : 'Seminal Text'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Core Concepts */}
                    {book.coreConcepts && book.coreConcepts.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {book.coreConcepts.slice(0, 3).map((concept, idx) => (
                          <span 
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-forge-bg text-forge-muted border border-forge-border/60 truncate max-w-[140px]"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Action */}
                  <div className="pt-4 border-t border-forge-border">
                    <button
                      className="w-full py-2.5 rounded-xl bg-forge-bg group-hover:bg-track-sql group-hover:text-white border border-forge-border group-hover:border-track-sql text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <span>{isNb ? 'Open Interactive Notebook' : 'Open in E-Reader'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-16 bg-forge-card border border-forge-border rounded-3xl space-y-3">
              <BookOpen className="w-10 h-10 text-forge-muted mx-auto opacity-40" />
              <h3 className="text-sm font-bold text-forge-text">No matching literature found</h3>
              <p className="text-xs text-forge-secondary font-mono">
                Drop your 100–200MB notebooks into <code className="text-track-sql">vault_storage/</code> or click Add Book.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-track-sql text-white text-xs font-mono font-bold inline-flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Book / Notebook</span>
              </button>
            </div>
          )}

        </div>
      )}

      {/* Add Book / Notebook Modal */}
      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onBookAdded={handleBookAdded}
      />

    </div>
  );
};
