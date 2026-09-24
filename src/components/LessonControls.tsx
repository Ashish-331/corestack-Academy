"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck, Check, CheckCircle2, ChevronDown, Circle, Clock, Loader2 } from "lucide-react";
import { minutesLabel } from "@/components/ui";

/* ─────────────────── optimistic completion toggle ─────────────────── */

export function CompleteButton({
  lessonId,
  initialStatus,
  size = "md",
  labels = true,
}: {
  lessonId: number;
  initialStatus: string | null;
  size?: "sm" | "md";
  labels?: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [pending, setPending] = useState(false);
  const [, startTransition] = useTransition();
  const done = status === "completed";

  async function toggle() {
    const next = done ? "reset" : "completed";
    const prev = status;
    setStatus(next === "reset" ? null : "completed"); // optimistic
    setPending(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, status: next }),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { status: string | null };
      setStatus(data.status);
      startTransition(() => router.refresh());
    } catch {
      setStatus(prev); // roll back
    } finally {
      setPending(false);
    }
  }

  const pad = size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs";

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`focus-ring inline-flex shrink-0 items-center gap-1.5 rounded-md font-medium transition disabled:opacity-60 ${pad} ${
        done ? "border border-emerald-800/80 bg-emerald-950/40 text-emerald-200" : "border border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/60"
      }`}
      aria-pressed={done}
    >
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
      {labels ? (done ? "Completed" : "Mark complete") : null}
    </button>
  );
}

export function BookmarkButton({ lessonId, initial, withLabel = false }: { lessonId: number; initial: boolean; withLabel?: boolean }) {
  const [saved, setSaved] = useState(initial);
  const [pending, setPending] = useState(false);

  async function toggle() {
    const prev = saved;
    setSaved(!prev); // optimistic
    setPending(true);
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { bookmarked: boolean };
      setSaved(data.bookmarked);
    } catch {
      setSaved(prev);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      title={saved ? "Remove from saved" : "Save for later"}
      className={`focus-ring inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition disabled:opacity-60 ${
        saved ? "border border-amber-800/80 bg-amber-950/40 text-amber-200" : "border border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/60"
      }`}
    >
      {pending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : saved ? (
        <BookmarkCheck className="h-3.5 w-3.5" />
      ) : (
        <Bookmark className="h-3.5 w-3.5" />
      )}
      {withLabel ? (saved ? "Saved" : "Save") : null}
    </button>
  );
}

/* ─────────────────── course outline / lesson tree ─────────────────── */

export type TreeLesson = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  kind: string;
  draft: boolean;
  status: string | null;
  bookmarked: boolean;
};

export type TreeModule = { id: number; title: string; summary: string; lessons: TreeLesson[] };

export function LessonTree({ modules, courseSlug }: { modules: TreeModule[]; courseSlug: string }) {
  const firstIncomplete = modules.flatMap((m) => m.lessons).find((l) => l.status !== "completed");
  const [openIds, setOpenIds] = useState<number[]>(
    modules.filter((m) => m.lessons.some((l) => l.id === firstIncomplete?.id)).map((m) => m.id),
  );
  const [overrides, setOverrides] = useState<Record<number, string | null>>({});
  const [pendingId, setPendingId] = useState<number | null>(null);

  function toggleModule(id: number) {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function toggleDone(lesson: TreeLesson) {
    const next = (overrides[lesson.id] ?? lesson.status) === "completed" ? "reset" : "completed";
    const key = lesson.id;
    const prevValue = overrides[key] ?? lesson.status;
    setOverrides((p) => ({ ...p, [key]: next === "reset" ? null : "completed" })); // optimistic
    setPendingId(key);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: key, status: next }),
      });
      if (!res.ok) throw new Error("failed");
    } catch {
      setOverrides((p) => ({ ...p, [key]: prevValue }));
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-3">
      {modules.map((mod, i) => {
        const done = mod.lessons.filter((l) => (overrides[l.id] ?? l.status) === "completed").length;
        const open = openIds.includes(mod.id);
        return (
          <div key={mod.id} className="panel overflow-hidden">
            <button onClick={() => toggleModule(mod.id)} className="focus-ring flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-zinc-800/40">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded border border-zinc-800 bg-zinc-900 text-xs font-semibold text-zinc-300">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-white">{mod.title}</span>
                <span className="block truncate text-xs text-zinc-500">{mod.summary || `${mod.lessons.length} lessons`}</span>
              </span>
              <span className="shrink-0 text-[11px] font-semibold tabular-nums text-zinc-400">
                {done}/{mod.lessons.length}
              </span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-zinc-500 transition ${open ? "rotate-180" : ""}`} />
            </button>

            {open ? (
              <ul className="divide-y divide-zinc-800/60 border-t border-zinc-800/60">
                {mod.lessons.map((lesson) => {
                  const status = overrides[lesson.id] ?? lesson.status;
                  return (
                    <li key={lesson.id} className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-zinc-800/30">
                      <button
                        onClick={() => toggleDone(lesson)}
                        disabled={pendingId === lesson.id}
                        title={status === "completed" ? "Mark as not done" : "Mark complete"}
                        className="focus-ring shrink-0 disabled:opacity-50"
                        aria-label={status === "completed" ? "Mark incomplete" : "Mark complete"}
                      >
                        {pendingId === lesson.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                        ) : status === "completed" ? (
                          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                        ) : (
                          <Circle className="h-4.5 w-4.5 text-zinc-600" />
                        )}
                      </button>
                      <Link href={`/courses/${courseSlug}/${lesson.slug}`} className="min-w-0 flex-1">
                        <span className={`block truncate text-sm ${status === "completed" ? "text-zinc-500 line-through decoration-zinc-700" : "text-zinc-200"}`}>
                          {lesson.title}
                        </span>
                        <span className="flex items-center gap-2 text-[11px] text-zinc-500">
                          <Clock className="h-3 w-3" /> {minutesLabel(lesson.minutes)}
                          <span className="rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[10px] capitalize text-zinc-400">{lesson.kind}</span>
                          {lesson.draft ? <span className="rounded border border-amber-900/60 bg-amber-950/40 px-1.5 py-0.5 text-[10px] text-amber-300">draft</span> : null}
                        </span>
                      </Link>
                      {lesson.bookmarked ? <Bookmark className="h-3.5 w-3.5 shrink-0 text-amber-400/80" /> : null}
                      {status === "completed" ? <Check className="h-4 w-4 shrink-0 text-emerald-400/60" /> : null}
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
