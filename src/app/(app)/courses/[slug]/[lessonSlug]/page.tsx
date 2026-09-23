import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight, TriangleAlert } from "lucide-react";
import { Badge, CourseGlyph, minutesLabel } from "@/components/ui";
import { BookmarkButton, CompleteButton } from "@/components/LessonControls";
import { NotesPanel, Practice, Quiz } from "@/components/LessonStudy";
import { getCurrentUser } from "@/lib/auth";
import { getLessonView } from "@/lib/data";
import { sanitizeLessonHtml } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string; lessonSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lessonSlug } = await params;
  const view = await getLessonView(slug, lessonSlug);
  return view ? { title: view.lesson.title, description: view.lesson.summary } : { title: "Lesson not found" };
}

function tocOf(html: string) {
  const out: { id: string; text: string }[] = [];
  const re = /<h2[^>]*?(?:\sid="([^"]*)")?[^>]*>([\s\S]*?)<\/h2>/g;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(html))) {
    const text = m[2].replace(/<[^>]*>/g, "").trim();
    if (!text) continue;
    out.push({ id: m[1] ?? `section-${i}`, text });
    i += 1;
  }
  return out;
}

export default async function LessonPage({ params }: Props) {
  const { slug, lessonSlug } = await params;
  const user = await getCurrentUser();
  const view = await getLessonView(slug, lessonSlug, user?.id ?? null);
  if (!view) notFound();

  const { lesson, course, module: mod, prev, next } = view;
  const html = sanitizeLessonHtml(lesson.contentHtml);
  const toc = tocOf(html);

  return (
    <div className="mx-auto max-w-6xl">
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-slate-500">
        <Link href="/catalog" className="hover:text-slate-300">
          Catalog
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/courses/${course.slug}`} className="hover:text-slate-300">
          {course.title}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate text-slate-400">{mod.title}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_270px]">
        <article className="min-w-0">
          <header className="panel animate-fade-up p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="indigo">{lesson.kind}</Badge>
              <Badge>{minutesLabel(lesson.minutes)}</Badge>
              {lesson.draft ? (
                <Badge tone="amber">
                  <TriangleAlert className="h-3 w-3" /> draft
                </Badge>
              ) : null}
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white lg:text-3xl">{lesson.title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">{lesson.summary}</p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <CompleteButton lessonId={lesson.id} initialStatus={view.progress?.status ?? null} />
              <BookmarkButton lessonId={lesson.id} initial={view.bookmarked} withLabel />
              <span className="ml-auto text-[11px] text-slate-500">
                Lesson {view.index + 1} of {view.total} · {course.short}
              </span>
            </div>
          </header>

          {html.trim() ? (
            <div className="panel lesson mt-6 p-6 lg:p-8" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <div className="panel mt-6 border-amber-400/25 bg-amber-400/[0.06] p-6">
              <h2 className="flex items-center gap-2 text-base font-semibold text-amber-100">
                <TriangleAlert className="h-4 w-4" /> This lesson has no authored material yet
              </h2>
              <p className="mt-2 text-sm leading-6 text-amber-100/80">
                It is marked as a draft, so you know it is a deliberate gap rather than a silent one. Authors can write it from the
                Author studio.
              </p>
              <Link href="/admin" className="mt-4 inline-block text-sm font-semibold text-amber-200 underline underline-offset-2">
                Open Author studio
              </Link>
            </div>
          )}

          <div className="mt-6 space-y-6">
            <Quiz questions={view.quizzes} saved={view.savedAnswers} />
            <Practice problems={view.practice.map((p) => ({ id: p.id, prompt: p.prompt, hint: p.hint, solution: p.solution }))} />
            {user ? <NotesPanel lessonId={lesson.id} initial={view.notes} /> : null}
          </div>

          <nav className="mt-8 grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link href={`/courses/${course.slug}/${prev.slug}`} className="panel panel-hover flex items-center gap-3 p-4">
                <ArrowLeft className="h-4 w-4 shrink-0 text-slate-500" />
                <span className="min-w-0">
                  <span className="block text-[11px] uppercase tracking-wider text-slate-500">Previous</span>
                  <span className="block truncate text-sm font-medium text-slate-200">{prev.title}</span>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/courses/${course.slug}/${next.slug}`} className="panel panel-hover flex items-center justify-end gap-3 p-4 text-right">
                <span className="min-w-0">
                  <span className="block text-[11px] uppercase tracking-wider text-slate-500">Next</span>
                  <span className="block truncate text-sm font-medium text-slate-200">{next.title}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-500" />
              </Link>
            ) : null}
          </nav>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="panel p-5">
            <div className="flex items-center gap-3">
              <CourseGlyph icon={course.icon} accent={course.accent} size="sm" />
              <div className="min-w-0">
                <Link href={`/courses/${course.slug}`} className="block truncate text-sm font-semibold text-white hover:underline">
                  {course.title}
                </Link>
                <p className="truncate text-[11px] text-slate-500">{mod.title}</p>
              </div>
            </div>
            {toc.length ? (
              <>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500">On this page</p>
                <ul className="mt-2 space-y-1.5">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="block truncate text-[13px] text-slate-400 hover:text-indigo-200">
                        {t.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>

          <div className="panel p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Quiz on this lesson</p>
            <p className="mt-1.5 text-sm text-slate-300">
              {view.quizzes.length ? `${view.quizzes.length} questions · answers are saved` : "No quiz for this lesson"}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
