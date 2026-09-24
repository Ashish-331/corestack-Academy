import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight, TriangleAlert } from "lucide-react";
import { Badge, CourseGlyph, minutesLabel } from "@/components/ui";
import { BookmarkButton, CompleteButton } from "@/components/LessonControls";
import { NotesPanel, Practice, Quiz } from "@/components/LessonStudy";
import { MobileLessonNav } from "@/components/MobileLessonNav";
import { getCurrentUser } from "@/lib/auth";
import { getCourseOutline, getLessonView } from "@/lib/data";
import { sanitizeLessonHtml } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string; lessonSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lessonSlug } = await params;
  const view = await getLessonView(slug, lessonSlug);
  return view ? { title: view.lesson.title, description: view.lesson.summary } : { title: "Lesson not found" };
}

function injectHeadingIdsAndToc(html: string) {
  const out: { id: string; text: string }[] = [];
  let index = 0;
  const processed = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (match, attrs, inner) => {
    const text = inner.replace(/<[^>]*>/g, "").trim();
    if (!text) return match;

    const idMatch = attrs.match(/\bid="([^"]*)"/i);
    let id = idMatch ? idMatch[1] : null;

    if (!id) {
      const slugCandidate = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      id = slugCandidate ? `sec-${slugCandidate}` : `section-${index}`;
      attrs = ` id="${id}"${attrs}`;
    }

    out.push({ id, text });
    index += 1;
    return `<h2${attrs}>${inner}</h2>`;
  });

  return { html: processed, toc: out };
}

export default async function LessonPage({ params }: Props) {
  const { slug, lessonSlug } = await params;
  const user = await getCurrentUser();
  const view = await getLessonView(slug, lessonSlug, user?.id ?? null);
  if (!view) notFound();

  const outline = await getCourseOutline(view.course.id, user?.id ?? null);
  const { lesson, course, module: mod, prev, next } = view;
  const sanitized = sanitizeLessonHtml(lesson.contentHtml);
  const { html, toc } = injectHeadingIdsAndToc(sanitized);

  return (
    <div className="mx-auto max-w-6xl">
      <MobileLessonNav
        course={{ slug: course.slug, title: course.title, short: course.short, icon: course.icon }}
        modules={outline}
        currentLessonSlug={lesson.slug}
        currentLessonIndex={view.index}
        totalLessons={view.total}
        toc={toc}
        prev={prev}
        next={next}
      />

      <nav className="mb-4 flex items-center gap-1.5 text-xs text-zinc-500">
        <Link href="/catalog" className="hover:text-zinc-300">
          Catalog
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/courses/${course.slug}`} className="hover:text-zinc-300">
          {course.title}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate text-zinc-400">{mod.title}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_270px]">
        <article className="min-w-0">
          <header className="panel p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="slate">{lesson.kind}</Badge>
              <Badge>{minutesLabel(lesson.minutes)}</Badge>
              {lesson.draft ? (
                <Badge tone="amber">
                  <TriangleAlert className="h-3 w-3" /> draft
                </Badge>
              ) : null}
            </div>
            <h1 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-white lg:text-3xl leading-tight">
              {lesson.title}
            </h1>
            <p className="mt-2 text-xs sm:text-sm leading-6 text-zinc-400">{lesson.summary}</p>

            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <CompleteButton lessonId={lesson.id} initialStatus={view.progress?.status ?? null} />
              <BookmarkButton lessonId={lesson.id} initial={view.bookmarked} withLabel />
              <span className="ml-auto text-[11px] text-zinc-500">
                Lesson {view.index + 1} of {view.total} · {course.short}
              </span>
            </div>
          </header>

          {html.trim() ? (
            <div className="panel lesson mt-6 p-4 sm:p-6 lg:p-8" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <div className="panel mt-6 border border-amber-900/60 bg-amber-950/20 p-4 sm:p-6">
              <h2 className="flex items-center gap-2 text-sm sm:text-base font-semibold text-amber-200">
                <TriangleAlert className="h-4 w-4 shrink-0" /> This lesson has no authored material yet
              </h2>
              <p className="mt-2 text-xs sm:text-sm leading-6 text-amber-200/80">
                It is marked as a draft, so you know it is a deliberate gap rather than a silent one. Authors can write it from the
                Author studio.
              </p>
              <Link href="/admin" className="mt-4 inline-block text-xs sm:text-sm font-semibold text-amber-300 underline underline-offset-2">
                Open Author studio
              </Link>
            </div>
          )}

          <div className="mt-6 space-y-6">
            <Quiz questions={view.quizzes} saved={view.savedAnswers} />
            <Practice problems={view.practice.map((p) => ({ id: p.id, prompt: p.prompt, hint: p.hint, solution: p.solution }))} />
            {user ? <NotesPanel lessonId={lesson.id} initial={view.notes} /> : null}
          </div>

          <nav className="mt-8 flex flex-col gap-3 sm:grid sm:grid-cols-2 pb-16 lg:pb-0">
            {prev ? (
              <Link
                href={`/courses/${course.slug}/${prev.slug}`}
                className="panel panel-hover flex min-h-[52px] items-center gap-3 p-3.5 sm:p-4 active:scale-[0.99] transition"
              >
                <ArrowLeft className="h-4 w-4 shrink-0 text-zinc-400" />
                <span className="min-w-0">
                  <span className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
                    Previous Lesson
                  </span>
                  <span className="block truncate text-xs sm:text-sm font-medium text-zinc-200">{prev.title}</span>
                </span>
              </Link>
            ) : null}
            {next ? (
              <Link
                href={`/courses/${course.slug}/${next.slug}`}
                className={`panel panel-hover flex min-h-[52px] items-center gap-3 p-3.5 sm:p-4 active:scale-[0.99] transition ${
                  prev ? "justify-end text-right" : "sm:col-start-2 justify-end text-right"
                }`}
              >
                <span className="min-w-0">
                  <span className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
                    Next Lesson
                  </span>
                  <span className="block truncate text-xs sm:text-sm font-medium text-zinc-200">{next.title}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-zinc-400" />
              </Link>
            ) : null}
          </nav>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="panel p-5">
            <div className="flex items-center gap-3">
              <CourseGlyph icon={course.icon} size="sm" />
              <div className="min-w-0">
                <Link href={`/courses/${course.slug}`} className="block truncate text-sm font-semibold text-white hover:underline">
                  {course.title}
                </Link>
                <p className="truncate text-[11px] text-zinc-500">{mod.title}</p>
              </div>
            </div>
            {toc.length ? (
              <>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">On this page</p>
                <ul className="mt-2 space-y-1.5">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="block truncate text-[13px] text-zinc-400 hover:text-zinc-100 hover:underline">
                        {t.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>

          <div className="panel p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Quiz on this lesson</p>
            <p className="mt-1.5 text-sm text-zinc-300">
              {view.quizzes.length ? `${view.quizzes.length} questions · answers are saved` : "No quiz for this lesson"}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
