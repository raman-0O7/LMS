"use client";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Chapter, MuxData } from "@prisma/client";
import axios from "axios";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import * as z from "zod";
import MuxPlayer from "@mux/mux-player-react";

interface ChapterVideoFormProps {
  initialData : Chapter & { muxData?: MuxData | null},
  courseId : string;
  chapterId : string;
}

const formSchema = z.object({
  videoUrl : z.string().min(1),
});

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId
} : ChapterVideoFormProps) => {

  const [ isEditting, setIsEditting ] = useState(false);


  const toggleEditting = () => {
    setIsEditting((current) => !current)

  };

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
    toggleEditting();
    toast.success("Chapter updated");
    router.refresh();
    } catch {
      toast.error("Something went wrong")
    }
  }
  return (
    <div className="mt-6 border bg-slate-100 p-4 rounded-md">
      <div className="flex items-center justify-between font-medium ">
        Chapter video
        <Button onClick={toggleEditting} variant={"ghost"}>
          {isEditting && (
            <>
              Cancel
            </>
          )} 
          {!isEditting && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2"/>
              Add a video
            </>
          )}
          {!isEditting && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2"/>
              Edit Video
            </>
          )}
        </Button>
      </div>
      {!isEditting && !initialData.videoUrl && (
        <div className="flex items-center justify-center bg-slate-200 h-60 rounded-md">
          <Video className="h-10 w-10 text-slate-500"/>
        </div>
      )}  {!isEditting && initialData.videoUrl &&
        (
        <div className="relative aspect-video mt-2">
          <MuxPlayer 
            playbackId={initialData.muxData?.playbackId || ""}
          />
        </div>
      )}
      {isEditting && (
        <div>
          <FileUpload 
            endpoint="chapterVideo"
            onChange={(url) => {
              if(url) {
                onSubmit({ videoUrl : url})
              }
            }}
          />
          <div className="text-sm text-muted-foreground mt-4">
            Upload a video
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditting && (
        <div className="text-sm text-muted-foreground mt-2">
          Video uploading can take few minutes to process. Please refresh the page if video is not appeared.
        </div>
      )}
    </div>
  )
}