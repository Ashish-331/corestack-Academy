import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { lessons, modules, quizQuestions } from "@/db/schema";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { sanitizeLessonHtml } from "@/lib/sanitize";

const quizInput = z.object({
  q: z.string().trim().min(3).max(600),
  options: z.array(z.string().trim().min(1).max(300)).min(2).max(6),
  answer: z.number().int().min(0).max(5),
  explain: z.string().trim().max(1200).default(""),
});

const schema = z.object({
  moduleId: z.number().int().positive(),
  title: z.string().trim().min(2).max(200),
  summary: z.string().trim().max(400).default(""),
  minutes: z.number().int().min(1).max(600).default(15),
  kind: z.enum(["reading", "lab", "case", "quiz"]).default("reading"),
  contentHtml: z.string().max(200000).default(""),
  draft: z.boolean().default(false),
  quizzes: z.array(quizInput).max(20).default([]),
});

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = schema.parse(await request.json());
    const [mod] = await db.select({ id: modules.id, courseId: modules.courseId }).from(modules).where(eq(modules.id, body.moduleId)).limit(1);
    if (!mod) throw new HttpError(404, "Module not found.");

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(lessons)
      .where(eq(lessons.moduleId, mod.id));

    const [row] = await db
      .insert(lessons)
      .values({
        courseId: mod.courseId,
        moduleId: mod.id,
        slug: `lesson-${Date.now().toString(36)}`,
        title: body.title,
        summary: body.summary,
        minutes: body.minutes,
        kind: body.kind,
        contentHtml: sanitizeLessonHtml(body.contentHtml),
        draft: body.draft,
        position: Number(count ?? 0),
      })
      .returning();

    if (body.quizzes.length) {
      await db.insert(quizQuestions).values(
        body.quizzes.map((q, i) => ({
          lessonId: row.id,
          question: q.q,
          options: q.options,
          answer: q.answer,
          explain: q.explain,
          position: i,
        })),
      );
    }
    return Response.json({ lesson: row }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ error: error.issues[0]?.message }, { status: 422 });
    return errorResponse(error);
  }
}
