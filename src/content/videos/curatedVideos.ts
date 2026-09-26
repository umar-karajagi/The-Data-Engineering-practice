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
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Beginner → Intermediate' | 'Intermediate → Advanced' | 'Beginner → Advanced';
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
  playlist?: any;
  currentEpisodeId?: string;
}

export const HERO_MASTERCLASS_VIDEO: CuratedVideo = {
  id: 'hero-uber-analytics',
  title: 'End-to-End Data Engineering Project | Uber Data Analytics | GCP, Mage AI, BigQuery & Looker',
  category: 'hero',
  topic: 'GCP',
  instructor: 'freeCodeCamp.org / Alexey Grigorev',
  instructorRole: 'Head of Data & Author, Data Engineering Zoomcamp',
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
  githubUrl: 'https://github.com/DataTalksClub/data-engineering-zoomcamp',
  datasetUrl: 'https://github.com/DataTalksClub/nyc-tlc-data',
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
    instructor: 'freeCodeCamp.org / Soumil Shah',
    instructorRole: 'AWS Solutions Architect & Streaming Specialist',
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
    githubUrl: 'https://github.com/freeCodeCamp/data-engineering-pipeline'
  },
  {
    id: 'project-twitter-airflow',
    title: 'Twitter Data Pipeline using Airflow for Beginners | Data Engineering Project',
    category: 'project',
    topic: 'Airflow',
    instructor: 'freeCodeCamp.org / Marc Lamberti',
    instructorRole: 'Apache Airflow PMC & VP Customer Success, Astronomer',
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
    githubUrl: 'https://github.com/marclamberti/airflow-materials'
  },
  {
    id: 'project-aws-masterclass',
    title: 'AWS Masterclass for Data Engineers with End-to-End Project',
    category: 'project',
    topic: 'AWS',
    instructor: 'freeCodeCamp.org / Luke Barousse',
    instructorRole: 'Senior Data Architect & freeCodeCamp Creator',
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
    githubUrl: 'https://github.com/freeCodeCamp/aws-data-engineering'
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
    instructor: 'Zach Wilson & Seattle Data Guy',
    instructorRole: 'Staff Data Engineer (ex-Netflix/Airbnb) & Principal Architect',
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
    instructor: 'freeCodeCamp.org / Karolina Sowinska',
    instructorRole: 'Senior Data Engineer & Tech Lead',
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

export const FOUNDATION_MODULE_VIDEOS: Record<string, CuratedVideo> = {
  'mod-01-python-ds': {
    id: 'mod-01-python-ds',
    title: 'Python Data Structures, Memory & Hashmaps for Data Engineering',
    category: 'course',
    topic: 'Python',
    instructor: 'freeCodeCamp.org / Tech With Tim',
    instructorRole: 'Senior Python Engineer',
    youtubeId: 'kqtD5dpn9C8',
    youtubeUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
    duration: '24 mins',
    rating: 4.9,
    views: '820K+ views',
    level: 'Beginner',
    summary: 'Memory footprints of lists vs generators, dictionary hash collision prevention, and itertools for processing large records.',
    techStack: ['Python 3', 'Data Structures', 'Memory Profiling', 'Itertools'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Setup & Object Memory Footprint' },
      { time: '07:30', seconds: 450, title: 'Generators vs Lists Memory Benchmark' },
      { time: '16:00', seconds: 960, title: 'Itertools Streaming Pipelines' },
      { time: '21:00', seconds: 1260, title: 'Practice Challenge & Summary' }
    ],
    keyTakeaways: [
      'Generators stream items one at a time with O(1) memory instead of loading millions of rows into RAM',
      'Dictionary lookups operate in O(1) time through hash table indexing',
      'Using sys.getsizeof to profile data structure memory consumption'
    ]
  },
  'mod-02-python-parquet': {
    id: 'mod-02-python-parquet',
    title: 'Python File Processing, JSON Parsing & Snappy Parquet with PyArrow',
    category: 'course',
    topic: 'Python',
    instructor: 'freeCodeCamp.org / Alexey Grigorev',
    instructorRole: 'Head of Data & Author',
    youtubeId: 'e3PZ1vP8N8k',
    youtubeUrl: 'https://www.youtube.com/watch?v=e3PZ1vP8N8k',
    duration: '28 mins',
    rating: 4.9,
    views: '450K+ views',
    level: 'Beginner → Intermediate',
    summary: 'Chunked file ingestion, parsing nested JSON schemas, and writing memory-efficient Snappy Parquet files with PyArrow.',
    techStack: ['Python 3', 'PyArrow', 'Parquet', 'JSON Schema'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Chunked File Iterators' },
      { time: '08:15', seconds: 495, title: 'Nested JSON Normalization' },
      { time: '17:30', seconds: 1050, title: 'PyArrow Parquet Columnar Export' },
      { time: '25:00', seconds: 1500, title: 'Compression Benchmarks & Code Review' }
    ],
    keyTakeaways: [
      'Parquet columnar storage reduces disk footprint by 70-80% compared to raw CSV',
      'Handling nested payloads using json_normalize before columnar conversion',
      'Streaming large files via fixed chunk generators to prevent memory exhaustion'
    ]
  },
  'mod-03-sql-joins': {
    id: 'mod-03-sql-joins',
    title: 'Zero-to-Hero SQL Mastery: Execution Order, Aggregations & Multi-Joins',
    category: 'course',
    topic: 'SQL',
    instructor: 'Mike Dane (freeCodeCamp)',
    instructorRole: 'Lead Database Instructor',
    youtubeId: 'HXV3zeRR3h4',
    youtubeUrl: 'https://www.youtube.com/watch?v=HXV3zeRR3h4',
    duration: '26 mins',
    rating: 4.9,
    views: '1.8M+ views',
    level: 'Beginner',
    summary: 'Exact clause execution order (FROM → WHERE → GROUP BY → HAVING → SELECT), aggregate math, and multi-table INNER/LEFT/FULL joins.',
    techStack: ['SQL', 'PostgreSQL', 'DuckDB', 'Relational Joins'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'SQL Clause Execution Order' },
      { time: '09:00', seconds: 540, title: 'GROUP BY vs HAVING Filters' },
      { time: '17:30', seconds: 1050, title: 'Complex Multi-Table Relational Joins' },
      { time: '22:45', seconds: 1365, title: 'Top Interview Questions & Edge Cases' }
    ],
    keyTakeaways: [
      'WHERE filters rows BEFORE grouping; HAVING filters aggregated groups AFTER grouping',
      'Avoiding accidental Cartesian cross products with well-defined join keys',
      'Understanding execution order explains why SELECT aliases cannot be used in WHERE clauses'
    ]
  },
  'mod-04-sql-window': {
    id: 'mod-04-sql-window',
    title: 'Advanced SQL Masterclass: Window Functions, CTEs & Ranking',
    category: 'course',
    topic: 'SQL',
    instructor: 'Alex The Analyst / freeCodeCamp',
    instructorRole: 'Analytics Engineering Lead',
    youtubeId: 'Ww71knvhQ-s',
    youtubeUrl: 'https://www.youtube.com/watch?v=Ww71knvhQ-s',
    duration: '30 mins',
    rating: 4.9,
    views: '920K+ views',
    level: 'Intermediate',
    summary: 'ROW_NUMBER, DENSE_RANK, LEAD/LAG, rolling 7-day moving averages, and recursive Common Table Expressions.',
    techStack: ['SQL', 'Window Functions', 'CTEs', 'Analytics Engineering'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Window Partitions & OVER() Clause' },
      { time: '10:20', seconds: 620, title: 'LEAD, LAG & Rolling Moving Averages' },
      { time: '21:00', seconds: 1260, title: 'Recursive CTEs & Hierarchical Queries' },
      { time: '27:30', seconds: 1650, title: 'LeetCode Hard SQL Problem Breakdown' }
    ],
    keyTakeaways: [
      'Window functions retain individual row identities while computing group aggregates',
      'DENSE_RANK avoids skipping ranking numbers when tie scores occur',
      'Recursive CTEs enable traversals of organizational graphs and parent-child trees'
    ]
  },
  'mod-05-pandas-etl': {
    id: 'mod-05-pandas-etl',
    title: 'Pandas & NumPy Vectorization for High-Throughput ETL Pipelines',
    category: 'course',
    topic: 'Python',
    instructor: 'Keith Galli / freeCodeCamp',
    instructorRole: 'Data Science & Python Specialist',
    youtubeId: 'vmEHCJofslg',
    youtubeUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg',
    duration: '25 mins',
    rating: 4.8,
    views: '1.1M+ views',
    level: 'Beginner → Intermediate',
    summary: 'Vectorized operations over row-iteration loops, handling missing data, and multi-index aggregations for data preparation.',
    techStack: ['Python', 'Pandas', 'NumPy', 'Data Cleaning'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Vectorization vs For-Loops Benchmark' },
      { time: '08:40', seconds: 520, title: 'Null Imputation & Data Type Casting' },
      { time: '17:00', seconds: 1020, title: 'Multi-Index Groupby & Aggregations' },
      { time: '22:15', seconds: 1335, title: 'Memory Profiling & Export' }
    ],
    keyTakeaways: [
      'Vectorized NumPy/Pandas operations execute in compiled C routines, running 100x faster than for-loops',
      'Downcasting integer and float dtypes slashes DataFrame memory by up to 60%',
      'Method chaining with assign() and query() creates clean, readable transformations'
    ]
  }
};

