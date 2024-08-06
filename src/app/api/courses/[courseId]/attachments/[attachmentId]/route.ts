import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req : Request,
  { params }: {params: { courseId: string, attachmentId: string}}
) {
  try {
    const { userId } = auth();
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