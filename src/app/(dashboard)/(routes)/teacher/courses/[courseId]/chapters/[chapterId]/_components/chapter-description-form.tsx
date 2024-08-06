"use client";

import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter, Course } from "@prisma/client";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface ChapterDescriptionFormProps {
  initialData : Chapter,
  courseId : string;
  chapterId: string;
}

const formSchema = z.object({
  description : z.string().min(1),
});

export const ChapterDescriptionForm = ({
  initialData,
  courseId,
  chapterId
} : ChapterDescriptionFormProps) => {
  const [ isEditting, setIsEditting ] = useState(false);

  const toggleEditting = () => setIsEditting(current => !current);

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description || ""
    }
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toggleEditting();
      toast.success("Chapter updated");
      router.refresh();
    } catch {
      toast.error("Somthing went wrong")
    }
  }
  return (
    <div className="mt-6 border bg-slate-100 p-4 rounded-md">
      <div className="flex items-center justify-between font-medium ">
        Chapter Description
        <Button onClick={toggleEditting} variant={"ghost"}>
          {isEditting ? (
            <>
              Cancel
            </>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2"/>
              Edit description
            </>
          )}
        </Button>
      </div>
      {!isEditting && (
        <p className={cn(
          "text-sm mt-2",
          !initialData.description && "text-slate-500 italic"
        )}>
          {!initialData.description && "No descripition"}
          {initialData.description && (
            <Preview value={initialData.description} />
          )}
        </p>
      )}
      {isEditting && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField 
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              Save
            </Button>
          </form>
        </Form>
      )}
    </div>
  )
}