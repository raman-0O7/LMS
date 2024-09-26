import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToasterProvider } from "@/components/providers/toaster-provider";
import ConfettiProvider from "@/components/providers/confetti-provider";
import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Learniverse",
  description: "Your one stop solution for all your learning needs",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={inter.className}>
          <ConfettiProvider />
          <ToasterProvider />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
