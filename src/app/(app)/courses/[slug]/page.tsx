import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Target } from "lucide-react";
import { Badge, CourseGlyph, LinkButton, ProgressBar, minutesLabel } from "@/components/ui";
import { LessonTree } from "@/components/LessonControls";
import { getCurrentUser } from "@/lib/auth";
import { getCourseBySlug, getCourseOutline } from "@/lib/data";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  return course
    ? { title: course.title, description: course.tagline || course.description }
    : { title: "Course not found" };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const user = await getCurrentUser();
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const outline = await getCourseOutline(course.id, user?.id ?? null);
  const all = outline.flatMap((m) => m.lessons);
  const completed = all.filter((l) => l.status === "completed").length;
  const totalMinutes = all.reduce((n, l) => n + l.minutes, 0);
  const nextLesson = all.find((l) => l.status !== "completed") ?? all[0];
  const tags = (course.tags ?? []) as string[];
  const outcomes = (course.outcomes ?? []) as string[];

  return (
    <div className="mx-auto max-w-5xl">
      <header className="panel p-4 sm:p-6 lg:p-8">
        <div>
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
            <CourseGlyph icon={course.icon} size="lg" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{course.category}</Badge>
                <Badge>{course.level}</Badge>
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">{course.title}</h1>
              <p className="mt-2 max-w-2xl text-xs sm:text-[15px] leading-6 sm:leading-7 text-zinc-300">{course.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5" /> {all.length} lessons · {outline.length} modules
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {minutesLabel(totalMinutes)}
                </span>
                <span>
                  {course.author} · updated {course.updated}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:grid sm:grid-cols-[1fr_auto] gap-4 sm:items-center">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs text-zinc-400">
                <span>
                  {completed} of {all.length} lessons complete
                </span>
                <span className="font-semibold tabular-nums text-zinc-200">
                  {all.length ? Math.round((completed / all.length) * 100) : 0}%
                </span>
              </div>
              <ProgressBar value={completed} total={all.length} />
            </div>
            {nextLesson ? (
              <LinkButton href={`/courses/${course.slug}/${nextLesson.slug}`} className="w-full sm:w-auto text-center justify-center min-h-[44px]">
                {completed ? "Continue" : "Start"} <ArrowRight className="h-4 w-4" />
              </LinkButton>
            ) : null}
          </div>
        </div>
      </header>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_260px]">
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">Curriculum</h2>
          <LessonTree
            courseSlug={course.slug}
            modules={outline.map((m) => ({
              id: m.id,
              title: m.title,
              summary: m.summary,
              lessons: m.lessons.map((l) => ({
                id: l.id,
                slug: l.slug,
                title: l.title,
                summary: l.summary,
                minutes: l.minutes,
                kind: l.kind,
                draft: l.draft,
                status: l.status,
                bookmarked: l.bookmarked,
              })),
            }))}
          />
        </div>

        <aside className="space-y-4">
          {outcomes.length ? (
            <div className="panel p-5">
              <h3 className="text-sm font-semibold text-white">What you will be able to do</h3>
              <ul className="mt-3 space-y-2.5 text-[13px] leading-6 text-zinc-300">
                {outcomes.map((o) => (
                  <li key={o} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {tags.length ? (
            <div className="panel p-5">
              <h3 className="text-sm font-semibold text-white">Topics</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <Link key={t} href={`/catalog?q=${encodeURIComponent(t)}`} className="chip hover:border-zinc-700 hover:text-white">
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </aside>
      </section>
    </div>
  );
}
