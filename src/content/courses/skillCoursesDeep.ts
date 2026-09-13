import { SkillCourse } from '@/types';
import { CURRICULUM_RESEARCH_SOURCES } from '../research/curriculumSignals';

export const DEEP_SKILL_COURSES: SkillCourse[] = [
  {
    id: 'SF-04',
    slug: 'relational-database-fundamentals-ansi-sql',
    title: 'Relational Database Fundamentals, ANSI SQL & Execution Engines',
    subtitle: 'From relational algebra and query execution trees to high-performance analytical SQL in production engines.',
    outcomeStatement: 'Master relational storage engines, write deterministic complex SQL queries, and diagnose query execution plans to eliminate bottlenecks and full table scans.',
    description: 'A rigorous, engineering-grade deep dive into relational databases and ANSI SQL. Synthesized from IIT Bombay CS 317, IIT Madras Database Systems, and ISO/IEC 9075 standards. Learn how storage engines structure rows on disk pages, how B+ trees index data, how query optimizers generate logical and physical plans, and how to write production-grade analytical SQL.',
    level: 'Beginner to Intermediate',
    durationHours: 18,
    status: 'ready',
    featured: true,
    skills: ['ANSI SQL', 'Relational Algebra', 'Query Optimization', 'EXPLAIN Plan Analysis', 'B+ Tree Indexing', 'ACID Transactions', 'DuckDB'],
    roleTags: ['Data Engineer', 'Analytics Engineer', 'Backend Engineer'],
    toolTags: ['PostgreSQL', 'DuckDB', 'ANSI SQL', 'SQLite'],
    prerequisites: ['Basic terminal command line usage', 'Foundational understanding of tabular data'],
    learningObjectives: [
      'Understand relational algebra foundations and how declarative SQL maps to physical execution operators',
      'Diagnose query execution plans (EXPLAIN / EXPLAIN ANALYZE) to identify sequential scans, hash joins, and memory spills',
      'Write complex analytical queries using Common Table Expressions (CTEs), window functions, and correlated subqueries',
      'Design normalized 3NF schemas with primary, foreign, and surrogate key constraints',
      'Reason about ACID transaction isolation levels (Read Committed, Repeatable Read, Serializable) and concurrency phenomena'
    ],
    researchSources: [
      CURRICULUM_RESEARCH_SOURCES.iit_bombay_cse,
      CURRICULUM_RESEARCH_SOURCES.iit_madras_ds,
      CURRICULUM_RESEARCH_SOURCES.nptel_dbms,
      CURRICULUM_RESEARCH_SOURCES.ansi_sql_standards
    ],
    lastReviewed: '2026-03-01',
    diagnostic: {
      id: 'SF-04-DIAG',
      title: 'SQL Placement Diagnostic',
      description: 'Test your knowledge of query execution, window frames, and indexing to skip introductory modules.',
      estimatedMinutes: 10,
      qualifySkipModuleId: 'sf-04-m1',
      questions: [
        {
          id: 'q1',
          question: 'In standard SQL execution order, which clause is evaluated immediately BEFORE the SELECT clause?',
          options: ['FROM', 'WHERE', 'HAVING', 'ORDER BY'],
          correctIndex: 2,
          explanation: 'SQL logical execution order is: FROM/JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT.',
          difficulty: 'Beginner'
        },
        {
          id: 'q2',
          question: 'What is the primary difference between RANK() and DENSE_RANK() when ties occur?',
          options: [
            'RANK() leaves gaps in rank numbering after ties, whereas DENSE_RANK() produces consecutive integers without gaps.',
            'DENSE_RANK() leaves gaps, while RANK() ignores ties.',
            'RANK() requires an ORDER BY clause, whereas DENSE_RANK() does not.',
            'DENSE_RANK() can only be computed over numeric columns.'
          ],
          correctIndex: 0,
          explanation: 'RANK() assigns duplicate ranks to ties and skips subsequent numbers (e.g. 1, 2, 2, 4), while DENSE_RANK() assigns consecutive numbers (e.g. 1, 2, 2, 3).',
          difficulty: 'Intermediate'
        },
        {
          id: 'q3',
          question: 'When a database engine performs a Hash Join between Table A (10M rows) and Table B (50K rows), which table is typically used to build the in-memory hash table?',
          options: [
            'Table A (the larger table)',
            'Table B (the smaller table)',
            'Both tables simultaneously',
            'Neither; Hash Joins do not use in-memory tables'
          ],
          correctIndex: 1,
          explanation: 'The query optimizer selects the smaller relation as the build side to fit the hash table in work_mem, then probes it row-by-row using the larger stream.',
          difficulty: 'Advanced'
        }
      ]
    },
    modules: [
      {
        id: 'sf-04-m1',
        title: 'Relational Storage Mechanics & Logical Execution Order',
        description: 'Understand disk page layouts, slotted pages, tuples, and the exact order in which SQL query engines execute clauses.',
        estimatedMinutes: 90,
        objectives: [
          'Trace declarative SQL query evaluation through the logical operator pipeline',
          'Explain why aliases defined in SELECT cannot be referenced in WHERE',
          'Understand tuple storage, row headers, and slotted page anatomy'
        ],
        lessons: [
          {
            id: 'sf-04-l1',
            title: 'Logical Execution Order: Why SQL is Not Written in Order of Execution',
            estimatedMinutes: 20,
            objective: 'Master the 8-step logical execution pipeline of ANSI SQL.',
            conceptBlocks: [
              {
                id: 'cb-1',
                title: 'Declarative Syntax vs Procedural Evaluation',
                content: 'Unlike procedural languages like Python or Go where instructions execute top-to-bottom, SQL is a **declarative language**. You declare *what* data you need, and the engine determines *how* to retrieve it.\n\nThe logical evaluation order of an ANSI SQL query is:\n\n1. **FROM & JOIN**: The cartesian product of source tables is formed and join predicates are applied.\n2. **WHERE**: Row-level filter predicates eliminate non-matching tuples before aggregation.\n3. **GROUP BY**: Remaining rows are grouped into distinct buckets by grouping keys.\n4. **HAVING**: Aggregate predicates evaluate over group buckets (e.g., `COUNT(*) > 5`).\n5. **SELECT**: Expressions, projections, and column aliasing are computed.\n6. **DISTINCT**: Duplicate output rows are filtered.\n7. **ORDER BY**: The final output row stream is sorted.\n8. **LIMIT / OFFSET**: The final row window is truncated.\n\nBecause `WHERE` executes in Step 2 and `SELECT` executes in Step 5, any column alias created in `SELECT` does not exist yet when `WHERE` is evaluated! Understanding this eliminates 90% of beginner syntax errors.',
                seniorTip: 'Always mentally trace your query using the 1-8 logical pipeline. If you need to filter on an expression computed in SELECT, wrap the logic in a CTE (Common Table Expression) or subquery.',
                antiPattern: 'Attempting to write WHERE total_amount > 1000 when total_amount is defined as price * quantity in the SELECT clause.'
              }
            ],
            exercise: {
              id: 'ex-04-1',
              type: 'sql',
              prompt: 'Write a query on the provided orders table that returns customer_id and total_spent for customers who have spent more than 500 dollars. Order the results by total_spent descending.',
              starterCode: '-- Table: orders (order_id INT, customer_id INT, amount DOUBLE, status VARCHAR)\nSELECT customer_id, SUM(amount) AS total_spent\nFROM orders\nWHERE status = \'completed\'\n-- Complete the GROUP BY and HAVING clauses\n',
              solutionCode: 'SELECT customer_id, SUM(amount) AS total_spent\nFROM orders\nWHERE status = \'completed\'\nGROUP BY customer_id\nHAVING SUM(amount) > 500\nORDER BY total_spent DESC;',
              expectedOutputSnippet: 'customer_id | total_spent',
              hints: [
                'Remember that aggregate filters belong in the HAVING clause, not WHERE.',
                'You must GROUP BY customer_id before using SUM(amount).'
              ]
            },
            inlineChecks: [
              {
                id: 'ic-1',
                question: 'Can you filter by an aggregate expression like SUM(revenue) > 1000 in a WHERE clause?',
                options: [
                  'Yes, if the column is indexed.',
                  'No, because the WHERE clause executes before rows are grouped into aggregations.',
                  'Yes, if you use a window function.',
                  'Only in MySQL, not in PostgreSQL or DuckDB.'
                ],
                correctIndex: 1,
                explanation: 'WHERE filters individual tuples before grouping occurs. Aggregations only exist after GROUP BY, so they must be filtered using HAVING.'
              }
            ]
          },
          {
            id: 'sf-04-l2',
            title: 'Query Execution Plans: Reading EXPLAIN and EXPLAIN ANALYZE',
            estimatedMinutes: 30,
            objective: 'Interpret query plans, identify sequential scans, index lookups, and memory spills.',
            conceptBlocks: [
              {
                id: 'cb-2',
                title: 'From AST to Physical Query Tree',
                content: 'When you submit a SQL string, the engine performs four phases:\n\n1. **Parser & Lexer**: Validates syntax and outputs an Abstract Syntax Tree (AST).\n2. **Analyzer / Binder**: Checks schema metadata, verifies table/column existence, and outputs a Logical Plan.\n3. **Optimizer (Cost-Based Optimizer - CBO)**: Evaluates multiple equivalent physical plans using table statistics (row counts, histograms, distinct values) and estimates total I/O and CPU cost.\n4. **Execution Engine**: Executes the lowest-cost physical operator tree using the Volcano iterator model (`open()`, `next()`, `close()`) or vectorized batch execution (e.g. DuckDB/Presto).\n\nRunning `EXPLAIN ANALYZE` executes the query and reports both the estimated cost and actual runtime metrics.',
                seniorTip: 'Look for the "Seq Scan" or "Filter" nodes with high row removal ratios. If a query filters 10M rows down to 5 rows via Seq Scan, you need an index or partition pruning.',
                antiPattern: 'Assuming indexes are always used. If a query returns >20% of a table, the optimizer will intentionally ignore indexes because random I/O seeks are slower than sequential multi-block reads!'
              }
            ],
            exercise: {
              id: 'ex-04-2',
              type: 'sql',
              prompt: 'Run an EXPLAIN query analyzing a filter on customer_id to observe the scan operator.',
              starterCode: 'EXPLAIN\nSELECT customer_id, amount\nFROM orders\nWHERE customer_id = 42;',
              solutionCode: 'EXPLAIN\nSELECT customer_id, amount\nFROM orders\nWHERE customer_id = 42;',
              expectedOutputSnippet: 'SCAN orders',
              hints: ['Prefix your SELECT statement with EXPLAIN to inspect the operator tree.']
            },
            inlineChecks: [
              {
                id: 'ic-2',
                question: 'What does the difference between estimated rows and actual rows in EXPLAIN ANALYZE indicate?',
                options: [
                  'A hardware memory defect.',
                  'Outdated or missing table statistics, leading the optimizer to choose suboptimal join strategies.',
                  'The query has syntax errors.',
                  'The database cache is completely full.'
                ],
                correctIndex: 1,
                explanation: 'Cost-based optimizers rely on statistical histograms (ANALYZE table). When stats are stale, the engine makes incorrect cardinality estimates, leading to disastrous nested loop joins instead of hash joins.'
              }
            ]
          }
        ],
        quiz: {
          id: 'sf-04-q1',
          title: 'Relational Foundations & Query Plan Assessment',
          passingScorePercent: 70,
          questions: [
            {
              id: 'qz-1',
              question: 'Which of the following operations cannot utilize a standard B+ Tree index on column (created_at)?',
              options: [
                'WHERE created_at >= \'2026-01-01\'',
                'WHERE created_at BETWEEN \'2026-01-01\' AND \'2026-02-01\'',
                'WHERE DATE(created_at) = \'2026-01-01\' (without expression index)',
                'WHERE created_at IS NULL'
              ],
              correctIndex: 2,
              explanation: 'Wrapping an indexed column in a function like DATE(created_at) prevents the optimizer from using index range scans unless a functional/expression index is specifically created.',
            },
            {
              id: 'qz-2',
              question: 'In a B+ Tree index, where are the actual data pointers or row records stored?',
              options: [
                'Exclusively in leaf nodes',
                'In the root node only',
                'Evenly distributed across all internal nodes',
                'In the transaction write-ahead log'
              ],
              correctIndex: 0,
              explanation: 'In a B+ tree (unlike a B tree), internal nodes only store routing keys. All tuple pointers or clustered rows reside exclusively in the doubly-linked leaf nodes, enabling fast sequential range scans.',
            }
          ]
        }
      },
      {
        id: 'sf-04-m2',
        title: 'Analytical Window Functions & Complex Data Transformations',
        description: 'Master window frames (ROWS vs RANGE), partition boundaries, rolling calculations, and gap analysis.',
        estimatedMinutes: 120,
        objectives: [
          'Differentiate window frame boundaries: ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW',
          'Calculate moving averages, running totals, and year-over-year growth metrics',
          'Solve complex island-and-gap problems using LAG and LEAD'
        ],
        lessons: [
          {
            id: 'sf-04-l3',
            title: 'Window Framing Mechanics: ROWS vs RANGE and Partitioning',
            estimatedMinutes: 25,
            objective: 'Construct precise sliding window frames for cumulative analytics.',
            conceptBlocks: [
              {
                id: 'cb-3',
                title: 'Anatomy of the OVER() Clause',
                content: 'Window functions calculate values across a set of table rows related to the current row without collapsing the rows like GROUP BY does.\n\nEvery window specification consists of:\n1. `PARTITION BY`: Divides the rows into independent partitions.\n2. `ORDER BY`: Determines the evaluation sequence within each partition.\n3. `FRAME SPECIFICATION`: Defines the exact slice of rows inside the partition to include in calculation.\n\n**CRITICAL DEFAULT TRAP:** When you specify `ORDER BY` without an explicit frame, ANSI SQL defaults to:\n`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`\nNotice `RANGE`, not `ROWS`! With `RANGE`, duplicate values in the sort key are treated as ties and aggregated together, often causing unexpected spikes in cumulative sums.',
                seniorTip: 'Always explicitly specify ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW for cumulative sums to avoid subtle bugs with duplicate timestamp ties.',
                antiPattern: 'Using self-joins to compute moving averages or previous row values. Window functions are O(N log N) via sorting, while self-joins are O(N^2).'
              }
            ],
            exercise: {
              id: 'ex-04-3',
              type: 'sql',
              prompt: 'Write a query that computes a 3-row moving average of order amounts per customer, ordered by order_date.',
              starterCode: 'SELECT \n  customer_id,\n  order_date,\n  amount,\n  AVG(amount) OVER (\n    -- Define PARTITION BY, ORDER BY, and ROWS BETWEEN\n  ) AS moving_avg_amount\nFROM orders;',
              solutionCode: 'SELECT \n  customer_id,\n  order_date,\n  amount,\n  AVG(amount) OVER (\n    PARTITION BY customer_id\n    ORDER BY order_date\n    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n  ) AS moving_avg_amount\nFROM orders;',
              expectedOutputSnippet: 'customer_id | order_date | amount | moving_avg_amount',
              hints: ['A 3-row moving average includes the current row and 2 preceding rows: ROWS BETWEEN 2 PRECEDING AND CURRENT ROW.']
            },
            inlineChecks: [
              {
                id: 'ic-3',
                question: 'What happens when two rows have the exact same timestamp in an ORDER BY clause with the default RANGE frame?',
                options: [
                  'An error is thrown.',
                  'Both rows receive the sum including BOTH values, rather than evaluating one after the other.',
                  'The second row is deleted.',
                  'The query runs in random order.'
                ],
                correctIndex: 1,
                explanation: 'RANGE operates on values, not physical row offsets. Ties in the ordering column will include all tied peers in the running aggregate window.'
              }
            ]
          }
        ],
        quiz: {
          id: 'sf-04-q2',
          title: 'Window Functions & Analytical SQL Assessment',
          passingScorePercent: 70,
          questions: [
            {
              id: 'qz-3',
              question: 'Which window function allows you to access a column value from the row immediately preceding the current row?',
              options: ['LEAD()', 'LAG()', 'FIRST_VALUE()', 'NTH_VALUE()'],
              correctIndex: 1,
              explanation: 'LAG(column, offset) accesses data from preceding rows without requiring an expensive self-join.',
            }
          ]
        }
      }
    ],
    capstone: {
      id: 'SF-04-CAP',
      title: 'Production Analytical SQL Engine & Multi-Tier Schema Benchmark',
      problemStatement: 'Design and benchmark a normalized relational data model for a high-volume B2B logistics company tracking 5M shipments across 10 global hubs. Implement complex revenue cohort retention, SLA breach detection using window functions, and an indexing strategy that reduces 95th percentile query latency from 8.2s to under 120ms.',
      businessScenario: 'Management dashboards are timing out during month-end closes. Analysts are writing un-indexed correlated subqueries that cause full table scans across 50GB tables. You must refactor the queries and implement optimal indexes.',
      deliverables: [
        'Complete 3NF DDL schema with foreign keys and check constraints in DuckDB / PostgreSQL',
        'Refactored SQL scripts replacing nested subqueries with CTEs and window functions',
        'Before-and-after EXPLAIN ANALYZE execution cost reports',
        'Production query optimization runbook detailing index trade-offs on write throughput'
      ],
      rubricItems: [
        {
          id: 'rb-1',
          criterion: 'Query Plan & Latency Improvement',
          weightPercent: 40,
          guidance: 'Eliminate sequential scans on large tables, verify index scans, achieve >= 10x latency reduction.'
        },
        {
          id: 'rb-2',
          criterion: 'Windowing & Analytical Correctness',
          weightPercent: 35,
          guidance: 'Accurate island-and-gap SLA breach detection with zero false positives on concurrent shipment events.'
        },
        {
          id: 'rb-3',
          criterion: 'Schema Integrity & Documentation',
          weightPercent: 25,
          guidance: 'Correct surrogate key generation, referential integrity rules, and comprehensive optimization documentation.'
        }
      ],
      portfolioOutput: 'Reproducible SQL repository with DuckDB database seed script, benchmark harness, and performance engineering documentation.'
    }
  },
  {
    id: 'SF-02',
    slug: 'python-software-engineering-for-data-pipelines',
    title: 'Python Software Engineering for Data Pipelines',
    subtitle: 'Type hints, memory generators, robust error handling, concurrency, and modular architecture for resilient ETL systems.',
    outcomeStatement: 'Write clean, testable, object-oriented and functional Python code engineered for high-throughput batch and streaming data processing.',
    description: 'Data engineering Python is software engineering Python. Move beyond quick scripts to production-grade data pipeline architecture. Covers typing, Pydantic data validation, memory-efficient generators, context managers, multiprocessing vs multithreading vs asyncio, unit testing with pytest, and packaging.',
    level: 'Beginner to Intermediate',
    durationHours: 20,
    status: 'ready',
    featured: true,
    skills: ['Python 3.12+', 'Pydantic v2', 'Pytest', 'Generators & Itertools', 'Multiprocessing & AsyncIO', 'Packaging', 'Type Hinting'],
    roleTags: ['Data Engineer', 'Backend Engineer', 'MLOps Engineer'],
    toolTags: ['Python', 'pytest', 'Pydantic', 'Docker'],
    prerequisites: ['Basic Python syntax (loops, conditionals, functions)'],
    learningObjectives: [
      'Implement memory-efficient data streaming with Python generators and iterators',
      'Validate incoming unstructured data with Pydantic v2 models and schema contracts',
      'Choose the appropriate concurrency model: GIL limitations, threading for I/O, multiprocessing for CPU',
      'Write deterministic unit and integration tests using pytest fixtures and mocks',
      'Package Python data libraries with pyproject.toml and clean folder architecture'
    ],
    researchSources: [
      CURRICULUM_RESEARCH_SOURCES.iit_madras_ds,
      CURRICULUM_RESEARCH_SOURCES.iit_bombay_cse
    ],
    lastReviewed: '2026-03-01',
    diagnostic: {
      id: 'SF-02-DIAG',
      title: 'Python Software Engineering Diagnostic',
      description: 'Evaluate your understanding of Python memory models, concurrency, and testing.',
      estimatedMinutes: 10,
      qualifySkipModuleId: 'sf-02-m1',
      questions: [
        {
          id: 'q1',
          question: 'Why are Python generators preferred over lists when streaming 10GB log files on an 8GB RAM machine?',
          options: [
            'Generators execute on the GPU.',
            'Generators compute values lazily on demand (yield) using constant O(1) memory, while lists load all elements into memory simultaneously.',
            'Generators automatically bypass Python Global Interpreter Lock (GIL).',
            'Generators compress data using gzip.'
          ],
          correctIndex: 1,
          explanation: 'Generators yield one item at a time using iterator protocols, keeping memory consumption minimal regardless of dataset size.',
          difficulty: 'Intermediate'
        }
      ]
    },
    modules: [
      {
        id: 'sf-02-m1',
        title: 'Memory Optimization: Generators, Iterators & Streaming File I/O',
        description: 'Process multi-gigabyte datasets without memory crashes using generator pipelines and lazy evaluation.',
        estimatedMinutes: 90,
        objectives: [
          'Write generator functions using yield',
          'Chain generator expressions for Unix-pipe style stream transformations',
          'Benchmark memory footprint using sys.getsizeof and tracemalloc'
        ],
        lessons: [
          {
            id: 'sf-02-l1',
            title: 'Lazy Evaluation & Generator Pipelines for Large Files',
            estimatedMinutes: 25,
            objective: 'Build zero-copy data processing streams using Python generators.',
            conceptBlocks: [
              {
                id: 'cb-1',
                title: 'The Out-Of-Memory (OOM) Trap in Batch Processing',
                content: 'When beginner data engineers process files, they often write:\n\n```python\nwith open("large_file.csv") as f:\n    lines = f.readlines()  # DANGER: Loads all 20M lines into RAM at once!\n```\n\nIf the file is 10GB and your worker has 8GB RAM, the OS kernel invokes the OOM Killer and silently terminates your process.\n\nUsing **generators**, you yield one line at a time:\n\n```python\ndef stream_records(filepath):\n    with open(filepath, "r", encoding="utf-8") as f:\n        for line in f:\n            yield line.strip().split(",")\n```\n\nThis keeps memory usage constant at ~few kilobytes, whether the file contains 100 rows or 100 million rows!',
                seniorTip: 'Chain generators together like Lego bricks: reader -> cleaner -> transformer -> batch_emitter. Execution only happens when the terminal sink (e.g. database write) requests the next item.',
                antiPattern: 'Converting a generator back to a list with list(my_gen) before iterating.'
              }
            ],
            exercise: {
              id: 'ex-02-1',
              type: 'python',
              prompt: 'Implement a generator function filter_high_value(transactions, threshold) that yields transactions where amount > threshold.',
              starterCode: 'def filter_high_value(transactions, threshold):\n    # Complete the generator implementation using yield\n    pass\n',
              solutionCode: 'def filter_high_value(transactions, threshold):\n    for txn in transactions:\n        if txn.get("amount", 0) > threshold:\n            yield txn\n',
              expectedOutputSnippet: 'yields matching transaction dictionaries',
              hints: ['Use a for loop over transactions and the yield keyword when the condition is met.']
            },
            inlineChecks: [
              {
                id: 'ic-1',
                question: 'When is code inside a generator function actually executed?',
                options: [
                  'As soon as the function is defined.',
                  'When the function is called.',
                  'Only when next() is called or when iterated over in a loop.',
                  'When Python garbage collection runs.'
                ],
                correctIndex: 2,
                explanation: 'Calling a generator function returns a generator object without executing the body. Code runs only when next() advances execution to the next yield statement.'
              }
            ]
          }
        ],
        quiz: {
          id: 'sf-02-q1',
          title: 'Memory Optimization & Python Architecture Assessment',
          passingScorePercent: 70,
          questions: [
            {
              id: 'qz-1',
              question: 'Which built-in module provides itertools.islice for streaming batches from generators?',
              options: ['collections', 'itertools', 'functools', 'operator'],
              correctIndex: 1,
              explanation: 'itertools.islice allows slicing any iterable without materializing the whole sequence into a list.'
            }
          ]
        }
      }
    ],
    capstone: {
      id: 'SF-02-CAP',
      title: 'Resilient Micro-Batch Data Pipeline with Pydantic & Pytest',
      problemStatement: 'Build a modular Python ingestion pipeline ingesting raw messy telemetry logs, validating records with Pydantic schemas, routing corrupted payloads to a dead-letter directory, and loading valid records into DuckDB with full pytest test coverage.',
      businessScenario: 'Upstream IoT devices frequently send malformed timestamps and missing sensor values. The pipeline must never crash and provide full auditability.',
      deliverables: [
        'Modular Python package with typed classes and Pydantic validation models',
        'Streaming batch reader handling 1M simulated events under 200MB RAM',
        'Unit test suite with 90%+ code coverage using pytest and hypothesis for property-based testing',
        'Docker container packaging the ingestion worker with automated health checks'
      ],
      rubricItems: [
        {
          id: 'rb-1',
          criterion: 'Memory Footprint & Generator Utilization',
          weightPercent: 35,
          guidance: 'Zero in-memory list materialization of raw event streams; memory profile verified under 250MB.'
        },
        {
          id: 'rb-2',
          criterion: 'Schema Validation & Dead-Letter Handling',
          weightPercent: 35,
          guidance: 'Pydantic validation errors caught gracefully and dumped to JSON dead-letter queue with error reason.'
        },
        {
          id: 'rb-3',
          criterion: 'Test Quality & Modularity',
          weightPercent: 30,
          guidance: 'Pytest fixtures, mock external dependencies, clean separation between I/O, validation, and storage.'
        }
      ],
      portfolioOutput: 'Production-ready Python repository with poetry/pipenv packaging, pre-commit hooks (ruff, black, mypy), and CI test automation.'
    }
  },
  {
    id: 'SF-15',
    slug: 'distributed-processing-with-apache-spark-pyspark',
    title: 'Distributed Processing with Apache Spark & PySpark',
    subtitle: 'Catalyst optimizer, resilient distributed datasets, DataFrames, and distributed shuffle mechanics at scale.',
    outcomeStatement: 'Architect, execute, and troubleshoot massive-scale distributed batch ETL workloads using Apache Spark and PySpark.',
    description: 'Learn the core engine of modern big data engineering. Understand the Spark driver-executor architecture, DAG execution graphs, lazy evaluation, Catalyst query optimizer, physical plan generation, and data shuffling across distributed cluster nodes.',
    level: 'Intermediate',
    durationHours: 25,
    status: 'ready',
    featured: true,
    skills: ['Apache Spark 3.5+', 'PySpark', 'Catalyst Optimizer', 'Shuffling', 'Broadcast Joins', 'Windowing in Spark', 'Memory Management'],
    roleTags: ['Data Engineer', 'Big Data Engineer', 'Platform Architect'],
    toolTags: ['PySpark', 'Apache Spark', 'Hadoop HDFS', 'Delta Lake'],
    prerequisites: ['Python Software Engineering', 'ANSI SQL & Relational Algebra'],
    learningObjectives: [
      'Master the Spark distributed architecture: Driver, Cluster Manager, Executors, Tasks, and Slots',
      'Trace transformation graphs and differentiate Narrow vs Wide dependencies (shuffles)',
      'Analyze Spark UI stages, execution timelines, task skew, and garbage collection pauses',
      'Optimize multi-table joins using Broadcast Hash Joins and sort-merge joins',
      'Handle partition sizing, repartition vs coalesce, and avoid data skew traps'
    ],
    researchSources: [
      CURRICULUM_RESEARCH_SOURCES.iit_madras_ds,
      CURRICULUM_RESEARCH_SOURCES.nitk_surathkal_de,
      CURRICULUM_RESEARCH_SOURCES.nptel_dbms
    ],
    lastReviewed: '2026-03-01',
    diagnostic: {
      id: 'SF-15-DIAG',
      title: 'PySpark Placement Diagnostic',
      description: 'Test your understanding of distributed execution, transformations vs actions, and Spark UI metrics.',
      estimatedMinutes: 10,
      qualifySkipModuleId: 'sf-15-m1',
      questions: [
        {
          id: 'q1',
          question: 'Which of the following operations causes a stage boundary and network shuffle in Apache Spark?',
          options: [
            'df.filter(df["age"] > 30)',
            'df.select("name", "salary")',
            'df.groupBy("department_id").count()',
            'df.withColumn("bonus", df["salary"] * 0.1)'
          ],
          correctIndex: 2,
          explanation: 'groupBy involves a wide dependency where data with the same key across multiple partitions must be reshuffled across the network, creating a new Stage.',
          difficulty: 'Intermediate'
        }
      ]
    },
    modules: [
      {
        id: 'sf-15-m1',
        title: 'Spark Distributed Architecture & Execution Lifecycle',
        description: 'Driver, worker nodes, executors, slot allocation, and the transition from code to physical task execution.',
        estimatedMinutes: 100,
        objectives: [
          'Understand how the driver compiles DataFrame code into a Directed Acyclic Graph (DAG)',
          'Distinguish between Transformations (lazy) and Actions (eager trigger)',
          'Identify narrow vs wide dependencies in the physical plan'
        ],
        lessons: [
          {
            id: 'sf-15-l1',
            title: 'Transformations vs Actions & The Catalyst Pipeline',
            estimatedMinutes: 30,
            objective: 'Explain why Spark is lazy and how Catalyst optimizes queries before execution.',
            conceptBlocks: [
              {
                id: 'cb-1',
                title: 'Driver, Executors, and Lazy Evaluation',
                content: 'Apache Spark utilizes a master/worker architecture:\n\n- **Driver Node**: Runs your Python program, maintains the `SparkSession`, translates code into a DAG of execution stages, and schedules tasks across executors.\n- **Executors**: Worker processes that store cached partition blocks in RAM and execute computational tasks in parallel.\n\nIn Spark, operations fall into two categories:\n\n1. **Transformations** (`filter`, `select`, `groupBy`, `join`): **LAZY**. They do not compute anything immediately. They simply append an operator node to the logical execution plan.\n2. **Actions** (`count()`, `collect()`, `write.save()`, `show()`): **EAGER**. Actions trigger the Catalyst optimizer to compile the logical plan into optimized physical bytecode and dispatch tasks to executors.',
                seniorTip: 'Never call .collect() on large DataFrames! It pulls all distributed partitions across the network into the single Driver memory, immediately crashing the driver with OutOfMemoryError.',
                antiPattern: 'Interleaving actions and transformations in a loop, forcing Spark to repeatedly recompute the entire upstream DAG.'
              }
            ],
            exercise: {
              id: 'ex-15-1',
              type: 'pyspark',
              prompt: 'Write PySpark code to compute the total revenue and average order value per country from a transactions DataFrame, filtering only status == "completed".',
              starterCode: '# df: DataFrame with columns: [order_id, country, amount, status]\n# Write the aggregation using groupBy and agg\n',
              solutionCode: 'from pyspark.sql import functions as F\nresult_df = df.filter(F.col("status") == "completed") \\\n  .groupBy("country") \\\n  .agg(F.sum("amount").alias("total_revenue"), F.avg("amount").alias("avg_order_value"))',
              expectedOutputSnippet: 'country | total_revenue | avg_order_value',
              hints: ['Use F.col("status") == "completed", groupBy("country"), and agg(F.sum(), F.avg()).']
            },
            inlineChecks: [
              {
                id: 'ic-1',
                question: 'What happens when you run df.filter(...) followed by df.select(...) without calling an action?',
                options: [
                  'Data is downloaded from the cloud.',
                  'Spark partitions are filtered immediately in executor memory.',
                  'Nothing is executed on the cluster; only the logical execution plan is updated.',
                  'Spark creates a temporary table on disk.'
                ],
                correctIndex: 2,
                explanation: 'Transformations are strictly lazy. No cluster computation or I/O occurs until an action (like show, count, or write) is invoked.'
              }
            ]
          }
        ],
        quiz: {
          id: 'sf-15-q1',
          title: 'Spark Core Architecture Assessment',
          passingScorePercent: 70,
          questions: [
            {
              id: 'qz-1',
              question: 'Which component is responsible for translating unresolved logical plans into optimized physical execution plans in Spark?',
              options: ['Tungsten execution engine', 'Catalyst Optimizer', 'YARN NodeManager', 'Netty shuffle service'],
              correctIndex: 1,
              explanation: 'The Catalyst optimizer analyzes schemas, pushes down predicates, prunes columns, and chooses join strategies.'
            }
          ]
        }
      }
    ],
    capstone: {
      id: 'SF-15-CAP',
      title: 'Terabyte-Scale Clickstream Processing Engine with PySpark',
      problemStatement: 'Develop a distributed PySpark ETL pipeline that ingests 500 million web clickstream records, sessionizes user visits with a 30-minute inactivity threshold, computes conversion funnel drop-off metrics, and writes partition-optimized Parquet tables.',
      businessScenario: 'Marketing needs hourly attribution analytics across multi-touch clickstreams. Previous scripts ran out of memory during the sessionization step.',
      deliverables: [
        'PySpark application implementing sessionization using window functions and lag/cumulative sum',
        'Shuffle optimization configuration (spark.sql.shuffle.partitions, dynamic partition pruning)',
        'Spark UI event log benchmark report showing zero data spill to disk',
        'Automated pytest integration suite using local SparkSession fixtures'
      ],
      rubricItems: [
        {
          id: 'rb-1',
          criterion: 'Shuffle & Spill Elimination',
          weightPercent: 40,
          guidance: 'Zero disk spill (spill (memory) and spill (disk) = 0 in Spark UI stages); broadcast join used for dimension lookups.'
        },
        {
          id: 'rb-2',
          criterion: 'Sessionization Window Accuracy',
          weightPercent: 35,
          guidance: 'Correct user session demarcation using timestamp gaps > 30 mins and cumulative sum session IDs.'
        },
        {
          id: 'rb-3',
          criterion: 'Partition Strategy & File Sizing',
          weightPercent: 25,
          guidance: 'Output Parquet files sized optimally between 128MB and 256MB to avoid small file problems.'
        }
      ],
      portfolioOutput: 'Complete PySpark GitHub project with Dockerized Spark master/worker cluster, sample dataset generator, and benchmarking report.'
    }
  },
  {
    id: 'SF-18',
    slug: 'databricks-lakehouse-platform-medallion-architecture',
    title: 'Databricks Lakehouse Platform & Medallion Architecture',
    subtitle: 'Unity Catalog, Delta Lake ACID transactions, Delta Live Tables (DLT), and multi-hop data architecture.',
    outcomeStatement: 'Architect and deploy enterprise-grade Medallion Lakehouse architectures on Databricks utilizing Delta Lake, Unity Catalog governance, and automated streaming pipelines.',
    description: 'Master the Databricks Lakehouse ecosystem. Understand the storage layer mechanics of Delta Lake (transaction logs, Parquet files, CRC verification, snapshot isolation), design Bronze-Silver-Gold multi-hop architectures, implement change data capture with MERGE INTO, and govern data assets with Unity Catalog.',
    level: 'Intermediate to Advanced',
    durationHours: 20,
    status: 'ready',
    featured: true,
    skills: ['Databricks', 'Delta Lake', 'Medallion Architecture', 'Unity Catalog', 'Delta Live Tables (DLT)', 'Liquid Clustering', 'Auto Loader'],
    roleTags: ['Data Engineer', 'Platform Architect', 'Analytics Engineer'],
    toolTags: ['Databricks', 'Delta Lake', 'PySpark', 'Unity Catalog'],
    prerequisites: ['PySpark Foundations', 'Relational Database Fundamentals'],
    learningObjectives: [
      'Understand Delta Lake ACID guarantees and the _delta_log protocol',
      'Design Medallion multi-hop architectures: Bronze (raw append), Silver (cleaned/deduped), Gold (curated business marts)',
      'Perform high-performance upserts and SCD Type 2 handling via MERGE INTO',
      'Implement cloud file streaming with Databricks Auto Loader (cloudFiles)',
      'Enforce fine-grained row/column access policies using Unity Catalog'
    ],
    researchSources: [
      CURRICULUM_RESEARCH_SOURCES.apache_parquet_arrow,
      CURRICULUM_RESEARCH_SOURCES.nitk_surathkal_de
    ],
    lastReviewed: '2026-03-01',
    diagnostic: {
      id: 'SF-18-DIAG',
      title: 'Databricks & Delta Lake Diagnostic',
      description: 'Evaluate your knowledge of Delta transaction logs, compaction, and Medallion architecture.',
      estimatedMinutes: 10,
      qualifySkipModuleId: 'sf-18-m1',
      questions: [
        {
          id: 'q1',
          question: 'How does Delta Lake achieve ACID transactions on top of object storage like S3 or ADLS?',
          options: [
            'By locking the entire cloud storage bucket during writes.',
            'Using an append-only JSON transaction log (_delta_log) that tracks atomic commits, schema changes, and file additions/removals.',
            'By storing all data in a centralized MySQL database.',
            'By rewriting all files on every single INSERT.'
          ],
          correctIndex: 1,
          explanation: 'Delta Lake uses the _delta_log directory containing ordered JSON commit files and periodic checkpoint Parquet files to provide serializable ACID guarantees.',
          difficulty: 'Intermediate'
        }
      ]
    },
    modules: [
      {
        id: 'sf-18-m1',
        title: 'Delta Lake Storage Internals & The Transaction Log',
        description: 'Deep dive into Parquet file storage, JSON commits, optimistic concurrency control, and time travel.',
        estimatedMinutes: 90,
        objectives: [
          'Trace the anatomy of the _delta_log directory',
          'Execute time-travel queries using VERSION AS OF and TIMESTAMP AS OF',
          'Optimize file layouts using OPTIMIZE and VACUUM'
        ],
        lessons: [
          {
            id: 'sf-18-l1',
            title: 'The _delta_log Protocol: How ACID Works on Cloud Storage',
            estimatedMinutes: 25,
            objective: 'Understand how Delta Lake achieves atomicity and isolation on cloud object storage.',
            conceptBlocks: [
              {
                id: 'cb-1',
                title: 'The Append-Only Transaction Log',
                content: 'Cloud object storage (S3, ADLS, GCS) does not support atomic multi-file transactions or POSIX file locks. Delta Lake solves this by introducing a transaction log stored alongside the data in `_delta_log/`.\n\nEvery write produces an atomic commit file: `000000.json`, `000001.json`, etc. Each commit records:\n- `add`: Path and statistics (min/max values, row count) of newly written Parquet files.\n- `remove`: Logical deletion of obsolete Parquet files.\n\nWhen a reader queries the table, it reconstructs the current state by reading the log. Deleted files are simply ignored, allowing concurrent readers to query snapshots without being blocked by ongoing writes (Optimistic Concurrency Control)!',
                seniorTip: 'Be cautious with VACUUM! Running VACUUM with retention set to 0 hours permanently deletes physically removed files, breaking time travel and failing concurrent active reader queries.',
                antiPattern: 'Modifying or deleting Parquet files directly from the cloud bucket without going through the Delta transaction log, which corrupts table state.'
              }
            ],
            exercise: {
              id: 'ex-18-1',
              type: 'sql',
              prompt: 'Write a Delta Lake MERGE INTO query that upserts updates into a silver_customers table based on customer_id.',
              starterCode: '-- Target: silver_customers (customer_id, email, address, updated_at)\n-- Source: updates_stage\nMERGE INTO silver_customers AS target\nUSING updates_stage AS source\n-- Write matching and non-matching conditions\n',
              solutionCode: 'MERGE INTO silver_customers AS target\nUSING updates_stage AS source\nON target.customer_id = source.customer_id\nWHEN MATCHED THEN\n  UPDATE SET target.email = source.email, target.address = source.address, target.updated_at = source.updated_at\nWHEN NOT MATCHED THEN\n  INSERT (customer_id, email, address, updated_at) VALUES (source.customer_id, source.email, source.address, source.updated_at);',
              expectedOutputSnippet: 'MERGE INTO completed successfully',
              hints: ['Use ON target.customer_id = source.customer_id, WHEN MATCHED THEN UPDATE, and WHEN NOT MATCHED THEN INSERT.']
            },
            inlineChecks: [
              {
                id: 'ic-1',
                question: 'What happens physically to older Parquet files when an UPDATE or MERGE statement updates 10 rows in a Delta table?',
                options: [
                  'The original Parquet files are rewritten in place.',
                  'The new data is written to new Parquet files, and the old files are marked as "remove" in the commit JSON while remaining physically on disk.',
                  'The data is deleted forever immediately.',
                  'The updates are stored only in RAM.'
                ],
                correctIndex: 1,
                explanation: 'Delta Lake uses Copy-on-Write / Merge-on-Read. Parquet files are immutable; modified partitions are written to new files, and the commit log records the logical transition.'
              }
            ]
          }
        ],
        quiz: {
          id: 'sf-18-q1',
          title: 'Delta Lake Internals Assessment',
          passingScorePercent: 70,
          questions: [
            {
              id: 'qz-1',
              question: 'Which Databricks command combines small Parquet files into optimal ~1GB files?',
              options: ['VACUUM', 'OPTIMIZE', 'COMPACT', 'REORGANIZE'],
              correctIndex: 1,
              explanation: 'OPTIMIZE bin-packs small files into larger target files to maximize scan throughput.'
            }
          ]
        }
      }
    ],
    capstone: {
      id: 'SF-18-CAP',
      title: 'Enterprise Medallion Architecture on Databricks with Unity Catalog',
      problemStatement: 'Build a production multi-hop Medallion pipeline ingesting high-velocity e-commerce orders. Auto Load raw JSON into Bronze, perform schema enforcement and deduplication in Silver, and publish Gold business aggregations with row-level security masks via Unity Catalog.',
      businessScenario: 'The business needs compliant PII masking and instant time-travel auditing for financial audit readiness.',
      deliverables: [
        'Databricks notebook/script configuring Auto Loader ingestion with cloudFiles',
        'Silver layer PySpark MERGE pipeline maintaining SCD Type 1 & 2 history',
        'Gold reporting views with Unity Catalog dynamic column masks (masking credit cards and emails)',
        'Delta table optimization script incorporating Z-ORDER and automated vacuum schedules'
      ],
      rubricItems: [
        {
          id: 'rb-1',
          criterion: 'Medallion Architecture Separation',
          weightPercent: 40,
          guidance: 'Clear separation of concerns across Bronze (raw append), Silver (cleaned/typed), and Gold (aggregate).'
        },
        {
          id: 'rb-2',
          criterion: 'ACID Merge & Late-Data Handling',
          weightPercent: 35,
          guidance: 'Correct MERGE statements with deterministic handling of late-arriving records.'
        },
        {
          id: 'rb-3',
          criterion: 'Unity Catalog Governance & Masking',
          weightPercent: 25,
          guidance: 'Demonstrate functional row/column level security policies verified by test queries.'
        }
      ],
      portfolioOutput: 'Databricks asset bundle repository with Delta Live Tables pipeline definition and governance specifications.'
    }
  },
  {
    id: 'SF-21',
    slug: 'distributed-systems-architecture-data-consistency',
    title: 'Distributed Systems Architecture & Data Consistency',
    subtitle: 'CAP theorem, consensus algorithms (Raft/Paxos), distributed transactions, write-ahead logging, and replication.',
    outcomeStatement: 'Design robust distributed data systems that balance consistency, availability, and latency across network partitions.',
    description: 'The theoretical and systems-level backbone of modern data engineering. Synthesizes principles from distributed computing research at IIT Bombay, MIT 6.824, and Google Spanner papers. Understand network partitions, split-brain syndromes, consensus protocols (Raft, Paxos), vector clocks, distributed 2PC vs Saga patterns, and write-ahead logs.',
    level: 'Advanced',
    durationHours: 22,
    status: 'ready',
    featured: true,
    skills: ['CAP Theorem', 'PACELC', 'Raft Consensus', 'Distributed Transactions (2PC & Saga)', 'Write-Ahead Logging (WAL)', 'Replication & Sharding', 'Vector Clocks'],
    roleTags: ['Principal Data Engineer', 'Platform Architect', 'Distributed Systems Engineer'],
    toolTags: ['Kafka', 'Zookeeper/KRaft', 'Spanner', 'Cassandra'],
    prerequisites: ['Operating Systems Fundamentals', 'Data Structures & Algorithms'],
    learningObjectives: [
      'Deconstruct the CAP theorem and apply PACELC trade-offs to storage selection',
      'Explain consensus protocol state machines (Raft leader election and log replication)',
      'Compare Two-Phase Commit (2PC) with the Saga pattern for distributed consistency',
      'Design partitioning and sharding schemes that prevent hot spots',
      'Understand how Write-Ahead Logging (WAL) and LSM Trees enable crash recovery and fast writes'
    ],
    researchSources: [
      CURRICULUM_RESEARCH_SOURCES.iit_bombay_cse,
      CURRICULUM_RESEARCH_SOURCES.nitk_surathkal_de
    ],
    lastReviewed: '2026-03-01',
    diagnostic: {
      id: 'SF-21-DIAG',
      title: 'Distributed Systems Diagnostic',
      description: 'Assess your knowledge of distributed consensus, consistency models, and transaction protocols.',
      estimatedMinutes: 10,
      qualifySkipModuleId: 'sf-21-m1',
      questions: [
        {
          id: 'q1',
          question: 'According to the PACELC theorem, if there is NO network partition, what fundamental trade-off must a distributed system make?',
          options: [
            'Security vs Speed',
            'Latency vs Consistency',
            'Cost vs Availability',
            'Throughput vs Durability'
          ],
          correctIndex: 1,
          explanation: 'PACELC states: If Partition (P), choose Availability (A) or Consistency (C); Else (E), choose Latency (L) or Consistency (C).',
          difficulty: 'Advanced'
        }
      ]
    },
    modules: [
      {
        id: 'sf-21-m1',
        title: 'Consensus Mechanics & Log-Structured Storage',
        description: 'How nodes agree on state in asynchronous networks prone to packet loss, clock drift, and node crashes.',
        estimatedMinutes: 100,
        objectives: [
          'Trace Raft consensus leader election and log replication terms',
          'Understand Log-Structured Merge (LSM) trees vs B-trees for write-heavy systems',
          'Differentiate strong consistency from eventual and read-your-writes consistency'
        ],
        lessons: [
          {
            id: 'sf-21-l1',
            title: 'LSM Trees vs B+ Trees: Write Amplification and Storage Engines',
            estimatedMinutes: 30,
            objective: 'Compare LSM trees (Cassandra, RocksDB) and B+ Trees (PostgreSQL, InnoDB) under write-heavy workloads.',
            conceptBlocks: [
              {
                id: 'cb-1',
                title: 'Why Distributed Stores Choose LSM Trees',
                content: 'Traditional databases use B+ Trees. While B+ Trees provide fast point reads via binary search, updating a random row requires a random disk write to a specific page. On distributed distributed storage, random I/O incurs heavy write amplification.\n\n**Log-Structured Merge (LSM) Trees** (used in RocksDB, Kafka, Bigtable, Cassandra) replace random writes with sequential append-only writes:\n\n1. **MemTable**: Incoming writes append to an in-memory sorted skip list or red-black tree, simultaneously appending to an on-disk Write-Ahead Log (WAL) for durability.\n2. **SSTables (Sorted String Tables)**: When MemTable reaches a threshold (e.g. 64MB), it is flushed to disk as an immutable SSTable file.\n3. **Compaction**: Background threads continuously merge overlapping SSTables, purging tombstones (deleted records) and keeping read latency low.\n\nThis turns random write workloads into sequential writes, maximizing throughput by orders of magnitude!',
                seniorTip: 'Understand the trade-off: LSM trees trade read performance and compaction background CPU overhead for hyper-fast sequential write speeds.',
                antiPattern: 'Using an LSM-based storage engine for a system with 99% random point reads and 1% writes.'
              }
            ],
            exercise: {
              id: 'ex-21-1',
              type: 'decision',
              prompt: 'Evaluate a high-frequency telemetry ingestion architecture receiving 500,000 sensor updates/second with low write latency requirements. Compare LSM Tree vs B+ Tree and select the optimal engine with justification.',
              starterCode: '// Architectural decision memo:\n// Recommended Engine: [LSM Tree | B+ Tree]\n// Primary Rationale:\n// Key Risk & Mitigation Strategy:\n',
              solutionCode: 'Recommended Engine: LSM Tree\nPrimary Rationale: Sequential append-only writes eliminate random disk seek bottlenecks under 500k writes/sec.\nKey Risk & Mitigation Strategy: Compaction debt can cause read/write stalls; mitigate with partitioned leveled compaction and SSD storage.',
              expectedOutputSnippet: 'LSM Tree selected with compaction debt mitigation',
              hints: ['High write throughput favors sequential disk writes over random in-place updates.']
            },
            inlineChecks: [
              {
                id: 'ic-1',
                question: 'Why does an LSM tree require a Write-Ahead Log (WAL) if writes are stored in the in-memory MemTable?',
                options: [
                  'To sort the data for reads.',
                  'Because RAM is volatile; if the node crashes before the MemTable flushes to disk, the WAL is replayed to restore state without data loss.',
                  'To compress the data with gzip.',
                  'To send data to downstream Kafka consumers.'
                ],
                correctIndex: 1,
                explanation: 'A Write-Ahead Log is written sequentially to disk before acknowledging the client write, guaranteeing durability even if power is lost immediately after.'
              }
            ]
          }
        ],
        quiz: {
          id: 'sf-21-q1',
          title: 'Distributed Systems Core Assessment',
          passingScorePercent: 70,
          questions: [
            {
              id: 'qz-1',
              question: 'In the Raft consensus algorithm, what prevents two nodes from simultaneously declaring themselves leader in the same term?',
              options: [
                'A centralized hardware clock',
                'Each node can vote for at most one candidate per term, requiring a strict majority (quorum) to win.',
                'The candidate with the largest IP address always wins.',
                'Candidate nodes ping all other nodes via UDP.'
              ],
              correctIndex: 1,
              explanation: 'Quorum rules dictate that any two majorities must overlap by at least one node. Because a node votes at most once per term, only one candidate can achieve a majority.'
            }
          ]
        }
      }
    ],
    capstone: {
      id: 'SF-21-CAP',
      title: 'Fault-Tolerant Distributed Consensus & Storage Engine Specification',
      problemStatement: 'Design a distributed key-value metadata store supporting strong linearizable reads and atomic multi-key updates for a distributed query engine coordinator. Specify leader election, quorum replication, WAL durability, and network partition recovery under split-brain conditions.',
      businessScenario: 'During network flapping between data centers, the coordinator suffered a split-brain condition where two leaders accepted conflicting query state changes, resulting in duplicate task assignments.',
      deliverables: [
        'Detailed Distributed System Architecture Document covering quorum math, heartbeat timers, and epoch fencing',
        'State transition diagram for leader election and log reconciliation after network partition heals',
        'Compaction and snapshotting strategy for the Write-Ahead Log to keep node recovery times under 30 seconds',
        'Failure injection test matrix simulating lost packets, dead followers, and partitioned leaders'
      ],
      rubricItems: [
        {
          id: 'rb-1',
          criterion: 'Quorum Correctness & Fencing',
          weightPercent: 40,
          guidance: 'Demonstrate how epoch numbers and generation IDs prevent stale zombie leaders from executing writes.'
        },
        {
          id: 'rb-2',
          criterion: 'Linearizability & Read/Write Protocols',
          weightPercent: 35,
          guidance: 'Show how read indexes or lease reads prevent returning stale data without incurring full consensus overhead.'
        },
        {
          id: 'rb-3',
          criterion: 'Disaster Recovery & Recovery Time Objective (RTO)',
          weightPercent: 25,
          guidance: 'Clear snapshot replay protocol restoring node state within required RTO boundaries.'
        }
      ],
      portfolioOutput: 'Formal Distributed System Design Specification whitepaper and interactive simulation script.'
    }
  }
];
