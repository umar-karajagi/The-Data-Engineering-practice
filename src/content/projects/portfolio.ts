import { ProjectCaseStudy } from '../../types';

export const PORTFOLIO_PROJECTS: ProjectCaseStudy[] = [
  {
    id: 'proj-databricks-lakeflow',
    title: 'Alteryx/Legacy ETL → Databricks Lakeflow Migration',
    subtitle: 'Migrating 50+ brittle legacy workflows to declarative Delta Live Tables & Unity Catalog',
    track: 'azure',
    difficulty: 'Staff DE',
    technologies: ['Databricks Lakeflow', 'Delta Live Tables (DLT)', 'Auto Loader', 'Unity Catalog', 'DABs (Databricks Asset Bundles)'],
    businessScenario: 'A Fortune 500 retail enterprise had 50+ unmonitored Alteryx workflows ingesting disparate SharePoint Excel files, vendor REST APIs, and legacy Oracle dumps. Workflows suffered from frequent silent failures, schema drift, and zero data lineage.',
    pipelineArchitecture: [
      'Lakeflow Connect captures change data from on-prem Oracle DBs without JDBC impact',
      'Auto Loader continuously ingests unstructured PDF invoices and CSV files landing in cloud storage',
      'Delta Live Tables (DLT) defines declarative Bronze -> Silver -> Gold pipelines with automated data quality expectations (@dlt.expect_or_drop)',
      'Unity Catalog enforces column-level masking (PII compliance) and automated table-to-dashboard data lineage'
    ],
    githubBlueprint: 'https://github.com/dataforge-mastery/databricks-lakeflow-migration-blueprint',
    keyLessons: [
      'Declarative ETL eliminates manual state tracking and backfilling logic.',
      'Auto Loader file notification mode scales linearly to millions of files without directory-listing timeouts.'
    ]
  },
  {
    id: 'proj-modern-lakehouse',
    title: 'Enterprise Modern Lakehouse Platform (DE Zoomcamp Pattern)',
    subtitle: 'Production-grade containerized pipeline with Apache Spark, Airflow, dbt, and Delta Lake',
    track: 'warehousing',
    difficulty: 'Advanced',
    technologies: ['Apache Airflow', 'Apache Spark', 'dbt-core', 'Delta Lake / Iceberg', 'Docker Compose', 'Terraform'],
    businessScenario: 'Building an end-to-end modern analytics lakehouse from scratch. Transforming 100M+ NYC Taxi and Ride-Hailing trip records to produce executive dynamic pricing and route optimization models.',
    pipelineArchitecture: [
      'Terraform provisions cloud storage buckets, IAM roles, and serverless compute clusters',
      'Apache Airflow orchestrates parameterized monthly DAG runs with idempotent backfills',
      'Apache Spark batch jobs execute schema validation and write partitioned Parquet/Delta files',
      'dbt builds Kimball star schema dimensional models with automated freshness and unique test assertions'
    ],
    githubBlueprint: 'https://github.com/dataforge-mastery/enterprise-modern-lakehouse',
    keyLessons: [
      'Idempotent DAG design allows safe re-execution of historical intervals without generating duplicate rows.',
      'dbt data contracts prevent upstream schema changes from silently breaking downstream BI dashboards.'
    ]
  },
  {
    id: 'proj-kafka-streaming',
    title: 'Real-Time Financial Fraud Detection with Kafka & Spark',
    subtitle: 'Sub-second event-driven anomaly detection with Exactly-Once Semantics (EOS)',
    track: 'architecture',
    difficulty: 'Staff DE',
    technologies: ['Apache Kafka', 'Spark Structured Streaming', 'RocksDB State Store', 'Debezium CDC', 'Redis'],
    businessScenario: 'A digital neobank processing $50M daily requires real-time flagging of fraudulent transactions (e.g. credit card swiped in London 10 minutes after a swipe in Tokyo).',
    pipelineArchitecture: [
      'Mobile banking apps emit signed payment events to a 32-partition Kafka cluster',
      'Spark Structured Streaming consumes events with cooperative sticky assignors to prevent rebalance pauses',
      'Stateful streaming join compares the current transaction with the customer’s last known location stored in an in-memory RocksDB state store',
      'Flagged anomalies are emitted to an alerting Kafka topic and cached in Redis with < 30ms latency'
    ],
    githubBlueprint: 'https://github.com/dataforge-mastery/realtime-fraud-kafka-spark',
    keyLessons: [
      'Watermarking prevents unbounded memory growth in stateful stream processing by discarding late events.',
      'Cooperative sticky assignors eliminate stop-the-world consumer group rebalances.'
    ]
  }
];
