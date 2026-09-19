// Master Curriculum Data Payload (Self-Paced Milestones Edition)
// 100% Free, Open-Access Data Engineering Platform
// All stages follow self-paced milestones (No "Weeks")

export interface PlaylistEpisode {
  id: string;
  order: number;
  title: string;
  duration: string;
  durationMinutes: number;
  youtubeId: string;
  youtubeUrl: string;
  summary: string;
  keyTopic: string;
}

export interface StagePlaylist {
  playlistTitle: string;
  channelName: string;
  totalVideos: number;
  totalDuration: string;
  playlistUrl?: string;
  episodes: PlaylistEpisode[];
}

export interface CurriculumStage {
  milestone: string;          // e.g. "Stage 01"
  stageNumber: number;        // e.g. 1
  title: string;
  category: string;
  durationEstimate: string;
  videoUrl: string;
  youtubeId: string;
  playlist: StagePlaylist;
  topics: string[];
  revisionChecklist: string[];
}

export interface TrackRole {
  id: 'engineer' | 'analyst' | 'scientist';
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  targetStages: number[]; // stage numbers e.g. [1, 3, 6, 7]
  estimatedHours: string;
  careerOutcomes: string[];
}

export const MASTER_CURRICULUM: CurriculumStage[] = [
  {
    milestone: "Stage 01",
    stageNumber: 1,
    title: "Cloud & Data Foundations (DP-900 & Azure Ecosystem)",
    category: "Cloud Architecture",
    durationEstimate: "15-20 Hours",
    videoUrl: "https://www.youtube.com/watch?v=IaA9YNlg5hM",
    youtubeId: "IaA9YNlg5hM",
    playlist: {
      playlistTitle: "Azure Cloud & Data Foundations (DP-900 & Enterprise Architecture)",
      channelName: "DataVeda Cloud Engineering",
      totalVideos: 8,
      totalDuration: "16 hrs 35 min",
      playlistUrl: "https://www.youtube.com/watch?v=IaA9YNlg5hM",
      episodes: [
        {
          id: "s01-ep01",
          order: 1,
          title: "Olympic Data Analytics: Azure End-To-End Data Engineering Project",
          duration: "2 hr 05 min",
          durationMinutes: 125,
          youtubeId: "IaA9YNlg5hM",
          youtubeUrl: "https://www.youtube.com/watch?v=IaA9YNlg5hM",
          summary: "Complete enterprise architecture walkthrough with Azure Data Factory, ADLS Gen2, Synapse Dedicated SQL, and Databricks.",
          keyTopic: "End-to-End Azure Pipeline"
        },
        {
          id: "s01-ep02",
          order: 2,
          title: "Fundamentals Of Data Engineering Masterclass & Core Architecture",
          duration: "1 hr 15 min",
          durationMinutes: 75,
          youtubeId: "hf2go3E2m8g",
          youtubeUrl: "https://www.youtube.com/watch?v=hf2go3E2m8g",
          summary: "Deconstructing modern data ecosystems, storage vs compute separation, and enterprise cloud architecture.",
          keyTopic: "Cloud Foundations"
        },
        {
          id: "s01-ep03",
          order: 3,
          title: "DP-900 Core Data Concepts: Relational vs. Non-Relational Architecture",
          duration: "42 min",
          durationMinutes: 42,
          youtubeId: "4ifxQ_th07U",
          youtubeUrl: "https://www.youtube.com/watch?v=4ifxQ_th07U",
          summary: "Core storage paradigms, transactional (OLTP) vs analytical (OLAP) processing, and cloud career roadmap.",
          keyTopic: "DP-900 Core Concepts"
        },
        {
          id: "s01-ep04",
          order: 4,
          title: "Azure Blob Storage & ADLS Gen2 Hierarchical Namespace In-Depth",
          duration: "1 hr 10 min",
          durationMinutes: 70,
          youtubeId: "nW0ffUW2vw4",
          youtubeUrl: "https://www.youtube.com/watch?v=nW0ffUW2vw4",
          summary: "Configuring container access policies, SAS tokens, lifecycle management tiers (Hot/Cool/Archive), and data lake directory structures.",
          keyTopic: "Cloud Storage & ADLS"
        },
        {
          id: "s01-ep05",
          order: 5,
          title: "Azure Data Factory Fundamentals & Hybrid Integration Runtimes",
          duration: "1 hr 25 min",
          durationMinutes: 85,
          youtubeId: "JtrHffY2m_E",
          youtubeUrl: "https://www.youtube.com/watch?v=JtrHffY2m_E",
          summary: "Control plane vs data plane in Azure, Self-Hosted IR setup for on-premise networks, and Linked Services.",
          keyTopic: "Azure Data Factory"
        },
        {
          id: "s01-ep06",
          order: 6,
          title: "Introduction to Azure Databricks Workspaces & Spark Compute",
          duration: "1 hr 15 min",
          durationMinutes: 75,
          youtubeId: "yGWKmypU99A",
          youtubeUrl: "https://www.youtube.com/watch?v=yGWKmypU99A",
          summary: "Provisioning Azure Databricks workspaces, compute cluster configurations, and DBFS storage architecture.",
          keyTopic: "Azure Databricks"
        },
        {
          id: "s01-ep07",
          order: 7,
          title: "Enterprise Databricks Training: Lakehouse & Security Management",
          duration: "1 hr 45 min",
          durationMinutes: 105,
          youtubeId: "XOSuR8g2SfQ",
          youtubeUrl: "https://www.youtube.com/watch?v=XOSuR8g2SfQ",
          summary: "Configuring IAM roles, Key Vault secret scopes, and end-to-end data lake connections.",
          keyTopic: "Security & Governance"
        },
        {
          id: "s01-ep08",
          order: 8,
          title: "Next-Gen Unified Cloud Analytics: Microsoft Fabric & OneLake",
          duration: "1 hr 30 min",
          durationMinutes: 90,
          youtubeId: "NXQ0j9CZPyk",
          youtubeUrl: "https://www.youtube.com/watch?v=NXQ0j9CZPyk",
          summary: "Understanding the shift from traditional ADLS to unified OneLake and Fabric SaaS architecture.",
          keyTopic: "Microsoft Fabric"
        }
      ]
    },
    topics: [
      "DP-900: Core data concepts, relational vs. non-relational data, Analytics workloads, Certification Dumps",
      "Azure Portal UI: Dashboards, Subscriptions, IAM (Access Control), Cost Management, Billing",
      "Ecosystem Overview: Azure Data Factory, Synapse, Stream Analytics, Event Hubs, ADLS, Databricks, Fabric"
    ],
    revisionChecklist: [
      "Explain the difference between Relational and Non-relational data",
      "Create a Resource Group and configure basic IAM roles"
    ]
  },
  {
    milestone: "Stage 02",
    stageNumber: 2,
    title: "Python Programming & Data Structures (DSA)",
    category: "Software Engineering & DSA",
    durationEstimate: "25-30 Hours",
    videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    youtubeId: "rfscVS0vtbw",
    playlist: {
      playlistTitle: "Python Programming & Data Structures for Data Engineering",
      channelName: "DataVeda Python Academy",
      totalVideos: 8,
      totalDuration: "26 hrs 15 min",
      playlistUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
      episodes: [
        {
          id: "s02-ep01",
          order: 1,
          title: "Python for Beginners to Advanced: Full Comprehensive Course",
          duration: "4 hr 26 min",
          durationMinutes: 266,
          youtubeId: "rfscVS0vtbw",
          youtubeUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
          summary: "Exhaustive Python fundamentals: variables, memory model, flow control, functions, modules, and collections.",
          keyTopic: "Python Fundamentals"
        },
        {
          id: "s02-ep02",
          order: 2,
          title: "Python LIVE: Data Structures & Algorithms + NeetCode + Two Sum",
          duration: "3 hr 30 min",
          durationMinutes: 210,
          youtubeId: "p35CcLiCOGU",
          youtubeUrl: "https://www.youtube.com/watch?v=p35CcLiCOGU",
          summary: "Live coding session solving Arrays, Hash Maps (Two Sum), and pointer manipulation for coding interviews.",
          keyTopic: "DSA & Two Sum Hashing"
        },
        {
          id: "s02-ep03",
          order: 3,
          title: "Linked Lists Deep Dive: Singly Linked List Reversal & Node Design",
          duration: "3 hr 15 min",
          durationMinutes: 195,
          youtubeId: "rfscVS0vtbw",
          youtubeUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
          summary: "Iterative vs recursive singly linked list reversal, sentinel nodes, and time-complexity proofs.",
          keyTopic: "Linked Lists"
        },
        {
          id: "s02-ep04",
          order: 4,
          title: "Stacks, Queues, Heaps & Priority Buffers in Data Streaming",
          duration: "2 hr 45 min",
          durationMinutes: 165,
          youtubeId: "p35CcLiCOGU",
          youtubeUrl: "https://www.youtube.com/watch?v=p35CcLiCOGU",
          summary: "Implementing FIFO queues, monotonic stacks, and min-heaps for windowed batch processing.",
          keyTopic: "Stacks & Queues"
        },
        {
          id: "s02-ep05",
          order: 5,
          title: "Object-Oriented Programming (OOP): Classes, Inheritance & Dunders",
          duration: "3 hr 10 min",
          durationMinutes: 190,
          youtubeId: "rfscVS0vtbw",
          youtubeUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
          summary: "Building industrial pipeline classes, method overriding, encapsulation, and class inheritance.",
          keyTopic: "OOP Concepts"
        },
        {
          id: "s02-ep06",
          order: 6,
          title: "Functional Python: Lambda Functions, map(), filter() & List Comprehensions",
          duration: "2 hr 30 min",
          durationMinutes: 150,
          youtubeId: "rfscVS0vtbw",
          youtubeUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
          summary: "Writing clean anonymous functions and memory-efficient generator expressions for high-throughput ETL.",
          keyTopic: "Functional Programming"
        },
        {
          id: "s02-ep07",
          order: 7,
          title: "Production Exception Handling, Defensive Assertions & Regex Matching",
          duration: "2 hr 40 min",
          durationMinutes: 160,
          youtubeId: "rfscVS0vtbw",
          youtubeUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
          summary: "Custom exception hierarchies, try-except-finally blocks, regex parsing of dirty logs.",
          keyTopic: "Exception Handling"
        },
        {
          id: "s02-ep08",
          order: 8,
          title: "DSA Practice Arena: Sorting, Searching & Binary Trees",
          duration: "4 hr 00 min",
          durationMinutes: 240,
          youtubeId: "p35CcLiCOGU",
          youtubeUrl: "https://www.youtube.com/watch?v=p35CcLiCOGU",
          summary: "Binary search algorithms, merge sort implementations, and tree traversal patterns.",
          keyTopic: "Sorting & Trees"
        }
      ]
    },
    topics: [
      "Python Syntax: Identifiers, Comments, Keywords, Naming Conventions",
      "Data Types & Collections: String, List, Tuple, Set, Dictionary, Indexing, Slicing, Comprehensions",
      "Operators & Flow Control: Arithmetic, Relational, Logical, if/elif/else, while, for, break, continue, pass",
      "Functions & Modules: Global/Local scope, Lambda, filter(), map(), *args, **kwargs, import, dir(), __main__",
      "OOPs Concepts: Classes, Objects, Encapsulation, Abstraction, Multi-Level/Multiple Inheritance, Polymorphism, Method Overriding",
      "Exception Handling & Regex: try/except/finally, raise, assert, match(), search(), sub(), character classes",
      "DSA (DataVeda Practice Arena): Arrays, Strings, Linked Lists, Stacks, Sorting, Searching, Hashing, Trees, Queues"
    ],
    revisionChecklist: [
      "Write a Lambda function coupled with map() to transform a list",
      "Solve the Two Sum problem using Hashing in the Practice Arena",
      "Reverse a Singly Linked List"
    ]
  },
  {
    milestone: "Stage 03",
    stageNumber: 3,
    title: "Advanced SQL Server & Query Engine Mastery",
    category: "Database Engines & SQL",
    durationEstimate: "25-30 Hours",
    videoUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
    youtubeId: "HXV3zeQKqGY",
    playlist: {
      playlistTitle: "Advanced SQL Server, Window Functions & Query Engine Mastery",
      channelName: "DataVeda SQL Academy",
      totalVideos: 7,
      totalDuration: "25 hr 40 min",
      playlistUrl: "https://www.youtube.com/watch?v=SKgVxXelDZI",
      episodes: [
        {
          id: "s03-ep01",
          order: 1,
          title: "SQL Full Course: Relational Database Architecture & Query Fundamentals",
          duration: "4 hr 20 min",
          durationMinutes: 260,
          youtubeId: "HXV3zeQKqGY",
          youtubeUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
          summary: "RDBMS architecture, SSMS setup, DDL/DML commands, Primary & Foreign keys, and table constraints.",
          keyTopic: "RDBMS & Schema Design"
        },
        {
          id: "s03-ep02",
          order: 2,
          title: "Advanced Window Functions: ROW_NUMBER(), RANK(), DENSE_RANK() & NTILE()",
          duration: "3 hr 30 min",
          durationMinutes: 210,
          youtubeId: "HXV3zeQKqGY",
          youtubeUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
          summary: "Partition by vs order by, frame specifications (ROWS BETWEEN), and ranking analytics.",
          keyTopic: "Window Ranking Functions"
        },
        {
          id: "s03-ep03",
          order: 3,
          title: "Solve 20 LeetCode SQL Medium Problems in 2 Hours (Live Masterclass)",
          duration: "2 hr 10 min",
          durationMinutes: 130,
          youtubeId: "SKgVxXelDZI",
          youtubeUrl: "https://www.youtube.com/watch?v=SKgVxXelDZI",
          summary: "Fast-paced interview breakdown: Ankit Bansal solves 20 real FAANG SQL Medium challenges.",
          keyTopic: "FAANG SQL Problem Solving"
        },
        {
          id: "s03-ep04",
          order: 4,
          title: "Offsets & Gaps: LAG(), LEAD(), FIRST_VALUE() & Streak Detection",
          duration: "3 hr 15 min",
          durationMinutes: 195,
          youtubeId: "SKgVxXelDZI",
          youtubeUrl: "https://www.youtube.com/watch?v=SKgVxXelDZI",
          summary: "Solving Gaps & Islands patterns, consecutive login detection, and month-over-month rate variations.",
          keyTopic: "Offsets & Gaps and Islands"
        },
        {
          id: "s03-ep05",
          order: 5,
          title: "CTEs, Subqueries, Temp Tables, Views & Derived Tables",
          duration: "4 hr 10 min",
          durationMinutes: 250,
          youtubeId: "HXV3zeQKqGY",
          youtubeUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
          summary: "Recursive CTEs, deduplication strategies, temporary tables vs table variables in query memory.",
          keyTopic: "CTEs & Deduplication"
        },
        {
          id: "s03-ep06",
          order: 6,
          title: "Indexing Optimization: Clustered, Non-Clustered & ColumnStore Indexes",
          duration: "3 hr 45 min",
          durationMinutes: 225,
          youtubeId: "HXV3zeQKqGY",
          youtubeUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
          summary: "B-Tree page structures, heap tables, index fragmentation, index rebuilds, and execution plan cost analysis.",
          keyTopic: "Index Optimization"
        },
        {
          id: "s03-ep07",
          order: 7,
          title: "Stored Procedures, User-Defined Functions, Transactions & MERGE",
          duration: "4 hr 30 min",
          durationMinutes: 270,
          youtubeId: "HXV3zeQKqGY",
          youtubeUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
          summary: "ACID transactions, rollback mechanics, MERGE upsert syntax for Slowly Changing Dimensions (SCD).",
          keyTopic: "Procedures & Transactions"
        }
      ]
    },
    topics: [
      "RDBMS concepts & SSMS setup",
      "SQL Commands & Constraints: DDL, DML, DCL, TCL, Primary/Foreign/Unique/Composite/Surrogate Keys",
      "Joins & Clauses: INNER, LEFT, RIGHT, FULL OUTER, CROSS, SELF, DISTINCT, TOP, IN, BETWEEN, LIKE, UNION",
      "Window Functions: ROW_NUMBER(), RANK(), DENSE_RANK(), NTILE(), LAG(), LEAD(), FIRST_VALUE(), LAST_VALUE()",
      "Functions: DateTime (DATEADD, DATEDIFF, EOMONTH), String (LTRIM, RTRIM, SUBSTRING, CONCAT), Aggregate (SUM, MAX)",
      "Advanced Structures: ISNULL, COALESCE, ROLLUP, CUBE, PIVOT, UNPIVOT",
      "Database Objects: Subqueries, CTEs, Derived Tables, Temp Tables, Views, Stored Procedures, Functions, MERGE",
      "Indexing Optimization: Clustered, Non-Clustered, Filtered, Covered, Column Stored, Drop/Rebuild"
    ],
    revisionChecklist: [
      "Solve 5 Medium difficulty SQL Window Function problems in the Practice Arena",
      "Write a CTE using ROW_NUMBER() to identify and delete duplicate rows",
      "Explain the architectural difference between Clustered and Non-Clustered Indexes"
    ]
  },
  {
    milestone: "Stage 04",
    stageNumber: 4,
    title: "Orchestration & ETL (Azure Data Factory & DevOps)",
    category: "Data Pipelines & DevOps",
    durationEstimate: "20-25 Hours",
    videoUrl: "https://www.youtube.com/watch?v=JtrHffY2m_E",
    youtubeId: "JtrHffY2m_E",
    playlist: {
      playlistTitle: "Azure Data Factory & DevOps CI/CD Production Pipelines",
      channelName: "DataVeda Pipeline Academy",
      totalVideos: 7,
      totalDuration: "21 hr 10 min",
      playlistUrl: "https://www.youtube.com/watch?v=JtrHffY2m_E",
      episodes: [
        {
          id: "s04-ep01",
          order: 1,
          title: "ADF Architecture: Control Plane, Data Plane & Integration Runtimes",
          duration: "1 hr 45 min",
          durationMinutes: 105,
          youtubeId: "JtrHffY2m_E",
          youtubeUrl: "https://www.youtube.com/watch?v=JtrHffY2m_E",
          summary: "Azure Data Factory architecture, node provisioning, and secure network boundaries.",
          keyTopic: "ADF Architecture"
        },
        {
          id: "s04-ep02",
          order: 2,
          title: "Configuring Self-Hosted Integration Runtime (SHIR) for On-Prem Networks",
          duration: "1 hr 30 min",
          durationMinutes: 90,
          youtubeId: "JtrHffY2m_E",
          youtubeUrl: "https://www.youtube.com/watch?v=JtrHffY2m_E",
          summary: "High-availability SHIR clusters, gateway authentication, and network traffic tunneling.",
          keyTopic: "Self-Hosted IR"
        },
        {
          id: "s04-ep03",
          order: 3,
          title: "Dynamic Parameterization of Linked Services & Key Vault Secret Integration",
          duration: "2 hr 10 min",
          durationMinutes: 130,
          youtubeId: "JtrHffY2m_E",
          youtubeUrl: "https://www.youtube.com/watch?v=JtrHffY2m_E",
          summary: "Decoupling pipeline metadata, dynamic connection strings, and Azure Key Vault managed identities.",
          keyTopic: "Dynamic Linked Services"
        },
        {
          id: "s04-ep04",
          order: 4,
          title: "ADF Pipeline Activities: Copy Data, Lookup, ForEach & Databricks Execution",
          duration: "3 hr 15 min",
          durationMinutes: 195,
          youtubeId: "JtrHffY2m_E",
          youtubeUrl: "https://www.youtube.com/watch?v=JtrHffY2m_E",
          summary: "Multi-activity orchestration, passing JSON parameters between activities, error catching with Until loops.",
          keyTopic: "Pipeline Activities"
        },
        {
          id: "s04-ep05",
          order: 5,
          title: "Mapping Data Flows: Visual ETL, Spark Clusters & SCD Type 2",
          duration: "3 hr 40 min",
          durationMinutes: 220,
          youtubeId: "JtrHffY2m_E",
          youtubeUrl: "https://www.youtube.com/watch?v=JtrHffY2m_E",
          summary: "Zero-code Spark transformations, AlterRow transformations, and slowly changing dimensions.",
          keyTopic: "Mapping Data Flows"
        },
        {
          id: "s04-ep06",
          order: 6,
          title: "Automated Triggers (Schedule, Tumbling Window, Event) & Alerts",
          duration: "2 hr 20 min",
          durationMinutes: 140,
          youtubeId: "JtrHffY2m_E",
          youtubeUrl: "https://www.youtube.com/watch?v=JtrHffY2m_E",
          summary: "Blob created events, backfilling with tumbling windows, and email alerts via Azure Logic Apps.",
          keyTopic: "Triggers & Monitoring"
        },
        {
          id: "s04-ep07",
          order: 7,
          title: "Azure DevOps: Git Repos, PR Approvals & YAML CI/CD for ADF",
          duration: "3 hr 30 min",
          durationMinutes: 210,
          youtubeId: "JtrHffY2m_E",
          youtubeUrl: "https://www.youtube.com/watch?v=JtrHffY2m_E",
          summary: "ARM template generation, automated deployment gates, dev/staging/prod promotion pipelines.",
          keyTopic: "DevOps CI/CD YAML"
        }
      ]
    },
    topics: [
      "ADF Architecture: Control plane, Data plane, ETL vs ELT",
      "Integration Runtimes: Azure Auto Resolve vs. Self-Hosted IR",
      "Pipeline Components: Linked Services (Key Vault integrated), Datasets (Avro, Parquet, Snowflake, Postgres, Oracle)",
      "Activities: Wait, Variables, Copy Data, Databricks Notebook, Azure Function, Lookup, Stored Procedure, Get Metadata, Delete",
      "Triggers & Data Flows: Schedule, Tumbling Window, Event-based, Mapping Data Flows",
      "Monitoring: Pipeline/Activity runs, Alerts via Logic Apps",
      "Azure DevOps: Repos, Branching, Pull Requests, YAML CI/CD pipelines for ADF migrations"
    ],
    revisionChecklist: [
      "Configure a Self-Hosted Integration Runtime",
      "Parameterize a Linked Service dynamically for environment switching",
      "Build a YAML CI/CD pipeline for an ADF environment deployment"
    ]
  },
  {
    milestone: "Stage 05",
    stageNumber: 5,
    title: "Big Data Compute & Streaming (PySpark & Kafka)",
    category: "Distributed Big Data",
    durationEstimate: "30-35 Hours",
    videoUrl: "https://www.youtube.com/watch?v=_C8kWso4ne4",
    youtubeId: "_C8kWso4ne4",
    playlist: {
      playlistTitle: "Distributed Compute with PySpark & Real-Time Event Streaming with Apache Kafka",
      channelName: "DataVeda Big Data Academy",
      totalVideos: 7,
      totalDuration: "31 hr 45 min",
      playlistUrl: "https://www.youtube.com/watch?v=_C8kWso4ne4",
      episodes: [
        {
          id: "s05-ep01",
          order: 1,
          title: "Apache Spark Core Architecture, DAG Scheduler & RDD Execution Model",
          duration: "3 hr 15 min",
          durationMinutes: 195,
          youtubeId: "_C8kWso4ne4",
          youtubeUrl: "https://www.youtube.com/watch?v=_C8kWso4ne4",
          summary: "Driver vs executors, catalyst optimizer, Tungsten execution engine, lineage graphs, and fault tolerance.",
          keyTopic: "Spark Internal Architecture"
        },
        {
          id: "s05-ep02",
          order: 2,
          title: "PySpark DataFrame ETL: Narrow vs Wide Transformations & Aggregations",
          duration: "4 hr 10 min",
          durationMinutes: 250,
          youtubeId: "_C8kWso4ne4",
          youtubeUrl: "https://www.youtube.com/watch?v=_C8kWso4ne4",
          summary: "Column operations, groupBy, rollup, joins, and windowed calculations on terabyte datasets.",
          keyTopic: "DataFrame ETL"
        },
        {
          id: "s05-ep03",
          order: 3,
          title: "Spark Performance Optimization: Bucketing, Partitioning & Adaptive Query (AQE)",
          duration: "4 hr 30 min",
          durationMinutes: 270,
          youtubeId: "_C8kWso4ne4",
          youtubeUrl: "https://www.youtube.com/watch?v=_C8kWso4ne4",
          summary: "Coalesce vs repartition, dynamic partition pruning, AQE shuffle partition coalescing, and caching strategies.",
          keyTopic: "Performance & AQE"
        },
        {
          id: "s05-ep04",
          order: 4,
          title: "Broadcast Joins, Salting Technique & Eliminating Shuffle Skew",
          duration: "3 hr 45 min",
          durationMinutes: 225,
          youtubeId: "_C8kWso4ne4",
          youtubeUrl: "https://www.youtube.com/watch?v=_C8kWso4ne4",
          summary: "Broadcast variables, resolving uneven partition skew with salting keys, and memory heap tuning.",
          keyTopic: "Salting & Broadcast"
        },
        {
          id: "s05-ep05",
          order: 5,
          title: "Apache Kafka Crash Course: Distributed Brokers, Topics & Partitions",
          duration: "1 hr 22 min",
          durationMinutes: 82,
          youtubeId: "R873BlNVUB4",
          youtubeUrl: "https://www.youtube.com/watch?v=R873BlNVUB4",
          summary: "Message brokers, topic log segmentation, leader/follower replica synchronization, and in-sync replicas (ISR).",
          keyTopic: "Kafka Core Architecture"
        },
        {
          id: "s05-ep06",
          order: 6,
          title: "Kafka Producers & Consumer Groups: ACKs, Rebalances & Lag Management",
          duration: "2 hr 15 min",
          durationMinutes: 135,
          youtubeId: "R873BlNVUB4",
          youtubeUrl: "https://www.youtube.com/watch?v=R873BlNVUB4",
          summary: "Producer acknowledgments (acks=all), consumer offset commits, cooperative sticky rebalances, and lag monitoring.",
          keyTopic: "Producers & Consumer Groups"
        },
        {
          id: "s05-ep07",
          order: 7,
          title: "PySpark Structured Streaming with Apache Kafka at Industrial Scale",
          duration: "4 hr 30 min",
          durationMinutes: 270,
          youtubeId: "_C8kWso4ne4",
          youtubeUrl: "https://www.youtube.com/watch?v=_C8kWso4ne4",
          summary: "ReadStream and WriteStream with Kafka source, checkpointing on ADLS, watermarking for late-arriving events.",
          keyTopic: "Structured Streaming"
        }
      ]
    },
    topics: [
      "Spark Architecture: DAG Scheduler, Task Scheduler, RDD persistence, Fault Tolerance",
      "Transformations & Actions: Narrow vs Wide dependencies",
      "DataFrame ETL: Filters, Column manipulations, Unions, Joins, Aggregations, GroupBy, Window functions",
      "Performance Optimization: Partitioning, Bucketing, Caching, Adaptive Query Execution (AQE), Salting",
      "Shared Variables: Broadcast variables & Custom Accumulators",
      "DataVeda Apache Kafka Crash Course: Distributed brokers, topic partitions, producer ACKs, consumer group rebalances",
      "PySpark Streaming: Streaming at scale with Apache Kafka"
    ],
    revisionChecklist: [
      "Implement a Broadcast Join to eliminate network shuffling during skew",
      "Configure AQE (Adaptive Query Execution) parameters",
      "Define the relationship between Kafka topic partitions and consumer groups"
    ]
  },
  {
    milestone: "Stage 06",
    stageNumber: 6,
    title: "Lakehouse Architectures (Databricks & dbt Core)",
    category: "Lakehouse & Modeling",
    durationEstimate: "25-30 Hours",
    videoUrl: "https://www.youtube.com/watch?v=XOSuR8g2SfQ",
    youtubeId: "XOSuR8g2SfQ",
    playlist: {
      playlistTitle: "Modern Lakehouse Architectures with Databricks Delta Lake & dbt Core",
      channelName: "DataVeda Lakehouse Academy",
      totalVideos: 7,
      totalDuration: "25 hr 30 min",
      playlistUrl: "https://www.youtube.com/watch?v=XOSuR8g2SfQ",
      episodes: [
        {
          id: "s06-ep01",
          order: 1,
          title: "Databricks 2025 Architecture, Workspaces, Clusters & Runtimes",
          duration: "1 hr 45 min",
          durationMinutes: 105,
          youtubeId: "XOSuR8g2SfQ",
          youtubeUrl: "https://www.youtube.com/watch?v=XOSuR8g2SfQ",
          summary: "Control plane vs data plane in Databricks, All-purpose vs Job clusters, spot instances, and Photon engine.",
          keyTopic: "Databricks Clusters"
        },
        {
          id: "s06-ep02",
          order: 2,
          title: "DBFS, Secrets Vaults, Widgets & Databricks Utilities (dbutils)",
          duration: "2 hr 15 min",
          durationMinutes: 135,
          youtubeId: "XOSuR8g2SfQ",
          youtubeUrl: "https://www.youtube.com/watch?v=XOSuR8g2SfQ",
          summary: "Mastering dbutils.fs, dbutils.secrets, notebook workflows, and mounting ADLS Gen2 containers.",
          keyTopic: "dbutils & Storage Mounts"
        },
        {
          id: "s06-ep03",
          order: 3,
          title: "Medallion Architecture: Bronze (Raw), Silver (Cleansed) & Gold (Aggregated)",
          duration: "3 hr 10 min",
          durationMinutes: 190,
          youtubeId: "XOSuR8g2SfQ",
          youtubeUrl: "https://www.youtube.com/watch?v=XOSuR8g2SfQ",
          summary: "Designing production bronze ingestion layers, schema enforcement, silver deduplication, and gold dimensional star schemas.",
          keyTopic: "Medallion Architecture"
        },
        {
          id: "s06-ep04",
          order: 4,
          title: "Delta Lake: Transaction Logs, Time Travel, Vacuum & ACID Operations",
          duration: "3 hr 20 min",
          durationMinutes: 200,
          youtubeId: "XOSuR8g2SfQ",
          youtubeUrl: "https://www.youtube.com/watch?v=XOSuR8g2SfQ",
          summary: "_delta_log JSON commits, rollback time travel, file compaction with OPTIMIZE, and Z-Ordering.",
          keyTopic: "Delta Lake ACID"
        },
        {
          id: "s06-ep05",
          order: 5,
          title: "SCD Type 1 & Type 2 Implementation via Delta Lake MERGE (Upsert)",
          duration: "2 hr 40 min",
          durationMinutes: 160,
          youtubeId: "XOSuR8g2SfQ",
          youtubeUrl: "https://www.youtube.com/watch?v=XOSuR8g2SfQ",
          summary: "Writing SQL MERGE statements to track historical dimensional changes with effective start/end dates.",
          keyTopic: "SCD Type 2 MERGE"
        },
        {
          id: "s06-ep06",
          order: 6,
          title: "Intro to dbt Core: Models, Staging Views & Dimensional Marts",
          duration: "1 hr 12 min",
          durationMinutes: 72,
          youtubeId: "5rNquRnNb4E",
          youtubeUrl: "https://www.youtube.com/watch?v=5rNquRnNb4E",
          summary: "dbt project initialization, profiles.yml configuration, creating views vs tables, and ref() macros.",
          keyTopic: "dbt Core Fundamentals"
        },
        {
          id: "s06-ep07",
          order: 7,
          title: "Advanced dbt Core: Jinja Macros, Generic Tests & Snowflake/Databricks Marts",
          duration: "2 hr 18 min",
          durationMinutes: 138,
          youtubeId: "7lpp5N73V98",
          youtubeUrl: "https://www.youtube.com/watch?v=7lpp5N73V98",
          summary: "Custom Jinja macros, unique & not_null tests, documentation generation, and production deployment.",
          keyTopic: "dbt Advanced Macros & Tests"
        }
      ]
    },
    topics: [
      "Databricks Architecture: Workspaces, Notebooks, DBFS (handling, processing, archiving)",
      "Databricks Utilities (dbutils): Credentials, FileSystem, Notebook, Secrets, Widgets",
      "Cluster Management: All-Purpose vs. Job Clusters, Standard vs. High Concurrency, Autoscaling, Databricks Runtimes",
      "Batch Integrations: Blob Storage, ADLS Gen2, Azure SQL, Synapse",
      "Medallion Architecture: Bronze (Raw), Silver (Cleansed), Gold (Aggregated)",
      "Delta Lake: Transaction Logs, Time Travel, Handling SCD Type 1 & Type 2",
      "DataVeda dbt Core with Snowflake: Staging views, dimensional marts, Jinja macros, and schema tests"
    ],
    revisionChecklist: [
      "Mount an ADLS Gen2 storage container to DBFS securely",
      "Schedule a Job Cluster for a daily Silver-to-Gold aggregation",
      "Perform a MERGE (UPSERT) operation to handle SCD Type 2 changes in a Delta Table"
    ]
  },
  {
    milestone: "Stage 07",
    stageNumber: 7,
    title: "Modern Analytics & AI (Microsoft Fabric)",
    category: "Fabric, PowerBI & Gen AI",
    durationEstimate: "20-25 Hours",
    videoUrl: "https://www.youtube.com/watch?v=NXQ0j9CZPyk",
    youtubeId: "NXQ0j9CZPyk",
    playlist: {
      playlistTitle: "Microsoft Fabric, Real-Time Analytics & Generative AI Data Engineering",
      channelName: "DataVeda AI & Fabric Academy",
      totalVideos: 6,
      totalDuration: "21 hr 20 min",
      playlistUrl: "https://www.youtube.com/watch?v=NXQ0j9CZPyk",
      episodes: [
        {
          id: "s07-ep01",
          order: 1,
          title: "Microsoft Fabric Setup & OneLake Architecture Deep Dive",
          duration: "1 hr 30 min",
          durationMinutes: 90,
          youtubeId: "NXQ0j9CZPyk",
          youtubeUrl: "https://www.youtube.com/watch?v=NXQ0j9CZPyk",
          summary: "Fabric workspace provisioning, OneLake shortcuts without duplicating data, and multi-cloud links.",
          keyTopic: "Fabric & OneLake"
        },
        {
          id: "s07-ep02",
          order: 2,
          title: "Lakehouse Architecture inside Fabric: Delta Tables & SQL Endpoints",
          duration: "2 hr 10 min",
          durationMinutes: 130,
          youtubeId: "NXQ0j9CZPyk",
          youtubeUrl: "https://www.youtube.com/watch?v=NXQ0j9CZPyk",
          summary: "Creating Fabric Lakehouses, automatic schema inference, and querying Delta tables via serverless SQL endpoints.",
          keyTopic: "Fabric Lakehouse"
        },
        {
          id: "s07-ep03",
          order: 3,
          title: "Data Ingestion & Spark Processing in Fabric (Part 1 & Part 2)",
          duration: "3 hr 40 min",
          durationMinutes: 220,
          youtubeId: "NXQ0j9CZPyk",
          youtubeUrl: "https://www.youtube.com/watch?v=NXQ0j9CZPyk",
          summary: "Fabric Spark notebooks, V-Order optimization on Parquet files, and automated table maintenance.",
          keyTopic: "Spark in Fabric"
        },
        {
          id: "s07-ep04",
          order: 4,
          title: "Data Warehousing & Data Pipelines in Fabric with Power BI Direct Lake",
          duration: "3 hr 15 min",
          durationMinutes: 195,
          youtubeId: "NXQ0j9CZPyk",
          youtubeUrl: "https://www.youtube.com/watch?v=NXQ0j9CZPyk",
          summary: "Cross-database queries, data pipeline triggers, and zero-latency Direct Lake reporting in Power BI.",
          keyTopic: "Direct Lake Mode"
        },
        {
          id: "s07-ep05",
          order: 5,
          title: "Real-Time Streaming in Fabric: Eventstreams & KQL Databases",
          duration: "2 hr 45 min",
          durationMinutes: 165,
          youtubeId: "NXQ0j9CZPyk",
          youtubeUrl: "https://www.youtube.com/watch?v=NXQ0j9CZPyk",
          summary: "Ingesting live IoT streams with Fabric Eventstreams and querying telemetries using Kusto Query Language (KQL).",
          keyTopic: "Real-Time Analytics"
        },
        {
          id: "s07-ep06",
          order: 6,
          title: "Generative AI Data Project: Virtual Analyst, Prompt Engineering & LLM APIs",
          duration: "3 hr 20 min",
          durationMinutes: 200,
          youtubeId: "NXQ0j9CZPyk",
          youtubeUrl: "https://www.youtube.com/watch?v=NXQ0j9CZPyk",
          summary: "Building an AI-augmented pipeline that connects OpenAI/Gemini APIs to Lakehouse tables to synthesize executive summaries.",
          keyTopic: "Generative AI Analyst"
        }
      ]
    },
    topics: [
      "Microsoft Fabric Setup: Workspaces and OneLake deep dive",
      "Lakehouse Architecture inside Fabric",
      "Data Ingestion & Processing with Spark (Part 1 & 2)",
      "Data Warehousing, Data Pipelines, and Stream Data in Fabric",
      "Generative AI Project: Virtual Analyst creation, Prompt engineering, and LLM endpoints"
    ],
    revisionChecklist: [
      "Differentiate Fabric OneLake architecture from standard ADLS",
      "Build an automated Fabric Pipeline",
      "Integrate a local AI or API endpoint to query structured tabular data"
    ]
  },
  {
    milestone: "Stage 08",
    stageNumber: 8,
    title: "The DataVeda Masterclass Projects Portfolio",
    category: "Real-World Production Projects",
    durationEstimate: "35-40 Hours",
    videoUrl: "https://www.youtube.com/watch?v=WpQECq5Hx9g",
    youtubeId: "WpQECq5Hx9g",
    playlist: {
      playlistTitle: "Production Data Engineering Portfolios: Uber, Zomato, Twitter & AWS",
      channelName: "DataVeda Portfolio Studio",
      totalVideos: 5,
      totalDuration: "36 hr 15 min",
      playlistUrl: "https://www.youtube.com/watch?v=WpQECq5Hx9g",
      episodes: [
        {
          id: "s08-ep01",
          order: 1,
          title: "Uber Data Analytics: GCP, Mage AI, BigQuery & Looker Studio",
          duration: "1 hr 42 min",
          durationMinutes: 102,
          youtubeId: "WpQECq5Hx9g",
          youtubeUrl: "https://www.youtube.com/watch?v=WpQECq5Hx9g",
          summary: "End-to-end cloud pipeline modeling millions of Uber trips with modern Mage AI orchestration.",
          keyTopic: "Uber GCP Pipeline"
        },
        {
          id: "s08-ep02",
          order: 2,
          title: "Zomato AI Data Analytics: AI-Augmented Analytics & Geospatial Indexing",
          duration: "1 hr 35 min",
          durationMinutes: 95,
          youtubeId: "kYwaNMQ3XT8",
          youtubeUrl: "https://www.youtube.com/watch?v=kYwaNMQ3XT8",
          summary: "Geospatial indexing, restaurant demand clustering, and automated BigQuery AI pipelines.",
          keyTopic: "Zomato AI Pipeline"
        },
        {
          id: "s08-ep03",
          order: 3,
          title: "Twitter Real-Time Data Pipeline: Apache Airflow on AWS EC2 with S3",
          duration: "58 min",
          durationMinutes: 58,
          youtubeId: "q8q3OFFfY6c",
          youtubeUrl: "https://www.youtube.com/watch?v=q8q3OFFfY6c",
          summary: "Automated ingestion DAG running on Amazon EC2 pushing clean JSON archives to S3 data lakes.",
          keyTopic: "Twitter Airflow AWS"
        },
        {
          id: "s08-ep04",
          order: 4,
          title: "AWS Data Engineering Masterclass: Serverless Lambda, Glue & Athena",
          duration: "1 hr 45 min",
          durationMinutes: 105,
          youtubeId: "yvAWbbQa8eE",
          youtubeUrl: "https://www.youtube.com/watch?v=yvAWbbQa8eE",
          summary: "Serverless event-driven architecture with AWS Lambda, S3 Data Lake, Glue Data Catalog & Athena SQL.",
          keyTopic: "AWS Serverless Pipeline"
        },
        {
          id: "s08-ep05",
          order: 5,
          title: "Olympic Data Analytics & On-Prem to Cloud Migration Verification",
          duration: "2 hr 05 min",
          durationMinutes: 125,
          youtubeId: "IaA9YNlg5hM",
          youtubeUrl: "https://www.youtube.com/watch?v=IaA9YNlg5hM",
          summary: "On-Prem to Cloud migration verifying key consistency, matrix reconciliation, and target tables.",
          keyTopic: "Migration & Reconciliation"
        }
      ]
    },
    topics: [
      "DataVeda Uber Data Analytics: End-to-end pipeline with GCP, Mage AI, BigQuery, and Looker Studio",
      "DataVeda Zomato AI Data Analytics: AI-augmented analytics with GCP and geospatial indexing",
      "DataVeda Twitter Data Pipeline with Airflow: Automated ingestion on AWS EC2 with S3 archiving",
      "DataVeda AWS Data Engineering Masterclass: Serverless Lambda, S3 Data Lake, Glue Crawler, and Athena SQL",
      "Vision Board Migration: On-Prem to Cloud Migration verifying key consistency (totals/matrices) between source and target"
    ],
    revisionChecklist: [
      "Execute a DAG line-by-line via the Airflow EC2 instance",
      "Deploy the AWS Glue Crawler to map S3 raw data into Athena",
      "Write a reconciliation query to verify dataset consistency post-migration"
    ]
  },
  {
    milestone: "Stage 09",
    stageNumber: 9,
    title: "Career Acceleration & The Vault Library",
    category: "Career, Interviews & Vault",
    durationEstimate: "20-25 Hours",
    videoUrl: "https://www.youtube.com/watch?v=4ifxQ_th07U",
    youtubeId: "4ifxQ_th07U",
    playlist: {
      playlistTitle: "Career Acceleration, FAANG System Design & The Vault Library",
      channelName: "DataVeda Career Hub",
      totalVideos: 5,
      totalDuration: "20 hr 45 min",
      playlistUrl: "https://www.youtube.com/watch?v=4ifxQ_th07U",
      episodes: [
        {
          id: "s09-ep01",
          order: 1,
          title: "The Ultimate Data Engineering Roadmap 2026: Step-by-Step Career Strategy",
          duration: "42 min",
          durationMinutes: 42,
          youtubeId: "4ifxQ_th07U",
          youtubeUrl: "https://www.youtube.com/watch?v=4ifxQ_th07U",
          summary: "Resume optimization, LinkedIn branding, Naukri ATS scoring, and cold outreach tactics that get interviews.",
          keyTopic: "Resume & ATS Optimization"
        },
        {
          id: "s09-ep02",
          order: 2,
          title: "System Design Interview: Step-by-Step Architecture Guide for Data Engineers",
          duration: "32 min",
          durationMinutes: 32,
          youtubeId: "bUHFg8CZFws",
          youtubeUrl: "https://www.youtube.com/watch?v=bUHFg8CZFws",
          summary: "Framework for passing system design rounds: capacity estimation, throughput sizing, latency SLAs.",
          keyTopic: "System Design Framework"
        },
        {
          id: "s09-ep03",
          order: 3,
          title: "The 7 Data Quality Checks Every Production Pipeline Needs",
          duration: "1 hr 15 min",
          durationMinutes: 75,
          youtubeId: "hf2go3E2m8g",
          youtubeUrl: "https://www.youtube.com/watch?v=hf2go3E2m8g",
          summary: "Null checks, uniqueness, freshness, schema drift alerts, volume anomalies, and lineage audits.",
          keyTopic: "Data Quality & SLAs"
        },
        {
          id: "s09-ep04",
          order: 4,
          title: "Kimball Dimensional Modeling: Star Schemas, Conformed Dimensions & Marts",
          duration: "45 min",
          durationMinutes: 45,
          youtubeId: "gRE3E7VUzRU",
          youtubeUrl: "https://www.youtube.com/watch?v=gRE3E7VUzRU",
          summary: "The Vault literature deep dive: reading Kimball Data Warehouse Toolkit for warehouse design.",
          keyTopic: "Kimball Modeling"
        },
        {
          id: "s09-ep05",
          order: 5,
          title: "Snowflake Enterprise Architecture, Multi-Cluster Warehouses & Zero-Copy Clones",
          duration: "7 hr 15 min",
          durationMinutes: 435,
          youtubeId: "7lpp5N73V98",
          youtubeUrl: "https://www.youtube.com/watch?v=7lpp5N73V98",
          summary: "Mastering cloud data warehousing, micro-partitions, time travel queries, and resource monitors.",
          keyTopic: "Snowflake Architecture"
        }
      ]
    },
    topics: [
      "Brand Optimization: Resume, LinkedIn, and Naukri ATS optimization",
      "Interview Prep: Tech Guides Hub (100+ Interview Questions), System Design rounds",
      "The Vault Access: Fundamentals of Data Engineering, Designing Data-Intensive Applications, Kimball Data Warehouse Toolkit, Spark Definitive Guide",
      "Mentorship: Referrals, mock interviews, and 90-day consistency tracking"
    ],
    revisionChecklist: [
      "Complete 3 full mock technical interviews",
      "Update LinkedIn profile to feature the Gen AI & Fabric projects",
      "Review 'The 7 Data Quality Checks Every Pipeline Needs' from the Tech Guides"
    ]
  }
];

