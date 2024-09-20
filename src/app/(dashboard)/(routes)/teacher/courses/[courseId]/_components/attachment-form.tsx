"use client";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Attachment, Course } from "@prisma/client";
import axios from "axios";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface AttachmentFormProps {
  initialData : Course & { attachments : Attachment[]},
  courseId : string;
}

const formSchema = z.object({
  url : z.string().min(1)
});

export const AttachmentForm = ({
  initialData,
  courseId
} : AttachmentFormProps) => {

  const [ isEditting, setIsEditting ] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const toggleEditting = () => {
    setIsEditting((current) => !current)
  };

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
    toggleEditting();
    toast.success("Course updated");
    router.refresh();
    } catch(error) {
      toast.error("Something went wrong");
    }
  }

  const onDelete = async (id : string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Course updated");
      router.refresh();
      setDeletingId(null);
    } catch{
      toast.error("Something went wrong");
    }
  }
  return (
    <div className="mt-6 border bg-slate-100 p-4 rounded-md">
      <div className="flex items-center justify-between font-medium ">
        Course Attachments
        <Button onClick={toggleEditting} variant={"ghost"}>
          {isEditting && (
            <>
              Cancel
            </>
          )} 
          {!isEditting && (
            <>
              <PlusCircle className="h-4 w-4 mr-2"/>
              Add an attachemnt
            </>
          )}
        </Button>
      </div>
      {!isEditting && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-slate-500 italic mt-2 text-sm">
              No attachments yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map(attachment => (
                <div className="flex items-center w-full p-3 bg-sky-100 border-sky-200 border text-sky-700 rounded-md" key={attachment.id}>
                  <File className="h-4 w-4 mr-2 flex-shrink-0"/>
                  <p className="text-sm line-clamp-1">{attachment.name}</p>
                  {deletingId === attachment.id && (
                    <div>
                      <Loader2 className="animate-spin h-4 w-4"/>
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button className="ml-auto hover:opacity-75 transition" onClick={() => onDelete(attachment.id)}>
                    <X className="h-4 w-4"/>
                    </button>
                  )}
                </div> 
              ))}
            </div>
          )}
        </>
      )} 
      {isEditting && (
        <div>
          <FileUpload 
            endpoint="courseAttachment"
            onChange={(url) => {
              console.log('File uploaded URL:', url);
              if(url) {
                onSubmit({ url : url})
              }
            }}
          />
          <div className="text-sm text-muted-foreground mt-4">
            Add anything which your students might need in thier journey.
          </div>
        </div>
      )}
    </div>
  )
}