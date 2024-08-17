import { db } from "@/lib/db"

interface getProgressProps {
  courseId: string;
  userId: string;
}
export const getProgress = async ({
  courseId,
  userId
}: getProgressProps): Promise<number> => {
  try {
    const publishedChapter = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true
      },
      select: {
        id: true
      }
    });
  
    const publishedChaptersIds = publishedChapter.map(chapter => chapter.id);
  
    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId: userId,
        chapterId: {
          in: publishedChaptersIds
        },
        isComplete: true
      }
    });
  
    const progressPercentage = (validCompletedChapters/publishedChaptersIds.length) * 100;
  
    return progressPercentage;
  } catch(error) {
    console.log("[getProgress_Error]", error);
    return 0;
  }
}