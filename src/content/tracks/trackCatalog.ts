// DataForge Master Tracks Catalog & Gated Curriculum
// Features 5 Comprehensive Tracks with 3-Tier Hierarchy (Foundation, Applied, Mastery),
// Module Learn & Test phases, Placement Diagnostics, and Capstone Project Rubrics.

import { TrackDefinition } from '../../types';

export const MASTER_TRACKS: TrackDefinition[] = [
  // 1. SQL MASTERY
  {
    id: 'sql',
    slug: 'sql',
    name: 'SQL Mastery & Query Engine Internals',
    shortDesc: 'From relational algebra to distributed query optimization, recursive CTEs, and SCD Type 2 point-in-time updates.',
    iconName: 'Database',
    accentColor: '#38bdf8',
    tiers: [
      {
        id: 'sql-tier-1',
        trackId: 'sql',
        tierNumber: 1,
        name: 'Foundation',
        description: 'Core relational querying, multi-table joins, grouping, aggregations, and subqueries.',
        modules: [
          {
            id: 'sql-m101',
            tierId: 'sql-tier-1',
            trackId: 'sql',
            title: 'Relational Algebra & SELECT Fundamentals',
            order: 1,
            durationMinutes: 25,
            learnContent: {
              overview: 'Understand how SQL engines parse, plan, and execute projection (SELECT), selection (WHERE), and distinct filtering.',
              keyConcepts: [
                {
                  title: 'Order of Query Execution',
                  description: 'Logical execution order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT.',
                  codeSnippet: 'SELECT customer_id, count(*)\nFROM orders\nWHERE status = \'COMPLETED\'\nGROUP BY customer_id\nHAVING count(*) > 5\nORDER BY 2 DESC\nLIMIT 10;'
                },
                {
                  title: 'Three-Valued Logic & NULL Safety',
                  description: 'Comparisons with NULL evaluate to UNKNOWN, not FALSE. Always use IS NULL or COALESCE() to safeguard pipeline transformations.',
                  codeSnippet: 'SELECT COALESCE(phone, email, \'NO_CONTACT\') AS contact_method\nFROM users;'
                }
              ],
              seniorTip: 'Never use WHERE col = NULL; SQL uses ternary logic (TRUE, FALSE, UNKNOWN) and equality against NULL will always yield UNKNOWN.',
              antiPattern: 'Using SELECT * in production ETL queries. Always project explicit column names to avoid schema-drift breakages.'
            },
            test: {
              id: 'test-sql-m101',
              title: 'Relational Execution Assessment',
              description: 'Evaluate your mastery of SQL logical execution order and three-valued logic.',
              passingScore: 70,
              questions: [
                {
                  id: 'q-sql-101-1',
                  question: 'Which clause in a SQL query is logically evaluated FIRST by the query planner?',
                  options: ['SELECT', 'FROM / JOIN', 'WHERE', 'ORDER BY'],
                  correctIndex: 1,
                  explanation: 'The FROM and JOIN clauses are executed first to assemble the working dataset in memory before filtering occurs.'
                },
                {
                  id: 'q-sql-101-2',
                  question: 'What is the evaluated boolean result of the expression: `5 = NULL` in ANSI SQL?',
                  options: ['FALSE', 'TRUE', 'UNKNOWN', 'ERROR'],
                  correctIndex: 2,
                  explanation: 'Any equality or scalar comparison against NULL evaluates to UNKNOWN under ANSI three-valued logic.'
                },
                {
                  id: 'q-sql-101-3',
                  question: 'Why can you NOT reference an alias defined in the SELECT clause within the WHERE clause of the same query block?',
                  options: [
                    'Because WHERE is executed before SELECT in logical query processing',
                    'Because aliases are stripped by the query parser',
                    'Because WHERE only operates on indexed columns',
                    'Because aliases only exist in memory during sorting'
                  ],
                  correctIndex: 0,
                  explanation: 'WHERE filters rows before SELECT calculates expressions and defines output column aliases.'
                },
                {
                  id: 'q-sql-101-4',
                  question: 'What does `COALESCE(val1, val2, val3)` return?',
                  options: [
                    'The count of non-null values',
                    'The first non-null expression in the argument list',
                    'The largest non-null value',
                    'An error if any value is null'
                  ],
                  correctIndex: 1,
                  explanation: 'COALESCE evaluates its arguments from left to right and returns the first non-null value encountered.'
                }
              ]
            }
          },
          {
            id: 'sql-m102',
            tierId: 'sql-tier-1',
            trackId: 'sql',
            title: 'Multi-Table JOINs & Set Operations',
            order: 2,
            durationMinutes: 30,
            learnContent: {
              overview: 'Master INNER, LEFT, RIGHT, FULL OUTER, CROSS, and ANTI/SEMI joins, alongside UNION vs UNION ALL memory trade-offs.',
              keyConcepts: [
                {
                  title: 'Left Anti-Join Pattern',
                  description: 'Identify records in Table A that have no match in Table B using LEFT JOIN ... WHERE B.id IS NULL.',
                  codeSnippet: 'SELECT a.user_id\nFROM users a\nLEFT JOIN churned_users b ON a.user_id = b.user_id\nWHERE b.user_id IS NULL;'
                },
                {
                  title: 'UNION vs UNION ALL',
                  description: 'UNION ALL appends sets without deduping, running in O(N). Plain UNION forces an expensive sort/hash deduplication stage.',
                  codeSnippet: 'SELECT id, \'web\' AS channel FROM web_events\nUNION ALL\nSELECT id, \'app\' AS channel FROM app_events;'
                }
              ],
              seniorTip: 'Always prefer UNION ALL over UNION in high-volume data pipelines unless deduplication is strictly mandated; UNION incurs a costly sort/hash stage.',
              antiPattern: 'Accidental Cartesian products caused by joining on non-unique keys without prior aggregation.'
            },
            test: {
              id: 'test-sql-m102',
              title: 'Multi-Table Join Assessment',
              description: 'Test your understanding of outer joins, anti-joins, and set operations.',
              passingScore: 70,
              questions: [
                {
                  id: 'q-sql-102-1',
                  question: 'What is the primary performance drawback of UNION compared to UNION ALL in big data engines?',
                  options: [
                    'UNION requires an expensive distinct/sorting pass to eliminate duplicates',
                    'UNION cannot accept different data types',
                    'UNION does not work on partitioned tables',
                    'UNION restricts query plans to a single worker node'
                  ],
                  correctIndex: 0,
                  explanation: 'UNION performs implicit deduplication, which forces an extra distributed shuffle, sort, or hash aggregation stage across worker nodes.'
                },
                {
                  id: 'q-sql-102-2',
                  question: 'Which query pattern is commonly known as a Left Anti-Join?',
                  options: [
                    'SELECT a.* FROM a INNER JOIN b ON a.id = b.id',
                    'SELECT a.* FROM a LEFT JOIN b ON a.id = b.id WHERE b.id IS NULL',
                    'SELECT a.* FROM a RIGHT JOIN b ON a.id = b.id',
                    'SELECT a.* FROM a FULL OUTER JOIN b ON a.id = b.id WHERE a.id IS NOT NULL'
                  ],
                  correctIndex: 1,
                  explanation: 'A LEFT JOIN combined with WHERE b.id IS NULL filters out all matched rows, leaving only rows from the left table that have no counterpart.'
                }
              ]
            }
          },
          {
            id: 'sql-m103',
            tierId: 'sql-tier-1',
            trackId: 'sql',
            title: 'Aggregations, GROUP BY, & HAVING',
            order: 3,
            durationMinutes: 30,
            learnContent: {
              overview: 'Dive deep into streaming aggregations, hash aggregations, grouping sets, and filtering aggregated results.',
              keyConcepts: [
                {
                  title: 'HAVING vs WHERE',
                  description: 'WHERE filters base rows prior to grouping; HAVING filters the aggregated summary rows after GROUP BY reduction.',
                  codeSnippet: 'SELECT department_id, AVG(salary) AS avg_sal\nFROM employees\nWHERE status = \'ACTIVE\'\nGROUP BY department_id\nHAVING AVG(salary) > 120000;'
                },
                {
                  title: 'GROUPING SETS / ROLLUP / CUBE',
                  description: 'Generate multi-level aggregations in a single scan rather than performing multiple expensive UNION ALL passes.',
                  codeSnippet: 'SELECT region, product_category, SUM(revenue)\nFROM sales\nGROUP BY GROUPING SETS ((region, product_category), (region), ());'
                }
              ],
              seniorTip: 'Always filter as aggressively as possible in WHERE before the GROUP BY stage to minimize the memory footprint of intermediate hash tables.',
              antiPattern: 'Placing column filters in HAVING that could have been placed in WHERE.'
            },
            test: {
              id: 'test-sql-m103',
              title: 'Aggregation & Reduction Assessment',
              description: 'Verify your understanding of aggregation stages, grouping semantics, and HAVING clauses.',
              passingScore: 70,
              questions: [
                {
                  id: 'q-sql-103-1',
                  question: 'What is the key functional difference between WHERE and HAVING?',
                  options: [
                    'WHERE filters raw records prior to aggregation; HAVING filters aggregated groups',
                    'WHERE only works with integers; HAVING works with strings',
                    'WHERE is evaluated after ORDER BY; HAVING is evaluated before',
                    'WHERE can only be used with JOIN statements'
                  ],
                  correctIndex: 0,
                  explanation: 'WHERE discards rows before the GROUP BY hash table is created, while HAVING evaluates aggregate expressions after grouping is finalized.'
                },
                {
                  id: 'q-sql-103-2',
                  question: 'What does COUNT(column_name) calculate in standard SQL?',
                  options: [
                    'Total rows in the group including NULLs',
                    'Only rows where column_name IS NOT NULL',
                    'Distinct values of column_name',
                    'The sum of numeric entries'
                  ],
                  correctIndex: 1,
                  explanation: 'COUNT(col) only counts non-NULL instances, whereas COUNT(*) counts all rows regardless of column nullability.'
                }
              ]
            }
          }
        ],
        capstone: {
          id: 'sql-cap-t1',
          tierId: 'sql-tier-1',
          trackId: 'sql',
          title: 'Tier 1 Capstone: E-Commerce Customer Lifecycle & Revenue Analysis',
          description: 'Construct an analytical SQL script that cleans, joins, and aggregates transaction logs across customers, orders, and products.',
          businessScenario: 'A global marketplace needs to identify customer purchase frequencies, detect inactive customers via anti-joins, and generate revenue breakdown tiers.',
          deliverables: [
            'Cleaned customer lifetime order summary query with proper NULL coalescing',
            'Left anti-join query to identify dormant accounts with no purchases in 90 days',
            'Hierarchical revenue rollup by region and category using GROUPING SETS or ROLLUP',
            'Documented query plan validation confirming no Cartesian products or redundant scans'
          ],
          rubricItems: [
            {
              id: 'rubric-sql-1-1',
              criterion: 'Logical Query Structure & Correctness',
              weightPercent: 30,
              guidance: 'Query produces accurate summary metrics with no duplicate rows from one-to-many relationship fan-outs.'
            },
            {
              id: 'rubric-sql-1-2',
              criterion: 'Proper Null Safety & Defensive Coding',
              weightPercent: 30,
              guidance: 'All optional fields handled gracefully via COALESCE or CASE WHEN.'
            },
            {
              id: 'rubric-sql-1-3',
              criterion: 'Optimal Set Operations & Join Selection',
              weightPercent: 40,
              guidance: 'Anti-join correctly implemented; UNION ALL selected instead of costly UNION.'
            }
          ]
        }
      },
      {
        id: 'sql-tier-2',
        trackId: 'sql',
        tierNumber: 2,
        name: 'Applied',
        description: 'Analytical window functions, offset operations, common table expressions (CTEs), and sessionization.',
        modules: [
          {
            id: 'sql-m201',
            tierId: 'sql-tier-2',
            trackId: 'sql',
            title: 'Analytical Window Functions (ROW_NUMBER, RANK, DENSE_RANK)',
            order: 1,
            durationMinutes: 35,
            learnContent: {
              overview: 'Perform calculations across sets of rows that are related to the current query row without collapsing rows like GROUP BY does.',
              keyConcepts: [
                {
                  title: 'Ranking Differences',
                  description: 'ROW_NUMBER assigns strictly sequential integers (1,2,3). RANK leaves gaps on ties (1,2,2,4). DENSE_RANK assigns consecutive numbers without gaps on ties (1,2,2,3).',
                  codeSnippet: 'SELECT employee_id, department_id, salary,\n  ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) as rn,\n  RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as rk,\n  DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as drk\nFROM employees;'
                },
                {
                  title: 'Top-N per Category Pattern',
                  description: 'Filter using a CTE or subquery over ROW_NUMBER() <= N to get top performers per group.',
                  codeSnippet: 'WITH ranked AS (\n  SELECT *, ROW_NUMBER() OVER (PARTITION BY category ORDER BY sales DESC) as rn\n  FROM products\n)\nSELECT * FROM ranked WHERE rn <= 3;'
                }
              ],
              seniorTip: 'Window functions are evaluated after HAVING and before ORDER BY. You cannot filter on a window column in the WHERE clause of the same query block.',
              antiPattern: 'Confusing RANK() with DENSE_RANK() when calculating salary or leaderboard tiers with duplicate values.'
            },
            test: {
              id: 'test-sql-m201',
              title: 'Window Function Ranking Assessment',
              description: 'Assess proficiency in partition windows, ranking functions, and top-N query designs.',
              passingScore: 70,
              questions: [
                {
                  id: 'q-sql-201-1',
                  question: 'If two rows tie for 2nd place in salary, what will the RANK() function assign to the next row?',
                  options: ['3', '4', '2', 'NULL'],
                  correctIndex: 1,
                  explanation: 'RANK() skips positions corresponding to the number of tied elements (1, 2, 2, 4).'
                },
                {
                  id: 'q-sql-201-2',
                  question: 'In the same scenario with ties for 2nd place, what will DENSE_RANK() assign to the next row?',
                  options: ['3', '4', '2', 'NULL'],
                  correctIndex: 0,
                  explanation: 'DENSE_RANK() does not leave gaps on ties, so the next distinct value receives rank 3.'
                }
              ]
            }
          },
          {
            id: 'sql-m202',
            tierId: 'sql-tier-2',
            trackId: 'sql',
            title: 'Offset Windows (LEAD, LAG) & Rolling Aggregations',
            order: 2,
            durationMinutes: 35,
            learnContent: {
              overview: 'Access preceding or following rows in the partition without self-joins, and master rolling window frames (ROWS BETWEEN).',
              keyConcepts: [
                {
                  title: 'LEAD and LAG for Time Series Analysis',
                  description: 'Compute period-over-period growth or detect state changes by comparing current row values with adjacent rows.',
                  codeSnippet: 'SELECT date, daily_revenue,\n  LAG(daily_revenue, 1, 0) OVER (ORDER BY date) as prev_day_revenue\nFROM revenue_log;'
                }
              ],
              seniorTip: 'Always specify an explicit default value in LAG/LEAD (e.g. `LAG(val, 1, 0)`) to avoid division-by-zero crashes.',
              antiPattern: 'Using RANGE BETWEEN instead of ROWS BETWEEN on unordered or non-unique columns.'
            },
            test: {
              id: 'test-sql-m202',
              title: 'Sliding Frames & Offset Assessment',
              description: 'Demonstrate competency in time-series delta calculations and sliding window frames.',
              passingScore: 70,
              questions: [
                {
                  id: 'q-sql-202-1',
                  question: 'What does `LAG(amount, 1, 0) OVER (ORDER BY txn_date)` return for the very first row in the partition?',
                  options: ['NULL', '0', 'The current amount', 'An OutOfBoundsException'],
                  correctIndex: 1,
                  explanation: 'The third parameter to LAG() specifies the fallback default value when no preceding row exists, which here is 0.'
                },
                {
                  id: 'q-sql-202-2',
                  question: 'What is the default window frame when an `ORDER BY` clause is present inside an `OVER()` specification without explicit frame bounds?',
                  options: [
                    'ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING',
                    'RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW',
                    'ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING',
                    'RANGE BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING'
                  ],
                  correctIndex: 1,
                  explanation: 'ANSI SQL specifies RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW as the default frame when ORDER BY is specified without an explicit frame clause.'
                }
              ]
            }
          },
          {
            id: 'sql-m203',
            tierId: 'sql-tier-2',
            trackId: 'sql',
            title: 'Common Table Expressions (CTEs) & Modular SQL',
            order: 3,
            durationMinutes: 30,
            learnContent: {
              overview: 'Build readable, maintainable, and modular data pipelines using CTEs, and understand query optimization materialized vs inlined CTE semantics.',
              keyConcepts: [
                {
                  title: 'Pipeline Readability with CTEs',
                  description: 'Decompose complex multi-step transformations into sequential named stages rather than deeply nested unreadable subqueries.',
                  codeSnippet: 'WITH clean_orders AS (\n  SELECT order_id, customer_id, amount\n  FROM raw_orders WHERE status = \'PAID\'\n)\nSELECT customer_id, SUM(amount) FROM clean_orders GROUP BY customer_id;'
                }
              ],
              seniorTip: 'Be aware that referencing an inlined CTE multiple times in the same query can cause the database to execute the underlying scan multiple times unless materialized.',
              antiPattern: 'Building monolithic 500-line queries with 15 nested subqueries instead of logical, self-contained CTE pipelines.'
            },
            test: {
              id: 'test-sql-m203',
              title: 'CTE Architecture Assessment',
              description: 'Demonstrate competency in query structuring, CTE optimization, and modular SQL pipeline design.',
              passingScore: 70,
              questions: [
                {
                  id: 'q-sql-203-1',
                  question: 'What is a significant architectural benefit of CTEs over subqueries in complex ETL queries?',
                  options: [
                    'They allow step-by-step sequential readability and can be referenced multiple times within the query scope',
                    'They are automatically stored permanently in the database catalog',
                    'They bypass all security and table lock constraints',
                    'They execute in Python instead of SQL'
                  ],
                  correctIndex: 0,
                  explanation: 'CTEs structure multi-stage logic in top-down readable steps and can be referenced multiple times across downstream CTEs.'
                },
                {
                  id: 'q-sql-203-2',
                  question: 'Can a CTE reference a preceding CTE defined earlier in the same `WITH` block?',
                  options: [
                    'Yes, downstream CTEs can freely query preceding CTEs',
                    'No, CTEs are strictly isolated from one another',
                    'Only if the `RECURSIVE` keyword is supplied',
                    'Only in MySQL 8'
                  ],
                  correctIndex: 0,
                  explanation: 'A WITH statement allows chained definitions where each subsequent CTE can select from any prior CTE.'
                }
              ]
            }
          }
        ],
        capstone: {
          id: 'sql-cap-t2',
          tierId: 'sql-tier-2',
          trackId: 'sql',
          title: 'Tier 2 Capstone: Financial Ledger Fraud Detection & Balance Reconciliation',
          description: 'Construct an applied analytical query engine that detects rapid-fire transactional anomalies, computes running account balances, and identifies velocity spikes.',
          businessScenario: 'A fintech unicorn experiences fraudulent account draining via rapid automated micro-transactions. Build an analytical audit pipeline to flag suspicious account activity.',
          deliverables: [
            'Running ledger balance query using `SUM(amount) OVER (PARTITION BY account_id ORDER BY txn_time)`',
            'Time delta detection calculating seconds elapsed between consecutive transactions via `LAG()`',
            'Velocity fraud detector flagging accounts with > 3 transactions within 60 seconds',
            'Modular multi-stage CTE architecture with zero duplicate subquery logic'
          ],
          rubricItems: [
            {
              id: 'rubric-sql-2-1',
              criterion: 'Window Partitioning & Cumulative Accuracy',
              weightPercent: 50,
              guidance: 'Running balances and sliding frames accurately calculate cumulative sums without boundary leaks.'
            },
            {
              id: 'rubric-sql-2-2',
              criterion: 'Time Delta & Gap Detection Logic',
              weightPercent: 50,
              guidance: 'LAG offset and timestamp math correctly identifies inter-transaction intervals.'
            }
          ]
        }
      },
      {
        id: 'sql-tier-3',
        trackId: 'sql',
        tierNumber: 3,
        name: 'Mastery',
        description: 'Recursive CTEs, graph traversals, query planner optimization (EXPLAIN ANALYZE), and Slowly Changing Dimensions (SCD Type 2).',
        modules: [
          {
            id: 'sql-m301',
            tierId: 'sql-tier-3',
            trackId: 'sql',
            title: 'Recursive CTEs & Hierarchical Graph Traversal',
            order: 1,
            durationMinutes: 40,
            learnContent: {
              overview: 'Traverse graph structures, parent-child org hierarchies, and bill-of-materials trees using ANSI `WITH RECURSIVE`.',
              keyConcepts: [
                {
                  title: 'Recursive CTE Mechanics',
                  description: 'Composed of an Anchor Member (base case) and a Recursive Member joined by UNION ALL, executing until the working set is empty.',
                  codeSnippet: 'WITH RECURSIVE org_chart AS (\n  SELECT emp_id, manager_id, name, 1 as depth\n  FROM employees WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.emp_id, e.manager_id, e.name, o.depth + 1\n  FROM employees e\n  JOIN org_chart o ON e.manager_id = o.emp_id\n)\nSELECT * FROM org_chart ORDER BY depth;'
                }
              ],
              seniorTip: 'Always include cycle detection or maximum depth limits when writing recursive CTEs against production user data to avoid infinite memory exhaustion.',
              antiPattern: 'Omitting a recursion depth limit or termination condition, resulting in an infinite execution loop that locks database resources.'
            },
            test: {
              id: 'test-sql-m301',
              title: 'Recursive Graph Traversal Assessment',
              description: 'Assess understanding of recursive query architecture, anchor members, and cyclic graph safeguards.',
              passingScore: 70,
              questions: [
                {
                  id: 'q-sql-301-1',
                  question: 'What are the two mandatory components of a `WITH RECURSIVE` query in standard SQL?',
                  options: [
                    'Anchor Member and Recursive Member connected by UNION ALL',
                    'PRIMARY KEY and FOREIGN KEY declaration',
                    'INDEX and EXPLAIN statement',
                    'TRY block and CATCH block'
                  ],
                  correctIndex: 0,
                  explanation: 'A recursive query requires an Anchor Member (base rows) and a Recursive Member (inductive step) joined by UNION ALL.'
                },
                {
                  id: 'q-sql-301-2',
                  question: 'When does the recursive step in a recursive CTE terminate naturally?',
                  options: [
                    'When the recursive query returns an empty result set (0 rows)',
                    'After exactly 10 iterations',
                    'When the client disconnects',
                    'When all CPU cores hit 100%'
                  ],
                  correctIndex: 0,
                  explanation: 'The iteration terminates when the recursive query yields an empty intermediate working table.'
                }
              ]
            }
          },
          {
            id: 'sql-m302',
            tierId: 'sql-tier-3',
            trackId: 'sql',
            title: 'Query Optimization, Index Strategies, & EXPLAIN ANALYZE',
            order: 2,
            durationMinutes: 45,
            learnContent: {
              overview: 'Deconstruct query plans, understand B-Tree / BRIN indexes, and eliminate Sequential Scans and Disk Spills.',
              keyConcepts: [
                {
                  title: 'Reading EXPLAIN ANALYZE',
                  description: 'Differentiate between estimated cost (planner prediction) and actual time/rows (real engine runtime execution).',
                  codeSnippet: 'EXPLAIN (ANALYZE, BUFFERS)\nSELECT customer_id, count(*)\nFROM orders\nWHERE order_date >= \'2024-01-01\'\nGROUP BY customer_id;'
                },
                {
                  title: 'WorkMem & External Hash Spills',
                  description: 'When work_mem is insufficient, sorting and hash aggregations spill from RAM to disk, degrading throughput.',
                  codeSnippet: 'SET work_mem = \'128MB\';'
                }
              ],
              seniorTip: 'Look for "Batches: > 1" or "external merge Disk" in execution plans; this signifies work_mem starvation where the engine had to dump intermediate buckets to disk.',
              antiPattern: 'Wrapping indexed columns in functions (e.g. `WHERE DATE(created_at) = \'2024-01-01\'`), which completely invalidates standard index usage.'
            },
            test: {
              id: 'test-sql-m302',
              title: 'Query Plan Optimization Assessment',
              description: 'Demonstrate ability to diagnose bottleneck plans, eliminate spills, and design index architectures.',
              passingScore: 70,
              questions: [
                {
                  id: 'q-sql-302-1',
                  question: 'Why does writing `WHERE DATE(created_at) = \'2024-01-01\'` prevent standard B-tree index utilization on `created_at`?',
                  options: [
                    'Because applying a function to a column prevents index seek; the engine must evaluate DATE() for every row via sequential scan',
                    'Because DATE is not a valid SQL function',
                    'Because B-tree indexes only support string columns',
                    'Because created_at is automatically converted to UTC'
                  ],
                  correctIndex: 0,
                  explanation: 'Functions applied to columns in WHERE predicates are non-sargable (search-argument-able), forcing a full table scan unless an expression index exists.'
                },
                {
                  id: 'q-sql-302-2',
                  question: 'In an EXPLAIN ANALYZE output, what does "Sort Method: external merge Disk" indicate?',
                  options: [
                    'The working dataset exceeded work_mem, forcing the engine to spill temporary sort chunks to disk',
                    'The query sorted in RAM with optimal efficiency',
                    'The hard drive has hardware sector errors',
                    'The query was executed across multiple distributed nodes'
                  ],
                  correctIndex: 0,
                  explanation: 'External merge disk means work_mem was insufficient to hold the dataset in memory, causing disk I/O penalties.'
                }
              ]
            }
          },
          {
            id: 'sql-m303',
            tierId: 'sql-tier-3',
            trackId: 'sql',
            title: 'Deduplication, SCD Type 2 Updates & MERGE Statements',
            order: 3,
            durationMinutes: 40,
            learnContent: {
              overview: 'Implement Slowly Changing Dimensions (SCD Type 2) to maintain full historical audit trails in data warehouses.',
              keyConcepts: [
                {
                  title: 'SCD Type 2 Lifecycle',
                  description: 'Track changes by creating a new record for every modification with valid_from, valid_to, and is_current flags.',
                  codeSnippet: 'MERGE INTO dim_customers t\nUSING staging_customers s ON t.customer_id = s.customer_id\nWHEN MATCHED AND s.updated_at > t.updated_at THEN\n  UPDATE SET valid_to = CURRENT_TIMESTAMP, is_current = FALSE;'
                }
              ],
              seniorTip: 'Always use an open-ended high date (e.g. `9999-12-31`) for `valid_to` on active rows rather than NULL; this allows point-in-time joins with simple `BETWEEN valid_from AND valid_to` predicates without NULL coalescing.',
              antiPattern: 'Performing separate non-transactional UPDATE and INSERT operations in distributed lakehouses without MERGE, creating race conditions.'
            },
            test: {
              id: 'test-sql-m303',
              title: 'Dimensional Warehousing & History Assessment',
              description: 'Evaluate mastery of SCD Type 2 pipelines, point-in-time joins, and atomic MERGE statements.',
              passingScore: 70,
              questions: [
                {
                  id: 'q-sql-303-1',
                  question: 'What is the key defining feature of a Slowly Changing Dimension Type 2 (SCD2)?',
                  options: [
                    'It preserves full historical changes by inserting a new record with effective dates rather than overwriting',
                    'It overwrites existing values immediately (zero history)',
                    'It stores changes in an external text file',
                    'It only updates numeric columns'
                  ],
                  correctIndex: 0,
                  explanation: 'SCD Type 2 maintains history by closing the previous record (setting valid_to) and creating a new record with valid_from.'
                },
                {
                  id: 'q-sql-303-2',
                  question: 'Why is setting `valid_to = \'9999-12-31\'` preferred over `valid_to = NULL` for current active rows in SCD2 dimension tables?',
                  options: [
                    'It simplifies point-in-time fact joins using `fact_date BETWEEN valid_from AND valid_to` without needing OR/COALESCE null checks',
                    'Because SQL databases reject NULL in date columns',
                    'Because 9999 is required for partition pruning',
                    'Because NULL values cannot be indexed'
                  ],
                  correctIndex: 0,
                  explanation: 'Having a real infinity date enables clean `BETWEEN valid_from AND valid_to` joins without NULL handling logic.'
                }
              ]
            }
          }
        ],
        capstone: {
          id: 'sql-cap-t3',
          tierId: 'sql-tier-3',
          trackId: 'sql',
          title: 'Tier 3 Capstone: Production Warehouse ETL Pipeline with Zero-Downtime Atomic Swaps',
          description: 'Design and implement an end-to-end SQL warehouse pipeline featuring automated staging deduplication, idempotent SCD Type 2 dimension historical tracking, and fact table reconciliation.',
          businessScenario: 'An enterprise healthcare platform receives continuous patient updates with late-arriving records. Design an enterprise warehouse loader that guarantees historical audit compliance and zero duplicate records.',
          deliverables: [
            'Deduplication staging layer handling late-arriving records via partition ranking',
            'SCD Type 2 dimension merge closing existing records and inserting new versions with valid_from/valid_to',
            'Point-in-time fact table join demonstrating exact historical attribute lookup for past transactions',
            'Query optimization report demonstrating zero disk spills, sargable index usage, and partition pruning'
          ],
          rubricItems: [
            {
              id: 'rubric-sql-3-1',
              criterion: 'SCD Type 2 Historical Integrity',
              weightPercent: 50,
              guidance: 'Closed records correctly dated; active record marked current; zero overlapping validity intervals for any single entity.'
            },
            {
              id: 'rubric-sql-3-2',
              criterion: 'Point-in-Time Join Precision & Performance',
              weightPercent: 50,
              guidance: 'Fact transactions correctly join to the exact historical dimension state active at the time the transaction occurred.'
            }
          ]
        }
      }
    ],
    placementDiagnostic: {
      title: 'SQL Placement Diagnostic Examination',
      description: 'Test out of Foundation or Applied tiers. Scoring ≥70% unlocks Applied; scoring ≥90% qualifies directly for Mastery.',
      qualifyAppliedScore: 70,
      qualifyMasteryScore: 90,
      questions: [
        {
          id: 'diag-sql-1',
          question: 'What is the logical order of query execution in SQL?',
          options: [
            'FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY',
            'SELECT -> FROM -> WHERE -> ORDER BY',
            'WHERE -> FROM -> SELECT -> GROUP BY',
            'FROM -> SELECT -> WHERE -> HAVING'
          ],
          correctIndex: 0,
          explanation: 'FROM evaluates data sources first, followed by filtering (WHERE), aggregation (GROUP BY, HAVING), projection (SELECT), and sorting (ORDER BY).'
        },
        {
          id: 'diag-sql-2',
          question: 'What rank values are produced by RANK() for values [100, 90, 90, 80] ordered descending?',
          options: ['1, 2, 2, 4', '1, 2, 2, 3', '1, 2, 3, 4', '1, 2, 3, 3'],
          correctIndex: 0,
          explanation: 'RANK leaves a gap for ties: positions 1, 2, 2, then skips to 4.'
        },
        {
          id: 'diag-sql-3',
          question: 'What does `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` define?',
          options: [
            'A sliding window frame containing the current row and the two preceding physical rows (3 rows total)',
            'Only the row from two days ago',
            'All rows from the beginning of table',
            'A range of identical keys'
          ],
          correctIndex: 0,
          explanation: 'ROWS BETWEEN 2 PRECEDING AND CURRENT ROW defines a rolling window of up to 3 physical rows.'
        }
      ]
    }
  },

  // 2. PYTHON TRACK
  {
    id: 'python',
    slug: 'python',
    name: 'Python for Data Engineering',
    shortDesc: 'Generators, memory-efficient parsers, Polars/Pandas vectorization, async ingestion, and enterprise ETL frameworks.',
    iconName: 'Code',
    accentColor: '#4ade80',
    tiers: [
      {
        id: 'py-tier-1',
        trackId: 'python',
        tierNumber: 1,
        name: 'Foundation',
        description: 'Memory architecture, list/dict comprehensions, file I/O, and streaming generators.',
        modules: [
          {
            id: 'py-m101',
            tierId: 'py-tier-1',
            trackId: 'python',
            title: 'Data Structures, Memory Overhead, & Comprehensions',
            order: 1,
            durationMinutes: 25,
            learnContent: {
              overview: 'Understand Python object memory layout, dict hash tables, set lookups, and memory-efficient list comprehensions.',
              keyConcepts: [
                {
                  title: 'Hash Tables vs Lists in Lookups',
                  description: 'Checking membership in a set/dict is O(1) average time; in a list, it is O(N). In pipelines with millions of keys, this is the difference between seconds and hours.',
                  codeSnippet: '# O(1) set lookup\nvalid_users = set(load_user_ids())\nfiltered_txns = [t for t in txns if t["user_id"] in valid_users]'
                }
              ],
              seniorTip: 'Always convert lookup reference lists to `set()` before entering a large iteration loop; list lookups degrade to O(N^2) total runtime.',
              antiPattern: 'Re-evaluating a list membership test inside a loop: `if item in large_list:`'
            },
            test: {
              id: 'test-py-m101',
              title: 'Python Memory & Structure Assessment',
              description: 'Assess understanding of time complexity and memory overhead in Python collections.',
              passingScore: 70,
              questions: [
                {
                  id: 'q-py-101-1',
                  question: 'What is the average time complexity of checking membership `x in collection` when collection is a Python `set`?',
                  options: ['O(1)', 'O(N)', 'O(log N)', 'O(N^2)'],
                  correctIndex: 0,
                  explanation: 'Python sets are implemented as hash tables, providing O(1) average time lookup.'
                },
                {
                  id: 'q-py-101-2',
                  question: 'What is the memory difference between `[x for x in range(1000000)]` and `(x for x in range(1000000))`?',
                  options: [
                    'The list comprehension allocates all 1M integers in RAM immediately; the generator expression yields items lazily on demand using tiny fixed memory',
                    'They use identical RAM',
                    'The generator uses more memory because it creates threads',
                    'List comprehensions cannot be iterated over'
                  ],
                  correctIndex: 0,
                  explanation: 'Parentheses create a lazy generator expression requiring constant O(1) memory, while brackets allocate a full million-element list in memory.'
                }
              ]
            }
          },
          {
            id: 'py-m102',
            tierId: 'py-tier-1',
            trackId: 'python',
            title: 'Streaming Generators & Lazy Evaluation for Large Files',
            order: 2,
            durationMinutes: 30,
            learnContent: {
              overview: 'Process multi-gigabyte log and CSV files line-by-line using Python generator functions and iterators without crashing RAM.',
              keyConcepts: [
                {
                  title: 'Generator Pipelines with `yield`',
                  description: 'Chain multiple processing stages together where each row flows through the pipeline without ever materializing in memory.',
                  codeSnippet: 'def read_large_file(file_path):\n    with open(file_path, "r") as f:\n        for line in f:\n            yield line.strip()'
                }
              ],
              seniorTip: 'Use `itertools.islice()` to process generators in fixed batch chunks (e.g. 1,000 rows at a time) for batch database bulk inserts.',
              antiPattern: 'Calling `f.readlines()` on a 20GB file, which loads every line into memory simultaneously and triggers an OutOfMemory kill.'
            },
            test: {
              id: 'test-py-m102',
              title: 'Streaming Generators Assessment',
              description: 'Demonstrate ability to build constant-memory pipelines using generator functions.',
              passingScore: 70,
              questions: [
                {
                  id: 'q-py-102-1',
                  question: 'What keyword turns a regular Python function into a generator factory?',
                  options: ['yield', 'return', 'async', 'defer'],
                  correctIndex: 0,
                  explanation: 'Using the `yield` keyword pauses execution and yields a value, turning the function into an iterable generator.'
                },
                {
                  id: 'q-py-102-2',
                  question: 'What is the risk of using `f.readlines()` when parsing an 80GB server log in Python?',
                  options: [
                    'It attempts to read all 80GB into RAM at once, causing an Out Of Memory (OOM) operating system crash',
                    'It corrupts the file on disk',
                    'It skips every second line',
                    'It cannot handle UTF-8 characters'
                  ],
                  correctIndex: 0,
                  explanation: '`readlines()` reads all lines into a memory list at once, exceeding available system RAM for large files.'
                }
              ]
            }
          }
        ],
        capstone: {
          id: 'py-cap-t1',
          tierId: 'py-tier-1',
          trackId: 'python',
          title: 'Tier 1 Capstone: High-Throughput Web Server Log Ingestion Engine',
          description: 'Build a streaming Python CLI ingestion script that parses multi-gigabyte server access logs in constant memory, routes bad rows to a DLQ, and generates hourly metric summaries.',
          businessScenario: 'An infrastructure team generates 50GB of raw server access logs daily. Build a lightweight Python utility that streams lines, parses status codes, and outputs hourly traffic aggregates.',
          deliverables: [
            'Streaming generator reader maintaining < 50MB RAM footprint throughout execution',
            'Regex or zero-copy string splitter extracting IP, method, status, and latency',
            'Quarantine dead-letter queue JSONL file capturing malformed records with error reasons'
          ],
          rubricItems: [
            {
              id: 'rubric-py-1-1',
              criterion: 'Memory Footprint & Lazy Evaluation',
              weightPercent: 50,
              guidance: 'Script uses generators throughout; memory usage remains flat regardless of input file size.'
            },
            {
              id: 'rubric-py-1-2',
              criterion: 'Dead Letter Queue & Robustness',
              weightPercent: 50,
              guidance: 'Bad rows do not cause script termination; quarantined lines include original text and error details.'
            }
          ]
        }
      },
      {
        id: 'py-tier-2',
        trackId: 'python',
        tierNumber: 2,
        name: 'Applied',
        description: 'Polars & Pandas vectorized manipulation, asynchronous HTTP ingestion, and multiprocessing concurrency.',
        modules: [
          {
            id: 'py-m201',
            tierId: 'py-tier-2',
            trackId: 'python',
            title: 'Vectorized Data Manipulation with Polars & Pandas',
            order: 1,
            durationMinutes: 35,
            learnContent: {
              overview: 'Harness vectorized operations in Polars (Apache Arrow, Rust-powered) to process millions of rows without Python for-loops.',
              keyConcepts: [
                {
                  title: 'Why Polars Outperforms Pandas',
                  description: 'Polars utilizes Apache Arrow columnar memory and query optimization via lazy evaluation (`pl.scan_csv`).',
                  codeSnippet: 'import polars as pl\nq = pl.scan_csv("events.csv").filter(pl.col("amount") > 100)\ndf = q.collect()'
                }
              ],
              seniorTip: 'Always use `.scan_parquet()` in Polars to build a lazy query plan with predicate pushdown.',
              antiPattern: 'Iterating over a DataFrame using `.iterrows()` in Pandas.'
            },
            test: {
              id: 'test-py-m201',
              title: 'Vectorization & Polars Assessment',
              description: 'Evaluate mastery of columnar memory and Polars lazy query execution.',
              passingScore: 70,
              questions: [
                {
                  id: 'q-py-201-1',
                  question: 'Why is Polars significantly faster than pure Python loops or Pandas for analytical queries?',
                  options: [
                    'It is written in Rust, leverages Apache Arrow columnar memory, and executes multi-threaded vectorized operations',
                    'It skips data validation entirely',
                    'It only runs on GPUs',
                    'It requires less disk space'
                  ],
                  correctIndex: 0,
                  explanation: 'Polars leverages Rust, Arrow columnar layout, and query optimization with multi-threaded SIMD execution.'
                }
              ]
            }
          }
        ],
        capstone: {
          id: 'py-cap-t2',
          tierId: 'py-tier-2',
          trackId: 'python',
          title: 'Tier 2 Capstone: Distributed Crypto Exchange Order Book Aggregator',
          description: 'Construct a high-performance Python data extractor that pulls order book snapshots from multiple exchange REST APIs asynchronously and processes order depth with Polars.',
          businessScenario: 'A quantitative fund requires an ingestion service that concurrently queries trading pairs across exchanges and outputs Parquet datasets.',
          deliverables: [
            'Asynchronous API client using httpx with semaphore concurrency controls',
            'Polars transformation module calculating depth-weighted average price',
            'Snappy-compressed Parquet partitioned by exchange/symbol/date'
          ],
          rubricItems: [
            {
              id: 'rubric-py-2-1',
              criterion: 'Asynchronous Concurrency',
              weightPercent: 50,
              guidance: 'Correct use of asyncio and semaphores; zero thread-blocking calls inside the async event loop.'
            },
            {
              id: 'rubric-py-2-2',
              criterion: 'Vectorized Processing',
              weightPercent: 50,
              guidance: 'Calculations utilize native Polars expressions without converting back to Python row loops.'
            }
          ]
        }
      },
      {
        id: 'py-tier-3',
        trackId: 'python',
        tierNumber: 3,
        name: 'Mastery',
        description: 'Memory-mapped files, zero-copy streaming with PyArrow, Pydantic schema contracts, and enterprise ETL frameworks.',
        modules: [
          {
            id: 'py-m301',
            tierId: 'py-tier-3',
            trackId: 'python',
            title: 'Memory-Mapped Files & Zero-Copy Streaming with PyArrow',
            order: 1,
            durationMinutes: 40,
            learnContent: {
              overview: 'Eliminate serialization overhead using memory mapping and PyArrow RecordBatches to stream gigabytes of columnar data.',
              keyConcepts: [
                {
                  title: 'Zero-Copy Data Access',
                  description: 'PyArrow allows accessing slices of data in RAM directly through memory pointers without copying bytes into Python memory space.',
                  codeSnippet: 'import pyarrow.parquet as pq\nfile = pq.ParquetFile("data.parquet")\nfor batch in file.iter_batches(batch_size=50000):\n    process(batch)'
                }
              ],
              seniorTip: 'When writing IPC streams between microservices, use pyarrow.ipc.new_stream() over shared memory for maximum throughput.',
              antiPattern: 'Converting PyArrow tables to Pandas (.to_pandas()) unnecessarily, doubling RAM usage.'
            },
            test: {
              id: 'test-py-m301',
              title: 'Zero-Copy PyArrow Assessment',
              description: 'Assess understanding of Apache Arrow memory layout and streaming.',
              passingScore: 70,
              questions: [
                {
                  id: 'q-py-301-1',
                  question: 'What does Zero-Copy mean in the context of Apache Arrow and PyArrow?',
                  options: [
                    'Accessing data structures directly via memory pointers without copying bytes between buffers or runtimes',
                    'Files that take 0 bytes on disk',
                    'Queries that do not use any CPU instructions',
                    'A database that does not use backups'
                  ],
                  correctIndex: 0,
                  explanation: 'Zero-copy allows multiple applications to read the exact same physical memory buffer without memory replication.'
                }
              ]
            }
          }
        ],
        capstone: {
          id: 'py-cap-t3',
          tierId: 'py-tier-3',
          trackId: 'python',
          title: 'Tier 3 Capstone: Enterprise Event Bus Ingestion Gateway with Dead Letter Queues',
          description: 'Architect a production-ready ingestion service in Python that consumes high-volume event streams, applies Pydantic schema validation, streams batches via PyArrow, and routes corrupted rows to a DLQ.',
          businessScenario: 'An ad-tech exchange ingests 50,000 bid events/second. Build a resilient ingestion engine that validates schemas, quarantines invalid payloads, and flushes valid events as compressed Parquet files with zero memory leaks.',
          deliverables: [
            'Pydantic v2 event model with strict field-level constraints and custom validators',
            'Zero-copy PyArrow batch buffer flushing RecordBatches once reaching 100,000 rows or 5 seconds',
            'Circuit-breaker protected DLQ writer capturing failed events with stack traces'
          ],
          rubricItems: [
            {
              id: 'rubric-py-3-1',
              criterion: 'Pydantic Schema Validation & Typing',
              weightPercent: 50,
              guidance: 'Comprehensive validation rules; custom validator checks event timestamp freshness and ID formats.'
            },
            {
              id: 'rubric-py-3-2',
              criterion: 'Zero-Copy PyArrow Batch Flushing',
              weightPercent: 50,
              guidance: 'Events assembled in Arrow RecordBatches and flushed efficiently without Python object leaks.'
            }
          ]
        }
      }
    ],
    placementDiagnostic: {
      title: 'Python for DE Placement Diagnostic Examination',
      description: 'Test out of Foundation or Applied tiers. Scoring ≥70% unlocks Applied; scoring ≥90% qualifies directly for Mastery.',
      qualifyAppliedScore: 70,
      qualifyMasteryScore: 90,
      questions: [
        {
          id: 'diag-py-1',
          question: 'What is the memory complexity of a Python generator compared to a list comprehension generating 10 million integers?',
          options: ['Generator is O(1) constant memory; list comprehension is O(N) linear memory', 'They are both O(N)', 'Generator is O(N^2)', 'List comprehension is O(1)'],
          correctIndex: 0,
          explanation: 'Generators produce items one at a time on demand, consuming a tiny fixed amount of memory regardless of collection size.'
        },
        {
          id: 'diag-py-2',
          question: 'What is the time complexity of checking membership `item in set_data` in Python?',
          options: ['O(1) average', 'O(N)', 'O(log N)', 'O(N!)'],
          correctIndex: 0,
          explanation: 'Python sets are hash tables with O(1) average lookup time.'
        }
      ]
    }
  },

  // 3. PYSPARK TRACK
  {
    id: 'pyspark',
    slug: 'pyspark',
    name: 'PySpark & Distributed Lakehouses',
    shortDesc: 'Spark Catalyst optimizer, shuffle internals, skew mitigation, Structured Streaming, Delta Lake, and Iceberg ACID tables.',
    iconName: 'Zap',
    accentColor: '#fb923c',
    tiers: [
      {
        id: 'spark-tier-1',
        trackId: 'pyspark',
        tierNumber: 1,
        name: 'Foundation',
        description: 'Distributed compute architecture, Spark Driver & Executors, DataFrames, and Transformations vs Actions.',
        modules: [
          {
            id: 'spark-m101',
            tierId: 'spark-tier-1',
            trackId: 'pyspark',
            title: 'Spark Cluster Architecture: Driver, Executors, & DAGs',
            order: 1,
            durationMinutes: 30,
            learnContent: {
              overview: 'Understand how Apache Spark distributes computations across a cluster, coordinates tasks via the Driver, and compiles lazy DAGs.',
              keyConcepts: [
                {
                  title: 'Driver vs Executor Responsibilities',
                  description: 'The Driver analyzes code, builds the DAG, coordinates stages with the Cluster Manager, and schedules tasks across Executors.',
                  codeSnippet: 'spark = SparkSession.builder.appName("Demo").getOrCreate()'
                }
              ],
              seniorTip: 'Never call .collect() on large distributed DataFrames; calling collect pulls the entire dataset across the network into Driver memory.',
              antiPattern: 'Calling .count() repeatedly between transformation steps for debugging; each .count() triggers a complete re-execution of the DAG.'
            },
            test: {
              id: 'test-spark-m101',
              title: 'Spark Architecture Assessment',
              description: 'Assess understanding of Driver/Executor roles and lazy transformations.',
              passingScore: 70,
              questions: [
                {
                  id: 'q-spark-101-1',
                  question: 'What is the fundamental difference between a Transformation and an Action in Apache Spark?',
                  options: [
                    'Transformations are lazily evaluated to construct an execution plan; Actions trigger the actual physical execution on the cluster',
                    'Transformations run on Executors; Actions only run on the Driver',
                    'Transformations modify files on disk immediately; Actions are read-only',
                    'Transformations cannot return DataFrames'
                  ],
                  correctIndex: 0,
                  explanation: 'Transformations build up the DAG lazily, whereas Actions trigger DAG execution and compute results.'
                }
              ]
            }
          }
        ],
        capstone: {
          id: 'spark-cap-t1',
          tierId: 'spark-tier-1',
          trackId: 'pyspark',
          title: 'Tier 1 Capstone: Retail Transaction Aggregation & Store Ranking Pipeline',
          description: 'Develop an end-to-end PySpark batch pipeline that reads retail sales data, enforces explicit schemas, handles missing values, and ranks stores.',
          businessScenario: 'A supermarket chain needs a daily batch job to aggregate sales across 500 locations and output ranked store performance tables.',
          deliverables: [
            'Clean PySpark script reading CSV data using explicit StructType schemas',
            'Transformation logic computing total sales, tax, and profit margin per store',
            'Partitioned Parquet writer outputting data partitioned by sale_year/sale_month'
          ],
          rubricItems: [
            {
              id: 'rubric-spark-1-1',
              criterion: 'Explicit Schema & I/O Optimization',
              weightPercent: 50,
              guidance: 'Explicit StructType schema defined; no costly schema inference passes.'
            },
            {
              id: 'rubric-spark-1-2',
              criterion: 'Vectorized Spark Functions',
              weightPercent: 50,
              guidance: 'Strictly uses pyspark.sql.functions; zero custom Python row UDFs.'
            }
          ]
        }
      },
      {
        id: 'spark-tier-2',
        trackId: 'pyspark',
        tierNumber: 2,
        name: 'Applied',
        description: 'Catalyst optimizer tuning, Broadcast Joins, handling data skew, Structured Streaming, and micro-batches.',
        modules: [
          {
            id: 'spark-m201',
            tierId: 'spark-tier-2',
            trackId: 'pyspark',
            title: 'Catalyst Optimizer Tuning & Broadcast Joins',
            order: 1,
            durationMinutes: 40,
            learnContent: {
              overview: 'Master the Spark Catalyst query planner, explain plans, and broadcast joins to eliminate multi-gigabyte shuffle phases.',
              keyConcepts: [
                {
                  title: 'Broadcast Hash Join (BHJ)',
                  description: 'When joining a massive fact table with a small dimension table (< 10MB default), broadcast the small table to every executor, eliminating network shuffles.',
                  codeSnippet: 'df_joined = large_fact_df.join(F.broadcast(small_dim_df), on="category_id")'
                }
              ],
              seniorTip: 'Increase spark.sql.autoBroadcastJoinThreshold up to 100MB if your executors have ample memory.',
              antiPattern: 'Broadcasting a table larger than driver memory, causing driver OOM crashes.'
            },
            test: {
              id: 'test-spark-m201',
              title: 'Catalyst & Broadcast Assessment',
              description: 'Assess join strategies and Catalyst optimization.',
              passingScore: 70,
              questions: [
                {
                  id: 'q-spark-201-1',
                  question: 'What is the primary performance benefit of a Broadcast Hash Join (BHJ) over a Sort Merge Join (SMJ)?',
                  options: [
                    'It eliminates the expensive distributed network shuffle of the massive fact table by sending the small table to all executors',
                    'It eliminates the need for executors entirely',
                    'It allows joining on non-equality predicates',
                    'It converts string columns to integers'
                  ],
                  correctIndex: 0,
                  explanation: 'In a BHJ, the large table remains in place on its local partitions; only the small dimension table is broadcast across executors.'
                }
              ]
            }
          }
        ],
        capstone: {
          id: 'spark-cap-t2',
          tierId: 'spark-tier-2',
          trackId: 'pyspark',
          title: 'Tier 2 Capstone: Real-Time IoT Telemetry Anomaly Detection Stream',
          description: 'Construct a stateful PySpark Structured Streaming application that consumes simulated IoT sensor metrics and detects temperature spikes.',
          businessScenario: 'An industrial manufacturing facility monitors 10,000 smart sensors. Build a real-time anomaly engine that tracks rolling averages per sensor with watermarks.',
          deliverables: [
            'Streaming DataFrame query with a 10-minute watermark on sensor_timestamp',
            'Sliding window aggregation calculating rolling mean and standard deviation',
            'Reliable Delta Lake sink with checkpoint directory configuration'
          ],
          rubricItems: [
            {
              id: 'rubric-spark-2-1',
              criterion: 'Watermark & Window Logic',
              weightPercent: 50,
              guidance: 'Watermark properly configured; sliding window correctly computes rolling metrics without memory leaks.'
            },
            {
              id: 'rubric-spark-2-2',
              criterion: 'Checkpointing & Fault Recovery',
              weightPercent: 50,
              guidance: 'Checkpoint directory cleanly specified; job demonstrates zero duplicate records upon restart.'
            }
          ]
        }
      },
      {
        id: 'spark-tier-3',
        trackId: 'pyspark',
        tierNumber: 3,
        name: 'Mastery',
        description: 'Delta Lake ACID transactions, Time Travel, Vacuum, Liquid Clustering vs Z-Order, and Iceberg internals.',
        modules: [
          {
            id: 'spark-m301',
            tierId: 'spark-tier-3',
            trackId: 'pyspark',
            title: 'Delta Lake ACID Transactions, Time Travel, & Vacuum',
            order: 1,
            durationMinutes: 45,
            learnContent: {
              overview: 'Deconstruct the Delta Lake transaction log (_delta_log), optimistic concurrency control, and atomic time travel capabilities.',
              keyConcepts: [
                {
                  title: 'The Delta Log',
                  description: 'Delta stores changes as atomic JSON commit files. Every 10 commits, a checkpoint Parquet file is written to accelerate metadata reads.',
                  codeSnippet: 'df_historical = spark.read.format("delta").option("versionAsOf", 14).load("/path")'
                }
              ],
              seniorTip: 'Never disable retention duration safety checks when running VACUUM in production.',
              antiPattern: 'Manually deleting .parquet files via cloud CLI, breaking transaction log integrity.'
            },
            test: {
              id: 'test-spark-m301',
              title: 'Delta Lake ACID Assessment',
              description: 'Assess understanding of transaction log architecture and retention policies.',
              passingScore: 70,
              questions: [
                {
                  id: 'q-spark-301-1',
                  question: 'How does Delta Lake guarantee ACID transaction properties on top of cloud object storage?',
                  options: [
                    'Through an append-only JSON transaction log (_delta_log) with optimistic concurrency control and atomic commit protocol',
                    'By locking the entire cloud storage bucket',
                    'By running an external PostgreSQL database',
                    'By converting all files to CSV'
                  ],
                  correctIndex: 0,
                  explanation: 'Delta Lake uses an append-only transaction log and atomic file commits to provide serialized, ACID-compliant state.'
                }
              ]
            }
          }
        ],
        capstone: {
          id: 'spark-cap-t3',
          tierId: 'spark-tier-3',
          trackId: 'pyspark',
          title: 'Tier 3 Capstone: Multi-Petabyte Lakehouse Compaction & Incremental Silver-to-Gold Pipeline',
          description: 'Design and deploy an enterprise-grade lakehouse pipeline that ingests continuous change data into Delta Lake, performs atomic compaction with Liquid Clustering, and maintains consistency.',
          businessScenario: 'A fintech processes billions of transactions. Build an incremental pipeline applying CDC updates with MERGE and compacting small files.',
          deliverables: [
            'Idempotent Delta Lake MERGE pipeline processing CDC operations',
            'Liquid Clustering table configuration on CLUSTER BY (customer_id, event_time)',
            'Automated maintenance script scheduling incremental OPTIMIZE and VACUUM'
          ],
          rubricItems: [
            {
              id: 'rubric-spark-3-1',
              criterion: 'Atomic CDC MERGE Implementation',
              weightPercent: 50,
              guidance: 'MERGE query handles inserts, updates, and deletes cleanly; zero duplicate records on repeated execution.'
            },
            {
              id: 'rubric-spark-3-2',
              criterion: 'Clustering & File Skipping Efficiency',
              weightPercent: 50,
              guidance: 'Liquid clustering correctly configured; explain plan proves file-skipping on target predicates.'
            }
          ]
        }
      }
    ],
    placementDiagnostic: {
      title: 'PySpark & Lakehouses Placement Diagnostic Examination',
      description: 'Test out of Foundation or Applied tiers. Scoring ≥70% unlocks Applied; scoring ≥90% qualifies directly for Mastery.',
      qualifyAppliedScore: 70,
      qualifyMasteryScore: 90,
      questions: [
        {
          id: 'diag-spark-1',
          question: 'What is the role of the Spark Driver?',
          options: [
            'It runs the user main() program, creates the SparkSession, builds the DAG, and coordinates tasks with executors',
            'It executes CPU transformations only',
            'It stores all data files on disk',
            'It controls physical cluster cooling'
          ],
          correctIndex: 0,
          explanation: 'The Driver is the central coordinator of the Spark application, responsible for planning and distributing tasks.'
        }
      ]
    }
  },

  // 4. DATABRICKS & CLOUD STACK TRACK
  {
    id: 'databricks',
    slug: 'databricks',
    name: 'Databricks & Modern Cloud Stack',
    shortDesc: 'Unity Catalog governance, Delta Live Tables (DLT), Lakeflow declarative pipelines, and enterprise Medallion architectures.',
    iconName: 'Layers',
    accentColor: '#ec4899',
    tiers: [
      {
        id: 'db-tier-1',
        trackId: 'databricks',
        tierNumber: 1,
        name: 'Foundation',
        description: 'Databricks architecture, Unity Catalog 3-level namespace (Catalog.Schema.Table), and Workspaces.',
        modules: [
          {
            id: 'db-m101',
            tierId: 'db-tier-1',
            trackId: 'databricks',
            title: 'Databricks Architecture & Unity Catalog Fundamentals',
            order: 1,
            durationMinutes: 30,
            learnContent: {
              overview: 'Master the Control Plane vs Data Plane separation, compute clusters, and Unity Catalog 3-level namespace (catalog.schema.table).',
              keyConcepts: [
                {
                  title: 'Control Plane vs Data Plane',
                  description: 'The Control Plane manages the UI and orchestration. The Data Plane in your VPC runs the compute clusters and stores data.',
                  codeSnippet: 'SELECT * FROM prod_catalog.finance_schema.revenue_ledger;'
                }
              ],
              seniorTip: 'Always segregate environments at the Catalog level (dev, staging, prod) to enforce strict cross-environment boundaries.',
              antiPattern: 'Using legacy DBFS root (/FileStore) for sensitive production data.'
            },
            test: {
              id: 'test-db-m101',
              title: 'Unity Catalog Architecture Assessment',
              description: 'Assess understanding of Databricks planes, Unity Catalog namespace, and permission governance.',
              passingScore: 70,
              questions: [
                {
                  id: 'q-db-101-1',
                  question: 'What is the 3-level namespace structure introduced by Databricks Unity Catalog?',
                  options: ['catalog.schema.table', 'database.table.column', 'workspace.cluster.notebook', 'account.user.permission'],
                  correctIndex: 0,
                  explanation: 'Unity Catalog standardizes data discovery and governance across a 3-level hierarchy: catalog.schema.table.'
                }
              ]
            }
          }
        ],
        capstone: {
          id: 'db-cap-t1',
          tierId: 'db-tier-1',
          trackId: 'databricks',
          title: 'Tier 1 Capstone: Enterprise Data Catalog Setup with RBAC',
          description: 'Construct a multi-environment Unity Catalog hierarchy (dev, staging, prod) featuring role-based access control (RBAC).',
          businessScenario: 'A healthcare provider needs secure data governance in Databricks. Establish clean catalogs and schemas for Bronze/Silver/Gold.',
          deliverables: [
            'DDL scripts generating 3-level namespace structure: healthcare_prod.{bronze, silver, gold}',
            'Role-based access control policies granting USE CATALOG, USE SCHEMA, and SELECT'
          ],
          rubricItems: [
            {
              id: 'rubric-db-1-1',
              criterion: 'Catalog Hierarchy Design',
              weightPercent: 50,
              guidance: 'Catalogs and schemas cleanly separated across environments and Medallion tiers.'
            },
            {
              id: 'rubric-db-1-2',
              criterion: 'RBAC Permissions',
              weightPercent: 50,
              guidance: 'Permissions granted to groups; analysts restricted to Gold; engineers granted Silver/Bronze access.'
            }
          ]
        }
      },
      {
        id: 'db-tier-2',
        trackId: 'databricks',
        tierNumber: 2,
        name: 'Applied',
        description: 'Delta Live Tables (DLT), declarative pipelines, data quality expectations, and Databricks Workflows orchestration.',
        modules: [
          {
            id: 'db-m201',
            tierId: 'db-tier-2',
            trackId: 'databricks',
            title: 'Delta Live Tables (DLT) & Declarative Pipeline Engineering',
            order: 1,
            durationMinutes: 40,
            learnContent: {
              overview: 'Build declarative, self-managing ETL pipelines with Delta Live Tables using Python (@dlt.table) or SQL.',
              keyConcepts: [
                {
                  title: 'Declarative Pipeline Syntax',
                  description: 'Instead of manually orchestrating batches, declare WHAT target tables should look like; DLT automatically manages cluster dependencies.',
                  codeSnippet: '@dlt.table\ndef orders_silver():\n    return dlt.read_stream("orders_bronze").filter(F.col("status") == "COMPLETED")'
                }
              ],
              seniorTip: 'Always use Auto Loader (cloudFiles) inside DLT pipelines for incremental ingestion from cloud storage.',
              antiPattern: 'Manually managing checkpoints and triggers inside DLT code.'
            },
            test: {
              id: 'test-db-m201',
              title: 'Delta Live Tables Assessment',
              description: 'Evaluate mastery of declarative pipeline design and streaming live tables.',
              passingScore: 70,
              questions: [
                {
                  id: 'q-db-201-1',
                  question: 'What is the primary architectural difference between Delta Live Tables (DLT) and standard Spark scripts?',
                  options: [
                    'DLT is declarative: you define target datasets and expectations, and DLT builds the DAG and manages clusters automatically',
                    'DLT only runs on Windows laptops',
                    'DLT does not support Python',
                    'DLT requires manual checkpoint management'
                  ],
                  correctIndex: 0,
                  explanation: 'DLT provides a declarative framework where data engineers define dependencies and rules, while DLT automates infrastructure.'
                }
              ]
            }
          }
        ],
        capstone: {
          id: 'db-cap-t2',
          tierId: 'db-tier-2',
          trackId: 'databricks',
          title: 'Tier 2 Capstone: Automated Medallion ETL with DLT & Alerting',
          description: 'Construct a production DLT pipeline featuring Auto Loader ingestion, data quality expectations, and quarantine table isolation.',
          businessScenario: 'An e-commerce retailer ingests clickstream data from S3. Build a declarative DLT pipeline that filters bots and validates order totals.',
          deliverables: [
            'Auto Loader streaming ingestion from cloud storage with schema evolution enabled',
            'DLT pipeline script defining Silver tables with @dlt.expect_or_drop validation rules'
          ],
          rubricItems: [
            {
              id: 'rubric-db-2-1',
              criterion: 'Auto Loader Ingestion',
              weightPercent: 50,
              guidance: 'cloudFiles format used; schema rescue column configured.'
            },
            {
              id: 'rubric-db-2-2',
              criterion: 'Expectation Architecture',
              weightPercent: 50,
              guidance: 'Expectations defined cleanly; quarantine table preserves dropped rows.'
            }
          ]
        }
      },
      {
        id: 'db-tier-3',
        trackId: 'databricks',
        tierNumber: 3,
        name: 'Mastery',
        description: 'Lakeflow Declarative Pipelines, Unity Catalog fine-grained row/column governance, ABAC, and Serverless FinOps.',
        modules: [
          {
            id: 'db-m301',
            tierId: 'db-tier-3',
            trackId: 'databricks',
            title: 'Lakeflow Declarative Pipelines & Real-Time Ingestion',
            order: 1,
            durationMinutes: 45,
            learnContent: {
              overview: 'Explore Databricks Lakeflow: unified declarative data pipelines, connectors, and orchestrated execution.',
              keyConcepts: [
                {
                  title: 'Lakeflow Architecture',
                  description: 'Lakeflow combines managed CDC connectors, declarative pipelines, and workflow orchestration into a unified control plane.',
                  codeSnippet: 'CREATE OR REFRESH STREAMING TABLE silver_orders\nCLUSTER BY (order_date, customer_id)\nAS SELECT * FROM STREAM(bronze_orders);'
                }
              ],
              seniorTip: 'Leverage Lakeflow Connect for zero-code database CDC directly into Unity Catalog Bronze tables.',
              antiPattern: 'Building custom Python polling scripts to extract data from operational databases when Lakeflow connectors are available.'
            },
            test: {
              id: 'test-db-m301',
              title: 'Lakeflow Architecture Assessment',
              description: 'Evaluate understanding of Lakeflow pipelines and declarative streaming.',
              passingScore: 70,
              questions: [
                {
                  id: 'q-db-301-1',
                  question: 'What three core capabilities constitute the Databricks Lakeflow platform?',
                  options: [
                    'Lakeflow Connect (CDC ingestion), Lakeflow Pipelines (declarative DLT ETL), and Lakeflow Jobs (orchestration)',
                    'Storage, Networking, and Compute',
                    'Python, Java, and Scala compilers',
                    'CPU, RAM, and Disk'
                  ],
                  correctIndex: 0,
                  explanation: 'Lakeflow unifies native CDC ingestion, declarative pipeline transformation, and workflow management.'
                }
              ]
            }
          }
        ],
        capstone: {
          id: 'db-cap-t3',
          tierId: 'db-tier-3',
          trackId: 'databricks',
          title: 'Tier 3 Capstone: Build a Bronze→Silver→Gold Pipeline with Lakeflow, Expectations, & Unity Catalog',
          description: 'Construct an end-to-end production Bronze→Silver→Gold pipeline utilizing Lakeflow Declarative Pipelines, data quality expectations, dynamic PII column masks, and Unity Catalog table governance.',
          businessScenario: 'A global fintech enterprise requires a certified payment processing pipeline. Ingest raw transaction events into Bronze, clean and validate via Silver with DLT expectations and quarantine routing, aggregate financial metrics in Gold, and enforce ABAC masks on credit card and customer fields.',
          deliverables: [
            'Lakeflow / DLT pipeline script defining Bronze raw streaming ingestion with Auto Loader (cloudFiles)',
            'Silver transformation layer enforcing @dlt.expect_or_drop on non-negative balances and valid currencies',
            'Gold aggregated tables with Liquid Clustering (CLUSTER BY) for high-speed BI analytical queries',
            'Unity Catalog SQL Column Masking function protecting sensitive PII (credit cards/emails) based on group membership',
            'Comprehensive self-evaluation rubric covering architecture, governance, data quality, and idempotency'
          ],
          rubricItems: [
            {
              id: 'rubric-db-3-1',
              criterion: 'Lakeflow / DLT Medallion Architecture',
              weightPercent: 30,
              guidance: 'Bronze, Silver, and Gold layers declared cleanly; streaming data flows incrementally without full re-scans.'
            },
            {
              id: 'rubric-db-3-2',
              criterion: 'Data Quality Contracts & Quarantine',
              weightPercent: 25,
              guidance: 'Expectations protect Silver tables; invalid records routed to quarantine without aborting pipeline.'
            },
            {
              id: 'rubric-db-3-3',
              criterion: 'Fine-Grained Unity Catalog Governance',
              weightPercent: 25,
              guidance: 'Row filters and column masks defined using SQL UDFs; PII unmasked only for authorized compliance roles.'
            },
            {
              id: 'rubric-db-3-4',
              criterion: 'Performance Optimization & Clustering',
              weightPercent: 20,
              guidance: 'Gold tables leverage Liquid Clustering; explain plan proves file-skipping on dates and accounts.'
            }
          ]
        }
      }
    ],
    placementDiagnostic: {
      title: 'Databricks & Cloud Stack Placement Diagnostic Examination',
      description: 'Test out of Foundation or Applied tiers. Scoring ≥70% unlocks Applied; scoring ≥90% qualifies directly for Mastery.',
      qualifyAppliedScore: 70,
      qualifyMasteryScore: 90,
      questions: [
        {
          id: 'diag-db-1',
          question: 'What are the 3 tiers of the Unity Catalog namespace?',
          options: ['Catalog -> Schema -> Table / Volume', 'Account -> Workspace -> Cluster', 'Driver -> Executor -> Task', 'Database -> Collection -> Document'],
          correctIndex: 0,
          explanation: 'Unity Catalog structures assets into a 3-level catalog.schema.table namespace.'
        }
      ]
    }
  }
];
