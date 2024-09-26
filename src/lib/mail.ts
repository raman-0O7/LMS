import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const nextPublicUrl = process.env.NEXT_PUBLIC_URL;
export const sendResetPasswordTokenEmail = async (email :string , token : string) => {
  const resetLink = `${nextPublicUrl}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href=${resetLink}>here</a> to reset your password</p>`
  })
}

export const sendVerificationEmail = async (email : string, token : string) => {
  const confirmationLink = `${nextPublicUrl}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from : 'onboarding@resend.dev',
    to: email,
    subject: "Confirmation Email",
    html: `<p>Click <a href=${confirmationLink}>here</a> to get verified</p>`
  });
}