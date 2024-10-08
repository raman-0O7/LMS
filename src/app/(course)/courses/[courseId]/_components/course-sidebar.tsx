import { db } from "@/lib/db";
import { Chapter, Course, UserProgress } from "@prisma/client"
import { redirect } from "next/navigation";
import { CourseSidebarItem } from "./course-sidebar-item";
import { CourseProgress } from "@/components/course-progress";
import { auth } from "@/auth";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[]
  },
  progressCount: number;
}
export const CourseSidebar = async ({
  course,
  progressCount
}: CourseSidebarProps) => {
  const session = await auth();
  const userId = session?.user?.id;
  if(!userId) {
    return redirect("/");
  }
  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id
      }
    }
  });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-md">
      <div className="border-b px-8 py-[1.73rem] flex flex-col">
        <h1 className="font-semibold">
          {course.title}
        </h1>
        {purchase && (
          <div className="mt-10">
            <CourseProgress 
              variant="success"
              value={progressCount}
            />

          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem 
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isComplete={!!chapter.userProgress?.[0]?.isComplete}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase }
          />
        ))}
      </div>
    </div>
  )
}