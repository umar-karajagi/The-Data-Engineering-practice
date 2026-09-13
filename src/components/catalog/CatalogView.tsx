'use client';

import React, { useState, useMemo } from 'react';
import { 
  ALL_SKILL_COURSES, 
  ALL_CAREER_PATHS, 
  getCoursesForCareerPath 
} from '@/content/courses/catalog';
import { SkillCourse, CareerPath, SkillLevel } from '@/types';
import { useUserStore } from '@/lib/userStore';
import { 
  Compass, 
  BookOpen, 
  Layers, 
  Search, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Terminal, 
  Code2, 
  Cpu, 
  ShieldCheck, 
  GraduationCap, 
  Flame, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface CatalogViewProps {
  onSelectCourse: (courseId: string) => void;
  onSelectPath: (pathId: string) => void;
  onStartLesson: (courseId: string, lessonId: string) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  onSelectCourse,
  onSelectPath,
  onStartLesson
}) => {
  const { courseEnrollments, courseProgress, getPathProgress, enrollCourse } = useUserStore();

  const [activeTab, setActiveTab] = useState<'paths' | 'courses'>('paths');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Filter lists
  const roles = ['all', 'Data Engineer', 'Analytics Engineer', 'Streaming Engineer', 'Platform Architect', 'DataOps'];
  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  // Filtered Career Paths
  const filteredPaths = useMemo(() => {
    return ALL_CAREER_PATHS.filter(path => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || 
        path.title.toLowerCase().includes(q) ||
        path.description.toLowerCase().includes(q) ||
        path.targetRole.toLowerCase().includes(q) ||
        path.id.toLowerCase().includes(q);

      const matchesRole = selectedRole === 'all' || path.targetRole.toLowerCase().includes(selectedRole.toLowerCase());
      const matchesLevel = selectedLevel === 'all' || path.level.toLowerCase().includes(selectedLevel.toLowerCase());

      return matchesSearch && matchesRole && matchesLevel;
    });
  }, [searchQuery, selectedRole, selectedLevel]);

  // Filtered Skill Courses
  const filteredCourses = useMemo(() => {
    return ALL_SKILL_COURSES.filter(course => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || 
        course.title.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q) ||
        course.id.toLowerCase().includes(q) ||
        course.skills.some(s => s.toLowerCase().includes(q)) ||
        course.toolTags.some(t => t.toLowerCase().includes(q));

      const matchesRole = selectedRole === 'all' || course.roleTags.some(r => r.toLowerCase().includes(selectedRole.toLowerCase()));
      const matchesLevel = selectedLevel === 'all' || course.level.toLowerCase().includes(selectedLevel.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus;

      return matchesSearch && matchesRole && matchesLevel && matchesStatus;
    });
  }, [searchQuery, selectedRole, selectedLevel, selectedStatus]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans pb-20">
      {/* Industrial Foundry Banner Header */}
      <div className="relative border-b border-[var(--border-color)] bg-[var(--card-bg)] px-6 py-10 lg:px-12 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#C8FF4A]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-[#56D8FF]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#C8FF4A]/10 border border-[#C8FF4A]/30 text-[#C8FF4A] text-xs font-mono font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Foundry Catalog • 30 Visible Products
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Free Open Access • Zero Paywalls
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800/80 border border-zinc-700 text-zinc-400 text-xs font-mono">
              <GraduationCap className="w-3.5 h-3.5" />
              Synthesizing IIT/NIT/NPTEL Curriculum Signals
            </span>
          </div>

          <h1 className="text-3xl lg:text-5xl font-black tracking-tight text-[var(--text-primary)] font-mono">
            ENGINEERING CATALOG
          </h1>
          <p className="mt-3 text-base lg:text-lg text-[var(--text-secondary)] max-w-3xl leading-relaxed">
            Industrial-grade, research-backed curricula for data platform builders. 
            Select an end-to-end <strong className="text-[var(--text-primary)]">Career Path</strong> or master individual modular <strong className="text-[var(--text-primary)]">Skill Courses</strong>. 
            All learning progress is unified in your single engineer record.
          </p>

          {/* Navigation Mode Switcher */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-color)] pt-6">
            <div className="inline-flex p-1 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
              <button
                onClick={() => setActiveTab('paths')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'paths'
                    ? 'bg-[#C8FF4A] text-[#101415] shadow-sm font-mono'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-mono'
                }`}
              >
                <Compass className="w-4 h-4" />
                CAREER PATHS ({ALL_CAREER_PATHS.length})
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'courses'
                    ? 'bg-[#C8FF4A] text-[#101415] shadow-sm font-mono'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-mono'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                SKILL COURSES ({ALL_SKILL_COURSES.length})
              </button>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-secondary)]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C8FF4A]" />
                <span>{courseEnrollments.length} Active Enrollments</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#56D8FF]" />
                <span>One Unified Progress Record</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-8">
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder={activeTab === 'paths' ? 'Search career paths, roles, architectures...' : 'Search 25 courses, tools, SQL, Spark...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[#C8FF4A]/50 transition-colors"
              />
            </div>

            {/* Role & Level Filter Selectors */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-mono mr-1">
                <Filter className="w-3.5 h-3.5" />
                <span>FILTER:</span>
              </div>

              {/* Role Filter */}
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
                aria-label="Filter by target engineering role"
                className="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[#C8FF4A]/50"
              >
                <option value="all">Role: All Specializations</option>
                {roles.filter(r => r !== 'all').map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>

              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={e => setSelectedLevel(e.target.value)}
                aria-label="Filter by difficulty level"
                className="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[#C8FF4A]/50"
              >
                <option value="all">Level: All Depths</option>
                {levels.filter(l => l !== 'all').map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>

              {activeTab === 'courses' && (
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  aria-label="Filter by course availability status"
                  className="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[#C8FF4A]/50"
                >
                  <option value="all">Status: All Statuses</option>
                  <option value="ready">Interactive Labs Ready</option>
                  <option value="preview">Curriculum Preview</option>
                </select>
              )}

              {(searchQuery || selectedRole !== 'all' || selectedLevel !== 'all' || selectedStatus !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRole('all');
                    setSelectedLevel('all');
                    setSelectedStatus('all');
                  }}
                  className="text-xs text-[#FF6B5E] hover:underline font-mono px-2"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Product Grid Content */}
        <div className="mt-8">
          {activeTab === 'paths' ? (
            /* CAREER PATHS SECTION */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-mono text-[var(--text-secondary)] uppercase tracking-wider">
                  Showing {filteredPaths.length} Career Engineering Paths
                </h2>
                <span className="text-xs font-mono text-[var(--text-secondary)]">
                  Shared Course Mastery • Zero Duplicate Requirements
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredPaths.map(path => {
                  const progress = getPathProgress(path.id);
                  const courses = getCoursesForCareerPath(path.id);
                  const isEnrolled = courseEnrollments.includes(path.id);

                  return (
                    <div 
                      key={path.id}
                      className="group bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[#C8FF4A]/50 rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
                    >
                      {/* Accent highlight */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C8FF4A]/30 to-transparent group-hover:via-[#C8FF4A] transition-all" />

                      <div>
                        {/* Header metadata row */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded bg-[#101415] border border-zinc-700 text-[#C8FF4A] font-mono text-xs font-bold">
                              {path.id}
                            </span>
                            <span className="text-xs font-mono text-[var(--text-secondary)]">
                              {path.targetRole}
                            </span>
                          </div>
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]">
                            {path.durationHoursRange}
                          </span>
                        </div>

                        {/* Title & Subtitle */}
                        <h3 
                          onClick={() => onSelectPath(path.id)}
                          className="text-xl font-bold font-mono text-[var(--text-primary)] group-hover:text-[#C8FF4A] transition-colors cursor-pointer"
                        >
                          {path.title}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                          {path.outcomeStatement}
                        </p>

                        {/* Milestone preview pills */}
                        <div className="mt-5 space-y-2 border-t border-[var(--border-color)]/60 pt-4">
                          <div className="text-xs font-mono text-[var(--text-secondary)] uppercase">
                            Path Curriculum ({courses.length} Skill Courses)
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {courses.map(c => {
                              const cProg = courseProgress[c.id];
                              const isCoursePassed = cProg?.capstoneStatus === 'passed' || (cProg?.percentComplete || 0) >= 100;
                              return (
                                <button
                                  key={c.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectCourse(c.id);
                                  }}
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono border transition-all ${
                                    isCoursePassed 
                                      ? 'bg-[#C8FF4A]/10 border-[#C8FF4A]/40 text-[#C8FF4A]' 
                                      : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-zinc-500'
                                  }`}
                                >
                                  {isCoursePassed && <CheckCircle2 className="w-3 h-3 text-[#C8FF4A]" />}
                                  <span>{c.id}</span>
                                  <span className="text-zinc-500 text-[10px] hidden sm:inline">• {c.title.slice(0, 20)}...</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Footer Progress & Actions */}
                      <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {progress.percentComplete > 0 ? (
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-[var(--bg-secondary)] rounded-full h-2 overflow-hidden border border-[var(--border-color)]">
                                <div 
                                  className="bg-[#C8FF4A] h-full rounded-full transition-all duration-500" 
                                  style={{ width: `${progress.percentComplete}%` }}
                                />
                              </div>
                              <span className="text-xs font-mono font-bold text-[#C8FF4A]">
                                {progress.percentComplete}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs font-mono text-zinc-500">Not enrolled yet</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelectPath(path.id)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-zinc-500 text-[var(--text-primary)] transition-colors"
                          >
                            Path Details
                          </button>
                          <button
                            onClick={() => {
                              enrollCourse(path.id);
                              onSelectPath(path.id);
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#C8FF4A] text-[#101415] hover:bg-[#b8f53a] transition-all shadow-sm"
                          >
                            <span>{isEnrolled ? 'Continue Path' : 'Enroll Free'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* SKILL COURSES SECTION */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-mono text-[var(--text-secondary)] uppercase tracking-wider">
                  Showing {filteredCourses.length} of 25 Modular Skill Courses
                </h2>
                <span className="text-xs font-mono text-[var(--text-secondary)]">
                  Complete Once • Satisfies All Career Path Milestones
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => {
                  const progress = courseProgress[course.id];
                  const percent = progress?.percentComplete || 0;
                  const isReady = course.status === 'ready';
                  const firstLessonId = course.modules[0]?.lessons[0]?.id;

                  return (
                    <div 
                      key={course.id}
                      className="group bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[#56D8FF]/50 rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
                    >
                      <div>
                        {/* Top Specification Plate Header */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-[#101415] border border-zinc-700 text-[#56D8FF] font-mono text-xs font-bold">
                              {course.id}
                            </span>
                            <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                              {course.level}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {isReady ? (
                              <span className="px-2 py-0.5 rounded bg-[#C8FF4A]/10 border border-[#C8FF4A]/30 text-[#C8FF4A] text-[10px] font-mono font-semibold">
                                Interactive Ready
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-mono">
                                Syllabus Ready
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title & Subtitle */}
                        <h3 
                          onClick={() => onSelectCourse(course.id)}
                          className="text-base font-bold font-mono text-[var(--text-primary)] group-hover:text-[#56D8FF] transition-colors cursor-pointer line-clamp-2"
                        >
                          {course.title}
                        </h3>
                        <p className="text-xs text-[var(--text-secondary)] mt-2 line-clamp-3 leading-relaxed">
                          {course.subtitle}
                        </p>

                        {/* Tool & Skill Tags */}
                        <div className="mt-4 flex flex-wrap gap-1">
                          {course.toolTags.slice(0, 3).map(tool => (
                            <span 
                              key={tool}
                              className="px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[10px] font-mono text-zinc-400"
                            >
                              {tool}
                            </span>
                          ))}
                          {course.skills.slice(0, 2).map(sk => (
                            <span 
                              key={sk}
                              className="px-1.5 py-0.5 rounded bg-blue-500/5 border border-blue-500/20 text-[10px] font-mono text-blue-400"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Course Card Footer */}
                      <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{course.durationHours} hrs</span>
                          {percent > 0 && (
                            <span className="ml-2 text-[#C8FF4A] font-bold">
                              {percent}%
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onSelectCourse(course.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-zinc-500 text-[var(--text-primary)] transition-colors"
                          >
                            Details
                          </button>

                          {isReady && firstLessonId ? (
                            <button
                              onClick={() => {
                                enrollCourse(course.id);
                                onStartLesson(course.id, firstLessonId);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#C8FF4A] text-[#101415] hover:bg-[#b8f53a] transition-all shadow-sm"
                            >
                              <span>Learn</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => onSelectCourse(course.id)}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-mono font-medium bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[#56D8FF]/50 transition-all"
                            >
                              <span>Preview</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
