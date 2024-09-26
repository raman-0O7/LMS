import { db } from "@/lib/db";

export const getResetPasswordTokenByToken = async (token : string) => {
  try {
    const passwordResetToken = await db.resetPasswordToken.findUnique({
      where: { token } 
    });
    return passwordResetToken;
  } catch {
    return null;
  }
}
export const getResetPasswordTokenByEmail = async (email : string) => {
  try {
    const passwordResetToken = await db.resetPasswordToken.findFirst({
      where: { email } 
    });
    return passwordResetToken;
  } catch {
    return null;
  }
}