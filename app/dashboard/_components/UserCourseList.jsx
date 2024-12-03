"use client";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import React, { useContext, useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import { UserCourseListContext } from "@/app/_context/UserCourseListContext";

function UserCourseList() {
  const [courseList, setCourseList] = useState([]);

  const { userCourseList, setUserCourseList } = useContext(
    UserCourseListContext
  );

  const { user } = useUser();
  useEffect(() => {
    user && getUserCourses();
    console.log("User : " + user?.fullName);
  }, [user]);

  const getUserCourses = async () => {
    const result = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList.createdBy, user?.primaryEmailAddress?.emailAddress));

    console.log(result);
    setCourseList(result);
    setUserCourseList(result);
  };

  return (
    <div className="mt-10">
      <h2 className="font-medium text-xl">My AI Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courseList?.length > 0
          ? courseList.map((course, index) => (
              <CourseCard
                key={index}
                course={course}
                refreshData={() => getUserCourses()}
              />
            ))
          : [1, 2, 3, 4, 5, 6].map((item, index) => (
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
            ))}
      </div>
    </div>
  );
}

export default UserCourseList;
