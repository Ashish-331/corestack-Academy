import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { lessons, progress } from "@/db/schema";
import { errorResponse, HttpError, requireUser } from "@/lib/auth";

const schema = z.object({
  lessonId: z.number().int().positive(),
  status: z.enum(["in_progress", "completed", "reset"]),
});

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = schema.parse(await request.json());

    const [lesson] = await db
      .select({ id: lessons.id, courseId: lessons.courseId })
      .from(lessons)
      .where(eq(lessons.id, body.lessonId))
      .limit(1);
    if (!lesson) throw new HttpError(404, "That lesson no longer exists.");

    if (body.status === "reset") {
      await db.delete(progress).where(and(eq(progress.userId, user.id), eq(progress.lessonId, lesson.id)));
      return Response.json({ status: null, completedAt: null });
    }

    const completedAt = body.status === "completed" ? new Date() : null;
    const [row] = await db
      .insert(progress)
      .values({
        userId: user.id,
        lessonId: lesson.id,
        courseId: lesson.courseId,
        status: body.status,
        completedAt,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [progress.userId, progress.lessonId],
        set: { status: body.status, completedAt, updatedAt: new Date(), courseId: lesson.courseId },
      })
      .returning();
    return Response.json({ status: row.status, completedAt: row.completedAt, updatedAt: row.updatedAt });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ error: "Invalid progress payload" }, { status: 422 });
    return errorResponse(error);
  }
}
