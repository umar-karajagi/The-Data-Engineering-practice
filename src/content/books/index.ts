import { BookReference } from '../../types';
import { getEnhancedPdfMetadata } from './pdfBookMetadata';

const VAULT_PDF_MAP: Record<string, { fileName: string; fileSizeFormatted: string }> = {
  'book-1': {
    fileName: 'The_Data_Warehouse_Toolkit_-_Kimball.pdf',
    fileSizeFormatted: '6.89 MB',
  },
  'book-2': {
    fileName: 'Designing Data-Intensive Applications The Big Ideas Behind Reliable, Scalable, and Maintainable Systems by Martin Kleppmann (z-lib.org).pdf',
    fileSizeFormatted: '23.3 MB',
  },
  'book-3': {
    fileName: 'spark-the-definitive-guide40www.bigdatabugs.com_.pdf',
    fileSizeFormatted: '18.4 MB',
  },
  'book-4': {
    fileName: 'dldg_databricks.pdf',
    fileSizeFormatted: '8.2 MB',
  },
  'book-5': {
    fileName: 'Kafka The Definitive Guide Real-Time Data and Stream Processing at Scale, Second Edition by Gwen Shapira, Todd Palino, Rajini Sivaram, Krit Petty (z-lib.org).pdf',
    fileSizeFormatted: '6.9 MB',
  },
  'book-6': {
    fileName: 'Fundamentals of Data Engineering (Reis, JoeHousley, Matt) (Z-Library).pdf',
    fileSizeFormatted: '8.4 MB',
  },
  'book-7': {
    fileName: "System Design Interview An Insider's Guide by Alex Xu (z-lib.org).pdf",
    fileSizeFormatted: '14.1 MB',
  },
  'book-8': {
    fileName: 'system-design-interview-an-insiders-guide-volume-2-1736049119-9781736049112_compress.pdf',
    fileSizeFormatted: '19.8 MB',
  },
  'book-9': {
    fileName: 'Data Mesh Delivering Data-Driven Value at Scale.pdf',
    fileSizeFormatted: '5.3 MB',
  },
  'book-10': {
    fileName: 'Alan_Beaulieu-Learning_SQL-EN.pdf',
    fileSizeFormatted: '1.8 MB',
  },
  'book-11': {
    fileName: 'Python-for-Data-Analysis.pdf',
    fileSizeFormatted: '15.2 MB',
  },
  'book-12': {
    fileName: 'Bas_P_Harenslak,_Julian_Rutger_de_Ruiter_Data_Pipelines_with_Apache.pdf',
    fileSizeFormatted: '21.4 MB',
  },
  'book-13': {
    fileName: 'AI_ENGINEERING_BUILDING_APPLICATIONS_WITH_FOUNDATION_MODELS_BY_C.pdf',
    fileSizeFormatted: '31.9 MB',
  },
};

