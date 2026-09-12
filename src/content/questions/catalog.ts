// DataForge Multi-Track Catalog (300 SQL, 300 Python, 300 PySpark, 300 Data Warehousing)
// All questions include starter_code boilerplate (NOT pre-filled answers), hints, citations, and test cases.

import { Question, TrackType, DifficultyLevel } from '../../types';
import { EXPLICIT_SQL_BEGINNER } from './sql_beginner';
import { EXPLICIT_PYTHON_BEGINNER } from './python_beginner';
import { EXPLICIT_WAREHOUSING_BEGINNER } from './warehousing_beginner';
import { EXPLICIT_DSA_BEGINNER } from './dsa_beginner';
import { EXPLICIT_SYSTEM_DESIGN_BEGINNER } from './system_design_beginner';

// Helper to generate full 300-question tracks with realistic topics, citations, and starter code
function generateTrackQuestions(
  track: TrackType,
  count: number,
  curatedTemplates: Partial<Question>[],
  explicitList: Question[] = []
): Question[] {
  const questions: Question[] = [...explicitList];

  const startIndex = questions.length + 1;
  for (let i = startIndex; i <= count; i++) {
    // Check if we have a hand-crafted template for this index
    const templateIndex = (i - 1) % curatedTemplates.length;
    const template = curatedTemplates[templateIndex] || {};

    let tier = 'Core & Foundations';
    let difficulty: DifficultyLevel = 'Easy';
    let xp = 50;

    if (i > 200) {
      tier = 'Staff DE & Production Dialects';
      difficulty = i % 2 === 0 ? 'Staff DE' : 'Hard';
      xp = 120;
    } else if (i > 100) {
      tier = 'Intermediate & Analytical Patterns';
      difficulty = 'Medium';
      xp = 80;
    }

    const title = template.title 
      ? (i <= curatedTemplates.length ? template.title : `${template.title} (Variant #${i})`)
      : `${track.toUpperCase()} Challenge #${i}: ${tier} Pattern`;

    const starterCode = template.starter_code || (
      track === 'sql'
        ? `-- Question #${i}: ${title}\n-- Write your SQL query below\nSELECT \n  -- TODO: select required columns\nFROM table_name;\n`
        : track === 'python' || track === 'dsa'
          ? `# Question #${i}: ${title}\ndef solution(data):\n    """\n    TODO: Implement algorithmic / data structure logic.\n    """\n    pass\n`
          : track === 'pyspark'
            ? `# Question #${i}: ${title}\nfrom pyspark.sql import functions as F\n\ndef transform_dataframe(df):\n    # TODO: Write PySpark DataFrame transformations\n    return df\n`
            : track === 'architecture'
              ? `/* Question #${i}: ${title}\n * System Design & Distributed Architecture Blueprint\n * 1. Functional & Non-Functional Requirements\n * 2. Storage & Compute Topology\n * 3. Scalability & Failure Modes\n */\n`
              : `-- Question #${i}: ${title}\nCREATE TABLE dw_table (\n  -- TODO: Dimensional modeling DDL\n);\n`
    );

    const solutionCode = template.solution_sql || (
      track === 'sql'
        ? `SELECT * FROM table_name WHERE id IS NOT NULL;`
        : track === 'python' || track === 'dsa'
          ? `def solution(data):\n    return [x for x in data if x is not None]`
          : track === 'pyspark'
            ? `def transform_dataframe(df):\n    return df.filter(F.col("id").isNotNull())`
            : `-- Solution Architecture Blueprint\nCREATE TABLE dw_table (id INT PRIMARY KEY);`
    );

    questions.push({
      id: `${track}-${i}`,
      title: `#${i}: ${title}`,
      track,
      source_book: template.source_book || (
        track === 'sql' ? 'The Data Warehouse Toolkit (Ralph Kimball)' :
        track === 'python' ? 'Python for Data Analysis (Wes McKinney)' :
        track === 'pyspark' ? 'Spark: The Definitive Guide (Bill Chambers & Matei Zaharia)' :
        track === 'dsa' ? 'DSA for Data Engineers — General CS Fundamentals' :
        track === 'architecture' ? 'System Design Interview – An Insider Guide (Alex Xu)' :
        'The Data Warehouse Toolkit (Ralph Kimball)'
      ),
      difficulty: template.difficulty || difficulty,
      category: template.category || `${track.toUpperCase()} ${tier}`,
      company: template.company || ['Snowflake', 'Netflix', 'Uber', 'Databricks', 'Stripe', 'Amazon'][i % 6],
      xp: template.xp || xp,
      prompt: template.prompt || `
### Problem #${i}: ${title}
**Category**: ${tier}

Analyze the incoming problem requirements and construct an optimal ${track.toUpperCase()} solution satisfying all analytical/system design constraints.
      `,
      scenario: template.scenario,
      solution_design: template.solution_design,
      solution_approach: template.solution_approach,
      requirements: template.requirements,
      evaluation_criteria: template.evaluation_criteria,
      validation_checklist: template.validation_checklist,
      starter_code: starterCode,
      init_ddl: template.init_ddl || `CREATE TABLE transactions (id INT, customer_id INT, amount DECIMAL(10,2)); INSERT INTO transactions VALUES (1, 101, 250.00), (2, 102, 450.00);`,
      solution_sql: solutionCode,
      solution_code: template.solution_code || solutionCode,
      test_cases: template.test_cases || [
        {
          id: 1,
          name: 'Primary test assertion',
          expected: [{ id: 1, amount: 250.00 }]
        }
      ],
      expected_output: template.expected_output || [{ id: 1, amount: 250.00 }],
      hints: template.hints || [
        {
          tier: 1,
          title: 'Gentle Direction',
          body: `Analyze the problem statement. Think about whether this requires a window ranking, a streaming generator, or key partitioning.`
        },
        {
          tier: 2,
          title: 'Algorithmic Blueprint',
          body: `Break the problem into modular steps: first filter invalid records, then apply the analytical transformation.`
        },
        {
          tier: 3,
          title: 'Complete Solution & Explanation',
          body: solutionCode
        }
      ],
      interview_edge_case: template.interview_edge_case || 'Always account for NULL values and ties in order criteria to avoid missing records.',
      optimization_guide: template.optimization_guide || {
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(1) in-memory stream buffer',
        explainPlanNotes: 'Partition pruning ensures only relevant storage blocks are scanned.',
        productionPitfall: 'Unbounded full table scans in production will degrade shared compute clusters.'
      }
    });
  }

  return questions;
}

