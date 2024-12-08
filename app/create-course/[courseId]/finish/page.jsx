"use client";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CourseBasicInfo from "../_components/CourseBasicInfo";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import {
  EmailIcon,
  EmailShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function FinishScreen({ params }) {
  const Params = React.use(params);
  const { user } = useUser();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // console.log(Params); //courseId
    // console.log(user);

    Params && GetCourse();
  }, [Params, user]);

  const GetCourse = async () => {
    try {
      const params = await Params;
      const result = await db
        .select()
        .from(CourseList)
        .where(
          and(
            eq(CourseList.courseId, Params?.courseId),
            eq(CourseList?.createdBy, user?.primaryEmailAddress?.emailAddress)
          )
        );
      if (result[0]?.publish == false) {
        router.replace("/create-course/" + params?.courseId);
        toast({
          variant: "destructive",
          duration: 3000,
          title: "Course is not published yet.",
          description: "Please complete the course generation process!",
        });
        return;
      }
      setCourse(result[0]);
      setLoading(false);
      // console.log("Course data:", result[0]);
    } catch (error) {
      // console.error("Error fetching course:", error);
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
      {loading && !course ? (
        <div className="px-10 md:px-20 lg:px-44 my-7">
          <Skeleton height={30} width={200} className="mx-auto my-3" />

          <div className="my-3">
            <Skeleton height={20} width="100%" />
            <Skeleton height={20} width="90%" />
            <Skeleton height={20} width="95%" />
          </div>

          <div className="flex justify-center">
            <Skeleton height={40} width={150} />
          </div>

          <Skeleton height={20} width="50%" className="mt-3" />
          <Skeleton height={40} width="100%" className="mt-2 rounded" />

          <div className="flex justify-center items-center gap-5 p-2 mt-2">
            <Skeleton circle={true} height={30} width={30} />
            <Skeleton circle={true} height={30} width={30} />
            <Skeleton circle={true} height={30} width={30} />
          </div>
        </div>
      ) : course ? (
        <div className="px-10 md:px-20 lg:px-44 my-7">
          <h2 className="text-center font-bold text-2xl my-3 text-primary">
            Congrats ! Your Course is Ready
          </h2>

          <CourseBasicInfo course={course} refreshData={() => GetCourse()} />

          <div className="flex justify-center">
            <Link href="/dashboard">
              <Button className="mt-5">Go to Dashboard</Button>
            </Link>
          </div>
          <h2 className="mt-3">Course URL : </h2>
          <h2 className="text-center flex items-center gap-5 justify-center text-gray-400 border p-2 rounded">
            {process.env.NEXT_PUBLIC_HOST_NAME}/course/{course?.courseId}
            <HiOutlineClipboardDocumentCheck
              className="h-5 w-5 cursor-pointer"
              onClick={async () =>
                await navigator.clipboard.writeText(
                  process.env.NEXT_PUBLIC_HOST_NAME +
                    "/course/" +
                    course?.courseId
                )
              }
            />
          </h2>

          <div className="flex justify-center items-center gap-5 p-2 mt-2">
            <h2>Share : </h2>
            <WhatsappShareButton
              title="Check out this course from SeedOfCode. "
              url={`${
                process.env.NEXT_PUBLIC_HOST_NAME +
                "/course/" +
                course?.courseId
              }`}
              windowWidth={800}
              windowHeight={600}
              separator={`Course Name : ${course?.courseOutput?.CourseName} \n Created By : ${course?.userName} \nClick on the link to view the course : `}
            >
              <WhatsappIcon size={30} round={true} />
            </WhatsappShareButton>

            <EmailShareButton
              url={`${
                process.env.NEXT_PUBLIC_HOST_NAME +
                "/course/" +
                course?.courseId
              }`}
              windowWidth={800}
              windowHeight={600}
              subject={`SeedOfCode Course : ${course?.courseOutput?.CourseName}`}
              body="Check out this course from SeedOfCode. "
              separator={`\nCourse Name : ${course?.courseOutput?.CourseName}\n Created By : ${course?.userName} \nClick on the link to view the course : `}
            >
              <EmailIcon size={30} round={true} />
            </EmailShareButton>

            <LinkedinShareButton
              title="Check out this course from SeedOfCode. "
              summary={`\nCourse Name : ${course?.courseOutput?.CourseName}\n Created By : ${course?.userName} \nClick on the link to view the course : `}
              source={`https://seedofcode-ai-course-generator.vercel.app/`}
              url={`${
                process.env.NEXT_PUBLIC_HOST_NAME +
                "/course/" +
                course?.courseId
              }`}
            >
              <LinkedinIcon size={30} round={true} />
            </LinkedinShareButton>
          </div>
        </div>
      ) : (
        <div className="px-10 md:px-20 lg:px-44 my-7">
          <h2 className="text-center text-2xl text-primary my-3">
            Course not found...
          </h2>
        </div>
      )}
    </div>
  );
}

export default FinishScreen;
