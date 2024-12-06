"use client";
import ChapterList from "@/app/create-course/[courseId]/_components/ChapterList";
import CourseBasicInfo from "@/app/create-course/[courseId]/_components/CourseBasicInfo";
import CourseDetail from "@/app/create-course/[courseId]/_components/CourseDetail";
import Header from "@/app/dashboard/_components/Header";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { useToast } from "@/hooks/use-toast";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";

function Course({ params }) {
  const Params = React.use(params);
  const { toast } = useToast();
  const [course, setCourse] = useState(null);
  useEffect(() => {
    params && GetCourse();
  }, [params]);

  const GetCourse = async () => {
    try {
      const result = await db
        .select()
        .from(CourseList)
        .where(eq(CourseList.courseId, Params?.courseId));

      // console.log(result[0]);
      setCourse(result[0]);
    } catch (error) {
      // console.log(error);
      toast({
        variant: "destructive",
        duration: 3000,
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };
  return (
    <div>
      <Header />
      <div className="px-10 p-10 md:px-20 lg:px-44">
        <CourseBasicInfo course={course} edit={false} />
        <CourseDetail course={course} />
        <ChapterList course={course} edit={false} />
      </div>
    </div>
  );
}

export default Course;
