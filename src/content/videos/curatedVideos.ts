export interface VideoChapter {
  time: string;
  seconds: number;
  title: string;
}

export interface CuratedVideo {
  id: string;
  title: string;
  category: 'hero' | 'track' | 'course' | 'project' | 'interview';
  topic: 'Overview' | 'SQL' | 'Python' | 'Spark' | 'Airflow' | 'dbt' | 'Snowflake' | 'Kafka' | 'AWS' | 'GCP' | 'Azure' | 'Data Modeling' | 'System Design';
  instructor: string;
  instructorRole: string;
  youtubeId: string;
  youtubeUrl: string;
  duration: string;
  rating: number;
  views: string;
  level: 'Beginner' | 'Beginner → Intermediate' | 'Intermediate → Advanced' | 'Beginner → Advanced' | 'Advanced';
  summary: string;
  techStack: string[];
  chapters: VideoChapter[];
  keyTakeaways: string[];
  githubUrl?: string;
  datasetUrl?: string;
  practiceSnippet?: {
    language: 'sql' | 'python';
    code: string;
    explanation: string;
  };
}

export const HERO_MASTERCLASS_VIDEO: CuratedVideo = {
  id: 'hero-uber-analytics',
  title: 'End-to-End Data Engineering Project | Uber Data Analytics | GCP, Mage AI, BigQuery & Looker',
  category: 'hero',
  topic: 'GCP',
  instructor: 'Darshil Parmar',
  instructorRole: 'Lead Data Engineer & Founder',
  youtubeId: 'WpQECq5Hx9g',
  youtubeUrl: 'https://www.youtube.com/watch?v=WpQECq5Hx9g',
  duration: '1 hr 42 min',
  rating: 4.9,
  views: '1.2M+ views',
  level: 'Beginner → Intermediate',
  summary: 'A complete real-world data engineering walkthrough modeling millions of Uber trips. Learn dimensional modeling (Fact & Dimension tables), modern orchestration with Mage AI, Google Cloud Storage, BigQuery data warehousing, and Looker Studio dashboarding.',
  techStack: ['Python', 'Google Cloud Platform (GCP)', 'Mage AI', 'Google BigQuery', 'Looker Studio', 'Lucidchart'],
  chapters: [
    { time: '00:00', seconds: 0, title: 'Project Architecture & System Overview' },
    { time: '07:30', seconds: 450, title: 'Dataset Exploration & Entity Relationships' },
    { time: '18:15', seconds: 1095, title: 'Dimensional Modeling: Fact & Dimension Design' },
    { time: '35:40', seconds: 2140, title: 'GCP Cloud Storage Bucket Setup' },
    { time: '52:10', seconds: 3130, title: 'Mage AI Orchestration & Python ETL Pipeline' },
    { time: '01:15:20', seconds: 4520, title: 'Loading Analytics Mart into Google BigQuery' },
    { time: '01:30:45', seconds: 5445, title: 'Building Interactive Looker Studio Executive Dashboard' }
  ],
  keyTakeaways: [
    'Decomposing flat ride records into dimensional star schemas (dim_datetime, dim_rate_code, fact_trips)',
    'Configuring secure GCP Service Accounts and Compute Engine instances for automated pipelines',
    'Developing modular extract, transform, and load blocks using modern Python in Mage AI',
    'Executing optimized SQL aggregations in BigQuery for revenue per payment type'
  ],
  githubUrl: 'https://github.com/darshilparmar/uber-etl-pipeline-data-engineering-project',
  datasetUrl: 'https://github.com/darshilparmar/uber-etl-pipeline-data-engineering-project/blob/main/data/uber_data.csv',
  practiceSnippet: {
    language: 'sql',
    code: `SELECT 
  f.VendorID,
  d.payment_type_name,
  COUNT(f.trip_id) AS total_trips,
  ROUND(AVG(f.fare_amount), 2) AS avg_fare,
  ROUND(SUM(f.total_amount), 2) AS total_revenue
FROM fact_table f
JOIN dim_payment_type d ON f.payment_type_id = d.payment_type_id
GROUP BY f.VendorID, d.payment_type_name
ORDER BY total_revenue DESC;`,
    explanation: 'Aggregates total trips and revenue per payment type joining the Fact and Dimension tables in BigQuery.'
  }
};

