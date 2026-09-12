import { Question } from '../../types';

export const EXPLICIT_SQL_BEGINNER: Question[] = [
  {
    id: 'SQL-BEG-001',
    title: 'Select All Engineering Employees',
    source_book: 'Learning SQL (Alan Beaulieu)',
    difficulty: 'Beginner',
    category: 'Basic Retrieval',
    track: 'sql',
    company: 'Snowflake',
    xp: 50,
    prompt: 'Write a query that returns all columns for every employee in the Engineering department (department_id = 1).',
    init_ddl: `CREATE TABLE departments (department_id INTEGER PRIMARY KEY, department_name VARCHAR);
INSERT INTO departments VALUES (1,'Engineering'),(2,'Sales'),(3,'Marketing'),(4,'HR');

CREATE TABLE employees (employee_id INTEGER PRIMARY KEY, first_name VARCHAR, last_name VARCHAR, department_id INTEGER, salary DECIMAL(10,2), hire_date DATE, manager_id INTEGER);
INSERT INTO employees VALUES
(101,'Ava','Chen',1,95000,'2021-03-01',NULL),
(102,'Liam','Patel',1,82000,'2022-06-15',101),
(103,'Noah','Garcia',2,71000,'2020-01-10',NULL),
(104,'Emma','Wright',2,68000,'2023-02-20',103),
(105,'Olivia','Kim',3,73000,'2021-11-05',NULL),
(106,'Mateo','Silva',4,60000,'2022-09-01',NULL),
(107,'Sofia','Nguyen',1,99000,'2019-07-23',101);`,
    starter_code: `-- SQL-BEG-001: Select All Engineering Employees
-- Return all columns for employees in the Engineering department (department_id = 1).
SELECT 
  *
FROM employees
WHERE -- TODO: Filter by department_id
;`,
    solution_sql: `SELECT *
FROM employees
WHERE department_id = 1;`,
    test_cases: [
      { id: 1, description: 'Returns exactly 3 rows (Ava, Liam, Sofia)', check: 'row_count == 3' },
      { id: 2, description: 'All returned rows have department_id = 1', check: 'all(row.department_id == 1 for row in result)' }
    ],
    expected_output: [
      { employee_id: 101, first_name: 'Ava', last_name: 'Chen', department_id: 1, salary: 95000, hire_date: '2021-03-01', manager_id: null },
      { employee_id: 102, first_name: 'Liam', last_name: 'Patel', department_id: 1, salary: 82000, hire_date: '2022-06-15', manager_id: 101 },
      { employee_id: 107, first_name: 'Sofia', last_name: 'Nguyen', department_id: 1, salary: 99000, hire_date: '2019-07-23', manager_id: 101 }
    ],
    hints: [
      { tier: 1, title: 'Gentle Nudge', body: 'Start with SELECT * FROM employees.' },
      { tier: 2, title: 'Filtering Strategy', body: 'Add a WHERE clause filtering on department_id = 1.' },
      { tier: 3, title: 'Complete Solution', body: 'SELECT *\nFROM employees\nWHERE department_id = 1;' }
    ],
    interview_edge_case: 'Interviewers may ask why SELECT * is discouraged in production code (schema drift, wasted I/O, breaks downstream contracts) even though it is fine for ad-hoc exploration.',
    optimization_guide: {
      timeComplexity: 'O(N) sequential table scan or O(K) with B-tree index on department_id',
      spaceComplexity: 'O(K) result buffer',
      explainPlanNotes: 'Filter pushdown evaluates department_id = 1 before materializing row tuples.',
      productionPitfall: 'Using SELECT * causes silent schema contract breaks when upstream tables alter column orders.'
    }
  },
  {
    id: 'SQL-BEG-002',
    title: 'High Earners Filter',
    source_book: 'Learning SQL (Alan Beaulieu)',
    difficulty: 'Beginner',
    category: 'Filtering & Comparison Operators',
    track: 'sql',
    company: 'Netflix',
    xp: 50,
    prompt: 'Return the first_name, last_name, and salary of every employee earning strictly more than 70,000.',
    init_ddl: `CREATE TABLE departments (department_id INTEGER PRIMARY KEY, department_name VARCHAR);
INSERT INTO departments VALUES (1,'Engineering'),(2,'Sales'),(3,'Marketing'),(4,'HR');

CREATE TABLE employees (employee_id INTEGER PRIMARY KEY, first_name VARCHAR, last_name VARCHAR, department_id INTEGER, salary DECIMAL(10,2), hire_date DATE, manager_id INTEGER);
INSERT INTO employees VALUES
(101,'Ava','Chen',1,95000,'2021-03-01',NULL),
(102,'Liam','Patel',1,82000,'2022-06-15',101),
(103,'Noah','Garcia',2,71000,'2020-01-10',NULL),
(104,'Emma','Wright',2,68000,'2023-02-20',103),
(105,'Olivia','Kim',3,73000,'2021-11-05',NULL),
(106,'Mateo','Silva',4,60000,'2022-09-01',NULL),
(107,'Sofia','Nguyen',1,99000,'2019-07-23',101);`,
    starter_code: `-- SQL-BEG-002: High Earners Filter
-- Return first_name, last_name, and salary of employees earning strictly > 70,000.
SELECT 
  first_name,
  last_name,
  salary
FROM employees
WHERE -- TODO: strictly greater than 70000
;`,
    solution_sql: `SELECT first_name, last_name, salary
FROM employees
WHERE salary > 70000;`,
    test_cases: [
      { id: 1, description: 'Returns 5 rows (Ava, Liam, Noah, Olivia, Sofia)', check: 'row_count == 5' },
      { id: 2, description: 'Every returned salary is > 70000', check: 'all(row.salary > 70000 for row in result)' }
    ],
    expected_output: [
      { first_name: 'Ava', last_name: 'Chen', salary: 95000 },
      { first_name: 'Liam', last_name: 'Patel', salary: 82000 },
      { first_name: 'Noah', last_name: 'Garcia', salary: 71000 },
      { first_name: 'Olivia', last_name: 'Kim', salary: 73000 },
      { first_name: 'Sofia', last_name: 'Nguyen', salary: 99000 }
    ],
    hints: [
      { tier: 1, title: 'Gentle Nudge', body: 'Boundary matters: > excludes exactly 70000, >= would include it.' },
      { tier: 2, title: 'Column Projection', body: 'Only select the 3 requested columns (first_name, last_name, salary), not *.' },
      { tier: 3, title: 'Complete Solution', body: 'SELECT first_name, last_name, salary\nFROM employees\nWHERE salary > 70000;' }
    ],
    interview_edge_case: 'Ask candidates to distinguish > vs >= and to handle NULL salaries correctly — NULL > 70000 evaluates to NULL, not TRUE, so NULL rows are silently dropped in SQL three-valued logic.',
    optimization_guide: {
      timeComplexity: 'O(N) full scan or O(log N + K) with index range scan',
      spaceComplexity: 'O(1) projection',
      explainPlanNotes: 'Numeric comparison allows index seek on ordered numeric columns.',
      productionPitfall: 'Comparing strings formatted as currency ("$70,000") breaks lexicographical sorting. Always keep amounts in DECIMAL/NUMERIC.'
    }
  },
  {
    id: 'SQL-BEG-003',
    title: 'Rank Employees by Pay',
    source_book: 'Learning SQL (Alan Beaulieu)',
    difficulty: 'Beginner',
    category: 'Sorting',
    track: 'sql',
    company: 'Uber',
    xp: 50,
    prompt: "List all employees' first_name and salary, sorted from highest paid to lowest. If two employees tie on salary, break the tie alphabetically by first_name.",
    init_ddl: `CREATE TABLE employees (employee_id INTEGER PRIMARY KEY, first_name VARCHAR, department_id INTEGER, salary DECIMAL(10,2));
INSERT INTO employees VALUES
(101,'Ava',1,95000),(102,'Liam',1,82000),(103,'Noah',2,71000),(104,'Emma',2,68000),(105,'Olivia',3,73000),(106,'Mateo',4,60000),(107,'Sofia',1,99000);`,
    starter_code: `-- SQL-BEG-003: Rank Employees by Pay
-- List first_name and salary, sorted from highest paid to lowest, tie-breaker alphabetically.
SELECT 
  first_name,
  salary
FROM employees
ORDER BY -- TODO: salary DESC, first_name ASC
;`,
    solution_sql: `SELECT first_name, salary
FROM employees
ORDER BY salary DESC, first_name ASC;`,
    test_cases: [
      { id: 1, description: 'First row is Sofia (99000)', check: "result[0].first_name == 'Sofia'" },
      { id: 2, description: 'Last row is Mateo (60000)', check: "result[-1].first_name == 'Mateo'" }
    ],
    expected_output: [
      { first_name: 'Sofia', salary: 99000 },
      { first_name: 'Ava', salary: 95000 },
      { first_name: 'Liam', salary: 82000 },
      { first_name: 'Olivia', salary: 73000 },
      { first_name: 'Noah', salary: 71000 },
      { first_name: 'Emma', salary: 68000 },
      { first_name: 'Mateo', salary: 60000 }
    ],
    hints: [
      { tier: 1, title: 'Multi-column ORDER BY', body: 'ORDER BY accepts multiple columns as tie-breakers, evaluated left to right.' },
      { tier: 2, title: 'Direction Modifiers', body: 'DESC applies only to the column it immediately follows unless repeated explicitly.' },
      { tier: 3, title: 'Complete Solution', body: 'SELECT first_name, salary\nFROM employees\nORDER BY salary DESC, first_name ASC;' }
    ],
    interview_edge_case: 'Ask what happens if salary contains NULLs — most engines (Postgres, Snowflake) sort NULLs last by default with DESC, but this varies by engine (NULLS FIRST / NULLS LAST).',
    optimization_guide: {
      timeComplexity: 'O(N log N) in-memory top-N sort or O(N log K)',
      spaceComplexity: 'O(N) sort buffer',
      explainPlanNotes: 'Engines utilize an explicit Sort operator unless a composite index on (salary DESC, first_name ASC) exists.',
      productionPitfall: 'Sorting millions of rows without a LIMIT spills temp tables to disk.'
    }
  },
  {
    id: 'SQL-BEG-004',
    title: 'Average Salary per Department',
    source_book: 'Learning SQL (Alan Beaulieu)',
    difficulty: 'Beginner',
    category: 'Aggregation & GROUP BY',
    track: 'sql',
    company: 'Stripe',
    xp: 60,
    prompt: 'Return each department_id along with the average salary and headcount of employees in that department, rounded to 2 decimal places.',
    init_ddl: `CREATE TABLE employees (employee_id INTEGER PRIMARY KEY, first_name VARCHAR, department_id INTEGER, salary DECIMAL(10,2));
INSERT INTO employees VALUES
(101,'Ava',1,95000),(102,'Liam',1,82000),(103,'Noah',2,71000),(104,'Emma',2,68000),(105,'Olivia',3,73000),(106,'Mateo',4,60000),(107,'Sofia',1,99000);`,
    starter_code: `-- SQL-BEG-004: Average Salary per Department
-- Return department_id, avg_salary (ROUND 2 decimals), and headcount
SELECT 
  department_id,
  -- TODO: ROUND(AVG(salary), 2) AS avg_salary,
  -- TODO: COUNT(*) AS headcount
FROM employees
GROUP BY -- TODO: group by non-aggregated column
ORDER BY department_id;`,
    solution_sql: `SELECT department_id,
       ROUND(AVG(salary), 2) AS avg_salary,
       COUNT(*) AS headcount
FROM employees
GROUP BY department_id
ORDER BY department_id;`,
    test_cases: [
      { id: 1, description: '4 department groups returned', check: 'row_count == 4' },
      { id: 2, description: 'Department 1 avg_salary is 92000.00 with headcount 3', check: 'department 1 check' }
    ],
    expected_output: [
      { department_id: 1, avg_salary: 92000.00, headcount: 3 },
      { department_id: 2, avg_salary: 69500.00, headcount: 2 },
      { department_id: 3, avg_salary: 73000.00, headcount: 1 },
      { department_id: 4, avg_salary: 60000.00, headcount: 1 }
    ],
    hints: [
      { tier: 1, title: 'Grouping Rule', body: 'Every non-aggregated column in SELECT must appear in GROUP BY.' },
      { tier: 2, title: 'Count Semantics', body: 'COUNT(*) counts rows per group, not distinct employees specifically — same thing here since employee_id is unique.' },
      { tier: 3, title: 'Complete Solution', body: `SELECT department_id,\n       ROUND(AVG(salary), 2) AS avg_salary,\n       COUNT(*) AS headcount\nFROM employees\nGROUP BY department_id\nORDER BY department_id;` }
    ],
    interview_edge_case: 'Ask what changes if you use COUNT(salary) instead of COUNT(*) when salary can be NULL — COUNT(salary) skips NULLs, COUNT(*) does not.',
    optimization_guide: {
      timeComplexity: 'O(N) hash aggregation',
      spaceComplexity: 'O(G) hash table proportional to number of distinct groups',
      explainPlanNotes: 'HashAggregate builds hash map on department_id and computes running sum and count.',
      productionPitfall: 'High cardinality group-by keys (e.g. user UUIDs) cause HashAggregate memory blowouts.'
    }
  },
  {
    id: 'SQL-BEG-005',
    title: 'Employees with Department Names',
    source_book: 'Learning SQL (Alan Beaulieu)',
    difficulty: 'Beginner',
    category: 'Joins',
    track: 'sql',
    company: 'Amazon',
    xp: 60,
    prompt: "Write a query returning each employee's first_name alongside their department_name by joining the employees and departments tables.",
    init_ddl: `CREATE TABLE departments (department_id INTEGER PRIMARY KEY, department_name VARCHAR);
INSERT INTO departments VALUES (1,'Engineering'),(2,'Sales'),(3,'Marketing'),(4,'HR');

CREATE TABLE employees (employee_id INTEGER PRIMARY KEY, first_name VARCHAR, department_id INTEGER);
INSERT INTO employees VALUES
(101,'Ava',1),(102,'Liam',1),(103,'Noah',2),(104,'Emma',2),(105,'Olivia',3),(106,'Mateo',4),(107,'Sofia',1);`,
    starter_code: `-- SQL-BEG-005: Employees with Department Names
-- Return first_name and department_name by joining employees and departments
SELECT 
  e.first_name,
  d.department_name
FROM employees e
-- TODO: INNER JOIN departments d ON ...
ORDER BY e.first_name;`,
    solution_sql: `SELECT e.first_name, d.department_name
FROM employees e
INNER JOIN departments d
  ON e.department_id = d.department_id
ORDER BY e.first_name;`,
    test_cases: [
      { id: 1, description: 'Returns 7 rows, one per employee', check: 'row_count == 7' },
      { id: 2, description: 'Ava is paired with Engineering', check: "find(result, first_name='Ava').department_name == 'Engineering'" }
    ],
    expected_output: [
      { first_name: 'Ava', department_name: 'Engineering' },
      { first_name: 'Emma', department_name: 'Sales' },
      { first_name: 'Liam', department_name: 'Engineering' },
      { first_name: 'Mateo', department_name: 'HR' },
      { first_name: 'Noah', department_name: 'Sales' },
      { first_name: 'Olivia', department_name: 'Marketing' },
      { first_name: 'Sofia', department_name: 'Engineering' }
    ],
    hints: [
      { tier: 1, title: 'Aliasing', body: 'Alias both tables (e, d) to keep the ON clause and SELECT list concise and readable.' },
      { tier: 2, title: 'Inner Join Semantics', body: 'INNER JOIN drops employees whose department_id has no match — not an issue here since all IDs 1-4 exist in departments.' },
      { tier: 3, title: 'Complete Solution', body: `SELECT e.first_name, d.department_name\nFROM employees e\nINNER JOIN departments d\n  ON e.department_id = d.department_id\nORDER BY e.first_name;` }
    ],
    interview_edge_case: 'Ask what would happen if an employee had a NULL department_id, or a department_id not present in departments — INNER JOIN silently excludes that employee, which is why LEFT JOIN is often preferred for analytical reporting.',
    optimization_guide: {
      timeComplexity: 'O(N + M) hash join',
      spaceComplexity: 'O(M) where M is the smaller build table (departments)',
      explainPlanNotes: 'Planner builds hash table on small departments table and probes with employees.',
      productionPitfall: 'Accidentally joining on non-unique columns causes row multiplication / fan-out explosion.'
    }
  }
];
