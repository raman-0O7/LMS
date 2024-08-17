import { Category, Course } from "@prisma/client";
import CourseCard from "./course-card";


type CourseWithCategoryWithProgress = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
}
interface CourseListProps {
  items: CourseWithCategoryWithProgress[]
}

const CourseList = ({
  items
}:CourseListProps) => {
  return ( 
    <div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map(item => (
          <CourseCard 
            key={item.id}
            id={item.id}
            chapterLength={item.chapters.length}
            category={item.category?.name!}
            progress={item.progress}
            title={item.title}
            imageUrl={item.imageUrl!}
            price={item.price!}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-muted-foreground mt-10 text-sm">
          No course found
        </div>
      )} 
    </div>
   );
}
 
export default CourseList;