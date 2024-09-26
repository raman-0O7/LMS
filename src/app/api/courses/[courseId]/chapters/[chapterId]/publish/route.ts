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

    const chapter = await db.chapter.findUnique({
      where: {
        id : params.chapterId,
        courseId: params.courseId
      }
    });
    const muxdata = await db.muxData.findUnique({
      where: {
        chapterId: params.chapterId
      }
    });
    if(!chapter || !muxdata || !chapter.title || !chapter.description || !chapter.videoUrl) {
      return new NextResponse("Missing required fields", { status : 400 });
    }

    const publishedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId : params.courseId
      },
      data: {
        isPublished: true
      }
    });

    return NextResponse.json(publishedChapter);
  } catch(error) {
    console.log("[CHAPTER_UNPUBLISH]", error);
    return new NextResponse("Internal error", { status : 500 });
  }
}