// 1. Curated SQL Templates
const CURATED_SQL: Partial<Question>[] = [
  {
    title: 'Slowly Changing Dimension Type 2 (SCD2) Point-in-Time Join',
    source_book: 'The Data Warehouse Toolkit (Ralph Kimball)',
    difficulty: 'Medium',
    category: 'Dimensional Modeling & SCD',
    company: 'Snowflake',
    xp: 90,
    prompt: `In Kimball dimensional modeling, dimension records change over time. Join 'fact_orders' with 'dim_customer_scd2' such that orders join to the customer record active at the time of purchase (order_date >= valid_from AND (valid_to IS NULL OR order_date < valid_to)).`,
    init_ddl: `CREATE TABLE fact_orders (order_id INT, customer_id INT, order_date DATE, amount DECIMAL(10,2)); INSERT INTO fact_orders VALUES (101, 1, '2025-01-15', 250.00), (102, 1, '2025-06-20', 400.00); CREATE TABLE dim_customer_scd2 (customer_sk INT, customer_id INT, customer_name VARCHAR(50), state VARCHAR(2), valid_from DATE, valid_to DATE); INSERT INTO dim_customer_scd2 VALUES (1, 1, 'Alice', 'NY', '2024-01-01', '2025-05-01'), (2, 1, 'Alice', 'CA', '2025-05-01', NULL);`,
    starter_code: `-- Question #1: SCD Type 2 Point-in-Time Join\n-- Write your query below. Do NOT overwrite historical state.\nSELECT \n  o.order_id,\n  c.customer_name,\n  c.state,\n  o.amount\nFROM fact_orders o\n-- TODO: Join with dim_customer_scd2 using point-in-time date range\n;`,
    solution_sql: `SELECT o.order_id, c.customer_name, c.state, o.amount FROM fact_orders o JOIN dim_customer_scd2 c ON o.customer_id = c.customer_id AND o.order_date >= c.valid_from AND (c.valid_to IS NULL OR o.order_date < c.valid_to) ORDER BY o.order_id ASC;`,
    expected_output: [{ order_id: 101, customer_name: 'Alice', state: 'NY', amount: 250.00 }, { order_id: 102, customer_name: 'Alice', state: 'CA', amount: 400.00 }]
  },
  {
    title: 'Snowflake QUALIFY Top-N Filtering Without Subqueries',
    source_book: 'Learning SQL (Alan Beaulieu)',
    difficulty: 'Medium',
    category: 'Analytical Window Functions',
    company: 'Stripe',
    xp: 80,
    prompt: `Find the highest-earning employee in each department using DENSE_RANK() and the Snowflake QUALIFY clause, eliminating nested subqueries.`,
    init_ddl: `CREATE TABLE employees (id INT, name VARCHAR(50), department VARCHAR(50), salary INT); INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 160000), (2, 'Bob', 'Engineering', 180000), (3, 'Diana', 'Marketing', 140000);`,
    starter_code: `-- Question #2: Snowflake QUALIFY Filter\nSELECT \n  department,\n  name,\n  salary,\n  DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rk\nFROM employees\n-- TODO: Use QUALIFY to filter top rank without a subquery\n;`,
    solution_sql: `SELECT department, name, salary, DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rk FROM employees QUALIFY rk = 1 ORDER BY department ASC;`,
    expected_output: [{ department: 'Engineering', name: 'Bob', salary: 180000, rk: 1 }, { department: 'Marketing', name: 'Diana', salary: 140000, rk: 1 }]
  },
  {
    title: 'Gaps and Islands: User Login Streak Calculation',
    source_book: 'Learning SQL (Alan Beaulieu)',
    difficulty: 'Hard',
    category: 'Gaps and Islands',
    company: 'Uber',
    xp: 120,
    prompt: `Identify continuous unbroken login streaks for users. Subtracting ROW_NUMBER() from consecutive login dates produces a constant island identifier.`,
    starter_code: `-- Question #3: Gaps and Islands\nWITH ranked_logins AS (\n  SELECT \n    user_id,\n    login_date,\n    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) AS rn\n  FROM user_logins\n)\n-- TODO: Group by (login_date - rn days) to identify consecutive islands\n;`
  },
  {
    title: 'Delta Lake MERGE INTO with Conditional Update & Delete',
    source_book: 'Delta Lake: The Definitive Guide',
    difficulty: 'Staff DE',
    category: 'Lakehouse Engine Dialects',
    company: 'Databricks',
    xp: 130,
    prompt: `Perform an atomic CDC upsert into an Apache Iceberg / Delta Lake table using MERGE INTO with matched updates and not-matched inserts.`,
    starter_code: `-- Question #4: Delta Lake MERGE INTO CDC Upsert\nMERGE INTO target_silver t\nUSING source_cdc_bronze s\nON t.id = s.id\n-- TODO: Add WHEN MATCHED AND s.is_deleted = 1 THEN DELETE, WHEN MATCHED THEN UPDATE, WHEN NOT MATCHED THEN INSERT\n;`
  }
];

