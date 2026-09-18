export interface InterviewQuestion {
  id: string;
  category: 'General DE' | 'SQL' | 'PySpark' | 'Airflow' | 'Kafka' | 'Snowflake' | 'System Design';
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  companies: string[];
  question: string;
  answer: string;
  codeSnippet?: string;
  keyTakeaways: string[];
}

export interface TechGuide {
  id: string;
  slug: string;
  title: string;
  category: 'Pipeline Engineering' | 'Databricks' | 'Architecture' | 'Data Quality' | 'Career';
  readTime: string;
  publishedDate: string;
  summary: string;
  content: string;
  tags: string[];
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'de-q1',
    category: 'General DE',
    title: 'Explain the difference between Data Lake, Data Warehouse, and Lakehouse.',
    difficulty: 'Medium',
    companies: ['Amazon', 'Google', 'Deloitte'],
    question: 'How do you explain the architectural and operational differences between a Data Lake, a Data Warehouse, and a Lakehouse to both technical and executive stakeholders?',
    answer: 'A Data Warehouse (e.g., Snowflake, BigQuery, Redshift) stores structured, cleansed, and curated data modeled in Kimball or Inmon schemas for high-speed SQL analytics. A Data Lake (e.g., S3, ADLS, GCS) stores structured, semi-structured, and unstructured raw data in low-cost object storage, but lacks ACID transaction guarantees. A Lakehouse (e.g., Delta Lake, Apache Iceberg, Apache Hudi) combines the low-cost scalability of object storage with ACID transactions, time travel, schema enforcement, and unified governance (Unity Catalog, Lake Formation).',
    keyTakeaways: [
      'Data Warehouse: High concurrency, structured data, schema-on-write, higher storage cost.',
      'Data Lake: Raw multi-format storage, schema-on-read, low cost, risk of data swamp without governance.',
      'Lakehouse: ACID transactions over Parquet, metadata layers, time-travel, single source of truth.'
    ]
  },
  {
    id: 'sql-q1',
    category: 'SQL',
    title: 'Deduplicating Rows using Window Functions (ROW_NUMBER vs RANK vs DENSE_RANK)',
    difficulty: 'Easy',
    companies: ['Meta', 'Uber', 'Apple', 'TCS'],
    question: 'How do ROW_NUMBER(), RANK(), and DENSE_RANK() differ when deduplicating records with tied timestamps or scores? Show the SQL query for picking only the latest updated record per entity.',
    answer: 'ROW_NUMBER() assigns a unique sequential integer (1, 2, 3...) regardless of ties. RANK() leaves gaps after ties (1, 2, 2, 4...). DENSE_RANK() leaves no gaps (1, 2, 2, 3...). For strict deduplication where exactly one record must survive, always use ROW_NUMBER().',
    codeSnippet: `WITH RankedRecords AS (
  SELECT 
    customer_id,
    order_id,
    status,
    updated_at,
    ROW_NUMBER() OVER (
      PARTITION BY customer_id 
      ORDER BY updated_at DESC, order_id DESC
    ) as row_num
  FROM raw_customer_orders
)
SELECT customer_id, order_id, status, updated_at
FROM RankedRecords
WHERE row_num = 1;`,
    keyTakeaways: [
      'ROW_NUMBER() guarantees deterministic single-row selection when combined with a secondary tie-breaker.',
      'Never use RANK() for 1-to-1 deduplication as ties produce duplicate qualifying rows.',
      'Always include indexed columns in PARTITION BY for distributed query engine performance.'
    ]
  },
  {
    id: 'spark-q1',
    category: 'PySpark',
    title: 'How to diagnose and mitigate Data Skew in PySpark Shuffles',
    difficulty: 'Hard',
    companies: ['Netflix', 'Amazon', 'Apple', 'Databricks'],
    question: 'In a large PySpark job, 199 tasks finish in 10 seconds, but task 200 runs for 45 minutes and fails with OutOfMemoryError. What is the root cause, and how do you resolve it?',
    answer: 'This is classic Data Skew. A single partition key (e.g., NULL values, popular product, default user ID) concentrates disproportionate data on a single executor. Solutions: 1) Salting: add a pseudo-random integer column (0 to N-1) to the skewed key in both DataFrames before joining; 2) Broadcast Join: if one side is under 10MB (or up to a few GBs with sufficient memory), use broadcast(dim_df) to avoid shuffling altogether; 3) Adaptive Query Execution (AQE): enable spark.sql.adaptive.skewJoin.enabled = true in Spark 3.x+.',
    codeSnippet: `-- Enable Spark 3.x AQE skew handling
spark.conf.set("spark.sql.adaptive.enabled", "true")
spark.conf.set("spark.sql.adaptive.skewJoin.enabled", "true")
spark.conf.set("spark.sql.adaptive.skewJoin.skewedPartitionFactor", "5")`,
    keyTakeaways: [
      'Identify skew by looking at Executor Task duration metrics in the Spark UI stages tab.',
      'Broadcast hash joins eliminate the shuffle phase completely for small dimension tables.',
      'Salting distributes high-cardinality spikes across multiple parallel reducers.'
    ]
  },
  {
    id: 'airflow-q1',
    category: 'Airflow',
    title: 'Idempotency and Backfilling in Apache Airflow',
    difficulty: 'Medium',
    companies: ['Walmart', 'Infosys', 'Accenture', 'Certa.ai'],
    question: 'What does it mean for an Airflow DAG to be idempotent, and why should you never use datetime.now() inside task execution logic?',
    answer: 'An idempotent pipeline produces the exact same end-state regardless of whether it runs once or is retried 10 times for the same logical execution date. Using datetime.now() couples the pipeline to physical wall-clock time, breaking backfilling and deterministic re-runs. Always use Airflow execution parameters like {{ ds }} (data interval start) or {{ logical_date }}.',
    codeSnippet: `# Correct Idempotent Pattern
def process_partition(**context):
    logical_date_str = context['ds'] # e.g., '2025-03-01'
    # Always write to or overwrite the specific partition directory:
    output_path = f"s3://my-bucket/partition_date={logical_date_str}/"
    transform_and_save(partition_date=logical_date_str, dest=output_path)`,
    keyTakeaways: [
      'Idempotency prevents duplicate rows upon automated task retries.',
      'Always partition destination tables by logical_date or ds.',
      'Use atomic overwrite or INSERT OVERWRITE patterns rather than blind appends.'
    ]
  },
  {
    id: 'kafka-q1',
    category: 'Kafka',
    title: 'Kafka Consumer Lag, Partition Rebalancing, and Delivery Semantics',
    difficulty: 'Hard',
    companies: ['Uber', 'LinkedIn', 'Netflix', 'Goldman Sachs'],
    question: 'How do you prevent Stop-the-World Consumer Group rebalances in Kafka during heavy processing bursts? Explain the difference between At-Least-Once and Exactly-Once Semantics (EOS).',
    answer: 'Rebalances occur when max.poll.interval.ms is exceeded before consumer.poll() is called again, causing the coordinator broker to presume the consumer dead. Mitigate by increasing max.poll.interval.ms, decreasing max.poll.records, or offloading heavy CPU transformations to an asynchronous worker thread pool while committing offsets synchronously. Exactly-Once Semantics (EOS) is achieved using Kafka transactional producers (isolation.level=read_committed) coupled with atomic writes to downstream state stores (e.g., two-phase commit or upsert on unique event ID).',
    keyTakeaways: [
      'Consumer lag = Log End Offset - Current Consumer Offset.',
      'Excessive processing per poll batch triggers heartbeat timeouts and expensive rebalance storms.',
      'At-Least-Once requires downstream deduplication (idempotent consumers).'
    ]
  },
  {
    id: 'design-q1',
    category: 'System Design',
    title: 'Design a Real-Time Clickstream Ingestion Pipeline at 100K Events/Sec',
    difficulty: 'Hard',
    companies: ['Google', 'Meta', 'Amazon', 'Apple'],
    question: 'Design an end-to-end streaming architecture that ingests 100,000 clicks/sec from mobile apps, validates schemas, enriches geolocation, supports sub-second operational dashboards, and writes Parquet archives to S3 for deep BI querying.',
    answer: 'Architecture: 1) Ingestion: Global API Gateway fronted by CloudFront routes to Kafka / AWS Kinesis across 64 partitions. 2) Stream Processing: Apache Flink or Spark Streaming consumes events, applies Schema Registry validation (Protobuf/Avro), and enriches with in-memory IP lookup. 3) Real-Time Path: Output written to ClickHouse or Apache Pinot for sub-second aggregations. 4) Batch/Cold Path: Kafka Connect / Delta Lake streaming sink writes compacted, Snappy-compressed Parquet files into S3 in 5-minute micro-batches partitioned by year/month/day/hour. 5) Catalog: AWS Glue / Unity Catalog enables Athena or Snowflake SQL querying.',
    keyTakeaways: [
      'Lambda/Kappa Architecture: Unified streaming engine with dual sinks (real-time OLAP + S3 Lakehouse).',
      'Partitioning strategy on Kafka must hash user_id or device_id to preserve event order per entity.',
      'Small file problem prevented by buffered compaction in Flink or Delta Lake OPTIMIZE.'
    ]
  }
];

