import { sql } from "drizzle-orm";
import { db } from "@/db";
import {
  bookmarks,
  courses as coursesTable,
  lessons as lessonsTable,
  modules as modulesTable,
  notes,
  practiceProblems,
  progress,
  quizAnswers,
  quizQuestions,
  users,
} from "@/db/schema";
import { courses, resolveLesson } from "@/content/lookup";
import { hashPassword } from "@/lib/auth";

export const DEMO_PASSWORD = "corestack123";
export const DEMO_AUTHOR_EMAIL = "author@corestack.dev";
export const DEMO_LEARNER_EMAIL = "demo@corestack.dev";

/** deterministic PRNG so demo data is stable between runs */
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const chunk = <T,>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const day = (offset: number, hour = 9) => {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  d.setDate(d.getDate() - offset);
  return d;
};

async function seedCatalog() {
  const courseIds = new Map<string, number>();
  const lessonIds = new Map<string, number>(); // `${courseSlug}/${lessonSlug}`

  for (const [index, course] of courses.entries()) {
    const [row] = await db
      .insert(coursesTable)
      .values({
        slug: course.slug,
        title: course.title,
        short: course.short,
        tagline: course.tagline,
        description: course.description,
        category: course.category,
        level: course.level,
        icon: course.icon,
        accent: course.accent,
        glow: course.glow,
        tags: course.tags,
        outcomes: course.outcomes,
        author: course.author,
        updated: course.updated,
        position: index,
      })
      .onConflictDoNothing()
      .returning({ id: coursesTable.id });
    if (!row) continue;
    courseIds.set(course.slug, row.id);

    for (const [mi, mod] of course.modules.entries()) {
      const [modRow] = await db
        .insert(modulesTable)
        .values({
          courseId: row.id,
          slug: mod.id,
          title: mod.title,
          summary: mod.summary,
          position: mi,
        })
        .returning({ id: modulesTable.id });

      const resolved = mod.lessons.map((lesson) => ({
        lesson,
        content: resolveLesson(course.slug, lesson.id),
      }));

      for (const [li, { lesson, content }] of resolved.entries()) {
        const [lessonRow] = await db
          .insert(lessonsTable)
          .values({
            courseId: row.id,
            moduleId: modRow.id,
            slug: lesson.id,
            title: lesson.title,
            summary: lesson.summary,
            minutes: lesson.minutes,
            kind: lesson.kind,
            contentHtml: content.html,
            draft: content.draft,
            position: li,
          })
          .returning({ id: lessonsTable.id });

        lessonIds.set(`${course.slug}/${lesson.id}`, lessonRow.id);

        if (content.quizzes.length) {
          await db.insert(quizQuestions).values(
            content.quizzes.map((q, qi) => ({
              lessonId: lessonRow.id,
              question: q.q,
              options: q.options,
              answer: q.answer,
              explain: q.explain,
              position: qi,
            })),
          );
        }
        if (content.practice.length) {
          await db.insert(practiceProblems).values(
            content.practice.map((p, pi) => ({
              lessonId: lessonRow.id,
              prompt: p.prompt,
              hint: p.hint ?? "",
              solution: p.solution,
              position: pi,
            })),
          );
        }
      }
    }
  }

  return { courseIds, lessonIds };
}

