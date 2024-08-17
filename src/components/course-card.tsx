import Image from "next/image";
import Link from "next/link";
import { IconBadge } from "./icon-badge";
import { BookOpen } from "lucide-react";
import { priceFormat } from "@/lib/format";
import { CourseProgress } from "./course-progress";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  progress: number | null;
  category: string;
  chapterLength: number;
}
const CourseCard = ({
  id,
  title,
  price,
  progress,
  category,
  chapterLength,
  imageUrl
}: CourseCardProps) => {
  return ( 
    <Link href={`courses/${id}`}>
      <div className="group hover:shadow-sm p-3 h-full border rounded-lg transition overflow-hidden">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image 
            fill
            className="object-cover"
            alt={title}
            src={imageUrl}
          />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-sm text-muted-foreground">
            {category}
          </p>
          <div className="my-3 flex text-sm md:text-xs items-center gap-x-2">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size={"sm"} icon={BookOpen}/>
              <span>
                {chapterLength} {chapterLength === 1? "Chapter": " Chapters"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <CourseProgress 
              variant={progress === 100 ? "success": "default"}
              size="sm"
              value={progress}
            />
          ): (
            <p className="text-md md:text-sm text-slate-700 font-medium">
              {priceFormat(price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;