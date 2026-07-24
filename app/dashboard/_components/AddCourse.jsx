"use client";
import { UserCourseListContext } from "@/app/_context/UserCourseListContext";
import MaintenanceDialog from "@/app/_components/MaintenanceDialog";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";

function AddCourse() {
  const { user } = useUser();
  const { userCourseList } = useContext(UserCourseListContext);
  const router = useRouter();
  const [showMaintenance, setShowMaintenance] = useState(false);

  const handleCreateClick = (e) => {
    // Always intercept and show maintenance dialog
    e.preventDefault();
    setShowMaintenance(true);
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl">
          Hello, <span className="font-bold">{user?.fullName || "User"}</span>
        </h2>
        <p className="text-sm text-gray-500">
          Create new course with AI, Share with friends and Learn.
        </p>
      </div>

      <Button onClick={handleCreateClick}>+ Create AI Course</Button>

      <MaintenanceDialog
        open={showMaintenance}
        onClose={() => setShowMaintenance(false)}
      />
    </div>
  );
}

export default AddCourse;
