import { auth } from "@/auth";
import { db } from "@/lib/db";

import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; }}
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if(!userId) {
      
      return new NextResponse("Unauthorized", { status : 403 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId
      }
    });

    if(!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    const unpublishedCourse = await db.course.update({
      where: {
        id: course.id,
        userId
      },
      data: {
        isPublished: false
      }
    });

    return NextResponse.json(unpublishedCourse);
  } catch(error) {
    console.log("[COURSE_ID_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}