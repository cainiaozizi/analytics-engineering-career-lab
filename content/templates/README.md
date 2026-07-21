# Content Templates

Each file in this folder is a reusable template for one section of the site.
Fill in your details, then use the Admin panel (once built) or the API to
post the content.

| Template | Goes into | How to publish |
|---|---|---|
| `homepage.md` | `home.tsx` (hardcoded) + project `featured` flag | Edit the file directly for hero text; mark projects as `featured: true` in Admin |
| `project.md` | Projects — `POST /api/projects` | Admin → Projects → New |
| `post.md` | Engineering Writing — `POST /api/posts` | Admin → Posts → New |
| `interview-entry.md` | Interview Prep — `POST /api/interview` | Admin → Interview → New |
| `about.md` | `about.tsx` (hardcoded) | Edit the file directly |

## Field types quick reference

- `visibility`: `public` (anyone sees it) · `private` (hidden until auth is built) · `draft` (hidden everywhere)
- `featured`: `true` / `false` — only on projects; controls what shows on the homepage
- `tags`: comma-separated words, lowercase, hyphen-separated if multi-word (e.g. `dbt, data-modeling, sql`)
- `difficulty`: `easy` · `medium` · `hard` — only on interview entries
- `body`: full Markdown — headers, lists, code fences, bold, italics all work

## Workflow suggestion

1. Copy the relevant template
2. Fill in every field — use `draft` visibility until you're happy
3. When ready, change `visibility` to `public`
4. For the homepage hero and About page, edit the `.tsx` file directly (they're static)
