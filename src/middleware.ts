import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import {
  DEFAULT_REDIRECT_AFTER_LOGIN,
  ApiAuthPrefix,
  PublicRoutes,
  AuthRoutes
} from "@/route"
import { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req : NextRequest) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiRoute = nextUrl.pathname.startsWith(ApiAuthPrefix);
  const isPublicRoute = PublicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = AuthRoutes.includes(nextUrl.pathname);

  if(isApiRoute) {
    console.log("Run"+ nextUrl.pathname);
    if(nextUrl.pathname.startsWith("/api/auth/auth/login?error=OAuthAccountNotLinked")) {
      console.log("Function started");
      return Response.redirect(new URL("/auth/login?error=OAuthAccountNotLinked", nextUrl));
    }
    return null;
  }

  if(isAuthRoute) {
    if(isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_REDIRECT_AFTER_LOGIN, nextUrl));
    }
    return null;
  };

  if(!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  return null;
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}