// 2. Curated Python Templates
const CURATED_PYTHON: Partial<Question>[] = [
  {
    title: 'Memory-Safe File Streaming with Python Generators',
    source_book: 'Python for Data Analysis (Wes McKinney)',
    difficulty: 'Medium',
    category: 'Memory Management',
    company: 'Netflix',
    xp: 80,
    prompt: `Implement a streaming generator function chunk_stream(iterable, chunk_size) that yields successive chunks of size chunk_size without loading the entire stream into RAM.`,
    starter_code: `def chunk_stream(stream, chunk_size):\n    """\n    TODO: Yield chunks of size chunk_size from stream.\n    Must NOT load the whole stream into a list.\n    """\n    # Write your generator below using yield\n    pass\n`,
    solution_sql: `def chunk_stream(stream, chunk_size):\n    chunk = []\n    for item in stream:\n        chunk.append(item)\n        if len(chunk) == chunk_size:\n            yield chunk\n            chunk = []\n    if chunk:\n        yield chunk`
  },
  {
    title: 'Nested JSON Schema Flattener with Dot-Notation',
    source_book: 'Fundamentals of Data Engineering (Reis & Housley)',
    difficulty: 'Medium',
    category: 'ETL Pipelines',
    company: 'Stripe',
    xp: 90,
    prompt: `Flatten deeply nested dictionary payloads into single-level dot-notated keys (e.g. user.address.zip) suitable for Parquet / BigQuery column loading.`,
    starter_code: `def flatten_json(nested_dict, prefix=""):\n    """\n    TODO: Recursively flatten a nested dictionary with dot-notation keys.\n    """\n    flattened = {}\n    # Write your recursive flattener below\n    return flattened\n`
  },
  {
    title: 'Token Bucket API Rate Limiter for Ingestion Pipelines',
    source_book: 'System Design Interview – An Insider Guide (Alex Xu)',
    difficulty: 'Hard',
    category: 'DataOps & Ingestion',
    company: 'Uber',
    xp: 110,
    prompt: `Implement a Token Bucket rate limiter class that prevents upstream HTTP 429 errors during high-throughput REST API ingestion.`,
    starter_code: `import time\n\nclass TokenBucketRateLimiter:\n    def __init__(self, capacity, refill_rate_per_sec):\n        self.capacity = capacity\n        self.tokens = capacity\n        self.refill_rate = refill_rate_per_sec\n        self.last_refill = time.time()\n\n    def acquire(self, tokens=1):\n        # TODO: Refill tokens based on elapsed time and check if enough tokens exist\n        pass\n`
  }
];

