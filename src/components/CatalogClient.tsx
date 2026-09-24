"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Loader2, Search, X } from "lucide-react";
import { Badge, CourseGlyph, EmptyState, ProgressBar, SkeletonBlock, minutesLabel } from "@/components/ui";

type CourseCard = {
  id: number;
  slug: string;
  title: string;
  short: string;
  tagline: string;
  category: string;
  level: string;
  icon: string;
  accent: string;
  tags: string[];
  lessons: number;
  minutes: number;
  completed: number;
  draft: number;
};

type LessonHit = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  kind: string;
  courseSlug: string;
  courseTitle: string;
  courseShort: string;
  accent: string;
  completed: boolean;
};

export default function CatalogClient({ courses, initialQuery = "" }: { courses: CourseCard[]; initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery);
  const [category, setCategory] = useState("All");
  const [hits, setHits] = useState<LessonHit[] | null>(null);
  const [courseHits, setCourseHits] = useState<CourseCard[] | null>(null);
  const [loading, setLoading] = useState(() => initialQuery.trim().length >= 2);

  const categories = ["All", ...Array.from(new Set(courses.map((c) => c.category)))];
  const visible = (courseHits ?? courses).filter((c) => category === "All" || c.category === category);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: controller.signal });
        if (res.ok && !controller.signal.aborted) {
          const data = (await res.json()) as { courses: { slug: string }[]; lessons: LessonHit[] };
          setHits(data.lessons);
          const allowed = new Set(data.courses.map((c) => c.slug));
          setCourseHits(courses.filter((c) => allowed.has(c.slug) || data.lessons.some((l) => l.courseSlug === c.slug)));
        } else if (!controller.signal.aborted) {
          setHits(null);
          setCourseHits(null);
        }
      } catch {
        /* aborted */
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [q, courses]);

  function updateQuery(value: string) {
    setQ(value);
    if (value.trim().length < 2) {
      setHits(null);
      setCourseHits(null);
      setLoading(false);
      return;
    }
    setHits(null);
    setCourseHits(null);
    setLoading(true);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Catalog</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">Every course in the library</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-zinc-400">
          Search across course and lesson titles, then jump straight into the lesson that matched.
        </p>
      </header>

      <div className="panel flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={q}
            onChange={(e) => updateQuery(e.target.value)}
            placeholder="Try “deadlock”, “B+ tree”, “sliding window”, “TLS”…"
            className="w-full rounded-md border border-zinc-800 bg-zinc-900/70 py-2 pl-9 pr-9 text-sm text-zinc-100 placeholder:text-zinc-500 focus-ring focus:border-zinc-600"
          />
          {loading ? (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-zinc-500" />
          ) : q ? (
            <button onClick={() => updateQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-500 hover:text-zinc-200" aria-label="Clear search">
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`focus-ring rounded-md px-3 py-1.5 text-xs font-medium transition ${
                category === c ? "border border-zinc-700 bg-zinc-800 text-zinc-100" : "border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {q.trim().length >= 2 && hits ? (
        <section className="panel p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            {hits.length} matching lesson{hits.length === 1 ? "" : "s"} for “{q.trim()}”
          </h2>
          {hits.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-500">No lesson titles matched. Try a shorter term.</p>
          ) : (
            <ul className="mt-3 grid gap-2 md:grid-cols-2">
              {hits.map((l) => (
                <li key={l.id}>
                  <Link
                    href={`/courses/${l.courseSlug}/${l.slug}`}
                    className="panel panel-hover flex items-start gap-3 p-3"
                  >
                    <CourseGlyph icon="book-open" size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-zinc-100">{l.title}</span>
                      <span className="block truncate text-[11px] text-zinc-500">
                        {l.courseTitle} · {minutesLabel(l.minutes)} · {l.kind}
                      </span>
                    </span>
                    {l.completed ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" /> : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {loading && !hits ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="panel space-y-3 p-5">
              <SkeletonBlock className="h-10 w-10 rounded-md" />
              <SkeletonBlock className="h-4 w-3/4" />
              <SkeletonBlock className="h-3 w-full" />
              <SkeletonBlock className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<Search className="h-5 w-5" />}
          title="Nothing matches that filter"
          description="Try another category, or clear the search to see the whole library."
          action={
            <button
              onClick={() => {
                updateQuery("");
                setCategory("All");
              }}
              className="rounded-md border border-zinc-800 bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-white"
            >
              Reset filters
            </button>
          }
        />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((c) => (
            <Link key={c.slug} href={`/courses/${c.slug}`} className="panel panel-hover flex flex-col p-5">
              <div className="flex items-center gap-3">
                <CourseGlyph icon={c.icon} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{c.title}</p>
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                    {c.category} · {c.level}
                  </p>
                </div>
              </div>
              <p className="mt-4 flex-1 text-[13px] leading-6 text-zinc-400">{c.tagline}</p>
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>
                    {c.completed}/{c.lessons} lessons
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {minutesLabel(c.minutes)}
                  </span>
                </div>
                <ProgressBar value={c.completed} total={c.lessons} />
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {c.tags.slice(0, 3).map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
                {c.draft ? <Badge tone="amber">{c.draft} draft</Badge> : null}
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
