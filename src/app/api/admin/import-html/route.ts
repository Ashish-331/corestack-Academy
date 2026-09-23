import { z } from "zod";
import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { courses, modules, lessons } from "@/db/schema";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { sanitizeLessonHtml } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

function stripHtml(str: string): string {
  return str
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

interface ParsedLesson {
  title: string;
  html: string;
}

interface ParsedModule {
  title: string;
  summary: string;
  lessons: ParsedLesson[];
}

function parseCourseHtml(
  rawHtml: string,
  structureMode: "auto" | "single_lesson" | "by_headings",
  fallbackTitle?: string,
): { courseTitle?: string; courseDescription?: string; parsedModules: ParsedModule[] } {
  // Strip head, style, script sections if present
  let cleanHtml = rawHtml
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .trim();

  // Extract body content if <body> tag exists
  const bodyMatch = cleanHtml.match(/<body[\s\S]*?>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    cleanHtml = bodyMatch[1].trim();
  }

  // Extract course title from first <h1> if present
  let courseTitle: string | undefined;
  const h1Match = cleanHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) {
    courseTitle = stripHtml(h1Match[1]);
  }

  // Extract first paragraph as course description if available
  let courseDescription: string | undefined;
  const leadMatch = cleanHtml.match(/<p(?:\s+class=["'][^"']*lead[^"']*["'])?[^>]*>([\s\S]*?)<\/p>/i);
  if (leadMatch) {
    courseDescription = stripHtml(leadMatch[1]).slice(0, 400);
  }

  if (structureMode === "single_lesson") {
    const lessonTitle = fallbackTitle || courseTitle || "Lesson 1: Complete Guide";
    return {
      courseTitle,
      courseDescription,
      parsedModules: [
        {
          title: "Module 1: Comprehensive Guide",
          summary: "Complete authored curriculum and lessons.",
          lessons: [
            {
              title: lessonTitle,
              html: cleanHtml,
            },
          ],
        },
      ],
    };
  }

  // Find all h2 and h3 occurrences
  const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  const h3Regex = /<h3[^>]*>([\s\S]*?)<\/h3>/gi;

  const h2Matches = [...cleanHtml.matchAll(h2Regex)];
  const h3Matches = [...cleanHtml.matchAll(h3Regex)];

  // Check for content before the first <h2> tag
  const firstH2Index = h2Matches.length > 0 ? (h2Matches[0].index ?? 0) : 0;
  const preH2Raw = h2Matches.length > 0 ? cleanHtml.slice(0, firstH2Index).trim() : "";
  // Strip <h1> tag if present so it does not duplicate the course title
  const preH2Body = preH2Raw.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, "").trim();
  const hasPreH2Content =
    h2Matches.length > 0 &&
    (stripHtml(preH2Body).length > 0 || /<(?:img|svg|table|pre|ul|ol|blockquote|div|p)/i.test(preH2Body));

  // Case A: Both H2 and H3 exist -> H2 = Modules, H3 = Lessons
  if (h2Matches.length > 0 && h3Matches.length > 0 && structureMode !== "by_headings") {
    const parsedModules: ParsedModule[] = [];

    // Split HTML by H2
    for (let i = 0; i < h2Matches.length; i++) {
      const currentMatch = h2Matches[i];
      const modTitle = stripHtml(currentMatch[1]) || `Module ${i + 1}`;
      const startIndex = (currentMatch.index ?? 0) + currentMatch[0].length;
      const nextH2 = h2Matches[i + 1];
      const endIndex = nextH2 ? (nextH2.index ?? cleanHtml.length) : cleanHtml.length;
      const moduleHtml = cleanHtml.slice(startIndex, endIndex);

      // Now find H3s within this module's HTML
      const localH3Matches = [...moduleHtml.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)];
      const lessonsInMod: ParsedLesson[] = [];

      // Preserve content before first H2 in Module 1 as "Overview & Setup"
      if (i === 0 && hasPreH2Content) {
        lessonsInMod.push({
          title: "Overview & Setup",
          html: preH2Body,
        });
      }

      if (localH3Matches.length > 0) {
        for (let j = 0; j < localH3Matches.length; j++) {
          const lMatch = localH3Matches[j];
          const lTitle = stripHtml(lMatch[1]) || `Lesson ${j + 1}`;
          const lStartIndex = (lMatch.index ?? 0) + lMatch[0].length;
          const nextL = localH3Matches[j + 1];
          const lEndIndex = nextL ? (nextL.index ?? moduleHtml.length) : moduleHtml.length;
          const lHtml = moduleHtml.slice(lStartIndex, lEndIndex).trim();

          lessonsInMod.push({
            title: lTitle,
            html: lHtml || `<p class="lead">${lTitle}</p>`,
          });
        }
      } else {
        // Module has no H3, treat module content as one lesson
        lessonsInMod.push({
          title: modTitle,
          html: moduleHtml.trim() || `<p class="lead">${modTitle}</p>`,
        });
      }

      parsedModules.push({
        title: modTitle,
        summary: `Covers key concepts and exercises for ${modTitle}.`,
        lessons: lessonsInMod,
      });
    }

    if (parsedModules.length > 0) {
      return { courseTitle, courseDescription, parsedModules };
    }
  }

  // Case B: Only H2 exists (or structureMode === "by_headings" or no H3) -> Each H2 is a Lesson
  if (h2Matches.length > 0) {
    const parsedLessons: ParsedLesson[] = [];

    // Preserve content before first H2 as "Overview & Setup"
    if (hasPreH2Content) {
      parsedLessons.push({
        title: "Overview & Setup",
        html: preH2Body,
      });
    }

    for (let i = 0; i < h2Matches.length; i++) {
      const currentMatch = h2Matches[i];
      const lTitle = stripHtml(currentMatch[1]) || `Lesson ${i + 1}`;
      const startIndex = (currentMatch.index ?? 0) + currentMatch[0].length;
      const nextMatch = h2Matches[i + 1];
      const endIndex = nextMatch ? (nextMatch.index ?? cleanHtml.length) : cleanHtml.length;
      const lHtml = cleanHtml.slice(startIndex, endIndex).trim();

      parsedLessons.push({
        title: lTitle,
        html: lHtml || `<p class="lead">${lTitle}</p>`,
      });
    }

    return {
      courseTitle,
      courseDescription,
      parsedModules: [
        {
          title: "Module 1: Core Curriculum",
          summary: "Primary course lessons and concept deep dives.",
          lessons: parsedLessons,
        },
      ],
    };
  }

  // Case C: Single lesson or no major headings
  const singleTitle = fallbackTitle || courseTitle || (h2Matches[0] ? stripHtml(h2Matches[0][1]) : "Lesson 1: Overview");
  return {
    courseTitle,
    courseDescription,
    parsedModules: [
      {
        title: "Module 1: Introduction & Concepts",
        summary: "Fundamental course material and interactive lessons.",
        lessons: [
          {
            title: singleTitle,
            html: cleanHtml,
          },
        ],
      },
    ],
  };
}

const importSchema = z.object({
  mode: z.enum(["new_course", "existing_course"]).default("new_course"),
  title: z.string().trim().max(120).optional(),
  slug: z.string().trim().max(60).optional(),
  short: z.string().trim().max(8).optional(),
  tagline: z.string().trim().max(200).optional(),
  description: z.string().trim().max(4000).optional(),
  category: z.enum(["Systems", "Data", "Architecture", "Networks", "Programming"]).default("Programming"),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]).default("Beginner"),
  accent: z.string().trim().default("from-indigo-500 to-violet-500"),
  glow: z.string().trim().default("shadow-indigo-500/30"),
  tags: z.array(z.string().trim()).default([]),
  outcomes: z.array(z.string().trim()).default([]),
  author: z.string().trim().default("CoreStack Academy"),

  courseId: z.number().int().positive().optional(),
  moduleId: z.number().int().positive().optional(),

  html: z.string().min(1, "HTML content is required"),
  structureMode: z.enum(["auto", "single_lesson", "by_headings"]).default("auto"),
  defaultLessonTitle: z.string().trim().optional(),
});

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = importSchema.parse(await request.json());

    const { courseTitle, courseDescription, parsedModules } = parseCourseHtml(
      body.html,
      body.structureMode,
      body.defaultLessonTitle,
    );

    if (body.mode === "new_course") {
      const finalTitle = body.title?.trim() || courseTitle || "New Imported Course";
      const baseSlug = body.slug?.trim() || slugify(finalTitle) || "imported-course";

      // Ensure slug uniqueness
      let finalSlug = baseSlug;
      const existing = await db
        .select({ id: courses.id })
        .from(courses)
        .where(eq(courses.slug, finalSlug))
        .limit(1);

      if (existing.length > 0) {
        finalSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
      }

      const finalShort =
        body.short?.trim() ||
        finalTitle
          .split(" ")
          .map((w) => w[0])
          .slice(0, 3)
          .join("")
          .toUpperCase() ||
        "CS";

      const finalTagline =
        body.tagline?.trim() ||
        courseDescription?.slice(0, 180) ||
        `Comprehensive curriculum on ${finalTitle}.`;

      const finalDescription = body.description?.trim() || courseDescription || finalTagline;

      // Determine highest position for courses
      const [posRow] = await db
        .select({ maxPos: sql<number>`coalesce(max(${courses.position}), 0)` })
        .from(courses);
      const nextCoursePos = (posRow?.maxPos ?? 0) + 1;

      // Insert course
      const [courseRow] = await db
        .insert(courses)
        .values({
          title: finalTitle,
          slug: finalSlug,
          short: finalShort,
          tagline: finalTagline,
          description: finalDescription,
          category: body.category,
          level: body.level,
          accent: body.accent,
          glow: body.glow,
          tags: body.tags.length ? body.tags : [body.category, "Curriculum"],
          outcomes: body.outcomes.length
            ? body.outcomes
            : [`Understand core mechanics of ${finalTitle}`, "Apply patterns in real-world scenarios"],
          author: body.author || "CoreStack Academy",
          published: true,
          position: nextCoursePos,
        })
        .returning();

      let totalLessonsInserted = 0;

      // Insert modules and lessons
      for (let mIdx = 0; mIdx < parsedModules.length; mIdx++) {
        const mod = parsedModules[mIdx];
        const cleanModTitle = slugify(mod.title).slice(0, 25) || "module";
        const uniqueModSuffix = Math.random().toString(36).substring(2, 6);
        const modSlug = `m${mIdx + 1}-${cleanModTitle}-${uniqueModSuffix}`;

        const [modRow] = await db
          .insert(modules)
          .values({
            courseId: courseRow.id,
            slug: modSlug,
            title: mod.title,
            summary: mod.summary,
            position: mIdx,
          })
          .returning();

        for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
          const l = mod.lessons[lIdx];
          const sanitized = sanitizeLessonHtml(l.html);

          // Extract summary from first paragraph
          const pMatch = sanitized.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
          const extractedSummary = pMatch
            ? stripHtml(pMatch[1]).slice(0, 250)
            : `Deep dive into ${l.title}.`;

          // Calculate estimated minutes based on word count
          const plainWords = stripHtml(sanitized).split(/\s+/).filter(Boolean).length;
          const minutes = Math.max(5, Math.ceil(plainWords / 140));

          const lessonSlug = `l${mIdx + 1}-${lIdx + 1}-${slugify(l.title).slice(0, 25)}-${Math.random().toString(36).substring(2, 6)}`;

          await db.insert(lessons).values({
            courseId: courseRow.id,
            moduleId: modRow.id,
            slug: lessonSlug,
            title: l.title,
            summary: extractedSummary,
            minutes,
            kind: "reading",
            contentHtml: sanitized,
            draft: false,
            position: lIdx,
          });

          totalLessonsInserted++;
        }
      }

      return Response.json({
        success: true,
        course: {
          id: courseRow.id,
          slug: courseRow.slug,
          title: courseRow.title,
        },
        modulesCount: parsedModules.length,
        lessonsCount: totalLessonsInserted,
        message: `Successfully created course "${courseRow.title}" with ${parsedModules.length} module(s) and ${totalLessonsInserted} lesson(s).`,
      });
    } else {
      // existing_course mode
      if (!body.courseId) {
        throw new HttpError(400, "courseId is required when importing into an existing course.");
      }

      const [existingCourse] = await db
        .select()
        .from(courses)
        .where(eq(courses.id, body.courseId))
        .limit(1);

      if (!existingCourse) {
        throw new HttpError(404, "Course not found.");
      }

      let targetModuleId = body.moduleId;
      let totalLessonsInserted = 0;

      if (targetModuleId) {
        // Append all lessons into the specified module
        const [modCountRow] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(lessons)
          .where(eq(lessons.moduleId, targetModuleId));

        let currentPos = Number(modCountRow?.count ?? 0);

        for (const mod of parsedModules) {
          for (const l of mod.lessons) {
            const sanitized = sanitizeLessonHtml(l.html);
            const pMatch = sanitized.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
            const extractedSummary = pMatch
              ? stripHtml(pMatch[1]).slice(0, 250)
              : `Deep dive into ${l.title}.`;
            const plainWords = stripHtml(sanitized).split(/\s+/).filter(Boolean).length;
            const minutes = Math.max(5, Math.ceil(plainWords / 140));

            const lessonSlug = `import-${slugify(l.title).slice(0, 25)}-${Math.random().toString(36).substring(2, 6)}`;

            await db.insert(lessons).values({
              courseId: existingCourse.id,
              moduleId: targetModuleId,
              slug: lessonSlug,
              title: l.title,
              summary: extractedSummary,
              minutes,
              kind: "reading",
              contentHtml: sanitized,
              draft: false,
              position: currentPos++,
            });

            totalLessonsInserted++;
          }
        }
      } else {
        // Create new modules and lessons under existing course
        const [modCountRow] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(modules)
          .where(eq(modules.courseId, existingCourse.id));

        let modPos = Number(modCountRow?.count ?? 0);

        for (const mod of parsedModules) {
          const cleanModTitle = slugify(mod.title).slice(0, 25) || "module";
          const uniqueModSuffix = Math.random().toString(36).substring(2, 6);
          const modSlug = `mod-${modPos + 1}-${cleanModTitle}-${uniqueModSuffix}`;
          const [newMod] = await db
            .insert(modules)
            .values({
              courseId: existingCourse.id,
              slug: modSlug,
              title: mod.title,
              summary: mod.summary,
              position: modPos++,
            })
            .returning();

          for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
            const l = mod.lessons[lIdx];
            const sanitized = sanitizeLessonHtml(l.html);
            const pMatch = sanitized.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
            const extractedSummary = pMatch
              ? stripHtml(pMatch[1]).slice(0, 250)
              : `Deep dive into ${l.title}.`;
            const plainWords = stripHtml(sanitized).split(/\s+/).filter(Boolean).length;
            const minutes = Math.max(5, Math.ceil(plainWords / 140));

            const lessonSlug = `l-${newMod.id}-${lIdx + 1}-${slugify(l.title).slice(0, 25)}-${Math.random().toString(36).substring(2, 6)}`;

            await db.insert(lessons).values({
              courseId: existingCourse.id,
              moduleId: newMod.id,
              slug: lessonSlug,
              title: l.title,
              summary: extractedSummary,
              minutes,
              kind: "reading",
              contentHtml: sanitized,
              draft: false,
              position: lIdx,
            });

            totalLessonsInserted++;
          }
        }
      }

      return Response.json({
        success: true,
        course: {
          id: existingCourse.id,
          slug: existingCourse.slug,
          title: existingCourse.title,
        },
        lessonsCount: totalLessonsInserted,
        message: `Successfully imported ${totalLessonsInserted} lesson(s) into course "${existingCourse.title}".`,
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues[0]?.message ?? "Invalid import payload" }, { status: 422 });
    }
    return errorResponse(error);
  }
}
