export interface PracticeProblem {
  id: string;
  title: string;
  category: 'SQL' | 'Python' | 'PySpark' | 'Data Modeling' | 'DSA';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  company: 'Amazon' | 'Google' | 'Meta' | 'Netflix' | 'Uber' | 'Apple' | 'Snowflake' | 'Microsoft';
  acceptanceRate: string;
  submissionsCount: string;
  tags: string[];
  description: string;
  sampleInput: string;
  sampleOutput: string;
  starterCode: string;
  solutionCode: string;
  explanation: string;
}

export const PRACTICE_PROBLEMS: PracticeProblem[] = [
  {
    id: 'sql-101',
    title: 'Top 2 Highest Grossing Products by Category',
    category: 'SQL',
    difficulty: 'Medium',
    company: 'Amazon',
    acceptanceRate: '48.2%',
    submissionsCount: '42.5K',
    tags: ['Window Functions', 'DENSE_RANK', 'Aggregation'],
    description: 'Assume you are given the table containing information on Amazon customer spend. Write a query using window functions to identify the top 2 highest-grossing products within each category in the year 2025. Output should be ordered by category and spend rank.',
    sampleInput: `Table: product_spend
| category    | product          | spend   | transaction_date    |
|-------------|------------------|---------|---------------------|
| electronics | Apple iPhone 16  | 1200.00 | 2025-01-15 10:00:00 |
| electronics | MacBook Air M3   | 1400.00 | 2025-02-10 11:30:00 |
| electronics | Sony Headphones  | 350.00  | 2025-03-01 09:15:00 |
| appliances  | Dyson Vacuum     | 600.00  | 2025-01-20 14:00:00 |
| appliances  | LG Refrigerator  | 1800.00 | 2025-02-14 16:45:00 |
| appliances  | Ninja Air Fryer  | 150.00  | 2025-03-12 12:00:00 |`,
    sampleOutput: `| category    | product          | total_spend | ranking |
|-------------|------------------|-------------|---------|
| appliances  | LG Refrigerator  | 1800.00     | 1       |
| appliances  | Dyson Vacuum     | 600.00      | 2       |
| electronics | MacBook Air M3   | 1400.00     | 1       |
| electronics | Apple iPhone 16  | 1200.00     | 2       |`,
    starterCode: `-- Write your SQL query here
SELECT 
  category, 
  product, 
  total_spend,
  ranking
FROM (
  -- Calculate sum of spend and dense_rank over category
) sub
WHERE ranking <= 2
ORDER BY category, ranking;`,
    solutionCode: `WITH ranked_spend AS (
  SELECT 
    category,
    product,
    SUM(spend) AS total_spend,
    DENSE_RANK() OVER (
      PARTITION BY category 
      ORDER BY SUM(spend) DESC
    ) as ranking
  FROM product_spend
  WHERE strftime('%Y', transaction_date) = '2025'
  GROUP BY category, product
)
SELECT 
  category,
  product,
  ROUND(total_spend, 2) AS total_spend,
  ranking
FROM ranked_spend
WHERE ranking <= 2
ORDER BY category, ranking;`,
    explanation: 'Uses a CTE with SUM(spend) grouped by category and product, paired with DENSE_RANK() window function partitioned by category. The outer query filters for rank <= 2.'
  },
  {
    id: 'sql-102',
    title: 'Consecutive Login Days (Streak Detection)',
    category: 'SQL',
    difficulty: 'Hard',
    company: 'Meta',
    acceptanceRate: '34.7%',
    submissionsCount: '38.1K',
    tags: ['Gaps and Islands', 'Window Functions', 'Date Arithmetic'],
    description: 'Meta tracks user engagement daily. Write a query to find all users who logged in for at least 3 consecutive calendar days. Output the user_id and the streak start and end dates.',
    sampleInput: `Table: user_logins
| user_id | login_date |
|---------|------------|
| 101     | 2025-03-01 |
| 101     | 2025-03-02 |
| 101     | 2025-03-03 |
| 101     | 2025-03-07 |
| 202     | 2025-03-01 |
| 202     | 2025-03-03 |`,
    sampleOutput: `| user_id | streak_days | start_date | end_date   |
|---------|-------------|------------|------------|
| 101     | 3           | 2025-03-01 | 2025-03-03 |`,
    starterCode: `-- Solve the Gaps and Islands problem using ROW_NUMBER()
WITH ordered_logins AS (
  SELECT DISTINCT user_id, CAST(login_date AS DATE) AS login_date
  FROM user_logins
)
SELECT user_id, COUNT(*) AS streak_days
FROM ordered_logins
GROUP BY user_id;`,
    solutionCode: `WITH unique_dates AS (
  SELECT DISTINCT user_id, CAST(login_date AS DATE) AS log_date
  FROM user_logins
),
groups AS (
  SELECT 
    user_id,
    log_date,
    log_date - (ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY log_date) * INTERVAL '1 day') AS grp
  FROM unique_dates
)
SELECT 
  user_id,
  COUNT(*) AS streak_days,
  MIN(log_date) AS start_date,
  MAX(log_date) AS end_date
FROM groups
GROUP BY user_id, grp
HAVING COUNT(*) >= 3
ORDER BY user_id, start_date;`,
    explanation: 'Classic Gaps & Islands pattern. Subtracting a sequential ROW_NUMBER() in days from the login date yields a constant date marker (grp) for all contiguous days.'
  },
  {
    id: 'sql-103',
    title: 'Surge Pricing vs Driver Payout Disparity',
    category: 'SQL',
    difficulty: 'Medium',
    company: 'Uber',
    acceptanceRate: '52.1%',
    submissionsCount: '29.3K',
    tags: ['Self Join', 'Aggregates', 'Financial Metrics'],
    description: 'Uber investigates trip routes where rider surge multiplier was >= 1.8x, but the driver received less than 60% of total fare collected. Identify the top 5 city zones with the highest total disparity in dollars.',
    sampleInput: `Table: rides
| ride_id | city_zone | total_fare | driver_pay | surge_mult |
|---------|-----------|------------|------------|------------|
| R1      | Downtown  | 45.00      | 22.00      | 2.0        |
| R2      | Downtown  | 50.00      | 24.00      | 1.9        |
| R3      | Airport   | 80.00      | 55.00      | 2.2        |
| R4      | Uptown    | 30.00      | 15.00      | 1.8        |`,
    sampleOutput: `| city_zone | total_disparity | affected_rides |
|-----------|-----------------|----------------|
| Downtown  | 49.00           | 2              |
| Uptown    | 15.00           | 1              |`,
    starterCode: `SELECT 
  city_zone,
  SUM(total_fare - driver_pay) AS total_disparity,
  COUNT(ride_id) AS affected_rides
FROM rides
WHERE surge_mult >= 1.8 
  AND (driver_pay / total_fare) < 0.60
GROUP BY city_zone
ORDER BY total_disparity DESC
LIMIT 5;`,
    solutionCode: `SELECT 
  city_zone,
  ROUND(SUM(total_fare - driver_pay), 2) AS total_disparity,
  COUNT(ride_id) AS affected_rides
FROM rides
WHERE surge_mult >= 1.8 
  AND (CAST(driver_pay AS FLOAT) / total_fare) < 0.60
GROUP BY city_zone
ORDER BY total_disparity DESC
LIMIT 5;`,
    explanation: 'Filters rides where surge multiplier >= 1.8 and driver payout ratio < 0.60, aggregating total disparity per zone.'
  },
  {
    id: 'python-201',
    title: 'Idempotent JSON Event Cleanser & Stream Validator',
    category: 'Python',
    difficulty: 'Easy',
    company: 'Google',
    acceptanceRate: '68.9%',
    submissionsCount: '51.4K',
    tags: ['JSON Parsing', 'Data Quality', 'Schema Validation'],
    description: 'Given a list of raw event payloads with missing fields, malformed timestamps, and duplicates, write a Python generator function cleanse_events(raw_events) that yields deduplicated, schema-validated dictionaries with UTC ISO-8601 timestamps.',
    sampleInput: `[
  {"event_id": "e1", "user_id": 42, "ts": 1740000000},
  {"event_id": "e1", "user_id": 42, "ts": 1740000000},
  {"event_id": "e2", "user_id": null, "ts": 1740001000}
]`,
    sampleOutput: `[
  {"event_id": "e1", "user_id": 42, "timestamp": "2025-02-19T21:20:00Z"}
]`,
    starterCode: `from datetime import datetime, timezone
from typing import List, Dict, Generator, Any

def cleanse_events(raw_events: List[Dict[str, Any]]) -> Generator[Dict[str, Any], None, None]:
    seen_ids = set()
    for ev in raw_events:
        # TODO: Validate schema, remove duplicates, format timestamp
        pass`,
    solutionCode: `from datetime import datetime, timezone
from typing import List, Dict, Generator, Any

def cleanse_events(raw_events: List[Dict[str, Any]]) -> Generator[Dict[str, Any], None, None]:
    seen_ids = set()
    for ev in raw_events:
        event_id = ev.get('event_id')
        user_id = ev.get('user_id')
        ts = ev.get('ts')
        
        if not event_id or user_id is None or ts is None:
            continue
        if event_id in seen_ids:
            continue
            
        seen_ids.add(event_id)
        iso_time = datetime.fromtimestamp(ts, tz=timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
        yield {
            'event_id': event_id,
            'user_id': int(user_id),
            'timestamp': iso_time
        }`,
    explanation: 'Uses a generator pattern for constant memory usage, validates essential non-null attributes, deduplicates via set, and formats unix timestamps into UTC ISO-8601 strings.'
  },
  {
    id: 'pyspark-301',
    title: 'PySpark Windowing & Skewed Join Salting',
    category: 'PySpark',
    difficulty: 'Hard',
    company: 'Netflix',
    acceptanceRate: '29.4%',
    submissionsCount: '22.1K',
    tags: ['PySpark', 'Salting', 'Broadcast Join', 'Data Skew'],
    description: 'When joining a 500GB daily user interaction stream with a dimension table, key UNKNOWN_DEVICE causes severe stage hang on a single executor due to data skew. Implement a salting technique in PySpark to evenly distribute the skewed key across 16 buckets before performing the join.',
    sampleInput: `interactions_df: [user_id, device_id, action_timestamp]
devices_df: [device_id, device_family, os_version]`,
    sampleOutput: `Joined DataFrame partitioned with no executor skewing beyond 5% of average partition runtime.`,
    starterCode: `from pyspark.sql import functions as F

def salted_join(interactions_df, devices_df, num_salts=16):
    # 1. Add random salt to interactions_df where device_id == 'UNKNOWN_DEVICE'
    # 2. Replicate devices_df with salt 0..15
    # 3. Join on [device_id, salt]
    pass`,
    solutionCode: `from pyspark.sql import functions as F

def salted_join(interactions_df, devices_df, num_salts=16):
    salted_interactions = interactions_df.withColumn(
        'salt',
        F.when(F.col('device_id') == 'UNKNOWN_DEVICE', F.floor(F.rand() * num_salts))
         .otherwise(F.lit(0))
    )
    
    salts_array = F.array([F.lit(i) for i in range(num_salts)])
    replicated_devices = devices_df.withColumn(
        'salt',
        F.when(F.col('device_id') == 'UNKNOWN_DEVICE', F.explode(salts_array))
         .otherwise(F.lit(0))
    )
    
    return salted_interactions.join(
        replicated_devices,
        on=['device_id', 'salt'],
        how='inner'
    ).drop('salt')`,
    explanation: 'Salting distributes the concentrated key across multiple shuffle partitions, preventing a single reducer executor from running out of memory (OOM) or causing stage tail latency.'
  },
  {
    id: 'modeling-401',
    title: 'SCD Type 2 Dimension Table MERGE',
    category: 'Data Modeling',
    difficulty: 'Medium',
    company: 'Snowflake',
    acceptanceRate: '59.8%',
    submissionsCount: '31.2K',
    tags: ['Kimball', 'SCD Type 2', 'Surrogate Keys', 'Effective Dates'],
    description: 'Design the schema and write an idempotent SQL MERGE query for updating dim_customer_scd2 to capture customer address and tier changes with is_current, valid_from, and valid_to timestamps.',
    sampleInput: `Incoming batch: customer_id = 450, new_tier = 'Gold', effective = '2025-03-15'`,
    sampleOutput: `Old record: valid_to updated to 2025-03-15, is_current = FALSE. New record inserted with valid_from = 2025-03-15, valid_to = '9999-12-31', is_current = TRUE.`,
    starterCode: `-- Write the SQL MERGE statement for SCD Type 2
MERGE INTO dim_customer_scd2 target
USING staging_customers source
ON target.customer_id = source.customer_id AND target.is_current = TRUE
WHEN MATCHED AND (target.tier != source.tier OR target.address != source.address) THEN
  UPDATE SET target.valid_to = source.effective_date, target.is_current = FALSE;`,
    solutionCode: `MERGE INTO dim_customer_scd2 target
USING (
  SELECT 
    customer_id, 
    customer_name, 
    address, 
    tier, 
    effective_date AS valid_from, 
    '9999-12-31'::TIMESTAMP AS valid_to, 
    TRUE AS is_current
  FROM staging_customers
) source
ON target.customer_id = source.customer_id AND target.is_current = TRUE
WHEN MATCHED AND (target.tier != source.tier OR target.address != source.address) THEN
  UPDATE SET target.valid_to = source.valid_from, target.is_current = FALSE;

INSERT INTO dim_customer_scd2 (customer_id, customer_name, address, tier, valid_from, valid_to, is_current)
SELECT s.customer_id, s.customer_name, s.address, s.tier, s.effective_date, '9999-12-31'::TIMESTAMP, TRUE
FROM staging_customers s
LEFT JOIN dim_customer_scd2 d 
  ON s.customer_id = d.customer_id AND d.is_current = TRUE
WHERE d.customer_id IS NULL OR (d.tier != s.tier OR d.address != s.address);`,
    explanation: 'Maintains historical timeline integrity without loss of past context, adhering to standard Ralph Kimball dimensional warehousing best practices.'
  },
  {
    id: 'sql-104',
    title: 'Sessionization & Idle Timeout Tracking',
    category: 'SQL',
    difficulty: 'Hard',
    company: 'Apple',
    acceptanceRate: '31.5%',
    submissionsCount: '27.4K',
    tags: ['Window Functions', 'LAG', 'SUM OVER', 'Sessionization'],
    description: 'Apple Music logs click events with timestamps. A new user session is defined when there is an idle gap of more than 30 minutes between consecutive clicks. Calculate total session count and average session duration in minutes per user.',
    sampleInput: `Table: music_clicks
| user_id | click_time          | song_id |
|---------|---------------------|---------|
| U1      | 2025-03-01 10:00:00 | S100    |
| U1      | 2025-03-01 10:12:00 | S101    |
| U1      | 2025-03-01 11:00:00 | S102    |
| U1      | 2025-03-01 11:20:00 | S103    |`,
    sampleOutput: `| user_id | session_count | avg_duration_minutes |
|---------|---------------|----------------------|
| U1      | 2             | 16.0                 |`,
    starterCode: `-- Identify session breaks where click_time - lag(click_time) > 30 mins
WITH click_diffs AS (
  SELECT 
    user_id,
    click_time,
    LAG(click_time) OVER (PARTITION BY user_id ORDER BY click_time) AS prev_time
  FROM music_clicks
)
SELECT user_id, COUNT(*) FROM click_diffs;`,
    solutionCode: `WITH click_diffs AS (
  SELECT 
    user_id,
    click_time,
    LAG(click_time) OVER (PARTITION BY user_id ORDER BY click_time) AS prev_time
  FROM music_clicks
),
session_flags AS (
  SELECT 
    user_id,
    click_time,
    CASE 
      WHEN prev_time IS NULL OR (EXTRACT(EPOCH FROM (click_time - prev_time)) / 60) > 30 
      THEN 1 ELSE 0 
    END AS is_new_session
  FROM click_diffs
),
assigned_sessions AS (
  SELECT 
    user_id,
    click_time,
    SUM(is_new_session) OVER (PARTITION BY user_id ORDER BY click_time) AS session_id
  FROM session_flags
),
session_durations AS (
  SELECT 
    user_id,
    session_id,
    ROUND((EXTRACT(EPOCH FROM (MAX(click_time) - MIN(click_time))) / 60)::NUMERIC, 1) AS duration_mins
  FROM assigned_sessions
  GROUP BY user_id, session_id
)
SELECT 
  user_id,
  COUNT(session_id) AS session_count,
  ROUND(AVG(duration_mins), 1) AS avg_duration_minutes
FROM session_durations
GROUP BY user_id;`,
    explanation: 'Uses LAG to compute difference from previous event, flags transitions >30 mins, applies a cumulative SUM() window to form session IDs, and aggregates duration.'
  },
  {
    id: 'sql-105',
    title: 'Year-over-Year (YoY) Growth Rate per Subscription Tier',
    category: 'SQL',
    difficulty: 'Medium',
    company: 'Microsoft',
    acceptanceRate: '56.4%',
    submissionsCount: '34.8K',
    tags: ['Window Functions', 'LAG', 'Percentage Growth'],
    description: 'Write a SQL query to calculate the Year-over-Year (YoY) revenue percentage growth rate for Microsoft 365 enterprise tiers across 2024 and 2025. Output the tier, year, current revenue, previous year revenue, and YoY growth rate percentage.',
    sampleInput: `Table: tier_revenue
| tier        | year | total_revenue |
|-------------|------|---------------|
| E3 Business | 2024 | 12000000.00   |
| E3 Business | 2025 | 14500000.00   |
| E5 Security | 2024 | 8000000.00    |
| E5 Security | 2025 | 11200000.00   |`,
    sampleOutput: `| tier        | year | current_revenue | prior_revenue | yoy_growth_pct |
|-------------|------|-----------------|---------------|----------------|
| E3 Business | 2025 | 14500000.00     | 12000000.00   | +20.83%        |
| E5 Security | 2025 | 11200000.00     | 8000000.00    | +40.00%        |`,
    starterCode: `SELECT 
  tier,
  year,
  total_revenue AS current_revenue,
  LAG(total_revenue) OVER (PARTITION BY tier ORDER BY year) AS prior_revenue
FROM tier_revenue;`,
    solutionCode: `WITH revenue_lags AS (
  SELECT 
    tier,
    year,
    total_revenue AS current_revenue,
    LAG(total_revenue) OVER (PARTITION BY tier ORDER BY year) AS prior_revenue
  FROM tier_revenue
)
SELECT 
  tier,
  year,
  ROUND(current_revenue, 2) AS current_revenue,
  ROUND(prior_revenue, 2) AS prior_revenue,
  CONCAT('+', ROUND(((current_revenue - prior_revenue) / prior_revenue * 100)::NUMERIC, 2), '%') AS yoy_growth_pct
FROM revenue_lags
WHERE prior_revenue IS NOT NULL
ORDER BY tier, year;`,
    explanation: 'Uses LAG() partitioned by tier to retrieve the prior year amount, then calculates relative growth formula: ((current - prior) / prior) * 100.'
  },
  {
    id: 'dsa-201',
    title: 'Two Sum Problem using Hashing',
    category: 'DSA',
    difficulty: 'Easy',
    company: 'Google',
    acceptanceRate: '68.4%',
    submissionsCount: '92.1K',
    tags: ['Hashing', 'Arrays', 'Dictionary', 'Two Sum'],
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You must solve it in O(N) time complexity using a Hash Map (Python dictionary).',
    sampleInput: `nums = [2, 7, 11, 15]
target = 9`,
    sampleOutput: `[0, 1]  # Because nums[0] + nums[1] == 2 + 7 == 9`,
    starterCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Use a dictionary to store complement indices in O(N) time
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test execution
print(two_sum([2, 7, 11, 15], 9))`,
    solutionCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
    explanation: 'Maintains a hash map mapping number values to their array index. For each number, computes target - num and checks if the complement already exists in O(1) average lookup time.'
  },
  {
    id: 'dsa-202',
    title: 'Reverse a Singly Linked List',
    category: 'DSA',
    difficulty: 'Medium',
    company: 'Amazon',
    acceptanceRate: '59.8%',
    submissionsCount: '78.3K',
    tags: ['Linked List', 'Pointers', 'In-Place'],
    description: 'Given the head of a singly linked list, reverse the list in-place and return the reversed list head. Must be completed with O(1) auxiliary space.',
    sampleInput: `Head: 1 -> 2 -> 3 -> 4 -> 5 -> NULL`,
    sampleOutput: `Head: 5 -> 4 -> 3 -> 2 -> 1 -> NULL`,
    starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_linked_list(head: ListNode) -> ListNode:
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
    solutionCode: `def reverse_linked_list(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev`,
    explanation: 'Iterates through the linked list with three pointers (prev, curr, next_node), rewiring each node to point backward to prev. Operates in O(N) time and O(1) memory.'
  },
  {
    id: 'py-203',
    title: 'Lambda Function coupled with map() List Transformation',
    category: 'Python',
    difficulty: 'Easy',
    company: 'Meta',
    acceptanceRate: '74.2%',
    submissionsCount: '45.6K',
    tags: ['Lambda', 'Functional Programming', 'map()'],
    description: 'Given a list of raw transaction logs with prices in cents, use a Python lambda function paired with map() to normalize all prices into floating-point dollars with tax multiplier (1.0825x).',
    sampleInput: `raw_cents = [1050, 2400, 999, 15000]`,
    sampleOutput: `[11.37, 25.98, 10.81, 162.38]`,
    starterCode: `# Transform raw cents to dollars with tax using lambda and map
raw_cents = [1050, 2400, 999, 15000]

transformed_prices = list(
    map(lambda cents: round((cents / 100.0) * 1.0825, 2), raw_cents)
)
print(transformed_prices)`,
    solutionCode: `def normalize_transactions(raw_cents: list[int]) -> list[float]:
    return list(map(lambda x: round((x / 100.0) * 1.0825, 2), raw_cents))`,
    explanation: 'Demonstrates functional programming in Python using lambda as an anonymous callable inside map() to avoid explicit loop overhead.'
  },
  {
    id: 'sql-106',
    title: 'Deduplicate Records using ROW_NUMBER() in CTE',
    category: 'SQL',
    difficulty: 'Medium',
    company: 'Apple',
    acceptanceRate: '61.3%',
    submissionsCount: '51.2K',
    tags: ['CTE', 'ROW_NUMBER', 'Deduplication'],
    description: 'In an ingested customer events stream, duplicate rows occurred due to network retry bursts. Write a SQL CTE with ROW_NUMBER() to identify duplicate records keeping only the earliest occurrence per (user_id, event_id).',
    sampleInput: `Table: user_events
| user_id | event_id | event_timestamp      | payload    |
|---------|----------|----------------------|------------|
| U101    | E900     | 2025-04-01 10:00:00  | click_hero |
| U101    | E900     | 2025-04-01 10:00:01  | click_hero |
| U202    | E905     | 2025-04-01 10:05:00  | checkout   |`,
    sampleOutput: `| user_id | event_id | event_timestamp     | payload    |
|---------|----------|---------------------|------------|
| U101    | E900     | 2025-04-01 10:00:00 | click_hero |
| U202    | E905     | 2025-04-01 10:05:00 | checkout   |`,
    starterCode: `WITH ranked_events AS (
  SELECT 
    user_id,
    event_id,
    event_timestamp,
    payload,
    ROW_NUMBER() OVER (
      PARTITION BY user_id, event_id 
      ORDER BY event_timestamp ASC
    ) as row_num
  FROM user_events
)
SELECT user_id, event_id, event_timestamp, payload
FROM ranked_events
WHERE row_num = 1;`,
    solutionCode: `WITH ranked_events AS (
  SELECT 
    user_id,
    event_id,
    event_timestamp,
    payload,
    ROW_NUMBER() OVER (
      PARTITION BY user_id, event_id 
      ORDER BY event_timestamp ASC
    ) as row_num
  FROM user_events
)
SELECT user_id, event_id, event_timestamp, payload
FROM ranked_events
WHERE row_num = 1
ORDER BY user_id, event_timestamp;`,
    explanation: 'Partitions by unique natural key (user_id, event_id) and numbers occurrences in chronological order. Filtering where row_num = 1 isolates the primary record, allowing deduplication in Bronze/Silver pipelines.'
  },
  {
    id: 'spark-301',
    title: 'Broadcast Join to Eliminate Skew Shuffling',
    category: 'PySpark',
    difficulty: 'Hard',
    company: 'Netflix',
    acceptanceRate: '42.1%',
    submissionsCount: '27.4K',
    tags: ['Broadcast Join', 'Data Skew', 'PySpark', 'AQE'],
    description: 'A 500GB viewing logs DataFrame is skewed by popular show ID 101. Joining against a 5MB title metadata DataFrame causes OOM on executor shuffle stages. Write the PySpark code using broadcast() to distribute the small DataFrame to all worker nodes without network shuffle.',
    sampleInput: `large_df: 500GB viewing events (heavily skewed on show_id)
small_df: 5MB show title metadata`,
    sampleOutput: `HashJoin without ShuffleExchange (BroadcastHashJoin Exec)`,
    starterCode: `from pyspark.sql import functions as F

def optimize_skewed_join(large_df, small_df):
    # Use broadcast to eliminate shuffle exchange
    result_df = large_df.join(
        F.broadcast(small_df),
        on="show_id",
        how="inner"
    )
    return result_df`,
    solutionCode: `from pyspark.sql import functions as F

def optimize_skewed_join(large_df, small_df):
    return large_df.join(
        F.broadcast(small_df),
        on="show_id",
        how="inner"
    )`,
    explanation: 'Wrapping the small DataFrame in F.broadcast() forces the Spark Catalyst optimizer to select BroadcastHashJoin, replicating the 5MB table in executor memory and eliminating the expensive wide shuffle exchange on the 500GB skewed key.'
  }
];
