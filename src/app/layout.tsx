import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import "./globals.css";
import {Providers} from "./providers";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Student Registry",
  description: "A simple student registry application",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
     <html lang="en" suppressHydrationWarning>
       <body className={inter.className}>
        <Providers>
            {children}
          </Providers>
        </body>
     </html>
    </SessionProvider>
  );
}
