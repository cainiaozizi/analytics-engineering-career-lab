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
    label: "Analytics Engineering",
    emoji: "🏗",
    tags: [
      "Data Modeling",
      "Semantic Layer",
      "Data Warehouse",
      "ELT",
      "Data Governance",
      "Data Quality",
      "Metric Design",
      "Dimensional Modeling",
    ],
  },
  {
    label: "Technology",
    emoji: "⚙️",
    tags: [
      "SQL",
      "Python",
      "dbt",
      "Snowflake",
      "BigQuery",
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
      "Revenue Recognition",
      "Cost Attribution",
      "Event Modeling",
      "Entity Resolution",
      "Slowly Changing Dimensions",
      "Account Hierarchy",
      "Time Series",
    ],
  },
  {
    label: "Interview Prep",
    emoji: "🎯",
    tags: [
      "SQL",
      "Python",
      "System Design",
      "Behavioral",
      "Case Study",
      "Coding Challenge",
      "LeetCode",
      "Architecture",
    ],
  },
];

/** Flat set of all canonical tag strings — use for validation or autocomplete filtering. */
export const TAG_SET = new Set(TAXONOMY.flatMap((c) => c.tags));

/** All tags as a sorted flat array. */
export const ALL_TAGS = TAXONOMY.flatMap((c) => c.tags);
