import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { Chapters } from "@/configs/schema";
import { and, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const courseId = params.courseId;
    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get("chapterId");

    const result = await db
      .select()
      .from(Chapters)
      .where(
        and(eq(Chapters.courseId, courseId), eq(Chapters.chapterId, chapterId)),
      );

    return NextResponse.json({ chapter: result[0] || null });
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "Failed to load chapter" },
      { status: 500 },
    );
  }
}
