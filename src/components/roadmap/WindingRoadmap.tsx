'use client';

import React, { useState } from 'react';
import { 
  Lock, 
  CheckCircle2, 
  Bookmark, 
  BookOpen, 
  Code2, 
  Sparkles, 
  X, 
  Terminal, 
  GitBranch, 
  Database, 
  Server, 
  Zap, 
  Cpu, 
  Layers, 
  Cloud, 
  Radio, 
  ShieldCheck, 
  CheckCheck,
  Compass,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TrackType, CheckpointStatus } from '../../types';
import { FOUNDATIONAL_BOOKS } from '../../content/books';

export interface RoadCheckpoint {
  id: string;
  stepNumber: number;
  title: string;
  example: string;
  track: TrackType;
  trackColor: string;
  icon: React.ElementType;
  x: number; // Percentage horizontal position (0 to 100)
  y: number; // Vertical position along the road (pixels)
  description: string;
  sourceBookId: string;
  linkedPracticeChallenge?: string;
  syllabus: string[];
}

export const ROAD_CHECKPOINTS: RoadCheckpoint[] = [
  {
    id: 'cp-1',
    stepNumber: 1,
    title: 'Linux & Shell Scripting',
    example: '(e.g. Bash, cron, process signals, pipes)',
    track: 'architecture',
    trackColor: 'var(--track-architecture)',
    icon: Terminal,
    x: 20,
    y: 60,
    description: 'Master the operating system foundation upon which all Docker containers, Kubernetes pods, and Airflow workers run.',
    sourceBookId: 'book-6',
    linkedPracticeChallenge: 'sql-kimball-scd2',
    syllabus: ['Process monitoring with htop/lsof', 'Bash stream redirection & pipes', 'cron scheduling & log rotation', 'SSH tunneling & keys']
  },
  {
    id: 'cp-2',
    stepNumber: 2,
    title: 'Version Control & Git',
    example: '(e.g. Git, GitHub Actions, CI/CD)',
    track: 'architecture',
    trackColor: 'var(--track-architecture)',
    icon: GitBranch,
    x: 48,
    y: 160,
    description: 'Trunk-based development, semantic versioning, and automated CI/CD validation to prevent broken data pipelines in production.',
    sourceBookId: 'book-6',
    syllabus: ['Feature branch workflows', 'Resolving merge conflicts in SQL models', 'Automated testing in GitHub Actions', 'Semantic release tags']
  },
  {
    id: 'cp-3',
    stepNumber: 3,
    title: 'SQL Masterclass',
    example: '(e.g. Window functions, recursive CTEs)',
    track: 'sql',
    trackColor: 'var(--track-sql)',
    icon: Database,
    x: 78,
    y: 270,
    description: 'The lingua franca of data. Master advanced window calculations, Snowflake QUALIFY, and query execution plan analysis.',
    sourceBookId: 'book-10',
    linkedPracticeChallenge: 'sql-snowflake-qualify',
    syllabus: ['DENSE_RANK vs RANK vs ROW_NUMBER', 'LEAD / LAG with default offsets', 'Snowflake QUALIFY syntax', 'Gaps and Islands streak detection']
  },
  {
    id: 'cp-4',
    stepNumber: 4,
    title: 'Data Management Systems',
    example: '(e.g. PostgreSQL, MySQL, B-Trees)',
    track: 'architecture',
    trackColor: 'var(--track-architecture)',
    icon: Server,
    x: 52,
    y: 390,
    description: 'Understanding relational storage engine primitives: Write-Ahead Logs (WAL), B-Tree page splits, and transaction isolation levels.',
    sourceBookId: 'book-2',
    syllabus: ['B-Trees vs LSM-Trees', 'ACID transactions & MVCC in Postgres', 'Index selectivity & composite keys', 'Connection pooling with PgBouncer']
  },
  {
    id: 'cp-5',
    stepNumber: 5,
    title: 'Python for Production Pipelines',
    example: '(e.g. Generators, NumPy, Arrow, Pydantic)',
    track: 'python',
    trackColor: 'var(--track-python)',
    icon: Zap,
    x: 22,
    y: 510,
    description: 'Writing deterministic, memory-efficient Python. Stream chunking with generators to process multi-gigabyte files without OOM.',
    sourceBookId: 'book-11',
    syllabus: ['Memory-safe stream generators', 'Schema enforcement with Pydantic', 'Fast in-memory hash joins', 'Apache Arrow vectorized processing']
  },
  {
    id: 'cp-6',
    stepNumber: 6,
    title: 'Data Modeling & Dimensional Design',
    example: '(e.g. Kimball Star Schema, Facts, SCD2)',
    track: 'warehousing',
    trackColor: 'var(--track-warehousing)',
    icon: Layers,
    x: 48,
    y: 630,
    description: 'Transforming messy relational OLTP data into Kimball dimensional models with conformed dimensions and Slowly Changing Dimensions.',
    sourceBookId: 'book-1',
    linkedPracticeChallenge: 'sql-kimball-scd2',
    syllabus: ['Grain declaration & Fact types', 'Conformed dimensions & Bus Architecture', 'SCD Type 1, 2, 3, 6 implementation', 'Surrogate key generation']
  },
  {
    id: 'cp-7',
    stepNumber: 7,
    title: 'Data Warehousing & Cloud OLAP',
    example: '(e.g. Snowflake, BigQuery, ClickHouse)',
    track: 'warehousing',
    trackColor: 'var(--track-warehousing)',
    icon: Cloud,
    x: 80,
    y: 750,
    description: 'Serverless columnar warehouses. Separation of storage and compute, micro-partitioning, and FinOps query cost governance.',
    sourceBookId: 'book-1',
    syllabus: ['Columnar storage & Dictionary encoding', 'Micro-partition clustering keys', 'Snowflake Time Travel & Zero-copy clones', 'Partition pruning mechanics']
  },
  {
    id: 'cp-8',
    stepNumber: 8,
    title: 'Distributed Compute with Apache Spark',
    example: '(e.g. Catalyst, Tungsten, Data Skew)',
    track: 'pyspark',
    trackColor: 'var(--track-pyspark)',
    icon: Cpu,
    x: 50,
    y: 870,
    description: 'Scale beyond a single machine. Deep dive into Catalyst optimizer plans, Tungsten bytecode generation, and salting skewed keys.',
    sourceBookId: 'book-3',
    syllabus: ['Narrow vs Wide transformations', 'Shuffle partition tuning', 'Broadcast Hash Join optimization', 'Key salting for skewed joins']
  },
  {
    id: 'cp-9',
    stepNumber: 9,
    title: 'Modern Lakehouse Architecture',
    example: '(e.g. Delta Lake, Apache Iceberg)',
    track: 'warehousing',
    trackColor: 'var(--track-warehousing)',
    icon: Layers,
    x: 18,
    y: 990,
    description: 'ACID transactions directly on cloud object storage. Delta transaction log (_delta_log JSON/checkpoints), time travel, and Z-ORDERING.',
    sourceBookId: 'book-4',
    syllabus: ['Atomic commits with Optimistic Concurrency Control', 'Time travel & audit rollbacks', 'Compaction (OPTIMIZE) and Z-ORDERING', 'Delta MERGE INTO for CDC']
  },
  {
    id: 'cp-10',
    stepNumber: 10,
    title: 'Streaming & Distributed Event Logs',
    example: '(e.g. Apache Kafka, Flink, Watermarks)',
    track: 'architecture',
    trackColor: 'var(--track-architecture)',
    icon: Radio,
    x: 48,
    y: 1110,
    description: 'Sub-second real-time streaming architectures. Kafka partition assignment, cooperative sticky assignors, and event-time watermarking.',
    sourceBookId: 'book-5',
    syllabus: ['Topic partitions & consumer group rebalancing', 'Exactly-Once Semantics (EOS)', 'Event time vs Processing time', 'Watermarking for late-arriving data']
  },
  {
    id: 'cp-11',
    stepNumber: 11,
    title: 'Pipeline Orchestration & DataOps',
    example: '(e.g. Apache Airflow, dbt, Great Expectations)',
    track: 'architecture',
    trackColor: 'var(--track-architecture)',
    icon: Compass,
    x: 80,
    y: 1230,
    description: 'Deterministic workflow management. Designing idempotent DAGs, sensor pitfalls, dynamic task generation, and automated data contracts.',
    sourceBookId: 'book-12',
    syllabus: ['Idempotent DAG backfilling', 'Sensors vs Hooks vs TaskFlow API', 'dbt modular SQL transformations', 'Automated data contracts & quality gates']
  },
  {
    id: 'cp-12',
    stepNumber: 12,
    title: 'Data Mesh & Enterprise Governance',
    example: '(e.g. Unity Catalog, Domain Ownership)',
    track: 'warehousing',
    trackColor: 'var(--track-warehousing)',
    icon: ShieldCheck,
    x: 50,
    y: 1350,
    description: 'Decentralized analytical architecture. Treating data as a product with federated computational governance and automated lineage.',
    sourceBookId: 'book-9',
    syllabus: ['Domain-oriented data products', 'Self-serve platform infrastructure', 'Federated computational governance', 'Automated cross-table lineage']
  }
];

