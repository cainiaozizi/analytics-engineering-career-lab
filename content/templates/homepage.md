# Homepage Template

The homepage has two kinds of content:
1. **Hardcoded text** — edit `artifacts/analytics-career-lab/src/pages/home.tsx` directly
2. **Data-driven sections** — controlled by your project and post records

---

## Section 1 · Hero (edit home.tsx)

These two lines appear at the top of every visitor's first impression.
Keep the heading short. The subheading should answer "why does this site exist?"

```
HEADING:     Analytics Engineering Career Lab
SUBHEADING:  A working knowledge hub and public portfolio.
             Where engineering rigor meets intellectual curiosity.
```

**Where to edit:**
Open `artifacts/analytics-career-lab/src/pages/home.tsx`.
Find the hero section near the top — it's two hardcoded strings.

---

## Section 2 · Stats bar

Auto-generated from live data. No action needed.
Shows: total public projects · total posts · total notes · total interview entries.

---

## Section 3 · Featured Projects

Controlled by the `featured` flag on each project record.
Set `featured: true` on 2–4 projects. The homepage shows them in creation order.

**Which projects to feature:**
- Pick work that demonstrates breadth (e.g. one dbt project, one Python tool, one data viz)
- Prefer projects with a live URL or GitHub link — gives visitors somewhere to go
- Keep tech stacks varied so the badges aren't all the same

---

## Section 4 · Featured Writing

Auto-populated from your most recent public posts.
No special flag needed — just publish a post with `visibility: public`.

**Tip:** The homepage shows the title, date, and summary. Write a sharp summary —
it's the only copy a homepage visitor reads before deciding to click.

---

## Section 5 · Recent Notes

Auto-populated from your most recent notes (any visibility).
Since notes default to `private`, these only appear for you when logged in.
If you want notes to appear publicly on the homepage, set `visibility: public`.

---

## Homepage checklist before going live

- [ ] Hero heading and subheading reflect who you actually are
- [ ] At least 2 projects marked `featured: true`
- [ ] At least 1 published post (`visibility: public`) with a real summary
- [ ] Stats bar shows non-zero counts (seed data counts)
