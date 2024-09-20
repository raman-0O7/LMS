"use client";

import * as z from "zod";
import axios from "axios";
import {
  Form,
  FormDescription,
  FormControl,
  FormItem,
  FormMessage,
  FormField,
  FormLabel
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const router = useRouter();
  const formSchema = z.object({
    title : z.string().min(1, {
      message: "Title is required"
    }),
  });
  const form = useForm<z.infer<typeof formSchema>> ({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ""
    }
  });

  const {isSubmitting, isValid} = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/courses", values);
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success("Course Created");
    } catch {
      toast.error("Something went wrong!")
    }
  }
  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">
          Name your course
        </h1>
        <p className="text-slate-600 text-sm">
          What would you like to name your course. Don&apos;t worry you can change it later
        </p>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField 
              control={form.control}
              name="title"
              render={({field}) => (
                <FormItem >
                  <FormLabel>Course title</FormLabel>
                  <FormControl>
                    <Input 
                      disabled={isSubmitting}
                      placeholder="e.g. 'Application Web Development'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>What will you teach in this course</FormDescription>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button
                  type="button"
                  variant={"ghost"}
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
