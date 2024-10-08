"use client";

import { useConfettiStore } from "@/hooks/use-confetti-store";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface VidoePlayerProps {
  chapterId: string;
  courseId: string;
  title: string;
  nextChapterId?: string;
  playbackId: string;
  isLocked: boolean;
  completeOnEnd: boolean
}

export const VideoPlayer = ({
  chapterId,
  courseId,
  title,
  nextChapterId,
  playbackId,
  isLocked,
  completeOnEnd
}: VidoePlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const confetti = useConfettiStore();
  const router = useRouter();

  const onEnd = async () => {
    try {

      if(completeOnEnd) {
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, { isComplete: true });

        if(!nextChapterId) {
          confetti.onOpen();
        }
        
        if(nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
        }
        toast.success("Progress updated");
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }
  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary"/>
        </div>
      )}
      {
        isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
            <Lock className="h-8 w-8"/>
            <p className="text-sm">
              This chapter is locked
            </p>
          </div>  
        ) 
      }
      {!isLocked && (
        <MuxPlayer 
          title={title}
          className={cn(
            !isReady && "hidden"
          )}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          autoPlay
          playbackId={playbackId}
        />
      )}
    </div>
  )
}