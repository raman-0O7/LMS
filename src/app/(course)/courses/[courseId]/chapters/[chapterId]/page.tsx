import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import { CourseProgressButton } from "./_components/course-progress-button";

const ChapterIdPage = async ({
  params
}: {
  params: { courseId: string; chapterId: string; }
}) => {
  const { userId } = auth();
  if(!userId) {
    return redirect("/");
  }
  const { courseId, chapterId } = params;
  const {
    course,
    chapter,
    muxData,
    attachments,
    userProgress,
    nextChapter,
    purchase
  } = await getChapter({ userId, courseId, chapterId });

  if(!course || !chapter) {
    return redirect("/");
  }
  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isComplete;

  return ( 
    <div>
      {userProgress?.isComplete && (
        <Banner 
          variant={"success"}
          label="You already completed this chapter"
        />
      )}
      {isLocked && (
        <Banner 
          variant={"warning"}
          label="You need to purchase this course to watch this chapter."
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-40">
        <div className="p-4">
          <VideoPlayer 
            chapterId={chapterId}
            courseId={courseId}
            nextChapterId={nextChapter?.id}
            title={chapter.title}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
          <div className="flex flex-col md:flex-row items-center p-4 justify-between">
            <h2 className="text-2xl font-semibold mb-2">
              {chapter.title}
            </h2>
            {purchase ? (
              <CourseProgressButton 
                courseId={courseId}
                chapterId={chapterId}
                isComplete={!!userProgress?.isComplete}
                nextChapterId={nextChapter?.id}
              />
            ): (
              <CourseEnrollButton 
                courseId={courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!}/>
          </div>
          {!!attachments.length && (
            <>
              <Separator/>
              <div className="p-4">
                {attachments.map(attachment => (
                  <a 
                    href={attachment.url}
                    key={attachment.id}
                    target="_blank"
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">
                      {attachment.name}
                    </p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
   );
}
 
export default ChapterIdPage;