import { z } from "zod";
import { errorResponse, requireAdmin } from "@/lib/auth";
import { sanitizeLessonHtml } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

const schema = z.object({
  html: z.string().default(""),
});

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = schema.parse(await request.json().catch(() => ({ html: "" })));
    const sanitized = sanitizeLessonHtml(body.html);
    return Response.json({ html: sanitized });
  } catch (error) {
    return errorResponse(error);
  }
}
