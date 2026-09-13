import { CareerPath } from '@/types';

export const ALL_CAREER_PATHS: CareerPath[] = [
  {
    id: 'CP-01',
    slug: 'production-data-engineer',
    title: 'Production Data Engineer',
    targetRole: 'Data Engineer / Senior Data Engineer',
    subtitle: 'End-to-end production data engineering: distributed computing, Lakehouse architectures, orchestration, and streaming.',
    outcomeStatement: 'Design, build, scale, and monitor mission-critical ETL/ELT pipelines and distributed Lakehouse platforms handling terabyte-scale data with strict SLAs and zero data loss.',
    description: 'The definitive end-to-end curriculum for building resilient, cloud-scale data infrastructure. Master Linux, Python, SQL internals, dimensional modeling, PySpark distributed execution, Databricks Medallion architecture, and distributed consistency.',
    level: 'Beginner to Advanced',
    durationHoursRange: '120-160 hrs',
    featured: true,
    orderedCourseIds: ['SF-01', 'SF-02', 'SF-04', 'SF-07', 'SF-11', 'SF-15', 'SF-16', 'SF-18', 'SF-21'],
    milestones: [
      {
        title: 'Foundation: Developer Environment & Relational Mechanics',
        description: 'Complete Linux shell automation, Git collaboration, production Python design, and ANSI SQL query execution plans.',
        requiredCourseIds: ['SF-01', 'SF-02', 'SF-04']
      },
      {
        title: 'Core Architecture: Dimensional Warehousing & Orchestration',
        description: 'Design Kimball star schemas, implement change data capture, and orchestrate resilient DAGs with Apache Airflow.',
        requiredCourseIds: ['SF-07', 'SF-11']
      },
      {
        title: 'Scale & Distributed Systems: PySpark & Lakehouse Mastery',
        description: 'Master Apache Spark memory partitions, broadcast joins, Delta Lake ACID transactions, and Databricks production jobs.',
        requiredCourseIds: ['SF-15', 'SF-16', 'SF-18', 'SF-21']
      }
    ],
    capstone: {
      id: 'CP-01-CAP',
      title: 'Enterprise Multi-Tier Lakehouse Pipeline with Airflow, PySpark & Delta Lake',
      problemStatement: 'A global fintech enterprise processes 50M daily transactions across 8 microservices. Design an idempotent Lakehouse pipeline ingesting raw JSON events into Bronze, enriching and deduplicating in Silver (handling late-arriving records), and publishing Kimball dimensional aggregates to Gold for financial compliance reporting.',
      businessScenario: 'Transactions arrive with out-of-order timestamps and schema drift. Batch pipelines must execute within a 45-minute window and maintain zero financial discrepancy across ledger reconciliations.',
      deliverables: [
        'Idempotent Airflow DAG with retry backoff and SLA alerting',
        'PySpark PySpark script reading Bronze JSON and merging to Silver Delta with surrogate keys',
        'Gold aggregation tables with SCD Type 2 customer dimension',
        'Architectural design document covering partition pruning, Z-Ordering, and data reconciliation audit tests'
      ],
      rubricItems: [
        {
          id: 'rb-1',
          criterion: 'Idempotency & Late-Arriving Data Handling',
          weightPercent: 30,
          guidance: 'Must use MERGE INTO or partition overwrites with deterministic watermarks to prevent duplicate ledger entries.'
        },
        {
          id: 'rb-2',
          criterion: 'Distributed Query & Spark Optimization',
          weightPercent: 30,
          guidance: 'Eliminate cartesian joins, eliminate data skew using salting or broadcast thresholds, configure adaptive query execution.'
        },
        {
          id: 'rb-3',
          criterion: 'Data Quality & Contract Verification',
          weightPercent: 20,
          guidance: 'Ensure primary key uniqueness, non-null financial totals, and balance checks before writing to Gold.'
        },
        {
          id: 'rb-4',
          criterion: 'Production Runbook & Failure Recovery',
          weightPercent: 20,
          guidance: 'Document rollback steps, poison pill message dead-letter handling, and backfill execution guidelines.'
        }
      ],
      portfolioOutput: 'Production-ready GitHub repository with Terraform infrastructure mocks, Airflow DAGs, PySpark jobs, unit tests with pytest, and architecture documentation.'
    },
    portfolioDeliverables: [
      'Production PySpark ETL Pipeline Repo with Docker Compose Local Cluster',
      'Airflow DAG orchestration suite with automated test fixtures',
      'Fintech Lakehouse Architecture Whitepaper & Benchmarking Results'
    ],
    interviewPrepChecklist: [
      'Explain Spark Catalyst optimizer: Logical vs Physical Plan vs Whole-Stage CodeGen',
      'Walk through a shuffle operation: Map status, partition files, network transfer, spill to disk',
      'Compare SCD Type 1, Type 2, and Type 3 with SQL MERGE examples',
      'How to detect and resolve data skew in PySpark joins',
      'ACID guarantees in Delta Lake / Parquet: Write-Ahead Log vs optimistic concurrency control'
    ],
    lastReviewed: '2026-03-01'
  },
  {
    id: 'CP-02',
    slug: 'analytics-engineer',
    title: 'Analytics Engineer',
    targetRole: 'Analytics Engineer / BI Engineer / Data Modeling Specialist',
    subtitle: 'Modern data stack mastery: Dimensional modeling, dbt Core, semantic layers, SQL optimization, and automated testing.',
    outcomeStatement: 'Bridge raw transactional tables and high-impact business intelligence by authoring tested, modular, version-controlled SQL data models using dbt and cloud warehouses.',
    description: 'Transform raw data into trusted, query-optimized analytical models. Master Kimball dimensional methodology, window functions, dbt DAG structuring, snapshotting for SCDs, semantic layers, and automated data quality assertions.',
    level: 'Beginner to Intermediate',
    durationHoursRange: '80-100 hrs',
    featured: true,
    orderedCourseIds: ['SF-01', 'SF-04', 'SF-05', 'SF-07', 'SF-08', 'SF-09', 'SF-10', 'SF-12'],
    milestones: [
      {
        title: 'SQL Internals & Advanced Analytics',
        description: 'Write robust analytical SQL, window frames, CTEs, and query plan diagnostics.',
        requiredCourseIds: ['SF-01', 'SF-04', 'SF-05']
      },
      {
        title: 'Dimensional Modeling & Storage Fundamentals',
        description: 'Design star schemas, conformed dimensions, fact grain definitions, and columnar layouts.',
        requiredCourseIds: ['SF-07', 'SF-08']
      },
      {
        title: 'Production dbt Transformation & Governance',
        description: 'Build dbt project architectures, incremental models, custom generic tests, and semantic documentation.',
        requiredCourseIds: ['SF-09', 'SF-10', 'SF-12']
      }
    ],
    capstone: {
      id: 'CP-02-CAP',
      title: 'E-Commerce Marketplace Analytics Engine with dbt & Snowflake/BigQuery',
      problemStatement: 'Build a production-grade dbt analytics project modeling customer acquisition, subscription churn, and revenue attribution across 10M orders.',
      businessScenario: 'Marketing and Finance teams report conflicting ARR figures due to differing definitions of churn and refund timing. Implement a single source of truth.',
      deliverables: [
        'Staging models with column normalization and type casting',
        'Intermediate entity models with recurring subscription state machines',
        'Mart dimensions (dim_customers SCD2) and facts (fct_orders, fct_monthly_mrr)',
        'Comprehensive test suite with generic tests, custom singular tests, and dbt documentation site'
      ],
      rubricItems: [
        {
          id: 'rb-1',
          criterion: 'Dimensional Model Architecture',
          weightPercent: 35,
          guidance: 'Strict adherence to star schema principles, surrogate keys, unambiguous grain declarations.'
        },
        {
          id: 'rb-2',
          criterion: 'Incremental Optimization & Performance',
          weightPercent: 30,
          guidance: 'Appropriate use of incremental strategy (merge vs delete+insert) and clustering keys.'
        },
        {
          id: 'rb-3',
          criterion: 'Testing & Documentation',
          weightPercent: 35,
          guidance: '100% documentation coverage on marts, unique/not_null tests on primary keys, relationship referential integrity.'
        }
      ],
      portfolioOutput: 'Clean dbt project repository with CI pipeline (GitHub Actions running dbt build), generated catalog docs, and SQL data lineage diagrams.'
    },
    portfolioDeliverables: [
      'Complete dbt Core Repository with Staging, Intermediate, and Mart Layers',
      'Data Quality Test Suite with Great Expectations / dbt-expectations',
      'Executive KPI Data Dictionary and Lineage Graph'
    ],
    interviewPrepChecklist: [
      'Difference between Views, Tables, Incremental, and Ephemeral materializations in dbt',
      'How to implement SCD Type 2 with dbt snapshots vs custom window queries',
      'Explain Window frame specifications (ROWS BETWEEN vs RANGE BETWEEN)',
      'How to resolve circular dependency traps in dbt DAGs',
      'Techniques to optimize columnar storage scans (partitioning, clustering, micro-partitions)'
    ],
    lastReviewed: '2026-03-01'
  },
  {
    id: 'CP-03',
    slug: 'streaming-systems-engineer',
    title: 'Streaming & Real-Time Systems Engineer',
    targetRole: 'Streaming Data Engineer / Real-Time Infrastructure Engineer',
    subtitle: 'Event-driven architectures: Kafka topics, event streaming, exactly-once processing, windowed aggregates, and low-latency serving.',
    outcomeStatement: 'Design and deploy resilient event-driven systems processing sub-second event streams with Apache Kafka and Spark Structured Streaming.',
    description: 'Master real-time event streaming architectures. Learn Kafka internals (partitions, brokers, consumer groups, offsets, replication), event schema evolution with Schema Registry, watermarking, stateful stream-stream joins, and micro-batch vs continuous processing.',
    level: 'Intermediate to Advanced',
    durationHoursRange: '90-120 hrs',
    featured: false,
    orderedCourseIds: ['SF-02', 'SF-03', 'SF-04', 'SF-15', 'SF-17', 'SF-21', 'SF-22'],
    milestones: [
      {
        title: 'Foundations of Concurrent & Distributed Processing',
        description: 'Deep dive into Python asynchronous concurrency, memory management, and distributed systems fundamentals.',
        requiredCourseIds: ['SF-02', 'SF-03', 'SF-04']
      },
      {
        title: 'Kafka Architecture & Topic Topology',
        description: 'Producer partitioners, consumer offset commits, high-watermark replication, and serialization with Avro/Protobuf.',
        requiredCourseIds: ['SF-17']
      },
      {
        title: 'Stateful Stream Processing & Exactly-Once Semantics',
        description: 'Spark Structured Streaming, event-time watermarking, sessionization, state store management, and sinking to real-time stores.',
        requiredCourseIds: ['SF-15', 'SF-21', 'SF-22']
      }
    ],
    capstone: {
      id: 'CP-03-CAP',
      title: 'Real-Time Fraud Detection Pipeline with Kafka, Spark Streaming & Redis',
      problemStatement: 'Construct an end-to-end streaming detection system processing 20,000 payment events per second. Flag fraudulent credit card transactions within 250 milliseconds.',
      businessScenario: 'Attackers perform distributed credential-stuffing and micro-charge testing across global card networks. Windowed velocity metrics must be computed against sliding 5-minute windows with 10-second sliding strides.',
      deliverables: [
        'Kafka cluster setup (Docker Compose) with producers generating realistic transaction streams',
        'Spark Structured Streaming application computing sliding window velocity features',
        'Stateful feature lookup against Redis key-value cache',
        'Dead-letter queue (DLQ) pattern for corrupted messages and schema validation failures'
      ],
      rubricItems: [
        {
          id: 'rb-1',
          criterion: 'Watermarking & Late Data Handling',
          weightPercent: 35,
          guidance: 'Correct watermarking strategy to drop or divert late arrivals without corrupting stateful aggregations.'
        },
        {
          id: 'rb-2',
          criterion: 'End-to-End Processing Latency & Throughput',
          weightPercent: 35,
          guidance: 'Sub-second micro-batch trigger execution with tuned shuffle partitions and JVM heap settings.'
        },
        {
          id: 'rb-3',
          criterion: 'Fault Tolerance & Recovery Semantics',
          weightPercent: 30,
          guidance: 'Demonstrate zero duplicate alerts upon simulated worker crash using checkpointing and write-ahead logs.'
        }
      ],
      portfolioOutput: 'Fully containerized repository with load generation script, Kafka UI, Spark streaming job, Grafana metrics dashboard, and fault-injection tests.'
    },
    portfolioDeliverables: [
      'Containerized Real-Time Event Processing Architecture',
      'Benchmark report comparing micro-batch vs continuous streaming performance',
      'Streaming Failure Recovery & Disaster Protocol Runbook'
    ],
    interviewPrepChecklist: [
      'Kafka partition rebalancing protocols: Eager vs Cooperative Sticky assignment',
      'At-least-once vs At-most-once vs Exactly-once semantics across producers, brokers, consumers',
      'Difference between Event Time, Processing Time, and Ingestion Time',
      'How Spark Structured Streaming manages state stores (HDFS backed RocksDB state store provider)',
      'Backpressure mechanics in streaming systems'
    ],
    lastReviewed: '2026-03-01'
  },
  {
    id: 'CP-04',
    slug: 'lakehouse-platform-architect',
    title: 'Lakehouse & Platform Architect',
    targetRole: 'Data Architect / Principal Data Engineer / Lakehouse Architect',
    subtitle: 'Enterprise storage engines, multi-engine compute governance, unified cataloging, and cloud-scale data mesh patterns.',
    outcomeStatement: 'Architect modern enterprise data platforms unifying analytics, machine learning, and operational reporting on open table formats with unified governance and cost efficiency.',
    description: 'Design the future of data infrastructure. Master open table formats (Apache Iceberg, Delta Lake, Apache Hudi), unified catalog architecture (Unity Catalog, Polaris, Tabular), compute-storage decoupling, multi-cloud strategy, cost governance, and zero-copy data sharing.',
    level: 'Advanced',
    durationHoursRange: '100-140 hrs',
    featured: false,
    orderedCourseIds: ['SF-04', 'SF-07', 'SF-08', 'SF-15', 'SF-16', 'SF-18', 'SF-19', 'SF-21', 'SF-24'],
    milestones: [
      {
        title: 'Open Table Formats & Storage Internals',
        description: 'Understand metadata trees, snapshot isolation, file compaction, copy-on-write vs merge-on-read.',
        requiredCourseIds: ['SF-04', 'SF-07', 'SF-08']
      },
      {
        title: 'Multi-Engine Compute & Catalog Governance',
        description: 'Unify query access across Databricks, Snowflake, Trino, and DuckDB over a shared catalog.',
        requiredCourseIds: ['SF-15', 'SF-18', 'SF-19']
      },
      {
        title: 'Distributed System Topology & Data Mesh Architecture',
        description: 'Implement domain-driven data mesh, automated data contracts, and global fine-grained access control.',
        requiredCourseIds: ['SF-21', 'SF-24']
      }
    ],
    capstone: {
      id: 'CP-04-CAP',
      title: 'Enterprise Multi-Engine Lakehouse Architecture on Apache Iceberg & Unity Catalog',
      problemStatement: 'Design a unified enterprise platform for a multinational retail conglomerate replacing 4 isolated data warehouses. Enable Spark, Trino, and Snowflake to query a single copy of 100TB data stored on cloud object storage.',
      businessScenario: 'Eliminate $400k/month redundant storage and compute egress fees while enforcing GDPR row-level security and column masking across all query engines.',
      deliverables: [
        'Complete Lakehouse Architecture Blueprint diagram with network topology and IAM policies',
        'Iceberg table specification with partition evolution and maintenance procedures (compaction, snapshot expiration)',
        'Unified catalog access policy matrix with ABAC (Attribute-Based Access Control)',
        'Total Cost of Ownership (TCO) financial model and migration strategy'
      ],
      rubricItems: [
        {
          id: 'rb-1',
          criterion: 'Decoupled Architecture Viability',
          weightPercent: 35,
          guidance: 'Proves independent scaling of storage and heterogeneous compute engines with single source of truth.'
        },
        {
          id: 'rb-2',
          criterion: 'Governance, Lineage & Compliance',
          weightPercent: 35,
          guidance: 'Enforces tag-based masking, auditing, and automated GDPR right-to-be-forgotten compaction.'
        },
        {
          id: 'rb-3',
          criterion: 'Performance Tuning & TCO Justification',
          weightPercent: 30,
          guidance: 'Includes realistic benchmarking data comparing Delta Lake, Iceberg, and legacy Parquet query latencies.'
        }
      ],
      portfolioOutput: 'Architectural blueprint package with Terraform templates, Iceberg maintenance scripts, and executive presentation deck.'
    },
    portfolioDeliverables: [
      'Enterprise Lakehouse Architecture Specification Document',
      'Benchmarking Analysis: Apache Iceberg vs Delta Lake vs Apache Hudi',
      'Data Governance & Data Contract Framework'
    ],
    interviewPrepChecklist: [
      'How Apache Iceberg metadata tree enables atomic commits and partition evolution',
      'Compare Copy-on-Write (CoW) vs Merge-on-Read (MoR) in table format mutation workloads',
      'How to design a multi-cloud disaster recovery strategy for cloud object stores',
      'Explain Data Mesh vs Centralized Lakehouse trade-offs',
      'Strategies for optimizing cloud storage I/O costs: compaction, bloom filters, and metadata caching'
    ],
    lastReviewed: '2026-03-01'
  },
  {
    id: 'CP-05',
    slug: 'dataops-reliability-engineer',
    title: 'DataOps & Reliability Engineer',
    targetRole: 'DataOps Engineer / Data Platform Reliability Engineer (DPRE)',
    subtitle: 'Continuous integration, data testing, automated drift detection, observability, SLA alerting, and infrastructure as code.',
    outcomeStatement: 'Guarantee 99.9% pipeline reliability and zero silent data corruption by building automated CI/CD, synthetic test harnesses, and proactive data observability.',
    description: 'Bring modern software reliability engineering to the data ecosystem. Master Docker containerization, Kubernetes job runners, Terraform infrastructure provisioning, automated CI testing for SQL/Python, schema contract validation, and metric-based alerting with Prometheus and Grafana.',
    level: 'Intermediate to Advanced',
    durationHoursRange: '80-110 hrs',
    featured: false,
    orderedCourseIds: ['SF-01', 'SF-02', 'SF-06', 'SF-11', 'SF-12', 'SF-13', 'SF-14', 'SF-20'],
    milestones: [
      {
        title: 'Infrastructure Automation & Scripting',
        description: 'Automate environments with Bash, Docker containers, and Terraform declarative cloud definitions.',
        requiredCourseIds: ['SF-01', 'SF-02', 'SF-13', 'SF-14']
      },
      {
        title: 'Orchestration Health & Ingestion Resilience',
        description: 'Implement backpressure-aware ingestion and self-healing Airflow DAG topologies.',
        requiredCourseIds: ['SF-06', 'SF-11']
      },
      {
        title: 'Data Observability, Testing & CI/CD Pipelines',
        description: 'Build automated CI/CD gates running unit, integration, and statistical data anomaly tests before merge.',
        requiredCourseIds: ['SF-12', 'SF-13', 'SF-20']
      }
    ],
    capstone: {
      id: 'CP-05-CAP',
      title: 'Automated CI/CD Pipeline & Data Observability Suite with GitHub Actions & Docker',
      problemStatement: 'Implement an automated continuous integration and continuous deployment harness that spins up ephemeral DuckDB/Postgres instances, executes unit tests, validates data contracts against incoming schemas, and deploys verified DAGs to production with zero downtime.',
      businessScenario: 'Engineering teams frequently break downstream analytics by changing column datatypes without warning. Pipeline regressions must be caught in pull requests before reaching production.',
      deliverables: [
        'GitHub Actions CI workflow running linting (sqlfluff, ruff), type checks (mypy), and pytest unit tests',
        'Ephemeral integration test runner spinning up Docker containers with test data fixtures',
        'Data observability monitor flagging volume anomalies, freshness delays, and schema drift',
        'Incident postmortem report template and automated Slack/PagerDuty notification webhook'
      ],
      rubricItems: [
        {
          id: 'rb-1',
          criterion: 'CI/CD Automation Rigor',
          weightPercent: 35,
          guidance: 'All PRs must run automated linting, unit tests, and contract checks within 5 minutes without flaky failures.'
        },
        {
          id: 'rb-2',
          criterion: 'Schema Drift & Anomaly Detection',
          weightPercent: 35,
          guidance: 'Detect unexpected column drops, type mutations, and null-rate spikes using statistical thresholds.'
        },
        {
          id: 'rb-3',
          criterion: 'Observability & SLA Alerting',
          weightPercent: 30,
          guidance: 'Expose Prometheus metrics for DAG run duration, row counts, and error rates with Grafana dashboard.'
        }
      ],
      portfolioOutput: 'Ready-to-fork DataOps Starter Kit repo with GitHub Actions, Docker Compose, Terraform blueprints, and observability dashboards.'
    },
    portfolioDeliverables: [
      'Complete DataOps CI/CD Blueprint Repository',
      'Automated Data Contract Testing Suite',
      'Data Pipeline SLA & Observability Dashboard Configuration'
    ],
    interviewPrepChecklist: [
      'How to test data pipelines in CI without querying production databases or violating GDPR',
      'Explain the difference between Data Quality vs Data Observability',
      'How to structure Blue/Green and Canary deployments for database schema changes',
      'Techniques for handling schema drift in JSON ingestion pipelines',
      'Incident management: MTTR, MTTD, SLOs, and Error Budgets for data platforms'
    ],
    lastReviewed: '2026-03-01'
  }
];
