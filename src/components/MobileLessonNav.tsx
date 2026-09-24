"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  ListTree,
  X,
} from "lucide-react";
import { CourseGlyph, minutesLabel } from "@/components/ui";

export type MobileNavModule = {
  id: number;
  title: string;
  summary: string;
  lessons: {
    id: number;
    slug: string;
    title: string;
    minutes: number;
    kind: string;
    draft: boolean;
    status: string | null;
  }[];
};

export type MobileLessonNavProps = {
  course: { slug: string; title: string; short: string; icon: string };
  modules: MobileNavModule[];
  currentLessonSlug: string;
  currentLessonIndex: number;
  totalLessons: number;
  toc: { id: string; text: string }[];
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
};

export function MobileLessonNav({
  course,
  modules,
  currentLessonSlug,
  currentLessonIndex,
  totalLessons,
  toc,
  prev,
  next,
}: MobileLessonNavProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"syllabus" | "toc">("syllabus");
  const [openModuleIds, setOpenModuleIds] = useState<number[]>(() => {
    // Open the module containing current lesson
    const currentMod = modules.find((m) => m.lessons.some((l) => l.slug === currentLessonSlug));
    return currentMod ? [currentMod.id] : modules[0] ? [modules[0].id] : [];
  });

  // Lock body scroll and listen for escape key when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setDrawerOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [drawerOpen]);

  function toggleModule(id: number) {
    setOpenModuleIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleHeadingClick(id: string) {
    setDrawerOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 80);
  }

  return (
    <>
      {/* ── Floating Mobile Action Bar ────────────────────────────── */}
      <nav
        aria-label="Mobile course navigation"
        className="fixed bottom-3 inset-x-3 z-40 mx-auto flex max-w-md items-center justify-between gap-1.5 rounded-full border border-zinc-800 bg-zinc-950/90 p-1.5 shadow-2xl backdrop-blur-md lg:hidden"
      >
        <button
          type="button"
          onClick={() => {
            setActiveTab("syllabus");
            setDrawerOpen(true);
          }}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-zinc-100 hover:bg-zinc-900 active:bg-zinc-800 transition"
        >
          <BookOpen className="h-4 w-4 shrink-0 text-zinc-400" />
          <span className="truncate">
            Lesson {currentLessonIndex + 1}/{totalLessons} · Syllabus
          </span>
        </button>

        {toc.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              setActiveTab("toc");
              setDrawerOpen(true);
            }}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white active:bg-zinc-800 transition"
          >
            <ListTree className="h-3.5 w-3.5 text-zinc-400" />
            <span>TOC</span>
          </button>
        ) : null}

        <div className="flex shrink-0 items-center gap-1 border-l border-zinc-800 pl-1">
          {prev ? (
            <Link
              href={`/courses/${course.slug}/${prev.slug}`}
              className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 active:bg-zinc-800 transition"
              title={`Previous: ${prev.title}`}
              aria-label="Previous lesson"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-700">
              <ArrowLeft className="h-4 w-4" />
            </span>
          )}

          {next ? (
            <Link
              href={`/courses/${course.slug}/${next.slug}`}
              className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 active:bg-zinc-800 transition"
              title={`Next: ${next.title}`}
              aria-label="Next lesson"
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-700">
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </div>
      </nav>

      {/* ── Slide-up Bottom Sheet Drawer ─────────────────────────── */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 lg:hidden ${
          drawerOpen ? "visible opacity-100 pointer-events-auto" : "invisible opacity-0 pointer-events-none"
        }`}
        aria-hidden={!drawerOpen}
      >
        {/* Backdrop */}
        <div
          onClick={() => setDrawerOpen(false)}
          className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm transition-opacity duration-300"
          aria-label="Close navigation sheet"
        />

        {/* Sheet Content */}
        <div
          className={`absolute inset-x-0 bottom-0 flex max-h-[82vh] flex-col rounded-t-2xl border-t border-zinc-800 bg-zinc-950 shadow-2xl transition-transform duration-300 ease-out ${
            drawerOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Grab handle */}
          <div className="flex justify-center pt-2.5 pb-1">
            <span className="h-1.5 w-12 rounded-full bg-zinc-800" />
          </div>

          {/* Sheet Header */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 px-4 py-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <CourseGlyph icon={course.icon} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white">{course.title}</p>
                <p className="text-[11px] text-zinc-400">
                  Lesson {currentLessonIndex + 1} of {totalLessons}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="focus-ring rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white"
              aria-label="Close drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex border-b border-zinc-800/80 px-4 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab("syllabus")}
              className={`flex-1 pb-2.5 text-center text-xs font-semibold transition border-b-2 ${
                activeTab === "syllabus"
                  ? "border-zinc-200 text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Course Syllabus ({totalLessons})
            </button>
            {toc.length > 0 ? (
              <button
                type="button"
                onClick={() => setActiveTab("toc")}
                className={`flex-1 pb-2.5 text-center text-xs font-semibold transition border-b-2 ${
                  activeTab === "toc"
                    ? "border-zinc-200 text-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                On This Page ({toc.length})
              </button>
            ) : null}
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4" style={{ WebkitOverflowScrolling: "touch" }}>
            {activeTab === "syllabus" ? (
              <div className="space-y-3">
                {modules.map((mod, modIdx) => {
                  const isOpen = openModuleIds.includes(mod.id);
                  const completedCount = mod.lessons.filter((l) => l.status === "completed").length;
                  return (
                    <div key={mod.id} className="panel overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleModule(mod.id)}
                        className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left hover:bg-zinc-900/60 active:bg-zinc-900"
                      >
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded border border-zinc-800 bg-zinc-900 text-xs font-semibold text-zinc-400">
                          {modIdx + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-semibold text-zinc-200">
                            {mod.title}
                          </span>
                          <span className="block text-[10px] text-zinc-500">
                            {completedCount}/{mod.lessons.length} completed
                          </span>
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen ? (
                        <ul className="divide-y divide-zinc-800/60 border-t border-zinc-800/60 bg-zinc-950/40">
                          {mod.lessons.map((lesson) => {
                            const isCurrent = lesson.slug === currentLessonSlug;
                            const isDone = lesson.status === "completed";
                            return (
                              <li key={lesson.id}>
                                <Link
                                  href={`/courses/${course.slug}/${lesson.slug}`}
                                  onClick={() => setDrawerOpen(false)}
                                  className={`flex items-center gap-3 px-4 py-3 text-left transition ${
                                    isCurrent
                                      ? "bg-zinc-800/80 text-white font-medium"
                                      : "hover:bg-zinc-900/40 active:bg-zinc-900 text-zinc-300"
                                  }`}
                                >
                                  {isDone ? (
                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                                  ) : (
                                    <Circle
                                      className={`h-4 w-4 shrink-0 ${
                                        isCurrent ? "text-zinc-300" : "text-zinc-600"
                                      }`}
                                    />
                                  )}
                                  <span className="min-w-0 flex-1">
                                    <span
                                      className={`block truncate text-xs ${
                                        isCurrent ? "font-semibold text-white" : "text-zinc-300"
                                      }`}
                                    >
                                      {lesson.title}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                                      <Clock className="h-2.5 w-2.5" /> {minutesLabel(lesson.minutes)}
                                      {lesson.draft ? (
                                        <span className="rounded bg-amber-950/50 px-1 py-0.2 text-[9px] text-amber-300">
                                          draft
                                        </span>
                                      ) : null}
                                    </span>
                                  </span>
                                  {isCurrent ? (
                                    <span className="shrink-0 rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-300">
                                      Current
                                    </span>
                                  ) : null}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-1">
                <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  Headings in this lesson
                </p>
                {toc.map((t, idx) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleHeadingClick(t.id)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs text-zinc-300 hover:bg-zinc-900 active:bg-zinc-800 transition min-h-[44px]"
                  >
                    <span className="font-mono text-[10px] text-zinc-500">{idx + 1}.</span>
                    <span className="truncate">{t.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
