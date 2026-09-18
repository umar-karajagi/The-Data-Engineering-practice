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
  level: 'Beginner' | 'Beginner → Intermediate' | 'Intermediate → Advanced' | 'Advanced';
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
  instructorRole: 'Lead Data Engineer & Founder, Data Vidhya',
  youtubeId: 'WpQECq5ZZ9Q',
  youtubeUrl: 'https://www.youtube.com/watch?v=WpQECq5ZZ9Q',
  duration: '1 hr 42 min',
  rating: 4.9,
  views: '1.2M+ views',
  level: 'Beginner → Intermediate',
  summary: 'A complete real-world data engineering walkthrough modeling millions of Uber trips. Learn dimensional modeling (Fact & Dimension tables), modern orchestration with Mage AI, Google Cloud Storage, BigQuery data warehousing, and Looker Studio dashboarding.',
  techStack: ['Python', 'Google Cloud Platform (GCP)', 'Mage AI', 'Google BigQuery', 'Looker Studio', 'Lucidchart'],
  chapters: [
    { time: '00:00', seconds: 0, title: 'Project Overview & Architectural Blueprint' },
    { time: '07:30', seconds: 450, title: 'Dataset Exploration & Schema Analysis' },
    { time: '18:15', seconds: 1095, title: 'Dimensional Modeling: Fact & Dimension Design' },
    { time: '35:40', seconds: 2140, title: 'GCP Setup & Google Cloud Storage Bucket Config' },
    { time: '52:10', seconds: 3130, title: 'Pipeline Orchestration with Mage AI & ETL Scripting' },
    { time: '01:15:20', seconds: 4520, title: 'Loading Transformed Entities into BigQuery' },
    { time: '01:30:45', seconds: 5445, title: 'Interactive Analytics & Looker Studio Dashboard' }
  ],
  keyTakeaways: [
    'How to decompose real-world flat CSV trip data into 1NF, 2NF, and Kimball Star Schema',
    'Configuring GCP service accounts, IAM roles, and secure API keys for automated pipelines',
    'Executing containerized Mage data pipelines for extract, transform, and load stages',
    'Writing optimized SQL in BigQuery joining dimension keys to calculate revenue per payment type'
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
    explanation: 'Calculates total trips and aggregate revenue per payment type directly against the dimensional model created in BigQuery.'
  }
};

