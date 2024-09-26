import { auth } from "@/auth";
import { db } from "@/lib/db";

import { NextResponse } from "next/server";

export async function POST(
  req : Request
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
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