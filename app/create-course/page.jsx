"use client";
import { Button } from "@/components/ui/button";
import React, { useContext, useEffect, useState } from "react";
import {
  HiMiniSquares2X2,
  HiLightBulb,
  HiClipboardDocumentCheck,
} from "react-icons/hi2";
import SelectCategory from "./_components/SelectCategory";
import TopicDescription from "./_components/TopicDescription";
import SelectOptions from "./_components/SelectOptions";
import { UserInputContext } from "../_context/UserInputContext";
import { GenerateCourseLayout_AI } from "@/configs/AiModel";
import LoadingDialog from "./_components/LoadingDialog";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import uuid4 from "uuid4";
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

  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);

  const [activeIndex, setActiveIndex] = useState(0);
  const { user } = useUser();
  const { toast } = useToast();

  // useEffect(() => {
  //   // console.log(userCourseInput);
  // }, [userCourseInput]);

  /**
   *  Used to check Next Button enabled or disabled
   */

  const checkStatus = () => {
    // if (userCourseInput?.length == 0) return true;
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
      const BASIC_PROMPT =
        "Generate A Course Tutorial on Following Details With field as Course Name, Description, Along with Chapter Name, about, Duration : \n";

      const USER_INPUT_PROMPT =
        "Category: " +
        userCourseInput?.category +
        ", Topic: " +
        userCourseInput?.topic +
        ", Level:" +
        userCourseInput?.level +
        ",Duration:" +
        userCourseInput?.duration +
        ",NoOfChapters:" +
        userCourseInput?.noOfChapters +
        ", in JSON format";

      const FINAL_PROMPT = BASIC_PROMPT + USER_INPUT_PROMPT;
      // console.log(FINAL_PROMPT);

      const result = await GenerateCourseLayout_AI.sendMessage(FINAL_PROMPT);
      // console.log(result.response.text());
      // console.log(JSON.parse(result.response.text()));
      SaveCourseLayoutInDB(JSON.parse(result.response?.text()));
      toast({
        variant: "success",
        duration: 3000,
        title: "Course Layout Generated Successfully!",
        description: "Course Layout has been generated successfully!",
      });
    } catch (error) {
      // console.log(error);
      toast({
        variant: "destructive",
        duration: 3000,
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
      setLoading(false);
    }
  };

  const SaveCourseLayoutInDB = async (courseLayout) => {
    try {
      var id = uuid4();
      const result = await db.insert(CourseList).values({
        courseId: id,
        name: userCourseInput?.topic,
        level: userCourseInput?.level,
        category: userCourseInput?.category,
        courseOutput: courseLayout,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        userName: user?.fullName,
        includeVideo: userCourseInput?.displayVideo,
        userProfileImage: user?.imageUrl,
      });

      // console.log("Course Layout Saved in DB", result.command);
      router.replace(`/create-course/${id}`);
    } catch (error) {
      // console.log(error);
      toast({
        variant: "destructive",
        duration: 3000,
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };
  return (
    <div>
      {/* Stepper */}
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
              <div>
      
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-10 md:px-20 lg:px-44 mt-10">
        {/* Components */}
        {activeIndex == 0 && <SelectCategory />}
        {activeIndex == 1 && <TopicDescription />}
        {activeIndex == 2 && <SelectOptions />}
        {/* Next and Previous Button */}

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
