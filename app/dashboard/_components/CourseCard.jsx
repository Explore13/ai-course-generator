import Image from "next/image";
import React from "react";
import { HiOutlineBookOpen, HiEllipsisVertical } from "react-icons/hi2";
import DropdownOption from "./DropdownOption";
import { db } from "@/configs/db";
import { Chapters, CourseList } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/configs/firebaseConfig";
import Link from "next/link";

function CourseCard({ course, refreshData, displayUser = false }) {
  const handleOnDelete = async () => {
    try {
      console.log("Course : " + course?.courseId);

      // Delete Banner Image
      if (course?.courseBanner != "/placeholder.png") {
        const filePath = course?.courseBanner
          .replace(
            "https://firebasestorage.googleapis.com/v0/b/explorer-1844f.firebasestorage.app/o/",
            ""
          )
          .split("?")[0];
        const fileRef = ref(storage, decodeURIComponent(filePath));

        await deleteObject(fileRef);
        console.log("Image Deleted");
      }

      // Delete Course
      const courseResponse = await db
        .delete(CourseList)
        .where(eq(CourseList.id, course?.id))
        .returning({ id: CourseList?.id });

      console.log("Course Deleted : " + courseResponse);

      // Delete Chapters
      const chapterResponse = await db
        .delete(Chapters)
        .where(eq(Chapters.courseId, course?.courseId))
        .returning({ id: Chapters?.id });

      console.log("Chapters Deleted : " + chapterResponse);

      if (courseResponse && chapterResponse) {
        refreshData();
      }
    } catch (error) {
      console.log("Error during deletion : " + error);
    }
  };

  return (
    <div className="shadow-sm rounded-lg border p-2 hover:scale-105 transition-all cursor-pointer mt-4">
      <Link href={`/course/${course.courseId}`}>
        <Image
          src={course?.courseBanner}
          alt="course"
          width={300}
          height={200}
          className="w-full h-[200px] object-cover rounded-lg"
        />
      </Link>

      <div className="p-2">
        <h2 className="font-medium text-lg flex justify-between items-center">
          {course?.courseOutput?.CourseName}
          {!displayUser && (
            <DropdownOption handleOnDelete={() => handleOnDelete()}>
              <HiEllipsisVertical />
            </DropdownOption>
          )}
        </h2>

        <p className="my-1 text-sm text-gray-500">{course?.category}</p>
        <div className="flex items-center justify-between">
          <h2 className="flex gap-2 items-center p-1 rounded-sm bg-primary/40 text-primary text-sm">
            <HiOutlineBookOpen />
            {course?.courseOutput?.NoOfChapters} Chapters
          </h2>
          <h2 className=" rounded-sm bg-primary/40 text-primary text-sm p-1">
            {course?.level}
          </h2>
        </div>
      </div>
      {displayUser && (
        <div className="flex items-center gap-2 mt-2 pl-1">
          <Image
            src={course?.userProfileImage}
            width={25}
            height={25}
            alt="user profile image"
            className="rounded-full"
          />
          <h2>{course?.userName}</h2>
        </div>
      )}
    </div>
  );
}

export default CourseCard;
