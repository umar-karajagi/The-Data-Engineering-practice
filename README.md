# DataForge ⚡ — The Data Engineering Practice & Digital Library

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind_css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

> **DataForge** is a high-performance, interactive platform built for Data Engineers to master technical interviews, distributed systems, stream processing, and modern lakehouse architectures.

---

## 🌟 Highlights

### 1. 📚 The Digital Library & Interactive Reader (The Vault)
A digital library equipped with **16 classic and modern full-length Data Engineering books and interactive notebooks**:
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

#### 👓 Reader Capabilities:
- **Dual Engine Rendering**: Seamless canvas-level rendering with fallback to iframe browser viewer.
- **Theater / Fullscreen Mode**: Distraction-free, zero-margin reader with dark mode (`Esc` to exit).
- **Pop-out Native Tab Viewer**: Multi-monitor / two-page spread viewing in browser's native engine.
- **206 Partial Content Streaming**: Fast byte-range seeking for massive PDFs without freezing memory.

---

### 2. ⚡ Practice Arena (1,200+ Hand-Curated Challenges)
Four dedicated training tracks with **300 battle-tested questions per track**:
- 🗄️ **SQL Arena**: Window functions, recursive CTEs, sessionization, deduplication, star-schema aggregations.
- 🐍 **Python Arena**: Data structures, generators, streaming ETL, memory-efficient parsers, concurrency.
- ⚡ **PySpark Arena**: Catalyst optimizer hints, RDD internals, broadcast joins, skew handling, streaming watermarks.
- 🧩 **DSA Arena**: Hash maps, two pointers, sliding window, binary search, tree traversals, dynamic programming for big data.

Each challenge comes with:
- Context and problem statements with sample inputs and expected outputs
- Starter code templates ready to edit
- Interactive sandbox code execution
- Step-by-step progressive hints
- Complete, optimized reference solutions with time/space complexity analysis

---

### 3. 🗺️ Data Engineering Career Roadmap
A structured curriculum covering every phase of modern data engineering:
1. **Computer Science & Python/SQL Mastery**
2. **Distributed Systems & Storage Formats** (Parquet, ORC, Delta Lake, Iceberg)
3. **Batch & Stream Processing** (Spark, Flink, Kafka)
4. **Orchestration & Data Ops** (Airflow, dbt, CI/CD)
5. **Cloud Lakehouse & Governance** (Databricks, Snowflake, BigQuery)
6. **Data Platforms for AI & LLM Systems**

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.17 or later)
- [Git LFS](https://git-lfs.github.com/) (for high-resolution volume 2 system design assets)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/umar-karajagi/The-Data-Engineering-practice-.git
cd The-Data-Engineering-practice-

# 2. Pull LFS assets (if cloning fresh)
git lfs pull

# 3. Install dependencies
npm install

# 4. Launch development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start practicing!

### Production Build

```bash
npm run build
npm run start
```

---

## 📁 Repository Structure

```text
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── vault/
│   │   │       ├── book-stream/    # Byte-range 206 streaming for PDF/notebooks
│   │   │       └── run/            # Code execution sandbox API
│   │   ├── globals.css             # Luxury Cyberpunk/Dark mode styling
│   │   ├── layout.tsx              # Root layout & navigation header
│   │   └── page.tsx                # DataForge Single-Page App (Arena + Vault + Roadmap)
│   ├── components/
│   │   ├── DigitalLibrary.tsx      # Digital library & interactive reader
│   │   ├── InteractiveCodeEditor.tsx # Monaco-styled code editor & test runner
│   │   ├── LanguageArena.tsx       # Track explorer & question selector
│   │   ├── QuestionWorkspace.tsx   # Detailed split-pane coding workspace
│   │   └── RoadmapView.tsx         # Career roadmap & curriculum graph
│   ├── content/
│   │   ├── dsa_questions.json      # 300 DSA challenges
│   │   ├── python_questions.json   # 300 Python challenges
│   │   ├── pyspark_questions.json  # 300 PySpark challenges
│   │   └── sql_questions.json      # 300 SQL challenges
│   ├── lib/
│   │   └── vaultBooks.ts           # Digital vault catalog and metadata
│   └── types/                      # TypeScript definitions
├── vault_storage/                  # PDF library & Jupyter notebooks
├── .gitattributes                  # Git LFS configuration
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS, PostCSS, Custom Scrollbars
- **Icons**: Lucide React
- **Streaming**: Native Node.js `fs.createReadStream` with HTTP `206 Partial Content`

---

## 🤝 Contributing

Contributions are welcome! If you'd like to add new questions, optimize solutions, or improve the reading experience:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewAwesomeChallenge`)
3. Commit your Changes (`git commit -m 'feat: add streaming window challenge'`)
4. Push to the Branch (`git push origin feature/NewAwesomeChallenge`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
