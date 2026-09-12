import { Question } from '../../types';

export const SQL_QUESTIONS: Question[] = [
  {
    id: 'sql-kimball-scd2',
    title: 'Slowly Changing Dimension Type 2 (SCD2) Point-in-Time Join',
    track: 'sql',
    source_book: 'The Data Warehouse Toolkit (Ralph Kimball)',
    difficulty: 'Medium',
    category: 'Dimensional Modeling & SCD',
    company: 'Snowflake',
    xp: 90,
    prompt: `
In Kimball dimensional modeling, dimension records change over time. When joining a Transaction Fact Table with an SCD Type 2 Customer Dimension, the fact record must join to the dimension record that was **active at the exact moment the transaction occurred**.

### Challenge
Join \`fact_orders\` with \`dim_customer_scd2\` such that:
- The order joins to the correct customer record where \`order_date >= valid_from\` and \`order_date < valid_to\` (or \`valid_to IS NULL\` for current state).
- Select: \`order_id\`, \`customer_name\`, \`state\`, \`amount\`.
- Order by \`order_id\` ASC.
    `,
    init_ddl: `
CREATE TABLE fact_orders (order_id INT, customer_id INT, order_date DATE, amount DECIMAL(10,2));
INSERT INTO fact_orders VALUES 
  (101, 1, '2025-01-15', 250.00),
  (102, 1, '2025-06-20', 400.00),
  (103, 2, '2025-03-10', 150.00);

CREATE TABLE dim_customer_scd2 (customer_sk INT, customer_id INT, customer_name VARCHAR(50), state VARCHAR(2), valid_from DATE, valid_to DATE, is_current INT);
INSERT INTO dim_customer_scd2 VALUES
  (1, 1, 'Alice Smith', 'NY', '2024-01-01', '2025-05-01', 0),
  (2, 1, 'Alice Smith', 'CA', '2025-05-01', NULL, 1),
  (3, 2, 'Bob Jones', 'TX', '2024-01-01', NULL, 1);
    `,
    solution_sql: `SELECT 
  o.order_id,
  c.customer_name,
  c.state,
  o.amount
FROM fact_orders o
JOIN dim_customer_scd2 c 
  ON o.customer_id = c.customer_id
 AND o.order_date >= c.valid_from
 AND (c.valid_to IS NULL OR o.order_date < c.valid_to)
ORDER BY o.order_id ASC;`,
    test_cases: [
      {
        id: 1,
        name: 'Orders joined with point-in-time customer state',
        expected: [
          { order_id: 101, customer_name: 'Alice Smith', state: 'NY', amount: 250.00 },
          { order_id: 102, customer_name: 'Alice Smith', state: 'CA', amount: 400.00 },
          { order_id: 103, customer_name: 'Bob Jones', state: 'TX', amount: 150.00 }
        ]
      }
    ],
    expected_output: [
      { order_id: 101, customer_name: 'Alice Smith', state: 'NY', amount: 250.00 },
      { order_id: 102, customer_name: 'Alice Smith', state: 'CA', amount: 400.00 },
      { order_id: 103, customer_name: 'Bob Jones', state: 'TX', amount: 150.00 }
    ],
    hints: [
      {
        tier: 1,
        title: 'Join Condition Logic',
        body: 'Join on customer_id, and ensure order_date falls between valid_from and valid_to.'
      },
      {
        tier: 2,
        title: 'Handling NULL Sentinel Values',
        body: 'Remember to check (c.valid_to IS NULL OR o.order_date < c.valid_to) to match active records.'
      },
      {
        tier: 3,
        title: 'Complete Solution Walkthrough',
        body: `SELECT o.order_id, c.customer_name, c.state, o.amount FROM fact_orders o JOIN dim_customer_scd2 c ON o.customer_id = c.customer_id AND o.order_date >= c.valid_from AND (c.valid_to IS NULL OR o.order_date < c.valid_to) ORDER BY o.order_id ASC;`
      }
    ],
    interview_edge_case: 'Late-arriving facts! If an order arrives 6 months late, a point-in-time range join automatically routes to the correct historical surrogate key without re-computing past metrics.',
    optimization_guide: {
      timeComplexity: 'O(N log M) with B-tree index on (customer_id, valid_from, valid_to)',
      spaceComplexity: 'O(1) streaming join buffer',
      explainPlanNotes: 'In modern columnar warehouses like Snowflake, clustering by customer_id prunes irrelevant micro-partitions before scanning date ranges.',
      productionPitfall: 'Using BETWEEN valid_from AND valid_to when intervals share boundary dates. Always use half-open intervals: >= valid_from AND < valid_to.'
    }
  },
  {
    id: 'sql-snowflake-qualify',
    title: 'Snowflake QUALIFY & Deduplication without Subqueries',
    track: 'sql',
    source_book: 'Learning SQL (Alan Beaulieu)',
    difficulty: 'Medium',
    category: 'Advanced Analytical & Window Functions',
    company: 'Stripe',
    xp: 80,
    prompt: `
In Snowflake, Databricks, and Google BigQuery, the **QUALIFY** clause filters the results of analytical window functions directly, eliminating unnecessary subqueries and CTE nesting.

### Challenge
Find the top-earning employee in each department using \`DENSE_RANK()\` and Snowflake's \`QUALIFY\` clause.

Output: \`department\`, \`name\`, \`salary\`, \`rk\` ordered by \`department\` ASC.
    `,
    init_ddl: `
CREATE TABLE employees (id INT, name VARCHAR(50), department VARCHAR(50), salary INT);
INSERT INTO employees VALUES
  (1, 'Alice', 'Engineering', 160000),
  (2, 'Bob', 'Engineering', 180000),
  (3, 'Charlie', 'Engineering', 180000),
  (4, 'Diana', 'Marketing', 140000),
  (5, 'Evan', 'Marketing', 120000);
    `,
    solution_sql: `SELECT 
  department,
  name,
  salary,
  DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rk
FROM employees
QUALIFY rk = 1
ORDER BY department ASC, name ASC;`,
    test_cases: [
      {
        id: 1,
        name: 'Top earners per department using QUALIFY',
        expected: [
          { department: 'Engineering', name: 'Bob', salary: 180000, rk: 1 },
          { department: 'Engineering', name: 'Charlie', salary: 180000, rk: 1 },
          { department: 'Marketing', name: 'Diana', salary: 140000, rk: 1 }
        ]
      }
    ],
    expected_output: [
      { department: 'Engineering', name: 'Bob', salary: 180000, rk: 1 },
      { department: 'Engineering', name: 'Charlie', salary: 180000, rk: 1 },
      { department: 'Marketing', name: 'Diana', salary: 140000, rk: 1 }
    ],
    hints: [
      {
        tier: 1,
        title: 'Using QUALIFY',
        body: 'QUALIFY acts like a HAVING clause, but specifically for window functions.'
      },
      {
        tier: 2,
        title: 'Ranking ties',
        body: 'DENSE_RANK() ensures ties for #1 salary are both preserved.'
      },
      {
        tier: 3,
        title: 'Full Solution',
        body: `SELECT department, name, salary, DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rk FROM employees QUALIFY rk = 1 ORDER BY department ASC, name ASC;`
      }
    ],
    interview_edge_case: 'QUALIFY executes after WHERE, GROUP BY, and HAVING, but before DISTINCT, ORDER BY, and LIMIT in the SQL logical query lifecycle.',
    optimization_guide: {
      timeComplexity: 'O(N log N) partition sort',
      spaceComplexity: 'O(N) window frame buffer',
      explainPlanNotes: 'The database compiler pushes the QUALIFY rank = 1 filter into the window operator as a Top-N Heap optimization, discarding lower-ranked rows immediately.',
      productionPitfall: 'Standard ANSI SQL (e.g. Postgres) requires a subquery or CTE; QUALIFY is native to Snowflake, BigQuery, Databricks, and DuckDB.'
    }
  },
  {
    id: 'sql-gaps-and-islands',
    title: 'Gaps and Islands: Continuous Active User Streaks',
    track: 'sql',
    source_book: 'Learning SQL (Alan Beaulieu)',
    difficulty: 'Hard',
    category: 'Advanced Analytical & Window Functions',
    company: 'Uber',
    xp: 120,
    prompt: `
The "Gaps and Islands" problem is a classic Staff Data Engineer interview problem. Given a table of user login dates, calculate the length (in consecutive days) of each continuous login streak.

### Challenge
Group consecutive calendar days into distinct "islands" and return:
\`user_id\`, \`streak_start_date\`, \`streak_end_date\`, and \`streak_length_days\` for streaks >= 2 days.
    `,
    init_ddl: `
CREATE TABLE user_logins (user_id INT, login_date DATE);
INSERT INTO user_logins VALUES
  (1, '2026-09-01'),
  (1, '2026-09-02'),
  (1, '2026-09-03'),
  (1, '2026-09-06'), -- Gap!
  (1, '2026-09-07'),
  (2, '2026-09-01');
    `,
    solution_sql: `WITH ranked_logins AS (
  SELECT 
    user_id,
    login_date,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) AS rn
  FROM user_logins
),
grouped_islands AS (
  SELECT 
    user_id,
    login_date,
    -- Subtracting row number from date creates an identical constant for consecutive dates
    date(login_date, '-' || rn || ' day') AS island_id
  FROM ranked_logins
)
SELECT 
  user_id,
  MIN(login_date) AS streak_start_date,
  MAX(login_date) AS streak_end_date,
  COUNT(*) AS streak_length_days
FROM grouped_islands
GROUP BY user_id, island_id
HAVING COUNT(*) >= 2
ORDER BY user_id, streak_start_date;`,
    test_cases: [
      {
        id: 1,
        name: 'Identified consecutive islands',
        expected: [
          { user_id: 1, streak_start_date: '2026-09-01', streak_end_date: '2026-09-03', streak_length_days: 3 },
          { user_id: 1, streak_start_date: '2026-09-06', streak_end_date: '2026-09-07', streak_length_days: 2 }
        ]
      }
    ],
    expected_output: [
      { user_id: 1, streak_start_date: '2026-09-01', streak_end_date: '2026-09-03', streak_length_days: 3 },
      { user_id: 1, streak_start_date: '2026-09-06', streak_end_date: '2026-09-07', streak_length_days: 2 }
    ],
    hints: [
      {
        tier: 1,
        title: 'The Magic of Date Subtraction',
        body: 'If you subtract an incremental integer (ROW_NUMBER) from consecutive calendar dates, the resulting date value remains completely constant!'
      },
      {
        tier: 2,
        title: 'Group By the Constant',
        body: 'Group by user_id and that calculated constant date. Each group is an unbroken continuous island.'
      },
      {
        tier: 3,
        title: 'Complete Solution',
        body: `WITH ranked AS (SELECT user_id, login_date, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) rn FROM user_logins) SELECT user_id, MIN(login_date) streak_start_date, MAX(login_date) streak_end_date, COUNT(*) streak_length_days FROM ranked GROUP BY user_id, date(login_date, '-' || rn || ' day') HAVING COUNT(*) >= 2 ORDER BY user_id, streak_start_date;`
      }
    ],
    interview_edge_case: 'Duplicate logins on the same day! If a user logs in 3 times on 2026-09-01, ROW_NUMBER will increment, falsely splitting the island. Always deduplicate to 1 row per user per day first.',
    optimization_guide: {
      timeComplexity: 'O(N log N) to sort dates per user',
      spaceComplexity: 'O(N) in memory',
      explainPlanNotes: 'Partitioning by user_id allows parallel execution across distributed workers without inter-node data transfer.',
      productionPitfall: 'Failing to handle daylight savings time or timezone differences when computing date arithmetic.'
    }
  }
];
