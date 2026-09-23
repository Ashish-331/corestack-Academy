import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, errorResponse, HttpError, toPublicUser, verifyPassword } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const body = schema.parse(await request.json());
    const [row] = await db.select().from(users).where(eq(users.email, body.email)).limit(1);
    if (!row || !verifyPassword(body.password, row.passwordHash)) {
      throw new HttpError(401, "Email or password is incorrect.");
    }
    await createSession(row.id);
    return Response.json({ user: toPublicUser(row) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Enter a valid email and password" }, { status: 422 });
    }
    return errorResponse(error);
  }
}
