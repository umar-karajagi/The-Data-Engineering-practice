import { Question } from '../../types';

export const EXPLICIT_WAREHOUSING_BEGINNER: Question[] = [
  {
    id: 'DW-BEG-001',
    title: 'Define the Grain of a Sales Fact Table',
    source_book: 'The Data Warehouse Toolkit (Ralph Kimball)',
    difficulty: 'Beginner',
    category: 'Grain & Fact Tables',
    track: 'warehousing',
    company: 'Snowflake',
    xp: 60,
    prompt: "A retailer wants a fact table for sales transactions. State, in one sentence, what the 'grain' of this fact table should be, and list which columns would make each row unique.",
    scenario: 'Source data: point-of-sale line items, one row per product scanned per transaction, per store, per day.',
    solution_design: "Grain: 'one row per product sold, per line item, on a specific receipt.' Uniqueness columns: transaction_id + line_item_number (or transaction_id + product_id if a product never repeats within a receipt).",
    validation_checklist: [
      'The stated grain is declared in business terms (a sentence), not just a list of columns.',
      'Grain is at the lowest available level of detail (line item), not pre-aggregated (e.g. not "per day per store").',
      'The chosen uniqueness key actually produces one row per grain instance.'
    ],
    starter_code: `-- DW-BEG-001: Define the Grain of a Sales Fact Table
-- Scenario: Point-of-sale line items, one row per product scanned per transaction.

/*
Grain Statement:
  -- TODO: Write the single-sentence grain declaration in business terms

Uniqueness Columns:
  -- TODO: List primary key / uniqueness column(s)
*/`,
    solution_sql: `Grain: 'one row per product sold, per line item, on a specific receipt.'
Uniqueness columns: transaction_id + line_item_number (or transaction_id + product_id if a product never repeats within a receipt).`,
    hints: [
      { tier: 1, title: 'Kimball Golden Rule', body: "Kimball's rule: declare the grain before choosing dimensions or facts — everything else follows from it." },
      { tier: 2, title: 'Standard Phrasing', body: "'One row per X' is the standard phrasing for a grain statement." },
      { tier: 3, title: 'Complete Blueprint', body: `Grain: 'one row per product sold, per line item, on a specific receipt.'\nUniqueness columns: transaction_id + line_item_number` }
    ],
    interview_edge_case: "Ask what breaks if the grain is declared at 'per day' instead of 'per line item' — you lose the ability to analyze basket composition or individual product performance within a transaction, a common real-world mistake."
  },
  {
    id: 'DW-BEG-002',
    title: 'Design a Basic Retail Star Schema',
    source_book: 'The Data Warehouse Toolkit (Ralph Kimball)',
    difficulty: 'Beginner',
    category: 'Dimensional Modeling',
    track: 'warehousing',
    company: 'Amazon',
    xp: 70,
    prompt: 'Design a minimal star schema for retail sales: one fact table and two dimension tables (Product, Date). Write the CREATE TABLE DDL for all three.',
    scenario: 'Business needs: total sales quantity and revenue, sliceable by product and by date.',
    solution_design: `CREATE TABLE dim_product (product_key INT PRIMARY KEY, product_id VARCHAR, product_name VARCHAR, category VARCHAR);

CREATE TABLE dim_date (date_key INT PRIMARY KEY, full_date DATE, day_of_week VARCHAR, month INT, quarter INT, year INT);

CREATE TABLE fact_sales (sale_key BIGINT PRIMARY KEY, product_key INT REFERENCES dim_product, date_key INT REFERENCES dim_date, quantity INT, revenue DECIMAL(12,2));`,
    validation_checklist: [
      'fact_sales contains only foreign keys and additive numeric measures (quantity, revenue) — no descriptive text.',
      'Dimension tables use surrogate keys (product_key, date_key) rather than natural business keys as the join key.',
      'dim_date is a conformed calendar dimension, not just a raw DATE column on the fact table.'
    ],
    starter_code: `-- DW-BEG-002: Design a Basic Retail Star Schema
-- Write CREATE TABLE DDL for: dim_product, dim_date, and fact_sales

CREATE TABLE dim_product (
  -- TODO: surrogate key, natural key, product attributes
);

CREATE TABLE dim_date (
  -- TODO: conformed date dimension columns
);

CREATE TABLE fact_sales (
  -- TODO: surrogate PK, foreign keys to dimensions, additive numeric measures
);`,
    solution_sql: `CREATE TABLE dim_product (product_key INT PRIMARY KEY, product_id VARCHAR, product_name VARCHAR, category VARCHAR);

CREATE TABLE dim_date (date_key INT PRIMARY KEY, full_date DATE, day_of_week VARCHAR, month INT, quarter INT, year INT);

CREATE TABLE fact_sales (sale_key BIGINT PRIMARY KEY, product_key INT REFERENCES dim_product, date_key INT REFERENCES dim_date, quantity INT, revenue DECIMAL(12,2));`,
    hints: [
      { tier: 1, title: 'Star Topology', body: 'A star schema fans a central fact table out to denormalized dimension tables — no snowflaking at this stage.' },
      { tier: 2, title: 'Surrogate Keys', body: 'Surrogate keys (auto-incrementing integers) decouple the warehouse from source-system natural key changes.' },
      { tier: 3, title: 'Complete DDL Blueprint', body: `CREATE TABLE dim_product (product_key INT PRIMARY KEY, product_id VARCHAR, product_name VARCHAR, category VARCHAR);\n\nCREATE TABLE dim_date (date_key INT PRIMARY KEY, full_date DATE, day_of_week VARCHAR, month INT, quarter INT, year INT);\n\nCREATE TABLE fact_sales (sale_key BIGINT PRIMARY KEY, product_key INT REFERENCES dim_product, date_key INT REFERENCES dim_date, quantity INT, revenue DECIMAL(12,2));` }
    ],
    interview_edge_case: "Ask why a dedicated dim_date table is used instead of just storing a DATE column directly on fact_sales — it lets you pre-compute fiscal periods, holidays, and 'is_weekend' flags once, and join to them cheaply instead of recomputing date logic in every query."
  },
  {
    id: 'DW-BEG-003',
    title: 'SCD Type 1: Overwrite an Attribute',
    source_book: 'The Data Warehouse Toolkit (Ralph Kimball)',
    difficulty: 'Beginner',
    category: 'Slowly Changing Dimensions',
    track: 'warehousing',
    company: 'Databricks',
    xp: 60,
    prompt: "A customer's email address changes. Using SCD Type 1, write the SQL to update dim_customer so the change simply overwrites the old value, with no history kept.",
    scenario: "dim_customer(customer_key, customer_id, name, email). Customer 'C-500' changes email from old@example.com to new@example.com.",
    solution_design: `UPDATE dim_customer
SET email = 'new@example.com'
WHERE customer_id = 'C-500';`,
    validation_checklist: [
      'The update targets the natural key (customer_id), not the surrogate key, since it identifies the real-world customer.',
      'No new row is inserted — Type 1 is defined by having exactly one current row per customer, always.'
    ],
    starter_code: `-- DW-BEG-003: SCD Type 1: Overwrite an Attribute
-- Scenario: dim_customer(customer_key, customer_id, name, email).
-- Customer 'C-500' changes email to new@example.com with no history kept.

UPDATE dim_customer
SET -- TODO: update email attribute
WHERE -- TODO: target customer 'C-500'
;`,
    solution_sql: `UPDATE dim_customer
SET email = 'new@example.com'
WHERE customer_id = 'C-500';`,
    hints: [
      { tier: 1, title: 'SCD Types Distinction', body: 'Type 1 = overwrite, no history. Type 2 = insert a new row and preserve history — do not confuse the two.' },
      { tier: 2, title: 'Use Case', body: 'Type 1 is appropriate for corrections (e.g. fixing a typo) where the old value was simply erroneous.' },
      { tier: 3, title: 'Complete SQL', body: `UPDATE dim_customer\nSET email = 'new@example.com'\nWHERE customer_id = 'C-500';` }
    ],
    interview_edge_case: "Ask when Type 1 is the WRONG choice — e.g. tracking a customer's changing address for historical sales-territory reporting; overwriting it would misattribute all past sales to the customer's new address."
  },
  {
    id: 'DW-BEG-004',
    title: 'Fact vs Dimension: Classify the Columns',
    source_book: 'The Data Warehouse Toolkit (Ralph Kimball)',
    difficulty: 'Beginner',
    category: 'Fact vs Dimension Concepts',
    track: 'warehousing',
    company: 'Uber',
    xp: 60,
    prompt: 'Given the raw source columns: order_id, order_date, customer_name, customer_city, product_name, product_category, quantity_ordered, unit_price — classify each as belonging in a fact table or a dimension table, and name the dimension it belongs to where applicable.',
    scenario: 'A single flat source extract from an order-management system, to be modeled into a star schema.',
    solution_design: `Fact table (fact_orders): order_id (degenerate dimension), quantity_ordered, unit_price (measures).
Dim_customer: customer_name, customer_city.
Dim_product: product_name, product_category.
Dim_date: order_date -> date_key.`,
    validation_checklist: [
      'Numeric, additive business measures (quantity_ordered, unit_price or quantity*unit_price) are placed in the fact table.',
      'Descriptive, relatively static text attributes are placed in dimension tables, grouped by subject.',
      'order_id is correctly identified as a degenerate dimension (lives on the fact table but isn\'t a measure) rather than forced into its own dimension table.'
    ],
    starter_code: `-- DW-BEG-004: Fact vs Dimension: Classify the Columns
-- Raw columns: order_id, order_date, customer_name, customer_city, product_name, product_category, quantity_ordered, unit_price

/*
Fact Table (fact_orders):
  -- Degenerate Dimensions: TODO
  -- Numeric Measures: TODO

Dimension Tables:
  -- dim_customer: TODO
  -- dim_product: TODO
  -- dim_date: TODO
*/`,
    solution_sql: `Fact table (fact_orders): order_id (degenerate dimension), quantity_ordered, unit_price (measures).
Dim_customer: customer_name, customer_city.
Dim_product: product_name, product_category.
Dim_date: order_date -> date_key.`,
    hints: [
      { tier: 1, title: 'Classification Rule of Thumb', body: "A useful rule of thumb: if you'd GROUP BY it, it's a dimension attribute; if you'd SUM/AVG it, it's a fact measure." },
      { tier: 2, title: 'Degenerate Dimensions', body: "Degenerate dimensions are identifiers (like an order or invoice number) that have no other attributes worth a separate table." },
      { tier: 3, title: 'Complete Classification', body: `Fact table (fact_orders): order_id (degenerate dimension), quantity_ordered, unit_price (measures).\nDim_customer: customer_name, customer_city.\nDim_product: product_name, product_category.\nDim_date: order_date -> date_key.` }
    ],
    interview_edge_case: "Ask why unit_price is debatable — it could be treated as a fact (a measure of that specific transaction) or, less commonly, denormalized into dim_product as a 'current list price' attribute; the correct choice depends on whether historical price-at-time-of-sale matters for the business."
  },
  {
    id: 'DW-BEG-005',
    title: 'SCD Type 2: Track a Price Change with History',
    source_book: 'The Data Warehouse Toolkit (Ralph Kimball)',
    difficulty: 'Beginner',
    category: 'Slowly Changing Dimensions',
    track: 'warehousing',
    company: 'Databricks',
    xp: 75,
    prompt: "A product's list price increases. Using SCD Type 2, design the dim_product table structure needed to preserve history, and write the logic to expire the old row and insert the new one.",
    scenario: 'dim_product currently has one active row for product P-100 at price 49.99, which is changing to 59.99 effective today.',
    solution_design: `Table shape: dim_product(product_key SURROGATE PK, product_id, price, effective_date, expiration_date, is_current BOOLEAN).

Step 1 — expire the old row:
UPDATE dim_product
SET expiration_date = CURRENT_DATE - INTERVAL '1 day', is_current = FALSE
WHERE product_id = 'P-100' AND is_current = TRUE;

Step 2 — insert the new current row:
INSERT INTO dim_product (product_key, product_id, price, effective_date, expiration_date, is_current)
VALUES (NEXT_SURROGATE_KEY(), 'P-100', 59.99, CURRENT_DATE, NULL, TRUE);`,
    validation_checklist: [
      'The old row is never deleted or overwritten — only its expiration_date and is_current flag change.',
      'The new row gets a brand-new surrogate key, distinct from the old row\'s surrogate key.',
      'Fact rows already loaded against the old surrogate key continue to correctly report the historical 49.99 price.'
    ],
    starter_code: `-- DW-BEG-005: SCD Type 2: Track a Price Change with History
-- Step 1: Expire old active row for product P-100 (price 49.99)
-- Step 2: Insert new active row for product P-100 (price 59.99)

-- Step 1 — Expire old row:
UPDATE dim_product
SET -- TODO: set expiration_date and is_current
WHERE -- TODO: product_id = 'P-100' AND is_current = TRUE;

-- Step 2 — Insert new row:
INSERT INTO dim_product (product_key, product_id, price, effective_date, expiration_date, is_current)
VALUES (
  -- TODO: new surrogate key, natural key, new price, effective date, NULL expiration, is_current TRUE
);`,
    solution_sql: `UPDATE dim_product
SET expiration_date = CURRENT_DATE - INTERVAL '1 day', is_current = FALSE
WHERE product_id = 'P-100' AND is_current = TRUE;

INSERT INTO dim_product (product_key, product_id, price, effective_date, expiration_date, is_current)
VALUES (NEXT_SURROGATE_KEY(), 'P-100', 59.99, CURRENT_DATE, NULL, TRUE);`,
    hints: [
      { tier: 1, title: 'Key Attributes for Type 2', body: 'Type 2 always needs at least: effective_date, expiration_date (or NULL for current), and an is_current flag.' },
      { tier: 2, title: 'Delta Lake & Warehouse Automation', body: "This is exactly the pattern Delta Lake's MERGE INTO with WHEN MATCHED/WHEN NOT MATCHED automates in a single atomic statement." },
      { tier: 3, title: 'Complete SQL Execution', body: `UPDATE dim_product\nSET expiration_date = CURRENT_DATE - INTERVAL '1 day', is_current = FALSE\nWHERE product_id = 'P-100' AND is_current = TRUE;\n\nINSERT INTO dim_product (product_key, product_id, price, effective_date, expiration_date, is_current)\nVALUES (NEXT_SURROGATE_KEY(), 'P-100', 59.99, CURRENT_DATE, NULL, TRUE);` }
    ],
    interview_edge_case: 'Ask candidates to translate this into a single Delta Lake MERGE INTO statement — this is one of the most common Databricks interview questions and bridges directly into the SQL track\'s Advanced/Production tier.'
  }
];
