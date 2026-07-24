import { Router, type IRouter } from "express";
import { eq, desc, sql, count, or, ilike } from "drizzle-orm";
import { db, projectsTable, postsTable, notesTable, interviewEntriesTable } from "@workspace/db";
import {
  GetHomepageDataResponse,
  GetStatsResponse,
  SearchContentResponse,
  SearchContentQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/homepage", async (_req, res): Promise<void> => {
  const [featuredProjects, featuredKnowledge, recentNotes] = await Promise.all([
    db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.featured, true))
      .orderBy(desc(projectsTable.createdAt))
      .limit(6),
    db
      .select()
      .from(postsTable)
      .where(eq(postsTable.visibility, "public"))
      .orderBy(desc(postsTable.createdAt))
      .limit(3),
    db
      .select()
      .from(notesTable)
      .orderBy(desc(notesTable.updatedAt))
      .limit(5),
  ]);

  res.json(GetHomepageDataResponse.parse({ featuredProjects, featuredKnowledge, recentNotes }));
});

router.get("/stats", async (_req, res): Promise<void> => {
  const [[publicProjects], [publicPosts], [totalNotes], [interviewEntries]] = await Promise.all([
    db.select({ count: count() }).from(projectsTable).where(eq(projectsTable.visibility, "public")),
    db.select({ count: count() }).from(postsTable).where(eq(postsTable.visibility, "public")),
    db.select({ count: count() }).from(notesTable),
    db.select({ count: count() }).from(interviewEntriesTable),
  ]);

  res.json(GetStatsResponse.parse({
    publicProjects: publicProjects?.count ?? 0,
    publicPosts: publicPosts?.count ?? 0,
    totalNotes: totalNotes?.count ?? 0,
    interviewEntries: interviewEntries?.count ?? 0,
  }));
});

router.get("/search", async (req, res): Promise<void> => {
  const query = SearchContentQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const q = `%${query.data.q}%`;

  const [projects, posts, notes, interviews] = await Promise.all([
    db
      .select()
      .from(projectsTable)
      .where(or(ilike(projectsTable.title, q), ilike(projectsTable.description, q)))
      .limit(5),
    db
      .select()
      .from(postsTable)
      .where(or(ilike(postsTable.title, q), ilike(postsTable.summary, q)))
      .limit(5),
    db
      .select()
      .from(notesTable)
      .where(or(ilike(notesTable.title, q), ilike(notesTable.body, q)))
      .limit(5),
    db
      .select()
      .from(interviewEntriesTable)
      .where(or(ilike(interviewEntriesTable.question, q), ilike(interviewEntriesTable.answer, q)))
      .limit(5),
  ]);

  const results = [
    ...projects.map(p => ({
      id: p.id,
      type: "project" as const,
      title: p.title,
      excerpt: p.description.slice(0, 150),
      tags: p.tags,
    })),
    ...posts.map(p => ({
      id: p.id,
      type: "post" as const,
      title: p.title,
      excerpt: p.summary.slice(0, 150),
      tags: p.tags,
    })),
    ...notes.map(n => ({
      id: n.id,
      type: "note" as const,
      title: n.title,
      excerpt: n.body.slice(0, 150),
      tags: n.tags,
    })),
    ...interviews.map(i => ({
      id: i.id,
      type: "interview" as const,
      title: i.question,
      excerpt: i.answer.slice(0, 150),
      tags: i.tags,
    })),
  ];

  res.json(SearchContentResponse.parse({ results, total: results.length }));
});

export default router;
