'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, 
  CheckCircle2, 
  Play, 
  Terminal, 
  Flame, 
  ExternalLink, 
  Sparkles, 
  ChevronRight, 
  Code2, 
  Database, 
  Cpu, 
  Radio, 
  Layers, 
  Cloud, 
  Sliders, 
  X,
  Trophy,
  Filter,
  Check
} from 'lucide-react';
import { CuratedVideo, HERO_MASTERCLASS_VIDEO, CURATED_PROJECT_VIDEOS } from '../../content/videos/curatedVideos';

export interface RoadmapNode {
  id: string;
  title: string;
  shortDesc: string;
  icon: any;
  color: string;
  borderGlow: string;
  stageNumber: number;
  totalQuestions: number;
  category: string;
  prerequisites: string[];
  track75: boolean; // included in DE 75
  topics: {
    name: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    companies: string[];
    hasVideo?: boolean;
    videoId?: string;
  }[];
}

const ROADMAP_NODES: RoadmapNode[] = [
  {
    id: 'python-core',
    title: 'Python for Data Engineers',
    shortDesc: 'Generators, memory profilers, typing, decorators, and OOP data structures.',
    icon: Code2,
    color: 'from-amber-500 to-yellow-600',
    borderGlow: 'hover:border-amber-500/60 hover:shadow-amber-500/20',
    stageNumber: 1,
    totalQuestions: 24,
    category: 'Core Language',
    prerequisites: [],
    track75: true,
    topics: [
      { name: 'Memory Efficient Generators & Iterators', difficulty: 'Medium', companies: ['Google', 'Meta'], hasVideo: true, videoId: 'stage-1-python-foundations' },
      { name: 'Multiprocessing vs AsyncIO in Batch ETL', difficulty: 'Hard', companies: ['Amazon', 'Netflix'], hasVideo: true },
      { name: 'Custom Context Managers for Database Pools', difficulty: 'Medium', companies: ['Uber', 'Apple'] },
      { name: 'Pandas & Polars Vectorized Operations', difficulty: 'Easy', companies: ['Meta', 'Stripe'], hasVideo: true }
    ]
  },
  {
    id: 'sql-mastery',
    title: 'Advanced SQL & Query Tuning',
    shortDesc: 'Window functions, recursive CTEs, EXPLAIN plans, indexing, and partitions.',
    icon: Database,
    color: 'from-blue-500 to-indigo-600',
    borderGlow: 'hover:border-blue-500/60 hover:shadow-blue-500/20',
    stageNumber: 2,
    totalQuestions: 35,
    category: 'Querying',
    prerequisites: ['python-core'],
    track75: true,
    topics: [
      { name: 'Dense Rank, Lead/Lag & Running Totals', difficulty: 'Easy', companies: ['Amazon', 'Google'], hasVideo: true, videoId: 'stage-2-sql-mastery' },
      { name: 'Recursive CTEs for Hierarchical Graphs', difficulty: 'Hard', companies: ['Uber', 'Meta'], hasVideo: true },
      { name: 'EXPLAIN ANALYZE & Buffer Cache Profiling', difficulty: 'Hard', companies: ['Netflix', 'Databricks'], hasVideo: true },
      { name: 'Gaps and Islands Algorithm in SQL', difficulty: 'Medium', companies: ['Apple', 'Microsoft'] }
    ]
  },
  {
    id: 'data-modeling',
    title: 'Dimensional Modeling & Lakehouse Design',
    shortDesc: 'Kimball star schemas, SCD Type 2/4, conformed dimensions, factless facts.',
    icon: Layers,
    color: 'from-emerald-500 to-teal-600',
    borderGlow: 'hover:border-emerald-500/60 hover:shadow-emerald-500/20',
    stageNumber: 3,
    totalQuestions: 20,
    category: 'Architecture',
    prerequisites: ['sql-mastery'],
    track75: true,
    topics: [
      { name: 'Slowly Changing Dimensions (SCD Type 1, 2 & 4)', difficulty: 'Medium', companies: ['Amazon', 'Snowflake'], hasVideo: true, videoId: 'stage-3-data-modeling' },
      { name: 'Star Schema vs 3NF Lakehouse Benchmarks', difficulty: 'Easy', companies: ['Google', 'Walmart'] },
      { name: 'Accumulating Snapshot Fact Tables', difficulty: 'Hard', companies: ['Airbnb', 'Uber'], hasVideo: true },
      { name: 'Surrogate Keys vs Natural Hash Keys', difficulty: 'Easy', companies: ['Meta', 'Stripe'] }
    ]
  },
  {
    id: 'spark-compute',
    title: 'Distributed Compute (Apache Spark)',
    shortDesc: 'Spark Catalyst optimizer, shuffle partitioning, Broadcast joins, PySpark memory.',
    icon: Cpu,
    color: 'from-orange-500 to-red-600',
    borderGlow: 'hover:border-orange-500/60 hover:shadow-orange-500/20',
    stageNumber: 4,
    totalQuestions: 28,
    category: 'Big Data Engine',
    prerequisites: ['sql-mastery', 'python-core'],
    track75: true,
    topics: [
      { name: 'Broadcast Hash Join vs Sort-Merge Join Internals', difficulty: 'Medium', companies: ['Databricks', 'Apple'], hasVideo: true, videoId: 'stage-4-pyspark-internals' },
      { name: 'Data Skew Mitigation & Salting Keys', difficulty: 'Hard', companies: ['Meta', 'Netflix'], hasVideo: true },
      { name: 'Catalyst Optimizer & Physical Query Plans', difficulty: 'Hard', companies: ['Google', 'Uber'], hasVideo: true },
      { name: 'Dynamic Resource Allocation & OOM Debugging', difficulty: 'Medium', companies: ['Amazon', 'Microsoft'] }
    ]
  },
  {
    id: 'kafka-streaming',
    title: 'Event Streaming (Apache Kafka & Flink)',
    shortDesc: 'Topics, partitions, consumer groups, exactly-once semantics, watermark lag.',
    icon: Radio,
    color: 'from-purple-500 to-pink-600',
    borderGlow: 'hover:border-purple-500/60 hover:shadow-purple-500/20',
    stageNumber: 5,
    totalQuestions: 18,
    category: 'Real-Time Streaming',
    prerequisites: ['spark-compute'],
    track75: false,
    topics: [
      { name: 'Consumer Group Rebalancing & Heartbeats', difficulty: 'Medium', companies: ['Confluent', 'LinkedIn'], hasVideo: true, videoId: 'stage-5-kafka-streaming' },
      { name: 'Exactly-Once Semantics (EOS) with Two-Phase Commit', difficulty: 'Hard', companies: ['Uber', 'Stripe'], hasVideo: true },
      { name: 'Sliding & Tumbling Windows with Watermarking', difficulty: 'Hard', companies: ['Netflix', 'DoorDash'], hasVideo: true },
      { name: 'Schema Registry & Avro Evolution Rules', difficulty: 'Medium', companies: ['Google', 'Airbnb'] }
    ]
  },
  {
    id: 'lakehouse-formats',
    title: 'Modern Open Table Formats (Iceberg & Delta)',
    shortDesc: 'Apache Iceberg, Delta Lake, ACID transactions, time-travel, hidden partitioning.',
    icon: Database,
    color: 'from-cyan-500 to-blue-600',
    borderGlow: 'hover:border-cyan-500/60 hover:shadow-cyan-500/20',
    stageNumber: 6,
    totalQuestions: 15,
    category: 'Modern Storage',
    prerequisites: ['data-modeling'],
    track75: false,
    topics: [
      { name: 'Apache Iceberg Metadata Tree & Manifest Files', difficulty: 'Hard', companies: ['Apple', 'Netflix'], hasVideo: true, videoId: 'stage-6-lakehouse-iceberg' },
      { name: 'Delta Lake Transaction Log (CRC & Checkpoints)', difficulty: 'Medium', companies: ['Databricks', 'Microsoft'], hasVideo: true },
      { name: 'Copy-On-Write vs Merge-On-Read Tradeoffs', difficulty: 'Medium', companies: ['Google', 'Amazon'] },
      { name: 'DuckDB Direct Parquet In-Memory Vector Scanning', difficulty: 'Easy', companies: ['MotherDuck', 'Stripe'], hasVideo: true }
    ]
  },
  {
    id: 'cloud-warehousing',
    title: 'Cloud Warehouses (Snowflake & BigQuery)',
    shortDesc: 'Micro-partitions, clustering keys, BigQuery slot reservations, zero-copy cloning.',
    icon: Cloud,
    color: 'from-sky-500 to-indigo-600',
    borderGlow: 'hover:border-sky-500/60 hover:shadow-sky-500/20',
    stageNumber: 7,
    totalQuestions: 22,
    category: 'Cloud Warehouses',
    prerequisites: ['sql-mastery', 'lakehouse-formats'],
    track75: true,
    topics: [
      { name: 'Snowflake Micro-partition Pruning & Clustering', difficulty: 'Medium', companies: ['Snowflake', 'DoorDash'], hasVideo: true, videoId: 'stage-7-cloud-warehouses' },
      { name: 'BigQuery Partitioning, Clustering & BI Engine', difficulty: 'Medium', companies: ['Google', 'Spotify'], hasVideo: true },
      { name: 'Zero-Copy Cloning & Time Travel Queries', difficulty: 'Easy', companies: ['Uber', 'Square'] },
      { name: 'Warehouse Cost Optimization & Spilling to Disk', difficulty: 'Hard', companies: ['Amazon', 'Coinbase'] }
    ]
  },
  {
    id: 'orchestration-dbt',
    title: 'Orchestration & Transforms (Airflow & dbt)',
    shortDesc: 'DAG scheduling, sensors, dynamic mapping, dbt models, incremental strategies.',
    icon: Sliders,
    color: 'from-teal-500 to-emerald-600',
    borderGlow: 'hover:border-teal-500/60 hover:shadow-teal-500/20',
    stageNumber: 8,
    totalQuestions: 16,
    category: 'Pipeline Workflow',
    prerequisites: ['spark-compute', 'cloud-warehousing'],
    track75: true,
    topics: [
      { name: 'Dynamic Airflow DAGs with KubernetesPodOperator', difficulty: 'Hard', companies: ['Airbnb', 'Robinhood'], hasVideo: true, videoId: 'stage-8-orchestration-dbt' },
      { name: 'dbt Incremental Models (Merge vs Append)', difficulty: 'Medium', companies: ['GitLab', 'HubSpot'], hasVideo: true },
      { name: 'Airflow Sensors, Reschedule Mode & Deadlocks', difficulty: 'Medium', companies: ['Netflix', 'Meta'] },
      { name: 'Data Contracts & Schema Validation in dbt', difficulty: 'Easy', companies: ['Stripe', 'Google'] }
    ]
  },
  {
    id: 'system-design',
    title: 'Data Engineering System Design',
    shortDesc: 'Lambda vs Kappa, high-throughput ingestion, SLA budgeting, disaster recovery.',
    icon: Network,
    color: 'from-violet-600 to-purple-800',
    borderGlow: 'hover:border-violet-500/60 hover:shadow-violet-500/20',
    stageNumber: 9,
    totalQuestions: 20,
    category: 'Staff Architect',
    prerequisites: ['orchestration-dbt', 'kafka-streaming'],
    track75: true,
    topics: [
      { name: 'Design Real-Time Surge Pricing Pipeline (Uber)', difficulty: 'Hard', companies: ['Uber', 'Lyft'], hasVideo: true, videoId: 'stage-9-system-design' },
      { name: 'Design Global Metrics & Anomaly Detection (Netflix)', difficulty: 'Hard', companies: ['Netflix', 'Meta'], hasVideo: true },
      { name: 'Designing Multi-Tenant Lakehouse with RBAC', difficulty: 'Hard', companies: ['Amazon', 'Google'] },
      { name: 'Idempotency & Deduplication in High-Scale Ingestion', difficulty: 'Medium', companies: ['Stripe', 'Coinbase'] }
    ]
  }
];

