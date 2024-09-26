import { auth } from "@/auth";

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
 
const f = createUploadthing();
 
const handleAuth = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  if(!userId) throw new Error("Unauthorized");
  return { userId };
} 

export const ourFileRouter = {
  courseImage : f({ image : { maxFileSize: "4MB",  maxFileCount: 1}}).middleware(()=> handleAuth()).onUploadComplete(() => {}),
  courseAttachment : f(["text", "image", "video", "pdf", "audio"]).middleware(() => handleAuth()).onUploadComplete(()=> {}),
  chapterVideo : f({ video : { maxFileSize: "512GB"}}).middleware(() => handleAuth()).onUploadComplete(() => {})
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;