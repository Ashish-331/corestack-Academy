import { and, asc, eq, inArray, or, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  bookmarks,
  courses,
  lessons,
  modules,
  notes,
  practiceProblems,
  progress,
  quizAnswers,
  quizQuestions,
} from "@/db/schema";

export type CourseSummary = {
  id: number;
  slug: string;
  title: string;
  short: string;
  tagline: string;
  category: string;
  level: string;
  icon: string;
  accent: string;
  glow: string;
  tags: string[];
  lessons: number;
  minutes: number;
  completed: number;
  draft: number;
};

export async function listCourseSummaries(userId?: number | null): Promise<CourseSummary[]> {
  const uid = userId ?? 0;
  const rows = await db.execute<{
    id: number;
    slug: string;
    title: string;
    short: string;
    tagline: string;
    category: string;
    level: string;
    icon: string;
    accent: string;
    glow: string;
    tags: string[];
    lessons: string;
    minutes: string;
    completed: string;
    draft: string;
  }>(sql`
    select c.id, c.slug, c.title, c.short, c.tagline, c.category, c.level, c.icon, c.accent, c.glow,
           c.tags,
           count(l.id) as lessons,
           coalesce(sum(l.minutes), 0) as minutes,
           count(p.id) filter (where p.status = 'completed') as completed,
           count(l.id) filter (where l.draft) as draft
    from courses c
    left join lessons l on l.course_id = c.id
    left join progress p on p.lesson_id = l.id and p.user_id = ${uid}
    where c.published = true
    group by c.id
    order by c.position asc, c.title asc
  `);
  return rows.rows.map((r) => ({
    ...r,
    tags: (r.tags ?? []) as string[],
    lessons: Number(r.lessons),
    minutes: Number(r.minutes),
    completed: Number(r.completed),
    draft: Number(r.draft),
  }));
}

export async function getCourseBySlug(slug: string) {
  const [row] = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
  return row ?? null;
}

export type CourseOutline = Awaited<ReturnType<typeof getCourseOutline>>;

export async function getCourseOutline(courseId: number, userId?: number | null) {
  const uid = userId ?? 0;
  const [mods, lessonRows, prog, marks] = await Promise.all([
    db.select().from(modules).where(eq(modules.courseId, courseId)).orderBy(asc(modules.position)),
    db
      .select({
        id: lessons.id,
        moduleId: lessons.moduleId,
        slug: lessons.slug,
        title: lessons.title,
        summary: lessons.summary,
        minutes: lessons.minutes,
        kind: lessons.kind,
        draft: lessons.draft,
        position: lessons.position,
      })
      .from(lessons)
      .where(eq(lessons.courseId, courseId))
      .orderBy(asc(lessons.position)),
    db
      .select({ lessonId: progress.lessonId, status: progress.status, updatedAt: progress.updatedAt })
      .from(progress)
      .where(and(eq(progress.userId, uid), eq(progress.courseId, courseId))),
    uid
      ? db
          .select({ lessonId: bookmarks.lessonId })
          .from(bookmarks)
          .innerJoin(lessons, eq(lessons.id, bookmarks.lessonId))
          .where(and(eq(bookmarks.userId, uid), eq(lessons.courseId, courseId)))
      : Promise.resolve([] as { lessonId: number }[]),
  ]);

  const progressByLesson = new Map(prog.map((p) => [p.lessonId, p]));
  const bookmarked = new Set(marks.map((m) => m.lessonId));

  return mods.map((m) => ({
    ...m,
    lessons: lessonRows
      .filter((l) => l.moduleId === m.id)
      .sort((a, b) => a.position - b.position)
      .map((l) => ({
        ...l,
        status: progressByLesson.get(l.id)?.status ?? null,
        bookmarked: bookmarked.has(l.id),
      })),
  }));
}

