# Analytics Engineering Career Lab

A personal knowledge hub and public portfolio for an Analytics Engineer. Serves two purposes: showcase selected engineering projects and technical writing as a public portfolio; and organize personal knowledge, interview preparation, and engineering notes.

## Run & Operate

- `pnpm --filter @workspace/analytics-career-lab run dev` — run the frontend (port auto-assigned)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Wouter (routing), TanStack Query, Tailwind CSS
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/analytics-career-lab/src/` — React frontend
- `artifacts/api-server/src/routes/` — API route handlers (projects, posts, notes, interview, homepage)
- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/db/src/schema/` — Drizzle table definitions (projects, posts, notes, interview_entries)
- `lib/api-client-react/src/generated/` — generated React Query hooks (do not hand-edit)
- `lib/api-zod/src/generated/` — generated Zod validation schemas (do not hand-edit)

## Architecture decisions

- **Visibility model**: Every content type (projects, posts, notes) has a `visibility` field (`public` | `private` | `draft`). No auth system is implemented yet — the field is data-only. Filtering by visibility happens at the API query layer.
- **Homepage aggregation endpoint**: `/api/homepage` returns featured projects, featured knowledge (posts), and recent notes in one call to minimize waterfall on the home page.
- **Search**: `/api/search?q=` does ILIKE across all four content types and returns a unified `SearchResult[]` with a `type` discriminator field.
- **Interview prep**: Organized by topic. `/api/interview/topics` returns topic + count aggregates used by the sidebar; `/api/interview?topic=X` filters entries.

## Product

- **Home** — intro, stats bar (live counts), search, featured projects, featured writing, recent notes
- **Projects** — portfolio of engineering projects with tech stack, links, visibility badges
- **Blog/Writing** — technical articles and long-form writing
- **Engineering Notes** — short-form notes organized by tag
- **Interview Prep** — Q&A organized by topic (SQL, dbt, BigQuery, Data Modeling, Analytics, Data Engineering)
- **About** — personal bio and contact

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After any OpenAPI spec change, run `pnpm --filter @workspace/api-spec run codegen` before using updated types.
- Do not add leaf workspace packages (artifacts, scripts) to the root `tsconfig.json` references.
- Use `req.log` (not `console.log`) in all Express route handlers.
- Express 5: wildcard routes need names (`/{*splat}`), `req.params.id` is `string | string[]` — always parse with `parseInt`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