export const CURATED_PROJECT_VIDEOS: CuratedVideo[] = [
  HERO_MASTERCLASS_VIDEO,
  {
    id: 'project-zomato-ai',
    title: 'Zomato AI Data Analytics | End-To-End AI Data Engineering Project',
    category: 'project',
    topic: 'GCP',
    instructor: 'Darshil Parmar',
    instructorRole: 'Lead Data Engineer',
    youtubeId: 'kYwaNMQ3XT8',
    youtubeUrl: 'https://www.youtube.com/watch?v=kYwaNMQ3XT8',
    duration: '1 hr 35 min',
    rating: 4.9,
    views: '480K+ views',
    level: 'Beginner → Intermediate',
    summary: 'Build a next-generation AI-powered food delivery data pipeline. Ingest restaurant transaction feeds, perform geospatial customer analytics, clean data with Python, and leverage Generative AI for automated menu categorization and sentiment scoring.',
    techStack: ['Python', 'Google Cloud', 'BigQuery', 'AI Analytics', 'Streamlit', 'Mage'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Introduction & AI Data Architecture' },
      { time: '08:45', seconds: 525, title: 'Zomato Dataset Cleaning & Geo-indexing' },
      { time: '24:30', seconds: 1470, title: 'Data Transformation & Embedding Generation' },
      { time: '45:10', seconds: 2710, title: 'Loading into BigQuery & Partition Optimization' },
      { time: '01:10:00', seconds: 4200, title: 'Interactive AI Analytics Dashboard' }
    ],
    keyTakeaways: [
      'Combining traditional SQL analytics with LLM-powered enrichment workflows',
      'Handling semi-structured restaurant menu JSON payloads at scale',
      'Optimizing query latency using BigQuery BI Engine and clustered tables'
    ],
    githubUrl: 'https://github.com/darshilparmar'
  },
  {
    id: 'project-twitter-airflow',
    title: 'Twitter Data Pipeline using Airflow for Beginners | Data Engineering Project',
    category: 'project',
    topic: 'Airflow',
    instructor: 'Darshil Parmar',
    instructorRole: 'Lead Data Engineer',
    youtubeId: 'q8q3OFFfY6c',
    youtubeUrl: 'https://www.youtube.com/watch?v=q8q3OFFfY6c',
    duration: '58 min',
    rating: 4.9,
    views: '540K+ views',
    level: 'Beginner → Intermediate',
    summary: 'Build a production-grade automated ETL pipeline orchestrating Twitter streaming data with Apache Airflow. Provision Amazon EC2, write custom Airflow DAGs with Python operators, extract tweets, and store refined Parquet datasets into Amazon S3.',
    techStack: ['Apache Airflow', 'Python', 'Amazon EC2', 'Amazon S3', 'Tweepy', 'Pandas'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'End-to-End Architecture Overview' },
      { time: '06:15', seconds: 375, title: 'Setting up AWS EC2 & Installing Apache Airflow' },
      { time: '18:30', seconds: 1110, title: 'Extracting Tweets using Python & Tweepy API' },
      { time: '32:45', seconds: 1965, title: 'Creating Airflow DAGs with PythonOperator' },
      { time: '45:20', seconds: 2720, title: 'Deploying S3 Hook & Automated Daily Scheduling' }
    ],
    keyTakeaways: [
      'Configuring Airflow webserver and scheduler daemons on cloud instances',
      'Writing clean idempotent DAG definitions with proper retries and SLA callbacks',
      'Using Airflow AWS S3 Hooks for secure cloud credentials management'
    ],
    githubUrl: 'https://github.com/darshilparmar'
  },
  {
    id: 'project-aws-masterclass',
    title: 'AWS Masterclass for Data Engineers with End-to-End Project',
    category: 'project',
    topic: 'AWS',
    instructor: 'Darshil Parmar',
    instructorRole: 'Lead Data Engineer',
    youtubeId: 'yvAWbbQa8eE',
    youtubeUrl: 'https://www.youtube.com/watch?v=yvAWbbQa8eE',
    duration: '1 hr 45 min',
    rating: 4.9,
    views: '610K+ views',
    level: 'Intermediate → Advanced',
    summary: 'Master the AWS Data Stack. Connect Amazon S3 data lakes with AWS Lambda serverless compute, crawl schema evolution with AWS Glue Data Catalog, run distributed Spark transformations, and execute serverless SQL queries with Amazon Athena.',
    techStack: ['Amazon S3', 'AWS Lambda', 'AWS Glue', 'Amazon Athena', 'Python', 'AWS IAM'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'AWS Data Engineering Landscape' },
      { time: '12:30', seconds: 750, title: 'IAM Roles, S3 Bucket Policies & Security' },
      { time: '28:15', seconds: 1695, title: 'Serverless Event-Driven Extraction with Lambda' },
      { time: '49:00', seconds: 2940, title: 'AWS Glue Data Catalog & Crawlers' },
      { time: '01:18:20', seconds: 4700, title: 'Serverless SQL Analytics with Amazon Athena' }
    ],
    keyTakeaways: [
      'Designing least-privilege IAM policies for automated cloud pipelines',
      'Managing partition projection in Athena to cut scanning costs by 90%',
      'Handling automated schema changes and catalog registration with Glue'
    ],
    githubUrl: 'https://github.com/darshilparmar'
  },
  {
    id: 'project-dbt-snowflake',
    title: 'Intro to Data Build Tool (dbt) | Create Your First Production Project with Snowflake',
    category: 'project',
    topic: 'dbt',
    instructor: 'Kahan Data Solutions',
    instructorRole: 'Analytics Engineering Specialist',
    youtubeId: '5rNquRnNb4E',
    youtubeUrl: 'https://www.youtube.com/watch?v=5rNquRnNb4E',
    duration: '1 hr 12 min',
    rating: 4.9,
    views: '390K+ views',
    level: 'Beginner → Intermediate',
    summary: 'Master dbt Core from scratch with Snowflake. Setup profiles.yml, build staging views, modularize SQL transformations with ref(), configure schema tests (unique, not null), and generate live lineage documentation.',
    techStack: ['dbt Core', 'Snowflake', 'SQL', 'Jinja', 'Data Modeling'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'What is dbt & The Modern Data Stack?' },
      { time: '11:20', seconds: 680, title: 'Installing dbt Core & Snowflake Connection' },
      { time: '25:40', seconds: 1540, title: 'Building Staging Models & Sources' },
      { time: '42:15', seconds: 2535, title: 'Dimension Marts & Modular ref() Functions' },
      { time: '55:30', seconds: 3330, title: 'Schema Testing & dbt Docs Lineage' }
    ],
    keyTakeaways: [
      'How dbt shifts transformations from fragile cron scripts to version-controlled software',
      'Writing DRY (Don’t Repeat Yourself) SQL using Jinja macros',
      'Automating regression testing on primary and foreign keys before reporting'
    ],
    githubUrl: 'https://github.com/dbt-labs/jaffle_shop'
  },
  {
    id: 'project-kafka-crash-course',
    title: 'Apache Kafka Crash Course | Real-Time Event Streaming from Scratch',
    category: 'project',
    topic: 'Kafka',
    instructor: 'freeCodeCamp / Hussein Nasser',
    instructorRole: 'Distributed Systems Architect',
    youtubeId: 'R873BlNVUB4',
    youtubeUrl: 'https://www.youtube.com/watch?v=R873BlNVUB4',
    duration: '1 hr 22 min',
    rating: 4.9,
    views: '1.5M+ views',
    level: 'Intermediate → Advanced',
    summary: 'A definitive guide to distributed event streaming with Apache Kafka. Deep dive into topics, partitions, broker clusters, producer ack semantics, consumer groups, offset commits, and Kafka vs traditional message brokers.',
    techStack: ['Apache Kafka', 'Distributed Systems', 'Java/Python', 'Zookeeper/KRaft', 'Docker'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Why Kafka? Traditional Queues vs Commit Logs' },
      { time: '15:20', seconds: 920, title: 'Topics, Partitions, Offsets & Replications' },
      { time: '34:40', seconds: 2080, title: 'Kafka Producers & Message Hashing' },
      { time: '52:10', seconds: 3130, title: 'Consumer Groups, Offsets & Rebalancing' },
      { time: '01:08:00', seconds: 4080, title: 'Hands-on Kafka Cluster with Docker' }
    ],
    keyTakeaways: [
      'Understanding partition ordering and why Kafka scales horizontally',
      'Preventing consumer group rebalances during heavy downstream processing',
      'Configuring acks=all and idempotence for fault-tolerant streams'
    ]
  }
];