export async function getLessonView(courseSlug: string, lessonSlug: string, userId?: number | null) {
  const uid = userId ?? 0;
  const [row] = await db
    .select({ lesson: lessons, course: courses, module: modules })
    .from(lessons)
    .innerJoin(courses, eq(courses.id, lessons.courseId))
    .innerJoin(modules, eq(modules.id, lessons.moduleId))
    .where(and(eq(courses.slug, courseSlug), eq(lessons.slug, lessonSlug)))
    .limit(1);
  if (!row) return null;

  const siblings = await db
    .select({ id: lessons.id, slug: lessons.slug, title: lessons.title, position: lessons.position })
    .from(lessons)
    .where(eq(lessons.courseId, row.course.id))
    .orderBy(asc(lessons.position));

  const index = siblings.findIndex((l) => l.id === row.lesson.id);

  const [quizRows, practiceRows, myProgress, myAnswer, myBookmark, lessonNotes] = await Promise.all([
    db.select().from(quizQuestions).where(eq(quizQuestions.lessonId, row.lesson.id)).orderBy(asc(quizQuestions.position)),
    db
      .select()
      .from(practiceProblems)
      .where(eq(practiceProblems.lessonId, row.lesson.id))
      .orderBy(asc(practiceProblems.position)),
    uid
      ? db
          .select()
          .from(progress)
          .where(and(eq(progress.userId, uid), eq(progress.lessonId, row.lesson.id)))
          .limit(1)
      : Promise.resolve([]),
    uid
      ? db
          .select({ questionId: quizAnswers.questionId, selectedIndex: quizAnswers.selectedIndex })
          .from(quizAnswers)
          .innerJoin(quizQuestions, eq(quizQuestions.id, quizAnswers.questionId))
          .where(and(eq(quizAnswers.userId, uid), eq(quizQuestions.lessonId, row.lesson.id)))
      : Promise.resolve([]),
    uid
      ? db
          .select({ id: bookmarks.id })
          .from(bookmarks)
          .where(and(eq(bookmarks.userId, uid), eq(bookmarks.lessonId, row.lesson.id)))
          .limit(1)
      : Promise.resolve([]),
    db
      .select()
      .from(notes)
      .where(and(eq(notes.userId, uid), eq(notes.lessonId, row.lesson.id)))
      .orderBy(asc(notes.updatedAt)),
  ]);

  return {
    lesson: row.lesson,
    course: row.course,
    module: row.module,
    prev: index > 0 ? siblings[index - 1] : null,
    next: index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null,
    index,
    total: siblings.length,
    quizzes: quizRows.map((q) => ({ ...q, options: (q.options ?? []) as string[] })),
    practice: practiceRows,
    savedAnswers: Object.fromEntries(myAnswer.map((a) => [a.questionId, a.selectedIndex])),
    progress: myProgress[0] ?? null,
    bookmarked: myBookmark.length > 0,
    notes: lessonNotes,
  };
}

export type DashboardData = Awaited<ReturnType<typeof getDashboard>>;

