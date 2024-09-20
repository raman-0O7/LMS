"use client";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";

const SearchInput = () => {
  const [ value, setValue ] = useState("");
  const debouncedValue = useDebounce(value);

  const searchParam = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParam.get("categoryId");

  useEffect(() => {
    const url = queryString.stringifyUrl({
      url: pathname,
      query: {
        title: debouncedValue,
        categoryId: currentCategoryId,
      }
    }, { skipEmptyString: true, skipNull: true});

    router.push(url);
  }, [pathname, currentCategoryId, debouncedValue, router]);


  return ( 
      <div className="relative">
          <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600 "/>
          <Input 
            onChange={(e) => setValue(e.target.value)}
            value={value}
            className="w-full md:w-[300px] pl-9 bg-slate-100 focus-visible:ring-slate-200 rounded-full"
            placeholder="Search for a course"
          />
      </div>
   );
}
 
export default SearchInput;