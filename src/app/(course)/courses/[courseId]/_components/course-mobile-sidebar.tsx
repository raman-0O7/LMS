import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { Menu } from "lucide-react";
import { CourseSidebar } from "./course-sidebar";

interface CourseMobileSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
      }
    )[]
  };
  progressCount: number;
}

export const CourseMobileSidebar = ({
  course,
  progressCount
}: CourseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden hover:opacity-75 pr-4 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 bg-white w-80">
        <CourseSidebar 
          course={course}
          progressCount={progressCount}
        />
      </SheetContent>
    </Sheet>
  )
}