export const TECH_GUIDES: TechGuide[] = [
  {
    id: 'guide-airflow-first-dag',
    slug: 'airflow-first-dag',
    title: 'Airflow Tutorial: Your First DAG, Explained Line by Line',
    category: 'Pipeline Engineering',
    readTime: '8 min read',
    publishedDate: 'Feb 2026',
    summary: 'A complete hands-on guide breaking down DAG context managers, TaskFlow API decorators, task dependencies, retries, and SLA configurations without boilerplate.',
    content: 'Apache Airflow 2.x introduces the TaskFlow API (@dag, @task), vastly simplifying DAG definitions. In this guide, we build a production-grade pipeline with retry backoffs, alert callbacks on failure, and environment secret injection.',
    tags: ['Airflow', 'Python', 'Orchestration', 'Best Practices']
  },
  {
    id: 'guide-medallion-architecture',
    slug: 'medallion-architecture-databricks',
    title: 'Medallion Architecture: Build a Real Lakehouse on Databricks, Layer by Layer',
    category: 'Architecture',
    readTime: '12 min read',
    publishedDate: 'Feb 2026',
    summary: 'Master Bronze (raw ingestion), Silver (cleansed, conformed, filtered), and Gold (business-level aggregate) data pipelines using Delta Lake ACID tables.',
    content: 'The Medallion pattern guarantees data quality progression. We demonstrate how to implement Auto Loader for streaming file ingestion into Bronze, apply Great Expectations / Delta Live Tables expectations at Silver, and materialize Kimball star schemas at Gold.',
    tags: ['Databricks', 'Delta Lake', 'Architecture', 'PySpark']
  },
  {
    id: 'guide-data-quality-checks',
    slug: '7-data-quality-checks-every-pipeline-needs',
    title: 'The 7 Data Quality Checks Every Pipeline Needs (With Real SQL)',
    category: 'Data Quality',
    readTime: '10 min read',
    publishedDate: 'Jan 2026',
    summary: 'Uniqueness, null checks, freshness SLAs, referential integrity, distribution anomaly alerts, and schema drift prevention implemented with standard SQL and dbt tests.',
    content: 'Data pipelines fail silently without automated verification. Learn how to construct SQL assertion tests that run automatically before promotion into production reporting tables.',
    tags: ['Data Quality', 'SQL', 'dbt', 'Testing']
  },
  {
    id: 'guide-scd-type-2',
    slug: 'scd-type-2-explained',
    title: 'SCD Type 2 Explained: Track History Without Losing It (Hands-On SQL)',
    category: 'Architecture',
    readTime: '9 min read',
    publishedDate: 'Jan 2026',
    summary: 'Deep dive into slowly changing dimensions type 2: surrogate key generation, effective date ranges, is_current flags, and high-performance MERGE operations in Snowflake & BigQuery.',
    content: 'When attributes like user subscription tier or address change over time, SCD Type 2 preserves the exact state as of any point in history. We break down the SQL MERGE mechanics step by step.',
    tags: ['Data Modeling', 'Kimball', 'Snowflake', 'BigQuery']
  }
];