export const CURATED_PROJECT_VIDEOS: CuratedVideo[] = [
  HERO_MASTERCLASS_VIDEO,
  {
    id: 'project-spotify-aws',
    title: 'Spotify End-to-End Real-Time ETL Data Pipeline | AWS Lambda, S3, Glue & Athena',
    category: 'project',
    topic: 'AWS',
    instructor: 'Darshil Parmar',
    instructorRole: 'Founder, Data Vidhya',
    youtubeId: 'qSxrVu3gqU4',
    youtubeUrl: 'https://www.youtube.com/watch?v=qSxrVu3gqU4',
    duration: '1 hr 18 min',
    rating: 4.9,
    views: '850K+ views',
    level: 'Beginner → Intermediate',
    summary: 'Extract live top global tracks via Spotify Web API, trigger event-driven AWS Lambda functions on daily schedules, store raw and cleansed JSON in Amazon S3, crawl schemas using AWS Glue Data Catalog, and query data using serverless Amazon Athena SQL.',
    techStack: ['Python', 'Spotify Web API', 'AWS Lambda', 'Amazon S3', 'AWS EventBridge', 'AWS Glue', 'Amazon Athena'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Introduction & End-to-End Architecture' },
      { time: '06:20', seconds: 380, title: 'Spotify Developer App & API Credentials' },
      { time: '19:45', seconds: 1185, title: 'Building Python Extraction Script with Spotipy' },
      { time: '34:10', seconds: 2050, title: 'Deploying AWS Lambda with Custom Deployment Packages' },
      { time: '48:30', seconds: 2910, title: 'Transformation Lambda & Target S3 Buckets' },
      { time: '01:02:15', seconds: 3735, title: 'AWS Glue Crawler Setup & SQL Analytics with Athena' }
    ],
    keyTakeaways: [
      'Event-driven data extraction using Spotify API authentication tokens',
      'Deploying AWS Lambda layers with pre-compiled Spotipy and Pandas binaries',
      'Automating schema evolution with AWS Glue Crawlers into Hive Metastore tables',
      'Querying partitioned Parquet datasets directly with serverless Amazon Athena'
    ],
    githubUrl: 'https://github.com/darshilparmar/spotify-api-data-engineering-project',
    datasetUrl: 'https://developer.spotify.com/documentation/web-api',
    practiceSnippet: {
      language: 'sql',
      code: `SELECT 
  artist_name,
  COUNT(song_id) AS total_top_songs,
  ROUND(AVG(popularity), 1) AS avg_popularity
FROM spotify_curated_db.songs_table
GROUP BY artist_name
HAVING COUNT(song_id) > 2
ORDER BY avg_popularity DESC;`,
      explanation: 'Identifies the most popular recurring artists in Spotify weekly charts from AWS Athena.'
    }
  },
  {
    id: 'project-youtube-analysis',
    title: 'YouTube Data Analysis & ETL Pipeline | AWS Data Engineering Project',
    category: 'project',
    topic: 'AWS',
    instructor: 'Darshil Parmar',
    instructorRole: 'Founder, Data Vidhya',
    youtubeId: 'yZKJ_e6h7qU',
    youtubeUrl: 'https://www.youtube.com/watch?v=yZKJ_e6h7qU',
    duration: '2 hr 10 min',
    rating: 4.8,
    views: '620K+ views',
    level: 'Intermediate → Advanced',
    summary: 'Manage structured and semi-structured trending YouTube video data across multiple global regions. Cleanse data with AWS Glue Spark ETL jobs, convert nested JSON into columnar Parquet, and build executive reporting in Amazon QuickSight.',
    techStack: ['AWS Glue', 'Apache Spark', 'Amazon S3', 'AWS Lambda', 'Amazon Athena', 'Amazon QuickSight'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'System Architecture & Regional Data Overview' },
      { time: '14:20', seconds: 860, title: 'AWS CLI Bulk Upload & S3 Data Lake Partitioning' },
      { time: '38:40', seconds: 2320, title: 'Serverless Lambda Data Pre-processing' },
      { time: '01:05:10', seconds: 3910, title: 'Writing Spark ETL Scripts in AWS Glue Studio' },
      { time: '01:42:30', seconds: 6150, title: 'Amazon Athena Ad-hoc Performance Optimization' }
    ],
    keyTakeaways: [
      'Handling nested JSON reference schemas alongside flat CSV video metrics',
      'Optimizing Spark shuffle and partition sizes inside AWS Glue jobs',
      'Enforcing Athena query cost limits using partition projection'
    ],
    githubUrl: 'https://github.com/darshilparmar/youtube-data-engineering-project'
  },
  {
    id: 'project-kafka-stock-market',
    title: 'Real-Time Stock Market Data Pipeline with Apache Kafka | Python, AWS EC2, S3 & Glue',
    category: 'project',
    topic: 'Kafka',
    instructor: 'Darshil Parmar',
    instructorRole: 'Founder, Data Vidhya',
    youtubeId: 'bAyrObl7TYE',
    youtubeUrl: 'https://www.youtube.com/watch?v=bAyrObl7TYE',
    duration: '1 hr 25 min',
    rating: 4.9,
    views: '740K+ views',
    level: 'Intermediate → Advanced',
    summary: 'Build an end-to-end real-time streaming pipeline simulating live stock market ticker feeds. Provision an Apache Kafka cluster on AWS EC2, stream data using Python Kafka Producers & Consumers, land streams in S3, and run real-time queries with Athena.',
    techStack: ['Apache Kafka', 'Python', 'AWS EC2', 'Amazon S3', 'AWS Glue', 'Amazon Athena'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Streaming Architecture & Kafka Fundamentals' },
      { time: '11:15', seconds: 675, title: 'Spinning up Ubuntu EC2 & Installing Kafka + ZooKeeper' },
      { time: '28:30', seconds: 1710, title: 'Creating Kafka Topics & Testing CLI Console Producer' },
      { time: '44:00', seconds: 2640, title: 'Building Python Streaming Producer with Real Stock Feed' },
      { time: '01:02:10', seconds: 3730, title: 'Streaming Consumer to AWS S3 & Glue Cataloging' }
    ],
    keyTakeaways: [
      'Configuring Kafka broker listeners, partitions, and replication factors on EC2',
      'Implementing fault-tolerant Python KafkaProducer serialization and error handling',
      'Handling at-least-once message delivery semantics when landing event data in S3'
    ],
    githubUrl: 'https://github.com/darshilparmar/kafka-stock-market-data-engineering-project'
  },
  {
    id: 'project-dbt-snowflake-netflix',
    title: 'Modern Analytics Engineering with dbt Core & Snowflake | End-to-End Netflix Pipeline',
    category: 'project',
    topic: 'dbt',
    instructor: 'Kahan Data Solutions & Darshil Parmar',
    instructorRole: 'Analytics Engineering Experts',
    youtubeId: '5rNquRnNb4E',
    youtubeUrl: 'https://www.youtube.com/watch?v=5rNquRnNb4E',
    duration: '1 hr 55 min',
    rating: 4.9,
    views: '390K+ views',
    level: 'Intermediate → Advanced',
    summary: 'Master the Modern Data Stack (MDS). Setup dbt Core with Snowflake, build staging, intermediate, and dimensional mart models, configure schema tests, manage incremental loading, and implement slowly changing dimensions (SCD Type 2).',
    techStack: ['dbt Core', 'Snowflake', 'SQL', 'Git', 'Jinja', 'Data Modeling'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Modern Data Stack & dbt Core Architecture' },
      { time: '12:40', seconds: 760, title: 'Snowflake Virtual Warehouses, Databases & Roles Setup' },
      { time: '29:15', seconds: 1755, title: 'dbt Project Initialization & Profiles.yml Configuration' },
      { time: '48:30', seconds: 2910, title: 'Building Staging Views & Ephemeral Transformations' },
      { time: '01:14:00', seconds: 4440, title: 'Incremental Materializations & Surrogate Keys' },
      { time: '01:38:20', seconds: 5900, title: 'Testing, Documentation & dbt Docs Lineage Graph' }
    ],
    keyTakeaways: [
      'Writing reusable modular SQL models using Jinja macros and ref() functions',
      'Implementing dbt snapshot blocks for automated SCD Type 2 dimension tracking',
      'Configuring schema validation tests (unique, not_null, accepted_values, relationships)'
    ],
    githubUrl: 'https://github.com/dbt-labs/jaffle_shop'
  }
];

