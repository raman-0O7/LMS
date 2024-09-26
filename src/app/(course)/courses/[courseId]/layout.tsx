
import { getProgress } from '@/actions/get-progress';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react'
import { CourseSidebar } from './_components/course-sidebar';
import { CourseNavbar } from './_components/course-navbar';
import { useCurrentUser } from '@/hooks/use-current-user';
import { auth } from '@/auth';

export default async function CourseIdLayout({
  children,
  params
}: {
  children: React.ReactNode,
  params: {
    courseId: string;
  }
}) {

  const session = await auth();
  const userId = session?.user?.id;
  if(!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId
    },
    include: {
      chapters: {
        where: {
          isPublished: true
        },
        include: {
          userProgress: {
            where: {
              userId
            }
          }
        },
        orderBy: {
          position: "asc"
        }
      }
    }
  });
  if(!course) {
    return redirect("/");
  }

  const progressCount = await getProgress({ courseId: course.id, userId });

  return (
    <div className='h-full'>
      <div className='h-[80px] md:pl-80 fixed inset-y-0 w-full z-50 '>
        <CourseNavbar 
          course={course}
          progressCount={progressCount}
        />
      </div>

      <div className='hidden md:flex flex-col fixed inset-y-0 z-50 h-full w-80 '>
        <CourseSidebar 
          course={course}
          progressCount={progressCount}
        />
      </div>
      <main className='md:pl-80 pt-[80px] h-full'>
        {children}
      </main>
    </div>
  )
}
