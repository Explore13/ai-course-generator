"use client";
import { Button } from "@/components/ui/button";
import React, { useContext, useState } from "react";
import {
  HiMiniSquares2X2,
  HiLightBulb,
  HiClipboardDocumentCheck,
} from "react-icons/hi2";
import SelectCategory from "./_components/SelectCategory";
import TopicDescription from "./_components/TopicDescription";
import SelectOptions from "./_components/SelectOptions";
import { UserInputContext } from "../_context/UserInputContext";
import LoadingDialog from "./_components/LoadingDialog";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

function CreateCourse() {
  const StepperOptions = [
    {
      id: 1,
      name: "Category",
      icon: <HiMiniSquares2X2 />,
    },
    {
      id: 2,
      name: "Topic & Desc",
      icon: <HiLightBulb />,
    },
    {
      id: 3,
      name: "Options",
      icon: <HiClipboardDocumentCheck />,
    },
  ];

  const [loading, setLoading] = useState(false);

  const { userCourseInput } = useContext(UserInputContext);

  const [activeIndex, setActiveIndex] = useState(0);
  const { user } = useUser();
  const { toast } = useToast();

  const checkStatus = () => {
    if (
      activeIndex === 0 &&
      (!userCourseInput?.category || userCourseInput?.category == "Others")
    )
      return true;
    if (activeIndex === 1 && !userCourseInput?.topic) return true;
    if (
      activeIndex === 2 &&
      (!userCourseInput?.level ||
        !userCourseInput?.displayVideo ||
        !userCourseInput?.noOfChapters ||
        !userCourseInput?.duration ||
        userCourseInput.noOfChapters < 1 ||
        userCourseInput.noOfChapters > 20)
    )
      return true;

    return false;
  };

  const router = useRouter();

  const GenerateCourseLayout = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userCourseInput, user }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to generate course layout");
      }

      toast({
        variant: "success",
        duration: 3000,
        title: "Course Layout Generated Successfully!",
        description: "Course Layout has been generated successfully!",
      });

      router.replace(`/create-course/${data?.courseId}`);
    } catch (error) {
      toast({
        variant: "destructive",
        duration: 3000,
        title: "Uh oh! Something went wrong.",
        description: error?.message || "There was a problem with your request.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center mt-10">
        <h2 className="text-4xl text-primary font-medium">Create Course</h2>

        <div className="flex mt-10">
          {StepperOptions.map((item, index) => (
            <div className="flex items-center" key={item.id}>
              <div className="flex flex-col items-center w-[50px] md:w-[100px]">
                <div
                  className={`bg-gray-200 p-3 rounded-full text-white ${
                    activeIndex >= index && "bg-primary"
                  }`}
                >
                  {" "}
                  {item.icon}
                </div>
                <h2 className="hidden md:block md:text-sm">{item.name}</h2>
              </div>
              {index != StepperOptions?.length - 1 && (
                <div
                  className={`h-1 w-[50px] md:w-[100px] rounded-full lg:w-[170px] bg-gray-300 ${
                    activeIndex - 1 >= index && "bg-primary"
                  }
                `}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-10 md:px-20 lg:px-44 mt-10">
        {activeIndex == 0 && <SelectCategory />}
        {activeIndex == 1 && <TopicDescription />}
        {activeIndex == 2 && <SelectOptions />}

        <div className="flex justify-between mt-10 mb-20">
          <Button
            disabled={activeIndex == 0}
            variant="outline"
            onClick={() => setActiveIndex(activeIndex - 1)}
          >
            Previous
          </Button>
          {activeIndex != StepperOptions?.length - 1 && (
            <Button
              onClick={() => setActiveIndex(activeIndex + 1)}
              disabled={checkStatus()}
            >
              Next
            </Button>
          )}
          {activeIndex == StepperOptions?.length - 1 && (
            <Button
              disabled={checkStatus()}
              onClick={() => GenerateCourseLayout()}
            >
              Generate Course Layout
            </Button>
          )}
        </div>
      </div>
      <LoadingDialog loading={loading} />
    </div>
  );
}

export default CreateCourse;
