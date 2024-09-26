import { auth } from "@/auth";
import { db } from "@/lib/db";

import { NextResponse } from "next/server";

export async function POST(
  req : Request,
  { params } : { params: { courseId : string}}
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const { title } = await req.json();

    if(!userId) {
      return new NextResponse("Unauthorized", { status : 401 })
    }

    const courseOwner = await db.course.findFirst({
      where : {
        id : params.courseId,
        userId
      }
    });
    if(!courseOwner) {
      return new NextResponse("Unauthorized", { status : 401 })
    }
    const lastChapter = await db.chapter.findFirst({
      where : {
        courseId : params.courseId,
      },
      orderBy: {
        position: "desc"
      }
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const newChapter = await db.chapter.create({
      data : {
        title,
        courseId: params.courseId,
        position: newPosition
      }
    });

    return NextResponse.json(newChapter);

  } catch(error) {
    console.log("[CHAPTER]", error);
    return new NextResponse("Internal Server Error", { status : 500 });
  }
}