interface NeetCodeRoadmapProps {
  onOpenVideo?: (video: CuratedVideo) => void;
  onNavigateTab?: (tab: string) => void;
}

export const NeetCodeRoadmap: React.FC<NeetCodeRoadmapProps> = ({
  onOpenVideo,
  onNavigateTab
}) => {
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'de75'>('de75');
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);

  // Load completion state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dataveda_completed_roadmap_nodes');
      if (saved) {
        setCompletedNodes(JSON.parse(saved));
      } else {
        // default initial mastered node for demo motivation
        setCompletedNodes(['python-core']);
      }
    } catch (e) {
      // fallback
    }
  }, []);

  const toggleNodeCompletion = (nodeId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCompletedNodes(prev => {
      const next = prev.includes(nodeId)
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId];
      try {
        localStorage.setItem('dataveda_completed_roadmap_nodes', JSON.stringify(next));
      } catch (err) {}
      return next;
    });
  };

  const displayedNodes = filterMode === 'de75' 
    ? ROADMAP_NODES.filter(n => n.track75) 
    : ROADMAP_NODES;

  const totalProblemCount = displayedNodes.reduce((acc, curr) => acc + curr.totalQuestions, 0);
  const completedCount = displayedNodes.filter(n => completedNodes.includes(n.id)).length;
  const progressPct = Math.round((completedCount / displayedNodes.length) * 100) || 0;

  return (
    <section className="relative py-20 bg-slate-50 dark:bg-slate-950 border-t border-b border-slate-200 dark:border-slate-800/80 overflow-hidden">
      
      {/* Background Tech Graph Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#0050FF 1px, transparent 1px), radial-gradient(#0050FF 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          backgroundPosition: '0 0, 18px 18px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-[#0050FF] dark:text-blue-400 mb-4 shadow-sm">
            <Network className="w-3.5 h-3.5" />
            <span>Interactive Data Engineering Roadmap</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            The NeetCode-Style <br className="hidden sm:inline" />
            <span className="text-[#0050FF] bg-clip-text text-transparent bg-gradient-to-r from-[#0050FF] via-indigo-500 to-cyan-400">
              Data Engineering 150
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Stop guessing what to learn next. A structured dependency DAG tree designed for interview readiness and production-grade mastery.
          </p>

          {/* Filter Pills & Live Progress */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full">
            
            <div className="flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800">
              <button
                onClick={() => setFilterMode('de75')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterMode === 'de75'
                    ? 'bg-[#0050FF] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                DE 75 (Speedrun Core)
              </button>
              <button
                onClick={() => setFilterMode('all')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterMode === 'all'
                    ? 'bg-[#0050FF] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                DE 150 (Full Production Tree)
              </button>
            </div>

            {/* Live Mastery Meter */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Mastered:</span>
                <span className="font-bold text-[#0050FF] dark:text-blue-400">
                  {completedCount}/{displayedNodes.length} Nodes
                </span>
              </div>
              <div className="w-24 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#0050FF] to-emerald-400 transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {progressPct}%
              </span>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE 3D ROADMAP GRID (TREE LAYOUT) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          
          {displayedNodes.map((node, index) => {
            const isCompleted = completedNodes.includes(node.id);
            const IconComponent = node.icon;

            return (
              <motion.div
                key={node.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedNode(node)}
                className={`group relative p-6 rounded-2xl bg-white dark:bg-slate-900/90 border transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl ${
                  isCompleted 
                    ? 'border-emerald-500/50 bg-emerald-500/[0.02]' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-[#0050FF]/50'
                } ${node.borderGlow}`}
              >
                
                {/* Top Node Meta */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400">
                      STEP 0{node.stageNumber}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {node.category}
                    </span>
                  </div>

                  <button
                    onClick={(e) => toggleNodeCompletion(node.id, e)}
                    title={isCompleted ? 'Mark as Incomplete' : 'Mark as Mastered'}
                    className={`p-1.5 rounded-lg border transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-500/30'
                        : 'border-slate-300 dark:border-slate-700 text-slate-400 hover:border-emerald-500 hover:text-emerald-500'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Node Title & Icon */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${node.color} text-white shadow-md shrink-0 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#0050FF] dark:group-hover:text-blue-400 transition-colors">
                      {node.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {node.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Mini Topic Badges Preview */}
                <div className="space-y-1.5 my-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  {node.topics.slice(0, 3).map((topic, tIdx) => (
                    <div 
                      key={tIdx} 
                      className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-50 dark:bg-slate-950/60"
                    >
                      <span className="text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                        {topic.name}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        topic.difficulty === 'Easy' 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                          : topic.difficulty === 'Medium'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}>
                        {topic.difficulty}
                      </span>
                    </div>
                  ))}
                  {node.topics.length > 3 && (
                    <div className="text-[11px] text-center text-slate-500 dark:text-slate-500 font-medium">
                      +{node.topics.length - 3} more questions in this node
                    </div>
                  )}
                </div>

                {/* Node Footer */}
                <div className="flex items-center justify-between pt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1 text-[#0050FF] dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Explore Node</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {node.topics.length} Problems
                  </span>
                </div>

              </motion.div>
            );
          })}

        </div>

        {/* Global CTA below roadmap */}
        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigateTab ? onNavigateTab('practice') : null}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-sm font-bold shadow-xl transition-all group"
          >
            <span>Launch Complete 500+ Question Arena</span>
            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* NODE DETAIL MODAL (NEETCODE STYLE DRAWER) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedNode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-950/40">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${selectedNode.color} text-white shadow-md`}>
                    <selectedNode.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0050FF]/10 text-[#0050FF] dark:text-blue-400">
                        STAGE 0{selectedNode.stageNumber}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {selectedNode.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                      {selectedNode.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedNode.shortDesc}
                </p>

                {/* Problems & Topics List */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-between">
                    <span>Curated Interview Challenges</span>
                    <span>{selectedNode.topics.length} Problems</span>
                  </h4>

                  <div className="space-y-2">
                    {selectedNode.topics.map((topic, tIdx) => (
                      <div
                        key={tIdx}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Terminal className="w-4 h-4 text-[#0050FF] dark:text-blue-400 shrink-0" />
                          <div>
                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                              {topic.name}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              {topic.companies.map((co, cIdx) => (
                                <span 
                                  key={cIdx}
                                  className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                >
                                  {co}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            topic.difficulty === 'Easy' 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                              : topic.difficulty === 'Medium'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}>
                            {topic.difficulty}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Masterclass Link CTA */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#0050FF]/10 to-indigo-500/10 border border-[#0050FF]/20 flex items-center justify-between gap-4">
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                      Full Masterclass Video Available
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Watch the step-by-step video lecture with interactive DuckDB exercises.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (onOpenVideo) {
                        onOpenVideo(HERO_MASTERCLASS_VIDEO);
                      }
                      setSelectedNode(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#0050FF] hover:bg-[#1C449A] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-md"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Watch HD</span>
                  </button>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
                <button
                  onClick={() => toggleNodeCompletion(selectedNode.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                    completedNodes.includes(selectedNode.id)
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {completedNodes.includes(selectedNode.id) ? 'Mastered (Click to undo)' : 'Mark Stage as Mastered'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setSelectedNode(null);
                    if (onNavigateTab) onNavigateTab('practice');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  Start Practice
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
