"use client";
import React, { useState } from "react";
import SideBar from "./_components/SideBar";
import Header from "./_components/Header";
import { UserCourseListContext } from "../_context/UserCourseListContext";
import MobileSideBar from "./_components/MobileSideBar";

function DashboardLayout({ children }) {
  const [userCourseList, setUserCourseList] = useState([]);
  const [handleSidebar, setHandleSidebar] = useState(false);

  const handleMobileSidebar = () => {
    setHandleSidebar(!handleSidebar);
  };

  return (
    <UserCourseListContext.Provider
      value={{ userCourseList, setUserCourseList }}
    >
      <div>
        <div className="md:w-64 hidden md:block">
          <SideBar />
        </div>

        <div className="md:hidden">
          {handleSidebar && (
            <MobileSideBar handleMobileSidebar={() => handleMobileSidebar()} />
          )}
        </div>

        <div className="md:ml-64">
          <Header hamBurger = {true} handleMobileSidebar={() => handleMobileSidebar()} />
          <div className="p-10">{children}</div>
        </div>
      </div>
    </UserCourseListContext.Provider>
  );
}

export default DashboardLayout;
