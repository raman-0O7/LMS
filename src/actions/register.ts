"use server";

import { getUserByEmail } from "@/data/user";
import { RegisterSchema } from "@/schemas";
import * as z from "zod";
import bcryptjs from "bcryptjs";
import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values : z.infer<typeof RegisterSchema>) => {
  const validatedSchema = RegisterSchema.safeParse(values);

  if(!validatedSchema.success) {
    return { error: "Invalid Fields!"}
  }
  const { email, name, password } = validatedSchema.data;
  const user = await getUserByEmail(email);
  if(user) {
    return {
      error : "Email already in use"
    }
  };
  const hashedPassword = await bcryptjs.hash(password, 10);
  const newUser = await db.user.create({
    data : {
      name,
      email,
      password: hashedPassword
    }
  });
  
  const verificationToken = await generateVerificationToken(email);


  await sendVerificationEmail(verificationToken.email, verificationToken.token);
  return { success : "Verification Email sent"}
}