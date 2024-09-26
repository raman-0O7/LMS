import { auth } from "@/auth";
import { db } from "@/lib/db";

import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params } : { params: { courseId : string}}
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const { courseId } = params;
    const { url } = await req.json();

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

    const attachment = await db.attachment.create({
      data: {
        url,
        name: url.split("/").pop(),
        courseId
      }
    });
    return NextResponse.json(attachment)
  } catch(error) {
    console.log("ATTACHMENT", error)
    return new NextResponse("Internal server error", { status:500 });
  }
}