import { TopicItem } from '../../types';

export const TRACKER_TOPICS: TopicItem[] = [
  // 1. SQL Track
  {
    id: 'topic-sql-1',
    track: 'sql',
    title: 'Window Functions: ROW_NUMBER vs RANK vs DENSE_RANK',
    category: 'Analytical SQL',
    difficulty: 'Medium',
    priority: 'High',
    confidence: 4,
    status: 'In Progress',
    source_book: 'Learning SQL (Alan Beaulieu)',
    summary: 'Differences in handling ties: ROW_NUMBER assigns distinct arbitrary integers, RANK leaves gaps after ties (1, 2, 2, 4), DENSE_RANK preserves consecutive order (1, 2, 2, 3).',
    keyInterviewQuestions: [
      'When finding the 2nd highest salary, why is DENSE_RANK required instead of LIMIT 1 OFFSET 1?',
      'How does the database execute window functions under the hood without collapsing rows?'
    ]
  },
  {
    id: 'topic-sql-2',
    track: 'sql',
    title: 'Snowflake Time Travel & Data Retention Architecture',
    category: 'Cloud SQL Dialects',
    difficulty: 'Advanced',
    priority: 'High',
    confidence: 3,
    status: 'Not Started',
    source_book: 'Data Engineering with Databricks / Snowflake Docs',
    summary: 'Querying historical table states using AT(OFFSET => ...), AT(TIMESTAMP => ...), or BEFORE(STATEMENT => ...). Explores Fail-safe storage costs and micro-partition clone mechanics.',
    keyInterviewQuestions: [
      'What is the difference between Time Travel retention period and Fail-safe in Snowflake?',
      'How does zero-copy cloning work under the hood without duplicating underlying storage bytes?'
    ]
  },
  {
    id: 'topic-sql-3',
    track: 'sql',
    title: 'Delta Lake MERGE INTO & Schema Evolution',
    category: 'Lakehouse SQL',
    difficulty: 'Advanced',
    priority: 'High',
    confidence: 3,
    status: 'In Progress',
    source_book: 'Delta Lake: The Definitive Guide',
    summary: 'Atomic upserts into Delta tables using MERGE INTO. Handling schema evolution with spark.databricks.delta.schema.autoMerge.enabled and target partition pruning.',
    keyInterviewQuestions: [
      'How do you prevent full table scans when running a daily MERGE INTO on a multi-terabyte Delta table?',
      'What happens when a source column type changes from INT to BIGINT during a Delta merge?'
    ]
  },

  // 2. Python & PySpark Track
  {
    id: 'topic-pyspark-1',
    track: 'pyspark',
    title: 'Catalyst Optimizer: Logical to Physical Plan Pipeline',
    category: 'Spark Architecture',
    difficulty: 'Staff DE',
    priority: 'High',
    confidence: 3,
    status: 'In Progress',
    source_book: 'Spark: The Definitive Guide (Chambers & Zaharia)',
    summary: 'From unresolved logical plan to analyzed, optimized (predicate pushdown, column pruning), physical planning (cost model), and Tungsten whole-stage bytecode generation.',
    keyInterviewQuestions: [
      'Walk me through what happens under the hood when df.filter().groupBy().count() executes.',
      'How does Adaptive Query Execution (AQE) modify the physical plan dynamically at runtime?'
    ]
  },
  {
    id: 'topic-pyspark-2',
    track: 'pyspark',
    title: 'Data Skew Handling: Key Salting & Broadcast Joins',
    category: 'Spark Performance',
    difficulty: 'Hard',
    priority: 'High',
    confidence: 4,
    status: 'Done',
    source_book: 'Spark: The Definitive Guide (Chambers & Zaharia)',
    summary: 'Fixing straggler tasks in distributed shuffles. Salting appends a random prefix (0..N) to hot keys, while exploding the dimension table to balance executor memory.',
    keyInterviewQuestions: [
      'How do you diagnose data skew using the Spark UI Event Timeline?',
      'What are the memory risks of broadcasting a table that is larger than spark.sql.autoBroadcastJoinThreshold?'
    ]
  },

  // 3. DSA for Data Engineers
  {
    id: 'topic-dsa-1',
    track: 'dsa',
    title: 'Sliding Window & Two Pointers for Streaming Data',
    category: 'Algorithms',
    difficulty: 'Medium',
    priority: 'High',
    confidence: 4,
    status: 'In Progress',
    source_book: 'Python for Data Analysis (Wes McKinney)',
    summary: 'Sliding window algorithms implemented in Python to calculate rolling metrics, maximum sum sub-arrays, and tumbling event windows with bounded O(N) complexity.',
    keyInterviewQuestions: [
      'How do you compute a rolling 7-day median over an unbounded stream of transaction values in O(log K) per event?'
    ]
  },

  // 4. Azure & Databricks Stack
  {
    id: 'topic-azure-1',
    track: 'azure',
    title: 'Databricks Lakeflow Connect & Auto Loader Ingestion',
    category: 'Modern Databricks Stack',
    difficulty: 'Advanced',
    priority: 'High',
    confidence: 3,
    status: 'Not Started',
    source_book: 'Data Engineering with Databricks',
    summary: 'Auto Loader (`cloudFiles`) incrementally processes millions of new files arriving in ADLS Gen2/S3 without file-listing bottlenecks by leveraging cloud notification services (Event Grid/SNS).',
    keyInterviewQuestions: [
      'Why does standard directory listing fail at petabyte scale, and how does Auto Loader notification mode solve it?',
      'How does Unity Catalog manage data lineage across Lakeflow pipelines?'
    ]
  },

  // 5. Data Warehousing & Modeling
  {
    id: 'topic-dwh-1',
    track: 'warehousing',
    title: 'Kimball Dimensional Modeling: Facts, Conformed Dimensions, Grain',
    category: 'Data Architecture',
    difficulty: 'Medium',
    priority: 'High',
    confidence: 5,
    status: 'Done',
    source_book: 'The Data Warehouse Toolkit (Ralph Kimball)',
    summary: 'Designing Star and Snowflake schemas. Differentiating Transaction Facts, Periodic Snapshot Facts, and Accumulating Snapshot Facts with conformed dimensions across bus architecture.',
    keyInterviewQuestions: [
      'When would you design a Factless Fact Table, and what business questions does it answer?',
      'Explain the difference between Kimball dimensional bus architecture and Inmon Corporate Information Factory (CIF).'
    ]
  },

  // 6. Core DE Concepts
  {
    id: 'topic-core-1',
    track: 'architecture',
    title: 'Idempotency, Deduplication & Dead Letter Queues (DLQ)',
    category: 'Pipeline Design',
    difficulty: 'Hard',
    priority: 'High',
    confidence: 4,
    status: 'In Progress',
    source_book: 'Fundamentals of Data Engineering (Reis & Housley)',
    summary: 'Designing deterministic pipelines where running a batch multiple times produces the exact same state without duplicate records. Isolating malformed payloads into DLQs.',
    keyInterviewQuestions: [
      'How do you achieve idempotency when inserting into a database that does not support unique constraints?',
      'Explain how Change Data Capture (CDC) via Debezium guarantees zero data loss without polling tables.'
    ]
  },

  // 7. System Design & Distributed Systems
  {
    id: 'topic-sys-1',
    track: 'architecture',
    title: 'Designing a 200,000 Events/Sec Clickstream Ingestion Lakehouse',
    category: 'Distributed System Design',
    difficulty: 'Staff DE',
    priority: 'High',
    confidence: 3,
    status: 'In Progress',
    source_book: 'System Design Interview: Volume 2 (Alex Xu)',
    summary: 'End-to-end distributed design: Edge API Gateway -> Kafka Partitioned Buffer -> Spark / Flink Streaming -> Medallion Apache Iceberg / Delta Lake on S3 -> Trino / Redis serving.',
    keyInterviewQuestions: [
      'How do you size Kafka partitions for 200k events/sec with 1KB message size?',
      'How do you solve the Small Files Problem when writing real-time streams to cloud object storage?'
    ]
  },

  // 8. Behavioral & Global Markets
  {
    id: 'topic-behav-1',
    track: 'behavioral',
    title: 'STAR Method: Production Outage & Data Corruption Incident',
    category: 'Staff DE Behavioral',
    difficulty: 'Medium',
    priority: 'High',
    confidence: 4,
    status: 'Done',
    source_book: 'System Design Interview – An Insider Guide (Alex Xu)',
    summary: 'Structuring impactful interview responses for Staff DE leadership: Situation, Task, Action (root-cause analysis, communication, mitigation), and Result (SLAs restored, post-mortem guardrails).',
    keyInterviewQuestions: [
      'Tell me about a time when a critical upstream pipeline corrupted executive dashboard KPIs. How did you handle stakeholder communication and rollback?'
    ]
  }
];