export const CURATED_COURSE_VIDEOS: CuratedVideo[] = [
  {
    id: 'course-de-roadmap',
    title: 'Only Data Engineering Roadmap You Need 2026 | Step-by-Step Complete Guide',
    category: 'course',
    topic: 'Overview',
    instructor: 'Darshil Parmar',
    instructorRole: 'Lead Data Engineer & Founder',
    youtubeId: '4ifxQ_th07U',
    youtubeUrl: 'https://www.youtube.com/watch?v=4ifxQ_th07U',
    duration: '42 min',
    rating: 4.9,
    views: '750K+ views',
    level: 'Beginner',
    summary: 'The definitive 2026 roadmap for aspiring and working data engineers. Covers exactly what tools matter (Python, SQL, PySpark, Airflow, Snowflake, AWS) and what tools are noise. Clear prerequisite order with project milestones.',
    techStack: ['SQL', 'Python', 'Spark', 'Airflow', 'Snowflake', 'AWS/GCP'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Data Engineering Landscape in 2026' },
      { time: '06:30', seconds: 390, title: 'Foundations: Python, SQL & Shell Scripting' },
      { time: '14:20', seconds: 860, title: 'Data Modeling, Warehousing & Lakehouse' },
      { time: '22:45', seconds: 1365, title: 'Distributed Systems: Spark & Kafka' },
      { time: '31:10', seconds: 1870, title: 'Portfolio Strategy: How to Get Hired' }
    ],
    keyTakeaways: [
      'Focusing on deep fundamentals rather than shallow tool-collecting',
      'The exact learning progression: Python → SQL → Modeling → Spark → Orchestration',
      'Structuring GitHub repositories and resumes to pass senior recruiter screening'
    ]
  },
  {
    id: 'course-de-fundamentals',
    title: 'Fundamentals Of Data Engineering Masterclass | Comprehensive Architecture Overview',
    category: 'course',
    topic: 'Overview',
    instructor: 'Darshil Parmar',
    instructorRole: 'Lead Data Engineer & Founder',
    youtubeId: 'hf2go3E2m8g',
    youtubeUrl: 'https://www.youtube.com/watch?v=hf2go3E2m8g',
    duration: '1 hr 15 min',
    rating: 4.9,
    views: '420K+ views',
    level: 'Beginner',
    summary: 'Understand the core lifecycle of data: ingestion, storage, transformation, serving, and security. Learn how data pipelines handle failures, backfilling, idempotency, and high-throughput workloads in production.',
    techStack: ['Data Architecture', 'ETL/ELT', 'Data Warehouses', 'Data Lakes'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Data Engineering Lifecycle' },
      { time: '14:10', seconds: 850, title: 'Source Systems & Ingestion Patterns' },
      { time: '28:30', seconds: 1710, title: 'Storage Tiers: Hot, Warm, Cold & Object Stores' },
      { time: '44:20', seconds: 2660, title: 'Transformation: Batch vs Micro-batch vs Streaming' },
      { time: '59:00', seconds: 3540, title: 'Serving Data to BI and ML Consumers' }
    ],
    keyTakeaways: [
      'Evaluating trade-offs between batch ELT and real-time streaming',
      'Designing idempotent pipelines that survive distributed cluster restarts',
      'Minimizing cloud infrastructure egress and query scanning costs'
    ]
  },
  {
    id: 'course-sql-masterclass',
    title: 'SQL Tutorial - Full Database Course for Beginners | Master ANSI SQL from Scratch',
    category: 'course',
    topic: 'SQL',
    instructor: 'Mike Dane (freeCodeCamp)',
    instructorRole: 'Lead Software & Database Instructor',
    youtubeId: 'HXV3zeQKqGY',
    youtubeUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
    duration: '4 hr 20 min',
    rating: 4.9,
    views: '9.2M+ views',
    level: 'Beginner → Intermediate',
    summary: 'The gold-standard comprehensive SQL masterclass. Learn relational database design, table DDL, schema constraints, CRUD operations, advanced aggregate functions, wildcards, UNIONs, complex JOINs, nested subqueries, and triggers.',
    techStack: ['SQL', 'PostgreSQL', 'MySQL', 'Relational Algebra'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Introduction & Database Fundamentals' },
      { time: '23:40', seconds: 1420, title: 'Creating Tables, Data Types & Primary Keys' },
      { time: '55:10', seconds: 3310, title: 'Basic Queries: SELECT, WHERE, ORDER BY, LIMIT' },
      { time: '01:45:20', seconds: 6320, title: 'Aggregate Functions: COUNT, SUM, AVG, GROUP BY, HAVING' },
      { time: '02:35:10', seconds: 9310, title: 'Relational JOINs: INNER, LEFT, RIGHT, FULL OUTER' },
      { time: '03:18:40', seconds: 11920, title: 'Nested Subqueries & Correlated Logic' },
      { time: '03:52:00', seconds: 13920, title: 'Database Triggers, Indexes & Optimization' }
    ],
    keyTakeaways: [
      'Mastering relational cardinality: 1-to-1, 1-to-Many, Many-to-Many foreign keys',
      'Writing performant GROUP BY and HAVING filters on high-cardinality datasets',
      'Solving complex multi-table joins without accidental Cartesian product duplication'
    ],
    practiceSnippet: {
      language: 'sql',
      code: `SELECT 
  d.department_name,
  COUNT(e.employee_id) AS head_count,
  ROUND(AVG(e.salary), 2) AS avg_salary,
  MAX(e.salary) AS peak_salary
FROM departments d
LEFT JOIN employees e ON d.department_id = e.department_id
GROUP BY d.department_name
HAVING COUNT(e.employee_id) >= 5
ORDER BY avg_salary DESC;`,
      explanation: 'Calculates departmental metrics with minimum headcount thresholds using ANSI SQL aggregate grouping.'
    }
  },
  {
    id: 'course-python-de',
    title: 'Python for Beginners to Advanced | Full 4-Hour Course for Data Engineers',
    category: 'course',
    topic: 'Python',
    instructor: 'freeCodeCamp / Tech With Tim',
    instructorRole: 'Senior Python Engineer',
    youtubeId: 'rfscVS0vtbw',
    youtubeUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
    duration: '4 hr 26 min',
    rating: 4.8,
    views: '45M+ views',
    level: 'Beginner → Intermediate',
    summary: 'Learn core Python engineering required for production data pipelines: variables, data structures (lists, dicts, sets, tuples), functions, OOP classes, error handling, file I/O, REST APIs with requests, and modular package architecture.',
    techStack: ['Python 3', 'Requests API', 'JSON', 'Pandas', 'OOP'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Python Setup & Syntax Fundamentals' },
      { time: '42:15', seconds: 2535, title: 'Data Structures: Lists, Dictionaries & Tuples' },
      { time: '01:30:00', seconds: 5400, title: 'Functions, Generators & List Comprehensions' },
      { time: '02:18:30', seconds: 8310, title: 'Object-Oriented Programming (Classes & Inheritance)' },
      { time: '03:10:45', seconds: 11445, title: 'Handling Exceptions & Robust Error Logging' },
      { time: '03:48:20', seconds: 13700, title: 'Interacting with REST APIs & Parsing JSON' }
    ],
    keyTakeaways: [
      'Memory-efficient stream processing using Python generators and iterators',
      'Designing modular OOP pipeline stages with base classes and type hints',
      'Implementing exponential backoff retries when fetching data from flaky third-party APIs'
    ]
  },
  {
    id: 'course-pyspark-full',
    title: 'Apache Spark & PySpark Full Course | Distributed Big Data Processing',
    category: 'course',
    topic: 'Spark',
    instructor: 'Krish Naik / freeCodeCamp',
    instructorRole: 'Big Data & AI Architect',
    youtubeId: '_C8kWso4ne4',
    youtubeUrl: 'https://www.youtube.com/watch?v=_C8kWso4ne4',
    duration: '3 hr 15 min',
    rating: 4.9,
    views: '920K+ views',
    level: 'Intermediate → Advanced',
    summary: 'Master distributed big data processing using Apache Spark and PySpark. Learn RDD internals, Spark DataFrames, Catalyst query optimizer, lazy evaluation, transformations vs actions, partition tuning, and broadcast joins.',
    techStack: ['Apache Spark', 'PySpark', 'Parquet', 'HDFS', 'Databricks'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Spark Distributed Architecture: Driver & Executors' },
      { time: '22:30', seconds: 1350, title: 'SparkSession, RDDs vs DataFrames' },
      { time: '54:10', seconds: 3250, title: 'PySpark DataFrame Operations: Filter, Select, WithColumn' },
      { time: '01:35:00', seconds: 5700, title: 'GroupBy, Aggregations & Window Functions' },
      { time: '02:15:20', seconds: 8120, title: 'Handling Big Data Skew with Broadcast Hash Joins' },
      { time: '02:48:00', seconds: 10080, title: 'Reading & Writing Partitioned Parquet Data' }
    ],
    keyTakeaways: [
      'How the Catalyst optimizer turns logical query plans into optimized physical bytecode',
      'Eliminating out-of-memory errors by tuning spark.sql.shuffle.partitions',
      'Using broadcast() hints on dimension lookups to avoid multi-gigabyte network shuffles'
    ]
  },
  {
    id: 'course-snowflake-mastery',
    title: 'Snowflake Full Course | Beginner to Advanced Architecture, Warehouses & SQL',
    category: 'course',
    topic: 'Snowflake',
    instructor: 'Learn By Doing It',
    instructorRole: 'Cloud Data Warehouse Architect',
    youtubeId: '7lpp5N73V98',
    youtubeUrl: 'https://www.youtube.com/watch?v=7lpp5N73V98',
    duration: '7 hr 15 min',
    rating: 4.9,
    views: '510K+ views',
    level: 'Beginner → Advanced',
    summary: 'Comprehensive Snowflake cloud data warehousing masterclass. Multi-cluster shared data architecture, virtual compute warehouses, micro-partitions, clustering keys, zero-copy cloning, time travel, Snowpipe streaming, and role-based access control (RBAC).',
    techStack: ['Snowflake', 'Cloud SQL', 'Snowpipe', 'Time Travel', 'Data Warehousing'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Snowflake Unique Cloud Architecture' },
      { time: '45:10', seconds: 2710, title: 'Virtual Warehouses & Scaling Policies' },
      { time: '01:30:20', seconds: 5420, title: 'Databases, Schemas & Micro-Partitioning' },
      { time: '02:45:00', seconds: 9900, title: 'Zero-Copy Cloning & Time Travel' },
      { time: '04:10:00', seconds: 15000, title: 'Data Ingestion with COPY INTO & Snowpipe' },
      { time: '05:35:00', seconds: 20100, title: 'Streams, Tasks & Continuous Pipelines' }
    ],
    keyTakeaways: [
      'Decoupled storage and compute: why Snowflake eliminates database lock contention',
      'Zero-Copy Cloning allows instant staging environments without additional storage costs',
      'Using Time Travel (AT / BEFORE) to restore corrupted tables without backups'
    ]
  },
  {
    id: 'course-data-modeling',
    title: 'Data Modeling Tutorial: Star Schema (Kimball Approach) | Dimensions & Facts',
    category: 'course',
    topic: 'Data Modeling',
    instructor: 'Kahan Data Solutions',
    instructorRole: 'Analytics & Data Modeling Specialist',
    youtubeId: 'gRE3E7VUzRU',
    youtubeUrl: 'https://www.youtube.com/watch?v=gRE3E7VUzRU',
    duration: '45 min',
    rating: 4.9,
    views: '350K+ views',
    level: 'Beginner → Intermediate',
    summary: 'Master Ralph Kimball dimensional modeling principles. Understand business processes, declare the grain, identify dimensions and fact tables, surrogate keys vs natural keys, and Slowly Changing Dimensions (SCD Type 1, 2, and 3).',
    techStack: ['Dimensional Modeling', 'Kimball', 'Star Schema', 'Data Warehousing'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'What is Dimensional Modeling & Star Schema?' },
      { time: '08:30', seconds: 510, title: 'Fact Tables: Additive, Semi-Additive & Non-Additive' },
      { time: '18:15', seconds: 1095, title: 'Dimension Tables & Surrogate Key Design' },
      { time: '29:40', seconds: 1780, title: 'Star Schema vs Snowflake Schema Comparison' },
      { time: '38:00', seconds: 2280, title: 'Slowly Changing Dimensions (SCD Type 1 vs Type 2)' }
    ],
    keyTakeaways: [
      'Declaring the grain upfront prevents duplicate counting in analytical aggregations',
      'Surrogate keys protect downstream reporting marts from operational database primary key updates',
      'Star schemas minimize join depths for superior OLAP query performance'
    ]
  },
  {
    id: 'course-system-design',
    title: 'System Design Interview – Step By Step Guide for Data & Software Engineers',
    category: 'course',
    topic: 'System Design',
    instructor: 'ByteByteGo / Alex Xu',
    instructorRole: 'Principal Systems Architect & Author',
    youtubeId: 'bUHFg8CZFws',
    youtubeUrl: 'https://www.youtube.com/watch?v=bUHFg8CZFws',
    duration: '32 min',
    rating: 4.9,
    views: '2.1M+ views',
    level: 'Intermediate → Advanced',
    summary: 'The 4-step framework used by Principal and Staff Engineers to ace technical system design interviews. Learn requirement clarification, back-of-the-envelope calculations, high-level architecture diagramming, and deep-dive bottleneck resolution.',
    techStack: ['Distributed Systems', 'Load Balancing', 'Caching', 'Message Queues', 'Databases'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'The 4-Step System Design Interview Framework' },
      { time: '06:10', seconds: 370, title: 'Step 1: Scope & Functional vs Non-Functional Requirements' },
      { time: '12:30', seconds: 750, title: 'Step 2: High-Level Architecture & API Design' },
      { time: '20:15', seconds: 1215, title: 'Step 3: Design Deep Dive & Bottleneck Identification' },
      { time: '27:40', seconds: 1660, title: 'Step 4: Wrap-Up, Scaling & Single Points of Failure' }
    ],
    keyTakeaways: [
      'Never jump straight into drawing boxes: always clarify QPS, storage, and latency SLAs first',
      'Addressing single points of failure (SPOF) with replication and multi-region failovers',
      'Evaluating CAP theorem trade-offs between consistency and availability in large-scale pipelines'
    ]
  }
];

export const ALL_CURATED_VIDEOS: CuratedVideo[] = [
  ...CURATED_PROJECT_VIDEOS,
  ...CURATED_COURSE_VIDEOS
];

export function getCuratedVideoById(id: string): CuratedVideo | undefined {
  return ALL_CURATED_VIDEOS.find(v => v.id === id || v.youtubeId === id);
}
