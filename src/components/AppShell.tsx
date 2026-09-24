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
        <span className="grid h-8 w-8 place-items-center rounded-md border border-zinc-800 bg-zinc-900 text-xs font-bold text-zinc-100">
          CS
        </span>
        <span>
          <span className="block text-sm font-bold tracking-tight text-white">CoreStack Academy</span>
          <span className="block text-[11px] text-zinc-400">CS fundamentals, tracked</span>
        </span>
      </Link>

      <nav className="space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`focus-ring flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active ? "bg-zinc-800 text-zinc-100 font-medium" : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
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
            className={`focus-ring flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
              pathname.startsWith("/admin")
                ? "bg-zinc-800 text-zinc-100 font-medium"
                : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
            }`}
          >
            <Settings2 className="h-4 w-4" />
            Author studio
          </Link>
        ) : null}
      </nav>

      <div>
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Courses</p>
        <div className="space-y-1">
          {courses.length === 0 ? (
            <p className="px-3 text-xs text-zinc-500">No courses yet.</p>
          ) : (
            courses.map((c) => {
              const active = pathname.startsWith(`/courses/${c.slug}`);
              const pct = c.lessons ? Math.round((c.completed / c.lessons) * 100) : 0;
              return (
                <Link
                  key={c.slug}
                  href={`/courses/${c.slug}`}
                  className={`focus-ring group flex items-center gap-3 rounded-lg px-3 py-2 transition ${
                    active ? "bg-zinc-800/80 text-zinc-100" : "hover:bg-zinc-900/60"
                  }`}
                >
                  <CourseGlyph icon={c.icon} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-zinc-200">{c.title}</span>
                    <span className="mt-1 flex items-center gap-2">
                      <span className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
                        <span className="block h-full rounded-full bg-zinc-300" style={{ width: `${pct}%` }} />
                      </span>
                      <span className="shrink-0 text-[10px] tabular-nums text-zinc-500">{pct}%</span>
                    </span>
                  </span>
                </Link>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-auto space-y-3 border-t border-zinc-800 pt-4">
        <div className="flex items-center gap-3 px-1">
          <span className="grid h-8 w-8 place-items-center rounded-md border border-zinc-800 bg-zinc-900 text-xs font-medium text-zinc-300">
            {initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-medium text-zinc-200">{user.name}</span>
            <span className="block truncate text-[11px] text-zinc-500">{user.email}</span>
          </span>
        </div>
        <button
          onClick={signOut}
          disabled={signingOut}
          className="focus-ring flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-zinc-900/60 hover:text-zinc-200 disabled:opacity-60"
        >
          {signingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          Sign out
        </button>
        {user.role !== "admin" ? (
          <Link
            href="/admin-login"
            className="flex items-center justify-center gap-1.5 px-3 py-1 text-[11px] text-zinc-500 transition hover:text-zinc-300"
          >
            <ShieldCheck className="h-3 w-3" /> Author / Admin Sign In
          </Link>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="sticky top-0 hidden h-dvh border-r border-zinc-800/80 bg-zinc-950 lg:block">{sidebar}</aside>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button aria-label="Close navigation" onClick={() => setOpen(false)} className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" />
          <div className="absolute inset-y-0 left-0 w-[280px] border-r border-zinc-800 bg-zinc-950">{sidebar}</div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-zinc-800/80 bg-zinc-950/90 px-4 py-3 backdrop-blur lg:px-8">
          <button onClick={() => setOpen(true)} className="focus-ring rounded-lg p-2 text-zinc-300 hover:bg-zinc-900 lg:hidden" aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </button>

          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => updateQuery(e.target.value)}
              placeholder="Search lessons and courses…"
              className={`${inputClass} pl-9`}
            />
            {searching ? <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-zinc-500" /> : null}

            {results && query.trim().length >= 2 ? (
              <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-[70vh] overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900 p-2 shadow-2xl">
                <button
                  onClick={() => {
                    setQuery("");
                    router.push(`/catalog?q=${encodeURIComponent(query.trim())}`);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-800/60"
                >
                  See all results for “{query.trim()}” <ChevronRight className="h-4 w-4" />
                </button>

                {results.lessons.length === 0 && results.courses.length === 0 ? (
                  <p className="px-3 py-6 text-center text-sm text-zinc-400">No matches. Try “deadlock”, “B+ tree” or “TCP”.</p>
                ) : null}

                {results.courses.length ? (
                  <>
                    <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Courses</p>
                    {results.courses.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/courses/${c.slug}`}
                        onClick={() => setQuery("")}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-zinc-800/60"
                      >
                        <CourseGlyph icon="library" size="sm" />
                        <span className="min-w-0">
                          <span className="block truncate text-sm text-zinc-100">{c.title}</span>
                          <span className="block text-[11px] text-zinc-500">{c.category}</span>
                        </span>
                      </Link>
                    ))}
                  </>
                ) : null}

                {results.lessons.length ? (
                  <>
                    <p className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Lessons</p>
                    {results.lessons.slice(0, 8).map((l) => (
                      <Link
                        key={l.id}
                        href={`/courses/${l.courseSlug}/${l.slug}`}
                        onClick={() => setQuery("")}
                        className="flex items-start gap-3 rounded-lg px-3 py-2 hover:bg-zinc-800/60"
                      >
                        <span className="mt-0.5 shrink-0 text-[10px] font-bold text-zinc-500">{l.courseTitle.split(" ")[0]}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm text-zinc-100">{l.title}</span>
                          <span className="block text-[11px] text-zinc-500">
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
            <span className="hidden items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-300 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Progress saved
            </span>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
