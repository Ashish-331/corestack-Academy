import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { bookmarks, lessons } from "@/db/schema";
import { errorResponse, HttpError, requireUser } from "@/lib/auth";

const schema = z.object({ lessonId: z.number().int().positive() });

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = schema.parse(await request.json());
    const [lesson] = await db.select({ id: lessons.id }).from(lessons).where(eq(lessons.id, body.lessonId)).limit(1);
    if (!lesson) throw new HttpError(404, "That lesson no longer exists.");

    const existing = await db
      .select({ id: bookmarks.id })
      .from(bookmarks)
      .where(and(eq(bookmarks.userId, user.id), eq(bookmarks.lessonId, lesson.id)))
      .limit(1);

    if (existing.length) {
      await db.delete(bookmarks).where(eq(bookmarks.id, existing[0].id));
      return Response.json({ bookmarked: false });
    }
    await db.insert(bookmarks).values({ userId: user.id, lessonId: lesson.id }).onConflictDoNothing();
    return Response.json({ bookmarked: true });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ error: "Invalid bookmark payload" }, { status: 422 });
    return errorResponse(error);
  }
}
