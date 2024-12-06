import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HiPencilSquare } from "react-icons/hi2";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { useToast } from "@/hooks/use-toast";

function EditChapters({ course, index, refreshData }) {
  const Chapters = course?.courseOutput?.Chapters;
  const { toast } = useToast();
  const [chapterName, setChapterName] = useState();
  const [about, setAbout] = useState();

  useEffect(() => {
    setChapterName(Chapters[index]?.ChapterName);
    setAbout(Chapters[index]?.About);
  }, [course]);

  const onUpdateHandler = async () => {
    try {
      course.courseOutput.Chapters[index].ChapterName = chapterName;
      course.courseOutput.Chapters[index].About = about;

      const result = await db
        .update(CourseList)
        .set({ courseOutput: course?.courseOutput })
        .where(eq(CourseList?.id, course?.id))
        .returning({ id: CourseList.id });

      // console.log(result);
      refreshData(true);
      toast({
        variant: "success",
        duration: 3000,
        title: "Chapter Updated Successfully!",
        description: "Chapter has been updated successfully!",
      });
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
      <Dialog>
        <DialogTrigger>
          <HiPencilSquare />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Chapter</DialogTitle>
            <DialogDescription>
              Please update the chapter title and about below.
            </DialogDescription>
          </DialogHeader>

          <div className="text-gray-500 text-sm">
            <div className="mt-3">
              <label>Chapter Name</label>
              <Input
                onChange={(e) => setChapterName(e.target.value)}
                defaultValue={Chapters[index]?.ChapterName}
              />
            </div>
            <div className="mt-3">
              <label>About</label>
              <Textarea
                onChange={(e) => setAbout(e.target.value)}
                className="h-40"
                defaultValue={Chapters[index]?.About}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={() => onUpdateHandler()}>Update</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditChapters;
