import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, errorResponse, hashPassword, HttpError, toPublicUser } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";

const schema = z.object({
  name: z.string().trim().min(2, "Tell us your name").max(80),
  email: z.string().trim().toLowerCase().email("That email does not look right"),
  password: z.string().min(8, "Use at least 8 characters").max(200),
});

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const body = schema.parse(await request.json());
    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, body.email)).limit(1);
    if (existing.length) throw new HttpError(409, "An account with that email already exists.");

    const [row] = await db
      .insert(users)
      .values({ ...body, passwordHash: hashPassword(body.password), role: "student" })
      .returning();
    await createSession(row.id);
    return Response.json({ user: toPublicUser(row) }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues[0]?.message ?? "Invalid input" }, { status: 422 });
    }
    return errorResponse(error);
  }
}