export async function getDashboard(userId: number) {
  const statsResult = await db.execute<{
    completed: string;
    in_progress: string;
    minutes: string;
    active_days: string;
    quiz_answered: string;
    quiz_correct: string;
    note_count: string;
  }>(sql`
    select
      (select count(*) from progress p where p.user_id = ${userId} and p.status = 'completed') as completed,
      (select count(*) from progress p where p.user_id = ${userId} and p.status = 'in_progress') as in_progress,
      (select coalesce(sum(l.minutes), 0) from progress p join lessons l on l.id = p.lesson_id
        where p.user_id = ${userId} and p.status = 'completed') as minutes,
      (select count(distinct date_trunc('day', p.updated_at)) from progress p
        where p.user_id = ${userId} and p.status = 'completed') as active_days,
      (select count(*) from quiz_answers qa where qa.user_id = ${userId}) as quiz_answered,
      (select count(*) from quiz_answers qa where qa.user_id = ${userId} and qa.correct) as quiz_correct,
      (select count(*) from notes n where n.user_id = ${userId}) as note_count
  `);
  const statsRow = statsResult.rows[0];

  const dayRows = await db.execute<{ d: string }>(sql`
    select distinct to_char(date_trunc('day', updated_at), 'YYYY-MM-DD') as d
    from progress
    where user_id = ${userId} and status = 'completed'
    order by d desc
    limit 120
  `);

  const days = dayRows.rows.map((r) => r.d);
  // Honest streak: walk consecutive days back from today (or yesterday).
  const daySet = new Set(days);
  const today = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  let streak = 0;
  const cursor = new Date(today);
  if (!daySet.has(iso(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (daySet.has(iso(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const courseRows = await listCourseSummaries(userId);

  const [recent, continueRows] = await Promise.all([
    db
      .select({
        id: progress.id,
        status: progress.status,
        updatedAt: progress.updatedAt,
        lessonSlug: lessons.slug,
        lessonTitle: lessons.title,
        minutes: lessons.minutes,
        courseSlug: courses.slug,
        courseTitle: courses.title,
        accent: courses.accent,
      })
      .from(progress)
      .innerJoin(lessons, eq(lessons.id, progress.lessonId))
      .innerJoin(courses, eq(courses.id, progress.courseId))
      .where(eq(progress.userId, userId))
      .orderBy(sql`${progress.updatedAt} desc`)
      .limit(8),
    db
      .select({
        lessonSlug: lessons.slug,
        lessonTitle: lessons.title,
        courseSlug: courses.slug,
        courseTitle: courses.title,
        minutes: lessons.minutes,
        updatedAt: progress.updatedAt,
      })
      .from(progress)
      .innerJoin(lessons, eq(lessons.id, progress.lessonId))
      .innerJoin(courses, eq(courses.id, progress.courseId))
      .where(and(eq(progress.userId, userId), eq(progress.status, "in_progress")))
      .orderBy(sql`${progress.updatedAt} desc`)
      .limit(3),
  ]);

  const pinnedNotes = await db
    .select({
      id: notes.id,
      title: notes.title,
      body: notes.body,
      pinned: notes.pinned,
      updatedAt: notes.updatedAt,
      lessonSlug: lessons.slug,
      courseSlug: courses.slug,
      lessonTitle: lessons.title,
    })
    .from(notes)
    .leftJoin(lessons, eq(lessons.id, notes.lessonId))
    .leftJoin(courses, eq(courses.id, lessons.courseId))
    .where(eq(notes.userId, userId))
    .orderBy(sql`${notes.pinned} desc, ${notes.updatedAt} desc`)
    .limit(4);

  const completed = Number(statsRow?.completed ?? 0);
  const inProgress = Number(statsRow?.in_progress ?? 0);
  const minutes = Number(statsRow?.minutes ?? 0);

  return {
    completed,
    inProgress,
    minutes,
    activeDays: Number(statsRow?.active_days ?? 0),
    streak,
    quiz: {
      answered: Number(statsRow?.quiz_answered ?? 0),
      correct: Number(statsRow?.quiz_correct ?? 0),
    },
    noteCount: Number(statsRow?.note_count ?? 0),
    days: days.slice(0, 28).reverse(),
    courseRows,
    recent,
    continueRows,
    pinnedNotes,
  };
}

export async function listNotes(userId: number) {
  return db
    .select({
      id: notes.id,
      title: notes.title,
      body: notes.body,
      pinned: notes.pinned,
      createdAt: notes.createdAt,
      updatedAt: notes.updatedAt,
      lessonId: notes.lessonId,
      lessonSlug: lessons.slug,
      lessonTitle: lessons.title,
      courseSlug: courses.slug,
      courseTitle: courses.title,
    })
    .from(notes)
    .leftJoin(lessons, eq(lessons.id, notes.lessonId))
    .leftJoin(courses, eq(courses.id, lessons.courseId))
    .where(eq(notes.userId, userId))
    .orderBy(sql`${notes.pinned} desc, ${notes.updatedAt} desc`);
}

export async function listBookmarks(userId: number) {
  return db
    .select({
      lessonId: lessons.id,
      lessonSlug: lessons.slug,
      lessonTitle: lessons.title,
      minutes: lessons.minutes,
      courseSlug: courses.slug,
      courseTitle: courses.title,
      accent: courses.accent,
    })
    .from(bookmarks)
    .innerJoin(lessons, eq(lessons.id, bookmarks.lessonId))
    .innerJoin(courses, eq(courses.id, lessons.courseId))
    .where(eq(bookmarks.userId, userId))
    .orderBy(sql`${bookmarks.createdAt} desc`);
}

export async function searchCatalog(query: string, userId?: number | null) {
  const q = query.trim();
  if (!q) return { courses: [], lessons: [] };
  const like = `%${q.toLowerCase()}%`;
  const uid = userId ?? 0;

  const [courseRows, lessonRows] = await Promise.all([
    db
      .select({
        slug: courses.slug,
        title: courses.title,
        short: courses.short,
        tagline: courses.tagline,
        accent: courses.accent,
        category: courses.category,
      })
      .from(courses)
      .where(
        or(
          sql`lower(${courses.title}) like ${like}`,
          sql`lower(${courses.tagline}) like ${like}`,
          sql`lower(${courses.description}) like ${like}`,
          sql`exists (select 1 from jsonb_array_elements_text(${courses.tags}) t where lower(t) like ${like})`,
        ),
      )
      .limit(8),
    db
      .select({
        id: lessons.id,
        slug: lessons.slug,
        title: lessons.title,
        summary: lessons.summary,
        minutes: lessons.minutes,
        kind: lessons.kind,
        courseSlug: courses.slug,
        courseTitle: courses.title,
        courseShort: courses.short,
        accent: courses.accent,
      })
      .from(lessons)
      .innerJoin(courses, eq(courses.id, lessons.courseId))
      .where(or(sql`lower(${lessons.title}) like ${like}`, sql`lower(${lessons.summary}) like ${like}`))
      .orderBy(asc(courses.position), asc(lessons.position))
      .limit(24),
  ]);

  const ids = lessonRows.map((l) => l.id);
  const done = ids.length
    ? await db
        .select({ lessonId: progress.lessonId })
        .from(progress)
        .where(and(eq(progress.userId, uid), eq(progress.status, "completed"), inArray(progress.lessonId, ids)))
    : [];
  const doneSet = new Set(done.map((d) => d.lessonId));

  return {
    courses: courseRows,
    lessons: lessonRows.map((l) => ({ ...l, completed: doneSet.has(l.id) })),
  };
}
