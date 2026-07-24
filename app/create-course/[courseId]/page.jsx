"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import CourseBasicInfo from "./_components/CourseBasicInfo";
import CourseDetail from "./_components/CourseDetail";
import ChapterList from "./_components/ChapterList";
import { Button } from "@/components/ui/button";
import LoadingDialog from "../_components/LoadingDialog";
import MaintenanceDialog from "@/app/_components/MaintenanceDialog";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

function CourseLayout({ params }) {
  const Params = React.use(params);
  const { user } = useUser();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMaintenance, setShowMaintenance] = useState(false);
  const router = useRouter();

  const { toast } = useToast();

  useEffect(() => {
    if (Params && user) {
      GetCourse();
    }
  }, [Params, user]);

  const GetCourse = async () => {
    try {
      const params = await Params;
      const response = await fetch(
        `/api/courses/${params?.courseId}?email=${encodeURIComponent(
          user?.primaryEmailAddress?.emailAddress || "",
        )}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to load course");
      }

      setCourse(data?.course);
    } catch (error) {
      toast({
        variant: "destructive",
        duration: 3000,
        title: "Uh oh! Something went wrong.",
        description: error?.message || "There was a problem with your request.",
      });
    }
  };

  const GenerateChapterContent = async () => {
    // Block chapter generation during maintenance
    setShowMaintenance(true);
  };

  return (
    <>
      <LoadingDialog loading={loading} />
      <div className="mt-10 px-7 md:px-20 lg:px-44">
        <h2 className="font-bold text-center text-2xl">Course Layout</h2>
        <CourseBasicInfo course={course} refreshData={() => GetCourse()} />
        <CourseDetail course={course} />
        <ChapterList course={course} refreshData={() => GetCourse()} />

        <Button onClick={() => GenerateChapterContent()} className="my-10">
          Generate Course Content
        </Button>
      </div>
      <MaintenanceDialog
        open={showMaintenance}
        onClose={() => setShowMaintenance(false)}
      />
    </>
  );
}

export default CourseLayout;
