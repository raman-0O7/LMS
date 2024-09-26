import { db } from "@/lib/db";
import Categories from "./_components/categories";
import SearchInput from "@/components/search-input";
import { redirect } from "next/navigation";
import { getCourses } from "@/actions/get-courses";
import CourseList from "@/components/course-list";
import { auth } from "@/auth";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  }
}
const SearchPage = async ({
  searchParams
}: SearchPageProps) => {
  const session = await auth();

  const userId = session?.user?.id;
  if(!userId) {
    return redirect("/");
  }


  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  });

  const courses = await getCourses({
    userId,
    ...searchParams
  });


  return (
    <>
      <div className="px-6 pt-6 md:hidden block md:mb-0">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories 
          items={categories}
        />
        <CourseList items={courses}/>
      </div>
    </>
   );
}
 
export default SearchPage;