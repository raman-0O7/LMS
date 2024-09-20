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

interface TitleFormProps {
  initialData : {
    title : string;
  },
  courseId : string;
}

const formSchema = z.object({
  title : z.string().min(1, {
    message : "Title is required"
  })
});

export const TitleForm = ({
  initialData,
  courseId
} : TitleFormProps) => {
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
      await axios.patch(`/api/courses/${courseId}`, values);
    toggleEditting();
    toast.success("Course updated");
    router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }
  return (
    <div className="mt-6 border bg-slate-100 p-4 rounded-md">
      <div className="flex items-center justify-between font-medium ">
        Course Title
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
                    <Input disabled={isSubmitting} placeholder="e.g. 'Advance Web Development'" {...field}/>
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