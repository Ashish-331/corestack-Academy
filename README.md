# CoreStack

A full-stack rebuild of [Ashish-331/CoreStack](https://github.com/Ashish-331/CoreStack) — the six-course
CS curriculum (Operating Systems, DBMS, System Design, DSA, Object-Oriented Design, Computer Networks) —
on **Next.js (App Router) + PostgreSQL + Drizzle ORM**, with accounts, tracked progress, quizzes,
notes and an authoring studio.

The original project was a static Vite SPA that kept progress in `localStorage` and rendered lesson
bodies from bundled TypeScript constants. This version keeps the same content model but makes it a
server-backed application:

| Area | Before (Vite SPA) | Now |
| --- | --- | --- |
| Auth | none | email + password (scrypt), DB-backed sessions, httpOnly cookie |
| Progress | `localStorage` | `progress` table keyed on `(user, lesson)` |
| Quiz answers | DBMS only, `localStorage` | one system, all courses, persisted |
| Notes / bookmarks | none | full CRUD, linked to lessons |
| Catalog | compiled into the bundle | `courses → modules → lessons` rows, editable in-app |
| Routing | `HashRouter` | App Router server components (real URLs, per-page metadata) |
| Lesson HTML | regex strip of `on*` attrs | `sanitize-html` allow-list before render |

## Quick start

```bash
npm install
npm run db:push     # create tables (drizzle-kit push)
npm run dev         # http://localhost:3000
```

The database seeds itself on first request: `ensureSeeded()` (`src/lib/seed.ts`) checks whether the
`courses` table is empty and, if so, inserts the full catalog plus two demo accounts inside a
Postgres advisory lock, so concurrent requests cannot double-seed.

```
demo@corestack.dev    / corestack123     # learner: 33 completed lessons, notes, quiz history
author@corestack.dev  / corestack123     # admin: can edit the catalog in /admin
```

Useful scripts:

```bash
npm run db:push      # apply src/db/schema.ts to Postgres
npm run db:seed      # force a seed run (no-op when data already exists)
npm run build        # production build
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
```

`DATABASE_URL` is read from `.env`.

## The content model

```
courses (slug, title, category, level, accent, tags[], outcomes[])
  └── modules (title, summary, position)
        └── lessons (slug, title, minutes, kind, contentHtml, draft, position)
              ├── quiz_questions (question, options[], answer, explain)
              └── practice_problems (prompt, hint, solution)
```

Authored material lives in `src/content/` and is **seeded into those tables**, not bundled into the
client:

| File | Shape | Used by |
| --- | --- | --- |
| `src/content/catalog.ts` | `Course[]` with modules + lesson metadata | every course |
| `src/content/os-content.ts` | `Record<lessonId, { content }>` | operating-systems |
| `src/content/dbms-content.ts` | `{ id, title, notes, quiz[], practice[] }[]` | dbms |
| `src/content/sd-content.ts` | `{ id, topics: [{ id, html }] }[]` | system-design |
| `src/content/dsa-content.ts` | `Record<lessonId, { html, quizzes?, practice? }>` | dsa |
| `src/content/oops-content.ts` | `Record<lessonId, { html, quizzes?, practice? }>` | oops |
| `src/content/cn-content.ts` | `Record<lessonId, { html, quizzes?, practice? }>` | computer-networks |

`src/content/lookup.ts` is the single lookup chain: given `(courseSlug, lessonId)` it returns the
authored HTML plus any structured quizzes/practice. **Every lesson in the catalog resolves to real
authored content** — the placeholder/mail-merge generator from the original repo is gone. A lesson
with no authored body is instead stored with `draft: true`, which renders an explicit
"no authored material yet" notice rather than silent boilerplate.

Lesson HTML is sanitised server-side with `sanitize-html` (`src/lib/sanitize.ts`) before it reaches
`dangerouslySetInnerHTML`. Inline `quiz-*` markup that existed inside OS/system-design bodies is
extracted into `quiz_questions` rows at seed time, so **one** quiz component renders **all** quizzes
and **one** API (`POST /api/quiz-answers`) persists every answer.

## Application surface

| Route | What it does |
| --- | --- |
| `/` | public landing page (server rendered, SEO metadata) |
| `/login`, `/register` | auth forms with one-click demo credentials |
| `/dashboard` | stats (completed, study time, active days, consecutive streak), continue-learning, per-course progress, recent activity, recent notes |
| `/catalog` | searchable course grid + **lesson-level results** linking straight to the matched lesson |
| `/courses/[slug]` | course detail: outcomes, curriculum accordion, progress |
| `/courses/[slug]/[lessonSlug]` | lesson reader: sanitised body, TOC, quiz, practice, notes, complete + bookmark, prev/next |
| `/notes` | note CRUD (create, edit, pin, delete) with optimistic updates |
| `/bookmarks` | saved lessons |
| `/admin` | author studio: course/module/lesson CRUD, quiz JSON editing, draft flag |

API routes live under `src/app/api/`: `auth/{register,login,logout}`, `progress`, `bookmarks`,
`quiz-answers`, `notes` + `notes/[id]`, `search`, `courses` + `courses/[slug]`, `modules`,
`lessons` + `lessons/[id]`. Admin routes are role-gated (`requireAdmin()`); everything learner-facing
is session-gated (`requireUser()`).

### UX details

- **Optimistic updates** on completion toggles, bookmarks, quiz answers and every note mutation, each
  with rollback when the request fails.
- **Loading states** via `loading.tsx` skeletons and inline spinners; search debounces at ~220 ms with
  an `AbortController`.
- **Empty states** for progress, notes, bookmarks, search misses and admin-without-courses.
- **Responsive**: sidebar collapses to a drawer under `lg`, grids reflow at `sm`/`md`/`lg`.
- **Error boundaries** at the root and inside the app shell, with retry.
- `streak` is a real consecutive-day calculation; "active days" is the distinct-day count. Both are
  labelled honestly on the dashboard.

## Repo hygiene notes

- The upstream repo committed `dist/index.html` while also ignoring `dist/`. This project has no
  committed build output — `dist/` does not exist, and CI builds from source on every push.
- ESLint (Next + TypeScript) runs in CI along with `tsc --noEmit` and `next build`; see
  `.github/workflows/ci.yml`.
- The upstream `test-app.mjs` / `test-debug.mjs` imported `puppeteer-core`, which was never declared
  as a dependency, so neither script could run. They are not carried over; the CI build plus type
  check is the smoke test.
- `package.json` is named `corestack`, not the Vite scaffold default.
