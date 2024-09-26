'use server'
import { getUserByEmail } from '@/data/user';
import { sendResetPasswordTokenEmail } from '@/lib/mail';
import { generateResetPasswordToken } from '@/lib/tokens';
import { ResetSchema } from '@/schemas';
import * as z from 'zod';
export const reset = async (values : z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);
  if(!validatedFields.success) {
    return { error: 'Invalid Email'}
  }
  const { email } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  if(!existingUser) {
    return { error: 'Email not found'}
  }

  const resetPasswordToken = await generateResetPasswordToken(email);
  await sendResetPasswordTokenEmail(resetPasswordToken.email, resetPasswordToken.token);;

  return { success: 'Email sent successfully'}
}