export const TRACK_ROLES: Record<'engineer' | 'analyst' | 'scientist', TrackRole> = {
  engineer: {
    id: 'engineer',
    title: 'Senior Data Engineer Track',
    subtitle: 'Comprehensive 9-Stage Curriculum (All Milestones & Playlists)',
    badge: 'Flagship Track • 100% Free',
    description: 'Complete all 9 stages covering cloud foundations, Python DSA, SQL optimization, ADF ETL, PySpark & Kafka streaming, Lakehouse Medallion & dbt, Fabric Gen AI, production portfolio projects, and interview acceleration.',
    targetStages: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    estimatedHours: '200+ hours',
    careerOutcomes: [
      'Senior Data Engineer',
      'Lead Analytics Engineer',
      'Big Data Specialist',
      'Cloud Data Architect'
    ]
  },
  analyst: {
    id: 'analyst',
    title: 'Data Analyst Track',
    subtitle: 'Stages 01, 03, 06 & 07 (Cloud, SQL, Lakehouse, Fabric)',
    badge: 'Specialized Track • 100% Free',
    description: 'Master Cloud foundations (DP-900), deep SQL querying and window functions, modern Lakehouse analytics with Databricks & dbt, and Microsoft Fabric + Power BI dashboarding.',
    targetStages: [1, 3, 6, 7],
    estimatedHours: '85+ hours',
    careerOutcomes: [
      'Senior Data Analyst',
      'Business Intelligence Engineer',
      'Analytics Engineer',
      'Fabric / Power BI Developer'
    ]
  },
  scientist: {
    id: 'scientist',
    title: 'Data Scientist Track',
    subtitle: 'Stages 01, 02, 03, 05 & 07 (Cloud, Python DSA, SQL, Spark, Gen AI)',
    badge: 'Specialized Track • 100% Free',
    description: 'Focus on Cloud data architectures, advanced Python & DSA algorithms, complex SQL querying, distributed PySpark compute, and modern Generative AI / LLM integration with Microsoft Fabric.',
    targetStages: [1, 2, 3, 5, 7],
    estimatedHours: '120+ hours',
    careerOutcomes: [
      'Data Scientist',
      'Machine Learning Engineer',
      'AI Data Specialist',
      'Quantitative Analyst'
    ]
  }
};
