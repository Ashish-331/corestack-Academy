import { redirect } from "next/navigation";
import { asc, sql } from "drizzle-orm";
import AdminClient, { type AdminCourse } from "@/components/AdminClient";
import { db } from "@/db";
import { courses, lessons, modules, quizQuestions } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { EmptyState, LinkButton } from "@/components/ui";
import { Library } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Author studio" };

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (user.role !== "admin") {
    return (
      <div className="mx-auto max-w-2xl pt-10">
        <EmptyState
          icon={<Library className="h-5 w-5" />}
          title="Author access only"
          description="The author studio is limited to admin accounts. Sign in as author@corestack.dev (password corestack123) to edit the catalog."
          action={<LinkButton href="/dashboard">Back to dashboard</LinkButton>}
        />
      </div>
    );
  }

  const courseRows = await db.select().from(courses).orderBy(asc(courses.position));
  const moduleRows = await db.select().from(modules).orderBy(asc(modules.position));
  const lessonRows = await db
    .select({
      id: lessons.id,
      moduleId: lessons.moduleId,
      slug: lessons.slug,
      title: lessons.title,
      summary: lessons.summary,
      minutes: lessons.minutes,
      kind: lessons.kind,
      draft: lessons.draft,
      position: lessons.position,
      quizCount: sql<number>`(select count(*)::int from ${quizQuestions} where ${quizQuestions.lessonId} = ${lessons.id})`,
    })
    .from(lessons)
    .orderBy(asc(lessons.position));

  const payload: AdminCourse[] = courseRows.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    short: c.short,
    tagline: c.tagline,
    description: c.description,
    category: c.category,
    level: c.level,
    accent: c.accent,
    glow: c.glow,
    tags: (c.tags ?? []) as string[],
    outcomes: (c.outcomes ?? []) as string[],
    author: c.author,
    published: c.published,
    modules: moduleRows
      .filter((m) => m.courseId === c.id)
      .map((m) => ({
        id: m.id,
        title: m.title,
        summary: m.summary,
        position: m.position,
        lessons: lessonRows
          .filter((l) => l.moduleId === m.id)
          .map((l) => ({
            id: l.id,
            slug: l.slug,
            title: l.title,
            summary: l.summary,
            minutes: l.minutes,
            kind: l.kind,
            draft: l.draft,
            position: l.position,
            quizCount: Number(l.quizCount ?? 0),
          })),
      })),
  }));

  return <AdminClient courses={payload} />;
}
