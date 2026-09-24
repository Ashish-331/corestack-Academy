"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Code2,
  Eye,
  FileCode,
  FilePlus2,
  FileText,
  HelpCircle,
  Layers,
  Library,
  Lightbulb,
  Loader2,
  Pencil,
  Plus,
  Save,
  Table,
  Trash2,
  TriangleAlert,
  Upload,
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

const SAMPLE_COURSE_HTML = `<h1>Advanced Distributed Systems</h1>
<p class="lead">Master consensus algorithms, fault-tolerant replication, and high-scale architecture patterns.</p>

<h2>Module 1: Consensus Foundations</h2>
<h3>1. The Consensus Problem &amp; FLP Impossibility</h3>
<p class="lead">Why agreement in asynchronous distributed systems is fundamentally challenging.</p>
<p>In distributed computing, achieving consensus among independent nodes is essential for transactions, leader election, and state machine replication.</p>
<div class="callout">
  <strong>The FLP Theorem:</strong> In an asynchronous network, no deterministic consensus protocol can guarantee both safety and liveness in the presence of even a single unannounced crash failure.
</div>
<div class="callout analogy">
  <strong>Real-World Analogy:</strong> Think of a group of friends trying to decide on dinner via text messages when one person's battery might die at any moment without warning.
</div>

<h3>2. Paxos &amp; Two-Phase Commit</h3>
<p class="lead">Comparing atomic commitment with replicated state consensus.</p>
<p>While 2PC provides atomicity across heterogeneous resources, it is a blocking protocol. Paxos avoids blocking by requiring only a majority quorum.</p>
<div class="overflow-x-auto">
<table>
  <thead>
    <tr><th>Protocol</th><th>Quorum Type</th><th>Blocking Behavior</th><th>Tolerance</th></tr>
  </thead>
  <tbody>
    <tr><td>Two-Phase Commit (2PC)</td><td>All nodes (100%)</td><td>Blocking on coordinator failure</td><td>Zero crashes</td></tr>
    <tr><td>Raft / Multi-Paxos</td><td>Majority (2F + 1)</td><td>Non-blocking as long as quorum lives</td><td>F crashes</td></tr>
  </tbody>
</table>
</div>

<h2>Module 2: Log Replication &amp; State Machines</h2>
<h3>1. The Raft Consensus Algorithm</h3>
<p class="lead">Deconstructing consensus into understandable sub-problems: leader election, log replication, and safety.</p>
<p>Raft structures time into terms of arbitrary length, each starting with an election.</p>
<pre><code class="language-typescript">interface RaftNode {
  currentTerm: number;
  votedFor: string | null;
  state: "leader" | "follower" | "candidate";
  log: LogEntry[];
}
</code></pre>
`;

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

  // Lesson editor tabs & preview
  const [editorTab, setEditorTab] = useState<"write" | "preview">("write");
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [loadingPreview, setLoadingPreview] = useState<boolean>(false);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // HTML Import Modal state
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importMode, setImportMode] = useState<"new_course" | "existing_course">("new_course");
  const [importForm, setImportForm] = useState({
    title: "",
    slug: "",
    short: "",
    tagline: "",
    description: "",
    category: "Systems" as "Systems" | "Data" | "Architecture" | "Networks" | "Programming",
    level: "Intermediate" as "Beginner" | "Intermediate" | "Advanced",
    accent: "from-zinc-700 to-zinc-900",
    glow: "shadow-zinc-700/20",
    courseId: courses[0]?.id || 0,
    moduleId: 0,
    html: "",
    structureMode: "auto" as "auto" | "single_lesson" | "by_headings",
    defaultLessonTitle: "",
  });
  const [importing, setImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        accent: "from-zinc-700 to-zinc-900",
        glow: "shadow-zinc-700/20",
        tags: [],
        outcomes: [],
        author: "CoreStack Academy",
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
      const res = (await call("/api/modules", "POST", { courseId, title, summary: "" })) as {
        module?: { id: number; position: number };
      };
      setData((d) =>
        d.map((c) =>
          c.id === courseId
            ? {
                ...c,
                modules: [
                  ...c.modules,
                  {
                    id: res.module?.id ?? -Date.now(),
                    title,
                    summary: "",
                    position: res.module?.position ?? c.modules.length,
                    lessons: [],
                  },
                ],
              }
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
      d.map((c) =>
        c.id === courseId
          ? {
              ...c,
              modules: c.modules.map((m) => (m.id === moduleId ? { ...m, title } : m)),
            }
          : c,
      ),
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
    setData((d) =>
      d.map((c) => (c.id === courseId ? { ...c, modules: c.modules.filter((m) => m.id !== moduleId) } : c)),
    );
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
    setEditorTab("write");
    setPreviewHtml("");
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
    setEditorTab("write");
    setPreviewHtml("");
    setBusy(true);
    try {
      const res = (await call(`/api/lessons/${lesson.id}`, "GET")) as {
        lesson?: { contentHtml: string; summary: string };
        quizzes?: { q: string; options: string[]; answer: number; explain: string }[];
      };
      const loadedHtml = res.lesson?.contentHtml ?? "";
      setLessonForm((f) => ({
        ...f,
        contentHtml: loadedHtml,
        summary: res.lesson?.summary ?? lesson.summary,
        quizzesJson: JSON.stringify(res.quizzes ?? [], null, 2),
      }));
    } catch (e) {
      flash(e instanceof Error ? e.message : "Could not load the lesson");
    } finally {
      setBusy(false);
    }
  }

  async function updatePreview(rawHtml: string) {
    if (!rawHtml.trim()) {
      setPreviewHtml("");
      return;
    }
    setLoadingPreview(true);
    try {
      const res = await fetch("/api/admin/preview-html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: rawHtml }),
      });
      const json = (await res.json()) as { html?: string };
      setPreviewHtml(json.html ?? "");
    } catch {
      setPreviewHtml("");
    } finally {
      setLoadingPreview(false);
    }
  }

  function handleTabChange(tab: "write" | "preview") {
    setEditorTab(tab);
    if (tab === "preview") {
      setPreviewHtml("");
      void updatePreview(lessonForm.contentHtml);
    }
  }

  function insertTemplate(template: string) {
    const textarea = contentTextareaRef.current;
    if (!textarea) {
      setLessonForm((f) => ({
        ...f,
        contentHtml: f.contentHtml ? `${f.contentHtml}\n\n${template}` : template,
      }));
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const val = lessonForm.contentHtml;
    const next = val.substring(0, start) + template + val.substring(end);
    setLessonForm((f) => ({ ...f, contentHtml: next }));
    setTimeout(() => {
      textarea.focus();
      const pos = start + template.length;
      textarea.setSelectionRange(pos, pos);
    }, 10);
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
          ? {
              ...c,
              modules: c.modules.map((m) => (m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m)),
            }
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

  /* ─────────────────────────── HTML Importer ─────────────────────────── */

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      setImportForm((f) => {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
        const titleGuess = f.title || cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        return {
          ...f,
          html: text,
          title: titleGuess,
          slug: f.slug || titleGuess.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        };
      });
      setImportError(null);
    } catch (err) {
      setImportError("Could not read uploaded file: " + (err instanceof Error ? err.message : String(err)));
    }
  }

  function loadSampleCourseHtml() {
    setImportForm((f) => ({
      ...f,
      title: "Advanced Distributed Systems",
      slug: "distributed-systems",
      short: "ADS",
      tagline: "Consensus protocols, replication topologies, and distributed state machines.",
      description:
        "A comprehensive curriculum covering the foundations of modern distributed computing, including FLP impossibility, Paxos, and Raft.",
      category: "Systems",
      level: "Advanced",
      html: SAMPLE_COURSE_HTML,
    }));
    setImportError(null);
  }

  async function runImport() {
    if (!importForm.html.trim()) {
      setImportError("Please provide course or lesson HTML to import.");
      return;
    }
    setImporting(true);
    setImportError(null);
    setImportSuccess(null);
    try {
      const res = await fetch("/api/admin/import-html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: importMode,
          title: importForm.title,
          slug: importForm.slug,
          short: importForm.short,
          tagline: importForm.tagline,
          description: importForm.description,
          category: importForm.category,
          level: importForm.level,
          accent: importForm.accent,
          glow: importForm.glow,
          courseId: importMode === "existing_course" ? importForm.courseId : undefined,
          moduleId: importMode === "existing_course" && importForm.moduleId ? importForm.moduleId : undefined,
          html: importForm.html,
          structureMode: importForm.structureMode,
          defaultLessonTitle: importForm.defaultLessonTitle,
        }),
      });

      const resData = (await res.json()) as { error?: string; message?: string; course?: { id: number } };
      if (!res.ok) {
        throw new Error(resData.error ?? "Failed to import HTML");
      }

      setImportSuccess(resData.message || "Import completed successfully!");
      router.refresh();

      setTimeout(() => {
        setImportModalOpen(false);
        setImportSuccess(null);
        if (resData.course?.id) {
          setSelectedId(resData.course.id);
        }
        window.location.reload();
      }, 1400);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "HTML import failed");
    } finally {
      setImporting(false);
    }
  }

  /* ─────────────────────────── render ─────────────────────────── */

  const input = (label: string, key: keyof AdminCourse, type = "text") => (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{label}</span>
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
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">Author studio · CoreStack Academy</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">Catalog & Curriculum CRUD</h1>
          <p className="mt-1.5 text-sm text-zinc-400">
            Create courses, structure modules, import rich course HTML, and author lessons with live learner-styled previews.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setImportModalOpen(true);
              setImportError(null);
              setImportSuccess(null);
            }}
            className={buttonClass("secondary", "border-amber-400/30 text-amber-200 hover:bg-amber-400/10")}
          >
            <FileCode className="h-4 w-4 text-amber-300" /> Import via HTML
          </button>
          <button onClick={() => setCreatingCourse((v) => !v)} className={buttonClass("primary")}>
            {creatingCourse ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />} New course
          </button>
        </div>
      </header>

      {error ? (
        <p className="rounded-lg border border-rose-950/80 bg-rose-950/30 px-4 py-2.5 text-sm text-rose-300" role="alert">
          {error}
        </p>
      ) : null}

      {creatingCourse ? (
        <div className="panel animate-fade-up grid gap-3 p-5 sm:grid-cols-2">
          <input
            value={newCourse.title}
            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
            placeholder="Course title"
            className={inputClass}
          />
          <input
            value={newCourse.slug}
            onChange={(e) => setNewCourse({ ...newCourse, slug: e.target.value })}
            placeholder="slug-e-g-distributed-systems"
            className={inputClass}
          />
          <input
            value={newCourse.short}
            onChange={(e) => setNewCourse({ ...newCourse, short: e.target.value })}
            placeholder="Short code (DS)"
            className={inputClass}
          />
          <input
            value={newCourse.tagline}
            onChange={(e) => setNewCourse({ ...newCourse, tagline: e.target.value })}
            placeholder="One-line tagline"
            className={inputClass}
          />
          <div className="sm:col-span-2 flex justify-end">
            <button onClick={createCourse} disabled={busy} className={buttonClass("primary")}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Create course
            </button>
          </div>
        </div>
      ) : null}

      {data.length === 0 ? (
        <EmptyState
          icon={<Library className="h-5 w-5" />}
          title="No courses yet"
          description="Create your first course manually or use 'Import via HTML' to ingest full course curricula."
          action={
            <button onClick={() => setImportModalOpen(true)} className={buttonClass("primary")}>
              <FileCode className="h-4 w-4" /> Import via HTML
            </button>
          }
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="panel h-fit p-3">
            <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Courses</p>
            <ul className="space-y-1">
              {data.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setSelectedId(c.id)}
                    className={`focus-ring flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                      selectedId === c.id
                        ? "bg-amber-400/10 text-amber-100 ring-1 ring-amber-400/25"
                        : "text-zinc-300 hover:bg-zinc-800"
                    }`}
                  >
                    <BookOpen className="h-4 w-4 shrink-0 opacity-70" />
                    <span className="min-w-0 flex-1 truncate">{c.title}</span>
                    <span className="shrink-0 text-[10px] text-zinc-500">
                      {c.modules.reduce((n, m) => n + m.lessons.length, 0)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {selected ? (
            <div className="space-y-5">
              <section className="panel p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                    <Pencil className="h-3.5 w-3.5" /> Course details
                  </h2>
                  <div className="flex items-center gap-2">
                    <Badge tone={selected.published ? "emerald" : "amber"}>
                      {selected.published ? "published" : "hidden"}
                    </Badge>
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
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Tagline</span>
                    <input
                      value={selected.tagline}
                      onChange={(e) => patchCourseLocal({ tagline: e.target.value })}
                      className={inputClass}
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Description</span>
                    <textarea
                      value={selected.description}
                      onChange={(e) => patchCourseLocal({ description: e.target.value })}
                      rows={3}
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Category</span>
                    <select
                      value={selected.category}
                      onChange={(e) => patchCourseLocal({ category: e.target.value })}
                      className={inputClass}
                    >
                      {["Systems", "Data", "Architecture", "Networks", "Programming"].map((c) => (
                        <option key={c} value={c} className="bg-zinc-900">
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Level</span>
                    <select
                      value={selected.level}
                      onChange={(e) => patchCourseLocal({ level: e.target.value })}
                      className={inputClass}
                    >
                      {["Beginner", "Intermediate", "Advanced"].map((c) => (
                        <option key={c} value={c} className="bg-zinc-900">
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      Tags (comma separated)
                    </span>
                    <input
                      value={selected.tags.join(", ")}
                      onChange={(e) =>
                        patchCourseLocal({
                          tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                        })
                      }
                      className={inputClass}
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      Outcomes (one per line)
                    </span>
                    <textarea
                      value={selected.outcomes.join("\n")}
                      onChange={(e) =>
                        patchCourseLocal({
                          outcomes: e.target.value.split("\n").map((t) => t.trim()).filter(Boolean),
                        })
                      }
                      rows={3}
                      className={inputClass}
                    />
                  </label>
                  <label className="flex items-center gap-2 text-sm text-zinc-300">
                    <input
                      type="checkbox"
                      checked={selected.published}
                      onChange={(e) => patchCourseLocal({ published: e.target.checked })}
                      className="h-4 w-4 rounded border-zinc-800 bg-zinc-900"
                    />
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
                  <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                    <Layers className="h-3.5 w-3.5" /> Modules & lessons
                  </h2>
                  <button
                    onClick={() => addModule(selected.id)}
                    disabled={busy}
                    className={buttonClass("secondary", "px-3 py-1.5 text-xs")}
                  >
                    <Plus className="h-3.5 w-3.5" /> Add module
                  </button>
                </div>

                {selected.modules.length === 0 ? (
                  <EmptyState
                    icon={<Layers className="h-5 w-5" />}
                    title="No modules yet"
                    description="Add a module manually or use 'Import via HTML' to populate the curriculum."
                  />
                ) : (
                  selected.modules.map((mod) => {
                    const open = openModules.includes(mod.id);
                    return (
                      <div key={mod.id} className="panel overflow-hidden">
                        <div className="flex items-center gap-3 px-4 py-3">
                          <button
                            onClick={() =>
                              setOpenModules((p) => (open ? p.filter((x) => x !== mod.id) : [...p, mod.id]))
                            }
                            className="focus-ring flex min-w-0 flex-1 items-center gap-2 text-left"
                          >
                            <ChevronDown
                              className={`h-4 w-4 shrink-0 text-zinc-500 transition ${open ? "rotate-180" : ""}`}
                            />
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-semibold text-white">{mod.title}</span>
                              <span className="block text-[11px] text-zinc-500">{mod.lessons.length} lessons</span>
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              const next = prompt("Rename module", mod.title);
                              if (next) renameModule(selected.id, mod.id, next);
                            }}
                            className="focus-ring rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                            title="Rename"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteModule(selected.id, mod.id)}
                            className="focus-ring rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-rose-300"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {open ? (
                          <ul className="animate-fade-up divide-y divide-zinc-800/60 border-t border-zinc-800/60">
                            {mod.lessons.map((lesson) => (
                              <li key={lesson.id} className="flex flex-wrap items-center gap-3 px-4 py-2.5">
                                <span className="min-w-0 flex-1">
                                  <span className="flex items-center gap-2">
                                    <span className="truncate text-[13px] text-zinc-200">{lesson.title}</span>
                                    {lesson.draft ? <Badge tone="amber">draft</Badge> : null}
                                  </span>
                                  <span className="block text-[11px] text-zinc-500">
                                    {lesson.minutes} min · {lesson.kind} · {lesson.quizCount} quizzes
                                  </span>
                                </span>
                                <button
                                  onClick={() => openExistingLesson(lesson)}
                                  className={buttonClass("secondary", "px-2.5 py-1.5 text-[11px]")}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteLesson(selected.id, mod.id, lesson.id)}
                                  className={buttonClass("danger", "px-2.5 py-1.5 text-[11px]")}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </li>
                            ))}
                            <li className="px-4 py-3">
                              <button
                                onClick={() => openNewLesson(mod.id)}
                                className={buttonClass("secondary", "px-3 py-1.5 text-xs")}
                              >
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

              {/* ─────────────────────────── Lesson Editor ─────────────────────────── */}
              {editingLesson ? (
                <section className="panel animate-fade-up space-y-4 p-5">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">
                        {editingLesson.id === "new" ? "New Lesson" : "Edit Lesson"}
                      </h3>
                      {lessonForm.draft ? <Badge tone="amber">draft</Badge> : <Badge tone="emerald">ready</Badge>}
                    </div>
                    <button
                      onClick={() => setEditingLesson(null)}
                      className={buttonClass("ghost", "px-2.5 py-1.5 text-xs")}
                    >
                      <X className="h-3.5 w-3.5" /> Close
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                        Lesson Title
                      </span>
                      <input
                        value={lessonForm.title}
                        onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                        placeholder="e.g. 1. Introduction to Consensus"
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                        Summary
                      </span>
                      <input
                        value={lessonForm.summary}
                        onChange={(e) => setLessonForm({ ...lessonForm, summary: e.target.value })}
                        placeholder="One-line overview of the lesson"
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                        Estimated Minutes
                      </span>
                      <input
                        type="number"
                        min={1}
                        value={lessonForm.minutes}
                        onChange={(e) => setLessonForm({ ...lessonForm, minutes: Number(e.target.value) })}
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                        Kind
                      </span>
                      <select
                        value={lessonForm.kind}
                        onChange={(e) => setLessonForm({ ...lessonForm, kind: e.target.value })}
                        className={inputClass}
                      >
                        {["reading", "lab", "case", "quiz"].map((k) => (
                          <option key={k} value={k} className="bg-zinc-900">
                            {k}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-zinc-300">
                    <input
                      type="checkbox"
                      checked={lessonForm.draft}
                      onChange={(e) => setLessonForm({ ...lessonForm, draft: e.target.checked })}
                      className="h-4 w-4 rounded border-zinc-800 bg-zinc-900"
                    />
                    Draft mode (learners see an explicit “not authored yet” notice)
                  </label>

                  {/* Tabbed Editor: Write HTML vs Live Preview */}
                  <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                      <div className="flex items-center gap-1.5 rounded-lg bg-zinc-900/60 p-1">
                        <button
                          type="button"
                          onClick={() => handleTabChange("write")}
                          className={`focus-ring flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition ${
                            editorTab === "write"
                              ? "bg-zinc-800 text-zinc-100 font-medium shadow"
                              : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          <Code2 className="h-3.5 w-3.5" /> Write HTML
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTabChange("preview")}
                          className={`focus-ring flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition ${
                            editorTab === "preview"
                              ? "bg-zinc-800 text-zinc-100 font-medium shadow"
                              : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          <Eye className="h-3.5 w-3.5" /> Live Preview
                        </button>
                      </div>

                      <span className="text-[11px] text-zinc-400">
                        {editorTab === "write"
                          ? "Allowed: p, h1-h6, ul/ol/li, table, pre/code, blockquote, .lead, .callout"
                          : "Previewing in .lesson-prose reading environment"}
                      </span>
                    </div>

                    {/* Mode 1: Write HTML with Formatting Shortcuts */}
                    {editorTab === "write" ? (
                      <div className="space-y-3">
                        {/* Formatting Shortcut Buttons */}
                        <div
                          className="flex overflow-x-auto flex-nowrap sm:flex-wrap items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2 scrollbar-none"
                          style={{ WebkitOverflowScrolling: "touch" }}
                        >
                          <span className="shrink-0 px-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                            Shortcuts:
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              insertTemplate(
                                '<div class="callout">\n  <strong>Key Insight:</strong> Explain critical takeaway or rule here.\n</div>\n',
                              )
                            }
                            className="focus-ring flex shrink-0 whitespace-nowrap min-h-[36px] items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800"
                            title="Insert key insight callout box"
                          >
                            <Lightbulb className="h-3.5 w-3.5 text-zinc-400" /> Callout
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              insertTemplate(
                                '<div class="callout analogy">\n  <strong>Real-World Analogy:</strong> Relate this concept to an everyday real-world parallel.\n</div>\n',
                              )
                            }
                            className="focus-ring flex shrink-0 whitespace-nowrap min-h-[36px] items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800"
                            title="Insert real-world analogy box"
                          >
                            <Lightbulb className="h-3.5 w-3.5 text-zinc-400" /> Analogy
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              insertTemplate(
                                '<pre><code class="language-typescript">// Example implementation\nfunction handleOperation() {\n  return true;\n}\n</code></pre>\n',
                              )
                            }
                            className="focus-ring flex shrink-0 whitespace-nowrap min-h-[36px] items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800"
                            title="Insert code snippet block"
                          >
                            <Code2 className="h-3.5 w-3.5 text-zinc-400" /> Code Block
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              insertTemplate(
                                '<div class="overflow-x-auto">\n<table>\n  <thead>\n    <tr><th>Component</th><th>Role</th><th>Trade-off</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Leader</td><td>Coordinates consensus</td><td>Bottleneck on high write load</td></tr>\n    <tr><td>Follower</td><td>Replicates state machine</td><td>Read lag if eventual</td></tr>\n  </tbody>\n</table>\n</div>\n',
                              )
                            }
                            className="focus-ring flex shrink-0 whitespace-nowrap min-h-[36px] items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800"
                            title="Insert structured HTML table"
                          >
                            <Table className="h-3.5 w-3.5 text-zinc-400" /> Table
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              insertTemplate(
                                '<div class="callout">\n  <strong>Check Your Understanding:</strong> What happens when a network partition disconnects the minority quorum?\n</div>\n',
                              )
                            }
                            className="focus-ring flex shrink-0 whitespace-nowrap min-h-[36px] items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800"
                            title="Insert quiz check prompt"
                          >
                            <HelpCircle className="h-3.5 w-3.5 text-zinc-400" /> Quiz Block
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              insertTemplate(
                                '<p class="lead">Introductory thesis sentence that highlights the core concept of this lesson.</p>\n',
                              )
                            }
                            className="focus-ring flex shrink-0 whitespace-nowrap min-h-[36px] items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800"
                            title="Insert lead paragraph"
                          >
                            <FileText className="h-3.5 w-3.5 text-zinc-400" /> Lead Paragraph
                          </button>
                        </div>

                        <textarea
                          ref={contentTextareaRef}
                          value={lessonForm.contentHtml}
                          onChange={(e) => setLessonForm({ ...lessonForm, contentHtml: e.target.value })}
                          rows={14}
                          className={`${inputClass} font-mono text-[12.5px] leading-6`}
                          placeholder="<p class='lead'>Welcome to this lesson…</p>"
                        />
                      </div>
                    ) : (
                      /* Mode 2: Live Learner-Styled Preview */
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-400">
                            {loadingPreview ? "Sanitizing HTML via server-side sanitizer…" : "Learner reading view preview:"}
                          </span>
                          <button
                            type="button"
                            onClick={() => void updatePreview(lessonForm.contentHtml)}
                            className="text-xs text-zinc-400 hover:text-white hover:underline"
                          >
                            Re-sanitize & refresh
                          </button>
                        </div>

                        <div className="panel p-6 lg:p-8">
                          <div className="mb-4 flex flex-wrap items-center gap-2">
                            <Badge tone="indigo">{lessonForm.kind}</Badge>
                            <Badge>{lessonForm.minutes} min</Badge>
                            {lessonForm.draft ? <Badge tone="amber">draft</Badge> : null}
                          </div>

                          <h1 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">
                            {lessonForm.title || "Untitled Lesson"}
                          </h1>
                          {lessonForm.summary ? (
                            <p className="mt-2 text-sm leading-6 text-zinc-400">{lessonForm.summary}</p>
                          ) : null}

                          <hr className="my-6 border-zinc-800" />

                          {lessonForm.contentHtml.trim() ? (
                            loadingPreview ? (
                              <div className="panel flex items-center justify-center gap-3 p-12 text-sm text-zinc-400">
                                <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
                                <span>Sanitizing HTML preview…</span>
                              </div>
                            ) : previewHtml ? (
                              <div
                                className="panel lesson lesson-prose p-6 lg:p-8"
                                dangerouslySetInnerHTML={{ __html: previewHtml }}
                              />
                            ) : (
                              <div className="panel border-dashed border-zinc-800 p-8 text-center text-sm text-zinc-400">
                                Preview could not be loaded. Click “Re-sanitize & refresh” to try again.
                              </div>
                            )
                          ) : (
                            <div className="panel border-dashed border-zinc-800 p-8 text-center text-sm text-zinc-400">
                              No HTML authored yet. Switch to “Write HTML” and use the shortcut buttons or write content!
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      Quizzes JSON — [{"{ q, options[], answer, explain }"}]
                    </span>
                    <textarea
                      value={lessonForm.quizzesJson}
                      onChange={(e) => setLessonForm({ ...lessonForm, quizzesJson: e.target.value })}
                      rows={5}
                      className={`${inputClass} font-mono text-[12.5px]`}
                    />
                  </label>

                  <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
                    <p className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                      <TriangleAlert className="h-3 w-3 text-amber-300" /> Script tags and inline event handlers are
                      stripped with sanitize-html automatically.
                    </p>
                    <button onClick={saveLesson} disabled={busy} className={buttonClass("primary")}>
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save lesson
                    </button>
                  </div>
                </section>
              ) : null}
            </div>
          ) : (
            <EmptyState
              icon={<Library className="h-5 w-5" />}
              title="Pick a course"
              description="Select a course on the left to edit its details, modules and lessons."
            />
          )}
        </div>
      )}

      {/* ─────────────────────────── HTML Importer Modal ─────────────────────────── */}
      {importModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-zinc-950/80 p-2 sm:p-4 backdrop-blur-sm">
          <div
            className="panel animate-fade-up my-4 sm:my-8 max-h-[92vh] w-full max-w-[calc(100vw-2rem)] sm:max-w-3xl overflow-y-auto border-zinc-800 bg-zinc-900 p-4 sm:p-6 shadow-2xl"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300">
                  <FileCode className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-white truncate">Import via HTML</h2>
                  <p className="text-xs text-zinc-400 line-clamp-1 sm:line-clamp-none">
                    Ingest full course curricula or lesson HTML. Headings are safely extracted into modules and rich lessons.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mode selection tabs */}
            <div className="mt-4 flex rounded-lg bg-zinc-900/60 p-1">
              <button
                type="button"
                onClick={() => setImportMode("new_course")}
                className={`flex-1 rounded-md py-2 text-center text-xs transition ${
                  importMode === "new_course" ? "bg-zinc-800 text-zinc-100 font-medium shadow" : "text-zinc-400 hover:text-white"
                }`}
              >
                Create New Course from HTML
              </button>
              <button
                type="button"
                onClick={() => setImportMode("existing_course")}
                className={`flex-1 rounded-md py-2 text-center text-xs transition ${
                  importMode === "existing_course" ? "bg-zinc-800 text-zinc-100 font-medium shadow" : "text-zinc-400 hover:text-white"
                }`}
              >
                Add Lessons to Existing Course
              </button>
            </div>

            {/* Form Fields */}
            <div className="mt-5 space-y-4">
              {importMode === "new_course" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      Course Title (optional - auto-extracted from &lt;h1&gt; if blank)
                    </span>
                    <input
                      value={importForm.title}
                      onChange={(e) =>
                        setImportForm({
                          ...importForm,
                          title: e.target.value,
                          slug: importForm.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                        })
                      }
                      placeholder="e.g. Advanced Distributed Systems"
                      className={inputClass}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      Course Slug
                    </span>
                    <input
                      value={importForm.slug}
                      onChange={(e) => setImportForm({ ...importForm, slug: e.target.value })}
                      placeholder="distributed-systems"
                      className={inputClass}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      Short Code
                    </span>
                    <input
                      value={importForm.short}
                      onChange={(e) => setImportForm({ ...importForm, short: e.target.value })}
                      placeholder="ADS"
                      className={inputClass}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      Category
                    </span>
                    <select
                      value={importForm.category}
                      onChange={(e) =>
                        setImportForm({
                          ...importForm,
                          category: e.target.value as "Systems" | "Data" | "Architecture" | "Networks" | "Programming",
                        })
                      }
                      className={inputClass}
                    >
                      {["Systems", "Data", "Architecture", "Networks", "Programming"].map((c) => (
                        <option key={c} value={c} className="bg-zinc-900">
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      Level
                    </span>
                    <select
                      value={importForm.level}
                      onChange={(e) =>
                        setImportForm({
                          ...importForm,
                          level: e.target.value as "Beginner" | "Intermediate" | "Advanced",
                        })
                      }
                      className={inputClass}
                    >
                      {["Beginner", "Intermediate", "Advanced"].map((c) => (
                        <option key={c} value={c} className="bg-zinc-900">
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      Tagline
                    </span>
                    <input
                      value={importForm.tagline}
                      onChange={(e) => setImportForm({ ...importForm, tagline: e.target.value })}
                      placeholder="One-line summary for catalog cards"
                      className={inputClass}
                    />
                  </label>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      Target Course
                    </span>
                    <select
                      value={importForm.courseId}
                      onChange={(e) =>
                        setImportForm({ ...importForm, courseId: Number(e.target.value), moduleId: 0 })
                      }
                      className={inputClass}
                    >
                      {data.map((c) => (
                        <option key={c.id} value={c.id} className="bg-zinc-900">
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      Target Module
                    </span>
                    <select
                      value={importForm.moduleId}
                      onChange={(e) => setImportForm({ ...importForm, moduleId: Number(e.target.value) })}
                      className={inputClass}
                    >
                      <option value={0} className="bg-zinc-900">
                        Create new module(s) automatically from headings
                      </option>
                      {data
                        .find((c) => c.id === importForm.courseId)
                        ?.modules.map((m) => (
                          <option key={m.id} value={m.id} className="bg-zinc-900">
                            Append to: {m.title}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>
              )}

              {/* Extraction Structure Mode */}
              <div>
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Headings & Hierarchy Extraction Strategy
                </span>
                <div className="grid gap-2 sm:grid-cols-3">
                  {[
                    {
                      id: "auto",
                      label: "Auto-detect Hierarchy",
                      desc: "H1 = Course, H2 = Modules, H3 = Lessons",
                    },
                    {
                      id: "by_headings",
                      label: "H2 As Lessons",
                      desc: "Each H2 tag generates a distinct lesson",
                    },
                    {
                      id: "single_lesson",
                      label: "Single Rich Lesson",
                      desc: "Stores full HTML as one complete lesson",
                    },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() =>
                        setImportForm({
                          ...importForm,
                          structureMode: mode.id as "auto" | "single_lesson" | "by_headings",
                        })
                      }
                      className={`rounded-lg border p-3 text-left transition ${
                        importForm.structureMode === mode.id
                          ? "border-zinc-700 bg-zinc-800 text-white"
                          : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      <p className="text-xs font-semibold text-zinc-200">{mode.label}</p>
                      <p className="mt-1 text-[11px] text-zinc-400">{mode.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* HTML Input Area */}
              <div>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Course / Lesson HTML
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".html,.htm,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1 text-xs text-zinc-400 transition hover:text-zinc-200 hover:underline"
                    >
                      <Upload className="h-3.5 w-3.5" /> Upload .html file
                    </button>
                    <span className="text-zinc-600">·</span>
                    <button
                      type="button"
                      onClick={loadSampleCourseHtml}
                      className="flex items-center gap-1 text-xs text-zinc-400 transition hover:text-zinc-200 hover:underline"
                    >
                      <FileCode className="h-3.5 w-3.5 text-zinc-400" /> Load sample course HTML
                    </button>
                  </div>
                </div>

                <textarea
                  value={importForm.html}
                  onChange={(e) => setImportForm({ ...importForm, html: e.target.value })}
                  rows={10}
                  className={`${inputClass} font-mono text-[12px] leading-5`}
                  placeholder="Paste complete course HTML or individual lesson HTML with <h2> and <h3> headings…"
                />
              </div>

              {/* Status messages */}
              {importError ? (
                <p className="rounded-lg border border-rose-950/80 bg-rose-950/30 px-4 py-2.5 text-sm text-rose-300" role="alert">
                  {importError}
                </p>
              ) : null}

              {importSuccess ? (
                <p className="flex items-center gap-2 rounded-lg border border-emerald-900/60 bg-emerald-950/40 px-4 py-2.5 text-sm text-emerald-300" role="alert">
                  <CheckCircle2 className="h-4 w-4" /> {importSuccess}
                </p>
              ) : null}

              {/* Action buttons */}
              <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                <button
                  type="button"
                  onClick={() => setImportModalOpen(false)}
                  className={buttonClass("ghost")}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={runImport}
                  disabled={importing || !importForm.html.trim()}
                  className={buttonClass("primary")}
                >
                  {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileCode className="h-4 w-4" />}
                  {importing ? "Ingesting & Sanitizing…" : "Ingest Course HTML into Database"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
