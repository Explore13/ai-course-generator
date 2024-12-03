import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

function Header() {
  return (
    <div className="flex items-center justify-between p-5 shadow-sm">
      <Image src={"/seedofocode_icon.png"} alt="logo" width={50} height={50} />
      <UserButton />
    </div>
  );
}

export default Header;
