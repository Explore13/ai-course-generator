"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { use, useContext, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

import {
  HiOutlineHome,
  HiOutlineSquare3Stack3D,
  HiOutlineShieldCheck,
  HiMiniPower,
  HiChevronDoubleLeft,
} from "react-icons/hi2";
import { UserCourseListContext } from "@/app/_context/UserCourseListContext";

function MobileSideBar({ handleMobileSidebar }) {
  const { userCourseList, setUserCourseList } = useContext(
    UserCourseListContext
  );

  const path = usePathname();
  const Menu = [
    {
      id: 1,
      name: "Home",
      icon: <HiOutlineHome />,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Explore",
      icon: <HiOutlineSquare3Stack3D />,
      path: "/dashboard/explore",
    },
    {
      id: 3,
      name: "Upgrade",
      icon: <HiOutlineShieldCheck />,
      path: "/dashboard/upgrade",
    },
    {
      id: 4,
      name: "LogOut",
      icon: <HiMiniPower />,
      path: "/dashboard/logout",
    },
  ];

  return (
    <div className="fixed bg-white h-full md:w-64 p-5 shadow-md z-50">
      <div className="flex items-center justify-between">
        <Link href="/dashboard">
          <Image
            src={"/seedofocode_icon.png"}
            alt="logo"
            width={50}
            height={50}
          />
        </Link>
        <HiChevronDoubleLeft
          onClick={() => handleMobileSidebar(true)}
          className="md:hidden cursor-pointer"
          size={25}
        />
      </div>
      <hr className="my-5" />
      <ul>
        {Menu.map((item, index) => (
          <Link href={item.path} key={index}>
            <div
              className={`flex items-center gap-2 text-gray-600 p-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg mb-2 ${
                item.path === path && "bg-gray-100 text-black"
              }`}
            >
              <div className="text-2xl">{item.icon}</div>
              <h2>{item.name}</h2>
            </div>
          </Link>
        ))}
      </ul>

      <div className="absolute bottom-10 w-[80%]">
        <Progress value={(userCourseList?.length / 5) * 100} />

        <h2 className="text-sm my-2">
          {userCourseList?.length} Out of 5 Course Created
        </h2>
        <h2 className="text-xs text-gray-700">
          Upgrade your plan for unlimited course generation
        </h2>
      </div>
    </div>
  );
}

export default MobileSideBar;
