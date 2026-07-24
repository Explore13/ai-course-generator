"use client";
import ChapterList from "@/app/create-course/[courseId]/_components/ChapterList";
import CourseBasicInfo from "@/app/create-course/[courseId]/_components/CourseBasicInfo";
import CourseDetail from "@/app/create-course/[courseId]/_components/CourseDetail";
import Header from "@/app/dashboard/_components/Header";
import { useToast } from "@/hooks/use-toast";
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
    if (Params) {
      GetCourse();
    }
  }, [Params]);

  const GetCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${Params?.courseId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to load course");
      }

      if (data?.course?.publish == false) {
        router.replace("/dashboard");
        toast({
          variant: "destructive",
          duration: 3000,
          title: "Course is not published yet.",
        });
        return;
      }

      setCourse(data?.course);
      setLoading(false);
    } catch (error) {
      toast({
        variant: "destructive",
        duration: 3000,
        title: "Uh oh! Something went wrong.",
        description: error?.message || "There was a problem with your request.",
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
