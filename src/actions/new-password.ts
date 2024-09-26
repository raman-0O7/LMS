"use server";
import { getResetPasswordTokenByToken } from '@/data/reset-password-token';
import { getUserByEmail } from '@/data/user';
import { NewPasswordSchema } from '@/schemas';

import * as z from 'zod';
import bcrypt from "bcryptjs";
import { db } from '@/lib/db';
export const newPassword = async (value: z.infer<typeof NewPasswordSchema>, token?: string | null) => {
  if(!token) {
    return { error: "Token not found!"};
  }

  const validatedFields = NewPasswordSchema.safeParse(value);
  if(!validatedFields.success) {
    return { error : "Invalid fields" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getResetPasswordTokenByToken(token);
  if(!existingToken) {
    return { error : "Invalid Token!" }
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if(hasExpired) {
    return { error: "Token expires, Retry again"};
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if(!existingUser) {
    return { error : "Email does not exist" };
  }

  const hashPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashPassword }
  });

  return { success : "Password change successfull!" }
}