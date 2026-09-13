'use client';

import React, { useState, useMemo } from 'react';
import { useUserStore } from '@/lib/userStore';
import { ALL_SKILL_COURSES } from '@/content/courses/catalog';
import { 
  ResumeExperience, 
  ResumeProject, 
  StarStory, 
  CoverLetterDraft,
  ATSDiagnosticReport,
  ATSCheckItem
} from '@/types';
import { 
  Briefcase, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  Share2, 
  Target, 
  Zap, 
  ExternalLink, 
  BookOpen, 
  HelpCircle, 
  Copy, 
  Check, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface CareerStudioViewProps {
  onNavigateCourse: (courseId: string) => void;
}

export const CareerStudioView: React.FC<CareerStudioViewProps> = ({
  onNavigateCourse
}) => {
  const { 
    resumeProfile, 
    updateResumeContact, 
    updateResumeTargetRole,
    updateResumeSummary, 
    updateResumeSkills,
    addResumeExperience,
    updateResumeExperience,
    deleteResumeExperience,
    addResumeProject,
    deleteResumeProject,
    starStories,
    addStarStory,
    deleteStarStory,
    bulletImprovements
  } = useUserStore();

  const [activeTab, setActiveTab] = useState<'resume' | 'matcher' | 'ats' | 'bullets' | 'coverletter' | 'interview' | 'portfolio' | 'export'>('resume');

  // Job Description Matcher State
  const [jobDescriptionInput, setJobDescriptionInput] = useState<string>('');
  const [jobMatchResults, setJobMatchResults] = useState<{
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
    recommendedCourses: { courseId: string; courseTitle: string; reason: string }[];
  } | null>(null);

  // Cover Letter Studio State
  const [targetCompany, setTargetCompany] = useState<string>('Stripe');
  const [targetRole, setTargetRole] = useState<string>('Senior Data Engineer');
  const [coverLetterTone, setCoverLetterTone] = useState<'technical' | 'direct' | 'collaborative'>('technical');
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // New STAR Story Modal / Form State
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [newStoryQuestion, setNewStoryQuestion] = useState('');
  const [newStorySituation, setNewStorySituation] = useState('');
  const [newStoryTask, setNewStoryTask] = useState('');
  const [newStoryAction, setNewStoryAction] = useState('');
  const [newStoryResult, setNewStoryResult] = useState('');
  const [newStoryMetrics, setNewStoryMetrics] = useState('');
  const [isAddingStory, setIsAddingStory] = useState(false);

  // Flattened list of user skills for ATS and matching
  const allUserSkills = useMemo(() => {
    return [
      ...resumeProfile.skills.languages,
      ...resumeProfile.skills.frameworksAndTools,
      ...resumeProfile.skills.databasesAndWarehouses,
      ...resumeProfile.skills.cloudAndDevOps,
      ...resumeProfile.skills.methodologies
    ];
  }, [resumeProfile]);

  // Compute live ATS Diagnostic Report
  const atsReport: ATSDiagnosticReport = useMemo(() => {
    let wordCount = resumeProfile.summary.split(/\s+/).filter(Boolean).length;
    resumeProfile.experiences.forEach(e => {
      e.bullets.forEach(b => {
        wordCount += b.split(/\s+/).filter(Boolean).length;
      });
    });

    const strongActionVerbs = [
      'architected', 'engineered', 'scaled', 'optimized', 'implemented', 
      'designed', 'reduced', 'eliminated', 'migrated', 'streamlined', 
      'automated', 'deployed', 'spearheaded', 'refactored'
    ];

    let actionVerbCount = 0;
    let metricCount = 0;
    let totalBullets = 0;

    resumeProfile.experiences.forEach(e => {
      e.bullets.forEach(b => {
        totalBullets += 1;
        const firstWord = b.trim().split(/\s+/)[0]?.toLowerCase();
        if (strongActionVerbs.some(v => firstWord?.includes(v))) {
          actionVerbCount += 1;
        }
        if (/\d+%|\$\d+|\b\d+M\b|\b\d+K\b|\b\d+TB\b|\b\d+GB\b|\b\d+\s*hours\b|\b\d+\s*mins\b/i.test(b)) {
          metricCount += 1;
        }
      });
    });

    const checks: ATSCheckItem[] = [
      {
        id: 'c-length',
        category: 'formatting',
        label: 'Total Resume Word Count',
        status: wordCount >= 300 && wordCount <= 900 ? 'pass' : wordCount < 300 ? 'warning' : 'fail',
        explanation: `Current word count is ~${wordCount} words. Target optimal range is 400-800 words.`,
        recommendation: wordCount < 300 ? 'Add more quantified accomplishments to your project and experience bullets.' : 'Trim non-essential text to fit 1-2 clean pages.'
      },
      {
        id: 'c-metrics',
        category: 'metrics',
        label: 'Quantified Impact Metrics',
        status: metricCount >= totalBullets * 0.6 ? 'pass' : metricCount > 0 ? 'warning' : 'fail',
        explanation: `${metricCount} of ${totalBullets} experience bullets contain measurable metrics ($, %, latency, data scale).`,
        recommendation: 'Target having at least 70% of bullets include measurable outcomes using Google\'s XYZ formula.'
      },
      {
        id: 'c-verbs',
        category: 'keywords',
        label: 'Action Verb Density',
        status: actionVerbCount >= totalBullets * 0.7 ? 'pass' : 'warning',
        explanation: `${actionVerbCount} of ${totalBullets} bullets begin with authoritative technical action verbs.`,
        recommendation: 'Begin every bullet point with a past-tense action verb (Engineered, Architected, Automated).'
      },
      {
        id: 'c-skills',
        category: 'keywords',
        label: 'Technical Skill Categorization',
        status: allUserSkills.length >= 10 ? 'pass' : 'warning',
        explanation: `${allUserSkills.length} verified technical skills categorized across languages, tools, and cloud platforms.`,
        recommendation: 'Ensure your top tools (Python, SQL, Spark, Databricks, Airflow) are explicitly listed in your skills block.'
      },
      {
        id: 'c-sections',
        category: 'sections',
        label: 'Canonical Section Structure',
        status: resumeProfile.experiences.length > 0 && resumeProfile.education.length > 0 ? 'pass' : 'fail',
        explanation: 'Standard ATS parsers require unambiguous Experience, Education, and Skills header tags.',
        recommendation: 'Maintain standard section header names to avoid parser confusion.'
      }
    ];

    const passCount = checks.filter(c => c.status === 'pass').length;
    const overallScore = Math.round((passCount / checks.length) * 100);

    return {
      overallScore,
      checks,
      wordCount,
      actionVerbCount,
      metricCount,
      readabilityGrade: 'Grade 11 (Professional Technical)'
    };
  }, [resumeProfile, allUserSkills]);

  // Run Job Description Analysis
  const handleAnalyzeJob = () => {
    if (!jobDescriptionInput.trim()) return;

    const jd = jobDescriptionInput.toLowerCase();
    
    // Key DE skill keywords to search for
    const techKeywords = [
      { name: 'Python', courseId: 'SF-02', title: 'Python Software Engineering for Data' },
      { name: 'SQL', courseId: 'SF-04', title: 'Relational Database Fundamentals & ANSI SQL' },
      { name: 'PySpark', courseId: 'SF-15', title: 'Distributed Processing with Apache Spark' },
      { name: 'Spark', courseId: 'SF-15', title: 'Distributed Processing with Apache Spark' },
      { name: 'Databricks', courseId: 'SF-18', title: 'Databricks Lakehouse Platform & Medallion Architecture' },
      { name: 'Delta Lake', courseId: 'SF-18', title: 'Databricks Lakehouse Platform & Medallion Architecture' },
      { name: 'Airflow', courseId: 'SF-11', title: 'Workflow Orchestration with Apache Airflow' },
      { name: 'Kafka', courseId: 'SF-17', title: 'Real-Time Streaming with Apache Kafka' },
      { name: 'dbt', courseId: 'SF-09', title: 'Modern Transformation Engineering with dbt Core' },
      { name: 'Snowflake', courseId: 'SF-10', title: 'Data Warehouse Optimizations' },
      { name: 'BigQuery', courseId: 'SF-10', title: 'Data Warehouse Optimizations' },
      { name: 'Docker', courseId: 'SF-13', title: 'CI/CD & Containerization with Docker' },
      { name: 'Terraform', courseId: 'SF-14', title: 'Infrastructure as Code (Terraform)' },
      { name: 'Iceberg', courseId: 'SF-08', title: 'Data Lakehouse Storage Formats (Iceberg/Parquet)' },
      { name: 'Kimball', courseId: 'SF-07', title: 'Dimensional Modeling & Schema Architecture' },
      { name: 'Data Mesh', courseId: 'SF-24', title: 'Data Mesh & Data Contracts' },
      { name: 'Great Expectations', courseId: 'SF-12', title: 'Data Quality & Testing' }
    ];

    const matched: string[] = [];
    const missing: string[] = [];
    const recommended: { courseId: string; courseTitle: string; reason: string }[] = [];

    techKeywords.forEach(k => {
      if (jd.includes(k.name.toLowerCase())) {
        const userHasSkill = allUserSkills.some(s => s.toLowerCase().includes(k.name.toLowerCase()));
        if (userHasSkill) {
          matched.push(k.name);
        } else {
          missing.push(k.name);
          if (!recommended.some(r => r.courseId === k.courseId)) {
            recommended.push({
              courseId: k.courseId,
              courseTitle: k.title,
              reason: `Required in job posting (${k.name}) but not currently highlighted in your resume.`
            });
          }
        }
      }
    });

    const totalInJd = matched.length + missing.length;
    const score = totalInJd > 0 ? Math.round((matched.length / totalInJd) * 100) : 75;

    setJobMatchResults({
      score,
      matchedSkills: matched,
      missingSkills: missing,
      recommendedCourses: recommended
    });
  };

  // Generate Cover Letter
  const handleGenerateCoverLetter = () => {
    const letter = `# Technical Application: ${targetRole} at ${targetCompany}

Dear ${targetCompany} Engineering Leadership,

I am writing to express my strong enthusiasm for the ${targetRole} position at ${targetCompany}. With a background in distributed data engineering and Lakehouse platform architecture, I have spent the last 5+ years building idempotent batch and real-time streaming systems designed for zero data loss and strict sub-hour SLAs.

At ScaleData Systems, I architected our multi-tier Medallion Lakehouse on Databricks and PySpark, ingesting 50M+ daily transactions across 8 microservices. By diagnosing distributed data skew and implementing salting along with broadcast hash join thresholds, I reduced batch runtime by 72% and lowered cloud cluster infrastructure costs by $14,000 monthly. Furthermore, to eliminate downstream schema drift incidents, I implemented automated data quality validation with Great Expectations within our GitHub Actions CI/CD pipelines.

I am particularly excited about ${targetCompany}'s technical mission. My deep experience with ${resumeProfile.skills.frameworksAndTools.slice(0, 4).join(', ')} aligns directly with the architectural challenges your team tackles daily.

Thank you for your time and consideration. I welcome the opportunity to discuss how my distributed systems background can deliver immediate leverage to ${targetCompany}'s data platform.

Sincerely,
${resumeProfile.contact.fullName}
${resumeProfile.contact.email} • ${resumeProfile.contact.phone}
${resumeProfile.contact.linkedinUrl} • ${resumeProfile.contact.githubUrl}
`;
    setGeneratedLetter(letter);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handleCreateStarStory = () => {
    if (!newStoryTitle.trim() || !newStoryAction.trim()) return;
    const story: StarStory = {
      id: `star-${Date.now()}`,
      title: newStoryTitle,
      targetQuestion: newStoryQuestion || 'Tell me about a technical project you led.',
      situation: newStorySituation,
      task: newStoryTask,
      action: newStoryAction,
      result: newStoryResult,
      metricsAchieved: newStoryMetrics,
      tags: ['#custom', '#interview']
    };
    addStarStory(story);
    setIsAddingStory(false);
    setNewStoryTitle('');
    setNewStoryQuestion('');
    setNewStorySituation('');
    setNewStoryTask('');
    setNewStoryAction('');
    setNewStoryResult('');
    setNewStoryMetrics('');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans pb-24">
      {/* Studio Header Banner */}
      <div className="border-b border-[var(--border-color)] bg-[var(--card-bg)] px-6 py-10 lg:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#C8FF4A]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#C8FF4A]/10 border border-[#C8FF4A]/30 text-[#C8FF4A] text-xs font-mono font-semibold uppercase">
              <Briefcase className="w-3.5 h-3.5" />
              Career Operating System
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Client-Side Privacy • Zero Cloud Upload
            </span>
          </div>

          <h1 className="text-3xl lg:text-5xl font-black font-mono tracking-tight text-[var(--text-primary)]">
            CAREER STUDIO & RESUMECRAFT
          </h1>
          <p className="mt-3 text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed">
            Professional developer resume workbench, ATS diagnostic engine, job description keyword matcher, Google XYZ bullet improver, and technical interview prep bank.
          </p>

          {/* Sub-Navigation Tabs */}
          <div className="mt-8 flex flex-wrap gap-2 border-t border-[var(--border-color)] pt-5">
            {[
              { id: 'resume', label: 'Resume Profile', icon: FileText },
              { id: 'matcher', label: 'Job Description Matcher', icon: Target },
              { id: 'ats', label: `ATS Diagnostics (${atsReport.overallScore}%)`, icon: Zap },
              { id: 'bullets', label: 'XYZ Bullet Improver', icon: Sparkles },
              { id: 'coverletter', label: 'Cover Letter Studio', icon: Edit3 },
              { id: 'interview', label: `STAR Stories (${starStories.length})`, icon: HelpCircle },
              { id: 'portfolio', label: 'Portfolio Packs', icon: BookOpen },
              { id: 'export', label: 'Export & Backup', icon: Download }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all border ${
                    isActive
                      ? 'bg-[#C8FF4A] text-[#101415] border-[#C8FF4A] shadow-sm'
                      : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-8">
        
        {/* TAB 1: RESUME PROFILE WORKSPACE */}
        {activeTab === 'resume' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Experience & Projects */}
            <div className="lg:col-span-2 space-y-8">
              {/* Executive Summary */}
              <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase">
                    Target Role & Executive Summary
                  </h3>
                  <span className="text-xs font-mono text-zinc-500">Live Edited</span>
                </div>
                <input
                  type="text"
                  value={resumeProfile.targetRole}
                  onChange={e => updateResumeTargetRole(e.target.value)}
                  className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-xs font-mono text-[#C8FF4A] font-bold focus:outline-none"
                  placeholder="Target Role (e.g. Senior Data Engineer)"
                />
                <textarea
                  value={resumeProfile.summary}
                  onChange={e => updateResumeSummary(e.target.value)}
                  rows={4}
                  className="w-full p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[#C8FF4A] leading-relaxed"
                  placeholder="Executive summary highlighting core technical domains and quantifiable impact..."
                />
              </div>

              {/* Work Experience */}
              <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase">
                    Engineering Experience ({resumeProfile.experiences.length})
                  </h3>
                </div>

                <div className="space-y-6">
                  {resumeProfile.experiences.map(exp => (
                    <div key={exp.id} className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-mono font-bold text-sm text-[var(--text-primary)]">
                            {exp.role} • <span className="text-[#C8FF4A]">{exp.company}</span>
                          </div>
                          <div className="text-xs font-mono text-[var(--text-secondary)] mt-0.5">
                            {exp.startDate} – {exp.endDate} • {exp.location}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteResumeExperience(exp.id)}
                          aria-label="Delete experience"
                          className="p-1 rounded text-zinc-500 hover:text-[#FF6B5E]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Bullets */}
                      <div className="space-y-2 pt-2 border-t border-[var(--border-color)]">
                        {exp.bullets.map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-2 text-xs font-mono text-[var(--text-secondary)]">
                            <span className="text-[#C8FF4A] mt-0.5">•</span>
                            <span className="leading-relaxed">{bullet}</span>
                          </div>
                        ))}
                      </div>

                      {/* Tech stack */}
                      <div className="flex flex-wrap gap-1 pt-2">
                        {exp.techStack.map(t => (
                          <span key={t} className="px-2 py-0.5 rounded bg-[var(--card-bg)] border border-[var(--border-color)] text-[10px] font-mono text-zinc-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase">
                  Production Projects ({resumeProfile.projects.length})
                </h3>
                <div className="space-y-4">
                  {resumeProfile.projects.map(proj => (
                    <div key={proj.id} className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-mono font-bold text-sm text-[var(--text-primary)]">
                          {proj.title} <span className="text-xs text-zinc-500">({proj.role})</span>
                        </div>
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-[#56D8FF] hover:underline flex items-center gap-1">
                            <span>GitHub</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <ul className="space-y-1 text-xs font-mono text-[var(--text-secondary)]">
                        {proj.bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-[#56D8FF]">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Contact & Categorized Skills */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 space-y-3">
                <h3 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase">
                  Contact Information
                </h3>
                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <label className="text-zinc-500 block text-[10px]">Full Name</label>
                    <input
                      type="text"
                      value={resumeProfile.contact.fullName}
                      onChange={e => updateResumeContact({ ...resumeProfile.contact, fullName: e.target.value })}
                      className="w-full p-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block text-[10px]">Email</label>
                    <input
                      type="email"
                      value={resumeProfile.contact.email}
                      onChange={e => updateResumeContact({ ...resumeProfile.contact, email: e.target.value })}
                      className="w-full p-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block text-[10px]">Location</label>
                    <input
                      type="text"
                      value={resumeProfile.contact.location}
                      onChange={e => updateResumeContact({ ...resumeProfile.contact, location: e.target.value })}
                      className="w-full p-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block text-[10px]">LinkedIn URL</label>
                    <input
                      type="text"
                      value={resumeProfile.contact.linkedinUrl || ''}
                      onChange={e => updateResumeContact({ ...resumeProfile.contact, linkedinUrl: e.target.value })}
                      className="w-full p-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>
                </div>
              </div>

              {/* Skills Matrix */}
              <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase">
                  Categorized Skills Matrix
                </h3>
                
                {[
                  { key: 'languages', title: 'Languages', items: resumeProfile.skills.languages },
                  { key: 'frameworksAndTools', title: 'Frameworks & Tools', items: resumeProfile.skills.frameworksAndTools },
                  { key: 'databasesAndWarehouses', title: 'Databases & Warehouses', items: resumeProfile.skills.databasesAndWarehouses },
                  { key: 'cloudAndDevOps', title: 'Cloud & DevOps', items: resumeProfile.skills.cloudAndDevOps },
                  { key: 'methodologies', title: 'Methodologies', items: resumeProfile.skills.methodologies }
                ].map(cat => (
                  <div key={cat.key} className="space-y-1.5">
                    <span className="text-[11px] font-mono text-zinc-400 font-semibold block">
                      {cat.title}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {cat.items.map(item => (
                        <span key={item} className="px-2 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[11px] font-mono text-[var(--text-primary)]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: JOB DESCRIPTION MATCHER */}
        {activeTab === 'matcher' && (
          <div className="space-y-8">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#C8FF4A]" />
                  <h3 className="text-base font-mono font-bold text-[var(--text-primary)]">
                    Target Job Description Matcher
                  </h3>
                </div>
                <span className="text-xs font-mono text-zinc-500">
                  Compares requirements against your profile
                </span>
              </div>

              <p className="text-xs text-[var(--text-secondary)]">
                Paste any job posting (LinkedIn, Indeed, Greenhouse, Lever). We extract required data engineering tools, compute match percentages, and link missing skills directly to DataForge Skill Courses!
              </p>

              <textarea
                value={jobDescriptionInput}
                onChange={e => setJobDescriptionInput(e.target.value)}
                placeholder="Paste Job Description here (e.g. 'We are seeking a Senior Data Engineer with strong PySpark, Databricks Delta Lake, Airflow, and dbt experience...')"
                rows={6}
                className="w-full p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[#C8FF4A]"
              />

              <div className="flex items-center justify-between">
                <button
                  onClick={handleAnalyzeJob}
                  disabled={!jobDescriptionInput.trim()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-mono font-bold text-xs bg-[#C8FF4A] text-[#101415] hover:bg-[#b8f53a] disabled:opacity-40 transition-all shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Alignment & Missing Skills</span>
                </button>
              </div>
            </div>

            {/* Results Grid */}
            {jobMatchResults && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Score Card */}
                <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 text-center space-y-2">
                  <span className="text-xs font-mono text-zinc-500 uppercase">Alignment Match Score</span>
                  <div className="text-5xl font-black font-mono text-[#C8FF4A]">
                    {jobMatchResults.score}%
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Based on detected core data engineering tools and frameworks.
                  </p>
                </div>

                {/* Matched & Missing Skills */}
                <div className="lg:col-span-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4">
                  <div>
                    <span className="text-xs font-mono text-emerald-400 font-bold uppercase block mb-2">
                      ✓ Present In Your Resume ({jobMatchResults.matchedSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {jobMatchResults.matchedSkills.map(s => (
                        <span key={s} className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-color)]">
                    <span className="text-xs font-mono text-rose-400 font-bold uppercase block mb-2">
                      ✗ Missing / Under-Represented ({jobMatchResults.missingSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {jobMatchResults.missingSkills.length > 0 ? (
                        jobMatchResults.missingSkills.map(s => (
                          <span key={s} className="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs font-mono text-zinc-500">No major skills missing!</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Direct Course Recommendations */}
                {jobMatchResults.recommendedCourses.length > 0 && (
                  <div className="lg:col-span-3 bg-[var(--card-bg)] border border-[#56D8FF]/30 rounded-2xl p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#56D8FF]">
                      <Sparkles className="w-4 h-4" />
                      <span>RECOMMENDED DATAFORGE COURSES TO BRIDGE GAPS</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {jobMatchResults.recommendedCourses.map(rec => (
                        <div 
                          key={rec.courseId}
                          onClick={() => onNavigateCourse(rec.courseId)}
                          className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[#56D8FF] transition-all flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-[#101415] border border-zinc-700 text-[#56D8FF] text-xs font-mono font-bold">
                                {rec.courseId}
                              </span>
                              <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                                {rec.courseTitle}
                              </span>
                            </div>
                            <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                              {rec.reason}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0 ml-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ATS DIAGNOSTICS */}
        {activeTab === 'ats' && (
          <div className="space-y-6">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-mono font-bold text-[var(--text-primary)]">
                    Applicant Tracking System (ATS) Diagnostic
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Evaluates keyword extraction, action verbs, metrics ratio, and formatting readability.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-mono text-zinc-500 block">ATS READINESS</span>
                    <span className="text-3xl font-black font-mono text-[#C8FF4A]">
                      {atsReport.overallScore}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Checks Checklist */}
              <div className="mt-8 space-y-3">
                {atsReport.checks.map(check => {
                  let statusBadge = (
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> PASS
                    </span>
                  );
                  if (check.status === 'warning') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-amber-400">
                        <AlertTriangle className="w-4 h-4" /> REVIEW
                      </span>
                    );
                  } else if (check.status === 'fail') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-rose-400">
                        <AlertTriangle className="w-4 h-4" /> NEEDS FIX
                      </span>
                    );
                  }

                  return (
                    <div 
                      key={check.id}
                      className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono"
                    >
                      <div>
                        <div className="font-bold text-[var(--text-primary)]">{check.label}</div>
                        <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">{check.explanation}</div>
                        <div className="text-[11px] text-zinc-400 mt-1 italic">Tip: {check.recommendation}</div>
                      </div>
                      <div className="shrink-0">{statusBadge}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: XYZ BULLET IMPROVER */}
        {activeTab === 'bullets' && (
          <div className="space-y-6">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#C8FF4A]">
                <Sparkles className="w-4 h-4" />
                <span>GOOGLE XYZ BULLET FORMULA</span>
              </div>
              <h3 className="text-xl font-mono font-bold text-[var(--text-primary)]">
                Accomplished [X] as measured by [Y], by doing [Z]
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Transform passive task descriptions into high-leverage engineering accomplishments. Every bullet should clearly articulate the scale, the measurable business metric, and the specific technology implementation.
              </p>
            </div>

            <div className="space-y-4">
              {bulletImprovements.map(b => (
                <div key={b.id} className="p-5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500">Context: {b.context}</span>
                    <span className="px-2 py-0.5 rounded bg-[#C8FF4A]/10 text-[#C8FF4A] font-bold">
                      Formula: {b.formula}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 text-xs font-mono text-rose-300">
                    <span className="text-zinc-500 block mb-1">Before (Weak & Passive):</span>
                    {b.original}
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300">
                    <span className="text-emerald-400 font-bold block mb-1">After (Authoritative XYZ):</span>
                    {b.improved}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-1">
                    <span>Action Verb: <strong className="text-white">{b.actionVerb}</strong></span>
                    <button 
                      onClick={() => handleCopyText(b.improved)}
                      className="hover:text-white flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Copy to Clipboard
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: COVER LETTER STUDIO */}
        {activeTab === 'coverletter' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase">
                Target Parameters
              </h3>
              <div>
                <label className="text-zinc-500 block text-xs font-mono mb-1">Company</label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={e => setTargetCompany(e.target.value)}
                  className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-xs font-mono text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="text-zinc-500 block text-xs font-mono mb-1">Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-xs font-mono text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="text-zinc-500 block text-xs font-mono mb-1">Tone</label>
                <select
                  value={coverLetterTone}
                  onChange={e => setCoverLetterTone(e.target.value as any)}
                  className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-xs font-mono text-[var(--text-primary)]"
                >
                  <option value="technical">Technical & System-Focused</option>
                  <option value="direct">Direct & Results-Oriented</option>
                  <option value="collaborative">Collaborative & Cross-Functional</option>
                </select>
              </div>
              <button
                onClick={handleGenerateCoverLetter}
                className="w-full py-2.5 rounded-xl font-mono font-bold text-xs bg-[#C8FF4A] text-[#101415] hover:bg-[#b8f53a] transition-all shadow-sm"
              >
                Generate Tailored Letter
              </button>
            </div>

            <div className="lg:col-span-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase">
                  Cover Letter Draft
                </h3>
                {generatedLetter && (
                  <button
                    onClick={() => handleCopyText(generatedLetter)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#C8FF4A] hover:underline"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedNotification ? 'Copied!' : 'Copy Markdown'}</span>
                  </button>
                )}
              </div>

              {generatedLetter ? (
                <textarea
                  value={generatedLetter}
                  onChange={e => setGeneratedLetter(e.target.value)}
                  rows={14}
                  className="w-full p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-xs font-mono text-[var(--text-primary)] leading-relaxed focus:outline-none focus:border-[#C8FF4A]"
                />
              ) : (
                <div className="py-16 text-center text-xs font-mono text-zinc-500">
                  Click "Generate Tailored Letter" to synthesize your resume accomplishments into a custom technical cover letter.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: STAR INTERVIEW PREP STORIES */}
        {activeTab === 'interview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-mono font-bold text-[var(--text-primary)]">
                  Behavioral & Technical STAR Stories
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Situation, Task, Action, Result framework for Staff and Senior Data Engineer interview rounds.
                </p>
              </div>

              <button
                onClick={() => setIsAddingStory(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-[#C8FF4A] text-[#101415] hover:bg-[#b8f53a] transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Story</span>
              </button>
            </div>

            {/* Modal for adding story */}
            {isAddingStory && (
              <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[#C8FF4A]/50 space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                  <span className="text-xs font-mono font-bold text-[#C8FF4A] uppercase">
                    New STAR Story
                  </span>
                  <button onClick={() => setIsAddingStory(false)} className="text-zinc-500 hover:text-white">
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <label className="text-zinc-500 block mb-1">Story Title</label>
                    <input
                      type="text"
                      value={newStoryTitle}
                      onChange={e => setNewStoryTitle(e.target.value)}
                      placeholder="e.g. Mitigating Kafka Lag Under Flash Crash"
                      className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1">Target Question</label>
                    <input
                      type="text"
                      value={newStoryQuestion}
                      onChange={e => setNewStoryQuestion(e.target.value)}
                      placeholder="e.g. Tell me about a time you handled a production outage."
                      className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1">Situation (Context & Constraints)</label>
                    <textarea
                      value={newStorySituation}
                      onChange={e => setNewStorySituation(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1">Task (Your Personal Responsibility)</label>
                    <textarea
                      value={newStoryTask}
                      onChange={e => setNewStoryTask(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1">Action (Technical Steps Taken)</label>
                    <textarea
                      value={newStoryAction}
                      onChange={e => setNewStoryAction(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1">Result & Quantified Metrics</label>
                    <textarea
                      value={newStoryResult}
                      onChange={e => setNewStoryResult(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>
                </div>

                <button
                  onClick={handleCreateStarStory}
                  className="px-6 py-2 rounded-xl text-xs font-mono font-bold bg-[#C8FF4A] text-[#101415] hover:bg-[#b8f53a]"
                >
                  Save STAR Story
                </button>
              </div>
            )}

            {/* List of STAR Stories */}
            <div className="space-y-6">
              {starStories.map(story => (
                <div key={story.id} className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-mono font-bold text-[var(--text-primary)]">
                        {story.title}
                      </h4>
                      <p className="text-xs font-mono text-[#56D8FF] mt-1">
                        Question: "{story.targetQuestion}"
                      </p>
                    </div>
                    <button
                      onClick={() => deleteStarStory(story.id)}
                      className="p-1 text-zinc-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono pt-2 border-t border-[var(--border-color)]">
                    <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
                      <span className="text-zinc-400 font-bold block mb-1">SITUATION</span>
                      <p className="text-[var(--text-secondary)] leading-relaxed">{story.situation}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
                      <span className="text-zinc-400 font-bold block mb-1">TASK</span>
                      <p className="text-[var(--text-secondary)] leading-relaxed">{story.task}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
                      <span className="text-emerald-400 font-bold block mb-1">ACTION</span>
                      <p className="text-[var(--text-secondary)] leading-relaxed">{story.action}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
                      <span className="text-[#C8FF4A] font-bold block mb-1">RESULT & IMPACT</span>
                      <p className="text-[var(--text-secondary)] leading-relaxed">{story.result}</p>
                      {story.metricsAchieved && (
                        <div className="mt-2 text-[11px] font-bold text-[#C8FF4A]">
                          Metrics: {story.metricsAchieved}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: PORTFOLIO PROJECT PACKS */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-mono font-bold text-[var(--text-primary)]">
                Portfolio Project Blueprint Packs
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Turnkey architectures with starter directory trees, Docker Compose fixtures, and README templates ready for your GitHub portfolio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Production Medallion Lakehouse with PySpark & Delta Lake',
                  role: 'Data Engineer / Lakehouse Architect',
                  tech: ['PySpark', 'Delta Lake', 'Docker', 'DuckDB'],
                  summary: 'End-to-end multi-hop Lakehouse pipeline reading streaming telemetry, merging slowly changing dimensions in Silver, and generating analytics aggregates in Gold.',
                  repoStructure: '├── dags/\n│   └── lakehouse_orchestration.py\n├── src/\n│   ├── bronze_ingest.py\n│   └── silver_merge.py\n├── docker-compose.yml\n└── README.md'
                },
                {
                  title: 'Real-Time Financial Anomaly Detection with Kafka & Redis',
                  role: 'Streaming Data Engineer',
                  tech: ['Kafka', 'Spark Structured Streaming', 'Redis', 'Python'],
                  summary: 'High-throughput real-time payment velocity analyzer computing sliding window metrics with event-time watermarking.',
                  repoStructure: '├── kafka_producer/\n│   └── mock_trades.py\n├── streaming_job/\n│   └── window_aggregates.py\n├── docker-compose.yml\n└── README.md'
                }
              ].map((pack, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] space-y-4">
                  <div>
                    <span className="text-xs font-mono text-[#C8FF4A] font-bold uppercase block mb-1">
                      {pack.role}
                    </span>
                    <h4 className="text-base font-mono font-bold text-[var(--text-primary)]">
                      {pack.title}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      {pack.summary}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#101415] border border-zinc-800 text-[11px] font-mono text-zinc-300">
                    <span className="text-zinc-500 block mb-1">Repository Structure:</span>
                    <pre className="whitespace-pre">{pack.repoStructure}</pre>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {pack.tech.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded bg-[var(--bg-secondary)] text-[10px] font-mono text-zinc-400 border border-[var(--border-color)]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: EXPORT & BACKUP */}
        {activeTab === 'export' && (
          <div className="max-w-2xl bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-xl font-mono font-bold text-[var(--text-primary)]">
                Export Resume & Career Data
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Download your complete profile as formatted Markdown or JSON. All data remains 100% private in your browser.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  const md = `# ${resumeProfile.contact.fullName}
${resumeProfile.contact.email} | ${resumeProfile.contact.phone} | ${resumeProfile.contact.location}
${resumeProfile.contact.linkedinUrl} | ${resumeProfile.contact.githubUrl}

## Professional Summary
${resumeProfile.summary}

## Technical Skills
- Languages: ${resumeProfile.skills.languages.join(', ')}
- Frameworks & Tools: ${resumeProfile.skills.frameworksAndTools.join(', ')}
- Databases: ${resumeProfile.skills.databasesAndWarehouses.join(', ')}
- Cloud & DevOps: ${resumeProfile.skills.cloudAndDevOps.join(', ')}

## Experience
${resumeProfile.experiences.map(e => `### ${e.role} - ${e.company} (${e.startDate} - ${e.endDate})\n${e.bullets.map(b => `- ${b}`).join('\n')}`).join('\n\n')}

## Education
${resumeProfile.education.map(ed => `- ${ed.degree} in ${ed.fieldOfStudy}, ${ed.institution} (${ed.startYear}-${ed.endYear})`).join('\n')}
`;
                  const blob = new Blob([md], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `Resume_${resumeProfile.contact.fullName.replace(/\s+/g, '_')}.md`;
                  a.click();
                }}
                className="w-full p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[#C8FF4A] text-left flex items-center justify-between transition-all"
              >
                <div>
                  <div className="text-xs font-mono font-bold text-[var(--text-primary)]">
                    Download Markdown Resume (.md)
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    Clean, ATS-optimized plain text markdown format
                  </div>
                </div>
                <Download className="w-4 h-4 text-[#C8FF4A]" />
              </button>

              <button
                onClick={() => {
                  const data = JSON.stringify(resumeProfile, null, 2);
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `DataForge_Career_Profile.json`;
                  a.click();
                }}
                className="w-full p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[#56D8FF] text-left flex items-center justify-between transition-all"
              >
                <div>
                  <div className="text-xs font-mono font-bold text-[var(--text-primary)]">
                    Export JSON Profile Backup (.json)
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    Machine-readable backup of experiences, skills, and projects
                  </div>
                </div>
                <Download className="w-4 h-4 text-[#56D8FF]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
