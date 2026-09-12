'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Terminal, 
  FileText, 
  ShieldCheck, 
  Lock, 
  Search, 
  ArrowUpDown, 
  ArrowRight, 
  Layers, 
  Clock, 
  HardDrive, 
  Sparkles,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { BookReference } from '../../types';

interface MasterCatalogTableProps {
  books: BookReference[];
  onSelectBook: (book: BookReference) => void;
  onSyncVault?: () => void;
  isSyncing?: boolean;
}

export const MasterCatalogTable: React.FC<MasterCatalogTableProps> = ({
  books,
  onSelectBook,
  onSyncVault,
  isSyncing = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState<'all' | 'notebook' | 'book' | 'large'>('all');
  const [sortBy, setSortBy] = useState<'title' | 'size' | 'volume'>('size');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Metrics
  const notebookCount = books.filter(b => b.isNotebook || b.formatType === 'notebook').length;
  const totalCells = books.reduce((acc, b) => acc + (b.totalCells || 0), 0);
  const totalChapters = books.reduce((acc, b) => acc + (b.chapters?.length || 0), 0);
  const totalSizeBytes = books.reduce((acc, b) => acc + (b.fileSizeBytes || 0), 0);

  const formatTotalSize = (bytes: number) => {
    if (bytes === 0) return 'Literature Catalog';
    const mb = (bytes / (1024 * 1024)).toFixed(1);
    return `${mb} MB`;
  };

  // Filter & Sort
  const filtered = books.filter(b => {
    const isNb = b.isNotebook || b.formatType === 'notebook';
    const matchesFormat = 
      formatFilter === 'all' ? true :
      formatFilter === 'notebook' ? isNb :
      formatFilter === 'book' ? !isNb :
      formatFilter === 'large' ? (b.fileSizeBytes || 0) > 20 * 1024 * 1024 : true;

    const matchesSearch = 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.originalFileName && b.originalFileName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b.coreConcepts.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFormat && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    let comp = 0;
    if (sortBy === 'size') {
      comp = (a.fileSizeBytes || 0) - (b.fileSizeBytes || 0);
    } else if (sortBy === 'volume') {
      const volA = (a.totalCells || a.chapters?.length || 0);
      const volB = (b.totalCells || b.chapters?.length || 0);
      comp = volA - volB;
    } else {
      comp = a.title.localeCompare(b.title);
    }
    return sortOrder === 'asc' ? comp : -comp;
  });

  const toggleSort = (col: 'title' | 'size' | 'volume') => {
    if (sortBy === col) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-forge-card border border-forge-border rounded-2xl p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono text-forge-muted">
            <BookOpen className="w-3.5 h-3.5 text-track-sql" />
            <span>TOTAL LITERATURE</span>
          </div>
          <p className="text-xl font-extrabold text-forge-text font-mono">{books.length} Items</p>
          <p className="text-[10px] text-forge-muted font-mono">{notebookCount} Notebooks, {books.length - notebookCount} Books</p>
        </div>

        <div className="bg-forge-card border border-forge-border rounded-2xl p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono text-forge-muted">
            <Terminal className="w-3.5 h-3.5 text-track-pyspark" />
            <span>CELLS & CHAPTERS</span>
          </div>
          <p className="text-xl font-extrabold text-track-pyspark font-mono">{totalCells > 0 ? `${totalCells} Cells` : `${totalChapters} Ch`}</p>
          <p className="text-[10px] text-forge-muted font-mono">{totalChapters} Structured Chapters</p>
        </div>

        <div className="bg-forge-card border border-forge-border rounded-2xl p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono text-forge-muted">
            <HardDrive className="w-3.5 h-3.5 text-track-warehousing" />
            <span>STORAGE FOOTPRINT</span>
          </div>
          <p className="text-xl font-extrabold text-track-warehousing font-mono">{formatTotalSize(totalSizeBytes)}</p>
          <p className="text-[10px] text-forge-muted font-mono">100–200MB Vault Capable</p>
        </div>

        <div className="bg-forge-card border border-forge-border rounded-2xl p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono text-forge-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>SECURITY LEVEL</span>
          </div>
          <p className="text-xl font-extrabold text-emerald-400 font-mono">100% DRM</p>
          <p className="text-[10px] text-forge-muted font-mono">Zero Public Downloads</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Format tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: `All Catalog (${books.length})` },
            { id: 'notebook', label: `Jupyter Notebooks (${notebookCount})` },
            { id: 'book', label: `Core Literature (${books.length - notebookCount})` },
            { id: 'large', label: 'Large Files (>20MB)' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFormatFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                formatFilter === f.id
                  ? 'bg-forge-bg text-track-sql border-track-sql shadow-sm'
                  : 'bg-forge-card text-forge-secondary hover:text-forge-text border-forge-border'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="w-3.5 h-3.5 text-forge-muted absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inventory, filename, author..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-forge-card border border-forge-border text-xs text-forge-text font-mono focus:outline-none focus:border-track-sql"
          />
        </div>

      </div>

      {/* Structured Master Inventory Table */}
      <div className="bg-forge-card border border-forge-border rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            
            {/* Table Header */}
            <thead className="bg-forge-bg border-b border-forge-border text-forge-muted uppercase tracking-wider text-[10px]">
              <tr>
                <th 
                  onClick={() => toggleSort('title')} 
                  className="py-3.5 px-5 cursor-pointer hover:text-forge-text transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Title & Manuscript</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Format / Engine</th>
                <th className="py-3.5 px-4">Track</th>
                <th 
                  onClick={() => toggleSort('size')} 
                  className="py-3.5 px-4 cursor-pointer hover:text-forge-text transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Size</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  onClick={() => toggleSort('volume')} 
                  className="py-3.5 px-4 cursor-pointer hover:text-forge-text transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Volume</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">DRM Protection</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-forge-border/60">
              {sorted.map((item) => {
                const isNb = item.isNotebook || item.formatType === 'notebook';

                return (
                  <tr 
                    key={item.id}
                    onClick={() => onSelectBook(item)}
                    className="hover:bg-forge-surface/50 cursor-pointer transition-colors group"
                  >
                    {/* Title */}
                    <td className="py-4 px-5 max-w-xs">
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5"
                          style={{ backgroundColor: item.coverColor }}
                        >
                          {isNb ? <Terminal className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-forge-text group-hover:text-track-sql transition-colors truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-forge-secondary truncate">
                            {item.author} {item.originalFileName ? `• ${item.originalFileName}` : ''}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Format */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {isNb ? (
                        <span className="px-2 py-0.5 rounded bg-track-pyspark/10 text-track-pyspark border border-track-pyspark/30 font-bold text-[10px]">
                          Jupyter .ipynb [{item.kernelLanguage || 'python'}]
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-forge-bg text-forge-secondary border border-forge-border text-[10px]">
                          {item.formatType?.toUpperCase() || 'BOOK'}
                        </span>
                      )}
                    </td>

                    {/* Track */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="capitalize font-bold text-forge-text">
                        {item.track}
                      </span>
                    </td>

                    {/* Size */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {item.fileSizeFormatted ? (
                        <span className="font-bold text-track-warehousing">
                          {item.fileSizeFormatted}
                        </span>
                      ) : (
                        <span className="text-forge-muted text-[11px]">Structured Text</span>
                      )}
                    </td>

                    {/* Volume */}
                    <td className="py-4 px-4 whitespace-nowrap text-forge-secondary">
                      {item.totalCells ? (
                        <span className="text-forge-text font-bold">{item.totalCells} Cells</span>
                      ) : (
                        <span>{item.chapters.length} Chapters</span>
                      )}
                    </td>

                    {/* DRM Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                        <Lock className="w-3 h-3 text-track-warehousing" />
                        <span>Zero-Download</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <button className="px-3 py-1.5 rounded-xl bg-forge-bg group-hover:bg-track-sql group-hover:text-white border border-forge-border group-hover:border-track-sql text-[11px] font-bold inline-flex items-center gap-1.5 transition-all shadow-sm">
                        <span>{isNb ? 'Open Studio' : 'Read'}</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-16 text-forge-muted text-xs font-mono">
            No matching items found in the master catalog.
          </div>
        )}

      </div>

    </div>
  );
};
