import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { desc, eq } from "drizzle-orm";
import uuid4 from "uuid4";
import { GenerateCourseLayout_AI } from "@/configs/AiModel";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const published = searchParams.get("published");

    let result;

    if (email) {
      result = await db
        .select()
        .from(CourseList)
        .where(eq(CourseList.createdBy, email))
        .orderBy(desc(CourseList.id));
    } else if (published === "true") {
      result = await db
        .select()
        .from(CourseList)
        .where(eq(CourseList.publish, true))
        .orderBy(desc(CourseList.id));
    } else {
      result = await db.select().from(CourseList).orderBy(desc(CourseList.id));
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to load courses", error);
    return NextResponse.json(
      { message: error?.message || "Failed to load courses" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  // ── MAINTENANCE GUARD ──────────────────────────────────────────────────────
  // Course creation is temporarily disabled while we rebuild the platform.
  // Remove this block after 5th September 2025.
  return NextResponse.json(
    {
      maintenance: true,
      message:
        "We are currently rebuilding the AI Course Generator for a better experience. " +
        "Course creation is paused until 5th September 2025. " +
        "Your existing courses are still accessible.",
    },
    { status: 503 },
  );
  // ── END MAINTENANCE GUARD ──────────────────────────────────────────────────

  try {
    const { userCourseInput, user } = await request.json();

    const BASIC_PROMPT =
      "Generate A Course Tutorial on Following Details With field as Course Name, Description, Along with Chapter Name, about, Duration : \n";

    const USER_INPUT_PROMPT =
      "Category: " +
      userCourseInput?.category +
      ", Topic: " +
      userCourseInput?.topic +
      ", Level:" +
      userCourseInput?.level +
      ",Duration:" +
      userCourseInput?.duration +
      ",NoOfChapters:" +
      userCourseInput?.noOfChapters +
      ", in JSON format";

    const FINAL_PROMPT = BASIC_PROMPT + USER_INPUT_PROMPT;
    const result = await GenerateCourseLayout_AI.sendMessage(FINAL_PROMPT);
    const courseLayout = JSON.parse(result.response?.text());

    const id = uuid4();
    const savedCourse = await db
      .insert(CourseList)
      .values({
        courseId: id,
        name: userCourseInput?.topic,
        level: userCourseInput?.level,
        category: userCourseInput?.category,
        courseOutput: courseLayout,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        userName: user?.fullName,
        includeVideo: userCourseInput?.displayVideo,
        userProfileImage: user?.imageUrl,
      })
      .returning();

    return NextResponse.json({ courseId: id, course: savedCourse[0] });
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "Failed to create course" },
      { status: 500 },
    );
  }
}
