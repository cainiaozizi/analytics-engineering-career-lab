// ─── Tag Taxonomy ─────────────────────────────────────────────────────────────
// Single source of truth for all content tags.
// Import TAXONOMY wherever you need the grouped list, TAG_SET for fast lookup.

export interface TagCategory {
  label: string;
  emoji: string;
  tags: string[];
}

export const TAXONOMY: TagCategory[] = [
  {
    label: "Business Domain",
    emoji: "💼",
    tags: [
      "Financial Reporting",
      "Payments",
      "Revenue",
      "Product Analytics",
      "Customer Analytics",
      "Marketing Analytics",
      "Cost Analytics",
      "Marketplace",
      "SaaS",
      "FinTech",
    ],
  },
  {
    label: "Engineering",
    emoji: "🏗",
    tags: [
      "Analytics Engineering",
      "Data Modeling",
      "Semantic Layer",
      "ELT",
      "Data Warehouse",
      "Dimensional Modeling",
      "ETL Migration",
    ],
  },
  {
    label: "Governance",
    emoji: "🛡",
    tags: [
      "Data Governance",
      "Data Quality",
      "dbt Testing",
      "Observability",
      "Lineage",
      "Documentation",
      "Audit",
      "SOX",
    ],
  },
  {
    label: "Technology",
    emoji: "⚙️",
    tags: [
      "dbt",
      "Snowflake",
      "BigQuery",
      "SQL",
      "Python",
      "Looker",
      "Tableau",
      "Airflow",
      "Fivetran",
    ],
  },
  {
    label: "Concepts",
    emoji: "🧠",
    tags: [
      "Reconciliation",
      "Feature Engineering",
      "Entity Resolution",
      "Account Hierarchy",
      "Slowly Changing Dimensions",
      "Event Modeling",
      "Time Series",
      "Metric Design",
      "Cost Attribution",
      "Revenue Recognition",
    ],
  },
];

/** Flat set of all canonical tag strings — use for validation or autocomplete filtering. */
export const TAG_SET = new Set(TAXONOMY.flatMap(c => c.tags));

/** All tags as a sorted flat array. */
export const ALL_TAGS = TAXONOMY.flatMap(c => c.tags);
