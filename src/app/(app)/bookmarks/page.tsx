import Link from "next/link";
import { redirect } from "next/navigation";
import { Bookmark, Clock } from "lucide-react";
import { CourseGlyph, EmptyState, LinkButton, minutesLabel } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { listBookmarks } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Saved lessons" };

export default async function BookmarksPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const saved = await listBookmarks(user.id);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Saved</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">Lessons you bookmarked</h1>
        <p className="mt-1.5 text-sm text-zinc-400">Quick access to the ones you want to revisit before an interview.</p>
      </header>

      {saved.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="h-5 w-5" />}
          title="Nothing saved yet"
          description="Tap the bookmark icon on any lesson and it will show up here, across all your devices."
          action={<LinkButton href="/catalog">Find something to save</LinkButton>}
        />
      ) : (
        <ul className="space-y-3">
          {saved.map((l) => (
            <li key={l.lessonId} className="panel flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4">
              <CourseGlyph icon="bookmark" size="sm" />
              <div className="min-w-0 flex-1">
                <Link href={`/courses/${l.courseSlug}/${l.lessonSlug}`} className="block truncate text-sm font-semibold text-white hover:underline">
                  {l.lessonTitle}
                </Link>
                <p className="mt-0.5 flex items-center gap-2 truncate text-[11px] text-zinc-500">
                  <span className="truncate">{l.courseTitle}</span>
                  <span className="shrink-0 flex items-center gap-1"><Clock className="h-3 w-3" /> {minutesLabel(l.minutes)}</span>
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/courses/${l.courseSlug}/${l.lessonSlug}`}
                  className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-800 min-h-[36px] flex items-center justify-center"
                >
                  Open
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
