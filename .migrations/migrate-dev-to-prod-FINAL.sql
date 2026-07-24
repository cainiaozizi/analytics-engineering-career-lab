-- =====================================================================
-- One-time dev-to-prod content migration
-- =====================================================================
-- Generated from: pg_dump --data-only --column-inserts on dev DB
-- Effects:
--   * Replaces projects / posts / notes in prod with dev content.
--   * interview_entries is NOT touched (already matches 7 rows in both DBs).
--   * All metadata preserved byte-exact: title, summary, description, body,
--     tags, visibility, reading_time_minutes, github_url, live_url,
--     tech_stack, featured, image_url, cover_image, created_at, updated_at.
--   * All bodies are full markdown, no summaries, no placeholders.
-- Idempotency: BEGIN/COMMIT wraps everything so a run that errors mid-way
-- rolls back cleanly. Re-running has the same effect each time.
-- Source row counts and body byte lengths (verified at dump time):
--   projects id=5  body 8739 bytes  md5 image f2ba87e84c6ef995e9a7b469600d0b99
--   posts    id=4  body 3537 bytes
--   posts    id=5  body 10928 bytes
--   notes    id=7  body 5692 bytes
-- =====================================================================

BEGIN;

-- Replace all rows in projects/posts/notes.
-- RESTART IDENTITY resets the _id_seq sequences to 1; the matching
-- pg_catalog.setval() statements at the end push each sequence back to
-- MAX(id) so future auto-IDs do not collide.
-- CASCADE handles any (theoretical) FK-referencing tables; verified none
-- exist via information_schema.table_constraints in the public schema.
TRUNCATE TABLE public.projects, public.posts, public.notes RESTART IDENTITY CASCADE;

-- ===== INSERTs (verbatim pg_dump --column-inserts output) =====

