import { auth } from "@/auth";
import { db } from "@/lib/db";

import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params } : { params : { courseId : string}}
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const { list } = await req.json();

    if(!userId) {
      return new NextResponse("Unauthorized", { status: 401})
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

    for(let item of list) {
      await db.chapter.update({
        where : { id: item.id},
        data : {position : item.position}
      })
    };
    return new NextResponse("Success", {status: 200});
  }catch(error) { 
    console.log("[CHAPTER_REORDER]", error);
    return new NextResponse("Internal Server Error", { status : 500 });
  }
}