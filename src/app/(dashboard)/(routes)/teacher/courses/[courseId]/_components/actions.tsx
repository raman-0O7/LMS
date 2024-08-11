"use client";
import { ConfirmModal } from "@/components/modal/confirm-model";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface ActionsProps {
  disabled : boolean;
  courseId: string;
  isPublished: boolean;
}
export const Actions = ({
  disabled,
  courseId,
  isPublished
}: ActionsProps) => {
  const confetti = useConfettiStore();
  const [isLoading , setIsLoading] = useState(false);
  const router = useRouter();

  const onPublish = async () => {
    try {
      setIsLoading(true);

      if(isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success("Course Unpublished");
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success("Course Published");
        confetti.onOpen();
      }

      router.refresh();
    } catch{
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }
  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseId}`)
      toast.success("Course deleted");
      router.refresh();
      router.push(`/teacher/courses`);

    } catch {
      toast.error("Something went wrong!");
    }
    finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="flex items-center gap-x-2">
      <Button 
        disabled={disabled || isLoading}
        onClick={onPublish}
        variant={"outline"}
        size={"sm"}
      >
        {isPublished ? " Unpublish": "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size={"sm"} disabled={isLoading}>
          <Trash className="h-4 w-4"/>
        </Button>
      </ConfirmModal>
    </div>
  )
}