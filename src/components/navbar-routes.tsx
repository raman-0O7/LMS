"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { Button } from "./ui/button";

import SearchInput from "./search-input";
import { isTeacher } from "@/lib/isTeacher";

const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.startsWith("/courses");
  const isSearchPage = pathname?.includes("/search");
  if(!userId) {
    return redirect("/");
  }
  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="ml-auto flex gap-x-2">
        {isTeacherPage || isCoursePage ? (
          <Link href={"/"}>
            <Button size="sm" variant={"ghost"}>
              <LogOut className="h-4 w-4 mr-2"/>
              Exit 
            </Button>
          </Link>
        ) : isTeacher(userId) ? (
          <Link href={"/teacher/courses"}>
            <Button size={"sm"} variant={"ghost"}>
              Teacher Mode
            </Button>
          </Link>
        ): null}
        <UserButton />
      </div>
    </>
  );
}

export default NavbarRoutes;