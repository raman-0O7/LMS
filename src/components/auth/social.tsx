"use client";

import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { DEFAULT_REDIRECT_AFTER_LOGIN } from "@/route";
export const Social = () => {

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl : DEFAULT_REDIRECT_AFTER_LOGIN
    }) 
  }
  return (
    <div className="flex items-center w-full justify-center gap-x-2">
      <Button
        variant="outline"
        className="w-full"
        size={"lg"}
        onClick={() => onClick("google")}
      >
        <FcGoogle className="w-5 h-5"/>
      </Button>
      <Button
        variant="outline"
        className="w-full"
        size={"lg"}
        onClick={(() => onClick("github"))}
      >
        <FaGithub className="w-5 h-5"/>
      </Button>
    </div>
  )
}