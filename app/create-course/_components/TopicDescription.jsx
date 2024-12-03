import { UserInputContext } from "@/app/_context/UserInputContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useContext } from "react";

function TopicDescription() {
  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);

  const handleInputChange = (fieldName, value) => {
    setUserCourseInput((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  return (
    <div className="mx-20 lg:mx-44 flex flex-col gap-10">
      {/* Input Topic */}
      <div className="mt-5">
        <label>
          💡 Write the topic for which you want to genrate a course (e.g., Java
          Course, Web Dev, SDE Interview etc.) :
          <Input
            placeholder={"Topic"}
            className="h-14 text-xl"
            defaultValue={userCourseInput?.topic}
            onChange={(e) => handleInputChange("topic", e.target.value)}
          />
        </label>
      </div>
      <div className="mt-5">
        <label>
          📝 Tell us more about your course, what you want to include in the
          course (Optional)
        </label>
        <Textarea
          placeholder={"About your course"}
          className="h-24 text-xl"
          defaultValue={userCourseInput?.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
      </div>
      {/* Text Are Description */}
    </div>
  );
}

export default TopicDescription;
