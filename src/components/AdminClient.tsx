"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  FilePlus2,
  Layers,
  Library,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { Badge, EmptyState, buttonClass, inputClass } from "@/components/ui";

export type AdminLesson = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  kind: string;
  draft: boolean;
  position: number;
  quizCount: number;
};
export type AdminModule = { id: number; title: string; summary: string; position: number; lessons: AdminLesson[] };
export type AdminCourse = {
  id: number;
  slug: string;
  title: string;
  short: string;
  tagline: string;
  description: string;
  category: string;
  level: string;
  accent: string;
  glow: string;
  tags: string[];
  outcomes: string[];
  author: string;
  published: boolean;
  modules: AdminModule[];
};

const emptyLessonForm = {
  title: "",
  summary: "",
  minutes: 15,
  kind: "reading",
  draft: false,
  contentHtml: "",
  quizzesJson: "[]",
};

export default function AdminClient({ courses }: { courses: AdminCourse[] }) {
  const router = useRouter();
  const [data, setData] = useState(courses);
  const [selectedId, setSelectedId] = useState<number | null>(courses[0]?.id ?? null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: "", slug: "", short: "", tagline: "" });
  const [creatingCourse, setCreatingCourse] = useState(false);
  const [openModules, setOpenModules] = useState<number[]>([]);
  const [editingLesson, setEditingLesson] = useState<{ id: number | "new"; moduleId: number } | null>(null);
  const [lessonForm, setLessonForm] = useState(emptyLessonForm);

  const selected = data.find((c) => c.id === selectedId) ?? null;

  function flash(message: string) {
    setError(message);
    setTimeout(() => setError(null), 4000);
  }

  async function call(url: string, method: string, body?: unknown) {
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const payload = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) throw new Error(payload.error ?? "Request failed");
    return payload as Record<string, unknown>;
  }

  /* ─────────────────────────── courses ─────────────────────────── */

  async function saveCourse() {
    if (!selected) return;
    setBusy(true);
    const before = data;
    try {
      await call(`/api/courses/${selected.slug}`, "PATCH", {
        title: selected.title,
        tagline: selected.tagline,
        description: selected.description,
        category: selected.category,
        level: selected.level,
        accent: selected.accent,
        glow: selected.glow,
        tags: selected.tags,
        outcomes: selected.outcomes,
        author: selected.author,
        published: selected.published,
      });
      router.refresh();
    } catch (e) {
      setData(before);
      flash(e instanceof Error ? e.message : "Could not save the course");
    } finally {
      setBusy(false);
    }
  }

  function patchCourseLocal(payload: Partial<AdminCourse>) {
    setData((d) => d.map((c) => (c.id === selectedId ? { ...c, ...payload } : c)));
  }

  async function createCourse() {
    if (!newCourse.title.trim() || !newCourse.slug.trim()) {
      flash("A title and slug are required");
      return;
    }
    setBusy(true);
    try {
      const res = (await call("/api/courses", "POST", {
        title: newCourse.title,
        slug: newCourse.slug,
        short: newCourse.short || newCourse.title.slice(0, 3).toUpperCase(),
        tagline: newCourse.tagline,
        firstModuleTitle: "Module 1",
      })) as { course?: { id: number } };
      const created: AdminCourse = {
        id: res.course?.id ?? -Date.now(),
        slug: newCourse.slug,
        title: newCourse.title,
        short: newCourse.short || newCourse.title.slice(0, 3).toUpperCase(),
        tagline: newCourse.tagline,
        description: "",
        category: "Programming",
        level: "Beginner",
        accent: "from-indigo-500 to-violet-500",
        glow: "shadow-indigo-500/30",
        tags: [],
        outcomes: [],
        author: "CoreStack",
        published: true,
        modules: [],
      };
      setData((d) => [...d, created]);
      setSelectedId(created.id);
      setNewCourse({ title: "", slug: "", short: "", tagline: "" });
      setCreatingCourse(false);
      router.refresh();
    } catch (e) {
      flash(e instanceof Error ? e.message : "Could not create the course");
    } finally {
      setBusy(false);
    }
  }

  async function deleteCourse(course: AdminCourse) {
    if (!confirm(`Delete “${course.title}” and all of its lessons? This cannot be undone.`)) return;
    const before = data;
    setData((d) => d.filter((c) => c.id !== course.id)); // optimistic
    if (selectedId === course.id) setSelectedId(null);
    try {
      await call(`/api/courses/${course.slug}`, "DELETE");
      router.refresh();
    } catch (e) {
      setData(before);
      setSelectedId(course.id);
      flash(e instanceof Error ? e.message : "Could not delete the course");
    }
  }

  /* ─────────────────────────── modules ─────────────────────────── */

  async function addModule(courseId: number) {
    const title = prompt("Module title");
    if (!title) return;
    setBusy(true);
    try {
      const res = (await call("/api/modules", "POST", { courseId, title, summary: "" })) as { module?: { id: number; position: number } };
      setData((d) =>
        d.map((c) =>
          c.id === courseId
            ? { ...c, modules: [...c.modules, { id: res.module?.id ?? -Date.now(), title, summary: "", position: res.module?.position ?? c.modules.length, lessons: [] }] }
            : c,
        ),
      );
      router.refresh();
    } catch (e) {
      flash(e instanceof Error ? e.message : "Could not add the module");
    } finally {
      setBusy(false);
    }
  }

  async function renameModule(courseId: number, moduleId: number, title: string) {
    if (!title.trim()) return;
    const before = data;
    setData((d) =>
      d.map((c) => (c.id === courseId ? { ...c, modules: c.modules.map((m) => (m.id === moduleId ? { ...m, title } : m)) } : c)),
    );
    try {
      const mod = before.find((c) => c.id === courseId)?.modules.find((m) => m.id === moduleId);
      await call("/api/modules", "PATCH", { id: moduleId, title, summary: mod?.summary ?? "" });
      router.refresh();
    } catch (e) {
      setData(before);
      flash(e instanceof Error ? e.message : "Could not rename the module");
    }
  }

  async function deleteModule(courseId: number, moduleId: number) {
    if (!confirm("Delete this module and its lessons?")) return;
    const before = data;
    setData((d) => d.map((c) => (c.id === courseId ? { ...c, modules: c.modules.filter((m) => m.id !== moduleId) } : c)));
    try {
      await call(`/api/modules?id=${moduleId}`, "DELETE");
      router.refresh();
    } catch (e) {
      setData(before);
      flash(e instanceof Error ? e.message : "Could not delete the module");
    }
  }

  /* ─────────────────────────── lessons ─────────────────────────── */

  function openNewLesson(moduleId: number) {
    setEditingLesson({ id: "new", moduleId });
    setLessonForm({ ...emptyLessonForm });
  }

  async function openExistingLesson(lesson: AdminLesson) {
    setEditingLesson({ id: lesson.id, moduleId: -1 });
    setLessonForm({
      title: lesson.title,
      summary: lesson.summary,
      minutes: lesson.minutes,
      kind: lesson.kind,
      draft: lesson.draft,
      contentHtml: "",
      quizzesJson: "[]",
    });
    setBusy(true);
    try {
      const res = (await call(`/api/lessons/${lesson.id}`, "GET")) as {
        lesson?: { contentHtml: string; summary: string };
        quizzes?: { q: string; options: string[]; answer: number; explain: string }[];
      };
      setLessonForm((f) => ({
        ...f,
        contentHtml: res.lesson?.contentHtml ?? "",
        summary: res.lesson?.summary ?? lesson.summary,
        quizzesJson: JSON.stringify(res.quizzes ?? [], null, 2),
      }));
    } catch (e) {
      flash(e instanceof Error ? e.message : "Could not load the lesson");
    } finally {
      setBusy(false);
    }
  }

  async function saveLesson() {
    if (!editingLesson) return;
    let quizzes: unknown;
    try {
      quizzes = JSON.parse(lessonForm.quizzesJson || "[]");
    } catch {
      flash("Quizzes must be valid JSON");
      return;
    }
    setBusy(true);
    const payload = {
      title: lessonForm.title,
      summary: lessonForm.summary,
      minutes: Number(lessonForm.minutes) || 15,
      kind: lessonForm.kind,
      draft: lessonForm.draft,
      contentHtml: lessonForm.contentHtml,
      quizzes,
    };
    try {
      if (editingLesson.id === "new") {
        await call("/api/lessons", "POST", { ...payload, moduleId: editingLesson.moduleId });
      } else {
        await call(`/api/lessons/${editingLesson.id}`, "PATCH", payload);
      }
      setEditingLesson(null);
      router.refresh();
    } catch (e) {
      flash(e instanceof Error ? e.message : "Could not save the lesson");
    } finally {
      setBusy(false);
    }
  }

  async function deleteLesson(courseId: number, moduleId: number, lessonId: number) {
    if (!confirm("Delete this lesson?")) return;
    const before = data;
    setData((d) =>
      d.map((c) =>
        c.id === courseId
          ? { ...c, modules: c.modules.map((m) => (m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m)) }
          : c,
      ),
    );
    try {
      await call(`/api/lessons/${lessonId}`, "DELETE");
      router.refresh();
    } catch (e) {
      setData(before);
      flash(e instanceof Error ? e.message : "Could not delete the lesson");
    }
  }

  /* ─────────────────────────── render ─────────────────────────── */

  const input = (label: string, key: keyof AdminCourse, type = "text") => (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</span>
      <input
        type={type}
        value={String(selected?.[key] ?? "")}
        onChange={(e) => patchCourseLocal({ [key]: e.target.value } as Partial<AdminCourse>)}
        className={inputClass}
      />
    </label>
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="animate-fade-up flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">Author studio</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">Catalog CRUD</h1>
          <p className="mt-1.5 text-sm text-slate-400">Create courses, structure modules, and write lesson bodies. Lesson HTML is sanitised on save.</p>
        </div>
        <button onClick={() => setCreatingCourse((v) => !v)} className={buttonClass("primary")}>
          {creatingCourse ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />} New course
        </button>
      </header>

      {error ? (
        <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-200" role="alert">
          {error}
        </p>
      ) : null}

      {creatingCourse ? (
        <div className="panel animate-fade-up grid gap-3 p-5 sm:grid-cols-2">
          <input value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} placeholder="Course title" className={inputClass} />
          <input value={newCourse.slug} onChange={(e) => setNewCourse({ ...newCourse, slug: e.target.value })} placeholder="slug-e-g-distributed-systems" className={inputClass} />
          <input value={newCourse.short} onChange={(e) => setNewCourse({ ...newCourse, short: e.target.value })} placeholder="Short code (DS)" className={inputClass} />
          <input value={newCourse.tagline} onChange={(e) => setNewCourse({ ...newCourse, tagline: e.target.value })} placeholder="One-line tagline" className={inputClass} />
          <div className="sm:col-span-2 flex justify-end">
            <button onClick={createCourse} disabled={busy} className={buttonClass("primary")}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Create course
            </button>
          </div>
        </div>
      ) : null}

      {data.length === 0 ? (
        <EmptyState icon={<Library className="h-5 w-5" />} title="No courses yet" description="Create your first course to start authoring modules and lessons." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="panel h-fit p-3">
            <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Courses</p>
            <ul className="space-y-1">
              {data.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setSelectedId(c.id)}
                    className={`focus-ring flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${
                      selectedId === c.id ? "bg-amber-400/10 text-amber-100 ring-1 ring-amber-400/25" : "text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    <BookOpen className="h-4 w-4 shrink-0 opacity-70" />
                    <span className="min-w-0 flex-1 truncate">{c.title}</span>
                    <span className="shrink-0 text-[10px] text-slate-500">{c.modules.reduce((n, m) => n + m.lessons.length, 0)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {selected ? (
            <div className="space-y-5">
              <section className="panel p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                    <Pencil className="h-3.5 w-3.5" /> Course details
                  </h2>
                  <div className="flex items-center gap-2">
                    <Badge tone={selected.published ? "emerald" : "amber"}>{selected.published ? "published" : "hidden"}</Badge>
                    <button onClick={() => deleteCourse(selected)} className={buttonClass("danger", "px-3 py-1.5 text-xs")}>
                      <Trash2 className="h-3.5 w-3.5" /> Delete course
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {input("Title", "title")}
                  {input("Slug", "slug")}
                  {input("Short code", "short")}
                  {input("Author", "author")}
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Tagline</span>
                    <input value={selected.tagline} onChange={(e) => patchCourseLocal({ tagline: e.target.value })} className={inputClass} />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Description</span>
                    <textarea value={selected.description} onChange={(e) => patchCourseLocal({ description: e.target.value })} rows={3} className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Category</span>
                    <select value={selected.category} onChange={(e) => patchCourseLocal({ category: e.target.value })} className={inputClass}>
                      {["Systems", "Data", "Architecture", "Networks", "Programming"].map((c) => (
                        <option key={c} value={c} className="bg-slate-900">
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Level</span>
                    <select value={selected.level} onChange={(e) => patchCourseLocal({ level: e.target.value })} className={inputClass}>
                      {["Beginner", "Intermediate", "Advanced"].map((c) => (
                        <option key={c} value={c} className="bg-slate-900">
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Tags (comma separated)</span>
                    <input
                      value={selected.tags.join(", ")}
                      onChange={(e) => patchCourseLocal({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
                      className={inputClass}
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Outcomes (one per line)</span>
                    <textarea
                      value={selected.outcomes.join("\n")}
                      onChange={(e) => patchCourseLocal({ outcomes: e.target.value.split("\n").map((t) => t.trim()).filter(Boolean) })}
                      rows={3}
                      className={inputClass}
                    />
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input type="checkbox" checked={selected.published} onChange={(e) => patchCourseLocal({ published: e.target.checked })} className="h-4 w-4 rounded border-white/20 bg-slate-900" />
                    Published
                  </label>
                </div>

                <div className="mt-4 flex justify-end">
                  <button onClick={saveCourse} disabled={busy} className={buttonClass("primary")}>
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save course
                  </button>
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                    <Layers className="h-3.5 w-3.5" /> Modules & lessons
                  </h2>
                  <button onClick={() => addModule(selected.id)} disabled={busy} className={buttonClass("secondary", "px-3 py-1.5 text-xs")}>
                    <Plus className="h-3.5 w-3.5" /> Add module
                  </button>
                </div>

                {selected.modules.length === 0 ? (
                  <EmptyState icon={<Layers className="h-5 w-5" />} title="No modules yet" description="Add a module, then add lessons to it." />
                ) : (
                  selected.modules.map((mod) => {
                    const open = openModules.includes(mod.id);
                    return (
                      <div key={mod.id} className="panel overflow-hidden">
                        <div className="flex items-center gap-3 px-4 py-3">
                          <button onClick={() => setOpenModules((p) => (open ? p.filter((x) => x !== mod.id) : [...p, mod.id]))} className="focus-ring flex min-w-0 flex-1 items-center gap-2 text-left">
                            <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition ${open ? "rotate-180" : ""}`} />
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-semibold text-white">{mod.title}</span>
                              <span className="block text-[11px] text-slate-500">{mod.lessons.length} lessons</span>
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              const next = prompt("Rename module", mod.title);
                              if (next) renameModule(selected.id, mod.id, next);
                            }}
                            className="focus-ring rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-slate-100"
                            title="Rename"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => deleteModule(selected.id, mod.id)} className="focus-ring rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-rose-300" title="Delete">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {open ? (
                          <ul className="animate-fade-up divide-y divide-white/5 border-t border-white/5">
                            {mod.lessons.map((lesson) => (
                              <li key={lesson.id} className="flex flex-wrap items-center gap-3 px-4 py-2.5">
                                <span className="min-w-0 flex-1">
                                  <span className="flex items-center gap-2">
                                    <span className="truncate text-[13px] text-slate-200">{lesson.title}</span>
                                    {lesson.draft ? <Badge tone="amber">draft</Badge> : null}
                                  </span>
                                  <span className="block text-[11px] text-slate-500">
                                    {lesson.minutes} min · {lesson.kind} · {lesson.quizCount} quizzes
                                  </span>
                                </span>
                                <button onClick={() => openExistingLesson(lesson)} className={buttonClass("secondary", "px-2.5 py-1.5 text-[11px]")}>
                                  Edit
                                </button>
                                <button onClick={() => deleteLesson(selected.id, mod.id, lesson.id)} className={buttonClass("danger", "px-2.5 py-1.5 text-[11px]")}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </li>
                            ))}
                            <li className="px-4 py-3">
                              <button onClick={() => openNewLesson(mod.id)} className={buttonClass("secondary", "px-3 py-1.5 text-xs")}>
                                <FilePlus2 className="h-3.5 w-3.5" /> Add lesson
                              </button>
                            </li>
                          </ul>
                        ) : null}
                      </div>
                    );
                  })
                )}
              </section>

              {editingLesson ? (
                <section className="panel animate-fade-up space-y-3 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">{editingLesson.id === "new" ? "New lesson" : "Edit lesson"}</h3>
                    <button onClick={() => setEditingLesson(null)} className={buttonClass("ghost", "px-2.5 py-1.5 text-xs")}>
                      <X className="h-3.5 w-3.5" /> Close
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <input value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} placeholder="Lesson title" className={inputClass} />
                    <input value={lessonForm.summary} onChange={(e) => setLessonForm({ ...lessonForm, summary: e.target.value })} placeholder="Summary" className={inputClass} />
                    <input
                      type="number"
                      min={1}
                      value={lessonForm.minutes}
                      onChange={(e) => setLessonForm({ ...lessonForm, minutes: Number(e.target.value) })}
                      className={inputClass}
                    />
                    <select value={lessonForm.kind} onChange={(e) => setLessonForm({ ...lessonForm, kind: e.target.value })} className={inputClass}>
                      {["reading", "lab", "case", "quiz"].map((k) => (
                        <option key={k} value={k} className="bg-slate-900">
                          {k}
                        </option>
                      ))}
                    </select>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input type="checkbox" checked={lessonForm.draft} onChange={(e) => setLessonForm({ ...lessonForm, draft: e.target.checked })} className="h-4 w-4 rounded border-white/20 bg-slate-900" />
                    Draft (learners see a clear “not authored yet” notice)
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Lesson HTML — allowed: p, h1-h6, ul/ol/li, table, pre/code, blockquote, .lead, .callout
                    </span>
                    <textarea
                      value={lessonForm.contentHtml}
                      onChange={(e) => setLessonForm({ ...lessonForm, contentHtml: e.target.value })}
                      rows={14}
                      className={`${inputClass} font-mono text-[12.5px]`}
                      placeholder="<p class='lead'>…</p>"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Quizzes JSON — [{"{ q, options[], answer, explain }"}]
                    </span>
                    <textarea
                      value={lessonForm.quizzesJson}
                      onChange={(e) => setLessonForm({ ...lessonForm, quizzesJson: e.target.value })}
                      rows={6}
                      className={`${inputClass} font-mono text-[12.5px]`}
                    />
                  </label>

                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <TriangleAlert className="h-3 w-3 text-amber-300" /> Script tags and event handlers are stripped automatically.
                    </p>
                    <button onClick={saveLesson} disabled={busy} className={buttonClass("primary")}>
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save lesson
                    </button>
                  </div>
                </section>
              ) : null}
            </div>
          ) : (
            <EmptyState icon={<Library className="h-5 w-5" />} title="Pick a course" description="Select a course on the left to edit its details, modules and lessons." />
          )}
        </div>
      )}
    </div>
  );
}