const RAW_FOUNDATIONAL_BOOKS: BookReference[] = [
  {
    id: 'book-1',
    title: 'The Data Warehouse Toolkit',
    author: 'Ralph Kimball & Margy Ross',
    coverColor: '#14B8A6',
    track: 'warehousing',
    coreConcepts: ['Dimensional Modeling', 'Fact Tables', 'Conformed Dimensions', 'SCD Types 1, 2, 3, 6', 'Grain Definition'],
    description: 'The definitive authority on dimensional modeling for business intelligence and enterprise data warehousing.',
    keyTakeaways: [
      'Always declare the grain of the fact table before choosing dimensions and facts.',
      'Conformed dimensions allow cross-functional drill-across queries between different business processes.',
      'SCD Type 2 preserves historical context with effective and expiration timestamps.'
    ],
    chapters: [
      {
        id: 'kimball-ch1',
        number: 1,
        title: 'Dimensional Modeling Fundamentals',
        readingTime: '18 min',
        summary: 'OLTP vs OLAP, 3NF vs Star Schema, and Kimball four-step dimensional design process.',
        content: `
# Dimensional Modeling Fundamentals

Data warehousing is designed for analytical querying, not transaction processing. Normalizing tables into 3rd Normal Form (3NF) reduces redundancy for writes, but cripples query performance for analytical aggregations.

### The Kimball 4-Step Design Method
1. **Select the Business Process**: Identify the operational activity (e.g. Sales, Claims, Orders).
2. **Declare the Grain**: Exactly what does one row represent? (e.g. one line item on a retail receipt).
3. **Identify the Dimensions**: The "who, what, where, when, and why" context.
4. **Identify the Facts**: Quantitative numeric metrics that result from the business event.
        `,
        seniorTip: 'Never mix grains in the same fact table. An order header cannot live in the same row as line-item details.',
        antiPattern: 'Creating Fact-to-Fact direct joins in business queries. Always traverse through conformed dimensions.',
        linkedPracticeId: 'sql-kimball-scd2'
      },
      {
        id: 'kimball-ch2',
        number: 2,
        title: 'Slowly Changing Dimensions (SCD 1, 2, 3, 6)',
        readingTime: '22 min',
        summary: 'Tracking historical changes to customer addresses, sales tiers, and product hierarchies over time.',
        content: `
# Slowly Changing Dimensions

When an entity changes (e.g., customer moves from NY to CA), how does the warehouse preserve historical sales reporting?

- **Type 1 (Overwrite)**: Old value is replaced. Destroys historical accuracy.
- **Type 2 (Add New Row)**: Inserts a new record with \`valid_from\`, \`valid_to\`, and \`is_current\` flag. The industry standard for auditability.
- **Type 3 (Add New Attribute)**: Preserves previous value in an adjacent column (\`prev_address\`).
- **Type 6 (Hybrid 1+2+3)**: Stores current value across all historical rows while retaining historical records.
        `,
        seniorTip: 'Use artificial Surrogate Keys as primary keys instead of natural operational keys.',
        linkedPracticeId: 'sql-kimball-scd2'
      }
    ]
  },
  {
    id: 'book-2',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    coverColor: '#A855F7',
    track: 'architecture',
    coreConcepts: ['Replication (Single/Multi-leader, Leaderless)', 'SSTables / LSM-Trees vs B-Trees', 'Transactions & Isolation Levels', 'Consensus & Raft', 'Partitioning Strategies'],
    description: 'The premier deep-dive into distributed systems, data storage engine primitives, reliability, and consensus.',
    keyTakeaways: [
      'LSM-Trees optimize for write throughput using sequential log append and background compaction.',
      'Leaderless replication uses quorums (W + R > N) to guarantee strong consistency.',
      'Serializable Snapshot Isolation (SSI) provides strict consistency without locks using optimistic execution.'
    ],
    chapters: [
      {
        id: 'ddia-ch1',
        number: 3,
        title: 'Storage Engines: B-Trees vs. LSM-Trees',
        readingTime: '25 min',
        summary: 'How databases physically store bytes on disk: Append-only write logs, SSTables, and write amplification.',
        content: `
# Storage Engines: SSTables and LSM-Trees

At the lowest level, every database or distributed store (Cassandra, RocksDB, Bigtable) uses one of two storage primitives:

### 1. B-Trees (PostgreSQL, MySQL)
- Updates in-place on fixed-size pages (4KB - 16KB).
- Fast point reads: \`O(log N)\`.
- Heavy write amplification and random disk I/O.

### 2. LSM-Trees & SSTables (Cassandra, Kafka, RocksDB)
- Writes append sequentially to an in-memory **Memtable** (balanced tree).
- Flushed to disk as immutable sorted string tables (**SSTables**).
- Background compaction merges duplicate keys. Sequential disk writes make LSM-trees 10x faster for ingestion pipelines!
        `,
        seniorTip: 'When sizing Kafka and Cassandra clusters, account for background compaction I/O headroom.',
        antiPattern: 'Using random UUIDs as B-Tree primary keys. This causes frequent page splits and fragmentations.'
      }
    ]
  },
  {
    id: 'book-3',
    title: 'Spark: The Definitive Guide',
    author: 'Bill Chambers & Matei Zaharia',
    coverColor: '#F97316',
    track: 'pyspark',
    coreConcepts: ['Catalyst Optimizer', 'Tungsten Execution Engine', 'DAG Stages', 'Shuffle Partitions', 'Broadcast Hash Joins', 'Data Skew Handling'],
    description: 'Written by the creators of Apache Spark. Complete guide to distributed processing, memory architecture, and optimization.',
    keyTakeaways: [
      'Narrow transformations execute in-memory; wide transformations cross the network shuffle boundary.',
      'Broadcast Hash Joins eliminate SortMergeJoin shuffles for small dimension tables.',
      'Salting distributes skewed partition keys across cluster executors.'
    ],
    chapters: [
      {
        id: 'spark-ch1',
        number: 4,
        title: 'Catalyst Optimizer & Execution Plans',
        readingTime: '24 min',
        summary: 'From unresolved logical plan to optimized whole-stage Java bytecode generation.',
        content: `
# The Catalyst Optimizer Pipeline

Spark SQL converts DataFrame operations into optimized physical bytecode through 4 distinct phases:
1. **Analysis**: Resolves table/column names against the Metastore.
2. **Logical Optimization**: Applies rule-based heuristics:
   - *Predicate Pushdown*: Filters rows at the storage level.
   - *Column Pruning*: Reads only required columns.
3. **Physical Planning**: Chooses execution algorithms (BroadcastHashJoin vs SortMergeJoin).
4. **Code Generation (Tungsten)**: Generates Whole-Stage Java bytecode running at CPU register speeds.
        `,
        seniorTip: 'Always inspect df.explain(True) to verify predicate pushdown into Parquet files.',
        linkedPracticeId: 'pyspark-skew-salting'
      }
    ]
  },
  {
    id: 'book-4',
    title: 'Delta Lake: The Definitive Guide',
    author: 'Bippy Siegal, Denny Lee et al.',
    coverColor: '#14B8A6',
    track: 'warehousing',
    coreConcepts: ['ACID Transactions', 'Delta Transaction Log (_delta_log)', 'Time Travel', 'OPTIMIZE with Z-ORDERING', 'Schema Evolution', 'Liquid Clustering'],
    description: 'The complete architectural guide to building reliable Lakehouses on object storage using Delta Lake.',
    keyTakeaways: [
      'The _delta_log JSON commits provide atomic commit guarantees on eventual-consistency object stores like S3.',
      'Z-ORDER multidimensional clustering co-locates related data across multiple dimensions in Parquet files.',
      'Delta MERGE INTO handles atomic upserts for CDC pipelines.'
    ],
    chapters: [
      {
        id: 'delta-ch1',
        number: 5,
        title: 'The Transaction Log & ACID Semantics',
        readingTime: '20 min',
        summary: 'How Delta Lake guarantees serializable snapshot isolation on cloud object storage.',
        content: `
# The Delta Transaction Log (_delta_log)

Traditional object stores lack file locking and multi-file atomic transactions. Delta Lake solves this with an append-only transaction log:
- Every write commits a JSON log file: \`000000.json\`, \`000001.json\`.
- Every 10 commits, Delta writes an optimized Parquet checkpoint file.
- Reads reconstruct the exact file set corresponding to that version point-in-time!
        `,
        seniorTip: 'Regularly run VACUUM retain 168 HOURS to remove obsolete snapshots without breaking active concurrent queries.'
      }
    ]
  },
  {
    id: 'book-5',
    title: 'Kafka: The Definitive Guide',
    author: 'Neha Narkhede, Gwen Shapira, Todd Palino',
    coverColor: '#A855F7',
    track: 'architecture',
    coreConcepts: ['Broker Architecture', 'Topic Partitions', 'Consumer Group Rebalances', 'Cooperative Sticky Assignors', 'Exactly-Once Semantics (EOS)'],
    description: 'Master real-time event streaming architectures, partition throughput, and fault tolerance at scale.',
    keyTakeaways: [
      'Partitions are the fundamental unit of parallelism in Kafka.',
      'Cooperative sticky assignors eliminate stop-the-world pauses during consumer group rebalances.',
      'Transactional producers combined with read_committed consumers guarantee end-to-end exactly-once semantics.'
    ],
    chapters: [
      {
        id: 'kafka-ch1',
        number: 6,
        title: 'Partitioning & Consumer Group Mechanics',
        readingTime: '22 min',
        summary: 'Message ordering, partition assignment strategies, and handling rebalances without latency spikes.',
        content: `
# Kafka Topic Partitioning

Messages with the same key are guaranteed to land on the same partition, guaranteeing strict ordering per key.

### Consumer Group Rebalances
- **Eager Rebalance**: All consumers revoke all partitions, stopping message consumption until rebalance finishes.
- **Cooperative Sticky Rebalance**: Consumers only revoke partitions being moved, maintaining continuous message processing!
        `
      }
    ]
  },
  {
    id: 'book-6',
    title: 'Fundamentals of Data Engineering',
    author: 'Joe Reis & Matt Housley',
    coverColor: '#3B82F6',
    track: 'architecture',
    coreConcepts: ['Data Engineering Lifecycle', 'Undercurrents (Security, DataOps, FinOps)', 'Storage & Ingestion Trade-offs', 'Serving Layer'],
    description: 'The comprehensive framework for the end-to-end data engineering lifecycle.',
    keyTakeaways: [
      'Separate storage and compute to control elasticity and cloud costs.',
      'Idempotency and immutability are the twin pillars of resilient pipeline design.',
      'Data observability prevents silent data corruption.'
    ],
    chapters: [
      {
        id: 'reis-ch1',
        number: 1,
        title: 'The Data Engineering Lifecycle',
        readingTime: '15 min',
        summary: 'Generation -> Ingestion -> Storage -> Transformation -> Serving.',
        content: `
# The Modern Data Lifecycle

Data engineering bridges software applications and downstream intelligence. The lifecycle spans 5 stages surrounded by security, DataOps, architecture, and orchestration.
        `
      }
    ]
  },
  {
    id: 'book-7',
    title: 'System Design Interview – An Insider Guide',
    author: 'Alex Xu',
    coverColor: '#A855F7',
    track: 'architecture',
    coreConcepts: ['Scaling Distributed Compute', 'Caching Layers (Redis)', 'Rate Limiting (Token Bucket)', 'Message Queues'],
    description: 'The industry-standard guide to distributed system design interviews and scalable architectures.',
    keyTakeaways: ['Design for high availability with redundancy and horizontal scaling.', 'Use token bucket algorithms for rate-limiting incoming ingestion APIs.'] ,
    chapters: []
  },
  {
    id: 'book-8',
    title: 'System Design Interview: Volume 2',
    author: 'Alex Xu & Sahn Lam',
    coverColor: '#A855F7',
    track: 'architecture',
    coreConcepts: ['Distributed Message Queues', 'Metrics Monitoring Pipelines', 'Distributed File Storage', 'Real-Time Gaming Telemetry'],
    description: 'Advanced real-world distributed architectures with deep mathematical back-of-the-envelope calculations.',
    keyTakeaways: ['Decouple ingestion throughput from downstream sink write latency with durable message queues.'],
    chapters: []
  },
  {
    id: 'book-9',
    title: 'Data Mesh',
    author: 'Zhamak Dehghani',
    coverColor: '#14B8A6',
    track: 'warehousing',
    coreConcepts: ['Domain-Oriented Data Ownership', 'Data as a Product', 'Self-Serve Data Platforms', 'Federated Computational Governance'],
    description: 'Decentralizing analytical data architectures across autonomous domain teams.',
    keyTakeaways: ['Shift from centralized monolithic data lakes to federated domain-owned data products.'],
    chapters: []
  },
  {
    id: 'book-10',
    title: 'Learning SQL',
    author: 'Alan Beaulieu',
    coverColor: '#3B82F6',
    track: 'sql',
    coreConcepts: ['Query Execution Mechanics', 'Set Operators', 'Subqueries', 'Analytical Window Functions', 'Grouping Sets'],
    description: 'Master the foundations of relational database query syntax and set theory.',
    keyTakeaways: ['Write set-based queries rather than procedural loops for peak performance.'],
    chapters: []
  },
  {
    id: 'book-11',
    title: 'Python for Data Analysis',
    author: 'Wes McKinney',
    coverColor: '#84CC16',
    track: 'python',
    coreConcepts: ['Vectorized Transformations', 'Memory-Efficient Data Structures', 'NumPy/Pandas Optimization', 'Apache Arrow'],
    description: 'Written by the creator of Pandas and co-creator of Apache Arrow.',
    keyTakeaways: ['Vectorization avoids Python interpreter loop overhead by pushing compute to C/SIMD instructions.'],
    chapters: []
  },
  {
    id: 'book-12',
    title: 'Data Pipelines with Apache Airflow',
    author: 'Bas P. Harenslak & Julian Rutger de Ruiter',
    coverColor: '#3B82F6',
    track: 'architecture',
    coreConcepts: ['DAGs', 'Dynamic Task Generation', 'Idempotency & Backfilling', 'Sensors vs Hooks vs Operators', 'TaskFlow API'],
    description: 'The definitive architectural guide to production workflow orchestration.',
    keyTakeaways: ['Design Airflow DAGs to be deterministic and idempotent to simplify backfilling.'],
    chapters: []
  },
  {
    id: 'book-13',
    title: 'AI Engineering: Building Applications with Foundation Models',
    author: 'Chip Huyen',
    coverColor: '#EC4899',
    track: 'architecture',
    coreConcepts: ['RAG Data Ingestion Pipelines', 'Vector Databases & Indexing (HNSW)', 'Chunking Strategies', 'Embeddings Batch Processing', 'Agentic Workflows'],
    description: 'Designing production data engineering pipelines for Generative AI and Foundation Models.',
    keyTakeaways: ['RAG pipelines require careful chunking, metadata enrichment, and vector similarity search optimization.'],
    chapters: []
  }
];

export const FOUNDATIONAL_BOOKS: BookReference[] = RAW_FOUNDATIONAL_BOOKS.map(book => {
  const vaultInfo = VAULT_PDF_MAP[book.id];
  if (vaultInfo) {
    const enhanced = getEnhancedPdfMetadata(vaultInfo.fileName, 0);
    return {
      ...book,
      formatType: 'book' as const,
      originalFileName: vaultInfo.fileName,
      fileSizeFormatted: vaultInfo.fileSizeFormatted,
      conceptCards: (enhanced.conceptCards && enhanced.conceptCards.length > 0) ? enhanced.conceptCards : book.conceptCards,
      quizQuestions: (enhanced.quizQuestions && enhanced.quizQuestions.length > 0) ? enhanced.quizQuestions : book.quizQuestions,
      chapters: (book.chapters && book.chapters.length > 0) ? book.chapters : (enhanced.chapters || []),
    };
  }
  return book;
});

