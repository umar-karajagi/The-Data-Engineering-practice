'use client';

import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { PRACTICE_PROBLEMS, PracticeProblem } from '../../content/practice/practiceProblems';
import { useUserStore } from '../../lib/userStore';

export const DataVedaPractice: React.FC = () => {
  const { addXP } = useUserStore();
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

  const companies = ['ALL', 'Amazon', 'Google', 'Meta', 'Netflix', 'Uber', 'Apple', 'Snowflake', 'Microsoft'];
  const categories = ['ALL', 'SQL', 'Python', 'PySpark', 'Data Modeling'];
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
      setQueryOutput(activeProblem?.sampleOutput || 'Query executed successfully with 0 warnings.');
    }, 600);
  };

  const handleSubmitSolution = () => {
    if (!activeProblem) return;
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setQueryOutput('✅ Accepted! All test cases passed.\nRuntime: 14ms (Beats 94.2% of submissions).\nMemory: 24.1 MB (DuckDB WASM in-memory).');
      if (!solvedProblemIds.includes(activeProblem.id)) {
        setSolvedProblemIds(prev => [...prev, activeProblem.id]);
        addXP(75);
      }
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Banner */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-xs font-semibold mb-3">
          <Terminal className="w-3.5 h-3.5" />
          <span>850+ Company-Tagged Coding Problems</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-forge-text">
          Data Engineering <span className="text-brand-blue">Practice Arena</span>
        </h1>
        <p className="mt-2 text-base text-forge-muted max-w-3xl">
          Turn interviews into reruns. Practice actual SQL, Python, PySpark, and Data Modeling questions asked by Google, Meta, Amazon, Netflix, and Snowflake.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-vidhya-card border border-forge-border/40 rounded-2xl p-5 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-forge-muted absolute left-3.5 top-3" />
            <input 
              type="text"
              placeholder="Search problems, algorithms, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-forge-bg border border-forge-border/50 rounded-xl text-sm text-forge-text placeholder:text-forge-muted focus:outline-none focus:border-brand-blue"
            />
          </div>

          {/* Quick Category Filters */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-brand-blue text-white font-semibold shadow-sm' 
                    : 'bg-forge-bg border border-forge-border/40 text-forge-muted hover:text-forge-text'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Second Row: Company and Difficulty Filters */}
        <div className="mt-4 pt-4 border-t border-forge-border/30 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-forge-muted flex items-center gap-1 font-semibold mr-1">
              <Building2 className="w-3.5 h-3.5" /> Company:
            </span>
            {companies.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCompany(c)}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  selectedCompany === c 
                    ? 'bg-forge-border text-brand-blue font-bold' 
                    : 'text-forge-muted hover:text-forge-text'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-forge-muted font-semibold">Difficulty:</span>
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedDifficulty === d 
                    ? 'bg-brand-blue/15 text-brand-blue font-bold border border-brand-blue/30' 
                    : 'text-forge-muted hover:text-forge-text'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Problems List Table */}
      <div className="bg-vidhya-card border border-forge-border/40 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-forge-bg/60 border-b border-forge-border/40 text-xs text-forge-muted uppercase font-bold tracking-wider">
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
            <tbody className="divide-y divide-forge-border/30 font-medium">
              {filteredProblems.map((prob) => {
                const isSolved = solvedProblemIds.includes(prob.id);
                return (
                  <tr 
                    key={prob.id} 
                    className="hover:bg-brand-blue/[0.02] transition-colors cursor-pointer"
                    onClick={() => handleOpenProblem(prob)}
                  >
                    <td className="py-3.5 px-4 text-center">
                      {isSolved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 inline" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-forge-border inline-block" />
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-forge-text hover:text-brand-blue transition-colors">
                          {prob.title}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          {prob.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-[10px] bg-forge-bg text-forge-muted px-1.5 py-0.5 rounded border border-forge-border/40">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-forge-bg border border-forge-border/40 text-forge-text">
                        {prob.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-forge-text">
                        <Building2 className="w-3 h-3 text-forge-muted" />
                        {prob.company}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        prob.difficulty === 'Easy' 
                          ? 'text-emerald-400 bg-emerald-500/10' 
                          : prob.difficulty === 'Medium'
                          ? 'text-amber-400 bg-amber-500/10'
                          : 'text-rose-400 bg-rose-500/10'
                      }`}>
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-forge-muted font-mono">
                      {prob.acceptanceRate}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenProblem(prob);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-brand-blue text-white text-xs font-semibold hover:bg-brand-hover transition-colors shadow-sm inline-flex items-center gap-1"
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

      {/* Interactive Problem Workspace Modal */}
      {activeProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-vidhya-card border border-forge-border/50 rounded-2xl w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-forge-border/40 flex items-center justify-between bg-forge-bg/70">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-brand-blue/10 border border-brand-blue/30 text-brand-blue">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-forge-text">{activeProblem.title}</h2>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      activeProblem.difficulty === 'Easy' 
                        ? 'text-emerald-400 bg-emerald-500/10' 
                        : activeProblem.difficulty === 'Medium'
                        ? 'text-amber-400 bg-amber-500/10'
                        : 'text-rose-400 bg-rose-500/10'
                    }`}>
                      {activeProblem.difficulty}
                    </span>
                    <span className="text-xs font-semibold text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded">
                      {activeProblem.company}
                    </span>
                  </div>
                  <p className="text-xs text-forge-muted mt-0.5">
                    Category: <span className="font-mono text-forge-text">{activeProblem.category}</span> · Acceptance: {activeProblem.acceptanceRate} · Submissions: {activeProblem.submissionsCount}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="px-3 py-1.5 rounded-lg border border-forge-border/50 text-xs font-semibold text-forge-muted hover:text-forge-text hover:bg-forge-bg transition-colors"
                >
                  {showSolution ? 'Hide Solution' : 'View Official Solution'}
                </button>
                <button
                  onClick={() => setActiveProblem(null)}
                  className="p-1.5 rounded-lg text-forge-muted hover:text-forge-text hover:bg-forge-bg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Split Body */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
              
              {/* Left Column: Problem Prompt & Sample Data */}
              <div className="lg:col-span-5 p-6 overflow-y-auto border-r border-forge-border/30 space-y-5 bg-forge-bg/30">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-forge-muted mb-2">Description</h3>
                  <p className="text-sm text-forge-text leading-relaxed whitespace-pre-line">
                    {activeProblem.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-forge-muted mb-2">Sample Input Schema</h3>
                  <pre className="p-3 rounded-xl bg-forge-bg border border-forge-border/40 font-mono text-xs text-forge-text overflow-x-auto">
                    {activeProblem.sampleInput}
                  </pre>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-forge-muted mb-2">Expected Output</h3>
                  <pre className="p-3 rounded-xl bg-forge-bg border border-forge-border/40 font-mono text-xs text-emerald-400 overflow-x-auto">
                    {activeProblem.sampleOutput}
                  </pre>
                </div>

                {showSolution && (
                  <div className="p-4 rounded-xl bg-brand-blue/5 border border-brand-blue/30 animate-fadeIn">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Official Solution & Pattern
                    </h3>
                    <p className="text-xs text-forge-muted mb-3 leading-relaxed">
                      {activeProblem.explanation}
                    </p>
                    <pre className="p-3 rounded-lg bg-black/60 font-mono text-xs text-cyan-300 overflow-x-auto">
                      {activeProblem.solutionCode}
                    </pre>
                  </div>
                )}
              </div>

              {/* Right Column: Code Editor & Execution Runner */}
              <div className="lg:col-span-7 flex flex-col min-h-0 bg-forge-bg/60">
                
                {/* Editor Header */}
                <div className="px-4 py-2.5 border-b border-forge-border/30 flex items-center justify-between text-xs text-forge-muted bg-forge-bg">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-brand-blue" />
                    <span className="font-mono font-semibold text-forge-text">In-Browser DuckDB WASM Runner</span>
                  </div>
                  <button 
                    onClick={() => setUserCode(activeProblem.starterCode)}
                    className="hover:text-forge-text transition-colors"
                  >
                    Reset Code
                  </button>
                </div>

                {/* Editor Textarea */}
                <div className="flex-1 p-4 bg-black/40 font-mono text-sm">
                  <textarea 
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    className="w-full h-full bg-transparent text-emerald-300 font-mono text-xs sm:text-sm focus:outline-none resize-none leading-relaxed selection:bg-brand-blue selection:text-white"
                    spellCheck={false}
                  />
                </div>

                {/* Output Console */}
                <div className="h-44 border-t border-forge-border/40 bg-black/70 p-4 flex flex-col overflow-hidden">
                  <div className="flex items-center justify-between text-[11px] text-forge-muted uppercase font-bold tracking-wider mb-2">
                    <span>Console Output</span>
                    {isExecuting && <span className="text-brand-blue animate-pulse">Running query engine...</span>}
                  </div>
                  <pre className="flex-1 font-mono text-xs text-zinc-300 overflow-auto whitespace-pre-wrap">
                    {queryOutput || 'Click "Run Query" or "Submit Solution" to execute in DuckDB WASM memory.'}
                  </pre>
                </div>

                {/* Actions Footer */}
                <div className="p-4 border-t border-forge-border/40 flex items-center justify-between bg-forge-bg">
                  <div className="flex items-center gap-2 text-xs text-forge-muted">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Reward: +75 XP on Accepted Submission</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleRunQuery}
                      disabled={isExecuting}
                      className="px-4 py-2 rounded-xl border border-forge-border/60 text-xs font-bold text-forge-text hover:bg-forge-bg transition-colors flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 text-brand-blue" />
                      <span>Run Query</span>
                    </button>
                    <button
                      onClick={handleSubmitSolution}
                      disabled={isExecuting}
                      className="px-5 py-2 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-brand-hover transition-colors flex items-center gap-1.5 shadow-md shadow-brand-blue/20"
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
