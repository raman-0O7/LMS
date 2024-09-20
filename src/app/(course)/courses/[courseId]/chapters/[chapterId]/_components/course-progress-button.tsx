"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isComplete: boolean;
}
export const CourseProgressButton = ({
  courseId,
  chapterId,
  isComplete,
  nextChapterId
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const confetti = useConfettiStore();
  const Icon = isComplete ? XCircle : CheckCircle;

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
        isComplete: !isComplete
      });

      if(!isComplete && !nextChapterId) {
        confetti.onOpen();
      }

      if(!isComplete && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }

      toast.success("Progress update");
      router.refresh();
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      variant={isComplete ? "outline": "success"}
      className="w-full md:w-auto"
    >
      {isComplete ? "Not Complete": "Mark as Complete"}
      <Icon className="h-4 w-4 ml-2"/>
    </Button>
  )
}