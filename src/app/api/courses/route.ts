import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req : Request
) {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if(!userId) {
      return new NextResponse("Unauthrized User", { status: 403 });
    }

    if(!title) {
      return new NextResponse("Title is required", { status: 400});
    }

    const course = await db.course.create({
      data: {
        userId,
        title
      }
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[Course]", error );
    return new NextResponse("Internal Server error", { status: 500 });
  }
}