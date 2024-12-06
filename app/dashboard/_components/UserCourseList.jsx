"use client";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useContext, useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import { UserCourseListContext } from "@/app/_context/UserCourseListContext";
import { useToast } from "@/hooks/use-toast";

function UserCourseList() {
  const [courseList, setCourseList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const { userCourseList, setUserCourseList } = useContext(
    UserCourseListContext
  );

  const { user } = useUser();
  useEffect(() => {
    user && getUserCourses();
    // console.log("User : " + user?.fullName);
  }, [user]);

  const getUserCourses = async () => {
    try {
      const result = await db
        .select()
        .from(CourseList)
        .where(
          eq(CourseList.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
        .orderBy(desc(CourseList.id));

      // console.log(result);
      setCourseList(result);
      setUserCourseList(result);
      localStorage.setItem("userCourseList", JSON.stringify(result));
    } catch (error) {
      toast({
        variant: "destructive",
        duration: 3000,
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="font-medium text-xl">My AI Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map((item, index) => (
            <div
              key={index}
              className="shadow-sm rounded-lg border p-2 mt-4 animate-pulse"
            >
              <div className="w-full h-[200px] bg-gray-300 rounded-lg"> </div>
              <div className="p-2">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"> </div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"> </div>
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-gray-300 rounded w-1/3"> </div>
                  <div className="h-6 bg-gray-300 rounded w-1/4"> </div>
                </div>
              </div>
            </div>
          ))
        ) : courseList?.length != 0 ? (
          courseList.map((course, index) => (
            <CourseCard
              key={index}
              course={course}
              refreshData={() => getUserCourses()}
            />
          ))
        ) : (
          <div className="flex items-center justify-center md:w-[70vw] h-96">
            <h2 className="text-gray-500">
              Please create your first AI course.
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserCourseList;
