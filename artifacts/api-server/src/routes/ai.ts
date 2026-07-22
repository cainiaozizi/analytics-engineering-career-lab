import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

export const aiRouter = Router();

// POST /api/ai/format-body
// Sends raw body text (from PDF/DOCX extraction or manual entry) to GPT and
// returns clean, well-structured Markdown. Preserves meaning; only fixes
// formatting, structure, and clarity.
aiRouter.post("/format-body", async (req, res) => {
  const { body: rawBody, title, context } = req.body as {
    body: string;
    title?: string;
    context?: string; // "project" | "post" | "note"
  };

  if (!rawBody || typeof rawBody !== "string") {
    res.status(400).json({ error: "body is required" });
    return;
  }

  if (rawBody.trim().length < 10) {
    res.status(400).json({ error: "body is too short to format" });
    return;
  }

  const contentType = context ?? "project";
  const titleHint = title ? `The content is titled: "${title}".` : "";

  const systemPrompt = `You are a technical writing editor specialising in analytics engineering content.
Your job is to take raw text (often extracted from a PDF or Word document, or written quickly) and reformat it into clean, professional Markdown.

Rules:
- Preserve ALL meaning, facts, and technical detail — never remove or change information.
- Fix structure: use appropriate heading levels (## for sections, ### for sub-sections), bullet lists, numbered steps, and code fences where relevant.
- Fix broken line breaks from PDF extraction (words that were split across lines, run-on paragraphs, orphaned heading lines).
- Use **bold** for key terms, \`backticks\` for code/tool names/SQL keywords.
- Remove duplicate whitespace, page numbers, headers/footers that got pulled in from PDFs.
- Output ONLY the cleaned Markdown — no preamble, no explanation, no fences wrapping the entire output.`;

  const userPrompt = `${titleHint} This is a ${contentType} write-up. Please reformat the following text into clean Markdown:\n\n${rawBody}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5.6-luna",
    max_completion_tokens: 8192,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const formatted = response.choices[0]?.message?.content ?? rawBody;
  res.json({ body: formatted });
});
