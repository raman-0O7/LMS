import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function TeacherLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  const userId = session?.user?.id;
  if(!userId) return redirect("/");
  
  // if(!isTeacher(userId)) {
  //   return redirect("/");
  // }

  return <>{children}</>
}