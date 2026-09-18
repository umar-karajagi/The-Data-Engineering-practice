'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  Code2, 
  ChevronDown, 
  ChevronUp, 
  Building2,
  Clock,
  BookOpen,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { INTERVIEW_QUESTIONS, TECH_GUIDES, InterviewQuestion, TechGuide } from '../../content/resources/interviewQuestions';

export const DataVedaResources: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'interview' | 'guides'>('interview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>('de-q1');
  const [activeGuideModal, setActiveGuideModal] = useState<TechGuide | null>(null);

  const categories = ['ALL', 'General DE', 'SQL', 'PySpark', 'Airflow', 'Kafka', 'System Design'];

  const filteredQuestions = INTERVIEW_QUESTIONS.filter(q => {
    const matchesCat = selectedCategory === 'ALL' || q.category === selectedCategory;
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.companies.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const filteredGuides = TECH_GUIDES.filter(g => {
    return g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           g.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
           g.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-xs font-semibold mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Knowledge & Interview Vault</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-forge-text">
          Tech Guides & <span className="text-brand-blue">Interview Prep Hub</span>
        </h1>
        <p className="mt-2 text-base text-forge-muted max-w-3xl">
          Everything you need for technical rounds. 100+ company-verified data engineer interview questions, code snippets, system design templates, and architecture guides.
        </p>
      </div>

      {/* Main Switcher: Interview Questions vs Tech Guides */}
      <div className="flex items-center gap-4 mb-8 border-b border-forge-border/40 pb-4">
        <button
          onClick={() => setActiveTab('interview')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'interview' 
              ? 'bg-brand-blue text-white shadow-sm' 
              : 'text-forge-muted hover:text-forge-text'
          }`}
        >
          100+ Interview Questions Bank
        </button>
        <button
          onClick={() => setActiveTab('guides')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'guides' 
              ? 'bg-brand-blue text-white shadow-sm' 
              : 'text-forge-muted hover:text-forge-text'
          }`}
        >
          Tech Guides & Architecture Articles
        </button>
      </div>

      {/* Search and Category Filters */}
      <div className="bg-vidhya-card border border-forge-border/40 rounded-2xl p-5 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-forge-muted absolute left-3.5 top-3" />
            <input 
              type="text"
              placeholder="Search interview questions, tools, or concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-forge-bg border border-forge-border/50 rounded-xl text-sm text-forge-text placeholder:text-forge-muted focus:outline-none focus:border-brand-blue"
            />
          </div>

          {activeTab === 'interview' && (
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
          )}
        </div>
      </div>

      {/* TAB 1: INTERVIEW QUESTIONS ACCORDION */}
      {activeTab === 'interview' && (
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const isExpanded = expandedQuestionId === q.id;
            return (
              <div 
                key={q.id}
                className="bg-vidhya-card border border-forge-border/40 rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <div 
                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-brand-blue/[0.02] transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-blue/10 text-brand-blue">
                        {q.category}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        q.difficulty === 'Easy' 
                          ? 'text-emerald-400 bg-emerald-500/10' 
                          : q.difficulty === 'Medium'
                          ? 'text-amber-400 bg-amber-500/10'
                          : 'text-rose-400 bg-rose-500/10'
                      }`}>
                        {q.difficulty}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-forge-muted ml-2">
                        <Building2 className="w-3 h-3" />
                        <span>{q.companies.join(', ')}</span>
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-forge-text">
                      {q.title}
                    </h3>
                  </div>

                  <button className="p-2 rounded-lg text-forge-muted hover:text-forge-text">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-forge-border/30 bg-forge-bg/40 animate-fadeIn space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-forge-muted mb-1">Question Prompt</h4>
                      <p className="text-sm text-forge-text font-medium leading-relaxed">
                        {q.question}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-vidhya-card border border-forge-border/40">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> High-Scoring Interview Answer
                      </h4>
                      <p className="text-sm text-forge-text leading-relaxed whitespace-pre-line">
                        {q.answer}
                      </p>
                    </div>

                    {q.codeSnippet && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-forge-muted mb-1.5 flex items-center gap-1">
                          <Code2 className="w-3.5 h-3.5" /> Code Snippet / Architecture
                        </h4>
                        <pre className="p-4 rounded-xl bg-black/60 border border-forge-border/50 font-mono text-xs text-cyan-300 overflow-x-auto">
                          {q.codeSnippet}
                        </pre>
                      </div>
                    )}

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-forge-muted mb-2">Key Takeaways for the Interviewer</h4>
                      <ul className="space-y-1.5">
                        {q.keyTakeaways.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-forge-text">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: TECH GUIDES GRID */}
      {activeTab === 'guides' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGuides.map((guide) => (
            <div 
              key={guide.id}
              onClick={() => setActiveGuideModal(guide)}
              className="bg-vidhya-card border border-forge-border/40 rounded-2xl p-6 hover:border-brand-blue/50 transition-all cursor-pointer flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-forge-muted mb-2">
                  <span className="font-bold text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded">
                    {guide.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {guide.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-forge-text group-hover:text-brand-blue transition-colors">
                  {guide.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-forge-muted leading-relaxed line-clamp-3">
                  {guide.summary}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {guide.tags.map((tag, idx) => (
                    <span key={idx} className="text-[11px] bg-forge-bg text-forge-muted px-2 py-0.5 rounded border border-forge-border/40">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-forge-border/30 flex items-center justify-between text-xs font-bold text-brand-blue">
                <span>Read Full Guide</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Guide Detail Modal */}
      {activeGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-vidhya-card border border-forge-border/50 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-forge-border/40 flex items-center justify-between bg-forge-bg/60">
              <div>
                <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">{activeGuideModal.category} · {activeGuideModal.readTime}</span>
                <h2 className="text-xl font-bold text-forge-text mt-1">{activeGuideModal.title}</h2>
              </div>
              <button 
                onClick={() => setActiveGuideModal(null)}
                className="p-1.5 rounded-lg text-forge-muted hover:text-forge-text hover:bg-forge-bg"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-sm text-forge-text leading-relaxed">
              <div className="p-4 rounded-xl bg-brand-blue/5 border border-brand-blue/20">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-1">Executive Summary</h4>
                <p className="text-xs text-forge-muted">{activeGuideModal.summary}</p>
              </div>
              <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-line">
                {activeGuideModal.content}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
