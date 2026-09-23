import { courses } from "./catalog";
import { osLessons } from "./os-content";
import { dbmsModules } from "./dbms-content";
import { sdModules } from "./sd-content";
import { dsaContent } from "./dsa-content";
import { oopsContent } from "./oops-content";
import { cnContent } from "./cn-content";
import type { AuthoredLesson } from "./dsa-content";

export { courses };

/* ────────────────────────────────────────────────────────────────────────────
 * Authored-content lookup chain.
 *
 * Every course has a real authoring source, keyed by lesson id:
 *   1. operating-systems -> os-content.ts  (`osLessons[id].content`)
 *   2. dbms              -> dbms-content.ts (`dbmsModules[].notes`)
 *   3. system-design     -> sd-content.ts   (`sdModules[].topics[].html`)
 *   4. dsa               -> dsa-content.ts  (authored for this app)
 *   5. oops              -> oops-content.ts (authored for this app)
 *   6. computer-networks -> cn-content.ts   (authored for this app)
 *
 * `resolveLesson()` returns the raw HTML plus any structured quizzes/practice
 * problems. Inline quiz markup found inside authored HTML is *extracted* into
 * structured data so there is exactly one quiz system (and one persistence
 * path) in the app.
 * ──────────────────────────────────────────────────────────────────────── */

export interface ExtractedQuiz {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface ResolvedLesson {
  html: string;
  quizzes: ExtractedQuiz[];
  practice: { prompt: string; hint?: string; solution: string }[];
  /** true when no author has written this lesson yet */
  draft: boolean;
}

const authoredByCourse: Record<string, Record<string, AuthoredLesson>> = {
  dsa: dsaContent,
  oops: oopsContent,
  "computer-networks": cnContent,
};

/** Balanced-div extractor: finds `<div class="X">` and its matching `</div>`. */
function findBalancedDiv(html: string, className: string): { start: number; end: number; inner: string }[] {
  const out: { start: number; end: number; inner: string }[] = [];
  const openRe = new RegExp(`<div[^>]*class="[^"]*\\b${className}\\b[^"]*"[^>]*>`, "g");
  const tagRe = /<\/?div\b[^>]*>/g;
  let open: RegExpExecArray | null;
  while ((open = openRe.exec(html))) {
    tagRe.lastIndex = openRe.lastIndex;
    let depth = 1;
    let m: RegExpExecArray | null = null;
    while (depth > 0 && (m = tagRe.exec(html))) {
      depth += m[0].startsWith("</") ? -1 : 1;
    }
    const end = m ? m.index : html.length;
    const closeLen = m ? m[0].length : 0;
    out.push({ start: open.index, end: end + closeLen, inner: html.slice(openRe.lastIndex, end) });
    openRe.lastIndex = end + closeLen;
  }
  return out;
}

const stripTags = (s: string) =>
  s
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

/** Pull `.quiz-q` blocks out of authored HTML and convert them to typed data. */
function extractInlineQuizzes(html: string): { html: string; quizzes: ExtractedQuiz[] } {
  const quizzes: ExtractedQuiz[] = [];
  const sections = findBalancedDiv(html, "quiz-section");
  let cleaned = html;
  for (const section of sections) {
    const inner = section.inner;
    for (const block of findBalancedDiv(inner, "quiz-q")) {
      const qMatch = block.inner.match(/<p[^>]*>([\s\S]*?)<\/p>/);
      const options: { text: string; correct: boolean }[] = [];
      for (const opt of findBalancedDiv(block.inner, "quiz-opt")) {
        const openTag = opt.inner.slice(0, opt.inner.indexOf(">") + 1);
        options.push({
          text: stripTags(opt.inner.slice(opt.inner.indexOf(">") + 1)),
          correct: /data-correct="1"/.test(openTag),
        });
      }
      const explain = findBalancedDiv(block.inner, "quiz-explain")[0];
      const answer = Math.max(
        0,
        options.findIndex((o) => o.correct),
      );
      quizzes.push({
        q: stripTags(qMatch ? qMatch[1] : block.inner),
        options: options.map((o) => o.text),
        answer,
        explain: explain ? stripTags(explain.inner) : "",
      });
    }
  }
  if (sections.length) {
    // Remove quiz sections back-to-front so earlier indices stay valid.
    for (const section of [...sections].sort((a, b) => b.start - a.start)) {
      cleaned = cleaned.slice(0, section.start) + cleaned.slice(section.end);
    }
  }
  // Any leftover quiz chrome (headers whose section we removed)
  cleaned = cleaned
    .replace(/<h3[^>]*>\s*(Check your understanding|Knowledge check|Quiz)\s*<\/h3>/gi, "")
    .replace(/\n{3,}/g, "\n\n");
  return { html: cleaned, quizzes };
}

export function resolveLesson(courseSlug: string, lessonId: string): ResolvedLesson {
  let raw = "";
  let practice: ResolvedLesson["practice"] = [];
  let quizzes: ExtractedQuiz[] = [];
  let inline = false;

  const authored = authoredByCourse[courseSlug]?.[lessonId];
  if (authored) {
    raw = authored.html;
    quizzes = authored.quizzes ?? [];
    practice = authored.practice ?? [];
  } else if (courseSlug === "operating-systems") {
    raw = osLessons[lessonId]?.content ?? "";
    inline = true;
  } else if (courseSlug === "dbms") {
    const mod = dbmsModules.find((m) => m.id === lessonId);
    raw = mod?.notes ?? "";
    quizzes = (mod?.quiz ?? []).map((q) => ({ ...q }));
    practice = (mod?.practice ?? []).map((p) => ({ prompt: p.prompt, solution: p.solution }));
  } else if (courseSlug === "system-design") {
    for (const sd of sdModules) {
      const topic = sd.topics.find((t) => t.id === lessonId);
      if (topic?.html) {
        raw = topic.html;
        inline = true;
        break;
      }
    }
  }

  if (inline && raw) {
    const extracted = extractInlineQuizzes(raw);
    raw = extracted.html;
    quizzes = [...quizzes, ...extracted.quizzes];
  }

  return { html: raw, quizzes, practice, draft: raw.trim().length === 0 };
}

export type CatalogCourse = (typeof courses)[number];

export const courseSlugs = courses.map((c) => c.slug);

export function findCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}

export function countLessons() {
  return courses.reduce((n, c) => n + c.modules.reduce((m, mod) => m + mod.lessons.length, 0), 0);
}
