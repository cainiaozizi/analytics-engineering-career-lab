# Interview Entry Template

Copy this file for each question. Fill in every field.
Post via: Admin → Interview → New (or `POST /api/interview`).

Interview entries are organized by topic and difficulty.
They appear as an accordion on the Interview Prep page.

---

```
FIELD REFERENCE
───────────────────────────────────────────────────────────────────
question    Required. The interview question, written exactly as it
            would be asked. End with a question mark.

answer      Required. Your answer in Markdown. See structure below.

topic       Required. Determines the sidebar grouping. Use one of the
            established topics or create a new one consistently:

            SQL                — window functions, CTEs, query design
            Data Modeling      — dimensional modeling, normalization, SCDs
            dbt                — project structure, testing, macros
            BigQuery           — partitioning, clustering, cost, syntax
            Analytics          — metrics, experimentation, problem-solving
            Data Engineering   — pipelines, orchestration, schema evolution
            Python             — data manipulation, scripting, libraries
            Behavioral         — leadership, conflict, process questions

            Capitalization matters — "SQL" not "sql", "Data Modeling" not
            "data-modeling". Match exactly to keep the sidebar clean.

difficulty  easy | medium | hard

tags        Lowercase, hyphen-separated. 2–4 tags.
            Examples: window-functions, cte, scd, partitioning, testing
───────────────────────────────────────────────────────────────────
```

---

## Template

```
question:   [The exact interview question?]
topic:      [Topic — must match an existing topic or a new one you'll use consistently]
difficulty: [easy | medium | hard]
tags:       [tag1, tag2, tag3]
```

### Answer (Markdown)

Structure your answer for both quick scanning (in the accordion view)
and deep reading (in the full detail page).

```markdown
[Lead with your direct answer in 1–2 sentences. Don't bury the lede.]

[Expand with the reasoning, tradeoffs, or mechanism. Use specific examples.
Vague answers ("it depends") should always be followed by "...and here's
how I'd decide."]

**Example:**

[Concrete example — ideally something you've actually done. If not,
a realistic hypothetical with specific numbers or systems.]

```sql
-- include code where relevant
SELECT ...
```

**Gotcha / nuance:**

[Optional. What do most people get wrong? What's the non-obvious part?
This is what separates a "correct" answer from a strong one.]
```

---

## Difficulty calibration

| Level | What it means |
|-------|--------------|
| `easy` | You should answer this in 60 seconds without thinking. Foundational knowledge. Failure here is a red flag. |
| `medium` | Requires explanation and judgment. A good senior-level answer has nuance. |
| `hard` | Design questions, deep edge cases, or questions where the answer genuinely depends on context. Expected to have a structured framework, not a memorized answer. |

---

## Examples by topic

**SQL / easy:**
> "What is the difference between RANK(), DENSE_RANK(), and ROW_NUMBER()?"

**Data Modeling / medium:**
> "How would you model a subscription product with multiple plan tiers and plan changes over time?"

**dbt / medium:**
> "What's the difference between dbt tests and dbt assertions? When would you use each?"

**BigQuery / hard:**
> "A query that was running in 10 seconds is now taking 8 minutes. Walk me through how you'd diagnose it."

**Analytics / hard:**
> "Our key metric dropped 25% last week. Walk me through how you'd investigate."

**Behavioral / medium:**
> "Tell me about a time you had to push back on a stakeholder request. How did you handle it?"

---

## Checklist before saving

- [ ] Topic matches an existing topic exactly (check sidebar for spelling/capitalization)
- [ ] Difficulty is honest — calibrate against the table above
- [ ] Answer starts with the direct answer, not a preamble
- [ ] Any code is in a fenced code block with the correct language
- [ ] Tags are lowercase and hyphen-separated
