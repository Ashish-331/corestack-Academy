import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";

const patchSchema = z.object({
  title: z.string().trim().min(3).max(120).optional(),
  tagline: z.string().trim().max(200).optional(),
  description: z.string().trim().max(4000).optional(),
  category: z.enum(["Systems", "Data", "Architecture", "Networks", "Programming"]).optional(),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  accent: z.string().trim().max(160).optional(),
  glow: z.string().trim().max(160).optional(),
  tags: z.array(z.string().trim().min(1).max(30)).max(12).optional(),
  outcomes: z.array(z.string().trim().min(1).max(200)).max(12).optional(),
  author: z.string().trim().max(80).optional(),
  updated: z.string().trim().max(20).optional(),
  published: z.boolean().optional(),
  position: z.number().int().min(0).max(999).optional(),
});

type Params = { params: Promise<{ slug: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { slug } = await params;
    const body = patchSchema.parse(await request.json());
    if (!Object.keys(body).length) throw new HttpError(422, "Nothing to update.");

    const [row] = await db
      .update(courses)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(courses.slug, slug))
      .returning();
    if (!row) throw new HttpError(404, "Course not found.");
    return Response.json({ course: row });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ error: error.issues[0]?.message }, { status: 422 });
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { slug } = await params;
    const deleted = await db.delete(courses).where(eq(courses.slug, slug)).returning({ id: courses.id });
    if (!deleted.length) throw new HttpError(404, "Course not found.");
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