export const WindingRoadmap: React.FC<{
  completedIds: string[];
  bookmarkedIds: string[];
  onToggleComplete: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onNavigatePractice?: (id: string) => void;
  onNavigateBook?: (bookId: string) => void;
}> = ({
  completedIds = [],
  bookmarkedIds = [],
  onToggleComplete,
  onToggleBookmark,
  onNavigatePractice,
  onNavigateBook
}) => {
  const [activeCheckpoint, setActiveCheckpoint] = useState<RoadCheckpoint | null>(ROAD_CHECKPOINTS[0]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Furthest completed index for character sprite
  const completedIndices = ROAD_CHECKPOINTS.map((cp, idx) => completedIds.includes(cp.id) ? idx : -1).filter(i => i !== -1);
  const characterIndex = completedIndices.length > 0 ? Math.min(ROAD_CHECKPOINTS.length - 1, Math.max(...completedIndices) + 1) : 0;
  const currentCheckpoint = ROAD_CHECKPOINTS[characterIndex] || ROAD_CHECKPOINTS[0];

  const handleNodeClick = (cp: RoadCheckpoint) => {
    setActiveCheckpoint(cp);
    setDrawerOpen(true);
  };

  const handleNodeComplete = (cp: RoadCheckpoint) => {
    onToggleComplete(cp.id);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Generate SVG road curve path connecting checkpoints with smooth bezier switchbacks
  const generateRoadPath = () => {
    const points = ROAD_CHECKPOINTS.map(cp => ({
      x: (cp.x / 100) * 800, // mapped to 800px width viewBox
      y: cp.y
    }));

    if (points.length < 2) return '';

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const midY = (p1.y + p2.y) / 2;
      d += ` C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const roadSvgPath = generateRoadPath();

  // Find book for active checkpoint
  const linkedBook = activeCheckpoint ? FOUNDATIONAL_BOOKS.find(b => b.id === activeCheckpoint.sourceBookId) : null;

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 py-12 space-y-8">
      
      {/* Roadmap Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forge-card border border-forge-border text-xs font-mono text-forge-text">
          <Compass className="w-3.5 h-3.5 text-track-sql animate-spin-slow" />
          <span>The Winding Data Engineer Expedition</span>
          <span className="text-forge-muted">•</span>
          <span className="text-track-python font-bold">{completedIds.length} of {ROAD_CHECKPOINTS.length} Checkpoints Cleared</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-forge-text tracking-tight">
          The Illustrated Journey from Zero to{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-track-sql via-track-warehousing to-track-architecture">
            Principal Architect
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-forge-secondary leading-relaxed">
          Follow the switchback trail. Each checkpoint is forged from foundational engineering texts, equipped with real-world failure modes, interview pearls, and live coding arenas.
        </p>
      </div>

      {/* Main Interactive Illustrated Canvas */}
      <div className="relative rounded-3xl bg-forge-canvas border border-forge-border shadow-2xl overflow-hidden py-12 px-4 sm:px-12 min-h-[1480px]">
        
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ 
            backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)', 
            backgroundSize: '32px 32px' 
          }}
        />

        {/* SVG Winding Road Surface & Dashed Centerline */}
        <svg 
          viewBox="0 0 800 1440" 
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
        >
          {/* Paved Road Shoulder */}
          <path
            d={roadSvgPath}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth="56"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />

          {/* Road Surface */}
          <path
            d={roadSvgPath}
            fill="none"
            stroke="var(--bg-secondary)"
            strokeWidth="48"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dashed Center Highway Stripe */}
          <path
            d={roadSvgPath}
            fill="none"
            stroke="var(--border-color)"
            strokeWidth="3"
            strokeDasharray="10,14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Checkpoint Pins Along the Winding Path */}
        <div className="relative w-full h-[1420px]">
          {ROAD_CHECKPOINTS.map((cp, index) => {
            const isCompleted = completedIds.includes(cp.id);
            const isUnlocked = index <= characterIndex;
            const isBookmarked = bookmarkedIds.includes(cp.id);
            const Icon = cp.icon;

            return (
              <div
                key={cp.id}
                style={{
                  left: `${cp.x}%`,
                  top: `${cp.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute z-10 flex items-center group cursor-pointer"
                onClick={() => handleNodeClick(cp)}
              >
                {/* Checkpoint Circular Badge with Sequence Number Pin */}
                <div className="relative">
                  
                  {/* Sequence Number Pin (1, 2, 3...) */}
                  <div 
                    style={{ backgroundColor: cp.trackColor }}
                    className="absolute -top-2 -left-2 w-5 h-5 rounded-full text-[10px] font-mono font-extrabold text-white flex items-center justify-center shadow-md border-2 border-forge-bg z-20"
                  >
                    {cp.stepNumber}
                  </div>

                  {/* Circular Icon Badge */}
                  <div 
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 shadow-xl ${
                      isCompleted 
                        ? 'bg-forge-card border-emerald-500 text-emerald-400 scale-105' 
                        : isUnlocked 
                          ? 'bg-forge-card border-forge-text text-forge-text hover:scale-110 hover:border-track-sql' 
                          : 'bg-forge-surface border-forge-border text-forge-muted opacity-60'
                    }`}
                    style={isUnlocked && !isCompleted ? { borderColor: cp.trackColor } : {}}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                    ) : isUnlocked ? (
                      <Icon className="w-6 h-6" />
                    ) : (
                      <Lock className="w-5 h-5 text-forge-muted" />
                    )}
                  </div>

                  {/* Bookmark Affordance Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(cp.id);
                    }}
                    className={`absolute -bottom-1 -right-1 p-1 rounded-full border bg-forge-card transition-all ${
                      isBookmarked 
                        ? 'text-track-pyspark border-track-pyspark' 
                        : 'text-forge-muted border-forge-border hover:text-forge-text'
                    }`}
                    title="Save checkpoint for later"
                  >
                    <Bookmark className="w-3 h-3" />
                  </button>
                </div>

                {/* Topic Label and Parenthetical Example Beside Badge */}
                <div 
                  className={`ml-4 p-3 rounded-xl bg-forge-card/90 backdrop-blur-sm border border-forge-border transition-all max-w-[260px] ${
                    isUnlocked ? 'group-hover:border-track-sql shadow-lg' : 'opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold text-forge-secondary">
                    <span>Sequence #{cp.stepNumber}</span>
                    <span>•</span>
                    <span style={{ color: cp.trackColor }}>{cp.track}</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-forge-text leading-tight group-hover:text-track-sql transition-colors">
                    {cp.title}
                  </h3>
                  <p className="text-[11px] text-forge-muted leading-snug mt-0.5 font-sans">
                    {cp.example}
                  </p>
                </div>

              </div>
            );
          })}

          {/* Animated Avatar / Character Sprite sitting at furthest completed checkpoint */}
          <div
            style={{
              left: `${currentCheckpoint.x}%`,
              top: `${currentCheckpoint.y - 48}px`,
              transform: 'translate(-50%, -100%)',
              transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            className="absolute z-30 flex flex-col items-center pointer-events-none animate-bounce"
          >
            <div className="px-2.5 py-1 rounded-full bg-forge-card border border-track-sql text-[10px] font-mono font-bold text-track-sql shadow-xl whitespace-nowrap mb-1">
              🚶‍♂️ You Are Here
            </div>
            <div className="w-8 h-8 rounded-full bg-track-sql/20 border-2 border-track-sql flex items-center justify-center text-sm shadow-lg shadow-blue-500/30">
              🧭
            </div>
          </div>

        </div>

      </div>

      {/* Checkpoint Slide-Over Side Drawer on Click */}
      {drawerOpen && activeCheckpoint && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-forge-card border-l border-forge-border h-full overflow-y-auto p-6 space-y-6 shadow-2xl flex flex-col justify-between">
            
            <div className="space-y-6">
              
              {/* Drawer Top Bar */}
              <div className="flex items-center justify-between border-b border-forge-border pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span 
                      style={{ color: activeCheckpoint.trackColor }}
                      className="font-bold uppercase px-2 py-0.5 rounded bg-forge-surface border border-forge-border"
                    >
                      Step #{activeCheckpoint.stepNumber} • {activeCheckpoint.track}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-forge-text tracking-tight">
                    {activeCheckpoint.title}
                  </h2>
                  <p className="text-xs text-forge-muted">{activeCheckpoint.example}</p>
                </div>

                <button 
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 rounded-lg text-forge-secondary hover:text-forge-text hover:bg-forge-surface"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-forge-secondary leading-relaxed bg-forge-bg p-4 rounded-xl border border-forge-border">
                {activeCheckpoint.description}
              </p>

              {/* Syllabus Topics */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-forge-text tracking-wider">
                  Checkpoint Engineering Syllabus:
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {activeCheckpoint.syllabus.map((s, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-forge-bg border border-forge-border flex items-center gap-2.5 text-xs text-forge-secondary">
                      <div className="w-1.5 h-1.5 rounded-full bg-track-sql shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked Source Book Reference */}
              {linkedBook && (
                <div className="p-4 rounded-xl bg-forge-bg border border-forge-border space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-track-warehousing uppercase">
                    <BookOpen className="w-3.5 h-3.5" />
                    Foundational Text Reference
                  </div>
                  <h4 className="text-xs font-bold text-forge-text">{linkedBook.title}</h4>
                  <p className="text-[11px] text-forge-muted leading-relaxed">
                    Author: {linkedBook.author} • Core concepts: {linkedBook.coreConcepts.slice(0, 3).join(', ')}
                  </p>
                  {onNavigateBook && (
                    <button
                      onClick={() => {
                        setDrawerOpen(false);
                        onNavigateBook(linkedBook.id);
                      }}
                      className="text-[11px] font-mono font-bold text-track-warehousing hover:underline flex items-center gap-1 pt-1"
                    >
                      <span>Read book chapters</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}

            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-forge-border space-y-3">
              {activeCheckpoint.linkedPracticeChallenge && onNavigatePractice && (
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    onNavigatePractice(activeCheckpoint.linkedPracticeChallenge!);
                  }}
                  className="w-full py-2.5 rounded-xl bg-track-sql hover:bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <Code2 className="w-4 h-4" />
                  <span>Launch Practice Challenge</span>
                </button>
              )}

              <button
                onClick={() => handleNodeComplete(activeCheckpoint)}
                className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
                  completedIds.includes(activeCheckpoint.id)
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-forge-surface hover:bg-forge-border text-forge-text border border-forge-border'
                }`}
              >
                {completedIds.includes(activeCheckpoint.id) ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Completed (+100 XP)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-track-pyspark" />
                    <span>Mark Checkpoint Complete (+100 XP)</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
