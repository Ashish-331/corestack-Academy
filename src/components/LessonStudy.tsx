"use client";

import { useState } from "react";
import { Check, HelpCircle, Loader2, Pencil, Pin, PinOff, Plus, Trash2, X } from "lucide-react";
import { buttonClass, inputClass } from "@/components/ui";

/* ─────────────────────────── Quiz (single system) ───────────────────────────
 * All quizzes — DBMS, OS, system design, DSA, OOD and networks — render through
 * this component and persist through /api/quiz-answers. There is no separate
 * inline-markup quiz path any more.                                             */

export type QuizItem = {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explain: string;
};

export function Quiz({ questions, saved }: { questions: QuizItem[]; saved: Record<number, number> }) {
  const [picks, setPicks] = useState<Record<number, number>>(saved);
  const [pending, setPending] = useState<number | null>(null);

  async function pick(questionId: number, index: number, rollback: number | undefined) {
    setPicks((p) => ({ ...p, [questionId]: index })); // optimistic
    setPending(questionId);
    try {
      const res = await fetch("/api/quiz-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, selectedIndex: index }),
      });
      if (!res.ok) throw new Error("failed");
    } catch {
      setPicks((p) => {
        const next = { ...p };
        if (rollback === undefined) delete next[questionId];
        else next[questionId] = rollback;
        return next;
      });
    } finally {
      setPending(null);
    }
  }

  const answered = questions.filter((q) => picks[q.id] !== undefined);
  const correct = answered.filter((q) => picks[q.id] === q.answer).length;

  if (!questions.length) return null;

  return (
    <section className="panel p-5" id="quiz">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-semibold text-white">
          <HelpCircle className="h-4 w-4 text-zinc-400" /> Check your understanding
        </h2>
        <p className="text-xs text-zinc-400">
          {answered.length}/{questions.length} answered
          {answered.length ? (
            <>
              {" · "}
              <span className={correct === answered.length ? "text-emerald-400" : "text-amber-300"}>
                {correct} correct
              </span>
            </>
          ) : null}
        </p>
      </div>

      <ol className="mt-4 space-y-5">
        {questions.map((q, qi) => {
          const chosen = picks[q.id];
          const isAnswered = chosen !== undefined;
          const isCorrect = chosen === q.answer;
          return (
            <li key={q.id} className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
              <p className="text-sm font-semibold text-zinc-100">
                <span className="mr-2 text-zinc-500">{qi + 1}.</span>
                {q.question}
              </p>
              <div className="mt-3 grid gap-2">
                {q.options.map((opt, i) => {
                  const chosenThis = chosen === i;
                  const revealCorrect = isAnswered && i === q.answer;
                  const base = "flex items-start gap-2.5 rounded-lg border px-3 py-2 text-left text-sm transition";
                  const cls = revealCorrect
                    ? "border-emerald-700/80 bg-emerald-950/40 text-emerald-200"
                    : chosenThis
                      ? "border-rose-800/80 bg-rose-950/40 text-rose-200"
                      : "border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/60";
                  return (
                    <button key={i} onClick={() => pick(q.id, i, chosen)} disabled={pending === q.id} className={`${base} ${cls} focus-ring`}>
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border border-zinc-700 bg-zinc-800 text-[11px] font-bold text-zinc-300">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {revealCorrect ? <Check className="h-4 w-4 shrink-0" /> : null}
                      {chosenThis && !revealCorrect ? <X className="h-4 w-4 shrink-0" /> : null}
                    </button>
                  );
                })}
              </div>

              {isAnswered ? (
                <p className={`mt-3 rounded-lg border px-3 py-2 text-[13px] leading-6 ${isCorrect ? "border-emerald-800/60 bg-emerald-950/30 text-emerald-200" : "border-amber-800/60 bg-amber-950/30 text-amber-200"}`}>
                  <strong className="font-semibold">{isCorrect ? "Correct. " : "Not quite. "}</strong>
                  {q.explain}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ─────────────────────────────── Practice ─────────────────────────────── */

export function Practice({ problems }: { problems: { id: number; prompt: string; hint: string; solution: string }[] }) {
  const [open, setOpen] = useState<Record<number, "hint" | "solution" | null>>({});
  if (!problems.length) return null;

  return (
    <section className="panel p-5" id="practice">
      <h2 className="text-base font-semibold text-white">Practice</h2>
      <ol className="mt-4 space-y-4">
        {problems.map((p, i) => (
          <li key={p.id} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="text-sm text-zinc-200">
              <span className="mr-2 text-zinc-500">{i + 1}.</span>
              {p.prompt}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => setOpen((o) => ({ ...o, [p.id]: o[p.id] === "hint" ? null : "hint" }))} className={buttonClass("secondary", "px-3 py-1.5 text-xs")}>
                Hint
              </button>
              <button onClick={() => setOpen((o) => ({ ...o, [p.id]: o[p.id] === "solution" ? null : "solution" }))} className={buttonClass("secondary", "px-3 py-1.5 text-xs")}>
                Solution
              </button>
            </div>
            {open[p.id] === "hint" && p.hint ? <p className="mt-3 rounded-lg bg-amber-400/10 px-3 py-2 text-[13px] text-amber-100">{p.hint}</p> : null}
            {open[p.id] === "solution" ? (
              <pre className="mt-3 overflow-x-auto rounded-lg bg-zinc-900/80 p-3 text-[12.5px] leading-6 text-zinc-200">
                <code>{p.solution}</code>
              </pre>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ───────────────────────── Lesson notes (CRUD) ───────────────────────── */

export type NoteItem = { id: number; title: string; body: string; pinned: boolean; updatedAt: string | Date };

export function NotesPanel({ lessonId, initial }: { lessonId: number; initial: NoteItem[] }) {
  const [notes, setNotes] = useState<NoteItem[]>(initial);
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [busy, setBusy] = useState(false);

  async function add() {
    const body = draft.trim();
    if (!body) return;
    const title = body.split("\n")[0].slice(0, 60) || "Note";
    const optimistic: NoteItem = { id: -Date.now(), title, body, pinned: false, updatedAt: new Date() };
    setNotes((n) => [optimistic, ...n]); // optimistic
    setDraft("");
    setBusy(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, lessonId }),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { note: NoteItem };
      setNotes((n) => n.map((x) => (x.id === optimistic.id ? data.note : x)));
    } catch {
      setNotes((n) => n.filter((x) => x.id !== optimistic.id));
    } finally {
      setBusy(false);
    }
  }

  async function patch(id: number, payload: Record<string, unknown>, rollback: NoteItem) {
    setNotes((n) => n.map((x) => (x.id === id ? { ...x, ...payload } as NoteItem : x)));
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
    } catch {
      setNotes((n) => n.map((x) => (x.id === id ? rollback : x)));
    }
  }

  async function remove(id: number) {
    const rollback = notes;
    setNotes((n) => n.filter((x) => x.id !== id));
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
    } catch {
      setNotes(rollback);
    }
  }

  return (
    <section className="panel p-5" id="notes">
      <h2 className="text-base font-semibold text-white">Your notes on this lesson</h2>

      <div className="mt-3 space-y-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          placeholder="Write while you read — the first line becomes the title."
          className={inputClass}
        />
        <div className="flex justify-end">
          <button onClick={add} disabled={busy || !draft.trim()} className={buttonClass("primary", "px-3 py-2 text-xs")}>
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            Add note
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-zinc-800 px-4 py-6 text-center text-sm text-zinc-500">
          No notes here yet. Anything you write is saved to your account.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {notes.map((note) => {
            const rollback = note;
            return (
              <li key={note.id} className={`rounded-lg border p-3 ${note.pinned ? "border-amber-400/25 bg-amber-400/[0.06]" : "border-zinc-800 bg-zinc-900/60"}`}>
                {editing === note.id ? (
                  <div className="space-y-2">
                    <input value={editValue} onChange={(e) => setEditValue(e.target.value)} className={inputClass} autoFocus />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(null)} className={buttonClass("ghost", "px-3 py-1.5 text-xs")}>
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          await patch(note.id, { body: editValue, title: (editValue.split("\n")[0] || "Note").slice(0, 60) }, rollback);
                          setEditing(null);
                        }}
                        className={buttonClass("primary", "px-3 py-1.5 text-xs")}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap text-[13.5px] leading-6 text-zinc-200">{note.body}</p>
                    <div className="mt-2 flex items-center gap-1 text-[11px] text-zinc-500">
                      <button
                        onClick={() => patch(note.id, { pinned: !note.pinned }, rollback)}
                        className="focus-ring rounded-lg p-1.5 hover:bg-zinc-800 hover:text-amber-200"
                        title={note.pinned ? "Unpin" : "Pin"}
                      >
                        {note.pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        onClick={() => {
                          setEditing(note.id);
                          setEditValue(note.body);
                        }}
                        className="focus-ring rounded-lg p-1.5 hover:bg-zinc-800 hover:text-zinc-200"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => remove(note.id)} className="focus-ring rounded-lg p-1.5 hover:bg-zinc-800 hover:text-rose-300" title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <span className="ml-auto">{new Date(note.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
