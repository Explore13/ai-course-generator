import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { HiChevronDoubleRight} from "react-icons/hi2";

function Header({hamBurger = false, handleMobileSidebar}) {
  return (
    <div className="flex items-center justify-between p-5 shadow-sm">
      <div className="flex items-center gap-4 justify-center">
        {hamBurger && <HiChevronDoubleRight
          onClick={() => handleMobileSidebar(true)}
          className="md:hidden cursor-pointer"
          size={25}
        />}
        <Link href="/dashboard">
          <Image
            src={"/seedofocode_icon.png"}
            alt="logo"
            width={50}
            height={50}
          />
        </Link>
      </div>
      <UserButton />
    </div>
  );
}

export default Header;

{
  /* <div className="flex items-center justify-between p-5 shadow-sm">
      <Link href="/dashboard">
        <Image
          src={"/seedofocode_icon.png"}
          alt="logo"
          width={50}
          height={50}
        />
      </Link>
      <UserButton />
    </div> */
}
