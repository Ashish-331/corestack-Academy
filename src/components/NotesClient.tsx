"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, Pencil, Pin, PinOff, Plus, Search, Trash2 } from "lucide-react";
import { Badge, EmptyState, buttonClass, inputClass, relativeTime } from "@/components/ui";

export type NoteRow = {
  id: number;
  title: string;
  body: string;
  pinned: boolean;
  updatedAt: string | Date;
  lessonSlug: string | null;
  lessonTitle: string | null;
  courseSlug: string | null;
  courseTitle: string | null;
};

export default function NotesClient({ initial }: { initial: NoteRow[] }) {
  const [notes, setNotes] = useState(initial);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editBody, setEditBody] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => `${n.title} ${n.body} ${n.lessonTitle ?? ""}`.toLowerCase().includes(q));
  }, [notes, query]);

  async function create() {
    if (!title.trim() && !body.trim()) return;
    const optimistic: NoteRow = {
      id: -Date.now(),
      title: title.trim() || (body.trim().split("\n")[0] || "Note").slice(0, 60),
      body: body.trim(),
      pinned: false,
      updatedAt: new Date(),
      lessonSlug: null,
      lessonTitle: null,
      courseSlug: null,
      courseTitle: null,
    };
    setNotes((n) => [optimistic, ...n]); // optimistic
    setTitle("");
    setBody("");
    setBusy(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: optimistic.title, body: optimistic.body }),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { note: { id: number } };
      setNotes((n) => n.map((x) => (x.id === optimistic.id ? { ...x, id: data.note.id } : x)));
    } catch {
      setNotes((n) => n.filter((x) => x.id !== optimistic.id));
    } finally {
      setBusy(false);
    }
  }

  async function patch(id: number, payload: Partial<NoteRow>) {
    const before = notes;
    setNotes((n) => n.map((x) => (x.id === id ? { ...x, ...payload, updatedAt: new Date() } : x)));
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
    } catch {
      setNotes(before);
    }
  }

  async function remove(id: number) {
    const before = notes;
    setNotes((n) => n.filter((x) => x.id !== id)); // optimistic
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
    } catch {
      setNotes(before);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Notes</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">Everything you wrote down</h1>
        <p className="mt-1.5 text-sm text-zinc-400">Notes taken inside a lesson link back to it. Pin the ones you want on top.</p>
      </header>

      <div className="panel space-y-3 p-4 sm:p-5">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" className={inputClass} />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder="Write it down…" className={inputClass} />
        <div className="flex flex-col sm:flex-row justify-end">
          <button onClick={create} disabled={busy} className={buttonClass("primary", "w-full sm:w-auto min-h-[42px] px-4 py-2 text-xs sm:text-sm")}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add note
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter notes…" className={`${inputClass} pl-9`} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Pencil className="h-5 w-5" />}
          title={notes.length === 0 ? "No notes yet" : "No notes match that filter"}
          description={
            notes.length === 0
              ? "Open any lesson and use the notes panel — or write one straight from here."
              : "Try a different word, or clear the filter."
          }
        />
      ) : (
        <ul className="space-y-3">
          {filtered.map((note) => (
            <li key={note.id} className={`panel p-4 ${note.pinned ? "border-amber-900/60 bg-amber-950/20" : ""}`}>
              <div className="flex flex-wrap items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-white">{note.title}</h3>
                    {note.pinned ? <Badge tone="amber">pinned</Badge> : null}
                  </div>
                  {note.lessonSlug && note.courseSlug ? (
                    <Link href={`/courses/${note.courseSlug}/${note.lessonSlug}`} className="mt-0.5 inline-block text-[11px] text-zinc-400 hover:text-white hover:underline">
                      {note.courseTitle} · {note.lessonTitle}
                    </Link>
                  ) : (
                    <p className="mt-0.5 text-[11px] text-zinc-500">Standalone note</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => patch(note.id, { pinned: !note.pinned })}
                    className="focus-ring rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-amber-300"
                    title={note.pinned ? "Unpin" : "Pin"}
                  >
                    {note.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(editingId === note.id ? null : note.id);
                      setEditBody(note.body);
                    }}
                    className="focus-ring rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(note.id)} className="focus-ring rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-rose-400" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {editingId === note.id ? (
                <div className="mt-3 space-y-2">
                  <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} rows={5} className={inputClass} />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditingId(null)} className={buttonClass("ghost", "px-3 py-1.5 text-xs")}>
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        await patch(note.id, { body: editBody, title: (editBody.split("\n")[0] || note.title).slice(0, 60) });
                        setEditingId(null);
                      }}
                      className={buttonClass("primary", "px-3 py-1.5 text-xs")}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-2 whitespace-pre-wrap text-[13.5px] leading-6 text-zinc-300">{note.body}</p>
              )}

              <p className="mt-2 text-[11px] text-zinc-500">Updated {relativeTime(note.updatedAt)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