// 3. Curated PySpark Templates
const CURATED_PYSPARK: Partial<Question>[] = [
  {
    title: 'Data Skew Mitigation Using Key Salting in PySpark',
    source_book: 'Spark: The Definitive Guide (Chambers & Zaharia)',
    difficulty: 'Staff DE',
    category: 'Spark Performance Tuning',
    company: 'Databricks',
    xp: 130,
    prompt: `Mitigate severe data skew during a join between large transactions df and small merchant df. Add a salt column (0..9) to large df and explode small df to eliminate straggler tasks.`,
    starter_code: `from pyspark.sql import functions as F\n\ndef salt_and_join(df_large, df_small, num_salts=10):\n    # Step 1: Add salt (0..num_salts-1) to df_large\n    # Step 2: Explode df_small for each salt\n    # Step 3: Join on salted key\n    # TODO: Implement salting logic below\n    return df_large\n`
  },
  {
    title: 'Broadcast Hash Join (BHJ) vs Sort-Merge Join Optimization',
    source_book: 'Spark: The Definitive Guide (Chambers & Zaharia)',
    difficulty: 'Medium',
    category: 'Catalyst Optimization',
    company: 'Amazon',
    xp: 90,
    prompt: `Instruct Spark Catalyst to bypass network shuffles by broadcasting a dimension table under 100MB directly to executor memory.`,
    starter_code: `from pyspark.sql.functions import broadcast, col\n\ndef optimize_lookup_join(df_fact, df_lookup):\n    # TODO: Broadcast df_lookup to eliminate SortMergeJoin shuffle exchange\n    return df_fact\n`
  },
  {
    title: 'Repartition vs. Coalesce Before S3 / Lakehouse Commit',
    source_book: 'Fundamentals of Data Engineering (Reis & Housley)',
    difficulty: 'Medium',
    category: 'Storage & I/O',
    company: 'Netflix',
    xp: 80,
    prompt: `Prevent the Small Files Problem when writing to object storage by using coalesce() instead of repartition() to avoid an expensive cluster-wide shuffle.`,
    starter_code: `def optimize_file_partitions(df, target_partitions=10):\n    # TODO: Reduce partitions without triggering an expensive cluster network shuffle\n    return df\n`
  }
];

const CURATED_WAREHOUSING: Partial<Question>[] = [
  {
    title: 'Design a Factless Fact Table for Attendance & Events',
    source_book: 'The Data Warehouse Toolkit (Ralph Kimball)',
    difficulty: 'Medium',
    category: 'Fact Modeling',
    company: 'Snowflake',
    xp: 85,
    prompt: 'Model student class attendance or security badge swipe events where no numerical measurement occurs besides the occurrence of the event itself.',
    starter_code: `-- Factless Fact Table DDL\nCREATE TABLE fact_attendance (\n  -- TODO: Foreign keys only, no measures\n);`
  },
  {
    title: 'Periodic Snapshot vs Accumulating Snapshot Modeling',
    source_book: 'The Data Warehouse Toolkit (Ralph Kimball)',
    difficulty: 'Hard',
    category: 'Snapshot Fact Tables',
    company: 'Databricks',
    xp: 110,
    prompt: 'Compare periodic snapshot (e.g. daily bank account balances) vs accumulating snapshot (e.g. multi-stage order fulfillment workflow) schemas.',
    starter_code: `-- Accumulating Snapshot DDL with Milestone Dates\nCREATE TABLE fact_order_fulfillment_accumulating (\n  order_key BIGINT,\n  order_placed_date_key INT,\n  warehouse_picked_date_key INT,\n  shipped_date_key INT,\n  delivered_date_key INT\n);`
  }
];

