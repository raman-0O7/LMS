"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface ChapterTitleFormProps {
  initialData : {
    title : string;
  },
  courseId : string;
  chapterId : string;
}

const formSchema = z.object({
  title : z.string().min(1),
});

export const ChapterTitleForm = ({
  initialData,
  courseId,
  chapterId
} : ChapterTitleFormProps) => {
  const [ isEditting, setIsEditting ] = useState(false);

  const toggleEditting = () => setIsEditting(current => !current);

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
    toggleEditting();
    toast.success("Chapter updated");
    router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }
  return (
    <div className="mt-6 border bg-slate-100 p-4 rounded-md">
      <div className="flex items-center justify-between font-medium ">
        Chapter Title
        <Button onClick={toggleEditting} variant={"ghost"}>
          {isEditting ? (
            <>
              Cancel
            </>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2"/>
              Edit Title
            </>
          )}
        </Button>
      </div>
      {!isEditting && (
        <p className="text-sm mt-2">
          {initialData.title}
        </p>
      )}
      {isEditting && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField 
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input disabled={isSubmitting} placeholder="e.g. 'Introduction to course.'" {...field}/>
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