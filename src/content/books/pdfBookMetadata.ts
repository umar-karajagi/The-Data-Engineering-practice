import { BookReference, BookQuizQuestion, BookConceptCard } from '../../types';

export function getEnhancedPdfMetadata(fileName: string, fileSizeBytes: number): Partial<BookReference> {
  const lower = fileName.toLowerCase();

  // 1. The Data Warehouse Toolkit (Ralph Kimball)
  if (lower.includes('kimball') || lower.includes('warehouse_toolkit')) {
    return {
      title: 'The Data Warehouse Toolkit (3rd Edition)',
      author: 'Ralph Kimball & Margy Ross',
      coverColor: '#14B8A6',
      track: 'warehousing',
      coreConcepts: ['Dimensional Modeling', 'Kimball 4-Step Design', 'SCD Types 1, 2, 3, 6', 'Conformed Dimensions', 'Fact Table Types', 'Degenerate & Junk Dimensions'],
      description: 'The definitive classic on dimensional modeling for business intelligence, OLAP star schemas, and enterprise data architecture.',
      keyTakeaways: [
        'Always declare the grain of the fact table before picking dimensions or numeric measures.',
        'Conformed dimensions enable cross-functional drill-across queries across disparate business processes.',
        'SCD Type 2 provides a complete audit trail using effective/expiration timestamps and surrogate keys.'
      ],
      chapters: [
        {
          id: 'kimball-ch1-primer',
          number: 1,
          title: 'Dimensional Modeling Fundamentals & OLAP vs OLTP',
          readingTime: '15 min',
          summary: 'Why normalized 3NF structures fail for analytical queries, and how Star Schemas unlock sub-second aggregations.',
          content: 'Dimensional modeling organizes data for simplicity and performance. 3NF reduces write redundancy for transaction systems, but requires 10-way joins that cripple analytics. Star schemas isolate quantitative facts from qualitative dimensions.',
          seniorTip: 'Never expose raw 3NF operational tables to reporting dashboards or LLM analytics agents.',
        },
        {
          id: 'kimball-ch2-grain',
          number: 2,
          title: 'The Kimball 4-Step Dimensional Design Process',
          readingTime: '20 min',
          summary: '1. Select Business Process, 2. Declare Grain, 3. Identify Dimensions, 4. Identify Facts.',
          content: 'Step 1: Select the operational business process (e.g. Sales, Claims, Orders).\nStep 2: Declare the Grain. Exactly what does one row represent? (e.g. One line item on a customer receipt).\nStep 3: Choose dimensions that describe the event (Who, What, Where, When, Why).\nStep 4: Choose numeric additive facts that measure the event.',
          seniorTip: 'Declaring the grain is the most critical step. Mixing grains in a single fact table causes silent, catastrophic double-counting.',
        },
        {
          id: 'kimball-ch3-scd',
          number: 3,
          title: 'Slowly Changing Dimensions (SCD 1, 2, 3, 4, 6)',
          readingTime: '25 min',
          summary: 'Tracking customer, product, and territory mutations over time without compromising historical reporting accuracy.',
          content: 'Type 1: Overwrite existing attribute (no history preserved).\nType 2: Insert new row with surrogate key, effective_date, expiration_date, and is_current flag.\nType 3: Add an adjacent column to track prior state.\nType 6: Hybrid pattern combining Type 1 + 2 + 3.',
          seniorTip: 'Always use auto-incrementing or hash Surrogate Keys as dimension primary keys rather than operational Natural Keys.',
        },
        {
          id: 'kimball-ch4-bus',
          number: 4,
          title: 'Enterprise Data Warehouse Bus Architecture',
          readingTime: '18 min',
          summary: 'Conformed dimensions and conformed facts enable decentralized teams to build modular data marts that drill across.',
          content: 'The Bus Architecture creates conformed dimensions shared across multiple fact tables, allowing cross-department drill-across joins.',
          seniorTip: 'A common data contract or shared dimension model prevents duplicate siloed dimensions across business units.',
        },
        {
          id: 'kimball-ch5-facts',
          number: 5,
          title: 'Fact Table Types: Transaction, Periodic & Accumulating',
          readingTime: '22 min',
          summary: 'Three fundamental fact table archetypes: point-in-time transactions, monthly snapshots, and workflow lifecycle tracking.',
          content: '1. Transaction Fact: One row per discrete event.\n2. Periodic Snapshot: One row per entity at regular intervals.\n3. Accumulating Snapshot: One row per workflow instance with milestone timestamp columns updated as the order moves through stages.',
          seniorTip: 'Accumulating snapshot tables are the gold standard for tracking cycle times and pipeline latency bottlenecks.',
        }
      ],
      conceptCards: [
        {
          id: 'cc-1',
          title: 'The Golden Grain Rule',
          ruleOfThumb: 'Always declare the grain before choosing dimensions or facts.',
          explanation: 'The grain defines the atomic reality of a single row. If you violate the grain, aggregations like SUM() and AVG() will return duplicate or nonsensical calculations.',
          antiPattern: 'Combining order headers and line-item details in the same fact row.',
          category: 'Core Modeling'
        },
        {
          id: 'cc-2',
          title: 'Surrogate Keys vs Natural Keys',
          ruleOfThumb: 'Dimension primary keys must always be synthetic surrogate keys.',
          explanation: 'Surrogate keys isolate the analytical warehouse from operational system recycling of IDs, multi-system key collisions, and historical SCD Type 2 mutations.',
          antiPattern: 'Using user_id or SSN directly as the foreign key target in fact tables.',
          category: 'Keys & Identity'
        },
        {
          id: 'cc-3',
          title: 'Conformed Dimensions',
          ruleOfThumb: 'A conformed dimension means either identical or a strict mathematical subset.',
          explanation: 'When finance and marketing query the same customer dimension, conformed dimensions guarantee that customer revenue figures match across all executive dashboards.',
          antiPattern: 'Creating separate dim_customer_sales and dim_customer_finance tables.',
          category: 'Bus Architecture'
        },
        {
          id: 'cc-4',
          title: 'Degenerate Dimensions',
          ruleOfThumb: 'Dimension keys that live directly in the fact table with no separate dimension table.',
          explanation: 'Operational identifiers like order_number or invoice_id are stored in the fact table itself to group line items without wasting space on empty dimension tables.',
          antiPattern: 'Creating a separate dimension table that contains only an invoice number and nothing else.',
          category: 'Dimensions'
        },
        {
          id: 'cc-5',
          title: 'Junk Dimensions',
          ruleOfThumb: 'Consolidate multiple low-cardinality status flags into a single dimension table.',
          explanation: 'Instead of creating 8 separate dimension tables for binary indicators (is_gift, is_discounted, is_returned), combine them into a single junk dimension of Cartesian combinations.',
          antiPattern: 'Adding 10 separate foreign keys to the fact table for yes/no flags.',
          category: 'Optimization'
        }
      ],
      quizQuestions: [
        {
          id: 'q-kimball-1',
          chapterNumber: 2,
          question: 'In the Kimball 4-step dimensional design process, which step MUST be declared before identifying dimensions and facts?',
          options: [
            'Create physical B-Tree indexes on the database table',
            'Declare the grain (atomic definition of exactly one row)',
            'Choose between Snowflake Schema and Star Schema',
            'Partition the Parquet files by month on Cloud Storage'
          ],
          correctIndex: 1,
          explanation: 'The grain is the foundational contract. You cannot know which dimensions or numeric facts belong in the table until you know what one row represents.',
          sourceChapter: 'Chapter 2: The Kimball 4-Step Process'
        },
        {
          id: 'q-kimball-2',
          chapterNumber: 3,
          question: 'A customer moves from Texas to California. The business wants prior Texas sales to remain attributed to Texas, while new sales reflect California. Which SCD pattern is required?',
          options: [
            'SCD Type 1 (Overwrite existing customer state in-place)',
            'SCD Type 2 (Insert new row with surrogate key, effective dates, and is_current flag)',
            'SCD Type 0 (Retain original Texas state forever, ignore move)',
            'Snowflake 3NF normalization with junction tables'
          ],
          correctIndex: 1,
          explanation: 'SCD Type 2 is the industry standard for historical tracking. It creates a new dimension row with an updated surrogate key so prior fact records link to Texas while new fact records link to California.',
          sourceChapter: 'Chapter 3: Slowly Changing Dimensions'
        },
        {
          id: 'q-kimball-3',
          chapterNumber: 4,
          question: 'What is the primary benefit of Conformed Dimensions in an Enterprise Data Warehouse Bus Architecture?',
          options: [
            'Reduces disk storage usage by 90%',
            'Enables cross-functional drill-across queries across multiple disparate fact tables',
            'Allows transactions to be processed with ACID 2-phase commits',
            'Replaces distributed shuffles with broadcast joins automatically'
          ],
          correctIndex: 1,
          explanation: 'Conformed dimensions allow separate business process fact tables to be joined in drill-across queries because they share identical dimension definitions and keys.',
          sourceChapter: 'Chapter 4: Enterprise Bus Architecture'
        },
        {
          id: 'q-kimball-4',
          chapterNumber: 5,
          question: 'Which fact table type is ideal for tracking an e-commerce order from Order Placed -> Payment Captured -> Warehouse Picked -> Shipped -> Delivered?',
          options: [
            'Transaction Fact Table',
            'Periodic Snapshot Fact Table',
            'Accumulating Snapshot Fact Table',
            'Factless Fact Table'
          ],
          correctIndex: 2,
          explanation: 'Accumulating snapshot fact tables contain milestone timestamp columns that are updated as an individual workflow evolves, allowing instant calculation of cycle times and bottleneck latency.',
          sourceChapter: 'Chapter 5: Fact Table Types'
        },
        {
          id: 'q-kimball-5',
          chapterNumber: 6,
          question: 'What is a Degenerate Dimension in dimensional modeling?',
          options: [
            'A dimension table with corrupted or invalid surrogate keys',
            'A transaction identifier (like invoice_number or tracking_id) stored directly in the fact table without a dimension table',
            'A dimension that changes every few seconds',
            'A dimension table containing more than 1,000 columns'
          ],
          correctIndex: 1,
          explanation: 'Degenerate dimensions are operational control identifiers (like invoice_number) that have no supporting attributes and reside directly inside the fact table.',
          sourceChapter: 'Chapter 6: Degenerate & Junk Dimensions'
        }
      ]
    };
  }

  // 2. Designing Data-Intensive Applications (Martin Kleppmann)
  if (lower.includes('data-intensive') || lower.includes('kleppmann') || lower.includes('ddia')) {
    return {
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      coverColor: '#A855F7',
      track: 'architecture',
      coreConcepts: ['LSM-Trees vs B-Trees', 'Replication (Leaderless, Multi-Leader)', 'Consensus & Raft', 'ACID Transactions & SSI', 'Event Sourcing & Stream Processing'],
      description: 'The definitive deep-dive into distributed systems, storage engine primitives, replication trade-offs, and data reliability at scale.',
      keyTakeaways: [
        'LSM-Trees optimize for write throughput using sequential log append and background compaction.',
        'Quorum reads and writes (W + R > N) guarantee strong consistency in leaderless distributed databases.',
        'Linearizability provides the illusion of a single copy of data, while eventual consistency prioritizes availability.'
      ],
      chapters: [
        {
          id: 'ddia-ch3',
          number: 3,
          title: 'Storage and Retrieval: SSTables, LSM-Trees & B-Trees',
          readingTime: '25 min',
          summary: 'How databases physically store bytes on disk: Append-only write logs, SSTables, and write amplification.',
          content: 'LSM-Trees (RocksDB, Cassandra, Kafka) buffer writes in memory (Memtable) and flush to disk sequentially as Sorted String Tables (SSTables). B-Trees (PostgreSQL, MySQL) write in 4KB-16KB random disk pages.',
          seniorTip: 'Always size Cassandra and Kafka clusters to accommodate background SSTable compaction I/O spikes.',
        },
        {
          id: 'ddia-ch5',
          number: 5,
          title: 'Replication: Leaders, Followers & Leaderless Quorums',
          readingTime: '30 min',
          summary: 'Single-leader, multi-leader, and Dynamo-style leaderless replication with Sloppy Quorums and Hinted Handoff.',
          content: 'In leaderless systems (Cassandra, DynamoDB), writes and reads succeed based on quorum arithmetic: W + R > N guarantees the read set overlaps with the write set by at least one up-to-date replica.',
          seniorTip: 'Replication lag can cause "backward in time" reads. Enforce monotonic reads or read-your-writes consistency for user sessions.',
        }
      ],
      conceptCards: [
        {
          id: 'cc-ddia-1',
          title: 'LSM-Tree Write Amplification',
          ruleOfThumb: 'Sequential disk writes make LSM-trees 10x faster for data ingestion than B-Trees.',
          explanation: 'Because disk writes are strictly sequential appends to an immutable SSTable, LSM-trees avoid random write head movement. Background compaction merges duplicate keys later.',
          antiPattern: 'Writing random UUID primary keys to a B-Tree index at 50,000 writes/sec.',
          category: 'Storage Engines'
        },
        {
          id: 'cc-ddia-2',
          title: 'Quorum Condition (W + R > N)',
          ruleOfThumb: 'If write quorum W plus read quorum R exceeds replica count N, strong consistency is guaranteed.',
          explanation: 'In a 3-node cluster (N=3), requiring W=2 and R=2 guarantees that at least one node in every read request received the latest confirmed write.',
          antiPattern: 'Setting W=1, R=1 on critical financial balances in Cassandra.',
          category: 'Distributed Replication'
        }
      ],
      quizQuestions: [
        {
          id: 'q-ddia-1',
          chapterNumber: 3,
          question: 'Why are LSM-Trees (Log-Structured Merge-Trees) significantly faster for high-throughput write ingestion than traditional B-Trees?',
          options: [
            'LSM-Trees do not persist data to disk, keeping everything in RAM',
            'LSM-Trees perform strictly sequential appends to an in-memory Memtable and disk SSTables, avoiding costly random I/O page updates',
            'LSM-Trees do not require index lookups',
            'LSM-Trees run in parallel across multiple CPU cores without thread locks'
          ],
          correctIndex: 1,
          explanation: 'B-Trees must overwrite random pages on disk for every write. LSM-Trees append writes sequentially, which is orders of magnitude faster on both HDDs and SSDs.',
          sourceChapter: 'Chapter 3: Storage and Retrieval'
        },
        {
          id: 'q-ddia-2',
          chapterNumber: 5,
          question: 'In a distributed database with 5 replicas (N=5), which configuration of Write Quorum (W) and Read Quorum (R) guarantees strong consistency?',
          options: [
            'W = 1, R = 1',
            'W = 2, R = 2',
            'W = 3, R = 3',
            'W = 2, R = 3'
          ],
          correctIndex: 2,
          explanation: 'The quorum formula requires W + R > N. With N = 5, W = 3 and R = 3 yields W + R = 6 > 5. This guarantees that any read quorum will overlap with the write quorum on at least one node.',
          sourceChapter: 'Chapter 5: Replication'
        }
      ]
    };
  }

  // 3. Fundamentals of Data Engineering (Reis & Housley)
  if (lower.includes('fundamentals_of_data_engineering') || lower.includes('reis') || lower.includes('housley')) {
    return {
      title: 'Fundamentals of Data Engineering',
      author: 'Joe Reis & Matt Housley',
      coverColor: '#3B82F6',
      track: 'architecture',
      coreConcepts: ['Data Engineering Lifecycle', 'Undercurrents of Data Engineering', 'Storage Tiers', 'Ingestion Paradigms', 'Serving & Analytics'],
      description: 'The end-to-end framework covering the full data engineering lifecycle: generation, storage, ingestion, transformation, and serving.',
      keyTakeaways: [
        'The Data Engineering Lifecycle consists of Generation, Storage, Ingestion, Transformation, and Serving.',
        'Six critical undercurrents cross all stages: Security, Data Management, DataOps, Data Architecture, Orchestration, and Software Engineering.',
        'Choose boring, resilient technologies that match the team maturity and business SLA requirements.'
      ],
      chapters: [
        {
          id: 'reis-ch1',
          number: 1,
          title: 'Data Engineering Described & The Lifecycle',
          readingTime: '20 min',
          summary: 'The evolution from database administration to data engineering and the 5 stages of the data engineering lifecycle.',
          content: 'Data engineering takes data from source generation systems, stores it reliably, ingests it via batch or streaming, transforms it to business value, and serves it to analysts, ML models, and downstream applications.',
          seniorTip: 'Always align pipeline architectures with the 6 undercurrents: security, data management, DataOps, architecture, orchestration, and software engineering.',
        }
      ],
      conceptCards: [
        {
          id: 'cc-reis-1',
          title: 'The Data Engineering Undercurrents',
          ruleOfThumb: 'Security, DataOps, and Data Management are not afterthoughts; they flow beneath every pipeline stage.',
          explanation: 'A pipeline that transforms petabytes in 5 minutes is worthless if security is breached or data governance lacks lineage.',
          antiPattern: 'Building an ETL pipeline with hardcoded credentials and zero schema validation.',
          category: 'Lifecycle'
        }
      ],
      quizQuestions: [
        {
          id: 'q-reis-1',
          chapterNumber: 1,
          question: 'According to Reis & Housley, which of the following is considered one of the critical "Undercurrents" of the Data Engineering Lifecycle?',
          options: [
            'Deep Learning Optimization',
            'DataOps and Observability',
            'Frontend React Rendering',
            'Operating System Kernel Compilation'
          ],
          correctIndex: 1,
          explanation: 'DataOps, along with Security, Data Management, Data Architecture, Orchestration, and Software Engineering, represents the cross-cutting undercurrents of professional data engineering.',
          sourceChapter: 'Chapter 2: The Data Engineering Lifecycle'
        }
      ]
    };
  }

  // 4. Kafka: The Definitive Guide (Gwen Shapira, Todd Palino)
  if (lower.includes('kafka') || lower.includes('stream_processing')) {
    return {
      title: 'Kafka: The Definitive Guide (2nd Edition)',
      author: 'Gwen Shapira, Todd Palino, Rajini Sivaram, Krit Petty',
      coverColor: '#F97316',
      track: 'pyspark',
      coreConcepts: ['Partition Log Architecture', 'Producer Acks (acks=all)', 'Consumer Groups & Rebalancing', 'Sticky Assignors', 'Exactly-Once Semantics (EOS)'],
      description: 'The master reference for real-time distributed streaming, message brokers, log compaction, and event-driven data architectures.',
      keyTakeaways: [
        'Partitions are the unit of parallelism, ordering, and replication in Apache Kafka.',
        'Set acks=all and min.insync.replicas=2 to prevent data loss on broker leadership failovers.',
        'Consumer group rebalances can cause latency spikes; use Cooperative Sticky Assignors for smooth partition migration.'
      ],
      chapters: [
        {
          id: 'kafka-ch1',
          number: 1,
          title: 'Meet Kafka: The Distributed Commit Log',
          readingTime: '18 min',
          summary: 'How append-only distributed logs decouple publishers from subscribers with zero disk seek penalties.',
          content: 'Kafka treats events as immutable ordered records in partition logs. Producers append to the tail, consumers read via offset pointers, and brokers rely on Linux Page Cache zero-copy file transfer.',
          seniorTip: 'Always calculate partition counts based on target consumer group scale and throughput demands.',
        }
      ],
      conceptCards: [
        {
          id: 'cc-kafka-1',
          title: 'Producer Reliability Contract',
          ruleOfThumb: 'Use acks=all combined with min.insync.replicas=2 for zero-loss ingestion.',
          explanation: 'If a broker crashes before replicating an acked write, data will be lost unless acks=all ensured at least min.insync.replicas acknowledged the record.',
          antiPattern: 'Setting acks=0 on telemetry pipelines and wondering why records vanish during broker restarts.',
          category: 'Streaming Reliability'
        }
      ],
      quizQuestions: [
        {
          id: 'q-kafka-1',
          chapterNumber: 1,
          question: 'In Apache Kafka, what is the fundamental unit of parallelism, ordering, and replication?',
          options: [
            'The Consumer Group ID',
            'The Topic Partition',
            'The Producer Thread',
            'The ZooKeeper/KRaft node'
          ],
          correctIndex: 1,
          explanation: 'Each partition is an ordered, immutable sequence of records. Records are strictly ordered only within a single partition, and only one consumer thread in a group reads a given partition.',
          sourceChapter: 'Chapter 1: Meet Kafka'
        }
      ]
    };
  }

  // 5. Data Pipelines with Apache Airflow (Bas Harenslak)
  if (lower.includes('airflow') || lower.includes('pipelines_with_apache')) {
    return {
      title: 'Data Pipelines with Apache Airflow',
      author: 'Bas P. Harenslak & Julian de Ruiter',
      coverColor: '#06B6D4',
      track: 'architecture',
      coreConcepts: ['DAG Authoring', 'TaskFlow API', 'Idempotent Scheduling', 'Sensors vs Deferrable Operators', 'Backfilling & SLA Monitoring'],
      description: 'The comprehensive guide to designing, scheduling, monitoring, and debugging production workflows with Apache Airflow.',
      keyTakeaways: [
        'A DAG must be deterministic: given the same logical execution_date, it must always produce the same result.',
        'Avoid doing heavy computation inside top-level DAG definition code; keep DAG parsing under 100ms.',
        'Use Deferrable Operators instead of classic blocking Sensors to avoid exhausting Airflow worker slots.'
      ],
      chapters: [
        {
          id: 'airflow-ch1',
          number: 1,
          title: 'Directed Acyclic Graphs (DAGs) & Orchestration',
          readingTime: '15 min',
          summary: 'Task dependencies, scheduling intervals, execution dates, and idempotency rules.',
          content: 'Airflow orchestrates tasks along an acyclic directed graph. The scheduler evaluates DAGs continuously and launches tasks on workers via Celery or Kubernetes executors.',
          seniorTip: 'Never perform database queries or network HTTP calls at top-level DAG scope.',
        }
      ],
      conceptCards: [
        {
          id: 'cc-air-1',
          title: 'Top-Level Code Trap',
          ruleOfThumb: 'Airflow DAG files are parsed every 30 seconds by the scheduler. Top-level code must be instantaneous.',
          explanation: 'Running heavy imports, API requests, or DB queries at the root of a DAG file saturates the scheduler CPU and causes DAG parsing timeouts.',
          antiPattern: 'Calling requests.get() or spark.read at the top of an Airflow Python file.',
          category: 'Orchestration'
        }
      ],
      quizQuestions: [
        {
          id: 'q-air-1',
          chapterNumber: 1,
          question: 'Why should you NEVER execute database queries or heavy computations in the top-level scope of an Airflow DAG file?',
          options: [
            'Airflow does not have access to Python database libraries',
            'The Airflow Scheduler parses every DAG file every few seconds; top-level work will freeze the scheduler process',
            'Airflow tasks can only communicate through XComs',
            'Top-level code causes immediate DAG serialization syntax errors'
          ],
          correctIndex: 1,
          explanation: 'The scheduler loop executes top-level code continuously to discover tasks. Any network or disk I/O in the file root will cripple scheduler performance.',
          sourceChapter: 'Chapter 2: Anatomy of an Airflow DAG'
        }
      ]
    };
  }

  // 6. Data Mesh: Delivering Data-Driven Value at Scale (Zhamak Dehghani)
  if (lower.includes('data_mesh') || lower.includes('data mesh') || lower.includes('dehghani')) {
    return {
      title: 'Data Mesh: Delivering Data-Driven Value at Scale',
      author: 'Zhamak Dehghani',
      coverColor: '#EC4899',
      track: 'architecture',
      coreConcepts: ['Domain-Oriented Ownership', 'Data as a Product', 'Self-Serve Data Platform', 'Federated Computational Governance', 'Data Contracts'],
      description: 'The architectural blueprint for decentralized analytical data architectures, shifting ownership from centralized data teams to domain product teams.',
      keyTakeaways: [
        'Shift from centralized data monoliths (data warehouses/lakes) to decentralized domain ownership.',
        'Treat analytical data as a first-class product with published SLOs, schemas, and consumer contracts.',
        'Federated governance automates security, privacy, and compliance across all autonomous domain products.'
      ],
      chapters: [
        {
          id: 'mesh-ch1',
          number: 1,
          title: 'The Four Pillars of Data Mesh',
          readingTime: '20 min',
          summary: 'Domain ownership, Data as a Product, Self-serve infrastructure, and Federated computational governance.',
          content: 'Centralized data teams become bottlenecks as organizations scale. Data Mesh empowers domain teams (e.g. Checkout, Logistics) to own and serve their own analytical data products using self-serve platform tools.',
          seniorTip: 'Do not adopt Data Mesh unless you have at least 3 distinct cross-functional product domains experiencing organizational bottlenecking.',
        }
      ],
      conceptCards: [
        {
          id: 'cc-mesh-1',
          title: 'Data as a Product',
          ruleOfThumb: 'A dataset is not a data product without discovery, documentation, SLAs, and programmatic contracts.',
          explanation: 'Raw tables dumped into S3 are toxic assets. A true Data Product includes metadata, code, infrastructure, and semantic contracts with guaranteed uptime.',
          antiPattern: 'Granting analysts raw read access to operational PostgreSQL replicas with zero contracts.',
          category: 'Data Governance'
        }
      ],
      quizQuestions: [
        {
          id: 'q-mesh-1',
          chapterNumber: 1,
          question: 'What is the primary organizational bottleneck that Data Mesh seeks to eliminate?',
          options: [
            'Slow SQL query execution speeds in relational databases',
            'The centralized, monolithic data engineering team trapped between upstream producers and downstream consumers',
            'High cloud storage costs in Amazon S3 and Google Cloud Storage',
            'Network latency between distributed microservices'
          ],
          correctIndex: 1,
          explanation: 'Data Mesh shifts ownership of analytical data from a single overwhelmed central team to the domain teams who actually understand the business logic.',
          sourceChapter: 'Chapter 1: The Core Principles of Data Mesh'
        }
      ]
    };
  }

  // 7. Learning SQL (Alan Beaulieu)
  if (lower.includes('learning_sql') || lower.includes('beaulieu')) {
    return {
      title: 'Learning SQL (3rd Edition)',
      author: 'Alan Beaulieu',
      coverColor: '#3B82F6',
      track: 'sql',
      coreConcepts: ['Relational Joins', 'Window Functions', 'Subqueries & CTEs', 'Aggregation & Grouping', 'Set Operations (UNION, INTERSECT)'],
      description: 'The comprehensive guide to SQL querying, relational algebra, analytical windowing, and relational database fundamentals.',
      keyTakeaways: [
        'Understand the logical execution order of SQL: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY.',
        'Window functions perform calculations across related rows without collapsing them into a single row.',
        'Always check join selectivity and NULL handling in NOT IN subqueries.'
      ],
      chapters: [
        {
          id: 'sql-ch1',
          number: 1,
          title: 'Query Processing & Relational Fundamentals',
          readingTime: '15 min',
          summary: 'Relational algebra, projection, selection, and logical query execution pipeline.',
          content: 'SQL is declarative: you describe WHAT data you want, not HOW to retrieve it physically. The database query optimizer compiles SQL into a physical plan.',
          seniorTip: 'Always filter as early as possible in WHERE rather than after grouping in HAVING.',
        }
      ],
      conceptCards: [
        {
          id: 'cc-sql-1',
          title: 'Logical Query Processing Order',
          ruleOfThumb: 'WHERE executes before SELECT; you cannot filter on column aliases created in SELECT.',
          explanation: 'The SQL engine resolves FROM -> WHERE -> GROUP BY -> HAVING before it ever evaluates SELECT aliases. Use CTEs or subqueries if filtering on computed aliases is needed.',
          antiPattern: 'Writing WHERE alias_name > 100 in the same query block where alias_name is defined.',
          category: 'SQL Execution'
        }
      ],
      quizQuestions: [
        {
          id: 'q-sql-1',
          chapterNumber: 1,
          question: 'What is the correct logical order of execution for a standard SQL query?',
          options: [
            'SELECT -> FROM -> WHERE -> GROUP BY -> ORDER BY',
            'FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY',
            'FROM -> SELECT -> WHERE -> HAVING -> ORDER BY',
            'WHERE -> FROM -> GROUP BY -> SELECT -> ORDER BY'
          ],
          correctIndex: 1,
          explanation: 'The database first determines the source tables (FROM), applies row filters (WHERE), aggregates groups (GROUP BY / HAVING), projects output columns (SELECT), and finally sorts (ORDER BY).',
          sourceChapter: 'Chapter 3: Query Primer'
        }
      ]
    };
  }

  // 8. Python for Data Analysis (Wes McKinney)
  if (lower.includes('python-for-data-analysis') || lower.includes('wes mckinney') || lower.includes('pandas')) {
    return {
      title: 'Python for Data Analysis (3rd Edition)',
      author: 'Wes McKinney',
      coverColor: '#84CC16',
      track: 'python',
      coreConcepts: ['NumPy Vectorization', 'Pandas Series & DataFrames', 'Handling Missing Data', 'GroupBy Aggregations', 'Time Series Analysis'],
      description: 'The master reference for data manipulation, cleaning, and analysis in Python by the original creator of pandas.',
      keyTakeaways: [
        'Vectorized NumPy and pandas operations execute in optimized C/Fortran code, running 50–100x faster than pure Python for-loops.',
        'Never iterate over DataFrames with .iterrows() in production; use boolean masks, .apply(), or vectorized series operations.',
        'Downcast numerical data types (e.g. float64 to float32) and use Categorical dtypes to reduce RAM usage by up to 80%.'
      ],
      chapters: [
        {
          id: 'py-ch1',
          number: 1,
          title: 'Vectorization & High-Performance Python',
          readingTime: '15 min',
          summary: 'Vectorized computing, memory management, and avoiding the Python interpreter loop overhead.',
          content: 'Vectorized operations process entire arrays of numbers simultaneously by leveraging SIMD CPU instructions in compiled C libraries.',
          seniorTip: 'Always convert high-cardinality string columns with repetitive values to the Categorical dtype.',
        }
      ],
      conceptCards: [
        {
          id: 'cc-py-1',
          title: 'Vectorization vs Loops',
          ruleOfThumb: 'If you write a for-loop over a DataFrame, you have already lost 90% of your performance.',
          explanation: 'Python loops suffer from dynamic type checking on every iteration. Vectorized operations run directly in low-level memory buffers.',
          antiPattern: 'Using for row in df.iterrows() to perform currency conversions.',
          category: 'Python Optimization'
        }
      ],
      quizQuestions: [
        {
          id: 'q-py-1',
          chapterNumber: 1,
          question: 'Why should you avoid using `.iterrows()` to process pandas DataFrame rows in production data pipelines?',
          options: [
            '.iterrows() deletes the original DataFrame',
            '.iterrows() converts each row into a new Series object on every iteration, introducing massive Python overhead and running 50–100x slower than vectorized operations',
            '.iterrows() can only read integer columns',
            '.iterrows() triggers an immediate memory out-of-bounds crash'
          ],
          correctIndex: 1,
          explanation: '.iterrows() destroys performance by boxing each row into a Python Series. Always use vectorized expressions or numpy arrays.',
          sourceChapter: 'Chapter 5: Getting Started with pandas'
        }
      ]
    };
  }

  // 9. Spark: The Definitive Guide (Bill Chambers & Matei Zaharia)
  if (lower.includes('spark-the-definitive-guide') || lower.includes('chambers') || lower.includes('zaharia')) {
    return {
      title: 'Spark: The Definitive Guide',
      author: 'Bill Chambers & Matei Zaharia',
      coverColor: '#F97316',
      track: 'pyspark',
      coreConcepts: ['Catalyst Optimizer', 'Tungsten Execution Engine', 'DAG Stages', 'Shuffle Partitions', 'Broadcast Hash Joins', 'Data Skew Salting'],
      description: 'The premier architecture guide written by the creators of Apache Spark. Master distributed processing, memory architecture, execution plans, and physical optimizations.',
      keyTakeaways: [
        'Narrow transformations execute in-memory across partitions; wide transformations force a costly network shuffle.',
        'Broadcast Hash Joins eliminate SortMergeJoin shuffles when one side fits in executor memory (spark.sql.autoBroadcastJoinThreshold).',
        'Salting skewed keys with random salt values distributes data evenly across cluster executors, preventing executor OOMs.'
      ],
      chapters: [
        {
          id: 'spark-ch1',
          number: 1,
          title: 'Catalyst Optimizer & Execution Pipeline',
          readingTime: '20 min',
          summary: 'From unresolved logical plan to optimized physical whole-stage Java bytecode.',
          content: 'Spark SQL translates DataFrame transformations through 4 phases: Analysis, Logical Optimization (predicate pushdown, column pruning), Physical Planning (join selection), and Whole-Stage Code Generation (Tungsten).',
          seniorTip: 'Always call df.explain(True) to verify predicate pushdown into Parquet files before launching long batch jobs.',
        }
      ],
      conceptCards: [
        {
          id: 'cc-spark-1',
          title: 'Broadcast Hash Join',
          ruleOfThumb: 'Always broadcast tables under 50MB to eliminate shuffle boundaries entirely.',
          explanation: 'SortMergeJoin requires hashing and network-shuffling both tables across all executors. BroadcastJoin sends the small table to every executor, allowing local map-side hash lookups.',
          antiPattern: 'Letting Spark default to SortMergeJoin on a 100-row dimension table.',
          category: 'PySpark Optimization'
        }
      ],
      quizQuestions: [
        {
          id: 'q-spark-1',
          chapterNumber: 1,
          question: 'What is the primary architectural advantage of a Broadcast Hash Join over a SortMerge Join in Apache Spark?',
          options: [
            'It stores data permanently on driver disk',
            'It eliminates the network shuffle stage entirely by broadcasting the smaller table to all executors',
            'It bypasses the Catalyst optimizer',
            'It converts Python UDFs into C++ binaries'
          ],
          correctIndex: 1,
          explanation: 'Broadcast Hash Join sends the smaller dimension table to all cluster nodes, allowing local hash-table lookups without any network shuffle or sorting phase.',
          sourceChapter: 'Chapter 8: Spark SQL Joins'
        }
      ]
    };
  }

  // 10. System Design Interview – Alex Xu (Volume 1)
  if ((lower.includes('system design') || lower.includes('alex xu')) && !lower.includes('volume-2') && !lower.includes('volume 2')) {
    return {
      title: "System Design Interview – An Insider's Guide",
      author: 'Alex Xu',
      coverColor: '#A855F7',
      track: 'architecture',
      coreConcepts: ['Scale From Zero To Millions', 'Consistent Hashing', 'Token Bucket Rate Limiter', 'Distributed Key-Value Stores', 'Message Queues'],
      description: 'The industry-standard master guide to distributed systems architecture, capacity estimation, caching strategies, and resilient backends.',
      keyTakeaways: [
        'Decouple writes from reads using asynchronous message queues (Kafka/RabbitMQ) and read replicas.',
        'Use Consistent Hashing to distribute load evenly and minimize re-sharding when nodes join or leave.',
        'Rate limiting via Token Bucket or Sliding Window Log protects upstream microservices from cascading failures.'
      ],
      chapters: [
        {
          id: 'sd-ch1',
          number: 1,
          title: 'Scaling From Zero to Millions of Users',
          readingTime: '20 min',
          summary: 'Single server to multi-tier distributed architectures: caching, CDN, DB replication, sharding.',
          content: 'Begin with monolithic simplicity, then separate database and web tier. Introduce caching (Redis) for read-heavy workloads, CDN for static media, and message queues to decouple high-latency writes.',
          seniorTip: 'Always perform back-of-the-envelope calculations for QPS, storage, and network bandwidth before picking storage engines.',
        }
      ],
      conceptCards: [
        {
          id: 'cc-sd-1',
          title: 'Consistent Hashing',
          ruleOfThumb: 'Map both servers and keys to a circular hash ring to minimize key migration during node failures.',
          explanation: 'Traditional modular hashing (hash(key) % N) invalidates almost all keys when N changes. Consistent hashing reallocates only k/N keys on node changes.',
          antiPattern: 'Using simple modulo hashing across a dynamically autoscaling caching tier.',
          category: 'Distributed Systems'
        }
      ],
      quizQuestions: [
        {
          id: 'q-sd-1',
          chapterNumber: 1,
          question: 'Why is Consistent Hashing preferred over simple hash modulo (hash(key) % N) in distributed caching systems?',
          options: [
            'It encrypts data with 256-bit AES encryption',
            'When a server is added or removed, only a small fraction (k/N) of keys need to be remapped instead of almost all keys',
            'It removes the need for Redis clusters',
            'It forces all reads to go to a single leader node'
          ],
          correctIndex: 1,
          explanation: 'In modular hashing, changing N moves virtually 100% of keys, causing a cache avalanche. Consistent hashing re-routes only keys falling in the affected ring segment.',
          sourceChapter: 'Chapter 5: Design Consistent Hashing'
        }
      ]
    };
  }

  // 11. System Design Interview: Volume 2 (Alex Xu & Sahn Lam)
  if (lower.includes('volume-2') || lower.includes('volume 2')) {
    return {
      title: 'System Design Interview: Volume 2',
      author: 'Alex Xu & Sahn Lam',
      coverColor: '#8B5CF6',
      track: 'architecture',
      coreConcepts: ['Distributed Message Queues', 'Metrics Monitoring & Alerting', 'Distributed Search (Elasticsearch)', 'Real-Time Gaming Leaderboard', 'Digital Payment Systems'],
      description: 'Advanced production-grade system designs with back-of-the-envelope calculations, failure modes, and hardware architecture trade-offs.',
      keyTakeaways: [
        'Time-series databases (TSDB) for metrics monitoring use delta-of-delta timestamp encoding and Gorilla float compression.',
        'Payment systems mandate idempotency keys and two-phase commit / saga patterns to guarantee exactly-once financial settlement.',
        'Distributed search uses inverted indices partitioned by document ID or term to scale across terabytes of text.'
      ],
      chapters: [
        {
          id: 'sd2-ch1',
          number: 1,
          title: 'Design a Distributed Message Queue',
          readingTime: '25 min',
          summary: 'Append-only logs, consumer offset management, and replication semantics.',
          content: 'Building a Kafka-like queue requires segmented log files, memory-mapped zero-copy transfers, and Raft/consensus coordination for leader election.',
          seniorTip: 'Use sendfile() zero-copy system calls to transfer network packets directly from OS page cache to network socket.',
        }
      ],
      conceptCards: [
        {
          id: 'cc-sd2-1',
          title: 'Zero-Copy Data Transfer',
          ruleOfThumb: 'Bypass user space entirely when streaming large log files from disk to network.',
          explanation: 'Zero-copy transfers data directly from page cache to the network buffer via DMA, eliminating 2 context switches and 2 memory buffer copies.',
          antiPattern: 'Reading files into Java byte[] arrays before writing to network sockets in high-throughput brokers.',
          category: 'High Performance I/O'
        }
      ],
      quizQuestions: [
        {
          id: 'q-sd2-1',
          chapterNumber: 1,
          question: 'How does Zero-Copy I/O (e.g. Linux sendfile) accelerate distributed streaming brokers like Kafka and message queues?',
          options: [
            'It compresses data using gzip on the GPU',
            'It copies bytes directly from the OS Page Cache to the network buffer via DMA, eliminating CPU context switches and memory copies to user space',
            'It deletes old files without checking retention policies',
            'It skips TCP acknowledgment packets'
          ],
          correctIndex: 1,
          explanation: 'Zero-copy avoids copying data into application memory space, allowing the kernel to stream data directly from storage cache into the network interface card.',
          sourceChapter: 'Chapter 4: Distributed Message Queue'
        }
      ]
    };
  }

  // 12. AI Engineering: Building Applications with Foundation Models (Chip Huyen)
  if (lower.includes('ai_engineering') || lower.includes('chip huyen') || lower.includes('foundation_models')) {
    return {
      title: 'AI Engineering: Building Applications with Foundation Models',
      author: 'Chip Huyen',
      coverColor: '#EC4899',
      track: 'architecture',
      coreConcepts: ['RAG Pipeline Architecture', 'Vector DBs & HNSW Indexing', 'Chunking Strategies & Context Windows', 'Embeddings Batch Pipelines', 'Agentic Workflows & Tool Calling'],
      description: 'The master reference for architecting production data pipelines for LLMs, Retrieval-Augmented Generation (RAG), vector retrieval, and agent evaluation.',
      keyTakeaways: [
        'RAG accuracy is primarily determined by chunking strategy and document metadata enrichment, not model size.',
        'HNSW (Hierarchical Navigable Small World) graphs provide sub-10ms approximate nearest neighbor search over millions of vectors.',
        'Evaluation pipelines (LLM-as-a-judge, ground truth benchmarking) are essential to prevent regression in production agents.'
      ],
      chapters: [
        {
          id: 'ai-ch1',
          number: 1,
          title: 'Data Ingestion & Chunking for Retrieval (RAG)',
          readingTime: '20 min',
          summary: 'Semantic chunking, recursive character splitting, and context preservation for embeddings.',
          content: 'Garbage in, garbage out: poorly chunked text fragments destroy embedding semantics. Maintain section hierarchies and prepend document metadata to chunks.',
          seniorTip: 'Never split chunks blindly by character count. Use semantic paragraph or recursive AST splitters.',
        }
      ],
      conceptCards: [
        {
          id: 'cc-ai-1',
          title: 'Semantic Chunking Trade-offs',
          ruleOfThumb: 'Chunk size is an explicit trade-off between semantic precision and context completeness.',
          explanation: 'Small chunks (128 tokens) provide high embedding precision for specific facts, while large chunks (1024 tokens) preserve broad thematic reasoning.',
          antiPattern: 'Chunking markdown tables across arbitrary line breaks, destroying tabular relationships.',
          category: 'AI Architecture'
        }
      ],
      quizQuestions: [
        {
          id: 'q-ai-1',
          chapterNumber: 1,
          question: 'In production RAG (Retrieval-Augmented Generation) data pipelines, why is naive fixed-token chunking considered an anti-pattern?',
          options: [
            'It costs 100x more to store on disk',
            'It frequently splits critical sentences, code blocks, or markdown tables in half, severing semantic context and degrading embedding quality',
            'It is unsupported by modern vector databases',
            'It violates Python PEP 8 standards'
          ],
          correctIndex: 1,
          explanation: 'Fixed-token splitting arbitrarily cuts sentences and structural tables, destroying the syntactic and contextual integrity required for meaningful vector embeddings.',
          sourceChapter: 'Chapter 5: Retrieval-Augmented Generation'
        }
      ]
    };
  }

  // 13. Databricks Lakehouse & Delta Lake (Denny Lee, Packt, Databricks)
  if (lower.includes('databricks') || lower.includes('dldg') || lower.includes('lakehouse')) {
    return {
      title: lower.includes('dea') ? 'Databricks Certified Data Engineer Associate (DEA) Architecture' : 'Data Engineering with Databricks Lakehouse Cookbook',
      author: 'Databricks Staff Architects & Engineers',
      coverColor: '#14B8A6',
      track: 'warehousing',
      coreConcepts: ['Delta Lake ACID Log', 'Medallion Architecture (Bronze/Silver/Gold)', 'Auto Loader & CloudFiles', 'Liquid Clustering', 'Unity Catalog Governance'],
      description: 'Comprehensive practical recipes and architectural patterns for building resilient Lakehouses with Apache Spark, Delta Lake, and Databricks.',
      keyTakeaways: [
        'The Medallion architecture refines data progressively: Bronze (raw append), Silver (cleaned/conformed), Gold (aggregated business marts).',
        'Auto Loader uses cloud notification queues to efficiently ingest millions of incoming files with exactly-once guarantees.',
        'Liquid Clustering dynamically re-organizes data layout without partition skew or maintenance overhead.'
      ],
      chapters: [
        {
          id: 'dbx-ch1',
          number: 1,
          title: 'The Medallion Architecture & Delta Lake Engine',
          readingTime: '20 min',
          summary: 'Bronze, Silver, and Gold curation tiers with transactional integrity and schema enforcement.',
          content: 'Delta Lake brings ACID reliability to cloud object storage. Bronze preserves original raw payloads, Silver cleans and dedupes, and Gold powers high-performance BI reporting.',
          seniorTip: 'Always use Delta MERGE INTO with an explicit target and source predicate to enable partition pruning during upserts.',
        }
      ],
      conceptCards: [
        {
          id: 'cc-dbx-1',
          title: 'Medallion Architecture',
          ruleOfThumb: 'Never let BI dashboards query raw Bronze tables directly; enforce Silver curation.',
          explanation: 'Bronze tables contain schema drift, unvalidated duplicates, and raw formatting. Silver guarantees cleansed types and conformed surrogate keys.',
          antiPattern: 'Exposing Bronze JSON ingestion tables to executive dashboards.',
          category: 'Lakehouse Design'
        }
      ],
      quizQuestions: [
        {
          id: 'q-dbx-1',
          chapterNumber: 1,
          question: 'What is the primary role of the Silver layer in the Databricks Medallion Lakehouse architecture?',
          options: [
            'Storing raw, unmodified binary dumps from external APIs',
            'Cleansing, filtering, enriching, and conforming raw data into structured, validated tables with schema enforcement',
            'Generating final executive KPI charts and CSV exports',
            'Archiving cold data to Glacier storage'
          ],
          correctIndex: 1,
          explanation: 'Silver represents the refined enterprise view: data is cleaned, validated, enriched, and standardized so multiple business units can query it reliably.',
          sourceChapter: 'Chapter 2: The Medallion Lakehouse'
        }
      ]
    };
  }

  const cleanTitle = fileName.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
  return {
    title: cleanTitle.replace(/\b\w/g, l => l.toUpperCase()),
    author: 'Principal Technical Author',
    coverColor: '#A855F7',
    track: 'architecture',
    coreConcepts: ['System Architecture', 'Distributed Data Engineering', 'Production Reliability', 'Data Pipelines'],
    description: `Digitized technical literature archived in secure vault storage. Includes interactive reading studio, chapter outlines, and conceptual quizzes.`,
    keyTakeaways: [
      'Core architecture patterns for high-scale data platforms.',
      'Operational reliability, throughput optimization, and failure recovery strategies.',
      'Production trade-offs and senior technical decision frameworks.'
    ],
    chapters: [
      {
        id: 'pdf-ch-1',
        number: 1,
        title: 'Core Architecture & Foundations',
        readingTime: '15 min',
        summary: 'Architectural overview, system boundaries, and operational requirements.',
        content: `Document: ${fileName}\n\nReview the authentic PDF document in the viewer tab for comprehensive diagrams, formulas, and implementation specifications.`,
        seniorTip: 'Always align system throughput targets with business latency SLAs before designing partition topology.',
      },
      {
        id: 'pdf-ch-2',
        number: 2,
        title: 'Distributed Scaling & Data Movement',
        readingTime: '20 min',
        summary: 'Sharding, replication, data movement, and fault tolerance at petabyte scale.',
        content: `Deep dive into distributed data storage and pipeline optimization patterns.`,
        seniorTip: 'Design pipelines for idempotency and replayability from day one.',
      }
    ],
    conceptCards: [
      {
        id: 'cc-gen-1',
        title: 'Idempotency by Design',
        ruleOfThumb: 'Every pipeline stage must produce identical outcomes regardless of retry counts.',
        explanation: 'In distributed systems, network partitions and worker failures will cause duplicate executions. Use upserts, deduplication keys, or atomic partition swaps.',
        antiPattern: 'Executing non-idempotent INSERT INTO statements on retries.',
        category: 'Pipeline Architecture'
      },
      {
        id: 'cc-gen-2',
        title: 'Separation of Compute and Storage',
        ruleOfThumb: 'Decouple query processing clusters from object storage persistence.',
        explanation: 'Enables independent scaling of compute workers and persistent object storage (e.g. S3/GCS/ADLS) without wasting costly compute nodes.',
        antiPattern: 'Co-locating stateful databases on compute worker ephemeral disks without replication.',
        category: 'Cloud Systems'
      }
    ],
    quizQuestions: [
      {
        id: 'q-gen-1',
        chapterNumber: 1,
        question: 'Why is idempotency a mandatory requirement in production data pipelines?',
        options: [
          'It makes the pipeline run 10x faster',
          'It ensures safe retries and reprocessing without corrupting or duplicating data upon worker failure',
          'It reduces cloud storage costs by compressing data',
          'It automatically fixes SQL syntax errors'
        ],
        correctIndex: 1,
        explanation: 'Network timeouts and node restarts happen constantly in distributed systems. Idempotent pipelines guarantee that retries never result in duplicate records or skewed analytics.',
        sourceChapter: 'Chapter 1: Pipeline Reliability'
      }
    ]
  };
}
