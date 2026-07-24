import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const interviewEntriesTable = pgTable("interview_entries", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  topic: text("topic").notNull(),
  difficulty: text("difficulty").notNull().default("medium"),
  tags: text("tags").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertInterviewEntrySchema = createInsertSchema(interviewEntriesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertInterviewEntry = z.infer<typeof insertInterviewEntrySchema>;
export type InterviewEntry = typeof interviewEntriesTable.$inferSelect;
