import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { errorResponse, requireUser } from "@/lib/auth";
import { listNotes } from "@/lib/data";

export const dynamic = "force-dynamic";

const schema = z.object({
  title: z.string().trim().min(1, "Give the note a title").max(140),
  body: z.string().max(20000).default(""),
  lessonId: z.number().int().positive().nullable().optional(),
});

export async function GET() {
  try {
    const user = await requireUser();
    return Response.json({ notes: await listNotes(user.id) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = schema.parse(await request.json());
    const [row] = await db
      .insert(notes)
      .values({ userId: user.id, title: body.title, body: body.body, lessonId: body.lessonId ?? null })
      .returning();
    return Response.json({ note: row }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ error: error.issues[0]?.message }, { status: 422 });
    return errorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireUser();
    const id = Number(new URL(request.url).searchParams.get("id"));
    if (!Number.isInteger(id)) return Response.json({ error: "Invalid id" }, { status: 422 });
    await db.delete(notes).where(eq(notes.id, id));
    void user;
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
