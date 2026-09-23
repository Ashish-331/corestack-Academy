import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { modules } from "@/db/schema";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";

const schema = z.object({
  courseId: z.number().int().positive(),
  title: z.string().trim().min(2).max(120),
  summary: z.string().trim().max(400).default(""),
});

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = schema.parse(await request.json());
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(modules)
      .where(eq(modules.courseId, body.courseId));

    const [row] = await db
      .insert(modules)
      .values({
        courseId: body.courseId,
        slug: `mod-${Date.now().toString(36)}`,
        title: body.title,
        summary: body.summary,
        position: Number(count ?? 0),
      })
      .returning();
    return Response.json({ module: row }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ error: error.issues[0]?.message }, { status: 422 });
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = z
      .object({ id: z.number().int().positive(), title: z.string().trim().min(2).max(120), summary: z.string().trim().max(400) })
      .parse(await request.json());
    const [row] = await db
      .update(modules)
      .set({ title: body.title, summary: body.summary })
      .where(eq(modules.id, body.id))
      .returning();
    if (!row) throw new HttpError(404, "Module not found.");
    return Response.json({ module: row });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ error: error.issues[0]?.message }, { status: 422 });
    return errorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const id = Number(new URL(request.url).searchParams.get("id"));
    if (!Number.isInteger(id)) throw new HttpError(422, "Invalid module id");
    const deleted = await db.delete(modules).where(and(eq(modules.id, id))).returning({ id: modules.id });
    if (!deleted.length) throw new HttpError(404, "Module not found.");
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
