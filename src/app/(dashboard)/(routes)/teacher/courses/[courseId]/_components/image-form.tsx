"use client";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@prisma/client";
import axios from "axios";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface ImageFormProps {
  initialData : Course,
  courseId : string;
}

const formSchema = z.object({
  imageUrl : z.string().min(1, {
    message : "Image is required"
  })
});

export const ImageForm = ({
  initialData,
  courseId
} : ImageFormProps) => {

  const [ isEditting, setIsEditting ] = useState(false);


  const toggleEditting = () => {
    setIsEditting((current) => !current)

  };

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
    toggleEditting();
    toast.success("Course updated");
    router.refresh();
    } catch {
      toast.error("Something went wrong")
    }
  }
  return (
    <div className="mt-6 border bg-slate-100 p-4 rounded-md">
      <div className="flex items-center justify-between font-medium ">
        Course Image
        <Button onClick={toggleEditting} variant={"ghost"}>
          {isEditting && (
            <>
              Cancel
            </>
          )} 
          {!isEditting && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2"/>
              Add an image
            </>
          )}
          {!isEditting && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2"/>
              Edit Image
            </>
          )}
        </Button>
      </div>
      {!isEditting && !initialData.imageUrl && (
        <div className="flex items-center justify-center bg-slate-200 h-60 rounded-md">
          <ImageIcon className="h-10 w-10 text-slate-500"/>
        </div>
      )}  {!isEditting && initialData.imageUrl &&
        (
        <div className="relative aspect-video mt-2">
          <Image 
            alt="Upload"
            fill
            src={initialData.imageUrl }
            className="object-cover rounded-md"
          />
        </div>
      )}
      {isEditting && (
        <div>
          <FileUpload 
            endpoint="courseImage"
            onChange={(url) => {
              console.log('File uploaded URL:', url);
              if(url) {
                onSubmit({ imageUrl : url})
              }
            }}
          />
          <div className="text-sm text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  )
}