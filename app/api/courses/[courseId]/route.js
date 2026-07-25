import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { Chapters, CourseList } from "@/configs/schema";
import { and, eq } from "drizzle-orm";
import { GenerateChapterContent_AI } from "@/configs/AiModel";
import getVideos from "@/configs/service";
import { auth, currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const userAuth = await auth();
    if (!userAuth.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const clerkUser = await currentUser();
    const userEmail = clerkUser?.primaryEmailAddress?.emailAddress;

    const courseId = params.courseId;
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const includeChapterContent =
      searchParams.get("includeChapterContent") === "true";

    let courseResult;

    if (email) {
      if (email !== userEmail) {
        return NextResponse.json({ message: "Unauthorized access to these courses" }, { status: 403 });
      }
      courseResult = await db
        .select()
        .from(CourseList)
        .where(
          and(
            eq(CourseList.courseId, courseId),
            eq(CourseList.createdBy, userEmail),
          ),
        );
    } else {
      courseResult = await db
        .select()
        .from(CourseList)
        .where(eq(CourseList.courseId, courseId));
    }

    const course = courseResult[0];
    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 },
      );
    }

    if (includeChapterContent) {
      const chapters = await db
        .select()
        .from(Chapters)
        .where(eq(Chapters.courseId, courseId));
      return NextResponse.json({ course, chapters });
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error("Failed to load course", error);
    return NextResponse.json(
      { message: error?.message || "Failed to load course" },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const userAuth = await auth();
    if (!userAuth.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const courseId = params.courseId;
    const body = await request.json();
    const { type, payload } = body;

    if (type === "update-course") {
      const updated = await db
        .update(CourseList)
        .set({ courseOutput: payload.courseOutput })
        .where(eq(CourseList.courseId, courseId))
        .returning();

      return NextResponse.json({ course: updated[0] });
    }

    if (type === "update-banner") {
      const updated = await db
        .update(CourseList)
        .set({ courseBanner: payload.courseBanner })
        .where(eq(CourseList.courseId, courseId))
        .returning();

      return NextResponse.json({ course: updated[0] });
    }

    if (type === "publish") {
      const updated = await db
        .update(CourseList)
        .set({ publish: true })
        .where(eq(CourseList.courseId, courseId))
        .returning();

      return NextResponse.json({ course: updated[0] });
    }

    return NextResponse.json(
      { message: "Unsupported action" },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "Failed to update course" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const userAuth = await auth();
    if (!userAuth.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const courseId = params.courseId;
    await db.delete(Chapters).where(eq(Chapters.courseId, courseId));
    await db.delete(CourseList).where(eq(CourseList.courseId, courseId));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "Failed to delete course" },
      { status: 500 },
    );
  }
}

export async function POST(request, { params }) {
  // ── MAINTENANCE GUARD ──────────────────────────────────────────────────────
  // Chapter content generation is temporarily disabled while we rebuild the platform.
  // Remove this block after 5th September 2026.
  return NextResponse.json(
    {
      maintenance: true,
      message:
        "We are currently rebuilding the AI Course Generator for a better experience. " +
        "Course creation is paused until 5th September 2026. " +
        "Your existing courses are still accessible.",
    },
    { status: 503 },
  );
  // ── END MAINTENANCE GUARD ──────────────────────────────────────────────────

  try {
    const courseId = params.courseId;
    const body = await request.json();
    const { course, includeVideo } = body;

    const existingChapters = await db
      .select()
      .from(Chapters)
      .where(eq(Chapters.courseId, courseId));

    if (existingChapters.length > 0) {
      await db.delete(Chapters).where(eq(Chapters.courseId, courseId));
    }

    const chapters = course?.courseOutput?.Chapters || [];

    for (const [index, chapter] of chapters.entries()) {
      const prompt = `
        Generate detailed content for the following topic in strict JSON format:
        - Topic: ${course?.name}
        - Chapter: ${chapter?.ChapterName}

        The response must be a valid JSON object containing an array of objects with the following fields:
        1. "title": A short and descriptive title for the subtopic.
        2. "explanation": A detailed explanation of the subtopic.
        3. "codeExample": A code example (if applicable) wrapped in <precode> tags, or an empty string if no code example is available.

        Ensure:
        - The JSON is valid and follows the specified format.
        - The JSON is properly formatted with no syntax errors.
        - The JSON contains the required fields.
        - The JSON contains the correct data types.
        - Proper escaping of special characters.
        - No trailing commas or malformed syntax.
        - The JSON is properly nested and structured.
        - The response can be parsed directly using JSON.parse().
      `;

      const result = await GenerateChapterContent_AI.sendMessage(prompt);
      const content = JSON.parse(result?.response?.text());

      let videoId = null;
      if (includeVideo === "Yes") {
        const resp = await getVideos(course?.name + ":" + chapter?.ChapterName);
        videoId = [
          resp[0]?.id?.videoId,
          resp[1]?.id?.videoId,
          resp[2]?.id?.videoId,
        ];
      }

      await db.insert(Chapters).values({
        chapterId: index,
        courseId: courseId,
        content: content,
        videoId: videoId,
      });
    }

    await db
      .update(CourseList)
      .set({ publish: true })
      .where(eq(CourseList.courseId, courseId));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "Failed to generate chapter content" },
      { status: 500 },
    );
  }
}
