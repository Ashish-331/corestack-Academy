"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bookmark,
  ChevronRight,
  LayoutDashboard,
  Library,
  Loader2,
  NotebookPen,
  LogOut,
  Menu,
  Search,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { CourseGlyph, inputClass } from "@/components/ui";

export type ShellCourse = {
  slug: string;
  title: string;
  short: string;
  accent: string;
  icon: string;
  completed: number;
  lessons: number;
};

export type ShellUser = { id: number; name: string; email: string; role: string };

type SearchResults = {
  courses: { slug: string; title: string; short: string; accent: string; category: string }[];
  lessons: {
    id: number;
    slug: string;
    title: string;
    courseSlug: string;
    courseTitle: string;
    minutes: number;
    completed: boolean;
  }[];
};

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/catalog", label: "Catalog", icon: Library },
  { href: "/notes", label: "My notes", icon: NotebookPen },
  { href: "/bookmarks", label: "Saved lessons", icon: Bookmark },
];

export default function AppShell({
  user,
  courses,
  children,
}: {
  user: ShellUser;
  courses: ShellCourse[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [searching, setSearching] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal });
        if (!controller.signal.aborted) {
          setResults(res.ok ? ((await res.json()) as SearchResults) : null);
        }
      } catch {
        /* aborted */
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, 220);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  async function signOut() {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  function updateQuery(value: string) {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults(null);
      setSearching(false);
      return;
    }
    setResults(null);
    setSearching(true);
  }

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sidebar = (
    <div onClick={() => setOpen(false)} className="flex h-full flex-col gap-6 overflow-y-auto px-4 py-5">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-1">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-black text-white">
          CS
        </span>
        <span>
          <span className="block text-sm font-bold tracking-tight text-white">CoreStack Academy</span>
          <span className="block text-[11px] text-slate-400">CS fundamentals, tracked</span>
        </span>
      </Link>

      <nav className="space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-indigo-500/15 text-white ring-1 ring-indigo-400/30" : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
        {user.role === "admin" ? (
          <Link
            href="/admin"
            className={`focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              pathname.startsWith("/admin")
                ? "bg-amber-500/15 text-amber-100 ring-1 ring-amber-400/30"
                : "text-amber-200/80 hover:bg-white/5 hover:text-amber-100"
            }`}
          >
            <Settings2 className="h-4 w-4" />
            Author studio
          </Link>
        ) : null}
      </nav>

      <div>
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Courses</p>
        <div className="space-y-1">
          {courses.length === 0 ? (
            <p className="px-3 text-xs text-slate-500">No courses yet.</p>
          ) : (
            courses.map((c) => {
              const active = pathname.startsWith(`/courses/${c.slug}`);
              const pct = c.lessons ? Math.round((c.completed / c.lessons) * 100) : 0;
              return (
                <Link
                  key={c.slug}
                  href={`/courses/${c.slug}`}
                  className={`focus-ring group flex items-center gap-3 rounded-xl px-3 py-2 transition ${
                    active ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  <CourseGlyph icon={c.icon} accent={c.accent} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-slate-200">{c.title}</span>
                    <span className="mt-1 flex items-center gap-2">
                      <span className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                        <span className="block h-full rounded-full bg-gradient-to-r from-indigo-400 to-emerald-400" style={{ width: `${pct}%` }} />
                      </span>
                      <span className="shrink-0 text-[10px] tabular-nums text-slate-500">{pct}%</span>
                    </span>
                  </span>
                </Link>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-auto space-y-3 border-t border-white/10 pt-4">
        <div className="flex items-center gap-3 px-1">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-xs font-bold text-white">
            {initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-semibold text-slate-100">{user.name}</span>
            <span className="block truncate text-[11px] text-slate-500">{user.email}</span>
          </span>
        </div>
        <button
          onClick={signOut}
          disabled={signingOut}
          className="focus-ring flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-rose-200 disabled:opacity-60"
        >
          {signingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          Sign out
        </button>
        {user.role !== "admin" ? (
          <Link
            href="/admin-login"
            className="flex items-center justify-center gap-1.5 px-3 py-1 text-[11px] text-slate-500 transition hover:text-amber-300"
          >
            <ShieldCheck className="h-3 w-3" /> Author / Admin Sign In
          </Link>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="sticky top-0 hidden h-dvh border-r border-white/10 bg-slate-950/70 backdrop-blur lg:block">{sidebar}</aside>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button aria-label="Close navigation" onClick={() => setOpen(false)} className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />
          <div className="animate-fade-up absolute inset-y-0 left-0 w-[280px] border-r border-white/10 bg-slate-950">{sidebar}</div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur lg:px-8">
          <button onClick={() => setOpen(true)} className="focus-ring rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden" aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </button>

          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => updateQuery(e.target.value)}
              placeholder="Search lessons and courses…"
              className={`${inputClass} pl-9`}
            />
            {searching ? <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-500" /> : null}

            {results && query.trim().length >= 2 ? (
              <div className="animate-fade-up absolute left-0 right-0 top-full z-40 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl backdrop-blur">
                <button
                  onClick={() => {
                    setQuery("");
                    router.push(`/catalog?q=${encodeURIComponent(query.trim())}`);
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-indigo-200 hover:bg-white/5"
                >
                  See all results for “{query.trim()}” <ChevronRight className="h-4 w-4" />
                </button>

                {results.lessons.length === 0 && results.courses.length === 0 ? (
                  <p className="px-3 py-6 text-center text-sm text-slate-400">No matches. Try “deadlock”, “B+ tree” or “TCP”.</p>
                ) : null}

                {results.courses.length ? (
                  <>
                    <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Courses</p>
                    {results.courses.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/courses/${c.slug}`}
                        onClick={() => setQuery("")}
                        className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-white/5"
                      >
                        <CourseGlyph icon="library" accent={c.accent} size="sm" />
                        <span className="min-w-0">
                          <span className="block truncate text-sm text-slate-100">{c.title}</span>
                          <span className="block text-[11px] text-slate-500">{c.category}</span>
                        </span>
                      </Link>
                    ))}
                  </>
                ) : null}

                {results.lessons.length ? (
                  <>
                    <p className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Lessons</p>
                    {results.lessons.slice(0, 8).map((l) => (
                      <Link
                        key={l.id}
                        href={`/courses/${l.courseSlug}/${l.slug}`}
                        onClick={() => setQuery("")}
                        className="flex items-start gap-3 rounded-xl px-3 py-2 hover:bg-white/5"
                      >
                        <span className="mt-0.5 shrink-0 text-[10px] font-bold text-slate-500">{l.courseTitle.split(" ")[0]}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm text-slate-100">{l.title}</span>
                          <span className="block text-[11px] text-slate-500">
                            {l.minutes} min {l.completed ? "· completed" : ""}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Progress saved
            </span>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
