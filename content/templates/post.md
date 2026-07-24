# Engineering Writing Template

Copy this file for each post. Fill in every field.
Post via: Admin → Posts → New (or `POST /api/posts`).

The "Engineering Writing" section is for technical articles, deep-dives,
opinions, and explainers. It is not a personal blog — keep it technical.

---

```
FIELD REFERENCE
───────────────────────────────────────────────────────────────────
title      Required. Clear and specific. Avoid clickbait.
           Good: "Why I Stopped Using dbt Seeds for Reference Data"
           Bad:  "A Surprising Thing About dbt"

summary    Required. 2–3 sentences. Appears on the homepage and post list.
           Write it last — it should distill the main argument or finding.
           Treat it like an abstract: what is the piece about, and why does
           it matter to the reader?

visibility public | private | draft
           Use "draft" while writing. "private" is useful for notes-to-self
           that you don't want published but want to keep.

tags       Lowercase, hyphen-separated. 2–5 tags.
           Examples: dbt, sql, data-modeling, bigquery, airflow, opinions
───────────────────────────────────────────────────────────────────
```

---

## Template

```
title:      [Article Title]
summary:    [2–3 sentence abstract. What is this about? What will the reader
             take away? Write this after you finish the body.]
visibility: draft
tags:       [tag1, tag2, tag3]
```

### Body (Markdown)

The body is the full article. No length limit. Use proper Markdown.
The suggested structure below covers most technical writing formats —
use what fits, skip what doesn't.

---

```markdown
## The Setup

[Context. What is the situation or problem space you're addressing?
1–3 paragraphs. Assume a reader who is technical but not already an expert
in this exact area.]

## The Problem (or Argument, or Finding)

[State clearly what you're going to show, argue, or explain.
One paragraph. No hedging — say the thing.]

## [Main Section Title]

[Your primary content. This might be:
- A step-by-step walkthrough
- A comparison of two approaches
- An explanation of a concept with examples
- A post-mortem on something that went wrong

Use sub-headers to break up long sections. Use code blocks for SQL, Python, YAML.]

```sql
-- example code block
SELECT
    order_id,
    SUM(revenue) AS total_revenue
FROM orders
GROUP BY 1
```

## [Second Section if Needed]

[Continue the argument or walkthrough.]

## What I'd Do Differently

[Optional but strong. Engineering writing that shows judgment is more valuable
than writing that just shows execution. What tradeoffs did you make? What
would change with more time or a different constraint?]

## Key Takeaways

[Optional for longer pieces. 3–5 bullets summarizing the main points.
Don't just repeat the headers — synthesize.]

- [Takeaway 1]
- [Takeaway 2]
- [Takeaway 3]
```

---

## Post formats

| Format | Use when | Length |
|--------|----------|--------|
| Deep dive | You want to explain a concept end-to-end | 800–2000 words |
| Decision record | You made a non-obvious technical choice | 400–800 words |
| TIL / gotcha | You discovered something surprising | 200–500 words |
| How-to | Step-by-step guide for a specific task | 600–1200 words |
| Opinion | You have a take worth defending | 500–1000 words |

---

## Checklist before publishing

- [ ] Title is specific enough that a reader knows if it's for them
- [ ] Summary can stand alone — someone reading only the summary gets the point
- [ ] Code blocks have the correct language annotation (` ```sql `, ` ```python `, etc.)
- [ ] You've answered "so what?" — why should the reader care?
- [ ] Tags are accurate and lowercase
