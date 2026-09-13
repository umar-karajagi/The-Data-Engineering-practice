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
  ArrowRight,
  Shield,
  Activity,
  DollarSign,
  Network,
  Share2,
  ShieldAlert,
  FileText
} from 'lucide-react';
import { FOUNDATIONAL_BOOKS } from '../../content/books';
import { ContentRef } from '../../types';

export interface LeveledNode {
  id: string;
  level: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  accentColor: string;
  trackTarget: {
    trackId: string;
    tierNumber: 1 | 2 | 3;
    tierName: string;
  };
  sourceBookId: string;
  competencies: string[];
  interviewTraps: string[];
  description: string;
}

export const LEVELED_ROADMAP: {
  level: 1 | 2 | 3 | 4;
  levelTitle: string;
  levelSubtitle: string;
  targetRole: string;
  accentColor: string;
  nodes: LeveledNode[];
}[] = [
  {
    level: 1,
    levelTitle: 'Level 1 — Associate Data Engineer',
    levelSubtitle: 'Core CS fundamentals, scripting, source control, and tabular data manipulation',
    targetRole: 'Junior / Associate DE ($90k - $125k)',
    accentColor: '#38bdf8',
    nodes: [
      {
        id: 'node-linux',
        level: 1,
        title: 'Linux & Shell Scripting',
        subtitle: 'Bash, pipes, cron, signals, process management',
        icon: Terminal,
        accentColor: '#38bdf8',
        trackTarget: { trackId: 'python', tierNumber: 1, tierName: 'Foundation' },
        sourceBookId: 'book-6',
        competencies: ['Process monitoring with htop/lsof', 'Bash stream redirection & pipes', 'cron scheduling & log rotation', 'SSH tunneling & permissions'],
        interviewTraps: ['Not knowing the exit code 0 vs non-zero in Bash scripts within Docker containers', 'Using grep without understanding regex memory cost on huge text streams'],
        description: 'The operating system foundation upon which all containers, Kubernetes worker pods, and Airflow runners operate.'
      },
      {
        id: 'node-git',
        level: 1,
        title: 'Git & Version Control',
        subtitle: 'Trunk-based development, semantic commits, CI/CD pipelines',
        icon: GitBranch,
        accentColor: '#38bdf8',
        trackTarget: { trackId: 'python', tierNumber: 1, tierName: 'Foundation' },
        sourceBookId: 'book-6',
        competencies: ['Feature branch workflows', 'Resolving merge conflicts in SQL models', 'Automated testing in GitHub Actions', 'Semantic version tagging'],
        interviewTraps: ['Force-pushing to main in production shared repositories', 'Committing plaintext database passwords in git history'],
        description: 'Collaborative pipeline engineering standards, automated pull request tests, and continuous deployment.'
      },
      {
        id: 'node-sql-fund',
        level: 1,
        title: 'SQL Fundamentals',
        subtitle: 'Relational algebra, multi-table joins, aggregations',
        icon: Database,
        accentColor: '#38bdf8',
        trackTarget: { trackId: 'sql', tierNumber: 1, tierName: 'Foundation' },
        sourceBookId: 'book-10',
        competencies: ['Order of logical query execution', 'Three-valued logic (NULL handling)', 'Left Anti-Join pattern', 'GROUP BY vs HAVING filtering'],
        interviewTraps: ['Using WHERE col = NULL instead of IS NULL', 'Using SELECT * in production queries, creating schema-drift breakages'],
        description: 'The foundation of data manipulation. Master logical query evaluation order, safe grouping, and anti-joins.'
      },
      {
        id: 'node-python-de',
        level: 1,
        title: 'Python for Data Engineering',
        subtitle: 'Data structures, file I/O, streaming generators',
        icon: Code2,
        accentColor: '#4ade80',
        trackTarget: { trackId: 'python', tierNumber: 1, tierName: 'Foundation' },
        sourceBookId: 'book-11',
        competencies: ['O(1) set/dict lookups vs O(N) lists', 'Constant-memory generators with yield', 'Dead Letter Queue (DLQ) logging', 'Itertools chunking'],
        interviewTraps: ['Calling f.readlines() on a 50GB file, crashing with an OutOfMemoryError', 'Iterating over DataFrames row-by-row in pure Python'],
        description: 'Writing scalable, memory-efficient data parsers that process gigabytes of dirty inputs in constant RAM.'
      },
      {
        id: 'node-basic-etl',
        level: 1,
        title: 'Basic ETL & Data Ingestion',
        subtitle: 'Batch loaders, CSV/JSON sanitization, error isolation',
        icon: Layers,
        accentColor: '#4ade80',
        trackTarget: { trackId: 'python', tierNumber: 1, tierName: 'Foundation' },
        sourceBookId: 'book-6',
        competencies: ['Extract-Transform-Load pipelines', 'Handling malformed rows with DLQ', 'Atomic temporary file writing', 'Idempotent batch loads'],
        interviewTraps: ['Appending to production tables without deduplication keys, corrupting analytics with duplicates on re-runs'],
        description: 'Building resilient ingest scripts that withstand schema anomalies and network timeouts.'
      }
    ]
  },
  {
    level: 2,
    levelTitle: 'Level 2 — Mid-Level Data Engineer',
    levelSubtitle: 'Dimensional modeling, relational engines, distributed compute with Spark, and cloud data warehouses',
    targetRole: 'Data Engineer II ($125k - $160k)',
    accentColor: '#fb923c',
    nodes: [
      {
        id: 'node-data-modeling',
        level: 2,
        title: 'Data Modeling & Normalization',
        subtitle: '3NF vs Dimensional design, entity-relationship diagrams',
        icon: Database,
        accentColor: '#fb923c',
        trackTarget: { trackId: 'sql', tierNumber: 2, tierName: 'Applied' },
        sourceBookId: 'book-1',
        competencies: ['1NF, 2NF, 3NF normalization rules', 'OLTP transaction normalization', 'Denormalization for analytical read speed', 'Primary and surrogate key design'],
        interviewTraps: ['Using 3NF normalized schemas for multi-terabyte analytical queries, resulting in 20-table slow joins'],
        description: 'Structuring schemas for transactional consistency (OLTP) versus high-performance analytical retrieval (OLAP).'
      },
      {
        id: 'node-relational-engines',
        level: 2,
        title: 'Relational Stores (Postgres / MySQL)',
        subtitle: 'B-Trees, WAL logs, MVCC, index strategies, vacuuming',
        icon: Server,
        accentColor: '#fb923c',
        trackTarget: { trackId: 'sql', tierNumber: 2, tierName: 'Applied' },
        sourceBookId: 'book-2',
        competencies: ['B-Tree vs BRIN indexes', 'EXPLAIN ANALYZE cost profiling', 'Write-Ahead Logs (WAL)', 'Multi-Version Concurrency Control (MVCC)'],
        interviewTraps: ['Wrapping indexed columns in functions (e.g. WHERE DATE(created_at) = ...), invalidating index seeks'],
        description: 'Mastering the storage engines, disk buffers, and locking semantics of production relational databases.'
      },
      {
        id: 'node-warehousing',
        level: 2,
        title: 'Data Warehousing (Kimball)',
        subtitle: 'Star schemas, fact tables, conformed dimensions, SCD',
        icon: Layers,
        accentColor: '#fb923c',
        trackTarget: { trackId: 'sql', tierNumber: 2, tierName: 'Applied' },
        sourceBookId: 'book-1',
        competencies: ['Grain declaration and business facts', 'Conformed dimensions and data bus', 'SCD Type 1, 2, 3 patterns', 'Star vs Snowflake schemas'],
        interviewTraps: ['Mixing grains inside a single fact table (e.g. order line items mixed with invoice headers)'],
        description: 'The industry-standard Kimball dimensional lifecycle: designing clean, business-intuitive star schemas.'
      },
      {
        id: 'node-spark-distributed',
        level: 2,
        title: 'Spark & Distributed Big Data',
        subtitle: 'Catalyst optimizer, DAGs, partitions, broadcast joins',
        icon: Zap,
        accentColor: '#fb923c',
        trackTarget: { trackId: 'pyspark', tierNumber: 2, tierName: 'Applied' },
        sourceBookId: 'book-3',
        competencies: ['Driver vs Executor architecture', 'Narrow vs Wide dependencies', 'Broadcast Hash Join optimization', 'Handling data skew via salting'],
        interviewTraps: ['Calling df.collect() on a 100-million row DataFrame, causing instant Driver out-of-memory crash'],
        description: 'Harnessing distributed compute across clusters with Apache Spark, eliminating memory spills and shuffle bottlenecks.'
      },
      {
        id: 'node-cloud-platforms',
        level: 2,
        title: 'Cloud Platforms Basics (AWS / Azure / GCP)',
        subtitle: 'S3/ADLS/GCS object storage, IAM roles, serverless compute',
        icon: Cloud,
        accentColor: '#ec4899',
        trackTarget: { trackId: 'databricks', tierNumber: 1, tierName: 'Foundation' },
        sourceBookId: 'book-6',
        competencies: ['Cloud storage lifecycle policies', 'Least-privilege IAM roles and service accounts', 'Private VPC subnets and endpoints', 'Serverless pricing tiers'],
        interviewTraps: ['Using permanent root access keys in scripts instead of temporary STS assumed IAM role tokens'],
        description: 'Deploying scalable data lakes and managed compute services on top of major public cloud providers.'
      }
    ]
  },
  {
    level: 3,
    levelTitle: 'Level 3 — Senior Data Engineer',
    levelSubtitle: 'Real-time event streaming, orchestration DAGs, NoSQL topologies, and pipeline observability',
    targetRole: 'Senior Data Engineer ($160k - $210k)',
    accentColor: '#a855f7',
    nodes: [
      {
        id: 'node-data-integration',
        level: 3,
        title: 'Data Integration & ELT',
        subtitle: 'Modern data stack, dbt, incremental models, zero-copy cloning',
        icon: Layers,
        accentColor: '#a855f7',
        trackTarget: { trackId: 'sql', tierNumber: 3, tierName: 'Mastery' },
        sourceBookId: 'book-6',
        competencies: ['dbt incremental materializations', 'Idempotent MERGE statement generation', 'Schema evolution and testing', 'Data contract enforcement'],
        interviewTraps: ['Running full table refreshes on 5-billion row tables instead of incremental watermarked MERGEs'],
        description: 'Building automated ELT transformations that scale with business data growth using dbt and modern warehouses.'
      },
      {
        id: 'node-streaming-kafka',
        level: 3,
        title: 'Streaming & Kafka',
        subtitle: 'Event brokers, partition consumer groups, exactly-once, watermarks',
        icon: Radio,
        accentColor: '#a855f7',
        trackTarget: { trackId: 'pyspark', tierNumber: 2, tierName: 'Applied' },
        sourceBookId: 'book-5',
        competencies: ['Log-structured broker internals', 'Consumer group rebalancing & offsets', 'Watermarking late-arriving events', 'Exactly-once semantics (EOS)'],
        interviewTraps: ['Omitting a watermark on stateful streaming queries, causing internal RocksDB state stores to grow indefinitely'],
        description: 'Building low-latency event processing architectures with Apache Kafka and Spark Structured Streaming.'
      },
      {
        id: 'node-orchestration',
        level: 3,
        title: 'Workflow Orchestration (Airflow)',
        subtitle: 'Directed Acyclic Graphs (DAGs), sensors, backfills, dynamic task mapping',
        icon: Cpu,
        accentColor: '#a855f7',
        trackTarget: { trackId: 'python', tierNumber: 3, tierName: 'Mastery' },
        sourceBookId: 'book-12',
        competencies: ['Idempotent historical backfills', 'Celery and Kubernetes executors', 'Airflow Pools and concurrency limits', 'Dynamic Task Mapping in Airflow 2'],
        interviewTraps: ['Making top-level database queries or API calls in the global DAG definition file, starving the Airflow scheduler'],
        description: 'Orchestrating complex enterprise dependency graphs with Apache Airflow and Databricks Workflows.'
      },
      {
        id: 'node-data-quality',
        level: 3,
        title: 'Data Quality & Quarantine',
        subtitle: 'Automated expectations, Great Expectations, DLT rules, drift detection',
        icon: CheckCheck,
        accentColor: '#a855f7',
        trackTarget: { trackId: 'databricks', tierNumber: 2, tierName: 'Applied' },
        sourceBookId: 'book-6',
        competencies: ['Delta Live Tables expectations', 'Quarantine routing without pipeline crashes', 'Statistical distribution drift alerts', 'Schema assertion contracts'],
        interviewTraps: ['Using fail-stop validations on external dirty feeds instead of soft quarantine isolation'],
        description: 'Implementing automated data quality firewalls that quarantine bad data without halting critical pipelines.'
      },
      {
        id: 'node-nosql',
        level: 3,
        title: 'NoSQL & Non-Relational Stores',
        subtitle: 'Cassandra, MongoDB, DynamoDB, wide-column & document tradeoffs',
        icon: Database,
        accentColor: '#a855f7',
        trackTarget: { trackId: 'architecture', tierNumber: 2, tierName: 'Applied' },
        sourceBookId: 'book-2',
        competencies: ['Consistent hashing & partition keys', 'CAP theorem trade-offs (CP vs AP)', 'Query-driven modeling in Cassandra', 'LSM-Trees vs B-Trees'],
        interviewTraps: ['Querying Cassandra without partition keys, forcing slow full-cluster scatter-gather scans'],
        description: 'Selecting and tuning non-relational distributed databases for high-throughput, low-latency workloads.'
      },
      {
        id: 'node-observability',
        level: 3,
        title: 'Observability & Pipeline SLAs',
        subtitle: 'Data lineage, freshness telemetry, Datadog/Prometheus, alerting',
        icon: Activity,
        accentColor: '#a855f7',
        trackTarget: { trackId: 'architecture', tierNumber: 3, tierName: 'Mastery' },
        sourceBookId: 'book-6',
        competencies: ['SLI/SLO definitions for pipeline freshness', 'OpenTelemetry metrics integration', 'Automated lineage tracking via OpenLineage', 'Silent data failure detection'],
        interviewTraps: ['Only alerting on hard pipeline crashes, failing to detect silent zero-byte record drops'],
        description: 'Monitoring distributed data systems for freshness, volume anomalies, and schema drift.'
      }
    ]
  },
  {
    level: 4,
    levelTitle: 'Level 4 — Principal / Staff Data Architect',
    levelSubtitle: 'Enterprise data mesh, fine-grained security governance, IaC, and platform system design',
    targetRole: 'Staff / Principal Data Architect ($210k - $350k+)',
    accentColor: '#10b981',
    nodes: [
      {
        id: 'node-governance-security',
        level: 4,
        title: 'Data Governance & Access Control',
        subtitle: 'Unity Catalog ABAC, dynamic column masking, row filtering, lineage',
        icon: Shield,
        accentColor: '#10b981',
        trackTarget: { trackId: 'databricks', tierNumber: 3, tierName: 'Mastery' },
        sourceBookId: 'book-4',
        competencies: ['Attribute-Based Access Control (ABAC)', 'SQL UDF dynamic column masking', 'Row-level security filter functions', 'Automated end-to-end data lineage'],
        interviewTraps: ['Cloning tables into separate sanitized schemas instead of using dynamic column masking on base tables'],
        description: 'Enforcing fine-grained access control, PII anonymization, and regulatory compliance across the enterprise.'
      },
      {
        id: 'node-system-design-patterns',
        level: 4,
        title: 'System Design Patterns for Data',
        subtitle: 'Lambda vs Kappa vs Delta Lakehouse, Change Data Capture (CDC)',
        icon: Compass,
        accentColor: '#10b981',
        trackTarget: { trackId: 'architecture', tierNumber: 3, tierName: 'Mastery' },
        sourceBookId: 'book-8',
        competencies: ['Log-centric Kappa architecture', 'Debezium database CDC to Kafka', 'ACID transaction logs on cloud storage', 'Multi-region disaster recovery'],
        interviewTraps: ['Building separate batch and streaming pipelines (Lambda) without shared business logic, leading to permanent code drift'],
        description: 'Architecting resilient, multi-petabyte data platforms that unify streaming and batch processing.'
      },
      {
        id: 'node-iac-terraform',
        level: 4,
        title: 'Infrastructure as Code (Terraform)',
        subtitle: 'Declarative cloud provisioning, state management, modular blueprints',
        icon: Server,
        accentColor: '#10b981',
        trackTarget: { trackId: 'architecture', tierNumber: 3, tierName: 'Mastery' },
        sourceBookId: 'book-6',
        competencies: ['Terraform state locking with S3 & DynamoDB', 'Reusable modules for data pipelines', 'IAM least-privilege automation', 'CI/CD Terraform plans'],
        interviewTraps: ['Clicking through the cloud web console to configure production infrastructure without code tracking'],
        description: 'Automating the provisioning of compute clusters, storage buckets, and networking through versioned code.'
      },
      {
        id: 'node-finops',
        level: 4,
        title: 'FinOps & Cost Optimization',
        subtitle: 'DBU auditing, serverless right-sizing, liquid clustering, storage tiering',
        icon: DollarSign,
        accentColor: '#10b981',
        trackTarget: { trackId: 'databricks', tierNumber: 3, tierName: 'Mastery' },
        sourceBookId: 'book-4',
        competencies: ['Analyzing `system.billing.usage` telemetry', 'Photon acceleration cost-benefit analysis', 'S3 Intelligent-Tiering and compaction', 'Auto-termination enforcement'],
        interviewTraps: ['Allowing un-compacted millions of tiny Parquet files to accumulate, inflating cloud metadata costs by 10x'],
        description: 'Monitoring and slashing cloud data warehouse spend while accelerating query response times.'
      },
      {
        id: 'node-data-mesh',
        level: 4,
        title: 'Data Mesh & Domain Products',
        subtitle: 'Domain-oriented ownership, self-serve data platforms, federated governance',
        icon: Network,
        accentColor: '#10b981',
        trackTarget: { trackId: 'architecture', tierNumber: 3, tierName: 'Mastery' },
        sourceBookId: 'book-9',
        competencies: ['Data as a Product principles', 'Decentralized domain ownership', 'Self-serve platform infrastructure', 'Federated computational governance'],
        interviewTraps: ['Trying to implement Data Mesh in a 10-person startup where a central team is vastly more efficient'],
        description: 'Transitioning from monolithic central data teams to decentralized, domain-driven data products.'
      }
    ]
  }
];

