import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { quizAnswers, quizQuestions } from "@/db/schema";
import { errorResponse, HttpError, requireUser } from "@/lib/auth";

const schema = z.object({
  questionId: z.number().int().positive(),
  selectedIndex: z.number().int().min(0).max(9),
});

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = schema.parse(await request.json());
    const [question] = await db
      .select({ answer: quizQuestions.answer, options: quizQuestions.options })
      .from(quizQuestions)
      .where(eq(quizQuestions.id, body.questionId))
      .limit(1);
    if (!question) throw new HttpError(404, "That question no longer exists.");
    if (body.selectedIndex >= ((question.options ?? []) as string[]).length) {
      throw new HttpError(422, "That option does not exist for this question.");
    }

    const correct = body.selectedIndex === question.answer;
    const [row] = await db
      .insert(quizAnswers)
      .values({ userId: user.id, questionId: body.questionId, selectedIndex: body.selectedIndex, correct, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: [quizAnswers.userId, quizAnswers.questionId],
        set: { selectedIndex: body.selectedIndex, correct, updatedAt: new Date() },
      })
      .returning();
    return Response.json({ id: row.id, correct, selectedIndex: row.selectedIndex });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ error: "Invalid quiz answer" }, { status: 422 });
    return errorResponse(error);
  }
}
