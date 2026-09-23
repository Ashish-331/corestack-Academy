import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { errorResponse, HttpError, requireUser } from "@/lib/auth";

const schema = z.object({
  title: z.string().trim().min(1).max(140).optional(),
  body: z.string().max(20000).optional(),
  pinned: z.boolean().optional(),
  lessonId: z.number().int().positive().nullable().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const noteId = Number(id);
    if (!Number.isInteger(noteId)) throw new HttpError(422, "Invalid note id");
    const body = schema.parse(await request.json());

    const [row] = await db
      .update(notes)
      .set({ ...body, updatedAt: new Date() })
      .where(and(eq(notes.id, noteId), eq(notes.userId, user.id)))
      .returning();
    if (!row) throw new HttpError(404, "Note not found.");
    return Response.json({ note: row });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ error: "Invalid note payload" }, { status: 422 });
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const noteId = Number(id);
    if (!Number.isInteger(noteId)) throw new HttpError(422, "Invalid note id");
    const deleted = await db
      .delete(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, user.id)))
      .returning({ id: notes.id });
    if (!deleted.length) throw new HttpError(404, "Note not found.");
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
