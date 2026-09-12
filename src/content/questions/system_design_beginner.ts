import { Question } from '../../types';

export const EXPLICIT_SYSTEM_DESIGN_BEGINNER: Question[] = [
  {
    id: 'SYS-BEG-001',
    title: 'Design Storage for a Simple URL Shortener',
    source_book: 'System Design Interview – An Insider Guide (Alex Xu)',
    difficulty: 'Beginner',
    category: 'Single-Node Storage Design',
    track: 'architecture',
    company: 'Uber',
    xp: 75,
    prompt: 'Design the data storage model for a basic URL shortener that maps a short code to a long URL. Assume single-node scale (no sharding yet).',
    scenario: 'A single service receives a long URL, generates a short code, and must later redirect short-code requests to the original URL.',
    requirements: {
      functional: ['Create a short code for a given long URL', 'Redirect a short code to its long URL'],
      non_functional: ['Low read latency for redirects', 'No duplicate short codes']
    },
    solution_approach: 'A single table: url_mappings(short_code VARCHAR PRIMARY KEY, long_url TEXT, created_at TIMESTAMP). short_code is generated via base62 encoding of an auto-incrementing ID (or a hash + collision check). Reads (redirects) are the hot path, so short_code as the primary key gives O(1) lookup; a simple in-memory cache (e.g. Redis) can sit in front for the most popular links.',
    evaluation_criteria: [
      'Candidate identifies short_code as the natural primary/lookup key.',
      'Candidate distinguishes the write path (create) from the much more frequent read path (redirect) and optimizes for reads.',
      'Candidate mentions a collision-avoidance strategy for short code generation.'
    ],
    starter_code: `-- SYS-BEG-001: Storage Design for Simple URL Shortener
-- Scenario: High read:write ratio URL shortening redirection service.

/*
Table Schema:
  CREATE TABLE url_mappings (
    -- TODO: Define primary key, long_url, created_at, expiration
  );

Short Code Generation Strategy:
  -- TODO: Base62 encoding vs MD5 hash collision handling

Read Path Caching Layer:
  -- TODO: Redis cache eviction (LRU) and key design
*/`,
    solution_design: `CREATE TABLE url_mappings (
  short_code VARCHAR(7) PRIMARY KEY,
  long_url TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

-- Redis Caching Strategy:
-- Key: url:{short_code} -> Value: {long_url}
-- Eviction: volatile-lru with 24h TTL on popular links`,
    solution_sql: `CREATE TABLE url_mappings (
  short_code VARCHAR(7) PRIMARY KEY,
  long_url TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);`,
    hints: [
      { tier: 1, title: 'Read-Heavy Ratio', body: 'Think about which operation happens far more often: creating a short link, or someone clicking it.' },
      { tier: 2, title: 'Base62 ID Encoding', body: 'Base62 encoding (0-9, a-z, A-Z) of an auto-incrementing counter produces clean, collision-free short codes.' },
      { tier: 3, title: 'Complete Blueprint', body: `A single table: url_mappings(short_code VARCHAR PRIMARY KEY, long_url TEXT, created_at TIMESTAMP).\nReads (redirects) are the hot path, so short_code as the primary key gives O(1) B-tree lookup; an in-memory Redis cache sits in front for popular links.` }
    ],
    interview_edge_case: 'Ask how the design changes once you need billions of URLs across multiple servers — this becomes the classic follow-up into sharding by short_code hash range and is a natural bridge to the Intermediate tier.'
  },
  {
    id: 'SYS-BEG-002',
    title: 'Vertical vs Horizontal Scaling for a Nightly Batch Job',
    source_book: 'System Design Interview – An Insider Guide (Alex Xu)',
    difficulty: 'Beginner',
    category: 'Scaling Fundamentals',
    track: 'architecture',
    company: 'Netflix',
    xp: 75,
    prompt: 'A nightly Spark job that processes 50GB of data now needs to process 2TB. Explain the difference between scaling it vertically vs horizontally, and recommend one for this scenario with justification.',
    scenario: 'Current job runs on a single 8-core, 32GB driver+worker cluster and finishes in 40 minutes; data volume grew 40x.',
    requirements: {
      functional: ['Job must still complete within the nightly maintenance window'],
      non_functional: ['Cost-efficient', 'Should not require a full rewrite of the Spark job']
    },
    solution_approach: "Vertical scaling = bigger single machine (more CPU/RAM on the same node); hits a hard ceiling and gets expensive fast. Horizontal scaling = more worker nodes processing partitions of data in parallel; this is what Spark is architected for. Recommendation: scale horizontally — increase the cluster's worker count (autoscaling), since Spark's partition-based execution model was built specifically to exploit added nodes, and it avoids a hardware ceiling.",
    evaluation_criteria: [
      'Candidate correctly defines both scaling types.',
      'Candidate recommends horizontal scaling and ties the reasoning specifically to Spark\'s distributed, partition-parallel execution model — not just "horizontal is generally better."',
      'Candidate mentions autoscaling or cluster sizing as the practical mechanism, not just "add more servers."'
    ],
    starter_code: `/*
SYS-BEG-002: Vertical vs Horizontal Scaling Analysis
Scenario: Spark job growing from 50GB to 2TB.

1. Definition & Ceiling Analysis:
   - Vertical Scaling:
     -- TODO: Explain mechanics and physical limitations
   - Horizontal Scaling:
     -- TODO: Explain partition parallelization

2. Recommendation & Architectural Justification:
   -- TODO: Which approach matches Spark's Catalyst & DAG engine?

3. Amdahl's Law Bottlenecks:
   -- TODO: Identify non-parallelizable stages (e.g. broadcast collection, single partition output)
*/`,
    solution_design: `Recommendation: Horizontal Scaling with Spark Dynamic Allocation.
- Reason 1: Spark distributes resilient distributed datasets (RDDs) into discrete partitions; more worker nodes process partitions concurrently without code changes.
- Reason 2: Vertical scaling hits instance size ceilings and fails when shuffle spills exceed single-host NVMe disks.
- Mechanism: Configure spark.dynamicAllocation.enabled = true, minExecutors = 4, maxExecutors = 32.`,
    solution_sql: `Recommendation: Horizontal Scaling with Spark Dynamic Allocation.
- Reason 1: Spark partitions data across executor slots.
- Reason 2: Avoids single-node memory/CPU hardware bottlenecks.`,
    hints: [
      { tier: 1, title: 'Partition Parallelism', body: 'Ask yourself: is the workload embarrassingly parallel? Spark jobs generally are, which favors horizontal scaling.' },
      { tier: 2, title: 'Hardware Ceilings', body: 'Vertical scaling is simpler operationally but has a hard physical ceiling (the biggest instance type available).' },
      { tier: 3, title: 'Complete Blueprint', body: `Vertical scaling hits a hard ceiling. Scale horizontally by increasing worker node count; Spark's partition-based execution model was built specifically to exploit added nodes.` }
    ],
    interview_edge_case: "Ask what happens if the job has a single non-parallelizable bottleneck stage (e.g. a broadcast join collecting everything to the driver) — adding workers won't help that stage, illustrating that horizontal scaling only helps the parallelizable portion of the work (Amdahl's Law)."
  },
  {
    id: 'SYS-BEG-003',
    title: 'Design a Daily CSV Batch Ingestion Job',
    source_book: 'Fundamentals of Data Engineering (Reis & Housley)',
    difficulty: 'Beginner',
    category: 'Batch Ingestion',
    track: 'architecture',
    company: 'Snowflake',
    xp: 80,
    prompt: 'Design a simple daily pipeline that ingests a CSV file dropped into cloud storage each morning and loads it into a data warehouse table.',
    scenario: 'A vendor drops orders_YYYY-MM-DD.csv into an S3/ADLS landing bucket once per day, sometime between midnight and 6am.',
    requirements: {
      functional: ['Detect the new file automatically', 'Load its contents into a staging table, then merge into the target table'],
      non_functional: ['Idempotent — safe to re-run without duplicating data', 'Must not fail silently if the file never arrives']
    },
    solution_approach: 'An orchestrator (e.g. Airflow) runs a scheduled DAG with a file sensor checking for orders_{{ds}}.csv; on detection, a task loads the raw file into a staging table (via Auto Loader/COPY INTO), followed by a MERGE INTO the target table keyed on order_id to guarantee idempotency on reruns. A sensor timeout + alert handles the case where the file never arrives.',
    evaluation_criteria: [
      'Candidate proposes file detection via a sensor/trigger rather than assuming a fixed run time will always align with file arrival.',
      'Candidate explicitly addresses idempotency (MERGE/upsert on a natural key, not a blind append).',
      'Candidate accounts for the failure case where the file doesn\'t show up.'
    ],
    starter_code: `/*
SYS-BEG-003: Daily CSV Batch Ingestion Architecture
Scenario: orders_YYYY-MM-DD.csv arrives asynchronously in S3 landing bucket.

1. Detection & Orchestration:
   -- TODO: File Sensor vs S3 ObjectCreated Event Trigger

2. Ingestion & Staging Stage:
   -- TODO: Cloud storage COPY INTO / Auto Loader to staging table

3. Target Medallion Upsert (Idempotency):
   -- TODO: MERGE INTO target using natural key

4. Alerting & SLA Breach Handling:
   -- TODO: Timeout handling if file is missing by 06:00 AM
*/`,
    solution_design: `Pipeline Architecture:
1. Orchestrator (Apache Airflow / Dagster):
   - S3KeySensor(bucket='landing', key='orders_{{ ds }}.csv', poke_interval=300, timeout=21600)
2. Staging Load:
   - COPY INTO staging_orders FROM @s3_stage/orders_{{ ds }}.csv FILE_FORMAT = (TYPE = CSV, SKIP_HEADER = 1);
3. Atomic Upsert:
   - MERGE INTO dim_fact_orders t USING staging_orders s ON t.order_id = s.order_id
     WHEN MATCHED THEN UPDATE SET ...
     WHEN NOT MATCHED THEN INSERT ...;
4. Observability: On sensor timeout, trigger PagerDuty/Slack webhook alerting on SLA breach.`,
    solution_sql: `MERGE INTO fact_orders t
USING staging_orders s
ON t.order_id = s.order_id
WHEN MATCHED THEN UPDATE SET t.amount = s.amount, t.updated_at = CURRENT_TIMESTAMP
WHEN NOT MATCHED THEN INSERT (order_id, customer_id, amount, order_date) VALUES (s.order_id, s.customer_id, s.amount, s.order_date);`,
    hints: [
      { tier: 1, title: 'Idempotency Principle', body: 'Idempotency means running the pipeline twice on the same day produces the same end state, not duplicated rows.' },
      { tier: 2, title: 'Sensor Triggers', body: "A 'sensor' in Airflow terms polls for a condition (like a file's existence in S3) before downstream tasks run." },
      { tier: 3, title: 'Complete Architecture', body: `Airflow DAG with an S3KeySensor polls for orders_{{ds}}.csv. On arrival, COPY INTO loads staging, followed by an idempotent MERGE INTO target table keyed on order_id. Sensor timeout triggers on_failure_callback.` }
    ],
    interview_edge_case: 'Ask how the design changes if the vendor sometimes sends a corrected/late file for a prior date — this requires the pipeline to support backfilling a specific historical date\'s partition, not just "today."'
  },
  {
    id: 'SYS-BEG-004',
    title: 'Diagram a Basic ETL Pipeline',
    source_book: 'Fundamentals of Data Engineering (Reis & Housley)',
    difficulty: 'Beginner',
    category: 'Pipeline Architecture',
    track: 'architecture',
    company: 'Stripe',
    xp: 80,
    prompt: 'Describe, stage by stage, a basic ETL (Extract, Transform, Load) architecture for moving data from a production MySQL database into a data warehouse for analytics.',
    scenario: 'A company\'s product data lives in an operational MySQL database that must not be queried directly by analysts.',
    requirements: {
      functional: ['Extract data from MySQL on a schedule', 'Transform it into an analytics-friendly shape', 'Load it into a warehouse'],
      non_functional: ['Must not add significant load to the production MySQL database']
    },
    solution_approach: 'Extract: a scheduled job (or CDC tool) reads from a MySQL read replica, not the primary, to avoid production load. Transform: raw extracted data is cleaned, typed, and reshaped (e.g. into a star schema) in a staging area, either before loading (ETL) or after loading into the warehouse (ELT, more common with modern cloud warehouses). Load: the transformed data lands in warehouse tables that analysts query, fully isolated from the operational database.',
    evaluation_criteria: [
      'Candidate identifies reading from a replica (not the primary) as the way to protect production performance.',
      'Candidate can articulate ETL vs ELT as a design choice, not treat them as identical.',
      'Candidate describes three distinct stages rather than collapsing extract and load into one step.'
    ],
    starter_code: `/*
SYS-BEG-004: Stage-by-Stage ETL Pipeline Design
Scenario: Offloading transactional MySQL analytics into modern data warehouse.

Stage 1: Extract (Protecting OLTP)
  -- Source: Primary vs Read Replica vs Debezium CDC Log Capture?
  -- TODO: Explain extraction mechanism

Stage 2: Transform (Data Quality & Modeling)
  -- Location: Pre-load vs In-Warehouse (ELT vs ETL)?
  -- TODO: Cleansing, schema casting, and dimensional modeling

Stage 3: Load (Serving Layer)
  -- Target: Star Schema / Data Mart in Snowflake/BigQuery
  -- TODO: Partitioning and clustering strategy
*/`,
    solution_design: `Architecture Breakdown:
1. Extract Stage:
   - Use Debezium or read replica batch query to capture changed records without locking the MySQL primary OLTP engine.
2. Staging / Ingestion Stage:
   - Land raw JSON/CSV dumps into cloud object storage (S3/GCS) acting as the Bronze landing zone.
3. Transform & Model Stage (ELT):
   - Ingest raw tables into warehouse, then run dbt/Dataform SQL models to clean strings, cast timestamps, and join into Kimball dimensional star schemas.
4. Serving Layer:
   - BI dashboards connect directly to conformed gold star schema tables with zero performance impact on MySQL.`,
    solution_sql: `-- ELT Staging Transformation via dbt/SQL:
SELECT 
  id AS order_id,
  user_id,
  CAST(total_cents AS DECIMAL(10,2)) / 100.0 AS amount,
  DATE(created_at) AS order_date
FROM raw_mysql_orders;`,
    hints: [
      { tier: 1, title: 'ETL vs ELT Tradeoff', body: 'The core ETL/ELT question is: where does the transformation happen — before loading (ETL) or after, inside the warehouse (ELT)?' },
      { tier: 2, title: 'OLTP Isolation', body: 'Reading from a read replica or using binary log CDC instead of the primary is essential to isolate analytical queries from live transactions.' },
      { tier: 3, title: 'Complete Architecture', body: `Extract: Debezium CDC reads MySQL binary logs from a replica. Transform: Raw events land in S3, loaded into warehouse, transformed via dbt. Load: Modeled into Kimball dimensional tables.` }
    ],
    interview_edge_case: 'Ask why modern cloud data platforms (Snowflake, Databricks) tend to favor ELT over traditional ETL — cheap, elastic compute inside the warehouse/lakehouse makes it more efficient to load raw data first and transform it there with SQL/Spark, rather than in a separate transformation layer before load.'
  },
  {
    id: 'SYS-BEG-005',
    title: 'Design a Simple Cache for a Read-Heavy Dashboard API',
    source_book: 'System Design Interview – An Insider Guide (Alex Xu)',
    difficulty: 'Beginner',
    category: 'Caching Fundamentals',
    track: 'architecture',
    company: 'Databricks',
    xp: 80,
    prompt: "An analytics dashboard API serves the same 'daily revenue summary' query to hundreds of users per minute, but the underlying data only refreshes once per hour. Design a simple caching layer to reduce load on the database.",
    scenario: 'The revenue summary query is expensive (aggregates millions of rows) and identical for all users at any given moment.',
    requirements: {
      functional: ['Serve the revenue summary quickly to every request'],
      non_functional: ['Cache must not serve data older than 1 hour', 'Should significantly reduce database query volume']
    },
    solution_approach: "Introduce a cache (e.g. Redis) sitting in front of the database. On each API request, check the cache for the key 'daily_revenue_summary' first; on a cache hit, return the cached value immediately; on a miss (or expiry), query the database, store the result in the cache with a TTL of 1 hour, then return it. Because the query result is identical for all users, this single cache key serves the entire user base.",
    evaluation_criteria: [
      'Candidate proposes a TTL-based cache expiry tied to the known data refresh interval (1 hour), not an arbitrary short TTL.',
      'Candidate recognizes this as a single shared cache key scenario (not per-user caching), since the result is identical for everyone.',
      'Candidate mentions the cache-aside pattern (check cache, on miss query DB and populate cache) by name or description.'
    ],
    starter_code: `/*
SYS-BEG-005: Cache-Aside Architecture for Dashboard API
Scenario: Expensive query executed hundreds of times/min with hourly batch refresh.

1. Cache Topology & Key Strategy:
   -- Cache Engine: Redis / Memcached
   -- Cache Key: 'metrics:daily_revenue_summary:{YYYY-MM-DD}'
   -- TTL Strategy: 3600s (1 hour)

2. Read Flow (Cache-Aside Pattern):
   -- Step 1: Query Redis for key
   -- Step 2: If hit -> Return JSON
   -- Step 3: If miss -> Query warehouse DB, SETEX key 3600 value, return JSON

3. Cache Stampede Mitigation:
   -- TODO: How to prevent 500 requests from hitting DB when key expires?
*/`,
    solution_design: `Cache-Aside Implementation Logic:
def get_daily_revenue_summary(date_str):
    cache_key = f"revenue_summary:{date_str}"
    cached_val = redis_client.get(cache_key)
    if cached_val:
        return json.loads(cached_val)
    
    # Cache Miss: Query Database with mutex lock to prevent stampede
    with redis_lock("lock:" + cache_key, timeout=10):
        # Double-check cache
        cached_val = redis_client.get(cache_key)
        if cached_val:
            return json.loads(cached_val)
            
        data = db.query_daily_revenue(date_str)
        redis_client.setex(cache_key, 3600, json.dumps(data))
        return data`,
    solution_sql: `-- Cache Key: revenue_summary:{date}
-- TTL: 3600 seconds
-- Hit Rate: 99.8% reduction in warehouse query load`,
    hints: [
      { tier: 1, title: 'Single Shared Key', body: 'Since the data refreshes hourly and is identical for every user, one cache entry can serve every request — this is far simpler than per-user caching.' },
      { tier: 2, title: 'TTL Alignment', body: 'TTL (time-to-live) should be set based on how often the underlying data actually changes (1 hour), not guessed arbitrarily.' },
      { tier: 3, title: 'Complete Blueprint', body: `Cache-aside pattern: Redis sits in front of DB. Check key 'daily_revenue_summary'; on hit, return immediately. On miss, query DB, store in Redis with TTL=3600s, and return.` }
    ],
    interview_edge_case: "Ask what happens to the database if the cache entry expires right as 500 concurrent requests arrive ('cache stampede') — all 500 could hit the database simultaneously; the fix is a distributed lock / single-flight pattern where only one request recomputes while others wait."
  }
];