export const CURATED_COURSE_VIDEOS: CuratedVideo[] = [
  {
    id: 'course-de-roadmap',
    title: 'How to Become a Data Engineer in 2026 | The Complete Roadmap & Step-by-Step Guide',
    category: 'course',
    topic: 'Overview',
    instructor: 'Darshil Parmar',
    instructorRole: 'Founder, Data Vidhya',
    youtubeId: '0oBwH4pYg_k',
    youtubeUrl: 'https://www.youtube.com/watch?v=0oBwH4pYg_k',
    duration: '35 min',
    rating: 4.9,
    views: '650K+ views',
    level: 'Beginner',
    summary: 'A definitive roadmap explaining what tools matter and what tools are noise. Breaks down the 4 core pillars: programming (Python), data querying & modeling (SQL), distributed computing (Spark), and workflow orchestration (Airflow/dbt) with cloud platforms.',
    techStack: ['SQL', 'Python', 'Spark', 'Airflow', 'dbt', 'AWS/GCP/Azure'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'What Does a Modern Data Engineer Actually Do?' },
      { time: '05:20', seconds: 320, title: 'The 4 Foundations: Programming, SQL, Linux & Git' },
      { time: '12:45', seconds: 765, title: 'Data Warehousing vs. Data Lakes vs. Lakehouses' },
      { time: '21:30', seconds: 1290, title: 'Cloud Data Platforms: AWS vs. GCP vs. Azure' },
      { time: '28:10', seconds: 1690, title: 'Portfolio Strategy: How to Stand Out to Hiring Managers' }
    ],
    keyTakeaways: [
      'Stop tutorial hell: why building 3 portfolio projects beats 20 certifications',
      'The exact order to learn: Python → SQL → Data Modeling → Cloud → Spark',
      'How to tailor your GitHub profile and resume for Senior Data Engineer recruiters'
    ]
  },
  {
    id: 'course-sql-masterclass',
    title: 'SQL Tutorial - Full Database Course for Beginners | Master ANSI SQL from Scratch',
    category: 'course',
    topic: 'SQL',
    instructor: 'Mike Dane (freeCodeCamp)',
    instructorRole: 'Lead Software & Database Instructor',
    youtubeId: 'HXV3zeRR3h4',
    youtubeUrl: 'https://www.youtube.com/watch?v=HXV3zeRR3h4',
    duration: '4 hr 20 min',
    rating: 4.9,
    views: '8.4M+ views',
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
    instructor: 'freeCodeCamp / Krish Naik',
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
    id: 'course-airflow-mastery',
    title: 'Apache Airflow Complete Masterclass | Production DAGs, TaskFlow API & Best Practices',
    category: 'course',
    topic: 'Airflow',
    instructor: 'Marc Lamberti',
    instructorRole: 'Apache Airflow PMC Member',
    youtubeId: 'IH1-0hwFBRQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=IH1-0hwFBRQ',
    duration: '2 hr 45 min',
    rating: 4.9,
    views: '480K+ views',
    level: 'Intermediate → Advanced',
    summary: 'The comprehensive guide to workflow orchestration with Apache Airflow. Covers architecture (Webserver, Scheduler, Metadata DB, Celery/Kubernetes Executor), writing robust DAGs with the modern TaskFlow API (@dag, @task), XComs, Sensors, and SLA alerts.',
    techStack: ['Apache Airflow', 'Docker', 'Python', 'Celery', 'PostgreSQL'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Airflow Architecture: Scheduler, Webserver, Worker, DB' },
      { time: '18:40', seconds: 1120, title: 'Setting Up Airflow with Docker Compose' },
      { time: '42:15', seconds: 2535, title: 'Writing Your First DAG with the TaskFlow API' },
      { time: '01:12:00', seconds: 4320, title: 'Data Passing with XComs & Best Practices' },
      { time: '01:45:30', seconds: 6330, title: 'Branching, Dynamic Task Mapping & Sensors' },
      { time: '02:18:00', seconds: 8280, title: 'Production Alerting with Slack & Email Webhooks' }
    ],
    keyTakeaways: [
      'Never put heavy computation inside the DAG file top-level parse loop',
      'Leverage Dynamic Task Mapping to spawn parallel workers per file partition',
      'Configure execution_date idempotency so pipelines can safely backfill historical periods'
    ]
  },
  {
    id: 'course-kafka-streaming',
    title: 'Apache Kafka in 60 Minutes | Real-Time Event Streaming Crash Course',
    category: 'course',
    topic: 'Kafka',
    instructor: 'Stephane Maarek',
    instructorRole: 'AWS & Kafka Certified Instructor',
    youtubeId: 'R873BlNVUB4',
    youtubeUrl: 'https://www.youtube.com/watch?v=R873BlNVUB4',
    duration: '1 hr 08 min',
    rating: 4.9,
    views: '1.5M+ views',
    level: 'Beginner → Intermediate',
    summary: 'The ultimate visual breakdown of real-time messaging with Apache Kafka. Topics, Partitions, Offsets, Consumers, Consumer Groups, Brokers, Replication, Producers, Keys, and KRaft consensus.',
    techStack: ['Apache Kafka', 'KRaft', 'Java', 'Python', 'Event-Driven Architecture'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Why Kafka? Batch vs Streaming Architecture' },
      { time: '12:30', seconds: 750, title: 'Topics, Partitions & Offset Retention' },
      { time: '26:45', seconds: 1605, title: 'Message Keys & Partition Hashing Guarantees' },
      { time: '38:20', seconds: 2300, title: 'Consumer Groups & Load Balancing' },
      { time: '52:10', seconds: 3130, title: 'Cluster Replication Factor & Leader-Follower Sync' }
    ],
    keyTakeaways: [
      'Partitioning keys ensure strict in-order message delivery per entity ID',
      'Consumer groups enable horizontal scaling without duplicate consumption',
      'How Kafka achieves millions of ops/sec via OS page cache and zero-copy transfer'
    ]
  },
  {
    id: 'course-data-modeling-kimball',
    title: 'Data Modeling for Data Engineers | Star Schema, Snowflake Schema & SCDs',
    category: 'course',
    topic: 'Data Modeling',
    instructor: 'Zach Wilson / Seattle Data Guy',
    instructorRole: 'Principal Data Engineers',
    youtubeId: '7_hAeqv4s5U',
    youtubeUrl: 'https://www.youtube.com/watch?v=7_hAeqv4s5U',
    duration: '1 hr 12 min',
    rating: 4.9,
    views: '380K+ views',
    level: 'Beginner → Intermediate',
    summary: 'Learn the architectural principles of dimensional modeling for analytics. Kimball Star Schema vs. Inmon 3NF, Conformed Dimensions, Fact Tables (Additive, Semi-Additive, Non-Additive), Factless Facts, and Slowly Changing Dimensions (Types 1, 2, and 3).',
    techStack: ['Data Modeling', 'Kimball Methodology', 'SQL', 'Snowflake', 'BigQuery'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'Why Dimensional Modeling Still Rules the Modern Lakehouse' },
      { time: '14:20', seconds: 860, title: 'Grain Selection: The Most Critical Step in Design' },
      { time: '28:45', seconds: 1725, title: 'Designing Fact Tables & Types of Measurement' },
      { time: '42:10', seconds: 2530, title: 'Dimension Tables, Hierarchies & Surrogate Keys' },
      { time: '55:30', seconds: 3330, title: 'Slowly Changing Dimensions (SCD Type 1, 2 & 3)' }
    ],
    keyTakeaways: [
      'Always declare grain explicitly before defining dimensions or measures',
      'Use integer surrogate keys instead of natural business keys for durable relationships',
      'SCD Type 2 preserves history with effective start/end timestamps and current flags'
    ]
  },
  {
    id: 'course-system-design-interview',
    title: 'Data Engineering System Design Interview | Complete Framework with Real Examples',
    category: 'interview',
    topic: 'System Design',
    instructor: 'Seattle Data Guy / Exponent',
    instructorRole: 'Staff Data Engineering Interviewers',
    youtubeId: '8WzQ2K_eG38',
    youtubeUrl: 'https://www.youtube.com/watch?v=8WzQ2K_eG38',
    duration: '52 min',
    rating: 4.9,
    views: '420K+ views',
    level: 'Advanced',
    summary: 'The step-by-step framework to crack Senior and Staff Data Engineering System Design rounds at top tech companies. Covers capacity estimation, batch vs streaming tradeoffs, data partitioning, deduplication, monitoring, and fault recovery.',
    techStack: ['System Design', 'Distributed Systems', 'Kafka', 'Spark', 'S3', 'Airflow'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'The 5-Step System Design Interview Framework' },
      { time: '08:30', seconds: 510, title: 'Requirements Clarification & Scale Math (QPS, TB/day)' },
      { time: '19:15', seconds: 1155, title: 'High-Level Architecture: Ingestion → Storage → Serving' },
      { time: '32:40', seconds: 1960, title: 'Deep Dive: Exactly-Once Processing & Deduping' },
      { time: '44:10', seconds: 2650, title: 'Operational Readiness: Backfills, Monitoring & SLAs' }
    ],
    keyTakeaways: [
      'Spend the first 8 minutes clarifying SLAs, data volumes, latency, and query patterns',
      'Proactively highlight failure modes (upstream API downtime, schema drift, network partitions)',
      'Demonstrate trade-offs: Lambda vs Kappa vs Medallion Lakehouse architecture'
    ]
  }
];

export const ALL_CURATED_VIDEOS: CuratedVideo[] = [
  ...CURATED_PROJECT_VIDEOS,
  ...CURATED_COURSE_VIDEOS
];

export function getCuratedVideoById(id: string): CuratedVideo | undefined {
  return ALL_CURATED_VIDEOS.find(v => v.id === id);
}

export function getVideosByTopic(topic: string): CuratedVideo[] {
  if (topic === 'All') return ALL_CURATED_VIDEOS;
  return ALL_CURATED_VIDEOS.filter(v => v.topic.toLowerCase() === topic.toLowerCase() || v.techStack.some(t => t.toLowerCase() === topic.toLowerCase()));
}
