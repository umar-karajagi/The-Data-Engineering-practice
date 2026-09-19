# DataVeda ⚡ — The Complete Data Engineering Practice & Masterclass Platform

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind_css)](https://tailwindcss.com/)
[![DuckDB WASM](https://img.shields.io/badge/DuckDB-WASM-FFF000?style=for-the-badge&logo=duckdb&logoColor=black)](https://duckdb.org/)
[![Curriculum](https://img.shields.io/badge/Curriculum-167.6%20Hours%20Exact-blue?style=for-the-badge)](src/content/curriculum/masterCurriculum.ts)
[![Verified Videos](https://img.shields.io/badge/YouTube%20Lectures-61%20Verified%20OK-red?style=for-the-badge&logo=youtube)](src/content/curriculum/masterCurriculum.ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

> **DataVeda** (formerly DataForge) is an interactive, enterprise-grade data engineering platform built to take engineers from foundations to production mastery. It integrates a **167.6-hour mathematically audited curriculum**, a **split-screen theater masterclass video player**, an **in-browser DuckDB WASM SQL runner**, a **500-question practice arena with HackerRank star ratings**, and a **16-volume technical library vault**.

---

## 🌟 Platform Capabilities

### 1. 🎓 167.6 Hours Curriculum (61 Verified Masterclasses)
Every stage's duration is mathematically balanced down to the exact minute of its constituent video lectures. All **61 video lectures (52 unique video IDs)** are automatedly verified **HTTP 200 OK** via YouTube's official oEmbed API.

| Stage | Domain & Milestone | Episodes | Sum of Minutes | Exact Duration | Focus Areas |
|---|---|:---:|:---:|:---:|---|
| **Stage 01** | Cloud Foundations & Azure DP-900 | 8 | 987 min | **16 hr 27 min** | Cloud Architecture, Storage Blobs, Cosmos DB, RBAC & DP-900 Exam Prep |
| **Stage 02** | Python Programming & Data Structures | 7 | 1,584 min | **26 hr 24 min** | OOP, Generators, Streaming ETL, Big-O Complexity & Algorithms |
| **Stage 03** | Advanced SQL & Query Optimization | 7 | 1,513 min | **25 hr 13 min** | Window Functions, CTEs, Execution Plans, Partitioning & Indexing |
| **Stage 04** | Azure Data Factory & Cloud ETL Pipelines | 7 | 1,183 min | **19 hr 43 min** | Pipeline Activities, Data Flows, CI/CD with Azure DevOps & Monitoring |
| **Stage 05** | Distributed Computing with PySpark & Kafka | 8 | 1,412 min | **23 hr 32 min** | RDDs, DataFrames, Catalyst Optimizer, Structured Streaming & Kafka Brokering |
| **Stage 06** | Databricks, Delta Lake & dbt Transformations | 7 | 922 min | **15 hr 22 min** | ACID Lakehouse, Medallion Architecture, Time Travel & dbt Analytics |
| **Stage 07** | Microsoft Fabric & Lakehouse Architecture | 5 | 1,165 min | **19 hr 25 min** | OneLake, Direct Lake Power BI, Synapse Data Engineering & DP-600 Prep |
| **Stage 08** | Real-World End-to-End Portfolio Projects | 7 | 660 min | **11 hr 00 min** | Uber Ride Analytics, Stock Market Kafka Stream, Cricket Data Pipeline |
| **Stage 09** | System Design & Data Engineering Interviews | 5 | 629 min | **10 hr 29 min** | Large-Scale Distributed System Design, Behavioral & Whiteboard Scenarios |
| **Total** | **All 9 Curriculum Stages** | **61** | **10,055 min** | **167.6 Hours** | **Complete Industrial Data Engineering Career Track** |

---

### 2. 🎬 Cinema Split-Screen Video Masterclass Player
Built to match the Petroleum high-yield theater player experience:
- **16:9 Cinema Embed**: Distraction-free YouTube player with native keyboard controls and autoplay.
- **Header Episode Controls**: Prev (`< `) and Next (`>`) episode navigation with keyboard shortcuts (`ArrowLeft`, `ArrowRight`, `Esc`).
- **One-Click Progress Tracking**: Red **"Watch on YouTube"** button and 1-click **"Mark Watched (+25 XP)"** button synchronized across localStorage.
- **In-Modal Curriculum Playlist Drawer (Right Side)**:
  - Real-time series progress bar (`X / Y Watched`).
  - Scrollable episode cards with pulsing ▶ **"Now Playing"** highlight and emerald `✓` checkmarks.
  - Instant episode switching directly inside the theater view.
- **Bottom Engineering Console (Tabbed)**:
  - 📖 **Architecture & Takeaways**: Lecture abstract, core competencies, and cloud service tags.
  - ⏱️ **Chapters & Timestamps**: Interactive clickable timestamps that seek the video.
  - 🦆 **DuckDB SQL Workbench**: Interactive in-browser SQL runner with starter DDL and pre-seeded tables.
  - 📝 **My Study Notes**: Markdown study note editor persisting notes directly to the local vault.

---

### 3. ⚡ Practice Arena (500 Questions with HackerRank 5-Star Ratings)
An exhaustive collection of 500 company-tagged data engineering problems across 5 core topics and 5 progressive difficulty modes:

- **Topics (100 Questions each)**:
  1. 🗄️ **SQL Mastery**: Window functions, recursive CTEs, sessionization, deduplication, star-schema aggregations.
  2. 🐍 **Python for Data Engineering**: Generators, memory-efficient parsers, concurrent ETL, custom iterators.
  3. ⚡ **PySpark & Distributed Systems**: Catalyst optimizer hints, broadcast joins, skew handling, streaming watermarks.
  4. 🌊 **Lakehouse & Modern Storage**: Delta Lake ACID transactions, Apache Iceberg compaction, Z-Ordering, Parquet partitioning.
  5. 🔄 **Cloud Orchestration & ETL Pipelines**: Airflow DAG authoring, idempotency, backfilling, CDC pipelines.

- **Progressive Modes (Modes 1 to 5)**:
  - **Mode 1: Foundations & Core Concepts** (20 Qs per topic)
  - **Mode 2: Practical Implementation** (20 Qs per topic)
  - **Mode 3: Advanced Optimization & Internals** (20 Qs per topic)
  - **Mode 4: System Design & Production Scenarios** (20 Qs per topic)
  - **Mode 5: Debugging, Edge Cases & War Stories** (20 Qs per topic)

- **HackerRank Star Rating System**:
  - ⭐ 1-Star: 10 problems solved (Novice Data Engineer)
  - ⭐⭐ 2-Star: 25 problems solved (Junior Practitioner)
  - ⭐⭐⭐ 3-Star: 50 problems solved (Mid-Level Data Engineer)
  - ⭐⭐⭐⭐ 4-Star: 75 problems solved (Senior Pipeline Architect)
  - ⭐⭐⭐⭐⭐ 5-Star: 100 problems solved (Staff / Principal Master)

---

### 4. 📚 The Digital Library Vault (16 Books & Interactive Notebooks)
Equipped with full-length foundational texts and interactive notebooks:
- **Designing Data-Intensive Applications** — Martin Kleppmann
- **The Data Warehouse Toolkit (3rd Edition)** — Ralph Kimball & Margy Ross
- **Spark: The Definitive Guide** — Matei Zaharia & Bill Chambers
- **System Design Interview (Volume 1 & 2)** — Alex Xu
- **Fundamentals of Data Engineering** — Joe Reis & Matt Housley
- **Data Pipelines with Apache Airflow** — Bas Harenslak & Julian de Ruiter
- **Kafka: The Definitive Guide (2nd Edition)** — Gwen Shapira et al.
- **Data Engineering with Databricks Lakehouse Cookbook** — Packt
- **Data Mesh: Delivering Data-Driven Value at Scale** — Zhamak Dehghani
- **AI Engineering: Building Applications with Foundation Models** — Chip Huyen
- **Python for Data Analysis** — Wes McKinney
- **Learning SQL** — Alan Beaulieu
- **Databricks Certified Data Engineer Associate Prep Guide**
- **Distributed PySpark Lakehouse Architecture Notebook** (`.ipynb`)

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/umar-karajagi/The-Data-Engineering-practice-.git
cd The-Data-Engineering-practice-
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build

```bash
npm run build
npm run start
```

---

## 📁 Project Architecture

```text
├── src/
│   ├── app/
│   │   ├── page.tsx                         # Main SPA router (Home, Tracks, Practice, Projects, Library, Resources)
│   │   ├── layout.tsx                       # Global layout & metadata
│   │   └── api/vault/                       # Digital library PDF streaming endpoints
│   ├── components/
│   │   ├── dataveda/
│   │   │   ├── DataVedaNavbar.tsx           # Global navigation header with role selector
│   │   │   ├── DataVedaTracks.tsx           # 9-Stage self-paced curriculum view
│   │   │   ├── PlaylistTracker.tsx          # Dynamic playlist hours & watched progress
│   │   │   ├── DataVedaPractice.tsx         # 500-question practice arena
│   │   │   ├── DataVedaProjects.tsx         # End-to-end portfolio projects
│   │   │   └── StarScoreboard.tsx           # HackerRank 5-star scoring scoreboard
│   │   ├── videos/
│   │   │   └── VideoMasterclassModal.tsx    # Split-screen cinema video player + playlist drawer
│   │   └── books/
│   │       └── LibraryView.tsx              # Digital library & PDF viewer
│   ├── content/
│   │   ├── curriculum/
│   │   │   └── masterCurriculum.ts          # 167.6 Hours exact curriculum & 61 verified videos
│   │   ├── practice/
│   │   │   └── practiceQuestionsData.ts     # 500 questions across 5 topics & 5 modes
│   │   └── videos/
│   │       └── curatedVideos.ts             # Video masterclass metadata
│   └── lib/
│       ├── useDuckDB.ts                     # In-browser DuckDB WASM query execution engine
│       └── userStore.tsx                    # XP gamification, watched progress & notes store
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
