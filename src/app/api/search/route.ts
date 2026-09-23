import { getCurrentUser, errorResponse } from "@/lib/auth";
import { searchCatalog } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    const q = new URL(request.url).searchParams.get("q") ?? "";
    const results = await searchCatalog(q, user?.id);
    return Response.json(results);
  } catch (error) {
    return errorResponse(error);
  }
}
