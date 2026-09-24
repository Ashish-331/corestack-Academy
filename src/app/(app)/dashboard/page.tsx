import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpen, CalendarCheck, CheckCircle2, Flame, NotebookPen, Target, Timer } from "lucide-react";
import { Badge, CourseGlyph, EmptyState, LinkButton, ProgressBar, StatCard, minutesLabel, relativeTime } from "@/components/ui";
import { CompleteButton } from "@/components/LessonControls";
import { getCurrentUser } from "@/lib/auth";
import { getDashboard } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const data = await getDashboard(user.id);

  const accuracy = data.quiz.answered ? Math.round((data.quiz.correct / data.quiz.answered) * 100) : 0;
  const firstName = user.name.split(" ")[0];
  const totalLessons = data.courseRows.reduce((n, c) => n + c.lessons, 0);
  const totalCompleted = data.courseRows.reduce((n, c) => n + c.completed, 0);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="animate-fade-up flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">CoreStack Academy · Dashboard</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">Welcome back to CoreStack Academy, {firstName}</h1>
          <p className="mt-1.5 text-xs sm:text-sm text-zinc-400">
            {data.continueRows.length
              ? `You have ${data.continueRows.length} lesson${data.continueRows.length > 1 ? "s" : ""} in progress.`
              : totalCompleted
                ? "Everything you started is finished — pick a new module below."
                : "Let's get the first lesson under your belt."}
          </p>
        </div>
        <LinkButton href="/catalog" tone="secondary" className="w-full sm:w-auto text-center justify-center">
          Browse catalog <ArrowRight className="h-4 w-4" />
        </LinkButton>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Lessons completed"
          value={data.completed}
          hint={`${totalCompleted}/${totalLessons} across all courses`}
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <StatCard
          label="Study time"
          value={minutesLabel(data.minutes)}
          hint={`${data.inProgress} in progress`}
          icon={<Timer className="h-4 w-4" />}
        />
        <StatCard
          label="Active days"
          value={data.activeDays}
          hint="distinct days with a completed lesson"
          icon={<CalendarCheck className="h-4 w-4" />}
        />
        <StatCard
          label="Current streak"
          value={data.streak}
          hint={data.streak > 1 ? "consecutive days — keep it going" : data.streak === 1 ? "consecutive day" : "complete a lesson today"}
          icon={<Flame className="h-4 w-4" />}
        />
      </section>

      {totalCompleted === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-5 w-5" />}
          title="No progress yet"
          description="Start with the first lesson of any course. Completing a lesson records it against your account, feeds your streak and unlocks the progress view."
          action={
            <LinkButton href="/courses/operating-systems/m0l0">
              Start “What is an Operating System?” <ArrowRight className="h-4 w-4" />
            </LinkButton>
          }
        />
      ) : null}

      {data.continueRows.length ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">Continue learning</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {data.continueRows.map((l) => (
              <div key={l.lessonSlug} className="panel panel-hover flex flex-col gap-3 p-4">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500">{l.courseTitle}</p>
                  <Link href={`/courses/${l.courseSlug}/${l.lessonSlug}`} className="mt-1 block text-sm font-semibold text-white hover:underline">
                    {l.lessonTitle}
                  </Link>
                  <p className="mt-1 text-xs text-zinc-500">{minutesLabel(l.minutes)} · {relativeTime(l.updatedAt)}</p>
                </div>
                <div className="mt-auto flex items-center gap-2">
                  <Link
                    href={`/courses/${l.courseSlug}/${l.lessonSlug}`}
                    className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800"
                  >
                    Resume
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="panel p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Course progress</h2>
          <ul className="mt-4 space-y-4">
            {data.courseRows.map((c) => (
              <li key={c.slug}>
                <div className="flex items-center gap-3">
                  <CourseGlyph icon={c.icon} accent={c.accent} size="sm" />
                  <div className="min-w-0 flex-1">
                    <Link href={`/courses/${c.slug}`} className="block truncate text-sm font-medium text-zinc-100 hover:underline">
                      {c.title}
                    </Link>
                    <p className="text-[11px] text-zinc-500">
                      {c.completed}/{c.lessons} lessons · {minutesLabel(c.minutes)}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold tabular-nums text-zinc-300">
                    {c.lessons ? Math.round((c.completed / c.lessons) * 100) : 0}%
                  </span>
                </div>
                <ProgressBar value={c.completed} total={c.lessons} className="mt-2" />
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="panel p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Quiz accuracy</h2>
            <p className="mt-3 text-3xl font-bold text-white tabular-nums">{accuracy}%</p>
            <p className="mt-1 text-xs text-zinc-500">
              {data.quiz.correct} correct of {data.quiz.answered} answered
            </p>
            <ProgressBar value={data.quiz.correct} total={Math.max(1, data.quiz.answered)} className="mt-3" />
          </div>

          <div className="panel p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">
              <NotebookPen className="h-3.5 w-3.5" /> Recent notes
            </h2>
            {data.pinnedNotes.length === 0 ? (
              <p className="mt-3 text-sm text-zinc-500">
                No notes yet. Open any lesson and write while you read.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {data.pinnedNotes.map((n) => (
                  <li key={n.id} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
                    <div className="flex items-center gap-2">
                      {n.pinned ? <Badge tone="amber">pinned</Badge> : null}
                      <p className="min-w-0 flex-1 truncate text-[13px] font-semibold text-zinc-100">{n.title}</p>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-zinc-400">{n.body}</p>
                    {n.lessonSlug && n.courseSlug ? (
                      <Link href={`/courses/${n.courseSlug}/${n.lessonSlug}`} className="mt-1.5 inline-block text-[11px] text-zinc-400 hover:text-white hover:underline">
                        {n.lessonTitle}
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
            <Link href="/notes" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white">
              All notes <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      <section className="panel p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Recent activity</h2>
        {data.recent.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">Nothing yet — complete a lesson to start the log.</p>
        ) : (
          <ol className="mt-4 space-y-3">
            {data.recent.map((r) => (
              <li key={r.id} className="flex items-center gap-3">
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border ${
                    r.status === "completed"
                      ? "border-emerald-900/60 bg-emerald-950/40 text-emerald-300"
                      : "border-zinc-800 bg-zinc-900 text-zinc-300"
                  }`}
                >
                  {r.status === "completed" ? <CheckCircle2 className="h-4 w-4" /> : <Target className="h-4 w-4" />}
                </span>
                <span className="min-w-0 flex-1">
                  <Link href={`/courses/${r.courseSlug}/${r.lessonSlug}`} className="block truncate text-sm text-zinc-200 hover:underline">
                    {r.lessonTitle}
                  </Link>
                  <span className="block truncate text-[11px] text-zinc-500">
                    {r.courseTitle} · {r.status === "completed" ? "completed" : "in progress"}
                  </span>
                </span>
                <span className="shrink-0 text-[11px] text-zinc-500">{relativeTime(r.updatedAt)}</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <p className="flex items-center gap-2 text-xs text-zinc-500">
        <Flame className="h-3.5 w-3.5 text-amber-400" />
        Streak counts consecutive days ending today or yesterday; active days counts every day you studied at least once.
      </p>
    </div>
  );
}