export const TRACK_MODULE_VIDEOS: Record<string, CuratedVideo> = {
  // Data Engineer Track Modules
  'de-mod-01': {
    id: 'de-mod-01',
    title: 'Apache Spark Distributed Architecture & Execution Plan',
    category: 'course',
    topic: 'Spark',
    instructor: 'Krish Naik / freeCodeCamp',
    instructorRole: 'Big Data & AI Architect',
    youtubeId: '_C8kWso4ne4',
    youtubeUrl: 'https://www.youtube.com/watch?v=_C8kWso4ne4',
    duration: '28m',
    rating: 4.9,
    views: '920K+ views',
    level: 'Intermediate',
    summary: 'Driver vs Executor memory, RDD partitions, Catalyst optimizer stages, and execution DAGs.',
    techStack: ['Apache Spark', 'Distributed Systems', 'Cluster Architecture'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Driver & Executor Memory Layout' },
      { time: '08:30', seconds: 510, title: 'RDD Partitions & Lineage Graph' },
      { time: '17:15', seconds: 1035, title: 'Execution Stages & Shuffles' },
      { time: '23:00', seconds: 1380, title: 'Monitoring Spark Web UI' }
    ],
    keyTakeaways: [
      'Executors run tasks in parallel across worker nodes while Driver coordinates planning',
      'Transformations build an execution lineage graph without running until an action is called'
    ]
  },
  'de-mod-02': {
    id: 'de-mod-02',
    title: 'PySpark Shuffles, Broadcasts & Memory Tuning',
    category: 'course',
    topic: 'Spark',
    instructor: 'freeCodeCamp.org / Alexey Grigorev',
    instructorRole: 'Head of Data & Author',
    youtubeId: 'kqtD5dpn9C8',
    youtubeUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
    duration: '29m',
    rating: 4.9,
    views: '640K+ views',
    level: 'Intermediate → Advanced',
    summary: 'Eliminating data skew, broadcast hash joins, memory spillage, and cluster tuning.',
    techStack: ['PySpark', 'Broadcast Join', 'Spark SQL', 'Optimization'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Data Skew Diagnosis' },
      { time: '09:10', seconds: 550, title: 'Broadcast Hash Joins' },
      { time: '18:40', seconds: 1120, title: 'Salting Keys for Uniform Distribution' },
      { time: '24:30', seconds: 1470, title: 'Tuning Shuffle Partitions' }
    ],
    keyTakeaways: [
      'Broadcasting small dimension tables avoids network shuffles entirely',
      'Salting keys breaks large skewed partitions into uniform parallel batches'
    ]
  },
  'de-mod-03': {
    id: 'de-mod-03',
    title: 'Lakehouse ACID Storage (Apache Iceberg & Delta Lake)',
    category: 'course',
    topic: 'Data Modeling',
    instructor: 'Kahan Data Solutions',
    instructorRole: 'Analytics & Data Modeling Specialist',
    youtubeId: '5rNquRnNb4E',
    youtubeUrl: 'https://www.youtube.com/watch?v=5rNquRnNb4E',
    duration: '25m',
    rating: 4.9,
    views: '390K+ views',
    level: 'Intermediate',
    summary: 'Metadata transaction logs, time travel, compaction, and schema evolution.',
    techStack: ['Delta Lake', 'Apache Iceberg', 'ACID Transactions', 'Parquet'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Why Open Table Formats Matter' },
      { time: '07:45', seconds: 465, title: 'Transaction Log & Metadata Manifests' },
      { time: '15:20', seconds: 920, title: 'Time Travel & Rollback Queries' },
      { time: '21:00', seconds: 1260, title: 'Small File Compaction Strategies' }
    ],
    keyTakeaways: [
      'ACID transactions guarantee atomic writes even when cloud storage writes fail halfway',
      'Hidden partitioning prevents users from writing broken partition predicates'
    ]
  },
  'de-mod-04': {
    id: 'de-mod-04',
    title: 'Workflow Orchestration with Apache Airflow & Mage AI',
    category: 'course',
    topic: 'Airflow',
    instructor: 'freeCodeCamp.org / Marc Lamberti',
    instructorRole: 'Apache Airflow PMC & VP Customer Success',
    youtubeId: 'q8q3OFFfY6c',
    youtubeUrl: 'https://www.youtube.com/watch?v=q8q3OFFfY6c',
    duration: '27m',
    rating: 4.9,
    views: '540K+ views',
    level: 'Beginner → Intermediate',
    summary: 'Writing dynamic Python DAGs, sensor triggers, backfills, and SLA callbacks.',
    techStack: ['Apache Airflow', 'Mage AI', 'Python DAGs', 'TaskFlow API'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'DAG Lifecycle & Orchestration Concepts' },
      { time: '08:15', seconds: 495, title: 'TaskFlow API & PythonOperator' },
      { time: '16:30', seconds: 990, title: 'Sensors, Retries & Alerts' },
      { time: '22:45', seconds: 1365, title: 'Automated Backfills & Idempotency' }
    ],
    keyTakeaways: [
      'Idempotent DAGs can run multiple times on identical dates without corrupting target tables',
      'Sensors in reschedule mode avoid tying up Airflow worker slots while waiting'
    ]
  },
  'de-mod-05': {
    id: 'de-mod-05',
    title: 'Real-Time Event Streaming with Apache Kafka',
    category: 'course',
    topic: 'Kafka',
    instructor: 'freeCodeCamp / Hussein Nasser',
    instructorRole: 'Distributed Systems Architect',
    youtubeId: 'R873BlNVUB4',
    youtubeUrl: 'https://www.youtube.com/watch?v=R873BlNVUB4',
    duration: '30m',
    rating: 4.9,
    views: '1.5M+ views',
    level: 'Intermediate',
    summary: 'Topic partitions, consumer offsets, consumer groups, and exactly-once semantics.',
    techStack: ['Apache Kafka', 'Streaming', 'Message Queues', 'KRaft'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Log Append Internals vs Traditional Queues' },
      { time: '09:20', seconds: 560, title: 'Topic Partitions & Message Key Hashing' },
      { time: '18:00', seconds: 1080, title: 'Consumer Offsets & Rebalancing' },
      { time: '25:10', seconds: 1510, title: 'Configuring acks=all & Idempotent Producers' }
    ],
    keyTakeaways: [
      'Kafka persists events sequentially on disk, enabling multi-consumer replayability',
      'Partition count determines maximum consumer concurrency in a consumer group'
    ]
  },
  'de-mod-06': {
    id: 'de-mod-06',
    title: 'Cloud Warehousing on Snowflake & Google BigQuery',
    category: 'course',
    topic: 'Snowflake',
    instructor: 'Learn By Doing It',
    instructorRole: 'Cloud Data Warehouse Architect',
    youtubeId: '7lpp5N73V98',
    youtubeUrl: 'https://www.youtube.com/watch?v=7lpp5N73V98',
    duration: '26m',
    rating: 4.9,
    views: '510K+ views',
    level: 'Intermediate',
    summary: 'Clustering keys, micro-partition pruning, slot allocation, and query cost optimization.',
    techStack: ['Snowflake', 'BigQuery', 'Partitioning', 'Cost Optimization'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Micro-partitions & Metadata Pruning' },
      { time: '08:30', seconds: 510, title: 'Clustering Keys vs Full Table Scans' },
      { time: '16:00', seconds: 960, title: 'BigQuery Partitioning & Clustering' },
      { time: '21:30', seconds: 1290, title: 'Query Cost Reduction Best Practices' }
    ],
    keyTakeaways: [
      'Pruning micro-partitions cuts scanned bytes from terabytes down to megabytes',
      'Partitioning by date and clustering by high-cardinality search columns optimizes speed and budget'
    ]
  },

  // Data Analyst Track Modules
  'da-mod-01': {
    id: 'da-mod-01',
    title: 'Business SQL & Cohort Retention Analytics',
    category: 'course',
    topic: 'SQL',
    instructor: 'Mike Dane (freeCodeCamp)',
    instructorRole: 'Lead Database Instructor',
    youtubeId: 'HXV3zeQKqGY',
    youtubeUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
    duration: '24m',
    rating: 4.9,
    views: '1.2M+ views',
    level: 'Beginner → Intermediate',
    summary: 'Calculating Monthly Active Users (MAU), customer churn rates, and LTV cohorts with SQL.',
    techStack: ['SQL', 'Cohort Analysis', 'LTV Modeling', 'Customer Analytics'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Defining User Cohorts by Signup Month' },
      { time: '07:30', seconds: 450, title: 'Calculating Month-over-Month Retention Rates' },
      { time: '15:10', seconds: 910, title: 'Rolling 30-Day Active User Windows' },
      { time: '20:00', seconds: 1200, title: 'Customer Lifetime Value (LTV) Formula' }
    ],
    keyTakeaways: [
      'Self-joining activity tables by user and time offset computes exact cohort retention grids',
      'Differentiating between active users and revived churners provides clear product insights'
    ]
  },
  'da-mod-02': {
    id: 'da-mod-02',
    title: 'Kimball Data Modeling (Star Schemas & SCD Types)',
    category: 'course',
    topic: 'Data Modeling',
    instructor: 'Kahan Data Solutions',
    instructorRole: 'Analytics & Data Modeling Specialist',
    youtubeId: 'gRE3E7VUzRU',
    youtubeUrl: 'https://www.youtube.com/watch?v=gRE3E7VUzRU',
    duration: '28m',
    rating: 4.9,
    views: '350K+ views',
    level: 'Beginner → Intermediate',
    summary: 'Fact tables, dimension tables, degenerate dimensions, and SCD Type 2 historical tracking.',
    techStack: ['Kimball Modeling', 'Star Schema', 'SCD Type 2', 'Data Warehousing'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Star Schema Fundamentals' },
      { time: '08:45', seconds: 525, title: 'Additive vs Semi-Additive Facts' },
      { time: '17:30', seconds: 1050, title: 'SCD Type 2 Effective Dates & IsCurrent Flag' },
      { time: '23:15', seconds: 1395, title: 'Surrogate Keys vs Natural Primary Keys' }
    ],
    keyTakeaways: [
      'SCD Type 2 retains historical snapshots using start_date, end_date, and is_current flags',
      'Fact tables store numerical business metrics; dimension tables supply descriptive context'
    ]
  },
  'da-mod-03': {
    id: 'da-mod-03',
    title: 'Enterprise Power BI & DAX Measure Modeling',
    category: 'course',
    topic: 'Overview',
    instructor: 'freeCodeCamp.org / Luke Barousse',
    instructorRole: 'Senior Data Architect',
    youtubeId: 'yvAWbbQa8eE',
    youtubeUrl: 'https://www.youtube.com/watch?v=yvAWbbQa8eE',
    duration: '26m',
    rating: 4.8,
    views: '480K+ views',
    level: 'Intermediate',
    summary: 'CALCULATE, time intelligence functions, filter context, and relationship cardinality.',
    techStack: ['Power BI', 'DAX', 'Data Visualization', 'BI Modeling'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Filter Context vs Row Context in DAX' },
      { time: '08:20', seconds: 500, title: 'The Power of CALCULATE() with Modifiers' },
      { time: '16:40', seconds: 1000, title: 'Time Intelligence: YTD, QTD and Prior Year' },
      { time: '22:00', seconds: 1320, title: 'Star Schema Relationships & Bi-directional Cross Filtering' }
    ],
    keyTakeaways: [
      'CALCULATE is the only DAX function that transitions row context into filter context',
      'Avoiding bi-directional cross filtering prevents ambiguous relationships in complex models'
    ]
  },
  'da-mod-04': {
    id: 'da-mod-04',
    title: 'Tableau Interactive Dashboards & Executive Storytelling',
    category: 'course',
    topic: 'Overview',
    instructor: 'freeCodeCamp.org / Alexey Grigorev',
    instructorRole: 'Head of Data & Author',
    youtubeId: 'WpQECq5Hx9g',
    youtubeUrl: 'https://www.youtube.com/watch?v=WpQECq5Hx9g',
    duration: '25m',
    rating: 4.9,
    views: '620K+ views',
    level: 'Beginner → Intermediate',
    summary: 'Parameters, Level of Detail (LOD) expressions, and executive visual design.',
    techStack: ['Tableau', 'Looker Studio', 'LOD Expressions', 'Executive Dashboards'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Dashboard Layout Grid & Information Hierarchy' },
      { time: '07:45', seconds: 465, title: 'Fixed, Include & Exclude LOD Expressions' },
      { time: '15:30', seconds: 930, title: 'Interactive Dynamic Parameters' },
      { time: '21:00', seconds: 1260, title: 'Publishing & Automated Refresh Schedules' }
    ],
    keyTakeaways: [
      'FIXED LOD expressions calculate values independently of dimensions displayed in the view',
      'Keeping dashboards to 3-4 primary KPI tiles reduces cognitive load for executive stakeholders'
    ]
  },
  'da-mod-05': {
    id: 'da-mod-05',
    title: 'Analytics Engineering with dbt & Semantic Metrics Layer',
    category: 'course',
    topic: 'dbt',
    instructor: 'Kahan Data Solutions',
    instructorRole: 'Analytics Engineering Specialist',
    youtubeId: '5rNquRnNb4E',
    youtubeUrl: 'https://www.youtube.com/watch?v=5rNquRnNb4E',
    duration: '27m',
    rating: 4.9,
    views: '390K+ views',
    level: 'Intermediate',
    summary: 'Building staged models, semantic layers, and automated schema tests with dbt Core.',
    techStack: ['dbt Core', 'Snowflake', 'Jinja', 'Data Testing'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Staging vs Mart Models Architecture' },
      { time: '08:30', seconds: 510, title: 'Modular ref() Dependencies & Lineage Graph' },
      { time: '16:15', seconds: 975, title: 'Schema Tests: unique, not_null, accepted_values' },
      { time: '22:30', seconds: 1350, title: 'Generating Interactive dbt Documentation' }
    ],
    keyTakeaways: [
      'Using ref() instead of raw table names establishes automated DAG execution order',
      'Automated schema tests catch bad or null data before BI dashboards display incorrect figures'
    ]
  },

  // Data Science Track Modules
  'ds-mod-01': {
    id: 'ds-mod-01',
    title: 'Applied Statistics, Probability & A/B Testing',
    category: 'course',
    topic: 'Overview',
    instructor: 'freeCodeCamp.org / Soumil Shah',
    instructorRole: 'AWS Solutions Architect & Streaming Specialist',
    youtubeId: 'kYwaNMQ3XT8',
    youtubeUrl: 'https://www.youtube.com/watch?v=kYwaNMQ3XT8',
    duration: '25m',
    rating: 4.9,
    views: '480K+ views',
    level: 'Intermediate',
    summary: 'Hypothesis testing, p-values, z-scores, and designing statistical sample sizes.',
    techStack: ['Statistics', 'Probability', 'A/B Testing', 'Hypothesis Testing'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Null & Alternative Hypothesis Formulation' },
      { time: '08:15', seconds: 495, title: 'P-Values, Significance Level (Alpha) & Power' },
      { time: '15:40', seconds: 940, title: 'Sample Size Calculations & Minimum Detectable Effect' },
      { time: '21:00', seconds: 1260, title: 'Avoiding Peeking Bias in Live Experiments' }
    ],
    keyTakeaways: [
      'Always calculate minimum sample size before launching experiments to avoid underpowered tests',
      'Never stop tests early on an early significant p-value without sequential testing corrections'
    ]
  },
  'ds-mod-02': {
    id: 'ds-mod-02',
    title: 'Supervised ML: Trees, Regression & Forests',
    category: 'course',
    topic: 'Overview',
    instructor: 'freeCodeCamp.org / Soumil Shah',
    instructorRole: 'AWS Solutions Architect & Streaming Specialist',
    youtubeId: 'kYwaNMQ3XT8',
    youtubeUrl: 'https://www.youtube.com/watch?v=kYwaNMQ3XT8',
    duration: '28m',
    rating: 4.9,
    views: '480K+ views',
    level: 'Beginner → Intermediate',
    summary: 'Cost functions, feature scaling, cross-validation, and bias-variance tradeoff.',
    techStack: ['Scikit-Learn', 'Supervised Learning', 'Random Forest', 'Python'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Bias-Variance Tradeoff & Overfitting' },
      { time: '09:00', seconds: 540, title: 'Linear & Logistic Regression Cost Functions' },
      { time: '17:30', seconds: 1050, title: 'Decision Trees & Gini Impurity Splitting' },
      { time: '23:45', seconds: 1425, title: 'K-Fold Cross Validation & Ensemble Bagging' }
    ],
    keyTakeaways: [
      'Ensemble methods like Random Forests reduce variance by averaging multiple uncorrelated decision trees',
      'Feature scaling (StandardScaler) is mandatory for distance-based algorithms but optional for tree models'
    ]
  },
  'ds-mod-03': {
    id: 'ds-mod-03',
    title: 'Gradient Boosting & XGBoost Hyperparameter Tuning',
    category: 'course',
    topic: 'Overview',
    instructor: 'freeCodeCamp.org / Soumil Shah',
    instructorRole: 'AWS Solutions Architect & Streaming Specialist',
    youtubeId: 'kYwaNMQ3XT8',
    youtubeUrl: 'https://www.youtube.com/watch?v=kYwaNMQ3XT8',
    duration: '30m',
    rating: 4.9,
    views: '480K+ views',
    level: 'Intermediate → Advanced',
    summary: 'Loss reduction, learning rate, tree depth, and early stopping criteria in XGBoost.',
    techStack: ['XGBoost', 'LightGBM', 'Hyperparameter Tuning', 'Machine Learning'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'How Boosting Differs from Bagging' },
      { time: '09:40', seconds: 580, title: 'Gradient Boosting Residual Minimization' },
      { time: '18:20', seconds: 1100, title: 'Tuning Learning Rate, Max Depth & Subsample' },
      { time: '25:00', seconds: 1500, title: 'Early Stopping Rounds on Validation Data' }
    ],
    keyTakeaways: [
      'Gradient boosting trains trees sequentially, where each tree corrects the residual errors of the previous one',
      'Early stopping prevents overtraining when validation loss stops improving'
    ]
  },
  'ds-mod-04': {
    id: 'ds-mod-04',
    title: 'MLOps: Model Registry & FastAPI Serving',
    category: 'course',
    topic: 'Overview',
    instructor: 'freeCodeCamp.org / Soumil Shah',
    instructorRole: 'AWS Solutions Architect & Streaming Specialist',
    youtubeId: 'kYwaNMQ3XT8',
    youtubeUrl: 'https://www.youtube.com/watch?v=kYwaNMQ3XT8',
    duration: '27m',
    rating: 4.9,
    views: '480K+ views',
    level: 'Intermediate',
    summary: 'Containerizing model artifacts with Docker and deploying real-time prediction REST APIs.',
    techStack: ['FastAPI', 'Docker', 'MLflow', 'Model Serving'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Model Serialization: Joblib & ONNX' },
      { time: '08:30', seconds: 510, title: 'Building Asynchronous FastAPI Prediction Routes' },
      { time: '16:45', seconds: 1005, title: 'Packaging into Lightweight Alpine Docker Containers' },
      { time: '22:30', seconds: 1350, title: 'Latency Benchmarking & Batch Inference' }
    ],
    keyTakeaways: [
      'Pydantic request schemas ensure incoming prediction payloads match strict data types',
      'Containerizing inference servers guarantees reproducibility across cloud compute environments'
    ]
  },
  'ds-mod-05': {
    id: 'ds-mod-05',
    title: 'LLM Data Pipelines & Vector Databases (RAG)',
    category: 'course',
    topic: 'Overview',
    instructor: 'freeCodeCamp.org / Soumil Shah',
    instructorRole: 'AWS Solutions Architect & Streaming Specialist',
    youtubeId: 'kYwaNMQ3XT8',
    youtubeUrl: 'https://www.youtube.com/watch?v=kYwaNMQ3XT8',
    duration: '26m',
    rating: 4.9,
    views: '480K+ views',
    level: 'Intermediate → Advanced',
    summary: 'Chunking strategies, embedding generation, semantic search, and retrieval pipelines.',
    techStack: ['RAG', 'Vector DB', 'LangChain', 'Embeddings'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Why RAG Outperforms Fine-Tuning for Enterprise Knowledge' },
      { time: '08:15', seconds: 495, title: 'Document Chunking with Overlap Strategies' },
      { time: '16:00', seconds: 960, title: 'Vector Embeddings & Cosine Distance Search' },
      { time: '21:30', seconds: 1290, title: 'Connecting Vector Stores to Generative Responses' }
    ],
    keyTakeaways: [
      'Chunk overlap preserves context boundaries across paragraphs in long documents',
      'Hybrid search combining BM25 keyword matching with dense vector search maximizes retrieval accuracy'
    ]
  }
};

export const ALL_CURATED_VIDEOS: CuratedVideo[] = [
  ...CURATED_PROJECT_VIDEOS,
  ...CURATED_COURSE_VIDEOS,
  ...Object.values(FOUNDATION_MODULE_VIDEOS),
  ...Object.values(TRACK_MODULE_VIDEOS)
];

export function getCuratedVideoById(id: string): CuratedVideo | undefined {
  return ALL_CURATED_VIDEOS.find(v => v.id === id || v.youtubeId === id);
}

