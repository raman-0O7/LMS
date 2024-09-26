import { auth } from "@/auth";
import { db } from "@/lib/db";

import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params : { courseId: string; chapterId: string}}
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if(!userId) {
      return new NextResponse("Unauthorized", { status : 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id : params.courseId,
        userId
      }
    });

    if(!courseOwner) {
      return new NextResponse("Unauthorized", { status : 401 });
    }


    const unpublishedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId : params.courseId
      },
      data: {
        isPublished: false
      }
    });

    const courseChapterIsPublished = await db.chapter.findMany({
      where: {
        courseId : params.courseId,
        isPublished : true
      }
    });

    if(!courseChapterIsPublished.length) {
      await db.course.update({
        where: {
          id: params.courseId
        },
        data : {
          isPublished: false
        }
      })
    }

    return NextResponse.json(unpublishedChapter);
  } catch(error) {
    console.log("[CHAPTER_UNPUBLISH]", error);
    return new NextResponse("Internal error", { status : 500 });
  }
}