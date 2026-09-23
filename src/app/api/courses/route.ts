import { z } from "zod";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { courses, modules } from "@/db/schema";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const courseSchema = z.object({
  title: z.string().trim().min(3).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes"),
  short: z.string().trim().min(1).max(8),
  tagline: z.string().trim().max(200).default(""),
  description: z.string().trim().max(4000).default(""),
  category: z.enum(["Systems", "Data", "Architecture", "Networks", "Programming"]).default("Programming"),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]).default("Beginner"),
  accent: z.string().trim().max(160).default("from-indigo-500 to-violet-500"),
  glow: z.string().trim().max(160).default("shadow-indigo-500/30"),
  tags: z.array(z.string().trim().min(1).max(30)).max(12).default([]),
  outcomes: z.array(z.string().trim().min(1).max(200)).max(12).default([]),
  author: z.string().trim().max(80).default("CoreStack"),
  published: z.boolean().default(true),
  firstModuleTitle: z.string().trim().max(120).optional(),
});

export async function GET() {
  try {
    return Response.json({ courses: await db.select().from(courses).orderBy(asc(courses.position)) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = courseSchema.parse(await request.json());
    const { firstModuleTitle, ...values } = body;

    const existing = await db.select({ id: courses.id }).from(courses).where(eq(courses.slug, body.slug)).limit(1);
    if (existing.length) throw new HttpError(409, "A course with that slug already exists.");

    const [row] = await db
      .insert(courses)
      .values({ ...values, position: 100 + Math.floor(Math.random() * 100) })
      .returning();

    await db.insert(modules).values({
      courseId: row.id,
      slug: "m1",
      title: firstModuleTitle || "Module 1",
      summary: "First module — edit me.",
      position: 0,
    });

    return Response.json({ course: row }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ error: error.issues[0]?.message }, { status: 422 });
    return errorResponse(error);
  }
}

