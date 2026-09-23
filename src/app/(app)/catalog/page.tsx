import CatalogClient from "@/components/CatalogClient";
import { getCurrentUser } from "@/lib/auth";
import { listCourseSummaries } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Catalog" };

type Props = { searchParams: Promise<{ q?: string }> };

export default async function CatalogPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const user = await getCurrentUser();
  const courses = await listCourseSummaries(user?.id ?? null);
  return <CatalogClient courses={courses} initialQuery={q ?? ""} />;
}
