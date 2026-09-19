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

export const formatMinutesToDuration = (totalMinutes: number): string => {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m} min`;
  return `${h} hr ${m > 0 ? `${m} min` : ''}`.trim();
};

export const MASTER_CURRICULUM: CurriculumStage[] = [
  {
    milestone: "Stage 01",
    stageNumber: 1,
    title: "Cloud & Data Foundations (DP-900 & Azure Ecosystem)",
    category: "Cloud Architecture",
    durationEstimate: "16-18 Hours",
    videoUrl: "https://www.youtube.com/watch?v=IaA9YNlg5hM",
    youtubeId: "IaA9YNlg5hM",
    playlist: {
      playlistTitle: "Azure Cloud & Data Foundations (DP-900 & Enterprise Architecture)",
      channelName: "DataVeda Cloud Engineering",
      totalVideos: 8,
      totalDuration: "16 hr 27 min",
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
          title: "Microsoft Azure Data Fundamentals DP 900 Full Course",
          duration: "3 hr 10 min",
          durationMinutes: 190,
          youtubeId: "jopyoCgQjkM",
          youtubeUrl: "https://www.youtube.com/watch?v=jopyoCgQjkM",
          summary: "Core storage paradigms, transactional (OLTP) vs analytical (OLAP) processing, and cloud career roadmap.",
          keyTopic: "DP-900 Core Concepts"
        },
        {
          id: "s01-ep04",
          order: 4,
          title: "DP-900 Full Course & Azure Data Fundamentals Certification Training",
          duration: "3 hr 45 min",
          durationMinutes: 225,
          youtubeId: "XbV0Di5ggvY",
          youtubeUrl: "https://www.youtube.com/watch?v=XbV0Di5ggvY",
          summary: "Comprehensive exam prep: Cosmos DB, Azure SQL, Synapse Analytics, data ingestion, and cloud security frameworks.",
          keyTopic: "DP-900 Certification"
        },
        {
          id: "s01-ep05",
          order: 5,
          title: "Azure Storage Account & Data Lake ADLS Gen2 Tutorial (2025)",
          duration: "1 hr 15 min",
          durationMinutes: 75,
          youtubeId: "ffMR2WM3aqE",
          youtubeUrl: "https://www.youtube.com/watch?v=ffMR2WM3aqE",
          summary: "Configuring container access policies, SAS tokens, lifecycle management tiers (Hot/Cool/Archive), and data lake directory structures.",
          keyTopic: "Cloud Storage & ADLS"
        },
        {
          id: "s01-ep06",
          order: 6,
          title: "Azure Data Lake Storage Gen 2 Overview & Deep Dive",
          duration: "42 min",
          durationMinutes: 42,
          youtubeId: "NHn5GAkvlwg",
          youtubeUrl: "https://www.youtube.com/watch?v=NHn5GAkvlwg",
          summary: "Deep architectural dive into Hierarchical Namespace (HNS), POSIX ACL permissions, and high-throughput big data read/write patterns.",
          keyTopic: "ADLS Gen2 Architecture"
        },
        {
          id: "s01-ep07",
          order: 7,
          title: "Azure Data Factory Fundamentals & Hybrid Integration Runtimes",
          duration: "2 hr 45 min",
          durationMinutes: 165,
          youtubeId: "9COKVzBvQyo",
          youtubeUrl: "https://www.youtube.com/watch?v=9COKVzBvQyo",
          summary: "Control plane vs data plane in Azure, Self-Hosted IR setup for on-premise networks, and Linked Services.",
          keyTopic: "Azure Data Factory"
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
      totalVideos: 7,
      totalDuration: "26 hr 24 min",
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
          summary: "Complete syntax, control flow, functions, modular architecture, and file I/O operations.",
          keyTopic: "Core Python & Syntax"
        },
        {
          id: "s02-ep02",
          order: 2,
          title: "Python Full Course for Free (Zero to Advanced)",
          duration: "4 hr 15 min",
          durationMinutes: 255,
          youtubeId: "XKHEtdqhLK8",
          youtubeUrl: "https://www.youtube.com/watch?v=XKHEtdqhLK8",
          summary: "Variables, collections (lists, tuples, dicts, sets), string operations, and high-performance algorithms.",
          keyTopic: "Data Structures & Collections"
        },
        {
          id: "s02-ep03",
          order: 3,
          title: "Data Structures and Algorithms in Python: Full Course for Beginners",
          duration: "4 hr 30 min",
          durationMinutes: 270,
          youtubeId: "pkYVOmU3MgA",
          youtubeUrl: "https://www.youtube.com/watch?v=pkYVOmU3MgA",
          summary: "Binary search, linked lists, hash tables, sorting algorithms, and Big-O computational complexity.",
          keyTopic: "DSA & Big-O Complexity"
        },
        {
          id: "s02-ep04",
          order: 4,
          title: "Intermediate Python Programming: Generators, Decorators & Multiprocessing",
          duration: "3 hr 15 min",
          durationMinutes: 195,
          youtubeId: "HGOBQPFzWKo",
          youtubeUrl: "https://www.youtube.com/watch?v=HGOBQPFzWKo",
          summary: "Memory-efficient stream processing with generators, function decorators, lambda transforms, and threading.",
          keyTopic: "Advanced Python & Concurrency"
        },
        {
          id: "s02-ep05",
          order: 5,
          title: "Object-Oriented Programming (OOP) in Python: Classes & Design Patterns",
          duration: "3 hr 20 min",
          durationMinutes: 200,
          youtubeId: "_uQrJ0TkZlc",
          youtubeUrl: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
          summary: "Classes, inheritance, encapsulation, polymorphism, custom exceptions, and modular pipeline design.",
          keyTopic: "OOP & Engineering Patterns"
        },
        {
          id: "s02-ep06",
          order: 6,
          title: "12 Practical Python Data Projects - Coding Course",
          duration: "3 hr 08 min",
          durationMinutes: 188,
          youtubeId: "8ext9G7xspg",
          youtubeUrl: "https://www.youtube.com/watch?v=8ext9G7xspg",
          summary: "Hands-on projects parsing JSON, REST APIs, CSV bulk loaders, and automated data validators.",
          keyTopic: "Hands-on Data Projects"
        },
        {
          id: "s02-ep07",
          order: 7,
          title: "Python LIVE: Data Structures & Algorithms + NeetCode + Two Sum",
          duration: "3 hr 30 min",
          durationMinutes: 210,
          youtubeId: "p35CcLiCOGU",
          youtubeUrl: "https://www.youtube.com/watch?v=p35CcLiCOGU",
          summary: "Live technical interview problem solving, two pointers, sliding window, and graph traversals.",
          keyTopic: "Interview Problem Solving"
        }
      ]
    },
    topics: [
      "Python Basics: Variables, Loops, Conditionals, Functions, Scope, File I/O",
      "OOP: Classes, Objects, Inheritance, Encapsulation, Polymorphism, Magic (Dunder) Methods",
      "Data Structures: Lists, Dictionaries, Sets, Tuples, Stacks, Queues, Hashmaps",
      "LeetCode 75 Patterns: Two Pointers, Sliding Window, Fast/Slow Pointers, Binary Search"
    ],
    revisionChecklist: [
      "Write a custom class with __repr__ and __eq__ methods",
      "Solve 'Two Sum' and 'Valid Anagram' on LeetCode with O(n) complexity"
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
      playlistTitle: "Advanced SQL & Database Engines for Data Engineering",
      channelName: "DataVeda SQL Mastery",
      totalVideos: 7,
      totalDuration: "25 hr 13 min",
      playlistUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
      episodes: [
        {
          id: "s03-ep01",
          order: 1,
          title: "SQL Full Course: Relational Database Architecture & Query Fundamentals",
          duration: "4 hr 20 min",
          durationMinutes: 260,
          youtubeId: "HXV3zeQKqGY",
          youtubeUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
          summary: "Core DDL/DML, multi-table joins, subqueries, grouping sets, and relational constraint integrity.",
          keyTopic: "SQL Fundamentals & Relational Design"
        },
        {
          id: "s03-ep02",
          order: 2,
          title: "SQL Course for Beginners to Intermediate [Full Course]",
          duration: "4 hr 18 min",
          durationMinutes: 258,
          youtubeId: "7S_tz1z_5bA",
          youtubeUrl: "https://www.youtube.com/watch?v=7S_tz1z_5bA",
          summary: "Filtering, aggregation, self joins, unions, inserting/updating data, and transaction basics.",
          keyTopic: "Intermediate SQL Mastery"
        },
        {
          id: "s03-ep03",
          order: 3,
          title: "SQL Basics & Database Engine Internals for Beginners",
          duration: "3 hr 45 min",
          durationMinutes: 225,
          youtubeId: "zbMHLJ0dY4w",
          youtubeUrl: "https://www.youtube.com/watch?v=zbMHLJ0dY4w",
          summary: "Relational storage layout, page buffers, B-trees, clustered indexes, and execution plans.",
          keyTopic: "Storage Engine Internals"
        },
        {
          id: "s03-ep04",
          order: 4,
          title: "Solve 20 LeetCode SQL Medium Problems in 2 Hours (Live Masterclass)",
          duration: "2 hr 10 min",
          durationMinutes: 130,
          youtubeId: "SKgVxXelDZI",
          youtubeUrl: "https://www.youtube.com/watch?v=SKgVxXelDZI",
          summary: "Hands-on walk-through of top company interview problems on Ankit Bansal's channel.",
          keyTopic: "LeetCode SQL Medium"
        },
        {
          id: "s03-ep05",
          order: 5,
          title: "Snowflake Enterprise Architecture & SQL Cloud Data Warehousing",
          duration: "7 hr 15 min",
          durationMinutes: 435,
          youtubeId: "7lpp5N73V98",
          youtubeUrl: "https://www.youtube.com/watch?v=7lpp5N73V98",
          summary: "Virtual warehouses, micro-partitioning, zero-copy cloning, time travel, and cloud SQL queries.",
          keyTopic: "Snowflake & Cloud Warehousing"
        },
        {
          id: "s03-ep06",
          order: 6,
          title: "Data Modeling Tutorial: Star Schema (Kimball Approach)",
          duration: "45 min",
          durationMinutes: 45,
          youtubeId: "gRE3E7VUzRU",
          youtubeUrl: "https://www.youtube.com/watch?v=gRE3E7VUzRU",
          summary: "Fact tables, dimension tables, surrogate keys, snowflake schemas, and conformed dimensional modeling.",
          keyTopic: "Dimensional Modeling"
        },
        {
          id: "s03-ep07",
          order: 7,
          title: "Advanced Window Functions: ROW_NUMBER, RANK, DENSE_RANK, LEAD & LAG",
          duration: "2 hr 40 min",
          durationMinutes: 160,
          youtubeId: "SKgVxXelDZI",
          youtubeUrl: "https://www.youtube.com/watch?v=SKgVxXelDZI",
          summary: "Partitioning, rolling averages, running totals, offsets, and solving consecutive login streaks.",
          keyTopic: "Advanced Window Functions"
        }
      ]
    },
    topics: [
      "Window Functions: ROW_NUMBER(), RANK(), DENSE_RANK(), LEAD(), LAG(), NTILE()",
      "CTEs, Subqueries, Temp Tables, Table Variables, Views, Materialized Views",
      "Query Optimization: Execution Plans, Index Tuning, SARGable Queries, Hash vs Nested Loop Joins",
      "Data Warehousing: Star Schema, Snowflake Schema, Fact vs Dimension, SCD Types 1, 2, 3"
    ],
    revisionChecklist: [
      "Write a query using DENSE_RANK() to find the 2nd highest salary by department",
      "Explain the difference between a Clustered and Non-Clustered index"
    ]
  },
  {
    milestone: "Stage 04",
    stageNumber: 4,
    title: "Orchestration & ETL (Azure Data Factory & DevOps)",
    category: "Data Pipelines & DevOps",
    durationEstimate: "18-22 Hours",
    videoUrl: "https://www.youtube.com/watch?v=9COKVzBvQyo",
    youtubeId: "9COKVzBvQyo",
    playlist: {
      playlistTitle: "Azure Data Factory, Cloud ETL & DevOps Pipeline Orchestration",
      channelName: "DataVeda Pipeline Engineering",
      totalVideos: 7,
      totalDuration: "19 hr 43 min",
      playlistUrl: "https://www.youtube.com/watch?v=9COKVzBvQyo",
      episodes: [
        {
          id: "s04-ep01",
          order: 1,
          title: "Complete Azure Data Factory - {End to End} Full Course",
          duration: "3 hr 05 min",
          durationMinutes: 185,
          youtubeId: "9COKVzBvQyo",
          youtubeUrl: "https://www.youtube.com/watch?v=9COKVzBvQyo",
          summary: "ADF architecture, integration runtimes, datasets, linked services, and end-to-end data pipelines.",
          keyTopic: "ADF Core Architecture"
        },
        {
          id: "s04-ep02",
          order: 2,
          title: "Azure Data Factory Beginner to Pro Tutorial [Full Course]",
          duration: "3 hr 30 min",
          durationMinutes: 210,
          youtubeId: "DLmlFlQGQWo",
          youtubeUrl: "https://www.youtube.com/watch?v=DLmlFlQGQWo",
          summary: "Pipeline orchestration, control flows, data transformation flows, and error handling strategies.",
          keyTopic: "ADF Pipelines & Dataflows"
        },
        {
          id: "s04-ep03",
          order: 3,
          title: "Learn Azure Data Factory in 2026 - Modern Cloud ETL Full Course",
          duration: "2 hr 50 min",
          durationMinutes: 170,
          youtubeId: "0PjuNHYiX00",
          youtubeUrl: "https://www.youtube.com/watch?v=0PjuNHYiX00",
          summary: "REST API ingestion, incremental data loading, dynamic parameters, and Key Vault integration.",
          keyTopic: "Incremental Ingestion"
        },
        {
          id: "s04-ep04",
          order: 4,
          title: "Azure Data Factory ADVANCED Course with CI/CD & YAML Automation",
          duration: "3 hr 45 min",
          durationMinutes: 225,
          youtubeId: "KxUm1eXQha8",
          youtubeUrl: "https://www.youtube.com/watch?v=KxUm1eXQha8",
          summary: "Enterprise CI/CD deployment, ARM templates, GitHub integration, PR approvals, and production releases.",
          keyTopic: "ADF CI/CD & Automation"
        },
        {
          id: "s04-ep05",
          order: 5,
          title: "Azure Data Engineer Full Course 2025 | ADF & Cloud Integration",
          duration: "4 hr 15 min",
          durationMinutes: 255,
          youtubeId: "YkK0mdcJfHg",
          youtubeUrl: "https://www.youtube.com/watch?v=YkK0mdcJfHg",
          summary: "Complete enterprise scenario connecting on-premises databases to Azure cloud data lakes and warehouses.",
          keyTopic: "Hybrid Cloud Integration"
        },
        {
          id: "s04-ep06",
          order: 6,
          title: "Twitter Data Pipeline using Airflow for Beginners",
          duration: "58 min",
          durationMinutes: 58,
          youtubeId: "q8q3OFFfY6c",
          youtubeUrl: "https://www.youtube.com/watch?v=q8q3OFFfY6c",
          summary: "Building an automated DAG pipeline using Apache Airflow, task dependencies, and cloud storage triggers.",
          keyTopic: "Apache Airflow DAGs"
        },
        {
          id: "s04-ep07",
          order: 7,
          title: "Databricks Session 29: Introduction to Azure Data Factory & Cloud Compute",
          duration: "1 hr 20 min",
          durationMinutes: 80,
          youtubeId: "JtrHffY2m_E",
          youtubeUrl: "https://www.youtube.com/watch?v=JtrHffY2m_E",
          summary: "Triggering Databricks notebook activities, passing parameters dynamically, and monitoring compute logs.",
          keyTopic: "ADF to Databricks Integration"
        }
      ]
    },
    topics: [
      "ADF Components: Pipelines, Activities, Datasets, Linked Services, Integration Runtimes (Azure, Self-hosted)",
      "Control Flow: Lookup, Get Metadata, ForEach, If Condition, Until, Web, Execute Pipeline",
      "Data Flows: Transformations, Joins, Aggregations, Conditional Split, Derived Column, Schema Drift",
      "DevOps: Git Integration, ARM Templates, Automated Deployment, CI/CD with Azure DevOps Pipelines"
    ],
    revisionChecklist: [
      "Build a pipeline to copy data from Blob to SQL with dynamic file naming",
      "Configure a Self-hosted Integration Runtime on a local machine/VM"
    ]
  },
  {
    milestone: "Stage 05",
    stageNumber: 5,
    title: "Big Data Compute & Streaming (PySpark & Kafka)",
    category: "Distributed Big Data",
    durationEstimate: "22-26 Hours",
    videoUrl: "https://www.youtube.com/watch?v=laP5dL0By84",
    youtubeId: "laP5dL0By84",
    playlist: {
      playlistTitle: "PySpark Distributed Big Data & Apache Kafka Streaming",
      channelName: "DataVeda Big Data Academy",
      totalVideos: 8,
      totalDuration: "23 hr 32 min",
      playlistUrl: "https://www.youtube.com/watch?v=laP5dL0By84",
      episodes: [
        {
          id: "s05-ep01",
          order: 1,
          title: "PySpark for Data Engineers Full Course 2026 | Basics to Advanced",
          duration: "4 hr 25 min",
          durationMinutes: 265,
          youtubeId: "laP5dL0By84",
          youtubeUrl: "https://www.youtube.com/watch?v=laP5dL0By84",
          summary: "Spark architecture, Driver & Executors, DataFrame API, Catalyst Optimizer, and broad transformations.",
          keyTopic: "PySpark Core Architecture"
        },
        {
          id: "s05-ep02",
          order: 2,
          title: "PySpark Full Course 2025 🔥 (Zero to Job-Ready) | Hands-On Projects",
          duration: "4 hr 50 min",
          durationMinutes: 290,
          youtubeId: "3r8Ltk3I7j0",
          youtubeUrl: "https://www.youtube.com/watch?v=3r8Ltk3I7j0",
          summary: "Hands-on PySpark project covering complex nested JSON, windowing, aggregation, and S3/ADLS writes.",
          keyTopic: "Production PySpark ETL"
        },
        {
          id: "s05-ep03",
          order: 3,
          title: "PySpark Tutorial for Beginners & Core DataFrame Operations",
          duration: "3 hr 15 min",
          durationMinutes: 195,
          youtubeId: "_C8kWso4ne4",
          youtubeUrl: "https://www.youtube.com/watch?v=_C8kWso4ne4",
          summary: "RDD vs DataFrame, lazy evaluation, schema enforcement, filtering, and Spark SQL expressions.",
          keyTopic: "DataFrames & Spark SQL"
        },
        {
          id: "s05-ep04",
          order: 4,
          title: "PySpark Optimization Full Course 2025 [Step-By-Step Guide]",
          duration: "3 hr 10 min",
          durationMinutes: 190,
          youtubeId: "CY_WaxCxJco",
          youtubeUrl: "https://www.youtube.com/watch?v=CY_WaxCxJco",
          summary: "Adaptive Query Execution (AQE), broadcast joins, caching, salting to eliminate shuffle skew, and memory tuning.",
          keyTopic: "Spark Performance Tuning"
        },
        {
          id: "s05-ep05",
          order: 5,
          title: "PySpark Streaming Full Course | Big Data With Apache Spark",
          duration: "2 hr 45 min",
          durationMinutes: 165,
          youtubeId: "r7FTCuTl84g",
          youtubeUrl: "https://www.youtube.com/watch?v=r7FTCuTl84g",
          summary: "Structured Streaming, streaming DataFrames, watermarks, sliding windows, and checkpointing.",
          keyTopic: "Structured Streaming"
        },
        {
          id: "s05-ep06",
          order: 6,
          title: "PySpark Full Course & Interview Preparation Masterclass",
          duration: "2 hr 30 min",
          durationMinutes: 150,
          youtubeId: "NplzvSNsTs0",
          youtubeUrl: "https://www.youtube.com/watch?v=NplzvSNsTs0",
          summary: "Answering top PySpark interview questions: partitionBy vs bucketBy, shuffle spills, and OOM fixes.",
          keyTopic: "PySpark Interview Qs"
        },
        {
          id: "s05-ep07",
          order: 7,
          title: "Apache Kafka Crash Course: Brokers, Topics & Consumer Groups",
          duration: "1 hr 22 min",
          durationMinutes: 82,
          youtubeId: "R873BlNVUB4",
          youtubeUrl: "https://www.youtube.com/watch?v=R873BlNVUB4",
          summary: "Distributed log semantics, partition rebalancing, offset tracking, ACKs, and producer idempotency.",
          keyTopic: "Kafka Core Concepts"
        },
        {
          id: "s05-ep08",
          order: 8,
          title: "Introduction to Kafka Streams & Event Processing",
          duration: "1 hr 15 min",
          durationMinutes: 75,
          youtubeId: "ni3XPsYC5cQ",
          youtubeUrl: "https://www.youtube.com/watch?v=ni3XPsYC5cQ",
          summary: "Kafka Streams topology, KTable vs KStream, stateful processing, and joining event streams in real time.",
          keyTopic: "Kafka Streams & Real-Time"
        }
      ]
    },
    topics: [
      "Spark Architecture: Driver, Executors, Cluster Manager (YARN, Standalone), DAG, Catalyst Optimizer",
      "PySpark API: DataFrames, Transformations (Narrow vs Wide), Actions, Spark SQL, Window Functions",
      "Optimization: Partitioning, Coalesce vs Repartition, Broadcast Joins, Caching vs Persist, Skew Handling",
      "Kafka & Streaming: Producers, Consumers, Topics, Partitions, Consumer Groups, Structured Streaming"
    ],
    revisionChecklist: [
      "Explain what causes a Spark Shuffle and how to minimize it",
      "Write a PySpark script to read a 1GB CSV, clean it, and write as partitioned Parquet"
    ]
  },
  {
    milestone: "Stage 06",
    stageNumber: 6,
    title: "Lakehouse Architectures (Databricks & dbt Core)",
    category: "Lakehouse & Modeling",
    durationEstimate: "15-18 Hours",
    videoUrl: "https://www.youtube.com/watch?v=XOSuR8g2SfQ",
    youtubeId: "XOSuR8g2SfQ",
    playlist: {
      playlistTitle: "Databricks Lakehouse, Delta Lake & dbt Core Modeling",
      channelName: "DataVeda Lakehouse Institute",
      totalVideos: 7,
      totalDuration: "15 hr 22 min",
      playlistUrl: "https://www.youtube.com/watch?v=XOSuR8g2SfQ",
      episodes: [
        {
          id: "s06-ep01",
          order: 1,
          title: "01 Databricks Tutorial 2025 | Databricks for Data Engineering",
          duration: "2 hr 15 min",
          durationMinutes: 135,
          youtubeId: "XOSuR8g2SfQ",
          youtubeUrl: "https://www.youtube.com/watch?v=XOSuR8g2SfQ",
          summary: "Databricks workspaces, clusters, notebook workflows, Unity Catalog, and DBFS storage architecture.",
          keyTopic: "Databricks Platform Overview"
        },
        {
          id: "s06-ep02",
          order: 2,
          title: "End to End Medallion Architecture Pipeline on Databricks",
          duration: "2 hr 45 min",
          durationMinutes: 165,
          youtubeId: "nLnwmpA9Tvs",
          youtubeUrl: "https://www.youtube.com/watch?v=nLnwmpA9Tvs",
          summary: "Building Bronze (raw), Silver (cleansed), and Gold (aggregated) layers using Auto Loader and Delta tables.",
          keyTopic: "Medallion Architecture"
        },
        {
          id: "s06-ep03",
          order: 3,
          title: "Delta Lake - EXPLAINED - Full Tutorial",
          duration: "1 hr 30 min",
          durationMinutes: 90,
          youtubeId: "fkWxiesfrgk",
          youtubeUrl: "https://www.youtube.com/watch?v=fkWxiesfrgk",
          summary: "ACID transactions on data lakes, parquet storage, _delta_log transaction journal, and time travel querying.",
          keyTopic: "Delta Lake Fundamentals"
        },
        {
          id: "s06-ep04",
          order: 4,
          title: "Delta Lake Masterclass | Azure Databricks | PySpark Zero-To-Expert",
          duration: "5 hr 40 min",
          durationMinutes: 340,
          youtubeId: "8IjCyvyAPpM",
          youtubeUrl: "https://www.youtube.com/watch?v=8IjCyvyAPpM",
          summary: "In-depth masterclass on Delta Lake optimization, Z-Ordering, Liquid Clustering, compaction, and VACUUM.",
          keyTopic: "Delta Lake Masterclass"
        },
        {
          id: "s06-ep05",
          order: 5,
          title: "Introduction to Azure Databricks Workspaces & Compute Clusters",
          duration: "1 hr 15 min",
          durationMinutes: 75,
          youtubeId: "yGWKmypU99A",
          youtubeUrl: "https://www.youtube.com/watch?v=yGWKmypU99A",
          summary: "Cluster policies, spot instances, auto-termination, and Azure Key Vault secret scopes integration.",
          keyTopic: "Databricks Clusters & Compute"
        },
        {
          id: "s06-ep06",
          order: 6,
          title: "Intro to Data Build Tool (dbt) // Create your first project!",
          duration: "1 hr 12 min",
          durationMinutes: 72,
          youtubeId: "5rNquRnNb4E",
          youtubeUrl: "https://www.youtube.com/watch?v=5rNquRnNb4E",
          summary: "dbt Core fundamentals: models, staging views, incremental materializations, and ref() functions.",
          keyTopic: "dbt Core Fundamentals"
        },
        {
          id: "s06-ep07",
          order: 7,
          title: "Data Modeling Tutorial: Star Schema (aka Kimball Approach)",
          duration: "45 min",
          durationMinutes: 45,
          youtubeId: "gRE3E7VUzRU",
          youtubeUrl: "https://www.youtube.com/watch?v=gRE3E7VUzRU",
          summary: "Designing dimension tables, fact tables, and implementing SCD Type 2 upserts in Lakehouse models.",
          keyTopic: "Star Schema Data Modeling"
        }
      ]
    },
    topics: [
      "Databricks: Workspaces, Clusters, Notebooks, Jobs, DBFS, Databricks CLI, Secret Scopes",
      "Delta Lake: ACID Transactions, Time Travel, Schema Enforcement/Evolution, VACUUM, Z-ORDER, Liquid Clustering",
      "Medallion Architecture: Bronze (Raw ingestion), Silver (Cleansed/Enriched), Gold (Business Aggregates)",
      "dbt Core: Models, Sources, Seeds, Tests, Snapshots (SCD Type 2), Jinja & Macros, Documentation"
    ],
    revisionChecklist: [
      "Implement a Delta Lake MERGE query to handle Slowly Changing Dimensions (SCD Type 2)",
      "Create a dbt model that uses the ref() function and has schema tests configured"
    ]
  },
  {
    milestone: "Stage 07",
    stageNumber: 7,
    title: "Modern Analytics & AI (Microsoft Fabric)",
    category: "Fabric, PowerBI & Gen AI",
    durationEstimate: "18-22 Hours",
    videoUrl: "https://www.youtube.com/watch?v=4qEAT4iEktg",
    youtubeId: "4qEAT4iEktg",
    playlist: {
      playlistTitle: "Microsoft Fabric SaaS Analytics, OneLake & Generative AI",
      channelName: "DataVeda Fabric Studio",
      totalVideos: 5,
      totalDuration: "19 hr 25 min",
      playlistUrl: "https://www.youtube.com/watch?v=4qEAT4iEktg",
      episodes: [
        {
          id: "s07-ep01",
          order: 1,
          title: "Microsoft Fabric Full Course 2026 | End-to-End Data Engineering | 11+ Hours",
          duration: "7 hr 30 min",
          durationMinutes: 450,
          youtubeId: "4qEAT4iEktg",
          youtubeUrl: "https://www.youtube.com/watch?v=4qEAT4iEktg",
          summary: "Complete deep-dive into OneLake, Lakehouse items, Fabric Data Factory, Spark notebooks, SQL endpoints, and Power BI.",
          keyTopic: "Fabric Unified Platform"
        },
        {
          id: "s07-ep02",
          order: 2,
          title: "Microsoft Fabric for Beginners: Complete 5-Hour Crash Course",
          duration: "5 hr 00 min",
          durationMinutes: 300,
          youtubeId: "4hz6bBFE2a8",
          youtubeUrl: "https://www.youtube.com/watch?v=4hz6bBFE2a8",
          summary: "Hands-on walkthrough of OneLake shortcuts, KQL database real-time analytics, Copilot Gen AI, and Power BI Direct Lake.",
          keyTopic: "OneLake & Real-Time Analytics"
        },
        {
          id: "s07-ep03",
          order: 3,
          title: "Microsoft Fabric Full Course | End-to-End Data Engineering Tutorial",
          duration: "3 hr 15 min",
          durationMinutes: 195,
          youtubeId: "eL0zpnW_mKI",
          youtubeUrl: "https://www.youtube.com/watch?v=eL0zpnW_mKI",
          summary: "Building an enterprise pipeline in Fabric using Dataflows Gen2, medallion staging, and delta table optimizations.",
          keyTopic: "Dataflows Gen2 & Pipelines"
        },
        {
          id: "s07-ep04",
          order: 4,
          title: "End-to-End Microsoft Fabric Project for Beginners | Full Tutorial",
          duration: "2 hr 10 min",
          durationMinutes: 130,
          youtubeId: "52yIf4K3K0E",
          youtubeUrl: "https://www.youtube.com/watch?v=52yIf4K3K0E",
          summary: "Real-world project from ingestion of public APIs to Gold-layer dimensional models and interactive executive dashboards.",
          keyTopic: "Hands-on Fabric Project"
        },
        {
          id: "s07-ep05",
          order: 5,
          title: "Introduction to Microsoft Fabric & OneLake Ecosystem",
          duration: "1 hr 30 min",
          durationMinutes: 90,
          youtubeId: "NXQ0j9CZPyk",
          youtubeUrl: "https://www.youtube.com/watch?v=NXQ0j9CZPyk",
          summary: "Core architectural principles: SaaS simplicity, shortcuts across clouds (AWS S3, ADLS), and tenant governance.",
          keyTopic: "Fabric Architecture & Governance"
        }
      ]
    },
    topics: [
      "Microsoft Fabric: OneLake, Lakehouse vs Warehouse, Shortcuts, Direct Lake mode in Power BI",
      "Fabric Workloads: Data Factory (Pipelines & Dataflows Gen2), Synapse Data Engineering, Synapse Real-Time Analytics",
      "Power BI for Engineers: Semantic Models, Star Schema in Power BI, DAX basics, Direct Lake performance",
      "Gen AI in Data: LLMs for Data Engineering, Text-to-SQL, Vector DBs, RAG pipelines, Fabric Copilot"
    ],
    revisionChecklist: [
      "Explain Direct Lake mode and how it differs from Import and DirectQuery",
      "Create a OneLake shortcut to an external ADLS Gen2 container"
    ]
  },
  {
    milestone: "Stage 08",
    stageNumber: 8,
    title: "The DataVeda Masterclass Projects Portfolio",
    category: "Real-World Production Projects",
    durationEstimate: "11 Hours of Video + 25h Lab",
    videoUrl: "https://www.youtube.com/watch?v=WpQECq5Hx9g",
    youtubeId: "WpQECq5Hx9g",
    playlist: {
      playlistTitle: "Production Data Engineering Portfolio Projects",
      channelName: "DataVeda Project Lab",
      totalVideos: 7,
      totalDuration: "11 hr 00 min",
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
          summary: "TLC trip record analysis, dimensional modeling, automated orchestrator setup, and real-time dashboarding.",
          keyTopic: "Uber Analytics Project"
        },
        {
          id: "s08-ep02",
          order: 2,
          title: "Zomato AI Data Analytics: End-To-End AI Data Engineering Project",
          duration: "1 hr 35 min",
          durationMinutes: 95,
          youtubeId: "kYwaNMQ3XT8",
          youtubeUrl: "https://www.youtube.com/watch?v=kYwaNMQ3XT8",
          summary: "Restaurant supply-chain tracking, geospatial indexing, AI-augmented data validation, and automated ETL.",
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
          summary: "Twitter API ingestion, EC2 instance deployment, DAG triggers, and automated storage in Amazon S3.",
          keyTopic: "Twitter Airflow Pipeline"
        },
        {
          id: "s08-ep04",
          order: 4,
          title: "AWS Data Engineering Masterclass: Serverless Lambda, Glue & Athena",
          duration: "1 hr 45 min",
          durationMinutes: 105,
          youtubeId: "yvAWbbQa8eE",
          youtubeUrl: "https://www.youtube.com/watch?v=yvAWbbQa8eE",
          summary: "Building an enterprise serverless data lake on AWS using Glue crawlers, S3 buckets, and Athena queries.",
          keyTopic: "AWS Serverless Pipeline"
        },
        {
          id: "s08-ep05",
          order: 5,
          title: "Olympic Data Analytics & End-to-End Azure Pipeline",
          duration: "2 hr 05 min",
          durationMinutes: 125,
          youtubeId: "IaA9YNlg5hM",
          youtubeUrl: "https://www.youtube.com/watch?v=IaA9YNlg5hM",
          summary: "Extracting historical Olympic datasets with ADF, ADLS Gen2, Azure Databricks PySpark, and Synapse SQL.",
          keyTopic: "Azure Olympic Pipeline"
        },
        {
          id: "s08-ep06",
          order: 6,
          title: "AWS ETL Pipeline Project For Beginners",
          duration: "1 hr 30 min",
          durationMinutes: 90,
          youtubeId: "yHHCV3Q13Fo",
          youtubeUrl: "https://www.youtube.com/watch?v=yHHCV3Q13Fo",
          summary: "End-to-end extraction with Python, AWS Lambda event triggers, S3 data lakes, and automated schema catalogs.",
          keyTopic: "AWS Lambda & Glue ETL"
        },
        {
          id: "s08-ep07",
          order: 7,
          title: "Spotify Analysis | End to End Data Engineering Project",
          duration: "1 hr 25 min",
          durationMinutes: 85,
          youtubeId: "9IzVC5b9QLM",
          youtubeUrl: "https://www.youtube.com/watch?v=9IzVC5b9QLM",
          summary: "Extracting Spotify top charts API, deploying AWS Lambda functions, staging raw JSON in S3, and Snowflake/Athena analysis.",
          keyTopic: "Spotify API Data Pipeline"
        }
      ]
    },
    topics: [
      "Project 1: Real-Time IoT Ingestion: Kafka -> Spark Streaming -> Delta Lake -> Power BI",
      "Project 2: E-Commerce Lakehouse: ADF -> ADLS -> Databricks -> dbt Core -> Snowflake -> Power BI",
      "Project 3: Healthcare Claims Batch: Python Scraper -> Azure Blob -> PySpark ETL -> Synapse -> Direct Lake",
      "Project 4: Financial Transactions CDC: Debezium -> Kafka -> Fabric Real-Time Analytics -> KQL Database"
    ],
    revisionChecklist: [
      "Deploy at least 2 end-to-end projects to a personal cloud account (free tier)",
      "Write comprehensive GitHub READMEs with architecture diagrams, setup guides, and cost analysis"
    ]
  },
  {
    milestone: "Stage 09",
    stageNumber: 9,
    title: "Career Acceleration & The Vault Library",
    category: "Career, Interviews & Vault",
    durationEstimate: "10-14 Hours",
    videoUrl: "https://www.youtube.com/watch?v=4ifxQ_th07U",
    youtubeId: "4ifxQ_th07U",
    playlist: {
      playlistTitle: "Data Engineering Career Strategy, System Design & Interview Mastery",
      channelName: "DataVeda Career Lab",
      totalVideos: 5,
      totalDuration: "10 hr 29 min",
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
          summary: "Essential tools, interview expectations, salary benchmarks, and how to land Senior DE offers in 2026.",
          keyTopic: "2026 DE Career Strategy"
        },
        {
          id: "s09-ep02",
          order: 2,
          title: "System Design Interview: Step-by-Step Architecture Guide for Data Engineers",
          duration: "32 min",
          durationMinutes: 32,
          youtubeId: "bUHFg8CZFws",
          youtubeUrl: "https://www.youtube.com/watch?v=bUHFg8CZFws",
          summary: "Designing scalable distributed systems: throughput estimation, partitioning strategies, and SLA trade-offs.",
          keyTopic: "System Design Architecture"
        },
        {
          id: "s09-ep03",
          order: 3,
          title: "The 7 Data Quality Checks Every Production Pipeline Needs",
          duration: "1 hr 15 min",
          durationMinutes: 75,
          youtubeId: "hf2go3E2m8g",
          youtubeUrl: "https://www.youtube.com/watch?v=hf2go3E2m8g",
          summary: "Schema drift, null percentages, volumetric anomalies, duplicate detection, and automated alerting.",
          keyTopic: "Production Data Quality"
        },
        {
          id: "s09-ep04",
          order: 4,
          title: "Kimball Dimensional Modeling: Star Schemas, Conformed Dimensions & Marts",
          duration: "45 min",
          durationMinutes: 45,
          youtubeId: "gRE3E7VUzRU",
          youtubeUrl: "https://www.youtube.com/watch?v=gRE3E7VUzRU",
          summary: "Fact grain, dimensional hierarchies, slowly changing dimensions (SCDs), and bridge tables for M:N relationships.",
          keyTopic: "Dimensional Modeling Deep Dive"
        },
        {
          id: "s09-ep05",
          order: 5,
          title: "Snowflake Enterprise Architecture, Multi-Cluster Warehouses & Zero-Copy Clones",
          duration: "7 hr 15 min",
          durationMinutes: 435,
          youtubeId: "7lpp5N73V98",
          youtubeUrl: "https://www.youtube.com/watch?v=7lpp5N73V98",
          summary: "Deep architectural masterclass on Snowflake storage, virtual warehouse scaling, RBAC, and data sharing.",
          keyTopic: "Enterprise Cloud Warehouses"
        }
      ]
    },
    topics: [
      "Resume & Portfolio: Project showcase, GitHub profile optimization, LinkedIn strategy for Data Engineers",
      "Interview Prep: Live coding (SQL + Python), System Design (Data Lakehouse architecture), Behavioral (STAR)",
      "Certifications: DP-203 (Azure Data Engineer), Databricks Certified Associate, SnowPro Core -- Strategy & dumps",
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
    estimatedHours: '168+ hours',
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
    estimatedHours: '76+ hours',
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
    estimatedHours: '104+ hours',
    careerOutcomes: [
      'Data Scientist',
      'Machine Learning Engineer',
      'AI Data Specialist',
      'Quantitative Analyst'
    ]
  }
};
