"use client";
import { db } from "@/configs/db";
import { Chapters, CourseList } from "@/configs/schema";
import { and, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import ChapterListCard from "./_components/ChapterListCard";
import ChapterContent from "./_components/ChapterContent";

function CourseStart({ params }) {
  const Params = React.use(params);
  const [course, setCourse] = useState();
  const [selectedChapter, setSelectedChapter] = useState();
  const [selectedChapterContent, setSelectedChapterContent] = useState();

  useEffect(() => {
    if (Params) GetCourse();
  }, [Params]);

  useEffect(() => {
    if (course && course?.courseOutput?.Chapters?.length > 0) {
      const firstChapter = course?.courseOutput?.Chapters[0];
      setSelectedChapter(firstChapter);
      GetSelectedChapterContent(0);
    }
  }, [course]);

  const GetCourse = async () => {
    try {
      const result = await db
        .select()
        .from(CourseList)
        .where(eq(CourseList.courseId, Params?.courseId));

      if (result.length > 0) {
        const fetchedCourse = result[0];
        setCourse(fetchedCourse);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetching the chapter content
  const GetSelectedChapterContent = async (chapterId) => {
    try {
      console.log("index : " + chapterId);

      const result = await db
        .select()
        .from(Chapters)
        .where(
          and(
            eq(Chapters.courseId, course?.courseId),
            eq(Chapters.chapterId, chapterId)
          )
        );
      console.log(result[0]);
      setSelectedChapterContent(result[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {/* Chapter list Side Bar : LHS */}
      <div className="fixed md:w-72 hidden md:block h-screen border-r shadow-sm">
        <h2 className="font-medium text-white text-lg bg-primary p-4">
          {course?.courseOutput?.CourseName}
        </h2>

        <div className="">
          {course?.courseOutput?.Chapters.map((chapter, index) => (
            <div
              key={index}
              className={`cursor-pointer hover:bg-primary/30 ${
                selectedChapter?.ChapterName == chapter?.ChapterName &&
                "bg-primary/30"
              }`}
              onClick={() => {
                setSelectedChapter(chapter);
                GetSelectedChapterContent(index);
              }}
            >
              <ChapterListCard chapter={chapter} index={index} />
            </div>
          ))}
        </div>
      </div>

      {/* Content Div : RHS */}
      <div className="md:ml-72">
        <ChapterContent
          chapter={selectedChapter}
          content={selectedChapterContent}
        />
      </div>
    </div>
  );
}

export default CourseStart;
