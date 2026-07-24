# Project Template

Copy this file for each project. Fill in every field.
Post via: Admin → Projects → New (or `POST /api/projects`).

---

```
FIELD REFERENCE
───────────────────────────────────────────────────────────────────
title          Required. Short and descriptive. No "My" prefix.
               Examples: "dbt Lineage Explorer" · "Metrics Audit CLI"

description    Required. One or two sentences. This is the card preview
               on the Projects list and the homepage. Write it as if
               someone is scanning a list — lead with what it does,
               not how it works.

visibility     public | private | draft
               Use "draft" while writing. Switch to "public" when done.

featured       true | false
               Set true for 2–4 of your best projects. These appear on
               the homepage.

tags           Lowercase, hyphen-separated. 2–5 tags.
               Examples: dbt, data-modeling, python, bigquery, cli-tool

techStack      The actual technologies used, proper-cased.
               Examples: Python, dbt, BigQuery, FastAPI, React, Airflow
               These appear as monospace badges on the project card.

githubUrl      Optional. Full URL: https://github.com/you/repo
liveUrl        Optional. Full URL: https://yourproject.com
───────────────────────────────────────────────────────────────────
```

---

## Template

```
title:       [Project Name]
description: [1–2 sentence summary for the card view. What does it do?
              Who is it for? What problem does it solve?]
visibility:  draft
featured:    false
tags:        [tag1, tag2, tag3]
techStack:   [Tool1, Tool2, Tool3]
githubUrl:   
liveUrl:     
```

### Body (Markdown)

The body is the full project write-up. It appears on the project detail page.
Use this structure — adapt sections as needed.

---

```markdown
## Overview

[2–4 sentences expanding on the description. What is the scope of this project?
What motivated it? What would someone use it for?]

## The Problem

[What gap or pain point does this address? Be specific.
"I kept having to manually..." or "There was no easy way to..."]

## How It Works

[High-level architecture or approach. Use a diagram if helpful.
What are the main components? How do they fit together?]

## Key Design Decisions

[2–4 decisions worth explaining. Format as a short list or sub-sections.
Examples: why you chose dbt over custom SQL, why FastAPI over Flask,
why you modeled the data this way.]

- **Decision**: [What you chose]  
  [Why — what alternatives did you consider and why you didn't pick them]

## What I Learned

[Honest reflection. What surprised you? What would you do differently?
This is where you show engineering judgment, not just execution.]

## Status

[Current state: in use, archived, actively maintained, proof of concept, etc.]
[Link to GitHub or live demo if applicable.]
```

---

## Examples of strong vs weak descriptions

**Weak:** "A tool I built to help with dbt projects."  
**Strong:** "An interactive DAG visualizer for dbt that maps model dependencies, test coverage, and documentation status — built to replace a spreadsheet we were maintaining by hand."

**Weak:** "Uses Python and FastAPI."  
**Strong:** "FastAPI backend serving a React graph canvas, with dbt artifacts parsed directly from `manifest.json`. No database — artifact-driven."

---

## Checklist before publishing

- [ ] Description works as a standalone sentence — no pronouns like "it" without antecedent
- [ ] Tech stack lists only what's actually used (not aspirational)
- [ ] GitHub URL is to the actual repo, not your profile
- [ ] Body has at least an Overview and one section of real content
- [ ] Featured is intentional — not just left as true or false by accident
