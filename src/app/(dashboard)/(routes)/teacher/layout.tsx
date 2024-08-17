import { isTeacher } from "@/lib/isTeacher"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

export default async function TeacherLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { userId } = auth();
  if(!userId) return redirect("/");
  
  if(!isTeacher(userId)) {
    return redirect("/");
  }

  return <>{children}</>
}