"use client";
import { db } from "@/configs/db";
import { CourseList, Chapters } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import CourseBasicInfo from "./_components/CourseBasicInfo";
import CourseDetail from "./_components/CourseDetail";
import ChapterList from "./_components/ChapterList";
import { Button } from "@/components/ui/button";
import { GenerateChapterContent_AI } from "@/configs/AiModel";
import LoadingDialog from "../_components/LoadingDialog";
import getVideos from "@/configs/service";
import { useRouter } from "next/navigation";

function CourseLayout({ params }) {
  const Params = React.use(params);
  const { user } = useUser();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log(Params); //courseId
    console.log(user);

    Params && GetCourse();
  }, [Params, user]);

  const GetCourse = async () => {
    try {
      const result = await db
        .select()
        .from(CourseList)
        .where(
          and(
            eq(CourseList.courseId, Params?.courseId),
            eq(CourseList?.createdBy, user?.primaryEmailAddress?.emailAddress)
          )
        );
      setCourse(result[0]);
      console.log("Course data:", result[0]);
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  const GenerateChapterContent = async () => {
    setLoading(true);

    try {
      const chapters = course?.courseOutput?.Chapters;
      for (const [index, chapter] of chapters.entries()) {
        console.log(`Generating Chapter Content for ${chapter?.ChapterName}`);

        const PROMPT = `Explain the concept in Detail on Topic: ${course?.name}, Chapter: ${chapter?.ChapterName}, in JSON Format with list of array with field as title, explanation on given chapter in detail, Code Example(Code field in <precode> format) if applicable.`;

        const result = await GenerateChapterContent_AI.sendMessage(PROMPT);
        console.log(result?.response?.text());
        const content = JSON.parse(result?.response?.text());

        // Generate Video URL
        console.log(`Generating Video URL for ${chapter?.ChapterName}`);
        let videoId = "";
        const resp = await getVideos(course?.name + ":" + chapter?.ChapterName);

        console.log(resp[0]?.id?.videoId);
        videoId = resp[0]?.id?.videoId;
        console.log(videoId);

        // Save Chapter Content + Video URL

        await db.insert(Chapters).values({
          chapterId: index,
          courseId: course?.courseId,
          content: content,
          videoId: videoId,
        });
      }
      await db
        .update(CourseList)
        .set({
          publish: true,
        })
        .where(eq(CourseList.courseId, course?.courseId));
      router.replace("/create-course/" + course?.courseId + "/finish");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <LoadingDialog loading={loading} />
      <div className="mt-10 px-7 md:px-20 lg:px-44">
        <h2 className="font-bold text-center text-2xl">Course Layout</h2>
        {/* Basic Info */}
        <CourseBasicInfo course={course} refreshData={() => GetCourse()} />
        {/* Course Detail */}
        <CourseDetail course={course} />
        {/* List of Lesson */}
        <ChapterList course={course} refreshData={() => GetCourse()} />

        <Button onClick={() => GenerateChapterContent()} className="my-10">
          Generate Course Content
        </Button>
      </div>
    </>
  );
}

export default CourseLayout;