INSERT INTO public.notes (id, title, body, tags, visibility, created_at, updated_at) VALUES (7, 'SQL LeetCode Practice Checklist', 'A topic-based SQL practice checklist for analytics and data interviews. Rather than solving problems randomly, use this list to practice one SQL pattern at a time and build pattern recognition.

---

## Topic Checklist
| Topic | Complete |
| --- | --- |
| Window Functions | |
| Rolling Windows | |
| Joins | |
| Date & Timestamp Logic | |
| NULL Logic | |
| Recursive CTEs | |
| Pivot & Unpivot | |
| Gaps & Islands | |

## Window Functions
Window functions are one of the most common SQL interview patterns. Focus on recognizing whether the problem requires **ranking, comparing adjacent rows, or calculating a running value**.

| Pattern | What to Know | Problems |
| --- | --- | --- |
| Ranking | `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `PERCENT_RANK()`, `QUALIFY` | #1596 · #1532 · #1308 |
| Cumulative Sum / Count | Running `SUM()` / `COUNT()` using `OVER()` | #2324 · #3586 |
| Rank + Aggregation | Combine ranking with `SUM()`, `COUNT()`, or other aggregations | #3055 · #1412 |
| LEAD / LAG | Compare the current row with the previous or next row | #626 · #1709 · #1454 |
---
## Rolling Windows
Rolling-window problems require calculating metrics over a moving set of rows or a period of time. The key decision is whether the window should be based on **calendar time (`RANGE`)** or **physical rows (`ROWS`)**.

| Pattern | What to Know | Problems |
| --- | --- | --- |
| Calendar-Based Window | `RANGE BETWEEN INTERVAL ''X DAY'' PRECEDING AND CURRENT ROW` | #1321 · #2854 |
| Row-Based Window | `ROWS BETWEEN X PRECEDING AND CURRENT ROW` | #1651 |
| Rolling Average / Sum | Combine window frames with `AVG()`, `SUM()`, or `COUNT()` | #1321 · #2854 · #1651 |
---
## Joins
Join problems test more than syntax. Pay attention to **cardinality, row multiplication, self-joins, and whether a relationship should be treated as directional or non-directional**.

| Pattern | What to Know | Problems |
| --- | --- | --- |
| Standard Joins | Inner, left, full joins and correct join keys | #3050 · #3182 |
| Self Join | Join a table back to itself to compare related records | #3278 |
| Pair Generation | Use `LEAST()` + `GREATEST()` to normalize unordered pairs | #3521 |
| Join + Window | Combine joins with ranking/window logic | #3586 |
---
## Date & Timestamp Logic
Date questions become much easier when you first identify the required grain: **hour, day, week, month, or reporting period**. Then determine whether you need to truncate, extract, shift, compare, or reformat the date.

| Pattern | What to Know | Problems |
| --- | --- | --- |
| Hour | Round up/down to an hour; calculate differences between timestamps | #3166 |
| Day | Date ± interval; rolling date filters such as previous 30 days | #615 · #3089 |
| Week | Custom week start; specific weekday; week of month | #3118 · #2993 |
| Month / Year | Filter by year-month; month-end and reporting-period logic | #2298 · #2394 |
| Dynamic Intervals | Assign dates to intervals; calculate dates relative to another date | #3124 · #3126 |
| Date Differences | `TIMESTAMPDIFF()`, `DATEDIFF()` | #3705 |
| Extract | `DATEPART()`, `EXTRACT()` | #3611 |
| Truncate / Format | `DATE_TRUNC()`, `DATE_FORMAT()`, `FORMAT()` | — |
| Type Conversion | `CAST()`, `CONVERT()`, string/integer → date or timestamp | — |
---
## NULL Logic
NULL questions test how missing values behave inside **filters, calculations, aggregations, and division**. Always think about what should happen when the value is missing rather than automatically replacing it.

| Pattern | What to Know | Problems |
| --- | --- | --- |
| Replace NULL | `COALESCE()`, `IFNULL()`, `ISNULL()` | #597 |
| Count NULL | Conditional `COUNT()` / `SUM()` | #619 |
| NULL in Aggregations | Behavior of `MAX()`, `MIN()`, `SUM()`, etc. | #2051 |
| Safe Division | Handle NULL or zero denominator; `DIV0()` where supported | — |
| Semi-Structured Data | Filter NULL values in JSON or arrays | — |
---
## Recursive CTEs
Recursive CTEs are useful when records have **parent-child relationships** and the number of hierarchy levels isn''t known in advance. Think in terms of an **anchor row followed by repeated traversal of the hierarchy**.

| Pattern | What to Know | Problems |
| --- | --- | --- |
| Anchor Member | Define the starting records | #1651 |
| Recursive Member | Join the previous iteration back to the source | #1651 |
| Hierarchy Traversal | Employee, account, or category hierarchies | #1651 |
---
## Pivot & Unpivot
Pivot problems reshape data between **long and wide formats**. In interviews, this may appear as explicit `PIVOT` / `UNPIVOT` syntax or conditional aggregation using `CASE WHEN`.

| Pattern | What to Know | Problems |
| --- | --- | --- |
| Pivot | Rows → columns | #3580 |
| Unpivot | Columns → rows | #3626 |
| Conditional Aggregation | `SUM(CASE WHEN ...)`, `MAX(CASE WHEN ...)` | #1127 |
| Pivot + Window | Combine reshaping with `LEAD()` / `LAG()` | #3580 · #3626 |
---
## Consecutive Days — Gaps & Islands
Gaps and Islands is the standard pattern for identifying **consecutive dates or sequences**. The core trick is to assign sequential row numbers and create a common anchor for records belonging to the same consecutive group.

| Step | Pattern | What to Know |
| --- | --- | --- |
| 1 | Deduplicate | Ensure one record per entity/date before creating the sequence |
| 2 | Sequence | Use `ROW_NUMBER()` rather than `RANK()` to guarantee sequential numbering |
| 3 | Create Island | Subtract the row number from the date to create a common anchor |
| 4 | Group | `GROUP BY` entity + anchor date |
| 5 | Measure | Count records within each island to determine streak length |

**Practice Problems:** #1454 · #603 · #1270 · #180 · #570 · #1811


', '{SQL,LeetCode}', 'public', '2026-07-23 23:49:07.314222+00', '2026-07-23 23:49:07.314222+00');
INSERT INTO public.posts (id, title, summary, body, tags, reading_time_minutes, visibility, created_at, updated_at, cover_image) VALUES (4, 'How to model an account hierarchy', 'Learn how to model parent-child relationships such as accounts, employees, and product categories, and when to choose between recursive queries and materialized hierarchies for performance.', 'Hierarchical relationships appear everywhere in analytics:

- Employee → Manager
- Account → Parent Account
- Product → Product Category
- Department → Parent Department

The modeling challenge is that each entity may have one immediate parent, while the hierarchy itself can extend across many levels.

## 1. Start with the Grain

One row represents one account-to-parent relationship for a given effective period.

| account_id | parent_account_id | effective_start_date | effective_end_date |
| --- | --- | --- | --- |
| A100 | A010 | 2026-01-01 | null |
| A010 | A001 | 2025-01-01 | null |
| A001 | null | 2024-01-01 | null |

This is an **adjacency-list model**: each account stores only its immediate parent.

## 2. Why Store Only the Immediate Parent?

The model remains simple and normalized.

For example:

```text
A100 → A010 → A001
```

We don''t need to store the `A100 → A001` relationship directly. It can be derived by traversing the hierarchy.

This creates an important tradeoff:

**Simple writes, more complex reads.**

## 3. Traverse the Hierarchy with a Recursive CTE

A recursive CTE has two parts:

1. **Anchor:** Identify the starting account.
2. **Recursive member:** Repeatedly join children to their parent until the hierarchy is exhausted.

```sql
WITH RECURSIVE
    -- This is the first CTE, which defines your employee data
    employee(employee_id, name, manager_id) AS (
        SELECT *
        FROM (
            VALUES
                (1, ''Daria Smith'', NULL),
                (2, ''Annika Patel'', 1),
                (3, ''Jingyi Chen'', 1),
                (4, ''Liam Murphy'', 2),
                (5, ''Mei Johnson'', 2),
                (6, ''Hiroshi Tanaka'', 4),
                (7, ''Fatima Ahmed'', 4),
                (8, ''David Garcia'', 3)
        )
    ),
    subordinates(employee_id, name) AS (
        -- Anchor member
        SELECT employee_id, name
        FROM employee
        WHERE manager_id = 2

        UNION ALL

        -- Recursive member
        SELECT em.employee_id, em.name
        FROM employee AS em
        JOIN subordinates AS sub
            ON em.manager_id = sub.employee_id
    )

SELECT *
FROM subordinates;
```

## 4. When Recursive Queries Become Expensive

For occasional hierarchy analysis, read-time recursion works well.

But if users constantly ask questions such as:

> “Show revenue for this account and every account beneath it.”

Recalculating the hierarchy for every query can become expensive.

At that point, consider materializing the hierarchy.

## 5. Materialized Hierarchy / Closure Table

Instead of storing only immediate relationships, store every ancestor-descendant relationship.

| ancestor_id | descendant_id | depth |
| --- | --- | --- |
| A001 | A001 | 0 |
| A001 | A010 | 1 |
| A001 | A100 | 2 |
| A010 | A010 | 0 |
| A010 | A100 | 1 |

Now hierarchy queries become simple filters instead of recursive traversals.

The tradeoff reverses:

**More complex writes, simpler and faster reads.**

## Design Decision

Use an adjacency-list model when:

- Hierarchies change frequently
- Recursive queries are relatively infrequent
- Simplicity matters

Consider a materialized hierarchy when:

- Hierarchy queries are frequent
- Reporting performance matters
- The hierarchy changes relatively slowly

## Key Takeaway

Hierarchy modeling is fundamentally a read-vs-write tradeoff.

Start by storing the immediate parent relationship. Add a materialized ancestor-descendant structure only when query patterns justify the additional storage and maintenance.', '{SQL,"Data Modeling"}', NULL, 'public', '2026-07-23 23:14:05.280343+00', '2026-07-23 23:35:54.744+00', NULL);
INSERT INTO public.posts (id, title, summary, body, tags, reading_time_minutes, visibility, created_at, updated_at, cover_image) VALUES (5, 'How to Design Bridge Tables', 'A practical guide to modeling complex many-to-many relationships, including relationship attributes, historical changes and hierarchical bridges.', 'Bridge tables are primarily used to model **many-to-many relationships**.

At the simplest level, a bridge table contains:

- Foreign keys connecting related entities
- Attributes that describe the relationship itself

As relationships become more complex, bridge tables can also support historical relationships, hierarchies, and relationships involving more than two entities.

---

## 1. Basic Bridge Table: Modeling Relationship Attributes

### Challenge

You''re designing a project management system.

A user can be a member of multiple projects. However, their role is specific to each project:

- A user might be a **Contributor** on Project A
- A **Viewer** on Project B
- An **Admin** on Project C

How should the model capture a user''s role for each project?

### Design Consideration

The `role` does not belong to the User table because one user can have different roles across projects.

It also does not belong to the Project table because one project can contain many users with different roles.

The role describes the **relationship between User and Project**, so it belongs on the bridge table.

### Solution

Create a `Project_Membership` bridge table.

**Users**

| Field | Description |
| --- | --- |
| `user_id` | Primary key |
| `user_name` | User name |

**Projects**

| Field | Description |
| --- | --- |
| `project_id` | Primary key |
| `project_name` | Project name |

**Roles**

| Field | Description |
| --- | --- |
| `role_id` | Primary key |
| `role_name` | Role name |
| `role_permission` | Associated permissions |

**Project_Membership**

| Field | Description |
| --- | --- |
| `user_id` | FK to User |
| `project_id` | FK to Project |
| `role_id` | FK to Role |
| `effective_start_date` | Relationship start |
| `effective_end_date` | Relationship end |
| `last_record` | Current-record indicator |

The grain is:

> **One user-project relationship per effective period.**

A possible primary key is:

`(user_id, project_id, effective_start_date)`

### Features

- Resolves the many-to-many relationship between Users and Projects
- Supports additional foreign keys such as `role_id`
- Stores attributes that describe the relationship itself
- Effective dates allow the relationship to change over time
- Historical relationships can be preserved instead of overwritten

### Key Takeaways

> A bridge table should contain the foreign keys connecting the entities and any attributes that describe the relationship itself.

When the relationship changes over time, include the effective period in the grain and primary key.

---

## 2. Hierarchical Bridge: Immediate Relationships

### Challenge

You''re building a media library with users and hierarchical content categories.

For example:

```text
Sci-Fi
└── Space Opera
    └── Starship Epics
```

A user can follow a category at any level.

Marketing needs to answer:

> "Find all users who follow Sci-Fi or any of its subcategories."

A basic bridge linking `user_id` to `category_id` only tells us what a user directly follows.

How should we handle the hierarchy?

### Design Consideration

One approach is to store only the **direct, immediate relationship**.

Consider the same idea using a family hierarchy:

```text
Mary → Sue → Dennis
```

If:

- Mary is Sue''s daughter
- Sue is Dennis''s daughter

we store those two immediate relationships.

We do not explicitly store:

```text
Mary → Dennis
```

Instead, Mary''s indirect relationship to Dennis is determined at query time using recursion.

### Solution

**User**

| Field |
| --- |
| `user_id` |
| `user_name` |
| `user_department` |

**Category**

| Field |
| --- |
| `category_id` |
| `category_name` |
| `immediate_parent_category_id` |

**User-Category Bridge**

| Field |
| --- |
| `bridge_id` |
| `user_id` |
| `immediate_category_id` |
| `effective_start_date` |
| `effective_end_date` |

The category table stores only its immediate parent:

```text
Starship Epics → Space Opera
Space Opera → Sci-Fi
Sci-Fi → NULL
```

When an indirect relationship is needed, a recursive query walks through the hierarchy.

### Features

- The bridge remains **normalized**
- Only direct, immediate relationships are stored
- Storage requirements remain relatively small
- Writes are straightforward
- Hierarchy changes are easier to maintain
- Reads across multiple hierarchy levels require recursive queries

### Key Takeaway

> **Simple writes, complex reads.**

This is a **read-time recursion model**. It works well when hierarchical queries are less frequent or when the underlying hierarchy changes regularly.

---

## 3. Hierarchical Bridge: The Explosion Method

### Challenge

Suppose hierarchical queries become extremely common.

Marketing repeatedly needs to answer:

> "Find all users who follow Sci-Fi or any of its subcategories."

Running recursive queries for every request adds complexity and can become inefficient at scale.

Can we make those reads simpler?

### Design Consideration

Instead of storing only immediate relationships, precompute both **direct and indirect relationships**.

Using the family hierarchy example:

```text
Mary → Mary → Level 0
Mary → Sue  → Level 1
Mary → Eliz → Level 2
Mary → Lucy → Level 3

Sue  → Eliz → Level 1
Sue  → Lucy → Level 2
```

Rather than discovering these relationships during every query, the hierarchy is expanded ahead of time and stored in the bridge.

### Solution

The hierarchical bridge can contain:

| Field | Description |
| --- | --- |
| `user_id` | Starting entity |
| `category_id` | Related category |
| `category_layer` | Distance within the hierarchy |
| `ultimate_relation_flag` | Identifies the ultimate relationship |
| `effective_start_date` | Relationship start |
| `effective_end_date` | Relationship end |

For example:

```text
user abc | category 01  | layer 1 | ultimate = false
user abc | category 23  | layer 2 | ultimate = false
user abc | category 555 | layer 3 | ultimate = true
```

### Features

- The bridge is **denormalized for performance**
- Direct and indirect relationships are stored as separate rows
- One original relationship may generate multiple bridge records
- Hierarchy traversal happens during data preparation rather than query time
- Reads require simple filtering instead of recursive traversal
- Storage requirements increase
- Writes and hierarchy maintenance become more complex

### Important Design Decision

Store all ancestor-descendant relationships in **one canonical direction**.

For example:

```text
ancestor → descendant
```

Avoid storing both:

```text
ancestor → descendant
descendant → ancestor
```

Storing both directions:

- Doubles the table size
- Increases maintenance complexity
- Creates additional risk of inconsistent relationships

Instead, store one canonical direction and handle the required direction in the query logic.

### Key Takeaway

> **Complex writes, simple reads.**

The explosion method trades additional storage and maintenance for faster and simpler hierarchy queries.

The choice between immediate relationships and the explosion method is fundamentally a **read-vs-write performance tradeoff**.

---

## 4. Multi-Way Bridge: Ternary Relationships

### Challenge

You''re building a university system.

A student enrolls in a course, which is taught by a specific professor during a particular semester.

At first, this might look like:

```text
Student ↔ Course
```

But the business needs to know:

> "Which professor taught which student in which course and when?"

A simple `Student_Course` bridge cannot fully represent the relationship.

### Design Consideration

This is a **multi-way relationship**.

The complete enrollment relationship depends on:

- Student
- Course
- Professor
- Semester

The relationship itself may also have attributes such as `enrollment_status` or `final_grade`.

### Solution

Create an Enrollment bridge containing foreign keys to all participating entities.

**Student**

```text
student_id
student_name
student_year
```

**Professor**

```text
professor_id
professor_name
professor_department
```

**Course**

```text
course_id
course_name
course_department
course_level
```

**Semester**

```text
semester_id
semester_start_date
semester_end_date
```

**Enrollment Bridge**

| Field | Description |
| --- | --- |
| `student_id` | FK to Student |
| `course_id` | FK to Course |
| `professor_id` | FK to Professor |
| `semester_id` | FK to Semester |
| `enrollment_status` | Relationship attribute |
| `final_grade` | Relationship attribute |

The grain is:

> **One student''s enrollment in one course, taught by one professor, during one semester.**

A possible composite primary key is:

```text
(student_id, course_id, professor_id, semester_id)
```

### Features

- A bridge can connect more than two entities
- Multiple foreign keys together define the relationship
- Attributes such as `final_grade` belong to the specific enrollment relationship
- The grain must include every entity required to uniquely identify the relationship
- The bridge can start to resemble a fact table as more business-process attributes are added

### Key Takeaway

> A bridge table doesn''t have to contain only two foreign keys.

For a multi-way relationship, identify **all entities required to uniquely define the relationship**, then establish the grain from those entities.

In dimensional modeling, a relationship like Enrollment may ultimately be modeled as a fact table because it represents a meaningful business process rather than simply a relationship.

---

## Bridge Table Design Framework

When designing a bridge table, start with the relationship rather than the table.

| Question | Why It Matters |
| --- | --- |
| **What entities are related?** | Establishes the relationship |
| **What is the cardinality?** | Determines whether a bridge is needed |
| **What is the grain?** | Defines what one row represents |
| **Does the relationship have attributes?** | Determines what belongs on the bridge |
| **Does it change over time?** | Determines whether effective dating is needed |
| **Is there a hierarchy?** | Introduces recursion vs. materialization decisions |
| **What are the query patterns?** | Drives normalization and performance tradeoffs |

---

## Final Takeaway

Bridge tables start with many-to-many relationships, but different business problems lead to different designs:

1. **Basic Bridge** — models a many-to-many relationship and its attributes.
2. **Immediate Hierarchical Bridge** — stores direct relationships and resolves indirect relationships at query time.
3. **Exploded Hierarchical Bridge** — precomputes indirect relationships to simplify and accelerate reads.
4. **Multi-Way Bridge** — represents relationships involving more than two entities.

The most important step is always the same:

> **Define the relationship and its grain first.**

From there, choose the simplest design that supports the required business questions and query patterns.', '{"Data Modeling",SQL}', 15, 'public', '2026-07-23 23:35:20.159472+00', '2026-07-23 23:36:25.524+00', NULL);


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.projects (id, title, description, body, tags, github_url, live_url, tech_stack, visibility, featured, created_at, updated_at, image_url) VALUES (5, 'Financial Transaction Reconciliation Platform', 'This project outlines the proposed daily merchant settlement reconciliation architecture, including key business logic, data model design, controls framework, and phased delivery plan.', '## Background

A growing financial services company processes payment transactions across multiple operational systems. Finance relies on reconciliations between operational settlements and General Ledger (GL) postings to ensure financial reporting accuracy. Historically, these workflows depended on manual SQL queries and spreadsheets, creating operational risk and slowing the financial close.

## Business Challenge

- Manual reconciliation requiring multiple SQL queries
- Inconsistent business logic across teams
- Spreadsheet-based workflows
- Limited testing and governance
- Difficult audit traceability

## Existing Data Landscape

| System | Purpose |
|---|---|
| Payment Platform | Settlement transactions |
| ERP / General Ledger | Financial postings |
| Merchant Master | Merchant attributes |
| FX Rates | Currency conversion |

## Introduction

Section one summarizes the layered `dbt` model structure—staging, intermediate, and mart—and the core transformations supporting the reconciliation. Section two details the testing strategy, governance controls, and implementation roadmap through production deployment.

![Screenshot 2026-07-22 at 11.03.34 AM](/api/storage/objects/uploads/29ecfb5c-b514-4cb6-81fb-a039c9418069)

## Section One — Data Model Design

### Layer I — Staging

**Purpose:** Organized by source systems, such as settlements, NetSuite, and CRM, this layer standardizes raw data into clean, analytics-ready tables without introducing business logic. Normalization exercises include renaming, type casting, and simple categorizations, with no joins or aggregations.

#### `stg_settlement_events`

- **Source:** `payments_db.settlement_events`
- **Grain:** `settlement_id`
- Standardize schema and data types.
- Cast timestamps to date in UTC.
- Add validation field: `calculated_net_amount`
  - Formula: `gross_amount - fee_amount`

#### `stg_netsuite_journal_entries`

- **Source:** `netsuite.journal_entries`
- **Grain:** `journal_entry_id`
- Add validation field to normalize sign:
  - `calculated_net_credit = credit_amount - debit_amount`

#### `stg_crm_merchants`

- **Source:** `crm.merchants`
- **Grain:** `merchant_id`
- Normalize `merchant_legal_entity` and `merchant_country`.
- Derive the `is_active` flag based on `onboarded_at`.

### Layer II — Intermediate

**Purpose:** This layer creates conformed business entities and reconciliation-ready grains, such as merchant-day and entity-day, while ensuring that models are reusable across multiple downstream marts. Intermediate models also centralize conformed business logic, such as reversal treatment and USD conversion, and establish governed bridges, such as legal entity mapping, to normalize cross-system taxonomy differences.

#### `int_daily_settlements`

- **Grain:** `merchant_id` + `settlement_date` + `currency`
- Flag reversal transactions using status or negative `net_amount`.
- Provide a movement breakdown:
  - Base settlement + reversal = total settlement
- Perform currency conversion using effective-dated FX rates.
- Create audit support fields:
  - `settlement_count`
  - `reversal_count`

#### `int_daily_gl_merchant_payable`

- **Grain:** `legal_entity` + `gl_posting_date`
- Filter to `gl_account = 2100`.
- Apply the legal entity mapping bridge with `int_gl_entity_to_reporting_entity_bridge` if needed.
- Normalize signs by computing a single signed measure:
  - Credit − debit
- Create audit support fields:
  - `total_credit_amount`
  - `total_debit_amount`
  - `journal_entry_count`

### Layer III — Mart

**Purpose:** The mart serves as the single source of truth for daily merchant settlement reconciliation. Its output includes totals, variance, and a simple status flag for accounting review and audit sampling.

#### `fct_merchant_settlement_reconciliation`

- **Grain:** `legal_entity` + `reconciliation_date`
- Perform a full outer join between settlements and GL based on `legal_entity` and `reconciliation_date`.
- Calculate variance:
  - `variance_amount_usd = total_settled_net_amount_usd - total_gl_credit_amount_usd`
- Classify status as:
  - `MATCHED`
  - `VARIANCE`
  - `TIMING_DIFFERENCE`
- Use a parameterized tolerance threshold, such as `$1` or `$5`, to avoid false positives.
- Include audit sampling fields by carrying the settlement breakdown—base, reversal, and total—along with:
  - `settlement_count`
  - `reversal_count`
  - `journal_entry_count`
- Preserve fields for traceability and drill-down.

### Supporting Models

#### `dim_currency_rates`

Provides governed, effective-dated FX rates to standardize multi-currency transactions into functional currency (USD) for reconciliation and financial reporting.

#### `int_gl_to_reporting_entity_bridge`

Normalizes NetSuite `legal_entity` values to a conformed reporting `legal_entity` to ensure consistent, entity-level reconciliation across systems.

## Edge Cases Handling & Risk Controls

### Timing Differences: Settlement Date vs. GL Posting Date

- `settlement_date` may differ from the NetSuite `gl_posting_date` due to batch timing, weekends, or processing cutoffs.
- Timestamps are standardized to UTC in staging.
- Reconciliation is performed at the `legal_entity` + date grain.
- In the mart model, short-term variances may be classified as `TIMING_DIFFERENCE` rather than true breaks.
- Both operational and GL dates are preserved for audit traceability.

### Reversals and Corrections

- Reversals are treated as additive events; there are no overwrites, and full history is preserved.
- The intermediate layer separates base and reversal movements for transparency.
- Final net amounts include reversals for reconciliation.
- If reversals post on different GL dates, resulting variances are surfaced and may be timing-related.

### Multi-Currency

- Currency is retained at the intermediate grain:
  - `merchant_id` + date + `currency`
- USD conversion is performed using governed, effective-dated FX rates.
- Reconciliation is executed in USD, the functional currency.
- Original currency values are preserved for drill-down and audit support.

### Legal Entity Mapping

- `legal_entity` in NetSuite may not perfectly align with the CRM reporting taxonomy.
- A seed file, followed by a bridge table at the intermediate layer, is maintained to handle the hard coding exercises.

## Section Two — Controls & Delivery Plan

### Testing Strategy

Data quality controls are implemented across layers to prevent financial misstatement and logic drift. Staging enforces arithmetic integrity and source freshness. Intermediate models enforce grain stability and settlement component balance. The mart validates reconciliation math and entity-day uniqueness. A deterministic golden dataset supports regression testing aligned with audit sampling scenarios.

### Key `dbt` Tests

1. **Source freshness test — staging:** Ensure settlements and GL data are complete before reconciliation runs.
2. **Settlement arithmetic integrity — staging:** Assert `net_amount = gross_amount - fee_amount` within tolerance.
3. **Grain uniqueness — intermediate:** For example, ensure `merchant_settlement_daily_pk` is unique and not null.
4. **Settlement component balance — intermediate:** For example, ensure total settlement net amount equals base plus reversal.
5. **Reconciliation variance formula — mart:** Ensure `variance_amount_usd = settlements - GL`.

### Implementation Roadmap

| Phase | Focus | Success Criteria | Risk |
| --- | --- | --- | --- |
| **Week 1** | Scope requirements, document edge cases, validate source data | Reconciliation logic approved | Ambiguous business definitions |
| **Weeks 2–3** | Build dbt models, implement tests, complete code review | CI passing, UAT-ready models | Insufficient test coverage |
| **Week 4** | Finance UAT, production deployment, enable monitoring | Finance sign-off, production release | Late UAT findings |
 
## Appendix — `dbt` Folder Structure

```text
models/
├── raw/
│   └── schema.yml
│       -- Source definitions (ingestion owned by upstream engineering)
├── staging/
│   ├── payments_db/
│   │   -- Folder structured based on data governance topics
│   ├── netsuite/
│   ├── crm/
│   └── schema.yml
├── intermediate/
│   ├── merchant_settlement_recon/
│   │   -- Folder structured based on business-specific topic
│   ├── int_daily_settlements
│   ├── int_daily_gl_merchant_payable
│   ├── int_gl_to_reporting_entity_bridge
│   │   -- Exception case handling
│   └── schema.yml
├── marts/
│   ├── reconciliation/
│   │   -- Folder structured based on business-specific topic
│   ├── fct_merchant_settlement_reconciliation
│   └── exposures.yml
├── monthly_closing/
├── board_reporting/
└── utility/
    ├── dim_date.sql
    ├── dim_currency_rates.sql
    └── schema.yml
```', '{Payments,"Financial Reporting","Data Modeling","Data Governance","dbt Testing",Reconciliation}', NULL, NULL, '{dbt,sql,snowflake}', 'public', true, '2026-07-22 18:23:40.862108+00', '2026-07-22 21:37:57.291+00', '/objects/uploads/29ecfb5c-b514-4cb6-81fb-a039c9418069');
SELECT pg_catalog.setval('public.notes_id_seq', 7, true);
SELECT pg_catalog.setval('public.posts_id_seq', 5, true);
SELECT pg_catalog.setval('public.projects_id_seq', 5, true);

-- ===== Resulting state =====

-- After this migration succeeds:
--   projects:           1 row   (id=5)
--   posts:              2 rows  (id=4, id=5)
--   notes:              1 row   (id=7)
--   interview_entries:  unchanged (7 rows; already matches dev)
--
--   projects_id_seq:    next value 6   (sequence reset to 5)
--   posts_id_seq:       next value 6   (sequence reset to 5)
--   notes_id_seq:       next value 8   (sequence reset to 7)

COMMIT;

-- ============================================================================
-- READ-ONLY VERIFICATION (run after the migration above succeeds)
-- ============================================================================
-- IMPORTANT: these queries DO NOT modify the sequence — only the setval()
-- calls above did that. Read sequence state with last_value/is_called.
--
-- Expected last_value after migration:
--   projects_id_seq.last_value = 5   (is_called = true)
--   posts_id_seq.last_value    = 5   (is_called = true)
--   notes_id_seq.last_value    = 7   (is_called = true)
-- nextval in some tools: projects=6, posts=6, notes=8 (last_value + 1 when is_called).
-- ============================================================================

-- ----- Row counts -----
SELECT count(*) AS projects           FROM public.projects;          -- expect 1
SELECT count(*) AS posts              FROM public.posts;             -- expect 2
SELECT count(*) AS notes              FROM public.notes;             -- expect 1
SELECT count(*) AS interview_entries  FROM public.interview_entries; -- expect 7 (unchanged)

-- ----- Expected titles + ids -----
SELECT id, title FROM public.projects ORDER BY id;
SELECT id, LEFT(title, 70) AS title_prefix FROM public.posts    ORDER BY id;
SELECT id, LEFT(title, 70) AS title_prefix FROM public.notes    ORDER BY id;

-- ----- Sequence introspection (read-only; does NOT call setval) -----
SELECT last_value, is_called FROM public.projects_id_seq;  -- expect last_value=5, is_called=true
SELECT last_value, is_called FROM public.posts_id_seq;     -- expect last_value=5, is_called=true
SELECT last_value, is_called FROM public.notes_id_seq;     -- expect last_value=7, is_called=true
