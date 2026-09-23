import Link from "next/link";
import { ArrowRight, CheckCircle2, Library, NotebookPen, ShieldCheck, Sparkles, Target } from "lucide-react";
import { CourseGlyph, LinkButton, minutesLabel } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { listCourseSummaries } from "@/lib/data";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  await ensureSeeded();
  const [user, courses] = await Promise.all([getCurrentUser(), listCourseSummaries()]);
  const totalLessons = courses.reduce((n, c) => n + c.lessons, 0);
  const totalMinutes = courses.reduce((n, c) => n + c.minutes, 0);

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <header className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 font-black text-white">CS</span>
          <span className="text-lg font-bold tracking-tight text-white">CoreStack Academy</span>
        </Link>
        <nav className="flex items-center gap-2">
          {user ? (
            <LinkButton href="/dashboard" tone="primary">
              Go to dashboard <ArrowRight className="h-4 w-4" />
            </LinkButton>
          ) : (
            <>
              <LinkButton href="/login" tone="ghost">
                Sign in
              </LinkButton>
              <LinkButton href="/register" tone="primary">
                Start free
              </LinkButton>
            </>
          )}
        </nav>
      </header>

      <section className="mt-16 grid items-center gap-10 lg:mt-24 lg:grid-cols-[1.15fr_1fr]">
        <div className="animate-fade-up">
          <span className="chip">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" /> {totalLessons} authored lessons · {Math.round(totalMinutes / 60)} hours
          </span>
          <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl">
            The CS curriculum you keep restarting — finally <span className="bg-gradient-to-r from-indigo-300 to-emerald-300 bg-clip-text text-transparent">finished</span>.
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-8 text-slate-300">
            CoreStack Academy turns six interview-critical subjects into a tracked course platform: operating systems, DBMS, system design,
            DSA, object-oriented design and computer networks. Real lessons, graded quizzes, inline notes, and progress stored in
            Postgres against your account.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <LinkButton href={user ? "/dashboard" : "/register"}>
              {user ? "Open dashboard" : "Create your account"} <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="/catalog" tone="secondary">
              Browse the catalog
            </LinkButton>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Demo login: <span className="font-mono text-slate-400">demo@corestack.dev</span> / corestack123
          </p>
        </div>

        <div className="panel animate-fade-up space-y-3 p-5">
          {courses.slice(0, 4).map((c) => (
            <Link key={c.slug} href={`/courses/${c.slug}`} className="panel panel-hover flex items-center gap-4 p-4">
              <CourseGlyph icon={c.icon} accent={c.accent} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-white">{c.title}</span>
                <span className="block truncate text-xs text-slate-400">{c.tagline}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-xs font-semibold tabular-nums text-slate-300">{c.lessons} lessons</span>
                <span className="block text-[11px] text-slate-500">{minutesLabel(c.minutes)}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Library, title: "Authored, not templated", body: "Every lesson body is written for its topic — code, tables, callouts and key takeaways. No mail-merged placeholders." },
          { icon: Target, title: "Quizzes that persist", body: "One quiz system, graded server-side, answers stored against your account so retries are visible." },
          { icon: NotebookPen, title: "Notes where you read", body: "Capture a note on the lesson itself, then find every note from one dashboard." },
        ].map((f) => (
          <div key={f.title} className="panel p-5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/15 text-indigo-200">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-white">{f.title}</h3>
            <p className="mt-1.5 text-sm leading-6 text-slate-400">{f.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-bold tracking-tight text-white">The full catalog</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <Link key={c.slug} href={`/courses/${c.slug}`} className="panel panel-hover group flex flex-col p-5">
              <div className="flex items-center gap-3">
                <CourseGlyph icon={c.icon} accent={c.accent} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{c.title}</p>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">
                    {c.category} · {c.level}
                  </p>
                </div>
              </div>
              <p className="mt-4 flex-1 text-sm leading-6 text-slate-400">{c.tagline}</p>
              <div className="mt-4 flex items-center gap-3 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> {c.lessons} lessons
                </span>
                <span>{minutesLabel(c.minutes)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-500">
        <p>CoreStack Academy — a full-stack rebuild of the CoreStack curriculum on Next.js, Drizzle and PostgreSQL.</p>
        <Link href="/admin-login" className="flex items-center gap-1.5 text-slate-500 transition hover:text-amber-300">
          <ShieldCheck className="h-3.5 w-3.5" /> Author / Admin Sign In
        </Link>
      </footer>
    </div>
  );
}
