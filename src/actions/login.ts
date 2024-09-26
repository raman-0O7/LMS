"use server";

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { DEFAULT_REDIRECT_AFTER_LOGIN } from "@/route";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import * as z from "zod";

export const login = async (values : z.infer<typeof LoginSchema>) => {
  const validatedSchema = LoginSchema.safeParse(values);

  if(!validatedSchema.success) {
    return { error: "Invalid Fields!"}
  }

  const { email, password } = validatedSchema.data;

  const existingUser = await getUserByEmail(email);
  if(!existingUser ||!existingUser?.email || !existingUser.password) {
    return { error : "Email does not exist"}
  }
  if(!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);
    return { success : "Verification email sent"}
  }
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo : DEFAULT_REDIRECT_AFTER_LOGIN
    })
  } catch (error) { 
    if(error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return { error : "Invalid Credentials" }
        }
        default : {
          return { error: "Something went wrong" }
        }
      }
    }
    throw error;
  }
}