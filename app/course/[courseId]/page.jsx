"use client";
import ChapterList from "@/app/create-course/[courseId]/_components/ChapterList";
import CourseBasicInfo from "@/app/create-course/[courseId]/_components/CourseBasicInfo";
import CourseDetail from "@/app/create-course/[courseId]/_components/CourseDetail";
import Header from "@/app/dashboard/_components/Header";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { useToast } from "@/hooks/use-toast";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Course({ params }) {
  const Params = React.use(params);
  const { toast } = useToast();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    params && GetCourse();
  }, [params]);

  const GetCourse = async () => {
    try {
      const result = await db
        .select()
        .from(CourseList)
        .where(eq(CourseList.courseId, Params?.courseId));

      if (result[0]?.publish == false) {
        router.replace("/dashboard");
        toast({
          variant: "destructive",
          duration: 3000,
          title: "Course is not published yet.",
        });
        return;
      }
      // console.log(result[0]);
      setCourse(result[0]);
      setLoading(false);
    } catch (error) {
      // console.log(error);
      toast({
        variant: "destructive",
        duration: 3000,
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      setLoading(false);
    }
  };
  return (
    <div>
      <Header />
      <div className="px-10 p-10 md:px-20 lg:px-44">
        {loading && !course ? (
          <div>
            <div className="my-3 border-2 rounded-sm">
              <Skeleton height={50} width="100%" />
              <Skeleton height={50} width="100%" />
            </div>
            <div className="my-3 border-2 rounded-sm">
              <Skeleton height={40} width="100%" />
              <Skeleton height={40} width="100%" />
              <Skeleton height={40} width="100%" />
              <Skeleton height={40} width="100%" />
              <Skeleton height={40} width="100%" />
              <Skeleton height={40} width="100%" />
              <Skeleton height={40} width="100%" />
              <Skeleton height={40} width="100%" />
            </div>
          </div>
        ) : course ? (
          <div>
            <CourseBasicInfo course={course} edit={false} />
            <CourseDetail course={course} />
            <ChapterList course={course} edit={false} />
          </div>
        ) : (
          <div>
            <h2 className="text-center text-2xl text-primary my-3">
              Course not found
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default Course;