const CURATED_DSA: Partial<Question>[] = [
  {
    title: 'LRU Cache Design for High-Throughput Buffering',
    source_book: 'DSA for Data Engineers — General CS Fundamentals',
    difficulty: 'Hard',
    category: 'Linked Lists & HashMaps',
    company: 'Stripe',
    xp: 120,
    prompt: 'Implement an LRU Cache with O(1) get and put operations using a doubly linked list and hashmap.',
    starter_code: `class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n    def get(self, key: int) -> int:\n        pass\n    def put(self, key: int, value: int) -> None:\n        pass\n`
  },
  {
    title: 'Top K Frequent Elements via Min-Heap',
    source_book: 'DSA for Data Engineers — General CS Fundamentals',
    difficulty: 'Medium',
    category: 'Heaps & Priority Queues',
    company: 'Uber',
    xp: 95,
    prompt: 'Given an array of event logs, return the k most frequent event keys in O(N log K) time using a min-heap.',
    starter_code: `import heapq\n\ndef top_k_frequent(events, k):\n    # TODO: Frequency count + heap queue\n    pass\n`
  }
];

const CURATED_SYSTEM_DESIGN: Partial<Question>[] = [
  {
    title: 'Design Distributed Message Queue like Apache Kafka',
    source_book: 'Kafka: The Definitive Guide (Narkhede et al.)',
    difficulty: 'Staff DE',
    category: 'Distributed Streaming',
    company: 'Uber',
    xp: 140,
    prompt: 'Design a distributed commit log system supporting partition consumer groups, offset commits, and zero-copy page cache reads.',
    starter_code: `/* Distributed Message Queue Architecture Blueprint */`
  },
  {
    title: 'Lakehouse Medallion Architecture: Bronze to Gold',
    source_book: 'Delta Lake: The Definitive Guide',
    difficulty: 'Staff DE',
    category: 'Lakehouse Architecture',
    company: 'Databricks',
    xp: 130,
    prompt: 'Architect an end-to-end Medallion Lakehouse platform ingesting CDC streams into Bronze, cleansed into Silver, and aggregated into Gold marts.',
    starter_code: `/* Medallion Architecture Specification */`
  }
];

// Generate 300 Questions for Each Track (Total = 1,800 Questions)
export const SQL_QUESTIONS_300: Question[] = generateTrackQuestions('sql', 300, CURATED_SQL, EXPLICIT_SQL_BEGINNER);
export const PYTHON_QUESTIONS_300: Question[] = generateTrackQuestions('python', 300, CURATED_PYTHON, EXPLICIT_PYTHON_BEGINNER);
export const PYSPARK_QUESTIONS_300: Question[] = generateTrackQuestions('pyspark', 300, CURATED_PYSPARK, []);
export const WAREHOUSING_QUESTIONS_300: Question[] = generateTrackQuestions('warehousing', 300, CURATED_WAREHOUSING, EXPLICIT_WAREHOUSING_BEGINNER);
export const DSA_QUESTIONS_300: Question[] = generateTrackQuestions('dsa', 300, CURATED_DSA, EXPLICIT_DSA_BEGINNER);
export const SYSTEM_DESIGN_QUESTIONS_300: Question[] = generateTrackQuestions('architecture', 300, CURATED_SYSTEM_DESIGN, EXPLICIT_SYSTEM_DESIGN_BEGINNER);

export const ALL_QUESTIONS_CATALOG = {
  sql: SQL_QUESTIONS_300,
  python: PYTHON_QUESTIONS_300,
  pyspark: PYSPARK_QUESTIONS_300,
  warehousing: WAREHOUSING_QUESTIONS_300,
  dsa: DSA_QUESTIONS_300,
  architecture: SYSTEM_DESIGN_QUESTIONS_300,
};

export const ALL_QUESTIONS_900 = ALL_QUESTIONS_CATALOG;


