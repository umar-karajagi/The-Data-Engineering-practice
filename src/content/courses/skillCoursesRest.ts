import { SkillCourse } from '@/types';
import { CURRICULUM_RESEARCH_SOURCES } from '../research/curriculumSignals';

export const REST_SKILL_COURSES: SkillCourse[] = [
  {
    id: 'SF-01',
    slug: 'linux-shell-scripting-git-terminal-workflows',
    title: 'Linux, Shell Scripting, Git & Terminal Workflows for Data',
    subtitle: 'Command line mastery, text processing with awk/sed, process management, and Git workflows for data teams.',
    outcomeStatement: 'Confidently automate data ingestion scripts, debug remote server processes, and collaborate via trunk-based Git workflows.',
    description: 'Master the universal developer substrate. From Unix philosophy and I/O redirection to stream processing with awk, sed, and grep, environment variables, cron scheduling, SSH tunneling, and production Git collaboration.',
    level: 'Beginner',
    durationHours: 12,
    status: 'preview',
    featured: false,
    skills: ['Bash / Zsh', 'awk & sed', 'Process Signals & Management', 'Git Branching & Rebase', 'Cron & Systemd', 'SSH & Remote Debugging'],
    roleTags: ['Data Engineer', 'Analytics Engineer', 'DevOps'],
    toolTags: ['Linux', 'Bash', 'Git', 'Terminal'],
    prerequisites: ['No prior programming experience required'],
    learningObjectives: [
      'Navigate and manipulate Linux filesystems, file descriptors, and stream pipes',
      'Process high-volume text and log files using awk, sed, and ripgrep at gigabyte scale',
      'Manage background daemon jobs, monitor memory/CPU metrics via top/htop, and handle POSIX signals',
      'Implement robust Git workflows: interactive rebase, cherry-pick, conflict resolution, and hooks'
    ],
    researchSources: [CURRICULUM_RESEARCH_SOURCES.iit_bombay_cse],
    lastReviewed: '2026-03-01',
    diagnostic: {
      id: 'SF-01-DIAG',
      title: 'Linux & Terminal Diagnostic',
      description: 'Check your comfort with Linux process management and stream pipelines.',
      estimatedMinutes: 8,
      qualifySkipModuleId: 'sf-01-m1',
      questions: [
        {
          id: 'q1',
          question: 'What does the standard shell command `2>&1` accomplish?',
          options: [
            'Redirects standard error (file descriptor 2) to the current destination of standard output (file descriptor 1).',
            'Redirects standard input to output.',
            'Doubles the buffer size of process 1.',
            'Sends process 2 to the background.'
          ],
          correctIndex: 0,
          explanation: 'File descriptor 1 is stdout and 2 is stderr. 2>&1 merges error streams into the standard output stream.',
          difficulty: 'Intermediate'
        }
      ]
    },
    modules: [
      {
        id: 'sf-01-m1',
        title: 'Unix Philosophy, Streams & Text Transformation',
        description: 'File descriptors, piping, redirection, and streaming text processing.',
        estimatedMinutes: 60,
        objectives: ['Master stdin, stdout, stderr and Unix pipelines'],
        lessons: [
          {
            id: 'sf-01-l1',
            title: 'File Descriptors & High-Throughput Stream Piping',
            estimatedMinutes: 20,
            objective: 'Use pipes and redirection to process streams without writing intermediate disk files.',
            conceptBlocks: [
              {
                id: 'cb-1',
                title: 'Everything is a File',
                content: 'Unix processes communicate via streams. By combining simple tools that do one thing well through standard streams, you can build fast data processing utilities with zero memory overhead.'
              }
            ],
            inlineChecks: [
              {
                id: 'ic-1',
                question: 'Which tool is best suited for stream-editing text by line regex?',
                options: ['sed', 'cat', 'pwd', 'mkdir'],
                correctIndex: 0,
                explanation: 'sed (Stream Editor) transforms input streams line-by-line.'
              }
            ]
          }
        ],
        quiz: {
          id: 'sf-01-q1',
          title: 'Linux Stream & Git Assessment',
          passingScorePercent: 70,
          questions: [
            {
              id: 'qz-1',
              question: 'Which signal is sent by kill -9 to force terminate an unresponsive process?',
              options: ['SIGTERM', 'SIGKILL', 'SIGINT', 'SIGHUP'],
              correctIndex: 1,
              explanation: 'SIGKILL (9) cannot be caught or ignored by the target process, forcing immediate kernel termination.'
            }
          ]
        }
      }
    ],
    capstone: {
      id: 'SF-01-CAP',
      title: 'Automated Log Parsing & System Health Surveillance Tool',
      problemStatement: 'Author an idempotent Bash script that rotates application logs, extracts HTTP 500 error spikes with awk, sends alerts, and runs on cron.',
      businessScenario: 'A cluster node runs out of disk space due to unbounded logs. You must automate rotation, parsing, and cleanup.',
      deliverables: ['Bash utility script with error traps', 'Cron configuration', 'Incident log parsing documentation'],
      rubricItems: [
        { id: 'rb-1', criterion: 'Idempotency and Error Trapping', weightPercent: 50, guidance: 'Must use set -euo pipefail.' },
        { id: 'rb-2', criterion: 'Parsing Speed & Accuracy', weightPercent: 50, guidance: 'Process 1GB log under 15 seconds.' }
      ],
      portfolioOutput: 'Shell tooling GitHub repository with automated Bats test suite.'
    }
  },
  {
    id: 'SF-03',
    slug: 'data-structures-algorithms-memory-optimization',
    title: 'Data Structures, Algorithms & Memory Optimization',
    subtitle: 'Algorithmic efficiency, hash maps, B-trees, inverted indexes, and memory profiling for big data systems.',
    outcomeStatement: 'Analyze and optimize the computational complexity and memory footprint of data processing algorithms.',
    description: 'Data engineering computer science fundamentals. Master hash collisions, tree balancing, Bloom filters, bitsets, cache locality, and algorithmic time/space trade-offs synthesized from IIT Bombay CS 213.',
    level: 'Intermediate',
    durationHours: 18,
    status: 'preview',
    featured: false,
    skills: ['Big-O Analysis', 'Hash Tables & Collisions', 'Bloom Filters', 'Bitmaps', 'Cache Locality', 'Graph Traversal'],
    roleTags: ['Data Engineer', 'Backend Engineer', 'Systems Engineer'],
    toolTags: ['Python', 'C/C++ basics', 'Memory Profilers'],
    prerequisites: ['Python Software Engineering'],
    learningObjectives: [
      'Evaluate Big-O time and space complexity of data transformation pipelines',
      'Implement probabilistic data structures like Bloom Filters and HyperLogLog',
      'Optimize cache locality and data alignment to avoid CPU cache misses'
    ],
    researchSources: [CURRICULUM_RESEARCH_SOURCES.iit_bombay_cse],
    lastReviewed: '2026-03-01',
    diagnostic: {
      id: 'SF-03-DIAG',
      title: 'Data Structures Diagnostic',
      description: 'Check your algorithmic foundations and space complexity intuition.',
      estimatedMinutes: 8,
      qualifySkipModuleId: 'sf-03-m1',
      questions: [
        {
          id: 'q1',
          question: 'What is the theoretical false positive and false negative guarantee of a standard Bloom Filter?',
          options: [
            'May yield false positives, but never yields false negatives.',
            'May yield false negatives, but never yields false positives.',
            'Can yield both with equal probability.',
            'Has 100% precision and recall.'
          ],
          correctIndex: 0,
          explanation: 'Bloom filters guarantee zero false negatives: if it says an item is not present, it is definitely not present.'
        }
      ]
    },
    modules: [
      {
        id: 'sf-03-m1',
        title: 'Probabilistic Structures & Memory Primitives',
        description: 'Bloom filters, HyperLogLog, and bitset arrays in data pipelines.',
        estimatedMinutes: 60,
        objectives: ['Implement probabilistic membership queries with zero false negatives'],
        lessons: [
          {
            id: 'sf-03-l1',
            title: 'Bloom Filters in Distributed Storage Systems',
            estimatedMinutes: 20,
            objective: 'Understand how LSM engines use Bloom filters to avoid unnecessary disk I/O.',
            conceptBlocks: [{ id: 'cb-1', title: 'I/O Avoidance via Probabilistic Hashing', content: 'Storage engines query a Bloom filter before scanning SSTables on disk.' }],
            inlineChecks: [{ id: 'ic-1', question: 'Does a Bloom filter support item deletion without counting?', options: ['No', 'Yes', 'Only on Sundays', 'If using MD5'], correctIndex: 0, explanation: 'Standard Bloom filters cannot delete items because bit flags are shared across multiple keys.' }]
          }
        ],
        quiz: {
          id: 'sf-03-q1',
          title: 'Algorithms & Probabilistic Structures Quiz',
          passingScorePercent: 70,
          questions: [
            { id: 'qz-1', question: 'What is the time complexity of looking up a key in a balanced B+ Tree?', options: ['O(log N)', 'O(1)', 'O(N)', 'O(N^2)'], correctIndex: 0, explanation: 'B+ trees maintain balanced branch depths resulting in logarithmic search times.' }
          ]
        }
      }
    ],
    capstone: {
      id: 'SF-03-CAP',
      title: 'High-Throughput In-Memory Deduplication Filter with HyperLogLog',
      problemStatement: 'Design and implement an in-memory cardinality estimator and membership filter capable of processing 100M unique visitor IDs under 16MB of RAM.',
      businessScenario: 'Real-time analytics engine cannot store 100M UUIDs in standard hash sets without exhausting cluster heap space.',
      deliverables: ['Custom Python Bloom filter and HyperLogLog implementation', 'Memory profiling benchmark', 'Empirical error rate analysis report'],
      rubricItems: [
        { id: 'rb-1', criterion: 'Space Complexity & RAM Bounds', weightPercent: 50, guidance: 'Heap usage strictly bounded under 16MB.' },
        { id: 'rb-2', criterion: 'Theoretical Accuracy Alignment', weightPercent: 50, guidance: 'Standard error within theoretical bounds.' }
      ],
      portfolioOutput: 'Open-source memory-optimized data structures library on GitHub with benchmarks.'
    }
  },
  {
    id: 'SF-05',
    slug: 'advanced-analytical-sql-windowing-functions',
    title: 'Advanced Analytical SQL & Windowing Functions',
    subtitle: 'Recursive CTEs, sessionization, islands and gaps, pivoting, and analytical window frames.',
    outcomeStatement: 'Solve the most challenging analytical business logic queries with elegant, performant SQL without procedural code.',
    description: 'Take SQL beyond basic reporting. Master recursive common table expressions for hierarchical graphs, sessionization algorithms, island-and-gap pattern matching, range-based window framing, and pivot/unpivot operations in modern analytics engines.',
    level: 'Intermediate to Advanced',
    durationHours: 15,
    status: 'preview',
    featured: false,
    skills: ['Recursive CTEs', 'Sessionization Algorithms', 'Islands & Gaps Detection', 'Moving Windows & Frame Bounds', 'Pivot / Unpivot', 'Hierarchical Trees'],
    roleTags: ['Analytics Engineer', 'Data Engineer', 'Data Analyst'],
    toolTags: ['DuckDB', 'PostgreSQL', 'Snowflake', 'BigQuery'],
    prerequisites: ['Relational Database Fundamentals, ANSI SQL & Execution Engines'],
    learningObjectives: [
      'Solve graph traversal and organizational hierarchies using Recursive CTEs',
      'Implement user sessionization pipelines using LAG, conditional flags, and running sums',
      'Detect continuous streaks and gaps across chronological time series events'
    ],
    researchSources: [CURRICULUM_RESEARCH_SOURCES.ansi_sql_standards],
    lastReviewed: '2026-03-01',
    diagnostic: {
      id: 'SF-05-DIAG',
      title: 'Advanced SQL Diagnostic',
      description: 'Assess your skills in recursive queries and complex window framing.',
      estimatedMinutes: 8,
      qualifySkipModuleId: 'sf-05-m1',
      questions: [
        {
          id: 'q1',
          question: 'In a recursive CTE, which clause combines the initial anchor member with the recursive member?',
          options: ['UNION ALL (or UNION)', 'JOIN', 'INTERSECT', 'EXCEPT'],
          correctIndex: 0,
          explanation: 'A recursive CTE defines an anchor query UNION ALL recursive query referencing the CTE name itself until termination.'
        }
      ]
    },
    modules: [
      {
        id: 'sf-05-m1',
        title: 'Recursive Common Table Expressions & Graph Traversal',
        description: 'Traverse bill-of-materials, manager hierarchies, and dependency graphs in pure SQL.',
        estimatedMinutes: 60,
        objectives: ['Formulate terminating recursive CTEs'],
        lessons: [
          {
            id: 'sf-05-l1',
            title: 'Anchor vs Recursive Evaluation Mechanics',
            estimatedMinutes: 20,
            objective: 'Understand how the SQL engine iterates recursive working sets.',
            conceptBlocks: [{ id: 'cb-1', title: 'The Working Table Model', content: 'The engine evaluates the anchor member, populates the working table, and repeatedly applies the recursive member until the working table is empty.' }],
            inlineChecks: [{ id: 'ic-1', question: 'What happens if a recursive CTE has a cyclical reference without a depth counter or visited check?', options: ['Infinite recursion / query timeout error', 'Silent data corruption', 'Automatic deduplication', 'Query runs backwards'], correctIndex: 0, explanation: 'Cycles cause infinite loops unless explicitly halted by a cycle detection clause or depth limit.' }]
          }
        ],
        quiz: {
          id: 'sf-05-q1',
          title: 'Advanced Analytical SQL Quiz',
          passingScorePercent: 70,
          questions: [
            { id: 'qz-1', question: 'Which window frame boundary includes all rows from the beginning of the partition up to the current row?', options: ['ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW', 'ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING', 'ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING', 'RANGE BETWEEN 10 PRECEDING AND 10 FOLLOWING'], correctIndex: 0, explanation: 'UNBOUNDED PRECEDING to CURRENT ROW is the standard cumulative frame.' }
          ]
        }
      }
    ],
    capstone: {
      id: 'SF-05-CAP',
      title: 'Multi-Touch Marketing Attribution & Sessionization Engine',
      problemStatement: 'Build a pure SQL attribution model calculating first-touch, last-touch, and linear position-based attribution across 5M user navigation events.',
      businessScenario: 'Marketing spend is misallocated due to simplistic last-click tracking. Management requires an automated SQL model providing multi-touch attribution.',
      deliverables: ['Sessionization SQL model', 'Multi-touch attribution script', 'Performance benchmark on DuckDB'],
      rubricItems: [
        { id: 'rb-1', criterion: 'Sessionization Accuracy', weightPercent: 50, guidance: 'Correct 30-min window break calculation.' },
        { id: 'rb-2', criterion: 'Attribution Math Precision', weightPercent: 50, guidance: 'Weights sum to exactly 1.0 per converted session.' }
      ],
      portfolioOutput: 'Analytical SQL model suite with automated verification queries.'
    }
  },
  {
    id: 'SF-06',
    slug: 'data-ingestion-rest-apis-cdc-patterns',
    title: 'Data Ingestion, REST APIs & CDC Patterns',
    subtitle: 'Change Data Capture (CDC), Debezium, webhook listeners, rate limiting, and backoff pagination.',
    outcomeStatement: 'Build resilient ingestion pipelines pulling data from third-party REST APIs and transactional database transaction logs with zero data loss.',
    description: 'Ingestion is the front door of the data platform. Learn how to consume third-party SaaS APIs handling rate limits, tokens, cursor pagination, and exponential backoff, alongside transaction-log Change Data Capture (CDC) with Debezium and Kafka.',
    level: 'Intermediate',
    durationHours: 16,
    status: 'preview',
    featured: false,
    skills: ['Change Data Capture (CDC)', 'Debezium', 'REST API Pagination', 'Exponential Backoff', 'Idempotent Webhooks', 'Schema Drift'],
    roleTags: ['Data Engineer', 'Backend Engineer'],
    toolTags: ['Python', 'Kafka', 'PostgreSQL', 'Debezium'],
    prerequisites: ['Python Software Engineering', 'Relational Database Fundamentals'],
    learningObjectives: [
      'Extract incremental records from transactional databases using write-ahead log CDC (Debezium/Kafka Connect)',
      'Design rate-limit aware REST API extractors with exponential jitter backoff',
      'Implement cursor and keyset pagination to eliminate missed records during API crawls'
    ],
    researchSources: [CURRICULUM_RESEARCH_SOURCES.nitk_surathkal_de],
    lastReviewed: '2026-03-01',
    diagnostic: {
      id: 'SF-06-DIAG',
      title: 'Ingestion & CDC Diagnostic',
      description: 'Assess your knowledge of replication logs, cursor pagination, and retry strategies.',
      estimatedMinutes: 8,
      qualifySkipModuleId: 'sf-06-m1',
      questions: [
        {
          id: 'q1',
          question: 'Why is log-based CDC superior to querying `WHERE updated_at > :last_sync` on transactional databases?',
          options: [
            'Log-based CDC captures hard DELETE operations, imposes near-zero query overhead on the source DB, and avoids missing transactions committed out of clock order.',
            'Log-based CDC bypasses database encryption.',
            'Log-based CDC does not require network access.',
            'Log-based CDC converts rows into NoSQL format automatically.'
          ],
          correctIndex: 0,
          explanation: 'Timestamp polling cannot detect hard DELETEs and creates heavy read load on production tables, while WAL CDC reads the database replication stream directly.'
        }
      ]
    },
    modules: [
      {
        id: 'sf-06-m1',
        title: 'Transaction Log CDC & Debezium Architecture',
        description: 'Read PostgreSQL WAL and MySQL binlogs for real-time change event streaming.',
        estimatedMinutes: 60,
        objectives: ['Configure logical replication slots and parse CDC change events'],
        lessons: [
          {
            id: 'sf-06-l1',
            title: 'Debezium Event Envelopes: Before vs After Payloads',
            estimatedMinutes: 20,
            objective: 'Decode CDC JSON events representing INSERT, UPDATE, and DELETE operations.',
            conceptBlocks: [{ id: 'cb-1', title: 'Anatomy of a CDC Record', content: 'Each CDC event contains metadata, the operation type (c=create, u=update, d=delete), and before/after row snapshots.' }],
            inlineChecks: [{ id: 'ic-1', question: 'Which operation in a CDC stream contains a non-null before payload but a null after payload?', options: ['DELETE', 'INSERT', 'UPDATE', 'TRUNCATE'], correctIndex: 0, explanation: 'DELETE events capture the state prior to deletion in before, while after is null.' }]
          }
        ],
        quiz: {
          id: 'sf-06-q1',
          title: 'CDC & Ingestion Quiz',
          passingScorePercent: 70,
          questions: [
            { id: 'qz-1', question: 'Why is exponential backoff paired with "jitter" in API retry policies?', options: ['To prevent the thundering herd problem where all retrying clients hammer the server simultaneously.', 'To speed up network requests.', 'To avoid SSL handshake timeouts.', 'To compress JSON payloads.'], correctIndex: 0, explanation: 'Jitter introduces randomized delays, spreading out retries to avoid synchronized thundering herd spikes.' }
          ]
        }
      }
    ],
    capstone: {
      id: 'SF-06-CAP',
      title: 'Production REST & CDC Hybrid Ingestion Service',
      problemStatement: 'Build a production ingestion service that extracts customer billing updates from Stripe REST API with rate-limiting backoff, while streaming internal database changes via PostgreSQL logical replication to cloud storage.',
      businessScenario: 'Finance discrepancies occur when billing webhook payloads are dropped during peak sale traffic.',
      deliverables: ['Async Python REST client with rate limiting', 'PostgreSQL logical replication reader script', 'End-to-end replay test suite'],
      rubricItems: [
        { id: 'rb-1', criterion: 'Rate Limit & Retry Compliance', weightPercent: 50, guidance: 'Zero 429 unhandled failures under simulated rate limiting.' },
        { id: 'rb-2', criterion: 'CDC Event Completeness', weightPercent: 50, guidance: '100% capture of INSERT, UPDATE, DELETE events without duplicates.' }
      ],
      portfolioOutput: 'Containerized Ingestion Service repository with integration mocks.'
    }
  },
  {
    id: 'SF-07',
    slug: 'dimensional-modeling-fact-dimension-design-schema-architecture',
    title: 'Dimensional Modeling, Fact/Dimension Design & Schema Architecture',
    subtitle: 'Kimball star schemas, conformed dimensions, Slowly Changing Dimensions (SCD Types 1, 2, 3, 6), and fact grains.',
    outcomeStatement: 'Design intuitive, query-optimized dimensional data warehouses that business analysts and BI tools can query effortlessly.',
    description: 'The definitive course on dimensional modeling based on Ralph Kimball methodologies and academic data warehousing curricula from NITK Surathkal. Master fact tables (transaction, periodic snapshot, accumulating snapshot), dimension hierarchies, conformed dimensions, surrogate key generation, and SCD patterns.',
    level: 'Beginner to Intermediate',
    durationHours: 16,
    status: 'preview',
    featured: true,
    skills: ['Kimball Methodology', 'Star Schema & Snowflake Schema', 'Fact Table Granularity', 'Slowly Changing Dimensions (SCD 1, 2, 3, 6)', 'Conformed Dimensions', 'Surrogate Keys'],
    roleTags: ['Analytics Engineer', 'Data Engineer', 'Data Architect'],
    toolTags: ['SQL', 'dbt', 'Snowflake', 'BigQuery'],
    prerequisites: ['Relational Database Fundamentals'],
    learningObjectives: [
      'Define unambiguous granularity for transaction, periodic snapshot, and accumulating snapshot fact tables',
      'Implement Slowly Changing Dimensions Type 2 with valid_from, valid_to, and is_current flags',
      'Design bus architecture matrices with conformed dimensions to unify disparate business domains'
    ],
    researchSources: [CURRICULUM_RESEARCH_SOURCES.nitk_surathkal_de],
    lastReviewed: '2026-03-01',
    diagnostic: {
      id: 'SF-07-DIAG',
      title: 'Dimensional Modeling Diagnostic',
      description: 'Evaluate your knowledge of Kimball star schemas and SCD patterns.',
      estimatedMinutes: 8,
      qualifySkipModuleId: 'sf-07-m1',
      questions: [
        {
          id: 'q1',
          question: 'What is the Kimball definition of "Grain" in a fact table?',
          options: [
            'The exact real-world business event or measurement represented by a single row in the fact table.',
            'The number of gigabytes stored on disk.',
            'The number of foreign keys in the dimension table.',
            'The refresh frequency of the ETL pipeline.'
          ],
          correctIndex: 0,
          explanation: 'Grain is the foundational design declaration specifying what a single row represents (e.g. one line item on a customer invoice).'
        }
      ]
    },
    modules: [
      {
        id: 'sf-07-m1',
        title: 'Star Schema Foundations & Granularity Selection',
        description: 'Design star schemas with clear grain declarations and surrogate keys.',
        estimatedMinutes: 60,
        objectives: ['Differentiate transaction, periodic snapshot, and accumulating fact tables'],
        lessons: [
          {
            id: 'sf-07-l1',
            title: 'Fact Table Types & The Four-Step Design Process',
            estimatedMinutes: 20,
            objective: 'Follow Kimball 4-step process: Select Business Process, Declare Grain, Identify Dimensions, Identify Facts.',
            conceptBlocks: [{ id: 'cb-1', title: 'The 4-Step Method', content: 'Step 1: Select business process. Step 2: Declare grain. Step 3: Identify dimensions. Step 4: Identify numeric additive facts.' }],
            inlineChecks: [{ id: 'ic-1', question: 'Which fact table type is best suited for order fulfillment pipelines tracking milestones (Ordered -> Packed -> Shipped -> Delivered)?', options: ['Accumulating Snapshot Fact', 'Transaction Fact', 'Periodic Snapshot Fact', 'Dimension Table'], correctIndex: 0, explanation: 'Accumulating snapshot facts have multiple date foreign keys representing sequential pipeline milestones.' }]
          }
        ],
        quiz: {
          id: 'sf-07-q1',
          title: 'Dimensional Design Quiz',
          passingScorePercent: 70,
          questions: [
            { id: 'qz-1', question: 'Why are surrogate keys preferred over natural operational keys in dimension tables?', options: ['They decouple the warehouse from source operational key changes and allow tracking historical SCD2 versions for the same entity.', 'They save disk space.', 'They encrypt sensitive user data.', 'They are required by ANSI SQL.'], correctIndex: 0, explanation: 'Surrogate keys allow multiple versions of a single natural key (SCD2) and insulate the warehouse from upstream ERP key reassignments.' }
          ]
        }
      }
    ],
    capstone: {
      id: 'SF-07-CAP',
      title: 'Enterprise Healthcare Billing & Patient Journey Dimensional Model',
      problemStatement: 'Design a comprehensive Kimball dimensional model for a hospital network tracking 2M patient admissions, diagnosis codes, medication administrations, and insurance claim adjudications.',
      businessScenario: 'Executives cannot analyze patient readmission rates across hospital branches due to disparate billing and clinical records.',
      deliverables: ['Complete Enterprise Bus Matrix', 'DDL scripts for Star Schema in SQL', 'SCD Type 2 patient dimension update script', 'Architecture design document'],
      rubricItems: [
        { id: 'rb-1', criterion: 'Granularity & Conformed Dimensions', weightPercent: 50, guidance: 'Zero grain mixing; patient and provider dimensions properly conformed.' },
        { id: 'rb-2', criterion: 'SCD Type 2 Implementation', weightPercent: 50, guidance: 'Flawless effective date ranges with non-overlapping intervals.' }
      ],
      portfolioOutput: 'Complete Dimensional Data Warehouse architecture package on GitHub.'
    }
  },
  {
    id: 'SF-08',
    slug: 'data-lakehouse-storage-formats-parquet-delta-iceberg-hudi',
    title: 'Data Lakehouse Storage Formats (Parquet, Delta Lake, Iceberg, Hudi)',
    subtitle: 'Columnar storage, row groups, dictionary encoding, metadata trees, partition evolution, and ACID transactions.',
    outcomeStatement: 'Select, configure, and maintain modern open table formats to maximize query speeds and minimize cloud object storage costs.',
    description: 'Deep technical exploration of columnar file formats (Apache Parquet, Apache Arrow) and modern open table formats (Apache Iceberg, Delta Lake, Apache Hudi). Learn Dremel record shredding, min/max statistics pruning, snapshot isolation, file compaction, and hidden partitioning.',
    level: 'Intermediate',
    durationHours: 18,
    status: 'preview',
    featured: false,
    skills: ['Apache Parquet', 'Apache Iceberg', 'Delta Lake', 'Columnar Encoding', 'Partition Evolution', 'Compaction & VACUUM'],
    roleTags: ['Data Engineer', 'Platform Architect'],
    toolTags: ['Parquet', 'Iceberg', 'Delta Lake', 'DuckDB', 'PyArrow'],
    prerequisites: ['Relational Database Fundamentals'],
    learningObjectives: [
      'Deconstruct Parquet file layout: FileHeader, RowGroups, ColumnChunks, DataPages, and Footer Metadata',
      'Explain how Iceberg metadata trees (Catalog -> Metadata File -> Manifest List -> Manifest File -> Data File) achieve atomic commits',
      'Implement automated file compaction and snapshot maintenance routines'
    ],
    researchSources: [CURRICULUM_RESEARCH_SOURCES.apache_parquet_arrow],
    lastReviewed: '2026-03-01',
    diagnostic: {
      id: 'SF-08-DIAG',
      title: 'Storage Formats Diagnostic',
      description: 'Test your knowledge of columnar encoding and open table metadata.',
      estimatedMinutes: 8,
      qualifySkipModuleId: 'sf-08-m1',
      questions: [
        {
          id: 'q1',
          question: 'In Apache Parquet, why are column chunk statistics (min/max values) stored in the file footer metadata?',
          options: [
            'To enable query engines to skip entire row groups without reading or decompressing the column data from disk (predicate pushdown).',
            'To encrypt the file.',
            'To format values for display.',
            'To prevent file copying.'
          ],
          correctIndex: 0,
          explanation: 'Footer statistics enable readers to prune non-matching row groups before downloading or reading data blocks.'
        }
      ]
    },
    modules: [
      {
        id: 'sf-08-m1',
        title: 'Parquet Internals & Columnar Encoding Algorithms',
        description: 'Dictionary encoding, bit-packing, run-length encoding, and row group sizing.',
        estimatedMinutes: 60,
        objectives: ['Understand how columnar compression achieves 80%+ space savings'],
        lessons: [
          {
            id: 'sf-08-l1',
            title: 'Dictionary & Run-Length Encoding Mechanics',
            estimatedMinutes: 20,
            objective: 'Trace how repeated string columns are compressed into integer dictionaries.',
            conceptBlocks: [{ id: 'cb-1', title: 'Why Columnar Outperforms Row Stores for Analytics', content: 'Storing similar data types contiguously allows compression algorithms (Snappy, ZSTD) and vector SIMD instructions to operate at memory bus bandwidth.' }],
            inlineChecks: [{ id: 'ic-1', question: 'What is the recommended target row group size in Apache Parquet for cloud object storage?', options: ['128MB to 512MB', '4KB', '10GB', '512 bytes'], correctIndex: 0, explanation: '128MB-512MB row groups optimize the trade-off between sequential read throughput and memory buffer overhead.' }]
          }
        ],
        quiz: {
          id: 'sf-08-q1',
          title: 'Storage Formats Quiz',
          passingScorePercent: 70,
          questions: [
            { id: 'qz-1', question: 'How does Apache Iceberg achieve partition evolution without rewriting existing table files?', options: ['By assigning partition specs a numeric spec_id and tracking partition transforms in the metadata tree.', 'By moving files into new folders.', 'By deleting old data.', 'Iceberg does not support partition evolution.'], correctIndex: 0, explanation: 'Iceberg decouples physical folder paths from table partitions, allowing queries to prune across legacy and evolved specs seamlessly.' }
          ]
        }
      }
    ],
    capstone: {
      id: 'SF-08-CAP',
      title: 'Open Table Format Benchmark & Compaction Engine',
      problemStatement: 'Benchmark query performance and mutation throughput across Parquet, Delta Lake, and Apache Iceberg on a 100GB dataset. Author an automated maintenance script that compacts small files and purges stale snapshots.',
      businessScenario: 'A cloud lakehouse suffers from the small file problem: 200,000 tiny 50KB files causing query times to degrade from 3s to 90s.',
      deliverables: ['Compaction automation utility', 'Comprehensive benchmark report (scan times, write amplification, storage cost)', 'Architecture recommendation memo'],
      rubricItems: [
        { id: 'rb-1', criterion: 'Benchmark Rigor & Reproducibility', weightPercent: 50, guidance: 'Clear methodology testing cold/warm cache performance.' },
        { id: 'rb-2', criterion: 'Compaction & Snapshot Pruning Efficacy', weightPercent: 50, guidance: 'Consolidate small files into ~256MB chunks without downtime.' }
      ],
      portfolioOutput: 'Open Table Format evaluation repository with benchmark harness.'
    }
  },
  {
    id: 'SF-09',
    slug: 'modern-transformation-engineering-dbt-core',
    title: 'Modern Transformation Engineering with dbt Core',
    subtitle: 'Modular SQL modeling, DAG structuring, testing, documentation, incremental models, and semantic layers.',
    outcomeStatement: 'Architect production-grade dbt Core projects utilizing incremental models, snapshots, custom generic tests, and CI/CD validation.',
    description: 'Transform raw data into business value using dbt Core. Learn the foundational patterns: staging, intermediate, and marts layers; Jinja templating; macros; packages; snapshotting for SCD Type 2 history; incremental materializations with merge strategies; and automated documentation.',
    level: 'Beginner to Intermediate',
    durationHours: 16,
    status: 'preview',
    featured: true,
    skills: ['dbt Core', 'Incremental Materializations', 'Jinja & Macros', 'dbt Snapshots', 'Generic & Singular Tests', 'Data Lineage'],
    roleTags: ['Analytics Engineer', 'Data Engineer'],
    toolTags: ['dbt Core', 'Snowflake', 'BigQuery', 'PostgreSQL', 'DuckDB'],
    prerequisites: ['ANSI SQL & Relational Database Fundamentals'],
    learningObjectives: [
      'Structure clean, scalable dbt projects following the staging/intermediate/marts directory architecture',
      'Implement resilient incremental models with `is_incremental()` macros and merge strategies',
      'Automate historical tracking of mutating operational records using dbt snapshots'
    ],
    researchSources: [CURRICULUM_RESEARCH_SOURCES.ansi_sql_standards],
    lastReviewed: '2026-03-01',
    diagnostic: {
      id: 'SF-09-DIAG',
      title: 'dbt Core Diagnostic',
      description: 'Evaluate your knowledge of dbt models, refs, and materializations.',
      estimatedMinutes: 8,
      qualifySkipModuleId: 'sf-09-m1',
      questions: [
        {
          id: 'q1',
          question: 'Why must you use `{{ ref(\'model_name\') }}` instead of raw table names in dbt SQL files?',
          options: [
            'Because `ref()` automatically generates the DAG execution order and resolves environment-specific database and schema prefixes.',
            'Because raw table names are illegal in dbt.',
            'To encrypt the SQL queries.',
            'To convert the SQL into Python.'
          ],
          correctIndex: 0,
          explanation: 'The ref() function builds the dependency graph (DAG) enabling parallel execution and ensures models target the correct development or production schema.'
        }
      ]
    },
    modules: [
      {
        id: 'sf-09-m1',
        title: 'Project Architecture & Incremental Modeling',
        description: 'Build staging, intermediate, and mart layers with incremental optimization.',
        estimatedMinutes: 60,
        objectives: ['Implement incremental models with merge predicates'],
        lessons: [
          {
            id: 'sf-09-l1',
            title: 'Configuring Incremental Materializations',
            estimatedMinutes: 20,
            objective: 'Write idempotent incremental logic with unique_key and is_incremental() blocks.',
            conceptBlocks: [{ id: 'cb-1', title: 'Why Incremental?', content: 'Rebuilding multi-billion row tables from scratch every hour is cost-prohibitive. Incremental models transform only new or modified rows since the last run.' }],
            inlineChecks: [{ id: 'ic-1', question: 'What flag triggers a complete rebuild of an incremental model in dbt?', options: ['--full-refresh', '--rebuild-all', '--force', '--clean'], correctIndex: 0, explanation: 'Running dbt run --full-refresh drops the existing table and rebuilds it from scratch.' }]
          }
        ],
        quiz: {
          id: 'sf-09-q1',
          title: 'dbt Core Assessment',
          passingScorePercent: 70,
          questions: [
            { id: 'qz-1', question: 'Which dbt test type verifies that a column combination is globally distinct?', options: ['unique', 'not_null', 'accepted_values', 'relationships'], correctIndex: 0, explanation: 'The unique test asserts that every value or compound key in a column appears exactly once.' }
          ]
        }
      }
    ],
    capstone: {
      id: 'SF-09-CAP',
      title: 'Production SaaS Subscription Analytics Engine with dbt Core',
      problemStatement: 'Construct a complete dbt Core transformation project modeling customer monthly recurring revenue (MRR), churn, and lifetime value across 1M subscription accounts.',
      businessScenario: 'Conflicting revenue reports exist between Stripe billing and Salesforce CRM. Build an authoritative single source of truth.',
      deliverables: ['Full dbt Core repository (staging, intermediate, marts)', 'dbt snapshots for customer plan changes', 'Comprehensive test suite and documentation site'],
      rubricItems: [
        { id: 'rb-1', criterion: 'DAG Architecture & Lineage', weightPercent: 50, guidance: 'Zero circular dependencies; strict separation of source staging from business logic.' },
        { id: 'rb-2', criterion: 'Incremental Strategy & Testing', weightPercent: 50, guidance: '100% test coverage on mart primary keys and zero duplicate MRR.' }
      ],
      portfolioOutput: 'Production dbt Core repository on GitHub with automated CI workflow.'
    }
  },
  {
    id: 'SF-10',
    slug: 'data-warehouse-optimizations-snowflake-bigquery-redshift',
    title: 'Data Warehouse Optimizations (Snowflake, BigQuery & Redshift)',
    subtitle: 'Micro-partitioning, slot allocation, clustering keys, query profiling, and cost governance.',
    outcomeStatement: 'Tune queries and warehouse configurations across Snowflake, BigQuery, and Redshift to slash runtimes and cloud spend.',
    description: 'Cloud data warehouses are powerful but can quickly become financial black holes. Understand the internal architectures of Snowflake (virtual warehouses, micro-partitions, search optimization), BigQuery (slots, capacitor columnar format, partition/cluster pruning), and Redshift (distribution styles, sort keys).',
    level: 'Intermediate to Advanced',
    durationHours: 16,
    status: 'preview',
    featured: false,
    skills: ['Snowflake Micro-partitioning', 'BigQuery Slot Management', 'Clustering & Partitioning', 'Cost Allocation & Budgets', 'Spill to Remote Storage', 'Query Profile Diagnostics'],
    roleTags: ['Data Engineer', 'Analytics Engineer', 'Data Architect'],
    toolTags: ['Snowflake', 'BigQuery', 'AWS Redshift'],
    prerequisites: ['Advanced Analytical SQL'],
    learningObjectives: [
      'Diagnose Snowflake Query Profiles to identify Cartesian joins, memory spilling, and partition pruning failures',
      'Optimize BigQuery costs using partition filters, clustering, and BI Engine reservations',
      'Choose optimal Redshift distribution styles (KEY, EVEN, ALL) to minimize inter-node network shuffles'
    ],
    researchSources: [CURRICULUM_RESEARCH_SOURCES.iit_madras_ds],
    lastReviewed: '2026-03-01',
    diagnostic: {
      id: 'SF-10-DIAG',
      title: 'Warehouse Optimization Diagnostic',
      description: 'Check your intuition on cloud warehouse internals and query cost tuning.',
      estimatedMinutes: 8,
      qualifySkipModuleId: 'sf-10-m1',
      questions: [
        {
          id: 'q1',
          question: 'In Snowflake, what does "Bytes spilled to remote storage" in a Query Profile signify?',
          options: [
            'The query ran out of local SSD cache and spilled to cloud object storage, severely degrading execution speed.',
            'Data was successfully exported to S3.',
            'The warehouse auto-scaled to an XL size.',
            'The network connection was lost.'
          ],
          correctIndex: 0,
          explanation: 'Spilling occurs when warehouse memory and local SSD are exhausted, forcing slow round-trip disk I/O to remote cloud storage.'
        }
      ]
    },
    modules: [
      {
        id: 'sf-10-m1',
        title: 'Snowflake & BigQuery Storage & Compute Mechanics',
        description: 'Micro-partitions, clustering, and slot reservation management.',
        estimatedMinutes: 60,
        objectives: ['Eliminate full-table scan costs via partition pruning'],
        lessons: [
          {
            id: 'sf-10-l1',
            title: 'Clustering Keys & Partition Pruning Deep Dive',
            estimatedMinutes: 20,
            objective: 'Design table clustering strategies matching common query access filters.',
            conceptBlocks: [{ id: 'cb-1', title: 'Why Partitioning Matters', content: 'In BigQuery, on-demand billing charges $6.25 per TB scanned. Scanning 100TB costs $625 per query run. Partition pruning reduces scan volume by 99%.' }],
            inlineChecks: [{ id: 'ic-1', question: 'Which BigQuery table setting prevents queries from running without a partition filter?', options: ['Require partition filter', 'Enforce clustering', 'Max billing bytes', 'Slot reservation'], correctIndex: 0, explanation: 'The "Require partition filter" option rejects queries that would scan the entire table without filtering on the partition date.' }]
          }
        ],
        quiz: {
          id: 'sf-10-q1',
          title: 'Warehouse Optimization Quiz',
          passingScorePercent: 70,
          questions: [
            { id: 'qz-1', question: 'In Amazon Redshift, which distribution style duplicates the entire table across all cluster nodes?', options: ['DISTSTYLE ALL', 'DISTSTYLE KEY', 'DISTSTYLE EVEN', 'DISTSTYLE AUTO'], correctIndex: 0, explanation: 'ALL copies the table to every node, eliminating join shuffles for small lookup dimension tables.' }
          ]
        }
      }
    ],
    capstone: {
      id: 'SF-10-CAP',
      title: 'Enterprise Cloud Warehouse Cost & Performance Remediation Audit',
      problemStatement: 'Analyze query logs from an un-optimized Snowflake or BigQuery deployment with $80,000 monthly cloud spend. Identify top 10 bottleneck queries, implement clustering/partitioning, and reduce cloud costs by >= 40%.',
      businessScenario: 'CFO mandates immediate data warehouse cost reduction before end-of-quarter budget review.',
      deliverables: ['Query Profile audit report', 'Optimized DDL scripts with clustering and partition keys', 'Executive cost reduction summary deck'],
      rubricItems: [
        { id: 'rb-1', criterion: 'Cost Reduction Validation', weightPercent: 50, guidance: 'Demonstrate documented scan reduction >= 40% on historical query benchmarks.' },
        { id: 'rb-2', criterion: 'Query Plan Remediation', weightPercent: 50, guidance: 'Eliminate remote spilling on all top-priority queries.' }
      ],
      portfolioOutput: 'Warehouse Cost Remediation Case Study & SQL Scripts repository.'
    }
  },
  {
    id: 'SF-11',
    slug: 'workflow-orchestration-dag-engineering-apache-airflow',
    title: 'Workflow Orchestration & DAG Engineering with Apache Airflow',
    subtitle: 'Task dependencies, custom operators, dynamic DAG generation, SLAs, idempotency, and backfills.',
    outcomeStatement: 'Design, deploy, and monitor scalable, fault-tolerant orchestration workflows using Apache Airflow 2.8+.',
    description: 'Master data pipeline orchestration with Apache Airflow. Understand the scheduler lifecycle, executor architectures (Celery, Kubernetes), TaskFlow API, custom sensors and operators, dataset-driven scheduling, dynamic DAG generation, backfills, and SLA management.',
    level: 'Intermediate',
    durationHours: 18,
    status: 'preview',
    featured: false,
    skills: ['Apache Airflow 2.8+', 'TaskFlow API', 'Dynamic DAGs', 'Idempotent Backfills', 'Celery & Kubernetes Executors', 'Data Quality Sensors'],
    roleTags: ['Data Engineer', 'Platform Engineer'],
    toolTags: ['Apache Airflow', 'Docker', 'Python', 'PostgreSQL'],
    prerequisites: ['Python Software Engineering', 'Linux, Shell Scripting & Terminal Workflows'],
    learningObjectives: [
      'Author idiomatic, deterministic Airflow DAGs using the TaskFlow API (@dag, @task)',
      'Manage pipeline backfills safely without corrupting historical aggregations',
      'Scale Airflow workers using KubernetesExecutor and CeleryExecutor with Redis'
    ],
    researchSources: [CURRICULUM_RESEARCH_SOURCES.iit_madras_ds],
    lastReviewed: '2026-03-01',
    diagnostic: {
      id: 'SF-11-DIAG',
      title: 'Airflow Orchestration Diagnostic',
      description: 'Evaluate your understanding of DAG scheduling, execution dates, and executors.',
      estimatedMinutes: 8,
      qualifySkipModuleId: 'sf-11-m1',
      questions: [
        {
          id: 'q1',
          question: 'In Apache Airflow, what does `logical_date` (formerly `execution_date`) represent?',
          options: [
            'The beginning of the data interval that the DAG run is processing, NOT the actual wall-clock time the task runs.',
            'The timestamp when the task completes execution.',
            'The server clock time.',
            'The date the DAG was uploaded to Git.'
          ],
          correctIndex: 0,
          explanation: 'The logical date marks the data interval covered by the run (e.g. processing yesterday’s data interval today).'
        }
      ]
    },
    modules: [
      {
        id: 'sf-11-m1',
        title: 'TaskFlow API & DAG Authoring Best Practices',
        description: 'Author maintainable DAGs with proper dependencies and XCom handling.',
        estimatedMinutes: 60,
        objectives: ['Avoid top-level code execution in DAG parsing loops'],
        lessons: [
          {
            id: 'sf-01-l1',
            title: 'Top-Level Code Trap & The Airflow Scheduler',
            estimatedMinutes: 20,
            objective: 'Prevent scheduler overload by moving heavy I/O and database connections inside tasks.',
            conceptBlocks: [{ id: 'cb-1', title: 'The 30-Second Parsing Loop', content: 'Airflow parses DAG files every few seconds. Running API requests or database queries outside of task callables halts the scheduler!' }],
            inlineChecks: [{ id: 'ic-1', question: 'Where should database connections and queries be executed in an Airflow DAG file?', options: ['Strictly inside the task execution body', 'At the top of the file', 'In global variables', 'In the DAG arguments dictionary'], correctIndex: 0, explanation: 'Top-level code runs during every scheduler parse heartbeat; business logic must be isolated within task functions.' }]
          }
        ],
        quiz: {
          id: 'sf-11-q1',
          title: 'Airflow Orchestration Quiz',
          passingScorePercent: 70,
          questions: [
            { id: 'qz-1', question: 'Which Airflow trigger rule causes a task to run only if all upstream tasks have failed?', options: ['all_failed', 'all_success', 'one_failed', 'none_failed'], correctIndex: 0, explanation: 'TriggerRule.ALL_FAILED executes specifically when all immediate upstream parents evaluate to failure.' }
          ]
        }
      }
    ],
    capstone: {
      id: 'SF-11-CAP',
      title: 'Enterprise Multi-Source Financial Reconciliation DAG Suite',
      problemStatement: 'Develop a dynamic Airflow DAG suite that orchestrates ingestion across 20 foreign exchange APIs, runs dbt transformations, validates balances, and triggers automated rollback on SLA failure.',
      businessScenario: 'Late-arriving FX rates cause downstream risk engines to produce inaccurate portfolio valuations.',
      deliverables: ['Production Airflow DAG repo with Docker Compose setup', 'Custom sensor waiting for external ledger lock files', 'Automated backfill execution plan and runbook'],
      rubricItems: [
        { id: 'rb-1', criterion: 'Idempotency & Re-run Safety', weightPercent: 50, guidance: 'Zero duplicate entries when re-running past logical dates.' },
        { id: 'rb-2', criterion: 'Dynamic Task Mapping & Modularity', weightPercent: 50, guidance: 'Use expand() / dynamic task mapping for API endpoints.' }
      ],
      portfolioOutput: 'Complete Apache Airflow Orchestration project repository with unit tests.'
    }
  },
  {
    id: 'SF-12',
    slug: 'data-quality-testing-great-expectations',
    title: 'Data Quality, Testing & Great Expectations',
    subtitle: 'Automated data assertions, expectation suites, schema validation, drift detection, and data contracts.',
    outcomeStatement: 'Establish automated data testing gates that detect and block corrupt data before it reaches analytics or production ML models.',
    description: 'Prevent silent data corruption. Master automated data quality testing using Great Expectations, Soda Core, and custom SQL assertions. Learn how to write expectation suites (uniqueness, ranges, regex, categorical values), build automated HTML data docs, and enforce runtime data contracts.',
    level: 'Intermediate',
    durationHours: 14,
    status: 'preview',
    featured: false,
    skills: ['Great Expectations', 'Soda Core', 'Data Contracts', 'Schema Drift Detection', 'Automated Quality Gates', 'Data Profiling'],
    roleTags: ['Data Engineer', 'Analytics Engineer', 'DataOps Engineer'],
    toolTags: ['Great Expectations', 'Python', 'SQL', 'Docker'],
    prerequisites: ['Python Software Engineering', 'Relational Database Fundamentals'],
    learningObjectives: [
      'Author comprehensive Expectation Suites validating business invariants',
      'Integrate automated quality checkpoints into Airflow DAGs and dbt pipelines',
      'Generate automated living data quality documentation (Data Docs)'
    ],
    researchSources: [CURRICULUM_RESEARCH_SOURCES.iit_madras_ds],
    lastReviewed: '2026-03-01',
    diagnostic: {
      id: 'SF-12-DIAG',
      title: 'Data Quality Diagnostic',
      description: 'Test your understanding of data quality dimensions and expectation suites.',
      estimatedMinutes: 8,
      qualifySkipModuleId: 'sf-12-m1',
      questions: [
        {
          id: 'q1',
          question: 'What are the core dimensions of data quality measured in enterprise engineering?',
          options: [
            'Completeness, Accuracy, Validity, Consistency, Timeliness, and Uniqueness.',
            'Speed, Storage, RAM, CPU, Bandwidth.',
            'Lines of code, test coverage, PR count.',
            'Font size, layout, color scheme.'
          ],
          correctIndex: 0,
          explanation: 'The six canonical dimensions assess whether data is complete, valid, accurate, consistent, timely, and unique.'
        }
      ]
    },
    modules: [
      {
        id: 'sf-12-m1',
        title: 'Expectation Suites & Automated Validation Checkpoints',
        description: 'Build automated assertions for relational tables and Parquet files.',
        estimatedMinutes: 60,
        objectives: ['Validate incoming data batches using Great Expectations Checkpoints'],
        lessons: [
          {
            id: 'sf-12-l1',
            title: 'Configuring Data Contexts and Expectation Suites',
            estimatedMinutes: 20,
            objective: 'Build declarative assertions on tabular datasets.',
            conceptBlocks: [{ id: 'cb-1', title: 'Declarative Data Testing', content: 'Rather than writing brittle ad-hoc scripts, Great Expectations provides a standardized vocabulary of expectations.' }],
            inlineChecks: [{ id: 'ic-1', question: 'Which expectation asserts that a column must have unique non-null values?', options: ['expect_column_values_to_be_unique', 'expect_column_to_exist', 'expect_table_row_count_to_equal', 'expect_column_values_to_be_between'], correctIndex: 0, explanation: 'expect_column_values_to_be_unique tests uniqueness across all non-null values.' }]
          }
        ],
        quiz: {
          id: 'sf-12-q1',
          title: 'Data Quality Quiz',
          passingScorePercent: 70,
          questions: [
            { id: 'qz-1', question: 'What is a Data Contract in modern data engineering?', options: ['A formal agreement between data producers and data consumers specifying schema, semantics, SLAs, and quality invariants.', 'A legal employment document.', 'A license key for a cloud database.', 'A billing invoice from AWS.'], correctIndex: 0, explanation: 'Data contracts define schemas and quality constraints enforced at the producer boundary before data enters downstream systems.' }
          ]
        }
      }
    ],
    capstone: {
      id: 'SF-12-CAP',
      title: 'Automated CI Data Quality Gate & Drift Surveillance System',
      problemStatement: 'Implement an automated data validation harness that profiles incoming CSV/Parquet files, executes an Expectation Suite of 25+ business rules, flags statistical drift in order values, and blocks bad data from entering the Lakehouse.',
      businessScenario: 'Corrupted currency codes from a mobile app update broke executive revenue reporting for three days.',
      deliverables: ['Great Expectations checkpoint configuration', 'Automated Slack alert notification webhook on failure', 'Published HTML Data Docs portal'],
      rubricItems: [
        { id: 'rb-1', criterion: 'Assertion Rigor & Coverage', weightPercent: 50, guidance: 'Checks cover nulls, regex formats, foreign keys, and statistical distributions.' },
        { id: 'rb-2', criterion: 'Pipeline Integration & Gatekeeper Enforcement', weightPercent: 50, guidance: 'Pipeline terminates with exit code 1 when critical expectations fail.' }
      ],
      portfolioOutput: 'Data Quality Testing Framework repository with sample test fixtures.'
    }
  },
  {
    id: 'SF-13',
    slug: 'ci-cd-containerization-docker-dataops-automation',
    title: 'CI/CD, Containerization with Docker & DataOps Automation',
    subtitle: 'Multi-stage Docker builds, GitHub Actions workflows, ephemeral test environments, and automated linting.',
    outcomeStatement: 'Containerize complex data workloads and automate testing, linting, and deployment using production CI/CD pipelines.',
    description: 'Bridge the gap between data engineering and modern software engineering operations. Master multi-stage Docker builds for Python and Spark, Docker Compose for local development stacks, GitHub Actions CI workflows, automated linting (SQLFluff, Ruff), and automated testing against ephemeral test containers.',
    level: 'Intermediate',
    durationHours: 15,
    status: 'preview',
    featured: false,
    skills: ['Docker Multi-Stage Builds', 'GitHub Actions CI/CD', 'SQLFluff & Ruff', 'Docker Compose', 'Ephemeral Test Fixtures', 'DataOps'],
    roleTags: ['DataOps Engineer', 'Data Engineer', 'DevOps'],
    toolTags: ['Docker', 'GitHub Actions', 'SQLFluff', 'Ruff', 'Python'],
    prerequisites: ['Linux, Shell Scripting & Terminal Workflows', 'Python Software Engineering'],
    learningObjectives: [
      'Write optimized, secure multi-stage Dockerfiles for Python data applications with minimal image footprint',
      'Construct GitHub Actions CI workflows that run linters, type checks, and integration tests on pull requests',
      'Orchestrate local multi-container development environments (Postgres, Airflow, MinIO) with Docker Compose'
    ],
    researchSources: [CURRICULUM_RESEARCH_SOURCES.iit_bombay_cse],
    lastReviewed: '2026-03-01',
    diagnostic: {
      id: 'SF-13-DIAG',
      title: 'Docker & CI/CD Diagnostic',
      description: 'Evaluate your containerization and CI automation skills.',
      estimatedMinutes: 8,
      qualifySkipModuleId: 'sf-13-m1',
      questions: [
        {
          id: 'q1',
          question: 'Why are multi-stage Docker builds recommended for Python and data engineering containers?',
          options: [
            'They separate the build environment (compilers, build tools) from the slim runtime container, drastically reducing image size and attack surface.',
            'They make Docker containers boot faster than native code.',
            'They allow running Windows and Linux in the same container.',
            'They eliminate the need for pip install.'
          ],
          correctIndex: 0,
          explanation: 'Multi-stage builds leave compiler toolchains (gcc, make) in the builder stage, copying only compiled wheels into the production image.'
        }
      ]
    },
    modules: [
      {
        id: 'sf-13-m1',
        title: 'Multi-Stage Docker Architecture for Data Workloads',
        description: 'Package Python dependencies and drivers cleanly into production containers.',
        estimatedMinutes: 60,
        objectives: ['Build minimal Docker images using Alpine/Debian slim bases'],
        lessons: [
          {
            id: 'sf-13-l1',
            title: 'Layer Caching & Dependency Optimization',
            estimatedMinutes: 20,
            objective: 'Order Dockerfile instructions to leverage Docker layer caching during builds.',
            conceptBlocks: [{ id: 'cb-1', title: 'Layer Invalidation Rules', content: 'Copy pyproject.toml or requirements.txt and install packages before copying source code. This avoids re-downloading packages on every code edit!' }],
            inlineChecks: [{ id: 'ic-1', question: 'Which instruction should appear earliest in a Dockerfile to maximize cache hits?', options: ['COPY requirements.txt .', 'COPY src/ .', 'CMD ["python", "main.py"]', 'ENV DEBUG=true'], correctIndex: 0, explanation: 'Copying dependencies first ensures the pip install step is cached unless requirements change.' }]
          }
        ],
        quiz: {
          id: 'sf-13-q1',
          title: 'Docker & CI/CD Quiz',
          passingScorePercent: 70,
          questions: [
            { id: 'qz-1', question: 'Which tool automatically formats and lints SQL queries in CI pipelines according to style guides?', options: ['SQLFluff', 'Black', 'Ruff', 'Pytest'], correctIndex: 0, explanation: 'SQLFluff is the industry-standard dialect-aware linter and auto-formatter for SQL.' }
          ]
        }
      }
    ],
    capstone: {
      id: 'SF-13-CAP',
      title: 'Automated Continuous Deployment Pipeline for Data Pipelines',
      problemStatement: 'Build a comprehensive GitHub Actions CI/CD pipeline for a data engineering repository that validates PR code with Ruff, lint checks SQL with SQLFluff, spins up ephemeral Postgres with Docker Compose, executes integration tests, and publishes a versioned Docker image.',
      businessScenario: 'Engineers are deploying untested SQL migrations directly to production databases, causing recurring downtime.',
      deliverables: ['GitHub Actions workflow YAML files', 'Multi-stage Dockerfile', 'Docker Compose integration test harness'],
      rubricItems: [
        { id: 'rb-1', criterion: 'Pipeline Execution Speed & Caching', weightPercent: 50, guidance: 'Total CI run completes under 3 minutes with proper caching.' },
        { id: 'rb-2', criterion: 'Security & Quality Gate Rigor', weightPercent: 50, guidance: 'Zero root execution in containers; all tests pass before merge.' }
      ],
      portfolioOutput: 'Production DataOps CI/CD Starter Template repository on GitHub.'
    }
  },
  {
    id: 'SF-14',
    slug: 'infrastructure-as-code-terraform-data-platforms',
    title: 'Infrastructure as Code (Terraform) for Data Platforms',
    subtitle: 'Declarative cloud provisioning, state management, S3/ADLS buckets, IAM roles, and warehouse resources.',
    outcomeStatement: 'Provision, manage, and tear down secure, reproducible cloud data infrastructure using Terraform modules.',
    description: 'Manual cloud console clicking does not scale. Learn Infrastructure as Code (IaC) using Terraform for data engineering. Provision object storage buckets, configure IAM least-privilege service roles, spin up Snowflake/BigQuery datasets, configure network security groups, and manage remote state locking with DynamoDB and S3.',
    level: 'Intermediate',
    durationHours: 15,
    status: 'preview',
    featured: false,
    skills: ['Terraform (HCL)', 'State Locking & Backends', 'Cloud Storage Provisioning', 'IAM Least Privilege', 'Terraform Modules', 'Security & Encryption'],
    roleTags: ['Data Platform Engineer', 'Data Engineer', 'DevOps'],
    toolTags: ['Terraform', 'AWS', 'GCP', 'Azure', 'Git'],
    prerequisites: ['Linux, Shell Scripting & Terminal Workflows'],
    learningObjectives: [
      'Write modular, reusable Terraform HCL configurations for cloud data architectures',
      'Manage remote state backends safely with state locking to prevent concurrent overwrite collisions',
      'Implement least-privilege IAM policies for pipeline service accounts and ingestion runners'
    ],
    researchSources: [CURRICULUM_RESEARCH_SOURCES.nitk_surathkal_de],
    lastReviewed: '2026-03-01',
    diagnostic: {
      id: 'SF-14-DIAG',
      title: 'Terraform IaC Diagnostic',
      description: 'Check your knowledge of Terraform declarative state, drift, and modules.',
      estimatedMinutes: 8,
      qualifySkipModuleId: 'sf-14-m1',
      questions: [
        {
          id: 'q1',
          question: 'What is the function of the Terraform state file (`terraform.tfstate`)?',
          options: [
            'It maps the declared resources in your code to the actual physical cloud resources provisioned in the cloud provider, tracking metadata and dependencies.',
            'It contains user login passwords.',
            'It compiles HCL into Python bytecode.',
            'It runs the cloud application.'
          ],
          correctIndex: 0,
          explanation: 'The state file tracks real-world resource IDs and attributes, allowing Terraform to determine what changes (additions, updates, destroys) are needed.'
        }
      ]
    },
    modules: [
      {
        id: 'sf-14-m1',
        title: 'Terraform Architecture, Providers & State Management',
        description: 'Initialize providers, inspect execution plans, and manage remote state.',
        estimatedMinutes: 60,
        objectives: ['Execute terraform plan and terraform apply safely'],
        lessons: [
          {
            id: 'sf-14-l1',
            title: 'Execution Plans & The Immutable Infrastructure Lifecycle',
            estimatedMinutes: 20,
            objective: 'Inspect execution diffs before applying changes to cloud infrastructure.',
            conceptBlocks: [{ id: 'cb-1', title: 'Plan Before Apply', content: 'Always run terraform plan to inspect exact changes before applying, guarding against unintended destruction of production storage buckets.' }],
            inlineChecks: [{ id: 'ic-1', question: 'Which command reconciles Terraform state with real-world infrastructure drift?', options: ['terraform refresh', 'terraform destroy', 'terraform init', 'terraform fmt'], correctIndex: 0, explanation: 'terraform refresh updates the state file to match the current real-world state of managed resources.' }]
          }
        ],
        quiz: {
          id: 'sf-14-q1',
          title: 'Terraform IaC Quiz',
          passingScorePercent: 70,
          questions: [
            { id: 'qz-1', question: 'What Terraform lifecycle rule prevents accidental deletion of critical production storage buckets?', options: ['prevent_destroy = true', 'ignore_changes = all', 'create_before_destroy = true', 'auto_approve = false'], correctIndex: 0, explanation: 'lifecycle { prevent_destroy = true } blocks terraform destroy or resource replacement that would delete the bucket.' }
          ]
        }
      }
    ],
    capstone: {
      id: 'SF-14-CAP',
      title: 'Complete Cloud Lakehouse Infrastructure Blueprint with Terraform',
      problemStatement: 'Author a production Terraform module suite that provisions an enterprise Lakehouse foundation: raw/curated cloud storage buckets with encryption at rest, lifecycle tiering policies, IAM ingestion roles, and warehouse service accounts.',
      businessScenario: 'Security audit flagged unencrypted cloud buckets and over-permissive administrator keys used in production ETL pipelines.',
      deliverables: ['Modular Terraform configuration (storage, IAM, warehouse)', 'Terraform plan output and validation tests', 'Architecture security compliance documentation'],
      rubricItems: [
        { id: 'rb-1', criterion: 'Least-Privilege Security & Encryption', weightPercent: 50, guidance: 'Zero wildcards in IAM policies; mandatory KMS encryption and SSL-only bucket access.' },
        { id: 'rb-2', criterion: 'Modularity & Variable Parametrization', weightPercent: 50, guidance: 'Clean separation of environments (dev, staging, prod) via variables/workspaces.' }
      ],
      portfolioOutput: 'Terraform Lakehouse Infrastructure Starter Module on GitHub.'
    }
  },
  {
    id: 'SF-16',
    slug: 'pyspark-performance-tuning-shuffling-memory-optimization',
    title: 'PySpark Performance Tuning, Shuffling & Memory Optimization',
    subtitle: 'Garbage collection, executor memory tuning, broadcast thresholds, skew handling, and adaptive query execution.',
    outcomeStatement: 'Diagnose and resolve OutOfMemory errors, data skew, and shuffle bottlenecks in large-scale PySpark production clusters.',
    description: 'Move beyond introductory Spark to advanced cluster tuning. Learn how the JVM manages storage vs execution memory, diagnose executor Garbage Collection (GC) pauses, configure Adaptive Query Execution (AQE), eliminate data skew using salting techniques, and tune shuffle partitions.',
    level: 'Advanced',
    durationHours: 20,
    status: 'preview',
    featured: false,
    skills: ['Spark Memory Model', 'Data Skew & Salting', 'Shuffle Spill Elimination', 'Adaptive Query Execution (AQE)', 'Dynamic Partition Pruning', 'Garbage Collection Tuning'],
    roleTags: ['Senior Data Engineer', 'Platform Engineer', 'Data Architect'],
    toolTags: ['PySpark', 'Apache Spark', 'Databricks', 'Spark UI'],
    prerequisites: ['Distributed Processing with Apache Spark & PySpark'],
    learningObjectives: [
      'Deconstruct the Spark executor memory layout: Reserved, User, Storage, and Execution memory pools',
      'Identify and remediate data skew using key salting and broadcast join hints',
      'Tune Adaptive Query Execution (AQE) parameters to dynamically coalesce shuffle partitions and optimize skew joins'
    ],
    researchSources: [CURRICULUM_RESEARCH_SOURCES.iit_bombay_cse, CURRICULUM_RESEARCH_SOURCES.nitk_surathkal_de],
    lastReviewed: '2026-03-01',
    diagnostic: {
      id: 'SF-16-DIAG',
      title: 'Spark Performance Tuning Diagnostic',
      description: 'Assess your ability to troubleshoot Spark OOM errors and stage stragglers.',
      estimatedMinutes: 8,
      qualifySkipModuleId: 'sf-16-m1',
      questions: [
        {
          id: 'q1',
          question: 'In the Spark UI, what symptom indicates that a task is suffering from severe Data Skew?',
          options: [
            '99 out of 100 tasks in a stage complete in 2 seconds, but the last 1 task takes 45 minutes to finish.',
            'All tasks fail simultaneously with syntax errors.',
            'The driver node reboots.',
            'The Spark UI becomes unresponsive.'
          ],
          correctIndex: 0,
          explanation: 'Data skew concentrates disproportionate data on a single partition key, causing one executor task to process 100x more data than its peers.'
        }
      ]
    },
    modules: [
      {
        id: 'sf-16-m1',
        title: 'Spark Executor Memory Layout & JVM Mechanics',
        description: 'Configure spark.executor.memory, overhead, and off-heap memory.',
        estimatedMinutes: 60,
        objectives: ['Prevent container memory limit kills (YARN / K8s exit code 137)'],
        lessons: [
          {
            id: 'sf-16-l1',
            title: 'Storage Memory vs Execution Memory Dynamics',
            estimatedMinutes: 20,
            objective: 'Understand how Spark dynamically borrows memory between cache storage and join shuffles.',
            conceptBlocks: [{ id: 'cb-1', title: 'The Unified Memory Manager', content: 'Spark allocates 60% of available executor memory to unified storage/execution. Execution (shuffles/sorts) can evict storage blocks if memory pressure spikes.' }],
            inlineChecks: [{ id: 'ic-1', question: 'What causes container exit code 137 in Kubernetes/YARN Spark jobs?', options: ['Out of Memory (OOM) Killer terminated the container for exceeding assigned memory limits.', 'Code syntax error.', 'Network timeout.', 'Disk is full.'], correctIndex: 0, explanation: 'Exit code 137 signifies SIGKILL sent by the OS/orchestrator because memory exceeded limit boundaries.' }]
          }
        ],
        quiz: {
          id: 'sf-16-q1',
          title: 'Spark Tuning Quiz',
          passingScorePercent: 70,
          questions: [
            { id: 'qz-1', question: 'Which optimization technique adds random integers to join keys to distribute skewed records across multiple worker partitions?', options: ['Salting', 'Broadcast join', 'Bucketing', 'Coalesce'], correctIndex: 0, explanation: 'Salting appends a random prefix or suffix to split hot partition keys across multiple target reducers.' }
          ]
        }
      }
    ],
    capstone: {
      id: 'SF-16-CAP',
      title: 'Production Spark Skew Remediation & Cluster Cost Optimization',
      problemStatement: 'You are handed an existing PySpark batch pipeline processing 2TB of daily clickstream events that frequently crashes with OutOfMemory errors and takes 4.5 hours to run. Identify root causes using Spark UI logs, apply salting, tune memory configurations, and reduce runtime to under 45 minutes.',
      businessScenario: 'Nightly batch runs are spilling past business morning SLAs, delaying executive dashboards by several hours.',
      deliverables: ['Refactored PySpark script with salting and AQE tuning', 'Spark event log comparison analysis', 'Cluster configuration sizing guide'],
      rubricItems: [
        { id: 'rb-1', criterion: 'Runtime & Spill Reduction', weightPercent: 50, guidance: 'Zero memory/disk spill; achieve >= 4x runtime reduction.' },
        { id: 'rb-2', criterion: 'Skew Elimination Proof', weightPercent: 50, guidance: 'Spark UI task execution distribution is uniform across all tasks in the stage.' }
      ],
      portfolioOutput: 'Spark Performance Benchmark & Skew Remediation Case Study on GitHub.'
    }
  },
  {
    id: 'SF-17',
    slug: 'real-time-streaming-apache-kafka-spark-structured-streaming',
    title: 'Real-Time Streaming with Apache Kafka & Spark Structured Streaming',
    subtitle: 'Topic partitioning, consumer groups, exactly-once semantics, event-time watermarking, and sliding windows.',
    outcomeStatement: 'Architect, deploy, and maintain sub-second event streaming applications capable of processing millions of events per minute.',
    description: 'Master enterprise real-time streaming architectures. Understand Kafka internals: log segments, offset management, consumer group rebalancing, leader/follower replication, and ISRs. Build stateful streaming pipelines using Spark Structured Streaming, configure event-time watermarking, and handle late-arriving data.',
    level: 'Intermediate to Advanced',
    durationHours: 22,
    status: 'preview',
    featured: true,
    skills: ['Apache Kafka', 'Spark Structured Streaming', 'Event-Time Watermarks', 'Stateful Window Aggregations', 'Schema Registry', 'Consumer Group Rebalancing'],
    roleTags: ['Streaming Data Engineer', 'Real-Time Systems Engineer', 'Data Architect'],
    toolTags: ['Kafka', 'PySpark', 'Docker', 'Schema Registry'],
    prerequisites: ['Distributed Processing with Apache Spark & PySpark', 'Python Software Engineering'],
    learningObjectives: [
      'Configure resilient Apache Kafka topic partitions, replication factors, and consumer group offset management',
      'Implement stateful sliding window aggregations in Spark Structured Streaming with watermarking',
      'Ensure exactly-once processing semantics from Kafka source to idempotent database sinks'
    ],
    researchSources: [CURRICULUM_RESEARCH_SOURCES.iit_bombay_cse, CURRICULUM_RESEARCH_SOURCES.nitk_surathkal_de],
    lastReviewed: '2026-03-01',
    diagnostic: {
      id: 'SF-17-DIAG',
      title: 'Kafka & Streaming Diagnostic',
      description: 'Evaluate your knowledge of consumer offsets, partitions, and streaming watermarks.',
      estimatedMinutes: 8,
      qualifySkipModuleId: 'sf-17-m1',
      questions: [
        {
          id: 'q1',
          question: 'In Spark Structured Streaming, what is the purpose of an Event-Time Watermark?',
          options: [
            'It establishes a threshold for how late data can arrive before being discarded, allowing the engine to safely purge old state from memory.',
            'It marks the beginning of the video stream.',
            'It encrypts messages with a digital watermark.',
            'It controls the Kafka producer rate.'
          ],
          correctIndex: 0,
          explanation: 'Watermarks bound how far behind current event time late records can lag. Once event time passes the watermark, older state store keys are purged to prevent unbounded memory growth.'
        }
      ]
    },
    modules: [
      {
        id: 'sf-17-m1',
        title: 'Kafka Topic Topology & Partition Mechanics',
        description: 'Understand broker partitions, high watermarks, and consumer rebalancing.',
        estimatedMinutes: 60,
        objectives: ['Calculate optimal partition counts for consumer parallelization'],
        lessons: [
          {
            id: 'sf-17-l1',
            title: 'Partition Keys & Order Guarantees',
            estimatedMinutes: 20,
            objective: 'Ensure strict message ordering per entity using deterministic partition keys.',
            conceptBlocks: [{ id: 'cb-1', title: 'Ordering in Kafka', content: 'Kafka guarantees strict message ordering only within a single partition, NEVER across multiple partitions. Use entity keys (e.g. user_id) to direct related events to the same partition!' }],
            inlineChecks: [{ id: 'ic-1', question: 'If a Kafka topic has 6 partitions, what is the maximum number of consumers in a single consumer group that can actively read in parallel?', options: ['6', '12', '1', 'Unlimited'], correctIndex: 0, explanation: 'Each partition can be consumed by at most one consumer instance within a consumer group at any given time.' }]
          }
        ],
        quiz: {
          id: 'sf-17-q1',
          title: 'Kafka & Streaming Quiz',
          passingScorePercent: 70,
          questions: [
            { id: 'qz-1', question: 'Which Kafka producer configuration guarantees that all in-sync replicas acknowledge a write before returning success?', options: ['acks=all (or acks=-1)', 'acks=1', 'acks=0', 'retries=0'], correctIndex: 0, explanation: 'acks=all ensures the partition leader waits for the full in-sync replica (ISR) set to commit the message.' }
          ]
        }
      }
    ],
    capstone: {
      id: 'SF-17-CAP',
      title: 'High-Volume Financial Tick Stream Aggregator & Anomaly Detector',
      problemStatement: 'Construct an end-to-end streaming pipeline that ingests simulated cryptocurrency trade events from Kafka, computes 1-minute and 5-minute VWAP (Volume-Weighted Average Price) with 10-second sliding strides, detects price manipulation spikes, and sinks alerts to Delta Lake.',
      businessScenario: 'Trading desks require immediate anomaly detection to prevent catastrophic flash crash trading algorithms.',
      deliverables: ['Kafka event producer with realistic volatility generator', 'Spark Structured Streaming job with RocksDB state store', 'Comprehensive failure-injection test demonstrating recovery from killed workers'],
      rubricItems: [
        { id: 'rb-1', criterion: 'Watermark & State Store Correctness', weightPercent: 50, guidance: 'Correct watermark configuration preventing infinite state memory expansion.' },
        { id: 'rb-2', criterion: 'End-to-End Latency & Recovery', weightPercent: 50, guidance: 'Sub-second processing latency and verified recovery from checkpoint directory.' }
      ],
      portfolioOutput: 'Real-Time Streaming Architecture repo with Docker Compose cluster and metrics dashboard.'
    }
  },
  {
    id: 'SF-19',
    slug: 'cloud-data-platforms-aws-glue-athena-redshift-emr',
    title: 'Cloud Data Platforms: AWS (Glue, Athena, Redshift, EMR)',
    subtitle: 'Serverless ETL with AWS Glue, S3 data lakes, ad-hoc querying with Athena, and managed clusters on EMR.',
    outcomeStatement: 'Architect and deploy enterprise data platforms natively on Amazon Web Services using serverless and managed components.',
    description: 'Master the AWS cloud data ecosystem. Learn AWS Glue (Data Catalog, crawlers, serverless Spark jobs), querying S3 data lakes with Amazon Athena, running massive workloads on Amazon EMR, configuring Redshift Serverless, and orchestrating pipelines with AWS Step Functions and EventBridge.',
    level: 'Intermediate',
    durationHours: 18,
    status: 'preview',
    featured: false,
    skills: ['AWS Glue', 'Amazon Athena', 'Amazon EMR', 'Redshift Serverless', 'S3 Data Lake Architecture', 'AWS Step Functions'],
    roleTags: ['AWS Data Engineer', 'Cloud Data Architect', 'Data Engineer'],
    toolTags: ['AWS Glue', 'Athena', 'Redshift', 'EMR', 'S3'],
    prerequisites: ['Relational Database Fundamentals', 'Distributed Processing with Apache Spark & PySpark'],
    learningObjectives: [
      'Configure AWS Glue Data Catalog and automated crawlers for metadata discovery',
      'Optimize Athena queries over S3 partitioned Parquet data to minimize per-query scan charges',
      'Deploy and autoscale managed Spark workloads on Amazon EMR with spot instances'
    ],
    researchSources: [CURRICULUM_RESEARCH_SOURCES.nitk_surathkal_de],
    lastReviewed: '2026-03-01',
    diagnostic: {
      id: 'SF-19-DIAG',
      title: 'AWS Cloud Data Diagnostic',
      description: 'Check your knowledge of AWS data services and cost optimization.',
      estimatedMinutes: 8,
      qualifySkipModuleId: 'sf-19-m1',
      questions: [
        {
          id: 'q1',
          question: 'How is Amazon Athena billed for standard ad-hoc SQL queries?',
          options: [
            'By the number of bytes scanned from Amazon S3 ($5.00 per TB scanned).',
            'By the number of hours the query engine is online.',
            'By the number of rows returned.',
            'A flat monthly fee.'
          ],
          correctIndex: 0,
          explanation: 'Athena is serverless and bills strictly based on the compressed volume of data scanned from S3, making partition pruning essential.'
        }
      ]
    },
    modules: [
      {
        id: 'sf-19-m1',
        title: 'S3 Data Lake Architecture & Glue Catalog',
        description: 'Organize S3 prefixes, Glue crawlers, and Hive partition structures.',
        estimatedMinutes: 60,
        objectives: ['Structure S3 storage for optimal Athena scan efficiency'],
        lessons: [
          {
            id: 'sf-19-l1',
            title: 'S3 Key Naming & Prefix Partitioning',
            estimatedMinutes: 20,
            objective: 'Leverage Hive-style partitioning (year=YYYY/month=MM) for automated Glue catalog discovery.',
            conceptBlocks: [{ id: 'cb-1', title: 'Hive Partition Conventions', content: 'Naming prefixes key=value allows query engines like Athena and Spark to infer partition columns without parsing file contents.' }],
            inlineChecks: [{ id: 'ic-1', question: 'Which AWS service orchestrates multi-step ETL workflows with native error handling and retries?', options: ['AWS Step Functions', 'AWS Lambda', 'Amazon SNS', 'Amazon Route 53'], correctIndex: 0, explanation: 'AWS Step Functions provides visual state machines for orchestrating Glue, EMR, and Lambda tasks.' }]
          }
        ],
        quiz: {
          id: 'sf-19-q1',
          title: 'AWS Cloud Data Quiz',
          passingScorePercent: 70,
          questions: [
            { id: 'qz-1', question: 'Which EMR feature dynamically adds or removes core and task nodes based on application load metrics?', options: ['EMR Managed Scaling', 'EMR Studio', 'Glue Triggers', 'CloudWatch Alarms'], correctIndex: 0, explanation: 'EMR Managed Scaling automatically scales clusters up or down based on workload metrics to optimize costs.' }
          ]
        }
      }
    ],
    capstone: {
      id: 'SF-19-CAP',
      title: 'Serverless AWS Lakehouse Pipeline with Glue, Athena & Step Functions',
      problemStatement: 'Build a 100% serverless data pipeline on AWS that ingests raw telemetry files dropped into S3, triggers an AWS Glue PySpark job to clean and partition into Parquet, updates the Glue Data Catalog, and provisions Athena analytical views with Step Functions orchestration.',
      businessScenario: 'A startup cannot afford 24/7 dedicated cluster costs and requires a fully serverless, pay-per-execution data pipeline.',
      deliverables: ['AWS CloudFormation / Terraform templates', 'AWS Glue PySpark transformation script', 'Step Functions state machine definition JSON'],
      rubricItems: [
        { id: 'rb-1', criterion: 'Serverless Cost Architecture', weightPercent: 50, guidance: 'Zero fixed standing hourly costs when no pipeline runs are active.' },
        { id: 'rb-2', criterion: 'Athena Query Optimization', weightPercent: 50, guidance: 'Athena queries demonstrate partition pruning reducing scanned data by >= 90%.' }
      ],
      portfolioOutput: 'Serverless AWS Data Lakehouse template repository with automated deployment scripts.'
    }
  },
  {
    id: 'SF-20',
    slug: 'cloud-data-platforms-azure-adls-data-factory-synapse-databricks',
    title: 'Cloud Data Platforms: Azure (ADLS, Data Factory, Synapse, Databricks)',
    subtitle: 'Azure Data Lake Storage Gen2, Azure Data Factory (ADF), Synapse Analytics, and managed Databricks on Azure.',
    outcomeStatement: 'Design and deploy modern enterprise data solutions on Microsoft Azure utilizing ADF, ADLS Gen2, and Azure Databricks.',
    description: 'Master the Microsoft Azure data ecosystem. Learn Azure Data Lake Storage Gen2 (hierarchical namespaces, ACLs), Azure Data Factory (copy activities, mapping data flows, pipeline parameters), Azure Synapse serverless SQL pools, and Azure Databricks integration with Microsoft Entra ID.',
    level: 'Intermediate',
    durationHours: 18,
    status: 'preview',
    featured: false,
    skills: ['Azure Data Factory (ADF)', 'ADLS Gen2 Hierarchical Namespaces', 'Azure Synapse Analytics', 'Azure Databricks', 'Managed Identities & Entra ID', 'Azure Key Vault'],
    roleTags: ['Azure Data Engineer', 'Cloud Data Architect', 'Data Engineer'],
    toolTags: ['Azure Data Factory', 'ADLS Gen2', 'Azure Synapse', 'Azure Databricks'],
    prerequisites: ['Relational Database Fundamentals', 'Python Software Engineering'],
    learningObjectives: [
      'Design security models on ADLS Gen2 with POSIX access control lists and Managed Identities',
      'Author scalable, parametrized ingestion pipelines in Azure Data Factory with tumbling window triggers',
      'Query Parquet/Delta lake files directly using Azure Synapse Serverless SQL pools'
    ],
    researchSources: [CURRICULUM_RESEARCH_SOURCES.nitk_surathkal_de],
    lastReviewed: '2026-03-01',
    diagnostic: {
      id: 'SF-20-DIAG',
      title: 'Azure Cloud Data Diagnostic',
      description: 'Check your knowledge of Azure storage, ADF pipelines, and security.',
      estimatedMinutes: 8,
      qualifySkipModuleId: 'sf-20-m1',
      questions: [
        {
          id: 'q1',
          question: 'What distinguishes Azure Data Lake Storage (ADLS) Gen2 from standard Azure Blob Storage?',
          options: [
            'Hierarchical Namespace (HNS), which organizes files into a true directory hierarchy enabling atomic directory renames and POSIX ACLs.',
            'ADLS Gen2 only stores images.',
            'ADLS Gen2 runs inside SQL Server.',
            'ADLS Gen2 does not support encryption.'
          ],
          correctIndex: 0,
          explanation: 'Hierarchical namespace enables true directory operations (rename, delete) without iterating through millions of objects individually.'
        }
      ]
    },
    modules: [
      {
        id: 'sf-20-m1',
        title: 'ADLS Gen2 Security & Azure Data Factory Pipelines',
        description: 'Configure hierarchical storage, Managed Identities, and ADF copy pipelines.',
        estimatedMinutes: 60,
        objectives: ['Build secure credential-less pipelines using Azure Managed Identities'],
        lessons: [
          {
            id: 'sf-20-l1',
            title: 'Managed Identities & Secure Keyless Connections',
            estimatedMinutes: 20,
            objective: 'Eliminate hardcoded connection strings using Azure Managed Identities and Azure Key Vault.',
            conceptBlocks: [{ id: 'cb-1', title: 'Why Managed Identities?', content: 'Azure Managed Identities allow ADF and Databricks to authenticate against ADLS Gen2 using Entra ID tokens without storing credentials in code.' }],
            inlineChecks: [{ id: 'ic-1', question: 'Which ADF trigger type is specifically designed for processing historical chronological data slices without gaps?', options: ['Tumbling Window Trigger', 'Schedule Trigger', 'Storage Event Trigger', 'Manual Run'], correctIndex: 0, explanation: 'Tumbling window triggers process non-overlapping contiguous time intervals and support automated retries and backfills.' }]
          }
        ],
        quiz: {
          id: 'sf-20-q1',
          title: 'Azure Cloud Data Quiz',
          passingScorePercent: 70,
          questions: [
            { id: 'qz-1', question: 'Which Azure Synapse component allows querying data files directly in ADLS without loading them into database tables?', options: ['Serverless SQL Pool', 'Dedicated SQL Pool', 'Apache Spark Pool', 'Data Explorer Pool'], correctIndex: 0, explanation: 'Serverless SQL pool executes queries over Parquet, Delta, and CSV files in data lake storage on-demand.' }
          ]
        }
      }
    ],
    capstone: {
      id: 'SF-20-CAP',
      title: 'Enterprise Azure Medallion Pipeline with ADF, Databricks & ADLS Gen2',
      problemStatement: 'Design and deploy an enterprise data ingestion and curation platform on Azure. Orchestrate raw data landing via ADF into ADLS Gen2 Bronze, execute transformation notebooks in Azure Databricks with Silver/Gold Delta tables, and expose reporting views via Synapse Serverless SQL.',
      businessScenario: 'Company migration from on-prem SQL Server to Azure requires a compliant, audit-ready cloud architecture.',
      deliverables: ['ARM / Bicep / Terraform deployment templates', 'ADF pipeline JSON definitions with parameterized datasets', 'Azure Databricks PySpark transformation notebooks'],
      rubricItems: [
        { id: 'rb-1', criterion: 'Security & Identity Governance', weightPercent: 50, guidance: 'Zero hardcoded secrets; 100% RBAC and Managed Identity authentication.' },
        { id: 'rb-2', criterion: 'Pipeline Robustness & Error Handling', weightPercent: 50, guidance: 'ADF pipelines include retry backoff and failure notification alerts.' }
      ],
      portfolioOutput: 'Azure Enterprise Data Platform repository with automated Bicep templates.'
    }
  },
  {
    id: 'SF-22',
    slug: 'graph-vector-databases-data-engineers',
    title: 'Graph & Vector Databases for Data Engineers',
    subtitle: 'Property graphs, Cypher, graph algorithms, vector embeddings, cosine similarity, and RAG ingestion pipelines.',
    outcomeStatement: 'Design, populate, and query graph databases and vector similarity indexes supporting knowledge graphs and AI retrieval pipelines.',
    description: 'Modern data engineering extends beyond rectangular tables. Learn property graph modeling and querying with Cypher (Neo4j), graph algorithms (PageRank, community detection), vector embeddings generation, high-dimensional indexing (HNSW, IVF-PQ) with pgvector and Milvus, and RAG retrieval pipelines.',
    level: 'Intermediate to Advanced',
    durationHours: 16,
    status: 'preview',
    featured: false,
    skills: ['Neo4j & Cypher', 'Property Graph Modeling', 'Vector Embeddings', 'pgvector & Milvus', 'HNSW Indexing', 'RAG Retrieval Pipelines'],
    roleTags: ['Data Engineer', 'AI Engineer', 'Knowledge Graph Engineer'],
    toolTags: ['Neo4j', 'pgvector', 'Python', 'Docker'],
    prerequisites: ['Relational Database Fundamentals', 'Python Software Engineering'],
    learningObjectives: [
      'Model interconnected entities and relationships using property graphs and query them with Cypher',
      'Generate text embeddings and store them in vector databases with HNSW index configurations',
      'Build end-to-end embedding ingestion and chunking pipelines for Retrieval-Augmented Generation (RAG)'
    ],
    researchSources: [CURRICULUM_RESEARCH_SOURCES.iit_bombay_cse],
    lastReviewed: '2026-03-01',
    diagnostic: {
      id: 'SF-22-DIAG',
      title: 'Graph & Vector Databases Diagnostic',
      description: 'Test your understanding of graph traversal and vector similarity search.',
      estimatedMinutes: 8,
      qualifySkipModuleId: 'sf-22-m1',
      questions: [
        {
          id: 'q1',
          question: 'What is the primary architectural difference between an HNSW (Hierarchical Navigable Small World) index and a flat vector scan?',
          options: [
            'HNSW builds a multi-layer graph enabling approximate nearest neighbor search in logarithmic time O(log N), while flat scan compares vectors linearly O(N).',
            'HNSW compresses text into ZIP files.',
            'HNSW only works with 2D vectors.',
            'HNSW deletes duplicate vectors.'
          ],
          correctIndex: 0,
          explanation: 'HNSW is an Approximate Nearest Neighbor (ANN) graph structure providing high-speed logarithmic searches across millions of high-dimensional vectors.'
        }
      ]
    },
    modules: [
      {
        id: 'sf-22-m1',
        title: 'Property Graphs & Cypher Query Language',
        description: 'Nodes, relationships, properties, and pattern matching with Cypher.',
        estimatedMinutes: 60,
        objectives: ['Formulate graph traversal queries without join explosion'],
        lessons: [
          {
            id: 'sf-22-l1',
            title: 'Index-Free Adjacency & Cypher MATCH Clauses',
            estimatedMinutes: 20,
            objective: 'Traverse multi-hop relationships in O(1) time per pointer.',
            conceptBlocks: [{ id: 'cb-1', title: 'Why Graphs Outperform Joins for Deep Trees', content: 'In relational databases, a 6-hop relationship requires 6 heavy SQL joins. Graph databases use index-free adjacency where nodes hold direct pointers to neighbors!' }],
            inlineChecks: [{ id: 'ic-1', question: 'Which Cypher keyword finds subgraphs matching a relationship pattern?', options: ['MATCH', 'SELECT', 'FIND', 'SCAN'], correctIndex: 0, explanation: 'MATCH is the declarative pattern matching keyword in Cypher.' }]
          }
        ],
        quiz: {
          id: 'sf-22-q1',
          title: 'Graph & Vector Quiz',
          passingScorePercent: 70,
          questions: [
            { id: 'qz-1', question: 'In vector databases, which distance metric measures the cosine of the angle between two directional vectors regardless of magnitude?', options: ['Cosine Similarity', 'Euclidean (L2) Distance', 'Manhattan Distance', 'Hamming Distance'], correctIndex: 0, explanation: 'Cosine similarity normalizes vector lengths to focus purely on angular orientation in embedding space.' }
          ]
        }
      }
    ],
    capstone: {
      id: 'SF-22-CAP',
      title: 'Knowledge Graph & Vector Hybrid Search Engine for Enterprise RAG',
      problemStatement: 'Design and build a hybrid search engine combining a Neo4j knowledge graph of corporate supply chains with a pgvector similarity database of internal engineering incident reports.',
      businessScenario: 'AI chatbots hallucinate inaccurate supplier dependencies because standard vector search misses structural entity hierarchies.',
      deliverables: ['Data ingestion script chunking PDFs and extracting knowledge graph triples', 'Hybrid retrieval query merging graph traversal and vector similarity', 'Benchmark evaluating retrieval precision and recall'],
      rubricItems: [
        { id: 'rb-1', criterion: 'Graph Model & Traversal Accuracy', weightPercent: 50, guidance: 'Correct entity relationship extraction with multi-hop Cypher queries.' },
        { id: 'rb-2', criterion: 'Vector Index Sizing & Retrieval Latency', weightPercent: 50, guidance: 'Sub-50ms vector query latency using tuned HNSW parameters.' }
      ],
      portfolioOutput: 'Graph & Vector Hybrid Retrieval repository on GitHub with Docker setup.'
    }
  },
  {
    id: 'SF-23',
    slug: 'data-governance-metadata-catalogs-lineage',
    title: 'Data Governance, Metadata Catalogs & Lineage (OpenMetadata, Amundsen)',
    subtitle: 'Data discovery, automated column-level lineage, sensitive data classification, and access policies.',
    outcomeStatement: 'Deploy automated metadata platforms that track data lineage, enforce GDPR/CCPA compliance, and enable enterprise data discovery.',
    description: 'Ensure trust and compliance across enterprise data assets. Learn how metadata catalogs (OpenMetadata, Amundsen, DataHub) ingest technical metadata, track column-level lineage from source tables to BI dashboards, tag PII and sensitive data, and enforce automated retention and masking policies.',
    level: 'Intermediate to Advanced',
    durationHours: 14,
    status: 'preview',
    featured: false,
    skills: ['OpenMetadata / DataHub', 'Column-Level Lineage', 'PII Tagging & Masking', 'Data Governance', 'Audit Compliance (GDPR/HIPAA)', 'Metadata APIs'],
    roleTags: ['Data Governance Lead', 'Data Architect', 'Data Engineer'],
    toolTags: ['OpenMetadata', 'DataHub', 'SQL', 'Docker'],
    prerequisites: ['Dimensional Modeling', 'Relational Database Fundamentals'],
    learningObjectives: [
      'Extract and publish technical metadata and schemas using automated crawlers',
      'Trace end-to-end data lineage across SQL transformations and BI reports',
      'Implement automated tag-based access control policies for PII data protection'
    ],
    researchSources: [CURRICULUM_RESEARCH_SOURCES.iit_madras_ds],
    lastReviewed: '2026-03-01',
    diagnostic: {
      id: 'SF-23-DIAG',
      title: 'Data Governance Diagnostic',
      description: 'Evaluate your knowledge of metadata standards and compliance frameworks.',
      estimatedMinutes: 8,
      qualifySkipModuleId: 'sf-23-m1',
      questions: [
        {
          id: 'q1',
          question: 'What is Column-Level Lineage in a modern metadata catalog?',
          options: [
            'A graph mapping exactly which upstream source columns transform into and influence a specific downstream column or metric.',
            'A list of column names in Excel.',
            'A database backup file.',
            'A table sorting tool.'
          ],
          correctIndex: 0,
          explanation: 'Column-level lineage traces the precise data flow from raw transactional columns through intermediate models down to BI reports.'
        }
      ]
    },
    modules: [
      {
        id: 'sf-23-m1',
        title: 'Metadata Extraction & Column-Level Lineage Parsers',
        description: 'Parse SQL ASTs to extract lineage and publish to OpenMetadata.',
        estimatedMinutes: 60,
        objectives: ['Generate lineage graphs from SQL dialect queries'],
        lessons: [
          {
            id: 'sf-23-l1',
            title: 'AST Parsing for Automatic Lineage Detection',
            estimatedMinutes: 20,
            objective: 'Extract upstream dependencies from complex queries using SQLGlot.',
            conceptBlocks: [{ id: 'cb-1', title: 'Why Manual Documentation Fails', content: 'Manual data dictionaries are obsolete the moment they are written. Automated AST parsing extracts true lineage directly from running queries.' }],
            inlineChecks: [{ id: 'ic-1', question: 'Which open-source standard provides interoperability for metadata exchange across data catalogs?', options: ['OpenLineage', 'REST', 'GraphQL', 'ODBC'], correctIndex: 0, explanation: 'OpenLineage defines an open standard for collecting end-to-end lineage metadata from Spark, Airflow, and dbt.' }]
          }
        ],
        quiz: {
          id: 'sf-23-q1',
          title: 'Governance & Lineage Quiz',
          passingScorePercent: 70,
          questions: [
            { id: 'qz-1', question: 'Under GDPR, what right mandates that an enterprise must be capable of identifying and permanently removing all records belonging to a user?', options: ['Right to be Forgotten (Erasure)', 'Right to Speed', 'Right to Encryption', 'Right to Free Analytics'], correctIndex: 0, explanation: 'The Right to Erasure mandates that organizations delete all personal data upon valid user request.' }
          ]
        }
      }
    ],
    capstone: {
      id: 'SF-23-CAP',
      title: 'Enterprise PII Lineage Audit & GDPR Compliance Framework',
      problemStatement: 'Deploy an automated metadata and governance scanner that ingests 50 table schemas, uses regex and ML classification to tag sensitive PII columns (emails, credit cards, SSNs), generates an end-to-end column lineage graph, and produces a GDPR compliance readiness report.',
      businessScenario: 'Regulators have issued an audit notice demanding proof of PII isolation and access control.',
      deliverables: ['Automated OpenMetadata ingestion pipeline configuration', 'Custom Python PII classifier script', 'Executive Governance & Risk Assessment audit report'],
      rubricItems: [
        { id: 'rb-1', criterion: 'Lineage Accuracy & Coverage', weightPercent: 50, guidance: 'Zero broken dependencies; full column-to-dashboard path documented.' },
        { id: 'rb-2', criterion: 'PII Identification & Remediation', weightPercent: 50, guidance: '100% detection of mock PII columns with proposed masking policies.' }
      ],
      portfolioOutput: 'Data Governance and Lineage Automation repository on GitHub.'
    }
  },
  {
    id: 'SF-24',
    slug: 'data-mesh-data-contracts-architectural-patterns',
    title: 'Data Mesh, Data Contracts & Architectural Patterns',
    subtitle: 'Domain-driven data ownership, data as a product, self-serve data platforms, and federated governance.',
    outcomeStatement: 'Architect decentralized Data Mesh operating models and implement automated Data Contracts between producer and consumer teams.',
    description: 'Break free from monolithic data bottlenecks. Master Zhamak Dehghani’s four principles of Data Mesh: Domain-Oriented Decentralized Data Ownership, Data as a Product, Self-Serve Data Platform, and Federated Computational Governance. Implement automated schema contracts using JSON Schema and protobuf.',
    level: 'Advanced',
    durationHours: 16,
    status: 'preview',
    featured: false,
    skills: ['Data Mesh Architecture', 'Data Contracts', 'Domain-Driven Design (DDD)', 'Federated Governance', 'Self-Serve Infrastructure', 'API-First Data Products'],
    roleTags: ['Principal Data Engineer', 'Enterprise Data Architect', 'Head of Data'],
    toolTags: ['Data Contracts CLI', 'JSON Schema', 'Kafka', 'Docker'],
    prerequisites: ['Dimensional Modeling', 'Distributed Systems Architecture'],
    learningObjectives: [
      'Apply Domain-Driven Design principles to decompose monolithic data warehouses into domain data products',
      'Author and enforce machine-readable Data Contracts using JSON Schema and CI/CD validation',
      'Architect self-serve platform abstractions that enable domain software teams to publish data without central tickets'
    ],
    researchSources: [CURRICULUM_RESEARCH_SOURCES.iit_bombay_cse, CURRICULUM_RESEARCH_SOURCES.nitk_surathkal_de],
    lastReviewed: '2026-03-01',
    diagnostic: {
      id: 'SF-24-DIAG',
      title: 'Data Mesh & Architecture Diagnostic',
      description: 'Test your understanding of Data Mesh principles and contract enforcement.',
      estimatedMinutes: 8,
      qualifySkipModuleId: 'sf-24-m1',
      questions: [
        {
          id: 'q1',
          question: 'In Data Mesh theory, what constitutes a "Data Product"?',
          options: [
            'An autonomous, discoverable, secure, and interoperable node containing code, data, metadata, and infrastructure contracts managed by a domain team.',
            'A spreadsheet exported to Google Drive.',
            'A paid SaaS subscription.',
            'A machine learning algorithm.'
          ],
          correctIndex: 0,
          explanation: 'A data product is an architectural quantum combining data, code, metadata, access control, and SLA guarantees owned by a domain team.'
        }
      ]
    },
    modules: [
      {
        id: 'sf-24-m1',
        title: 'The Four Pillars of Data Mesh & Domain Decomposition',
        description: 'Decompose monolithic teams and pipelines into autonomous domain teams.',
        estimatedMinutes: 60,
        objectives: ['Design domain bounded contexts for data architectures'],
        lessons: [
          {
            id: 'sf-24-l1',
            title: 'De-coupling Central Data Teams via Self-Serve Platforms',
            estimatedMinutes: 20,
            objective: 'Build platform capabilities that abstract storage and compute provisioning.',
            conceptBlocks: [{ id: 'cb-1', title: 'Why Centralized Teams Bottleneck', content: 'Centralized data engineering teams lack domain business context and become a perpetual backlog bottleneck for upstream software changes and downstream analytics.' }],
            inlineChecks: [{ id: 'ic-1', question: 'Who is responsible for ensuring schema accuracy under a Data Contract model?', options: ['The upstream data producer (software engineering team)', 'The intern', 'The data consumer only', 'The cloud provider'], correctIndex: 0, explanation: 'Data contracts hold the producer accountable for schema changes and backward compatibility before deployment.' }]
          }
        ],
        quiz: {
          id: 'sf-24-q1',
          title: 'Data Mesh & Architecture Quiz',
          passingScorePercent: 70,
          questions: [
            { id: 'qz-1', question: 'Which Data Mesh pillar enforces global interoperability, security, and compliance across independent domain products?', options: ['Federated Computational Governance', 'Data as a Product', 'Domain Ownership', 'Self-Serve Platform'], correctIndex: 0, explanation: 'Federated computational governance automates policy enforcement across all autonomous domain products.' }
          ]
        }
      }
    ],
    capstone: {
      id: 'SF-24-CAP',
      title: 'Enterprise Data Mesh Blueprint & Automated Data Contract System',
      problemStatement: 'Design an enterprise Data Mesh architecture transition plan for a 2,000-person company with 8 independent business units. Implement an automated Data Contract validation CLI that runs in producer GitHub CI pipelines, blocking breaking schema changes from deploying.',
      businessScenario: 'Microservice backend engineers repeatedly deploy database schema changes that silently break customer retention analytics pipelines.',
      deliverables: ['Data Mesh Architectural Operating Model Specification Document', 'Automated Data Contract validation tool (Python CLI)', 'Contract schema definition for Payments and Fulfillment domains'],
      rubricItems: [
        { id: 'rb-1', criterion: 'Architectural Viability & Domain Boundaries', weightPercent: 50, guidance: 'Clear bounded contexts and self-serve platform interface definitions.' },
        { id: 'rb-2', criterion: 'Contract Enforcement Automation', weightPercent: 50, guidance: 'CLI accurately detects breaking changes (e.g. dropped fields, incompatible types).' }
      ],
      portfolioOutput: 'Data Mesh Strategy & Data Contracts Framework repository on GitHub.'
    }
  },
  {
    id: 'SF-25',
    slug: 'production-capstone-readiness-technical-system-design',
    title: 'Production Capstone, Production Readiness & Technical System Design',
    subtitle: 'System design interviews, operational runbooks, disaster recovery, failure injection, and end-to-end readiness.',
    outcomeStatement: 'Confidently design, communicate, defend, and operate complex distributed data architectures in high-stakes production environments and technical interviews.',
    description: 'The culminating capstone course of DataForge. Synthesize all previous engineering disciplines into production readiness. Practice real-world data system design interview scenarios (designing TikTok metrics, Uber surge pricing pipelines, Netflix recommendation telemetry), author production runbooks, conduct chaos failure injection drills, and finalize portfolio-grade technical artifacts.',
    level: 'Advanced',
    durationHours: 25,
    status: 'preview',
    featured: true,
    skills: ['Data System Design Interviews', 'Disaster Recovery (DR) & RTO/RPO', 'Chaos Engineering & Failure Injection', 'Production Runbooks & On-Call Playbooks', 'Capacity Planning & Back-of-the-Envelope Math'],
    roleTags: ['Staff Data Engineer', 'Principal Architect', 'Engineering Lead'],
    toolTags: ['System Design', 'Excalidraw / Draw.io', 'Docker', 'Prometheus'],
    prerequisites: ['Distributed Systems Architecture', 'Production Data Engineer or Analytics Engineer path completion'],
    learningObjectives: [
      'Perform rapid back-of-the-envelope calculations for storage, network bandwidth, and memory sizing in system design interviews',
      'Structure technical data system design interviews using the 4-step framework (Scope, High-Level Design, Deep Dive, Bottlenecks)',
      'Conduct failure injection drills to verify disaster recovery time objective (RTO) and recovery point objective (RPO)'
    ],
    researchSources: [CURRICULUM_RESEARCH_SOURCES.iit_bombay_cse, CURRICULUM_RESEARCH_SOURCES.nitk_surathkal_de],
    lastReviewed: '2026-03-01',
    diagnostic: {
      id: 'SF-25-DIAG',
      title: 'Production Readiness Diagnostic',
      description: 'Evaluate your ability to estimate scale, calculate capacity, and design fault-tolerant systems.',
      estimatedMinutes: 8,
      qualifySkipModuleId: 'sf-25-m1',
      questions: [
        {
          id: 'q1',
          question: 'If a data pipeline ingests 100,000 events/second where each event is 1KB, what is the approximate daily raw storage requirement (before compression)?',
          options: [
            '~8.64 Terabytes / day (100,000 * 1KB = 100MB/s * 86,400s = 8,640,000MB = 8.64TB).',
            '~100 Gigabytes / day.',
            '~1 Petabyte / day.',
            '~500 Megabytes / day.'
          ],
          correctIndex: 0,
          explanation: '100,000 * 1KB = 100MB/s. 100MB/s * 3600s/hr * 24hr = 8.64TB per day.'
        }
      ]
    },
    modules: [
      {
        id: 'sf-25-m1',
        title: 'The Data System Design Interview Framework',
        description: 'Scope requirements, draw architecture diagrams, and defend trade-offs.',
        estimatedMinutes: 60,
        objectives: ['Master back-of-the-envelope capacity estimations'],
        lessons: [
          {
            id: 'sf-25-l1',
            title: 'The 4-Stage Interview Cadence',
            estimatedMinutes: 20,
            objective: 'Lead architectural interviews effectively: Functional/Non-functional requirements -> API/Data model -> High-Level Design -> Deep dive into failure modes.',
            conceptBlocks: [{ id: 'cb-1', title: 'Driving the Interview', content: 'Do not jump straight into drawing boxes. Clarify throughput (QPS), read-to-write ratios, freshness latency SLAs, and budget constraints first!' }],
            inlineChecks: [{ id: 'ic-1', question: 'What is RPO (Recovery Point Objective)?', options: ['The maximum acceptable age of data files that must be recovered from backup storage after a disaster.', 'The time it takes to reboot servers.', 'The total pipeline cost.', 'The rate of packet loss.'], correctIndex: 0, explanation: 'RPO measures acceptable data loss expressed in time (e.g. 15 minutes of lost transactions).' }]
          }
        ],
        quiz: {
          id: 'sf-25-q1',
          title: 'System Design & Readiness Quiz',
          passingScorePercent: 70,
          questions: [
            { id: 'qz-1', question: 'In distributed data pipelines, what is "Poison Pill" data and how should it be isolated?', options: ['A malformed record that causes worker parsing threads to crash repeatedly; it must be diverted to a Dead-Letter Queue (DLQ).', 'An encrypted password.', 'A network denial of service attack.', 'A deleted file.'], correctIndex: 0, explanation: 'Poison pills cause perpetual worker crashes unless caught and routed to dead-letter storage for offline inspection.' }
          ]
        }
      }
    ],
    capstone: {
      id: 'SF-25-CAP',
      title: 'Global High-Throughput Ride-Share Surge Pricing & Telemetry Architecture',
      problemStatement: 'Design and defend an end-to-end production data platform processing 500,000 GPS telemetry events/second across 50 international metropolitan hubs. Calculate dynamic surge multipliers with < 5-second freshness, sink historical paths to a Lakehouse for driver dispatch ML training, and provide a full disaster recovery runbook.',
      businessScenario: 'Executive leadership requests an architectural blueprint for next-generation dispatch infrastructure capable of handling 5x peak New Year\'s Eve traffic.',
      deliverables: [
        'Comprehensive System Design Whitepaper (Requirements, Back-of-the-envelope math, Storage choices, Data flow diagram)',
        'Kafka partition & Spark streaming sizing specification',
        'Production On-Call Runbook detailing failover procedures for complete cloud region outage'
      ],
      rubricItems: [
        { id: 'rb-1', criterion: 'Architectural Completeness & Sizing Math', weightPercent: 50, guidance: 'Correct storage, bandwidth, and memory sizing calculations matching scale requirements.' },
        { id: 'rb-2', criterion: 'Production Resilience & Failure Handling', weightPercent: 50, guidance: 'Clear DR strategy with zero data loss and automated multi-region DNS failover.' }
      ],
      portfolioOutput: 'Principal-Level Data Engineering System Design Portfolio Package on GitHub.'
    }
  }
];