async function seedLearners(lessonIds: Map<string, number>, courseIds: Map<string, number>) {
  const passwordHash = hashPassword(DEMO_PASSWORD);
  const inserted = await db
    .insert(users)
    .values([
      {
        email: DEMO_AUTHOR_EMAIL,
        name: "Ashish Kumar",
        passwordHash,
        role: "admin",
      },
      {
        email: DEMO_LEARNER_EMAIL,
        name: "Riya Sharma",
        passwordHash,
        role: "student",
      },
    ])
    .onConflictDoNothing()
    .returning({ id: users.id, email: users.email });

  const learnerId = inserted.find((u) => u.email === DEMO_LEARNER_EMAIL)?.id;
  if (!learnerId) return;

  const rand = rng(20260226);

  const plan: { slug: string; dayOffset: number; hour: number }[] = [
    { slug: "operating-systems/m0l0", dayOffset: 17, hour: 8 },
    { slug: "operating-systems/m0l1", dayOffset: 17, hour: 11 },
    { slug: "operating-systems/m0l2", dayOffset: 16, hour: 10 },
    { slug: "operating-systems/m1l0", dayOffset: 16, hour: 15 },
    { slug: "operating-systems/m1l1", dayOffset: 14, hour: 9 },
    { slug: "operating-systems/m1l2", dayOffset: 14, hour: 18 },
    { slug: "operating-systems/m2l0", dayOffset: 12, hour: 7 },
    { slug: "operating-systems/m2l1", dayOffset: 12, hour: 20 },
    { slug: "operating-systems/m2l2", dayOffset: 11, hour: 8 },
    { slug: "operating-systems/m3l0", dayOffset: 9, hour: 12 },
    { slug: "operating-systems/m3l1", dayOffset: 9, hour: 19 },
    { slug: "operating-systems/m3l2", dayOffset: 7, hour: 10 },
    { slug: "dsa/ds-1-l0", dayOffset: 13, hour: 8 },
    { slug: "dsa/ds-1-l1", dayOffset: 13, hour: 21 },
    { slug: "dsa/ds-1-l2", dayOffset: 10, hour: 9 },
    { slug: "dsa/ds-1-l3", dayOffset: 10, hour: 17 },
    { slug: "dsa/ds-2-l0", dayOffset: 8, hour: 8 },
    { slug: "dsa/ds-2-l2", dayOffset: 6, hour: 9 },
    { slug: "dsa/ds-4-l0", dayOffset: 5, hour: 11 },
    { slug: "dsa/ds-4-l1", dayOffset: 4, hour: 8 },
    { slug: "dsa/ds-4-l3", dayOffset: 2, hour: 9 },
    { slug: "computer-networks/cn-1-l0", dayOffset: 6, hour: 14 },
    { slug: "computer-networks/cn-1-l1", dayOffset: 5, hour: 16 },
    { slug: "computer-networks/cn-2-l1", dayOffset: 3, hour: 10 },
    { slug: "computer-networks/cn-3-l0", dayOffset: 3, hour: 21 },
    { slug: "computer-networks/cn-3-l1", dayOffset: 1, hour: 9 },
    { slug: "oops/oo-1-l0", dayOffset: 15, hour: 13 },
    { slug: "oops/oo-1-l1", dayOffset: 15, hour: 20 },
    { slug: "oops/oo-2-l0", dayOffset: 4, hour: 19 },
    { slug: "oops/oo-4-l0", dayOffset: 0, hour: 8 },
    { slug: "dbms/m1", dayOffset: 11, hour: 10 },
    { slug: "dbms/m2", dayOffset: 11, hour: 16 },
    { slug: "dbms/m3", dayOffset: 7, hour: 15 },
  ];

  const rows = plan
    .map((p) => {
      const lessonId = lessonIds.get(p.slug);
      const courseId = courseIds.get(p.slug.split("/")[0]);
      if (!lessonId || !courseId) return null;
      return {
        userId: learnerId,
        courseId,
        lessonId,
        status: "completed" as const,
        completedAt: day(p.dayOffset, p.hour),
        updatedAt: day(p.dayOffset, p.hour),
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  for (const part of chunk(rows, 25)) {
    await db.insert(progress).values(part).onConflictDoNothing();
  }

  // a couple of lessons currently in flight
  const inFlight = ["operating-systems/m4l0", "dsa/ds-3-l0", "computer-networks/cn-3-l2"]
    .map((slug) => {
      const lessonId = lessonIds.get(slug);
      const courseId = courseIds.get(slug.split("/")[0]);
      if (!lessonId || !courseId) return null;
      return {
        userId: learnerId,
        courseId,
        lessonId,
        status: "in_progress" as const,
        updatedAt: day(0, 8),
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);
  if (inFlight.length) await db.insert(progress).values(inFlight).onConflictDoNothing();

  // bookmarks
  const marks = ["operating-systems/m4l1", "dsa/ds-4-l3", "computer-networks/cn-4-l2", "oops/oo-3-l2"]
    .map((slug) => {
      const lessonId = lessonIds.get(slug);
      return lessonId ? { userId: learnerId, lessonId } : null;
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);
  if (marks.length) await db.insert(bookmarks).values(marks).onConflictDoNothing();

  // saved quiz answers for lessons the learner already studied
  const questionRows = await db
    .select({ id: quizQuestions.id, answer: quizQuestions.answer, lessonId: quizQuestions.lessonId })
    .from(quizQuestions)
    .limit(400);

  const completedLessonIds = new Set(rows.map((r) => r.lessonId));
  const answers = questionRows
    .filter((q) => completedLessonIds.has(q.lessonId))
    .filter(() => rand() > 0.25)
    .slice(0, 60)
    .map((q) => {
      const correct = rand() > 0.3;
      const wrongOffset = q.answer === 0 ? 1 : 0;
      return {
        userId: learnerId,
        questionId: q.id,
        selectedIndex: correct ? q.answer : wrongOffset,
        correct,
        updatedAt: day(1 + Math.floor(rand() * 12), 12),
      };
    });
  for (const part of chunk(answers, 25)) {
    await db.insert(quizAnswers).values(part).onConflictDoNothing();
  }

  // notes
  const noteTargets = [
    {
      slug: "operating-systems/m1l1",
      title: "PCB fields I always forget",
      body: "task_struct keeps: pid/ppid, state, saved register context, page table pointer, open fd table, scheduling metadata (vruntime), parent/children lists.\n\nContext switch = swap PCBs. Direct cost 1-5us, indirect cost (cache/TLB pollution) is the one that actually hurts.",
      pinned: true,
    },
    {
      slug: "dsa/ds-4-l3",
      title: "DP checklist before coding",
      body: "1. state — smallest identifier of a subproblem\n2. transition — recurrence in plain English\n3. base case\n4. iteration order\n\nKnapsack inner loop backwards => 0/1, forwards => unbounded. Say it out loud in the interview.",
      pinned: true,
    },
    {
      slug: "computer-networks/cn-3-l1",
      title: "TIME_WAIT notes",
      body: "TIME_WAIT = 2*MSL on the active closer so the final ACK can be retransmitted. Server with thousands of CLOSE_WAIT sockets = app never called close(), not a network issue.",
      pinned: false,
    },
    {
      title: "Interview prep — week 2",
      body: "Finish OS deadlocks module, then do Banker's algorithm practice. Redo the OOD parking-lot write-up with an allocation policy object this time.",
      pinned: false,
    },
  ];

  for (const note of noteTargets) {
    const lessonId = note.slug ? lessonIds.get(note.slug) : undefined;
    await db.insert(notes).values({
      userId: learnerId,
      lessonId: lessonId ?? null,
      title: note.title,
      body: note.body,
      pinned: note.pinned,
      createdAt: day(3, 11),
      updatedAt: day(1, 17),
    });
  }
}

async function runSeed() {
  // Serialise seeding across concurrent requests / instances.
  await db.execute(sql`select pg_advisory_lock(918273465)`);
  try {
    const existing = await db.select({ id: coursesTable.id }).from(coursesTable).limit(1);
    if (existing.length) return;

    const { lessonIds, courseIds } = await seedCatalog();
    await seedLearners(lessonIds, courseIds);
  } finally {
    await db.execute(sql`select pg_advisory_unlock(918273465)`).catch(() => undefined);
  }
}

let seedPromise: Promise<void> | null = null;

/**
 * Seeds the database exactly once per process (and only when empty).
 * Called from the app shell so a fresh deployment boots with a full catalog
 * and a believable learner history.
 */
export function ensureSeeded(): Promise<void> {
  seedPromise ??= runSeed().catch((error) => {
    seedPromise = null;
    throw error;
  });
  return seedPromise;
}
