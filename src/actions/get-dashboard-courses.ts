import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client"
import { getProgress } from "./get-progress";

type CoursesWithProgressWithCategory = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
}

type DashboardCourse = {
  completedCourses: CoursesWithProgressWithCategory[];
  courseInProgress: CoursesWithProgressWithCategory[];
}
export async function getDashboardCourses(userId: string): Promise<DashboardCourse> {
  try {
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId
      },
      select : {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true
              }
            }
          }
        }
      }
    });

    const courses = purchasedCourses.map(purchase => purchase.course) as CoursesWithProgressWithCategory[];

    for( let course of courses) {
      const progress = await getProgress({ courseId: course.id, userId });
      course["progress"] = progress;
    }

    const completedCourses = courses.filter(course => course.progress === 100);
    const courseInProgress = courses.filter(course => (course.progress ?? 0) < 100);


    return {
      courseInProgress,
      completedCourses
    }
  } catch (error) {
    console.log("[Get_Dashboard_Courses]", error);
    return {
      completedCourses : [],
      courseInProgress : []
    }
  }
}