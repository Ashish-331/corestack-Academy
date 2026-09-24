import type { ReactNode } from "react";
import AppShell from "@/components/AppShell";
import { getCurrentUser } from "@/lib/auth";
import { listCourseSummaries } from "@/lib/data";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  await ensureSeeded();
  const user = await getCurrentUser();

  const courses = await listCourseSummaries(user?.id ?? null);
  return (
    <AppShell
      user={user}
      courses={courses.map((c) => ({
        slug: c.slug,
        title: c.title,
        short: c.short,
        accent: c.accent,
        icon: c.icon,
        completed: c.completed,
        lessons: c.lessons,
      }))}
    >
      {children}
    </AppShell>
  );
}
