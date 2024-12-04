import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { HiOutlineTrash } from "react-icons/hi2";
import Link from "next/link";
import { HiMiniPencilSquare } from "react-icons/hi2";

function DropdownOption({ courseId, children, handleOnDelete }) {
  const [alertOpen, setAlertOpen] = useState(false);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
        <DropdownMenuContent>
        <DropdownMenuItem>
            <Link href={`/create-course/${courseId}/finish`} className="cursor-pointer">
              <div className="flex gap-1 items-center">
                <HiMiniPencilSquare />
                Edit
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAlertOpen(true)}>
            <div className="flex gap-1 items-center cursor-pointer">
              <HiOutlineTrash />
              Delete
            </div>
          </DropdownMenuItem>
          
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={alertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently your data from
              our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleOnDelete();
                setAlertOpen(false);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default DropdownOption;
