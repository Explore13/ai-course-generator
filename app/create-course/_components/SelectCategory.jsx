"use client";
import { UserInputContext } from "@/app/_context/UserInputContext";
import CategoryList from "@/app/_shared/CategoryList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useContext, useState } from "react";

function SelectCategory() {
  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);
  const [inputCategory, setInputCategory] = useState("");

  const handleCategoryChange = (category, active) => {
    setUserCourseInput((prev) => ({
      ...prev,
      category: category,
      activeInput: active,
    }));
  };

  return (
    <div className="px-10 md:px-20">
      <h2 className="my-5">👨🏻‍💻 Select the Course Category</h2>

      <div className="md:grid md:grid-cols-3 gap-10 flex flex-col ">
        {CategoryList.map((item, index) => (
          <div
            key={item.id}
            className={`flex flex-col p-5 border items-center rounded-xl hover:border-primary hover:bg-green-50 cursor-pointer ${
              userCourseInput?.category == item.name &&
              "border-primary bg-green-50"
            }`}
            onClick={() => handleCategoryChange(item.name, false)}
          >
            <Image src={item.icon} alt={item.name} width={50} height={50} />
            <h2>{item.name}</h2>
          </div>
        ))}

        {userCourseInput?.category == "Others" && (
          <div
            className={`flex gap-2 p-5 md:p-2 border items-center justify-between rounded-xl bg-green-50 hover:border-primary hover:bg-green-50 `}
          >
            <Input
              placeholder={"Enter the category"}
              className="h-14 md:h-10 text-xl"
              onChange={(e) => setInputCategory(e.target.value)}
            />
            <Button
              disabled={inputCategory.length <= 0}
              onClick={() => {
                handleCategoryChange(inputCategory, true);
              }}
            >
              <h2>Save</h2>
            </Button>
          </div>
        )}

        {userCourseInput?.activeInput && (
          <div
            className={`flex flex-col p-5 border items-center border-primary bg-green-50 justify-center rounded-xl hover:border-primary hover:bg-green-50 `}
          >
            <Image
              src={"/other.png"}
              alt={"Others Image"}
              width={50}
              height={50}
            />
            <h2>{userCourseInput?.category}</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default SelectCategory;
