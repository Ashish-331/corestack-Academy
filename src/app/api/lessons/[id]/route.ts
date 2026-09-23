import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { lessons, practiceProblems, quizQuestions } from "@/db/schema";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { sanitizeLessonHtml } from "@/lib/sanitize";

const quizInput = z.object({
  id: z.number().int().positive().optional(),
  q: z.string().trim().min(3).max(600),
  options: z.array(z.string().trim().min(1).max(300)).min(2).max(6),
  answer: z.number().int().min(0).max(5),
  explain: z.string().trim().max(1200).default(""),
});

const schema = z.object({
  title: z.string().trim().min(2).max(200).optional(),
  summary: z.string().trim().max(400).optional(),
  minutes: z.number().int().min(1).max(600).optional(),
  kind: z.enum(["reading", "lab", "case", "quiz"]).optional(),
  contentHtml: z.string().max(200000).optional(),
  draft: z.boolean().optional(),
  moduleId: z.number().int().positive().optional(),
  position: z.number().int().min(0).max(999).optional(),
  quizzes: z.array(quizInput).max(20).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const user = await requireAdmin();
    const { id } = await params;
    const lessonId = Number(id);
    if (!Number.isInteger(lessonId)) throw new HttpError(422, "Invalid lesson id");
    const [row] = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
    if (!row) throw new HttpError(404, "Lesson not found.");
    const quizzes = await db.select().from(quizQuestions).where(eq(quizQuestions.lessonId, lessonId));
    void user;
    return Response.json({ lesson: row, quizzes });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const lessonId = Number(id);
    if (!Number.isInteger(lessonId)) throw new HttpError(422, "Invalid lesson id");
    const body = schema.parse(await request.json());

    const update: Record<string, unknown> = { updatedAt: new Date() };
    for (const [key, value] of Object.entries(body)) {
      if (key === "quizzes") continue;
      update[key] = key === "contentHtml" ? sanitizeLessonHtml(value as string) : value;
    }

    const [row] = await db.update(lessons).set(update).where(eq(lessons.id, lessonId)).returning();
    if (!row) throw new HttpError(404, "Lesson not found.");

    if (body.quizzes) {
      const keepIds = body.quizzes.map((q) => q.id).filter((v): v is number => typeof v === "number");
      const existing = await db.select({ id: quizQuestions.id }).from(quizQuestions).where(eq(quizQuestions.lessonId, lessonId));
      for (const q of existing) {
        if (!keepIds.includes(q.id)) await db.delete(quizQuestions).where(eq(quizQuestions.id, q.id));
      }
      for (const [i, q] of body.quizzes.entries()) {
        if (q.id) {
          await db
            .update(quizQuestions)
            .set({ question: q.q, options: q.options, answer: q.answer, explain: q.explain, position: i })
            .where(and(eq(quizQuestions.id, q.id), eq(quizQuestions.lessonId, lessonId)));
        } else {
          await db.insert(quizQuestions).values({ lessonId, question: q.q, options: q.options, answer: q.answer, explain: q.explain, position: i });
        }
      }
    }

    return Response.json({ lesson: row });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ error: error.issues[0]?.message }, { status: 422 });
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const lessonId = Number(id);
    if (!Number.isInteger(lessonId)) throw new HttpError(422, "Invalid lesson id");
    await db.delete(practiceProblems).where(eq(practiceProblems.lessonId, lessonId));
    const deleted = await db.delete(lessons).where(eq(lessons.id, lessonId)).returning({ id: lessons.id });
    if (!deleted.length) throw new HttpError(404, "Lesson not found.");
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