export const WindingRoadmap: React.FC<{
  completedIds?: string[];
  bookmarkedIds?: string[];
  onToggleComplete?: (id: string) => void;
  onToggleBookmark?: (id: string) => void;
  onNavigateTrack?: (trackId: string, tierNumber?: number) => void;
  onNavigateBook?: (bookId: string) => void;
  onOpenQuickNote?: (ref: ContentRef) => void;
}> = ({
  completedIds = ['node-linux', 'node-git', 'node-sql-fund'],
  bookmarkedIds = ['node-spark-distributed'],
  onToggleComplete,
  onToggleBookmark,
  onNavigateTrack,
  onNavigateBook,
  onOpenQuickNote
}) => {
  const [selectedNode, setSelectedNode] = useState<LeveledNode | null>(null);
  const [activeLevelFilter, setActiveLevelFilter] = useState<number | 'all'>('all');

  const handleSelectNode = (node: LeveledNode) => {
    setSelectedNode(node);
  };

  const totalNodesCount = LEVELED_ROADMAP.reduce((acc, lvl) => acc + lvl.nodes.length, 0);
  const completedCount = completedIds.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 font-sans">
      
      {/* 1. Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-forge-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-forge-card border border-forge-border text-forge-secondary">
              Career Roadmap
            </span>
            <span className="text-xs text-forge-secondary font-mono">
              4-Tiered Journey • Associate → Mid-Level → Senior → Staff Architect
            </span>
          </div>
          <h1 className="text-2xl font-black text-forge-text tracking-tight mt-1">Data Engineering Career Path</h1>
          <p className="text-xs text-forge-secondary font-mono mt-0.5">
            Every node maps directly to a Skill Track tier and foundational Vault textbook
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3.5 py-1.5 rounded-xl bg-forge-card border border-forge-border flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-track-python" />
            <span className="text-forge-text font-bold">{completedCount} / {totalNodesCount} Topics Mastered</span>
          </div>
        </div>
      </div>

      {/* 2. Level Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <button
          onClick={() => setActiveLevelFilter('all')}
          className={`px-3 py-1.5 rounded-xl border font-semibold transition-all ${
            activeLevelFilter === 'all'
              ? 'bg-forge-surface text-track-sql border-track-sql shadow-sm'
              : 'bg-forge-card text-forge-secondary border-forge-border hover:text-forge-text'
          }`}
        >
          All 4 Levels
        </button>
        {LEVELED_ROADMAP.map((lvl) => (
          <button
            key={lvl.level}
            onClick={() => setActiveLevelFilter(lvl.level)}
            className={`px-3 py-1.5 rounded-xl border font-semibold transition-all ${
              activeLevelFilter === lvl.level
                ? 'bg-forge-surface border-track-sql text-track-sql shadow-sm'
                : 'bg-forge-card text-forge-secondary border-forge-border hover:text-forge-text'
            }`}
          >
            L{lvl.level}: {lvl.levelTitle.split('—')[1]?.trim()}
          </button>
        ))}
      </div>

      {/* 3. The 4 Leveled Legs */}
      <div className="space-y-10">
        {LEVELED_ROADMAP.filter(lvl => activeLevelFilter === 'all' || activeLevelFilter === lvl.level).map((lvl) => {
          const completedInLevel = lvl.nodes.filter(n => completedIds.includes(n.id)).length;

          return (
            <div key={lvl.level} className="rounded-3xl bg-forge-card border border-forge-border p-6 sm:p-8 space-y-6 shadow-md relative overflow-hidden">
              
              {/* Level Decorative Background Accent */}
              <div 
                className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-5 pointer-events-none"
                style={{ backgroundColor: lvl.accentColor }}
              />

              {/* Level Title Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-forge-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border"
                      style={{
                        backgroundColor: `${lvl.accentColor}15`,
                        borderColor: `${lvl.accentColor}40`,
                        color: lvl.accentColor
                      }}
                    >
                      {lvl.targetRole}
                    </span>
                    <span className="text-xs font-mono text-forge-secondary">
                      {completedInLevel} / {lvl.nodes.length} Complete
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-forge-text mt-1">{lvl.levelTitle}</h2>
                  <p className="text-xs text-forge-secondary">{lvl.levelSubtitle}</p>
                </div>
              </div>

              {/* Horizontal Node Track */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
                {lvl.nodes.map((node, nIdx) => {
                  const Icon = node.icon;
                  const isCompleted = completedIds.includes(node.id);
                  const isBookmarked = bookmarkedIds.includes(node.id);
                  const isSelected = selectedNode?.id === node.id;

                  return (
                    <div
                      key={node.id}
                      onClick={() => handleSelectNode(node)}
                      className={`rounded-2xl border p-4 cursor-pointer transition-all flex flex-col justify-between space-y-3 relative group ${
                        isSelected
                          ? 'border-track-sql ring-2 ring-track-sql/30 bg-forge-surface shadow-md'
                          : isCompleted
                            ? 'bg-forge-surface/60 border-track-python/30 hover:border-track-python/60'
                            : 'bg-forge-surface border-forge-border hover:border-forge-secondary/60'
                      }`}
                    >
                      {/* Top Bar: Icon + Completed indicator */}
                      <div className="flex items-center justify-between">
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-inner"
                          style={{
                            backgroundColor: `${node.accentColor}15`,
                            borderColor: `${node.accentColor}40`,
                            color: node.accentColor
                          }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="flex items-center gap-1">
                          {isCompleted && (
                            <CheckCircle2 className="w-4 h-4 text-track-python" />
                          )}
                          {isBookmarked && (
                            <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
                          )}
                        </div>
                      </div>

                      {/* Middle: Title & Subtitle */}
                      <div>
                        <h4 className="text-xs font-bold text-forge-text group-hover:text-track-sql transition-colors leading-snug">
                          {node.title}
                        </h4>
                        <p className="text-[11px] text-forge-secondary line-clamp-2 mt-1 leading-snug">
                          {node.subtitle}
                        </p>
                      </div>

                      {/* Bottom: Track Link Badge */}
                      <div className="pt-2 border-t border-forge-border/40 flex items-center justify-between text-[10px] font-mono text-forge-secondary">
                        <span className="truncate max-w-[120px]">
                          {node.trackTarget.trackId.toUpperCase()} • {node.trackTarget.tierName}
                        </span>
                        <ArrowRight className="w-3 h-3 text-forge-secondary group-hover:text-track-sql group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

      {/* 4. NODE DETAIL DRAWER / SIDE SHEET */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-forge-card border border-forge-border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-forge-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-forge-surface text-track-sql border border-forge-border">
                    Level {selectedNode.level} Topic
                  </span>
                  <span className="text-xs text-forge-secondary font-mono">
                    Target Track: {selectedNode.trackTarget.trackId.toUpperCase()} ({selectedNode.trackTarget.tierName} Tier)
                  </span>
                </div>
                <h3 className="text-xl font-black text-forge-text mt-1">{selectedNode.title}</h3>
                <p className="text-xs text-forge-secondary font-mono mt-0.5">{selectedNode.subtitle}</p>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-xl bg-forge-surface border border-forge-border text-forge-secondary hover:text-forge-text"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Overview */}
            <div className="space-y-1">
              <h4 className="text-xs font-mono font-bold text-forge-secondary uppercase">Overview</h4>
              <p className="text-xs text-forge-text leading-relaxed">{selectedNode.description}</p>
            </div>

            {/* Competencies */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-forge-secondary uppercase">Core Technical Competencies</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedNode.competencies.map((comp, i) => (
                  <li key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-forge-bg border border-forge-border text-forge-text">
                    <CheckCircle2 className="w-3.5 h-3.5 text-track-python shrink-0 mt-0.5" />
                    <span>{comp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interview Traps */}
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span className="text-xs font-bold text-red-400 font-mono uppercase">Staff DE Interview Traps</span>
              </div>
              <ul className="list-disc list-inside text-xs text-forge-text space-y-1 pl-1">
                {selectedNode.interviewTraps.map((trap, i) => (
                  <li key={i}>{trap}</li>
                ))}
              </ul>
            </div>

            {/* Actions: Jump to Track, Open Book, Capture Note, Complete */}
            <div className="pt-4 border-t border-forge-border flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleComplete && onToggleComplete(selectedNode.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    completedIds.includes(selectedNode.id)
                      ? 'bg-track-python/20 text-track-python border-track-python/40'
                      : 'bg-forge-surface text-forge-secondary border-forge-border hover:text-forge-text'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{completedIds.includes(selectedNode.id) ? 'Mastered ✓' : 'Mark Complete'}</span>
                </button>

                <button
                  onClick={() => onToggleBookmark && onToggleBookmark(selectedNode.id)}
                  className={`p-2 rounded-xl border text-xs transition-colors ${
                    bookmarkedIds.includes(selectedNode.id)
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-forge-surface text-forge-secondary border-forge-border hover:text-forge-text'
                  }`}
                  title="Bookmark topic"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onOpenQuickNote && onOpenQuickNote({
                    type: 'roadmap_node',
                    id: selectedNode.id,
                    title: selectedNode.title
                  })}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-forge-surface border border-forge-border text-xs text-forge-secondary hover:text-track-sql"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>+ Note</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {selectedNode.sourceBookId && (
                  <button
                    onClick={() => onNavigateBook && onNavigateBook(selectedNode.sourceBookId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forge-surface border border-forge-border text-xs text-forge-text hover:bg-forge-surface/80"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-track-sql" />
                    <span>Open Book</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    const target = selectedNode;
                    setSelectedNode(null);
                    if (onNavigateTrack && target) {
                      onNavigateTrack(target.trackTarget.trackId, target.trackTarget.tierNumber);
                    }
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-track-sql text-black font-bold text-xs hover:bg-track-sql/90 shadow-sm"
                >
                  <span>Practice in {selectedNode.trackTarget.tierName} Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
