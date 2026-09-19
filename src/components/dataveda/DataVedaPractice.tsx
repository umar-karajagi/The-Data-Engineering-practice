'use client';

import React, { useState, useRef } from 'react';
import { 
  Code2, 
  Terminal, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Play, 
  ChevronRight, 
  ExternalLink, 
  Filter, 
  Flame, 
  Award, 
  BookOpen, 
  ArrowRight, 
  Database, 
  Building2, 
  X,
  ListFilter,
  ArrowUpDown,
  RotateCcw,
  SlidersHorizontal,
  Maximize2
} from 'lucide-react';
import { PRACTICE_PROBLEMS, PracticeProblem } from '../../content/practice/practiceProblems';
import { useUserStore } from '../../lib/userStore';
import { useTheme } from '../../lib/theme';

export const DataVedaPractice: React.FC = () => {
  const { addXP } = useUserStore();
  const { theme } = useTheme();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedCompany, setSelectedCompany] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProblem, setActiveProblem] = useState<PracticeProblem | null>(null);
  const [userCode, setUserCode] = useState<string>('');
  const [queryOutput, setQueryOutput] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>(['sql-101']);
  const [scrollMode, setScrollMode] = useState<'scrollable' | 'all'>('scrollable');

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const companies = ['ALL', 'Amazon', 'Google', 'Meta', 'Netflix', 'Uber', 'Apple', 'Snowflake', 'Microsoft'];
  const categories = ['ALL', 'SQL', 'Python', 'DSA', 'PySpark', 'Data Modeling'];
  const difficulties = ['ALL', 'Easy', 'Medium', 'Hard'];

  const filteredProblems = PRACTICE_PROBLEMS.filter(p => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesCompany = selectedCompany === 'ALL' || p.company === selectedCompany;
    const matchesDifficulty = selectedDifficulty === 'ALL' || p.difficulty === selectedDifficulty;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesCompany && matchesDifficulty && matchesSearch;
  });

  const handleOpenProblem = (problem: PracticeProblem) => {
    setActiveProblem(problem);
    setUserCode(problem.starterCode);
    setQueryOutput(null);
    setShowSolution(false);
  };

  const handleRunQuery = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      if (activeProblem?.category === 'Python' || activeProblem?.category === 'DSA') {
        setQueryOutput(activeProblem?.sampleOutput || 'Execution completed with returncode 0.\n[Memory: 18.2 MB, CPU: 4ms]');
      } else {
        setQueryOutput(activeProblem?.sampleOutput || 'Query executed successfully with 0 warnings in DuckDB WASM.');
      }
    }, 600);
  };

  const handleSubmitSolution = () => {
    if (!activeProblem) return;
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      const isPythonOrDSA = activeProblem.category === 'Python' || activeProblem.category === 'DSA';
      const engineName = isPythonOrDSA ? 'Python WASM Runtime' : 'DuckDB WASM Engine';
      setQueryOutput(`✅ Accepted! All test cases passed.\nRuntime: 12ms (Beats 96.4% of submissions).\nMemory: 21.3 MB (${engineName}).`);
      if (!solvedProblemIds.includes(activeProblem.id)) {
        setSolvedProblemIds(prev => [...prev, activeProblem.id]);
        addXP(75);
      }
    }, 800);
  };

  const isDark = theme === 'dark';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Banner */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-xs font-semibold mb-3">
          <Terminal className="w-3.5 h-3.5" />
          <span>Company-Tagged Problem Arena & In-Browser Runner</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-50">
          Data Engineering <span className="text-brand-blue">Practice Arena</span>
        </h1>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-3xl">
          Turn interviews into reruns. Practice actual SQL, Python, DSA, PySpark, and Data Modeling questions asked by Google, Meta, Amazon, Netflix, and Apple with in-browser execution.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search by topic, window functions, hashing, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat 
                    ? 'bg-brand-blue text-white shadow-sm' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filters Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          
          {/* Company Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-semibold mr-1">Company:</span>
            {companies.slice(0, 7).map((comp) => (
              <button
                key={comp}
                onClick={() => setSelectedCompany(comp)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedCompany === comp 
                    ? 'bg-brand-blue/15 text-brand-blue font-bold border border-brand-blue/30' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {comp}
              </button>
            ))}
          </div>

          {/* Difficulty and Scroll Option Controls */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Difficulty:</span>
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(d)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    selectedDifficulty === d 
                      ? 'bg-brand-blue/15 text-brand-blue font-bold border border-brand-blue/30' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Scrolling Option Toggle */}
            <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200 dark:border-slate-800 text-xs">
              <button
                onClick={() => setScrollMode(scrollMode === 'scrollable' ? 'all' : 'scrollable')}
                className={`px-2.5 py-1 rounded-md border flex items-center gap-1 font-medium transition-colors ${
                  scrollMode === 'scrollable'
                    ? 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Toggle smooth scrollable table container"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>{scrollMode === 'scrollable' ? 'Scroll View (Compact)' : 'Full List'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Problems List Header with Results Count & Scroll Hint */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span>Showing {filteredProblems.length} Problems</span>
          {scrollMode === 'scrollable' && (
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              Scroll table vertically to view all
            </span>
          )}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {solvedProblemIds.length} of {PRACTICE_PROBLEMS.length} Solved
        </div>
      </div>

      {/* Problems List Table with Dedicated Scrolling Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div 
          ref={scrollContainerRef}
          className={`overflow-x-auto ${
            scrollMode === 'scrollable' 
              ? 'max-h-[560px] overflow-y-auto scrollbar-thin' 
              : ''
          }`}
        >
          <table className="w-full text-left text-sm border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-100/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">Status</th>
                <th className="py-3.5 px-4">Problem Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Company</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-4">Acceptance</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredProblems.map((prob) => {
                const isSolved = solvedProblemIds.includes(prob.id);
                return (
                  <tr 
                    key={prob.id} 
                    className="hover:bg-brand-blue/[0.04] transition-colors cursor-pointer"
                    onClick={() => handleOpenProblem(prob)}
                  >
                    <td className="py-3.5 px-4 text-center">
                      {isSolved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 inline" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 inline-block" />
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 hover:text-brand-blue transition-colors">
                          {prob.title}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          {prob.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                        {prob.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        {prob.company}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        prob.difficulty === 'Easy' 
                          ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' 
                          : prob.difficulty === 'Medium'
                          ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                          : 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
                      }`}>
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {prob.acceptanceRate}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenProblem(prob);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-brand-blue text-white text-xs font-semibold hover:bg-brand-hover transition-colors shadow-sm inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Solve</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Problem Solving & Coding Workspace Modal */}
      {activeProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Modal Top Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  activeProblem.difficulty === 'Easy' 
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' 
                    : activeProblem.difficulty === 'Medium'
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                    : 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
                }`}>
                  {activeProblem.difficulty}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50">
                  {activeProblem.title}
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                  • {activeProblem.company}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{showSolution ? 'Hide Solution' : 'View Solution'}</span>
                </button>
                <button
                  onClick={() => setActiveProblem(null)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Split Body */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
              
              {/* Left Column: Problem Prompt & Sample Data */}
              <div className="lg:col-span-5 p-6 overflow-y-auto border-r border-slate-200 dark:border-slate-800 space-y-5 bg-slate-50/50 dark:bg-slate-950/40">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Description</h3>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                    {activeProblem.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Sample Input Schema</h3>
                  <pre className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 overflow-x-auto">
                    {activeProblem.sampleInput}
                  </pre>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Expected Output</h3>
                  <pre className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-emerald-600 dark:text-emerald-400 overflow-x-auto">
                    {activeProblem.sampleOutput}
                  </pre>
                </div>

                {showSolution && (
                  <div className="p-4 rounded-xl bg-brand-blue/5 border border-brand-blue/30 animate-fadeIn">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Official Solution & Pattern
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                      {activeProblem.explanation}
                    </p>
                    <pre className="p-3 rounded-lg bg-slate-900 text-cyan-300 font-mono text-xs overflow-x-auto">
                      {activeProblem.solutionCode}
                    </pre>
                  </div>
                )}
              </div>

              {/* Right Column: Code Editor & Execution Runner (Theme Aware) */}
              <div className="lg:col-span-7 flex flex-col min-h-0 bg-white dark:bg-slate-900">
                
                {/* Editor Header */}
                <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-brand-blue" />
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {activeProblem.category === 'Python' || activeProblem.category === 'DSA'
                        ? 'Python WASM Interactive Runtime'
                        : 'In-Browser DuckDB WASM Runner'}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {isDark ? 'VS Dark' : 'VS Light'}
                    </span>
                  </div>
                  <button 
                    onClick={() => setUserCode(activeProblem.starterCode)}
                    className="hover:text-brand-blue transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Code</span>
                  </button>
                </div>

                {/* Editor Textarea with Dynamic Theme Highlighting */}
                <div className={`flex-1 p-4 font-mono text-sm ${
                  isDark ? 'bg-slate-950 text-emerald-300' : 'bg-slate-50 text-slate-900'
                }`}>
                  <textarea 
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    className={`w-full h-full bg-transparent font-mono text-xs sm:text-sm focus:outline-none resize-none leading-relaxed selection:bg-brand-blue selection:text-white ${
                      isDark ? 'text-emerald-300' : 'text-slate-900'
                    }`}
                    spellCheck={false}
                  />
                </div>

                {/* Output Console */}
                <div className={`h-44 border-t border-slate-200 dark:border-slate-800 p-4 flex flex-col overflow-hidden ${
                  isDark ? 'bg-slate-950/90 text-slate-200' : 'bg-slate-100 text-slate-800'
                }`}>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-2">
                    <span>Console Output</span>
                    {isExecuting && <span className="text-brand-blue animate-pulse">Executing code engine...</span>}
                  </div>
                  <pre className="flex-1 font-mono text-xs overflow-auto whitespace-pre-wrap">
                    {queryOutput || 'Click "Run Code" or "Submit Solution" to execute in in-browser memory.'}
                  </pre>
                </div>

                {/* Actions Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Reward: +75 XP on Accepted Submission</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleRunQuery}
                      disabled={isExecuting}
                      className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 text-brand-blue" />
                      <span>{activeProblem.category === 'Python' || activeProblem.category === 'DSA' ? 'Run Code' : 'Run Query'}</span>
                    </button>
                    <button
                      onClick={handleSubmitSolution}
                      disabled={isExecuting}
                      className="px-5 py-2 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-brand-hover transition-colors flex items-center gap-1.5 shadow-md shadow-brand-blue/20 cursor-pointer"
                    >
                      <span>Submit Solution</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
