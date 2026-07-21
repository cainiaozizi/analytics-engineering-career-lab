import { Router, type IRouter } from "express";
import { eq, and, desc, sql, count } from "drizzle-orm";
import { db, interviewEntriesTable } from "@workspace/db";
import {
  ListInterviewEntriesQueryParams,
  ListInterviewEntriesResponse,
  CreateInterviewEntryBody,
  CreateInterviewEntryResponse,
  GetInterviewEntryParams,
  GetInterviewEntryResponse,
  UpdateInterviewEntryParams,
  UpdateInterviewEntryBody,
  UpdateInterviewEntryResponse,
  DeleteInterviewEntryParams,
  ListInterviewTopicsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/interview/topics", async (req, res): Promise<void> => {
  const rows = await db
    .select({
      topic: interviewEntriesTable.topic,
      count: count(),
    })
    .from(interviewEntriesTable)
    .groupBy(interviewEntriesTable.topic)
    .orderBy(interviewEntriesTable.topic);

  res.json(ListInterviewTopicsResponse.parse(rows));
});

router.get("/interview", async (req, res): Promise<void> => {
  const query = ListInterviewEntriesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const conditions = [];
  if (query.data.topic) {
    conditions.push(eq(interviewEntriesTable.topic, query.data.topic));
  }
  if (query.data.difficulty) {
    conditions.push(eq(interviewEntriesTable.difficulty, query.data.difficulty));
  }

  const rows = await db
    .select()
    .from(interviewEntriesTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(interviewEntriesTable.topic, interviewEntriesTable.difficulty);

  res.json(ListInterviewEntriesResponse.parse(rows));
});

router.post("/interview", async (req, res): Promise<void> => {
  const parsed = CreateInterviewEntryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [entry] = await db.insert(interviewEntriesTable).values({
    ...parsed.data,
    tags: parsed.data.tags ?? [],
  }).returning();

  res.status(201).json(CreateInterviewEntryResponse.parse(entry));
});

router.get("/interview/:id", async (req, res): Promise<void> => {
  const params = GetInterviewEntryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [entry] = await db
    .select()
    .from(interviewEntriesTable)
    .where(eq(interviewEntriesTable.id, params.data.id));

  if (!entry) {
    res.status(404).json({ error: "Interview entry not found" });
    return;
  }

  res.json(GetInterviewEntryResponse.parse(entry));
});

router.patch("/interview/:id", async (req, res): Promise<void> => {
  const params = UpdateInterviewEntryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateInterviewEntryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [entry] = await db
    .update(interviewEntriesTable)
    .set(parsed.data)
    .where(eq(interviewEntriesTable.id, params.data.id))
    .returning();

  if (!entry) {
    res.status(404).json({ error: "Interview entry not found" });
    return;
  }

  res.json(UpdateInterviewEntryResponse.parse(entry));
});

router.delete("/interview/:id", async (req, res): Promise<void> => {
  const params = DeleteInterviewEntryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(interviewEntriesTable)
    .where(eq(interviewEntriesTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Interview entry not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
