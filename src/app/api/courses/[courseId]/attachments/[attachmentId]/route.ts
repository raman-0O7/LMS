import { auth } from "@/auth";
import { db } from "@/lib/db";

import { NextResponse } from "next/server";

export async function DELETE(
  req : Request,
  { params }: {params: { courseId: string, attachmentId: string}}
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const { courseId, attachmentId} = params;
    
    if(!userId) {
      return new NextResponse("Unauthorized", { status: 401});
    }
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId
      }
    });
    if(!courseOwner) {
      return new NextResponse("Unauthorized", { status:401 });
    }

    const attachment = await db.attachment.delete({
      where: {
        courseId,
        id: attachmentId
      }
    });
    return NextResponse.json(attachment);
  } catch(error) {
    console.log("[ATTACHMENT_ID]", error);
    return new NextResponse("Internal Server error", { status: 500});
  }
}